/**
 * Child process: compile one case and report timing + memory as a single
 * `__PERF__ {json}` line. Kept separate so the driver survives OOMs, stack
 * overflows and hangs, and so the numbers exclude nothing but compile() itself
 * (spawn + require time is reported separately as `bootMs`).
 *
 *   node [--max-old-space-size=512] run-one.js <case.json> [--jstt <repo>] [--format true|false] [--http-cache <dir>]
 *
 * case.json: { schema, options?, cwd?, name? }   (cwd = dir holding external $ref files)
 */
const t0 = process.hrtime.bigint()
const fs = require('fs')
const path = require('path')

const argv = process.argv.slice(2)
const casePath = argv[0]
const arg = (k, d) => {
  const i = argv.indexOf(k)
  return i >= 0 ? argv[i + 1] : d
}
const jstt = path.resolve(arg('--jstt', process.env.JSTT_REPO || path.join(__dirname, '../..')))
const formatOpt = arg('--format', 'false') === 'true'
const httpCache = arg('--http-cache', null)
const emit = arg('--emit', null) // write the generated .d.ts here (for output-identity checks)

const {compile} = require(path.join(jstt, 'dist/src/index.js'))
const bootMs = Number(process.hrtime.bigint() - t0) / 1e6 // require(dist) only; the case file is read after this
const c = JSON.parse(fs.readFileSync(casePath, 'utf8'))

// Optional caching http resolver so corpus timings don't include the network after a warm-up pass.
function cachingHttpResolver(dir) {
  fs.mkdirSync(dir, {recursive: true})
  return {
    order: 1,
    canRead: /^https?:\/\//i,
    async read(file) {
      // same key scheme as the repo's test/http.ts, so test/__fixtures__ can seed the cache
      const key = file.url.replace(/[:\/\\]/g, '-')
      const p = path.join(dir, key)
      if (fs.existsSync(p)) return fs.readFileSync(p)
      const res = await fetch(file.url, {redirect: 'follow'})
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${file.url}`)
      const buf = Buffer.from(await res.arrayBuffer())
      fs.writeFileSync(p, buf)
      return buf
    },
  }
}

const options = {bannerComment: '', ...(c.options || {}), format: formatOpt}
if (c.cwd) options.cwd = c.cwd
if (httpCache) options.$refOptions = {...(options.$refOptions || {}), resolve: {...((options.$refOptions || {}).resolve || {}), http: false, cache: cachingHttpResolver(httpCache)}}

function done(result, ru = process.resourceUsage(), mu = process.memoryUsage()) {
  result.bootMs = +bootMs.toFixed(1)
  result.maxRssMB = +(ru.maxRSS / 1024).toFixed(1) // maxRSS is in kB
  result.heapUsedMB = +(mu.heapUsed / 1048576).toFixed(1)
  result.heapTotalMB = +(mu.heapTotal / 1048576).toFixed(1)
  process.stdout.write('__PERF__ ' + JSON.stringify(result) + '\n')
}

const t1 = process.hrtime.bigint()
compile(c.schema, c.name || 'PerfRoot', options).then(
  out => {
    const ms = Number(process.hrtime.bigint() - t1) / 1e6
    // read memory before touching `out`, so the numbers are compile()'s alone
    const ru = process.resourceUsage()
    const mu = process.memoryUsage()
    if (emit) fs.writeFileSync(emit, out)
    let outLines = 1
    for (let i = out.indexOf('\n'); i !== -1; i = out.indexOf('\n', i + 1)) outLines++
    done({outcome: 'ok', ms: +ms.toFixed(1), outBytes: out.length, outLines}, ru, mu)
  },
  e => {
    const ms = Number(process.hrtime.bigint() - t1) / 1e6
    const msg = String((e && e.message) || e)
    const stack = String((e && e.stack) || '')
    const frame = (stack.split('\n').find(l => l.includes('/dist/src/') || l.includes('node_modules')) || '').trim()
    done({
      outcome: /Maximum call stack/.test(msg) ? 'stack' : 'throw',
      ms: +ms.toFixed(1),
      errorName: (e && e.constructor && e.constructor.name) || typeof e,
      message: msg.slice(0, 300),
      frame: frame.slice(0, 200),
    })
  },
)
