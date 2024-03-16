import {
  AST_NODE_TYPES,
  BlockStatement,
  Expression,
  Identifier,
  Statement,
  VariableDeclaration,
  VariableDeclarator,
} from '@module/languages/ts/tsestree-spec'

export function blockStatement(...statements: Statement[]): BlockStatement {
  return {
    type: AST_NODE_TYPES.BlockStatement,
    body: statements,
  }
}

export function variableDeclaration(
  kind: 'const', // | 'var' | 'let'
  id: Identifier,
  init: Expression | null,
): VariableDeclaration {
  return {
    type: AST_NODE_TYPES.VariableDeclaration,
    kind,
    declarations: [variableDeclarator(id, init)],
    declare: false,
  }
}

function variableDeclarator(id: Identifier, init: Expression | null): VariableDeclarator {
  return {
    type: AST_NODE_TYPES.VariableDeclarator,
    id,
    init,
    definite: false,
  }
}
