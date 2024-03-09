import { Platform } from '.'

export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof window.document !== 'undefined'
  )
}

export class BrowserPlatform implements Platform {
  getEnvironmentLocales(): string[] {
    let found = []
    if (Array.isArray(navigator.languages)) {
      found = navigator.languages
    } else if (navigator.language !== undefined) {
      found = [navigator.language]
    }
    return found
  }
}
