import { ElizalinaRuntimeConfig } from '@module/generation/codeConfig'

/**
 * A translation of a project.
 */
export interface Translation {
  /**
   * The canonical locale name of this translation (for example "en-UK").
   */
  id: string

  /**
   * The translated messages.
   */
  messages: Map<string, Message>

  /**
   * Custom code to be included at the beginning of compiled files.
   */
  header?: UserCode
}

/**
 * A translated message.
 */
export interface Message {
  /**
   * The parameters used in the message.
   */
  parameters: MessageParameter[]

  /**
   * The content of the message.
   */
  content: MessagePart[]
}

/**
 * The parameter of a message.
 */
export interface MessageParameter {
  /**
   * The name of the parameter.
   */
  name: string

  /**
   * A hint about the type of value expected.
   */
  typeHint: TypeHint
}

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

export type MessageParameterFormat = {
  type: 'basic' | 'custom'
  code: UserCode
}

/**
 * A part of a message's content.
 */
export type MessagePart =
  | { type: 'text'; value: string }
  | {
      type: 'formatting'
      parameterName: string
      format?: MessageParameterFormat
    }

/**
 * A piece of code written by the user.
 */
export class UserCode {
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

/**
 * Concatenates adjacent literal message parts to simplify a message's content.
 * @param content The original message parts.
 */
export function normalizedMessageContent(content: MessagePart[]): MessagePart[] {
  let normalized: MessagePart[] = []
  let lastNormalizedPartIsText = false

  for (const part of content) {
    if (part.type === 'text' && lastNormalizedPartIsText) {
      // cast into a text part
      ;(normalized[normalized.length - 1] as { value: string }).value += part.value
    } else {
      normalized.push(part)
      lastNormalizedPartIsText = part.type === 'text'
    }
  }

  return normalized
}
