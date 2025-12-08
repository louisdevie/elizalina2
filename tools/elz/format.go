package main

import (
	"github.com/louisdevie/elizalina2/internal/cli"
)

func cmdFormat(arg cli.Args) {
	cli.Fatal("Command \"format\" not implemented", cli.InternalError)
}

func showFormatHelp() {
	cli.ShowUsage(
		"Elz format enforces the project's format rules in translation files.",
		"elz format --check [<file> ...]",
		"elz format [--write] [<file> ...]",
	)
	cli.Show("\nAlias: format, fmt")
	cli.Show("\nIf no files are specified, all translations files in the project will be formatted. " +
		"A single dash \"-\" can be used to read from the standard input instead.")
	cli.Show("\nOptions:")
	cli.DescribeOption("-L, --locale <loc>", "Target only files with this locale (can be specified multiple times).")
	cli.DescribeOption("-P, --prefix <pre>", "Target only files with this prefix (can be specified multiple times).")
	cli.DescribeOption("--check           ",
		"Assert that all files are properly formatted, or fails with a summary of the files to reformat.")
	cli.DescribeOption("--write           ", "Rewrite the files in place instead of printing to the standard ouput.")
	showGlobalOptions()
}