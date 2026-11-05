// Keeps public/photos/photos.json in sync with the image files in public/photos.
//
// - New images are appended (sorted by file name, so "01-…", "02-…" control order).
// - Existing entries keep their caption, alt text and position.
// - Entries whose file no longer exists are dropped.
//
// Runs automatically before `npm run dev` and `npm run build`.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'photos')
const manifestPath = join(dir, 'photos.json')
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i

const files = (await readdir(dir)).filter((f) => IMAGE.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

let existing = []
if (existsSync(manifestPath)) {
  try {
    const parsed = JSON.parse(await readFile(manifestPath, 'utf8'))
    existing = Array.isArray(parsed) ? parsed : Array.isArray(parsed.photos) ? parsed.photos : []
  } catch (err) {
    console.error(`✗ photos.json is not valid JSON — leaving it untouched.\n  ${err.message}`)
    process.exit(0)
  }
}

const kept = existing.filter((p) => p && typeof p.src === 'string' && (/^https?:\/\//.test(p.src) || files.includes(p.src)))
const known = new Set(kept.map((p) => p.src))
const added = files.filter((f) => !known.has(f)).map((src) => ({ src, caption: '' }))
const photos = [...kept, ...added]

await writeFile(manifestPath, JSON.stringify({ photos }, null, 2) + '\n')

const removed = existing.length - kept.length
console.log(`♥ photos.json: ${photos.length} photo(s)` + (added.length ? `, ${added.length} added` : '') + (removed ? `, ${removed} removed` : ''))
