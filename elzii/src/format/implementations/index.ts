import { Format } from '../index'
import { NumberFormatImpl } from './number'
import { ListFormatImpl } from './list'
import { DatetimeFormatImpl } from './datetime'
import { PluralFormatImpl } from './plural'

export class FormatImpl implements Format {
  private readonly language: string

  public constructor(language: string) {
    this.language = language
  }

  public get number(): NumberFormatImpl {
    return new NumberFormatImpl(this.language)
  }

  public get list(): ListFormatImpl {
    return new ListFormatImpl(this.language)
  }

  public get datetime(): DatetimeFormatImpl {
    return new DatetimeFormatImpl(this.language)
  }

  public get plural(): PluralFormatImpl {
    return new PluralFormatImpl(this.language)
  }
}
