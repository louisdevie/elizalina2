import {
  mergeTypeHints,
  Message,
  MessageParameter,
  Translation,
  TypeHint,
} from '@module/translations'
import { Check } from '@module/checks'
import { findSourceMap } from 'node:module'
import { textChangeRangeNewSpan } from 'typescript'

export interface MessageParametersReport {}

interface MessageSignature {}

type NameMappingResult = {
  mapped: Map<number, number>
  additional:
    | { in: 'none' }
    | { in: 'this'; indexes: number[] }
    | { in: 'other'; indexes: number[] }
}

class Signature implements MessageSignature {
  private readonly _parameters: MessageParameter[]
  private readonly _usedIn: Set<string>

  constructor(translationId: string, parameters: MessageParameter[]) {
    this._parameters = parameters
    this._usedIn = new Set([translationId])
  }

  public tryToMergeWith(other: Signature): boolean {
    let success = false
    const newParameters: MessageParameter[] = []

    const mappingResult: NameMappingResult = {
      mapped: new Map<number, number>(),
      additional: { in: 'none' },
    }
    if (this.tryToMapNamesWith(other._parameters, mappingResult)) {
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
    }

    return success
  }

  private tryToMapNamesWith(
    otherParameters: MessageParameter[],
    result: NameMappingResult,
  ): boolean {
    const notInOther = new Set<number>()
    const notInThis = new Set(otherParameters.keys())

    this._parameters.forEach(({ name: thisName }, thisIndex) => {
      const otherIndex = otherParameters.findIndex((other) => other.name === thisName)
      if (otherIndex === -1) {
        notInOther.add(thisIndex)
      } else {
        notInThis.delete(otherIndex)
        result.mapped.set(thisIndex, otherIndex)
      }
    })

    let success
    if (notInOther.size > 0) {
      if (notInThis.size > 0) {
        // this and the other signature have their own different parameters, stop trying to merge
        success = false
      } else {
        // this is a superset of the other signature
        success = true
        result.additional = { in: 'this', indexes: Array.from(notInOther) }
      }
    } else {
      if (notInThis.size > 0) {
        // the other signature is a superset of this
        success = true
        result.additional = { in: 'other', indexes: Array.from(notInThis) }
      } else {
        // they both have the same set of parameters
        success = true
        result.additional = { in: 'none' }
      }
    }
    return success
  }
}

class Report implements MessageParametersReport {
  private _messages: Map<string, Signature[]>

  public constructor() {
    this._messages = new Map()
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
}

export class MessageParametersCheck implements Check<Translation, MessageParametersReport> {
  private readonly _report: Report

  public constructor() {
    this._report = new Report()
  }

  public validate(value: Translation): boolean {
    let allMessagesValid = true

    for (const [key, message] of value.messages) {
      allMessagesValid &&= this.validateMessage(value.id, key, message)
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
