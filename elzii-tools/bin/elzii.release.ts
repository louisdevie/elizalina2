#!/usr/bin/env node

import { ArgumentsCamelCase, Argv, CommandModule } from 'yargs'
import { show, config, version } from '@module'
import { resolveInPackage } from '@module/files'
import { TargetConfig } from '@module/config'
import { getTranslationFiles } from '@module/files/translations'
import { ReleasePipeline } from '@module/pipelines'
import { defaultOutputTargetBuilder } from '@module/generation'
import chalk from 'chalk'
import { TranslationsExtractor } from '@module/extraction'
import { TranslationsDirectoryExtractor } from '@module/extraction/translationFiles'
import type { GlobalOptions } from './elzii'

interface ReleaseOptions extends GlobalOptions {
  targets: string[] | undefined
}

async function main(argv: ArgumentsCamelCase<ReleaseOptions>): Promise<void> {
  show.debugInfo(`using tool: release`)
  await config.init('elzii release')

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

async function generateTarget(target: TargetConfig): Promise<void> {
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

const command: CommandModule<GlobalOptions, ReleaseOptions> = {
  command: 'release [targets..]',
  describe: 'Compile translation files to javascript',
  handler: main,
}
export default command
