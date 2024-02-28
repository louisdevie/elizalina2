import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing a BlockComment', async () => {
  const printer = getTSPrinter()

  const singleLine = ts.blockComment('Single line')
  expect(await printer.print(singleLine)).toMatchSnapshot()

  const multiLine = ts.blockComment('Multi\nline')
  expect(await printer.print(multiLine)).toMatchSnapshot()
})

test('printing a Literal', async () => {
  const printer = getTSPrinter()

  const stringLiteral = ts.literal('Hello chat')
  expect(await printer.print(stringLiteral)).toMatchSnapshot()
})
