# Changelog

*Note: This is a partial changelog, covering significant & breaking changes. For a full list of changes, please consult the [commit log](https://github.com/bcherny/json-schema-to-typescript/commits).

## 17.0.0

Sixteen fixes and three new options merged since 16.0.0. Ten of the fixes change the types emitted for schemas that already compiled, which is why this is a major; the list below says what moves. If you pin `^16`, nothing here reaches you until you bump.

May change emitted types for existing schemas:

- 20bf334 Bugfix: `anyOf`/`oneOf`/`allOf` members that carry only a `required` list (the json-schema.org "factoring" pattern, used by the OpenAPI 3.1 meta-schema) now pick the listed keys from the enclosing schema's `properties` and mark them required, instead of emitting `{[k: string]: unknown}`; a `required` list next to an `allOf`/`anyOf`/`oneOf` whose members declare the key now adds `& {key: T}` (#784 with #788, fixes #567, #513, #381, #395)
- 8e65b2a Bugfix: `unevaluatedProperties` (draft 2019-09+) is honoured like `additionalProperties`: `false` closes the object, a schema types the index signature, an explicit `additionalProperties` still wins. Keys contributed only through a `$ref` with siblings, `if`/`then`/`else` or `dependentSchemas` are not seen, so such an object is emitted closed without them (#782, re-host of #738 by @Neal006, fixes #442)
- 4f16172 Bugfix: An object with `additionalProperties: false` and no properties emits `{[k: string]: never}` (only the empty object) instead of `{}` (any non-nullish value); with the global `additionalProperties: false` option this applies to every bare `{type: 'object'}` (#781, re-host of #700 by @Souptik96, fixes #486, #557)
- 9a04298 Bugfix: A schema made of annotation keywords only (`description`, `title`, `deprecated`; no `type`, `properties` or `$ref`) emits `unknown`, like `{}`, instead of `{[k: string]: unknown}` — eg. FHIR's `text.div`, Azure's `properties` (#791 = #707, fixes #432, #654)
- 0d0399d Bugfix: Untyped `anyOf`/`oneOf` members (`{format: 'hostname'}`, `{pattern: …}`, `{minimum: …}`) under a `string`/`number`/`integer`/`boolean`/`null`/`array` parent inherit the parent's `type`, so `{type: 'string', anyOf: [{format: 'hostname'}, {format: 'ipv6'}]}` is `string` rather than `{[k: string]: unknown} & string`; `$ref` members and `object` parents are unchanged (#774, from draft #710, fixes #528)
- e38ee55 Bugfix: An explicit `type` takes precedence over the type implied by `default`: `{type: 'integer', default: '30'}` emits `number`, previously `number & string` (#772, from draft #715, fixes #434)
- ccfe00d Bugfix: In a closed object whose `minProperties` is at least the number of declared properties, every property is emitted required (#771, re-host of #737 by @Neal006, fixes #565)
- d2988f2 Bugfix: A property that pairs `$ref` with `tsType` no longer produces a self-referential `export type X = X` plus a renamed `X1` for the real definition; the definition keeps its name (#767, from draft #712, fixes #466)
- 93a1ac9 Bugfix: An array whose `items` is a `maxItems`-bounded array emits `([] | [string] | [string, string])[]` instead of `[] | [string] | [string, string][]` (which rejected valid data); the same union inside an `allOf` is parenthesized too. A bounded array as an `anyOf` member keeps its own parentheses (type-identical) (#769)
- 2c1b9f1 Bugfix: The `description` of an anonymous `oneOf`/`anyOf`/`allOf` member is kept as a JSDoc comment above that member instead of being dropped. Comments only; the types are unchanged, except that two compound members differing only in a description are no longer deduplicated (#773, from draft #716, fixes #419)

New:

- 8f778ac Feat: `formatTypes` option maps a string schema's `format` to a TypeScript type, eg. `{'date-time': 'Date'}` (CLI: `--formatTypes.date-time=Date`). Off by default; no output change unless set (#792, closes #183)
- d86f285 Feat: `declarationStyle: 'type'` (CLI: `--declarationStyle type`) emits object types as `export type A = {…}` instead of `export interface A {…}`; `extends` becomes an intersection. The default `'interface'` leaves output unchanged apart from one whitespace fix (a JSDoc block that followed a closing brace on the same line now starts on its own line) (#793, closes #307, #653)
- be6199b Feat: `removeOptionalIfDefaultExists` option (CLI: `--removeOptionalIfDefaultExists`) emits a property that has a `default` as required. Off by default (#780, re-host of #673 by @sortA0329, fixes #558)

Fixes for crashes, options and the CLI (no change to default output for schemas that compiled):

- 8d04fc6 Bugfix: A cyclic schema that parses as an intersection (json.schemastore.org/web-types) no longer crashes with "Cannot read properties of undefined (reading 'push')" (#770, re-host of #735 by @Neal006, fixes #649)
- 1313d75 Bugfix: `unreachableDefinitions` declares definitions whatever the root schema's type is; a non-object root (`type: number`, an array, `anyOf`, a bare `$ref`) used to drop them all (#778, from draft #714, fixes #439)
- cb58dd6 Bugfix: `declareExternallyReferenced: false` also suppresses externally-referenced named type aliases (reached through a root union, intersection, tuple, array or leaf), not only interfaces (#768, re-host of #734 by @Neal006, fixes #525)
- 0e85c7a Bugfix: A property named like an annotation keyword (eg. `deprecated`) inside `if`/`then`/`else` no longer fails validation with "deprecated must be a boolean" (#764, re-host of #739 by @joyheroes, fixes #626)
- e57fa95 Bugfix: OpenAPI `nullable: true` next to a `$ref` inside a file that is itself reached through a `$ref` now compiles to `X | null` like it does in the root file (#776 with #777; follow-up to #755)
- 44740f2 Bugfix (CLI): `--style.singleQuote false`, `--style.singleQuote=false` and `--no-style.singleQuote` all work instead of throwing "Invalid singleQuote value" (#766, re-host of #709 by @jackwalkerlabs, fixes #199)

Other:

- cb79bfe, 8ccaa9d, 3d17d5b Perf: faster naming when many schemas share a title or definition name, union members are not re-rendered when none is named, and the normalizer walks the schema once per group of rules instead of once per rule. Generated output is unchanged (#787, #786, #785)
- 188cf89 The repository's own tooling (install, scripts, tests, CI) moved from npm to bun; see CONTRIBUTING.md. The published package, its `dependencies` and `engines` are unchanged (#762, #763)
- af4a236 Internal: one keyword table replaces six hand-kept keyword lists; no output change, except that an (invalid) array-valued `dependencies` no longer crashes (#775)

## 16.0.0

This release collects the fixes and small features merged since 15.0.4. Several of them correct types that were previously emitted wrong, so existing schemas may generate different output; hence the major version.

New:

- e3c7776 Feat: Support OpenAPI 3.0 `nullable: true`, including next to a `$ref`; such schemas now emit `T | null` (#755, fixes #410)
- ab31f41 Feat: Support draft-3 / Swagger 2 property-level `required: true`; such properties are now emitted as required (#756, fixes #440, #6)
- 111c187 Feat: Resolve draft-07 named-anchor `$ref`s (`"#name"` matching a sibling `$id: "#name"`) instead of crashing (#744, fixes #220)

May change emitted types for existing schemas:

- efceb64 Bugfix: Multiple `patternProperties` (or `patternProperties` with `additionalProperties: false`) are folded into one index signature typed as the union of their value types, instead of being dropped (#754, fixes #160, #315)
- b84b3da Bugfix: `allOf` members made up only of unsupported keywords (eg. `if`/`then`, `not`) no longer add a stray `{[k: string]: unknown}` to the intersection (#743, fixes #369)
- d8618e5 Bugfix: `properties`/`patternProperties` on a nested schema were dropped when combined with `oneOf`/`anyOf`/`allOf`; they are now intersected with the compound type (#708, fixes #630)
- 4eee0f1 Bugfix: `$ref`s to definitions with dotted names (eg. `#/definitions/v1.ManagedFieldsEntry`) were truncated at the first dot (`V1`); the full name is now used (`V1ManagedFieldsEntry`) (#705, fixes #645)
- 7a3dd8e Bugfix: Nested arrays with `minItems`/`maxItems` are capped by the cumulative product of their bounds against `maxItems`, falling back to an unbounded array instead of hanging or emitting enormous tuple unions (#703, fixes #690)
- 34a692c Bugfix: `type: null` (the JSON null value) is treated as `type: "null"` instead of as an untyped object (#702, fixes #667)
- 0f9d309 Bugfix: `unreachableDefinitions` now declares definitions even when `declareExternallyReferenced` is off (#706, fixes #652)
- 1900e1f Bugfix: With `inferStringEnumKeysFromValues`, a `const` is emitted as a literal type again rather than a single-member enum (#701, fixes #666)
- 606e359 Bugfix: A schema with an array `type` and `properties` (eg. `type: ['object', 'null']`) at the root or as an untitled definition compiled to `A & (A | null)`, making the non-object members unreachable; it now emits `A | null` (#753, supersedes #672)
- c73ea75 Bugfix: An empty schema inside `allOf` (eg. `allOf: [{$ref: '#/definitions/User'}, {}]`) collapsed the whole intersection to `unknown`; the empty member is now dropped and `User` is kept (#752, fixes #654)
- 9c50776 Bugfix: The `description` of an inline `items` schema is no longer dropped; it is added to the JSDoc of the array's declaration as an `Items: ...` paragraph (#751, fixes #660)

Fixes for crashes and output that did not compile:

- b25c768 Bugfix: A root-level `$ref` to a definition that is itself only a `$ref` no longer crashes with "Refs should have been resolved by the resolver!" (#741, fixes #740)
- b25c768 Bugfix: A root-level `$ref` to a definition that refers back to itself (directly or through `items`/`properties`) compiles instead of crashing with the same error (#741, fixes #132, #730). The referenced definition is still emitted as its own interface alongside the root type
- 107dd42 Bugfix: Index signatures from `patternProperties`/`additionalProperties` are widened to cover sibling named properties, so the interface typechecks (TS2411). Index signatures that already typechecked are emitted type-equivalent to before (#704, fixes #671)
- a2234d3 Bugfix: `inferStringEnumKeysFromValues` no longer produces invalid enum members for non-string, empty or digit-leading values (#694, fixes #657)
- 377c6a1 Bugfix: A named enum (`tsEnumNames`) in a position with no name no longer emits a nameless `enum` declaration; it degrades to a union of literals (#693, fixes #691)
- c44faed Bugfix: Generated type names can no longer start with a digit or collapse to an empty name (#698, fixes #640)
- 8d8a141 Bugfix: Recursive schemas that reach the generator without a name (a self-referencing `$ref` with a sibling keyword such as `description`, a recursive `oneOf` under `components/schemas`, an untitled recursive schema in another file) are given a generated type name instead of overflowing the stack. Schemas that compiled before are unchanged, except that an anonymous recursive union with a `{}`/`true` member now keeps its alias (same type, one extra `export type`) (#760, fixes #482, #614)

Other:

- bf06bbb Bugfix (CLI): Piping a schema on stdin no longer prints a `DEP0187` deprecation warning on Node 24 (#750)
- 3abde40 Perf: `compile()` no longer scans every definition once per parsed node; schemas with thousands of definitions compile much faster (schemastore's CloudFormation schema: ~54 s -> ~3 s). Generated output is unchanged (#759)
- b88891c Perf: Formatting large, mostly quote-free outputs is several times faster (prettier is told the output is a `.d.ts`, so it skips its JSX-detection scan); a caller's own `style.filepath` still wins. Generated output is unchanged (#758)
- 16c2e77 Bugfix (CLI): relative `$ref`s are resolved against each schema file's own directory rather than `process.cwd()`, so a schema passed by path from another directory finds its siblings; an explicit `--cwd` still wins (#742, fixes #324, #680)
- 9219636 Updated runtime dependencies: js-yaml 4 -> 5 (YAML files parse as before, #689), prettier ^3.9 (short unions that fit on one line are no longer wrapped; users on the existing `^3.2.5` range may already see this), @apidevtools/json-schema-ref-parser ^11.9 (#686)
- a5834aa Removed the `is-glob` dependency (#643)

## 15.0.4

- 18831cb Bugfix: Quote enum keys that contain special characters (#648)

## 15.0.1 - 15.0.3

- Dependency housekeeping, no change to generated output: removed mkdirp and an unused dependency, moved cli-color to devDependencies, switched CLI globbing to tinyglobby (#617, #618, #625, #639)

## 15.0.0

- 62cc052 Fixed bug where intersection schemas didn't generate complete types. Improved output readability for intersection types (#603)

## 14.1.0

- 3e2e1e9 Added `inferStringEnumKeysFromValues` option (#578)

## 14.0.5

- b7fee29 Added .yaml support for CLI (#598)

## 14.0.2

- 9ec0c70 Added .yaml support (#577)

## 14.0.1

- 2f29f19 Added `customName` option

## 14.0.0

- 967eb13 Require Node v16+

## 13.1.0

- f797848 Feat: Add support for `deprecated` keyword

## 13.0.1

- b13a6f2 Bugfix: Boolean CLI flags were not respected (#524)

## 13.0.0

- 05b0103 Bugfix: Parse boolean schemas as schemas, rather than as literals (#515)
- 8f973d1 Bugfix: Fix edge case where emitted names were corrupted when using `strictIndexSignature` (#423)

## 12.0.0

- b73e1c7 Bugfix: Parse enums as literals, rather than as schemas (#508)

## 11.0.0

This is a major release with lots of bugfixes, some of which may change emitted types.

- 2ca6e50 Bugfix: Fix crash that may happen when emitting types for cyclical schemas (#323, #376)
- 8fa728e Bugfix: Fix tests on Windows, make snapshot ordering consistent
- b78a616 Bugfix: Make `compile()` non-mutating (#370, #443)
- a89ffe1 Bugfix: Add maximum size heuristic for tuple types (#438)
- 6fbcbc8 Bugfix: Improve performance & stability issue caused by JSON serialization (#422)
- 7aa353d Feat: Add support for `$id` (#436)
- 59747b1 Feat: Add support for specifying a default for `additionalProperties` (#335)
- 966cca5 Cleanup: Drop support for Node 10


## 10.1.0

- ec78099 Feat: Add support for JSON Schema `const` and `$defs` keywords (#263)

## 10.0.0

Lots of bugfixes, some of which may be breaking changes.

- 4aabd23 Bugfix: Correctly generate intersection types when a schema combines multiple JSON Schema directives (eg. `properties` and `allOf`) (#157, #243, #256, #314)
- 3a45990 Bugfix: Referenced schemas are now correctly normalized, improving emitted type declarations for some kinds of referenced schemas with properies using `minItems` or `maxItems`
- 800c076 1ec105d Bugfix: Fix bugs where complex unions were partially emitted in some cases (#277, #320, #326, #327)
- 828cc05 Bugfix: Fixed an issue where enum names were sometimes incorrectly generated (#339)
- e038017 Bugfix: Fixed an issue where union member names and comments were incorrect or omitted in some cases (#329)
- 2b406f9 Bugfix: Fixed an issue where base types were not deduped before emission when using `extends` (#322)
- 47036f5 ba4aa65 Perf: Significant performance improvements

## 9.1.0

- d88a514 Bugfix: Improve deduping logic for `anyOf` (#273)
- 8f3f101 Bugfix: Multiple fixes for CLI
- d0ad44b Perf: Improve normalizer performance (#286)

## 9.0.0

This release brings improved typesafety, thorough testing of all supported NodeJS version and operating systems on CI, and bugfixes.

- 105d239 Feat: Emit `unknown` instead of `any` by default
- 8f0b1bc Feat: Add `unknownAny` CLI option (#281)
- 375dfd2 Bugfix: Fix generated type names to increment counters, instead of appending when we're unable to infer a type's name
- 7f52f98 Drop support for NodeJS <10

## 8.2.0

- a0257d8 Feat: Add support for directories and globs as inputs (#238)

## 8.1.0

- 1d24618 Feat: Add `ignoreMinAndMaxItems` CLI option, defaulting to false (#274)

## 8.0.0

- e144890 Bugfix: Improve generated output when mixing nulls and unions (#261)

## 7.1.0

- ddbd627 Feat: Add `strictIndexSignatures` CLI option, defaulting to false (#252)

## 7.0.0

- b9c4bcb Feat: Add support for `additionalItems` for tuple types
- c5f4f03 Feat: Add support for `minItems` and `maxItems`

## 6.1.0

- 57f759f Feat: Add `@tslint` directive to disable linting for generated files by default (#192)

## 6.0.0

- b7737b7 Bugfix: Improve generated type & interface names to take input casing into account (#159)

## 5.7.0

- f1f4030 Feat: Add `tsType` schema extension to allow custom TypeScript types (#168)
- 8599262 Feat: Add support for passing custom options when resolving `$ref`s (#180)
- 25ef03b Feat: Improve error output for certain kinds of errors (#188)

## 5.6.0

- 923dbfc Feat: Add declarations for tuple types (#184)

## 5.4.0

- fc8540f Feat: Add partial support for `patternProperties`
- 9167902 Feat: Add declarations for enums referenced by arrays (#146)

## 5.3.0

- 83e4a29 Feat: Add support for passing options in CLI

## 5.2.0

- 9187237 Feat: Add support for generating typings from `definitions` that are not directly referenced by a schema (#133)
- 7d864b9 Feat: Add support for generating typings from `patternProperties` (#124)

## 5.0.0

- f59a837 Feat: Use [Prettier](prettier.io) for code formatting (#118)
- 43484fc Debug: Use [Ava Snapshot testing](https://github.com/avajs/ava#snapshot-testing) for testing output (#45)
