package cli

import (
	"fmt"
	"os"
	"runtime"
	"strings"
	"sync"

	"github.com/louisdevie/elizalina2/internal/wrap"
)

type Printer struct {
	mutex     sync.Mutex
	Program   string
	Debugging bool
	Color     bool
}

func (printer *Printer) Debug(v ...any) {
	if printer.Debugging {
		printer.mutex.Lock()
		fmt.Fprint(os.Stdout, "dbg ")
		_, file, line, ok := runtime.Caller(2)
		if ok {
			lastSegment := strings.LastIndex(file, "/") + 1
			fmt.Fprint(os.Stdout, "@ ", file[lastSegment:], ":", line, " ")
		}
		fmt.Fprintln(os.Stdout, v...)
		printer.mutex.Unlock()
	}
}

func fprintIndented(f *os.File, maxWidth int, indent int, value any) {
	wrapped := wrap.Indents(indent, wrap.Wrap(fmt.Sprint(value), maxWidth-indent))
	for _, line := range wrapped {
		fmt.Fprintln(f, line)
	}
}

func (printer *Printer) printErrorMessage(msg string, details ...error) {
	termInfo := GetStderrInfo()
	if termInfo.SupportsColor && printer.Color {
		errorStyle(os.Stderr)
	}

	fmt.Fprintln(os.Stderr, "Error:", msg)
	for _, detail := range details {
		fprintIndented(os.Stderr, termInfo.Width, 3, detail)
	}

	if termInfo.SupportsColor && printer.Color {
		resetStyle(os.Stderr)
	}
}

func (printer *Printer) Error(msg string, details ...error) {
	printer.mutex.Lock()
	printer.printErrorMessage(msg, details...)
	printer.mutex.Unlock()
}

func (printer *Printer) Fatal(msg string, reason ExitReason, details ...error) {
	printer.mutex.Lock()
	printer.printErrorMessage(msg, details...)
	if reason == BadUsage {
		fmt.Fprintf(os.Stdout, "run '%s --help' for usage\n", printer.Program)
	}
	os.Exit(int(reason))
}

var defaultPrinter Printer

func DefaultPrinter() *Printer {
	return &defaultPrinter
}

func Debug(v ...any) {
	defaultPrinter.Debug(v...)
}

func Error(msg string, details ...error) {
	defaultPrinter.Error(msg, details...)
}

func Fatal(msg string, reason ExitReason, details ...error) {
	defaultPrinter.Fatal(msg, reason, details...)
}

func InvalidArgs(errs ...error) {
	Fatal("invalid command-line arguments", BadUsage, errs...)
}

func Show(msg string) {
	termInfo := GetStdoutInfo()
	wrapped := wrap.Wrap(msg, termInfo.Width)
	for _, line := range wrapped {
		fmt.Println(line)
	}
}

func ShowUsage(explanation string, examples ...string) {
	fmt.Print(explanation, "\n\nUsage:\n")
	for _, line := range wrap.Indents(3, examples) {
		fmt.Println(line)
	}
}

func DescribeOption(name string, description string) {
	name = "   " + name + "  "
	termInfo := GetStdoutInfo()
	wrapped := wrap.Indentfs(name, len(name), wrap.Wrap(description, termInfo.Width-len(name)))
	for _, line := range wrapped {
		fmt.Println(line)
	}
}
