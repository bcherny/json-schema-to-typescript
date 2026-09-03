# json-schema-to-typescript [![Build Status][build]](https://github.com/bcherny/json-schema-to-typescript/actions?query=branch%3Amaster+workflow%3ACI) [![npm]](https://www.npmjs.com/package/json-schema-to-typescript) [![mit]](https://opensource.org/licenses/MIT) ![node]

[build]: https://img.shields.io/github/actions/workflow/status/bcherny/json-schema-to-typescript/ci.yml?style=flat-square
[npm]: https://img.shields.io/npm/v/json-schema-to-typescript.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/json-schema-to-typescript.svg?style=flat-square
[node]: https://img.shields.io/badge/Node.js-16+-417e37?style=flat-square

> Compile JSON Schema to TypeScript typings.

## Example

Check out the [live demo](https://borischerny.com/json-schema-to-typescript-browser/).

Input:

```json
{
  "title": "Example Schema",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    },
    "hairColor": {
      "enum": ["black", "brown", "blue"],
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": ["firstName", "lastName"]
}
```

Output:

```ts
export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /**
   * Age in years
   */
  age?: number;
  hairColor?: "black" | "brown" | "blue";
}
```

## Installation

```sh
npm install json-schema-to-typescript
```

## Usage

json-schema-to-typescript is easy to use via the CLI, or programmatically.

### CLI

First make the CLI available using one of the following options:

```sh
# install locally, then use `npx json2ts`
npm install json-schema-to-typescript

# or install globally, then use `json2ts`
npm install json-schema-to-typescript --global

# or install to npm cache, then use `npx --package=json-schema-to-typescript json2ts`
# (you don't need to run an install command first)
```

Then, use the CLI to convert JSON files to TypeScript typings:

```sh
cat foo.json | json2ts > foo.d.ts
# or
json2ts foo.json > foo.d.ts
# or
json2ts foo.yaml foo.d.ts
# or
json2ts --input foo.json --output foo.d.ts
# or
json2ts -i foo.json -o foo.d.ts
# or (quote globs so that your shell doesn't expand them)
json2ts -i 'schemas/**/*.json' -o types/
# or
json2ts -i schemas/ -o types/
```

You can pass any of the options described below (including style options) as CLI flags. Boolean values can be set to false using the `no-` prefix.

The CLI automatically loads the closest [Prettier configuration](https://prettier.io/docs/configuration) for the generated output file (when writing to stdout: for a `.d.ts` next to the input file, or in the working directory for piped input). Explicit `--style.*` flags take precedence over discovered settings, and the output is always parsed as TypeScript whatever `parser` the config names. A Prettier config that cannot be loaded (invalid syntax, a missing plugin) now fails the run. This does not affect the programmatic API.

```sh
# generate code for definitions that aren't referenced
json2ts -i foo.json -o foo.d.ts --unreachableDefinitions
# use single quotes and disable trailing semicolons
json2ts -i foo.json -o foo.d.ts --style.singleQuote --no-style.semi
# pass options to the $ref resolver (quote the flag, so that your shell leaves the `$` alone)
json2ts -i foo.json -o foo.d.ts '--$refOptions.dereference.externalReferenceResolution=root'
```

#### Compiling a directory of schemas that reference each other (experimental)

By default each input file is compiled on its own, so a type that several files reach through a `$ref` is declared again in every output file. With `--imports`, a directory or glob is compiled together: a type that lives in another file of the set becomes an `import type` from that file's module instead of a copy.

```sh
json2ts -i schemas/ -o types/ --imports
```

For example, with `common.json` holding shared definitions, and `a.json` and `b.json` using them and each other:

```json
// schemas/common.json
{
  "title": "Common",
  "type": "object",
  "additionalProperties": false,
  "definitions": {
    "thing": {
      "title": "Thing",
      "type": "object",
      "properties": {"id": {"type": "string"}, "tags": {"type": "array", "items": {"$ref": "#/definitions/tag"}}},
      "required": ["id"],
      "additionalProperties": false
    },
    "tag": {"title": "Tag", "type": "string", "enum": ["red", "green"]}
  }
}
// schemas/a.json
{
  "title": "A",
  "type": "object",
  "properties": {"thing": {"$ref": "common.json#/definitions/thing"}, "partner": {"$ref": "b.json"}},
  "additionalProperties": false
}
// schemas/b.json
{
  "title": "B",
  "type": "object",
  "properties": {"thing": {"$ref": "common.json#/definitions/thing"}, "owner": {"$ref": "a.json"}},
  "additionalProperties": false
}
```

```ts
// types/a.d.ts
import type {B} from "./b.js";
import type {Thing} from "./common.js";

export interface A {
  thing?: Thing;
  partner?: B;
}
// types/b.d.ts
import type {A} from "./a.js";
import type {Thing} from "./common.js";

export interface B {
  thing?: Thing;
  owner?: A;
}
// types/common.d.ts
/**
 * This interface was referenced by `Common`'s JSON-Schema
 * via the `definition` "tag".
 */
export type Tag = "red" | "green";

export interface Common {}
/**
 * This interface was referenced by `Common`'s JSON-Schema
 * via the `definition` "thing".
 */
export interface Thing {
  id: string;
  tags?: Tag[];
}
```

(Without `--imports`, `a.d.ts` and `b.d.ts` each declare their own `Thing`, `Tag`, `A` and `B`, plus a second `A1`/`B1` where the cycle comes back around, and `common.d.ts` declares only `Common`.)

What each file gets:

- What a file can import from another is that file's root type, everything under its `definitions`/`$defs`, and any other named schema its root type reaches. A `$ref` to anything else in it (say `other.json#/properties/x` with no `title`), to a file outside the set, or to a URL, is declared inline as before; so is a `$ref` that carries keywords of its own (eg. a `description`), since it describes a different type. Schemas under other keys, such as OpenAPI's `components/schemas`, are not importable yet.
- Every file's `definitions` are declared whether or not the file uses them (`unreachableDefinitions` is on for the set), so a file's output is what `json2ts thatFile.json --unreachableDefinitions` prints, minus the declarations that now come from an import, plus the `import type` lines.
- Each file keeps the type names it would have on its own; where two files disagree, the import renames (`import type {Thing as Thing1}`). Files that `$ref` each other in a cycle are fine.
- Import paths are relative, from each output file to the other, and end in `.js`, which TypeScript resolves to the `.d.ts` (or `.ts`) next to it under every `moduleResolution` setting.
- Relative `$ref`s resolve against the file they appear in; `--cwd` cannot be combined with `--imports`, and `--imports` needs an output directory.

The same is available programmatically as `compileFiles`, which returns the TypeScript for each file, in order, and writes nothing (the output paths are only used to compute the import paths):

```js
import { compileFiles } from 'json-schema-to-typescript'

const [a, b, common] = await compileFiles(
  [
    {filename: 'schemas/a.json', outputPath: 'types/a.d.ts'},
    {filename: 'schemas/b.json', outputPath: 'types/b.d.ts'},
    {filename: 'schemas/common.json', outputPath: 'types/common.d.ts'},
  ],
  {bannerComment: ''},
)
```

### API

To invoke json-schema-to-typescript from your TypeScript or JavaScript program, import it and call `compile` or `compileFromFile`.

```js
import { compile, compileFromFile } from 'json-schema-to-typescript'

// compile from file
compileFromFile('foo.json')
  .then(ts => fs.writeFileSync('foo.d.ts', ts))

// or, compile a JS object
let mySchema = {
  properties: [...]
}
compile(mySchema, 'MySchema')
  .then(ts => ...)
```

See [server demo](example) and [browser demo](https://github.com/bcherny/json-schema-to-typescript-browser) for full examples.

## Options

`compileFromFile` and `compile` accept options as their last argument (all keys are optional):

| key | type | default | description |
|-|-|-|-|
| additionalProperties | boolean | `true` | Default value for `additionalProperties`, when it is not explicitly set |
| bannerComment | string | `"/* eslint-disable */\n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file,\n* and run json-schema-to-typescript to regenerate this file.\n*/"` | Disclaimer comment prepended to the top of each generated file |
| customName | `(LinkedJSONSchema, string \| undefined) => string \| undefined` | `undefined` | Custom function to provide a type name for a given schema
| cwd | string | `process.cwd()` | Root directory for resolving [`$ref`](https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html)s (for `compileFiles`: the directory its relative `filename`s and `outputPath`s are taken from; `$ref`s then resolve against each file) |
| declarationStyle | `'interface' \| 'type'` | `'interface'` | Declare object types as `interface`s (`export interface B extends A {…}`) or as `type` aliases (`export type B = A & {…}`) |
| declareExternallyReferenced | boolean | `true` | Declare external schemas referenced via `$ref`? |
| enableConstEnums | boolean | `true` | Prepend enums with [`const`](https://www.typescriptlang.org/docs/handbook/enums.html#computed-and-constant-members)? |
| inferStringEnumKeysFromValues | boolean | `false` | Create enums from JSON enums with eponymous keys |
| format | boolean | `true` | Format code? Set this to `false` to improve performance. |
| formatTypes | `Record<string, string>` | `{}` | Map from a string schema's [`format`](https://json-schema.org/understanding-json-schema/reference/string#format) to the TypeScript type to emit for it, verbatim, like `tsType` (which still takes precedence, as do `enum` and `const`). Eg. `{ 'date-time': 'Date' }` turns `{ "type": "string", "format": "date-time" }` into `Date` instead of `string`; `nullable`, arrays and `$ref`s follow (`Date \| null`, `Date[]`). Formats you don't list stay `string`. For a type of your own, add its `import` via `bannerComment`. CLI: `--formatTypes.date-time=Date`. |
| ignoreMinAndMaxItems | boolean | `false` | Ignore maxItems and minItems for `array` types, preventing tuples being generated. |
| maxItems | number | `20` | Maximum number of unioned tuples to emit when representing bounded-size array types, before falling back to emitting unbounded arrays. Increase this to improve precision of emitted types, decrease it to improve performance, or set it to `-1` to ignore `maxItems`. |
| readonly | boolean | `false` | Mark every property and index signature `readonly`, and emit every array and tuple type as `readonly T[]`. |
| readonlyKeyword | boolean | `false` | Map the schema's [`readOnly: true`](https://json-schema.org/draft-07/json-schema-validation#rfc.section.10.3) annotation to TypeScript's `readonly`: an annotated property gets the `readonly` modifier, and an annotated array or tuple is emitted as `readonly T[]`. |
| removeOptionalIfDefaultExists | boolean | `false` | Remove the optional modifier when a property has a default value. |
| strictIndexSignatures | boolean | `false` | Append all index signatures with `\| undefined` so that they are strictly typed. |
| style | object | `{ bracketSpacing: false,  printWidth: 120,  semi: true,  singleQuote: false,  tabWidth: 2,  trailingComma: 'none',  useTabs: false }` | A [Prettier](https://prettier.io/docs/en/options.html) configuration |
| undefinedOptionalProperties | boolean | `false` | Append `\| undefined` to the type of every optional property (`age?: number \| undefined`), for consumers that compile with TypeScript's [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes). |
| unknownAny | boolean | `true` | Use `unknown` instead of `any` where possible |
| unreachableDefinitions | boolean | `false` | Generates code for `$defs` that aren't referenced by the schema. |
| $refOptions | object | `{}` | [$RefParser](https://github.com/APIDevTools/json-schema-ref-parser) Options, used when resolving `$ref`s |

## Tests

This repo uses [bun](https://bun.sh) (1.3.9 or later) to install dependencies and run its scripts and tests, so install it first:

```sh
$ bun install
$ bun run test
```

## Features

- [x] `title` => `interface`
- [x] Primitive types:
  - [x] array
  - [x] homogeneous array
  - [x] boolean
  - [x] integer
  - [x] number
  - [x] null
  - [x] object
  - [x] string
  - [x] homogeneous enum
  - [x] heterogeneous enum
- [x] Non/extensible interfaces
- [ ] Custom JSON-schema extensions
- [x] Nested properties
- [x] Schema definitions
- [x] [Schema references](http://json-schema.org/latest/json-schema-core.html#rfc.section.7.2.2)
- [x] Local (filesystem) schema references
- [x] External (network) schema references
- [x] Add support for running in browser
- [x] default interface name
- [x] infer unnamed interface name from filename
- [x] `deprecated`
- [x] `allOf` ("intersection")
- [x] `anyOf` ("union")
- [x] `oneOf` (treated like `anyOf`)
- [x] `maxItems` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L166))
- [x] `minItems` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L165))
- [x] tuples: array-form `items` + `additionalItems` (draft 4 – 2019-09) and `prefixItems` + `items` (draft 2020-12)
- [x] `additionalProperties` of type
- [x] `patternProperties` (partial support)
- [x] [`extends`](https://github.com/json-schema/json-schema/wiki/Extends/014e3cd8692250baad70c361dd81f6119ad0f696)
- [x] `required` properties on objects ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L130))
- [x] `validateRequired` (draft 3 style `required: true` on a property) ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L124))
- [x] literal objects in enum ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L236))
- [x] referencing schema by id ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L331))
- [x] custom typescript types via `tsType`
- [x] `readOnly` → `readonly` properties and arrays (`readonlyKeyword` option)

## Custom schema properties:

- `tsType`: Overrides the type that's generated from the schema. Useful for forcing a type to `any` or when using non-standard JSON schema extensions ([eg](https://github.com/sokra/json-schema-to-typescript/blob/f1f40307cf5efa328522bb1c9ae0b0d9e5f367aa/test/e2e/customType.ts)).
- `tsEnumNames`: Overrides the names used for the elements in an enum. Can also be used to create string enums ([eg](https://github.com/johnbillion/wp-json-schemas/blob/647440573e4a675f15880c95fcca513fdf7a2077/schemas/properties/post-status-name.json)). The names must be distinct strings, one per `enum` value; otherwise the schema is rejected with a `ValidationError`. A name TypeScript would read as a number (`"1"`, `"-1"`, `"2.5"`) cannot be an enum member's name, so it gets a leading underscore (`_1 = 1`); the same goes for a value that `inferStringEnumKeysFromValues` turns into a name. A TypeScript enum holds strings and numbers only: an `enum` with a `null`, boolean, object or array value is typed as a union of its values (`null | "a" | "b"`) instead, and the names go unused.

## Not expressible in TypeScript:

- `dependencies` ([single](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L261), [multiple](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L282))
- `divisibleBy` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L185))
- [`format`](https://github.com/json-schema/json-schema/wiki/Format) ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L209)) — but see the `formatTypes` option to map a format to a type of your choosing
- `multipleOf` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L186))
- `maximum` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L183))
- `minimum` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L182))
- `maxProperties` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L113))
- `minProperties` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L112))
- `not`/`disallow`
- `oneOf` ("xor", use `anyOf` instead)
- `pattern` ([string](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L203), [regex](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L207))
- `uniqueItems` ([eg](https://github.com/tdegrunt/jsonschema/blob/67c0e27ce9542efde0bf43dc1b2a95dd87df43c3/examples/all.js#L172))

## JSON Schema draft support

Every draft goes through the same pipeline; a `$schema` declaration does not change the output. The schema model is draft 4 (`JSONSchema4` from `@types/json-schema`): the lists above cover its keywords, the table below covers what later drafts added. "Supported" means the keyword shapes the emitted type as the spec intends; keywords that only constrain values have no TypeScript equivalent and are ignored next to a `type` (a subschema made of nothing else still comes out as `{[k: string]: unknown}` rather than `unknown`, #806 pending). As of master `d86f285`, which is ahead of 16.0.0 (there `unevaluatedProperties` is still ignored and `formatTypes` does not exist); every row was checked by compiling a one-keyword schema with the CLI.

| Keyword | Status | Note | Tracking |
|-|-|-|-|
| **draft 6** | | | |
| `const` | supported | literal types, including object literals | |
| boolean schemas (`true` / `false`) | supported | as a property, `items`, `additionalProperties`, and inside `allOf` / `anyOf`. A `$ref` to one crashes (#809 pending); a root `true` / `false` errors | [#725](https://github.com/bcherny/json-schema-to-typescript/issues/725), [#496](https://github.com/bcherny/json-schema-to-typescript/issues/496) |
| `$id` | supported | for naming, and `$ref: "#name"` to an `$id: "#name"` | |
| `examples` | ignored | not copied into the JSDoc comment | [#237](https://github.com/bcherny/json-schema-to-typescript/issues/237) |
| `propertyNames` | ignored | `enum` / `const` names would be expressible | [#337](https://github.com/bcherny/json-schema-to-typescript/issues/337) |
| `contains`, numeric `exclusiveMinimum` / `exclusiveMaximum` | not expressible | | |
| **draft 7** | | | |
| `if` / `then` / `else` | ignored | properties and `required` inside the branches contribute nothing | [#426](https://github.com/bcherny/json-schema-to-typescript/issues/426) |
| `readOnly` | ignored | a `readonly` modifier is #796 (pending) | [#131](https://github.com/bcherny/json-schema-to-typescript/issues/131) |
| `writeOnly`, `$comment`, `contentMediaType`, `contentEncoding`, new `format`s | not expressible | formats are plain `string` unless mapped with the `formatTypes` option | |
| **2019-09** | | | |
| `$defs` | supported | same as `definitions` (using both in one schema errors) | |
| `$anchor` | errors | a `$ref: "#name"` to it fails with "Refs should have been resolved by the resolver"; `$id: "#name"` or a JSON pointer works | |
| `$id` inside a subschema as a base URI | errors | `$ref`s resolve against the file's location, not against an enclosing `$id` | |
| `$ref` with sibling keywords | partial | merged into a copy of the referenced schema, not intersected with it: a keyword both sides have (eg. `properties`) keeps one side only, and the definition may be emitted twice (`Foo`, `Foo1`). Use `allOf` to get both. Annotation-only siblings stop forking with #803 (pending) | |
| `$recursiveRef` / `$recursiveAnchor` | ignored | the target is typed `{[k: string]: unknown}` (`unknown` with #806, pending), not the recursive type | |
| `unevaluatedProperties` | partial | like `additionalProperties` for the schema's own `properties`; not enforced across `allOf` / `anyOf` / `oneOf`; wrongly closed over properties from a sibling `$ref`, `dependentSchemas` or `if` / `then` (#798 pending) | |
| `unevaluatedItems`, `dependentSchemas` | ignored | | |
| `dependentRequired`, `minContains` / `maxContains`, `contentSchema` | not expressible | like draft 4 `dependencies` | [#169](https://github.com/bcherny/json-schema-to-typescript/issues/169) |
| `deprecated` | supported | `@deprecated` in the JSDoc comment | |
| **2020-12** | | | |
| `prefixItems` | ignored | `unknown[]`; with `items: false` → `never[]`, with `items: {…}` that schema is applied to every element. Tuples are #816 (pending) | [#543](https://github.com/bcherny/json-schema-to-typescript/issues/543) |
| `$dynamicRef` / `$dynamicAnchor` | ignored | as `$recursiveRef` | |

Not supported from 2019-09 / 2020-12, by name: `$anchor`, `$recursiveRef`, `$recursiveAnchor`, `$dynamicRef`, `$dynamicAnchor`, `$vocabulary`, `unevaluatedItems`, `prefixItems`, `dependentSchemas`, `dependentRequired`, `minContains`, `maxContains`, `contentSchema`, and `$id`-based reference resolution.

## FAQ

### JSON-Schema-to-TypeScript is crashing on my giant file. What can I do?

Prettier is known to run slowly on really big files. To skip formatting and improve performance, set the `format` option to `false`.

## Further Reading

- JSON Schema specification (2020-12, with links to every earlier draft): https://json-schema.org/specification
- Draft 4, the schema model used here: https://json-schema.org/draft-04/draft-zyp-json-schema-04
- What changed per draft: [draft 6](https://json-schema.org/draft-06/json-schema-release-notes), [draft 7](https://json-schema.org/draft-07/json-schema-release-notes), [2019-09](https://json-schema.org/draft/2019-09/release-notes), [2020-12](https://json-schema.org/draft/2020-12/release-notes)
- Understanding JSON Schema: https://json-schema.org/understanding-json-schema
- JSON Schema test suite: https://github.com/json-schema-org/JSON-Schema-Test-Suite
- TypeScript handbook: https://www.typescriptlang.org/docs/handbook/

## Who uses JSON-Schema-to-TypeScript?

- [Alibaba](https://github.com/alibaba/lowcode-engine)
- [Amazon](https://github.com/aws/aws-toolkit-vscode), [AWSLabs](https://github.com/awslabs/cdk8s)
- [Expo](https://github.com/expo/expo)
- [FormatJS](https://github.com/formatjs/formatjs)
- [Microsoft](https://github.com/microsoft/mixed-reality-extension-sdk)
- [Mozilla](https://github.com/mdn/browser-compat-data)
- [Nx](https://github.com/nrwl/nx)
- [RStudio](https://github.com/rstudio/rstudio)
- [Sourcegraph](https://github.com/sourcegraph/sourcegraph)
- [Stryker](https://github.com/stryker-mutator/stryker)
- [Webpack](https://github.com/webpack/webpack)
- [See more](https://github.com/bcherny/json-schema-to-typescript/network/dependents?package_id=UGFja2FnZS0xNjUxOTM5Mg%3D%3D)
