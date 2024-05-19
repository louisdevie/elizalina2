import { BaseBuilder, BaseTarget } from '../decorators'
import { CommonOutputConfig, OutputConfig } from '@module/config'
import { throwError } from '@module/error'
import { OneToOneTSTarget } from '.'
import { resolveInPackage } from '@module/files'
import { getTSOutputDirectory } from '@module/files/code'
import { show } from '@module'

export default class TSTargetBuilder extends BaseBuilder {
  protected async makeThisOutputTarget(
    outputs: OutputConfig,
    common: CommonOutputConfig,
  ): Promise<BaseTarget | undefined> {
    let target = undefined

    if (outputs.ts.enabled) {
      if (common.singleFile) {
        throwError('The TS output format in single-file mode is not available yet.')
      } else {
        const outDir = await getTSOutputDirectory(resolveInPackage(outputs.ts.directory))
        target = new OneToOneTSTarget(outDir.root, common)
        show.debugInfo(`   Added TS target (${target.id})`)
        show.debugInfo(`      output directory is ${outputs.ts.directory}`)
        show.debugInfo(`      interface name is '${common.interfaceName}'`)
        show.debugInfo(`      proxy name is '${common.proxyName}'`)
      }
    }

    return target
  }
}
