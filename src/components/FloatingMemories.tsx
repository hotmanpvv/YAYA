import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Photo } from '../hooks/usePhotos'
import { getBreakpoint, type Viewport } from '../lib/layout'
import { computeSlots, type MemoryMode } from '../lib/slots'
import { Polaroid } from './Polaroid'

type Props = {
  photos: Photo[]
  viewport: Viewport
  mode: MemoryMode
  /** where photos float out from (the envelope) */
  origin: { x: number; y: number }
  /** true while the letter is open: photos behind it soften so the text stays readable */
  dimmed: boolean
  onOpen: (photo: Photo, list: Photo[]) => void
  onFailed: (src: string) => void
}

const ROTATE_EVERY_MS = 7500

/**
 * Our photographs, floating out of the envelope one after another and then
 * swaying gently around the letter. If there are more photos than places to
 * show them, they take turns.
 */
export function FloatingMemories({ photos, viewport, mode, origin, dimmed, onOpen, onFailed }: Props) {
  const reduce = useReducedMotion()
  const slots = useMemo(() => computeSlots(viewport, mode), [viewport, mode])
  const bp = getBreakpoint(viewport)
  const baseWidth = useMemo(() => computeSlots(viewport, 'letter')[0]?.width ?? 120, [viewport])
  const count = Math.min(slots.length, photos.length)

  // Which photo sits in which slot.
  const [assign, setAssign] = useState<string[]>([])
  const pointer = useRef(0)

  useEffect(() => {
    setAssign((prev) => {
      const alive = new Set(photos.map((p) => p.src))
      const kept = prev.slice(0, count).filter((s) => alive.has(s))
      const used = new Set(kept)
      for (const p of photos) {
        if (kept.length >= count) break
        if (!used.has(p.src)) {
          kept.push(p.src)
          used.add(p.src)
        }
      }
      return kept
    })
  }, [photos, count])

  // Gently rotate through extra photos.
  useEffect(() => {
    if (photos.length <= count || count === 0) return
    let tick = 0
    const id = window.setInterval(() => {
      setAssign((prev) => {
        const shown = new Set(prev)
        const candidates = photos.filter((p) => !shown.has(p.src))
        if (!candidates.length) return prev
        const next = candidates[pointer.current % candidates.length]
        pointer.current += 1
        const copy = [...prev]
        copy[tick % copy.length] = next.src
        tick += 1
        return copy
      })
    }, ROTATE_EVERY_MS)
    return () => clearInterval(id)
  }, [photos, count])

  // First appearance is staggered; later moves (e.g. to frame the finale) glide together.
  const [arrived, setArrived] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setArrived(true), 600 + count * 420 + 2500)
    return () => clearTimeout(t)
  }, [count])

  const bySrc = useMemo(() => new Map(photos.map((p) => [p.src, p])), [photos])
  const ratio = 1.2 // polaroid height ÷ width (approx.)

  return (
    <section aria-label="Our memories" className="pointer-events-none fixed inset-0">
      {assign.map((src, i) => {
        const slot = slots[i]
        const photo = bySrc.get(src)
        if (!slot || !photo) return null
        const scale = (slot.width / baseWidth) * slot.scale
        const opacity = dimmed ? slot.opacity : 1
        return (
          <motion.div
            key={i}
            className="pointer-events-auto absolute left-0 top-0"
            style={{ width: baseWidth, zIndex: slot.blur ? 1 : 2 }}
            initial={{ x: origin.x - baseWidth / 2, y: origin.y - (baseWidth * ratio) / 2, scale: 0.2, rotate: 0, opacity: 0 }}
            animate={{ x: slot.x - baseWidth / 2, y: slot.y - (baseWidth * ratio) / 2, scale, rotate: slot.rotate, opacity }}
            transition={
              arrived
                ? { duration: reduce ? 0.3 : 1.6, ease: [0.4, 0, 0.2, 1], delay: reduce ? 0 : i * 0.06 }
                : {
                    delay: reduce ? 0 : i * 0.42,
                    x: { type: 'spring', stiffness: 26, damping: 11, mass: 1.1 },
                    y: { type: 'spring', stiffness: 26, damping: 11, mass: 1.1 },
                    rotate: { type: 'spring', stiffness: 30, damping: 9 },
                    scale: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: dimmed ? 1.2 : 0.5 },
                  }
            }
          >
            <div
              className="animate-sway"
              style={{ '--d': `${5.5 + (i % 4) * 0.7}s`, '--delay': `${-i * 1.3}s` } as React.CSSProperties}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={src}
                  initial={{ opacity: 0, rotateY: 80 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -80 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  style={{ transformPerspective: 800 }}
                >
                  <Polaroid
                    photo={photo}
                    width={baseWidth}
                    blur={dimmed ? slot.blur : 0}
                    hearts={bp !== 'mobile' || !dimmed}
                    onOpen={() => onOpen(photo, photos)}
                    onError={() => onFailed(photo.src)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
