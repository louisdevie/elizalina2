import { Translation } from '@module/translations'
import { PathNode } from '@module/files'

/**
 * A class capable of extracting translations data from parsed code.
 */
export interface TranslationsExtractor {
  /**
   * Return all translations that could be loaded.
   */
  foundTranslations: ExtractedTranslation[]
}

/**
 * Represents a translation that was extracted from source code.
 */
export interface ExtractedTranslation {
  /**
   * The translation object that may be loaded. The promise might get rejected if an error happened
   * while reading or parsing source files.
   */
  translation: Promise<Translation>

  /**
   * A list of the sources from which this translation was extracted.
   */
  sources: PathNode[]

  /**
   * The source file that contains most of this translation. If there is no such file, any item
   * included in the {@link sources} may be returned.
   */
  mainSource: PathNode
}
