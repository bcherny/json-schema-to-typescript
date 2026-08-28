// Build input in JS so the SAME sub-schema object instance is referenced from two properties
// (shared object, not cyclic) and a third structurally-identical inline copy.
// All three should dedupe to one name.
const shared = {
  title: 'Tag',
  type: 'string' as const,
  minLength: 1,
}

export const input = {
  title: 'DedupSharedSubObject',
  type: 'object',
  properties: {
    // shared instance referenced twice
    tagA: shared,
    tagB: shared,
    // structurally identical inline copy
    tagC: {
      title: 'Tag',
      type: 'string' as const,
      minLength: 1,
    },
  },
}
