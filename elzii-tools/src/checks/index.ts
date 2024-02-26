export { default as MultiCheck } from './MultiCheck'

export interface Check<T, R> {
  validate(value: T): boolean
  getReport(): R
}
