import { TranslationFile } from '@module/files/translations'
import { Translation } from '@module/translations'
import { Check, defaultTranslationChecks } from '@module/checks'
import { OutputTarget } from '../codeGeneration'

export default class ReleasePipeline {
  private sourceFiles: TranslationFile[]
  private checks: Check<Translation>
  private outputTarget: OutputTarget

  public constructor(options: {
    sourceFiles: TranslationFile[]
    checks?: Check<Translation>
    outputTarget: OutputTarget
  }) {
    this.sourceFiles = options.sourceFiles
    this.checks = options.checks ?? defaultTranslationChecks()
    this.outputTarget = options.outputTarget
  }

  public async execute(): Promise<void> {
    await Promise.all(this.sourceFiles.map(this.processTranslation))
    await this.outputTarget.finish()
  }

  private async processTranslation(source: TranslationFile) {
    const translation = await source.read()

    if (this.checks.validate(translation)) {
      await this.outputTarget.compile(translation)
    }
  }
}
