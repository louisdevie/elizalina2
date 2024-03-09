import { AnyFormat, Format } from '@module/format'
import { Formatter, FormatterFactory } from '@module/backend'

export class Fmt {
  private readonly _format: Format
  private readonly _factory: FormatterFactory
  private readonly _cache: Map<string, Formatter>

  public constructor(format: Format, factory: FormatterFactory) {
    this._format = format
    this._factory = factory
    this._cache = new Map()
  }

  protected format(value: any, config: (f: Format) => AnyFormat, cacheKey?: string): string {
    const shouldBeCached = cacheKey !== undefined
    const isCached = shouldBeCached && this._cache.has(cacheKey)

    let formatter
    if (isCached) {
      formatter = this._cache.get(cacheKey)!
    } else {
      formatter = this._factory.makeFormatter(config(this._format).toOptions())
      if (shouldBeCached) {
        this._cache.set(cacheKey, formatter)
      }
    }

    return formatter.applyTo(value)
  }
}
