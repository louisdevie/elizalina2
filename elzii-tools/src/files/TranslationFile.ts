import { Translation } from '@module/translations'
import fs from 'node:fs'
import { defaultEtrParser } from '../etrFormat'

export default class TranslationFile {
  private _path: string

  public constructor(path: string) {
    this._path = path
  }

  async load(): Promise<Translation> {
    let contents = await fs.promises.readFile(this._path, {
      encoding: 'utf-8',
      flag: fs.constants.O_RDONLY,
    })
    return await defaultEtrParser.parse(contents)
  }
}
