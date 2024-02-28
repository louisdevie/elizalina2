import { Check } from '@module/checks/index'
import { throwError } from '@module/error'

export default class MultiCheck<T> implements Check<T, never> {
  private readonly _checks: Check<T, unknown>[]

  public constructor(...checks: Check<T, unknown>[]) {
    this._checks = checks
  }

  public get isValidGlobally(): boolean {
    return this._checks.every((check) => check.isValidGlobally)
  }

  public validate(value: T): boolean {
    return this._checks.every((check) => check.validate(value))
  }

  public getReport(): never {
    throwError('no report available', 'internal')
  }
}
