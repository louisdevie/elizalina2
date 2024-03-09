import { Formatter, FormatterFactory } from '@module/backend/index'
import { FormatOptions } from '@module/format'

export class IntlFormatterFactory implements FormatterFactory {
  makeFormatter(options: FormatOptions): Formatter {
    throw new Error('Method not implemented.')
  }
}
