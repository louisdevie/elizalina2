import { TSTarget } from '.'
import { FileExtensions } from '@module/files'
import { Translation } from '@module/translations'
import { TypeScriptOutputDirectory } from '@module/files/code'
import * as ts from '@module/languages/ts/ast'
import { config, show } from '@module'
import { toIdentifier } from '@module/languages/js/helpers'
import { AllTranslationReports } from '@module/checks/translations'
import { getTSPrinter } from '@module/languages/ts'
import chalk from 'chalk'
import { ShowProgress } from '@module/show'

interface OutputInfo {
  id: string
  fileName: string
  tsImportPath: string
}

export default class OneToOneTarget extends TSTarget {
  private _outputDirectory: TypeScriptOutputDirectory
  private readonly _sourcesList: string[]
  private readonly _outputList: OutputInfo[]
  private readonly _show: ShowProgress

  public constructor(
    outputDirectory: TypeScriptOutputDirectory,
    interfaceName: string,
    proxyName: string,
  ) {
    super(interfaceName, proxyName)

    this._outputDirectory = outputDirectory
    this._sourcesList = []
    this._outputList = []
    this._show = new ShowProgress('TS')
  }

  protected override async initThis(reports: AllTranslationReports): Promise<void> {
    await super.initThis(reports)

    await this._outputDirectory.resolve()

    this._show.progress('Compiling translations...')
  }

  protected async compileThis(translation: Translation, source: string): Promise<void> {
    this._sourcesList.push(source)
    const className = toIdentifier(translation.id + '_' + this.interfaceName)
    const fileName = className + FileExtensions.TypeScript
    show.debugInfo(`(${this.id}) Generating ${fileName}...`)

    const printerWithPostProcessor = getTSPrinter(this.userCodeInsertion)
    const file = this._outputDirectory.createNewFile(fileName, printerWithPostProcessor)

    show.debugInfo(`   Building AST`)
    const program = ts.program('module')

    program.comments = [this.makeGeneratedNoticeComment([source], config.requireToolInfo())]

    program.body.push(this.makeFormatterImport())
    program.body.push(this.makeInterfaceImport())
    if (translation.header !== undefined) {
      program.body.push(ts.expressionStatement(this.makePlaceholderExpression(translation.header)))
    }

    const cls = this.makeTranslationClass(translation, className)
    program.body.push(ts.exportDefaultDeclaration(cls))

    show.debugInfo(`   Writing to file`)
    await file.write(program)
    this._outputList.push({
      id: translation.id,
      fileName: file.name,
      tsImportPath: './' + className,
    })
    this.userCodeInsertion.clear()

    const missing = this.requireMissingReport()
    this.showFileSuccess(fileName, missing.missingKeysCountIn(translation.id), missing.allKeysCount)
  }

  protected override async finishThis(): Promise<void> {
    await this.generateIndex()
    await this._outputDirectory.cleanUp(this._outputList.map((output) => output.fileName))
    this._show.success('Finished')
  }

  private async generateIndex() {
    const fileName = 'index' + FileExtensions.TypeScript
    const file = this._outputDirectory.createNewFile(fileName)

    const program = ts.program('module')

    program.comments = [
      this.makeGeneratedNoticeComment(this._sourcesList, config.requireToolInfo()),
    ]

    program.body.push(this.makeLocaleSelectorImport())

    const intf = this.makeTranslationInterface()
    program.body.push(ts.exportNamedDeclaration(intf))

    const elz = this.makeLocaleSelectorInstance(
      this._outputList.map((output) => ({
        id: output.id,
        path: output.tsImportPath,
      })),
    )
    program.body.push(ts.exportNamedDeclaration(elz))
    program.body.push(ts.exportDefaultDeclaration(this.makeLocaleProxyExpression()))

    await file.write(program)
    this._outputList.push({ id: '__index', fileName: file.name, tsImportPath: '.' })

    this.showFileSuccess(fileName, 0, 0)
  }

  private makeInterfaceImport(): ts.ProgramStatement {
    return ts.importDeclaration('value', '.', [ts.importSpecifier('value', this.interfaceName)])
  }

  private showFileSuccess(fileName: string, missingCount: number, totalCount: number) {
    let missingCountFormatted = ''
    if (missingCount > 0) {
      const color = missingCount / totalCount < 0.05 ? chalk.yellow : chalk.redBright
      missingCountFormatted = color(`[!] ${missingCount} missing translation(s)`)
    }

    this._show.success(`${chalk.bold(fileName)} ${missingCountFormatted}`)
  }
}
