import { PluralFormParser } from '@module/pluralFormat/parse'
import { PluralFormRenderer } from '@module/pluralFormat/render'
import { formatPluralForm } from '@module/pluralFormat'

test('processing plain text', () => {
  const text = 'No results found.'
  const value = '0'
  const parts = ['No results found.']
  const result = 'No results found.'
  expect(PluralFormParser.parse(text)).toEqual(parts)
  expect(PluralFormRenderer.render(parts, value)).toEqual(result)
  expect(formatPluralForm(text, value)).toEqual(result)
})

test('processing text with hashes', () => {
  const text = '# results found.'
  const value = '4'
  const parts = ['', ' results found.']
  const result = '4 results found.'
  expect(PluralFormParser.parse(text)).toEqual(parts)
  expect(PluralFormRenderer.render(parts, value)).toEqual(result)
  expect(formatPluralForm(text, value)).toEqual(result)
})

test('processing text with escaped hashes', () => {
  expect(PluralFormParser.parse('# results ## found. ### #### #####')).toEqual([
    '',
    ' results # found. #',
    ' ## ##',
    '',
  ])

  const text = '# results ## found. ### #### #####'
  const value = '4'
  const parts = ['', ' results # found. #', ' ## ##', '']
  const result = '4 results # found. #4 ## ##4'
  expect(PluralFormParser.parse(text)).toEqual(parts)
  expect(PluralFormRenderer.render(parts, value)).toEqual(result)
  expect(formatPluralForm(text, value)).toEqual(result)
})
