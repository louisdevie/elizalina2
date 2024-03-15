import * as ts from '../ast'
import { TSPrinter, TSVisitor } from '../index'
import { PrintedCode, TextProcessor } from '@module/printing'

import TSPrinterImpl_classes from './classes'
import TSPrinterImpl_functions from './functions'
import TSPrinterImpl_global from './global'
import TSPrinterImpl_misc from './misc'
import TSPrinterImpl_terminals from './terminals'
import TSPrinterImpl_types from './types'

// the implementation of this class is split into the objects imported above

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

  public visitArrowFunctionExpression = TSPrinterImpl_functions.visitArrowFunctionExpression

  public visitAssignmentExpression = TSPrinterImpl_misc.visitAssignmentExpression

  public visitBlockComment = TSPrinterImpl_terminals.visitBlockComment

  public visitBlockStatement = TSPrinterImpl_misc.visitBlockStatement

  public visitCallExpression = TSPrinterImpl_functions.visitCallExpression

  public visitClassBody = TSPrinterImpl_classes.visitClassBody

  public visitClassDeclaration = TSPrinterImpl_classes.visitClassDeclaration

  public visitExportDefaultDeclaration = TSPrinterImpl_global.visitExportDefaultDeclaration

  public visitExportNamedDeclaration = TSPrinterImpl_global.visitExportNamedDeclaration

  public visitExpressionStatement = TSPrinterImpl_global.visitExpressionStatement

  public visitFunctionExpression = TSPrinterImpl_functions.visitFunctionExpression

  public visitIdentifier = TSPrinterImpl_misc.visitIdentifier

  public visitImportDeclaration = TSPrinterImpl_global.visitImportDeclaration

  public visitImportSpecifier = TSPrinterImpl_global.visitImportSpecifier

  public visitLiteral = TSPrinterImpl_terminals.visitLiteral

  public visitMemberExpression = TSPrinterImpl_misc.visitMemberExpression

  public visitMethodDefinition = TSPrinterImpl_classes.visitMethodDefinition

  public visitProgram = TSPrinterImpl_global.visitProgram

  public visitPropertyDefinition = TSPrinterImpl_classes.visitPropertyDefinition

  public visitReturnStatement = TSPrinterImpl_functions.visitReturnStatement

  public visitTemplateElement = TSPrinterImpl_misc.visitTemplateElement

  public visitTemplateLiteral = TSPrinterImpl_misc.visitTemplateLiteral

  public visitThisExpression = TSPrinterImpl_misc.visitThisExpression

  public visitTSAnyKeyword = TSPrinterImpl_types.visitTSAnyKeyword

  public visitTSArrayType = TSPrinterImpl_types.visitTSArrayType

  public visitTSClassImplements = TSPrinterImpl_classes.visitTSClassImplements

  public visitTSInterfaceBody = TSPrinterImpl_classes.visitTSInterfaceBody

  public visitTSInterfaceDeclaration = TSPrinterImpl_classes.visitTSInterfaceDeclaration

  public visitTSMethodSignature = TSPrinterImpl_classes.visitTSMethodSignature

  public visitTSStringKeyword = TSPrinterImpl_types.visitTSStringKeyword

  public visitTSNumberKeyword = TSPrinterImpl_types.visitTSNumberKeyword

  public visitTSTypeAnnotation = TSPrinterImpl_types.visitTSTypeAnnotation

  public visitTSTypeReference = TSPrinterImpl_types.visitTSTypeReference

  // endregion Visitor implementation
}
