import { CodeStyle } from '@module/options'
import { NodeOrTokenData } from './ast'

export { default as ProgramBuilder } from './ProgramBuilder'

export interface TSPrinter {
  print(code: NodeOrTokenData): Promise<string>
}

export function getTSPrinter(codeStyle: CodeStyle): TSPrinter {
  return {}
}
