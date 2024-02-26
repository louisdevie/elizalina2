import { getTSPrinter } from '@module/languages/ts'
import * as ts from '@module/languages/ts/ast'

test('printing an Identifier', async () => {
  const printer = getTSPrinter()

  const ident = ts.identifier('something')
  expect(await printer.print(ident)).toMatchSnapshot()
})
