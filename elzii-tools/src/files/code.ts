import { Directory, FileExtensions, FileTree } from '@module/files'
import { TextFile } from './index'
import { Program as TSProgram } from '@module/languages/ts/ast'
import { TSPrinter, getTSPrinter } from '@module/languages/ts'

export class TypeScriptFile extends TextFile<TSProgram> {
  private readonly _printer: TSPrinter

  public readonly readable = false
  public readonly writable = true

  public constructor(name: string, options?: { createNew?: boolean; printer?: TSPrinter }) {
    super(name, options?.createNew)

    this._printer = options?.printer ?? getTSPrinter()
  }

  protected printContents(data: TSProgram): Promise<string> {
    return this._printer.print(data)
  }
}

export type AnyCodeFile = TypeScriptFile

export class TypeScriptOutputDirectory extends Directory<TypeScriptFile> {
  constructor(name: string) {
    super(name, true)
  }

  protected override createExistingFile(name: string): TypeScriptFile | null {
    return name.endsWith(FileExtensions.TypeScript) ? new TypeScriptFile(name) : null
  }

  protected override createExistingSubdirectory(name: string): TypeScriptFile | null {
    return null // ignore all subdirectories
  }

  public createNewFile(name: string, printer?: TSPrinter): TypeScriptFile {
    const existing = this.children.findIndex((file) => file.name === name)
    const file = new TypeScriptFile(name, { createNew: true, printer })
    if (existing === -1) {
      this.children.push(file)
    } else {
      this.children[existing] = file
    }
    file.attachToTree(this)
    return file
  }

  public async cleanUp(filesToKeep: string[]) {
    for (const file of this.children) {
      if (!filesToKeep.includes(file.name)) {
        await file.remove()
        this.children.splice(this.children.indexOf(file), 1)
      }
    }
  }
}

export async function getTSOutputDirectory(
  path: string,
): Promise<FileTree<TypeScriptOutputDirectory>> {
  const tree = new FileTree(path, new TypeScriptOutputDirectory(''))
  await tree.resolve()
  return tree
}
