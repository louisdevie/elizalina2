import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing an ExportDefaultDeclaration', async () => {
  const printer = getTSPrinter()

  const exportDefault = ts.exportDefaultDeclaration(ts.identifier('test'))
  expect(await printer.print(exportDefault)).toMatchSnapshot()
})

test('printing an ExportNamedDeclaration', async () => {
  const printer = getTSPrinter()

  const exportNamed = ts.exportNamedDeclaration(ts.classDeclaration('MyClass'))
  expect(await printer.print(exportNamed)).toMatchSnapshot()
})

test('printing an ExpressionStatement', async () => {
  const printer = getTSPrinter()

  const expr = ts.expressionStatement(ts.identifier('test'))
  expect(await printer.print(expr)).toMatchSnapshot()
})

test('printing an ImportDeclaration', async () => {
  const printer = getTSPrinter()

  const importDecl = ts.importDeclaration('value', 'myModule', [
    ts.importSpecifier('value', 'myFunction'),
  ])
  expect(await printer.print(importDecl)).toMatchSnapshot()
})

test('printing an ImportSpecifier', async () => {
  const printer = getTSPrinter()

  const importSpec = ts.importSpecifier('value', 'myFunction')
  expect(await printer.print(importSpec)).toMatchSnapshot()

  const importSpecWithAlias = ts.importSpecifier('value', 'myFunction', 'somethingElse')
  expect(await printer.print(importSpecWithAlias)).toMatchSnapshot()
})

test('printing a Program', async () => {
  const printer = getTSPrinter()

  const program = ts.program(
    'module',
    ts.expressionStatement(ts.identifier('line1')),
    ts.expressionStatement(ts.identifier('line2')),
    ts.expressionStatement(ts.identifier('line3')),
  )

  expect(await printer.print(program)).toMatchSnapshot()
})
