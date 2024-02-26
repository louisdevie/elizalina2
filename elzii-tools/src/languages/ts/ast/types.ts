import {
  AST_NODE_TYPES,
  EntityName,
  TSAnyKeyword,
  TSArrayType,
  TSNumberKeyword,
  TSStringKeyword,
  TSTypeAnnotation,
  TSTypeReference,
  TypeNode,
} from '@module/languages/ts/tsestree-spec'

export function tsAnyKeyword(): TSAnyKeyword {
  return { type: AST_NODE_TYPES.TSAnyKeyword }
}

export function tsArrayType(elementType: TypeNode): TSArrayType {
  return { type: AST_NODE_TYPES.TSArrayType, elementType }
}

export function tsNumberKeyword(): TSNumberKeyword {
  return { type: AST_NODE_TYPES.TSNumberKeyword }
}

export function tsStringKeyword(): TSStringKeyword {
  return { type: AST_NODE_TYPES.TSStringKeyword }
}

export function tsTypeAnnotation(type: TypeNode): TSTypeAnnotation {
  return {
    type: AST_NODE_TYPES.TSTypeAnnotation,
    typeAnnotation: type,
  }
}

export function tsTypeReference(name: EntityName): TSTypeReference {
  return {
    type: AST_NODE_TYPES.TSTypeReference,
    typeName: name,
    typeArguments: undefined,
    typeParameters: undefined,
  }
}
