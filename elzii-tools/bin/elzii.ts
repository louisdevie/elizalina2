#!/usr/bin/env node

import yargs, { ArgumentsCamelCase, CommandModule } from 'yargs'
import { config, show, version } from '@module'
import { doNothing, intoPromise, noColorEnv } from '@module/helpers'
import ReleaseCommand from './elzii.release'
import { handleErrorsAsync } from '@module/error'

export interface GlobalOptions {
  debug: boolean | undefined
  'no-color': boolean | undefined
}

async function main(): Promise<void> {
  const argv = await intoPromise(
    yargs
      .scriptName('elzii')
      .usage('$0 <command> [OPTIONS]')
      .version('elzii tools v' + version)
      .boolean('debug')
      .boolean('no-color')
      .describe({
        debug: 'Show debugging information.',
        'no-color':
          'Disable colored output. (this option can also be set using the NO_COLOR environment variable)',
      })
      .help()
      .command(wrap(ReleaseCommand))
      .strict()
      .showHelpOnFail(true)
      .demandCommand(1, '').argv,
  )
}

function wrap<U>(commandModule: CommandModule<GlobalOptions, U>): CommandModule<GlobalOptions, U> {
  const originalHandler = commandModule.handler

  commandModule.handler = async (argv): Promise<void> => {
    if (argv.noColor || noColorEnv()) config.disableColor()
    if (argv.debug) config.enableDebugMode()

    show
      .debugInfo(`running elzii tools v${version}`)
      .debugInfo(`global command-line options: debug=${argv.debug} no-color=${argv['no-color']}`)

    await handleErrorsAsync(() => intoPromise(originalHandler({ ...argv, _: argv._.slice(1) })), {
      all: (err) => show.fatal(err),
    })
  }
  return commandModule
}

main().then(doNothing)
