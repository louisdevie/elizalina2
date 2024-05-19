import EtrParserVisitor from '@module/languages/tm/parse/gen/TMParserVisitor'
import { Builder } from '@module/extraction/translationFiles'
import { ErrorReport } from '@module/error'
import { TerminalNode } from 'antlr4'
import EtrLexer from '@module/languages/tm/parse/gen/TMLexer'
import { UserCode } from '@module/model'
import { Result } from '@module/extraction/result'

export default class UserCodeBuilder extends EtrParserVisitor<void> implements Builder<UserCode> {
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
