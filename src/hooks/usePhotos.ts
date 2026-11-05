import { useEffect, useState } from 'react'
import { PLACEHOLDER_PHOTOS } from '../data/placeholders'

export type Photo = {
  /** URL the browser loads */
  src: string
  /** Optional handwritten caption shown under the photo */
  caption?: string
  /** Alt text for screen readers (falls back to the caption) */
  alt?: string
  /** Which part of the photo to keep in the square polaroid, e.g. "50% 70%" (x y). */
  focus?: string
}

type ManifestEntry = { src?: unknown; caption?: unknown; alt?: unknown; focus?: unknown }

const BASE = import.meta.env.BASE_URL

function resolve(src: string) {
  if (/^(https?:|data:|\/)/.test(src)) return src
  return `${BASE}photos/${src.split('/').map(encodeURIComponent).join('/')}`
}

/**
 * Reads public/photos/photos.json at runtime, so photos can be swapped without
 * touching any code. Missing manifest / missing files are handled gracefully:
 * the experience simply continues with whatever photos are available.
 *
 * Placeholder images are only ever used while developing (`npm run dev`) and
 * only when no real photos have been added yet.
 */
export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`${BASE}photos/photos.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : { photos: [] }))
      .catch(() => ({ photos: [] }))
      .then((data: unknown) => {
        if (cancelled) return
        const raw: ManifestEntry[] = Array.isArray(data)
          ? data
          : Array.isArray((data as { photos?: unknown })?.photos)
            ? (data as { photos: ManifestEntry[] }).photos
            : []
        const list: Photo[] = raw
          .filter((p): p is ManifestEntry & { src: string } => typeof p?.src === 'string' && p.src.trim() !== '')
          .map((p) => ({
            src: resolve(p.src.trim()),
            caption: typeof p.caption === 'string' && p.caption.trim() ? p.caption.trim() : undefined,
            alt: typeof p.alt === 'string' && p.alt.trim() ? p.alt.trim() : undefined,
            focus: typeof p.focus === 'string' && /^[\d.\s%a-z-]+$/i.test(p.focus.trim()) ? p.focus.trim() : undefined,
          }))
        setPhotos(list.length === 0 && import.meta.env.DEV ? PLACEHOLDER_PHOTOS : list)
        setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { photos, ready }
}

/** Warm the browser cache so photos appear instantly when they float out. */
export function preloadPhotos(photos: Photo[], limit = 8) {
  photos.slice(0, limit).forEach((p) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = p.src
  })
}
