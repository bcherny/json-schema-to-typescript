import {JSONSchema4} from 'json-schema'
import {basename, dirname, posix, relative, resolve, sep} from 'path'
import {compileToAST, Options} from './index'
import {format} from './formatter'
import {generate, ModuleLinker} from './generator'
import {fileKey} from './resolver'
import {AST, ASTWithStandaloneName} from './types/AST'

export interface ModuleInput {
  schema: JSONSchema4
  /**
   * The file (or URL) `schema` counts as having been read from: relative `$ref`s resolve
   * against it, and a `$ref` to it from another schema of the set means this schema
   */
  filename: string
  /** Where the module will be written; used only to compute import specifiers */
  outputPath: string
}

/** One schema of a set compiled together */
interface Module {
  input: ModuleInput
  /** How the resolver addresses this file: the `Source.file` of every node read from it */
  key: string
  ast: AST
  unreachableDefinitions: AST[]
  options: Options
  banner: string
  /**
   * After pass 1: the name this module declares for each of its own schemas, by
   * `exportKey` -- or null where one schema node yields two named types (import neither)
   */
  exports: Map<string, string | null>
}

/**
 * Compiles a set of schemas into a set of TypeScript modules: a type that lives in another
 * schema of the set is imported from that schema's module (`import type`) instead of being
 * declared again. Types from files outside the set are declared inline, as `compile` does.
 * Each schema's `definitions` are always declared (they are what the others import).
 *
 * @returns the TypeScript for each input, in order
 */
export async function compileSchemas(inputs: ModuleInput[], options: Partial<Options> = {}): Promise<string[]> {
  const modules = await Promise.all(
    inputs.map(async (input): Promise<Module> => {
      // `$ref`s resolve against the file's own directory, or against `cwd` when one is given
      // (as for the CLI): the file then counts as living there
      const filename =
        options.cwd === undefined ? resolve(input.filename) : resolve(options.cwd, basename(input.filename))
      const compiled = await compileToAST(
        input.schema,
        input.filename,
        {...options, cwd: dirname(filename), unreachableDefinitions: true},
        filename,
      )
      return {
        input,
        key: fileKey(filename),
        ast: compiled.ast,
        unreachableDefinitions: compiled.unreachableDefinitions,
        options: {...compiled.options, bannerComment: ''},
        banner: compiled.options.bannerComment,
        exports: new Map(),
      }
    }),
  )
  const byKey = new Map(modules.map(_ => [_.key, _]))
  /** The other module of the set that `ast`'s schema was read from, if that is where it is from */
  function ownerOf(ast: AST, module: Module): Module | undefined {
    const owner = ast.source && byKey.get(ast.source.file)
    return owner === module ? undefined : owner
  }

  // Pass 1: which of its own schemas does each module declare, and under what names?
  for (const module of modules) {
    generate(module.ast, module.options, module.unreachableDefinitions, {
      imports: ast => ownerOf(ast, module) !== undefined,
      declared(ast) {
        if (ast.source?.file === module.key) {
          const key = exportKey(ast)
          module.exports.set(key, module.exports.has(key) ? null : ast.standaloneName)
        }
      },
    })
  }

  // Pass 2: generate each module, importing what the owning module declares under the
  // name this module's own naming pass gave it
  return Promise.all(
    modules.map(module => {
      const imports = new Map<Module, Map<string, string>>() // owner -> (its name -> our name)
      const linker: ModuleLinker = {
        imports(ast) {
          const owner = ownerOf(ast, module)
          const theirs = owner?.exports.get(exportKey(ast))
          if (!owner || !theirs) {
            return false // eg. an inline schema that only this module names: declare our copy
          }
          if (!imports.has(owner)) {
            imports.set(owner, new Map())
          }
          imports.get(owner)!.set(theirs, ast.standaloneName)
          return true
        },
      }
      const body = generate(module.ast, module.options, module.unreachableDefinitions, linker)
      const header = [module.banner, renderImports(module, imports)].filter(Boolean).join('\n')
      return format([header, body].filter(Boolean).join('\n\n'), module.options)
    }),
  )
}

function exportKey(ast: ASTWithStandaloneName): string {
  return `${ast.source!.pointer}|${ast.type}`
}

const bySpecifierOrName = ([a]: readonly [string, unknown], [b]: readonly [string, unknown]) =>
  a < b ? -1 : a > b ? 1 : 0

function renderImports(module: Module, imports: Map<Module, Map<string, string>>): string {
  return [...imports]
    .map(([owner, names]) => [moduleSpecifier(module.input.outputPath, owner.input.outputPath), names] as const)
    .sort(bySpecifierOrName)
    .map(
      ([specifier, names]) =>
        `import type {${[...names]
          .sort(bySpecifierOrName)
          .map(([theirs, ours]) => (theirs === ours ? ours : `${theirs} as ${ours}`))
          .join(', ')}} from ${JSON.stringify(specifier)};`,
    )
    .join('\n')
}

/** `./b`, `../common/defs` -- relative, extensionless, forward slashes */
function moduleSpecifier(from: string, to: string): string {
  const path = relative(dirname(resolve(from)), resolve(to))
    .split(sep)
    .join(posix.sep)
    .replace(/(\.d)?\.[cm]?tsx?$/, '')
  return path.startsWith('.') ? path : `./${path}`
}
