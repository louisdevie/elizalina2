import { isAbsolute, normalize } from 'node:path'
import { throwError } from '@module/error'
import { PathElement, PathNode } from '.'

/**
 * A part of the filesystem tree.
 *
 * @template R the type of the root element.
 */
export default class FileTree<R extends PathNode> implements PathElement {
  private readonly _rootPath: string
  private readonly _rootElement: R

  public get path(): string {
    return this._rootPath
  }

  public readonly attached = true

  /**
   * The root element of this tree.
   */
  public get root(): R {
    return this._rootElement
  }

  public constructor(rootPath: string, rootElement: R) {
    if (!isAbsolute(rootPath)) throwError('The path of the root must be absolute.', 'internal')
    this._rootPath = normalize(rootPath)
    this._rootElement = rootElement
    this._rootElement.attachToTree(this)
  }

  public resolve(): Promise<void> {
    return this._rootElement.resolve()
  }
}
