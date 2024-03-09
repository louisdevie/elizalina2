import { ListFormatImpl } from '@module/format/implementations/list'
import { ListFormatOptions } from '@module/format/list'

const fmt = () => new ListFormatImpl('test')

test('default format', () => {
  let opts = fmt().toOptions()

  let expected: ListFormatOptions = {
    language: 'test',
    type: 'list',
    listType: undefined,
    style: undefined,
    itemFormat: undefined,
  }

  expect(opts).toEqual(expected)
})

test('list types', () => {
  let opts = fmt().listType('conjunction').toOptions()
  expect(opts.listType).toEqual('conjunction')

  opts = fmt().conjunction.toOptions()
  expect(opts.listType).toEqual('conjunction')

  opts = fmt().disjunction.toOptions()
  expect(opts.listType).toEqual('disjunction')

  opts = fmt().unit.toOptions()
  expect(opts.listType).toEqual('unit')
})

test('list styles', () => {
  let opts = fmt().listStyle('short').toOptions()
  expect(opts.style).toEqual('short')

  opts = fmt().long.toOptions()
  expect(opts.style).toEqual('long')

  opts = fmt().short.toOptions()
  expect(opts.style).toEqual('short')

  opts = fmt().narrow.toOptions()
  expect(opts.style).toEqual('narrow')
})

test('list of numbers', () => {
  let opts = fmt().numberItems().toOptions()
  expect(opts.itemFormat).toEqual({
    type: 'number',
    language: 'test',
  })

  opts = fmt()
    .numberItems((f) => f.dontGroup)
    .toOptions()
  expect(opts.itemFormat).toEqual({
    type: 'number',
    language: 'test',
    useGrouping: false,
  })
})
