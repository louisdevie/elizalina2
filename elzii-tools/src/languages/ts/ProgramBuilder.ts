import { AST_NODE_TYPES, NodeOrTokenData, Program, Range, SourceLocation } from './ast'

const noLocation: SourceLocation = {
  start: { line: -1, column: -1 },
  end: { line: -1, column: -1 },
}

const noRange: Range = [-1, -1]

function withoutLocation<T extends { readonly type: string }>(object: T): T & NodeOrTokenData {
  return {
    loc: noLocation,
    range: noRange,
    ...object,
  }
}

export default class ProgramBuilder {
  private _program: Program

  public constructor(sourceType: 'module' | 'script') {
    this._program = withoutLocation({
      type: AST_NODE_TYPES.Program,
      sourceType,
      body: [],
      comments: undefined,
      tokens: undefined,
    })
  }

  public build(): Program {
    return this._program
  }
}
