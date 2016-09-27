import { JSONSchema } from '../../src/JSONSchema'
import { INDENT_STRING } from  '../../src/TsTypes'

// See https://github.com/bcherny/json-schema-to-typescript/issues/35
// Maximum call stack size is exceeded when the schema is deep.
// This test creates a deep schema to stress the compiler.
// Note: This test doesn't make a wide/broad schema. So it probably has to
// go deeper than a typical schema in order to blow the stack.

// On @darcyparker's machine, using:
// https://github.com/bcherny/json-schema-to-typescript/tree/2f437247caf97528a28fa4c0cdc6fe0c0d635067
// levels === 700 is fine but higher blows the stack.
// I can achieve 1200 by eliminating use of lodash merge(). There is still room to improve by eliminating
// recursion. But I hope this is sufficient.
const levels: number = 1200

const schemaLeaf = {
  leaf: {
    type: 'string'
  }
}

const interfaceLeaf = 'leaf: string;'

export var schema: JSONSchema = {
  additionalProperties: false,
  required: [ 'level' ],
  title: 'Deep Schema'
}

schema.properties = [...Array(levels - 1)].reduce((prev, current, index) => {
  return {
    level: {
      additionalProperties: false,
      properties: prev,
      required: index === 0 ? 'leaf' : 'level',
      type: 'object'
    }
  }
}, schemaLeaf)

// console.log(JSON.stringify(schema))

export var configurations = [
  {
    types: 'export interface DeepSchema {\n' +
    [...Array(levels)]
      .reduce((prevLines: string[], current: any, index: number) => {
        var newLines: string[] = []
        if (index > 0) {
          newLines = prevLines.map(line => INDENT_STRING + line)
          newLines.unshift(INDENT_STRING + 'level: {')
          newLines.push(INDENT_STRING + '};')
        } else {
          newLines.push(INDENT_STRING + interfaceLeaf)
        }
        return newLines
      }, []).join('\n')
    + '\n}'
  }
]

// console.log()
// console.log(configurations[0].types)
