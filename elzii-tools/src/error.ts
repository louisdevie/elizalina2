export type ErrorKind = 'config' | 'other'

export class Error {
  private _kind: ErrorKind
  private _detailedMessage: string[]

  public constructor(detailedMessage: string[], kind: ErrorKind) {
    this._detailedMessage = detailedMessage
    this._kind = kind
  }

  public get kind(): ErrorKind {
    return this._kind
  }

  public get detailedMessage(): string {
    return this._detailedMessage[0]
  }

  public get details(): string[] {
    return this._detailedMessage.slice(1)
  }

  public cantHandle(): never {
    throw this
  }

  public replace(args: { message?: string; kind?: ErrorKind }): never {
    if (args.message !== undefined) this._detailedMessage = [args.message]
    if (args.kind !== undefined) this._kind = args.kind
    throw this
  }

  public detail(messageDetails: string): never {
    this._detailedMessage.push(messageDetails)
    throw this
  }
}

export function throwError(message: string, kind: ErrorKind = 'other'): never {
  throw new Error([message], kind)
}

export function handleErrors(
  tryBlock: () => void,
  handlers: Partial<Record<ErrorKind, (err: Error) => void>>,
) {
  try {
    tryBlock()
  } catch (error) {
    if (error instanceof Error) {
      let handler = handlers[error.kind]
      if (handler !== undefined) {
        handler(error)
      } else {
        throw error
      }
    } else {
      throw error
    }
  }
}
