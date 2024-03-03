import { defaultTMParser } from '@module/languages/tm'
import { Message, TypeHint, UserCode } from '@module/translations'

test('parsing only a comment', async () => {
  const rawEtr = '# this is a comment !'
  let tr = await defaultTMParser.parse(rawEtr)

  expect(tr.header).toBeUndefined()
  expect(tr.messages).toStrictEqual(new Map())
})

test('parsing a single entry', async () => {
  const withSingleQuotes = "nothing = 'Rien'"
  const withDoubleQuotes = 'nothing = "Rien"'

  const expectedMessages: Map<string, Message> = new Map()
  expectedMessages.set('nothing', {
    parameters: [],
    content: [{ type: 'text', value: 'Rien' }],
  })

  const trFromSingleQuotes = await defaultTMParser.parse(withSingleQuotes)
  expect(trFromSingleQuotes.header).toBeUndefined()
  expect(trFromSingleQuotes.messages).toStrictEqual(expectedMessages)

  const trFromDoubleQuotes = await defaultTMParser.parse(withDoubleQuotes)
  expect(trFromDoubleQuotes.header).toBeUndefined()
  expect(trFromDoubleQuotes.messages).toStrictEqual(expectedMessages)
})

test('parsing multiple entries', async () => {
  const text = "nothing = 'Rien' \n # a comment in between \n everything = 'Tout'"

  const expectedMessages: Map<string, Message> = new Map()
  expectedMessages.set('nothing', {
    parameters: [],
    content: [{ type: 'text', value: 'Rien' }],
  })
  expectedMessages.set('everything', {
    parameters: [],
    content: [{ type: 'text', value: 'Tout' }],
  })

  const tr = await defaultTMParser.parse(text)
  expect(tr.header).toBeUndefined()
  expect(tr.messages).toStrictEqual(expectedMessages)
})

test('parsing a complex entry', async () => {
  const withSingleQuotes =
    "greeting = 'Hello {name}! Here are some escaped characters: \\\\ \\n \\t \\r \\' {{ }}'"
  const withDoubleQuotes =
    'greeting = "Hello {name}! Here are some escaped characters: \\\\ \\n \\t \\r \\" {{ }}"'

  const expectedMessages: Map<string, Message> = new Map()
  expectedMessages.set('greeting', {
    parameters: [{ name: 'name', typeHint: TypeHint.None }],
    content: [
      { type: 'text', value: 'Hello ' },
      { type: 'formatting', parameterName: 'name', format: undefined },
      { type: 'text', value: "! Here are some escaped characters: \\ \n \t \r ' { }" },
    ],
  })

  const trFromSingleQuotes = await defaultTMParser.parse(withSingleQuotes)
  expect(trFromSingleQuotes.header).toBeUndefined()
  expect(trFromSingleQuotes.messages).toStrictEqual(expectedMessages)

  const trFromDoubleQuotes = await defaultTMParser.parse(withDoubleQuotes)
  ;(expectedMessages.get('greeting')?.content[2] as { value: string }).value =
    '! Here are some escaped characters: \\ \n \t \r " { }'
  expect(trFromDoubleQuotes.header).toBeUndefined()
  expect(trFromDoubleQuotes.messages).toStrictEqual(expectedMessages)
})

test('parsing an entry with custom format', async () => {
  const withBasicSyntax = 'length = "Longueur: {size|$f.number.unit("meter").long}"'
  const withShorthandSyntax = 'length = "Longueur: {size:number.unit("meter").long}"'

  const expectedMessages: Map<string, Message> = new Map()
  expectedMessages.set('length', {
    parameters: [{ name: 'size', typeHint: TypeHint.Number }],
    content: [
      { type: 'text', value: 'Longueur: ' },
      {
        type: 'formatting',
        parameterName: 'size',
        format: new UserCode('$f.number.unit("meter").long'),
      },
    ],
  })

  const trFromBasicSyntax = await defaultTMParser.parse(withBasicSyntax)
  expect(trFromBasicSyntax.header).toBeUndefined()
  expect(trFromBasicSyntax.messages).toStrictEqual(expectedMessages)

  const trFromShorthandSyntax = await defaultTMParser.parse(withShorthandSyntax)
  expect(trFromShorthandSyntax.header).toBeUndefined()
  expect(trFromShorthandSyntax.messages).toStrictEqual(expectedMessages)
})

test('parsing entries with different content structures', async () => {
  const messages =
    'formatOnly = "{and}"\n' +
    'textBeforeOnly = "\'round {and}"\n' +
    'textAfterOnly = "{and} around"\n' +
    'textAround = "\'round {and} around"\n'

  const expectedMessages: Map<string, Message> = new Map()
  expectedMessages.set('formatOnly', {
    parameters: [{ name: 'and', typeHint: TypeHint.None }],
    content: [{ type: 'formatting', parameterName: 'and', format: undefined }],
  })
  expectedMessages.set('textBeforeOnly', {
    parameters: [{ name: 'and', typeHint: TypeHint.None }],
    content: [
      { type: 'text', value: "'round " },
      { type: 'formatting', parameterName: 'and', format: undefined },
    ],
  })
  expectedMessages.set('textAfterOnly', {
    parameters: [{ name: 'and', typeHint: TypeHint.None }],
    content: [
      { type: 'formatting', parameterName: 'and', format: undefined },
      { type: 'text', value: ' around' },
    ],
  })
  expectedMessages.set('textAround', {
    parameters: [{ name: 'and', typeHint: TypeHint.None }],
    content: [
      { type: 'text', value: "'round " },
      { type: 'formatting', parameterName: 'and', format: undefined },
      { type: 'text', value: ' around' },
    ],
  })

  const translation = await defaultTMParser.parse(messages)
  expect(translation.header).toBeUndefined()
  expect(translation.messages).toStrictEqual(expectedMessages)
})

test('parsing a translation with a header', async () => {
  const text = "@{ import { myFunction } from '../myModule' } \n nothing = 'Rien'"

  const expectedMessages: Map<string, Message> = new Map()
  expectedMessages.set('nothing', {
    parameters: [],
    content: [{ type: 'text', value: 'Rien' }],
  })

  const tr = await defaultTMParser.parse(text)
  expect(tr.header).toEqual(new UserCode(" import { myFunction } from '../myModule' "))
  expect(tr.messages).toStrictEqual(expectedMessages)
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
  expect(tr.header).toBeUndefined()
  expect(tr.messages).toStrictEqual(expectedMessages)
})
