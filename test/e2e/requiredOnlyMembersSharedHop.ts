/**
 * @see https://github.com/bcherny/json-schema-to-typescript/pull/784
 * A required-only `oneOf` that is not itself under an object, but `$ref`erenced into the `allOf`
 * of two objects whose properties have different types. After dereferencing it is one schema node
 * with two parents, parsed (and cached) once, so it cannot borrow `a`/`b` from either object: it
 * must come out the same as on master under both, whichever of them the linker reaches first --
 * `later` declares the shared node after the objects that use it, `earlier` before them.
 */
const choice = () => ({oneOf: [{required: ['a']}, {required: ['b']}]})
const objects = (ref: string) => ({
  x: {type: 'object', properties: {a: {type: 'string'}, b: {type: 'number'}}, allOf: [{$ref: ref}]},
  y: {type: 'object', properties: {a: {type: 'number'}, b: {type: 'string'}}, allOf: [{$ref: ref}]},
})
export const input = {
  title: 'RequiredOnlyMembersSharedHop',
  type: 'object',
  properties: {
    later: {type: 'object', properties: objects('#/properties/later/zChoice/AOrB'), zChoice: {AOrB: choice()}},
    earlier: {aChoice: {AOrB: choice()}, type: 'object', properties: objects('#/properties/earlier/aChoice/AOrB')},
  },
  additionalProperties: false,
}
