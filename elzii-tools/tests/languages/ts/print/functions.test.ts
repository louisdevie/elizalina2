import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

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
