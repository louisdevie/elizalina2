import { NumberFormatImpl } from '@module/format/implementations/number'
import { NumberFormatOptions } from '@module/format/number'

const fmt = () => new NumberFormatImpl('test')

test('default format', () => {
  let opts = fmt().toOptions()

  let expected: NumberFormatOptions = {
    language: 'test',
    type: 'number',
    minimumIntegerDigits: undefined,
    minimumFractionDigits: undefined,
    maximumFractionDigits: undefined,
    maximumSignificantDigits: undefined,
    roundingMode: undefined,
    useGrouping: undefined,
    numberingSystem: undefined,
    signDisplay: undefined,
    style: undefined,
    currency: undefined,
    currencyDisplay: undefined,
    currencySign: undefined,
    unit: undefined,
    unitDisplay: undefined,
  }

  expect(opts).toEqual(expected)
})

test('integer format', () => {
  let opts = fmt().integer().toOptions()
  expect(opts.minimumIntegerDigits).toEqual(0)
  expect(opts.maximumFractionDigits).toEqual(0)

  opts = fmt().integer(3).toOptions()
  expect(opts.minimumIntegerDigits).toEqual(3)
  expect(opts.maximumFractionDigits).toEqual(0)
})

test('fixed decimal format', () => {
  let opts = fmt().fixed(2).toOptions()

  expect(opts.minimumFractionDigits).toEqual(2)
  expect(opts.maximumFractionDigits).toEqual(2)
})

test('decimal format', () => {
  let opts = fmt().decimal(2).toOptions()
  expect(opts.minimumFractionDigits).toEqual(0)
  expect(opts.maximumFractionDigits).toEqual(2)

  opts = fmt().decimal(1, 5).toOptions()
  expect(opts.minimumFractionDigits).toEqual(1)
  expect(opts.maximumFractionDigits).toEqual(5)
})

test('significant digits format', () => {
  let opts = fmt().significant(3).toOptions()
  expect(opts.maximumSignificantDigits).toEqual(3)
})

test('rounding modes', () => {
  let opts = fmt().round('expand').toOptions()
  expect(opts.roundingMode).toEqual('expand')

  opts = fmt().ceil.toOptions()
  expect(opts.roundingMode).toEqual('ceil')

  opts = fmt().floor.toOptions()
  expect(opts.roundingMode).toEqual('floor')

  opts = fmt().expand.toOptions()
  expect(opts.roundingMode).toEqual('expand')

  opts = fmt().trunc.toOptions()
  expect(opts.roundingMode).toEqual('trunc')

  opts = fmt().halfCeil.toOptions()
  expect(opts.roundingMode).toEqual('halfCeil')

  opts = fmt().halfFloor.toOptions()
  expect(opts.roundingMode).toEqual('halfFloor')

  opts = fmt().halfExpand.toOptions()
  expect(opts.roundingMode).toEqual('halfExpand')

  opts = fmt().halfTrunc.toOptions()
  expect(opts.roundingMode).toEqual('halfTrunc')

  opts = fmt().halfEven.toOptions()
  expect(opts.roundingMode).toEqual('halfEven')
})

test('integer digit grouping', () => {
  let opts = fmt().useGrouping(true).toOptions()
  expect(opts.useGrouping).toEqual(true)

  opts = fmt().group.toOptions()
  expect(opts.useGrouping).toEqual(true)

  opts = fmt().dontGroup.toOptions()
  expect(opts.useGrouping).toEqual(false)
})

test('notations', () => {
  let opts = fmt().notation('engineering').toOptions()
  expect(opts.notation).toEqual('engineering')

  opts = fmt().standardNotation.toOptions()
  expect(opts.notation).toEqual('standard')

  opts = fmt().scientific.toOptions()
  expect(opts.notation).toEqual('scientific')

  opts = fmt().engineering.toOptions()
  expect(opts.notation).toEqual('engineering')

  opts = fmt().longCompact.toOptions()
  expect(opts.notation).toEqual('longCompact')

  opts = fmt().compact.toOptions()
  expect(opts.notation).toEqual('compact')
})

test('numbering system', () => {
  let opts = fmt().numberingSystem('mathbold').toOptions()
  expect(opts.numberingSystem).toEqual('mathbold')
})

test('sign display condition', () => {
  let opts = fmt().displaySign('exceptZero').toOptions()
  expect(opts.signDisplay).toEqual('exceptZero')
})

test('currency style', () => {
  let opts = fmt().currency('EUR').toOptions()
  expect(opts.style).toEqual('currency')
  expect(opts.currency).toEqual('EUR')
})

test('currency style: display modes', () => {
  let opts = fmt().currencyDisplay('narrowSymbol').toOptions()
  expect(opts.currencyDisplay).toEqual('narrowSymbol')

  opts = fmt().code.toOptions()
  expect(opts.currencyDisplay).toEqual('code')

  opts = fmt().symbol.toOptions()
  expect(opts.currencyDisplay).toEqual('symbol')

  opts = fmt().narrowSymbol.toOptions()
  expect(opts.currencyDisplay).toEqual('narrowSymbol')

  opts = fmt().name.toOptions()
  expect(opts.currencyDisplay).toEqual('name')
})

test('currency style: sign modes', () => {
  let opts = fmt().currencySign('accounting').toOptions()
  expect(opts.currencySign).toEqual('accounting')

  opts = fmt().standardSign.toOptions()
  expect(opts.currencySign).toEqual('standard')

  opts = fmt().accounting.toOptions()
  expect(opts.currencySign).toEqual('accounting')
})

test('percent style', () => {
  let opts = fmt().percent.toOptions()
  expect(opts.style).toEqual('percent')
})

test('unit style', () => {
  let opts = fmt().unit('liter').toOptions()
  expect(opts.style).toEqual('unit')
  expect(opts.unit).toEqual('liter')
})

test('unit style: display modes', () => {
  let opts = fmt().unitDisplay('short').toOptions()
  expect(opts.unitDisplay).toEqual('short')

  opts = fmt().short.toOptions()
  expect(opts.unitDisplay).toEqual('short')

  opts = fmt().narrow.toOptions()
  expect(opts.unitDisplay).toEqual('narrow')

  opts = fmt().long.toOptions()
  expect(opts.unitDisplay).toEqual('long')
})
