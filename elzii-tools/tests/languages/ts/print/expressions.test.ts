import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing an ArrayExpression', async () => {
  const printer = getTSPrinter()

  const empty = ts.arrayExpression()
  expect(await printer.print(empty)).toMatchSnapshot()

  const singleLine = ts.arrayExpression(ts.literal('A'), ts.literal('B'))
  expect(await printer.print(singleLine)).toMatchSnapshot()

  const multiLine = ts.arrayExpression(
    ts.literal('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
    ts.literal('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
  )
  expect(await printer.print(multiLine)).toMatchSnapshot()
})

test('printing an AssignmentExpression', async () => {
  const printer = getTSPrinter()

  const assign = ts.assignmentExpression(ts.identifier('myVariable'), ts.literal('value'))
  expect(await printer.print(assign)).toMatchSnapshot()
})

test('printing an Identifier', async () => {
  const printer = getTSPrinter()

  const ident = ts.identifier('something')
  expect(await printer.print(ident)).toMatchSnapshot()
})

test('printing an ImportExpression', async () => {
  const printer = getTSPrinter()

  const importExpr = ts.importExpression(ts.literal('./myModule.js'))
  expect(await printer.print(importExpr)).toMatchSnapshot()
})

test('printing a MemberExpression', async () => {
  const printer = getTSPrinter()

  const member = ts.memberExpression(ts.identifier('a'), 'b')
  expect(await printer.print(member)).toMatchSnapshot()
})

test('printing a ObjectExpression', async () => {
  const printer = getTSPrinter()

  const empty = ts.objectExpression()
  expect(await printer.print(empty)).toMatchSnapshot()

  const singleLine = ts.objectExpression(
    ts.property('a', ts.literal('A')),
    ts.property('b', ts.literal('B')),
  )
  expect(await printer.print(singleLine)).toMatchSnapshot()

  const multiLine = ts.objectExpression(
    ts.property('a', ts.literal('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')),
    ts.property('b', ts.literal('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')),
  )
  expect(await printer.print(multiLine)).toMatchSnapshot()

  const withMultiLineValue = ts.objectExpression(
    ts.property('a', ts.literal('A')),
    ts.property(
      'b',
      ts.arrayExpression(
        ts.literal('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
      ),
    ),
  )
  expect(await printer.print(withMultiLineValue)).toMatchSnapshot()
})

test('printing a Property', async () => {
  const printer = getTSPrinter()

  const property = ts.property('a', ts.literal('A'))
  expect(await printer.print(property)).toMatchSnapshot()
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

test('printing a ThisExpression', async () => {
  const printer = getTSPrinter()

  const thisExpr = ts.thisExpression()
  expect(await printer.print(thisExpr)).toMatchSnapshot()
})
