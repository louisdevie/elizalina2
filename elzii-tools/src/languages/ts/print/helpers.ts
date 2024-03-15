import { Indentation, PrintedCode } from '@module/printing'
import { TSVisitor } from '@module/languages/ts'

const defaultIndentation: Indentation = { char: ' ', size: 2 }

export function escapeSingleQuotedString(string: string): string {
  return escapeAnyString(string).replace(/'/g, "\\'")
}

export function escapeDoubleQuotedString(string: string): string {
  return escapeAnyString(string).replace(/"/g, '\\"')
}

export function escapeTemplateString(string: string): string {
  return escapeAnyString(string).replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

const escapeSequences = new Map([
  ['\\', '\\\\'],
  ['\0', '\\0'],
  ['\n', '\\n'],
  ['\r', '\\r'],
  ['\v', '\\v'],
  ['\t', '\\t'],
  ['\b', '\\b'],
  ['\f', '\\f'],
])

function escapeAnyString(string: string): string {
  return string.replace(/[\\\0\n\r\v\t\b\f]/g, (char) => escapeSequences.get(char) ?? char)
}

export function wrapInBlock(content: PrintedCode): PrintedCode {
  let result

  if (content.lineCount === 0) {
    result = new PrintedCode('{ }')
  } else {
    content.indent(defaultIndentation)
    content.prepend(new PrintedCode('{'))
    content.append(new PrintedCode('}'))
    result = content
  }

  return result
}

export type Visitor = TSVisitor<PrintedCode>
