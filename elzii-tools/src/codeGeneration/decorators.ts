import { Translation } from '@module/translations'
import { OutputTarget, OutputTargetBuilder } from '.'
import { OutputConfig, CommonOutputConfig } from '@module/config'
import { throwError } from '@module/error'
import { AllTranslationReports } from '@module/checks/translations'

/**
 * A decorator implementation of {@link OutputTarget}.
 */
export abstract class BaseTarget implements OutputTarget {
  private _otherTargets?: BaseTarget

  public addOther(target: BaseTarget): BaseTarget {
    if (this._otherTargets === undefined) {
      this._otherTargets = target
    } else {
      this._otherTargets.addOther(target)
    }
    return this
  }

  public async init(reports: AllTranslationReports): Promise<void> {
    await this.initThis(reports)
    await this._otherTargets?.init(reports)
  }

  protected abstract initThis(reports: AllTranslationReports): Promise<void>

  public async compile(translation: Translation, source: string): Promise<void> {
    await this.compileThis(translation, source)
    await this._otherTargets?.compile(translation, source)
  }

  protected abstract compileThis(translation: Translation, source: string): Promise<void>

  public async finish(): Promise<void> {
    await this.finishThis()
    await this._otherTargets?.finish()
  }

  protected abstract finishThis(): Promise<void>
}

/**
 * A decorator implementation of {@link OutputTargetBuilder}.
 */
export abstract class BaseBuilder implements OutputTargetBuilder {
  private _otherBuilders?: BaseBuilder

  public addOther(target: BaseBuilder): BaseBuilder {
    if (this._otherBuilders === undefined) {
      this._otherBuilders = target
    } else {
      this._otherBuilders.addOther(target)
    }
    return this
  }

  public async makeOutputTarget(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): Promise<OutputTarget> {
    return (
      (await this.makeOutputTargetImpl(outputs, common)) ??
      throwError('Could not create the compilation target.', 'internal')
    )
  }

  private async makeOutputTargetImpl(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): Promise<BaseTarget | undefined> {
    let thisTarget = await this.makeThisOutputTarget(outputs, common)
    const otherTargets = await this._otherBuilders?.makeOutputTargetImpl(outputs, common)

    if (thisTarget === undefined) {
      thisTarget = otherTargets
    } else if (otherTargets !== undefined) {
      thisTarget.addOther(otherTargets)
    }

    return thisTarget
  }

  protected abstract makeThisOutputTarget(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): Promise<BaseTarget | undefined>
}
