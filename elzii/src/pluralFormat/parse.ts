enum ParserState {
  TEXT,
  HASH,
}

/**
 * Parses plural forms to find the hash signs '#' to replace.
 */
export class PluralFormParser {
  private readonly _source: string
  private readonly _textParts: string[]
  private _currentTextPart: string
  private _state: ParserState
  private _position: number

  private constructor(source: string) {
    this._source = source
    this._textParts = []
    this._currentTextPart = ''
    this._state = ParserState.TEXT
    this._position = -1
  }

  private processNextChar(): boolean {
    this._position++
    let charsRemaining = this._position < this._source.length

    // null means END-OF-TEXT
    const currentChar = charsRemaining ? this._source[this._position] : null

    switch (this._state) {
      case ParserState.TEXT:
        this._state = this.processInTextContext(currentChar)
        break
      case ParserState.HASH:
        this._state = this.processInHashContext(currentChar)
        break
    }

    return charsRemaining
  }

  private processInTextContext(currentChar: string | null): ParserState {
    let nextState = this._state

    if (currentChar === null) {
      this.moveToNextPart()
    } else if (currentChar === '#') {
      nextState = ParserState.HASH
    } else {
      this._currentTextPart += currentChar
    }

    return nextState
  }

  private processInHashContext(currentChar: string | null): ParserState {
    if (currentChar === null) {
      // call two times to add an empty part after the last hash
      this.moveToNextPart()
      this.moveToNextPart()
    } else if (currentChar === '#') {
      this._currentTextPart += '#'
    } else {
      this.moveToNextPart()
      this._currentTextPart += currentChar
    }

    return ParserState.TEXT
  }

  private moveToNextPart() {
    this._textParts.push(this._currentTextPart)
    this._currentTextPart = ''
  }

  private process(): string[] {
    while (this.processNextChar()) {}

    return this._textParts
  }

  public static parse(text: string): string[] {
    return new PluralFormParser(text).process()
  }
}
