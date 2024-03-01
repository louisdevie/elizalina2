import fs from 'node:fs'
import { handleErrors, handleErrorsAsync, throwError } from '@module/error'
import { PathNode } from '.'

/**
 * A directory containing elements of type E.
 */
export default abstract class Directory<E extends PathNode> extends PathNode {
  private _children: E[]
  private readonly _createIfNotExists: boolean

  public get children(): E[] {
    return this._children
  }

  public constructor(name: string, createIfNotExists: boolean = false) {
    super(name)
    this._children = []
    this._createIfNotExists = createIfNotExists
  }

  public override async resolve(): Promise<void> {
    const stat = await handleErrorsAsync(() => fs.promises.stat(this.path), {
      all: () => undefined,
    })

    if (stat === undefined) {
      if (this._createIfNotExists) {
        await fs.promises.mkdir(this.path, { recursive: true })
      } else {
        throwError(`The directory ${this.path} does not exists.`, 'files')
      }
    } else if (!stat.isDirectory()) {
      throwError(`${this.path} is not a directory.`, 'files')
    }

    const childNames = await fs.promises.readdir(this.path, { withFileTypes: true })
    this._children = []

    for (const child of childNames) {
      let node = null
      if (child.isDirectory()) {
        node = this.createExistingSubdirectory(child.name)
      } else if (child.isFile()) {
        node = this.createExistingFile(child.name)
      }

      if (node !== null) {
        this._children.push(node)
        node.attachToTree(this)
        await node.resolve()
      }
    }
  }

  protected abstract createExistingFile(name: string): E | null

  protected abstract createExistingSubdirectory(name: string): E | null
}
