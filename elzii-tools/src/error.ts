/**
 * A string describing the origin of an error.
 */
export type ErrorKind = 'config' | 'parser' | 'files' | 'internal' | 'other'

/**
 * Custom error class for exceptions specific to the tooling.
 */
export class ElziiError extends Error {
  private _kind: ErrorKind
  private _detailedMessage: string[]

  /**
   * Creates a new error object.
   * @param detailedMessage The different lines of the message.
   * @param kind The kind or error.
   */
  public constructor(detailedMessage: string[], kind: ErrorKind) {
    super()
    this._detailedMessage = detailedMessage
    this._kind = kind
  }

  /**
   * The origin of the error.
   */
  public get kind(): ErrorKind {
    return this._kind
  }

  /**
   * The main message of the error.
   */
  public get message(): string {
    return this._detailedMessage[0]
  }

  /**
   * A list of additional information about the error.
   */
  public get details(): string[] {
    return this._detailedMessage.slice(1)
  }

  public toString(): string {
    return this.message
  }

  /**
   * Re-throw this error as is.
   */
  public cantHandle(): never {
    throw this
  }

  /**
   * Re-throw this error with different data.
   * @param args The information to change in the error.
   */
  public replace(args: { message?: string; kind?: ErrorKind }): never {
    if (args.message !== undefined) this._detailedMessage = [args.message]
    if (args.kind !== undefined) this._kind = args.kind
    throw this
  }

  /**
   * Re-throw this error with more details.
   * @param messageDetails Another line of information to add to the error.
   */
  public detail(messageDetails: string): never {
    this._detailedMessage.push(messageDetails)
    throw this
  }
}

export class ErrorReport {
  private readonly _errors: ElziiError[]

  public constructor() {
    this._errors = []
  }

  public encounteredError(message: string, kind: ErrorKind = 'other'): void {
    this._errors.push(new ElziiError([message], kind))
  }

  public get errors(): ElziiError[] {
    return this._errors
  }
}

/**
 * Helper that builds and throw an error object.
 * @param message A message describing the error.
 * @param kind The origin of the error.
 */
export function throwError(message: string, kind: ErrorKind = 'other'): never {
  throw new ElziiError([message], kind)
}

type Handlers<T> = {
  [p in ErrorKind | 'elzii']?: (err: ElziiError) => T
} & {
  all?: (err: unknown) => T
}

function handleCaughtError<T>(error: unknown, handlers: Handlers<T>): T {
  let result: T

  if (error instanceof ElziiError) {
    let elziiHandler = handlers[error.kind] ?? handlers['elzii'] ?? handlers['all']
    if (elziiHandler !== undefined) {
      result = elziiHandler(error)
    } else {
      throw error
    }
  } else {
    let unknownHandler = handlers['all']
    if (unknownHandler !== undefined) {
      result = unknownHandler(error)
    } else {
      throw error
    }
  }

  return result
}

/**
 * Helper to catch errors of different types.
 * @param tryBlock A piece of code that may throw exceptions.
 * @param handlers Maps error type with functions to handle them. You can use `'elzii'` to catch all
 *                 {@link ElziiError}s and `'all'` to catch any object thrown.
 */
export function handleErrors<T>(tryBlock: () => T, handlers: Handlers<T>): T {
  let result: T
  try {
    result = tryBlock()
  } catch (error) {
    result = handleCaughtError(error, handlers)
  }
  return result
}

/**
 * Helper to catch errors of different types thrown by asynchronous operations.
 * @param tryBlock A piece of code that may throw exceptions.
 * @param handlers Maps error type with functions to handle them. You can use `'elzii'` to catch all
 *                 {@link ElziiError}s and `'all'` to catch any object thrown.
 */
export async function handleErrorsAsync<T>(
  tryBlock: () => Promise<T>,
  handlers: Handlers<T>,
): Promise<T> {
  let result: T
  try {
    result = await tryBlock()
  } catch (error) {
    result = handleCaughtError(error, handlers)
  }
  return result
}
