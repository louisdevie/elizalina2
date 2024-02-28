import { PrintedCode } from '@module/printing'
import { Visitor, wrapInBlock } from './helpers'
import { ClassBody, ClassDeclaration, MethodDefinition, TSClassImplements } from '../tsestree-spec'

type VisitClasses =
  | 'visitClassBody'
  | 'visitClassDeclaration'
  | 'visitMethodDefinition'
  | 'visitTSClassImplements'

const TSPrinterImpl_classes: Pick<Visitor, VisitClasses> = {
  visitClassBody(this: Visitor, classBody: ClassBody): PrintedCode {
    const content = PrintedCode.join(classBody.body.map((elt) => this.visitAnyNode(elt)))
    return wrapInBlock(content)
  },

  visitClassDeclaration(this: Visitor, classDeclaration: ClassDeclaration): PrintedCode {
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

  visitMethodDefinition(this: Visitor, methodDefinition: MethodDefinition): PrintedCode {
    const modifiers = []
    if (methodDefinition.kind === 'get') modifiers.push('get ')
    const name = this.visitAnyNode(methodDefinition.key)
    const nameWithModifiers = new PrintedCode(`${modifiers.join('')}${name}`)

    return PrintedCode.joinInline([nameWithModifiers, this.visitAnyNode(methodDefinition.value)])
  },

  visitTSClassImplements(this: Visitor, tsClassImplements: TSClassImplements): PrintedCode {
    return this.visitAnyNode(tsClassImplements.expression)
  },
}

export default TSPrinterImpl_classes
