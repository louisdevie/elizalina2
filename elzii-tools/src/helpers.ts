import { throwError } from '@module/error'
import fs from 'node:fs'

/**
 * Throws an error if a promise in encountered.
 * @param maybePromise A value that may be a promise.
 */
export function expectNoPromise<T>(maybePromise: T | Promise<T>): T {
  if (maybePromise instanceof Promise) {
    throwError('Unexpected promise value', 'other')
  } else {
    return maybePromise
  }
}

/**
 * Checks the environment for a NO_COLOR variable (see the spec at https://no-color.org/)
 */
export function noColorEnv(): boolean {
  return process.env.NO_COLOR !== undefined
}

export function doNothing(...args: any[]): void {
  /* do nothing */
}

export function access(path: fs.PathLike, mode?: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) =>
    fs.access(path, mode, (err) => resolve(err === null)),
  )
}
