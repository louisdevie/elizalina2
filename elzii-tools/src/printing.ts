export class PrintedCode {
  private _lines: string[]

  public constructor(...lines: string[]) {
    this._lines = lines
  }

  public get lineCount(): number {
    return this._lines.length
  }

  public get firstLineLength(): number {
    return this._lines[0].length
  }

  public static join(blocks: PrintedCode[]): PrintedCode {
    return new PrintedCode(...blocks.flatMap((block) => block._lines))
  }

  public static joinInline(blocks: PrintedCode[]): PrintedCode {
    const lines: string[] = []

    for (const block of blocks) {
      let i = 0

      if (lines.length > 0) {
        let lastLine = lines.pop()!
        lines.push(lastLine + block._lines[0])
        i = 1
      }

      for (i; i < block._lines.length; i++) {
        lines.push(block._lines[i])
      }
    }

    return new PrintedCode(...lines)
  }

  public toString(): string {
    return this._lines.join('\n')
  }

  public indent(indentation: Indentation, depth: number = 1) {
    const padding = indentation.char.repeat(indentation.size * depth)
    this._lines = this._lines.map((line) => padding + line)
  }

  public prepend(code: PrintedCode) {
    this._lines.unshift(...code._lines)
  }

  public append(code: PrintedCode) {
    this._lines.push(...code._lines)
  }

  public prependInline(code: PrintedCode) {
    const last = code._lines.length - 1
    this._lines[0] = code._lines[last] + this._lines[0]
    for (let i = last - 1; i >= 0; i--) {
      this._lines.unshift(code._lines[i])
    }
  }

  public appendInline(code: PrintedCode) {
    const last = this._lines.length - 1
    this._lines[last] = this._lines[last] + code._lines[0]
    for (let i = 1; i < code._lines.length; i++) {
      this._lines.push(code._lines[i])
    }
  }
}

export interface Indentation {
  readonly char: string
  readonly size: number
}

/**
 * An interface for code pre- or post-processors.
 */
export interface TextProcessor {
  /**
   * Processes raw code.
   * @param code The original code.
   * @return The new code.
   */
  process(code: string): string
}
