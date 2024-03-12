import { MomentExtension } from '@module/extensions/moment'
import { DayjsExtension } from '@module/extensions/dayjs'

/**
 * An extension that adds support for time and/or date objects other than the JavaScript built-in
 * {@link Date}.
 */
export interface DatetimeExtension {
  /**
   * Indicates if this extension knows how to handle the given value.
   * @param value The datetime value to check.
   * @returns `true` if the value can be converted to a {@link Date}, otherwise `false`.
   */
  canConvert(value: unknown): boolean

  /**
   * Converts a given value into a {@link Date}. It can be assumed that {@link canConvert} returned
   * `'toDate'` for that exact same value beforehand.
   * @param value The datetime value to convert.
   */
  convertToDate(value: unknown): Date
}

class Extensions {
  private readonly _datetimeExtensions: DatetimeExtension[]

  public constructor() {
    this._datetimeExtensions = []
  }

  public addDatetimeExtension(extension: DatetimeExtension) {
    this._datetimeExtensions.push(extension)
  }

  public tryToConvertToDate(value: unknown): Date | undefined {
    let converted = undefined

    for (const extension of this._datetimeExtensions) {
      if (extension.canConvert(value)) {
        converted = extension.convertToDate(value)
        break
      }
    }

    return converted
  }
}

const extensions = new Extensions()
extensions.addDatetimeExtension(new MomentExtension())
extensions.addDatetimeExtension(new DayjsExtension())

export default extensions
