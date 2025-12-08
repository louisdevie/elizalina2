// Command-line arguments parsing and formatted console output.
package cli

import (
	"os"
	"sync"
)

// Terminal capabilites.
type TerminalInfo struct {
	IsTTY         bool
	SupportsColor bool
	Width         int
}

// Returns cached TerminalInfo for os.Stdin.
var GetStdinInfo = sync.OnceValue(func() TerminalInfo {
	return GetTerminalInfo(os.Stdin)
})

// Returns cached TerminalInfo for os.Stdout.
var GetStdoutInfo = sync.OnceValue(func() TerminalInfo {
	return GetTerminalInfo(os.Stdout)
})

// Returns cached TerminalInfo for os.Stderr.
var GetStderrInfo = sync.OnceValue(func() TerminalInfo {
	return GetTerminalInfo(os.Stderr)
})

type ExitReason uint8

const (
	UserError     ExitReason = 1
	BadUsage                 = 2
	InternalError            = 3
)

func ShortCircuit() {
	os.Exit(0)
}