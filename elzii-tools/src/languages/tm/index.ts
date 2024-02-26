import { Translation } from '@module/translations'
import { AntlrTMParserAdapter } from './parse'

export interface TMParser {
  parse(text: string): Promise<Translation>
}

export const defaultTMParser: TMParser = new AntlrTMParserAdapter()
