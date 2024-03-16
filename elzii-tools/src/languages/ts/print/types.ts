import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor } from './helpers'
import {
  TSAnyKeyword,
  tsArrayType,
  TSArrayType,
  TSNumberKeyword,
  TSStringKeyword,
  tsTypeAnnotation,
  TSTypeParameterInstantiation,
  tsTypeReference,
  TSTypeReference,
} from '@module/languages/ts/ast'

type VisitTypes =
  | 'visitTSAnyKeyword'
  | 'visitTSArrayType'
  | 'visitTSNumberKeyword'
  | 'visitTSStringKeyword'
  | 'visitTSTypeAnnotation'
  | 'visitTSTypeParameterInstantiation'
  | 'visitTSTypeReference'

const TSPrinterImpl_types: Pick<Visitor, VisitTypes> = {
  visitTSAnyKeyword(this: Visitor, _: TSAnyKeyword): PrintedCode {
    return new PrintedCode('any')
  },

  visitTSArrayType(this: Visitor, tsArrayType: TSArrayType): PrintedCode {
    return new PrintedCode(this.visitAnyNode(tsArrayType.elementType) + '[]')
  },

  visitTSNumberKeyword(this: Visitor, _: TSNumberKeyword): PrintedCode {
    return new PrintedCode('number')
  },

  visitTSStringKeyword(this: Visitor, _: TSStringKeyword): PrintedCode {
    return new PrintedCode('string')
  },

  visitTSTypeAnnotation(this: Visitor, tsTypeAnnotation: ts.TSTypeAnnotation): PrintedCode {
    return new PrintedCode(`: ${this.visitAnyNode(tsTypeAnnotation.typeAnnotation)}`)
  },

  visitTSTypeParameterInstantiation(
    this: Visitor,
    tsTypeParameterInstantiation: TSTypeParameterInstantiation,
  ): PrintedCode {
    const params = tsTypeParameterInstantiation.params.map((param) => this.visitAnyNode(param))
    return new PrintedCode(`<${params.join(', ')}>`)
  },

  visitTSTypeReference(this: Visitor, tsTypeReference: TSTypeReference): PrintedCode {
    let args = ''
    if (tsTypeReference.typeArguments !== undefined) {
      args = this.visitTSTypeParameterInstantiation(tsTypeReference.typeArguments).toString()
    }
    return new PrintedCode(this.visitAnyNode(tsTypeReference.typeName) + args)
  },
}

export default TSPrinterImpl_types
