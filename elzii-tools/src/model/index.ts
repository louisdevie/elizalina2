import UserCode from './UserCode'
import { DirectiveCollection } from './directives'
import TypeHint from './TypeHint'
import Message from './Message'

export { default as UserCode } from './UserCode'
export { default as MessageParameterSet } from './MessageParameterSet'
export { default as Visibility } from './Visibility'
export { default as Message } from './Message'
export { default as TypeHint, mergeTypeHints } from './TypeHint'

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

  /**
   *
   */
  directives: DirectiveCollection
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
