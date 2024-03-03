import * as ts from './ast'
import { throwError } from '@module/error'

// nodes that are not needed are commented out

export abstract class TSVisitor<T = void> {
  public visitAnyNode(node: ts.AnyNode): T {
    let result

    switch (node.type) {
      /* case 'AccessorProperty':
          result = this.visitAccessorProperty(node as ts.AccessorProperty)
           break*/
      /* case 'ArrayExpression':
          result = this.visitArrayExpression(node as ts.ArrayExpression)
           break*/
      /* case 'ArrayPattern':
          result = this.visitArrayPattern(node as ts.ArrayPattern)
           break*/
      /* case 'ArrowFunctionExpression':
          result = this.visitArrowFunctionExpression(node as ts.ArrowFunctionExpression)
           break*/
      /* case 'AssignmentExpression':
          result = this.visitAssignmentExpression(node as ts.AssignmentExpression)
           break*/
      /* case 'AssignmentPattern':
          result = this.visitAssignmentPattern(node as ts.AssignmentPattern)
           break*/
      /* case 'AwaitExpression':
          result = this.visitAwaitExpression(node as ts.AwaitExpression)
           break*/
      /* case 'BinaryExpression':
          result = this.visitBinaryExpression(node as ts.BinaryExpression)
           break*/
      case 'Block':
        result = this.visitBlockComment(node as ts.BlockComment)
        break
      case 'BlockStatement':
        result = this.visitBlockStatement(node as ts.BlockStatement)
        break
      /* case 'BreakStatement':
          result = this.visitBreakStatement(node as ts.BreakStatement)
           break*/
      case 'CallExpression':
        result = this.visitCallExpression(node as ts.CallExpression)
        break
      /* case 'CatchClause':
          result = this.visitCatchClause(node as ts.CatchClause)
           break*/
      /* case 'ChainExpression':
          result = this.visitChainExpression(node as ts.ChainExpression)
           break*/
      case 'ClassBody':
        result = this.visitClassBody(node as ts.ClassBody)
        break
      case 'ClassDeclaration':
        result = this.visitClassDeclaration(node as ts.ClassDeclaration)
        break
      /* case 'ClassExpression':
          result = this.visitClassExpression(node as ts.ClassExpression)
           break*/
      /* case 'ConditionalExpression':
          result = this.visitConditionalExpression(node as ts.ConditionalExpression)
           break*/
      /* case 'ContinueStatement':
          result = this.visitContinueStatement(node as ts.ContinueStatement)
           break*/
      /* case 'DebuggerStatement':
          result = this.visitDebuggerStatement(node as ts.DebuggerStatement)
           break*/
      /* case 'Decorator':
          result = this.visitDecorator(node as ts.Decorator)
           break*/
      /* case 'DoWhileStatement':
          result = this.visitDoWhileStatement(node as ts.DoWhileStatement)
           break*/
      /* case 'EmptyStatement':
          result = this.visitEmptyStatement(node as ts.EmptyStatement)
           break*/
      /* case 'ExportAllDeclaration':
          result = this.visitExportAllDeclaration(node as ts.ExportAllDeclaration)
           break*/
      case 'ExportDefaultDeclaration':
        result = this.visitExportDefaultDeclaration(node as ts.ExportDefaultDeclaration)
        break
      case 'ExportNamedDeclaration':
        result = this.visitExportNamedDeclaration(node as ts.ExportNamedDeclaration)
        break
      /* case 'ExportSpecifier':
          result = this.visitExportSpecifier(node as ts.ExportSpecifier)
           break*/
      case 'ExpressionStatement':
        result = this.visitExpressionStatement(node as ts.ExpressionStatement)
        break
      /* case 'ForInStatement':
          result = this.visitForInStatement(node as ts.ForInStatement)
           break*/
      /* case 'ForOfStatement':
          result = this.visitForOfStatement(node as ts.ForOfStatement)
           break*/
      /* case 'ForStatement':
          result = this.visitForStatement(node as ts.ForStatement)
           break*/
      /* case 'FunctionDeclaration':
          result = this.visitFunctionDeclaration(node as ts.FunctionDeclaration)
           break*/
      case 'FunctionExpression':
        result = this.visitFunctionExpression(node as ts.FunctionExpression)
        break
      case 'Identifier':
        result = this.visitIdentifier(node as ts.Identifier)
        break
      /* case 'IfStatement':
          result = this.visitIfStatement(node as ts.IfStatement)
           break*/
      /* case 'ImportAttribute':
          result = this.visitImportAttribute(node as ts.ImportAttribute)
           break*/
      case 'ImportDeclaration':
        result = this.visitImportDeclaration(node as ts.ImportDeclaration)
        break
      /* case 'ImportDefaultSpecifier':
          result = this.visitImportDefaultSpecifier(node as ts.ImportDefaultSpecifier)
           break*/
      /* case 'ImportExpression':
          result = this.visitImportExpression(node as ts.ImportExpression)
           break*/
      /* case 'ImportNamespaceSpecifier':
          result = this.visitImportNamespaceSpecifier(node as ts.ImportNamespaceSpecifier)
           break*/
      case 'ImportSpecifier':
        result = this.visitImportSpecifier(node as ts.ImportSpecifier)
        break
      /* case 'JSXAttribute':
          result = this.visitJSXAttribute(node as ts.JSXAttribute)
           break*/
      /* case 'JSXClosingElement':
          result = this.visitJSXClosingElement(node as ts.JSXClosingElement)
           break*/
      /* case 'JSXClosingFragment':
          result = this.visitJSXClosingFragment(node as ts.JSXClosingFragment)
           break*/
      /* case 'JSXElement':
          result = this.visitJSXElement(node as ts.JSXElement)
           break*/
      /* case 'JSXEmptyExpression':
          result = this.visitJSXEmptyExpression(node as ts.JSXEmptyExpression)
           break*/
      /* case 'JSXExpressionContainer':
          result = this.visitJSXExpressionContainer(node as ts.JSXExpressionContainer)
           break*/
      /* case 'JSXFragment':
          result = this.visitJSXFragment(node as ts.JSXFragment)
           break*/
      /* case 'JSXIdentifier':
          result = this.visitJSXIdentifier(node as ts.JSXIdentifier)
           break*/
      /* case 'JSXMemberExpression':
          result = this.visitJSXMemberExpression(node as ts.JSXMemberExpression)
           break*/
      /* case 'JSXNamespacedName':
          result = this.visitJSXNamespacedName(node as ts.JSXNamespacedName)
           break*/
      /* case 'JSXOpeningElement':
          result = this.visitJSXOpeningElement(node as ts.JSXOpeningElement)
           break*/
      /* case 'JSXOpeningFragment':
          result = this.visitJSXOpeningFragment(node as ts.JSXOpeningFragment)
           break*/
      /* case 'JSXSpreadAttribute':
          result = this.visitJSXSpreadAttribute(node as ts.JSXSpreadAttribute)
           break*/
      /* case 'JSXSpreadChild':
          result = this.visitJSXSpreadChild(node as ts.JSXSpreadChild)
           break*/
      /* case 'JSXText':
          result = this.visitJSXText(node as ts.JSXText)
           break*/
      /* case 'LabeledStatement':
          result = this.visitLabeledStatement(node as ts.LabeledStatement)
           break*/
      case 'Literal':
        result = this.visitLiteral(node as ts.Literal)
        break
      /* case 'LogicalExpression':
          result = this.visitLogicalExpression(node as ts.LogicalExpression)
           break*/
      /* case 'MemberExpression':
          result = this.visitMemberExpression(node as ts.MemberExpression)
           break*/
      /* case 'MetaProperty':
          result = this.visitMetaProperty(node as ts.MetaProperty)
           break*/
      case 'MethodDefinition':
        result = this.visitMethodDefinition(node as ts.MethodDefinition)
        break
      /* case 'NewExpression':
          result = this.visitNewExpression(node as ts.NewExpression)
           break*/
      /* case 'ObjectExpression':
          result = this.visitObjectExpression(node as ts.ObjectExpression)
           break*/
      /* case 'ObjectPattern':
          result = this.visitObjectPattern(node as ts.ObjectPattern)
           break*/
      /* case 'PrivateIdentifier':
          result = this.visitPrivateIdentifier(node as ts.PrivateIdentifier)
           break*/
      case 'Program':
        result = this.visitProgram(node as ts.Program)
        break
      /* case 'Property':
          result = this.visitProperty(node as ts.Property)
           break*/
      /* case 'PropertyDefinition':
          result = this.visitPropertyDefinition(node as ts.PropertyDefinition)
           break*/
      /* case 'RestElement':
          result = this.visitRestElement(node as ts.RestElement)
           break*/
      case 'ReturnStatement':
        result = this.visitReturnStatement(node as ts.ReturnStatement)
        break
      /* case 'SequenceExpression':
          result = this.visitSequenceExpression(node as ts.SequenceExpression)
           break*/
      /* case 'SpreadElement':
          result = this.visitSpreadElement(node as ts.SpreadElement)
           break*/
      /* case 'StaticBlock':
          result = this.visitStaticBlock(node as ts.StaticBlock)
           break*/
      /* case 'Super':
          result = this.visitSuper(node as ts.Super)
           break*/
      /* case 'SwitchCase':
          result = this.visitSwitchCase(node as ts.SwitchCase)
           break*/
      /* case 'SwitchStatement':
          result = this.visitSwitchStatement(node as ts.SwitchStatement)
           break*/
      /* case 'TaggedTemplateExpression':
          result = this.visitTaggedTemplateExpression(node as ts.TaggedTemplateExpression)
           break*/
      case 'TemplateElement':
        result = this.visitTemplateElement(node as ts.TemplateElement)
        break
      case 'TemplateLiteral':
        result = this.visitTemplateLiteral(node as ts.TemplateLiteral)
        break
      /* case 'ThisExpression':
          result = this.visitThisExpression(node as ts.ThisExpression)
           break*/
      /* case 'ThrowStatement':
          result = this.visitThrowStatement(node as ts.ThrowStatement)
           break*/
      /* case 'TryStatement':
          result = this.visitTryStatement(node as ts.TryStatement)
           break*/
      /* case 'UnaryExpression':
          result = this.visitUnaryExpression(node as ts.UnaryExpression)
           break*/
      /* case 'UpdateExpression':
          result = this.visitUpdateExpression(node as ts.UpdateExpression)
           break*/
      /* case 'VariableDeclaration':
          result = this.visitVariableDeclaration(node as ts.VariableDeclaration)
           break*/
      /* case 'VariableDeclarator':
          result = this.visitVariableDeclarator(node as ts.VariableDeclarator)
           break*/
      /* case 'WhileStatement':
          result = this.visitWhileStatement(node as ts.WhileStatement)
           break*/
      /* case 'WithStatement':
          result = this.visitWithStatement(node as ts.WithStatement)
           break*/
      /* case 'YieldExpression':
          result = this.visitYieldExpression(node as ts.YieldExpression)
           break*/
      /* case 'TSAbstractAccessorProperty':
          result = this.visitTSAbstractAccessorProperty(node as ts.TSAbstractAccessorProperty)
           break*/
      /* case 'TSAbstractKeyword':
          result = this.visitTSAbstractKeyword(node as ts.TSAbstractKeyword)
           break*/
      /* case 'TSAbstractMethodDefinition':
          result = this.visitTSAbstractMethodDefinition(node as ts.TSAbstractMethodDefinition)
           break*/
      /* case 'TSAbstractPropertyDefinition':
          result = this.visitTSAbstractPropertyDefinition(node as ts.TSAbstractPropertyDefinition)
           break*/
      case 'TSAnyKeyword':
        result = this.visitTSAnyKeyword(node as ts.TSAnyKeyword)
        break
      case 'TSArrayType':
        result = this.visitTSArrayType(node as ts.TSArrayType)
        break
      /* case 'TSAsExpression':
          result = this.visitTSAsExpression(node as ts.TSAsExpression)
           break*/
      /* case 'TSAsyncKeyword':
          result = this.visitTSAsyncKeyword(node as ts.TSAsyncKeyword)
           break*/
      /* case 'TSBigIntKeyword':
          result = this.visitTSBigIntKeyword(node as ts.TSBigIntKeyword)
           break*/
      /* case 'TSBooleanKeyword':
          result = this.visitTSBooleanKeyword(node as ts.TSBooleanKeyword)
           break*/
      /* case 'TSCallSignatureDeclaration':
          result = this.visitTSCallSignatureDeclaration(node as ts.TSCallSignatureDeclaration)
           break*/
      case 'TSClassImplements':
        result = this.visitTSClassImplements(node as ts.TSClassImplements)
        break
      /* case 'TSConditionalType':
          result = this.visitTSConditionalType(node as ts.TSConditionalType)
           break*/
      /* case 'TSConstructorType':
          result = this.visitTSConstructorType(node as ts.TSConstructorType)
           break*/
      /* case 'TSConstructSignatureDeclaration':
          result = this.visitTSConstructSignatureDeclaration(node as ts.TSConstructSignatureDeclaration)
           break*/
      /* case 'TSDeclareFunction':
          result = this.visitTSDeclareFunction(node as ts.TSDeclareFunction)
           break*/
      /* case 'TSDeclareKeyword':
          result = this.visitTSDeclareKeyword(node as ts.TSDeclareKeyword)
           break*/
      /* case 'TSEmptyBodyFunctionExpression':
          result = this.visitTSEmptyBodyFunctionExpression(node as ts.TSEmptyBodyFunctionExpression)
           break*/
      /* case 'TSEnumDeclaration':
          result = this.visitTSEnumDeclaration(node as ts.TSEnumDeclaration)
           break*/
      /* case 'TSEnumMember':
          result = this.visitTSEnumMember(node as ts.TSEnumMember)
           break*/
      /* case 'TSExportAssignment':
          result = this.visitTSExportAssignment(node as ts.TSExportAssignment)
           break*/
      /* case 'TSExportKeyword':
          result = this.visitTSExportKeyword(node as ts.TSExportKeyword)
           break*/
      /* case 'TSExternalModuleReference':
          result = this.visitTSExternalModuleReference(node as ts.TSExternalModuleReference)
           break*/
      /* case 'TSFunctionType':
          result = this.visitTSFunctionType(node as ts.TSFunctionType)
           break*/
      /* case 'TSInstantiationExpression':
          result = this.visitTSInstantiationExpression(node as ts.TSInstantiationExpression)
           break*/
      /* case 'TSImportEqualsDeclaration':
          result = this.visitTSImportEqualsDeclaration(node as ts.TSImportEqualsDeclaration)
           break*/
      /* case 'TSImportType':
          result = this.visitTSImportType(node as ts.TSImportType)
           break*/
      /* case 'TSIndexedAccessType':
          result = this.visitTSIndexedAccessType(node as ts.TSIndexedAccessType)
           break*/
      /* case 'TSIndexSignature':
          result = this.visitTSIndexSignature(node as ts.TSIndexSignature)
           break*/
      /* case 'TSInferType':
          result = this.visitTSInferType(node as ts.TSInferType)
           break*/
      case 'TSInterfaceBody':
        result = this.visitTSInterfaceBody(node as ts.TSInterfaceBody)
        break
      case 'TSInterfaceDeclaration':
        result = this.visitTSInterfaceDeclaration(node as ts.TSInterfaceDeclaration)
        break
      /* case 'TSInterfaceHeritage':
          result = this.visitTSInterfaceHeritage(node as ts.TSInterfaceHeritage)
           break*/
      /* case 'TSIntersectionType':
          result = this.visitTSIntersectionType(node as ts.TSIntersectionType)
           break*/
      /* case 'TSIntrinsicKeyword':
          result = this.visitTSIntrinsicKeyword(node as ts.TSIntrinsicKeyword)
           break*/
      /* case 'TSLiteralType':
          result = this.visitTSLiteralType(node as ts.TSLiteralType)
           break*/
      /* case 'TSMappedType':
          result = this.visitTSMappedType(node as ts.TSMappedType)
           break*/
      case 'TSMethodSignature':
        result = this.visitTSMethodSignature(node as ts.TSMethodSignature)
        break
      /* case 'TSModuleBlock':
          result = this.visitTSModuleBlock(node as ts.TSModuleBlock)
           break*/
      /* case 'TSModuleDeclaration':
          result = this.visitTSModuleDeclaration(node as ts.TSModuleDeclaration)
           break*/
      /* case 'TSNamedTupleMember':
          result = this.visitTSNamedTupleMember(node as ts.TSNamedTupleMember)
           break*/
      /* case 'TSNamespaceExportDeclaration':
          result = this.visitTSNamespaceExportDeclaration(node as ts.TSNamespaceExportDeclaration)
           break*/
      /* case 'TSNeverKeyword':
          result = this.visitTSNeverKeyword(node as ts.TSNeverKeyword)
           break*/
      /* case 'TSNonNullExpression':
          result = this.visitTSNonNullExpression(node as ts.TSNonNullExpression)
           break*/
      /* case 'TSNullKeyword':
          result = this.visitTSNullKeyword(node as ts.TSNullKeyword)
           break*/
      case 'TSNumberKeyword':
        result = this.visitTSNumberKeyword(node as ts.TSNumberKeyword)
        break
      /* case 'TSObjectKeyword':
          result = this.visitTSObjectKeyword(node as ts.TSObjectKeyword)
           break*/
      /* case 'TSOptionalType':
          result = this.visitTSOptionalType(node as ts.TSOptionalType)
           break*/
      /* case 'TSParameterProperty':
          result = this.visitTSParameterProperty(node as ts.TSParameterProperty)
           break*/
      /* case 'TSPrivateKeyword':
          result = this.visitTSPrivateKeyword(node as ts.TSPrivateKeyword)
           break*/
      /* case 'TSPropertySignature':
          result = this.visitTSPropertySignature(node as ts.TSPropertySignature)
           break*/
      /* case 'TSProtectedKeyword':
          result = this.visitTSProtectedKeyword(node as ts.TSProtectedKeyword)
           break*/
      /* case 'TSPublicKeyword':
          result = this.visitTSPublicKeyword(node as ts.TSPublicKeyword)
           break*/
      /* case 'TSQualifiedName':
          result = this.visitTSQualifiedName(node as ts.TSQualifiedName)
           break*/
      /* case 'TSReadonlyKeyword':
          result = this.visitTSReadonlyKeyword(node as ts.TSReadonlyKeyword)
           break*/
      /* case 'TSRestType':
          result = this.visitTSRestType(node as ts.TSRestType)
           break*/
      /* case 'TSSatisfiesExpression':
          result = this.visitTSSatisfiesExpression(node as ts.TSSatisfiesExpression)
           break*/
      /* case 'TSStaticKeyword':
          result = this.visitTSStaticKeyword(node as ts.TSStaticKeyword)
           break*/
      case 'TSStringKeyword':
        result = this.visitTSStringKeyword(node as ts.TSStringKeyword)
        break
      /* case 'TSSymbolKeyword':
          result = this.visitTSSymbolKeyword(node as ts.TSSymbolKeyword)
           break*/
      /* case 'TSTemplateLiteralType':
          result = this.visitTSTemplateLiteralType(node as ts.TSTemplateLiteralType)
           break*/
      /* case 'TSThisType':
          result = this.visitTSThisType(node as ts.TSThisType)
           break*/
      /* case 'TSTupleType':
          result = this.visitTSTupleType(node as ts.TSTupleType)
           break*/
      /* case 'TSTypeAliasDeclaration':
          result = this.visitTSTypeAliasDeclaration(node as ts.TSTypeAliasDeclaration)
           break*/
      case 'TSTypeAnnotation':
        result = this.visitTSTypeAnnotation(node as ts.TSTypeAnnotation)
        break
      /* case 'TSTypeAssertion':
          result = this.visitTSTypeAssertion(node as ts.TSTypeAssertion)
           break*/
      /* case 'TSTypeLiteral':
          result = this.visitTSTypeLiteral(node as ts.TSTypeLiteral)
           break*/
      /* case 'TSTypeOperator':
          result = this.visitTSTypeOperator(node as ts.TSTypeOperator)
           break*/
      /* case 'TSTypeParameter':
          result = this.visitTSTypeParameter(node as ts.TSTypeParameter)
           break*/
      /* case 'TSTypeParameterDeclaration':
          result = this.visitTSTypeParameterDeclaration(node as ts.TSTypeParameterDeclaration)
           break*/
      /* case 'TSTypeParameterInstantiation':
          result = this.visitTSTypeParameterInstantiation(node as ts.TSTypeParameterInstantiation)
           break*/
      /* case 'TSTypePredicate':
          result = this.visitTSTypePredicate(node as ts.TSTypePredicate)
           break*/
      /* case 'TSTypeQuery':
          result = this.visitTSTypeQuery(node as ts.TSTypeQuery)
           break*/
      case 'TSTypeReference':
        result = this.visitTSTypeReference(node as ts.TSTypeReference)
        break
      /* case 'TSUndefinedKeyword':
          result = this.visitTSUndefinedKeyword(node as ts.TSUndefinedKeyword)
           break*/
      /* case 'TSUnionType':
          result = this.visitTSUnionType(node as ts.TSUnionType)
           break*/
      /* case 'TSUnknownKeyword':
          result = this.visitTSUnknownKeyword(node as ts.TSUnknownKeyword)
           break*/
      /* case 'TSVoidKeyword':
          result = this.visitTSVoidKeyword(node as ts.TSVoidKeyword)
           break*/
      default:
        throwError(`Cannot visit TS node of type '${node.type}'`, 'internal')
    }

    return result
  }

  // public abstract visitAccessorProperty(accessorProperty: ts.AccessorProperty): T
  // public abstract visitArrayExpression(arrayExpression: ts.ArrayExpression): T
  // public abstract visitArrayPattern(arrayPattern: ts.ArrayPattern): T
  // public abstract visitArrowFunctionExpression(arrowFunctionExpression: ts.ArrowFunctionExpression): T
  // public abstract visitAssignmentExpression(assignmentExpression: ts.AssignmentExpression): T
  // public abstract visitAssignmentPattern(assignmentPattern: ts.AssignmentPattern): T
  // public abstract visitAwaitExpression(awaitExpression: ts.AwaitExpression): T
  // public abstract visitBinaryExpression(binaryExpression: ts.BinaryExpression): T

  public abstract visitBlockComment(blockComment: ts.BlockComment): T

  public abstract visitBlockStatement(blockStatement: ts.BlockStatement): T

  // public abstract visitBreakStatement(breakStatement: ts.BreakStatement): T

  public abstract visitCallExpression(callExpression: ts.CallExpression): T

  // public abstract visitCatchClause(catchClause: ts.CatchClause): T
  // public abstract visitChainExpression(chainExpression: ts.ChainExpression): T

  public abstract visitClassBody(classBody: ts.ClassBody): T

  public abstract visitClassDeclaration(classDeclaration: ts.ClassDeclaration): T

  // public abstract visitClassExpression(classExpression: ts.ClassExpression): T
  // public abstract visitConditionalExpression(conditionalExpression: ts.ConditionalExpression): T
  // public abstract visitContinueStatement(continueStatement: ts.ContinueStatement): T
  // public abstract visitDebuggerStatement(debuggerStatement: ts.DebuggerStatement): T
  // public abstract visitDecorator(decorator: ts.Decorator): T
  // public abstract visitDoWhileStatement(doWhileStatement: ts.DoWhileStatement): T
  // public abstract visitEmptyStatement(emptyStatement: ts.EmptyStatement): T
  // public abstract visitExportAllDeclaration(exportAllDeclaration: ts.ExportAllDeclaration): T

  public abstract visitExportDefaultDeclaration(
    exportDefaultDeclaration: ts.ExportDefaultDeclaration,
  ): T

  public abstract visitExportNamedDeclaration(exportNamedDeclaration: ts.ExportNamedDeclaration): T

  // public abstract visitExportSpecifier(exportSpecifier: ts.ExportSpecifier): T

  public abstract visitExpressionStatement(expressionStatement: ts.ExpressionStatement): T

  // public abstract visitForInStatement(forInStatement: ts.ForInStatement): T
  // public abstract visitForOfStatement(forOfStatement: ts.ForOfStatement): T
  // public abstract visitForStatement(forStatement: ts.ForStatement): T
  // public abstract visitFunctionDeclaration(functionDeclaration: ts.FunctionDeclaration): T

  public abstract visitFunctionExpression(functionExpression: ts.FunctionExpression): T

  public abstract visitIdentifier(identifier: ts.Identifier): T

  // public abstract visitIfStatement(ifStatement: ts.IfStatement): T
  // public abstract visitImportAttribute(importAttribute: ts.ImportAttribute): T

  public abstract visitImportDeclaration(importDeclaration: ts.ImportDeclaration): T

  // public abstract visitImportDefaultSpecifier(importDefaultSpecifier: ts.ImportDefaultSpecifier): T
  // public abstract visitImportExpression(importExpression: ts.ImportExpression): T
  // public abstract visitImportNamespaceSpecifier(importNamespaceSpecifier: ts.ImportNamespaceSpecifier): T

  public abstract visitImportSpecifier(importSpecifier: ts.ImportSpecifier): T

  // public abstract visitJSXAttribute(jSXAttribute: ts.JSXAttribute): T
  // public abstract visitJSXClosingElement(jSXClosingElement: ts.JSXClosingElement): T
  // public abstract visitJSXClosingFragment(jSXClosingFragment: ts.JSXClosingFragment): T
  // public abstract visitJSXElement(jSXElement: ts.JSXElement): T
  // public abstract visitJSXEmptyExpression(jSXEmptyExpression: ts.JSXEmptyExpression): T
  // public abstract visitJSXExpressionContainer(jSXExpressionContainer: ts.JSXExpressionContainer): T
  // public abstract visitJSXFragment(jSXFragment: ts.JSXFragment): T
  // public abstract visitJSXIdentifier(jSXIdentifier: ts.JSXIdentifier): T
  // public abstract visitJSXMemberExpression(jSXMemberExpression: ts.JSXMemberExpression): T
  // public abstract visitJSXNamespacedName(jSXNamespacedName: ts.JSXNamespacedName): T
  // public abstract visitJSXOpeningElement(jSXOpeningElement: ts.JSXOpeningElement): T
  // public abstract visitJSXOpeningFragment(jSXOpeningFragment: ts.JSXOpeningFragment): T
  // public abstract visitJSXSpreadAttribute(jSXSpreadAttribute: ts.JSXSpreadAttribute): T
  // public abstract visitJSXSpreadChild(jSXSpreadChild: ts.JSXSpreadChild): T
  // public abstract visitJSXText(jSXText: ts.JSXText): T
  // public abstract visitLabeledStatement(labeledStatement: ts.LabeledStatement): T

  public abstract visitLiteral(literal: ts.Literal): T

  // public abstract visitLogicalExpression(logicalExpression: ts.LogicalExpression): T
  // public abstract visitMemberExpression(memberExpression: ts.MemberExpression): T
  // public abstract visitMetaProperty(metaProperty: ts.MetaProperty): T

  public abstract visitMethodDefinition(methodDefinition: ts.MethodDefinition): T

  // public abstract visitNewExpression(newExpression: ts.NewExpression): T
  // public abstract visitObjectExpression(objectExpression: ts.ObjectExpression): T
  // public abstract visitObjectPattern(objectPattern: ts.ObjectPattern): T
  // public abstract visitPrivateIdentifier(privateIdentifier: ts.PrivateIdentifier): T

  public abstract visitProgram(program: ts.Program): T

  // public abstract visitProperty(property: ts.Property): T
  // public abstract visitPropertyDefinition(propertyDefinition: ts.PropertyDefinition): T
  // public abstract visitRestElement(restElement: ts.RestElement): T

  public abstract visitReturnStatement(returnStatement: ts.ReturnStatement): T

  // public abstract visitSequenceExpression(sequenceExpression: ts.SequenceExpression): T
  // public abstract visitSpreadElement(spreadElement: ts.SpreadElement): T
  // public abstract visitStaticBlock(staticBlock: ts.StaticBlock): T
  // public abstract visitSuper(super: ts.Super): T
  // public abstract visitSwitchCase(switchCase: ts.SwitchCase): T
  // public abstract visitSwitchStatement(switchStatement: ts.SwitchStatement): T
  // public abstract visitTaggedTemplateExpression(taggedTemplateExpression: ts.TaggedTemplateExpression): T

  public abstract visitTemplateElement(templateElement: ts.TemplateElement): T

  public abstract visitTemplateLiteral(templateLiteral: ts.TemplateLiteral): T

  // public abstract visitThisExpression(thisExpression: ts.ThisExpression): T
  // public abstract visitThrowStatement(throwStatement: ts.ThrowStatement): T
  // public abstract visitTryStatement(tryStatement: ts.TryStatement): T
  // public abstract visitUnaryExpression(unaryExpression: ts.UnaryExpression): T
  // public abstract visitUpdateExpression(updateExpression: ts.UpdateExpression): T
  // public abstract visitVariableDeclaration(variableDeclaration: ts.VariableDeclaration): T
  // public abstract visitVariableDeclarator(variableDeclarator: ts.VariableDeclarator): T
  // public abstract visitWhileStatement(whileStatement: ts.WhileStatement): T
  // public abstract visitWithStatement(withStatement: ts.WithStatement): T
  // public abstract visitYieldExpression(yieldExpression: ts.YieldExpression): T
  // public abstract visitTSAbstractAccessorProperty(tsAbstractAccessorProperty: ts.TSAbstractAccessorProperty): T
  // public abstract visitTSAbstractKeyword(tsAbstractKeyword: ts.TSAbstractKeyword): T
  // public abstract visitTSAbstractMethodDefinition(tsAbstractMethodDefinition: ts.TSAbstractMethodDefinition): T
  // public abstract visitTSAbstractPropertyDefinition(tsAbstractPropertyDefinition: ts.TSAbstractPropertyDefinition): T

  public abstract visitTSAnyKeyword(tsAnyKeyword: ts.TSAnyKeyword): T

  public abstract visitTSArrayType(tsArrayType: ts.TSArrayType): T

  // public abstract visitTSAsExpression(tsAsExpression: ts.TSAsExpression): T
  // public abstract visitTSAsyncKeyword(tsAsyncKeyword: ts.TSAsyncKeyword): T
  // public abstract visitTSBigIntKeyword(tsBigIntKeyword: ts.TSBigIntKeyword): T
  // public abstract visitTSBooleanKeyword(tsBooleanKeyword: ts.TSBooleanKeyword): T
  // public abstract visitTSCallSignatureDeclaration(tsCallSignatureDeclaration: ts.TSCallSignatureDeclaration): T

  public abstract visitTSClassImplements(tsClassImplements: ts.TSClassImplements): T

  // public abstract visitTSConditionalType(tsConditionalType: ts.TSConditionalType): T
  // public abstract visitTSConstructorType(tsConstructorType: ts.TSConstructorType): T
  // public abstract visitTSConstructSignatureDeclaration(tsConstructSignatureDeclaration: ts.TSConstructSignatureDeclaration): T
  // public abstract visitTSDeclareFunction(tsDeclareFunction: ts.TSDeclareFunction): T
  // public abstract visitTSDeclareKeyword(tsDeclareKeyword: ts.TSDeclareKeyword): T
  // public abstract visitTSEmptyBodyFunctionExpression(tsEmptyBodyFunctionExpression: ts.TSEmptyBodyFunctionExpression): T
  // public abstract visitTSEnumDeclaration(tsEnumDeclaration: ts.TSEnumDeclaration): T
  // public abstract visitTSEnumMember(tsEnumMember: ts.TSEnumMember): T
  // public abstract visitTSExportAssignment(tsExportAssignment: ts.TSExportAssignment): T
  // public abstract visitTSExportKeyword(tsExportKeyword: ts.TSExportKeyword): T
  // public abstract visitTSExternalModuleReference(tsExternalModuleReference: ts.TSExternalModuleReference): T
  // public abstract visitTSFunctionType(tsFunctionType: ts.TSFunctionType): T
  // public abstract visitTSInstantiationExpression(tsInstantiationExpression: ts.TSInstantiationExpression): T
  // public abstract visitTSImportEqualsDeclaration(tsImportEqualsDeclaration: ts.TSImportEqualsDeclaration): T
  // public abstract visitTSImportType(tsImportType: ts.TSImportType): T
  // public abstract visitTSIndexedAccessType(tsIndexedAccessType: ts.TSIndexedAccessType): T
  // public abstract visitTSIndexSignature(tsIndexSignature: ts.TSIndexSignature): T
  // public abstract visitTSInferType(tsInferType: ts.TSInferType): T

  public abstract visitTSInterfaceBody(tsInterfaceBody: ts.TSInterfaceBody): T

  public abstract visitTSInterfaceDeclaration(tsInterfaceDeclaration: ts.TSInterfaceDeclaration): T

  // public abstract visitTSInterfaceHeritage(tsInterfaceHeritage: ts.TSInterfaceHeritage): T
  // public abstract visitTSIntersectionType(tsIntersectionType: ts.TSIntersectionType): T
  // public abstract visitTSIntrinsicKeyword(tsIntrinsicKeyword: ts.TSIntrinsicKeyword): T
  // public abstract visitTSLiteralType(tsLiteralType: ts.TSLiteralType): T
  // public abstract visitTSMappedType(tsMappedType: ts.TSMappedType): T

  public abstract visitTSMethodSignature(tsMethodSignature: ts.TSMethodSignature): T

  // public abstract visitTSModuleBlock(tsModuleBlock: ts.TSModuleBlock): T
  // public abstract visitTSModuleDeclaration(tsModuleDeclaration: ts.TSModuleDeclaration): T
  // public abstract visitTSNamedTupleMember(tsNamedTupleMember: ts.TSNamedTupleMember): T
  // public abstract visitTSNamespaceExportDeclaration(tsNamespaceExportDeclaration: ts.TSNamespaceExportDeclaration): T
  // public abstract visitTSNeverKeyword(tsNeverKeyword: ts.TSNeverKeyword): T
  // public abstract visitTSNonNullExpression(tsNonNullExpression: ts.TSNonNullExpression): T
  // public abstract visitTSNullKeyword(tsNullKeyword: ts.TSNullKeyword): T

  public abstract visitTSNumberKeyword(tsNumberKeyword: ts.TSNumberKeyword): T

  // public abstract visitTSObjectKeyword(tsObjectKeyword: ts.TSObjectKeyword): T
  // public abstract visitTSOptionalType(tsOptionalType: ts.TSOptionalType): T
  // public abstract visitTSParameterProperty(tsParameterProperty: ts.TSParameterProperty): T
  // public abstract visitTSPrivateKeyword(tsPrivateKeyword: ts.TSPrivateKeyword): T
  // public abstract visitTSPropertySignature(tsPropertySignature: ts.TSPropertySignature): T
  // public abstract visitTSProtectedKeyword(tsProtectedKeyword: ts.TSProtectedKeyword): T
  // public abstract visitTSPublicKeyword(tsPublicKeyword: ts.TSPublicKeyword): T
  // public abstract visitTSQualifiedName(tsQualifiedName: ts.TSQualifiedName): T
  // public abstract visitTSReadonlyKeyword(tsReadonlyKeyword: ts.TSReadonlyKeyword): T
  // public abstract visitTSRestType(tsRestType: ts.TSRestType): T
  // public abstract visitTSSatisfiesExpression(tsSatisfiesExpression: ts.TSSatisfiesExpression): T
  // public abstract visitTSStaticKeyword(tsStaticKeyword: ts.TSStaticKeyword): T

  public abstract visitTSStringKeyword(tsStringKeyword: ts.TSStringKeyword): T

  // public abstract visitTSSymbolKeyword(tsSymbolKeyword: ts.TSSymbolKeyword): T
  // public abstract visitTSTemplateLiteralType(tsTemplateLiteralType: ts.TSTemplateLiteralType): T
  // public abstract visitTSThisType(tsThisType: ts.TSThisType): T
  // public abstract visitTSTupleType(tsTupleType: ts.TSTupleType): T
  // public abstract visitTSTypeAliasDeclaration(tsTypeAliasDeclaration: ts.TSTypeAliasDeclaration): T

  public abstract visitTSTypeAnnotation(tsTypeAnnotation: ts.TSTypeAnnotation): T

  // public abstract visitTSTypeAssertion(tsTypeAssertion: ts.TSTypeAssertion): T
  // public abstract visitTSTypeLiteral(tsTypeLiteral: ts.TSTypeLiteral): T
  // public abstract visitTSTypeOperator(tsTypeOperator: ts.TSTypeOperator): T
  // public abstract visitTSTypeParameter(tsTypeParameter: ts.TSTypeParameter): T
  // public abstract visitTSTypeParameterDeclaration(tsTypeParameterDeclaration: ts.TSTypeParameterDeclaration): T
  // public abstract visitTSTypeParameterInstantiation(tsTypeParameterInstantiation: ts.TSTypeParameterInstantiation): T
  // public abstract visitTSTypePredicate(tsTypePredicate: ts.TSTypePredicate): T
  // public abstract visitTSTypeQuery(tsTypeQuery: ts.TSTypeQuery): T

  public abstract visitTSTypeReference(tsTypeReference: ts.TSTypeReference): T

  // public abstract visitTSUndefinedKeyword(tsUndefinedKeyword: ts.TSUndefinedKeyword): T
  // public abstract visitTSUnionType(tsUnionType: ts.TSUnionType): T
  // public abstract visitTSUnknownKeyword(tsUnknownKeyword: ts.TSUnknownKeyword): T
  // public abstract visitTSVoidKeyword(tsVoidKeyword: ts.TSVoidKeyword): T
}
