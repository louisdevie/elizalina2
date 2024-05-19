import {
  mergeTypeHints,
  Message,
  MessageParameter,
  MessageParameterSet,
  Translation,
  TypeHint,
  Visibility,
} from '@module/model'
import { Check } from '@module/checks'
import { throwError } from '@module/error'
import { show } from '@module'

export interface MessageParametersReport {
  signatureOf(key: string): MessageSignature
}

interface MessageSignature {
  readonly parameters: Iterable<MessageParameter>
}

type NameMappingResult = {
  mapped: Map<number, number>
  additional:
    | { in: 'none' }
    | { in: 'this'; indexes: number[] }
    | { in: 'other'; indexes: number[] }
}

export class Signature implements MessageSignature {
  private _parameters: MessageParameter[]
  private readonly _usedIn: Set<string>
  public constructor(translationId: string | null, parameters: MessageParameterSet) {
    this._parameters = Array.from(parameters)
    this._usedIn = new Set(translationId === null ? [] : [translationId])
  }

  public get parameters(): Iterable<MessageParameter> {
    return this._parameters
  }

  public get usedIn(): Iterable<string> {
    return this._usedIn
  }

  public get description(): string {
    const params = this._parameters.map((param) =>
      param.typeHint === TypeHint.None ? param.name : `${param.name}: ${param.typeHint}`,
    )
    const usage = Array.from(this._usedIn).join(', ')
    return `(${params.join(', ')}) used in ${usage}`
  }

  public tryToMergeWith(other: Signature): boolean {
    let success = false

    const mappingResult = this.tryToMapNamesWith(other._parameters)
    if (mappingResult !== undefined) {
      const newParameters: MessageParameter[] = []
      for (const [thisIndex, otherIndex] of mappingResult.mapped) {
        newParameters.push({
          name: this._parameters[thisIndex].name,
          typeHint: mergeTypeHints(
            this._parameters[thisIndex].typeHint,
            other._parameters[otherIndex].typeHint,
          ),
        })
      }
      switch (mappingResult.additional.in) {
        case 'this':
          for (const thisIndex of mappingResult.additional.indexes) {
            newParameters.push({
              name: this._parameters[thisIndex].name,
              typeHint: this._parameters[thisIndex].typeHint,
            })
          }
          break

        case 'other':
          for (const otherIndex of mappingResult.additional.indexes) {
            newParameters.push({
              name: other._parameters[otherIndex].name,
              typeHint: other._parameters[otherIndex].typeHint,
            })
          }
          break
      }
      this._parameters = newParameters
      for (const tid of this._usedIn) this._usedIn.add(tid)
      for (const tid of other._usedIn) this._usedIn.add(tid)
      success = true
    }

    return success
  }

  private tryToMapNamesWith(otherParameters: MessageParameter[]): NameMappingResult | undefined {
    const notInOther: Set<number> = new Set()
    const notInThis: Set<number> = new Set(otherParameters.keys())

    const mapped = new Map()
    this._parameters.forEach(({ name: thisName }, thisIndex) => {
      const otherIndex = otherParameters.findIndex((other) => other.name === thisName)
      if (otherIndex === -1) {
        notInOther.add(thisIndex)
      } else {
        notInThis.delete(otherIndex)
        mapped.set(thisIndex, otherIndex)
      }
    })

    let result: NameMappingResult | undefined
    if (notInOther.size > 0) {
      if (notInThis.size > 0) {
        // this and the other signature have their own different parameters, stop trying to merge
        result = undefined
      } else {
        // this is a superset of the other signature
        result = { mapped, additional: { in: 'this', indexes: Array.from(notInOther) } }
      }
    } else {
      if (notInThis.size > 0) {
        // the other signature is a superset of this
        result = { mapped, additional: { in: 'other', indexes: Array.from(notInThis) } }
      } else {
        // they both have the same set of parameters
        result = { mapped, additional: { in: 'none' } }
      }
    }

    return result
  }
}

class Report implements MessageParametersReport {
  private readonly _messages: Map<string, Signature[]>

  public constructor() {
    this._messages = new Map()
  }

  public signatureOf(key: string): MessageSignature {
    return (
      this._messages.get(key)?.at(0) ?? throwError('Found an empty signature array', 'internal')
    )
  }

  public tryToMerge(messageKey: string, signature: Signature): boolean {
    let merged = false

    let existingSignatures
    if ((existingSignatures = this._messages.get(messageKey)) !== undefined) {
      for (const existing of existingSignatures) {
        if (existing.tryToMergeWith(signature)) {
          merged = true
          break
        }
      }
      if (!merged) {
        existingSignatures.push(signature)
      }
    } else {
      this._messages.set(messageKey, [signature])
      merged = true
    }

    return merged
  }

  public checkForInvalidMessages(): boolean {
    let ok = true

    for (const [key, signatures] of this._messages) {
      if (signatures.length > 1) {
        const usageDetails = signatures.map((signature) => signature.description)
        show.detailedError(`Different parameters found for message '${key}':`, ...usageDetails)
        ok = false
      }
    }

    return ok
  }
}

export class MessageParametersCheck implements Check<Translation, MessageParametersReport> {
  private readonly _report: Report

  public constructor() {
    this._report = new Report()
  }

  public get isValidGlobally(): boolean {
    return this._report.checkForInvalidMessages()
  }

  public validate(value: Translation): boolean {
    let allMessagesValid = true

    for (const [key, message] of value.messages) {
      if (message.visibility === Visibility.Public) {
        allMessagesValid &&= this.validateMessage(value.id, key, message)
      }
    }

    return allMessagesValid
  }

  private validateMessage(translationId: string, key: string, message: Message): boolean {
    const signature = new Signature(translationId, message.parameters)
    return this._report.tryToMerge(key, signature)
  }

  public getReport(): MessageParametersReport {
    return this._report
  }
}
