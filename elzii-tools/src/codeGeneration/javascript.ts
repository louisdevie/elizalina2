import { OutputConfig, CommonOutputConfig } from '@module/config'
import { BaseBuilder, BaseTarget } from './decorators'
import { throwError } from '@module/error'
import { getTSOutputDirectory } from '@module/files/code'
import { resolveInPackage } from '@module/files'
import { OneToOneTSTarget } from '@module/codeGeneration/typescript'

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
