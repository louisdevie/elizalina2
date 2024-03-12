import { PrintedCode } from '@module/printing'
import { Visitor, wrapInBlock } from './helpers'
import * as ts from '@module/languages/ts/ast'

type VisitClasses =
  | 'visitClassBody'
  | 'visitClassDeclaration'
  | 'visitMethodDefinition'
  | 'visitPropertyDefinition'
  | 'visitTSClassImplements'
  | 'visitTSInterfaceBody'
  | 'visitTSInterfaceDeclaration'
  | 'visitTSMethodSignature'

const TSPrinterImpl_classes: Pick<Visitor, VisitClasses> = {
  visitClassBody(this: Visitor, classBody: ts.ClassBody): PrintedCode {
    const content = PrintedCode.join(classBody.body.map((elt) => this.visitAnyNode(elt)))
    return wrapInBlock(content)
  },

  visitClassDeclaration(this: Visitor, classDeclaration: ts.ClassDeclaration): PrintedCode {
    let declaration = 'class '

    if (classDeclaration.id !== null) {
      declaration += this.visitIdentifier(classDeclaration.id) + ' '
    }

    if (classDeclaration.implements.length > 0) {
      declaration += 'implements '
      declaration += classDeclaration.implements
        .map((impl) => this.visitTSClassImplements(impl).toString())
        .join(', ')
      declaration += ' '
    }

    return PrintedCode.joinInline([
      new PrintedCode(declaration),
      this.visitClassBody(classDeclaration.body),
    ])
  },

  visitMethodDefinition(this: Visitor, methodDefinition: ts.MethodDefinition): PrintedCode {
    const modifiers = ['public ']
    if (methodDefinition.kind === 'get') modifiers.push('get ')
    const name = this.visitAnyNode(methodDefinition.key)
    const nameWithModifiers = new PrintedCode(`${modifiers.join('')}${name}`)

    return PrintedCode.joinInline([nameWithModifiers, this.visitAnyNode(methodDefinition.value)])
  },

  visitPropertyDefinition(this: Visitor, propertyDefinition: ts.PropertyDefinition): PrintedCode {
    const key = this.visitAnyNode(propertyDefinition.key)

    let type = ''
    if (propertyDefinition.typeAnnotation !== undefined) {
      type = this.visitTSTypeAnnotation(propertyDefinition.typeAnnotation).toString()
    }

    return new PrintedCode(`private ${key}${type};`)
  },

  visitTSClassImplements(this: Visitor, tsClassImplements: ts.TSClassImplements): PrintedCode {
    return this.visitAnyNode(tsClassImplements.expression)
  },

  visitTSInterfaceBody(this: Visitor, tsInterfaceBody: ts.TSInterfaceBody): PrintedCode {
    const content = PrintedCode.join(tsInterfaceBody.body.map((elt) => this.visitAnyNode(elt)))
    return wrapInBlock(content)
  },

  visitTSInterfaceDeclaration(
    this: Visitor,
    tsInterfaceDeclaration: ts.TSInterfaceDeclaration,
  ): PrintedCode {
    return PrintedCode.joinInline([
      new PrintedCode(`interface ${this.visitIdentifier(tsInterfaceDeclaration.id)} `),
      this.visitTSInterfaceBody(tsInterfaceDeclaration.body),
    ])
  },

  visitTSMethodSignature(this: Visitor, tsMethodSignature: ts.TSMethodSignature): PrintedCode {
    const modifiers = []
    if (tsMethodSignature.kind === 'get') modifiers.push('get ')
    const name = this.visitAnyNode(tsMethodSignature.key)
    const nameWithModifiers = modifiers.join('') + name

    const params = tsMethodSignature.params
      .map((param) => this.visitAnyNode(param).toString())
      .join(', ')

    let returnType = ''
    if (tsMethodSignature.returnType !== undefined) {
      returnType = this.visitTSTypeAnnotation(tsMethodSignature.returnType).toString()
    }

    return new PrintedCode(`${nameWithModifiers}(${params})${returnType}`)
  },
}

export default TSPrinterImpl_classes
