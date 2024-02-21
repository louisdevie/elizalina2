import fs from 'node:fs'
import { throwError } from '@module/error'
import { PathNode } from '.'

/**
 * A directory containing elements of type E.
 */
export default abstract class Directory<E extends PathNode> extends PathNode {
  private _children: E[]

  public get children(): E[] {
    return this._children
  }

  public constructor(name: string) {
    super(name)
    this._children = []
  }

  public override async resolve(): Promise<void> {
    let stat = await fs.promises.stat(this.path)
    if (!stat.isDirectory()) throwError(`The directory ${this.path} does not exists.`, 'files')

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
