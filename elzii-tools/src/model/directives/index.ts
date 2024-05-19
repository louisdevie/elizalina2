export { default as DefaultDirective } from './DefaultDirective'
export { default as DirectiveCollection } from './DirectiveCollection'

export type DirectiveType = 'default'

export interface Directive {
  readonly type: DirectiveType
  readonly description: string

  throwIfConflicts(other: Directive): void
}
