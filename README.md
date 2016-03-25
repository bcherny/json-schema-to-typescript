# json-schema-to-typescript

[![Circle CI](https://circleci.com/gh/bcherny/json-schema-to-typescript/tree/master.svg?style=svg&circle-token=00757ca8245cb4510f896548b432c1d07ea52b5f)](https://circleci.com/gh/bcherny/json-schema-to-typescript/tree/master)

> Compile json schema to typescript typings

## Example

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
    }
  },
  "required": ["firstName", "lastName"]
}
```

Output:
```ts
interface ExampleSchema {
  firstName: string;
  lastName: string;
  age?: number; // Age in years
}
```

## Installation

`npm install json-schema-to-typescript`

## Usage

```js
import {compileFromFile} from 'json-schema-to-typescript'
fs.writeFileSync('foo.d.ts', await compileFromFile('foo.json'))
```

## Tests

`npm test`

## Todo

- [x] `title` => `interface`
- [x] Primitive types:
  - [x] array
  - [x] array of type
  - [x] boolean
  - [x] integer
  - [x] number
  - [x] null
  - [x] object
  - [x] string
  - [x] enum
- [x] Non/extensible interfaces
- [ ] Custom JSON-schema extensions
- [x] Nested properties
- [x] Schema definitions
- [x] [Schema references](http://json-schema.org/latest/json-schema-core.html#rfc.section.7.2.2)
- [ ] External (network) schema references
- [ ] Add support for running in browser
- [ ] default interface name

## Further Reading

- JSON-schema spec: http://json-schema.org/latest/json-schema-core.html
- TypeScript spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md