import { Show } from '@module/show'
import chalk, { Chalk } from 'chalk'
import fs from 'node:fs'
import path from 'node:path'
import { handleErrorsAsync, throwError } from '@module/error'
import { TargetsConfigBuilder, Options, TargetConfigBuilder, OutputConfigBuilder } from './options'
import { bundleRequire } from 'bundle-require'
import { access } from '@module/helpers'
import YAML from 'yaml'

export interface TargetsConfig {
  readonly allTargets: Record<string, TargetConfig>
  readonly areValid: boolean

  target(name: string): TargetConfig
}

export interface TargetConfig {
  readonly translations: string
  readonly output: OutputConfig
  readonly interfaceName: string
  readonly elzInstanceName: string
  readonly singleFile: boolean
}

export interface OutputConfig {
  readonly js: NormalizedOutputConfig
  readonly dts: NormalizedOutputConfig
  readonly ts: NormalizedOutputConfig
}

export type NormalizedOutputConfig = { enabled: false } | { enabled: true; directory: string }

export class Config {
  private _debug: boolean
  private readonly _color: Chalk
  private _currentPackageRoot?: string

  // We use a lazily initialized show object to break the circular dependency between the two classes
  private _show?: Show

  private get show(): Show {
    return this._show ?? new Show(this)
  }

  /** @internal */
  public useShowInstance(show: Show) {
    this._show = show
  }

  public constructor() {
    this._debug = false
    this._color = chalk
  }

  public get debug(): boolean {
    return this._debug
  }

  public get color(): Chalk {
    return this._color
  }

  public requireCurrentPackageRoot(): string {
    if (this._currentPackageRoot === undefined)
      throwError("The root of the current package hasn't been resolved yet.", 'config')
    return this._currentPackageRoot
  }

  public enableDebugMode() {
    this._debug = true
  }

  disableColor() {
    this._color.level = 0
  }

  private async resolveCurrentPackageRecursive(dir: string): Promise<boolean> {
    this.show.debugInfo(`   looking in ${dir}`)
    let found = false

    if ((await fs.promises.readdir(dir)).includes('package.json')) {
      this.show.debugInfo(`   ok, package.json found there`)
      this._currentPackageRoot = dir
      found = true
    } else {
      let parent = dir.substring(0, dir.lastIndexOf(path.sep))
      try {
        if ((await fs.promises.stat(parent)).isDirectory()) {
          found = await this.resolveCurrentPackageRecursive(parent)
        }
      } catch (err) {
        /* ignore errors returned by stat */
      }
    }

    return found
  }

  public async resolveCurrentPackage() {
    this.show.debugInfo('searching for the current node package...')
    if (!(await this.resolveCurrentPackageRecursive(process.cwd()))) {
      throwError('No Node.js package found from the current directory.', 'config')
    }
  }

  private handleConfigFileErrors(error: unknown, source: string): boolean {
    this.show
      .warning(error)
      .warning(`Unable to load the configuration from ${source} due to the error above.`)
    return false
  }

  public async loadConfigFiles() {
    const pkgRoot = this.requireCurrentPackageRoot()
    let options = new TargetsConfigBuilder()

    let foundConfig

    for (const loader of [
      new YamlConfigLoader(pkgRoot),
      new ScriptConfigLoader(pkgRoot, '.ts'),
      new ScriptConfigLoader(pkgRoot, '.js'),
      new PackageJsonConfigLoader(pkgRoot),
    ]) {
      foundConfig =
        (
          (await handleErrorsAsync(() => loader.load(this.show, options), {
            all: (error) => this.handleConfigFileErrors(error, loader.baseName),
          }))
        ) ?
          loader.baseName
        : undefined

      if (foundConfig !== undefined) break
    }

    if (foundConfig !== undefined) {
      if (this._debug) this.show.debugInfo('final target configuration:').debug(options)

      if (!options.areValid) {
        throwError(`The configuration in ${foundConfig} was invalid.`, 'config')
      }
    } else {
      throwError('No configuration file was found.', 'config')
    }
  }

  /**
   * Required steps at the launch of any tool.
   */
  public async init() {
    await this.resolveCurrentPackage()
    await this.loadConfigFiles()
  }
}

interface ConfigLoader {
  baseName: string

  load(show: Show, options: TargetsConfigBuilder): Promise<boolean>
}

abstract class SerializedConfigLoader implements ConfigLoader {
  private readonly _path: string

  protected constructor(path: string) {
    this._path = path
  }

  public get baseName(): string {
    return path.basename(this._path)
  }

  public async load(show: Show, options: TargetsConfigBuilder): Promise<boolean> {
    let loaded = false

    if (await access(this._path, fs.constants.R_OK)) {
      show.debugInfo(`looking up ${this.baseName}...`)
      let raw = await fs.promises.readFile(this._path, {
        encoding: 'utf-8',
        flag: fs.constants.O_RDONLY,
      })

      let configObject = this.parse(raw)
      if (configObject !== undefined) {
        options.merge(configObject as Options, false, `in ${this.baseName}`)
        loaded = true
      }
    }

    return loaded
  }

  protected abstract parse(raw: string): any
}

class YamlConfigLoader extends SerializedConfigLoader {
  public constructor(packageRoot: string) {
    super(path.join(packageRoot, '.elzii'))
  }

  protected override parse(raw: string): any {
    return YAML.parse(raw)
  }
}

class PackageJsonConfigLoader extends SerializedConfigLoader {
  public constructor(packageRoot: string) {
    super(path.join(packageRoot, 'package.json'))
  }

  protected override parse(raw: string): any {
    const jsonData = JSON.parse(raw)
    return jsonData !== undefined && 'elzii' in jsonData ? jsonData['elzii'] : undefined
  }
}

class ScriptConfigLoader implements ConfigLoader {
  private readonly _path: string

  public constructor(packageRoot: string, extension: string) {
    this._path = path.join(packageRoot, 'elzii.config' + extension)
  }

  public get baseName(): string {
    return path.basename(this._path)
  }

  public async load(show: Show, options: TargetsConfigBuilder): Promise<boolean> {
    let loaded = false

    if (await access(this._path, fs.constants.R_OK)) {
      show.debugInfo(`looking up ${this.baseName}...`)

      const br = await bundleRequire({ filepath: this._path })
      const module = br.mod['elzii'] || br.mod.default || br.mod

      if (module !== undefined) {
        options.merge(module as Options, false, `in ${this.baseName}`)
        loaded = true
      }
    }

    return loaded
  }
}
