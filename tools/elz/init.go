package main

import (
	"github.com/louisdevie/elizalina2/internal/cli"
)

func cmdInit(args cli.Args) {
	cli.DefaultPrinter().Program = "elz init"
	args.Done()

	
}

func showInitHelp() {
	cli.ShowUsage(
		"Elz init is an interactive tool that helps you set up Elizalina inside a project.",
		"elz init",
	)
	showGlobalOptions()
}
