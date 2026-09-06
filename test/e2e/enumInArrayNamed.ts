// A titleless `enum` with `tsEnumNames` among an array's items is declared under the
// array's name plus `Items`: `RolesItems` for the property `roles`, `ColourItems` for
// the definition `Colour`, `PaletteItems` for an array titled `Palette` (enumInArray.ts
// covers the property case); a nullable array (`type: ['array', 'null']`) names its
// items the same way. An array with neither key nor name, an `anyOf` branch, gives its
// items no name, so the enum degrades to a union of literals, as it does in any other
// unnamed position (enumWithTsEnumNamesInUnnamedPosition.ts); an OpenAPI `nullable: true`
// array is such a branch once the normalizer has rewritten it as `anyOf` with `null`.
export const input = {
  title: 'EnumInArrayNamed',
  type: 'object',
  definitions: {
    Colour: {
      type: 'array',
      items: {type: 'string', enum: ['red', 'blue'], tsEnumNames: ['Red', 'Blue']},
    },
  },
  properties: {
    colours: {$ref: '#/definitions/Colour'},
    titled: {
      title: 'Palette',
      type: 'array',
      items: {type: 'string', enum: ['warm', 'cool'], tsEnumNames: ['Warm', 'Cool']},
    },
    nullable: {
      type: ['array', 'null'],
      items: {type: 'string', enum: ['x', 'y'], tsEnumNames: ['X', 'Y']},
    },
    openapiNullable: {
      title: 'Sizes',
      type: 'array',
      nullable: true,
      items: {type: 'string', enum: ['s', 'm'], tsEnumNames: ['S', 'M']},
    },
    unnamed: {
      anyOf: [{type: 'array', items: {type: 'string', enum: ['a', 'b'], tsEnumNames: ['A', 'B']}}, {type: 'number'}],
    },
  },
  required: ['colours', 'titled', 'nullable', 'openapiNullable', 'unnamed'],
  additionalProperties: false,
}
