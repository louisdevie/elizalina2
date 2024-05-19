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

/**
 * A reducer that returns the smallest value of the array, or `undefined` if the array is empty.
 *
 * Example usage:
 * ```js
 * let min = myArray.reduce(minReducer, undefined)
 * ```
 */
export function minReducer(
  previousValue: number | undefined,
  currentValue: number,
): number | undefined {
  let smallest

  if (previousValue === undefined || currentValue < previousValue) {
    smallest = currentValue
  } else {
    smallest = previousValue
  }

  return smallest
}

/**
 * Count the number of times `pattern` appears in `text`.
 *
 * @param pattern The string to search for.
 * @param text The string to search in.
 * @param distinct If true (the default), it will count overlapping occurrences as one.
 */
export function countOccurrences(pattern: string, text: string, distinct?: boolean): number
/**
 * Count the number of times `pattern` matches against `text`.
 *
 * @param pattern The regex to use.
 * @param text The string to search.
 */
export function countOccurrences(pattern: RegExp, text: string): number
export function countOccurrences(
  pattern: string | RegExp,
  text: string,
  distinct: boolean = true,
): number {
  let count
  if (typeof pattern === 'string') {
    if (pattern.length === 0) {
      count = text.length + 1
    } else {
      let index = 0
      count = -1 // we always increment one time more than the actual count
      do {
        count++
        index = text.indexOf(pattern, index + pattern.length)
      } while (index !== -1)
    }
  } else {
    count = text.match(pattern)?.length ?? 0
  }
  return count
}

/**
 * Generate n bits of random hexadecimal data.
 * @param bits The number of bits of data to generate, defaults to 32.
 */
export function randomHex(bits: number = 32): string {
  const digits = Math.floor(bits / 4)

  return Math.floor(Math.random() * Math.pow(2, bits))
    .toString(16)
    .padStart(digits, '0')
}

/**
 * A value with an index.
 */
export interface IndexOf<T> {
  index: number
  value: T
}
