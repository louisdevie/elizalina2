import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor, wrapInBlock } from './helpers'

type VisitMisc = 'visitBlockStatement' | 'visitVariableDeclaration' | 'visitVariableDeclarator'

const TSPrinterImpl_misc: Pick<Visitor, VisitMisc> = {
  visitBlockStatement(this: Visitor, blockStatement: ts.BlockStatement): PrintedCode {
    const content = PrintedCode.join(blockStatement.body.map((elt) => this.visitAnyNode(elt)))
    return wrapInBlock(content)
  },

  visitVariableDeclaration(
    this: Visitor,
    variableDeclaration: ts.VariableDeclaration,
  ): PrintedCode {
    const printed = this.visitVariableDeclarator(variableDeclaration.declarations[0])

    printed.prependInline(new PrintedCode('const '))
    printed.appendInline(new PrintedCode(';'))

    return printed
  },

  visitVariableDeclarator(this: Visitor, variableDeclarator: ts.VariableDeclarator): PrintedCode {
    const printed = this.visitAnyNode(variableDeclarator.id)

    if (variableDeclarator.init !== null) {
      printed.appendInline(new PrintedCode(' = '))
      printed.appendInline(this.visitAnyNode(variableDeclarator.init))
    }

    return printed
  },
}

export default TSPrinterImpl_misc
