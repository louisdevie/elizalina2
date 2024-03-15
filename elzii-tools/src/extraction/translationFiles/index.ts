import { ErrorReport } from '@module/error'

export { default as TranslationsDirectoryExtractor } from './TranslationsDirectoryExtractor'

export interface Result<T> {
  value: T
  errors: ErrorReport
}

export interface Builder<T> {
  finish(): Result<T>
}
