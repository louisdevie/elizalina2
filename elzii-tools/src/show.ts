import chalk, { Chalk } from 'chalk'
import { ElziiError, ErrorReport } from '@module/error'
import { Config } from '@module/config'

export interface Debug {
  debug(): string[]
}

export class Show {
  private static readonly detailsPadding = '|'
  private static readonly internalErrorNotice =
    'NOTICE: It seems this error was caused by a problem with the tool itself. Please report it to the developer here: https://github.com/louisdevie/elizalina2/issues.'

  private readonly _counters: ErrorCounter[]
  private _config: Config
  private _lastLogWasDebug: boolean

  public constructor(config: Config) {
    this._counters = []
    this._config = config
    this._lastLogWasDebug = false
  }

  private show(infos: unknown, tag: string, chalk: Chalk): void {
    if (infos instanceof ElziiError) {
      console.log(chalk(`${tag} ${infos.message}`))
      for (const details of infos.details) {
        console.log(chalk(`${Show.detailsPadding} ${details}`))
      }
    } else {
      console.log(chalk(`${tag} ${infos}`))
    }
    this._lastLogWasDebug = false // reset the flag by default
  }

  private appendNoticesFor(infos: unknown, chalk: Chalk): void {
    if (!(infos instanceof ElziiError) || infos.kind === 'internal') {
      console.log(chalk(`${Show.detailsPadding} ${Show.internalErrorNotice}`))
    }
  }

  public fatal(error: unknown): Show {
    this.show(error, '[fatal]', chalk.redBright)
    this.appendNoticesFor(error, chalk.redBright)
    this.notifyError(error)
    return this
  }

  public error(error: unknown): Show {
    this.show(error, '[error]', chalk.redBright)
    this.appendNoticesFor(error, chalk.redBright)
    this.notifyError(error)
    return this
  }

  public detailedError(...details: string[]): Show {
    const error = new ElziiError(details, 'other')
    this.show(error, '[error]', chalk.redBright)
    this.notifyError(error)
    return this
  }

  public warning(warning: unknown): Show {
    this.show(warning, '[warning]', chalk.yellow)
    this.appendNoticesFor(warning, chalk.yellow)
    this.notifyWarning(warning)
    return this
  }

  public detailedWarning(...details: string[]): Show {
    const warning = new ElziiError(details, 'other')
    this.show(warning, '[warning]', chalk.yellow)
    this.notifyWarning(warning)
    return this
  }

  public debugInfo(infos: unknown): Show {
    if (this._config.debug) {
      this.show(
        infos,
        this._lastLogWasDebug ? Show.detailsPadding : '[debug]' /* don't repeat the debug tag */,
        chalk.gray,
      )
      this._lastLogWasDebug = true
    }
    return this
  }

  public debug(debugObject: Debug): Show {
    if (this._config.debug) {
      for (const line of debugObject.debug()) {
        this.show(
          line,
          this._lastLogWasDebug ? Show.detailsPadding : '[debug]' /* don't repeat the debug tag */,
          chalk.gray,
        )
        this._lastLogWasDebug = true
      }
    }
    return this
  }

  public startErrorCounter(countAllErrors: boolean = false): ErrorCounter {
    const counter = new ErrorCounter(countAllErrors)
    this._counters.push(counter)
    return counter
  }

  public stopErrorCounter(counter: ErrorCounter): void {
    this._counters.splice(this._counters.indexOf(counter))
  }

  private notifyError(error: unknown): void {
    const isInternalError = !(error instanceof ElziiError) || error.kind === 'internal'
    for (const counter of this._counters) {
      counter.errorShown(isInternalError)
    }
  }

  private notifyWarning(warning: unknown): void {
    const isInternalWarning = !(warning instanceof ElziiError) || warning.kind === 'internal'
    for (const counter of this._counters) {
      counter.warningShown(isInternalWarning)
    }
  }

  public report(report: ErrorReport): void {
    for (const error of report.list) {
      this.error(error)
    }
  }
}

export class ShowProgress {
  private readonly _tag: string

  public constructor(tag: string) {
    this._tag = tag.toUpperCase().padEnd(3)
  }

  public progress(infos: string): void {
    console.log(`${chalk.blue(this._tag)} ${infos}`)
  }

  public success(infos: string): void {
    console.log(`${chalk.green(this._tag)} ${infos}`)
  }

  public failure(infos: string): void {
    console.log(`${chalk.redBright(this._tag)} ${infos}`)
  }
}

export const Humanize = {
  formatListWithEllipsis: (list: string[], junction: string, maxExplicit: number): string => {
    const parts = []

    const explicitCount = Math.max(Math.min(list.length, maxExplicit) - 1, 0)
    const explicitList = list.slice(0, explicitCount)
    const restList = list.slice(explicitCount)

    if (explicitList.length > 0) {
      parts.push(explicitList.join(', '))
    }

    if (restList.length === 1) {
      parts.push(restList[0])
    } else if (restList.length > 1) {
      parts.push(`${restList.length} others`)
    }

    return parts.join(` ${junction} `)
  },

  plural: (value: number, formA: string, formB?: string, formC?: string): string => {
    let zero, one, many
    if (formB !== undefined && formC !== undefined) {
      zero = formA
      one = formB
      many = formC
    } else if (formB !== undefined) {
      zero = formB
      one = formA
      many = formB
    } else {
      zero = formA + 's'
      one = formA
      many = formA + 's'
    }

    let chosen
    switch (value) {
      case 0:
        chosen = zero
        break
      case 1:
        chosen = one
        break
      default:
        chosen = many
        break
    }
    return chosen
  },
}

export class ErrorCounter {
  private readonly _countAll: boolean
  private _errors: number
  private _warnings: number

  public constructor(countAll: boolean) {
    this._countAll = countAll
    this._errors = 0
    this._warnings = 0
  }

  public get errors(): number {
    return this._errors
  }

  public get warnings(): number {
    return this._warnings
  }

  public errorShown(internal: boolean): void {
    if (this._countAll || !internal) this._errors++
  }

  public warningShown(internal: boolean): void {
    if (this._countAll || !internal) this._warnings++
  }
}
