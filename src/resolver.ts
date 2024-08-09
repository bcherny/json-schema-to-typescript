import {readFile} from 'fs/promises'
import {
  $RefParser,
  ParserOptions as $RefOptions,
  HTTPResolverOptions,
  FileInfo,
} from '@apidevtools/json-schema-ref-parser'
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

export type DereferencedPaths = WeakMap<JSONSchema, string>

export async function dereference(
  schema: JSONSchema,
  {
    cwd,
    $refOptions,
    overrideHttpId,
  }: {cwd: string; overrideHttpId: {[key: string]: string} | null; $refOptions: $RefOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const myResolver = new MyResolver(overrideHttpId)
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const dereferencedSchema = (await parser.dereference(cwd, schema, {
    ...$refOptions,
    dereference: {
      ...$refOptions.dereference,
      onDereference($ref: string, schema: JSONSchema) {
        dereferencedPaths.set(schema, $ref)
      },
    },
    resolve: {
      httpOverride: {
        order: 1,
        canRead(file: FileInfo) {
          return myResolver.canRead(file)
        },
        read(file: FileInfo) {
          return myResolver.read(file)
        },
      },
    },
  })) as any // TODO: fix types
  return {dereferencedPaths, dereferencedSchema}
}

class MyResolver implements HTTPResolverOptions {
  private readonly overrideHttpId: ReadonlyArray<{originalSchemaUrl: URL; overrideSchemaUrl: URL}> | null

  public constructor(overrideHttpId: {[key: string]: string} | null) {
    if (overrideHttpId !== null) {
      const result: Array<{originalSchemaUrl: URL; overrideSchemaUrl: URL}> = []
      for (const [originalSchemaUrl, overrideSchemaUrl] of Object.entries(overrideHttpId)) {
        result.push({originalSchemaUrl: new URL(originalSchemaUrl), overrideSchemaUrl: new URL(overrideSchemaUrl)})
      }
      this.overrideHttpId = Object.freeze(result)
    } else {
      this.overrideHttpId = null
    }
  }

  public canRead(file: FileInfo): boolean {
    if (this.overrideHttpId !== null) {
      for (const {originalSchemaUrl} of this.overrideHttpId) {
        const originalSchemaUrlStr: string = originalSchemaUrl.toString()
        if (file.url.startsWith(originalSchemaUrlStr)) {
          return true
        }
      }
    }
    return false
  }

  public async read(file: FileInfo): Promise<string | Buffer> {
    if (this.overrideHttpId !== null) {
      for (const {originalSchemaUrl, overrideSchemaUrl} of this.overrideHttpId) {
        const originalSchemaUrlStr: string = originalSchemaUrl.toString()
        if (file.url.startsWith(originalSchemaUrlStr)) {
          const overrideSchemaUrlStr: string = overrideSchemaUrl.toString()
          const newUrl: URL = new URL(file.url.replace(originalSchemaUrlStr, overrideSchemaUrlStr))
          const fileData = await readFile(newUrl)
          return fileData
        }
      }
    }

    throw new Error('Шось пішло не так')
  }
}
