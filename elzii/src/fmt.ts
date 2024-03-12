import { AnyFormat, Format } from '@module/format'
import { Formatter, FormatterFactory } from '@module/backend'
import { Ctx } from '@module/ctx'

export class Fmt {
  private readonly _format: Format
  private readonly _factory: FormatterFactory
  private readonly _cache: Map<string, Formatter>
  private readonly _context: Ctx

  public constructor(format: Format, factory: FormatterFactory, context: Ctx) {
    this._format = format
    this._factory = factory
    this._context = context
    this._cache = new Map()
  }

  public format(
    value: any,
    config: (f: Format) => AnyFormat,
    cacheKey?: string,
    context?: string,
  ): string {
    const shouldBeCached = cacheKey !== undefined
    const isCached = shouldBeCached && this._cache.has(cacheKey)

    try {
      if (context !== undefined) this._context.push(context)

      let formatter: Formatter
      if (isCached) {
        formatter = this._cache.get(cacheKey)!
      } else {
        formatter = this._factory.makeFormatter(config(this._format).toOptions(), this._context)
        if (shouldBeCached) {
          this._cache.set(cacheKey, formatter)
        }
      }

      return formatter.applyTo(value, this._context)
    } finally {
      if (context !== undefined) this._context.pop()
    }
  }
}
