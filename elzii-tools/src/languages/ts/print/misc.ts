import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor, wrapInBlock } from './helpers'

type VisitMisc = 'visitBlockStatement' | 'visitIdentifier'

const TSPrinterImpl_misc: Pick<Visitor, VisitMisc> = {
  visitBlockStatement(this: Visitor, blockStatement: ts.BlockStatement): PrintedCode {
    const content = PrintedCode.join(blockStatement.body.map((elt) => this.visitAnyNode(elt)))
    return wrapInBlock(content)
  },

  visitIdentifier(this: Visitor, identifier: ts.Identifier): PrintedCode {
    let code = identifier.name

    if (identifier.typeAnnotation !== undefined) {
      code += this.visitAnyNode(identifier.typeAnnotation).toString()
    }

    return new PrintedCode(code)
  },
}

export default TSPrinterImpl_misc
