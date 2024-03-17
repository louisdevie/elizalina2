/**
 * @jest-environment ./tests/__environments__/empty.ts
 */

import { UnknownPlatform } from '@module/platform/unknown'

test('unknown platform', async () => {
  clearEnvironment() // trick the module to believe there is no node environment
  const platformModule = await import('@module/platform')
  restoreEnvironment()

  expect(platformModule.default instanceof UnknownPlatform).toBeTrue()
  expect(platformModule.default.getEnvironmentLocales()).toEqual([])
})
