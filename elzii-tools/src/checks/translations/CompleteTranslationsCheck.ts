import { Translation } from '@module/translations'
import { show } from '@module'
import ChainableCheck from '../ChainableCheck'

export default class CompleteTranslationsCheck extends ChainableCheck<Translation> {
  private _knownKeys: Set<string>
  private _knownTranslations: string[]

  public constructor() {
    super()

    this._knownKeys = new Set()
    this._knownTranslations = []
  }

  public override doValidate(value: Translation): boolean {
    const notFound = new Set(this._knownKeys)

    for (const key of value.messages.keys()) {
      if (this._knownKeys.has(key)) {
        notFound.delete(key)
      } else {
        // this message is missing in all previously checked translations
        this._knownTranslations.forEach((tr) =>
          show.detailedWarning(`Message "${key}" was not translated in "${tr}"`),
        )
        this._knownKeys.add(key)
      }
    }

    // message missing in the current translation
    notFound.forEach((key) =>
      show.detailedWarning(`Message "${key}" was not translated in "${value.id}"`),
    )

    this._knownTranslations.push(value.id)

    return true // this check raises only warnings
  }
}
