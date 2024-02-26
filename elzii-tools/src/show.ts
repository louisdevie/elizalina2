import chalk, { Chalk } from 'chalk'
import { ElziiError } from '@module/error'
import { Config } from '@module/config'

export interface Debug {
  debug(): string[]
}

export class Show {
  private static readonly detailsPadding = '|'
  private static readonly internalErrorNotice =
    'NOTICE: It seems this error was caused by a problem with the tool itself. Please report it to the developer here: https://github.com/louisdevie/elizalina2/issues.'

  private _config: Config
  private _lastLogWasDebug: boolean

  public constructor(config: Config) {
    this._config = config
    this._lastLogWasDebug = false
  }

  private show(infos: unknown, tag: string, chalk: Chalk) {
    if (infos instanceof ElziiError) {
      console.log(chalk(`${tag} ${infos.message}`))
      for (const details of infos.details) {
        console.log(chalk(`${Show.detailsPadding} ${details}`))
      }
      if (infos.kind === 'internal') {
      }
    } else {
      console.log(chalk(`${tag} ${infos}`))
    }
    this._lastLogWasDebug = false // reset the flag by default
  }

  private appendNoticesFor(infos: unknown, chalk: Chalk) {
    if (!(infos instanceof ElziiError) || infos.kind === 'internal') {
      console.log(chalk(`${Show.detailsPadding} ${Show.internalErrorNotice}`))
    }
  }

  public fatal(error: unknown): Show {
    this.show(error, '[fatal]', chalk.redBright)
    this.appendNoticesFor(error, chalk.redBright)
    return this
  }

  public error(error: unknown): Show {
    this.show(error, '[error]', chalk.redBright)
    this.appendNoticesFor(error, chalk.redBright)
    return this
  }

  public detailedError(...details: string[]): Show {
    this.show(new ElziiError(details, 'other'), '[error]', chalk.redBright)
    return this
  }

  public warning(warning: unknown): Show {
    this.show(warning, '[warning]', chalk.yellow)
    this.appendNoticesFor(warning, chalk.yellow)
    return this
  }

  public detailedWarning(...details: string[]): Show {
    this.show(new ElziiError(details, 'other'), '[warning]', chalk.yellow)
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
}
