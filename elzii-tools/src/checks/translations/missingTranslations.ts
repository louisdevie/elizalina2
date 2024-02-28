import { Translation } from '@module/translations'
import { show } from '@module'
import { Check } from '@module/checks'

/**
 * A report containing information about any missing translations.
 */
export interface MissingTranslationsReport {
  /**
   * A list of all the translation keys.
   */
  readonly allKeys: Iterable<string>

  /**
   * Gets a list of the missing keys for a specific translation.
   * @param id The ID of the translation.
   */
  missingKeysIn(id: string): Iterable<string>
}

class Report implements MissingTranslationsReport {
  private readonly _allKeys: Set<string>
  private readonly _missingKeys: Map<string, string[]>

  public constructor() {
    this._allKeys = new Set()
    this._missingKeys = new Map()
  }

  public get allKeys(): Iterable<string> {
    return this._allKeys
  }

  public missingKeysIn(id: string): Iterable<string> {
    return this._missingKeys.get(id) ?? []
  }

  public copyAllKeys(): Set<string> {
    return new Set(this._allKeys)
  }

  public isKnown(key: string): boolean {
    return this._allKeys.has(key)
  }

  public foundMissingKey(id: string, key: string) {
    show.detailedWarning(`Message "${key}" was not translated in "${id}"`)

    if (this._missingKeys.has(id)) {
      this._missingKeys.get(id)?.push(key)
    } else {
      this._missingKeys.set(id, [key])
    }
  }

  public addNewKey(key: string) {
    this._allKeys.add(key)
  }
}

export class MissingTranslationsCheck implements Check<Translation, MissingTranslationsReport> {
  private readonly _report: Report
  private _knownTranslations: string[]

  public constructor() {
    this._report = new Report()
    this._knownTranslations = []
  }

  public get isValidGlobally(): boolean {
    return true
  }

  public validate(value: Translation): boolean {
    const notFound = this._report.copyAllKeys()

    for (const key of value.messages.keys()) {
      if (this._report.isKnown(key)) {
        notFound.delete(key)
      } else {
        // this message is missing in all previously checked translations
        this._knownTranslations.forEach((tr) => this._report.foundMissingKey(tr, key))
        this._report.addNewKey(key)
      }
    }

    // messages missing in the current translation
    notFound.forEach((key) => this._report.foundMissingKey(value.id, key))

    this._knownTranslations.push(value.id)

    return true // this check raises only warnings
  }

  public getReport(): MissingTranslationsReport {
    return this._report
  }
}
