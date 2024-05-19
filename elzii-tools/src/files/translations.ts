import { Directory, FileExtensions, FileTree } from '@module/files'
import { defaultTMParser } from '../languages/tm'
import { TextFile } from './index'
import { Translation as TMTranslation } from '@module/languages/tm/ast'
import { show } from '@module'

export class TranslationFile extends TextFile<TMTranslation> {
  public readonly readable = true
  public readonly writable = false

  protected override async parseContents(contents: string): Promise<TMTranslation> {
    show.debugInfo(`Parsing translation file ${this.path}`)
    return await defaultTMParser.parse(contents)
  }
}

export class TranslationsDirectory extends Directory<TranslationFile> {
  protected override createExistingFile(name: string): TranslationFile | null {
    return name.endsWith(FileExtensions.Translation) ? new TranslationFile(name) : null
  }

  protected override createExistingSubdirectory(_: string): TranslationFile | null {
    return null // ignore all subdirectories
  }
}

export async function getTranslationFiles(path: string): Promise<FileTree<TranslationsDirectory>> {
  const tree = new FileTree(path, new TranslationsDirectory(''))
  await tree.resolve()
  return tree
}
