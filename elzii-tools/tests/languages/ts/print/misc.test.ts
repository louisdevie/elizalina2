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

test('printing an Identifier', async () => {
  const printer = getTSPrinter()

  const ident = ts.identifier('something')
  expect(await printer.print(ident)).toMatchSnapshot()
})

test('printing a TemplateElement', async () => {
  const printer = getTSPrinter()

  const elt = ts.templateElement('\' " ` $ { } ${} blah blah')
  expect(await printer.print(elt)).toMatchSnapshot()
})

test('printing a TemplateLiteral', async () => {
  const printer = getTSPrinter()

  const startsWithQuasi = ts.templateLiteral(
    ['something ', ' something, we win'],
    [ts.identifier('something')],
  )
  expect(await printer.print(startsWithQuasi)).toMatchSnapshot()

  const startsWithExpression = ts.templateLiteral(
    ['', ' something something, we '],
    [ts.identifier('something'), ts.identifier('win')],
  )
  expect(await printer.print(startsWithExpression)).toMatchSnapshot()
})
