import platform from './platform'
import { Fmt } from './fmt'
import { Ctx } from './ctx'
import { FormatImpl } from '@module/format/implementations'
import { FormatterFactory } from '@module/backend'
import { IntlFormatterFactory } from '@module/backend/intl'
import { AnyFormat, Format } from './format'

export type LocaleModule<T> = { default: new (fmt: Fmt) => T }

export type LocaleModuleLoader<T> = () => Promise<LocaleModule<T>>

export type StaticLocale<T> = { static: new (fmt: Fmt) => T }

function isStaticLocale<T extends object>(
  messages: LocaleModuleLoader<T> | StaticLocale<T> | T,
): messages is StaticLocale<T> {
  return 'static' in messages && typeof messages.static === 'function'
}

export interface ElzLocaleOptions<T> {
  id: string
  messages: LocaleModuleLoader<T> | StaticLocale<T> | T
  fallbackFor?: string[]
}

class ElzLocale<T extends object> {
  private readonly _id: string
  private readonly _language: string | undefined
  private readonly _messages: LocaleModuleLoader<T> | StaticLocale<T> | T
  private readonly _fallbackFor: string[]
  private _instance?: T
  private _fmt?: Fmt

  public constructor(options: ElzLocaleOptions<T>) {
    this._id = options.id
    this._language = ElzLocale.tryParseLocaleLanguage(options.id)
    this._messages = options.messages
    this._fallbackFor = options.fallbackFor ?? []
  }

  private static tryParseLocaleLanguage(id: string): string | undefined {
    let locale
    try {
      locale = new Intl.Locale(id).language
    } catch {
      locale = undefined
    }
    return locale
  }

  public get id(): string {
    return this._id
  }

  public get instance(): T | undefined {
    return this._instance
  }

  public get fmt(): Fmt | undefined {
    return this._fmt
  }

  public isExactly(id: string): boolean {
    return this._id === id
  }

  public isExplicitFallbackFor(id: string): boolean {
    return this._fallbackFor.includes(id)
  }

  public isImplicitFallbackFor(id: string): boolean {
    const language = ElzLocale.tryParseLocaleLanguage(id)
    return (
      language !== undefined &&
      (this._language === language ||
        this._id.startsWith(language) ||
        this._fallbackFor.some((id) => id.startsWith(language)))
    )
  }

  public async load(factory: FormatterFactory, context: Ctx): Promise<void> {
    this._fmt = new Fmt(new FormatImpl(this._id), factory, context)
    let newInstance: T

    if (typeof this._messages === 'function') {
      const module = await this._messages()
      newInstance = new module.default(this._fmt)
    } else if (isStaticLocale(this._messages)) {
      newInstance = new this._messages.static(this._fmt)
    } else {
      newInstance = this._messages
    }

    this._instance = newInstance
  }

  public staticLoad(factory: FormatterFactory, context: Ctx): void {
    this._fmt = new Fmt(new FormatImpl(this._id), factory, context)
    let newInstance: T

    if (typeof this._messages === 'function') {
      context.fail(`Cannot load ${this._id} statically`)
    } else if (isStaticLocale(this._messages)) {
      newInstance = new this._messages.static(this._fmt)
    } else {
      newInstance = this._messages
    }

    this._instance = newInstance
  }

  public unload() {
    this._fmt = undefined
    this._instance = undefined
  }
}

class ElzProxyHandler<T extends object> implements ProxyHandler<Elz<T>> {
  get(target: Elz<T>, p: string | symbol): any {
    let message = undefined
    if (target.currentLocale !== undefined) {
      message = Reflect.get(target.currentLocale, p)
    }
    return message
  }
}

export interface ElzOptions<T> {
  locales: ElzLocaleOptions<T>[]
  default?: string
  main?: string
}

export class Elz<T extends object> {
  private readonly _main?: string
  private readonly _default?: string
  private readonly _locales: ElzLocale<T>[]

  private readonly _factory: FormatterFactory
  private readonly _context: Ctx

  private _currentLocale?: ElzLocale<T>

  public constructor(options: ElzOptions<T>) {
    this._main = options.main
    this._default = options.default
    this._locales = options.locales.map((opts) => new ElzLocale(opts))

    this._factory = new IntlFormatterFactory()
    this._context = new Ctx()
  }

  private findExactLocale(searched: string): ElzLocale<T> | undefined {
    for (const candidate of this._locales) {
      if (candidate.isExactly(searched)) {
        return candidate
      }
    }
  }

  private findExplicitFallbackLocale(searched: string): ElzLocale<T> | undefined {
    for (const candidate of this._locales) {
      if (candidate.isExplicitFallbackFor(searched)) {
        return candidate
      }
    }
  }

  private findImplicitFallbackLocale(searched: string): ElzLocale<T> | undefined {
    for (const candidate of this._locales) {
      if (candidate.isImplicitFallbackFor(searched)) {
        return candidate
      }
    }
  }

  private async changeLocaleTo(locales: string[]) {
    const newLocale = this.resolveLocale(locales)
    await newLocale.load(this._factory, this._context)

    this._currentLocale?.unload()
    this._currentLocale = newLocale
  }

  private changeLocaleToStatic(locales: string[]) {
    const newLocale = this.resolveLocale(locales)
    newLocale.staticLoad(this._factory, this._context)

    this._currentLocale?.unload()
    this._currentLocale = newLocale
  }

  private resolveLocale(locales: string[]): ElzLocale<T> {
    let chosen

    // the resolution tries to find a matching locale by progressively trying broader selection
    // methods as long as `chosen` is undefined.

    // 1. if there is no locale specified, try to use the main one
    if (locales.length === 0 && this._main !== undefined) {
      chosen = this.findExactLocale(this._main)
    }

    // 2. try to find exact matches or explicit fallbacks in the order preferred by the user
    for (const userLocale of locales) {
      if (chosen === undefined) {
        chosen = this.findExactLocale(userLocale)
      }

      if (chosen === undefined) {
        chosen = this.findExplicitFallbackLocale(userLocale)
      }
    }

    // 3. try to find implicit fallbacks in the order preferred by the user
    for (const userLocale of locales) {
      if (chosen === undefined) {
        chosen = this.findImplicitFallbackLocale(userLocale)
      }
    }

    // 4. try to use the global fallback if there is one
    if (chosen === undefined && this._default !== undefined) {
      chosen = this.findExactLocale(this._default)
    }

    // 5. try to use the main locale if there is one
    if (chosen === undefined && this._main !== undefined) {
      chosen = this.findExactLocale(this._main)
    }

    // 6. give up
    if (chosen === undefined) {
      this._context.fail('could not find any suitable locale. consider adding a global fallback.')
    }

    return chosen
  }

  public async useEnvironmentLocale() {
    await this.changeLocaleTo(platform.getEnvironmentLocales())
  }

  public async useLocale(locale: string) {
    await this.changeLocaleTo([locale])
  }

  public async useMainLocale(): Promise<void> {
    if (this._main === undefined) this._context.fail('there is no main locale configured.')
    await this.changeLocaleTo([this._main])
  }

  public useStaticMainLocale(): void {
    if (this._main === undefined) this._context.fail('there is no main locale configured.')
    this.changeLocaleToStatic([this._main])
  }

  public async useDefaultLocale(): Promise<void> {
    if (this._default === undefined) this._context.fail('there is no default locale configured.')
    await this.changeLocaleTo([this._default])
  }

  public useStaticDefaultLocale(): void {
    if (this._default === undefined) this._context.fail('there is no default locale configured.')
    this.changeLocaleToStatic([this._default])
  }

  public async requireLocale() {
    if (this._currentLocale === undefined) {
      await this.useEnvironmentLocale()
    }
  }

  public get currentLocaleId(): string | undefined {
    return this._currentLocale?.id
  }

  public get currentLocale(): T | undefined {
    return this._currentLocale?.instance
  }

  public async format(value: any, config: (f: Format) => AnyFormat): Promise<string> {
    await this.requireLocale()
    return this._currentLocale?.fmt?.format(value, config) ?? '' // just in case
  }

  public enableStrictMode(): void {
    this._context.enableStrictMode()
  }

  public disableStrictMode(): void {
    this._context.disableStrictMode()
  }

  public makeLocaleProxy(): T {
    return new Proxy(this, new ElzProxyHandler<T>()) as unknown as T
  }
}
