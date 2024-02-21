import { OutputConfig, CommonOutputConfig } from '@module/config'
import { BaseBuilder, BaseTarget } from './decorators'
import { throwError } from '@module/error'

export class TypeScriptDefinitionTargetBuilder extends BaseBuilder {
  protected makeThisOutputTarget(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): BaseTarget | undefined {
    throwError('The DTS output format is not available yet.')
  }
}
