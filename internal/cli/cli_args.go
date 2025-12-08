package cli

import (
	"fmt"
	"os"
	"strings"
	"unicode/utf8"
)

// A parsed command-line argument.
type Argument struct {
	name         string
	suffix       string
	value        string
	isFlag       bool
	mayBeCommand bool
	hasValue     bool
	wasUsed      bool
	err          error
}

// Turn an argument into an Argument struct.
func parseArgument(arg string, into Args, acceptFlags bool) Args {
	return append(into, Argument{value: arg, mayBeCommand: acceptFlags})
}

// Parse a "long" flag such as --name.
func parseLongFlag(arg string, into Args) Args {
	var (
		flag      = Argument{isFlag: true}
		name      string
		hasSuffix bool
	)

	name, flag.value, flag.hasValue = strings.Cut(arg[2:], "=")
	flag.name, flag.suffix, hasSuffix = strings.Cut(name, ":")

	if len(flag.name) == 0 {
		flag.err = fmt.Errorf("Flag \"%s\" has no name", arg)
	}
	if hasSuffix && len(flag.suffix) == 0 {
		flag.err = fmt.Errorf("Flag \"%s\" has a colon in its name but no suffix", arg)
	}

	return append(into, flag)
}

// Parse a "short" flag such as -n.
// -name will be parsed as four boolean flags -n, -a, -m and -e.
func parseShortFlag(arg string, into Args) Args {
	name, value, hasValue := strings.Cut(arg[1:], "=")
	prefix, suffix, hasSuffix := strings.Cut(name, ":")
	prefixes := strings.Split(prefix, "")

	if len(prefixes) == 0 {
		flag := Argument{
			isFlag: true, name: prefix, suffix: suffix, hasValue: hasValue, value: value,
			err: fmt.Errorf("Flag \"%s\" has no name", arg),
		}
		return append(into, flag)
	}

	for i, p := range prefixes {
		flag := Argument{isFlag: true, name: p}
		if i == len(prefixes)-1 {
			flag.suffix = suffix
			flag.hasValue = hasValue
			flag.value = value
			if hasSuffix && len(suffix) == 0 {
				flag.err = fmt.Errorf("Flag group \"%s\" contains a colon but no suffix", arg)
			}
		}
		into = append(into, flag)
	}

	return into
}

type Args []Argument

// Parse all command-line arguments from os.Args.
func ParseArgs() (arglist Args) {
	var acceptFlags bool = true

	for i, arg := range os.Args {
		if i == 0 {
			// skip program name
			continue
		}

		if acceptFlags && strings.HasPrefix(arg, "--") {
			if len(arg) > 2 {
				arglist = parseLongFlag(arg, arglist)
			} else {
				// everything after the first double dash "--" is an argument
				acceptFlags = false
			}
		} else if acceptFlags && strings.HasPrefix(arg, "-") {
			if len(arg) > 1 {
				arglist = parseShortFlag(arg, arglist)
			} else {
				// a single dash "-" has no special meaning
				arglist = parseArgument(arg, arglist, false)
			}
		} else {
			arglist = parseArgument(arg, arglist, acceptFlags)
		}
	}

	return arglist
}

// Print an Argument as a flag.
func sprintFlag(flag Argument) string {
	if utf8.RuneCountInString(flag.name) < 2 {
		return fmt.Sprintf("\"-%s\"", flag.name)
	} else {
		return fmt.Sprintf("\"--%s\"", flag.name)
	}
}

// Print a flag given its long and short form.
func sprintFlagName(name string, shorthand string) string {
	if shorthand == "" {
		return fmt.Sprintf("\"--%s\"", name)
	} else {
		return fmt.Sprintf("\"-%s\" or \"--%s\"", shorthand, name)
	}
}

// Return the flag named [name] or [shorthand], or <nil> if none if found.
// Fails if more than one flag is found.
func (args *Args) findSingleFlag(name string, shorthand string) (*Argument, error) {
	var (
		found *Argument
		err   error
	)
	for i := range *args {
		arg := &(*args)[i]
		if !arg.wasUsed && arg.isFlag && (arg.name == name || arg.name == shorthand) {
			if found == nil {
				found = arg
			} else {
				err = fmt.Errorf("Flag %s can only be used once", sprintFlagName(name, shorthand))
			}
			arg.wasUsed = true
		}
	}
	return found, err
}

// Return wether an argument is considered a help flag. -h, --help and windows-style /? are accepted.
func (arg *Argument) isHelpFlag() bool {
	if arg.isFlag {
		return arg.name == "h" || arg.name == "help"
	} else if arg.mayBeCommand {
		return arg.value == "/?"
	} else {
		return false
	}
}

// Return wether a help flag is present in [args].
func (args *Args) HelpFlag() bool {
	var (
		result bool = false
	)
	for _, arg := range *args {
		if !arg.wasUsed && arg.isHelpFlag() {
			arg.wasUsed = true
			result = true
		}
	}

	return result
}

// Read a boolean flag. The return value will be [value] if the flag is set. 
func (args *Args) BoolFlag(name string, shorthand string, value bool) (bool, error) {
	var result bool = !value
	flag, err := args.findSingleFlag(name, shorthand)

	if flag != nil {
		if flag.suffix != "" {
			err = fmt.Errorf("Flag %s cannot have a suffix", sprintFlagName(name, shorthand))
		} else if flag.hasValue {
			err = fmt.Errorf("Flag %s cannot have a value", sprintFlagName(name, shorthand))
		} else {
			result = value
		}
	}

	return result, err
}

// Read the next argument as a command.
func (args *Args) Command() (cmd string) {
	for i := range *args {
		arg := &(*args)[i]
		if !arg.wasUsed && arg.mayBeCommand {
			cmd = arg.value
			arg.wasUsed = true
			break
		}
	}

	return cmd
}

// Verify that all arguments have been used. 
func (args *Args) Done() {
	var errs []error
	for _, arg := range *args {
		if !arg.wasUsed {
			if arg.isFlag {
				errs = append(errs, fmt.Errorf("Unexpected flag %s", sprintFlag(arg)))
			} else {
				errs = append(errs, fmt.Errorf("Unexpected argument \"%s\"", arg.value))
			}
		} else if arg.err != nil {
			errs = append(errs, arg.err)
		}
	}
	if errs != nil {
		InvalidArgs(errs...)
	}
}
