import { intoPromise } from '@module/helpers'

test('intoPromise', () => {
  expect(intoPromise(3)).resolves.toEqual(3)
  expect(intoPromise(Promise.resolve(3))).resolves.toEqual(3)
})
