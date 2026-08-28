// Array-form `items` (a tuple) and `additionalItems`. Drafts 4 through 2019-09 say an absent
// `additionalItems` means extra items are allowed (it defaults to the empty schema), so `absent*`
// should read exactly like `true*`. With `maxItems`, whatever `additionalItems` allows is spelled
// out up to the cap; `additionalItems: false` allows nothing past the tuple's own items.
const items = [{type: 'string'}, {type: 'number'}]

const cases = (suffix: string, extra: object) => ({
  [`absent${suffix}`]: {type: 'array', items, ...extra},
  [`true${suffix}`]: {type: 'array', items, additionalItems: true, ...extra},
  [`false${suffix}`]: {type: 'array', items, additionalItems: false, ...extra},
  [`schema${suffix}`]: {type: 'array', items, additionalItems: {type: 'boolean'}, ...extra},
})

export const input = {
  title: 'AdditionalItems',
  type: 'object',
  properties: {
    ...cases('', {}),
    ...cases('MinItems1', {minItems: 1}),
    ...cases('MinItems3', {minItems: 3}),
    ...cases('MaxItems1', {maxItems: 1}),
    ...cases('MaxItems4', {maxItems: 4}),
    ...cases('MinItems1MaxItems4', {minItems: 1, maxItems: 4}),
  },
  additionalProperties: false,
}
