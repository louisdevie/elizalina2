import { BrowserPlatform, isBrowser } from './browser'
import { isNode, NodePlatform } from './node'
import { UnknownPlatform } from './unknown'
import { Ctx } from '@module/ctx'

export interface Platform {
  getEnvironmentLocales(): string[]
}

function platform(): Platform {
  let platform
  if (isBrowser()) {
    platform = new BrowserPlatform()
  } else if (isNode()) {
    platform = new NodePlatform()
  } else {
    // use a different context because this function should never fail
    const platformInitCtx = new Ctx()
    platformInitCtx.push('module initialization')
    platformInitCtx.warn('unsupported platform.')
    platform = new UnknownPlatform()
  }
  return platform
}

export default platform()
