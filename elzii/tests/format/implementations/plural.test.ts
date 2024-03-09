import { PluralFormatImpl } from '@module/format/implementations/plural'
import { PluralFormatOptions } from '@module/format/plural'

const fmt = () => new PluralFormatImpl('test')

test('default format', () => {
  let opts = fmt().toOptions()

  let expected: PluralFormatOptions = {
    language: 'test',
    type: 'plural',

    // the options inherited for number formatting are not tested here
    minimumIntegerDigits: undefined,
    minimumFractionDigits: undefined,
    maximumFractionDigits: undefined,
    maximumSignificantDigits: undefined,
    roundingMode: undefined,
    useGrouping: undefined,

    pluralType: undefined,
    zeroForm: undefined,
    oneForm: undefined,
    twoForm: undefined,
    fewForm: undefined,
    manyForm: undefined,
    otherForm: undefined,
  }

  expect(opts).toEqual(expected)
})

test('number types', () => {
  let opts = fmt().pluralType('cardinal').toOptions()
  expect(opts.pluralType).toEqual('cardinal')

  opts = fmt().cardinal.toOptions()
  expect(opts.pluralType).toEqual('cardinal')

  opts = fmt().ordinal.toOptions()
  expect(opts.pluralType).toEqual('ordinal')
})

test('forms', () => {
  let opts = fmt().zero('zero').toOptions()
  expect(opts.zeroForm).toEqual('zero')

  opts = fmt().one('one').toOptions()
  expect(opts.oneForm).toEqual('one')

  opts = fmt().two('two').toOptions()
  expect(opts.twoForm).toEqual('two')

  opts = fmt().few('few').toOptions()
  expect(opts.fewForm).toEqual('few')

  opts = fmt().many('many').toOptions()
  expect(opts.manyForm).toEqual('many')

  opts = fmt().other('other').toOptions()
  expect(opts.otherForm).toEqual('other')
})
