import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

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

  const emptyProgram = ts.program('module')

  expect(await printer.print(emptyProgram)).toMatchSnapshot()
})
