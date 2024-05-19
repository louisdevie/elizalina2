import { ExtractedTranslation, TranslationsExtractor } from '@module/extraction'
import { TranslationFile, TranslationsDirectory } from '@module/files/translations'
import { Translation } from '@module/model'
import { parse as parsePath } from 'path'
import TranslationBuilder from '@module/extraction/translationFiles/TranslationBuilder'
import { config, show } from '@module'
import { ErrorCounter, Humanize, ShowProgress } from '@module/show'
import { relative } from 'node:path'
import { throwError } from '@module/error'

export default class TranslationsDirectoryExtractor implements TranslationsExtractor {
  private readonly _show: ShowProgress
  private _directory: TranslationsDirectory
  private _errorCounter?: ErrorCounter

  public constructor(directory: TranslationsDirectory) {
    this._show = new ShowProgress('TM')
    this._directory = directory
  }

  public begin(): ExtractedTranslation[] {
    this._show.progress(
      `Reading translations from ${relative(config.requireCurrentPackageRoot(), this._directory.path)}...`,
    )
    this._errorCounter = show.startErrorCounter()
    return this._directory.children.map(this.extractFromFile, this)
  }

  public finish(): void {
    let errors = 0,
      warnings = 0
    if (this._errorCounter) {
      show.stopErrorCounter(this._errorCounter)
      errors = this._errorCounter.errors
      warnings = this._errorCounter.warnings
    }

    const message =
      `Found ${errors} ${Humanize.plural(errors, 'error')} ` +
      `and ${warnings} ${Humanize.plural(warnings, 'warning')}`
    if (errors > 0) {
      this._show.failure(message)
    } else {
      this._show.success(message)
    }
  }

  private extractFromFile(file: TranslationFile): ExtractedTranslation {
    return {
      translation: this.parseAndExtract(file),
      mainSource: file,
      sources: [file],
    }
  }

  private async parseAndExtract(file: TranslationFile): Promise<Translation> {
    const ast = await file.read()
    const id = parsePath(file.path).name
    const builder = new TranslationBuilder(id)
    show.debugInfo(`Visiting AST of ${file.path}...`)
    builder.visit(ast)
    const { value: translation, errors } = builder.finish()
    show.report(errors)
    show.debugInfo(`   done`)
    if (errors.list.length > 0) throwError('', 'abort')
    return translation
  }
}
