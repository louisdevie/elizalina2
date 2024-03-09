import { DatetimeFormatImpl } from '@module/format/implementations/datetime'
import {
  DatetimeFormatOptions,
  HourCycle,
  NumericComponentStyle,
  TimeZoneStyle,
  WordComponentStyle,
} from '@module/format/datetime'

const fmt = () => new DatetimeFormatImpl('test')

test('default format', () => {
  let opts = fmt().toOptions()

  let expected: DatetimeFormatOptions = {
    language: 'test',
    type: 'datetime',
    calendar: undefined,
    numberingSystem: undefined,
    hourCycle: undefined,
    timeZone: undefined,
    era: undefined,
    year: undefined,
    month: undefined,
    day: undefined,
    weekday: undefined,
    dayPeriod: undefined,
    hour: undefined,
    minute: undefined,
    second: undefined,
    fractionalSeconds: undefined,
    timeZoneName: undefined,
  }

  expect(opts).toEqual(expected)
})

test('calendar', () => {
  let opts = fmt().calendar('chinese').toOptions()
  expect(opts.calendar).toEqual('chinese')
})

test('numbering system', () => {
  let opts = fmt().numberingSystem('latn').toOptions()
  expect(opts.numberingSystem).toEqual('latn')
})

test('hour cycles', () => {
  let opts = fmt().hourCycle('h23').toOptions()
  expect(opts.hourCycle).toEqual('h23')

  opts = fmt()._12h.toOptions()
  expect(opts.hourCycle).toEqual('12hours')

  opts = fmt()._24h.toOptions()
  expect(opts.hourCycle).toEqual('24hours')

  opts = fmt().h11.toOptions()
  expect(opts.hourCycle).toEqual('h11')

  opts = fmt().h12.toOptions()
  expect(opts.hourCycle).toEqual('h12')

  opts = fmt().h23.toOptions()
  expect(opts.hourCycle).toEqual('h23')

  opts = fmt().h24.toOptions()
  expect(opts.hourCycle).toEqual('h24')
})

test('era component', () => {
  let opts = fmt().era().toOptions()
  expect(opts.era).toEqual('short')

  opts = fmt().era('long').toOptions()
  expect(opts.era).toEqual('long')
})

test('year component', () => {
  let opts = fmt().year().toOptions()
  expect(opts.year).toEqual('numeric')

  opts = fmt().year('2-digit').toOptions()
  expect(opts.year).toEqual('2-digit')
})

test('month component', () => {
  let opts = fmt().month().toOptions()
  expect(opts.month).toEqual('short')

  opts = fmt().month('2-digit').toOptions()
  expect(opts.month).toEqual('2-digit')
})

test('day component', () => {
  let opts = fmt().day().toOptions()
  expect(opts.day).toEqual('numeric')

  opts = fmt().day('2-digit').toOptions()
  expect(opts.day).toEqual('2-digit')
})

test('weekday component', () => {
  let opts = fmt().weekday().toOptions()
  expect(opts.weekday).toEqual('short')

  opts = fmt().weekday('long').toOptions()
  expect(opts.weekday).toEqual('long')
})

test('day period component', () => {
  let opts = fmt().weekday().toOptions()
  expect(opts.weekday).toEqual('short')

  opts = fmt().weekday('long').toOptions()
  expect(opts.weekday).toEqual('long')
})

test('hour component', () => {
  let opts = fmt().hour().toOptions()
  expect(opts.hour).toEqual('numeric')

  opts = fmt().hour('2-digit').toOptions()
  expect(opts.hour).toEqual('2-digit')
})

test('minute component', () => {
  let opts = fmt().minute().toOptions()
  expect(opts.minute).toEqual('numeric')

  opts = fmt().minute('2-digit').toOptions()
  expect(opts.minute).toEqual('2-digit')
})

test('second component', () => {
  let opts = fmt().second().toOptions()
  expect(opts.second).toEqual('numeric')
  expect(opts.fractionalSeconds).toEqual(0)

  opts = fmt().second('2-digit').toOptions()
  expect(opts.second).toEqual('2-digit')
  expect(opts.fractionalSeconds).toEqual(0)

  opts = fmt().second('2-digit', 3).toOptions()
  expect(opts.second).toEqual('2-digit')
  expect(opts.fractionalSeconds).toEqual(3)
})

test('time zone component', () => {
  let opts = fmt().timeZoneName().toOptions()
  expect(opts.timeZoneName).toEqual('shortOffset')

  opts = fmt().timeZoneName('long').toOptions()
  expect(opts.timeZoneName).toEqual('long')
})

test('date and time shortcut', () => {
  let opts = fmt().dateAndTime('full').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'long',
  })

  opts = fmt().dateAndTime('long').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'shortOffset',
  })
  expect(opts).not.toContainAnyKeys(['weekday'])

  opts = fmt().dateAndTime('medium').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday', 'timeZoneName'])

  // medium should be the default
  expect(fmt().dateAndTime().toOptions()).toEqual(opts)

  opts = fmt().dateAndTime('short').toOptions()
  expect(opts).toMatchObject({
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday', 'timeZoneName'])
})

test('date shortcut', () => {
  let opts = fmt().date('full').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  opts = fmt().date('long').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday'])

  opts = fmt().date('medium').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday'])

  // medium should be the default
  expect(fmt().date().toOptions()).toEqual(opts)

  opts = fmt().date('short').toOptions()
  expect(opts).toMatchObject({
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday'])
})

test('month date shortcut', () => {
  let opts = fmt().monthDate('full').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'long',
  })

  // long is the same as full
  expect(fmt().monthDate('long').toOptions()).toEqual(opts)

  opts = fmt().monthDate('medium').toOptions()
  expect(opts).toMatchObject({
    year: 'numeric',
    month: 'short',
  })

  // medium should be the default
  expect(fmt().monthDate().toOptions()).toEqual(opts)

  opts = fmt().monthDate('short').toOptions()
  expect(opts).toMatchObject({
    year: '2-digit',
    month: 'numeric',
  })
})

test('day of year shortcut', () => {
  let opts = fmt().dayOfYear('full').toOptions()
  expect(opts).toMatchObject({
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  opts = fmt().dayOfYear('long').toOptions()
  expect(opts).toMatchObject({
    month: 'long',
    day: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday'])

  opts = fmt().dayOfYear('medium').toOptions()
  expect(opts).toMatchObject({
    month: 'short',
    day: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday'])

  // medium should be the default
  expect(fmt().dayOfYear().toOptions()).toEqual(opts)

  opts = fmt().dayOfYear('short').toOptions()
  expect(opts).toMatchObject({
    month: 'numeric',
    day: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['weekday'])
})

test('time shortcut', () => {
  let opts = fmt().time('full').toOptions()
  expect(opts).toMatchObject({
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'long',
  })

  opts = fmt().time('long').toOptions()
  expect(opts).toMatchObject({
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'shortOffset',
  })

  opts = fmt().time('medium').toOptions()
  expect(opts).toMatchObject({
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['timeZoneName'])

  // medium should be the default
  expect(fmt().time().toOptions()).toEqual(opts)

  // short is the same as medium
  expect(fmt().time('short').toOptions()).toEqual(opts)
})

test('minute time shortcut', () => {
  let opts = fmt().minuteTime('full').toOptions()
  expect(opts).toMatchObject({
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'long',
  })

  opts = fmt().minuteTime('long').toOptions()
  expect(opts).toMatchObject({
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'shortOffset',
  })

  opts = fmt().minuteTime('medium').toOptions()
  expect(opts).toMatchObject({
    hour: 'numeric',
    minute: 'numeric',
  })
  expect(opts).not.toContainAnyKeys(['timeZoneName'])

  // medium should be the default
  expect(fmt().minuteTime().toOptions()).toEqual(opts)

  // short is the same as medium
  expect(fmt().minuteTime('short').toOptions()).toEqual(opts)
})
