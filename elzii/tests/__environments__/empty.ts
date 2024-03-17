import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment'
import NodeEnvironment from 'jest-environment-node'

class EmptyEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context)
  }

  getVmContext() {
    return super.getVmContext()
  }

  async setup() {
    await super.setup()

    const ogProcess = this.global.process
    this.global.restoreEnvironment = () => (this.global.process = ogProcess)
    this.global.clearEnvironment = () => (this.global.process = undefined as any)
  }

  async teardown() {
    await super.teardown()
  }
}

export default EmptyEnvironment
export const TestEnvironment = EmptyEnvironment
