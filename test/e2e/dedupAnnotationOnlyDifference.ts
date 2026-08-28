// Two same-titled schemas identical except `description` → dedupe to ONE name.
export const input = {
  title: 'DedupAnnotationOnlyDifference',
  type: 'object',
  properties: {
    a: {
      title: 'Item',
      type: 'string',
      description: 'First item description',
    },
    b: {
      title: 'Item',
      type: 'string',
      description: 'Second item description — differs only in annotation',
    },
  },
}
