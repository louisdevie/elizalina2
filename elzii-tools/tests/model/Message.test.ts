import Message from '@module/model/Message'
import { Visibility } from '@module/model'

test('normalizeMessageContent', () => {
  const rawMessage = new Message(Visibility.Private, [
    { type: 'text', value: 'Try ' },
    { type: 'text', value: '"' },
    { type: 'formatting', parameterName: 'it' },
    { type: 'text', value: '"' },
    { type: 'text', value: ' out!' },
    { type: 'text', value: '\n' },
    { type: 'text', value: 'Another line of text...' },
  ])

  const expectedNormalizedMessage = new Message(Visibility.Private, [
    { type: 'text', value: 'Try "' },
    { type: 'formatting', parameterName: 'it' },
    { type: 'text', value: '" out!\nAnother line of text...' },
  ])

  rawMessage.normalizeMessageContent()

  expect(rawMessage).toStrictEqual(expectedNormalizedMessage)
})
