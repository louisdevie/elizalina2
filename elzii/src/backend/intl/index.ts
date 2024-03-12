import { Formatter, FormatterFactory } from '../index'
import { FormatOptions } from '@module/format'
import { IntlNumberFormatAdapter } from './number'
import { IntlListFormatAdapter } from './list'
import { IntlDatetimeFormatAdapter } from './datetime'
import { IntlPluralRulesAdapter } from './plural'

export class IntlFormatterFactory implements FormatterFactory {
  public makeFormatter(options: FormatOptions): Formatter {
    let formatter
    switch (options.type) {
      case 'number':
        formatter = new IntlNumberFormatAdapter(options, options)
        break

      case 'list':
        formatter = new IntlListFormatAdapter(options, this)
        break

      case 'datetime':
        formatter = new IntlDatetimeFormatAdapter(options)
        break

      case 'plural':
        formatter = new IntlPluralRulesAdapter(options)
        break
    }
    return formatter
  }
}
