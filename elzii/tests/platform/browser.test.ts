/**
 * @jest-environment jsdom
 */

import { BrowserPlatform } from '@module/platform/browser'

test('browser platform', async () => {
  const warn = jest.spyOn(console, 'warn')

  const platformModule = await import('@module/platform')

  expect(warn).not.toHaveBeenCalled()

  expect(platformModule.default instanceof BrowserPlatform).toBeTrue()

  const language = jest.spyOn(navigator, 'language', 'get')
  const languages = jest.spyOn(navigator, 'languages', 'get')

  languages.mockReturnValue(undefined as any)
  language.mockReturnValue(undefined as any)
  expect(platformModule.default.getEnvironmentLocales()).toEqual([])

  language.mockReturnValue('fr')
  expect(platformModule.default.getEnvironmentLocales()).toEqual(['fr'])

  languages.mockReturnValue(['fr', 'fr-FR', 'en-US', 'en'])
  expect(platformModule.default.getEnvironmentLocales()).toEqual(['fr', 'fr-FR', 'en-US', 'en'])
})
