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
  expect(await printer.print(withMethod)).toMatchSnapshot()
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

test('printing a MethodDefinitionNonComputedName', async () => {
  const printer = getTSPrinter()

  const noParameters = ts.methodDefinition('myMethod', {
    kind: 'method',
    params: [],
    body: ts.blockStatement(),
  })
  expect(await printer.print(noParameters)).toMatchSnapshot()

  const withParameters = ts.methodDefinition('myMethod', {
    kind: 'method',
    params: [ts.identifier('x'), ts.identifier('y')],
    body: ts.blockStatement(),
  })
  expect(await printer.print(withParameters)).toMatchSnapshot()

  const withTypes = ts.methodDefinition('myMethod', {
    kind: 'method',
    params: [ts.identifier('x', ts.tsNumberKeyword()), ts.identifier('y', ts.tsNumberKeyword())],
    returnType: ts.tsTypeAnnotation(ts.tsNumberKeyword()),
    body: ts.blockStatement(),
  })
  expect(await printer.print(withTypes)).toMatchSnapshot()

  const getter = ts.methodDefinition('myProperty', {
    kind: 'get',
    params: [],
    body: ts.blockStatement(),
  })
  expect(await printer.print(getter)).toMatchSnapshot()
})

test('printing a TSClassImplements', async () => {
  const printer = getTSPrinter()

  const impl = ts.tsClassImplements('MyInterface')
  expect(await printer.print(impl)).toMatchSnapshot()
})
