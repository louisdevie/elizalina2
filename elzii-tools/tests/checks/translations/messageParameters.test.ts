import 'jest-extended'
import { Signature } from '@module/checks/translations/messageParameters'
import { MessageParameter, TypeHint } from '@module/translations'

function signatureFactory(translationId: string, parameters: MessageParameter[]): () => Signature {
  return () => new Signature(translationId, parameters)
}

test('Merging identical signatures', () => {
  let a = signatureFactory('A', [
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])
  let b = signatureFactory('B', [
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])

  let aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])

  // same both ways
  let bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeTrue()
  expect(bWithA).toEqual(aWithB)
})

test('Merging signatures with different order', () => {
  let a = signatureFactory('A', [
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])
  let b = signatureFactory('B', [
    { name: 'y', typeHint: TypeHint.List },
    { name: 'x', typeHint: TypeHint.Number },
  ])

  let aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])

  let bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeTrue()
  expect(Array.from(bWithA.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(bWithA.parameters).toStrictEqual([
    { name: 'y', typeHint: TypeHint.List },
    { name: 'x', typeHint: TypeHint.Number },
  ])
})

test('Merging signatures with more parameters in one', () => {
  let a = signatureFactory('A', [
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])
  let b = signatureFactory('B', [
    { name: 'y', typeHint: TypeHint.List },
    { name: 'z', typeHint: TypeHint.None },
    { name: 'x', typeHint: TypeHint.Number },
  ])

  let aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    // same order as the original signature
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
    // additional parameters go at the end
    { name: 'z', typeHint: TypeHint.None },
  ])

  let bWithA = b()
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
  let a = signatureFactory('A', [
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
    { name: 'q', typeHint: TypeHint.Datetime },
  ])
  let b = signatureFactory('B', [
    { name: 'y', typeHint: TypeHint.List },
    { name: 'z', typeHint: TypeHint.None },
    { name: 'x', typeHint: TypeHint.Number },
  ])

  let aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeFalse()
  // the object should not have changed
  expect(aWithB).toEqual(a())

  let bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeFalse()
  // the object should not have changed
  expect(bWithA).toEqual(b())
})

test('Merging signatures with different types', () => {
  let a = signatureFactory('A', [
    { name: 'x', typeHint: TypeHint.None },
    { name: 'y', typeHint: TypeHint.String },
  ])
  let b = signatureFactory('B', [
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.List },
  ])

  let aWithB = a()
  expect(aWithB.tryToMergeWith(b())).toBeTrue()
  expect(Array.from(aWithB.usedIn)).toIncludeSameMembers(['A', 'B'])
  expect(aWithB.parameters).toStrictEqual([
    { name: 'x', typeHint: TypeHint.Number },
    { name: 'y', typeHint: TypeHint.Mixed },
  ])

  // same both ways
  let bWithA = b()
  expect(bWithA.tryToMergeWith(a())).toBeTrue()
  expect(bWithA).toEqual(aWithB)
})
