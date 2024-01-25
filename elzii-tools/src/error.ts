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

  public get message(): string {
    return this._detailedMessage[0]
  }

  public get details(): string[] {
    return this._detailedMessage.slice(1)
  }

  public toString(): string {
    return this.message
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

export function handleErrors<T>(
  tryBlock: () => T,
  handlers: Partial<Record<ErrorKind | 'all', (err: unknown) => T>>,
): T {
  let result: T
  try {
    result = tryBlock()
  } catch (error) {
    let handler
    if (error instanceof Error) {
      handler = handlers[error.kind] ?? handlers['all']
    } else {
      handler = handlers['all']
    }

    if (handler !== undefined) {
      result = handler(error)
    } else {
      throw error
    }
  }
  return result
}

export async function handleErrorsAsync<T>(
  tryBlock: () => Promise<T>,
  handlers: Partial<Record<ErrorKind | 'all', (err: unknown) => T>>,
): Promise<T> {
  let result: T
  try {
    result = await tryBlock()
  } catch (error) {
    let handler
    if (error instanceof Error) {
      handler = handlers[error.kind] ?? handlers['all']
    } else {
      handler = handlers['all']
    }

    if (handler !== undefined) {
      result = handler(error)
    } else {
      throw error
    }
  }
  return result
}
