declare module JSONSchema {

  interface Rule {
    $ref?: string
    description?: string
    enum?: Type[]
    items?: Rule
    minimum?: number
    minItems?: number
    maxLength?: number
    minLength?: number
    allOf?: Rule[]
    anyOf?: Rule[]
    oneOf?: Rule[]
    type: Type
    uniqueItems?: boolean
    [a: string]: Object
  }

  type Type = "array"|"boolean"|"integer"|"null"|"number"|"object"|"string"

  interface Schema {
    additionalProperties?: boolean
    description?: string
    properties: {
      [a: string]: Rule
    }
    required?: string[]
    title?: string
    type: "array"|"object"
  }

}