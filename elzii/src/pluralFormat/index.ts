import { PluralFormRenderer } from './render'
import { PluralFormParser } from './parse'

export function formatPluralForm(sourceText: string, formattedNumber: string): string {
  return PluralFormRenderer.render(PluralFormParser.parse(sourceText), formattedNumber)
}
