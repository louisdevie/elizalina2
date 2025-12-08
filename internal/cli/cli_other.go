//go:build !darwin && !linux && !windows
// +build !darwin,!linux,!windows

package cli

import "os"

func GetTerminalInfo(*os.File) TerminalInfo {
	return TerminalInfo{Width: 80}
}

func errorStyle(*os.File) { }

func resetStyle(*os.File) { }
