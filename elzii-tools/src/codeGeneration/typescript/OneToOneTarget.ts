import { TSTarget } from '.'
import { FileExtensions } from '@module/files'
import { Translation } from '@module/translations'
import { TypeScriptOutputDirectory } from '@module/files/code'
import * as ts from '@module/languages/ts/ast'
import { config } from '@module'
import { toIdentifier } from '@module/languages/js/helpers'
import { AllTranslationReports } from '@module/checks/translations'
import { getTSPrinter } from '@module/languages/ts'

export default class OneToOneTarget extends TSTarget {
  private _outputDirectory: TypeScriptOutputDirectory

  public constructor(
    outputDirectory: TypeScriptOutputDirectory,
    interfaceName: string,
    functionName: string,
  ) {
    super(interfaceName, functionName)

    this._outputDirectory = outputDirectory
  }

  protected override async initThis(reports: AllTranslationReports): Promise<void> {
    await super.initThis(reports)

    await this._outputDirectory.resolve()
  }

  protected async compileThis(translation: Translation, source: string): Promise<void> {
    const className = toIdentifier(translation.id + '_' + this.interfaceName)

    const printerWithPostProcessor = getTSPrinter(this.userCodeInsertion)
    const file = this._outputDirectory.createNewFile(className + FileExtensions.TypeScript)

    const program = ts.program('module')

    program.comments = [this.makeGeneratedNoticeComment([source], config.requireToolInfo())]

    program.body.push(this.makeFormatterImport())
    program.body.push(this.makeInterfaceImport())
    if (translation.header !== undefined) {
      program.body.push(ts.expressionStatement(this.makePlaceholderExpression(translation.header)))
    }

    program.body.push(this.makeTranslationClass(translation, className))

    await file.write(program)
  }

  protected override async finishThis(): Promise<void> {
    // TODO !
  }

  private makeInterfaceImport(): ts.ProgramStatement {
    return ts.importDeclaration('value', '.', [ts.importSpecifier('value', this.interfaceName)])
  }
}
