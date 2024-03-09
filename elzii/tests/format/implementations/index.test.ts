import { FormatImpl } from '@module/format/implementations'

test('number format', () => {
  let opts = new FormatImpl('fr-FR').number.toOptions()

  expect(opts.language).toEqual('fr-FR')
  expect(opts.type).toEqual('number')
})

test('list format', () => {
  let opts = new FormatImpl('fr-FR').list.toOptions()

  expect(opts.language).toEqual('fr-FR')
  expect(opts.type).toEqual('list')
})

test('date and time format', () => {
  let opts = new FormatImpl('fr-FR').datetime.toOptions()

  expect(opts.language).toEqual('fr-FR')
  expect(opts.type).toEqual('datetime')
})
