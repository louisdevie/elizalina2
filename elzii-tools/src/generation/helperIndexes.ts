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
}

export class ParameterEncounters {
  private _countByName: Map<string, number>

  public constructor() {
    this._countByName = new Map()
  }

  public encountered(name: string): number {
    let count
    if (this._countByName.has(name)) {
      count = this._countByName.get(name)! + 1
    } else {
      count = 1
    }
    this._countByName.set(name, count)
    return count
  }
}
