import type { Formatter, FormatterFactory } from '..'
import type { FormatOptions } from '@module/format'
import type { Ctx } from '@module/ctx'
import { IntlNumberFormatAdapter } from './number'
import { IntlListFormatAdapter } from './list'
import { IntlDatetimeFormatAdapter } from './datetime'
import { IntlPluralRulesAdapter } from './plural'

/**
 * @internal
 */
export class IntlFormatterFactory implements FormatterFactory {
  public makeFormatter(options: FormatOptions, context: Ctx): Formatter {
    let formatter
    switch (options.type) {
      case 'number':
        formatter = new IntlNumberFormatAdapter(options, options, context)
        break

      case 'list':
        formatter = new IntlListFormatAdapter(options, this, context)
        break

      case 'datetime':
        formatter = new IntlDatetimeFormatAdapter(options, context)
        break

      case 'plural':
        formatter = new IntlPluralRulesAdapter(options, context)
        break
    }
    return formatter
  }
}
