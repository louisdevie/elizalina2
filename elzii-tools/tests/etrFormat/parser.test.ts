import { defaultEtrParser } from '@module/etrFormat'
import { Message, TypeHint, UserCode } from '@module/translations'

test('parsing only a comment', async () => {
  const rawEtr = '# this is a comment !'
  let tr = await defaultEtrParser.parse(rawEtr)

  expect(tr.header).toBeUndefined()
  expect(tr.messages).toStrictEqual({})
})

test('parsing a single entry', async () => {
  const withSingleQuotes = "nothing = 'Rien'"
  const withDoubleQuotes = 'nothing = "Rien"'

  const expectedMessages: Record<string, Message> = {
    nothing: {
      parameters: [],
      content: [{ type: 'text', value: 'Rien' }],
    },
  }

  const trFromSingleQuotes = await defaultEtrParser.parse(withSingleQuotes)
  expect(trFromSingleQuotes.header).toBeUndefined()
  expect(trFromSingleQuotes.messages).toStrictEqual(expectedMessages)

  const trFromDoubleQuotes = await defaultEtrParser.parse(withDoubleQuotes)
  expect(trFromDoubleQuotes.header).toBeUndefined()
  expect(trFromDoubleQuotes.messages).toStrictEqual(expectedMessages)
})

test('parsing multiple entries', async () => {
  const text = "nothing = 'Rien' \n # a comment in between \n everything = 'Tout'"

  const expectedMessages: Record<string, Message> = {
    nothing: {
      parameters: [],
      content: [{ type: 'text', value: 'Rien' }],
    },
    everything: {
      parameters: [],
      content: [{ type: 'text', value: 'Tout' }],
    },
  }

  const tr = await defaultEtrParser.parse(text)
  expect(tr.header).toBeUndefined()
  expect(tr.messages).toStrictEqual(expectedMessages)
})

test('parsing a complex entry', async () => {
  const withSingleQuotes =
    "greeting = 'Hello {name}! Here are some escaped characters: \\\\ \\n \\t \\r \\' {{ }}'"
  const withDoubleQuotes =
    'greeting = "Hello {name}! Here are some escaped characters: \\\\ \\n \\t \\r \\" {{ }}"'

  const expectedMessages: Record<string, Message> = {
    greeting: {
      parameters: [{ name: 'name', typeHint: TypeHint.None }],
      content: [
        { type: 'text', value: 'Hello ' },
        { type: 'formatting', parameterName: 'name', format: undefined },
        { type: 'text', value: "! Here are some escaped characters: \\ \n \t \r ' { }" },
      ],
    },
  }

  const trFromSingleQuotes = await defaultEtrParser.parse(withSingleQuotes)
  expect(trFromSingleQuotes.header).toBeUndefined()
  expect(trFromSingleQuotes.messages).toStrictEqual(expectedMessages)

  const trFromDoubleQuotes = await defaultEtrParser.parse(withDoubleQuotes)
  ;(expectedMessages['greeting'].content[2] as { value: string }).value =
    '! Here are some escaped characters: \\ \n \t \r " { }'
  expect(trFromDoubleQuotes.header).toBeUndefined()
  expect(trFromDoubleQuotes.messages).toStrictEqual(expectedMessages)
})

test('parsing an entry with custom format', async () => {
  const withBasicSyntax = 'length = "Longueur: {size|$f.number.unit("meter").long}"'
  const withShorthandSyntax = 'length = "Longueur: {size:number.unit("meter").long}"'

  const expectedMessages: Record<string, Message> = {
    length: {
      parameters: [{ name: 'size', typeHint: TypeHint.Number }],
      content: [
        { type: 'text', value: 'Longueur: ' },
        {
          type: 'formatting',
          parameterName: 'size',
          format: new UserCode('$f.number.unit("meter").long'),
        },
      ],
    },
  }

  const trFromBasicSyntax = await defaultEtrParser.parse(withBasicSyntax)
  expect(trFromBasicSyntax.header).toBeUndefined()
  expect(trFromBasicSyntax.messages).toStrictEqual(expectedMessages)

  const trFromShorthandSyntax = await defaultEtrParser.parse(withShorthandSyntax)
  expect(trFromShorthandSyntax.header).toBeUndefined()
  expect(trFromShorthandSyntax.messages).toStrictEqual(expectedMessages)
})

test('parsing a translation with a header', async () => {
  const text = "@{ import { myFunction } from '../myModule' } \n nothing = 'Rien'"

  const expectedMessages: Record<string, Message> = {
    nothing: {
      parameters: [],
      content: [{ type: 'text', value: 'Rien' }],
    },
  }

  const tr = await defaultEtrParser.parse(text)
  expect(tr.header).toEqual(new UserCode(" import { myFunction } from '../myModule' "))
  expect(tr.messages).toStrictEqual(expectedMessages)
})
