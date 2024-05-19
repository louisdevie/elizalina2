import { TextProcessor } from '@module/printing'
import CodeConfig from '@module/generation/codeConfig'
import { show } from '@module'
import { UserCode } from '@module/model'

export default class UserCodeInsertion implements TextProcessor {
  private _codeToInsert: Map<string, UserCode>

  public constructor() {
    this._codeToInsert = new Map()
  }

  public addUserCode(placeholderKey: string, code: UserCode): void {
    this._codeToInsert.set(placeholderKey, code)
  }

  public process(code: string): string {
    show.debugInfo(`   Inserting user code (${this._codeToInsert.size} entries)...`)
    return code.replace(
      CodeConfig.Placeholders.UserCode.Format,
      (key) => this._codeToInsert.get(key)?.print() ?? key,
    )
  }

  public clear(): void {
    this._codeToInsert.clear()
  }
}
