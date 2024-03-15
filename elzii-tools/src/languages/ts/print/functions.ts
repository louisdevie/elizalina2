import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor } from '@module/languages/ts/print/helpers'

type VisitFunctions =
  | 'visitArrowFunctionExpression'
  | 'visitCallExpression'
  | 'visitFunctionExpression'
  | 'visitReturnStatement'

const TSPrinterImpl_functions: Pick<Visitor, VisitFunctions> = {
  visitArrowFunctionExpression(
    this: Visitor,
    arrowFunctionExpression: ts.ArrowFunctionExpression,
  ): PrintedCode {
    const params = arrowFunctionExpression.params
      .map((param) => this.visitAnyNode(param).toString())
      .join(', ')

    let returnType = ''
    if (arrowFunctionExpression.returnType !== undefined) {
      returnType = this.visitTSTypeAnnotation(arrowFunctionExpression.returnType).toString()
    }

    let body = this.visitAnyNode(arrowFunctionExpression.body).toString()

    return PrintedCode.joinInline([new PrintedCode(`(${params})${returnType} => ${body}`)])
  },

  visitCallExpression(this: Visitor, callExpression: ts.CallExpression): PrintedCode {
    const args = callExpression.arguments.map((arg) => this.visitAnyNode(arg).toString()).join(', ')
    const callee = this.visitAnyNode(callExpression.callee)
    return new PrintedCode(`${callee}(${args})`)
  },

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

  visitReturnStatement(this: Visitor, returnStatement: ts.ReturnStatement): PrintedCode {
    let statement = 'return'

    if (returnStatement.argument !== null) {
      statement += ' '
      statement += this.visitAnyNode(returnStatement.argument)
    }

    return new PrintedCode(statement + ';')
  },
}

export default TSPrinterImpl_functions
