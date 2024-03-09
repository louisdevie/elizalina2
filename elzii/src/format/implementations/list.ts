import { ListFormat, ListFormatOptions, ListStyle, ListType } from '../list'
import { NumberFormat } from '../number'
import { NumberFormatImpl } from '@module/format/implementations/number'

export class ListFormatImpl implements ListFormat {
  private readonly _options: ListFormatOptions

  public constructor(language: string) {
    this._options = { type: 'list', language }
  }

  public toOptions(): ListFormatOptions {
    return this._options
  }

  public listType(type: ListType): ListFormatImpl {
    this._options.listType = type
    return this
  }

  public get conjunction(): ListFormatImpl {
    return this.listType('conjunction')
  }

  public get disjunction(): ListFormatImpl {
    return this.listType('disjunction')
  }

  public get unit(): ListFormatImpl {
    return this.listType('unit')
  }

  public listStyle(style: ListStyle): ListFormatImpl {
    this._options.style = style
    return this
  }

  public get long(): ListFormatImpl {
    return this.listStyle('long')
  }

  public get short(): ListFormatImpl {
    return this.listStyle('short')
  }

  public get narrow(): ListFormatImpl {
    return this.listStyle('narrow')
  }

  public numberItems(config?: (f: NumberFormat) => NumberFormat): ListFormatImpl {
    let format: NumberFormat = new NumberFormatImpl(this._options.language)

    if (config !== undefined) format = config(format)

    this._options.itemFormat = format.toOptions()
    return this
  }
}
