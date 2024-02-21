import { TMParser } from '../index'
import { Translation } from '@module/translations'
import { CharStream, CommonTokenStream } from 'antlr4'
import GeneratedTMLexer from './gen/TMLexer'
import GeneratedTMParser from './gen/TMParser'
import AntlrErrorListener from './AntlrErrorListener'
import { TranslationBuilder } from './astToTranslation'

export default class AntlrTMParserAdapter implements TMParser {
  async parse(text: string): Promise<Translation> {
    const chars = new CharStream(text) // replace this with a FileStream as required

    const lexer = new GeneratedTMLexer(chars)
    const tokens = new CommonTokenStream(lexer)

    const parser = new GeneratedTMParser(tokens)
    const errorListener = new AntlrErrorListener()
    parser.addErrorListener(errorListener)

    const trBuilder = new TranslationBuilder()
    const tree = parser.translation()
    tree.accept(trBuilder)

    const { errors: builderErrors, value } = trBuilder.finish()

    return value
  }
}
