# Changelog

*Note: This is a partial changelog, covering significant & breaking changes. For a full list of changes, please consult the [commit log](https://github.com/bcherny/json-schema-to-typescript/commits).

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
