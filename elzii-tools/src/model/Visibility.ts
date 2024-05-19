/**
 * Scope of messages.
 */
export enum Visibility {
  /**
   * The message is shared across the locales.
   */
  Public,

  /**
   * The message is only available inside this translation.
   */
  Private,
}

export default Visibility
