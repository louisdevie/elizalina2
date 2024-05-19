import { Translation, Visibility } from '@module/model'
import { show } from '@module'
import { Check } from '@module/checks'
import { Humanize } from '@module/show'

/**
 * A report containing information about any missing translations.
 */
export interface MissingTranslationsReport {
  /**
   * A list of all the translation keys.
   */
  readonly allKeys: Iterable<string>

  /**
   * The total number of keys.
   */
  readonly allKeysCount: number

  /**
   * The reference translation used to determine if a key is missing.
   */
  readonly reference: Translation | null

  /**
   * Gets a list of the missing keys for a specific translation.
   * @param id The ID of the translation.
   */
  missingKeysIn(id: string): Iterable<string>

  /**
   * Gets the number of missing keys for a specific translation.
   * @param id The ID of the translation.
   */
  missingKeysCountIn(id: string): number
}

class Report implements MissingTranslationsReport {
  private readonly _allKeys: Set<string>
  private readonly _missingKeys: Map<string, string[]>
  private _reference: Translation | null

  public constructor() {
    this._allKeys = new Set()
    this._missingKeys = new Map()
    this._reference = null
  }

  public get allKeys(): Iterable<string> {
    return this._allKeys
  }

  public get allKeysCount(): number {
    return this._allKeys.size
  }

  public get reference(): Translation | null {
    return this._reference
  }

  public missingKeysIn(id: string): Iterable<string> {
    return this._missingKeys.get(id) ?? []
  }

  public missingKeysCountIn(id: string): number {
    return this._missingKeys.get(id)?.length ?? 0
  }

  public copyAllKeys(): Set<string> {
    return new Set(this._allKeys)
  }

  public isKnown(key: string): boolean {
    return this._allKeys.has(key)
  }

  public foundMissingKey(id: string, key: string): void {
    if (this._missingKeys.has(id)) {
      this._missingKeys.get(id)?.push(key)
    } else {
      this._missingKeys.set(id, [key])
    }
  }

  public addNewKey(key: string): void {
    this._allKeys.add(key)
  }

  public useReference(ref: Translation): Map<string, string[]> {
    this._reference = ref

    const obsolete: Map<string, string[]> = new Map()
    for (const missingInRef of this.missingKeysIn(ref.id)) {
      this._allKeys.delete(missingInRef)
      obsolete.set(missingInRef, [])
    }
    for (const [other, missingInOther] of this._missingKeys) {
      for (const [key, listOfIds] of obsolete) {
        const i = missingInOther.indexOf(key)
        if (i === -1) {
          listOfIds.push(other)
        } else {
          missingInOther.splice(i, 1)
        }
      }
    }

    return obsolete
  }

  public isKeyMissingIn(key: string, id: string): boolean {
    return this._missingKeys.get(id)?.includes(key) ?? false
  }
}

export class MissingTranslationsCheck implements Check<Translation, MissingTranslationsReport> {
  private readonly _report: Report
  private _knownTranslations: string[]
  private _reference?: Translation

  public constructor() {
    this._report = new Report()
    this._knownTranslations = []
  }

  public get isValidGlobally(): boolean {
    if (this._reference !== undefined) {
      const obsolete = this._report.useReference(this._reference)

      for (const [key, obsoleteIn] of obsolete) {
        if (obsoleteIn.length > 0) {
          const obsoleteInFormatted = Humanize.formatListWithEllipsis(
            obsoleteIn.map((loc) => `"${loc}"`),
            'and',
            4,
          )
          show.detailedWarning(
            `Message "${key}" found in ${obsoleteInFormatted} was not present in the reference locale and will be ignored.`,
          )
        }
      }
    }

    for (const key of this._report.allKeys) {
      const missingIn = this._knownTranslations.filter((tr) => this._report.isKeyMissingIn(key, tr))
      if (missingIn.length > 0) {
        const missingInFormatted = Humanize.formatListWithEllipsis(
          missingIn.map((loc) => `"${loc}"`),
          'and',
          4,
        )
        show.detailedWarning(`Message "${key}" was not translated in ${missingInFormatted}`)
      }
    }

    return true // this check raises only warnings
  }

  public validate(value: Translation): boolean {
    const notFound = this._report.copyAllKeys()

    for (const [key, message] of value.messages) {
      if (message.visibility === Visibility.Public) {
        if (this._report.isKnown(key)) {
          notFound.delete(key)
        } else {
          // this message is missing in all previously checked translations
          this._knownTranslations.forEach((tr) => this._report.foundMissingKey(tr, key))
          this._report.addNewKey(key)
        }
      }
    }

    if (value.directives.has('default')) {
      this._reference = value
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
