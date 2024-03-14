import EtrParserVisitor from '@module/languages/tm/parse/gen/TMParserVisitor'
import { Builder, Result } from '@module/extraction/translationFiles/index'
import { Translation } from '@module/translations'
import { ErrorReport } from '@module/error'
import { HeaderContext, MessageContext } from '@module/languages/tm/parse/gen/TMParser'
import MessageBuilder from './MessageBuilder'
import UserCodeBuilder from './UserCodeBuilder'

export default class TranslationBuilder
  extends EtrParserVisitor<void>
  implements Builder<Translation>
{
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
