import { JSONSchema } from './JSONSchema'
import { isPlainObject } from 'lodash'

export enum JSONSchemaType {
  Any, TypedArray, UnnamedEnum, AllOf, AnyOf, Reference, NamedSchema, AnonymousSchema,
  String, Number, Null, Object, UntypedArray, Boolean, Literal, NamedEnum, Union
}

export function typeOfSchema(schema: JSONSchema): JSONSchemaType {

  /**
   * @see https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/master/tests/draft4/allOf.json
   */
  if (schema.allOf) {
    return JSONSchemaType.AllOf
  }

  /**
   * @see https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/master/tests/draft4/anyOf.json
   */
  if (schema.anyOf) {
    return JSONSchemaType.AnyOf
  }

  /**
   * @see https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/develop/tests/draft4/items.json
   */
  if (schema.items) {
    return JSONSchemaType.TypedArray
  }

  if (schema.enum && schema.tsEnumNames) {
    return JSONSchemaType.NamedEnum
  }
  if (schema.enum) {
    return JSONSchemaType.UnnamedEnum
  }
  if (schema.properties || schema.additionalProperties) {
    return JSONSchemaType.NamedSchema
  }
  if (schema.$ref) {
    return JSONSchemaType.Reference
  }
  switch (schema.type) {
    case 'array': return JSONSchemaType.UntypedArray
    case 'boolean': return JSONSchemaType.Boolean
    case 'integer': return JSONSchemaType.Number
    case 'number': return JSONSchemaType.Number
    case 'null': return JSONSchemaType.Null
    case 'object': return JSONSchemaType.Object // TODO: is this ok?
    case 'string': return JSONSchemaType.String
  }
  if (Array.isArray(schema.type)) {
    return JSONSchemaType.Union
  }
  if (!isPlainObject(schema)) {
    return JSONSchemaType.Literal
  }
  if (isPlainObject(schema)) {
    return JSONSchemaType.AnonymousSchema
  }
  return JSONSchemaType.Any
}
