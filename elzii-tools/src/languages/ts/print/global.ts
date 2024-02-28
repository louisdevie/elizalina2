import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { Visitor } from '@module/languages/ts/print/helpers'
import { importDeclaration, importSpecifier, program } from '@module/languages/ts/ast'
import { spec } from 'node:test/reporters'

type VisitGlobal =
  | 'visitExpressionStatement'
  | 'visitImportDeclaration'
  | 'visitImportSpecifier'
  | 'visitProgram'

const TSPrinterImpl_global: Pick<Visitor, VisitGlobal> = {
  visitExpressionStatement(
    this: Visitor,
    expressionStatement: ts.ExpressionStatement,
  ): PrintedCode {
    return this.visitAnyNode(expressionStatement.expression)
  },

  visitImportDeclaration(this: Visitor, importDeclaration: ts.ImportDeclaration): PrintedCode {
    const specifiers = importDeclaration.specifiers
      .map((spec) => ' ' + this.visitAnyNode(spec))
      .join(',')
    const source = this.visitLiteral(importDeclaration.source)

    return new PrintedCode(`import {${specifiers} } from ${source}`)
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
    return PrintedCode.join(
      program.body.map((statement) => this.visitAnyNode(statement)).concat(new PrintedCode('')),
    )
  },
}

export default TSPrinterImpl_global
