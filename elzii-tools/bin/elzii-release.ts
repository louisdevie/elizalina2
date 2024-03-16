#!/usr/bin/env node

import yargs from 'yargs'
import { show, config, version } from '@module'
import { intoPromise, noColorEnv, doNothing } from '@module/helpers'
import { handleErrorsAsync } from '@module/error'
import { resolveInPackage } from '@module/files'
import { TargetConfig } from '@module/config'
import { getTranslationFiles } from '@module/files/translations'
import { ReleasePipeline } from '@module/pipelines'
import { defaultOutputTargetBuilder } from '@module/generation'
import chalk from 'chalk'
import { TranslationsExtractor } from '@module/extraction'
import { TranslationsDirectoryExtractor } from '@module/extraction/translationFiles'

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

  await config.init('elzii-release')

  const availableTargets = config.requireTargets()
  const selectedTargets =
    argv._.length > 0 ? argv._.map((arg) => arg.toString()) : availableTargets.allTargets

  let needToShowTargetNames
  if (selectedTargets.length == 0) {
    show.detailedWarning('No targets were found, you may need to fix your configuration file.')
    needToShowTargetNames = false
  } else {
    needToShowTargetNames = selectedTargets.length > 1 || selectedTargets[0] !== 'default'
  }

  for (const targetName of selectedTargets) {
    if (availableTargets.allTargets.includes(targetName)) {
      show.debugInfo(`Generating the ${targetName} target...`)
      if (needToShowTargetNames) {
        console.log(chalk.bold(`[${targetName}]`))
      }
      await generateTarget(availableTargets.getTarget(targetName))
    } else {
      show.detailedError(`Target '${targetName}' does not exists.`)
    }
  }
}

async function generateTarget(target: TargetConfig) {
  const sourceFiles = await getTranslations(target.translations)

  if (sourceFiles === null) {
    show.detailedWarning('No translation files were found, skipping compilation.')
  } else {
    show.debugInfo('Creating output target(s)...')
    const outputTarget = await defaultOutputTargetBuilder.makeOutputTarget(target.output, target)

    const pipeline = new ReleasePipeline(sourceFiles, outputTarget)

    await pipeline.execute()
  }
}

async function getTranslations(directory: string): Promise<TranslationsExtractor | null> {
  const fullTranslationsPath = resolveInPackage(directory)
  show.debugInfo(`Looking up translations in ${fullTranslationsPath}`)

  const translations = await getTranslationFiles(fullTranslationsPath)

  let extractor
  if (translations.root.children.length == 0) {
    extractor = null // do not create extractor if there are no files
  } else {
    extractor = new TranslationsDirectoryExtractor(translations.root)
  }
  return extractor
}

handleErrorsAsync(main, { all: (err) => show.fatal(err) }).then(doNothing)
