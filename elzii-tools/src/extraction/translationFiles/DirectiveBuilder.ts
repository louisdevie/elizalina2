import EtrParserVisitor from '@module/languages/tm/parse/gen/TMParserVisitor'
import type { Builder } from '.'
import { ErrorReport } from '@module/error'
import { TerminalNode } from 'antlr4'
import EtrLexer from '@module/languages/tm/parse/gen/TMLexer'
import { DefaultDirective, Directive } from '@module/model/directives'
import { Result } from '@module/extraction/result'

export default class DirectiveBuilder
  extends EtrParserVisitor<void>
  implements Builder<Directive | null>
{
  private readonly _report: ErrorReport
  private _name?: string
  private _rawArguments: string[]

  public constructor(report?: ErrorReport) {
    super()

    this._report = report ?? new ErrorReport()

    this._rawArguments = []
  }

  public finish(): Result<Directive | null> {
    let value
    switch (this._name) {
      case 'default':
        value = new DefaultDirective()
        this.expectExactArgumentCount(0)
        break

      default:
        value = null
        this._report.encounteredError(`Unknown directive @${this._name}.`)
        break
    }
    return { value, errors: this._report }
  }

  override visitTerminal(node: TerminalNode): void {
    switch (node.symbol.type) {
      case EtrLexer.DIRECTIVE_NAME:
        this._name = node.getText().substring(1) // remove the leading @
        break

      case EtrLexer.DIRECTIVE_ARGUMENT:
        this._rawArguments.push(node.getText())
        break
    }
  }

  private expectExactArgumentCount(nb: number) {
    if (this._rawArguments.length !== nb) {
      this._report.encounteredError(
        `The @${this._name} directive expected ${nb} argument(s) but ${this._rawArguments.length} were found.`,
      )
    }
  }
}
