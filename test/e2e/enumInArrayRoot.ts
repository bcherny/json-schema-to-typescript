// A root array of a titleless `enum` with `tsEnumNames`: the items take the root's
// name plus `Items`, so the enum is declared as `EnumInArrayRootItems`
export const input = {
  type: 'array',
  items: {type: 'string', enum: ['on', 'off'], tsEnumNames: ['On', 'Off']},
}
