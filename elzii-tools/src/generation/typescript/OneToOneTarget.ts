import TSTarget, { type LocaleLoaderConfig } from './TSTarget'
import { FileExtensions } from '@module/files'
import { Translation } from '@module/model'
import { TypeScriptOutputDirectory } from '@module/files/code'
import * as ts from '@module/languages/ts/ast'
import { config, show } from '@module'
import { toIdentifier } from '@module/languages/js/helpers'
import { AllTranslationReports } from '@module/checks/translations'
import { getTSPrinter } from '@module/languages/ts'
import chalk from 'chalk'
import { ShowProgress } from '@module/show'
import type { CommonOutputConfig, StaticConfig } from '@module/config'

interface OutputInfo {
  id: string
  fileName: string
  className?: string
  tsImportPath: string
  role: 'none' | 'main' | 'default' | 'index'
}

export default class OneToOneTarget extends TSTarget {
  private readonly _outputDirectory: TypeScriptOutputDirectory
  private readonly _static: StaticConfig
  private readonly _sourcesList: string[]
  private readonly _outputList: OutputInfo[]
  private readonly _show: ShowProgress

  public constructor(outputDirectory: TypeScriptOutputDirectory, commonConfig: CommonOutputConfig) {
    super(commonConfig)

    this._outputDirectory = outputDirectory
    this._static = commonConfig.static
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
      className,
      role: translation.directives.has('default') ? 'default' : 'none',
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

  private async generateIndex(): Promise<void> {
    const fileName = 'index' + FileExtensions.TypeScript
    const file = this._outputDirectory.createNewFile(fileName)

    const program = ts.program('module')

    program.comments = [
      this.makeGeneratedNoticeComment(this._sourcesList, config.requireToolInfo()),
    ]

    program.body.push(this.makeLocaleSelectorImport())

    const localesLoaderConfig = this._outputList.map((output) => this.getLoaderConfig(output))
    for (const cfg of localesLoaderConfig) {
      if (cfg.static) program.body.push(this.makeLocaleStaticImport(cfg))
    }

    const intf = this.makeTranslationInterface()

    program.body.push(ts.exportNamedDeclaration(intf))
    const elz = this.makeLocaleSelectorInstance(
      localesLoaderConfig,
      this._outputList.find((out) => out.role === 'default')?.id,
    )
    program.body.push(ts.exportNamedDeclaration(elz))
    program.body.push(ts.exportDefaultDeclaration(this.makeLocaleProxyExpression()))

    await file.write(program)
    this._outputList.push({
      id: '__index__',
      fileName: file.name,
      tsImportPath: '.',
      role: 'index',
    })

    this.showFileSuccess(fileName, 0, 0)
  }

  private getLoaderConfig(output: OutputInfo): LocaleLoaderConfig {
    const idAndPath = {
      id: output.id,
      path: output.tsImportPath,
    }

    let full: LocaleLoaderConfig
    if (
      (output.role === 'main' && this._static.main) ||
      (output.role === 'default' && this._static.default)
    ) {
      full = { static: true, importName: output.className ?? output.id, ...idAndPath }
    } else {
      full = { static: false, ...idAndPath }
    }
    return full
  }

  private makeInterfaceImport(): ts.ProgramStatement {
    return ts.importDeclaration('value', '.', [ts.importSpecifier('value', this.interfaceName)])
  }

  private showFileSuccess(fileName: string, missingCount: number, totalCount: number): void {
    let missingCountFormatted = ''
    if (missingCount > 0) {
      const color = missingCount / totalCount < 0.05 ? chalk.yellow : chalk.redBright
      missingCountFormatted = color(`[!] ${missingCount} missing translation(s)`)
    }

    this._show.success(`${chalk.bold(fileName)} ${missingCountFormatted}`)
  }
}
