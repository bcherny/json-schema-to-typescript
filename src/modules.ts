import {sortBy} from 'lodash'
import * as path from 'path'
import {format} from './formatter'
import {generate, ModuleLinker} from './generator'
import type {Options} from './index'
import {fileKey} from './resolver'
import {AST, ASTWithStandaloneName} from './types/AST'

/** One schema file of a set compiled together (`compileFiles`), after every phase up to the generator */
export interface Module {
  /** Absolute path of the schema file */
  file: string
  /** Absolute path the module will be written to; used only to compute import specifiers */
  outputPath: string
  ast: AST
  unreachableDefinitions: AST[]
  options: Options
}

/**
 * Generates and formats every module of the set: a named type that lives in another module of
 * the set is imported from it (`import type`) instead of being declared again. Each module keeps
 * its own naming pass; a name that differs from the owner's is reconciled at the import
 * (`import type {Theirs as Ours}`). Types from files outside the set are declared as `compile`
 * would.
 *
 * @returns the TypeScript for each module, in order
 */
export async function generateModules(modules: Module[]): Promise<string[]> {
  // `Source.file`, as stamped by the resolver, for each module
  const keys = new Map(modules.map(_ => [_, fileKey(_.file)]))
  const byKey = new Map(modules.map(_ => [keys.get(_)!, _]))
  /** The other module of the set that `ast`'s schema was read from, if that is where it is from */
  function ownerOf(ast: AST, module: Module): Module | undefined {
    const owner = ast.source && byKey.get(ast.source.file)
    return owner === module ? undefined : owner
  }

  // Pass 1: which of its own schemas does each module declare, and under what names? (By
  // `exportKey`; null where one schema node yields two named types: import neither.)
  const exports = new Map<Module, Map<string, string | null>>()
  for (const module of modules) {
    const own = new Map<string, string | null>()
    exports.set(module, own)
    generate(module.ast, {...module.options, bannerComment: ''}, module.unreachableDefinitions, {
      imports: ast => ownerOf(ast, module) !== undefined,
      declared(ast) {
        if (ast.source?.file === keys.get(module)) {
          const key = exportKey(ast)
          own.set(key, own.has(key) ? null : ast.standaloneName)
        }
      },
    })
  }

  // Pass 2: generate each module, importing what the owning module declares under the name
  // this module's own naming pass gave it
  return Promise.all(
    modules.map(module => {
      const imports = new Map<Module, Map<string, string>>() // owner -> (its name -> our name)
      const linker: ModuleLinker = {
        imports(ast) {
          const owner = ownerOf(ast, module)
          const theirs = owner && exports.get(owner)!.get(exportKey(ast))
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
      const body = generate(module.ast, {...module.options, bannerComment: ''}, module.unreachableDefinitions, linker)
      const header = [module.options.bannerComment, renderImports(module, imports)].filter(Boolean).join('\n')
      // `generate`'s parts, the header ahead of them as one more (see `format`)
      return format(header ? [header, `\n\n${body[0]}`, ...body.slice(1)] : body, module.options)
    }),
  )
}

/** Just what `moduleSpecifier` uses of `path`, so a test can pass `path.win32` */
type PathModule = Pick<typeof path, 'relative' | 'dirname' | 'sep'>

function exportKey(ast: ASTWithStandaloneName): string {
  return `${ast.source!.pointer}|${ast.type}`
}

function renderImports(module: Module, imports: Map<Module, Map<string, string>>): string {
  return sortBy(
    [...imports].map(([owner, names]) => [moduleSpecifier(module.outputPath, owner.outputPath), names] as const),
    0,
  )
    .map(
      ([specifier, names]) =>
        `import type {${sortBy([...names], 0)
          .map(([theirs, ours]) => (theirs === ours ? ours : `${theirs} as ${ours}`))
          .join(', ')}} from ${JSON.stringify(specifier)};`,
    )
    .join('\n')
}

/**
 * `./b.js`, `../common/defs.js`: relative, forward slashes on every platform, and with the `.js`
 * extension TypeScript resolves to the `.d.ts` under every `moduleResolution` setting.
 */
export function moduleSpecifier(from: string, to: string, {relative, dirname, sep}: PathModule = path): string {
  const specifier = relative(dirname(from), to)
    .split(sep)
    .join('/')
    .replace(/(\.d)?\.[cm]?tsx?$/, '.js')
  return specifier.startsWith('.') ? specifier : `./${specifier}`
}
