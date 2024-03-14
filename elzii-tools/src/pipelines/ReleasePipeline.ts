import { relative } from 'node:path'
import { config, show } from '@module'
import { Translation } from '@module/translations'
import { ExtractedTranslation, TranslationsExtractor } from '@module/extraction'
import { OutputTarget } from '@module/generation'
import { MultiCheck } from '@module/checks'
import { MessageParametersCheck, MissingTranslationsCheck } from '@module/checks/translations'
import { handleErrorsAsync, throwError } from '@module/error'

type LoadAndCheckResult =
  | { loaded: false }
  | {
      loaded: true
      translation: Translation
      source: string
      passedAllChecks: boolean
    }

export default class ReleasePipeline {
  private readonly _sources: TranslationsExtractor
  private readonly _missingCheck: MissingTranslationsCheck
  private readonly _parametersCheck: MessageParametersCheck
  private readonly _allChecks: MultiCheck<Translation>
  private readonly _outputTarget: OutputTarget

  public constructor(sources: TranslationsExtractor, outputTarget: OutputTarget) {
    this._sources = sources

    this._missingCheck = new MissingTranslationsCheck()
    this._parametersCheck = new MessageParametersCheck()
    this._allChecks = new MultiCheck(this._missingCheck, this._parametersCheck)

    this._outputTarget = outputTarget
  }

  public async execute(): Promise<void> {
    const allTranslations = await Promise.all(
      this._sources.foundTranslations.map(this.loadAndCheck, this),
    )

    if (!this._allChecks.isValidGlobally)
      throwError('Some checks failed (see above), aborting compilation.', 'checks')

    await this._outputTarget.init({
      missing: this._missingCheck.getReport(),
      parameters: this._parametersCheck.getReport(),
    })
    await Promise.all(allTranslations.map(this.compile, this))

    await this._outputTarget.finish()
  }

  private async loadAndCheck(extracted: ExtractedTranslation): Promise<LoadAndCheckResult> {
    return handleErrorsAsync<LoadAndCheckResult>(
      async () => {
        const translation = await extracted.translation
        this._allChecks.validate(translation)
        return {
          loaded: true,
          source: extracted.mainSource.path,
          translation,
          passedAllChecks: true,
        }
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
        relative(config.requireCurrentPackageRoot(), result.source),
      )
    }
  }
}
