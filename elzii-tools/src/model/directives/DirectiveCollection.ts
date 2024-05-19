import type { Directive, DirectiveType } from '.'

export default class DirectiveCollection implements Iterable<Directive> {
  private readonly _storage: Directive[]

  public constructor() {
    this._storage = []
  }

  [Symbol.iterator](): Iterator<Directive> {
    return this._storage[Symbol.iterator]()
  }

  public add(directive: Directive): void {
    for (const stored of this._storage) {
      directive.throwIfConflicts(stored)
    }
    this._storage.push(directive)
  }

  public has(type: DirectiveType): boolean {
    let foundOne = false
    for (const stored of this._storage) {
      if (stored.type === type) {
        foundOne = true
      }
    }
    return foundOne
  }

  public get(type: DirectiveType): Directive | undefined {
    let found = undefined
    for (const stored of this._storage) {
      if (stored.type === type) {
        found = stored
      }
    }
    return found
  }

  public getAll(type: DirectiveType): Directive[] {
    let found = []
    for (const stored of this._storage) {
      if (stored.type === type) {
        found.push(stored)
      }
    }
    return found
  }
}
