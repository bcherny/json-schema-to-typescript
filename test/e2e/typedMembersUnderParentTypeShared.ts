// The typed twin of anyOfInheritsParentTypeShared: one member object (a YAML anchor through the
// CLI, or a programmatic caller reusing an object) sits under parents of different types and is
// also a property of its own. Each parent narrows its own copy; the object itself, its member
// list, and the other parents' view of it are untouched.
const nullableShortStringOrObject = {
  type: ['object', 'null', 'string'],
  anyOf: [{type: 'null'}, {type: 'string', maxLength: 3}, {type: 'object', properties: {a: {type: 'string'}}}],
}

export const input = {
  type: 'object',
  properties: {
    asObject: {type: 'object', oneOf: [nullableShortStringOrObject]},
    asString: {type: 'string', oneOf: [nullableShortStringOrObject]},
    asIs: nullableShortStringOrObject,
    asNullableObject: {type: ['object', 'null'], anyOf: [nullableShortStringOrObject]},
  },
  additionalProperties: false,
}
