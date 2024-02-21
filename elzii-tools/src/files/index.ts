import fs from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { config } from '@module'

export { default as PathNode } from './PathNode'
export { default as FileTree } from './FileTree'
export { default as Directory } from './Directory'
export { default as TextFile } from './TextFile'
export { default as FileExtensions } from './FileExtensions'

/**
 * A wrapper around `fs.access` that always return a boolean (`false` when it fails)
 * @param path The path to check for access
 * @param mode The required mode (see file access constants for more information)
 */
export function access(path: fs.PathLike, mode?: number): Promise<boolean> {
  return new Promise<boolean>((resolve, _) => fs.access(path, mode, (err) => resolve(err === null)))
}

/**
 * Tries to resolve a path from the current package root.
 * @param path A relative path
 */
export function resolveInPackage(path: string): string {
  if (!isAbsolute(path)) {
    path = join(config.requireCurrentPackageRoot(), path)
  }
  return path
}

export interface PathElement {
  /**
   * The full path to that node.
   */
  readonly path: string

  /**
   * The parent of that node.
   */
  readonly parent?: PathElement

  /**
   * Whether this node is part of a tree or not.
   */
  readonly attached: boolean

  /**
   * Tries to resolve that element against the actual element in the filesystem.
   */
  resolve(): Promise<void>
}
