// https://github.com/bcherny/json-schema-to-typescript/issues/386
// A `title` equal to a global (`Symbol`, likewise `Array`, `Object`, `Promise`…)
// becomes the standalone type name verbatim — `export type Symbol = string` —
// shadowing the global for the whole file (and tripping @typescript-eslint's
// ban-types). generateName() only de-dupes against names used in this run; there
// is no reserved list. Expected output is hand-written from the issue (`Symbol1`,
// the counter suffix generateName already applies to duplicates); which names to
// reserve, and whether behind an option, is a maintainer decision.
export const input = {
  title: 'Currency',
  type: 'object',
  properties: {
    displaySymbol: {title: 'Symbol', type: 'string'},
  },
}
