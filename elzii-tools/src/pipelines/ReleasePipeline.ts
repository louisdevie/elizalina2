import { TranslationFile } from '@module/files/translations'
import { OutputTarget } from '../codeGeneration'
import { relative } from 'node:path'
import { config, show } from '@module'
import { Translation } from '@module/translations'
import { handleErrors, handleErrorsAsync, throwError } from '@module/error'
import { MissingTranslationsCheck } from '@module/checks/translations'

type LoadAndCheckResult =
  | { loaded: false }
  | {
      loaded: true
      translation: Translation
      source: TranslationFile
      passedAllChecks: boolean
    }

export default class ReleasePipeline {
  private _sourceFiles: TranslationFile[]
  private _missingCheck: MissingTranslationsCheck
  private _outputTarget: OutputTarget

  public constructor(sourceFiles: TranslationFile[], outputTarget: OutputTarget) {
    this._sourceFiles = sourceFiles
    this._missingCheck = new MissingTranslationsCheck()
    this._outputTarget = outputTarget
  }

  public async execute(): Promise<void> {
    const allTranslations = await Promise.all(this._sourceFiles.map(this.loadAndCheck.bind(this)))

    await this._outputTarget.init({ missing: this._missingCheck.getReport() })
    await Promise.all(allTranslations.map(this.compile.bind(this)))
    await this._outputTarget.finish()
  }

  private async loadAndCheck(source: TranslationFile): Promise<LoadAndCheckResult> {
    return handleErrorsAsync<LoadAndCheckResult>(
      async () => {
        const translation = await source.read()
        this._missingCheck.validate(translation)
        return { loaded: true, source, translation, passedAllChecks: true }
      },
      {
        all: (err) => {
          show.error(`Unhandled error when loading translation: ${err}`)
          return { loaded: false }
        },
      },
    )
  }

  private async compile(result: LoadAndCheckResult) {
    if (result.loaded && result.passedAllChecks) {
      await this._outputTarget.compile(
        result.translation,
        relative(config.requireCurrentPackageRoot(), result.source.path),
      )
    }
  }
}
