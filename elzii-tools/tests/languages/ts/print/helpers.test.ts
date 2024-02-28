import {
  escapeDoubleQuotedString,
  escapeSingleQuotedString,
  wrapInBlock,
} from '@module/languages/ts/print/helpers'
import { PrintedCode } from '@module/printing'

test('escapeSingleQuotedString', () => {
  const escaped = escapeSingleQuotedString('\\ \0 \n \r \v \t \b \f \' " abc 123')
  // the single quote should be escaped but not the double one
  expect(escaped).toEqual('\\\\ \\0 \\n \\r \\v \\t \\b \\f \\\' " abc 123')
})

test('escapeDoubleQuotedString', () => {
  const escaped = escapeDoubleQuotedString('\\ \0 \n \r \v \t \b \f \' " abc 123')
  // here it's the opposite, the double quote should be escaped but not the single one
  expect(escaped).toEqual('\\\\ \\0 \\n \\r \\v \\t \\b \\f \' \\" abc 123')
})

test('wrapInBlock', () => {
  expect(wrapInBlock(new PrintedCode()).toString()).toMatchSnapshot()
  expect(wrapInBlock(new PrintedCode('line1', 'line2')).toString()).toMatchSnapshot()
})
