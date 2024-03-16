import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { escapeTemplateString, printList, Visitor } from './helpers'
import {
  arrayExpression,
  assignmentExpression,
  identifier,
  memberExpression,
  objectExpression,
  property,
  templateElement,
  templateLiteral,
} from '@module/languages/ts/ast'

type VisitExpressions =
  | 'visitArrayExpression'
  | 'visitAssignmentExpression'
  | 'visitIdentifier'
  | 'visitImportExpression'
  | 'visitMemberExpression'
  | 'visitObjectExpression'
  | 'visitProperty'
  | 'visitTemplateElement'
  | 'visitTemplateLiteral'
  | 'visitThisExpression'

const TSPrinterImpl_expressions: Pick<Visitor, VisitExpressions> = {
  visitArrayExpression(this: Visitor, arrayExpression: ts.ArrayExpression): PrintedCode {
    return printList(
      '[',
      arrayExpression.elements.map((elt) =>
        elt === null ? new PrintedCode('') : this.visitAnyNode(elt),
      ),
      ']',
      this.lineBreaksAllowed ? 'auto' : 'inline',
    )
  },

  visitAssignmentExpression(
    this: Visitor,
    assignmentExpression: ts.AssignmentExpression,
  ): PrintedCode {
    const left = this.visitAnyNode(assignmentExpression.left)
    const right = this.visitAnyNode(assignmentExpression.right)
    return new PrintedCode(`${left} = ${right}`)
  },

  visitIdentifier(this: Visitor, identifier: ts.Identifier): PrintedCode {
    let code = identifier.name

    if (identifier.typeAnnotation !== undefined) {
      code += this.visitAnyNode(identifier.typeAnnotation).toString()
    }

    return new PrintedCode(code)
  },

  visitImportExpression(this: Visitor, importExpression: ts.ImportExpression): PrintedCode {
    const source = this.visitAnyNode(importExpression.source)
    return new PrintedCode(`import(${source})`)
  },

  visitMemberExpression(this: Visitor, memberExpression: ts.MemberExpression): PrintedCode {
    const object = this.visitAnyNode(memberExpression.object)
    const property = this.visitAnyNode(memberExpression.property)
    return new PrintedCode(`${object}.${property}`)
  },

  visitObjectExpression(this: Visitor, objectExpression: ts.ObjectExpression): PrintedCode {
    return printList(
      '{',
      objectExpression.properties.map((prop) => this.visitAnyNode(prop)),
      '}',
      this.lineBreaksAllowed ? 'auto' : 'inline',
    )
  },

  visitProperty(this: Visitor, property: ts.Property): PrintedCode {
    const key = new PrintedCode(this.visitAnyNode(property.key) + ': ')

    const value = this.visitAnyNode(property.value)

    return PrintedCode.joinInline([key, value])
  },

  visitTemplateElement(this: Visitor, templateElement: ts.TemplateElement): PrintedCode {
    return new PrintedCode(escapeTemplateString(templateElement.value.cooked))
  },

  visitTemplateLiteral(this: Visitor, templateLiteral: ts.TemplateLiteral): PrintedCode {
    let code = '`'
    let i = 0
    this.disallowLineBreaks()

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

    this.allowLineBreaks()
    return new PrintedCode(code)
  },

  visitThisExpression(this: Visitor, thisExpression: ts.ThisExpression): PrintedCode {
    return new PrintedCode(`this`)
  },
}

export default TSPrinterImpl_expressions
