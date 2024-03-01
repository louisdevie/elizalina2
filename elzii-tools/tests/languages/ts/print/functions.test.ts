import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing a CallExpression', async () => {
  const printer = getTSPrinter()

  const noArguments = ts.callExpression(ts.identifier('myFunction'))
  expect(await printer.print(noArguments)).toMatchSnapshot()

  const withArguments = ts.callExpression(
    ts.identifier('myFunction'),
    ts.literal('arg1'),
    ts.literal('arg2'),
  )
  expect(await printer.print(withArguments)).toMatchSnapshot()
})

test('printing a FunctionExpression', async () => {
  const printer = getTSPrinter()

  const noParameters = ts.functionExpression(null, {
    params: [],
    body: ts.blockStatement(),
  })
  expect(await printer.print(noParameters)).toMatchSnapshot()

  const withParameters = ts.functionExpression(null, {
    params: [ts.identifier('x'), ts.identifier('y')],
    body: ts.blockStatement(),
  })
  expect(await printer.print(withParameters)).toMatchSnapshot()

  const withTypes = ts.functionExpression(null, {
    params: [ts.identifier('x', ts.tsNumberKeyword()), ts.identifier('y', ts.tsNumberKeyword())],
    returnType: ts.tsTypeAnnotation(ts.tsNumberKeyword()),
    body: ts.blockStatement(),
  })
  expect(await printer.print(withTypes)).toMatchSnapshot()
})

test('printing a ReturnStatement', async () => {
  const printer = getTSPrinter()

  const noValue = ts.returnStatement()
  expect(await printer.print(noValue)).toMatchSnapshot()

  const withValue = ts.returnStatement(ts.identifier('someValue'))
  expect(await printer.print(withValue)).toMatchSnapshot()
})
