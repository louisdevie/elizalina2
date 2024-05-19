import { PrintedCode } from '@module/printing'
import * as ts from '@module/languages/ts/ast'
import { AST_NODE_TYPES } from '@module/languages/ts/ast'
import { Visitor } from '@module/languages/ts/print/helpers'
import { throwError } from '@module/error'
import { spec } from 'node:test/reporters'

type VisitGlobal =
  | 'visitExportDefaultDeclaration'
  | 'visitExportNamedDeclaration'
  | 'visitExpressionStatement'
  | 'visitImportDeclaration'
  | 'visitImportDefaultSpecifier'
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

  visitExportNamedDeclaration(
    this: Visitor,
    exportNamedDeclaration: ts.ExportNamedDeclaration,
  ): PrintedCode {
    if (exportNamedDeclaration.declaration == null)
      throwError('Cannot print an export-from statement', 'internal')
    return new PrintedCode('export ' + this.visitAnyNode(exportNamedDeclaration.declaration))
  },

  visitExpressionStatement(
    this: Visitor,
    expressionStatement: ts.ExpressionStatement,
  ): PrintedCode {
    return new PrintedCode(this.visitAnyNode(expressionStatement.expression) + ';')
  },

  visitImportDeclaration(this: Visitor, importDeclaration: ts.ImportDeclaration): PrintedCode {
    let specifiers

    if (importDeclaration.specifiers.length === 1) {
      const singleSpec = importDeclaration.specifiers[0]

      if (singleSpec.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
        specifiers = this.visitAnyNode(singleSpec)
      }
    }

    if (specifiers === undefined) {
      const specList = importDeclaration.specifiers
        .map((spec) => ' ' + this.visitAnyNode(spec))
        .join(',')
      specifiers = '{' + specList + ' }'
    }
    const source = this.visitLiteral(importDeclaration.source)

    return new PrintedCode(`import ${specifiers} from ${source};`)
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

  visitImportDefaultSpecifier(
    this: Visitor,
    importDefaultSpecifier: ts.ImportDefaultSpecifier,
  ): PrintedCode {
    return this.visitIdentifier(importDefaultSpecifier.local)
  },

  visitProgram(this: Visitor, program: ts.Program): PrintedCode {
    let comments = (program.comments ?? []).map((comment) => this.visitAnyNode(comment))
    let statements = program.body.map((statement) => this.visitAnyNode(statement))
    return PrintedCode.join(comments.concat(statements, new PrintedCode('')))
  },
}

export default TSPrinterImpl_global
