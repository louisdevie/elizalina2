import { DatetimeExtension } from '.'

interface Moment {
  toDate(): Date
}

export class MomentExtension implements DatetimeExtension {
  canConvert(value: unknown): boolean {
    return (
      typeof value === 'object' &&
      value !== null &&
      '_isAMomentObject' in value &&
      value._isAMomentObject !== null &&
      'toDate' in value
    )
  }

  convertToDate(value: unknown): Date {
    let moment = value as Moment
    return moment.toDate()
  }
}
