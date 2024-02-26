import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing a Literal', async () => {
  const printer = getTSPrinter()

  const stringLiteral = ts.literal('Hello chat')
  expect(await printer.print(stringLiteral)).toMatchSnapshot()
})
