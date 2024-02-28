import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  BlockComment,
  Literal,
  StringLiteral,
} from '@module/languages/ts/tsestree-spec'

export function blockComment(text: string): BlockComment {
  return {
    type: AST_TOKEN_TYPES.Block,
    value: text,
  }
}

// export function literal(value: BigInt): ts.BigIntLiteral
// export function literal(value: boolean): ts.BooleanLiteral
// export function literal(value: null): ts.NullLiteral
// export function literal(value: number): ts.NumberLiteral
// export function literal(value: RegExp): ts.RegExpLiteral
export function literal(value: string): StringLiteral
export function literal(value: any): Literal {
  return {
    type: AST_NODE_TYPES.Literal,
    value,
  }
}
