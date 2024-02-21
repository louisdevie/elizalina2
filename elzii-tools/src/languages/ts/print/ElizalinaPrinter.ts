import { TSPrinter } from '..'
import { NodeOrTokenData } from '../ast'

export default class ElizalinaPrinter implements TSPrinter {
  print(code: NodeOrTokenData): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
