package wrap

import (
	"strings"
	"unicode"
	"unicode/utf8"
)

type measuredString struct {
	text        string
	unicodeSize int
}

func (str *measuredString) pushRune(text string, size int) string {
	str.text += text[:size]
	str.unicodeSize++
	return text[size:]
}

func concat(a, b measuredString) measuredString {
	return measuredString{
		text:        a.text + b.text,
		unicodeSize: a.unicodeSize + b.unicodeSize,
	}
}

// Given the space remaining on the current line as minWidth and the maximum line size as maxWidth,
// this function will read the first word and return three values:
// 1) the text that should go at the end of the current line,
// 2) the text that should go on the next line,
// 3) the remaining text that has not been consumed.
func wrapWord(text string, minWidth int, maxWidth int) (measuredString, measuredString, string) {
	var space, prefix, suffix measuredString
	reachedMin := false
	reachedEnd := false
	// read the first word, stopping at the end of the current line
	for !reachedMin && len(text) > 0 {
		rune, size := utf8.DecodeRuneInString(text)
		if unicode.IsSpace(rune) {
			if prefix.unicodeSize == 0 {
				text = space.pushRune(text, size)
			} else {
				reachedMin = true
				reachedEnd = true
			}
		} else {
			if space.unicodeSize+prefix.unicodeSize < minWidth {
				text = prefix.pushRune(text, size)
			} else {
				reachedMin = true
			}
		}
	}
	// does the entire word fit on the current line ?
	if reachedEnd || len(text) == 0 {
		return concat(space, prefix), measuredString{}, text
	}

	// otherwise finish reading the first word
	for !reachedEnd && len(text) > 0 {
		rune, size := utf8.DecodeRuneInString(text)
		if unicode.IsSpace(rune) {
			reachedEnd = true
		} else {
			if prefix.unicodeSize+suffix.unicodeSize < maxWidth {
				text = suffix.pushRune(text, size)
			} else {
				// special case: if the word cannot fit on a single line,
				// we put half the word on the current line and the other half on the next line
				return concat(space, prefix), suffix, text
			}
		}
	}
	// and put the word on the next line
	return measuredString{}, concat(prefix, suffix), text
}

// Break a string into lines of at most [width] runes.
func Wrap(text string, width int) (result []string) {
	var line measuredString
	for len(text) > 0 {
		var cont, next measuredString
		cont, next, text = wrapWord(text, width-line.unicodeSize, width)

		line = concat(line, cont)
		if next.unicodeSize > 0 {
			result = append(result, line.text)
			line = next
		}
	}
	// add any text remaining in the buffer
	return append(result, line.text)
}

// Prefix multiple lines of text with a string.
func Indent(prefix string, lines []string) []string {
	result := make([]string, len(lines))
	for i, line := range lines {
		result[i] = prefix + line
	}
	return result
}

// Prefix multiple lines of text using a different string for the first line.
func Indentf(first string, prefix string, lines []string) []string {
	result := make([]string, len(lines))
	for i, line := range lines {
		if i == 0 {
			result[i] = first + line
		} else {
			result[i] = prefix + line
		}
	}
	return result
}

// Prefix multiple lines of text with a number of spaces.
func Indents(size int, lines []string) []string {
	return Indent(strings.Repeat(" ", size), lines)
}

// Prefix multiple lines of text with a number of spaces,
// but using a different string for the first line.
func Indentfs(first string, size int, lines []string) []string {
	return Indentf(first, strings.Repeat(" ", size), lines)
}
