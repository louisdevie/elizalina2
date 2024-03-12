import { Formatter } from '@module/backend'
import { DatetimeFormatOptions } from '@module/format'
import { HourCycle } from '@module/format/datetime'
import extensions from '@module/extensions'
import { Ctx } from '@module/ctx'

export class IntlDatetimeFormatAdapter implements Formatter {
  private _intl: Intl.DateTimeFormat

  constructor(options: DatetimeFormatOptions, context: Ctx) {
    const intlOptions = IntlDatetimeFormatAdapter.extractIntlOptions(options)

    try {
      // cast to any to try anyway and handle errors dynamically
      this._intl = new Intl.DateTimeFormat(options.language, intlOptions as any)
    } catch {
      IntlDatetimeFormatAdapter.switchToFallbackIntlOptions(intlOptions, context)
      this._intl = new Intl.DateTimeFormat(options.language, intlOptions as any)
    }
  }

  private static extractIntlOptions(options: DatetimeFormatOptions) {
    return {
      // Locale options
      calendar: options.calendar,
      numberingSystem: options.numberingSystem,
      hour12: this.hourCycleToIntlHour12(options.hourCycle),
      hourCycle: this.hourCycleToIntlHourCycle(options.hourCycle),
      timeZone: options.timeZone,

      // Date-time component options
      weekday: options.weekday,
      era: options.era,
      year: options.year,
      month: options.month,
      day: options.day,
      dayPeriod: options.dayPeriod,
      hour: options.hour,
      minute: options.minute,
      second: options.second,
      fractionalSecondDigits: this.fracSecondsToIntlFSD(options.fractionalSeconds),
      timeZoneName: options.timeZoneName,
    }
  }

  private static tzNotSupportedWarning(value: string): string {
    return `the "${value}" value for the "timeZoneName" component is not supported.`
  }

  private static switchToFallbackIntlOptions(options: any, context: Ctx) {
    // if an option is not supported, it will just get ignored.
    // the timeZoneName option is a special case because there are browsers that will recognize it
    // and throw errors because they don't understand certain values.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#browser_compatibility
    if ('timeZoneName' in options) {
      switch (options.timeZoneName) {
        case 'shortGeneric':
          context.warn(this.tzNotSupportedWarning('shortGeneric'))
          options.timeZoneName = 'short'
          break
        case 'longGeneric':
          context.warn(this.tzNotSupportedWarning('longGeneric'))
          options.timeZoneName = 'long'
          break
        case 'shortOffset':
          context.warn(this.tzNotSupportedWarning('shortOffset'))
          options.timeZoneName = 'short'
          break
        case 'longOffset':
          context.warn(this.tzNotSupportedWarning('longOffset'))
          options.timeZoneName = 'long'
          break
      }
    }
  }

  private static hourCycleToIntlHour12(cycle: HourCycle | undefined): boolean | undefined {
    let hour12Mode
    if (cycle === '24hours') {
      hour12Mode = false
    } else if (cycle === '12hours') {
      hour12Mode = true
    } else {
      hour12Mode = undefined
    }
    return hour12Mode
  }

  private static hourCycleToIntlHourCycle(cycle: HourCycle | undefined): string | undefined {
    let intlHourCycle
    if (cycle === '24hours' || cycle === '12hours') {
      intlHourCycle = undefined
    } else {
      intlHourCycle = cycle
    }
    return intlHourCycle
  }

  private static fracSecondsToIntlFSD(fracSeconds: number | undefined): number | undefined {
    let intlFSD // stands for Fractional Second Digits
    if (fracSeconds === 0) {
      intlFSD = undefined // intl does not allow 0 to be specified
    } else {
      intlFSD = fracSeconds
    }
    return intlFSD
  }

  public applyTo(value: any): string {
    let dateValue
    if (value instanceof Date) {
      dateValue = value
    } else {
      dateValue = extensions.tryToConvertToDate(value)
    }

    let formatted
    if (dateValue !== undefined) {
      formatted = this._intl.format(dateValue)
    } else {
      formatted = value.toString()
    }
    return formatted
  }
}
