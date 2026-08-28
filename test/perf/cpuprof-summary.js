#!/usr/bin/env node
/**
 * Summarise a V8 .cpuprofile (from `node --cpu-prof`): top functions by self time
 * and by inclusive time, with file:line, filtered to the library (dist/src) and its
 * dependencies. Usage: node cpuprof-summary.js <file.cpuprofile> [--top 20] [--all]
 */
const fs = require('fs')
const path = require('path')
const file = process.argv[2]
const top = Number((process.argv.indexOf('--top') > 0 && process.argv[process.argv.indexOf('--top') + 1]) || 20)
const showAll = process.argv.includes('--all')
const prof = JSON.parse(fs.readFileSync(file, 'utf8'))
const nodes = new Map(prof.nodes.map(n => [n.id, n]))
// self samples per node
const dt = prof.timeDeltas || []
const selfUs = new Map()
for (let i = 0; i < prof.samples.length; i++) selfUs.set(prof.samples[i], (selfUs.get(prof.samples[i]) || 0) + (dt[i] || prof.samplingInterval || 1000))
// parent links
const parent = new Map()
for (const n of prof.nodes) for (const c of n.children || []) parent.set(c, n.id)
const totalUs = [...selfUs.values()].reduce((a, b) => a + b, 0)

function label(n) {
  const cf = n.callFrame
  let url = cf.url || ''
  url = url.replace(/^file:\/\//, '')
  const m = url.match(/(dist\/src\/[^/]+)$|node_modules\/((?:@[^/]+\/)?[^/]+)\/.*?([^/]+)$/)
  const short = m ? (m[1] ? m[1] : `node_modules/${m[2]}/…/${m[3]}`) : url ? path.basename(url) : '(native)'
  return `${cf.functionName || '(anonymous)'}  ${short}:${cf.lineNumber + 1}`
}
function kind(n) {
  const url = n.callFrame.url || ''
  if (url.includes('/dist/src/')) return 'lib'
  if (url.includes('node_modules')) return 'dep'
  if (!url) return 'native'
  return 'other'
}
const labels = new Map(prof.nodes.map(n => [n.id, label(n)]))
// aggregate by label: self and inclusive (inclusive = sum over samples of distinct labels on the stack)
const selfBy = new Map()
const inclBy = new Map()
for (const [id, us] of selfUs) {
  const l = labels.get(id)
  selfBy.set(l, (selfBy.get(l) || 0) + us)
  const seen = new Set()
  let cur = id
  while (cur !== undefined) {
    const ln = labels.get(cur)
    if (!seen.has(ln)) {
      seen.add(ln)
      inclBy.set(ln, (inclBy.get(ln) || 0) + us)
    }
    cur = parent.get(cur)
  }
}
const kinds = new Map()
for (const [id, us] of selfUs) {
  const k = kind(nodes.get(id))
  kinds.set(k, (kinds.get(k) || 0) + us)
}
const pct = us => ((100 * us) / totalUs).toFixed(1).padStart(5) + '%'
const msf = us => (us / 1000).toFixed(0).padStart(7) + 'ms'
console.log(`# ${path.basename(file)}  total sampled ${(totalUs / 1000).toFixed(0)} ms`)
console.log('self time by origin: ' + [...kinds].map(([k, v]) => `${k} ${pct(v)}`).join(', '))
const interesting = l => showAll || /dist\/src|node_modules/.test(l)
console.log(`\n## top ${top} by self time${showAll ? '' : ' (lib + deps)'}`)
for (const [l, us] of [...selfBy].filter(([l]) => interesting(l)).sort((a, b) => b[1] - a[1]).slice(0, top)) console.log(`${msf(us)} ${pct(us)}  ${l}`)
console.log(`\n## top ${top} by inclusive time (lib only)`)
for (const [l, us] of [...inclBy].filter(([l]) => /dist\/src/.test(l)).sort((a, b) => b[1] - a[1]).slice(0, top)) console.log(`${msf(us)} ${pct(us)}  ${l}`)
console.log(`\n## top 10 by inclusive time (deps)`)
for (const [l, us] of [...inclBy].filter(([l]) => /node_modules/.test(l) && !/dist\/src/.test(l)).sort((a, b) => b[1] - a[1]).slice(0, 10)) console.log(`${msf(us)} ${pct(us)}  ${l}`)
