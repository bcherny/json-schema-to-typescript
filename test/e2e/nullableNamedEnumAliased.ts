// One schema object used in two places by JavaScript identity rather than by `$ref` (as a YAML
// anchor through the CLI, or a programmatic caller, produces): a titleless nullable enum with
// `tsEnumNames`, reachable both through the parent's `allOf` and as a named property. Pins
// today's output, which depends on the order the normalizer reaches the two uses in. See
// nullableNamedEnum.ts / nullableNamedEnumTitleless.ts for the `$ref` and single-use cases.
const status = {type: 'string', enum: ['on', 'off'], tsEnumNames: ['On', 'Off'], nullable: true}

export const input = {
  title: 'NullableNamedEnumAliased',
  type: 'object',
  allOf: [status],
  properties: {status},
  additionalProperties: false,
}
