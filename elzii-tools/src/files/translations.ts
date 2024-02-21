import { Directory, FileExtensions, FileTree } from '@module/files'
import { Translation } from '@module/translations'
import { defaultTMParser } from '../languages/tm'
import { TextFile } from './index'
import { parse } from 'node:path'

export class TranslationFile extends TextFile<Translation> {
  public readonly readable = true
  public readonly writable = false

  protected override async parseContents(contents: string): Promise<Translation> {
    const tr = await defaultTMParser.parse(contents)
    tr.id = parse(this.name).name
    return tr
  }
}

export class TranslationsDirectory extends Directory<TranslationFile> {
  protected override createExistingFile(name: string): TranslationFile | null {
    return name.endsWith(FileExtensions.Translation) ? new TranslationFile(name) : null
  }

  protected override createExistingSubdirectory(name: string): TranslationFile | null {
    return null // ignore all subdirectories
  }
}

export async function getTranslationFiles(path: string): Promise<FileTree<TranslationsDirectory>> {
  const tree = new FileTree(path, new TranslationsDirectory(''))
  await tree.resolve()
  return tree
}
