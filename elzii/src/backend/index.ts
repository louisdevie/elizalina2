import { FormatOptions } from '@module/format'
import { Ctx } from '@module/ctx'

export interface Formatter {
  applyTo(value: any, context: Ctx): string
}

export interface FormatterFactory {
  makeFormatter(options: FormatOptions, context: Ctx): Formatter
}
