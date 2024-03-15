import { randomHex } from '@module/helpers'

export class CacheKeyGenerator {
  private _existing: Set<string>

  public constructor() {
    this._existing = new Set()
  }

  private generateNonUniqueCacheKey(prefix: string): string {
    return prefix + randomHex()
  }

  public generateCacheKey(prefix: string): string {
    let key
    do {
      key = this.generateNonUniqueCacheKey(prefix)
    } while (this._existing.has(key))
    return key
  }

  public reset() {
    this._existing.clear()
  }
}
