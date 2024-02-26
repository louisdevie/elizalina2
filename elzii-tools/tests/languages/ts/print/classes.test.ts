import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'
import { AST_NODE_TYPES } from '@module/languages/ts/ast'

test('printing a ClassBody', async () => {
  const printer = getTSPrinter()

  const empty = ts.classBody()
  expect(await printer.print(empty)).toMatchSnapshot()

  const withMethod = ts.classBody(
    ts.methodDefinition('doNothing', { params: [], body: ts.blockStatement() }),
  )
  expect(await printer.print(empty)).toMatchSnapshot()
})

test('printing a ClassDeclarationWithName', async () => {
  const printer = getTSPrinter()

  const withoutImplements = ts.classDeclaration('MyClass')
  expect(await printer.print(withoutImplements)).toMatchSnapshot()

  const withImplements = ts.classDeclaration('MyClass', {
    implements: [ts.tsClassImplements('MyInterface')],
  })
  expect(await printer.print(withImplements)).toMatchSnapshot()
})

test('printing a TSClassImplements', async () => {
  const printer = getTSPrinter()

  const impl = ts.tsClassImplements('MyInterface')
  expect(await printer.print(impl)).toMatchSnapshot()
})

test('printing a TSClassImplements', async () => {
  const printer = getTSPrinter()

  const impl = ts.tsClassImplements('MyInterface')
  expect(await printer.print(impl)).toMatchSnapshot()
})
