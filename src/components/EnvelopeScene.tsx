import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { getEnvelopeLayout, type Viewport } from '../lib/layout'
import { Envelope } from './Envelope'

type Props = {
  viewport: Viewport
  /** 'closed' → waiting for a tap · 'opening' → animating · 'gone' → sinks away as the letter rises */
  state: 'closed' | 'opening' | 'gone'
  onOpen: () => void
}

/** Opening scene: the floating envelope with its two little lines of text. */
export function EnvelopeScene({ viewport, state, onOpen }: Props) {
  const reduce = useReducedMotion()
  const env = getEnvelopeLayout(viewport)
  const closed = state === 'closed'

  return (
    <>
      <AnimatePresence>
        {closed && (
          <motion.h1
            key="title"
            className="pointer-events-none fixed inset-x-0 z-20 px-6 text-center font-script leading-tight text-burgundy"
            style={{ bottom: viewport.height - (env.cy - env.height / 2) + Math.min(56, viewport.height * 0.07), fontSize: 'clamp(2.1rem, 8vw, 3.4rem)' }}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.7 } }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            A little something for <span className="whitespace-nowrap">you… <span className="font-serif text-[0.55em] not-italic">💌</span></span>
          </motion.h1>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed z-20"
        style={{ left: env.cx - env.width / 2, top: env.cy - env.height / 2, width: env.width, height: env.height }}
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={
          state === 'gone'
            ? { opacity: 0, y: viewport.height * 0.35, scale: 0.86, transition: { duration: 1.4, ease: [0.55, 0, 0.7, 0.3] } }
            : { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } }
        }
      >
        {/* gentle float */}
        <motion.div
          className="h-full w-full"
          animate={closed && !reduce ? { y: [0, -10, 0], rotate: [-0.7, 0.7, -0.7] } : { y: 0, rotate: 0 }}
          transition={closed && !reduce ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8, ease: 'easeOut' }}
        >
          <motion.button
            type="button"
            onClick={closed ? onOpen : undefined}
            disabled={!closed}
            aria-label="Open the envelope"
            className="block h-full w-full cursor-pointer rounded-md disabled:cursor-default"
            style={{ rotateX: 6, transformPerspective: 900 }}
            whileHover={closed ? { scale: 1.025 } : undefined}
            whileTap={closed ? { scale: 0.975 } : undefined}
          >
            <Envelope width={env.width} height={env.height} opening={!closed} />
          </motion.button>
        </motion.div>
        {/* soft contact shadow */}
        <motion.div
          className="pointer-events-none absolute left-[8%] right-[8%] rounded-[50%]"
          style={{ bottom: -env.height * 0.24, height: env.height * 0.12, background: 'radial-gradient(closest-side, rgba(110,30,50,0.28), transparent)' }}
          animate={closed && !reduce ? { scaleX: [1, 0.9, 1], opacity: [0.9, 0.6, 0.9] } : { scaleX: 1, opacity: 0.8 }}
          transition={closed && !reduce ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
      </motion.div>

      <AnimatePresence>
        {closed && (
          <motion.p
            key="hint"
            className="pointer-events-none fixed inset-x-0 z-20 text-center font-serif text-sm uppercase tracking-[0.35em] text-burgundy/70"
            style={{ top: env.cy + env.height / 2 + Math.min(64, viewport.height * 0.08) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 1.2, delay: 1.4 }}
          >
            <span className="animate-breathe inline-block">Tap to open</span>
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}
