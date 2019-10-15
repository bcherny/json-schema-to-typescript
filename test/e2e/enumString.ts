export const input = {
  "title": "enumStringTest",
  "type": "object",
  "properties": {
    "stringEnum": {
      "type": "string",
      "enum": ["a", "b", "c"]
    }
  },
  required: ['stringEnum'],
  additionalProperties: false
}

export const options = {
  enableStringEnums: true
}
