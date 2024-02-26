export { TSVisitor } from './visit'

import { TextProcessor } from '@module/printing'
import { AnyNode } from './ast'
import { TSPrinterImpl } from './print'

export interface TSPrinter {
  print(code: AnyNode): Promise<string>
}

export function getTSPrinter(...postProcessors: TextProcessor[]): TSPrinter {
  const printer = new TSPrinterImpl()
  for (const postProcessor of postProcessors) {
    printer.addPostProcessor(postProcessor)
  }
  return printer
}
