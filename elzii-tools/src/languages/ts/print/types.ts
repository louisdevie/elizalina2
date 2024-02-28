import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor } from './helpers'
import { TSNumberKeyword, tsTypeAnnotation } from '@module/languages/ts/ast'

type VisitTypes = 'visitTSTypeAnnotation' | 'visitTSNumberKeyword'

const TSPrinterImpl_types: Pick<Visitor, VisitTypes> = {
  visitTSTypeAnnotation(this: Visitor, tsTypeAnnotation: ts.TSTypeAnnotation): PrintedCode {
    return new PrintedCode(`: ${this.visitAnyNode(tsTypeAnnotation.typeAnnotation)}`)
  },

  visitTSNumberKeyword(this: Visitor, tsNumberKeyword: TSNumberKeyword): PrintedCode {
    return new PrintedCode('number')
  },
}

export default TSPrinterImpl_types
