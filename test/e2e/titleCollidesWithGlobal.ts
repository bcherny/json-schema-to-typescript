// https://github.com/bcherny/json-schema-to-typescript/issues/386
// A `title` equal to a reserved built-in (`Symbol`, `Array`) gets the counter suffix a duplicate
// would (`Symbol1`, then `Symbol2`) instead of shadowing the global for the whole file;
// built-ins off the reserved list (`Date`) are left as the schema author wrote them.
export const input = {
  title: 'Currency',
  type: 'object',
  properties: {
    displaySymbol: {title: 'Symbol', type: 'string'},
    nativeSymbol: {title: 'Symbol', type: 'string', maxLength: 1},
    denominations: {title: 'Array', type: 'array', items: {type: 'number'}},
    introduced: {title: 'Date', type: 'string', format: 'date'},
  },
}
