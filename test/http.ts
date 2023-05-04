import {existsSync, readFileSync, writeFileSync} from 'fs'
import {get as httpGet} from 'http'
import {get as httpsGet} from 'https'
import {join} from 'path'

const CACHE_DIR = 'test/__fixtures__'

// Gets a URL, with read-through cache
// TODO: Pull this out into its own NPM module
export async function getWithCache(url: string): Promise<object> {
  const resultFromFilesystem = getFromFilesystem(url)
  if (resultFromFilesystem) {
    return resultFromFilesystem
  }

  const resultFromNetwork = await getFromNetwork(url)
  writeToFilesystem(url, resultFromNetwork)
  return resultFromNetwork
}

function getFromFilesystem(url: string): object | undefined {
  const filepath = getFilepath(url)
  if (!existsSync(filepath)) {
    return
  }
  return JSON.parse(readFileSync(filepath, 'utf8'))
}

function getFilepath(url: string): string {
  return join(__dirname, '../../', CACHE_DIR, url.replace(/[:\/\\]/g, '-'))
}

function writeToFilesystem(url: string, data: object): void {
  const filepath = getFilepath(url)
  console.info(`Writing "${filepath} to filesystem...`)
  writeFileSync(filepath, JSON.stringify(data, null, 2))
}

function getFromNetwork(url: string): Promise<object> {
  const f = url.startsWith('https://') ? httpsGet : httpGet
  return new Promise((resolve, reject) => {
    f(url, res => {
      const contentType = res.headers['content-type']
      if (res.statusCode !== 200) {
        return reject(res)
      } else if (contentType && !/^application\/json/.test(contentType)) {
        return reject(new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`))
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', chunk => {
        rawData += chunk
      })
      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', e => {
      reject(e)
    })
  })
}
