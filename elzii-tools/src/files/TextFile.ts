import { PathNode } from '.'
import fs from 'node:fs'
import { throwError } from '@module/error'

export default abstract class TextFile<D> extends PathNode {
  private readonly _shouldExists: boolean

  public constructor(name: string, createNew: boolean = false) {
    super(name)
    this._shouldExists = !createNew
  }

  public async resolve(): Promise<void> {
    if (this._shouldExists) {
      let stat = await fs.promises.stat(this.path)
      if (!stat.isFile()) throwError(`${this.path} is not a file.`, 'files')
    }
  }

  public abstract readable: boolean

  protected parseContents(contents: string): Promise<D> {
    throwError('Missing parseContents implementation', 'internal')
  }

  public abstract writable: boolean

  protected printContents(data: D): Promise<string> {
    throwError('Missing printContents implementation', 'internal')
  }

  public async read(): Promise<D> {
    if (!this.readable) throwError('This type of file is not readable', 'internal')

    let contents = await fs.promises.readFile(this.path, {
      encoding: 'utf-8',
      flag: fs.constants.O_RDONLY,
    })

    return await this.parseContents(contents)
  }

  public async write(data: D): Promise<void> {
    if (!this.writable) throwError('This type of file is not writable', 'internal')

    const contents = await this.printContents(data)

    await fs.promises.writeFile(this.path, contents, {
      encoding: 'utf-8',
    })
  }
}
