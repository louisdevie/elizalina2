import * as ts from './ast'
import { TSPrinter, TSVisitor } from '.'
import { countOccurrences } from '@module/helpers'
import { throwError } from '@module/error'
import { PrintedCode, TextProcessor } from '@module/printing'
import { PlaceholdersConfig } from '@module/codeGeneration/codeConfig'

export class TSPrinterImpl extends TSVisitor<PrintedCode> implements TSPrinter {
  private readonly _postProcessors: TextProcessor[]

  public constructor() {
    super()

    this._postProcessors = []
  }

  public addPostProcessor(postProcessor: TextProcessor) {
    this._postProcessors.push(postProcessor)
  }

  public async print(code: ts.AnyNode): Promise<string> {
    let printed = this.visitAnyNode(code).toString()
    for (const postProcessor of this._postProcessors) {
      printed = postProcessor.process(printed)
    }
    return printed
  }

  // region Visitor implementation

  public visitIdentifier(identifier: ts.Identifier): PrintedCode {
    return new PrintedCode(identifier.name)
  }

  public visitImportDeclaration(importDeclaration: ts.ImportDeclaration): PrintedCode {
    const specifiers = importDeclaration.specifiers
      .map((spec) => ' ' + this.visitAnyNode(spec))
      .join(',')
    const source = this.visitLiteral(importDeclaration.source)

    return new PrintedCode(`import {${specifiers} } from ${source}`)
  }

  public visitImportSpecifier(importSpecifier: ts.ImportSpecifier): PrintedCode {
    const importedName = this.visitIdentifier(importSpecifier.imported).toString()
    const localName = this.visitIdentifier(importSpecifier.local).toString()

    let spec
    if (importedName === localName) {
      spec = importedName
    } else {
      spec = `${importedName} as ${localName}`
    }

    return new PrintedCode(spec)
  }

  public visitLiteral(literal: ts.Literal): PrintedCode {
    let code

    switch (typeof literal.value) {
      case 'string':
        const singleQuoteCount = countOccurrences("'", literal.value)
        const doubleQuoteCount = countOccurrences('"', literal.value)
        if (singleQuoteCount > doubleQuoteCount) {
          code = '"' + TSPrinterImpl.escapeDoubleQuotedString(literal.value) + '"'
        } else {
          code = "'" + TSPrinterImpl.escapeSingleQuotedString(literal.value) + "'"
        }
        break

      default:
        throwError(`Invalid type of literal: ${typeof literal.value}`, 'internal')
    }

    return new PrintedCode(code)
  }

  public visitProgram(program: ts.Program): PrintedCode {
    return PrintedCode.join(program.body.map((statement) => this.visitAnyNode(statement)))
  }

  // endregion Visitor implementation

  // region Helpers

  private static escapeSingleQuotedString(string: string): string {
    return this.escapeAnyString(string).replace("'", "\\'")
  }

  private static escapeDoubleQuotedString(string: string): string {
    return this.escapeAnyString(string).replace('"', '\\"')
  }

  private static readonly escapeSequences = new Map([
    ['\\', '\\\\'], // backslashes must be replaced first, otherwise the others would be escaped twice
    ['\0', '\\0'],
    ['\n', '\\n'],
    ['\r', '\\r'],
    ['\v', '\\v'],
    ['\t', '\\t'],
    ['\b', '\\b'],
    ['\f', '\\f'],
  ])

  private static escapeAnyString(string: string): string {
    return string.replace(/[\\\0\n\r\v\t\b\f]/g, (char) => this.escapeSequences.get(char) ?? char)
  }

  // endregion Helpers
}
