import { ExtractedTranslation, TranslationsExtractor } from '@module/extraction'
import { TranslationFile, TranslationsDirectory } from '@module/files/translations'
import { Translation } from '@module/translations'
import { parse as parsePath } from 'path'
import TranslationBuilder from '@module/extraction/translationFiles/TranslationBuilder'

export default class TranslationsDirectoryExtractor implements TranslationsExtractor {
  private _directory: TranslationsDirectory

  public constructor(directory: TranslationsDirectory) {
    this._directory = directory
  }

  public get foundTranslations(): ExtractedTranslation[] {
    return this._directory.children.map(this.extractFromFile, this)
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
    const builder = new TranslationBuilder()
    builder.visit(ast)
    const { value: translation, errors } = builder.finish()
    translation.id = parsePath(file.path).name
    return translation
  }
}
