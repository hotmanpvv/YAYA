import { motion, useReducedMotion } from 'motion/react'
import { SURPRISE_MESSAGE, SURPRISE_SIGNOFF } from '../data/letter'
import { getBreakpoint, type Viewport } from '../lib/layout'
import { Bouquet } from './Bouquet'

type Props = {
  viewport: Viewport
  onReplay: () => void
  onBackToLetter: () => void
}

/** The last little surprise: a blooming bouquet and a handwritten note. */
export function FinalSurprise({ viewport, onReplay, onBackToLetter }: Props) {
  const reduce = useReducedMotion()
  const bp = getBreakpoint(viewport)
  const bouquetWidth = Math.min(viewport.width * 0.74, bp === 'desktop' ? 400 : 320, (viewport.height * (bp === 'mobile' ? 0.36 : 0.48)) / 1.25)
  const words = SURPRISE_MESSAGE.split(' ')
  const msgDelay = reduce ? 0.2 : 2.3
  const signDelay = msgDelay + (reduce ? 0.2 : words.length * 0.13 + 0.9)

  return (
    <div className="pointer-events-none fixed inset-0 z-[35] flex flex-col items-center justify-center px-6" role="region" aria-label="A final little surprise">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
        <Bouquet width={bouquetWidth} />
      </motion.div>

      <p className="mt-2 max-w-[22ch] text-center font-script leading-[1.25] text-burgundy sm:mt-4 sm:max-w-[26ch]" style={{ fontSize: 'clamp(1.75rem, 6.4vw, 2.7rem)' }}>
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: msgDelay + (reduce ? 0 : i * 0.13), ease: 'easeOut' }}
          >
            {w === '❤️' ? <span className="font-serif text-[0.6em]">{w}</span> : w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </p>

      <motion.p
        className="mt-4 text-center font-serif text-[0.95rem] italic tracking-[0.06em] text-ink/70 sm:mt-6 sm:text-lg"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: signDelay }}
      >
        {SURPRISE_SIGNOFF}
      </motion.p>

      <motion.div
        className="pointer-events-auto mt-5 flex items-center gap-2 sm:mt-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: signDelay + 1 }}
      >
        <button
          type="button"
          onClick={onBackToLetter}
          className="rounded-full px-4 py-2 font-serif text-sm italic text-burgundy/60 transition hover:bg-white/40 hover:text-burgundy"
        >
          read the letter again
        </button>
        <span className="h-3 w-px bg-burgundy/20" aria-hidden="true" />
        <button
          type="button"
          onClick={onReplay}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 font-serif text-sm italic text-burgundy/60 transition hover:bg-white/40 hover:text-burgundy"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          replay
        </button>
      </motion.div>
    </div>
  )
}
