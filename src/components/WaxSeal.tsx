import { motion } from 'motion/react'
import { HEART_PATH } from './flora/FloralDefs'
import { createRandom } from '../lib/random'

// An irregular, hand-pressed wax outline (generated once).
const BLOB = (() => {
  const r = createRandom(42)
  const n = 18
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const rad = 46 + r.range(-2.6, 2.6)
    return [Math.cos(a) * rad, Math.sin(a) * rad]
  })
  let d = ''
  pts.forEach((p, i) => {
    const next = pts[(i + 1) % n]
    const mx = (p[0] + next[0]) / 2
    const my = (p[1] + next[1]) / 2
    d += i === 0 ? `M${mx.toFixed(2)} ${my.toFixed(2)}` : ''
    const n2 = pts[(i + 2) % n]
    const mx2 = (next[0] + n2[0]) / 2
    const my2 = (next[1] + n2[1]) / 2
    d += ` Q${next[0].toFixed(2)} ${next[1].toFixed(2)} ${mx2.toFixed(2)} ${my2.toFixed(2)}`
  })
  return d + 'Z'
})()

function SealArt({ uid }: { uid: string }) {
  return (
    <svg viewBox="-50 -50 100 100" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <radialGradient id={`${uid}-wax`} cx="-14" cy="-16" r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c0395f" />
          <stop offset="0.35" stopColor="#9a2147" />
          <stop offset="0.8" stopColor="#74122f" />
          <stop offset="1" stopColor="#560b22" />
        </radialGradient>
        <radialGradient id={`${uid}-inner`} cx="6" cy="8" r="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8b1e3f" />
          <stop offset="1" stopColor="#6e1431" />
        </radialGradient>
      </defs>
      <path d={BLOB} fill="rgba(60,5,20,0.35)" transform="translate(1.5 3)" />
      <path d={BLOB} fill={`url(#${uid}-wax)`} />
      <circle r="31" fill={`url(#${uid}-inner)`} />
      <circle r="31" fill="none" stroke="rgba(40,0,12,0.45)" strokeWidth="2.2" />
      <circle r="33.5" fill="none" stroke="rgba(255,170,195,0.28)" strokeWidth="1.2" />
      {/* tiny beaded border */}
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * 26.5} cy={Math.sin(a) * 26.5} r="0.9" fill="rgba(255,190,210,0.35)" />
      })}
      {/* embossed heart */}
      <g transform="translate(-14.4 -13.8) scale(1.2)">
        <path d={HEART_PATH} fill="rgba(40,0,12,0.55)" transform="translate(0.7 0.8)" />
        <path d={HEART_PATH} fill="#7d1838" />
        <path d={HEART_PATH} fill="none" stroke="rgba(255,175,200,0.45)" strokeWidth="0.7" transform="translate(-0.35 -0.4)" />
      </g>
      <ellipse cx="-17" cy="-22" rx="11" ry="5" fill="rgba(255,255,255,0.22)" transform="rotate(-35 -17 -22)" />
    </svg>
  )
}

const LEFT = 'polygon(0 0, 52% 0, 46% 22%, 55% 41%, 47% 60%, 54% 79%, 49% 100%, 0 100%)'
const RIGHT = 'polygon(52% 0, 100% 0, 100% 100%, 49% 100%, 54% 79%, 47% 60%, 55% 41%, 46% 22%)'

/** Burgundy heart wax seal. When `broken`, it cracks into two halves that fall away. */
export function WaxSeal({ size, broken }: { size: number; broken: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: LEFT }}
        initial={false}
        animate={broken ? { x: -size * 0.28, y: size * 0.9, rotate: -32, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={broken ? { duration: 0.9, ease: [0.5, 0, 0.75, 0.4], opacity: { duration: 0.5, delay: 0.45 } } : { duration: 0 }}
      >
        <SealArt uid="seal-l" />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: RIGHT }}
        initial={false}
        animate={broken ? { x: size * 0.3, y: size * 0.75, rotate: 28, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={broken ? { duration: 0.9, ease: [0.5, 0, 0.75, 0.4], delay: 0.06, opacity: { duration: 0.5, delay: 0.5 } } : { duration: 0 }}
      >
        <SealArt uid="seal-r" />
      </motion.div>
      {/* the crack flash */}
      <motion.div
        className="pointer-events-none absolute inset-[-30%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,228,170,0.9) 0%, rgba(255,210,150,0.3) 35%, transparent 65%)' }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={broken ? { opacity: [0, 0.9, 0], scale: [0.4, 1.1, 1.4] } : { opacity: 0, scale: 0.4 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}
