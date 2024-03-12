export class Ctx {
  private readonly _stack: string[]
  private _strictMode: boolean

  public constructor() {
    this._stack = []
    this._strictMode = false
  }

  public push(description: string) {
    this._stack.push(description)
  }

  public pop() {
    this._stack.pop()
  }

  public enableStrictMode() {
    this._strictMode = true
  }

  public disableStrictMode() {
    this._strictMode = false
  }

  public get fullDescription(): string {
    return this._stack.length === 0 ? '?' : this._stack.join(', ')
  }

  private formatMessage(message: string): string {
    return `[elzii] ${message} (${this.fullDescription})`
  }

  public warn(message: string) {
    if (this._strictMode) {
      this.fail(message)
    } else {
      console.warn(this.formatMessage(message))
    }
  }

  public fail(message: string): never {
    throw new Error(this.formatMessage(message))
  }
}
