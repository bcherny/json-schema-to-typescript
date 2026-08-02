import {Options} from './'

export async function format(code: string, options: Options): Promise<string> {
  if (!options.format) {
    return code
  }
  // Loaded lazily so that consumers who pass `format: false` never pull in prettier, which imports `node:v8` and so fails on runtimes that don't provide it (eg. Cloudflare Workers).
  const {format: prettify} = await import('prettier')
  return prettify(code, {parser: 'typescript', ...options.style})
}
