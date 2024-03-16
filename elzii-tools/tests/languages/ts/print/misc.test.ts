import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing a BlockStatement', async () => {
  const printer = getTSPrinter()

  const empty = ts.blockStatement()
  expect(await printer.print(empty)).toMatchSnapshot()

  const withStatements = ts.blockStatement(
    ts.expressionStatement(ts.identifier('line1')),
    ts.expressionStatement(ts.identifier('line2')),
    ts.expressionStatement(ts.identifier('line3')),
  )
  expect(await printer.print(withStatements)).toMatchSnapshot()
})

test('printing a VariableDeclaration', async () => {
  const printer = getTSPrinter()

  const constDecl = ts.variableDeclaration('const', ts.identifier('myVar'), ts.literal('value'))
  expect(await printer.print(constDecl)).toMatchSnapshot()
})
