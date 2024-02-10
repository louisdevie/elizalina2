import { EtrParser } from '@module/etrFormat'
import { Translation } from '@module/translations'
import { CharStream, CommonTokenStream } from 'antlr4'
import GeneratedEtrLexer from './gen/EtrLexer'
import GeneratedEtrParser from './gen/EtrParser'
import AntlrErrorListener from './AntlrErrorListener'
import { TranslationBuilder } from './astToTranslation'

export default class AntlrEtrParserAdapter implements EtrParser {
  async parse(text: string): Promise<Translation> {
    const chars = new CharStream(text) // replace this with a FileStream as required

    const lexer = new GeneratedEtrLexer(chars)
    const tokens = new CommonTokenStream(lexer)

    const parser = new GeneratedEtrParser(tokens)
    const errorListener = new AntlrErrorListener()
    parser.addErrorListener(errorListener)

    const trBuilder = new TranslationBuilder()
    const tree = parser.translation()
    tree.accept(trBuilder)

    const { errors: builderErrors, value } = trBuilder.finish()

    return value
  }
}
