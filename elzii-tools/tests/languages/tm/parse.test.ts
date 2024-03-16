import { defaultTMParser } from '@module/languages/tm'
import { Message } from '@module/translations'
import { getDirectivesData, getMessageData } from './astHelpers'

test('parsing only a comment', async () => {
  const text = '# this is a comment !'

  let tr = await defaultTMParser.parse(text)
  expect(tr.directive_list()).toEqual([])
  expect(tr.header()).toBeNull()
  expect(tr.message_list()).toEqual([])
})

test('parsing a single entry', async () => {
  const withSingleQuotes = "nothing = 'Rien'"
  const withDoubleQuotes = 'nothing = "Rien"'

  const trFromSingleQuotes = await defaultTMParser.parse(withSingleQuotes)
  expect(trFromSingleQuotes.directive_list()).toEqual([])
  expect(trFromSingleQuotes.header()).toBeNull()
  let messageData = getMessageData(trFromSingleQuotes.message(0))
  expect(messageData.key).toEqual('nothing')
  expect(messageData.singleQuotedText).toEqual({ literals: ['Rien'], escapes: [], parameters: [] })
  expect(messageData.doubleQuotedText).toBeNull()

  const trFromDoubleQuotes = await defaultTMParser.parse(withDoubleQuotes)
  expect(trFromDoubleQuotes.directive_list()).toEqual([])
  expect(trFromDoubleQuotes.header()).toBeNull()
  messageData = getMessageData(trFromDoubleQuotes.message(0))
  expect(messageData.key).toEqual('nothing')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText).toEqual({ literals: ['Rien'], escapes: [], parameters: [] })
})

test('parsing multiple entries', async () => {
  const text = "nothing = 'Rien' \n # a comment in between \n everything = 'Tout'"

  const tr = await defaultTMParser.parse(text)
  expect(tr.directive_list()).toEqual([])
  expect(tr.header()).toBeNull()

  let messageData = getMessageData(tr.message(0))
  expect(messageData.key).toEqual('nothing')
  expect(messageData.singleQuotedText).toEqual({ literals: ['Rien'], escapes: [], parameters: [] })
  expect(messageData.doubleQuotedText).toBeNull()

  messageData = getMessageData(tr.message(1))
  expect(messageData.key).toEqual('everything')
  expect(messageData.singleQuotedText).toEqual({ literals: ['Tout'], escapes: [], parameters: [] })
  expect(messageData.doubleQuotedText).toBeNull()
})

test('parsing a complex entry', async () => {
  const withSingleQuotes =
    "greeting = 'Hello {name}! Here are some escaped characters: \\\\ \\n \\t \\r \\' {{ }}'"
  const withDoubleQuotes =
    'greeting = "Hello {name}! Here are some escaped characters: \\\\ \\n \\t \\r \\" {{ }}"'

  const expectedLiterals = [
    'Hello ',
    '! Here are some escaped characters: ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
  ]
  const expectedSingleQuoteEscapes = ['\\\\', '\\n', '\\t', '\\r', "\\'", '{{', '}}']
  const expectedDoubleQuoteEscapes = ['\\\\', '\\n', '\\t', '\\r', '\\"', '{{', '}}']
  const expectedParameters = [{ name: 'name', format: null, custom: null }]

  const trFromSingleQuotes = await defaultTMParser.parse(withSingleQuotes)
  expect(trFromSingleQuotes.directive_list()).toEqual([])
  expect(trFromSingleQuotes.header()).toBeNull()
  let messageData = getMessageData(trFromSingleQuotes.message(0))
  expect(messageData.key).toEqual('greeting')
  expect(messageData.singleQuotedText?.literals).toEqual(expectedLiterals)
  expect(messageData.singleQuotedText?.escapes).toEqual(expectedSingleQuoteEscapes)
  expect(messageData.singleQuotedText?.parameters).toEqual(expectedParameters)
  expect(messageData.doubleQuotedText).toBeNull()

  const trFromDoubleQuotes = await defaultTMParser.parse(withDoubleQuotes)
  expect(trFromDoubleQuotes.directive_list()).toEqual([])
  expect(trFromDoubleQuotes.header()).toBeNull()
  messageData = getMessageData(trFromDoubleQuotes.message(0))
  expect(messageData.key).toEqual('greeting')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText?.literals).toEqual(expectedLiterals)
  expect(messageData.doubleQuotedText?.escapes).toEqual(expectedDoubleQuoteEscapes)
  expect(messageData.doubleQuotedText?.parameters).toEqual(expectedParameters)
})

test('parsing an entry with custom format', async () => {
  const withBasicSyntax = 'length = "Longueur: {size:number.unit("meter").long}"'
  const withCustomSyntax = 'length = "Longueur: {size|myCustomFormat}"'

  const trFromBasicSyntax = await defaultTMParser.parse(withBasicSyntax)
  expect(trFromBasicSyntax.directive_list()).toEqual([])
  expect(trFromBasicSyntax.header()).toBeNull()
  let messageData = getMessageData(trFromBasicSyntax.message(0))
  expect(messageData.key).toEqual('length')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText?.literals).toEqual(['Longueur: '])
  expect(messageData.doubleQuotedText?.escapes).toEqual([])
  expect(messageData.doubleQuotedText?.parameters).toEqual([
    { name: 'size', format: ':number.unit("meter").long}', custom: null },
  ])

  const trFromCustomSyntax = await defaultTMParser.parse(withCustomSyntax)
  expect(trFromCustomSyntax.directive_list()).toEqual([])
  expect(trFromCustomSyntax.header()).toBeNull()
  messageData = getMessageData(trFromCustomSyntax.message(0))
  expect(messageData.key).toEqual('length')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText?.literals).toEqual(['Longueur: '])
  expect(messageData.doubleQuotedText?.escapes).toEqual([])
  expect(messageData.doubleQuotedText?.parameters).toEqual([
    { name: 'size', format: null, custom: '|myCustomFormat}' },
  ])
})

test('parsing entries with different content structures', async () => {
  const messages =
    'formatOnly = "{and}"\n' +
    'textBeforeOnly = "\'round {and}"\n' +
    'textAfterOnly = "{and} around"\n' +
    'textAround = "\'round {and} around"\n'

  const tr = await defaultTMParser.parse(messages)
  expect(tr.directive_list()).toEqual([])
  expect(tr.header()).toBeNull()

  let messageData = getMessageData(tr.message(0))
  expect(messageData.key).toEqual('formatOnly')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText?.literals).toEqual([])
  expect(messageData.doubleQuotedText?.escapes).toEqual([])
  expect(messageData.doubleQuotedText?.parameters).toEqual([
    { name: 'and', format: null, custom: null },
  ])

  messageData = getMessageData(tr.message(1))
  expect(messageData.key).toEqual('textBeforeOnly')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText?.literals).toEqual(["'round "])
  expect(messageData.doubleQuotedText?.escapes).toEqual([])
  expect(messageData.doubleQuotedText?.parameters).toEqual([
    { name: 'and', format: null, custom: null },
  ])

  messageData = getMessageData(tr.message(2))
  expect(messageData.key).toEqual('textAfterOnly')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText?.literals).toEqual([' around'])
  expect(messageData.doubleQuotedText?.escapes).toEqual([])
  expect(messageData.doubleQuotedText?.parameters).toEqual([
    { name: 'and', format: null, custom: null },
  ])

  messageData = getMessageData(tr.message(3))
  expect(messageData.key).toEqual('textAround')
  expect(messageData.singleQuotedText).toBeNull()
  expect(messageData.doubleQuotedText?.literals).toEqual(["'round ", ' around'])
  expect(messageData.doubleQuotedText?.escapes).toEqual([])
  expect(messageData.doubleQuotedText?.parameters).toEqual([
    { name: 'and', format: null, custom: null },
  ])
})

test('parsing a translation with a header', async () => {
  const text = "@{ import { myFunction } from '../myModule' } \n nothing = 'Rien'"

  const tr = await defaultTMParser.parse(text)
  expect(tr.directive_list()).toEqual([])

  expect(tr.header().getText()).toEqual("@{ import { myFunction } from '../myModule' }")

  let messageData = getMessageData(tr.message(0))
  expect(messageData.key).toEqual('nothing')
  expect(messageData.singleQuotedText).toEqual({ literals: ['Rien'], escapes: [], parameters: [] })
  expect(messageData.doubleQuotedText).toBeNull()
})

test('parsing a translation with directives', async () => {
  // they should be valid but ignored
  const text = "@noArguments \n @withArguments x y z \n nothing = 'Rien'"

  const expectedMessages: Map<string, Message> = new Map()
  expectedMessages.set('nothing', {
    parameters: [],
    content: [{ type: 'text', value: 'Rien' }],
  })

  const tr = await defaultTMParser.parse(text)

  const expectedDirectives = [
    { name: '@noArguments', arguments: [] },
    { name: '@withArguments', arguments: ['x', 'y', 'z'] },
  ]

  let directivesData = getDirectivesData(tr.directive_list())
  expect(directivesData).toEqual(expectedDirectives)

  expect(tr.header()).toBeNull()
  let messageData = getMessageData(tr.message(0))
  expect(messageData.key).toEqual('nothing')
  expect(messageData.singleQuotedText).toEqual({ literals: ['Rien'], escapes: [], parameters: [] })
  expect(messageData.doubleQuotedText).toBeNull()
})
