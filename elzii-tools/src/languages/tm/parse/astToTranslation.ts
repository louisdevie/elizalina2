import {
  mergeTypeHints,
  Message,
  MessageParameter,
  MessagePart,
  normalizedMessageContent,
  Translation,
  TypeHint,
  UserCode,
} from '@module/translations'
import { ErrorReport, throwError } from '@module/error'
import {
  DoubleQuotedTextParameterContext,
  HeaderContext,
  MessageContext,
  SingleQuotedTextParameterContext,
} from './gen/TMParser'
import EtrParserVisitor from './gen/TMParserVisitor'
import EtrLexer from './gen/TMLexer'
import { ParserRuleContext, TerminalNode } from 'antlr4'
import { ElizalinaRuntimeConfig } from '@module/generation/codeConfig'

export interface Builder<T> {
  finish(): Result<T>
}

export interface Result<T> {
  value: T
  errors: ErrorReport
}

export class TranslationBuilder extends EtrParserVisitor<void> implements Builder<Translation> {
  private readonly _translation: Translation
  private readonly _report: ErrorReport

  public constructor(report?: ErrorReport) {
    super()

    this._report = report ?? new ErrorReport()
    this._translation = {
      id: '',
      messages: new Map(),
    }
  }

  public finish(): Result<Translation> {
    return { value: this._translation, errors: this._report }
  }

  public override visitHeader = (ctx: HeaderContext) => {
    const userCodeBuilder = new UserCodeBuilder()
    userCodeBuilder.visit(ctx)
    this._translation.header = userCodeBuilder.finish().value
  }

  public override visitMessage = (ctx: MessageContext) => {
    const key = ctx.KEY().getText()

    const messageBuilder = new MessageBuilder(this._report)
    messageBuilder.visit(ctx.singleQuotedText() || ctx.doubleQuotedText())
    this._translation.messages.set(key, messageBuilder.finish().value)
  }
}

export class MessageBuilder extends EtrParserVisitor<void> implements Builder<Message> {
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

  private foundParameter(name: string, format?: UserCode) {
    let param = this.mergeParameter(name, format?.getTypeHint() ?? TypeHint.None)

    this._content.push({
      type: 'formatting',
      parameterName: name,
      format,
    })
  }

  public override visitSingleQuotedTextParameter = (ctx: SingleQuotedTextParameterContext) => {
    this.foundParameter(ctx.PARAMETER_NAME().getText())
  }

  public override visitDoubleQuotedTextParameter = (ctx: DoubleQuotedTextParameterContext) => {
    let formatNode: ParserRuleContext = ctx.parameterFormat() || ctx.shorthandParameterFormat()
    let format = undefined

    if (formatNode !== null) {
      const formatBuilder = new FormatBuilder()
      formatBuilder.visit(formatNode)
      format = formatBuilder.finish().value
    }

    this.foundParameter(ctx.PARAMETER_NAME().getText(), format)
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

export class UserCodeBuilder extends EtrParserVisitor<void> implements Builder<UserCode> {
  private _rawCode: string

  public constructor() {
    super()

    this._rawCode = ''
  }

  public finish(): Result<UserCode> {
    return {
      value: new UserCode(this._rawCode),
      errors: new ErrorReport() /* no errors are tracked */,
    }
  }

  protected terminalToCode(node: TerminalNode): string {
    let code = ''

    switch (node.symbol.type) {
      case EtrLexer.EMBEDDED_CODE:
        code = node.getText()
        break

      case EtrLexer.EMBEDDED_CODE_OPENING_BRACE:
      case EtrLexer.EMBEDDED_CODE_CLOSING_BRACE:
        // ignore last closing brace
        if (node.symbol !== node.parentCtx.stop) {
          code = node.getText()
        }
        break
    }

    return code
  }

  public override visitTerminal(node: TerminalNode): void {
    this._rawCode += this.terminalToCode(node)
  }
}

export class FormatBuilder extends UserCodeBuilder {
  public constructor() {
    super()
  }

  protected override terminalToCode(node: TerminalNode): string {
    let code = super.terminalToCode(node)

    switch (node.symbol.type) {
      case EtrLexer.SHORTHAND_FORMAT_SEPARATOR:
        code = ElizalinaRuntimeConfig.globalFormatterShorthandPrefix
        break
    }

    return code
  }
}
