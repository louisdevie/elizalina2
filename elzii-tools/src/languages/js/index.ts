import { AnyNode } from './ast'
import { JSPrinterImpl } from './print'

export { JSVisitor } from './visit'

export interface JSPrinter {
  print(code: AnyNode): Promise<string>
}

export function getJSPrinter(): JSPrinter {
  return new JSPrinterImpl()
}
