import { BrowserPlatform, isBrowser } from './browser'
import { isNode, NodePlatform } from './node'
import { UnknownPlatform } from './unknown'

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
    console.warn('[elzii] unsupported platform.')
    platform = new UnknownPlatform()
  }
  return platform
}

export default platform()
