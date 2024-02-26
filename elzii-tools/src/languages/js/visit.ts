import * as js from './ast'
import { throwError } from '@module/error'

// nodes that are not needed are commented out

export abstract class JSVisitor<T = void> {
  public visitAnyNode(node: js.AnyNode): T {
    let result: never

    switch (node.type) {
      /*case 'ArrayExpression':
        result = this.visitArrayExpression(node as js.ArrayExpression)
        break*/
      /*case 'ArrayPattern':
        result = this.visitArrayPattern(node as js.ArrayPattern)
        break*/
      /*case 'ArrowFunctionExpression':
        result = this.visitArrowFunctionExpression(node as js.ArrowFunctionExpression)
        break*/
      /*case 'AssignmentExpression':
        result = this.visitAssignmentExpression(node as js.AssignmentExpression)
        break*/
      /*case 'AssignmentPattern':
        result = this.visitAssignmentPattern(node as js.AssignmentPattern)
        break*/
      /*case 'AwaitExpression':
        result = this.visitAwaitExpression(node as js.AwaitExpression)
        break*/
      /*case 'BinaryExpression':
        result = this.visitBinaryExpression(node as js.BinaryExpression)
        break*/
      /*case 'Block':
        result = this.visitComment(node as js.Comment)
        break*/
      /*case 'BlockStatement':
        result = this.visitBlockStatement(node as js.BlockStatement)
        break*/
      /*case 'BreakStatement':
        result = this.visitBreakStatement(node as js.BreakStatement)
        break*/
      /*case 'CallExpression':
        result = this.visitCallExpression(node as js.CallExpression)
        break*/
      /*case 'CatchClause':
        result = this.visitCatchClause(node as js.CatchClause)
        break*/
      /*case 'ChainExpression':
        result = this.visitChainExpression(node as js.ChainExpression)
        break*/
      /*case 'ClassBody':
        result = this.visitClassBody(node as js.ClassBody)
        break*/
      /*case 'ClassDeclaration':
        result = this.visitClassDeclaration(node as js.ClassDeclaration)
        break*/
      /*case 'ClassExpression':
        result = this.visitClassExpression(node as js.ClassExpression)
        break*/
      /*case 'ConditionalExpression':
        result = this.visitConditionalExpression(node as js.ConditionalExpression)
        break*/
      /*case 'ContinueStatement':
        result = this.visitContinueStatement(node as js.ContinueStatement)
        break*/
      /*case 'DebuggerStatement':
        result = this.visitDebuggerStatement(node as js.DebuggerStatement)
        break*/
      /*case 'DoWhileStatement':
        result = this.visitDoWhileStatement(node as js.DoWhileStatement)
        break*/
      /*case 'EmptyStatement':
        result = this.visitEmptyStatement(node as js.EmptyStatement)
        break*/
      /*case 'ExportAllDeclaration':
        result = this.visitExportAllDeclaration(node as js.ExportAllDeclaration)
        break*/
      /*case 'ExportDefaultDeclaration':
        result = this.visitExportDefaultDeclaration(node as js.ExportDefaultDeclaration)
        break*/
      /*case 'ExportNamedDeclaration':
        result = this.visitExportNamedDeclaration(node as js.ExportNamedDeclaration)
        break*/
      /*case 'ExportSpecifier':
        result = this.visitExportSpecifier(node as js.ExportSpecifier)
        break*/
      /*case 'ExpressionStatement':
        result = this.visitExpressionStatement(node as js.ExpressionStatement)
        break*/
      /*case 'ForInStatement':
        result = this.visitForInStatement(node as js.ForInStatement)
        break*/
      /*case 'ForOfStatement':
        result = this.visitForOfStatement(node as js.ForOfStatement)
        break*/
      /*case 'ForStatement':
        result = this.visitForStatement(node as js.ForStatement)
        break*/
      /*case 'FunctionDeclaration':
        result = this.visitFunctionDeclaration(node as js.FunctionDeclaration)
        break*/
      /*case 'FunctionExpression':
        result = this.visitFunctionExpression(node as js.FunctionExpression)
        break*/
      /*case 'Identifier':
        result = this.visitIdentifier(node as js.Identifier)
        break*/
      /*case 'IfStatement':
        result = this.visitIfStatement(node as js.IfStatement)
        break*/
      /*case 'ImportDeclaration':
        result = this.visitImportDeclaration(node as js.ImportDeclaration)
        break*/
      /*case 'ImportDefaultSpecifier':
        result = this.visitImportDefaultSpecifier(node as js.ImportDefaultSpecifier)
        break*/
      /*case 'ImportExpression':
        result = this.visitImportExpression(node as js.ImportExpression)
        break*/
      /*case 'ImportNamespaceSpecifier':
        result = this.visitImportNamespaceSpecifier(node as js.ImportNamespaceSpecifier)
        break*/
      /*case 'ImportSpecifier':
        result = this.visitImportSpecifier(node as js.ImportSpecifier)
        break*/
      /*case 'LabeledStatement':
        result = this.visitLabeledStatement(node as js.LabeledStatement)
        break*/
      /*case 'Line':
        result = this.visitComment(node as js.Comment)
        break*/
      /*case 'Literal':
        result = this.visitLiteral(node as js.Literal)
        break*/
      /*case 'LogicalExpression':
        result = this.visitLogicalExpression(node as js.LogicalExpression)
        break*/
      /*case 'MemberExpression':
        result = this.visitMemberExpression(node as js.MemberExpression)
        break*/
      /*case 'MetaProperty':
        result = this.visitMetaProperty(node as js.MetaProperty)
        break*/
      /*case 'MethodDefinition':
        result = this.visitMethodDefinition(node as js.MethodDefinition)
        break*/
      /*case 'NewExpression':
        result = this.visitNewExpression(node as js.NewExpression)
        break*/
      /*case 'ObjectExpression':
        result = this.visitObjectExpression(node as js.ObjectExpression)
        break*/
      /*case 'ObjectPattern':
        result = this.visitObjectPattern(node as js.ObjectPattern)
        break*/
      /*case 'PrivateIdentifier':
        result = this.visitPrivateIdentifier(node as js.PrivateIdentifier)
        break*/
      /*case 'Program':
        result = this.visitProgram(node as js.Program)
        break*/
      /*case 'Property':
        result = this.visitProperty(node as js.Property)
        break*/
      /*case 'PropertyDefinition':
        result = this.visitPropertyDefinition(node as js.PropertyDefinition)
        break*/
      /*case 'RestElement':
        result = this.visitRestElement(node as js.RestElement)
        break*/
      /*case 'ReturnStatement':
        result = this.visitReturnStatement(node as js.ReturnStatement)
        break*/
      /*case 'SequenceExpression':
        result = this.visitSequenceExpression(node as js.SequenceExpression)
        break*/
      /*case 'SpreadElement':
        result = this.visitSpreadElement(node as js.SpreadElement)
        break*/
      /*case 'StaticBlock':
        result = this.visitStaticBlock(node as js.StaticBlock)
        break*/
      /*case 'Super':
        result = this.visitSuper(node as js.Super)
        break*/
      /*case 'SwitchCase':
        result = this.visitSwitchCase(node as js.SwitchCase)
        break*/
      /*case 'SwitchStatement':
        result = this.visitSwitchStatement(node as js.SwitchStatement)
        break*/
      /*case 'TaggedTemplateExpression':
        result = this.visitTaggedTemplateExpression(node as js.TaggedTemplateExpression)
        break*/
      /*case 'TemplateElement':
        result = this.visitTemplateElement(node as js.TemplateElement)
        break*/
      /*case 'TemplateLiteral':
        result = this.visitTemplateLiteral(node as js.TemplateLiteral)
        break*/
      /*case 'ThisExpression':
        result = this.visitThisExpression(node as js.ThisExpression)
        break*/
      /*case 'ThrowStatement':
        result = this.visitThrowStatement(node as js.ThrowStatement)
        break*/
      /*case 'TryStatement':
        result = this.visitTryStatement(node as js.TryStatement)
        break*/
      /*case 'UnaryExpression':
        result = this.visitUnaryExpression(node as js.UnaryExpression)
        break*/
      /*case 'UpdateExpression':
        result = this.visitUpdateExpression(node as js.UpdateExpression)
        break*/
      /*case 'VariableDeclaration':
        result = this.visitVariableDeclaration(node as js.VariableDeclaration)
        break*/
      /*case 'VariableDeclarator':
        result = this.visitVariableDeclarator(node as js.VariableDeclarator)
        break*/
      /*case 'WhileStatement':
        result = this.visitWhileStatement(node as js.WhileStatement)
        break*/
      /*case 'WithStatement':
        result = this.visitWithStatement(node as js.WithStatement)
        break*/
      /*case 'YieldExpression':
        result = this.visitYieldExpression(node as js.YieldExpression)
        break*/
      default:
        throwError(`Cannot visit JS node of type '${node.type}'`, 'internal')
    }

    // return result
  }

  // public abstract visitArrayExpression(arrayExpression: js.ArrayExpression): T

  // public abstract visitArrayPattern(arrayPattern: js.ArrayPattern): T

  // public abstract visitArrowFunctionExpression(arrowFunctionExpression: js.ArrowFunctionExpression): T

  // public abstract visitAssignmentExpression(assignmentExpression: js.AssignmentExpression): T

  // public abstract visitAssignmentPattern(assignmentPattern: js.AssignmentPattern): T

  // public abstract visitAwaitExpression(awaitExpression: js.AwaitExpression): T

  // public abstract visitBinaryExpression(binaryExpression: js.BinaryExpression): T

  // public abstract visitBlockStatement(blockStatement: js.BlockStatement): T

  // public abstract visitBreakStatement(breakStatement: js.BreakStatement): T

  // public abstract visitCallExpression(callExpression: js.CallExpression): T

  // public abstract visitCatchClause(catchClause: js.CatchClause): T

  // public abstract visitChainExpression(chainExpression: js.ChainExpression): T

  // public abstract visitClassBody(classBody: js.ClassBody): T

  // public abstract visitClassDeclaration(classDeclaration: js.ClassDeclaration): T

  // public abstract visitClassExpression(classExpression: js.ClassExpression): T

  // public abstract visitComment(block: js.Comment): T

  // public abstract visitConditionalExpression(conditionalExpression: js.ConditionalExpression): T

  // public abstract visitContinueStatement(continueStatement: js.ContinueStatement): T

  // public abstract visitDebuggerStatement(debuggerStatement: js.DebuggerStatement): T

  // public abstract visitDoWhileStatement(doWhileStatement: js.DoWhileStatement): T

  // public abstract visitEmptyStatement(emptyStatement: js.EmptyStatement): T

  // public abstract visitExportAllDeclaration(exportAllDeclaration: js.ExportAllDeclaration): T

  // public abstract visitExportDefaultDeclaration(exportDefaultDeclaration: js.ExportDefaultDeclaration): T

  // public abstract visitExportNamedDeclaration(exportNamedDeclaration: js.ExportNamedDeclaration): T

  // public abstract visitExportSpecifier(exportSpecifier: js.ExportSpecifier): T

  // public abstract visitExpressionStatement(expressionStatement: js.ExpressionStatement): T

  // public abstract visitForInStatement(forInStatement: js.ForInStatement): T

  // public abstract visitForOfStatement(forOfStatement: js.ForOfStatement): T

  // public abstract visitForStatement(forStatement: js.ForStatement): T

  // public abstract visitFunctionDeclaration(functionDeclaration: js.FunctionDeclaration): T

  // public abstract visitFunctionExpression(functionExpression: js.FunctionExpression): T

  // public abstract visitIdentifier(identifier: js.Identifier): T

  // public abstract visitIfStatement(ifStatement: js.IfStatement): T

  // public abstract visitImportDeclaration(importDeclaration: js.ImportDeclaration): T

  // public abstract visitImportDefaultSpecifier(importDefaultSpecifier: js.ImportDefaultSpecifier): T

  // public abstract visitImportExpression(importExpression: js.ImportExpression): T

  // public abstract visitImportNamespaceSpecifier(importNamespaceSpecifier: js.ImportNamespaceSpecifier): T

  // public abstract visitImportSpecifier(importSpecifier: js.ImportSpecifier): T

  // public abstract visitLabeledStatement(labeledStatement: js.LabeledStatement): T

  // public abstract visitLiteral(literal: js.Literal): T

  // public abstract visitLogicalExpression(logicalExpression: js.LogicalExpression): T

  // public abstract visitMemberExpression(memberExpression: js.MemberExpression): T

  // public abstract visitMetaProperty(metaProperty: js.MetaProperty): T

  // public abstract visitMethodDefinition(methodDefinition: js.MethodDefinition): T

  // public abstract visitNewExpression(newExpression: js.NewExpression): T

  // public abstract visitObjectExpression(objectExpression: js.ObjectExpression): T

  // public abstract visitObjectPattern(objectPattern: js.ObjectPattern): T

  // public abstract visitPrivateIdentifier(privateIdentifier: js.PrivateIdentifier): T

  // public abstract visitProgram(program: js.Program): T

  // public abstract visitProperty(property: js.Property): T

  // public abstract visitPropertyDefinition(propertyDefinition: js.PropertyDefinition): T

  // public abstract visitRestElement(restElement: js.RestElement): T

  // public abstract visitReturnStatement(returnStatement: js.ReturnStatement): T

  // public abstract visitSequenceExpression(sequenceExpression: js.SequenceExpression): T

  // public abstract visitSpreadElement(spreadElement: js.SpreadElement): T

  // public abstract visitStaticBlock(staticBlock: js.StaticBlock): T

  // public abstract visitSuper(superNode: js.Super): T

  // public abstract visitSwitchCase(switchCase: js.SwitchCase): T

  // public abstract visitSwitchStatement(switchStatement: js.SwitchStatement): T

  // public abstract visitTaggedTemplateExpression(taggedTemplateExpression: js.TaggedTemplateExpression): T

  // public abstract visitTemplateElement(templateElement: js.TemplateElement): T

  // public abstract visitTemplateLiteral(templateLiteral: js.TemplateLiteral): T

  // public abstract visitThisExpression(thisExpression: js.ThisExpression): T

  // public abstract visitThrowStatement(throwStatement: js.ThrowStatement): T

  // public abstract visitTryStatement(tryStatement: js.TryStatement): T

  // public abstract visitUnaryExpression(unaryExpression: js.UnaryExpression): T

  // public abstract visitUpdateExpression(updateExpression: js.UpdateExpression): T

  // public abstract visitVariableDeclaration(variableDeclaration: js.VariableDeclaration): T

  // public abstract visitVariableDeclarator(variableDeclarator: js.VariableDeclarator): T

  // public abstract visitWhileStatement(whileStatement: js.WhileStatement): T

  // public abstract visitWithStatement(withStatement: js.WithStatement): T

  // public abstract visitYieldExpression(yieldExpression: js.YieldExpression): T
}
