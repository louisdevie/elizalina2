export class PrintedCode {
  private _lines: string[]

  public constructor(...lines: string[]) {
    this._lines = lines
  }

  public static join(blocks: PrintedCode[]): PrintedCode {
    return new PrintedCode(...blocks.flatMap((block) => block._lines))
  }

  public toString(): string {
    return this._lines.join('\n')
  }

  public indent(indentation: Indentation, depth: number) {
    const padding = indentation.char.repeat(indentation.size * depth)
    this._lines = this._lines.map((line) => padding + line)
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
