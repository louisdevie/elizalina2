import { AnyFormat, AnyFormatOptions } from '.'

/**
 * The available hour cycles are :
 * + `12hours` - the preferred 12-hour cycle, equivalent to `h11` or `h12` depending on the locale
 * + `24hours` - the preferred 24-hour cycle, equivalent to `h23` or `h24` depending on the locale
 * + `h11` - 12-hour cycle, with midnight and noon displayed as 0 hours
 * + `h12` - 12-hour cycle, with midnight and noon displayed as 12 hours
 * + `h23` - 24-hour cycle, with midnight displayed as 0 hours
 * + `h24` - 24-hour cycle, with midnight displayed as 24 hours
 */
export type HourCycle = '12hours' | '24hours' | 'h11' | 'h12' | 'h23' | 'h24'

/**
 * Styles for date component that can be written as words. Possible value are :
 * + `long` - uses the full words, e.g. "January"
 * + `short` - use an abbreviation, e.g. "Jan". It is the default unless otherwise noted
 * + `narrow` - use a single letter, e.g. "J"
 */
export type WordComponentStyle = 'long' | 'short' | 'narrow'

/**
 * Styles for date and time component that can be written as numbers. Possible values are :
 * + `numeric` - the default format for the locale, for example a day will be written "4" in English
 *               and "04" in French. It is the default unless otherwise noted
 * + `2-digit` - force the use of two digits, for example days will always be written as "04"
 */
export type NumericComponentStyle = 'numeric' | '2-digit'

/**
 * Styles for displaying time zones. Possible values are :
 * + `long` - a long localized form, e.g. "Pacific Standard Time"
 * + `short` - a short localized form, e.g. "PST"
 * + `longOffset` - a long localized offset from GMT, e.g. "GMT-08:00"
 * + `shortOffset` - a short localized offset from GMT, e.g. "GMT-8". It is the default unless
 *   otherwise noted
 * + `longGeneric` - a long generic name, e.g. "Pacific Time"
 * + `shortGeneric` - a short generic name, e.g. "PT"
 */
export type TimeZoneStyle =
  | 'long'
  | 'short'
  | 'longOffset'
  | 'shortOffset'
  | 'longGeneric'
  | 'shortGeneric'

/**
 * Styles for shortcuts grouping multiple components. Possible value are :
 * + `full` - all the components are shown in their detailed form
 * + `long` - most of the components are shown in their detailed form
 * + `medium` - most of the components are shown in a shorter form. It is the default unless
 *   otherwise noted
 * + `short` - most of the component are shown in the shortest form possible, without using words.
 */
export type ShortcutStyle = 'full' | 'long' | 'medium' | 'short'

export interface DatetimeFormatOptions extends AnyFormatOptions {
  type: 'datetime'

  calendar?: string
  numberingSystem?: string

  hourCycle?: HourCycle
  timeZone?: string

  era?: WordComponentStyle
  year?: NumericComponentStyle
  month?: NumericComponentStyle | WordComponentStyle
  day?: NumericComponentStyle
  weekday?: WordComponentStyle
  dayPeriod?: WordComponentStyle
  hour?: NumericComponentStyle
  minute?: NumericComponentStyle
  second?: NumericComponentStyle
  fractionalSeconds?: number
  timeZoneName?: TimeZoneStyle
}

export interface DatetimeFormat extends AnyFormat {
  /**
   * The code of the calendar to use, such as "gregory" or "chinese".
   * @param code The calendar to use.
   */
  calendar(code: string): DatetimeFormat

  /**
   * Changes the numbering system used.
   * @param name The name of the numbering system, such as "arab", "hans" or "mathsans".
   */
  numberingSystem(name: string): DatetimeFormat

  /**
   * Specify the hour cycle to use. See {@link HourCycle} for more details on the possible values.
   *
   * This option can also be set with the shortcuts of the same name as the different values
   * (`12hours` and `24hours` are not valid identifiers, so they are named `_12h` and `_24h`
   * instead).
   *
   * @param cycle
   */
  hourCycle(cycle: HourCycle): DatetimeFormat

  /**
   * Use the preferred 12-hour cycle, equivalent to `h11` or `h12` depending on the locale.
   */
  get _12h(): DatetimeFormat

  /**
   * Use the preferred 24-hour cycle, equivalent to `h23` or `h24` depending on the locale.
   */
  get _24h(): DatetimeFormat

  /**
   * Use a 12-hour cycle, with midnight and noon displayed as 0 hours.
   */
  get h11(): DatetimeFormat

  /**
   * Use a 12-hour cycle, with midnight and noon displayed as 12 hours.
   */
  get h12(): DatetimeFormat

  /**
   * Use a 24-hour cycle, with midnight displayed as 0 hours.
   */
  get h23(): DatetimeFormat

  /**
   * Use a 24-hour cycle, with midnight displayed as 24 hours.
   */
  get h24(): DatetimeFormat

  /**
   * Changes the time zone the time is display from. Is this is not specified, the time zone of the
   * runtime environment is used.
   * @param tz "UTC" or a timezone identifier.
   */
  timeZone(tz: string): DatetimeFormat

  /**
   * Displays the era, e.g. AD or BC.
   * @param style The style to use for the era.
   */
  era(style?: WordComponentStyle): DatetimeFormat

  /**
   * Displays the year.
   * @param style The style to use for the year.
   */
  year(style?: NumericComponentStyle): DatetimeFormat

  /**
   * Displays the month.
   * @param style The style to use for the month.
   */
  month(style?: NumericComponentStyle | WordComponentStyle): DatetimeFormat

  /**
   * Displays the day of the month.
   * @param style The style to use for the day.
   */
  day(style?: NumericComponentStyle): DatetimeFormat

  /**
   * Displays the day of the week.
   * @param style The style to use for the day.
   */
  weekday(style?: WordComponentStyle): DatetimeFormat

  /**
   * Displays the period of the day, e.g. morning or noon.
   * @param style The style to use for the period.
   */
  dayPeriod(style?: WordComponentStyle): DatetimeFormat

  /**
   * Displays the hour.
   * @param style The style to use for the hour.
   */
  hour(style?: NumericComponentStyle): DatetimeFormat

  /**
   * Displays the minutes.
   * @param style The style to use for the minutes.
   */
  minute(style?: NumericComponentStyle): DatetimeFormat

  /**
   * Displays the seconds.
   * @param style The style to use for the seconds.
   * @param fractionalDigits The number of fractions of seconds to show, from 0 to 3. The default is
   *                         zero.
   */
  second(style?: NumericComponentStyle, fractionalDigits?: number): DatetimeFormat

  /**
   * Displays the time zone name if known.
   * @param style The style to use for the time zone.
   */
  timeZoneName(style?: TimeZoneStyle): DatetimeFormat

  /**
   * Displays the date and the time.
   *
   * + the `full` style includes the year, month, day, day of the week, hour, minutes, seconds and
   *   the timezone.
   * + the `long` style includes the year, month, day, hour, minutes, seconds and the timezone in a
   *   shorter format.
   * + the `medium` style includes the year, month, day, hour, minutes, and seconds.
   * + the `short` style is like `medium`, but uses only numbers.
   *
   * @param style The components and the styles to use. See the description of the method.
   */
  dateAndTime(style?: ShortcutStyle): DatetimeFormat

  /**
   * Displays only the date.
   *
   * + the `full` style includes the year, month, day, and day of the week in the longest format.
   * + the `long` style includes the year, month, and day in the longest format.
   * + the `medium` style is like `long`, but uses a shorter format when possible.
   * + the `short` style is like `long`, but uses only numbers.
   *
   * @param style The components and the styles to use. See the description of the method.
   */
  date(style?: ShortcutStyle): DatetimeFormat

  /**
   * Displays only the date as a month.
   *
   * + the `full` and `long` styles are identical. They include the year and month in their long
   *   form.
   * + the `medium` style includes the year and month in a shorter format than `full` and `long`.
   * + the `short` style is like `medium`, but uses only numbers.
   *
   * @param style The components and the styles to use. See the description of the method.
   */
  monthDate(style?: ShortcutStyle): DatetimeFormat

  /**
   * Displays only the date in a year.
   *
   * + the `full` style includes the month, day, and day of the week in the longest format.
   * + the `long` style includes the month and day in the longest format.
   * + the `medium` style is like `long`, but uses a shorter format when possible.
   * + the `short` style is like `long`, but uses only numbers.
   *
   * @param style The components and the styles to use. See the description of the method.
   */
  dayOfYear(style?: ShortcutStyle): DatetimeFormat

  /**
   * Displays only the time of day.
   *
   * + the `full` style includes the hour, minutes, seconds and the timezone in the longest format.
   * + the `long` style is like `full`, but with a shorter format for the time zone.
   * + the `medium` and `short` styles are identical, they include the hour, minutes and seconds in
   *   their default format.
   *
   * @param style The components and the styles to use. See the description of the method.
   */
  time(style?: ShortcutStyle): DatetimeFormat

  /**
   * Displays only the time up to the minutes.
   *
   * + the `full` style includes the hour, minutes and time zone in the longest format.
   * + the `long` style is like `full`, but with a shorter format for the time zone.
   * + the `medium` and `short` styles are identical, they include the hour and minutes in their
   *   default format.
   *
   * @param style The components and the styles to use. See the description of the method.
   */
  minuteTime(style?: ShortcutStyle): DatetimeFormat
}
