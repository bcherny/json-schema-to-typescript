/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/567
 * "Factoring" pattern: the properties are declared once on the parent and
 * each `anyOf` branch only lists which of them are `required`. On master each
 * branch is parsed in isolation, sees no properties, and degenerates to
 * `{[k: string]: unknown}`; the union of those is then intersected with the
 * all-optional parent interface, so the requiredness is lost entirely:
 *   export type Assortment = {[k: string]: unknown} & {id?: string; validFrom?: string; validTo?: string}
 * Expected: each branch becomes a pick of the parent's declared properties
 * with that branch's `required` applied, and the union of those picks is
 * intersected with the (all-optional) parent interface -- the shape the
 * maintainer gave as expected output on #513:
 *   export type Assortment = ({id: string; validFrom: string} | {id: string; validTo: string}) & {id?: string; ...}
 */
export const input = {
  title: 'Assortment',
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {type: 'string'},
    validFrom: {type: 'string'},
    validTo: {type: 'string'},
  },
  anyOf: [{required: ['id', 'validFrom']}, {required: ['id', 'validTo']}],
}
