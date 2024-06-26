import * as tm from '@module/languages/tm/ast'

interface ParameterData {
  name: string
  format: string | null
  custom: string | null
}

function getSQTParameterData(param: tm.SingleQuotedTextParameter): ParameterData {
  const format: tm.ParameterFormat | null = param.parameterFormat()
  const custom: tm.ShorthandParameterFormat | null = param.customParameterFormat()
  return {
    name: param.PARAMETER_NAME().getText(),
    format: format === null ? null : format.getText(),
    custom: custom === null ? null : custom.getText(),
  }
}

function getDQTParameterData(param: tm.DoubleQuotedTextParameter): ParameterData {
  const format = param.parameterFormat()
  const custom = param.customParameterFormat()
  return {
    name: param.PARAMETER_NAME().getText(),
    format: format === null ? null : format.getText(),
    custom: custom === null ? null : custom.getText(),
  }
}

interface TextData {
  literals: string[]
  escapes: string[]
  parameters: ParameterData[]
}

function getSingleQuotedTextData(text: tm.SingleQuotedText): TextData {
  return {
    literals: text.SINGLE_QUOTED_TEXT_LITERAL_list().map((token) => token.getText()),
    escapes: text.SINGLE_QUOTED_ESCAPE_list().map((token) => token.getText()),
    parameters: text.singleQuotedTextParameter_list().map((param) => getSQTParameterData(param)),
  }
}

function getDoubleQuotedTextData(text: tm.DoubleQuotedText): TextData {
  return {
    literals: text.DOUBLE_QUOTED_TEXT_LITERAL_list().map((token) => token.getText()),
    escapes: text.DOUBLE_QUOTED_ESCAPE_list().map((token) => token.getText()),
    parameters: text.doubleQuotedTextParameter_list().map((param) => getDQTParameterData(param)),
  }
}

interface MessageData {
  key: string
  hasParens: boolean
  singleQuotedText: TextData | null
  doubleQuotedText: TextData | null
}

export function getMessageData(message: tm.Message): MessageData {
  const sqt = message.singleQuotedText()
  const dqt = message.doubleQuotedText()
  return {
    key: message.KEY().getText(),
    hasParens: message.OPENING_PARENS() !== null && message.CLOSING_PARENS() !== null,
    singleQuotedText: sqt === null ? null : getSingleQuotedTextData(sqt),
    doubleQuotedText: dqt === null ? null : getDoubleQuotedTextData(dqt),
  }
}

interface DirectiveData {
  name: string
  arguments: string[]
}

export function getDirectivesData(directives: tm.Directive[]): DirectiveData[] {
  return directives.map((directive) => ({
    name: directive.DIRECTIVE_NAME().getText(),
    arguments: directive.DIRECTIVE_ARGUMENT_list().map((token) => token.getText()),
  }))
}
