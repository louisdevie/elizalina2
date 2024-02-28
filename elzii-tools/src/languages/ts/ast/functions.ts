import {
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
  TSTypeParameterDeclaration,
  TSTypeParameterInstantiation,
} from '@module/languages/ts/tsestree-spec'
import { identifier } from '@module/languages/ts/ast/misc'

export function callExpression(
  callee: LeftHandSideExpression,
  ...args: CallExpressionArgument[]
): CallExpression
export function callExpression(
  callee: LeftHandSideExpression,
  typeArgs: TSTypeParameterInstantiation,
  ...args: CallExpressionArgument[]
): CallExpression
export function callExpression(
  callee: LeftHandSideExpression,
  typeArgsOrFirstArg: TSTypeParameterInstantiation | CallExpressionArgument | undefined,
  ...args: CallExpressionArgument[]
): CallExpression {
  let allTypeArgs: TSTypeParameterInstantiation | undefined
  let allArgs: CallExpressionArgument[]

  if (typeArgsOrFirstArg?.type === AST_NODE_TYPES.TSTypeParameterInstantiation) {
    allTypeArgs = typeArgsOrFirstArg
    allArgs = args
  } else if (typeArgsOrFirstArg === undefined) {
    allTypeArgs = undefined
    allArgs = []
  } else {
    allTypeArgs = undefined
    allArgs = [typeArgsOrFirstArg, ...args]
  }

  return {
    type: AST_NODE_TYPES.CallExpression,
    callee,
    arguments: allArgs,
    typeArguments: allTypeArgs,
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
