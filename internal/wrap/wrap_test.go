package wrap_test

import (
	"testing"

	"github.com/louisdevie/elizalina2/internal/wrap"
)

func assertSameLines(t *testing.T, wrapped []string, expected []string) {
	if len(wrapped) != len(expected) {
		t.Fatalf("Expected %d lines of text but got %d", len(expected), len(wrapped))
	}
	for i, e := range expected {
		if wrapped[i] != e {
			t.Logf("Expected line %d to be \"%s\"", i+1, e)
			t.Logf("              but got \"%s\"", wrapped[i])
			t.FailNow()
		}
	}
}

const text = "Or was it because of the involvement of something from beyond science?"

func TestWrapWide(t *testing.T) {
	wrapped := wrap.Wrap(text, 80)
	expected := []string{"Or was it because of the involvement of something from beyond science?"}
	assertSameLines(t, wrapped, expected)
}

func TestWrapMedium(t *testing.T) {
	wrapped := wrap.Wrap(text, 44)
	expected := []string{"Or was it because of the involvement of", "something from beyond science?"}
	assertSameLines(t, wrapped, expected)
}

func TestWrapNarrow(t *testing.T) {
	wrapped := wrap.Wrap(text, 10)
	expected := []string{"Or was it", "because of", "the involv", "ement of", "something", "from", "beyond", "science?"}
	assertSameLines(t, wrapped, expected)
}

func TestWrapWithoutSpace(t *testing.T) {
	wrapped := wrap.Wrap("Orwasitbecauseoftheinvolvementofsomethingfrombeyondscience?", 10)
	expected := []string{"Orwasitbec", "auseofthei", "nvolvement", "ofsomethin", "gfrombeyon", "dscience?"}
	assertSameLines(t, wrapped, expected)
}

func TestIndent(t *testing.T) {
	lines := []string{"Or was it because of the", "involvement of something", "from beyond science?"}
	indented := wrap.Indent("|  ", lines)
	expected := []string{"|  Or was it because of the", "|  involvement of something", "|  from beyond science?"}
	assertSameLines(t, indented, expected)
}

func TestIndentf(t *testing.T) {
	lines := []string{"Or was it because of the", "involvement of something", "from beyond science?"}
	indented := wrap.Indentf("-> ", "|  ", lines)
	expected := []string{"-> Or was it because of the", "|  involvement of something", "|  from beyond science?"}
	assertSameLines(t, indented, expected)
}

func TestIndents(t *testing.T) {
	lines := []string{"Or was it because of the", "involvement of something", "from beyond science?"}
	indented := wrap.Indents(3, lines)
	expected := []string{"   Or was it because of the", "   involvement of something", "   from beyond science?"}
	assertSameLines(t, indented, expected)
}

func TestIndentfs(t *testing.T) {
	lines := []string{"Or was it because of the", "involvement of something", "from beyond science?"}
	indented := wrap.Indentfs("-> ", 3, lines)
	expected := []string{"-> Or was it because of the", "   involvement of something", "   from beyond science?"}
	assertSameLines(t, indented, expected)
}
