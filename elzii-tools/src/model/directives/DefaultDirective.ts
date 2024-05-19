import { throwError } from '@module/error'
import type { Directive } from '.'

export default class DefaultDirective implements Directive {
  public readonly type = 'default'
  public readonly description = '@default'

  public throwIfConflicts(other: Directive): void {
    if (other.type === 'default') {
      throwError('Duplicate @default directive found', 'checks')
    }
  }
}
