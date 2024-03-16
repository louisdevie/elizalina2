import { OutputConfig, CommonOutputConfig } from '@module/config'
import { BaseBuilder, BaseTarget } from './decorators'
import { throwError } from '@module/error'

export class JavaScriptTargetBuilder extends BaseBuilder {
  protected async makeThisOutputTarget(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): Promise<BaseTarget | undefined> {
    if (outputs.js.enabled) {
      throwError('The JS output format is not available yet.')
    }
    return undefined
  }
}
