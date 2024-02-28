import {
  AST_NODE_TYPES,
  Expression,
  ExpressionStatement,
  ImportAttribute,
  ImportClause,
  ImportDeclaration,
  ImportSpecifier,
  Program,
  ProgramStatement,
} from '@module/languages/ts/tsestree-spec'
import { literal } from './terminals'
import { identifier } from '@module/languages/ts/ast/misc'

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
