import { BaseBuilder, BaseTarget } from '../decorators'
import { CommonOutputConfig, OutputConfig } from '@module/config'
import { throwError } from '@module/error'
import { OneToOneTSTarget } from '.'
import { resolveInPackage } from '@module/files'

export default class TSTargetBuilder extends BaseBuilder {
  protected makeThisOutputTarget(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): BaseTarget | undefined {
    let target = undefined

    if (outputs.ts.enabled) {
      if (common.singleFile) {
        throwError('The TS output format in single-file mode is not available yet.')
      } else {
        const outDir = resolveInPackage(outputs.ts.directory)
        target = new OneToOneTSTarget()
      }
    }

    return target
  }
}
