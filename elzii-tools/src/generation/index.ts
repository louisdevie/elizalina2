import { CommonOutputConfig, OutputConfig } from '@module/config'
import { Translation } from '@module/model'
import { JavaScriptTargetBuilder } from '@module/generation/javascript'
import { TypeScriptDefinitionTargetBuilder } from '@module/generation/typescriptDefinition'
import { TSTargetBuilder } from './typescript'
import { AllTranslationReports } from '@module/checks/translations'

/**
 * A code generation target for the tools.
 */
export interface OutputTarget {
  /**
   * Performs pre-compilation operations.
   */
  init(reports: AllTranslationReports): Promise<void>

  /**
   * Compile a single translation.
   * @param translation The translation object to compile.
   * @param source The path of the source file that contains the translation.
   */
  compile(translation: Translation, source: string): Promise<void>

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
  makeOutputTarget(outputs: OutputConfig, common: CommonOutputConfig): Promise<OutputTarget>
}

export const defaultOutputTargetBuilder = new JavaScriptTargetBuilder()
  .addOther(new TypeScriptDefinitionTargetBuilder())
  .addOther(new TSTargetBuilder())
