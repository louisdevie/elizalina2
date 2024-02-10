import { ElziiError, handleErrors, handleErrorsAsync, throwError } from '@module/error'

test('error.Error.constructor', () => {
  let err1 = new ElziiError([], 'other')
  let err2 = new ElziiError(['abc'], 'config')
  let err3 = new ElziiError(['abc', 'def', 'ghi'], 'other')

  expect(err1.message).toBeUndefined()
  expect(err2.message).toEqual('abc')
  expect(err3.message).toEqual('abc')

  expect(err1.toString()).toBeUndefined()
  expect(err2.toString()).toEqual('abc')
  expect(err3.toString()).toEqual('abc')

  expect(err1.details).toEqual([])
  expect(err2.details).toEqual([])
  expect(err3.details).toEqual(['def', 'ghi'])

  expect(err1.kind).toEqual('other')
  expect(err2.kind).toEqual('config')
  expect(err3.kind).toEqual('other')
})

test('error.Error.cantHandle', () => {
  let err = new ElziiError(['abc'], 'other')

  try {
    err.cantHandle()
    fail('No error was thrown')
  } catch (e) {
    expect(e).toBe(err)
    expect(e).toMatchObject({ message: 'abc', kind: 'other' })
  }
})

test('error.Error.replace', () => {
  let err = new ElziiError(['abc'], 'other')

  try {
    err.replace({ message: 'def' })
    fail('No error was thrown')
  } catch (e) {
    expect(e).toBe(err)
    expect(e).toMatchObject({ message: 'def', kind: 'other' })
  }

  try {
    err.replace({ kind: 'config' })
    fail('No error was thrown')
  } catch (e) {
    expect(e).toBe(err)
    expect(e).toMatchObject({ message: 'def', kind: 'config' })
  }

  try {
    err.replace({ message: 'ghi', kind: 'other' })
    fail('No error was thrown')
  } catch (e) {
    expect(e).toBe(err)
    expect(e).toMatchObject({ message: 'ghi', kind: 'other' })
  }
})

test('error.Error.detail', () => {
  let err = new ElziiError(['abc'], 'other')

  try {
    err.detail('def')
    fail('No error was thrown')
  } catch (e) {
    expect(e).toBe(err)
    expect(e).toMatchObject({ message: 'abc', details: ['def'], kind: 'other' })
  }

  try {
    err.detail('ghi')
    fail('No error was thrown')
  } catch (e) {
    expect(e).toBe(err)
    expect(e).toMatchObject({ message: 'abc', details: ['def', 'ghi'], kind: 'other' })
  }
})

test('error.throwError', () => {
  try {
    throwError('abc', 'config')
  } catch (e) {
    expect(e).toMatchObject({ message: 'abc', details: [], kind: 'config' })
  }
})

test('error.handleErrors', () => {
  const throwsConfigError = (): string => throwError('something', 'config')
  const throwsOtherError = (): string => throwError('something', 'other')
  const throwsString = (): string => {
    throw 'something'
  }

  // handlers functions, here they have the same name as the keys to simplify the tests
  const config = () => 'config handler'
  const other = () => 'other handler'
  const elzii = () => 'elzii handler'
  const all = () => 'all handler'

  let whoCaughtIt = handleErrors(throwsConfigError, { config, other, elzii, all })
  expect(whoCaughtIt).toEqual('config handler')

  whoCaughtIt = handleErrors(throwsOtherError, { config, other, elzii, all })
  expect(whoCaughtIt).toEqual('other handler')

  whoCaughtIt = handleErrors(throwsConfigError, { other, elzii, all })
  expect(whoCaughtIt).toEqual('elzii handler')

  whoCaughtIt = handleErrors(throwsOtherError, { config, elzii, all })
  expect(whoCaughtIt).toEqual('elzii handler')

  whoCaughtIt = handleErrors(throwsOtherError, { config, all })
  expect(whoCaughtIt).toEqual('all handler')

  expect(() => handleErrors(throwsConfigError, { other })).toThrow()

  whoCaughtIt = handleErrors(throwsString, { config, other, elzii, all })
  expect(whoCaughtIt).toEqual('all handler')
})

test('error.handleErrorsAsync', async () => {
  const throwsConfigError = async (): Promise<string> => throwError('something', 'config')
  const throwsOtherError = async (): Promise<string> => throwError('something', 'other')
  const throwsString = async (): Promise<string> => {
    throw 'something'
  }

  // handlers functions, here they have the same name as the keys to simplify the tests
  const config = () => 'config handler'
  const other = () => 'other handler'
  const elzii = () => 'elzii handler'
  const all = () => 'all handler'

  let whoCaughtIt = await handleErrorsAsync(throwsConfigError, { config, other, elzii, all })
  expect(whoCaughtIt).toEqual('config handler')

  whoCaughtIt = await handleErrorsAsync(throwsOtherError, { config, other, elzii, all })
  expect(whoCaughtIt).toEqual('other handler')

  whoCaughtIt = await handleErrorsAsync(throwsConfigError, { other, elzii, all })
  expect(whoCaughtIt).toEqual('elzii handler')

  whoCaughtIt = await handleErrorsAsync(throwsOtherError, { config, elzii, all })
  expect(whoCaughtIt).toEqual('elzii handler')

  whoCaughtIt = await handleErrorsAsync(throwsOtherError, { config, all })
  expect(whoCaughtIt).toEqual('all handler')

  try {
    await handleErrorsAsync(throwsConfigError, { other })
    fail('No error was thrown')
  } catch {}

  whoCaughtIt = await handleErrorsAsync(throwsString, { config, other, elzii, all })
  expect(whoCaughtIt).toEqual('all handler')
})
