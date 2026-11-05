import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  paragraphs: string[]
  /** begin writing */
  start: boolean
  /** show everything immediately */
  complete: boolean
  onDone: () => void
  /** scroll container to keep the pen in view while writing (until the reader scrolls themselves) */
  scroller: React.RefObject<HTMLDivElement | null>
  paragraphClassName?: (index: number) => string
}

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null
const graphemes = (s: string) => (segmenter ? Array.from(segmenter.segment(s), (x) => x.segment) : Array.from(s))

function pause(ch: string, next: string | undefined) {
  if (ch === '…') return 520
  if (ch === '.' || ch === '!' || ch === '?') return next === undefined || next === ' ' ? 340 : 24
  if (ch === ',' || ch === ';' || ch === ':') return 180
  if (ch === ' ') return 26
  return 21
}

/**
 * Reveals the letter character by character like ink from a pen, with natural
 * pauses at punctuation. The full text is laid out from the start (just
 * invisible), so nothing jumps around as it's written.
 */
export function WritingText({ paragraphs, start, complete, onDone, scroller, paragraphClassName }: Props) {
  const { glyphs, offsets, times, total } = useMemo(() => {
    const glyphs = paragraphs.map(graphemes)
    const offsets: number[] = []
    const times: number[] = []
    let t = 0
    let n = 0
    glyphs.forEach((g, pi) => {
      offsets.push(n)
      g.forEach((ch, i) => {
        t += pause(ch, g[i + 1])
        times.push(t)
        n++
      })
      if (pi < glyphs.length - 1) t += 520 // a breath between paragraphs
    })
    return { glyphs, offsets, times, total: n }
  }, [paragraphs])

  const [count, setCount] = useState(0)
  const done = complete || count >= total
  const doneRef = useRef(false)
  const follow = useRef(true)
  const nibRef = useRef<HTMLSpanElement>(null)

  // Writing loop
  useEffect(() => {
    if (!start || complete) return
    let frame = 0
    const t0 = performance.now()
    let last = -1
    const loop = (now: number) => {
      const elapsed = now - t0
      // binary search: how many glyphs are due
      let lo = 0
      let hi = times.length
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (times[mid] <= elapsed) lo = mid + 1
        else hi = mid
      }
      if (lo !== last) {
        last = lo
        setCount(lo)
      }
      if (lo < total) frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [start, complete, times, total])

  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true
      onDone()
    }
  }, [done, onDone])

  // Stop auto-following as soon as the reader takes control of scrolling.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const stop = () => (follow.current = false)
    el.addEventListener('wheel', stop, { passive: true })
    el.addEventListener('touchmove', stop, { passive: true })
    el.addEventListener('keydown', stop)
    return () => {
      el.removeEventListener('wheel', stop)
      el.removeEventListener('touchmove', stop)
      el.removeEventListener('keydown', stop)
    }
  }, [scroller])

  useEffect(() => {
    if (done || !follow.current) return
    const el = scroller.current
    const nib = nibRef.current
    if (!el || !nib) return
    const box = el.getBoundingClientRect()
    const pen = nib.getBoundingClientRect()
    const margin = Math.min(140, box.height * 0.28)
    if (pen.bottom > box.bottom - margin) {
      el.scrollTo({ top: el.scrollTop + (pen.bottom - (box.bottom - margin)) + margin * 0.6, behavior: 'smooth' })
    }
  }, [count, done, scroller])

  const shown = done ? total : count

  return (
    <div aria-hidden="true">
      {glyphs.map((g, pi) => {
        const startAt = offsets[pi]
        const visible = Math.max(0, Math.min(g.length, shown - startAt))
        const cls = paragraphClassName?.(pi) ?? ''
        if (visible === g.length) return <p key={pi} className={cls}>{paragraphs[pi]}</p>
        if (visible === 0) {
          return (
            <p key={pi} className={cls}>
              <span className="invisible">{paragraphs[pi]}</span>
            </p>
          )
        }
        const fresh = Math.min(5, visible)
        return (
          <p key={pi} className={cls}>
            {g.slice(0, visible - fresh).join('')}
            {g.slice(visible - fresh, visible).map((ch, i) => (
              <span key={startAt + visible - fresh + i} className="animate-ink">
                {ch}
              </span>
            ))}
            <span ref={nibRef} className="relative inline-block w-0">
              <span className="animate-nib absolute -top-[0.55em] left-[2px] h-[0.42em] w-[0.42em] rounded-full bg-champagne shadow-[0_0_10px_3px_rgba(212,175,55,0.55)]" />
            </span>
            <span className="invisible">{g.slice(visible).join('')}</span>
          </p>
        )
      })}
    </div>
  )
}
