import { AntlrTMParserAdapter } from './parse'
import { Translation as TMTranslation } from './ast'

export interface TMParser {
  parse(text: string): Promise<TMTranslation>
}

export const defaultTMParser: TMParser = new AntlrTMParserAdapter()
