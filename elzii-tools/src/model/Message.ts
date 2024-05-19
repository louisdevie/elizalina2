import { MessageParameterSet, MessagePart, Visibility } from '@module/model/index'

/**
 * A translated message.
 */
export default class Message {
  private readonly _visibility: Visibility
  private readonly _parameters: MessageParameterSet
  private _content: MessagePart[]

  public constructor(
    visibility: Visibility,
    content?: MessagePart[],
    parameters?: MessageParameterSet,
  ) {
    this._visibility = visibility
    this._parameters = parameters ?? new MessageParameterSet()
    this._content = content ?? []
  }

  /**
   * The scope of the message.
   */
  public get visibility(): Visibility {
    return this._visibility
  }

  /**
   * The parameters used in the message.
   */
  public get parameters(): MessageParameterSet {
    return this._parameters
  }

  /**
   * The content of the message.
   */
  public get content(): MessagePart[] {
    return this._content
  }

  /**
   * Concatenates adjacent literal message parts to simplify a message's content.
   */
  public normalizeMessageContent(): void {
    const normalized: MessagePart[] = []
    let lastNormalizedPartIsText = false

    for (const part of this._content) {
      if (part.type === 'text' && lastNormalizedPartIsText) {
        // cast into a text part
        ;(normalized[normalized.length - 1] as { value: string }).value += part.value
      } else {
        normalized.push(part)
        lastNormalizedPartIsText = part.type === 'text'
      }
    }

    this._content = normalized
  }
}
