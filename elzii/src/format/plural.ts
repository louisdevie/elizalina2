import { AnyFormat, AnyFormatOptions } from '.'
import { DigitsFormat, DigitsFormatOptions } from './number'
import { PluralFormatImpl } from '@module/format/implementations/plural'

export type PluralType = 'cardinal' | 'ordinal'

export interface PluralFormatOptions extends AnyFormatOptions, DigitsFormatOptions {
  type: 'plural'

  pluralType?: PluralType

  zeroForm?: string
  oneForm?: string
  twoForm?: string
  fewForm?: string
  manyForm?: string
  otherForm?: string
}

export interface PluralFormat extends AnyFormat, DigitsFormat<PluralFormat> {
  /**
   * Specify how to interpret numbers (cardinal numbers describe a quantity, while ordinal numbers
   * are used to describe the order of things).
   * @param type Either "cardinal" or "ordinal".
   */
  pluralType(type: PluralType): PluralFormat

  /**
   * Interpret the number as a quantity or a count (e.g. 1 apple or 3 apples).
   */
  get cardinal(): PluralFormat

  /**
   * Interpret the number as a ranking or position in a list (e.g. the 1st apple or the 3rd apple).
   */
  get ordinal(): PluralFormat

  /**
   * Specify the form to use for the "zero" category.
   * @param form The text to use in this case.
   */
  zero(form: string): PluralFormat

  /**
   * Specify the form to use for the "one" category.
   * @param form The text to use in this case.
   */
  one(form: string): PluralFormat

  /**
   * Specify the form to use for the "two" category.
   * @param form The text to use in this case.
   */
  two(form: string): PluralFormat

  /**
   * Specify the form to use for the "few" category.
   * @param form The text to use in this case.
   */
  few(form: string): PluralFormat

  /**
   * Specify the form to use for the "many" category.
   * @param form The text to use in this case.
   */
  many(form: string): PluralFormat

  /**
   * Specify the plural form to use for the "other" category and as a fallback for unspecified forms.
   * @param form The text to use in this case.
   */
  other(form: string): PluralFormat
}
