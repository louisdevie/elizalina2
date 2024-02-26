export { MessageParametersCheck, MessageParametersReport } from './messageParameters'
export { MissingTranslationsCheck, MissingTranslationsReport } from './missingTranslations'

import { MissingTranslationsReport } from './missingTranslations'

export interface AllTranslationReports {
  readonly missing: MissingTranslationsReport
  readonly parameters: MessageParametersReport
}
