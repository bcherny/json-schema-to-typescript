export const input = {
  "title": "AnyOf",
  "type": "object",
  "properties": {
    "foo": {
      'type': 'object',
      anyOf: [
        {$ref: "#/definitions/stra'nge#name"},
        {$ref: "#/definitions/keepUPPERCASE"},
        {$ref: "#/definitions/under_score"},
        {$ref: "#/definitions/camelCase"},
        {$ref: "#/definitions/kebab-case"}
      ]
    }
  },
  definitions: {
    "stra'nge#name": {
      properties: {
        "a": { "type": "string" },
        "b": { "type": "integer" }
      },
      additionalProperties: false,
      required: ["a"]
    },
    keepUPPERCASE: {
      properties: {
        a: { "enum": ["a", "b", "c"] },
      }
    },
    under_score: {
      properties: {
        "a": { "type": "boolean" },
      }
    },
    camelCase: {
      properties: {
        "a": { "type": "float" },
      }
    },
    "kebab-case": {
      properties: {
        "a": { "type": "string" },
      }
    }

  }
}
