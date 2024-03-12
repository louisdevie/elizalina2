import moment from 'moment'
import extensions from '@module/extensions'
import { MomentExtension } from '@module/extensions/moment'

test('moment.js date conversion', () => {
  const momentDate = moment()
  const notAMomentDate = ['A', 'B', 'C']

  const momentExtension = new MomentExtension()

  expect(momentExtension.canConvert(momentDate)).toBeTrue()
  expect(momentExtension.canConvert(notAMomentDate)).toBeFalse()

  const convertedDate = momentExtension.convertToDate(momentDate)
  expect(convertedDate.valueOf()).toEqual(momentDate.valueOf())

  expect(extensions.tryToConvertToDate(momentDate)).toEqual(convertedDate)
})
