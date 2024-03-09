import { NumberFormat, NumberFormatOptions } from './number'
import { ListFormat, ListFormatOptions } from './list'
import { DatetimeFormat, DatetimeFormatOptions } from './datetime'
import { PluralFormat, PluralFormatOptions } from './plural'

export interface AnyFormatOptions {
  language: string
  type: string
}

export type FormatOptions =
  | NumberFormatOptions
  | ListFormatOptions
  | DatetimeFormatOptions
  | PluralFormatOptions


export interface AnyFormat {
  toOptions(): FormatOptions
}

export interface Format {
  /**
   * Formats a number.
   */
  get number(): NumberFormat

  /**
   * Formats a list of items.
   */
  get list(): ListFormat

  /**
   * Formats a date and/or time.
   */
  get datetime(): DatetimeFormat

  /**
   * Selects a string based on the value of a number. Any hash sign in the strings '#' will be
   * replaced by the formatted number. To use literal hash signs in the strings, you can escape them
   * with a backslash like '\\#'.
   *
   * @example To display a number of cats in English :
   * ```
   * plural.one('# cat').other('# cats')
   * ```
   * will create the following messages
   * ```
   * 0 → 0 cats
   * 1 → 1 cat
   * 3 → 3 cats
   * ...
   * ```
   */
  get plural(): PluralFormat
}
