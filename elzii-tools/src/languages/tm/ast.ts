import { TerminalNode } from 'antlr4'
import { TMVisitor } from './visit'

export interface Node {
  accept<Result>(visitor: TMVisitor<Result>): Result
  getText(): string
}

export interface Translation extends Node {
  EOF(): TerminalNode
  NEW_LINE_list(): TerminalNode[]
  NEW_LINE(i: number): TerminalNode
  directive_list(): Directive[]
  directive(i: number): Directive
  header(): Header
  message_list(): Message[]
  message(i: number): Message
  lineComment_list(): LineComment[]
  lineComment(i: number): LineComment
  notAMessage_list(): NotAMessage[]
  notAMessage(i: number): NotAMessage
  END_OF_DIRECTIVE_list(): TerminalNode[]
  END_OF_DIRECTIVE(i: number): TerminalNode
}

export interface LineComment extends Node {
  LINE_COMMENT_START(): TerminalNode
  LINE_COMMENT_TEXT(): TerminalNode
}

export interface Header extends Node {
  HEADER_START(): TerminalNode
  EMBEDDED_CODE_CLOSING_BRACE_list(): TerminalNode[]
  EMBEDDED_CODE_CLOSING_BRACE(i: number): TerminalNode
  EMBEDDED_CODE_list(): TerminalNode[]
  EMBEDDED_CODE(i: number): TerminalNode
  EMBEDDED_CODE_OPENING_BRACE_list(): TerminalNode[]
  EMBEDDED_CODE_OPENING_BRACE(i: number): TerminalNode
}

export interface Directive extends Node {
  DIRECTIVE_NAME(): TerminalNode
  END_OF_DIRECTIVE(): TerminalNode
  DIRECTIVE_ARGUMENT_list(): TerminalNode[]
  DIRECTIVE_ARGUMENT(i: number): TerminalNode
  DIRECTIVE_ARGUMENT_SEPARATOR_list(): TerminalNode[]
  DIRECTIVE_ARGUMENT_SEPARATOR(i: number): TerminalNode
}

export interface Message extends Node {
  KEY(): TerminalNode
  SEPARATOR(): TerminalNode
  singleQuotedText(): SingleQuotedText
  doubleQuotedText(): DoubleQuotedText
}

export interface NotAMessage extends Node {
  HEADER_START(): TerminalNode
  DIRECTIVE_NAME(): TerminalNode
  NEW_LINE_list(): TerminalNode[]
  NEW_LINE(i: number): TerminalNode
  END_OF_DIRECTIVE_list(): TerminalNode[]
  END_OF_DIRECTIVE(i: number): TerminalNode
}

export interface SingleQuotedText extends Node {
  SINGLE_QUOTE(): TerminalNode
  SINGLE_QUOTE_CLOSING(): TerminalNode
  SINGLE_QUOTED_TEXT_LITERAL_list(): TerminalNode[]
  SINGLE_QUOTED_TEXT_LITERAL(i: number): TerminalNode
  SINGLE_QUOTED_ESCAPE_list(): TerminalNode[]
  SINGLE_QUOTED_ESCAPE(i: number): TerminalNode
  singleQuotedTextParameter_list(): SingleQuotedTextParameter[]
  singleQuotedTextParameter(i: number): SingleQuotedTextParameter
}

export interface DoubleQuotedText extends Node {
  DOUBLE_QUOTE(): TerminalNode
  DOUBLE_QUOTE_CLOSING(): TerminalNode
  DOUBLE_QUOTED_TEXT_LITERAL_list(): TerminalNode[]
  DOUBLE_QUOTED_TEXT_LITERAL(i: number): TerminalNode
  DOUBLE_QUOTED_ESCAPE_list(): TerminalNode[]
  DOUBLE_QUOTED_ESCAPE(i: number): TerminalNode
  doubleQuotedTextParameter_list(): DoubleQuotedTextParameter[]
  doubleQuotedTextParameter(i: number): DoubleQuotedTextParameter
}

export interface SingleQuotedTextParameter extends Node {
  SINGLE_QUOTED_PARAMETER_START(): TerminalNode
  PARAMETER_NAME(): TerminalNode
  customParameterFormat(): ShorthandParameterFormat
  parameterFormat(): ParameterFormat
  PARAMETER_END(): TerminalNode
}

export interface DoubleQuotedTextParameter extends Node {
  DOUBLE_QUOTED_PARAMETER_START(): TerminalNode
  PARAMETER_NAME(): TerminalNode
  customParameterFormat(): ShorthandParameterFormat
  parameterFormat(): ParameterFormat
  PARAMETER_END(): TerminalNode
}

export interface ParameterFormat extends Node {
  FORMAT_SEPARATOR(): TerminalNode
  EMBEDDED_CODE_CLOSING_BRACE_list(): TerminalNode[]
  EMBEDDED_CODE_CLOSING_BRACE(i: number): TerminalNode
  EMBEDDED_CODE_list(): TerminalNode[]
  EMBEDDED_CODE(i: number): TerminalNode
  EMBEDDED_CODE_OPENING_BRACE_list(): TerminalNode[]
  EMBEDDED_CODE_OPENING_BRACE(i: number): TerminalNode
}

export interface ShorthandParameterFormat extends Node {
  CUSTOM_FORMAT_SEPARATOR(): TerminalNode
  EMBEDDED_CODE_CLOSING_BRACE_list(): TerminalNode[]
  EMBEDDED_CODE_CLOSING_BRACE(i: number): TerminalNode
  EMBEDDED_CODE_list(): TerminalNode[]
  EMBEDDED_CODE(i: number): TerminalNode
  EMBEDDED_CODE_OPENING_BRACE_list(): TerminalNode[]
  EMBEDDED_CODE_OPENING_BRACE(i: number): TerminalNode
}
