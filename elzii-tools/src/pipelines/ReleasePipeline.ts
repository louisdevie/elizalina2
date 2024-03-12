import { TranslationFile } from '@module/files/translations'
import { OutputTarget } from '../generation'
import { relative } from 'node:path'
import { config, show } from '@module'
import { Translation } from '@module/translations'
import { handleErrors, handleErrorsAsync, throwError } from '@module/error'
import { MessageParametersCheck, MissingTranslationsCheck } from '@module/checks/translations'
import { MultiCheck } from '@module/checks'

type LoadAndCheckResult =
  | { loaded: false }
  | {
      loaded: true
      translation: Translation
      source: TranslationFile
      passedAllChecks: boolean
    }

export default class ReleasePipeline {
  private readonly _sourceFiles: TranslationFile[]
  private readonly _missingCheck: MissingTranslationsCheck
  private readonly _parametersCheck: MessageParametersCheck
  private readonly _allChecks: MultiCheck<Translation>
  private readonly _outputTarget: OutputTarget

  public constructor(sourceFiles: TranslationFile[], outputTarget: OutputTarget) {
    this._sourceFiles = sourceFiles

    this._missingCheck = new MissingTranslationsCheck()
    this._parametersCheck = new MessageParametersCheck()
    this._allChecks = new MultiCheck(this._missingCheck, this._parametersCheck)

    this._outputTarget = outputTarget
  }

  public async execute(): Promise<void> {
    const allTranslations = await Promise.all(this._sourceFiles.map(this.loadAndCheck.bind(this)))

    if (!this._allChecks.isValidGlobally)
      throwError('Some checks failed (see above), aborting compilation.', 'checks')

    await this._outputTarget.init({
      missing: this._missingCheck.getReport(),
      parameters: this._parametersCheck.getReport(),
    })
    await Promise.all(allTranslations.map(this.compile.bind(this)))

    await this._outputTarget.finish()
  }

  private async loadAndCheck(source: TranslationFile): Promise<LoadAndCheckResult> {
    return handleErrorsAsync<LoadAndCheckResult>(
      async () => {
        const translation = await source.read()
        this._allChecks.validate(translation)
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
