import { TranslationFile } from '.'
import fs from 'node:fs'

export default class TranslationsDirectory {
  private _path: string

  public constructor(path: string) {
    this._path = path
  }

  public async listFiles(): Promise<TranslationFile[]> {
    const files = await fs.promises.readdir(this._path)
    console.log(files)
    return []
  }
}
