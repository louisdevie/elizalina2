import { OutputConfig, CommonOutputConfig } from '@module/config'
import { BaseBuilder, BaseTarget } from './decorators'
import { throwError } from '@module/error'

export class JavaScriptTargetBuilder extends BaseBuilder {
  protected makeThisOutputTarget(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): BaseTarget | undefined {
    throwError('The JS output format is not available yet.')
  }
}
