import { Translation } from '@module/translations'
import CompleteTranslationsCheck from './translations/CompleteTranslationsCheck'

export interface Check<T> {
  validate(value: T): boolean
}

export function defaultTranslationChecks(): Check<Translation> {
  return new CompleteTranslationsCheck()
}

/**
 * Run some checks on an async stream of values and filter out the ones that are not valid.
 * @param values The values to validate.
 * @param checks The checks to perform.
 */
export async function *runChecksAsync<T>(
  values: AsyncIterable<T>,
  checks: Check<T>,
): AsyncIterable<T> {
  for await (const value of values) {
    if (checks.validate(value)) {

    }
  }
}
