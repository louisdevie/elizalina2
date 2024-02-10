import {
  mergeTypeHints,
  MessagePart,
  normalizedMessageContent,
  TypeHint,
  TypeHint as TH,
} from '@module/translations'

test('message content normalization', () => {
  let rawContent: MessagePart[] = [
    { type: 'text', value: 'Try ' },
    { type: 'text', value: '"' },
    { type: 'formatting', parameterName: 'it' },
    { type: 'text', value: '"' },
    { type: 'text', value: ' out!' },
    { type: 'text', value: '\n' },
    { type: 'text', value: 'Another line of text...' },
  ]

  let expectedNormalizedContent: MessagePart[] = [
    { type: 'text', value: 'Try "' },
    { type: 'formatting', parameterName: 'it' },
    { type: 'text', value: '" out!\nAnother line of text...' },
  ]

  expect(normalizedMessageContent(rawContent)).toStrictEqual(expectedNormalizedContent)
})

test('merging type hints', () => {
  const hintsInOrder: TH[] = [TH.None, TH.Number, TH.String, TH.Datetime, TH.List, TH.Mixed]

  // the table is symmetric so the mirrored values are just null
  const expectedResults: (TH | null)[][] = [
    /*              none - number - string - datetime - list - mixed */
    /*     none */ [TH.None, TH.Number, TH.String, TH.Datetime, TH.List, TH.Mixed],
    /*   number */ [null, TH.Number, TH.Mixed, TH.Mixed, TH.Mixed, TH.Mixed],
    /*   string */ [null, null, TH.String, TH.Mixed, TH.Mixed, TH.Mixed],
    /* datetime */ [null, null, null, TH.Datetime, TH.Mixed, TH.Mixed],
    /*     list */ [null, null, null, null, TH.List, TH.Mixed],
    /*    mixed */ [null, null, null, null, null, TH.Mixed],
  ]

  for (let i = 0; i < 6; i++) {
    for (let j = i; j < 6; j++) {
      let first = hintsInOrder[i]
      let second = hintsInOrder[j]
      let result = expectedResults[i][j]

      // the operation should be commutative
      expect(mergeTypeHints(first, second)).toEqual(result)
      expect(mergeTypeHints(second, first)).toEqual(result)
    }
  }
})
