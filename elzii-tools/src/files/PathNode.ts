import { join } from 'node:path'
import { throwError } from '@module/error'
import { PathElement } from '.'

/**
 * A node in a file tree.
 */
export default abstract class PathNode implements PathElement {
  private _parent?: PathElement
  private readonly _name: string

  public get name(): string {
    return this._name
  }

  public get path(): string {
    return join(this.requireParent().path, this._name)
  }

  public get parent(): PathElement | undefined {
    return this._parent
  }

  public get attached(): boolean {
    return this._parent?.attached ?? false
  }

  protected constructor(name: string) {
    this._parent = undefined
    this._name = name
  }

  public abstract resolve(): Promise<void>

  /**
   * Gets the parent of this node and throws an errors if there is none.
   * @protected
   */
  protected requireParent(): PathElement {
    if (this._parent === undefined) throwError('This element is not part of a tree.', 'internal')
    return this._parent
  }

  /**
   * Attach this node to an existing tree.
   * @param parent The node to attach it to.
   */
  public attachToTree(parent: PathElement) {
    if (this._parent !== undefined)
      throwError('This element is already part of a tree.', 'internal')
    this._parent = parent
  }
}
