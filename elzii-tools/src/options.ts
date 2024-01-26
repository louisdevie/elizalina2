import { handleErrors, throwError } from './error'
import { show } from '.'
import type { Debug } from './show'
import type {
  NormalizedOutputConfig,
  OutputConfig,
  TargetConfig,
  TargetsConfig,
} from '@module/config'

export type Options = TargetOptions | Record<string, TargetOptions>

export interface TargetOptions {
  /**
   * The directory containing translation files.
   */
  translations: string

  /**
   * The different files to generate.
   */
  output: OutputOptions

  /**
   * The name to use for the interface listing the translations (for ts/dts output only, the default is `Locale`)
   */
  interfaceName?: string

  /**
   * The name of the elizalina object used to load translations (the default is `elz`)
   */
  elzInstanceName?: string

  /**
   * If set to true, all translations will be compiled in a single file
   */
  singleFile?: boolean
}

export type OutputOptions =
  | {
      /**
       * The directory where javascript files will be generated.
       */
      js: string

      /**
       * Enable .d.ts file generation. You can specify a directory different from the javascript output
       * (the default is `false`)
       */
      dts?: boolean | string
    }
  | {
      /**
       * The directory where typescript files will be generated.
       */
      ts: string
    }

export class TargetsConfigBuilder implements TargetsConfig, Debug {
  private readonly _targets: Record<string, TargetConfigBuilder>

  public constructor() {
    this._targets = {}
  }

  private static isSingleTarget(options: object): boolean {
    return (
      'translations' in options &&
      typeof options.translations === 'string' &&
      'output' in options &&
      typeof options.output === 'object'
    )
  }

  public target(name: string): TargetConfigBuilder {
    return this._targets[name]
  }

  public get allTargets(): Record<string, TargetConfigBuilder> {
    return this._targets
  }

  public get areValid(): boolean {
    let allValid = true
    for (const key in this._targets) {
      allValid = this._targets[key].isValid(key)
      if (!allValid) break
    }
    return allValid
  }

  private mergeSingleTarget(
    name: string,
    targetOptions: TargetOptions,
    shouldOverride: boolean,
    warningDetails: string,
  ) {
    if (!(name in this._targets)) {
      this._targets[name] = new TargetConfigBuilder()
    }
    this._targets[name].merge(targetOptions, shouldOverride, `target "${name}", ${warningDetails}`)
  }

  public merge(options: Options, shouldOverride: boolean, warningDetails: string) {
    if (TargetsConfigBuilder.isSingleTarget(options)) {
      let singleTarget = options as TargetOptions
      this.mergeSingleTarget('default', singleTarget, shouldOverride, warningDetails)
    } else {
      let multipleTargets = options as Record<string, TargetOptions>
      for (const key in multipleTargets) {
        // check each target object, you never know...
        if (TargetsConfigBuilder.isSingleTarget(multipleTargets[key])) {
          this.mergeSingleTarget(key, multipleTargets[key], shouldOverride, warningDetails)
        }
      }
    }
  }

  public debug(): string[] {
    let debugOutput = []

    for (const targetName in this._targets) {
      debugOutput.push(` - ${targetName}:`, ...this.target(targetName).debug())
    }

    if (debugOutput.length == 0) {
      debugOutput.push('   (no targets found)')
    }

    return debugOutput
  }
}

export class TargetConfigBuilder implements TargetConfig, Debug {
  private _translations?: string
  private _output?: OutputConfigBuilder
  private _interfaceName?: string
  private _elzInstanceName?: string
  private _singleFile?: boolean

  public isValid(thisName: string): boolean {
    let valid = true

    if (this._translations !== undefined) {
      show.error(`The 'translations' key is missing in the '${thisName}' target.`)
      valid = false
    }

    if (this._output !== undefined) {
      show.error(`The 'output' key is missing in the '${thisName}' target.`)
      valid = false
    }

    return valid
  }

  public get translations(): string {
    return this._translations ?? throwError('The "translations" option is missing', 'config')
  }

  public get output(): OutputConfigBuilder {
    return this._output ?? throwError('The "output" option is missing', 'config')
  }

  public get interfaceName(): string {
    return this._interfaceName ?? 'Locale'
  }

  public get elzInstanceName(): string {
    return this._elzInstanceName ?? 'elz'
  }

  public get singleFile(): boolean {
    return this._singleFile ?? false
  }

  public merge(options: TargetOptions, shouldOverride: boolean, warningDetails: string) {
    if (!shouldOverride && this._translations !== undefined)
      show.detailedWarning('The "translations" option was overwritten', warningDetails)
    this._translations = options.translations

    if (!shouldOverride && this._output !== undefined)
      show.detailedWarning('The "output" option was overwritten', warningDetails)
    this._output = new OutputConfigBuilder(options.output)

    if (options.interfaceName !== undefined) {
      if (!shouldOverride && this._interfaceName !== undefined)
        show.detailedWarning('The "interfaceName" option was overwritten', warningDetails)
      this._interfaceName = options.interfaceName
    }

    if (options.elzInstanceName !== undefined) {
      if (!shouldOverride && this._elzInstanceName !== undefined)
        show.detailedWarning('The "elzInstanceName" option was overwritten', warningDetails)
      this._elzInstanceName = options.elzInstanceName
    }

    if (options.singleFile !== undefined) {
      if (!shouldOverride && this._singleFile !== undefined)
        show.detailedWarning('The "singleFile" option was overwritten', warningDetails)
      this._singleFile = options.singleFile
    }
  }

  private debugJsonify(getter: () => any): string {
    return handleErrors(() => JSON.stringify(getter()), { all: (err) => `<${err}>` })
  }

  public debug(): string[] {
    let debugOutput = []

    debugOutput.push(`     translations: ${this.debugJsonify(() => this.translations)}`)

    debugOutput.push(
      '     output:',
      ...handleErrors(() => this.output.debug(), { all: (err) => [`       <${err}>`] }),
    )

    debugOutput.push(`     interfaceName: ${this.debugJsonify(() => this.interfaceName)}`)
    debugOutput.push(`     elzInstanceName: ${this.debugJsonify(() => this.elzInstanceName)}`)
    debugOutput.push(`     singleFile: ${this.debugJsonify(() => this.singleFile)}`)

    return debugOutput
  }
}

function disabled(): NormalizedOutputConfig {
  return { enabled: false }
}

function enabled(directory: string): NormalizedOutputConfig {
  return { enabled: true, directory }
}

export class OutputConfigBuilder implements OutputConfig, Debug {
  private readonly _js: NormalizedOutputConfig
  private readonly _dts: NormalizedOutputConfig
  private readonly _ts: NormalizedOutputConfig

  public constructor(options: OutputOptions) {
    if ('js' in options) {
      // javascript output
      let dts = options.dts ?? false
      this._js = enabled(options.js)
      // default to same directory if just "true"
      this._dts = dts === false ? disabled() : enabled(typeof dts === 'string' ? dts : options.js)
      this._ts = disabled()
    } else {
      // typescript output
      this._js = disabled()
      this._dts = disabled()
      this._ts = enabled(options.ts)
    }
  }

  public get js(): NormalizedOutputConfig {
    return this._js
  }

  public get dts(): NormalizedOutputConfig {
    return this._dts
  }

  public get ts(): NormalizedOutputConfig {
    return this._ts
  }

  public debug(): string[] {
    return ['js', 'dts', 'ts'].map((type) => {
      const normalizedConfig = (this as any)[type] as NormalizedOutputConfig
      return (
        `       ${type}: ` +
        (normalizedConfig.enabled ?
          `enabled (directory: ${JSON.stringify(normalizedConfig.directory)})`
        : 'disabled')
      )
    })
  }
}
