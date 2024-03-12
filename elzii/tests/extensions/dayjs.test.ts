import dayjs from 'dayjs'
import { DayjsExtension } from '@module/extensions/dayjs'
import extensions from '@module/extensions'

test('day.js date conversion', () => {
  const dayjsDate = dayjs()
  const notADayjsDate = ['A', 'B', 'C']

  const dayjsExtension = new DayjsExtension()

  expect(dayjsExtension.canConvert(dayjsDate)).toBeTrue()
  expect(dayjsExtension.canConvert(notADayjsDate)).toBeFalse()

  const convertedDate = dayjsExtension.convertToDate(dayjsDate)
  expect(convertedDate.valueOf()).toEqual(dayjsDate.valueOf())

  expect(extensions.tryToConvertToDate(dayjsDate)).toEqual(convertedDate)
})
