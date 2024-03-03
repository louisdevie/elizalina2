import { TextProcessor } from '@module/printing'
import { UserCode } from '@module/translations'
import { PlaceholdersConfig } from '@module/codeGeneration/codeConfig'
import { show } from '@module'

export default class UserCodeInsertion implements TextProcessor {
  private _codeToInsert: Map<string, UserCode>

  public constructor() {
    this._codeToInsert = new Map()
  }

  public addUserCode(placeholderKey: string, code: UserCode) {
    this._codeToInsert.set(placeholderKey, code)
  }

  public process(code: string): string {
    show.debugInfo(`Inserting user code (${this._codeToInsert.size} entries)...`)
    return code.replace(
      PlaceholdersConfig.userCodePlaceholderFormat,
      (key) => this._codeToInsert.get(key)?.print() ?? key,
    )
  }

  public clear() {
    this._codeToInsert.clear()
  }
}
