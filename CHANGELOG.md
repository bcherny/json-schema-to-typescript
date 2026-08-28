# Changelog

*Note: This is a partial changelog, covering significant & breaking changes. For a full list of changes, please consult the [commit log](https://github.com/bcherny/json-schema-to-typescript/commits).

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

Fixes for crashes and output that did not compile:

- b25c768 Bugfix: A root-level `$ref` to a definition that is itself only a `$ref` no longer crashes with "Refs should have been resolved by the resolver!" (#741, fixes #740)
- b25c768 Bugfix: A root-level `$ref` to a definition that refers back to itself (directly or through `items`/`properties`) compiles instead of crashing with the same error (#741, fixes #132, #730). The referenced definition is still emitted as its own interface alongside the root type
- 107dd42 Bugfix: Index signatures from `patternProperties`/`additionalProperties` are widened to cover sibling named properties, so the interface typechecks (TS2411). Index signatures that already typechecked are emitted type-equivalent to before (#704, fixes #671)
- a2234d3 Bugfix: `inferStringEnumKeysFromValues` no longer produces invalid enum members for non-string, empty or digit-leading values (#694, fixes #657)
- 377c6a1 Bugfix: A named enum (`tsEnumNames`) in a position with no name no longer emits a nameless `enum` declaration; it degrades to a union of literals (#693, fixes #691)
- c44faed Bugfix: Generated type names can no longer start with a digit or collapse to an empty name (#698, fixes #640)

Other:

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
