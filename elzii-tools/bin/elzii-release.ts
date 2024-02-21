#!/usr/bin/env node

import yargs from 'yargs'
import { show, config, version } from '@module'
import { intoPromise, noColorEnv, doNothing } from '@module/helpers'
import { handleErrorsAsync } from '@module/error'
import { resolveInPackage } from '@module/files'
import { TargetConfig } from '@module/config'
import { getTranslationFiles, TranslationFile } from '@module/files/translations'
import { makeOutputTarget } from '../src/codeGeneration'
import { ReleasePipeline } from '@module/pipelines'

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
  const selectedTargets =
    argv._.length > 0 ? argv._.map((arg) => arg.toString()) : availableTargets.allTargets

  if (selectedTargets.length == 0) {
    show.detailedWarning('No targets were found, you may need to fix your configuration file.')
  }

  for (const targetName of selectedTargets) {
    if (availableTargets.allTargets.includes(targetName)) {
      show.debugInfo(`Generating the ${targetName} target...`)
      await generateTarget(availableTargets.getTarget(targetName))
    } else {
      show.detailedError(`Target '${targetName}' does not exists.`)
    }
  }
}

async function generateTarget(target: TargetConfig) {
  const sourceFiles = await getTranslations(target.translations)
  const outputTarget = makeOutputTarget(target.output, target)
  const pipeline = new ReleasePipeline({ sourceFiles, outputTarget })

  await pipeline.execute()
}

async function getTranslations(directory: string): Promise<TranslationFile[]> {
  const fullTranslationsPath = resolveInPackage(directory)
  show.debugInfo(`Looking up translations in ${fullTranslationsPath}`)

  const translations = await getTranslationFiles(fullTranslationsPath)

  return translations.root.children
}

handleErrorsAsync(main, { all: (err) => show.fatal(err) }).then(doNothing)
