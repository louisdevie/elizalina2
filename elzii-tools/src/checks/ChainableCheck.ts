import { Check } from '@module/checks/index'

export default abstract class ChainableCheck<T> implements Check<T> {
  private _next?: ChainableCheck<T>

  public add(check: ChainableCheck<T>): void {
    if (this._next === undefined) {
      this._next = check
    } else {
      this._next.add(check)
    }
  }

  public validate(value: T): boolean {
    return this.doValidate(value) && (this._next?.validate(value) ?? true)
  }

  public abstract doValidate(value: T): boolean
}