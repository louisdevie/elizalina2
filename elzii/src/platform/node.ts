import { Platform } from '.'

export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}

export class NodePlatform implements Platform {
  getEnvironmentLocales(): string[] {
    let found = []

    let envLocale =
      process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE
    if (envLocale !== undefined) {
      // remove encoding and transform en_US into en-US
      found.push(envLocale.split('.')[0].replace('_', '-'))
    }

    return found
  }
}
