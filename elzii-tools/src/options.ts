import { throwError } from './error'

export type Options = TargetOptions | Record<string, TargetOptions>

export interface TargetOptions {
  /**
   * The directory containing translation files.
   */
  sources: string

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

export class OptionsBuilder {}

export class TargetOptionsBuilder {
  private _sources?: string
  private _output?: OutputOptionsBuilder
  private _interfaceName: string
  private _elzInstanceName: string
  private _singleFile: boolean

  /**
   * Creates default options.
   */
  public constructor() {
    this._interfaceName = 'Locale'
    this._elzInstanceName = 'elz'
    this._singleFile = false
  }

  public get sources(): string {
    if (this._sources === undefined) throwError('The "sources" option is missing', 'config')
    return this._sources
  }

  public get output(): OutputOptionsBuilder {
    if (this._output === undefined) throwError('The "output" option is missing', 'config')
    return this._output
  }

  public get interfaceName(): string {
    return this._interfaceName
  }

  public get elzInstanceName(): string {
    return this._elzInstanceName
  }

  public singleFile(): boolean {
    return this._singleFile
  }

  public merge(options: TargetOptions, shouldOverride: boolean) {
    this._sources = options.sources
    this._
  }
}

export type OutputTypes = 'js' | 'dts' | 'ts'

export type NormalizedOutputOptions = { enabled: false } | { enabled: true; directory: string }

function disabled(): NormalizedOutputOptions {
  return { enabled: false }
}

function enabled(directory: string): NormalizedOutputOptions {
  return { enabled: true, directory }
}

export class OutputOptionsBuilder {
  private _options: Record<OutputTypes, NormalizedOutputOptions>

  public constructor(options: OutputOptions) {
    if ('js' in options) {
      // javascript output
      let dts = options.dts ?? false
      this._options = {
        js: enabled(options.js),
        // default to same directory if just "true"
        dts: dts === false ? disabled() : enabled(typeof dts === 'string' ? dts : options.js),
        ts: disabled(),
      }
    } else {
      // typescript output
      this._options = { js: disabled(), dts: disabled(), ts: enabled(options.ts) }
    }
  }
}
