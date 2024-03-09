import { Platform } from '.'

export class UnknownPlatform implements Platform {
  getEnvironmentLocales(): string[] {
    return []
  }
}
