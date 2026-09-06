// A titleless `enum` with `tsEnumNames` among an array's items is declared under the
// array's name plus `Items`: `RolesItems` for the property `roles`, `ColourItems` for
// the definition `Colour`, `PaletteItems` for an array titled `Palette` (enumInArray.ts
// covers the property case). A nullable array (`type: ['array', 'null']`, or OpenAPI
// `nullable: true`, which the normalizer rewrites as `anyOf` with `null`) and an array
// that is an `anyOf`/`oneOf` branch, an `allOf` member or a tuple slot name their items
// the same way, after the key or name the position sits under: the enum's name never
// collides with the property's own, unlike a bare enum in a branch
// (enumWithTsEnumNamesInUnnamedPosition.ts).
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
    branch: {
      anyOf: [{type: 'array', items: {type: 'string', enum: ['a', 'b'], tsEnumNames: ['A', 'B']}}, {type: 'number'}],
    },
    slot: {
      type: 'array',
      items: [{type: 'array', items: {type: 'string', enum: ['p', 'q'], tsEnumNames: ['P', 'Q']}}],
    },
  },
  required: ['colours', 'titled', 'nullable', 'openapiNullable', 'branch', 'slot'],
  additionalProperties: false,
}
