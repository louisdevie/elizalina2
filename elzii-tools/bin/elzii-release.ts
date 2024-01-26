#!/usr/bin/env node

import yargs from 'yargs'
import { show, config, version } from '@module'
import { intoPromise, noColorEnv, doNothing } from '@module/helpers'
import { handleErrorsAsync } from '@module/error'

async function main() {
  let argv = await intoPromise(
    yargs
      .scriptName('elzii-release')
      .usage(
        '$0 [OPTIONS] [TARGETS...]',
        'Compile translation files into javascript or typescript code.',
      )
      .version('elzii-tools v' + version)
      .boolean('debug')
      .boolean('no-color')
      .describe({
        debug: 'Show debugging information.',
        'no-color':
          'Disable colored output. (this option can also be set using the NO_COLOR environment variable)',
      })
      .help().argv,
  )

  if (argv['no-color'] || noColorEnv()) config.disableColor()
  if (argv.debug) config.enableDebugMode()

  show
    .debugInfo(`elzii-release from elzii-tools v${version}`)
    .debugInfo(`command-line options: debug=${argv.debug} no-color=${argv['no-color']}`)

  await config.init()
}

handleErrorsAsync(main, { all: (err) => show.fatal(err) }).then(doNothing)
