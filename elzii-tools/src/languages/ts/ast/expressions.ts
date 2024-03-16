import {
  ArrayExpression,
  AssignmentExpression,
  AST_NODE_TYPES,
  Expression,
  Identifier,
  ImportExpression,
  MemberExpression,
  ObjectExpression,
  Property,
  TemplateElement,
  TemplateLiteral,
  ThisExpression,
  TypeNode,
} from '@module/languages/ts/tsestree-spec'
import { tsTypeAnnotation } from '@module/languages/ts/ast/types'

export function arrayExpression(...items: Expression[]): ArrayExpression {
  return {
    type: AST_NODE_TYPES.ArrayExpression,
    elements: items,
  }
}

export function assignmentExpression(left: Expression, right: Expression): AssignmentExpression {
  return {
    type: AST_NODE_TYPES.AssignmentExpression,
    left,
    right,
    operator: '=',
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

export function importExpression(source: Expression): ImportExpression {
  return {
    type: AST_NODE_TYPES.ImportExpression,
    source,
    attributes: null,
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

export function objectExpression(...props: Property[]): ObjectExpression {
  return {
    type: AST_NODE_TYPES.ObjectExpression,
    properties: props,
  }
}

export function property(name: string, value: Expression): Property {
  return {
    type: AST_NODE_TYPES.Property,
    key: identifier(name),
    value,
    shorthand: false,
    method: false,
    kind: 'get',
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
