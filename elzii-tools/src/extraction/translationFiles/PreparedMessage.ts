import { Result, unwrap } from '@module/extraction/result'
import { ErrorReport } from '@module/error'
import { IndexOf } from '@module/helpers'
import { Message, MessageParameterSet, MessagePart, Visibility } from '@module/model'

export type ExtendedMessagePart = MessagePart | { type: 'interpolation'; messageName: string }

export interface MessageResolver {
  resolve(name: string): PreparedMessage | undefined
}

export class PreparedMessage {
  private readonly _parameters: MessageParameterSet
  private readonly _content: ExtendedMessagePart[]
  private readonly _visibility: Visibility

  private _baking: boolean = false
  private _baked?: Message

  public constructor(
    parameters: MessageParameterSet,
    content: ExtendedMessagePart[],
    visibility: Visibility,
  ) {
    this._parameters = parameters
    this._content = content
    this._visibility = visibility
  }

  public bake(resolver: MessageResolver, name: string): Result<Message> {
    const errors = new ErrorReport()

    if (this._baked === undefined) {
      if (this._baking) {
        errors.encounteredError(`Message "${name}" references itself`, 'checks')
        return { value: new Message(Visibility.Private), errors }
      }

      this._baking = true
      this._baked = this.bakeContent(resolver, errors)
      this._baking = false
    }

    return { value: this._baked, errors }
  }

  private bakeContent(resolver: MessageResolver, errors: ErrorReport): Message {
    let mi
    while ((mi = this.nextMI()) !== undefined) {
      const resolved = resolver.resolve(mi.value)
      if (resolved === undefined) {
        errors.encounteredError(`Unknown message "${mi.value}"`, 'checks')
        this._content.splice(mi.index, 1)
      } else {
        const bakedMI = unwrap(resolved.bake(resolver, mi.value), errors)
        for (const param of bakedMI.parameters) this._parameters.add(param)
        this._content.splice(mi.index, 1, ...bakedMI.content)
      }
    }

    return new Message(this._visibility, this._content as MessagePart[], this._parameters)
  }

  private nextMI(): IndexOf<string> | undefined {
    let found

    for (let i = 0; i < this._content.length; i++) {
      const part = this._content[i]
      if (part.type === 'interpolation') {
        found = { index: i, value: part.messageName }
      }
    }

    return found
  }
}
