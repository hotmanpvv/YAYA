import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LETTER_PARAGRAPHS, LETTER_TITLE, SURPRISE_BUTTON } from '../data/letter'
import { getBreakpoint, getEnvelopeLayout, getLetterLayout, type Viewport } from '../lib/layout'
import { WritingText } from './WritingText'
import { Heart } from './flora/Flora'

type Props = {
  viewport: Viewport
  /** the final surprise is showing — the letter steps back */
  faded: boolean
  onSurprise: () => void
}

const PANEL_BG: React.CSSProperties = {
  backgroundColor: '#fffaf3',
  backgroundImage: 'var(--paper-noise), var(--paper-fibers)',
}

function Panel({ height, top, rotate, origin, shade, z, children }: { height: number; top: number; rotate: MotionValue<number>; origin: string; shade: string; z: number; children?: React.ReactNode }) {
  const shadeOpacity = useTransform(rotate, (v) => Math.abs(Math.sin((v * Math.PI) / 180)) * 0.3)
  return (
    <motion.div className="absolute inset-x-0" style={{ top, height, rotateX: rotate, transformOrigin: origin, transformPerspective: 2200, zIndex: z, ...PANEL_BG }}>
      <div className="absolute inset-0" style={{ background: shade }} />
      <motion.div className="absolute inset-0 bg-[#6b2a34]" style={{ opacity: shadeOpacity }} />
      {children}
    </motion.div>
  )
}

/**
 * The letter: rises out of the envelope folded in three, unfolds, then writes
 * itself. Tap (or use the button) to reveal it all at once. It never closes on
 * its own.
 */
export function LoveLetter({ viewport, faded, onSurprise }: Props) {
  const reduce = useReducedMotion()
  const L = getLetterLayout(viewport)
  const env = getEnvelopeLayout(viewport)
  const bp = getBreakpoint(viewport)
  const third = Math.round(L.height / 3)

  const flat = useMotionValue(0)
  const topRot = useMotionValue(reduce ? 0 : -178)
  const bottomRot = useMotionValue(reduce ? 0 : 178)
  const [unfolded, setUnfolded] = useState(!!reduce)
  const [startWriting, setStartWriting] = useState(false)
  const [skipped, setSkipped] = useState(!!reduce)
  const [finished, setFinished] = useState(!!reduce)
  const scroller = useRef<HTMLDivElement>(null)
  const [shadowBox, setShadowBox] = useState(reduce ? { top: 0, height: L.height } : { top: third, height: third })

  // rise → unfold top → unfold bottom → write
  useEffect(() => {
    if (reduce) {
      setStartWriting(true)
      return
    }
    const controls: { stop: () => void }[] = []
    const timers: number[] = []
    timers.push(
      window.setTimeout(() => {
        controls.push(animate(topRot, 0, { duration: 1.05, ease: [0.45, 0.05, 0.25, 1] }))
        setShadowBox({ top: 0, height: third * 2 })
      }, 1500),
    )
    timers.push(
      window.setTimeout(() => {
        controls.push(animate(bottomRot, 0, { duration: 1.05, ease: [0.45, 0.05, 0.25, 1] }))
        setShadowBox({ top: 0, height: L.height })
      }, 2250),
    )
    timers.push(window.setTimeout(() => setUnfolded(true), 3200))
    timers.push(window.setTimeout(() => setStartWriting(true), 3700))
    return () => {
      timers.forEach(clearTimeout)
      controls.forEach((c) => c.stop())
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep the shadow right if the screen is resized after unfolding
  useEffect(() => {
    if (unfolded) setShadowBox({ top: 0, height: L.height })
  }, [unfolded, L.height])

  const reveal = useCallback(() => {
    if (unfolded && !finished) setSkipped(true)
  }, [unfolded, finished])
  const onDone = useCallback(() => setFinished(true), [])

  const riseFrom = env.cy - (L.top + L.height / 2)
  const fontSize = bp === 'mobile' ? '1.13rem' : '1.24rem'

  return (
    <>
      <motion.div
        className="fixed"
        style={{ left: L.left, top: L.top, width: L.width, height: L.height, zIndex: faded ? 8 : 30, pointerEvents: faded ? 'none' : 'auto' }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: riseFrom + 20, scale: 0.42 }}
        animate={
          faded
            ? { opacity: 0.07, y: 0, scale: 0.94, filter: 'blur(4px)' }
            : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
        }
        transition={faded ? { duration: 1.6, ease: 'easeInOut' } : { duration: reduce ? 0.6 : 1.5, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.5 } }}
        aria-hidden={faded || undefined}
      >
        {/* paper shadow, grows as the sheet unfolds */}
        <motion.div
          className="pointer-events-none absolute inset-x-0"
          initial={false}
          animate={shadowBox}
          transition={{ duration: 1.05, ease: [0.45, 0.05, 0.25, 1] }}
          style={{ boxShadow: '0 40px 70px -30px rgba(90,20,40,0.5), 0 14px 30px -14px rgba(90,20,40,0.28)', borderRadius: 4 }}
        />

        {/* the three folded panels */}
        <Panel top={third} height={third} rotate={flat} origin="50% 50%" z={1} shade="linear-gradient(180deg, rgba(120,60,50,0.07) 0%, transparent 10%, transparent 90%, rgba(120,60,50,0.07) 100%)" />
        <Panel top={0} height={third} rotate={topRot} origin="50% 100%" z={3} shade="linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(120,60,50,0.08) 100%)" />
        <Panel top={third * 2} height={L.height - third * 2} rotate={bottomRot} origin="50% 0%" z={2} shade="linear-gradient(180deg, rgba(120,60,50,0.08) 0%, transparent 18%, rgba(120,60,50,0.04) 100%)" />

        {/* fold creases */}
        <motion.div className="pointer-events-none absolute inset-x-0 z-[4]" initial={{ opacity: 0 }} animate={{ opacity: unfolded ? 1 : 0 }} transition={{ duration: 0.8 }}>
          {[third, third * 2].map((y) => (
            <div key={y} className="absolute inset-x-0" style={{ top: y - 1, height: 2, background: 'linear-gradient(180deg, rgba(110,60,50,0.10), rgba(255,255,255,0.7))' }} />
          ))}
        </motion.div>

        {/* the words */}
        <motion.div
          ref={scroller}
          className="letter-scroll absolute inset-0 z-[5] overflow-y-auto overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: unfolded ? 1 : 0 }}
          transition={{ duration: 1.2 }}
          onClick={reveal}
          style={{ pointerEvents: unfolded ? 'auto' : 'none' }}
          tabIndex={unfolded ? 0 : -1}
          aria-label="The letter"
        >
          <article className="relative px-6 pb-16 pt-9 sm:px-12 sm:pb-20 sm:pt-12">
            <h2 className="text-center font-script leading-none text-burgundy" style={{ fontSize: 'clamp(2.3rem, 9vw, 3.3rem)' }}>
              {LETTER_TITLE.replace(' ❤️', '')}
              <span className="ml-2 align-middle font-serif text-[0.5em]">❤️</span>
            </h2>
            <Flourish />

            {/* screen readers get the whole letter at once */}
            <div className="sr-only-text">
              {LETTER_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-6 font-serif font-medium text-ink" style={{ fontSize, lineHeight: 1.78 }}>
              <WritingText
                paragraphs={LETTER_PARAGRAPHS}
                start={startWriting}
                complete={skipped}
                onDone={onDone}
                scroller={scroller}
                paragraphClassName={(i) =>
                  i === 0
                    ? 'mb-5 italic text-[1.12em]'
                    : i === LETTER_PARAGRAPHS.length - 1
                      ? 'mt-7 text-center italic text-burgundy text-[1.08em]'
                      : i === 4
                        ? 'mb-5 italic text-burgundy/90'
                        : 'mb-5'
                }
              />
            </div>

            <AnimatePresence>
              {finished && (
                <motion.div className="mt-8 flex items-center justify-center gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}>
                  <span className="h-px w-14 bg-gradient-to-r from-transparent to-champagne/70" />
                  <Heart size={14} color="#8B1E3F" />
                  <span className="h-px w-14 bg-gradient-to-l from-transparent to-champagne/70" />
                </motion.div>
              )}
            </AnimatePresence>
          </article>

          <AnimatePresence>
            {startWriting && !finished && (
              <motion.div className="sticky bottom-0 flex justify-center pb-3 pt-6" style={{ background: 'linear-gradient(180deg, rgba(255,250,243,0), rgba(255,250,243,0.95) 55%)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, delay: 1.5 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSkipped(true)
                  }}
                  className="rounded-full px-4 py-1.5 font-serif text-sm italic text-burgundy/70 transition hover:text-burgundy"
                >
                  tap the letter to read it all at once
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {finished && !faded && (
          <motion.div
            className="fixed inset-x-0 z-30 flex justify-center px-4"
            style={{ top: L.bottom + 16 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.5 } }}
            transition={{ duration: 1.1, delay: skipped ? 0.4 : 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <SurpriseButton onClick={onSurprise} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Flourish() {
  return (
    <svg viewBox="0 0 240 20" className="mx-auto mt-3 block h-4 w-48 text-champagne" aria-hidden="true">
      <path d="M8 10 C40 10 60 4 96 9 M232 10 C200 10 180 4 144 9" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M96 9 C104 10 108 14 112 11 M144 9 C136 10 132 14 128 11" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M120 15.5 l-1.6-1.4c-3-2.7-4.9-4.4-4.9-6.4 0-1.6 1.3-2.9 2.9-2.9.9 0 1.8.4 2.4 1.1h.4c.6-.7 1.5-1.1 2.4-1.1 1.6 0 2.9 1.3 2.9 2.9 0 2-1.9 3.7-4.9 6.4z" fill="#8B1E3F" opacity="0.8" />
      <circle cx="8" cy="10" r="1.3" fill="currentColor" />
      <circle cx="232" cy="10" r="1.3" fill="currentColor" />
    </svg>
  )
}

export function SurpriseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden rounded-full px-7 py-3 font-serif text-lg italic tracking-wide text-ivory sm:text-xl"
      style={{
        background: 'linear-gradient(135deg, #9c2a4c 0%, #8B1E3F 45%, #6e1530 100%)',
        boxShadow: '0 14px 30px -12px rgba(139,30,63,0.65), inset 0 0 0 1px rgba(212,175,55,0.55), inset 0 0 0 4px rgba(139,30,63,1), inset 0 0 0 5px rgba(212,175,55,0.35)',
      }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{ background: 'linear-gradient(100deg, transparent, rgba(255,240,210,0.28), transparent)' }}
        initial={{ x: '-120%' }}
        animate={{ x: ['-120%', '420%'] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }}
      />
      <span className="relative">{SURPRISE_BUTTON}</span>
    </motion.button>
  )
}
