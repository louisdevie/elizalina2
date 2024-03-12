import { DatetimeExtension } from '.'

interface Dayjs {
  toDate(): Date
}

export class DayjsExtension implements DatetimeExtension {
  canConvert(value: unknown): boolean {
    return (
      typeof value === 'object' &&
      value !== null &&
      '$isDayjsObject' in value &&
      value.$isDayjsObject !== null &&
      'toDate' in value
    )
  }

  convertToDate(value: unknown): Date {
    let dayjs = value as Dayjs
    return dayjs.toDate()
  }
}
