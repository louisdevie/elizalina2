import { mergeTypeHints, TypeHint as TH } from '@module/model/TypeHint'

test('mergeTypeHints', () => {
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
      const first = hintsInOrder[i]
      const second = hintsInOrder[j]
      const result = expectedResults[i][j]

      // the operation should be commutative
      expect(mergeTypeHints(first, second)).toEqual(result)
      expect(mergeTypeHints(second, first)).toEqual(result)
    }
  }
})
