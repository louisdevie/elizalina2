import * as tm from '@module/languages/tm/ast'

interface ParameterData {
  name: string
  format: string | null
  shorthand: string | null
}

function getSQTParameterData(param: tm.SingleQuotedTextParameter): ParameterData {
  const format = param.parameterFormat()
  const shorthand = param.shorthandParameterFormat()
  return {
    name: param.PARAMETER_NAME().getText(),
    format: format === null ? null : format.getText(),
    shorthand: shorthand === null ? null : shorthand.getText(),
  }
}

function getDQTParameterData(param: tm.DoubleQuotedTextParameter): ParameterData {
  const format = param.parameterFormat()
  const shorthand = param.shorthandParameterFormat()
  return {
    name: param.PARAMETER_NAME().getText(),
    format: format === null ? null : format.getText(),
    shorthand: shorthand === null ? null : shorthand.getText(),
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
  singleQuotedText: TextData | null
  doubleQuotedText: TextData | null
}

export function getMessageData(message: tm.Message): MessageData {
  const sqt = message.singleQuotedText()
  const dqt = message.doubleQuotedText()
  return {
    key: message.KEY().getText(),
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
