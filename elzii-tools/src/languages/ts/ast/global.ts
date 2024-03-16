import {
  AST_NODE_TYPES,
  DefaultExportDeclarations,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  Expression,
  ExpressionStatement,
  ImportClause,
  ImportDeclaration,
  ImportSpecifier,
  NamedExportDeclarations,
  Program,
  ProgramStatement,
} from '@module/languages/ts/tsestree-spec'
import { literal } from './terminals'
import { identifier } from '@module/languages/ts/ast/expressions'

export function exportDefaultDeclaration(
  declaration: DefaultExportDeclarations,
): ExportDefaultDeclaration {
  return {
    type: AST_NODE_TYPES.ExportDefaultDeclaration,
    declaration,
    exportKind: 'value',
  }
}

export function exportNamedDeclaration(
  declaration: NamedExportDeclarations,
): ExportNamedDeclaration {
  return {
    type: AST_NODE_TYPES.ExportNamedDeclaration,
    declaration,
    exportKind: 'value',
    source: null,
    specifiers: [],
    attributes: [],
    assertions: [],
  }
}

export function expressionStatement(expression: Expression): ExpressionStatement {
  return {
    type: AST_NODE_TYPES.ExpressionStatement,
    expression,
    directive: undefined,
  }
}

export function importDeclaration(
  importKind: 'value', // or 'type', but never used
  source: string,
  specifiers: ImportClause[] = [],
  // attributes: ImportAttribute[] = [],
): ImportDeclaration {
  return {
    type: AST_NODE_TYPES.ImportDeclaration,
    importKind,
    source: literal(source),
    specifiers,
    attributes: [],
    assertions: [],
  }
}

export function importSpecifier(
  importKind: 'type' | 'value',
  name: string,
  alias?: string,
): ImportSpecifier {
  return {
    type: AST_NODE_TYPES.ImportSpecifier,
    importKind,
    imported: identifier(name),
    local: identifier(alias ?? name),
  }
}

export function program(sourceType: 'module' | 'script', ...body: ProgramStatement[]): Program {
  return {
    type: AST_NODE_TYPES.Program,
    sourceType,
    body,
    comments: undefined,
    tokens: undefined,
  }
}
