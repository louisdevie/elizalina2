import EtrParserVisitor from '@module/languages/tm/parse/gen/TMParserVisitor'
import { Builder } from '@module/extraction/translationFiles/index'
import { Translation } from '@module/model'
import { ErrorReport } from '@module/error'
import {
  DirectiveContext,
  HeaderContext,
  MessageContext,
} from '@module/languages/tm/parse/gen/TMParser'
import MessageBuilder from './MessageBuilder'
import UserCodeBuilder from './UserCodeBuilder'
import DirectiveBuilder from '@module/extraction/translationFiles/DirectiveBuilder'
import {
  MessageResolver,
  PreparedMessage,
} from '@module/extraction/translationFiles/PreparedMessage'
import { Result, unwrap } from '@module/extraction/result'
import { DirectiveCollection } from '@module/model/directives'

export default class TranslationBuilder
  extends EtrParserVisitor<void>
  implements Builder<Translation>, MessageResolver
{
  private readonly _translation: Translation
  private readonly _report: ErrorReport
  private readonly _messages: Map<string, PreparedMessage>

  public constructor(id: string, report?: ErrorReport) {
    super()

    this._report = report ?? new ErrorReport()
    this._messages = new Map()
    this._translation = {
      id,
      messages: new Map(),
      directives: new DirectiveCollection(),
    }
  }

  public finish(): Result<Translation> {
    for (const [key, message] of this._messages) {
      this._translation.messages.set(key, unwrap(message.bake(this, key), this._report))
    }

    return { value: this._translation, errors: this._report }
  }

  public override visitDirective = (ctx: DirectiveContext): void => {
    const directiveBuilder = new DirectiveBuilder(this._report)
    directiveBuilder.visit(ctx)
    const result = directiveBuilder.finish().value
    if (result !== null) {
      this._translation.directives.add(result)
    }
  }

  public override visitHeader = (ctx: HeaderContext): void => {
    const userCodeBuilder = new UserCodeBuilder()
    userCodeBuilder.visit(ctx)
    this._translation.header = userCodeBuilder.finish().value
  }

  public override visitMessage = (ctx: MessageContext): void => {
    const key = ctx.KEY().getText()
    const isPrivate = ctx.OPENING_PARENS() !== null && ctx.CLOSING_PARENS() !== null

    const messageBuilder = new MessageBuilder(this._report, isPrivate)
    messageBuilder.visit(ctx.singleQuotedText() || ctx.doubleQuotedText())
    this._messages.set(key, messageBuilder.finish().value)
  }

  public resolve(name: string): PreparedMessage | undefined {
    return this._messages.get(name)
  }
}
