/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/567
 * "Factoring" pattern: the properties are declared once on the parent and
 * each `anyOf` branch only lists which of them are `required`. On master each
 * branch is parsed in isolation, sees no properties, and degenerates to
 * `{[k: string]: unknown}`; the union of those is then intersected with the
 * all-optional parent interface, so the requiredness is lost entirely:
 *   export type Assortment = {[k: string]: unknown} & {id?: string; validFrom?: string; validTo?: string}
 * The snapshot entry for this case holds the reporter's expected union (one
 * member per branch, that branch's `required` applied to the parent's
 * properties). The exact shape is a maintainer decision (see Boris's
 * 2026-08-03 comment on the issue); the same collapse is already recorded as
 * accepted output in oneOfWithRequiredAndProperties.ts (#630), which a fix
 * would change too.
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
