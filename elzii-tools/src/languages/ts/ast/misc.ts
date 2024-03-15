import {
  AssignmentExpression,
  AST_NODE_TYPES,
  BlockStatement,
  Expression,
  Identifier,
  MemberExpression,
  Statement,
  TemplateElement,
  TemplateLiteral,
  ThisExpression,
  TypeNode,
} from '@module/languages/ts/tsestree-spec'
import { tsTypeAnnotation } from './types'

export function assignmentExpression(left: Expression, right: Expression): AssignmentExpression {
  return {
    type: AST_NODE_TYPES.AssignmentExpression,
    left,
    right,
    operator: '=',
  }
}

export function blockStatement(...statements: Statement[]): BlockStatement {
  return {
    type: AST_NODE_TYPES.BlockStatement,
    body: statements,
  }
}

export function identifier(name: string, type?: TypeNode): Identifier {
  return {
    type: AST_NODE_TYPES.Identifier,
    name,
    decorators: [],
    optional: false,
    typeAnnotation: type === undefined ? undefined : tsTypeAnnotation(type),
  }
}

export function memberExpression(object: Expression, property: string): MemberExpression {
  return {
    type: AST_NODE_TYPES.MemberExpression,
    object,
    property: identifier(property),
    optional: false,
    computed: false,
  }
}

export function templateElement(value: string): TemplateElement {
  return {
    type: AST_NODE_TYPES.TemplateElement,
    value: { raw: '', cooked: value },
    tail: false,
  }
}

export function templateLiteral(quasis: string[], expressions: Expression[]): TemplateLiteral {
  return {
    type: AST_NODE_TYPES.TemplateLiteral,
    quasis: quasis.map(templateElement),
    expressions,
  }
}

export function thisExpression(): ThisExpression {
  return {
    type: AST_NODE_TYPES.ThisExpression,
  }
}
