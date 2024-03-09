import { PluralFormat, PluralFormatOptions, PluralType } from '@module/format/plural'
import { DigitsFormatImpl } from '@module/format/implementations/number'

export class PluralFormatImpl extends DigitsFormatImpl<PluralFormat> implements PluralFormat {
  private readonly _options: PluralFormatOptions

  public constructor(language: string) {
    super()

    this._options = { type: 'plural', language }
  }

  protected get options(): PluralFormatOptions {
    return this._options
  }

  public toOptions(): PluralFormatOptions {
    return this._options
  }

  pluralType(type: PluralType): PluralFormatImpl {
    this._options.pluralType = type
    return this
  }

  get cardinal(): PluralFormatImpl {
    return this.pluralType('cardinal')
  }

  get ordinal(): PluralFormatImpl {
    return this.pluralType('ordinal')
  }

  zero(form: string): PluralFormatImpl {
    this._options.zeroForm = form
    return this
  }

  one(form: string): PluralFormatImpl {
    this._options.oneForm = form
    return this
  }

  two(form: string): PluralFormatImpl {
    this._options.twoForm = form
    return this
  }

  few(form: string): PluralFormatImpl {
    this._options.fewForm = form
    return this
  }

  many(form: string): PluralFormatImpl {
    this._options.manyForm = form
    return this
  }

  other(form: string): PluralFormatImpl {
    this._options.otherForm = form
    return this
  }
}
