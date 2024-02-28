import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { escapeDoubleQuotedString, escapeSingleQuotedString, Visitor } from './helpers'
import { countOccurrences } from '@module/helpers'
import { throwError } from '@module/error'

type VisitMisc = 'visitLiteral'

const TSPrinterImpl_terminals: Pick<Visitor, VisitMisc> = {
  visitLiteral(this: Visitor, literal: ts.Literal): PrintedCode {
    let code

    switch (typeof literal.value) {
      case 'string':
        const singleQuoteCount = countOccurrences("'", literal.value)
        const doubleQuoteCount = countOccurrences('"', literal.value)
        if (singleQuoteCount > doubleQuoteCount) {
          code = '"' + escapeDoubleQuotedString(literal.value) + '"'
        } else {
          code = "'" + escapeSingleQuotedString(literal.value) + "'"
        }
        break

      default:
        throwError(`Invalid type of literal: ${typeof literal.value}`, 'internal')
    }

    return new PrintedCode(code)
  },
}

export default TSPrinterImpl_terminals
