import platform from '../src/platform'
import { Elz, ElzLocaleOptions } from '../src/elz'
import { Fmt } from '@module'

jest.mock('../src/platform')
const mockedPlatform = jest.mocked(platform)

const mockedLocaleModule = {
  default: class {
    constructor(_: Fmt) {}
  },
}

function testSetup() {
  const locales: ElzLocaleOptions<{}>[] = [
    {
      id: 'fr-FR',
      messages: () => Promise.resolve(mockedLocaleModule),
    },
    {
      id: 'en',
      messages: () => Promise.resolve(mockedLocaleModule),
    },
    {
      id: 'de-DE',
      messages: () => Promise.resolve(mockedLocaleModule),
      fallbackFor: ['nl'],
    },
  ]

  return {
    elzNoMainNoFallback: new Elz<{}>({ locales }),
    elzFallbackOnly: new Elz<{}>({ locales, fallback: 'en' }),
    elzMainOnly: new Elz<{}>({ locales, main: 'fr-FR' }),
    elzMainAndFallback: new Elz<{}>({ locales, fallback: 'en', main: 'fr-FR' }),
  }
}

test('locale resolution', async () => {
  const { elzNoMainNoFallback, elzFallbackOnly, elzMainOnly, elzMainAndFallback } = testSetup()

  expect(elzNoMainNoFallback.currentLocaleId).toBeUndefined()
  expect(elzFallbackOnly.currentLocaleId).toBeUndefined()
  expect(elzMainOnly.currentLocaleId).toBeUndefined()
  expect(elzMainAndFallback.currentLocaleId).toBeUndefined()

  // Different variants of French all fall back to the same locale automatically

  await elzNoMainNoFallback.useLocale('fr-FR')
  await elzFallbackOnly.useLocale('fr-FR')
  await elzMainOnly.useLocale('fr-FR')
  await elzMainAndFallback.useLocale('fr-FR')
  expect(elzNoMainNoFallback.currentLocaleId).toEqual('fr-FR')
  expect(elzFallbackOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainAndFallback.currentLocaleId).toEqual('fr-FR')

  await elzNoMainNoFallback.useLocale('fr')
  await elzFallbackOnly.useLocale('fr')
  await elzMainOnly.useLocale('fr')
  await elzMainAndFallback.useLocale('fr')
  expect(elzNoMainNoFallback.currentLocaleId).toEqual('fr-FR')
  expect(elzFallbackOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainAndFallback.currentLocaleId).toEqual('fr-FR')

  await elzNoMainNoFallback.useLocale('fr-CA')
  await elzFallbackOnly.useLocale('fr-CA')
  await elzMainOnly.useLocale('fr-CA')
  await elzMainAndFallback.useLocale('fr-CA')
  expect(elzNoMainNoFallback.currentLocaleId).toEqual('fr-FR')
  expect(elzFallbackOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainAndFallback.currentLocaleId).toEqual('fr-FR')

  // Dutch falls back to german because we declared it explicitly

  await elzNoMainNoFallback.useLocale('nl-NL')
  await elzFallbackOnly.useLocale('nl-NL')
  await elzMainOnly.useLocale('nl-NL')
  await elzMainAndFallback.useLocale('nl-NL')
  expect(elzNoMainNoFallback.currentLocaleId).toEqual('de-DE')
  expect(elzFallbackOnly.currentLocaleId).toEqual('de-DE')
  expect(elzMainOnly.currentLocaleId).toEqual('de-DE')
  expect(elzMainAndFallback.currentLocaleId).toEqual('de-DE')

  // There is no italian locale, so the global fallback or the main locale is used instead.

  await expect(() => elzNoMainNoFallback.useLocale('it')).rejects.toThrow()
  await elzFallbackOnly.useLocale('it')
  await elzMainOnly.useLocale('it')
  await elzMainAndFallback.useLocale('it')
  expect(elzFallbackOnly.currentLocaleId).toEqual('en')
  expect(elzMainOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainAndFallback.currentLocaleId).toEqual('en')
})

test('main locale selection', async () => {
  const { elzNoMainNoFallback, elzFallbackOnly, elzMainOnly, elzMainAndFallback } = testSetup()

  expect(elzNoMainNoFallback.currentLocaleId).toBeUndefined()
  expect(elzFallbackOnly.currentLocaleId).toBeUndefined()
  expect(elzMainOnly.currentLocaleId).toBeUndefined()
  expect(elzMainAndFallback.currentLocaleId).toBeUndefined()

  await expect(elzNoMainNoFallback.useMainLocale()).rejects.toThrow()
  await expect(elzFallbackOnly.useMainLocale()).rejects.toThrow()

  await elzMainOnly.useMainLocale()
  expect(elzMainOnly.currentLocaleId).toEqual('fr-FR')

  await elzMainAndFallback.useMainLocale()
  expect(elzMainAndFallback.currentLocaleId).toEqual('fr-FR')
})

test('locale resolution from the environment', async () => {
  const { elzNoMainNoFallback, elzFallbackOnly, elzMainOnly, elzMainAndFallback } = testSetup()
  const all = [elzNoMainNoFallback, elzFallbackOnly, elzMainOnly, elzMainAndFallback]

  all.forEach((elz) => expect(elz.currentLocaleId).toBeUndefined())

  // takes the first one found

  mockedPlatform.getEnvironmentLocales.mockReturnValue(['fr-FR', 'en-US'])
  await Promise.all(all.map((elz) => elz.useEnvironmentLocale()))
  all.forEach((elz) => expect(elz.currentLocaleId).toEqual('fr-FR'))

  // fr-FR is still chosen because en-US isn't specified explicitly

  mockedPlatform.getEnvironmentLocales.mockReturnValue(['en-US', 'fr-FR'])
  await Promise.all(all.map((elz) => elz.useEnvironmentLocale()))
  all.forEach((elz) => expect(elz.currentLocaleId).toEqual('fr-FR'))

  // en-US is now preferred because fr-CA is also implicit and further down the list

  mockedPlatform.getEnvironmentLocales.mockReturnValue(['en-US', 'fr-CA'])
  await Promise.all(all.map((elz) => elz.useEnvironmentLocale()))
  all.forEach((elz) => expect(elz.currentLocaleId).toEqual('en'))

  // if there is no locale, the main one is used

  mockedPlatform.getEnvironmentLocales.mockReturnValue([])
  await expect(elzNoMainNoFallback.useEnvironmentLocale()).rejects.toThrow()
  await elzFallbackOnly.useEnvironmentLocale()
  await elzMainOnly.useEnvironmentLocale()
  await elzMainAndFallback.useEnvironmentLocale()
  expect(elzFallbackOnly.currentLocaleId).toEqual('en')
  expect(elzMainOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainAndFallback.currentLocaleId).toEqual('fr-FR')

  // There is no available locale, so the global fallback or the main locale is used instead.

  mockedPlatform.getEnvironmentLocales.mockReturnValue(['es', 'pt'])
  await expect(() => elzNoMainNoFallback.useEnvironmentLocale()).rejects.toThrow()
  await elzFallbackOnly.useEnvironmentLocale()
  await elzMainOnly.useEnvironmentLocale()
  await elzMainAndFallback.useEnvironmentLocale()
  expect(elzFallbackOnly.currentLocaleId).toEqual('en')
  expect(elzMainOnly.currentLocaleId).toEqual('fr-FR')
  expect(elzMainAndFallback.currentLocaleId).toEqual('en')
})

interface TestLocale {
  get helloWorld(): string
}

test('locale object proxy', () => {
  const elz = new Elz<TestLocale>({
    locales: [
      {
        id: 'en-US',
        messages: { helloWorld: 'Hello, world!' },
      },
      {
        id: 'fr-FR',
        messages: { helloWorld: 'Bonjour, le monde!' },
      },
      {
        id: 'de-DE',
        messages: { helloWorld: 'Hallo welt!' },
      },
    ],
  })

  const __ = elz.makeLocaleProxy()

  elz.useLocale('fr-FR')
  expect(__.helloWorld).toEqual('Bonjour, le monde!')

  elz.useLocale('de-DE')
  expect(__.helloWorld).toEqual('Hallo welt!')

  elz.useLocale('en-US')
  expect(__.helloWorld).toEqual('Hello, world!')
})
