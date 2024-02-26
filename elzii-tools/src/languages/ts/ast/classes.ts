import {
  Accessibility,
  AST_NODE_TYPES,
  BlockStatement,
  ClassBody,
  ClassDeclaration,
  ClassDeclarationWithName,
  ClassElement,
  MethodDefinitionNonComputedName,
  TSClassImplements,
} from '@module/languages/ts/tsestree-spec'
import { functionExpression, FunctionOptions } from './functions'
import { identifier } from './misc'

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
  kind?: 'constructor' | 'get' | 'method' | 'set'
  accessibility?: Accessibility | undefined
  static?: boolean
  override?: boolean
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
    static: options.static ?? false,
    override: options.override ?? false,
    kind: options.kind ?? 'method',
    accessibility: options.accessibility,
    optional: false,
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
