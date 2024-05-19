import EtrParserVisitor from '@module/languages/tm/parse/gen/TMParserVisitor'
import { Builder } from '@module/extraction/translationFiles/index'
import { MessageParameterFormat, MessageParameterSet, TypeHint, Visibility } from '@module/model'
import { ErrorReport, throwError } from '@module/error'
import {
  DoubleQuotedTextParameterContext,
  SingleQuotedTextParameterContext,
  SingleQuotedTextMIContext,
  DoubleQuotedTextMIContext,
} from '@module/languages/tm/parse/gen/TMParser'
import { ParserRuleContext, TerminalNode } from 'antlr4'
import EtrLexer from '@module/languages/tm/parse/gen/TMLexer'
import UserCodeBuilder from '@module/extraction/translationFiles/UserCodeBuilder'
import {
  ExtendedMessagePart,
  PreparedMessage,
} from '@module/extraction/translationFiles/PreparedMessage'
import { Result } from '@module/extraction/result'

export default class MessageBuilder
  extends EtrParserVisitor<void>
  implements Builder<PreparedMessage>
{
  private readonly _content: ExtendedMessagePart[]
  private readonly _parameters: MessageParameterSet
  private readonly _visibility: Visibility
  private readonly _report: ErrorReport

  public constructor(report?: ErrorReport, isPrivate: boolean = false) {
    super()

    this._report = report ?? new ErrorReport()
    this._content = []
    this._parameters = new MessageParameterSet()
    this._visibility = isPrivate ? Visibility.Private : Visibility.Public
  }

  public finish(): Result<PreparedMessage> {
    return {
      value: new PreparedMessage(this._parameters, this._content, this._visibility),
      errors: this._report,
    }
  }

  private foundParameter(name: string, format?: MessageParameterFormat): void {
    let typeHint = TypeHint.None
    if (format?.type === 'basic') {
      typeHint = format?.code.getTypeHint()
    }
    this._parameters.add({ name, typeHint })

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
      format = { type: 'custom', code: userCodeBuilder.finish().value }
    }

    return format
  }

  public override visitSingleQuotedTextParameter = (
    ctx: SingleQuotedTextParameterContext,
  ): void => {
    this.foundParameter(
      ctx.PARAMETER_NAME().getText(),
      this.getMessageParameterFormat(ctx.parameterFormat(), ctx.customParameterFormat()),
    )
  }

  public override visitDoubleQuotedTextParameter = (
    ctx: DoubleQuotedTextParameterContext,
  ): void => {
    this.foundParameter(
      ctx.PARAMETER_NAME().getText(),
      this.getMessageParameterFormat(ctx.parameterFormat(), ctx.customParameterFormat()),
    )
  }

  public override visitSingleQuotedTextMI = (ctx: SingleQuotedTextMIContext): void => {
    this._content.push({ type: 'interpolation', messageName: ctx.PARAMETER_NAME().getText() })
  }

  public override visitDoubleQuotedTextMI = (ctx: DoubleQuotedTextMIContext): void => {
    this._content.push({ type: 'interpolation', messageName: ctx.PARAMETER_NAME().getText() })
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

  private static escapeSequences: Map<string, string> = new Map([
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
