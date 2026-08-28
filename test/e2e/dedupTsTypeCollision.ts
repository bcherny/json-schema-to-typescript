// Two properties share a title but have different tsType overrides → distinct names (Shared, Shared1).
export const input = {
  title: 'DedupTsTypeCollision',
  type: 'object',
  properties: {
    a: {
      title: 'Shared',
      tsType: 'Record<string, string>',
    },
    b: {
      title: 'Shared',
      tsType: 'Record<string, number>',
    },
  },
}
