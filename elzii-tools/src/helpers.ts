import fs from 'node:fs'

/**
 * Converts a value that *may* be a promise into a promise if it is a regular value.
 * @param maybePromise A value that may be a promise.
 * @return That value always inside a promise.
 */
export function intoPromise<T>(maybePromise: T | Promise<T>): Promise<T> {
  if (maybePromise instanceof Promise) {
    return maybePromise
  } else {
    return Promise.resolve(maybePromise)
  }
}

/**
 * Checks the environment for a NO_COLOR variable (see the spec at https://no-color.org/)
 */
export function noColorEnv(): boolean {
  return process.env.NO_COLOR !== undefined
}

export function doNothing(..._: any[]): void {
  /* do nothing */
}