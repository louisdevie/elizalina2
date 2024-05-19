import TypeHint from './TypeHint'

/**
 * A piece of code written by the user.
 */
export default class UserCode {
  private _code: string

  public constructor(code: string) {
    this._code = code
  }

  public toString(): string {
    return '<user code>'
  }

  public print(): string {
    return this._code
  }

  public getTypeHint(): TypeHint {
    let hint = TypeHint.None

    if (this._code.startsWith('number')) {
      hint = TypeHint.Number
    }

    return hint
  }

  public withPrefix(prefix: string): UserCode {
    this._code = prefix + this._code
    return this
  }
}
