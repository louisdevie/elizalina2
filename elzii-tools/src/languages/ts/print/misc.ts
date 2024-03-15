import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { escapeTemplateString, Visitor, wrapInBlock } from './helpers'

type VisitMisc =
  | 'visitAssignmentExpression'
  | 'visitBlockStatement'
  | 'visitIdentifier'
  | 'visitMemberExpression'
  | 'visitTemplateElement'
  | 'visitTemplateLiteral'
  | 'visitThisExpression'

const TSPrinterImpl_misc: Pick<Visitor, VisitMisc> = {
  visitAssignmentExpression(
    this: Visitor,
    assignmentExpression: ts.AssignmentExpression,
  ): PrintedCode {
    const left = this.visitAnyNode(assignmentExpression.left)
    const right = this.visitAnyNode(assignmentExpression.right)
    return new PrintedCode(`${left} = ${right}`)
  },

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

  visitMemberExpression(this: Visitor, memberExpression: ts.MemberExpression): PrintedCode {
    const object = this.visitAnyNode(memberExpression.object)
    const property = this.visitAnyNode(memberExpression.property)
    return new PrintedCode(`${object}.${property}`)
  },

  visitTemplateElement(this: Visitor, templateElement: ts.TemplateElement): PrintedCode {
    return new PrintedCode(escapeTemplateString(templateElement.value.cooked))
  },

  visitTemplateLiteral(this: Visitor, templateLiteral: ts.TemplateLiteral): PrintedCode {
    let code = '`'
    let i = 0

    for (i; i < templateLiteral.expressions.length; i++) {
      code += this.visitTemplateElement(templateLiteral.quasis[i])
      code += '${'
      code += this.visitAnyNode(templateLiteral.expressions[i])
      code += '}'
    }
    for (i; i < templateLiteral.quasis.length; i++) {
      code += this.visitTemplateElement(templateLiteral.quasis[i])
    }
    code += '`'

    return new PrintedCode(code)
  },

  visitThisExpression(this: Visitor, thisExpression: ts.ThisExpression): PrintedCode {
    return new PrintedCode(`this`)
  },
}

export default TSPrinterImpl_misc
