import { BaseTarget } from '../decorators'
import * as ts from '@module/languages/ts/ast'
import { Parameter } from '@module/languages/ts/ast'
import { ElizalinaRuntimeConfig, PlaceholdersConfig } from '@module/codeGeneration/codeConfig'
import { randomHex } from '@module/helpers'
import {
  MessageParameter,
  MessagePart,
  Translation,
  TypeHint,
  UserCode,
} from '@module/translations'
import { UserCodeInsertion } from '@module/codeGeneration/postProcessing'
import { AllTranslationReports } from '@module/checks/translations'
import { throwError } from '@module/error'

export default abstract class TSTarget extends BaseTarget {
  private readonly _interfaceName: string
  private readonly _objectName: string
  private readonly _userCodeInsertion: UserCodeInsertion
  private _reports?: AllTranslationReports

  public get userCodeInsertion(): UserCodeInsertion {
    return this._userCodeInsertion
  }

  public get interfaceName(): string {
    return this._interfaceName
  }

  protected constructor(interfaceName: string, objectName: string) {
    super()

    this._interfaceName = interfaceName
    this._objectName = objectName
    this._userCodeInsertion = new UserCodeInsertion()
  }

  private static generatePlaceholderKey(): string {
    return PlaceholdersConfig.userCodePlaceholderPrefix + randomHex()
  }

  protected async initThis(reports: AllTranslationReports): Promise<void> {
    this._reports = reports
  }

  /**
   * Creates a comment indicating that the file was generated.
   *
   * @param sources The path of the source file(s) from which it was generated.
   * @param tool The name and version of the tool that generated the file.
   * @protected
   */
  protected makeGeneratedNoticeComment(sources: string[], tool: string): ts.Comment {
    const formattedSources = sources.map((src) => `\n${src}`)
    return ts.blockComment(`Generated by ${tool} from the following files:${formattedSources}`)
  }

  /**
   * Creates an import statement for the global formatter.
   * @protected
   */
  protected makeFormatterImport(): ts.ProgramStatement {
    return ts.importDeclaration('value', ElizalinaRuntimeConfig.moduleName, [
      ts.importSpecifier('value', ElizalinaRuntimeConfig.globalFormatterInstanceName),
    ])
  }

  /**
   * Creates a placeholder expression to be replaced by user-defined code afterward.
   * @protected
   */
  protected makePlaceholderExpression(userCode: UserCode): ts.Identifier {
    const placeholder = TSTarget.generatePlaceholderKey()
    this._userCodeInsertion.addUserCode(placeholder, userCode)
    return ts.identifier(placeholder)
  }

  protected makeTranslationClass(
    translation: Translation,
    className: string,
  ): ts.ClassDeclarationWithName {
    const cls = ts.classDeclaration(className, {
      implements: [ts.tsClassImplements(this.interfaceName)],
    })

    if (this._reports === undefined)
      throwError('Reports were unavailable during compilation', 'internal')

    for (const key of this._reports.missing.allKeys) {
      const message = translation.messages.get(key)
      const signature = Array.from(this._reports.parameters.signatureOf(key).parameters)
      if (message !== undefined) {
        cls.body.body.push(this.makeDefinedMessageMethod(key, signature, message.content))
      } else {
        cls.body.body.push(this.makeMissingMessageMethod(key, signature))
      }
    }

    return cls
  }

  private makeMessageMethod(
    key: string,
    messageParameters: MessageParameter[],
    body: ts.BlockStatement,
  ) {
    const params = messageParameters.map(this.makeMessageParameter.bind(this))
    return ts.methodDefinition(key, {
      kind: params.length === 0 ? 'get' : 'method', // use getters when there are no parameters
      params,
      returnType: ts.tsTypeAnnotation(ts.tsStringKeyword()),
      body,
    })
  }

  private makeDefinedMessageMethod(
    key: string,
    messageParameters: MessageParameter[],
    messageContent: MessagePart[],
  ): ts.MethodDefinition {
    return this.makeMessageMethod(
      key,
      messageParameters,
      ts.blockStatement(ts.returnStatement(this.makeMessageTemplate(messageContent))),
    )
  }

  private makeMissingMessageMethod(
    key: string,
    messageParameters: MessageParameter[],
  ): ts.MethodDefinition {
    return this.makeMessageMethod(
      key,
      messageParameters,
      ts.blockStatement(ts.returnStatement(ts.literal(`<${key}>`))),
    )
  }

  private makeMessageParameter(param: MessageParameter): Parameter {
    return ts.identifier(param.name, this.typeHintToTSType(param.typeHint))
  }

  private typeHintToTSType(typeHint: TypeHint): ts.TypeNode | undefined {
    let type = undefined

    switch (typeHint) {
      case TypeHint.None:
      case TypeHint.Mixed:
        type = ts.tsAnyKeyword()
        break

      case TypeHint.String:
        type = ts.tsStringKeyword()
        break

      case TypeHint.Number:
        type = ts.tsNumberKeyword()
        break

      case TypeHint.List:
        type = ts.tsArrayType(ts.tsAnyKeyword())
        break

      case TypeHint.Datetime:
        type = ts.tsTypeReference(ts.identifier('Date'))
        break
    }

    return type
  }

  private makeMessageTemplate(messageContent: MessagePart[]): ts.TemplateLiteral {
    const textElements = []
    const expressions = []

    let firstPart = true
    for (const part of messageContent) {
      switch (part.type) {
        case 'text':
          textElements.push(part.value)
          break

        case 'formatting':
          if (firstPart) textElements.push('') // always start with a quasi

          if (part.format === undefined) {
            expressions.push(ts.identifier(part.parameterName))
          } else {
            expressions.push(
              ts.callExpression(
                this.makePlaceholderExpression(part.format),
                ts.identifier(part.parameterName),
              ),
            )
          }
      }
      firstPart = false
    }

    return ts.templateLiteral(textElements, expressions)
  }
}
