import { PluralFormatOptions } from '@module/format'
import { IntlNumberFormatAdapter } from './number'
import { Formatter } from '@module/backend'
import { formatPluralForm } from '@module/pluralFormat'

interface PluralForms {
  zero: string | undefined
  one: string | undefined
  two: string | undefined
  few: string | undefined
  many: string | undefined
  other: string | undefined
}

export class IntlPluralRulesAdapter implements Formatter {
  private _intl: Intl.PluralRules
  private _numberFormatter: Formatter
  private _forms: PluralForms

  public constructor(options: PluralFormatOptions) {
    const intlOptions = IntlPluralRulesAdapter.extractIntlOptions(options)

    // if a browser doesn't support some of the options, it will just ignore them
    this._intl = new Intl.PluralRules(options.language, intlOptions)
    this._numberFormatter = new IntlNumberFormatAdapter(options, null)
    this._forms = {
      zero: options.zeroForm,
      one: options.oneForm,
      two: options.twoForm,
      few: options.fewForm,
      many: options.manyForm,
      other: options.manyForm,
    }
  }

  private static extractIntlOptions(options: PluralFormatOptions) {
    return {
      // Plural options
      type: options.pluralType,

      // Digit options
      ...IntlNumberFormatAdapter.extractIntlDigitOptions(options),
    }
  }

  public applyTo(value: any): string {
    let numberValue
    if (typeof value === 'number') {
      numberValue = value
    } else {
      let parsed = Number.parseFloat(value)
      if (Number.isNaN(parsed)) {
        console.warn(`[elzii] ${value} is not a number and cannot be used for pluralization.`)
        numberValue = 1
      } else {
        numberValue = parsed
      }
    }

    // here we use 'value' because 'numberValue' might not reflect correctly the original value
    let formattedValue = this._numberFormatter.applyTo(value)

    let selectedForm = this.selectFormFor(numberValue)

    return formatPluralForm(selectedForm, formattedValue)
  }

  private selectFormFor(value: number): string {
    let selected: string
    switch (this._intl.select(value)) {
      case 'zero':
        selected = this._forms.zero ?? this._forms.other ?? ''
        break
      case 'one':
        selected = this._forms.one ?? this._forms.other ?? ''
        break
      case 'two':
        selected = this._forms.two ?? this._forms.other ?? ''
        break
      case 'few':
        selected = this._forms.few ?? this._forms.other ?? ''
        break
      case 'many':
        selected = this._forms.many ?? this._forms.other ?? ''
        break
      case 'other':
        selected = this._forms.other ?? ''
        break
    }
    return selected
  }
}
