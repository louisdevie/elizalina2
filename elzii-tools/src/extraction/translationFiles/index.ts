import { Result } from '../result'

export { default as TranslationsDirectoryExtractor } from './TranslationsDirectoryExtractor'

export interface Builder<T> {
  finish(): Result<T>
}
