import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

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

  const method = ts.methodDefinition('myMethod', {
    kind: 'method',
    params: [],
    body: ts.blockStatement(),
  })
  expect(await printer.print(method)).toMatchSnapshot()

  const getter = ts.methodDefinition('myProperty', {
    kind: 'get',
    params: [],
    body: ts.blockStatement(),
  })
  expect(await printer.print(getter)).toMatchSnapshot()

  const constructor = ts.methodDefinition('constructor', {
    kind: 'constructor',
    params: [],
    body: ts.blockStatement(),
  })
  expect(await printer.print(constructor)).toMatchSnapshot()
})

test('printing a NewExpression', async () => {
  const printer = getTSPrinter()

  const newExpr = ts.newExpression(ts.identifier('MyClass'), [ts.literal('argument')])
  expect(await printer.print(newExpr)).toMatchSnapshot()

  const newExprWithTypeArgs = ts.newExpression(
    ts.identifier('MyClass'),
    [ts.literal('argument')],
    [ts.tsNumberKeyword()],
  )
  expect(await printer.print(newExprWithTypeArgs)).toMatchSnapshot()
})

test('printing a PropertyDefinition', async () => {
  const printer = getTSPrinter()

  const property = ts.propertyDefinition('_myProperty', ts.tsStringKeyword())
  expect(await printer.print(property)).toMatchSnapshot()
})

test('printing a TSClassImplements', async () => {
  const printer = getTSPrinter()

  const impl = ts.tsClassImplements('MyInterface')
  expect(await printer.print(impl)).toMatchSnapshot()
})

test('Printing a TSInterfaceBody', async () => {
  const printer = getTSPrinter()

  const empty = ts.tsInterfaceBody()
  expect(await printer.print(empty)).toMatchSnapshot()

  const withMethod = ts.tsInterfaceBody(ts.tsMethodSignature('doNothing', { params: [] }))
  expect(await printer.print(withMethod)).toMatchSnapshot()
})

test('Printing a TSInterfaceDeclaration', async () => {
  const printer = getTSPrinter()

  const interfaceDeclaration = ts.tsInterfaceDeclaration('MyInterface')
  expect(await printer.print(interfaceDeclaration)).toMatchSnapshot()
})

test('Printing a TSMethodSignature', async () => {
  const printer = getTSPrinter()

  const noParameters = ts.tsMethodSignature('myMethod', {
    kind: 'method',
    params: [],
  })
  expect(await printer.print(noParameters)).toMatchSnapshot()

  const withParameters = ts.tsMethodSignature('myMethod', {
    kind: 'method',
    params: [ts.identifier('x'), ts.identifier('y')],
  })
  expect(await printer.print(withParameters)).toMatchSnapshot()

  const withTypes = ts.tsMethodSignature('myMethod', {
    kind: 'method',
    params: [ts.identifier('x', ts.tsNumberKeyword()), ts.identifier('y', ts.tsNumberKeyword())],
    returnType: ts.tsTypeAnnotation(ts.tsNumberKeyword()),
  })
  expect(await printer.print(withTypes)).toMatchSnapshot()

  const getter = ts.tsMethodSignature('myProperty', {
    kind: 'get',
    params: [],
  })
  expect(await printer.print(getter)).toMatchSnapshot()
})
