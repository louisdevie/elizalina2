import { NodePlatform } from '@module/platform/node'

test('node platform', async () => {
  const warn = jest.spyOn(console, 'warn')

  const platformModule = await import('@module/platform')

  expect(warn).not.toHaveBeenCalled()

  expect(platformModule.default instanceof NodePlatform).toBeTrue()

  // French UTF-8 linux environment
  process.env.LANG = 'fr_FR.UTF-8'
  // remove other variables that might be set
  delete process.env.LC_ALL
  delete process.env.LC_MESSAGES
  delete process.env.LANGUAGE
  expect(platformModule.default.getEnvironmentLocales()).toEqual(['fr-FR'])

  delete process.env.LANG
  expect(platformModule.default.getEnvironmentLocales()).toEqual([])
})
