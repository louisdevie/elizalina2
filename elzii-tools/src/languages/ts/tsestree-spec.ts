/*********** NOTICE ***********
 *
 * (most of) the code from this file has been directly taken from the typescript-eslint project, and
 * the license for the original files can be found below. It includes the specifications for the
 * TSESTree AST (as found here: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/ast-spec)
 * with slight modifications to suit this project.
 *
 * MIT License
 *
 * Copyright (c) 2019 typescript-eslint and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { SyntaxKind } from 'typescript'

export type Accessibility = 'private' | 'protected' | 'public'

export type AccessorProperty = AccessorPropertyComputedName | AccessorPropertyNonComputedName

export interface AccessorPropertyComputedName extends PropertyDefinitionComputedNameBase {
  type: AST_NODE_TYPES.AccessorProperty
}

export interface AccessorPropertyNonComputedName extends PropertyDefinitionNonComputedNameBase {
  type: AST_NODE_TYPES.AccessorProperty
}

export interface ArrayExpression extends BaseNode {
  type: AST_NODE_TYPES.ArrayExpression
  /**
   * an element will be `null` in the case of a sparse array: `[1, ,3]`
   */
  elements: (Expression | SpreadElement | null)[]
}

export interface ArrayPattern extends BaseNode {
  type: AST_NODE_TYPES.ArrayPattern
  elements: (DestructuringPattern | null)[]
  typeAnnotation: TSTypeAnnotation | undefined
  optional: boolean
  decorators: Decorator[]
}

export interface ArrowFunctionExpression extends BaseNode {
  type: AST_NODE_TYPES.ArrowFunctionExpression
  generator: boolean
  id: null
  params: Parameter[]
  body: BlockStatement | Expression
  async: boolean
  expression: boolean
  returnType: TSTypeAnnotation | undefined
  typeParameters: TSTypeParameterDeclaration | undefined
}

export interface AssignmentExpression extends BaseNode {
  type: AST_NODE_TYPES.AssignmentExpression
  operator: ValueOf<AssignmentOperatorToText>
  left: Expression
  right: Expression
}

export interface AssignmentOperatorToText {
  [SyntaxKind.EqualsToken]: '='
  [SyntaxKind.PlusEqualsToken]: '+='
  [SyntaxKind.MinusEqualsToken]: '-='
  [SyntaxKind.AsteriskEqualsToken]: '*='
  [SyntaxKind.AsteriskAsteriskEqualsToken]: '**='
  [SyntaxKind.SlashEqualsToken]: '/='
  [SyntaxKind.PercentEqualsToken]: '%='
  [SyntaxKind.LessThanLessThanEqualsToken]: '<<='
  [SyntaxKind.GreaterThanGreaterThanEqualsToken]: '>>='
  [SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken]: '>>>='
  [SyntaxKind.AmpersandEqualsToken]: '&='
  [SyntaxKind.BarEqualsToken]: '|='
  [SyntaxKind.BarBarEqualsToken]: '||='
  [SyntaxKind.AmpersandAmpersandEqualsToken]: '&&='
  [SyntaxKind.QuestionQuestionEqualsToken]: '??='
  [SyntaxKind.CaretEqualsToken]: '^='
}

export interface AssignmentPattern extends BaseNode {
  type: AST_NODE_TYPES.AssignmentPattern
  left: BindingName
  right: Expression
  typeAnnotation: TSTypeAnnotation | undefined
  optional: boolean
  decorators: Decorator[]
}

export enum AST_NODE_TYPES {
  AccessorProperty = 'AccessorProperty',
  ArrayExpression = 'ArrayExpression',
  ArrayPattern = 'ArrayPattern',
  ArrowFunctionExpression = 'ArrowFunctionExpression',
  AssignmentExpression = 'AssignmentExpression',
  AssignmentPattern = 'AssignmentPattern',
  AwaitExpression = 'AwaitExpression',
  BinaryExpression = 'BinaryExpression',
  BlockStatement = 'BlockStatement',
  BreakStatement = 'BreakStatement',
  CallExpression = 'CallExpression',
  CatchClause = 'CatchClause',
  ChainExpression = 'ChainExpression',
  ClassBody = 'ClassBody',
  ClassDeclaration = 'ClassDeclaration',
  ClassExpression = 'ClassExpression',
  ConditionalExpression = 'ConditionalExpression',
  ContinueStatement = 'ContinueStatement',
  DebuggerStatement = 'DebuggerStatement',
  Decorator = 'Decorator',
  DoWhileStatement = 'DoWhileStatement',
  EmptyStatement = 'EmptyStatement',
  ExportAllDeclaration = 'ExportAllDeclaration',
  ExportDefaultDeclaration = 'ExportDefaultDeclaration',
  ExportNamedDeclaration = 'ExportNamedDeclaration',
  ExportSpecifier = 'ExportSpecifier',
  ExpressionStatement = 'ExpressionStatement',
  ForInStatement = 'ForInStatement',
  ForOfStatement = 'ForOfStatement',
  ForStatement = 'ForStatement',
  FunctionDeclaration = 'FunctionDeclaration',
  FunctionExpression = 'FunctionExpression',
  Identifier = 'Identifier',
  IfStatement = 'IfStatement',
  ImportAttribute = 'ImportAttribute',
  ImportDeclaration = 'ImportDeclaration',
  ImportDefaultSpecifier = 'ImportDefaultSpecifier',
  ImportExpression = 'ImportExpression',
  ImportNamespaceSpecifier = 'ImportNamespaceSpecifier',
  ImportSpecifier = 'ImportSpecifier',
  JSXAttribute = 'JSXAttribute',
  JSXClosingElement = 'JSXClosingElement',
  JSXClosingFragment = 'JSXClosingFragment',
  JSXElement = 'JSXElement',
  JSXEmptyExpression = 'JSXEmptyExpression',
  JSXExpressionContainer = 'JSXExpressionContainer',
  JSXFragment = 'JSXFragment',
  JSXIdentifier = 'JSXIdentifier',
  JSXMemberExpression = 'JSXMemberExpression',
  JSXNamespacedName = 'JSXNamespacedName',
  JSXOpeningElement = 'JSXOpeningElement',
  JSXOpeningFragment = 'JSXOpeningFragment',
  JSXSpreadAttribute = 'JSXSpreadAttribute',
  JSXSpreadChild = 'JSXSpreadChild',
  JSXText = 'JSXText',
  LabeledStatement = 'LabeledStatement',
  Literal = 'Literal',
  LogicalExpression = 'LogicalExpression',
  MemberExpression = 'MemberExpression',
  MetaProperty = 'MetaProperty',
  MethodDefinition = 'MethodDefinition',
  NewExpression = 'NewExpression',
  ObjectExpression = 'ObjectExpression',
  ObjectPattern = 'ObjectPattern',
  PrivateIdentifier = 'PrivateIdentifier',
  Program = 'Program',
  Property = 'Property',
  PropertyDefinition = 'PropertyDefinition',
  RestElement = 'RestElement',
  ReturnStatement = 'ReturnStatement',
  SequenceExpression = 'SequenceExpression',
  SpreadElement = 'SpreadElement',
  StaticBlock = 'StaticBlock',
  Super = 'Super',
  SwitchCase = 'SwitchCase',
  SwitchStatement = 'SwitchStatement',
  TaggedTemplateExpression = 'TaggedTemplateExpression',
  TemplateElement = 'TemplateElement',
  TemplateLiteral = 'TemplateLiteral',
  ThisExpression = 'ThisExpression',
  ThrowStatement = 'ThrowStatement',
  TryStatement = 'TryStatement',
  UnaryExpression = 'UnaryExpression',
  UpdateExpression = 'UpdateExpression',
  VariableDeclaration = 'VariableDeclaration',
  VariableDeclarator = 'VariableDeclarator',
  WhileStatement = 'WhileStatement',
  WithStatement = 'WithStatement',
  YieldExpression = 'YieldExpression',
  /**
   * TS-prefixed nodes
   */
  TSAbstractAccessorProperty = 'TSAbstractAccessorProperty',
  TSAbstractKeyword = 'TSAbstractKeyword',
  TSAbstractMethodDefinition = 'TSAbstractMethodDefinition',
  TSAbstractPropertyDefinition = 'TSAbstractPropertyDefinition',
  TSAnyKeyword = 'TSAnyKeyword',
  TSArrayType = 'TSArrayType',
  TSAsExpression = 'TSAsExpression',
  TSAsyncKeyword = 'TSAsyncKeyword',
  TSBigIntKeyword = 'TSBigIntKeyword',
  TSBooleanKeyword = 'TSBooleanKeyword',
  TSCallSignatureDeclaration = 'TSCallSignatureDeclaration',
  TSClassImplements = 'TSClassImplements',
  TSConditionalType = 'TSConditionalType',
  TSConstructorType = 'TSConstructorType',
  TSConstructSignatureDeclaration = 'TSConstructSignatureDeclaration',
  TSDeclareFunction = 'TSDeclareFunction',
  TSDeclareKeyword = 'TSDeclareKeyword',
  TSEmptyBodyFunctionExpression = 'TSEmptyBodyFunctionExpression',
  TSEnumDeclaration = 'TSEnumDeclaration',
  TSEnumMember = 'TSEnumMember',
  TSExportAssignment = 'TSExportAssignment',
  TSExportKeyword = 'TSExportKeyword',
  TSExternalModuleReference = 'TSExternalModuleReference',
  TSFunctionType = 'TSFunctionType',
  TSInstantiationExpression = 'TSInstantiationExpression',
  TSImportEqualsDeclaration = 'TSImportEqualsDeclaration',
  TSImportType = 'TSImportType',
  TSIndexedAccessType = 'TSIndexedAccessType',
  TSIndexSignature = 'TSIndexSignature',
  TSInferType = 'TSInferType',
  TSInterfaceBody = 'TSInterfaceBody',
  TSInterfaceDeclaration = 'TSInterfaceDeclaration',
  TSInterfaceHeritage = 'TSInterfaceHeritage',
  TSIntersectionType = 'TSIntersectionType',
  TSIntrinsicKeyword = 'TSIntrinsicKeyword',
  TSLiteralType = 'TSLiteralType',
  TSMappedType = 'TSMappedType',
  TSMethodSignature = 'TSMethodSignature',
  TSModuleBlock = 'TSModuleBlock',
  TSModuleDeclaration = 'TSModuleDeclaration',
  TSNamedTupleMember = 'TSNamedTupleMember',
  TSNamespaceExportDeclaration = 'TSNamespaceExportDeclaration',
  TSNeverKeyword = 'TSNeverKeyword',
  TSNonNullExpression = 'TSNonNullExpression',
  TSNullKeyword = 'TSNullKeyword',
  TSNumberKeyword = 'TSNumberKeyword',
  TSObjectKeyword = 'TSObjectKeyword',
  TSOptionalType = 'TSOptionalType',
  TSParameterProperty = 'TSParameterProperty',
  TSPrivateKeyword = 'TSPrivateKeyword',
  TSPropertySignature = 'TSPropertySignature',
  TSProtectedKeyword = 'TSProtectedKeyword',
  TSPublicKeyword = 'TSPublicKeyword',
  TSQualifiedName = 'TSQualifiedName',
  TSReadonlyKeyword = 'TSReadonlyKeyword',
  TSRestType = 'TSRestType',
  TSSatisfiesExpression = 'TSSatisfiesExpression',
  TSStaticKeyword = 'TSStaticKeyword',
  TSStringKeyword = 'TSStringKeyword',
  TSSymbolKeyword = 'TSSymbolKeyword',
  TSTemplateLiteralType = 'TSTemplateLiteralType',
  TSThisType = 'TSThisType',
  TSTupleType = 'TSTupleType',
  TSTypeAliasDeclaration = 'TSTypeAliasDeclaration',
  TSTypeAnnotation = 'TSTypeAnnotation',
  TSTypeAssertion = 'TSTypeAssertion',
  TSTypeLiteral = 'TSTypeLiteral',
  TSTypeOperator = 'TSTypeOperator',
  TSTypeParameter = 'TSTypeParameter',
  TSTypeParameterDeclaration = 'TSTypeParameterDeclaration',
  TSTypeParameterInstantiation = 'TSTypeParameterInstantiation',
  TSTypePredicate = 'TSTypePredicate',
  TSTypeQuery = 'TSTypeQuery',
  TSTypeReference = 'TSTypeReference',
  TSUndefinedKeyword = 'TSUndefinedKeyword',
  TSUnionType = 'TSUnionType',
  TSUnknownKeyword = 'TSUnknownKeyword',
  TSVoidKeyword = 'TSVoidKeyword',
}

export enum AST_TOKEN_TYPES {
  Boolean = 'Boolean',
  Identifier = 'Identifier',
  JSXIdentifier = 'JSXIdentifier',
  JSXText = 'JSXText',
  Keyword = 'Keyword',
  Null = 'Null',
  Numeric = 'Numeric',
  Punctuator = 'Punctuator',
  RegularExpression = 'RegularExpression',
  String = 'String',
  Template = 'Template',
  Block = 'Block',
  Line = 'Line',
}

export interface AwaitExpression extends BaseNode {
  type: AST_NODE_TYPES.AwaitExpression
  argument: Expression
}

export interface BaseNode extends NodeOrTokenData {
  type: AST_NODE_TYPES
}

interface BaseToken extends NodeOrTokenData {
  type: AST_TOKEN_TYPES
  value: string
}

export interface BigIntLiteral extends LiteralBase {
  value: bigint | null
  bigint: string
}

export interface BinaryExpression extends BaseNode {
  type: AST_NODE_TYPES.BinaryExpression
  operator: ValueOf<BinaryOperatorToText>
  left: Expression | PrivateIdentifier
  right: Expression
}

export interface BinaryOperatorToText {
  [SyntaxKind.InstanceOfKeyword]: 'instanceof'
  [SyntaxKind.InKeyword]: 'in'
  [SyntaxKind.AsteriskAsteriskToken]: '**'
  [SyntaxKind.AsteriskToken]: '*'
  [SyntaxKind.SlashToken]: '/'
  [SyntaxKind.PercentToken]: '%'
  [SyntaxKind.PlusToken]: '+'
  [SyntaxKind.MinusToken]: '-'
  [SyntaxKind.AmpersandToken]: '&'
  [SyntaxKind.BarToken]: '|'
  [SyntaxKind.CaretToken]: '^'
  [SyntaxKind.LessThanLessThanToken]: '<<'
  [SyntaxKind.GreaterThanGreaterThanToken]: '>>'
  [SyntaxKind.GreaterThanGreaterThanGreaterThanToken]: '>>>'
  [SyntaxKind.AmpersandAmpersandToken]: '&&'
  [SyntaxKind.BarBarToken]: '||'
  [SyntaxKind.LessThanToken]: '<'
  [SyntaxKind.LessThanEqualsToken]: '<='
  [SyntaxKind.GreaterThanToken]: '>'
  [SyntaxKind.GreaterThanEqualsToken]: '>='
  [SyntaxKind.EqualsEqualsToken]: '=='
  [SyntaxKind.EqualsEqualsEqualsToken]: '==='
  [SyntaxKind.ExclamationEqualsEqualsToken]: '!=='
  [SyntaxKind.ExclamationEqualsToken]: '!='
}

export type BindingName = BindingPattern | Identifier

export type BindingPattern = ArrayPattern | ObjectPattern

export interface BlockComment extends BaseToken {
  type: AST_TOKEN_TYPES.Block
}

export interface BlockStatement extends BaseNode {
  type: AST_NODE_TYPES.BlockStatement
  body: Statement[]
}

export interface BooleanLiteral extends LiteralBase {
  value: boolean
  raw: 'false' | 'true'
}

export interface BooleanToken extends BaseToken {
  type: AST_TOKEN_TYPES.Boolean
}

export interface BreakStatement extends BaseNode {
  type: AST_NODE_TYPES.BreakStatement
  label: Identifier | null
}

export interface CallExpression extends BaseNode {
  type: AST_NODE_TYPES.CallExpression
  callee: LeftHandSideExpression
  arguments: CallExpressionArgument[]
  typeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined
  optional: boolean
}

export type CallExpressionArgument = Expression | SpreadElement

export interface CatchClause extends BaseNode {
  type: AST_NODE_TYPES.CatchClause
  param: BindingName | null
  body: BlockStatement
}

export type ChainElement = CallExpression | MemberExpression | TSNonNullExpression

export interface ChainExpression extends BaseNode {
  type: AST_NODE_TYPES.ChainExpression
  expression: ChainElement
}

interface ClassBase extends BaseNode {
  /**
   * Whether the class is an abstract class.
   * ```
   * abstract class Foo {...}
   * ```
   */
  abstract: boolean
  /**
   * The class body.
   */
  body: ClassBody
  /**
   * Whether the class has been `declare`d:
   * ```
   * class Foo {...}
   * ```
   */
  declare: boolean
  /**
   * The decorators declared for the class.
   * ```
   * @deco
   * class Foo {...}
   * ```
   */
  decorators: Decorator[]
  /**
   * The class's name.
   * - For a `ClassExpression` this may be `null` if the name is omitted.
   * - For a `ClassDeclaration` this may be `null` if and only if the parent is
   *   an `ExportDefaultDeclaration`.
   */
  id: Identifier | null
  /**
   * The implemented interfaces for the class.
   */
  implements: TSClassImplements[]
  /**
   * The super class this class extends.
   */
  superClass: LeftHandSideExpression | null
  /**
   * The generic type parameters passed to the superClass.
   */
  superTypeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `superTypeArguments`} instead. */
  superTypeParameters: TSTypeParameterInstantiation | undefined
  /**
   * The generic type parameters declared for the class.
   */
  typeParameters: TSTypeParameterDeclaration | undefined
}

export interface ClassBody extends BaseNode {
  type: AST_NODE_TYPES.ClassBody
  body: ClassElement[]
}

export type ClassDeclaration = ClassDeclarationWithName | ClassDeclarationWithOptionalName

interface ClassDeclarationBase extends ClassBase {
  type: AST_NODE_TYPES.ClassDeclaration
}

export interface ClassDeclarationWithName extends ClassDeclarationBase {
  id: Identifier
}

export interface ClassDeclarationWithOptionalName extends ClassDeclarationBase {
  id: Identifier | null
}

export type ClassElement =
  | AccessorProperty
  | MethodDefinition
  | PropertyDefinition
  | StaticBlock
  | TSAbstractAccessorProperty
  | TSAbstractMethodDefinition
  | TSAbstractPropertyDefinition
  | TSIndexSignature

export interface ClassExpression extends ClassBase {
  type: AST_NODE_TYPES.ClassExpression
  abstract: false
  declare: false
  decorators: []
}

interface ClassMethodDefinitionNonComputedNameBase extends MethodDefinitionBase {
  key: ClassPropertyNameNonComputed
  computed: false
}

interface ClassPropertyDefinitionNonComputedNameBase extends PropertyDefinitionBase {
  key: ClassPropertyNameNonComputed
  computed: false
}

export type ClassPropertyNameNonComputed = PrivateIdentifier | PropertyNameNonComputed

export type Comment = BlockComment | LineComment

export interface ConditionalExpression extends BaseNode {
  type: AST_NODE_TYPES.ConditionalExpression
  test: Expression
  consequent: Expression
  alternate: Expression
}

export interface ContinueStatement extends BaseNode {
  type: AST_NODE_TYPES.ContinueStatement
  label: Identifier | null
}

export interface DebuggerStatement extends BaseNode {
  type: AST_NODE_TYPES.DebuggerStatement
}

export type DeclarationStatement =
  | ClassDeclaration
  | ClassExpression
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | FunctionDeclaration
  | TSDeclareFunction
  | TSEnumDeclaration
  | TSImportEqualsDeclaration
  | TSInterfaceDeclaration
  | TSModuleDeclaration
  | TSNamespaceExportDeclaration
  | TSTypeAliasDeclaration

export interface Decorator extends BaseNode {
  type: AST_NODE_TYPES.Decorator
  expression: LeftHandSideExpression
}

export type DefaultExportDeclarations =
  | ClassDeclarationWithOptionalName
  | Expression
  | FunctionDeclarationWithName
  | FunctionDeclarationWithOptionalName
  | TSDeclareFunction
  | TSEnumDeclaration
  | TSInterfaceDeclaration
  | TSModuleDeclaration
  | TSTypeAliasDeclaration
  | VariableDeclaration

export type DestructuringPattern =
  | ArrayPattern
  | AssignmentPattern
  | Identifier
  | MemberExpression
  | ObjectPattern
  | RestElement

export interface DoWhileStatement extends BaseNode {
  type: AST_NODE_TYPES.DoWhileStatement
  test: Expression
  body: Statement
}

export interface EmptyStatement extends BaseNode {
  type: AST_NODE_TYPES.EmptyStatement
}

export type EntityName = Identifier | ThisExpression | TSQualifiedName

export interface ExportAllDeclaration extends BaseNode {
  type: AST_NODE_TYPES.ExportAllDeclaration
  /**
   * The assertions declared for the export.
   * ```
   *
   export * from 'mod' assert { type: 'json' };
   * ```
   * @deprecated -- Replaced with {@link `attributes`}.
   */
  assertions: ImportAttribute[]
  /**
   * The attributes declared for the export.
   * ```
   *
   export * from 'mod' assert { type: 'json' };
   * ```
   */
  attributes: ImportAttribute[]
  /**
   * The name for the exported items. `null` if no name is assigned.
   */
  exported: Identifier | null
  /**
   * The kind of the export.
   */
  exportKind: ExportKind
  /**
   * The source module being exported from.
   */
  source: StringLiteral
}

type ExportAndImportKind = 'type' | 'value'

export type ExportDeclaration = DefaultExportDeclarations | NamedExportDeclarations

export interface ExportDefaultDeclaration extends BaseNode {
  type: AST_NODE_TYPES.ExportDefaultDeclaration
  /**
   * The declaration being exported.
   */
  declaration: DefaultExportDeclarations
  /**
   * The kind of the export.
   */
  exportKind: ExportKind
}

type ExportKind = ExportAndImportKind

export type ExportNamedDeclaration =
  | ExportNamedDeclarationWithoutSourceWithMultiple
  | ExportNamedDeclarationWithoutSourceWithSingle
  | ExportNamedDeclarationWithSource

interface ExportNamedDeclarationBase extends BaseNode {
  type: AST_NODE_TYPES.ExportNamedDeclaration
  /**
   * The assertions declared for the export.
   * ```
   *
   export { foo } from 'mod' assert { type: 'json' };
   * ```
   * This will be an empty array if `source` is `null`
   * @deprecated Replaced with {@link `attributes`}.
   */
  assertions: ImportAttribute[]
  /**
   * The attributes declared for the export.
   * ```
   *
   export { foo } from 'mod' assert { type: 'json' };
   * ```
   * This will be an empty array if `source` is `null`
   */
  attributes: ImportAttribute[]
  /**
   * The exported declaration.
   * ```
   *
   export const x = 1;
   * ```
   * This will be `null` if `source` is not `null`, or if there are `specifiers`
   */
  declaration: NamedExportDeclarations | null
  /**
   * The kind of the export.
   */
  exportKind: ExportKind
  /**
   * The source module being exported from.
   */
  source: StringLiteral | null
  /**
   * The specifiers being exported.
   * ```
   *
   export { a, b };
   * ```
   * This will be an empty array if `declaration` is not `null`
   */
  specifiers: ExportSpecifier[]
}

export interface ExportNamedDeclarationWithoutSourceWithMultiple
  extends ExportNamedDeclarationBase {
  /**
   * This will always be an empty array.
   * @deprecated Replaced with {@link `attributes`}.
   */
  assertions: ImportAttribute[]
  /**
   * This will always be an empty array.
   */
  attributes: ImportAttribute[]
  declaration: null
  source: null
  specifiers: ExportSpecifier[]
}

export interface ExportNamedDeclarationWithoutSourceWithSingle extends ExportNamedDeclarationBase {
  /**
   * This will always be an empty array.
   * @deprecated Replaced with {@link `attributes`}.
   */
  assertions: ImportAttribute[]
  /**
   * This will always be an empty array.
   */
  attributes: ImportAttribute[]
  declaration: NamedExportDeclarations
  source: null
  specifiers: ExportSpecifier[]
}

export interface ExportNamedDeclarationWithSource extends ExportNamedDeclarationBase {
  /**
   * This will always be an empty array.
   * @deprecated Replaced with {@link `attributes`}.
   */
  assertions: ImportAttribute[]
  /**
   * This will always be an empty array.
   */
  attributes: ImportAttribute[]
  declaration: null
  source: StringLiteral
  specifiers: ExportSpecifier[]
}

export interface ExportSpecifier extends BaseNode {
  type: AST_NODE_TYPES.ExportSpecifier
  local: Identifier
  exported: Identifier
  exportKind: ExportKind
}

export type Expression =
  | ArrayExpression
  | ArrayPattern
  | ArrowFunctionExpression
  | AssignmentExpression
  | AwaitExpression
  | BinaryExpression
  | CallExpression
  | ChainExpression
  | ClassExpression
  | ConditionalExpression
  | FunctionExpression
  | Identifier
  | ImportExpression
  | JSXElement
  | JSXFragment
  | LiteralExpression
  | LogicalExpression
  | MemberExpression
  | MetaProperty
  | NewExpression
  | ObjectExpression
  | ObjectPattern
  | SequenceExpression
  | Super
  | TaggedTemplateExpression
  | TemplateLiteral
  | ThisExpression
  | TSAsExpression
  | TSInstantiationExpression
  | TSNonNullExpression
  | TSSatisfiesExpression
  | TSTypeAssertion
  | UnaryExpression
  | UpdateExpression
  | YieldExpression

export interface ExpressionStatement extends BaseNode {
  type: AST_NODE_TYPES.ExpressionStatement
  expression: Expression
  directive: string | undefined
}

export type ForInitialiser = Expression | LetOrConstOrVarDeclaration

export interface ForInStatement extends BaseNode {
  type: AST_NODE_TYPES.ForInStatement
  left: ForInitialiser
  right: Expression
  body: Statement
}

type ForOfInitialiser = Expression | LetOrConstOrVarDeclaration | UsingInForOfDeclaration

export interface ForOfStatement extends BaseNode {
  type: AST_NODE_TYPES.ForOfStatement
  left: ForOfInitialiser
  right: Expression
  body: Statement
  await: boolean
}

export interface ForStatement extends BaseNode {
  type: AST_NODE_TYPES.ForStatement
  init: Expression | ForInitialiser | null
  test: Expression | null
  update: Expression | null
  body: Statement
}

interface FunctionBase extends BaseNode {
  /**
   * Whether the function is async:
   * ```
   * async function foo(...) {...}
   * const x = async function (...) {...}
   * const x = async (...) => {...}
   * ```
   */
  async: boolean
  /**
   * The body of the function.
   * - For an `ArrowFunctionExpression` this may be an `Expression` or `BlockStatement`.
   * - For a `FunctionDeclaration` or `FunctionExpression` this is always a `BlockStatement.
   * - For a `TSDeclareFunction` this is always `undefined`.
   * - For a `TSEmptyBodyFunctionExpression` this is always `null`.
   */
  body: BlockStatement | Expression | null | undefined
  /**
   * This is only `true` if and only if the node is a `TSDeclareFunction` and it has `declare`:
   * ```
   * function foo(...) {...}
   * ```
   */
  declare: boolean
  /**
   * This is only ever `true` if and only the node is an `ArrowFunctionExpression` and the body
   * is an expression:
   * ```
   * (() => 1)
   * ```
   */
  expression: boolean
  /**
   * Whether the function is a generator function:
   * ```
   * function *foo(...) {...}
   * const x = function *(...) {...}
   * ```
   * This is always `false` for arrow functions as they cannot be generators.
   */
  generator: boolean
  /**
   * The function's name.
   * - For an `ArrowFunctionExpression` this is always `null`.
   * - For a `FunctionExpression` this may be `null` if the name is omitted.
   * - For a `FunctionDeclaration` or `TSDeclareFunction` this may be `null` if
   *   and only if the parent is an `ExportDefaultDeclaration`.
   */
  id: Identifier | null
  /**
   * The list of parameters declared for the function.
   */
  params: Parameter[]
  /**
   * The return type annotation for the function.
   */
  returnType: TSTypeAnnotation | undefined
  /**
   * The generic type parameter declaration for the function.
   */
  typeParameters: TSTypeParameterDeclaration | undefined
}

export type FunctionDeclaration = FunctionDeclarationWithName | FunctionDeclarationWithOptionalName

interface FunctionDeclarationBase extends FunctionBase {
  type: AST_NODE_TYPES.FunctionDeclaration
  body: BlockStatement
  declare: false
  expression: false
}

export interface FunctionDeclarationWithName extends FunctionDeclarationBase {
  id: Identifier
}

export interface FunctionDeclarationWithOptionalName extends FunctionDeclarationBase {
  id: Identifier | null
}

export interface FunctionExpression extends FunctionBase {
  type: AST_NODE_TYPES.FunctionExpression
  body: BlockStatement
  expression: false
}

export type FunctionLike =
  | ArrowFunctionExpression
  | FunctionDeclaration
  | FunctionExpression
  | TSDeclareFunction
  | TSEmptyBodyFunctionExpression

export interface Identifier extends BaseNode {
  type: AST_NODE_TYPES.Identifier
  name: string
  typeAnnotation: TSTypeAnnotation | undefined
  optional: boolean
  decorators: Decorator[]
}

export interface IdentifierToken extends BaseToken {
  type: AST_TOKEN_TYPES.Identifier
}

export interface IfStatement extends BaseNode {
  type: AST_NODE_TYPES.IfStatement
  test: Expression
  consequent: Statement
  alternate: Statement | null
}

export interface ImportAttribute extends BaseNode {
  type: AST_NODE_TYPES.ImportAttribute
  key: Identifier | Literal
  value: Literal
}

export type ImportClause = ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier

export interface ImportDeclaration extends BaseNode {
  type: AST_NODE_TYPES.ImportDeclaration
  /**
   * The assertions declared for the export.
   * ```
   * import * from 'mod' assert { type: 'json' };
   * ```
   * @deprecated -- Replaced with {@link `attributes`}.
   */
  assertions: ImportAttribute[]
  /**
   * The attributes declared for the export.
   * ```
   * import * from 'mod' with { type: 'json' };
   * ```
   */
  attributes: ImportAttribute[]
  /**
   * The kind of the import.
   */
  importKind: ImportKind
  /**
   * The source module being imported from.
   */
  source: StringLiteral
  /**
   * The specifiers being imported.
   * If this is an empty array then either there are no specifiers:
   * ```
   * import {} from 'mod';
   * ```
   * Or it is a side-effect import:
   * ```
   * import 'mod';
   * ```
   */
  specifiers: ImportClause[]
}

export interface ImportDefaultSpecifier extends BaseNode {
  type: AST_NODE_TYPES.ImportDefaultSpecifier
  local: Identifier
}

export interface ImportExpression extends BaseNode {
  type: AST_NODE_TYPES.ImportExpression
  source: Expression
  attributes: Expression | null
}

type ImportKind = ExportAndImportKind

export interface ImportNamespaceSpecifier extends BaseNode {
  type: AST_NODE_TYPES.ImportNamespaceSpecifier
  local: Identifier
}

export interface ImportSpecifier extends BaseNode {
  type: AST_NODE_TYPES.ImportSpecifier
  local: Identifier
  imported: Identifier
  importKind: ImportKind
}

export type IterationStatement =
  | DoWhileStatement
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | WhileStatement

export interface JSXAttribute extends BaseNode {
  type: AST_NODE_TYPES.JSXAttribute
  name: JSXIdentifier | JSXNamespacedName
  value: JSXElement | JSXExpression | Literal | null
}

export type JSXChild = JSXElement | JSXExpression | JSXFragment | JSXText

export interface JSXClosingElement extends BaseNode {
  type: AST_NODE_TYPES.JSXClosingElement
  name: JSXTagNameExpression
}

export interface JSXClosingFragment extends BaseNode {
  type: AST_NODE_TYPES.JSXClosingFragment
}

export interface JSXElement extends BaseNode {
  type: AST_NODE_TYPES.JSXElement
  openingElement: JSXOpeningElement
  closingElement: JSXClosingElement | null
  children: JSXChild[]
}

export interface JSXEmptyExpression extends BaseNode {
  type: AST_NODE_TYPES.JSXEmptyExpression
}

export type JSXExpression = JSXExpressionContainer | JSXSpreadChild

export interface JSXExpressionContainer extends BaseNode {
  type: AST_NODE_TYPES.JSXExpressionContainer
  expression: Expression | JSXEmptyExpression
}

export interface JSXFragment extends BaseNode {
  type: AST_NODE_TYPES.JSXFragment
  openingFragment: JSXOpeningFragment
  closingFragment: JSXClosingFragment
  children: JSXChild[]
}

export interface JSXIdentifier extends BaseNode {
  type: AST_NODE_TYPES.JSXIdentifier
  name: string
}

export interface JSXIdentifierToken extends BaseToken {
  type: AST_TOKEN_TYPES.JSXIdentifier
}

export interface JSXMemberExpression extends BaseNode {
  type: AST_NODE_TYPES.JSXMemberExpression
  object: JSXTagNameExpression
  property: JSXIdentifier
}

export interface JSXNamespacedName extends BaseNode {
  type: AST_NODE_TYPES.JSXNamespacedName
  namespace: JSXIdentifier
  name: JSXIdentifier
}

export interface JSXOpeningElement extends BaseNode {
  type: AST_NODE_TYPES.JSXOpeningElement
  typeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined
  selfClosing: boolean
  name: JSXTagNameExpression
  attributes: (JSXAttribute | JSXSpreadAttribute)[]
}

export interface JSXOpeningFragment extends BaseNode {
  type: AST_NODE_TYPES.JSXOpeningFragment
}

export interface JSXSpreadAttribute extends BaseNode {
  type: AST_NODE_TYPES.JSXSpreadAttribute
  argument: Expression
}

export interface JSXSpreadChild extends BaseNode {
  type: AST_NODE_TYPES.JSXSpreadChild
  expression: Expression | JSXEmptyExpression
}

export type JSXTagNameExpression = JSXIdentifier | JSXMemberExpression | JSXNamespacedName

export interface JSXText extends BaseNode {
  type: AST_NODE_TYPES.JSXText
  value: string
  raw: string
}

export interface JSXTextToken extends BaseToken {
  type: AST_TOKEN_TYPES.JSXText
}

export interface KeywordToken extends BaseToken {
  type: AST_TOKEN_TYPES.Keyword
}

export interface LabeledStatement extends BaseNode {
  type: AST_NODE_TYPES.LabeledStatement
  label: Identifier
  body: Statement
}

export type LeftHandSideExpression =
  | ArrayExpression
  | ArrayPattern
  | ArrowFunctionExpression
  | CallExpression
  | ClassExpression
  | FunctionExpression
  | Identifier
  | JSXElement
  | JSXFragment
  | LiteralExpression
  | MemberExpression
  | MetaProperty
  | ObjectExpression
  | ObjectPattern
  | SequenceExpression
  | Super
  | TaggedTemplateExpression
  | ThisExpression
  | TSAsExpression
  | TSNonNullExpression
  | TSTypeAssertion

export interface LetOrConstOrVarDeclaration extends BaseNode {
  type: AST_NODE_TYPES.VariableDeclaration
  /**
   * The variables declared by this declaration.
   * Note that there may be 0 declarations (i.e. `const;`).
   * ```
   * let x;
   * let y, z;
   * ```
   */
  declarations: LetOrConstOrVarDeclarator[]
  /**
   * Whether the declaration is `declare`d
   * ```
   * const x = 1;
   * ```
   */
  declare: boolean
  /**
   * The keyword used to the variable(s)
   * ```
   * const x = 1;
   * let y = 2;
   * var z = 3;
   * ```
   */
  kind: 'const' | 'let' | 'var'
}

export interface LetOrConstOrVarDeclarator extends BaseNode {
  type: AST_NODE_TYPES.VariableDeclarator
  id: BindingName
  init: Expression | null
  definite: boolean
}

export interface LineComment extends BaseToken {
  type: AST_TOKEN_TYPES.Line
}

export type Literal =
  | BigIntLiteral
  | BooleanLiteral
  | NullLiteral
  | NumberLiteral
  | RegExpLiteral
  | StringLiteral

interface LiteralBase extends BaseNode {
  type: AST_NODE_TYPES.Literal
  raw?: string
  value: RegExp | bigint | boolean | number | string | null
}

export type LiteralExpression = Literal | TemplateLiteral

export interface LogicalExpression extends BaseNode {
  type: AST_NODE_TYPES.LogicalExpression
  operator: '??' | '&&' | '||'
  left: Expression
  right: Expression
}

export type MemberExpression = MemberExpressionComputedName | MemberExpressionNonComputedName

interface MemberExpressionBase extends BaseNode {
  object: Expression
  property: Expression | Identifier | PrivateIdentifier
  computed: boolean
  optional: boolean
}

export interface MemberExpressionComputedName extends MemberExpressionBase {
  type: AST_NODE_TYPES.MemberExpression
  property: Expression
  computed: true
}

export interface MemberExpressionNonComputedName extends MemberExpressionBase {
  type: AST_NODE_TYPES.MemberExpression
  property: Identifier | PrivateIdentifier
  computed: false
}

export interface MetaProperty extends BaseNode {
  type: AST_NODE_TYPES.MetaProperty
  meta: Identifier
  property: Identifier
}

export type MethodDefinition = MethodDefinitionComputedName | MethodDefinitionNonComputedName

/** this should not be directly used - instead use MethodDefinitionComputedNameBase or MethodDefinitionNonComputedNameBase */
interface MethodDefinitionBase extends BaseNode {
  key: PropertyName
  value: FunctionExpression | TSEmptyBodyFunctionExpression
  computed: boolean
  static: boolean
  kind: 'constructor' | 'get' | 'method' | 'set'
  optional: boolean
  decorators: Decorator[]
  accessibility: Accessibility | undefined
  override: boolean
}

export interface MethodDefinitionComputedName extends MethodDefinitionComputedNameBase {
  type: AST_NODE_TYPES.MethodDefinition
}

interface MethodDefinitionComputedNameBase extends MethodDefinitionBase {
  key: PropertyNameComputed
  computed: true
}

export interface MethodDefinitionNonComputedName extends ClassMethodDefinitionNonComputedNameBase {
  type: AST_NODE_TYPES.MethodDefinition
}

interface MethodDefinitionNonComputedNameBase extends MethodDefinitionBase {
  key: PropertyNameNonComputed
  computed: false
}

export type NamedExportDeclarations =
  | ClassDeclarationWithName
  | ClassDeclarationWithOptionalName
  | FunctionDeclarationWithName
  | FunctionDeclarationWithOptionalName
  | TSDeclareFunction
  | TSEnumDeclaration
  | TSImportEqualsDeclaration
  | TSInterfaceDeclaration
  | TSModuleDeclaration
  | TSTypeAliasDeclaration
  | VariableDeclaration

export interface NewExpression extends BaseNode {
  type: AST_NODE_TYPES.NewExpression
  callee: LeftHandSideExpression
  arguments: CallExpressionArgument[]
  typeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined
}

export type Node =
  | AccessorProperty
  | ArrayExpression
  | ArrayPattern
  | ArrowFunctionExpression
  | AssignmentExpression
  | AssignmentPattern
  | AwaitExpression
  | BinaryExpression
  | BlockStatement
  | BreakStatement
  | CallExpression
  | CatchClause
  | ChainExpression
  | ClassBody
  | ClassDeclaration
  | ClassExpression
  | ConditionalExpression
  | ContinueStatement
  | DebuggerStatement
  | Decorator
  | DoWhileStatement
  | EmptyStatement
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ExportSpecifier
  | ExpressionStatement
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Identifier
  | IfStatement
  | ImportAttribute
  | ImportDeclaration
  | ImportDefaultSpecifier
  | ImportExpression
  | ImportNamespaceSpecifier
  | ImportSpecifier
  | JSXAttribute
  | JSXClosingElement
  | JSXClosingFragment
  | JSXElement
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXFragment
  | JSXIdentifier
  | JSXMemberExpression
  | JSXNamespacedName
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadAttribute
  | JSXSpreadChild
  | JSXText
  | LabeledStatement
  | Literal
  | LogicalExpression
  | MemberExpression
  | MetaProperty
  | MethodDefinition
  | NewExpression
  | ObjectExpression
  | ObjectPattern
  | PrivateIdentifier
  | Program
  | Property
  | PropertyDefinition
  | RestElement
  | ReturnStatement
  | SequenceExpression
  | SpreadElement
  | StaticBlock
  | Super
  | SwitchCase
  | SwitchStatement
  | TaggedTemplateExpression
  | TemplateElement
  | TemplateLiteral
  | ThisExpression
  | ThrowStatement
  | TryStatement
  | TSAbstractAccessorProperty
  | TSAbstractKeyword
  | TSAbstractMethodDefinition
  | TSAbstractPropertyDefinition
  | TSAnyKeyword
  | TSArrayType
  | TSAsExpression
  | TSAsyncKeyword
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSCallSignatureDeclaration
  | TSClassImplements
  | TSConditionalType
  | TSConstructorType
  | TSConstructSignatureDeclaration
  | TSDeclareFunction
  | TSDeclareKeyword
  | TSEmptyBodyFunctionExpression
  | TSEnumDeclaration
  | TSEnumMember
  | TSExportAssignment
  | TSExportKeyword
  | TSExternalModuleReference
  | TSFunctionType
  | TSImportEqualsDeclaration
  | TSImportType
  | TSIndexedAccessType
  | TSIndexSignature
  | TSInferType
  | TSInstantiationExpression
  | TSInterfaceBody
  | TSInterfaceDeclaration
  | TSInterfaceHeritage
  | TSIntersectionType
  | TSIntrinsicKeyword
  | TSLiteralType
  | TSMappedType
  | TSMethodSignature
  | TSModuleBlock
  | TSModuleDeclaration
  | TSNamedTupleMember
  | TSNamespaceExportDeclaration
  | TSNeverKeyword
  | TSNonNullExpression
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSOptionalType
  | TSParameterProperty
  | TSPrivateKeyword
  | TSPropertySignature
  | TSProtectedKeyword
  | TSPublicKeyword
  | TSQualifiedName
  | TSReadonlyKeyword
  | TSRestType
  | TSSatisfiesExpression
  | TSStaticKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSTemplateLiteralType
  | TSThisType
  | TSTupleType
  | TSTypeAliasDeclaration
  | TSTypeAnnotation
  | TSTypeAssertion
  | TSTypeLiteral
  | TSTypeOperator
  | TSTypeParameter
  | TSTypeParameterDeclaration
  | TSTypeParameterInstantiation
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUndefinedKeyword
  | TSUnionType
  | TSUnknownKeyword
  | TSVoidKeyword
  | UnaryExpression
  | UpdateExpression
  | VariableDeclaration
  | VariableDeclarator
  | WhileStatement
  | WithStatement
  | YieldExpression

export interface NodeOrTokenData {
  /**
   * The source location information of the node.
   *
   * The loc property is defined as nullable by ESTree, but ESLint requires this property.
   *
   * @see {SourceLocation}
   */
  loc?: SourceLocation
  /**
   * @see {Range}
   */
  range?: Range
  type: string
}

export interface NullLiteral extends LiteralBase {
  value: null
  raw: 'null'
}

export interface NullToken extends BaseToken {
  type: AST_TOKEN_TYPES.Null
}

export interface NumberLiteral extends LiteralBase {
  value: number
}

export interface NumericToken extends BaseToken {
  type: AST_TOKEN_TYPES.Numeric
}

export interface ObjectExpression extends BaseNode {
  type: AST_NODE_TYPES.ObjectExpression
  properties: ObjectLiteralElement[]
}

export type ObjectLiteralElement = Property | SpreadElement

export type ObjectLiteralElementLike = ObjectLiteralElement

export interface ObjectPattern extends BaseNode {
  type: AST_NODE_TYPES.ObjectPattern
  properties: (Property | RestElement)[]
  typeAnnotation: TSTypeAnnotation | undefined
  optional: boolean
  decorators: Decorator[]
}

export type OptionalRangeAndLoc<T> = Pick<T, Exclude<keyof T, 'loc' | 'range'>> & {
  range?: Range
  loc?: SourceLocation
}

export type Parameter =
  | ArrayPattern
  | AssignmentPattern
  | Identifier
  | ObjectPattern
  | RestElement
  | TSParameterProperty

export interface Position {
  /**
   * Line number (1-indexed)
   */
  line: number
  /**
   * Column number on the line (0-indexed)
   */
  column: number
}

export type PrimaryExpression =
  | ArrayExpression
  | ArrayPattern
  | ClassExpression
  | FunctionExpression
  | Identifier
  | JSXElement
  | JSXFragment
  | JSXOpeningElement
  | LiteralExpression
  | MetaProperty
  | ObjectExpression
  | ObjectPattern
  | Super
  | TemplateLiteral
  | ThisExpression
  | TSNullKeyword

export interface PrivateIdentifier extends BaseNode {
  type: AST_NODE_TYPES.PrivateIdentifier
  name: string
}

export interface Program extends NodeOrTokenData {
  type: AST_NODE_TYPES.Program
  body: ProgramStatement[]
  sourceType: 'module' | 'script'
  comments: Comment[] | undefined
  tokens: Token[] | undefined
}

export type ProgramStatement =
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ImportDeclaration
  | Statement
  | TSImportEqualsDeclaration
  | TSNamespaceExportDeclaration

export type Property = PropertyComputedName | PropertyNonComputedName

interface PropertyBase extends BaseNode {
  type: AST_NODE_TYPES.Property
  key: PropertyName
  value: AssignmentPattern | BindingName | Expression | TSEmptyBodyFunctionExpression
  computed: boolean
  method: boolean
  shorthand: boolean
  optional: boolean
  kind: 'get' | 'init' | 'set'
}

export interface PropertyComputedName extends PropertyBase {
  key: PropertyNameComputed
  computed: true
}

export type PropertyDefinition = PropertyDefinitionComputedName | PropertyDefinitionNonComputedName

interface PropertyDefinitionBase extends BaseNode {
  key: PropertyName
  value: Expression | null
  computed: boolean
  static: boolean
  declare: boolean
  readonly: boolean
  decorators: Decorator[]
  accessibility: Accessibility | undefined
  optional: boolean
  definite: boolean
  typeAnnotation: TSTypeAnnotation | undefined
  override: boolean
}

export interface PropertyDefinitionComputedName extends PropertyDefinitionComputedNameBase {
  type: AST_NODE_TYPES.PropertyDefinition
}

interface PropertyDefinitionComputedNameBase extends PropertyDefinitionBase {
  key: PropertyNameComputed
  computed: true
}

export interface PropertyDefinitionNonComputedName
  extends ClassPropertyDefinitionNonComputedNameBase {
  type: AST_NODE_TYPES.PropertyDefinition
}

interface PropertyDefinitionNonComputedNameBase extends PropertyDefinitionBase {
  key: PropertyNameNonComputed
  computed: false
}

export type PropertyName =
  | ClassPropertyNameNonComputed
  | PropertyNameComputed
  | PropertyNameNonComputed

export type PropertyNameComputed = Expression

export type PropertyNameNonComputed = Identifier | NumberLiteral | StringLiteral

export interface PropertyNonComputedName extends PropertyBase {
  key: PropertyNameNonComputed
  computed: false
}

export interface PunctuatorToken extends BaseToken {
  type: AST_TOKEN_TYPES.Punctuator
  value: ValueOf<PunctuatorTokenToText>
}

export interface PunctuatorTokenToText extends AssignmentOperatorToText {
  [SyntaxKind.OpenBraceToken]: '{'
  [SyntaxKind.CloseBraceToken]: '}'
  [SyntaxKind.OpenParenToken]: '('
  [SyntaxKind.CloseParenToken]: ')'
  [SyntaxKind.OpenBracketToken]: '['
  [SyntaxKind.CloseBracketToken]: ']'
  [SyntaxKind.DotToken]: '.'
  [SyntaxKind.DotDotDotToken]: '...'
  [SyntaxKind.SemicolonToken]: ';'
  [SyntaxKind.CommaToken]: ','
  [SyntaxKind.QuestionDotToken]: '?.'
  [SyntaxKind.LessThanToken]: '<'
  [SyntaxKind.LessThanSlashToken]: '</'
  [SyntaxKind.GreaterThanToken]: '>'
  [SyntaxKind.LessThanEqualsToken]: '<='
  [SyntaxKind.GreaterThanEqualsToken]: '>='
  [SyntaxKind.EqualsEqualsToken]: '=='
  [SyntaxKind.ExclamationEqualsToken]: '!='
  [SyntaxKind.EqualsEqualsEqualsToken]: '==='
  [SyntaxKind.ExclamationEqualsEqualsToken]: '!=='
  [SyntaxKind.EqualsGreaterThanToken]: '=>'
  [SyntaxKind.PlusToken]: '+'
  [SyntaxKind.MinusToken]: '-'
  [SyntaxKind.AsteriskToken]: '*'
  [SyntaxKind.AsteriskAsteriskToken]: '**'
  [SyntaxKind.SlashToken]: '/'
  [SyntaxKind.PercentToken]: '%'
  [SyntaxKind.PlusPlusToken]: '++'
  [SyntaxKind.MinusMinusToken]: '--'
  [SyntaxKind.LessThanLessThanToken]: '<<'
  [SyntaxKind.GreaterThanGreaterThanToken]: '>>'
  [SyntaxKind.GreaterThanGreaterThanGreaterThanToken]: '>>>'
  [SyntaxKind.AmpersandToken]: '&'
  [SyntaxKind.BarToken]: '|'
  [SyntaxKind.CaretToken]: '^'
  [SyntaxKind.ExclamationToken]: '!'
  [SyntaxKind.TildeToken]: '~'
  [SyntaxKind.AmpersandAmpersandToken]: '&&'
  [SyntaxKind.BarBarToken]: '||'
  [SyntaxKind.QuestionToken]: '?'
  [SyntaxKind.ColonToken]: ':'
  [SyntaxKind.AtToken]: '@'
  [SyntaxKind.QuestionQuestionToken]: '??'
  [SyntaxKind.BacktickToken]: '`'
  [SyntaxKind.HashToken]: '#'
}

/**
 * An array of two numbers.
 * Both numbers are a 0-based index which is the position in the array of source code characters.
 * The first is the start position of the node, the second is the end position of the node.
 */

export type Range = [number, number]

export interface RegExpLiteral extends LiteralBase {
  value: RegExp | null
  regex: {
    pattern: string
    flags: string
  }
}

export interface RegularExpressionToken extends BaseToken {
  type: AST_TOKEN_TYPES.RegularExpression
  regex: {
    pattern: string
    flags: string
  }
}

export interface RestElement extends BaseNode {
  type: AST_NODE_TYPES.RestElement
  argument: DestructuringPattern
  typeAnnotation: TSTypeAnnotation | undefined
  optional: boolean
  value: AssignmentPattern | undefined
  decorators: Decorator[]
}

export interface ReturnStatement extends BaseNode {
  type: AST_NODE_TYPES.ReturnStatement
  argument: Expression | null
}

export interface SequenceExpression extends BaseNode {
  type: AST_NODE_TYPES.SequenceExpression
  expressions: Expression[]
}

export interface SourceLocation {
  /**
   * The position of the first character of the parsed source region
   */
  start: Position
  /**
   * The position of the first character after the parsed source region
   */
  end: Position
}

export interface SpreadElement extends BaseNode {
  type: AST_NODE_TYPES.SpreadElement
  argument: Expression
}

export type Statement =
  | BlockStatement
  | BreakStatement
  | ClassDeclarationWithName
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ExpressionStatement
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | FunctionDeclarationWithName
  | IfStatement
  | ImportDeclaration
  | LabeledStatement
  | ReturnStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | TSDeclareFunction
  | TSEnumDeclaration
  | TSExportAssignment
  | TSImportEqualsDeclaration
  | TSInterfaceDeclaration
  | TSModuleDeclaration
  | TSNamespaceExportDeclaration
  | TSTypeAliasDeclaration
  | VariableDeclaration
  | WhileStatement
  | WithStatement

export interface StaticBlock extends BaseNode {
  type: AST_NODE_TYPES.StaticBlock
  body: Statement[]
}

export interface StringLiteral extends LiteralBase {
  value: string
}

export interface StringToken extends BaseToken {
  type: AST_TOKEN_TYPES.String
}

export interface Super extends BaseNode {
  type: AST_NODE_TYPES.Super
}

export interface SwitchCase extends BaseNode {
  type: AST_NODE_TYPES.SwitchCase
  test: Expression | null
  consequent: Statement[]
}

export interface SwitchStatement extends BaseNode {
  type: AST_NODE_TYPES.SwitchStatement
  discriminant: Expression
  cases: SwitchCase[]
}

export interface TaggedTemplateExpression extends BaseNode {
  type: AST_NODE_TYPES.TaggedTemplateExpression
  typeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined
  tag: LeftHandSideExpression
  quasi: TemplateLiteral
}

export interface TemplateElement extends BaseNode {
  type: AST_NODE_TYPES.TemplateElement
  value: {
    raw: string
    cooked: string
  }
  tail: boolean
}

export interface TemplateLiteral extends BaseNode {
  type: AST_NODE_TYPES.TemplateLiteral
  quasis: TemplateElement[]
  expressions: Expression[]
}

export interface TemplateToken extends BaseToken {
  type: AST_TOKEN_TYPES.Template
}

export interface ThisExpression extends BaseNode {
  type: AST_NODE_TYPES.ThisExpression
}

export interface ThrowStatement extends BaseNode {
  type: AST_NODE_TYPES.ThrowStatement
  argument: Statement | TSAsExpression | null
}

export type Token =
  | BooleanToken
  | Comment
  | IdentifierToken
  | JSXIdentifierToken
  | JSXTextToken
  | KeywordToken
  | NullToken
  | NumericToken
  | PunctuatorToken
  | RegularExpressionToken
  | StringToken
  | TemplateToken

export interface TryStatement extends BaseNode {
  type: AST_NODE_TYPES.TryStatement
  block: BlockStatement
  handler: CatchClause | null
  finalizer: BlockStatement | null
}

export type TSAbstractAccessorProperty =
  | TSAbstractAccessorPropertyComputedName
  | TSAbstractAccessorPropertyNonComputedName

export interface TSAbstractAccessorPropertyComputedName extends PropertyDefinitionComputedNameBase {
  type: AST_NODE_TYPES.TSAbstractAccessorProperty
  value: null
}

export interface TSAbstractAccessorPropertyNonComputedName
  extends PropertyDefinitionNonComputedNameBase {
  type: AST_NODE_TYPES.TSAbstractAccessorProperty
  value: null
}

export interface TSAbstractKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSAbstractKeyword
}

export type TSAbstractMethodDefinition =
  | TSAbstractMethodDefinitionComputedName
  | TSAbstractMethodDefinitionNonComputedName

export interface TSAbstractMethodDefinitionComputedName extends MethodDefinitionComputedNameBase {
  type: AST_NODE_TYPES.TSAbstractMethodDefinition
}

export interface TSAbstractMethodDefinitionNonComputedName
  extends MethodDefinitionNonComputedNameBase {
  type: AST_NODE_TYPES.TSAbstractMethodDefinition
}

export type TSAbstractPropertyDefinition =
  | TSAbstractPropertyDefinitionComputedName
  | TSAbstractPropertyDefinitionNonComputedName

export interface TSAbstractPropertyDefinitionComputedName
  extends PropertyDefinitionComputedNameBase {
  type: AST_NODE_TYPES.TSAbstractPropertyDefinition
  value: null
}

export interface TSAbstractPropertyDefinitionNonComputedName
  extends PropertyDefinitionNonComputedNameBase {
  type: AST_NODE_TYPES.TSAbstractPropertyDefinition
  value: null
}

export interface TSAnyKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSAnyKeyword
}

export interface TSArrayType extends BaseNode {
  type: AST_NODE_TYPES.TSArrayType
  elementType: TypeNode
}

export interface TSAsExpression extends BaseNode {
  type: AST_NODE_TYPES.TSAsExpression
  expression: Expression
  typeAnnotation: TypeNode
}

export interface TSAsyncKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSAsyncKeyword
}

export interface TSBigIntKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSBigIntKeyword
}

export interface TSBooleanKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSBooleanKeyword
}

export interface TSCallSignatureDeclaration extends TSFunctionSignatureBase {
  type: AST_NODE_TYPES.TSCallSignatureDeclaration
}

export interface TSClassImplements extends TSHeritageBase {
  type: AST_NODE_TYPES.TSClassImplements
}

export interface TSConditionalType extends BaseNode {
  type: AST_NODE_TYPES.TSConditionalType
  checkType: TypeNode
  extendsType: TypeNode
  trueType: TypeNode
  falseType: TypeNode
}

export interface TSConstructorType extends TSFunctionSignatureBase {
  type: AST_NODE_TYPES.TSConstructorType
  abstract: boolean
}

export interface TSConstructSignatureDeclaration extends TSFunctionSignatureBase {
  type: AST_NODE_TYPES.TSConstructSignatureDeclaration
}

export interface TSDeclareFunction extends FunctionBase {
  type: AST_NODE_TYPES.TSDeclareFunction
  body: BlockStatement | undefined
  declare: boolean
  expression: false
}

export interface TSDeclareKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSDeclareKeyword
}

export interface TSEmptyBodyFunctionExpression extends FunctionBase {
  type: AST_NODE_TYPES.TSEmptyBodyFunctionExpression
  body: null
  id: null
}

export interface TSEnumDeclaration extends BaseNode {
  type: AST_NODE_TYPES.TSEnumDeclaration
  /**
   * Whether this is a `const` enum.
   * ```
   * const enum Foo {...}
   * ```
   */
  const: boolean
  /**
   * Whether this is a `declare`d enum.
   * ```
   * enum Foo {...}
   * ```
   */
  declare: boolean
  /**
   * The enum name.
   */
  id: Identifier
  /**
   * The enum members.
   */
  members: TSEnumMember[]
}

export type TSEnumMember = TSEnumMemberComputedName | TSEnumMemberNonComputedName

interface TSEnumMemberBase extends BaseNode {
  type: AST_NODE_TYPES.TSEnumMember
  id: PropertyNameComputed | PropertyNameNonComputed
  initializer: Expression | undefined
  computed: boolean
}

/**
 * this should only really happen in semantically invalid code (errors 1164 and 2452)
 *
 * VALID:
 * enum Foo { ['a'] }
 *
 * INVALID:
 * const x = 'a';
 * enum Foo { [x] }
 * enum Bar { ['a' + 'b'] }
 */

export interface TSEnumMemberComputedName extends TSEnumMemberBase {
  id: PropertyNameComputed
  computed: true
}

export interface TSEnumMemberNonComputedName extends TSEnumMemberBase {
  id: PropertyNameNonComputed
  computed: false
}

export interface TSExportAssignment extends BaseNode {
  type: AST_NODE_TYPES.TSExportAssignment
  expression: Expression
}

export interface TSExportKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSExportKeyword
}

export interface TSExternalModuleReference extends BaseNode {
  type: AST_NODE_TYPES.TSExternalModuleReference
  expression: Expression
}

interface TSFunctionSignatureBase extends BaseNode {
  params: Parameter[]
  returnType: TSTypeAnnotation | undefined
  typeParameters: TSTypeParameterDeclaration | undefined
}

export interface TSFunctionType extends TSFunctionSignatureBase {
  type: AST_NODE_TYPES.TSFunctionType
}

interface TSHeritageBase extends BaseNode {
  expression: Expression
  typeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined
}

export interface TSImportEqualsDeclaration extends BaseNode {
  type: AST_NODE_TYPES.TSImportEqualsDeclaration
  /**
   * The locally imported name
   */
  id: Identifier
  /**
   * The value being aliased.
   * ```
   * import F1 = A;
   * import F2 = A.B.C;
   * import F3 = require('mod');
   * ```
   */
  moduleReference: EntityName | TSExternalModuleReference
  importKind: ImportKind
}

export interface TSImportType extends BaseNode {
  type: AST_NODE_TYPES.TSImportType
  argument: TypeNode
  qualifier: EntityName | null
  typeArguments: TSTypeParameterInstantiation | null
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | null
}

export interface TSIndexedAccessType extends BaseNode {
  type: AST_NODE_TYPES.TSIndexedAccessType
  objectType: TypeNode
  indexType: TypeNode
}

export interface TSIndexSignature extends BaseNode {
  type: AST_NODE_TYPES.TSIndexSignature
  parameters: Parameter[]
  typeAnnotation: TSTypeAnnotation | undefined
  readonly: boolean
  accessibility: Accessibility | undefined
  static: boolean
}

export interface TSInferType extends BaseNode {
  type: AST_NODE_TYPES.TSInferType
  typeParameter: TSTypeParameter
}

export interface TSInstantiationExpression extends BaseNode {
  type: AST_NODE_TYPES.TSInstantiationExpression
  expression: Expression
  typeArguments: TSTypeParameterInstantiation
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters?: TSTypeParameterInstantiation
}

export interface TSInterfaceBody extends BaseNode {
  type: AST_NODE_TYPES.TSInterfaceBody
  body: TypeElement[]
}

export interface TSInterfaceDeclaration extends BaseNode {
  type: AST_NODE_TYPES.TSInterfaceDeclaration
  /**
   * The body of the interface
   */
  body: TSInterfaceBody
  /**
   * Whether the interface was `declare`d, `undefined` otherwise
   */
  declare: boolean
  /**
   * The types this interface `extends`
   */
  extends: TSInterfaceHeritage[]
  /**
   * The name of this interface
   */
  id: Identifier
  /**
   * The generic type parameters declared for the interface.
   */
  typeParameters: TSTypeParameterDeclaration | undefined
}

export interface TSInterfaceHeritage extends TSHeritageBase {
  type: AST_NODE_TYPES.TSInterfaceHeritage
}

export interface TSIntersectionType extends BaseNode {
  type: AST_NODE_TYPES.TSIntersectionType
  types: TypeNode[]
}

export interface TSIntrinsicKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSIntrinsicKeyword
}

export interface TSLiteralType extends BaseNode {
  type: AST_NODE_TYPES.TSLiteralType
  literal: LiteralExpression | UnaryExpression | UpdateExpression
}

export interface TSMappedType extends BaseNode {
  type: AST_NODE_TYPES.TSMappedType
  typeParameter: TSTypeParameter
  readonly: boolean | '-' | '+' | undefined
  optional: boolean | '-' | '+' | undefined
  typeAnnotation: TypeNode | undefined
  nameType: TypeNode | null
}

export type TSMethodSignature = TSMethodSignatureComputedName | TSMethodSignatureNonComputedName

interface TSMethodSignatureBase extends BaseNode {
  type: AST_NODE_TYPES.TSMethodSignature
  accessibility: Accessibility | undefined
  computed: boolean
  key: PropertyName
  kind: 'get' | 'method' | 'set'
  optional: boolean
  params: Parameter[]
  readonly: boolean
  returnType: TSTypeAnnotation | undefined
  static: boolean
  typeParameters: TSTypeParameterDeclaration | undefined
}

export interface TSMethodSignatureComputedName extends TSMethodSignatureBase {
  key: PropertyNameComputed
  computed: true
}

export interface TSMethodSignatureNonComputedName extends TSMethodSignatureBase {
  key: PropertyNameNonComputed
  computed: false
}

export interface TSModuleBlock extends BaseNode {
  type: AST_NODE_TYPES.TSModuleBlock
  body: ProgramStatement[]
}

export type TSModuleDeclaration =
  | TSModuleDeclarationGlobal
  | TSModuleDeclarationModule
  | TSModuleDeclarationNamespace

interface TSModuleDeclarationBase extends BaseNode {
  type: AST_NODE_TYPES.TSModuleDeclaration
  /**
   * The name of the module
   * ```
   * namespace A {}
   * namespace A.B.C {}
   * module 'a' {}
   * ```
   */
  id: Identifier | Literal | TSQualifiedName
  /**
   * The body of the module.
   * This can only be `undefined` for the code `module 'mod';`
   * This will be a `TSModuleDeclaration` if the name is "nested" (`Foo.Bar`).
   */
  body?: TSModuleBlock
  /**
   * Whether this is a global declaration
   * ```
   * global {}
   * ```
   */
  global: boolean
  /**
   * Whether the module is `declare`d
   * ```
   * namespace F {}
   * ```
   */
  declare: boolean
  /**
   * The keyword used to define this module declaration
   * ```
   * namespace Foo {}
   * ^^^^^^^^^
   *
   * module 'foo' {}
   * ^^^^^^
   *
   * global {}
   *         ^^^^^^
   * ```
   */
  kind: TSModuleDeclarationKind
}

export interface TSModuleDeclarationGlobal extends TSModuleDeclarationBase {
  kind: 'global'
  body: TSModuleBlock
  id: Identifier
}

export type TSModuleDeclarationKind = 'global' | 'module' | 'namespace'

export type TSModuleDeclarationModule =
  | TSModuleDeclarationModuleWithIdentifierId
  | TSModuleDeclarationModuleWithStringId

interface TSModuleDeclarationModuleBase extends TSModuleDeclarationBase {
  kind: 'module'
}

export interface TSModuleDeclarationModuleWithIdentifierId extends TSModuleDeclarationModuleBase {
  kind: 'module'
  id: Identifier
  body: TSModuleBlock
}

export type TSModuleDeclarationModuleWithStringId =
  | TSModuleDeclarationModuleWithStringIdDeclared
  | TSModuleDeclarationModuleWithStringIdNotDeclared

export interface TSModuleDeclarationModuleWithStringIdDeclared
  extends TSModuleDeclarationModuleBase {
  kind: 'module'
  id: StringLiteral
  declare: true
  body?: TSModuleBlock
}

export interface TSModuleDeclarationModuleWithStringIdNotDeclared
  extends TSModuleDeclarationModuleBase {
  kind: 'module'
  id: StringLiteral
  declare: false
  body: TSModuleBlock
}

export interface TSModuleDeclarationNamespace extends TSModuleDeclarationBase {
  kind: 'namespace'
  id: Identifier | TSQualifiedName
  body: TSModuleBlock
}

export interface TSNamedTupleMember extends BaseNode {
  type: AST_NODE_TYPES.TSNamedTupleMember
  elementType: TypeNode
  label: Identifier
  optional: boolean
}

export interface TSNamespaceExportDeclaration extends BaseNode {
  type: AST_NODE_TYPES.TSNamespaceExportDeclaration
  /**
   * The name the global variable being exported to
   */
  id: Identifier
}

export interface TSNeverKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSNeverKeyword
}

export interface TSNonNullExpression extends BaseNode {
  type: AST_NODE_TYPES.TSNonNullExpression
  expression: Expression
}

export interface TSNullKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSNullKeyword
}

export interface TSNumberKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSNumberKeyword
}

export interface TSObjectKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSObjectKeyword
}

export interface TSOptionalType extends BaseNode {
  type: AST_NODE_TYPES.TSOptionalType
  typeAnnotation: TypeNode
}

export interface TSParameterProperty extends BaseNode {
  type: AST_NODE_TYPES.TSParameterProperty
  accessibility: Accessibility | undefined
  readonly: boolean
  static: boolean
  override: boolean
  parameter: AssignmentPattern | BindingName | RestElement
  decorators: Decorator[]
}

export interface TSPrivateKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSPrivateKeyword
}

export type TSPropertySignature =
  | TSPropertySignatureComputedName
  | TSPropertySignatureNonComputedName

interface TSPropertySignatureBase extends BaseNode {
  type: AST_NODE_TYPES.TSPropertySignature
  key: PropertyName
  optional: boolean
  computed: boolean
  typeAnnotation: TSTypeAnnotation | undefined
  readonly: boolean
  static: boolean
  accessibility: Accessibility | undefined
}

export interface TSPropertySignatureComputedName extends TSPropertySignatureBase {
  key: PropertyNameComputed
  computed: true
}

export interface TSPropertySignatureNonComputedName extends TSPropertySignatureBase {
  key: PropertyNameNonComputed
  computed: false
}

export interface TSProtectedKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSProtectedKeyword
}

export interface TSPublicKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSPublicKeyword
}

export interface TSQualifiedName extends BaseNode {
  type: AST_NODE_TYPES.TSQualifiedName
  left: EntityName
  right: Identifier
}

export interface TSReadonlyKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSReadonlyKeyword
}

export interface TSRestType extends BaseNode {
  type: AST_NODE_TYPES.TSRestType
  typeAnnotation: TypeNode
}

export interface TSSatisfiesExpression extends BaseNode {
  type: AST_NODE_TYPES.TSSatisfiesExpression
  expression: Expression
  typeAnnotation: TypeNode
}

export interface TSStaticKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSStaticKeyword
}

export interface TSStringKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSStringKeyword
}

export interface TSSymbolKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSSymbolKeyword
}

export interface TSTemplateLiteralType extends BaseNode {
  type: AST_NODE_TYPES.TSTemplateLiteralType
  quasis: TemplateElement[]
  types: TypeNode[]
}

export interface TSThisType extends BaseNode {
  type: AST_NODE_TYPES.TSThisType
}

export interface TSTupleType extends BaseNode {
  type: AST_NODE_TYPES.TSTupleType
  elementTypes: TypeNode[]
}

export interface TSTypeAliasDeclaration extends BaseNode {
  type: AST_NODE_TYPES.TSTypeAliasDeclaration
  /**
   * Whether the type was `declare`d.
   * ```
   * type T = 1;
   * ```
   */
  declare: boolean
  /**
   * The name of the type.
   */
  id: Identifier
  /**
   * The "value" (type) of the declaration
   */
  typeAnnotation: TypeNode
  /**
   * The generic type parameters declared for the type.
   */
  typeParameters: TSTypeParameterDeclaration | undefined
}

export interface TSTypeAnnotation extends BaseNode {
  type: AST_NODE_TYPES.TSTypeAnnotation
  typeAnnotation: TypeNode
}

export interface TSTypeAssertion extends BaseNode {
  type: AST_NODE_TYPES.TSTypeAssertion
  typeAnnotation: TypeNode
  expression: Expression
}

export interface TSTypeLiteral extends BaseNode {
  type: AST_NODE_TYPES.TSTypeLiteral
  members: TypeElement[]
}

export interface TSTypeOperator extends BaseNode {
  type: AST_NODE_TYPES.TSTypeOperator
  operator: 'keyof' | 'readonly' | 'unique'
  typeAnnotation: TypeNode | undefined
}

export interface TSTypeParameter extends BaseNode {
  type: AST_NODE_TYPES.TSTypeParameter
  name: Identifier
  constraint: TypeNode | undefined
  default: TypeNode | undefined
  in: boolean
  out: boolean
  const: boolean
}

export interface TSTypeParameterDeclaration extends BaseNode {
  type: AST_NODE_TYPES.TSTypeParameterDeclaration
  params: TSTypeParameter[]
}

export interface TSTypeParameterInstantiation extends BaseNode {
  type: AST_NODE_TYPES.TSTypeParameterInstantiation
  params: TypeNode[]
}

export interface TSTypePredicate extends BaseNode {
  type: AST_NODE_TYPES.TSTypePredicate
  asserts: boolean
  parameterName: Identifier | TSThisType
  typeAnnotation: TSTypeAnnotation | null
}

export interface TSTypeQuery extends BaseNode {
  type: AST_NODE_TYPES.TSTypeQuery
  exprName: EntityName | TSImportType
  typeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined
}

export interface TSTypeReference extends BaseNode {
  type: AST_NODE_TYPES.TSTypeReference
  typeArguments: TSTypeParameterInstantiation | undefined
  /** @deprecated Use {@link `typeArguments`} instead. */
  typeParameters: TSTypeParameterInstantiation | undefined
  typeName: EntityName
}

export type TSUnaryExpression =
  | AwaitExpression
  | LeftHandSideExpression
  | UnaryExpression
  | UpdateExpression

export interface TSUndefinedKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSUndefinedKeyword
}

export interface TSUnionType extends BaseNode {
  type: AST_NODE_TYPES.TSUnionType
  types: TypeNode[]
}

export interface TSUnknownKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSUnknownKeyword
}

export interface TSVoidKeyword extends BaseNode {
  type: AST_NODE_TYPES.TSVoidKeyword
}

export type TypeElement =
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSIndexSignature
  | TSMethodSignature
  | TSPropertySignature

export type TypeNode =
  | TSAbstractKeyword
  | TSAnyKeyword
  | TSArrayType
  | TSAsyncKeyword
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSConditionalType
  | TSConstructorType
  | TSDeclareKeyword
  | TSExportKeyword
  | TSFunctionType
  | TSImportType
  | TSIndexedAccessType
  | TSInferType
  | TSIntersectionType
  | TSIntrinsicKeyword
  | TSLiteralType
  | TSMappedType
  | TSNamedTupleMember
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSOptionalType
  | TSPrivateKeyword
  | TSProtectedKeyword
  | TSPublicKeyword
  | TSQualifiedName
  | TSReadonlyKeyword
  | TSRestType
  | TSStaticKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSTemplateLiteralType
  | TSThisType
  | TSTupleType
  | TSTypeLiteral
  | TSTypeOperator
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUndefinedKeyword
  | TSUnionType
  | TSUnknownKeyword
  | TSVoidKeyword

export interface UnaryExpression extends UnaryExpressionBase {
  type: AST_NODE_TYPES.UnaryExpression
  operator: '-' | '!' | '+' | '~' | 'delete' | 'typeof' | 'void'
}

interface UnaryExpressionBase extends BaseNode {
  operator: string
  prefix: boolean
  argument: LeftHandSideExpression | Literal | UnaryExpression
}

export interface UpdateExpression extends UnaryExpressionBase {
  type: AST_NODE_TYPES.UpdateExpression
  operator: '--' | '++'
}

export type UsingDeclaration = UsingInForOfDeclaration | UsingInNormalContextDeclaration

export type UsingDeclarator = UsingInForOfDeclarator | UsingInNomalConextDeclarator

export interface UsingInForOfDeclaration extends BaseNode {
  type: AST_NODE_TYPES.VariableDeclaration
  /**
   * The variables declared by this declaration.
   * Note that there may be 0 declarations (i.e. `const;`).
   * ```
   * for(using x of y){}
   * ```
   */
  declarations: UsingInForOfDeclarator[]
  /**
   * This value will always be `false`
   * because 'declare' modifier cannot appear on a 'using' declaration.
   */
  declare: false
  /**
   * The keyword used to the variable(s)
   * ```
   * for(using x of y){}
   * for(await using x of y){}
   * ```
   */
  kind: 'await using' | 'using'
}

export interface UsingInForOfDeclarator extends BaseNode {
  type: AST_NODE_TYPES.VariableDeclarator
  id: Identifier
  init: null
  definite: boolean
}

export interface UsingInNomalConextDeclarator extends BaseNode {
  type: AST_NODE_TYPES.VariableDeclarator
  id: Identifier
  init: Expression
  definite: boolean
}

export interface UsingInNormalContextDeclaration extends BaseNode {
  type: AST_NODE_TYPES.VariableDeclaration
  /**
   * The variables declared by this declaration.
   * Note that there may be 0 declarations (i.e. `const;`).
   * ```
   * using x = 1;
   * using y =1, z = 2;
   * ```
   */
  declarations: UsingInNomalConextDeclarator[]
  /**
   * This value will always be `false`
   * because 'declare' modifier cannot appear on a 'using' declaration.
   */
  declare: false
  /**
   * The keyword used to the variable(s)
   * ```
   * using x = 1;
   * await using y = 2;
   * ```
   */
  kind: 'await using' | 'using'
}

type ValueOf<T> = T[keyof T]

export type VariableDeclaration = LetOrConstOrVarDeclaration | UsingDeclaration

export type VariableDeclarator = LetOrConstOrVarDeclarator | UsingDeclarator

export interface WhileStatement extends BaseNode {
  type: AST_NODE_TYPES.WhileStatement
  test: Expression
  body: Statement
}

export interface WithStatement extends BaseNode {
  type: AST_NODE_TYPES.WithStatement
  object: Expression
  body: Statement
}

export interface YieldExpression extends BaseNode {
  type: AST_NODE_TYPES.YieldExpression
  delegate: boolean
  argument: Expression | undefined
}

//# sourceMappingURL=ast-spec.d.ts.map
