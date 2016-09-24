export var schema = {
  "title": "Enum",
  "type": "object",
  "properties": {
    "aStringEnum": {
      "type": "string",
      "enum": ["a", "b", "c"]
    },
    "anImpliedStringEnum": {
      "enum": ["a", "b", "c"]
    },
    "aBooleanEnum": {
      "type" : "boolean",
      "enum": [ true ]
    },
    "anImpliedBooleanType": {
      "enum": [ true ]
    },
    "anIntegerEnum": {
      "type": "integer",
      "enum": [1, 2, 3],
      "tsEnumNames": ["One","Two","Three"]
    },
    "anImpliedIntegerEnum": {
      "enum": [4, 5, 6],
      "tsEnumNames": ["Four","Five","Six"]
    }
  },
  "required": ["aStringEnum", "anImpliedStringEnum", "aBooleanEnum", "anImpliedBooleanType", "anIntegerEnum", "anImpliedIntegerEnum"],
  "additionalProperties": false
}

export var configurations = [false, true].map(useConstEnums => {
  return {
    settings: {
      useConstEnums: useConstEnums
    },
      types: [
      `export${useConstEnums ? ' const ' : ' '}enum AnIntegerEnum {`,
      '  One = 1,',
      '  Two = 2,',
      '  Three = 3',
      '}',
      `export${useConstEnums ? ' const ' : ' '}enum AnImpliedIntegerEnum {`,
      '  Four = 4,',
      '  Five = 5,',
      '  Six = 6',
      '}',
      'export interface Enum {',
      '  aStringEnum: "a" | "b" | "c";',
      '  anImpliedStringEnum: "a" | "b" | "c";',
      '  aBooleanEnum: true;', // Note, type is `true` and not boolean (the enumeration disallows `false`)
      '  anImpliedBooleanType: true;', // Note, type is `true` and not boolean (the enumeration disallows `false`)
      '  anIntegerEnum: AnIntegerEnum;',
      '  anImpliedIntegerEnum: AnImpliedIntegerEnum;',
      '}'
      ].join('\n')
  }
})
