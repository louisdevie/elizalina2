import * as js from './ast'
import { JSPrinter, JSVisitor } from '.'

class PrintedJavaScript {
  private readonly _text: string

  public get text(): string {
    return this._text
  }

  public constructor(text: string) {
    this._text = text
  }
}

export class JSPrinterImpl extends JSVisitor<PrintedJavaScript> implements JSPrinter {
  public async print(code: js.BaseNodeWithoutComments): Promise<string> {
    return this.visitAnyNode(code).text
  }
}
