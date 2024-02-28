import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor } from '@module/languages/ts/print/helpers'

type VisitFunctions = 'visitFunctionExpression'

const TSPrinterImpl_functions: Pick<Visitor, VisitFunctions> = {
  visitFunctionExpression(this: Visitor, functionExpression: ts.FunctionExpression): PrintedCode {
    const params = functionExpression.params
      .map((param) => this.visitAnyNode(param).toString())
      .join(', ')

    let returnType = ''
    if (functionExpression.returnType !== undefined) {
      returnType = this.visitTSTypeAnnotation(functionExpression.returnType).toString()
    }

    return PrintedCode.joinInline([
      new PrintedCode(`(${params})${returnType} `),
      this.visitBlockStatement(functionExpression.body),
    ])
  },
}

export default TSPrinterImpl_functions
