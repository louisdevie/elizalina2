import { AnyFormat, AnyFormatOptions, FormatOptions } from '.'
import { NumberFormat } from './number'

/**
 * The different types of lists. Possible values are :
 * + `conjunction` - group items with an "and", e.g. "A, B and C"
 * + `disjunction` - group items with an "or", e.g. "A, B or C"
 * + `unit` - group items without any specific meaning, e.g. "A, B, C"
 */
export type ListType = 'conjunction' | 'disjunction' | 'unit'

/**
 * The different styles of lists. Possible values are :
 * + `long` - uses junction words, e.g. "A, B and C"
 * + `short` - does not use junction words if implicit in the locale, e.g. "A, B, C"
 * + `narrow` - does not use junction words or punctuation, e.g. "A B C"
 */
export type ListStyle = 'long' | 'short' | 'narrow'

export interface ListFormatOptions extends AnyFormatOptions {
  type: 'list'

  listType?: ListType
  style?: ListStyle
  itemFormat?: FormatOptions
}

export interface ListFormat extends AnyFormat {
  /**
   * Specify the type of the list. See {@link ListType} for more details on the possible values.
   *
   * This option can also be set with the shortcuts of the same name as the different values.
   *
   * @param type The type of list to display.
   */
  listType(type: ListType): ListFormat

  /**
   * Display the list as a conjunction.
   * @see listType
   */
  get conjunction(): ListFormat

  /**
   * Display the list as a disjunction.
   * @see listType
   */
  get disjunction(): ListFormat

  /**
   * Display the list as a plain enumeration.
   * @see listType
   */
  get unit(): ListFormat

  /**
   * Specify the style of the list. See {@link ListStyle} for more details on the possible values.
   *
   * This option can also be set with the shortcuts of the same name as the different values.
   *
   * @param style The style of list to use.
   */
  listStyle(style: ListStyle): ListFormat

  /**
   * Use punctuation and junction words.
   * @see listStyle
   */
  get long(): ListFormat

  /**
   * Don't use junction words if implicit.
   * @see listStyle
   */
  get short(): ListFormat

  /**
   * Don't use punctuation nor junction words.
   * @see listStyle
   */
  get narrow(): ListFormat

  /**
   * Formats the items of the list as numbers. See {@link NumberFormat} for more information on the
   * available options.
   * @param config A function that configures a number format.
   *
   * @example To print a list of numbers as percentages with one fractional digit :
   * ```
   * .numberItems(f => f.percent.fixed(1))
   * ```
   */
  numberItems(config?: (f: NumberFormat) => NumberFormat): ListFormat
}
