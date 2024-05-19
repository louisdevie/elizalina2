import type { MessageParameter } from '.'
import { mergeTypeHints } from './TypeHint'

export default class MessageParameterSet implements Set<MessageParameter> {
  private _parameters: MessageParameter[]

  public constructor(values?: readonly MessageParameter[] | null) {
    this._parameters = []

    if (values) {
      for (const value of values) {
        this.add(value)
      }
    }
  }

  /**
   * @inheritDoc
   * @note If the parameter already exists, the type hints will be merged together.
   */
  public add(value: MessageParameter): this {
    const existing = this._parameters.find((p) => p.name === value.name)

    if (existing === undefined) {
      this._parameters.push(value)
    } else {
      existing.typeHint = mergeTypeHints(existing.typeHint, value.typeHint)
    }

    return this
  }

  public clear(): void {
    this._parameters = []
  }

  public delete(value: MessageParameter): boolean {
    let existingIndex = this._parameters.findIndex((p) => p.name === value.name)
    let removed = false

    if (existingIndex !== -1) {
      this._parameters.splice(existingIndex, 1)
      removed = true
    }

    return removed
  }

  public forEach(
    callback: (
      value: MessageParameter,
      valueAgain: MessageParameter,
      set: Set<MessageParameter>,
    ) => void,
    thisArg?: any,
  ): void {
    this._parameters.forEach((value) => callback(value, value, this), thisArg)
  }

  public has(value: MessageParameter): boolean {
    return this._parameters.some((p) => p.name === value.name)
  }

  public get size(): number {
    return this._parameters.length
  }

  public entries(): IterableIterator<[MessageParameter, MessageParameter]> {
    return new EntriesIterator(this)
  }

  public keys(): IterableIterator<MessageParameter> {
    return this._parameters[Symbol.iterator]()
  }

  public values(): IterableIterator<MessageParameter> {
    return this._parameters[Symbol.iterator]()
  }

  public [Symbol.iterator](): IterableIterator<MessageParameter> {
    return this._parameters[Symbol.iterator]()
  }

  public readonly [Symbol.toStringTag]: string = 'MessageParameterSet'

  public getLike(value: MessageParameter): MessageParameter | undefined {
    return this._parameters.find((p) => p.name === value.name)
  }
}

class EntriesIterator implements IterableIterator<[MessageParameter, MessageParameter]> {
  private readonly _set: MessageParameterSet
  private readonly _arrayIterator: Iterator<MessageParameter>

  public constructor(set: MessageParameterSet) {
    this._set = set
    this._arrayIterator = set[Symbol.iterator]()
  }

  public [Symbol.iterator](): IterableIterator<[MessageParameter, MessageParameter]> {
    return new EntriesIterator(this._set)
  }

  public next(...args: [] | [undefined]): IteratorResult<[MessageParameter, MessageParameter]> {
    const next = this._arrayIterator.next(...args)
    return next.done ?
        { done: true, value: next.value }
      : { done: next.done, value: [next.value, next.value] }
  }
}
