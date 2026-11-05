import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { WaxSeal } from './WaxSeal'

export type EnvelopeStep = 0 | 1 | 2 | 3 | 4
// 0 closed · 1 seal breaking · 2 flap opening · 3 flap open + glow · 4 letter peeking out

type Props = {
  width: number
  height: number
  opening: boolean
}

const LINER: React.CSSProperties = {
  backgroundColor: '#f6d9dc',
  backgroundImage:
    'var(--paper-noise), radial-gradient(circle at 50% 50%, rgba(212,175,55,0.38) 0 1.1px, transparent 1.6px), radial-gradient(circle at 0 0, rgba(139,30,63,0.10) 0 1px, transparent 1.5px), linear-gradient(180deg, #f3cfd4 0%, #f8dfe1 100%)',
  backgroundSize: 'auto, 14px 14px, 14px 14px, auto',
  backgroundPosition: '0 0, 0 0, 7px 7px, 0 0',
}

/**
 * The ivory envelope. Purely visual — the parent decides when it opens.
 * Layers (back → front): halo, back panel, inner glow, letter, front pocket, flap, seal.
 */
export function Envelope({ width, height, opening }: Props) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState<EnvelopeStep>(0)

  useEffect(() => {
    if (!opening) {
      setStep(0)
      return
    }
    const timings = reduce ? [0, 50, 200, 500] : [0, 420, 1050, 2150]
    const timers = timings.map((t, i) => window.setTimeout(() => setStep((i + 1) as EnvelopeStep), t))
    return () => timers.forEach(clearTimeout)
  }, [opening, reduce])

  const flapH = height * 0.56
  const flapOpen = step >= 2
  const flapBehind = step >= 3
  const sealSize = Math.round(height * 0.3)

  return (
    <div className="relative" style={{ width, height }}>
      {/* golden halo spilling out of the opening */}
      <motion.div
        className="pointer-events-none absolute left-1/2 rounded-full"
        style={{
          width: width * 1.5,
          height: width * 1.1,
          marginLeft: -width * 0.75,
          top: -width * 0.55,
          background: 'radial-gradient(closest-side, rgba(255,214,140,0.85) 0%, rgba(245,190,120,0.45) 40%, rgba(232,160,191,0.15) 70%, transparent 100%)',
          zIndex: 0,
        }}
        initial={false}
        animate={step >= 3 ? { opacity: [0, 1, 0.75], scale: [0.6, 1.08, 1] } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      />

      <div className="absolute inset-0" style={{ perspective: 1400 }}>
        {/* back panel / inner liner */}
        <div
          className="absolute inset-0 rounded-[6px]"
          style={{
            ...LINER,
            zIndex: 1,
            boxShadow: '0 34px 50px -24px rgba(110,30,50,0.45), 0 12px 22px -12px rgba(110,30,50,0.25)',
          }}
        />
        {/* shadow cast inside, at the mouth */}
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[6px]" style={{ zIndex: 1, background: 'linear-gradient(180deg, rgba(90,30,40,0.18), transparent)' }} />

        {/* golden glow inside */}
        <motion.div
          className="pointer-events-none absolute inset-x-[8%] top-[-10%] h-[70%] rounded-full"
          style={{ zIndex: 2, background: 'radial-gradient(closest-side, rgba(255,226,160,1) 0%, rgba(255,200,130,0.6) 45%, transparent 100%)' }}
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        />

        {/* the folded letter waiting inside */}
        <motion.div
          className="paper absolute left-[7%] w-[86%] rounded-[3px]"
          style={{ zIndex: 4, top: '8%', height: '84%', boxShadow: '0 -4px 14px rgba(110,40,50,0.12)' }}
          initial={false}
          animate={step >= 4 ? { y: -height * 0.5 } : { y: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-x-[12%] top-[14%] font-script text-burgundy/80" style={{ fontSize: height * 0.12 }}>
            For you
          </div>
          <div className="absolute inset-x-[12%] top-[38%] space-y-[7%] opacity-40">
            {[0.92, 0.8, 0.88, 0.6].map((w, i) => (
              <div key={i} className="h-px bg-burgundy/40" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
          <div className="absolute inset-x-0 top-1/2 h-px bg-[rgba(120,70,60,0.12)]" />
        </motion.div>

        {/* front pocket */}
        <div
          className="paper-ivory absolute inset-0 rounded-[6px]"
          style={{ zIndex: 5, clipPath: 'polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)' }}
        >
          <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="env-left" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="env-right" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor="#7a4a3a" stopOpacity="0.10" />
                <stop offset="1" stopColor="#7a4a3a" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="env-bottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
                <stop offset="1" stopColor="#8a5a48" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <path d="M0 0 L150 104 L0 200Z" fill="url(#env-left)" />
            <path d="M300 0 L150 104 L300 200Z" fill="url(#env-right)" />
            <path d="M0 200 L150 90 L300 200Z" fill="#fbf1e3" />
            <path d="M0 200 L150 90 L300 200Z" fill="url(#env-bottom)" />
            <path d="M0 200 L150 90 L300 200" fill="none" stroke="rgba(120,70,55,0.13)" strokeWidth="3.5" vectorEffect="non-scaling-stroke" />
            <path d="M0 200 L150 90 L300 200" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" transform="translate(0 1.2)" />
            <path d="M0 0 L150 104 M300 0 L150 104" fill="none" stroke="rgba(120,70,55,0.10)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* flap shadow on the pocket */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            zIndex: 6,
            height: flapH + 6,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            background: 'linear-gradient(180deg, rgba(90,40,40,0) 40%, rgba(90,40,40,0.22) 100%)',
          }}
          initial={false}
          animate={{ opacity: step >= 2 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* top flap — folds open in 3D */}
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{ height: flapH, transformOrigin: '50% 0%', transformStyle: 'preserve-3d', zIndex: flapBehind ? 3 : 7 }}
          initial={false}
          animate={{ rotateX: flapOpen ? 180 : 0 }}
          transition={{ duration: reduce ? 0.01 : 1.1, ease: [0.6, 0.02, 0.28, 1] }}
        >
          <div
            className="paper-ivory absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              clipPath: 'polygon(0 0, 100% 0, 53% 95%, 50% 100%, 47% 95%)',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 45%, rgba(120,70,55,0.08) 100%)' }} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              ...LINER,
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              clipPath: 'polygon(0 0, 100% 0, 53% 95%, 50% 100%, 47% 95%)',
            }}
          />
        </motion.div>

        {/* wax seal at the flap's tip */}
        <div className="absolute left-1/2" style={{ zIndex: 8, top: flapH - sealSize * 0.62, marginLeft: -sealSize / 2 }}>
          <WaxSeal size={sealSize} broken={step >= 1} />
        </div>
      </div>
    </div>
  )
}
