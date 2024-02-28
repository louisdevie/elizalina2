import {
  escapeDoubleQuotedString,
  escapeSingleQuotedString,
  escapeTemplateString,
  wrapInBlock,
} from '@module/languages/ts/print/helpers'
import { PrintedCode } from '@module/printing'

const testStringContent = '\\ \0 \n \r \v \t \b \f \' " ` ${ abc 123'

test('escapeSingleQuotedString', () => {
  const escaped = escapeSingleQuotedString(testStringContent)
  expect(escaped).toEqual('\\\\ \\0 \\n \\r \\v \\t \\b \\f \\\' " ` ${ abc 123')
})

test('escapeDoubleQuotedString', () => {
  const escaped = escapeDoubleQuotedString(testStringContent)
  expect(escaped).toEqual('\\\\ \\0 \\n \\r \\v \\t \\b \\f \' \\" ` ${ abc 123')
})

test('escapeTemplateString', () => {
  const escaped = escapeTemplateString(testStringContent)
  expect(escaped).toEqual('\\\\ \\0 \\n \\r \\v \\t \\b \\f \' " \\` \\${ abc 123')
})

test('wrapInBlock', () => {
  expect(wrapInBlock(new PrintedCode()).toString()).toMatchSnapshot()
  expect(wrapInBlock(new PrintedCode('line1', 'line2')).toString()).toMatchSnapshot()
})
