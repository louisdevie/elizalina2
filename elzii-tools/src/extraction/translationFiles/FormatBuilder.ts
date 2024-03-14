import UserCodeBuilder from './UserCodeBuilder'
import { TerminalNode } from 'antlr4'
import EtrLexer from '@module/languages/tm/parse/gen/TMLexer'
import { ElizalinaRuntimeConfig } from '@module/generation/codeConfig'

export default class FormatBuilder extends UserCodeBuilder {
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
