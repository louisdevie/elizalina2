import { Translation } from '@module/translations'
import { AntlrEtrParserAdapter } from './parser'

export interface EtrParser {
  parse(text: string): Promise<Translation>
}

export const defaultEtrParser: EtrParser = new AntlrEtrParserAdapter()
