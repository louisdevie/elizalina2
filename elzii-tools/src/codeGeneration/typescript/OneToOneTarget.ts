import { TSTarget } from '.'
import { Directory, FileExtensions } from '@module/files'
import { Translation } from '@module/translations'
import { TypeScriptOutputDirectory } from '@module/files/code'
import { ProgramBuilder } from '@module/languages/ts'

export default class OneToOneTarget extends TSTarget {
  private _outputDirectory: TypeScriptOutputDirectory

  public constructor(outputDirectory: TypeScriptOutputDirectory) {
    super()

    this._outputDirectory = outputDirectory
  }

  protected async initThis(): Promise<void> {
    await this._outputDirectory.resolve()
  }

  protected async compileThis(translation: Translation): Promise<void> {
    const file = this._outputDirectory.createNewFile(translation.id + FileExtensions.TypeScript)

    const program = new ProgramBuilder('module')

    await file.write(program.build())
  }

  protected finishThis(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
