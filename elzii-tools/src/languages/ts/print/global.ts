import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor } from '@module/languages/ts/print/helpers'

type VisitGlobal =
  | 'visitExportDefaultDeclaration'
  | 'visitExpressionStatement'
  | 'visitImportDeclaration'
  | 'visitImportSpecifier'
  | 'visitProgram'

const TSPrinterImpl_global: Pick<Visitor, VisitGlobal> = {
  visitExportDefaultDeclaration(
    this: Visitor,
    exportDefaultDeclaration: ts.ExportDefaultDeclaration,
  ): PrintedCode {
    return new PrintedCode(
      'export default ' + this.visitAnyNode(exportDefaultDeclaration.declaration) + ';',
    )
  },

  visitExpressionStatement(
    this: Visitor,
    expressionStatement: ts.ExpressionStatement,
  ): PrintedCode {
    return new PrintedCode(this.visitAnyNode(expressionStatement.expression) + ';')
  },

  visitImportDeclaration(this: Visitor, importDeclaration: ts.ImportDeclaration): PrintedCode {
    const specifiers = importDeclaration.specifiers
      .map((spec) => ' ' + this.visitAnyNode(spec))
      .join(',')
    const source = this.visitLiteral(importDeclaration.source)

    return new PrintedCode(`import {${specifiers} } from ${source};`)
  },

  visitImportSpecifier(this: Visitor, importSpecifier: ts.ImportSpecifier): PrintedCode {
    const importedName = this.visitIdentifier(importSpecifier.imported).toString()
    const localName = this.visitIdentifier(importSpecifier.local).toString()

    let spec
    if (importedName === localName) {
      spec = importedName
    } else {
      spec = `${importedName} as ${localName}`
    }

    return new PrintedCode(spec)
  },

  visitProgram(this: Visitor, program: ts.Program): PrintedCode {
    let comments = (program.comments ?? []).map((comment) => this.visitAnyNode(comment))
    let statements = program.body.map((statement) => this.visitAnyNode(statement))
    return PrintedCode.join(comments.concat(statements, new PrintedCode('')))
  },
}

export default TSPrinterImpl_global
