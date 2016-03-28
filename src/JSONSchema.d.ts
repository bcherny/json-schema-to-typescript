declare module JSONSchema {

  interface Schema {
    $ref?: string
    additionalProperties?: boolean|Schema
    definitions?: {
      [a: string]: Schema
    }
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
    properties?: {
      [a: string]: Schema
    }
    required?: string[]
    title?: string
    type?: Type
    uniqueItems?: boolean
  }

  type Type = "array"|"boolean"|"integer"|"null"|"number"|"object"|"string"

}