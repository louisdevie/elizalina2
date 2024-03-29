import { TMParser } from '../index'
import { CharStream, CommonTokenStream } from 'antlr4'
import GeneratedTMLexer from './gen/TMLexer'
import GeneratedTMParser from './gen/TMParser'
import AntlrErrorListener from './AntlrErrorListener'
import { Translation as TMTranslation } from '../ast'

export default class AntlrTMParserAdapter implements TMParser {
  async parse(text: string): Promise<TMTranslation> {
    const chars = new CharStream(text) // replace this with a FileStream as required

    const lexer = new GeneratedTMLexer(chars)
    const tokens = new CommonTokenStream(lexer)

    const parser = new GeneratedTMParser(tokens)
    // parser.removeErrorListeners()
    // TODO: uncomment this once the error listener is implemented
    const errorListener = new AntlrErrorListener()
    parser.addErrorListener(errorListener)

    return parser.translation()
  }
}
