import {
  ExtendedMessagePart,
  MessageResolver,
  PreparedMessage,
} from '@module/extraction/translationFiles/PreparedMessage'
import {
  MessageParameter,
  MessageParameterSet,
  MessagePart,
  TypeHint,
  Visibility,
} from '@module/model'

function textPart(value: string): MessagePart {
  return { type: 'text', value }
}

function fmtPart(parameterName: string): ExtendedMessagePart {
  return { type: 'formatting', parameterName }
}

function params(...names: string[]): MessageParameterSet {
  return new MessageParameterSet(names.map((name) => ({ typeHint: TypeHint.None, name })))
}

function miPart(messageName: string): ExtendedMessagePart {
  return { type: 'interpolation', messageName }
}

class MapResolver implements MessageResolver {
  private _map: Map<string, PreparedMessage>

  public constructor(entries: [string, PreparedMessage][]) {
    this._map = new Map(entries)
  }

  public resolve(name: string): PreparedMessage | undefined {
    return this._map.get(name)
  }
}

test('bake without MI', () => {
  const preparedMessageX = new PreparedMessage(
    params(),
    [textPart('a'), textPart('b')],
    Visibility.Public,
  )

  const messageResolver = new MapResolver([['X', preparedMessageX]])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toBeEmpty()
  expect(messageX.value.content).toEqual([textPart('a'), textPart('b')])
})

test('bake with a simple MI', () => {
  const preparedMessageX = new PreparedMessage(
    params(),
    [textPart('a'), miPart('Z')],
    Visibility.Public,
  )
  const preparedMessageY = new PreparedMessage(
    params(),
    [miPart('Z'), textPart('a')],
    Visibility.Public,
  )
  const preparedMessageZ = new PreparedMessage(params(), [textPart('b')], Visibility.Public)

  const messageResolver = new MapResolver([
    ['X', preparedMessageX],
    ['Y', preparedMessageY],
    ['Z', preparedMessageZ],
  ])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toBeEmpty()
  expect(messageX.value.content).toEqual([textPart('a'), textPart('b')])

  const messageY = preparedMessageY.bake(messageResolver, 'Y')

  expect(messageY.errors.list).toBeEmpty()
  expect(messageY.value.content).toEqual([textPart('b'), textPart('a')])

  const messageZ = preparedMessageZ.bake(messageResolver, 'Z')

  expect(messageZ.errors.list).toBeEmpty()
  expect(messageZ.value.content).toEqual([textPart('b')])
})

test('bake with a nested MI', () => {
  const preparedMessageX = new PreparedMessage(
    params(),
    [textPart('a'), miPart('Y')],
    Visibility.Public,
  )
  const preparedMessageY = new PreparedMessage(
    params(),
    [miPart('Z'), textPart('c')],
    Visibility.Public,
  )
  const preparedMessageZ = new PreparedMessage(params(), [textPart('b')], Visibility.Public)

  const messageResolver = new MapResolver([
    ['X', preparedMessageX],
    ['Y', preparedMessageY],
    ['Z', preparedMessageZ],
  ])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toBeEmpty()
  expect(messageX.value.content).toEqual([textPart('a'), textPart('b'), textPart('c')])

  const messageY = preparedMessageY.bake(messageResolver, 'Y')

  expect(messageY.errors.list).toBeEmpty()
  expect(messageY.value.content).toEqual([textPart('b'), textPart('c')])

  const messageZ = preparedMessageZ.bake(messageResolver, 'Z')

  expect(messageZ.errors.list).toBeEmpty()
  expect(messageZ.value.content).toEqual([textPart('b')])
})

test('bake with a direct recursive MI', () => {
  const preparedMessageX = new PreparedMessage(
    params(),
    [textPart('a'), miPart('X')],
    Visibility.Public,
  )

  const messageResolver = new MapResolver([['X', preparedMessageX]])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toEqual([new Error('Message "X" references itself')])
  expect(messageX.value.content).toEqual([textPart('a')])
})

test('bake with a nested recursive MI (1)', () => {
  const preparedMessageX = new PreparedMessage(
    params(),
    [textPart('a'), miPart('Y')],
    Visibility.Public,
  )
  const preparedMessageY = new PreparedMessage(
    params(),
    [textPart('b'), miPart('Z')],
    Visibility.Public,
  )
  const preparedMessageZ = new PreparedMessage(
    params(),
    [textPart('c'), miPart('X')],
    Visibility.Public,
  )

  const messageResolver = new MapResolver([
    ['X', preparedMessageX],
    ['Y', preparedMessageY],
    ['Z', preparedMessageZ],
  ])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toEqual([new Error('Message "X" references itself')])
  expect(messageX.value.content).toEqual([textPart('a'), textPart('b'), textPart('c')])

  const messageY = preparedMessageY.bake(messageResolver, 'Y')

  // only one error is created
  expect(messageY.errors.list).toBeEmpty()
  // and the content rendering stops at X
  expect(messageY.value.content).toEqual([textPart('b'), textPart('c')])

  const messageZ = preparedMessageZ.bake(messageResolver, 'Z')

  // same as Y
  expect(messageZ.errors.list).toBeEmpty()
  expect(messageZ.value.content).toEqual([textPart('c')])
})

test('bake with a nested recursive MI (2)', () => {
  const preparedMessageX = new PreparedMessage(
    params(),
    [textPart('a'), miPart('Y')],
    Visibility.Public,
  )
  const preparedMessageY = new PreparedMessage(
    params(),
    [textPart('b'), miPart('Z')],
    Visibility.Public,
  )
  const preparedMessageZ = new PreparedMessage(
    params(),
    [textPart('c'), miPart('Y')],
    Visibility.Public,
  )

  const messageResolver = new MapResolver([
    ['X', preparedMessageX],
    ['Y', preparedMessageY],
    ['Z', preparedMessageZ],
  ])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toEqual([new Error('Message "Y" references itself')])
  expect(messageX.value.content).toEqual([textPart('a'), textPart('b'), textPart('c')])

  const messageY = preparedMessageY.bake(messageResolver, 'Y')

  // only one error is created
  expect(messageY.errors.list).toBeEmpty()
  expect(messageY.value.content).toEqual([textPart('b'), textPart('c')])

  const messageZ = preparedMessageZ.bake(messageResolver, 'Z')

  // same as Y
  expect(messageZ.errors.list).toBeEmpty()
  // content rendering stops at Y
  expect(messageZ.value.content).toEqual([textPart('c')])
})

test('bake with a parameter alongside a MI', () => {
  const preparedMessageX = new PreparedMessage(
    params('i'),
    [textPart('a'), fmtPart('i'), miPart('Y')],
    Visibility.Public,
  )
  const preparedMessageY = new PreparedMessage(params(), [textPart('b')], Visibility.Public)

  const messageResolver = new MapResolver([
    ['X', preparedMessageX],
    ['Y', preparedMessageY],
  ])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toBeEmpty()
  expect(messageX.value.parameters).toEqual(params('i'))
  expect(messageX.value.content).toEqual([textPart('a'), fmtPart('i'), textPart('b')])

  const messageY = preparedMessageY.bake(messageResolver, 'Y')

  expect(messageY.errors.list).toBeEmpty()
  expect(messageY.value.parameters).toBeEmpty()
  expect(messageY.value.content).toEqual([textPart('b')])
})

test('bake with a parameter inside a MI', () => {
  const preparedMessageX = new PreparedMessage(
    params(),
    [textPart('a'), miPart('Y')],
    Visibility.Public,
  )
  const preparedMessageY = new PreparedMessage(
    params('i'),
    [fmtPart('i'), textPart('b')],
    Visibility.Public,
  )

  const messageResolver = new MapResolver([
    ['X', preparedMessageX],
    ['Y', preparedMessageY],
  ])

  const messageX = preparedMessageX.bake(messageResolver, 'X')

  expect(messageX.errors.list).toBeEmpty()
  expect(messageX.value.parameters).toEqual(params('i'))
  expect(messageX.value.content).toEqual([textPart('a'), fmtPart('i'), textPart('b')])

  const messageY = preparedMessageY.bake(messageResolver, 'Y')

  expect(messageY.errors.list).toBeEmpty()
  expect(messageY.value.parameters).toEqual(params('i'))
  expect(messageY.value.content).toEqual([fmtPart('i'), textPart('b')])
})
