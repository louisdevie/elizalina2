import { Formatter } from '@module/backend'
import { DigitsFormatOptions, NumberFormatOptions, NumberNotation } from '@module/format/number'

export class IntlNumberFormatAdapter implements Formatter {
  private _intl: Intl.NumberFormat

  constructor(options: DigitsFormatOptions, extendedOptions: NumberFormatOptions | null) {
    const intlOptions = IntlNumberFormatAdapter.extractIntlOptions(options, extendedOptions)

    try {
      // cast to any to try anyway and handle errors dynamically
      this._intl = new Intl.NumberFormat(options.language, intlOptions as any)
    } catch {
      IntlNumberFormatAdapter.switchToFallbackIntlOptions(intlOptions)
      this._intl = new Intl.NumberFormat(options.language, intlOptions as any)
    }
  }

  private static extractIntlOptions(
    options: DigitsFormatOptions,
    extendedOptions: NumberFormatOptions | null,
  ) {
    return {
      // Locale options
      numberingSystem: extendedOptions?.numberingSystem,

      // Style options
      style: extendedOptions?.style,
      currency: extendedOptions?.currency,
      currencyDisplay: extendedOptions?.currencyDisplay,
      currencySign: extendedOptions?.currencySign,
      unit: extendedOptions?.unit,
      unitDisplay: extendedOptions?.unitDisplay,

      // Digit options
      ...this.extractIntlDigitOptions(options),

      // Other options
      notation: this.notationToIntlNotation(options.notation),
      compactDisplay: this.notationToIntlCompactDisplay(options.notation),
      useGrouping: options.useGrouping,
      signDisplay: extendedOptions?.signDisplay,
    }
  }

  public static extractIntlDigitOptions(options: DigitsFormatOptions) {
    return {
      minimumIntegerDigits: options.minimumIntegerDigits,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits,
      maximumSignificantDigits: options.maximumSignificantDigits,
      roundingMode: options.roundingMode,
    }
  }

  private static switchToFallbackIntlOptions(options: any) {
    // if an option is not supported, it will just get ignored.
    // the 'negative' value is a special case because there are browsers that will recognize the
    // option and throw an error because they don't understand the value.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#browser_compatibility
    if ('signDisplay' in options && options.signDisplay === 'negative') {
      console.warn('[elzii] the "negative" value for the "signDisplay" option is not supported.')
      options.signDisplay = 'auto'
    }
  }

  private static notationToIntlNotation(notation: NumberNotation | undefined): string | undefined {
    let intlNotation
    if (notation == 'longCompact') {
      intlNotation = 'compact'
    } else {
      intlNotation = notation
    }
    return intlNotation
  }

  private static notationToIntlCompactDisplay(
    notation: NumberNotation | undefined,
  ): string | undefined {
    let intlCompactDisplay
    if (notation == 'longCompact') {
      intlCompactDisplay = 'long'
    } else if (notation == 'compact') {
      intlCompactDisplay = 'short'
    } else {
      intlCompactDisplay = undefined
    }
    return intlCompactDisplay
  }

  public applyTo(value: any): string {
    let formatted
    if (typeof value === 'number' || typeof value === 'bigint') {
      formatted = this._intl.format(value)
    } else {
      formatted = value.toString()
    }
    return formatted
  }
}
