import {
  AST_NODE_TYPES,
  BlockStatement,
  ClassBody,
  ClassDeclaration,
  ClassDeclarationWithName,
  ClassElement,
  Expression,
  LeftHandSideExpression,
  MethodDefinitionNonComputedName,
  NewExpression,
  Parameter,
  PropertyDefinition,
  TSClassImplements,
  TSInterfaceBody,
  TSInterfaceDeclaration,
  TSMethodSignature,
  TSTypeAnnotation,
  TypeElement,
  TypeNode,
} from '@module/languages/ts/tsestree-spec'
import { functionExpression, FunctionOptions } from './functions'
import { tsTypeAnnotation, tsTypeParameterInstantiation } from '@module/languages/ts/ast/types'
import { identifier } from '@module/languages/ts/ast/expressions'

export function classBody(...elements: ClassElement[]): ClassBody {
  return { type: AST_NODE_TYPES.ClassBody, body: elements }
}

export interface ClassOptions {
  abstract?: boolean
  body?: ClassBody
  implements?: TSClassImplements[]
}

export function classDeclaration(name: string, options?: ClassOptions): ClassDeclarationWithName
export function classDeclaration(name: string, options?: ClassOptions): ClassDeclaration {
  return {
    type: AST_NODE_TYPES.ClassDeclaration,
    abstract: options?.abstract ?? false,
    body: options?.body ?? classBody(),
    declare: false,
    decorators: [],
    id: identifier(name),
    implements: options?.implements ?? [],
    superClass: null,
    superTypeArguments: undefined,
    superTypeParameters: undefined,
    typeParameters: undefined,
  }
}

export interface MethodOptions extends FunctionOptions<BlockStatement> {
  kind?: 'get' | 'method' | 'constructor' //  | 'set'
  // accessibility?: Accessibility | undefined
  // static?: boolean
  // override?: boolean
}

export function methodDefinition(
  name: string,
  options: MethodOptions,
): MethodDefinitionNonComputedName {
  return {
    type: AST_NODE_TYPES.MethodDefinition,
    key: identifier(name),
    computed: false,
    value: functionExpression(null, options),
    static: /* options.static ?? */ false,
    override: /* options.override ?? */ false,
    kind: options.kind ?? 'method',
    accessibility: 'public' /* options.accessibility */,
    optional: false,
    decorators: [],
  }
}

export function newExpression(
  cls: LeftHandSideExpression,
  args: Expression[],
  typeArgs?: TypeNode[],
): NewExpression {
  typeArgs ??= []
  return {
    type: AST_NODE_TYPES.NewExpression,
    callee: cls,
    arguments: args,
    typeArguments: typeArgs.length === 0 ? undefined : tsTypeParameterInstantiation(typeArgs),
    typeParameters: undefined,
  }
}

export function propertyDefinition(name: string, type: TypeNode): PropertyDefinition {
  return {
    type: AST_NODE_TYPES.PropertyDefinition,
    key: identifier(name),
    typeAnnotation: tsTypeAnnotation(type),
    accessibility: 'private',
    value: null,
    readonly: false,
    optional: false,
    static: false,
    computed: false,
    override: false,
    declare: false,
    definite: false,
    decorators: [],
  }
}

export function tsClassImplements(className: string): TSClassImplements
export function tsClassImplements(className: string): TSClassImplements {
  return {
    type: AST_NODE_TYPES.TSClassImplements,
    expression: identifier(className),
    typeParameters: undefined,
    typeArguments: undefined,
  }
}

export function tsInterfaceBody(...elements: TypeElement[]): TSInterfaceBody {
  return {
    type: AST_NODE_TYPES.TSInterfaceBody,
    body: elements,
  }
}

export function tsInterfaceDeclaration(name: string): TSInterfaceDeclaration {
  return {
    type: AST_NODE_TYPES.TSInterfaceDeclaration,
    id: identifier(name),
    body: tsInterfaceBody(),
    declare: false,
    extends: [],
    typeParameters: undefined,
  }
}

export interface MethodSignatureOptions {
  kind?: 'get' | 'method' // | 'constructor' | 'set'
  // accessibility?: Accessibility | undefined
  params: Parameter[]
  returnType?: TSTypeAnnotation | undefined
}

export function tsMethodSignature(
  name: string,
  options: MethodSignatureOptions,
): TSMethodSignature {
  return {
    type: AST_NODE_TYPES.TSMethodSignature,
    key: identifier(name),
    computed: false,
    kind: options.kind ?? 'method',
    accessibility: undefined,
    optional: false,
    static: false,
    typeParameters: undefined,
    params: options.params,
    returnType: options.returnType,
    readonly: false,
  }
}
