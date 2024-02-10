#!/usr/bin/env node

import yargs from 'yargs'
import { show, config, version } from '@module'
import { intoPromise, noColorEnv, doNothing } from '@module/helpers'
import { handleErrorsAsync } from '@module/error'
import { TranslationsDirectory } from '@module/files'
import { TargetConfig } from '@module/config'

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

  const availableTargets = config.requireTargets()
  const selectedTargets = argv._.length > 0 ? argv._ : availableTargets.allTargets

  for (const targetName in selectedTargets) {
    if (availableTargets.allTargets.includes(targetName)) {
      console.log(`Generating the ${targetName} target...`)
      generateTarget(availableTargets.target(targetName))
    }
  }
}

function generateTarget(target: TargetConfig) {
  let translationFiles = loadTranslationFiles(target.translations)
}

async function* loadTranslationFiles(directory: string) {
  let translations = new TranslationsDirectory(directory)

  for (const file of await translations.listFiles()) {
    yield file.load()
  }
}

handleErrorsAsync(main, { all: (err) => show.fatal(err) }).then(doNothing)
