import {
  ArrowFunctionExpression,
  AST_NODE_TYPES,
  BlockStatement,
  CallExpression,
  CallExpressionArgument,
  Expression,
  FunctionExpression,
  LeftHandSideExpression,
  Parameter,
  ReturnStatement,
  TSTypeAnnotation,
} from '@module/languages/ts/tsestree-spec'
import { identifier } from '@module/languages/ts/ast/expressions'

export function arrowFunctionExpression(
  options: FunctionOptions<Expression>,
): ArrowFunctionExpression {
  return {
    type: AST_NODE_TYPES.ArrowFunctionExpression,
    params: options.params,
    returnType: options.returnType,
    body: options.body,
    expression: true,
    id: null,
    async: false,
    generator: false,
    typeParameters: undefined,
  }
}

export function callExpression(
  callee: LeftHandSideExpression,
  ...args: CallExpressionArgument[]
): CallExpression {
  return {
    type: AST_NODE_TYPES.CallExpression,
    callee,
    arguments: args,
    typeArguments: undefined,
    optional: false,
    typeParameters: undefined,
  }
}

export interface FunctionOptions<Body> {
  params: Parameter[]
  body: Body
  // async?: boolean
  // generator?: boolean
  returnType?: TSTypeAnnotation | undefined
  // typeParameters?: TSTypeParameterDeclaration | undefined
}

export function functionExpression(
  name: null, // or string, but never used
  options: FunctionOptions<BlockStatement>,
): FunctionExpression {
  return {
    type: AST_NODE_TYPES.FunctionExpression,
    id: name === null ? null : identifier(name),
    params: options.params,
    body: options.body,
    async: /* options.async ?? */ false,
    generator: /* options.generator ?? */ false,
    returnType: options.returnType,
    typeParameters: undefined /* options.typeParameters */,
    expression: false,
    declare: false,
  }
}

export function returnStatement(argument?: Expression): ReturnStatement {
  return {
    type: AST_NODE_TYPES.ReturnStatement,
    argument: argument ?? null,
  }
}
