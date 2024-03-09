import {
  DatetimeFormat,
  DatetimeFormatOptions,
  HourCycle,
  NumericComponentStyle,
  ShortcutStyle,
  TimeZoneStyle,
  WordComponentStyle,
} from '../datetime'

export class DatetimeFormatImpl implements DatetimeFormat {
  private readonly _options: DatetimeFormatOptions

  public constructor(language: string) {
    this._options = { type: 'datetime', language }
  }

  public toOptions(): DatetimeFormatOptions {
    return this._options
  }

  public calendar(code: string): DatetimeFormatImpl {
    this._options.calendar = code
    return this
  }

  public numberingSystem(name: string): DatetimeFormatImpl {
    this._options.numberingSystem = name
    return this
  }

  public hourCycle(cycle: HourCycle): DatetimeFormatImpl {
    this._options.hourCycle = cycle
    return this
  }

  public get _12h(): DatetimeFormatImpl {
    return this.hourCycle('12hours')
  }

  public get _24h(): DatetimeFormatImpl {
    return this.hourCycle('24hours')
  }

  public get h11(): DatetimeFormatImpl {
    return this.hourCycle('h11')
  }

  public get h12(): DatetimeFormatImpl {
    return this.hourCycle('h12')
  }

  public get h23(): DatetimeFormatImpl {
    return this.hourCycle('h23')
  }

  public get h24(): DatetimeFormatImpl {
    return this.hourCycle('h24')
  }

  public timeZone(tz: string): DatetimeFormatImpl {
    this._options.timeZone = tz
    return this
  }

  public era(style?: WordComponentStyle): DatetimeFormatImpl {
    this._options.era = style ?? 'short'
    return this
  }

  public year(style?: NumericComponentStyle): DatetimeFormatImpl {
    this._options.year = style ?? 'numeric'
    return this
  }

  public month(style?: WordComponentStyle | NumericComponentStyle): DatetimeFormatImpl {
    this._options.month = style ?? 'short'
    return this
  }

  public day(style?: NumericComponentStyle): DatetimeFormatImpl {
    this._options.day = style ?? 'numeric'
    return this
  }

  public weekday(style?: WordComponentStyle): DatetimeFormatImpl {
    this._options.weekday = style ?? 'short'
    return this
  }

  public dayPeriod(style?: WordComponentStyle): DatetimeFormatImpl {
    this._options.dayPeriod = style ?? 'short'
    return this
  }

  public hour(style?: NumericComponentStyle): DatetimeFormatImpl {
    this._options.hour = style ?? 'numeric'
    return this
  }

  public minute(style?: NumericComponentStyle): DatetimeFormatImpl {
    this._options.minute = style ?? 'numeric'
    return this
  }

  public second(style?: NumericComponentStyle, fractionalDigits?: number): DatetimeFormatImpl {
    this._options.second = style ?? 'numeric'
    this._options.fractionalSeconds = fractionalDigits ?? 0
    return this
  }

  public timeZoneName(style?: TimeZoneStyle): DatetimeFormatImpl {
    this._options.timeZoneName = style ?? 'shortOffset'
    return this
  }

  public dateAndTime(style?: ShortcutStyle): DatetimeFormatImpl {
    return this.date(style).time(style)
  }

  public date(style?: ShortcutStyle): DatetimeFormatImpl {
    this.monthDate(style).day()
    if (style === 'full') this.weekday('long')
    return this
  }

  public monthDate(style?: ShortcutStyle): DatetimeFormatImpl {
    switch (style) {
      case 'full':
      case 'long':
        this.year().month('long')
        break

      case 'medium':
      default:
        this.year().month()
        break

      case 'short':
        this.year('2-digit').month('numeric')
        break
    }
    return this
  }

  public dayOfYear(style?: ShortcutStyle): DatetimeFormatImpl {
    switch (style) {
      case 'full':
        this.month('long').day().weekday('long')
        break

      case 'long':
        this.month('long').day()
        break

      case 'medium':
      default:
        this.month().day()
        break

      case 'short':
        this.month('numeric').day()
        break
    }
    return this
  }

  public time(style?: ShortcutStyle): DatetimeFormatImpl {
    return this.minuteTime(style).second()
  }

  public minuteTime(style?: ShortcutStyle): DatetimeFormatImpl {
    switch (style) {
      case 'full':
        this.hour().minute().timeZoneName('long')
        break

      case 'long':
        this.hour().minute().timeZoneName()
        break

      case 'medium':
      case 'short':
      default:
        this.hour().minute()
        break
    }
    return this
  }
}
