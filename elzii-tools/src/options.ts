import { handleErrors, throwError } from './error'
import { show } from '.'
import type { Debug } from './show'
import type {
  NormalizedOutputConfig,
  OutputConfig,
  StaticConfig,
  TargetConfig,
  TargetsConfig,
} from '@module/config'

export type Options = TargetOptions | Record<string, TargetOptions>

export interface TargetOptions {
  /**
   * The directory containing translation files.
   */
  translations: string

  /**
   * The different files to generate.
   */
  output: OutputOptions

  /**
   * The name to use for the interface listing the translations (for ts/dts output only, the default is `Locale`)
   */
  interfaceName?: string

  /**
   * The name of the elizalina object used to load translations (the default is `elz`)
   */
  proxyName?: string

  /**
   * If set to `true`, all translations will be compiled in a single file
   */
  singleFile?: boolean

  /**
   * If set to `true`, emitted JavaScript will be minified.
   */
  minify?: boolean

  /**
   * If set to `true`, source maps will be generated along JavaScript/TypeScript files.
   */
  sourcemap?: boolean

  /**
   * Controls static loading of the main and default locales.
   * - `'none'` or `false`: disabled (the default)
   * - `'default'`: enabled only for the default locale
   * - `'main'`: enabled only for the main locale
   * - `'both'` or `true`: enabled for both
   */
  static?: boolean | 'none' | 'default' | 'main' | 'both'
}

export type OutputOptions =
  | {
      /**
       * The directory where JavaScript files will be generated.
       */
      js: string

      /**
       * Enable .d.ts file generation. You can also specify a directory different from the javascript output
       * (the default is `false`)
       */
      dts?: boolean | string
    }
  | {
      /**
       * The directory where TypeScript files will be generated.
       */
      ts: string
    }

export class TargetsConfigBuilder implements TargetsConfig, Debug {
  private readonly _targets: Record<string, TargetConfigBuilder>

  public constructor() {
    this._targets = {}
  }

  private static isSingleTarget(options: object): boolean {
    return (
      typeof options === 'object' &&
      options !== null &&
      'translations' in options &&
      typeof options.translations === 'string' &&
      'output' in options &&
      typeof options.output === 'object'
    )
  }

  public getTarget(name: string): TargetConfigBuilder {
    return this._targets[name]
  }

  public get allTargets(): string[] {
    return Object.keys(this._targets)
  }

  public get areValid(): boolean {
    let allValid = true
    for (const key in this._targets) {
      allValid = this._targets[key].isValid(key)
      if (!allValid) break
    }
    return allValid
  }

  private mergeSingleTarget(
    name: string,
    targetOptions: TargetOptions,
    shouldOverride: boolean,
    warningDetails: string,
  ): void {
    if (!(name in this._targets)) {
      this._targets[name] = new TargetConfigBuilder()
    }
    this._targets[name].merge(targetOptions, shouldOverride, `target "${name}", ${warningDetails}`)
  }

  public merge(options: Options, shouldOverride: boolean, warningDetails: string): void {
    if (TargetsConfigBuilder.isSingleTarget(options)) {
      const singleTarget = options as TargetOptions
      this.mergeSingleTarget('default', singleTarget, shouldOverride, warningDetails)
    } else {
      const multipleTargets = options as Record<string, TargetOptions>
      for (const key in multipleTargets) {
        // check each target object, you never know...
        if (TargetsConfigBuilder.isSingleTarget(multipleTargets[key])) {
          this.mergeSingleTarget(key, multipleTargets[key], shouldOverride, warningDetails)
        }
      }
    }
  }

  public debug(): string[] {
    const debugOutput = []

    for (const targetName in this._targets) {
      debugOutput.push(` - ${targetName}:`, ...this.getTarget(targetName).debug())
    }

    if (debugOutput.length == 0) {
      debugOutput.push('   (no targets found)')
    }

    return debugOutput
  }
}

export class TargetConfigBuilder implements TargetConfig, Debug {
  private _translations?: string
  private _output?: OutputConfigBuilder
  private _interfaceName?: string
  private _proxyName?: string
  private _singleFile?: boolean
  private _minify?: boolean
  private _sourcemap?: boolean
  private _static?: StaticConfigBuilder

  public isValid(thisName: string): boolean {
    let valid = true

    if (this._translations === undefined) {
      show.detailedError(`The 'translations' key is missing in the '${thisName}' target.`)
      valid = false
    }

    if (this._output === undefined) {
      show.detailedError(`The 'output' key is missing in the '${thisName}' target.`)
      valid = false
    }

    return valid
  }

  public get translations(): string {
    return this._translations ?? throwError('The "translations" option is missing', 'config')
  }

  public get output(): OutputConfigBuilder {
    return this._output ?? throwError('The "output" option is missing', 'config')
  }

  public get interfaceName(): string {
    return this._interfaceName ?? 'Locale'
  }

  public get proxyName(): string {
    return this._proxyName ?? '__'
  }

  public get singleFile(): boolean {
    return this._singleFile ?? false
  }

  public get minify(): boolean {
    return this._minify ?? false
  }

  public get sourcemap(): boolean {
    return this._sourcemap ?? false
  }

  public get static(): StaticConfigBuilder {
    return this._static ?? new StaticConfigBuilder(undefined)
  }

  public merge(options: TargetOptions, shouldOverride: boolean, warningDetails: string): void {
    if (!shouldOverride && this._translations !== undefined)
      show.detailedWarning('The "translations" option was overwritten', warningDetails)
    this._translations = options.translations

    if (!shouldOverride && this._output !== undefined)
      show.detailedWarning('The "output" option was overwritten', warningDetails)
    this._output = new OutputConfigBuilder(options.output)

    if (options.interfaceName !== undefined) {
      if (!shouldOverride && this._interfaceName !== undefined)
        show.detailedWarning('The "interfaceName" option was overwritten', warningDetails)
      this._interfaceName = options.interfaceName
    }

    if (options.proxyName !== undefined) {
      if (!shouldOverride && this._proxyName !== undefined)
        show.detailedWarning('The "proxyName" option was overwritten', warningDetails)
      this._proxyName = options.proxyName
    }

    if (options.singleFile !== undefined) {
      if (!shouldOverride && this._singleFile !== undefined)
        show.detailedWarning('The "singleFile" option was overwritten', warningDetails)
      this._singleFile = options.singleFile
    }

    if (options.minify !== undefined) {
      if (!shouldOverride && this._minify !== undefined)
        show.detailedWarning('The "minify" option was overwritten', warningDetails)
      this._minify = options.minify
    }

    if (options.sourcemap !== undefined) {
      if (!shouldOverride && this._sourcemap !== undefined)
        show.detailedWarning('The "sourcemap" option was overwritten', warningDetails)
      this._sourcemap = options.sourcemap
    }

    if (options.static !== undefined) {
      if (!shouldOverride && this._static !== undefined)
        show.detailedWarning('The "static" option was overwritten', warningDetails)
      this._static = new StaticConfigBuilder(options.static)
    }
  }

  private debugJsonify(getter: () => unknown): string {
    return handleErrors(() => JSON.stringify(getter()), { all: (err) => `<${err}>` })
  }

  public debug(): string[] {
    const debugOutput = []

    debugOutput.push(`     translations: ${this.debugJsonify(() => this.translations)}`)

    debugOutput.push(
      '     output:',
      ...handleErrors(() => this.output.debug(), { all: (err) => [`       <${err}>`] }),
    )

    debugOutput.push(`     interfaceName: ${this.debugJsonify(() => this.interfaceName)}`)
    debugOutput.push(`     objectName: ${this.debugJsonify(() => this.proxyName)}`)
    debugOutput.push(`     singleFile: ${this.debugJsonify(() => this.singleFile)}`)
    debugOutput.push(`     minify: ${this.debugJsonify(() => this.minify)}`)
    debugOutput.push(`     sourcemap: ${this.debugJsonify(() => this.sourcemap)}`)

    debugOutput.push(
      '     static:',
      ...handleErrors(() => this.static.debug(), { all: (err) => [`       <${err}>`] }),
    )

    return debugOutput
  }
}

class StaticConfigBuilder implements StaticConfig, Debug {
  private readonly _main: boolean
  private readonly _default: boolean

  public constructor(option: boolean | 'none' | 'main' | 'default' | 'both' | undefined) {
    switch (option) {
      case undefined:
      case false:
      case 'none':
        this._main = false
        this._default = false
        break

      case 'main':
        this._main = true
        this._default = false
        break

      case 'default':
        this._main = false
        this._default = true
        break

      case true:
      case 'both':
        this._main = true
        this._default = true
        break
    }
  }

  public get main(): boolean {
    return this._main
  }

  public get default(): boolean {
    return this._default
  }

  public debug(): string[] {
    const properties: ['main', 'default'] = ['main', 'default']
    return properties.map((type) => {
      return `       ${type}: ` + (this[type] ? 'enabled' : 'disabled')
    })
  }
}

function disabled(): NormalizedOutputConfig {
  return { enabled: false }
}

function enabled(directory: string): NormalizedOutputConfig {
  return { enabled: true, directory }
}

export class OutputConfigBuilder implements OutputConfig, Debug {
  private readonly _js: NormalizedOutputConfig
  private readonly _dts: NormalizedOutputConfig
  private readonly _ts: NormalizedOutputConfig

  public constructor(options: OutputOptions) {
    if ('js' in options) {
      // javascript output
      const dts = options.dts ?? false
      this._js = enabled(options.js)
      // default to same directory if just "true"
      this._dts = dts === false ? disabled() : enabled(typeof dts === 'string' ? dts : options.js)
      this._ts = disabled()
    } else {
      // typescript output
      this._js = disabled()
      this._dts = disabled()
      this._ts = enabled(options.ts)
    }
  }

  public get js(): NormalizedOutputConfig {
    return this._js
  }

  public get dts(): NormalizedOutputConfig {
    return this._dts
  }

  public get ts(): NormalizedOutputConfig {
    return this._ts
  }

  public debug(): string[] {
    const properties: ['js', 'dts', 'ts'] = ['js', 'dts', 'ts']
    return properties.map((type) => {
      const normalizedConfig = this[type]
      return (
        `       ${type}: ` +
        (normalizedConfig.enabled ?
          `enabled (directory: ${JSON.stringify(normalizedConfig.directory)})`
        : 'disabled')
      )
    })
  }
}
