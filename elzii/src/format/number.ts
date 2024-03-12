import { AnyFormat, AnyFormatOptions } from '.'

/**
 * How numbers should be rounded. Possible values are :
 * + `ceil` - towards positive infinity
 * + `floor` - towards negative infinity
 * + `expand` - away from zero
 * + `trunc` - towards zero
 *
 * All the following modes round to the nearest number, the difference is how they handle
 * values exactly halfway between two possible numbers :
 * + `halfCeil` - prefers towards positive infinity
 * + `halfFloor` - prefers towards negative infinity
 * + `halfExpand` - prefers away from zero (the default)
 * + `halfTrunc` - prefers towards from zero
 * + `halfEven` - prefers the nearest even digit.
 */
export type RoundingMode =
  | 'ceil'
  | 'floor'
  | 'expand'
  | 'trunc'
  | 'halfCeil'
  | 'halfFloor'
  | 'halfExpand'
  | 'halfTrunc'
  | 'halfEven'

/**
 * The different number notations. Possible values are :
 * + `standard` - basic decimal notation, e.g. "123456"
 * + `scientific` - the number is written with an exponent, e.g. "1.23456E5"
 * + `engineering` - the number is written with an exponent that is a multiple of 3, e.g. "123.456E3"
 * + `compact` - uses a symbol to represent the exponent, e.g. "123K"
 * + `longCompact` - uses a word to represent the exponent, e.g. "123 thousand"
 */
export type NumberNotation = 'standard' | 'scientific' | 'engineering' | 'compact' | 'longCompact'

export interface DigitsFormatOptions extends AnyFormatOptions {
  minimumIntegerDigits?: number
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  maximumSignificantDigits?: number
  roundingMode?: RoundingMode
  useGrouping?: boolean
  notation?: NumberNotation
}

/**
 * Conditions for displaying the sign of numbers. Possible values are :
 * + `always` - the sign if always shown
 * + `exceptZero` - the sign is shown if the number is not zero
 * + `negative` - the sign is shown if the number is negative (the default)
 * + `never` - the sign is never shown
 */
export type SignDisplay = 'always' | 'exceptZero' | 'negative' | 'never'

export type NumberStyle = 'decimal' | 'currency' | 'percent' | 'unit'

/**
 * The different styles for currency display. Possible values are :
 * + `code` - the code of the currency is used
 * + `symbol` - the symbol of the currency is used
 * + `narrowSymbol` - a shorter symbol is used when possible
 * + `name` - the full name of the currency is used
 */
export type CurrencyDisplay = 'code' | 'symbol' | 'narrowSymbol' | 'name'

export type CurrencySign = 'standard' | 'accounting'

export type UnitDisplay = 'short' | 'narrow' | 'long'

export interface NumberFormatOptions extends DigitsFormatOptions {
  type: 'number'

  numberingSystem?: string
  signDisplay?: SignDisplay
  style?: NumberStyle

  currency?: string
  currencyDisplay?: CurrencyDisplay
  currencySign?: CurrencySign

  unit?: string
  unitDisplay?: UnitDisplay
}

export interface DigitsFormat<This> {
  /**
   * Format the number as an integer. If `minDigits` is specified, the number will be padded with
   * zeroes to have at least that number of digits.
   * @param minDigits The minimum number of digits to display.
   */
  integer(minDigits?: number): This

  /**
   * Format the number with a fixed number of fractional digits.
   * @param digits The exact number of digits to display after the radix point.
   */
  fixed(digits: number): This

  /**
   * Format the number with a maximum of `maxDigits` fractional digits.
   * @param maxDigits The maximum number of digits to display after the radix point.
   */
  decimal(maxDigits: number): This

  /**
   * Format the number with `minDigits` to `maxDigits` (both included) fractional digits.
   * @param minDigits The minimum number of digits to display after the radix point.
   * @param maxDigits The maximum number of digits to display after the radix point.
   */
  decimal(minDigits: number, maxDigits: number): This

  /**
   * Format the number with a maximum of `digits` significant digits.
   * @param digits The number of significant digits to display.
   */
  significant(digits: number): This

  /**
   * Specify how to round numbers. See {@link RoundingMode} for more details on the possible values.
   *
   * This option can also be set with the shortcuts of the same name as the modes.
   *
   * @param mode The rounding method to use.
   */
  round(mode: RoundingMode): This

  /**
   * Round numbers towards positive infinity.
   * @see round
   */
  get ceil(): This

  /**
   * Round numbers towards negative infinity.
   * @see round
   */
  get floor(): This

  /**
   * Round numbers away from zero.
   * @see round
   */
  get expand(): This

  /**
   * Round numbers towards zero.
   * @see round
   */
  get trunc(): This

  /**
   * Round numbers towards the nearest increment, or towards positive infinity at the half-increment.
   * @see round
   */
  get halfCeil(): This

  /**
   * Round numbers towards the nearest increment, or towards negative infinity at the half-increment.
   * @see round
   */
  get halfFloor(): This

  /**
   * Round numbers towards the nearest increment, or away from zero infinity at the half-increment.
   * @see round
   */
  get halfExpand(): This

  /**
   * Round numbers towards the nearest increment, or towards zero infinity at the half-increment.
   * @see round
   */
  get halfTrunc(): This

  /**
   * Round numbers towards the nearest increment, or to the nearest even digit at the half-increment.
   * @see round
   */
  get halfEven(): This

  /**
   * Specify whether integers digits should be grouped (displaying one thousand as 1,000 for example).
   *
   * This option can also be set with the shortcuts {@link group} and {@link dontGroup}.
   *
   * @param grouping Enable grouping or not.
   */
  useGrouping(grouping: boolean): This

  /**
   * Enable separating groups of integer digits.
   * @see useGrouping
   */
  get group(): This

  /**
   * Disable separating groups of integer digits.
   * @see useGrouping
   */
  get dontGroup(): This

  /**
   * Specify which notation to use. See {@link NumberNotation} for more details on the possible
   * values.
   *
   * This option can also be set with the shortcuts of the same name as the notations.
   *
   * @param notation The name of the notation to use.
   */
  notation(notation: NumberNotation): This

  /**
   * Use basic decimal notation, e.g. "123456".
   * @see notation
   */
  get standardNotation(): This

  /**
   * Use an exponent to display the number, e.g. "1.23456E5"
   * @see notation
   */
  get scientific(): This

  /**
   * Use an exponent that is a multiple of 3, e.g. "123.456E3"
   * @see notation
   */
  get engineering(): This

  /**
   * Use an exponent represented by a symbol, e.g. "123K"
   * @see notation
   */
  get compact(): This

  /**
   * Uses an exponent represented by a word, e.g. "123 thousand"
   * @see notation
   */
  get longCompact(): This
}

interface BaseNumberFormat<F> extends AnyFormat, DigitsFormat<F> {
  /**
   * Changes the numbering system used.
   * @param name The name of the numbering system, such as "arab", "hans" or "mathsans".
   */
  numberingSystem(name: string): NumberFormat

  /**
   * Specify when to display the sign of the number. See {@link SignDisplay} for  more details on
   * the possible values.
   * @param when The condition for the sign to be shown.
   */
  displaySign(when: SignDisplay): F
}

export interface NumberFormat extends BaseNumberFormat<NumberFormat> {
  /**
   * Switch to currency style.
   * @param code The code of the currency, e.g. "USD" or "EUR".
   */
  currency(code: string): CurrencyNumberFormat

  /**
   * Switch to percent style. For example, the number 0.56 will be displayed as 56%.
   */
  get percent(): PercentNumberFormat

  /**
   * Switch to unit style.
   * @param code The unicode core identifier of the unit to use, e.g. "pound" or "meter".
   */
  unit(code: string): UnitNumberFormat
}

export interface CurrencyNumberFormat extends BaseNumberFormat<CurrencyNumberFormat> {
  /**
   * Set the currency display format. See {@link CurrencyDisplay} for  more details on the possible
   * values.
   *
   * This option can also be set with the shortcuts of the same name as the different values.
   *
   * @param display The style to use.
   */
  currencyDisplay(display: CurrencyDisplay): CurrencyNumberFormat

  /**
   * Display the code of currency, e.g. "USD 100.00".
   * @see currencyDisplay
   */
  get code(): CurrencyNumberFormat

  /**
   * Display a localized symbol of the currency, e.g. "US$100.00".
   * @see currencyDisplay
   */
  get symbol(): CurrencyNumberFormat

  /**
   * Display a shorter symbol of the currency if possible, e.g. "$100.00".
   * @see currencyDisplay
   */
  get narrowSymbol(): CurrencyNumberFormat

  /**
   * Display the name of the currency, e.g. "100.00 US dollars".
   * @see currencyDisplay
   */
  get name(): CurrencyNumberFormat

  /**
   * Set the currency sign mode. See {@link CurrencySign} for  more details on the possible values.
   * values.
   *
   * This option can also be set with the shortcuts of the same name as the different values.
   *
   * @param sign The sign mode to use.
   */
  currencySign(sign: CurrencySign): CurrencyNumberFormat

  /**
   * Use the standard style for displaying the sign of the number, i.e. a minus sign.
   * @see currencySign
   */
  get standardSign(): CurrencyNumberFormat

  /**
   * Use the accounting style for displaying the sign of the number, i.e. wrapping negative numbers
   * in parentheses.
   * @see currencyDisplay
   */
  get accounting(): CurrencyNumberFormat
}

export interface PercentNumberFormat extends BaseNumberFormat<PercentNumberFormat> {}

export interface UnitNumberFormat extends BaseNumberFormat<UnitNumberFormat> {
  /**
   * Set the currency display format. See {@link CurrencyDisplay} for  more details on the possible
   * values.
   *
   * This option can also be set with the shortcuts of the same name as the different values.
   *
   * @param display The style to use.
   */
  unitDisplay(display: UnitDisplay): UnitNumberFormat

  /**
   * Display the unit using its symbol, e.g. "3 L".
   * @see unitDisplay
   */
  get short(): UnitNumberFormat

  /**
   * Display the unit using its symbol and a more compact representation than `short`, e.g. "3L".
   * @see unitDisplay
   */
  get narrow(): UnitNumberFormat

  /**
   * Display the unit using its name, e.g. "3 liters".
   * @see unitDisplay
   */
  get long(): UnitNumberFormat
}
