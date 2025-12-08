//go:build linux
// +build linux

package cli

/* The code in this file comes from the "github.com/evanw/esbuild/internal/logger" package.

   MIT License

   Copyright (c) 2020 Evan Wallace

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
*/

import (
	"os"

	"golang.org/x/sys/unix"
)

const SupportsColorEscapes = true

func GetTerminalInfo(file *os.File) (info TerminalInfo) {
	fd := file.Fd()

	// Is this file descriptor a terminal?
	if _, err := unix.IoctlGetTermios(int(fd), unix.TCGETS); err == nil {
		info.IsTTY = true
		info.SupportsColor = true

		// Get the width of the window
		if w, err := unix.IoctlGetWinsize(int(fd), unix.TIOCGWINSZ); err == nil {
			info.Width = int(w.Col)
		}
	}

	return
}

func errorStyle(f *os.File) {
   f.WriteString("\x1b[91m")
}

func resetStyle(f *os.File) {
   f.WriteString("\x1b[0m")
}
