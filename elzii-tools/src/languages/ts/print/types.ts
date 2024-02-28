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
  TSTypeReference,
} from '@module/languages/ts/ast'

type VisitTypes =
  | 'visitTSAnyKeyword'
  | 'visitTSArrayType'
  | 'visitTSNumberKeyword'
  | 'visitTSStringKeyword'
  | 'visitTSTypeAnnotation'
  | 'visitTSTypeReference'

const TSPrinterImpl_types: Pick<Visitor, VisitTypes> = {
  visitTSAnyKeyword(this: Visitor, tsAnyKeyword: TSAnyKeyword): PrintedCode {
    return new PrintedCode('any')
  },

  visitTSArrayType(this: Visitor, tsArrayType: TSArrayType): PrintedCode {
    return new PrintedCode(this.visitAnyNode(tsArrayType.elementType) + '[]')
  },

  visitTSNumberKeyword(this: Visitor, tsNumberKeyword: TSNumberKeyword): PrintedCode {
    return new PrintedCode('number')
  },

  visitTSStringKeyword(this: Visitor, tsStringKeyword: TSStringKeyword): PrintedCode {
    return new PrintedCode('string')
  },

  visitTSTypeAnnotation(this: Visitor, tsTypeAnnotation: ts.TSTypeAnnotation): PrintedCode {
    return new PrintedCode(`: ${this.visitAnyNode(tsTypeAnnotation.typeAnnotation)}`)
  },

  visitTSTypeReference(this: Visitor, tsTypeReference: TSTypeReference): PrintedCode {
    return this.visitAnyNode(tsTypeReference.typeName)
  },
}

export default TSPrinterImpl_types
