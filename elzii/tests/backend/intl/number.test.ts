import { NumberFormatOptions } from '@module/format'
import { FormatImpl } from '@module/format/implementations'
import { NumberFormat } from '@module/format/number'
import { Ctx } from '@module/ctx'
import { IntlNumberFormatAdapter } from '@module/backend/intl/number'

const IntlConstructor = jest.spyOn(Intl, 'NumberFormat')

const defaultIntlOptions = {
  // Locale options
  numberingSystem: undefined,

  // Style options
  style: undefined,
  currency: undefined,
  currencyDisplay: undefined,
  currencySign: undefined,
  unit: undefined,
  unitDisplay: undefined,

  // Digit options
  minimumIntegerDigits: undefined,
  minimumFractionDigits: undefined,
  maximumFractionDigits: undefined,
  maximumSignificantDigits: undefined,
  roundingMode: undefined,

  // Other options
  notation: undefined,
  compactDisplay: undefined,
  useGrouping: undefined,
  signDisplay: undefined,
}

function makeNumberFormatOptions(
  language: string,
  config: (f: NumberFormat) => NumberFormat,
): NumberFormatOptions {
  return config(new FormatImpl(language).number).toOptions() as NumberFormatOptions
}

function makeFormatterWithOptions(
  language: string,
  config: (f: NumberFormat) => NumberFormat,
): IntlNumberFormatAdapter {
  const formatOptions = makeNumberFormatOptions(language, config)
  const context = new Ctx()
  return new IntlNumberFormatAdapter(formatOptions, formatOptions, context)
}

beforeEach(() => {
  jest.resetModules()
})

test('creating a number formatter through the factory', async () => {
  jest.mock('@module/backend/intl/number')
  const { IntlNumberFormatAdapter } = await import('@module/backend/intl/number')
  const { IntlFormatterFactory } = await import('@module/backend/intl')

  const defaultOptions = makeNumberFormatOptions('en-US', (f) => f)
  const context = new Ctx()

  new IntlFormatterFactory().makeFormatter(defaultOptions, context)
  expect(IntlNumberFormatAdapter).toHaveBeenCalledExactlyOnceWith(
    defaultOptions,
    defaultOptions,
    context,
  )
})

test('configuring intl with default options', async () => {
  makeFormatterWithOptions('en-US', (f) => f)

  expect(IntlConstructor).toHaveBeenCalledOnce()
  expect(IntlConstructor.mock.calls[0]).toEqual(['en-US', defaultIntlOptions])
})

test('configuring intl with the integer option enabled', async () => {
  makeFormatterWithOptions('en-US', (f) => f.integer())
  let expectedIntlOptions = {
    ...defaultIntlOptions,
    minimumIntegerDigits: 1,
    maximumFractionDigits: 0,
  }

  expect(IntlConstructor).toHaveBeenCalledTimes(1)
  expect(IntlConstructor.mock.calls[0]).toEqual(['en-US', expectedIntlOptions])

  makeFormatterWithOptions('en-US', (f) => f.integer(0))

  expect(IntlConstructor).toHaveBeenCalledTimes(2)
  expect(IntlConstructor.mock.calls[1]).toEqual(['en-US', expectedIntlOptions])

  makeFormatterWithOptions('en-US', (f) => f.integer(3))
  expectedIntlOptions.minimumIntegerDigits = 3

  expect(IntlConstructor).toHaveBeenCalledTimes(3)
  expect(IntlConstructor.mock.calls[2]).toEqual(['en-US', expectedIntlOptions])

  makeFormatterWithOptions('en-US', (f) => f.integer(30))
  // 21 is the maximum allowed by Intl
  expectedIntlOptions.minimumIntegerDigits = 21

  expect(IntlConstructor).toHaveBeenCalledTimes(4)
  expect(IntlConstructor.mock.calls[3]).toEqual(['en-US', expectedIntlOptions])
})

afterEach(() => {
  jest.resetAllMocks()
})
