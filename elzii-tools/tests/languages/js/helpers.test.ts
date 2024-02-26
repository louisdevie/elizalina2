import { toIdentifier } from '@module/languages/js/helpers'

test('toIdentifier', () => {
  expect(toIdentifier('hello world')).toEqual('hello_world')
  expect(toIdentifier('1234')).toEqual('_1234')
  expect(toIdentifier('yay pancakes! 🥞')).toEqual('yay_pancakes')
})
