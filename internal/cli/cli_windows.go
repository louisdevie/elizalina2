//go:build windows
// +build windows

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
	"syscall"
	"unsafe"
)

const SupportsColorEscapes = true

var kernel32 = syscall.NewLazyDLL("kernel32.dll")
var getConsoleMode = kernel32.NewProc("GetConsoleMode")
var getConsoleScreenBufferInfo = kernel32.NewProc("GetConsoleScreenBufferInfo")

type consoleScreenBufferInfo struct {
	dwSizeX              int16
	dwSizeY              int16
	dwCursorPositionX    int16
	dwCursorPositionY    int16
	wAttributes          uint16
	srWindowLeft         int16
	srWindowTop          int16
	srWindowRight        int16
	srWindowBottom       int16
	dwMaximumWindowSizeX int16
	dwMaximumWindowSizeY int16
}

func GetTerminalInfo(file *os.File) TerminalInfo {
	fd := file.Fd()

	// Is this file descriptor a terminal?
	var unused uint32
	isTTY, _, _ := syscall.SyscallN(getConsoleMode.Addr(), fd, uintptr(unsafe.Pointer(&unused)))

	// Get the width of the window
	var info consoleScreenBufferInfo
	syscall.SyscallN(getConsoleScreenBufferInfo.Addr(), fd, uintptr(unsafe.Pointer(&info)))

	return TerminalInfo{
		IsTTY:           isTTY != 0,
		Width:           int(info.dwSizeX) - 1,
	}
}

func errorStyle(*os.File) { }

func resetStyle(*os.File) { }
