declare module JSONSchema {

  interface Schema {
    $ref?: string
    additionalProperties?: boolean|Schema
    description?: string
    enum?: (Schema|Type)[]
    items?: Schema
    minimum?: number
    minItems?: number
    maxLength?: number
    minLength?: number
    allOf?: Schema[]
    anyOf?: Schema[]
    oneOf?: Schema[]
    properties: {
      [a: string]: Schema
    }
    required?: string[]
    title?: string
    type: Type
    uniqueItems?: boolean
    [a: string]: Object
  }

  type Type = "array"|"boolean"|"integer"|"null"|"number"|"object"|"string"

}