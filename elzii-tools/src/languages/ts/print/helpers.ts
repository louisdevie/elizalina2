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

function printListInline(start: string, items: PrintedCode[], stop: string): PrintedCode {
  return new PrintedCode(start + items.join(', ') + stop)
}

function printListBlock(start: string, items: PrintedCode[], stop: string): PrintedCode {
  for (const item of items) {
    item.appendInline(new PrintedCode(','))
  }

  const content = PrintedCode.join(items)
  content.indent(defaultIndentation)
  content.prepend(new PrintedCode(start))
  content.append(new PrintedCode(stop))

  return content
}

const MAX_LIST_PRINT_WIDTH = 60

export type ListFormat = 'auto' | 'inline' | 'block'

export function printList(
  start: string,
  items: PrintedCode[],
  stop: string,
  format: ListFormat,
): PrintedCode {
  const containsAMultiLineItem = items.some((item) => item.lineCount > 1)
  const totalItemsWidth = items
    .map((elt) => elt.firstLineLength)
    .reduce((sum, eltLength) => sum + eltLength, 0)
  const wouldBeTooLongInline = totalItemsWidth > MAX_LIST_PRINT_WIDTH

  if (format === 'auto') {
    if (containsAMultiLineItem || wouldBeTooLongInline) {
      format = 'block'
    } else {
      format = 'inline'
    }
  }

  let result
  if (format === 'block') {
    result = printListBlock(start, items, stop)
  } else {
    result = printListInline(start, items, stop)
  }
  return result
}

export interface Visitor extends TSVisitor<PrintedCode> {
  lineBreaksAllowed: boolean
  allowLineBreaks(): void
  disallowLineBreaks(): void
}
