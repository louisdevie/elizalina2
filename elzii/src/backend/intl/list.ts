import { Formatter, FormatterFactory } from '@module/backend'
import { ListFormatOptions } from '@module/format'

type ListFormat = { format(value: string[]): string }

type ListFormatConstructor = new (locale: string, options: any) => ListFormat

export class IntlListFormatAdapter implements Formatter {
  private readonly _intl: ListFormat // Intl.ListFormat is only defined in esnext targets
  private readonly _itemFormatter?: Formatter

  constructor(options: ListFormatOptions, factory: FormatterFactory) {
    const intlOptions = IntlListFormatAdapter.extractIntlOptions(options)

    if (!('ListFormat' in Intl)) {
      this._intl = IntlListFormatAdapter.makeFallbackFormatter()
    } else {
      const IntlWithListFormat = Intl as unknown as { ListFormat: ListFormatConstructor }
      this._intl = new IntlWithListFormat.ListFormat(options.language, intlOptions)
    }

    if (options.itemFormat !== undefined) {
      this._itemFormatter = factory.makeFormatter(options.itemFormat)
    }
  }

  private static extractIntlOptions(options: ListFormatOptions) {
    return {
      type: options.listType,
      style: options.style,
    }
  }

  private static makeFallbackFormatter(): ListFormat {
    return {
      format: (value: string[]): string => value.join(', '),
    }
  }

  private applyToItem(item: any): string {
    let formattedItem
    if (typeof item === 'string') {
      formattedItem = item
    } else if (this._itemFormatter !== undefined) {
      formattedItem = this._itemFormatter.applyTo(item)
    } else {
      formattedItem = item.toString()
    }
    return formattedItem
  }

  public applyTo(value: any): string {
    let formatted
    if (Array.isArray(value)) {
      let stringItems = value.map((item) => this.applyToItem(item))
      formatted = this._intl.format(stringItems)
    } else {
      formatted = value.toString()
    }
    return formatted
  }
}
