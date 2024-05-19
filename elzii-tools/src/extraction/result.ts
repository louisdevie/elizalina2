import { ErrorReport } from '@module/error'

export interface Result<T> {
  value: T
  errors: ErrorReport
}

export function unwrap<T>(result: Result<T>, errors: ErrorReport): T {
  errors.merge(result.errors)
  return result.value
}
