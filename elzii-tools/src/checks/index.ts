export { default as MultiCheck } from './MultiCheck'

export interface Check<T, R> {
  isValidGlobally: boolean

  validate(value: T): boolean
  getReport(): R
}
