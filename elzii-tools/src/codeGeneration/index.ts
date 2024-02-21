import { CommonOutputConfig, OutputConfig } from '@module/config'
import { Translation } from '@module/translations'
import { JavaScriptTargetBuilder } from '@module/codeGeneration/javascript'
import { TypeScriptDefinitionTargetBuilder } from '@module/codeGeneration/typescriptDefinition'
import { TSTargetBuilder } from './typescript'

/**
 * A code generation target for the "release" tool.
 */
export interface OutputTarget {
  /**
   * Performs pre-compilation operations.
   */
  init(): Promise<void>

  /**
   * Compile a single translation.
   * @param translation The translation object to compile.
   */
  compile(translation: Translation): Promise<void>

  /**
   * Performs post-compilation operations. All generated files have been written when this promise resolves.
   */
  finish(): Promise<void>
}

/**
 * Creates an {@link OutputTarget} from configuration options.
 */
export interface OutputTargetBuilder {
  /**
   * Creates an appropriate target from the given options.
   * @param outputs Configuration options of each format.
   * @param common Shared configuration options for all formats.
   */
  makeOutputTarget(outputs: OutputConfig, common: CommonOutputConfig): OutputTarget
}

export const defaultOutputTargetBuilder = new JavaScriptTargetBuilder()
  .addOther(new TypeScriptDefinitionTargetBuilder())
  .addOther(new TSTargetBuilder())
