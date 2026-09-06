#!/usr/bin/env node
/**
 * Re-fetch the corpus schemas listed in sources.json into schemas/.
 *
 *   node test/corpus/update.js            # fetch everything, rewrite schemas/, print sha256 per file
 *   node test/corpus/update.js <name...>  # just these entries
 *
 * Every URL in sources.json is pinned to a commit or tag, so running this again
 * reproduces the checked-in files byte for byte; to move an entry to a newer
 * upstream version, change its URL, run this, and commit both. `prep` says what
 * happens between download and disk:
 *
 *   as-is               the bytes as served
 *   openapi-components  an OpenAPI 3 document reduced to a plain schema: the root
 *                       becomes {definitions: components.schemas}, and every
 *                       "#/components/schemas/" pointer is rewritten to
 *                       "#/definitions/" (compact JSON; paths, examples and the
 *                       rest of the document are dropped)
 */
const {createHash} = require('crypto')
const {mkdirSync, writeFileSync} = require('fs')
const {join} = require('path')

const sources = require('./sources.json')
const SCHEMAS = join(__dirname, 'schemas')

const PREP = {
  'as-is': buf => buf,
  'openapi-components': buf => {
    const doc = JSON.parse(buf.toString('utf8'))
    const text = JSON.stringify({definitions: doc.components.schemas})
    return Buffer.from(text.split('#/components/schemas/').join('#/definitions/') + '\n')
  },
}

async function main() {
  const only = new Set(process.argv.slice(2))
  mkdirSync(SCHEMAS, {recursive: true})
  for (const source of sources) {
    if (only.size && !only.has(source.name)) continue
    if (source.file) continue // lives elsewhere in the repo, with its own provenance notes
    if (!(source.prep in PREP)) throw new Error(`${source.name}: unknown prep "${source.prep}"`)
    const res = await fetch(source.url, {redirect: 'follow'})
    if (!res.ok) throw new Error(`${source.name}: HTTP ${res.status} for ${source.url}`)
    const served = Buffer.from(await res.arrayBuffer())
    const out = PREP[source.prep](served)
    writeFileSync(join(SCHEMAS, source.name + '.json'), out)
    const sha = createHash('sha256').update(out).digest('hex').slice(0, 16)
    console.log(`${source.name}\t${served.length} B served\t${out.length} B written\tsha256:${sha}`)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
