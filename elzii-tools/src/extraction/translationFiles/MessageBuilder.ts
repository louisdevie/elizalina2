import EtrParserVisitor from '@module/languages/tm/parse/gen/TMParserVisitor'
import { Builder, Result } from '@module/extraction/translationFiles/index'
import {
  mergeTypeHints,
  Message,
  MessageParameter,
  MessageParameterFormat,
  MessagePart,
  normalizedMessageContent,
  TypeHint,
  UserCode,
} from '@module/translations'
import { ErrorReport, throwError } from '@module/error'
import {
  DoubleQuotedTextParameterContext,
  SingleQuotedTextParameterContext,
} from '@module/languages/tm/parse/gen/TMParser'
import { ParserRuleContext, TerminalNode } from 'antlr4'
import EtrLexer from '@module/languages/tm/parse/gen/TMLexer'
import UserCodeBuilder from '@module/extraction/translationFiles/UserCodeBuilder'

export default class MessageBuilder extends EtrParserVisitor<void> implements Builder<Message> {
  private readonly _content: MessagePart[]
  private readonly _parameters: MessageParameter[]
  private readonly _report: ErrorReport

  public constructor(report?: ErrorReport) {
    super()

    this._report = report ?? new ErrorReport()
    this._content = []
    this._parameters = []
  }

  public finish(): Result<Message> {
    return {
      value: {
        parameters: Array.from(this._parameters),
        content: normalizedMessageContent(this._content),
      },
      errors: this._report,
    }
  }

  private mergeParameter(name: string, typeHint: TypeHint): MessageParameter {
    let param = this._parameters.find((p) => p.name === name)

    if (param === undefined) {
      param = { name, typeHint }
      this._parameters.push(param)
    } else {
      param.typeHint = mergeTypeHints(param.typeHint, typeHint)
    }

    return param
  }

  private foundParameter(name: string, format?: MessageParameterFormat) {
    let param = this.mergeParameter(name, format?.code.getTypeHint() ?? TypeHint.None)

    this._content.push({
      type: 'formatting',
      parameterName: name,
      format,
    })
  }

  private getMessageParameterFormat(
    basicNode: ParserRuleContext | null,
    shorthandNode: ParserRuleContext | null,
  ): MessageParameterFormat | undefined {
    let format: MessageParameterFormat | undefined = undefined

    if (basicNode !== null) {
      const userCodeBuilder = new UserCodeBuilder()
      userCodeBuilder.visit(basicNode)
      format = { type: 'basic', code: userCodeBuilder.finish().value }
    } else if (shorthandNode !== null) {
      const userCodeBuilder = new UserCodeBuilder()
      userCodeBuilder.visit(shorthandNode)
      format = { type: 'shorthand', code: userCodeBuilder.finish().value }
    }

    return format
  }

  public override visitSingleQuotedTextParameter = (ctx: SingleQuotedTextParameterContext) => {
    this.foundParameter(
      ctx.PARAMETER_NAME().getText(),
      this.getMessageParameterFormat(ctx.parameterFormat(), ctx.shorthandParameterFormat()),
    )
  }

  public override visitDoubleQuotedTextParameter = (ctx: DoubleQuotedTextParameterContext) => {
    this.foundParameter(
      ctx.PARAMETER_NAME().getText(),
      this.getMessageParameterFormat(ctx.parameterFormat(), ctx.shorthandParameterFormat()),
    )
  }

  public override visitTerminal(node: TerminalNode): void {
    switch (node.symbol.type) {
      case EtrLexer.SINGLE_QUOTED_TEXT_LITERAL:
      case EtrLexer.DOUBLE_QUOTED_TEXT_LITERAL:
        this._content.push({ type: 'text', value: node.getText() })
        break

      case EtrLexer.SINGLE_QUOTED_ESCAPE:
      case EtrLexer.DOUBLE_QUOTED_ESCAPE:
        this._content.push({
          type: 'text',
          value: MessageBuilder.processEscape(node.getText()),
        })
    }
  }

  private static escapeSequences = new Map<string, string>([
    ['\\\\', '\\'],
    ['\\n', '\n'],
    ['\\t', '\t'],
    ['\\r', '\r'],
    ["\\'", "'"],
    ['\\"', '"'],
    ['{{', '{'],
    ['}}', '}'],
  ])

  private static processEscape(escapeSequence: string): string {
    return (
      MessageBuilder.escapeSequences.get(escapeSequence) ??
      throwError(`Invalid escape sequence "${escapeSequence}"`, 'parser')
    )
  }
}
