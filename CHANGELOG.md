# Changelog

## 8.2.0

- a0257d8 Add support for directories and globs as inputs (#238)

## 8.1.0

- 1d24618 Add `ignoreMinAndMaxItems` CLI option, defaulting to false (#274)

## 8.0.0

- e144890 Improve generated output when mixing nulls and unions (#261)

## 7.1.0

- ddbd627 Add `strictIndexSignatures` CLI option, defaulting to false (#252)

## 7.0.0

- b9c4bcb Add support for `additionalItems` for tuple types
- c5f4f03 Add support for `minItems` and `maxItems`

## 6.1.0

- 57f759f Add @tslint directive to disable linting for generated files by default (#192)

## 6.0.0

- b7737b7 Improve generated type & interface names to take input casing into account (#159)

## 5.7.0

- f1f4030 Add `tsType` schema extension to allow custom TypeScript types (#168)
- 8599262 Add support for passing custom options when resolving `$ref`s (#180)
- 25ef03b Improve error output for certain kinds of errors (#188)

## 5.6.0

- 923dbfc Add declarations for tuple types (#184)

## 5.4.0

- fc8540f Add partial support for `patternProperties`
- 9167902 Add declarations for enums referenced by arrays (#146)

## 5.3.0

- 83e4a29 Add support for passing options in CLI

## 5.2.0

- 9187237 Add support for generating typings from `definitions` that are not directly referenced by a schema (#133)
- 7d864b9 Add support for generating typings from `patternProperties` (#124)

## 5.0.0

- f59a837 Use [Prettier](prettier.io) for code formatting (#118)
- 43484fc Use [Ava Snapshot testing](https://github.com/avajs/ava#snapshot-testing) for testing output (#45)
