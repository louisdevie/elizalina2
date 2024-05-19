import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing a TSAnyKeyword', async () => {
  const printer = getTSPrinter()

  const anyKw = ts.tsAnyKeyword()
  expect(await printer.print(anyKw)).toMatchSnapshot()
})

test('printing a TSArrayType', async () => {
  const printer = getTSPrinter()

  const stringArray = ts.tsArrayType(ts.tsStringKeyword())
  expect(await printer.print(stringArray)).toMatchSnapshot()
})

test('printing a TSNumberKeyword', async () => {
  const printer = getTSPrinter()

  const numberKw = ts.tsNumberKeyword()
  expect(await printer.print(numberKw)).toMatchSnapshot()
})

test('printing a TSStringKeyword', async () => {
  const printer = getTSPrinter()

  const stringKw = ts.tsStringKeyword()
  expect(await printer.print(stringKw)).toMatchSnapshot()
})

test('printing a TSTypeAnnotation', async () => {
  const printer = getTSPrinter()

  const typeAnnotation = ts.tsTypeAnnotation(ts.tsStringKeyword())
  expect(await printer.print(typeAnnotation)).toMatchSnapshot()
})

test('printing a TSTypeParameterInstantiation', async () => {
  const printer = getTSPrinter()

  let typeArgs = ts.tsTypeParameterInstantiation([ts.tsNumberKeyword(), ts.tsStringKeyword()])
  expect(await printer.print(typeArgs)).toMatchSnapshot()
})

test('printing a TSTypeReference', async () => {
  const printer = getTSPrinter()

  let withoutArgs = ts.tsTypeReference(ts.identifier('MyType'))
  expect(await printer.print(withoutArgs)).toMatchSnapshot()

  let withArgs = ts.tsTypeReference(
    ts.identifier('MyType'),
    ts.tsNumberKeyword(),
    ts.tsStringKeyword(),
  )
  expect(await printer.print(withArgs)).toMatchSnapshot()
})
