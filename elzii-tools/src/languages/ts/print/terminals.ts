import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { escapeDoubleQuotedString, escapeSingleQuotedString, Visitor } from './helpers'
import { countOccurrences } from '@module/helpers'
import { throwError } from '@module/error'

type VisitMisc = 'visitBlockComment' | 'visitLiteral'

const TSPrinterImpl_terminals: Pick<Visitor, VisitMisc> = {
  visitBlockComment(blockComment: ts.BlockComment): PrintedCode {
    let comment = blockComment.value.split('\n')

    let firstLine = '/* ' + comment.shift()
    if (comment.length === 0) {
      firstLine += ' */'
    } else {
      comment = comment.map((line) => ' * ' + line)
      comment.push(' */')
    }

    return new PrintedCode(firstLine, ...comment)
  },

  visitLiteral(this: Visitor, literal: ts.Literal): PrintedCode {
    let code

    switch (typeof literal.value) {
      case 'string':
        const singleQuoteCount = countOccurrences("'", literal.value)
        const doubleQuoteCount = countOccurrences('"', literal.value)
        console.log(literal.value, singleQuoteCount, doubleQuoteCount)
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
