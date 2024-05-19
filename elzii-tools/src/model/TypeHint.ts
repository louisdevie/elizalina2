/**
 * Available type hints for message parameters.
 */
export enum TypeHint {
  /**
   * No type hint, the values could be anything.
   */
  None = 'none',

  /**
   * A numeric value is expected.
   */
  Number = 'number',

  /**
   * A date and/or time value is expected.
   */
  Datetime = 'datetime',

  /**
   * A plain string value is expected.
   */
  String = 'string',

  /**
   * A collection of values is expected.
   */
  List = 'list',

  /**
   * Multiple types were expected from the same parameter.
   */
  Mixed = 'mixed',
}

export function mergeTypeHints(first: TypeHint, second: TypeHint): TypeHint {
  let merged

  if (first === second || first === TypeHint.None) {
    merged = second
  } else if (second === TypeHint.None) {
    merged = first
  } else {
    merged = TypeHint.Mixed
  }

  return merged
}

export default TypeHint
