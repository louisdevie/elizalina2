import * as ts from '../ast'
import { TSPrinter, TSVisitor } from '../index'
import { PrintedCode, TextProcessor } from '@module/printing'
import type { Visitor } from './helpers'

import TSPrinterImpl_classes from './classes'
import TSPrinterImpl_functions from './functions'
import TSPrinterImpl_global from './global'
import TSPrinterImpl_misc from './misc'
import TSPrinterImpl_terminals from './terminals'
import TSPrinterImpl_types from './types'
import TSPrinterImpl_expressions from './expressions'

// the implementation of this class is split into the objects imported above

export class TSPrinterImpl extends TSVisitor<PrintedCode> implements TSPrinter, Visitor {
  private readonly _postProcessors: TextProcessor[]
  private _lineBreaksAllowed: boolean

  public constructor() {
    super()

    this._postProcessors = []
    this._lineBreaksAllowed = true
  }

  public addPostProcessor(postProcessor: TextProcessor) {
    this._postProcessors.push(postProcessor)
  }

  public get lineBreaksAllowed(): boolean {
    return this._lineBreaksAllowed
  }

  public allowLineBreaks() {
    this._lineBreaksAllowed = true
  }

  public disallowLineBreaks() {
    this._lineBreaksAllowed = false
  }

  public async print(code: ts.AnyNode): Promise<string> {
    let printed = this.visitAnyNode(code).toString()
    for (const postProcessor of this._postProcessors) {
      printed = postProcessor.process(printed)
    }
    return printed
  }

  // region Visitor implementation

  public visitArrayExpression = TSPrinterImpl_expressions.visitArrayExpression

  public visitArrowFunctionExpression = TSPrinterImpl_functions.visitArrowFunctionExpression

  public visitAssignmentExpression = TSPrinterImpl_expressions.visitAssignmentExpression

  public visitBlockComment = TSPrinterImpl_terminals.visitBlockComment

  public visitBlockStatement = TSPrinterImpl_misc.visitBlockStatement

  public visitCallExpression = TSPrinterImpl_functions.visitCallExpression

  public visitClassBody = TSPrinterImpl_classes.visitClassBody

  public visitClassDeclaration = TSPrinterImpl_classes.visitClassDeclaration

  public visitExportDefaultDeclaration = TSPrinterImpl_global.visitExportDefaultDeclaration

  public visitExportNamedDeclaration = TSPrinterImpl_global.visitExportNamedDeclaration

  public visitExpressionStatement = TSPrinterImpl_global.visitExpressionStatement

  public visitFunctionExpression = TSPrinterImpl_functions.visitFunctionExpression

  public visitIdentifier = TSPrinterImpl_expressions.visitIdentifier

  public visitImportDeclaration = TSPrinterImpl_global.visitImportDeclaration

  public visitImportExpression = TSPrinterImpl_expressions.visitImportExpression

  public visitImportSpecifier = TSPrinterImpl_global.visitImportSpecifier

  public visitLiteral = TSPrinterImpl_terminals.visitLiteral

  public visitMemberExpression = TSPrinterImpl_expressions.visitMemberExpression

  public visitMethodDefinition = TSPrinterImpl_classes.visitMethodDefinition

  public visitNewExpression = TSPrinterImpl_classes.visitNewExpression

  public visitObjectExpression = TSPrinterImpl_expressions.visitObjectExpression

  public visitProgram = TSPrinterImpl_global.visitProgram

  public visitProperty = TSPrinterImpl_expressions.visitProperty

  public visitPropertyDefinition = TSPrinterImpl_classes.visitPropertyDefinition

  public visitReturnStatement = TSPrinterImpl_functions.visitReturnStatement

  public visitTemplateElement = TSPrinterImpl_expressions.visitTemplateElement

  public visitTemplateLiteral = TSPrinterImpl_expressions.visitTemplateLiteral

  public visitVariableDeclaration = TSPrinterImpl_misc.visitVariableDeclaration

  public visitVariableDeclarator = TSPrinterImpl_misc.visitVariableDeclarator

  public visitThisExpression = TSPrinterImpl_expressions.visitThisExpression

  public visitTSAnyKeyword = TSPrinterImpl_types.visitTSAnyKeyword

  public visitTSArrayType = TSPrinterImpl_types.visitTSArrayType

  public visitTSClassImplements = TSPrinterImpl_classes.visitTSClassImplements

  public visitTSInterfaceBody = TSPrinterImpl_classes.visitTSInterfaceBody

  public visitTSInterfaceDeclaration = TSPrinterImpl_classes.visitTSInterfaceDeclaration

  public visitTSMethodSignature = TSPrinterImpl_classes.visitTSMethodSignature

  public visitTSStringKeyword = TSPrinterImpl_types.visitTSStringKeyword

  public visitTSNumberKeyword = TSPrinterImpl_types.visitTSNumberKeyword

  public visitTSTypeAnnotation = TSPrinterImpl_types.visitTSTypeAnnotation

  public visitTSTypeParameterInstantiation = TSPrinterImpl_types.visitTSTypeParameterInstantiation

  public visitTSTypeReference = TSPrinterImpl_types.visitTSTypeReference

  // endregion Visitor implementation
}
