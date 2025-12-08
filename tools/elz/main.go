package main

import (
	"github.com/louisdevie/elizalina2/internal/cli"
)

func main() {
	args := cli.ParseArgs()

	if args.HelpFlag() {
		dispatchCmd(args, true)
		cli.ShortCircuit()
	}
	version, err := args.BoolFlag("version", "v", true)
	if err != nil {
		cli.InvalidArgs(err)
	}
	if version {
		showVersion()
		cli.ShortCircuit()
	}

	debugging, err := args.BoolFlag("debug", "", true)
	if err != nil {
		cli.InvalidArgs(err)
	}
	color, err := args.BoolFlag("no-color", "", false)
	if err != nil {
		cli.InvalidArgs(err)
	}

	dp := cli.DefaultPrinter()
	dp.Debugging = debugging
	dp.Color = color
	dp.Program = "elz"
	cli.Debug("running tool elz version", elzVersion)

	dispatchCmd(args, false)
}

func dispatchCmd(args cli.Args, justShowHelp bool) {
	command := args.Command()
	switch command {
	case "init":
		if justShowHelp {
			showInitHelp()
		} else {
			cmdInit(args)
		}
	case "locale", "locales":
		if justShowHelp {
			showLocaleHelp()
		} else {
			cmdLocale(args)
		}
	case "prefix", "prefixes":
		if justShowHelp {
			showPrefixHelp()
		} else {
			cmdPrefix(args)
		}
	case "message", "messages", "msg":
		if justShowHelp {
			showMessageHelp()
		} else {
			cmdMessage(args)
		}
	case "update", "u":
		if justShowHelp {
			showUpdateHelp()
		} else {
			cmdUpdate(args)
		}
	case "release", "r":
		if justShowHelp {
			showReleaseHelp()
		} else {
			cmdRelease(args)
		}
	case "format", "fmt":
		if justShowHelp {
			showFormatHelp()
		} else {
			cmdFormat(args)
		}
	case "":
		showHelp()
	default:
		cli.Fatal("unknown command \""+command+"\"", cli.BadUsage)
	}
}

func showHelp() {
	cli.ShowUsage(
		"Elz is a tool for managing Elizalina translations.",
		"elz <command> [arguments]",
	)
	cli.Show("\nAvailable commands:")
	cli.DescribeOption("init   ", "Initialise a new project")
	cli.DescribeOption("locale ", "List or update target languages")
	cli.DescribeOption("prefix ", "Place translated messages into separate files")
	cli.DescribeOption("message", "Update translated messages manually")
	cli.DescribeOption("update ", "Update translated messages automatically")
	cli.DescribeOption("release", "Transform translations into source code")
	cli.DescribeOption("format ", "Format translation files")
	showGlobalOptions()
}

func showGlobalOptions() {
	cli.Show("\nGlobal options:")
	cli.DescribeOption("-h, --help   ", "Show command usage and exit. Run 'elz --help <command>' to get help for a specific command.")
	cli.DescribeOption("--no-color   ", "Disable colored output. This option can also be set via the NO_COLOR environment variable.")
	cli.DescribeOption("-v, --version", "Print the tool version and exit.")
}

func showVersion() {
	cli.Show(elzVersion)
}
