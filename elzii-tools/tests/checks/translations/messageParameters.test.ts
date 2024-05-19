import 'jest-extended'
import { Signature } from '@module/checks/translations/messageParameters'
import { MessageParameterSet, TypeHint } from '@module/model'

function signatureFactory(translationId: string, parameters: MessageParameterSet): () => Signature {
  return () => new Signature(translationId, parameters)
}

test('Merging identical signatures', () => {
  const a = signatureFactory(
    'A',
    new MessageParameterSet([
      { name: 'x', typeHint: TypeHint.Number },
      { name: 'y', typeHint: TypeHint.List },
    ]),
  )
  const b = signatureFactory(
    'B',
    new MessageParameterSet([
      { name: 'x', typeHint: TypeHint.Number },
      { name: 'y', typeHint: TypeHint.List },
    ]),
  )

  const aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])

  // same both ways
  const bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeTrue()
  expect(bWithA).toEqual(aWithB)
})

test('Merging signatures with different order', () => {
  const a = signatureFactory(
    'A',
    new MessageParameterSet([
      { name: 'x', typeHint: TypeHint.Number },
      { name: 'y', typeHint: TypeHint.List },
    ]),
  )
  const b = signatureFactory(
    'B',
    new MessageParameterSet([
      { name: 'y', typeHint: TypeHint.List },
      { name: 'x', typeHint: TypeHint.Number },
    ]),
  )

  const aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])

  const bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeTrue()
  expect(Array.from(bWithA.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(bWithA.parameters).toStrictEqual([
    { name: 'y', typeHint: TypeHint.List },
    { name: 'x', typeHint: TypeHint.Number },
  ])
})

test('Merging signatures with more parameters in one', () => {
  const a = signatureFactory(
    'A',
    new MessageParameterSet([
      { name: 'x', typeHint: TypeHint.Number },
      { name: 'y', typeHint: TypeHint.List },
    ]),
  )
  const b = signatureFactory(
    'B',
    new MessageParameterSet([
      { name: 'y', typeHint: TypeHint.List },
      { name: 'z', typeHint: TypeHint.None },
      { name: 'x', typeHint: TypeHint.Number },
    ]),
  )

  const aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    // same order as the original signature
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
    // additional parameters go at the end
    { name: 'z', typeHint: TypeHint.None },
  ])

  const bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeTrue()
  expect(Array.from(bWithA.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(bWithA.parameters).toStrictEqual([
    // same order as the original signature
    { name: 'y', typeHint: TypeHint.List },
    { name: 'x', typeHint: TypeHint.Number },
    // additional parameters go at the end
    { name: 'z', typeHint: TypeHint.None },
  ])
})

test('Merging signatures with more parameters in each', () => {
  const a = signatureFactory(
    'A',
    new MessageParameterSet([
      { name: 'x', typeHint: TypeHint.Number },
      { name: 'y', typeHint: TypeHint.List },
      { name: 'q', typeHint: TypeHint.Datetime },
    ]),
  )
  const b = signatureFactory(
    'B',
    new MessageParameterSet([
      { name: 'y', typeHint: TypeHint.List },
      { name: 'z', typeHint: TypeHint.None },
      { name: 'x', typeHint: TypeHint.Number },
    ]),
  )

  const aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeFalse()
  // the object should not have changed
  expect(aWithB).toEqual(a())

  const bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeFalse()
  // the object should not have changed
  expect(bWithA).toEqual(b())
})

test('Merging signatures with different types', () => {
  const a = signatureFactory(
    'A',
    new MessageParameterSet([
      { name: 'x', typeHint: TypeHint.None },
      { name: 'y', typeHint: TypeHint.String },
    ]),
  )
  const b = signatureFactory(
    'B',
    new MessageParameterSet([
      { name: 'x', typeHint: TypeHint.Number },
      { name: 'y', typeHint: TypeHint.List },
    ]),
  )

  const aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.Mixed },
  ])

  // same both ways
  const bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeTrue()
  expect(bWithA).toEqual(aWithB)
})
