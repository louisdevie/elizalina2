import { FormatOptions } from '@module/format'

export interface Formatter {
  applyTo(value: any): string
}

export interface FormatterFactory {
  makeFormatter(options: FormatOptions): Formatter
}
