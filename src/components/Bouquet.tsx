import { motion, useReducedMotion } from 'motion/react'
import type { FlowerKind } from './flora/Flora'

// Flower heads arranged in a dome (back → front). r = radius in the 400×500 box.
const HEADS: { k: FlowerKind; x: number; y: number; r: number }[] = [
  { k: 'rose-pink', x: 200, y: 98, r: 34 },
  { k: 'rose-champagne', x: 292, y: 140, r: 32 },
  { k: 'rose-pink', x: 108, y: 146, r: 33 },
  { k: 'rose-red', x: 238, y: 130, r: 42 },
  { k: 'peony', x: 160, y: 132, r: 44 },
  { k: 'rose-red', x: 92, y: 214, r: 32 },
  { k: 'rose-red', x: 310, y: 214, r: 32 },
  { k: 'peony', x: 266, y: 198, r: 50 },
  { k: 'peony', x: 136, y: 202, r: 48 },
  { k: 'rose-red', x: 200, y: 186, r: 54 },
  { k: 'rose-pink', x: 150, y: 262, r: 40 },
  { k: 'rose-champagne', x: 202, y: 250, r: 34 },
  { k: 'rose-pink', x: 256, y: 264, r: 40 },
]

const LEAVES = [
  { a: -62, s: 3.4 },
  { a: -38, s: 3.8 },
  { a: -12, s: 3.2 },
  { a: 14, s: 3.5 },
  { a: 40, s: 3.9 },
  { a: 64, s: 3.3 },
  { a: -78, s: 2.6 },
  { a: 80, s: 2.7 },
]

const FILLER = Array.from({ length: 22 }, (_, i) => {
  const a = -Math.PI * (0.08 + (i / 21) * 0.84)
  const rad = 150 + ((i * 37) % 30)
  return { x: 200 + Math.cos(a) * rad, y: 270 + Math.sin(a) * rad * 0.95, r: 2.2 + (i % 3) * 0.8, gold: i % 3 === 0 }
})

const spring = { type: 'spring' as const, stiffness: 120, damping: 13 }

/** A hand-tied bouquet that blooms piece by piece: wrap, greenery, flowers, ribbon. */
export function Bouquet({ width }: { width: number }) {
  const reduce = useReducedMotion()
  const d = (t: number) => (reduce ? 0 : t)

  return (
    <svg viewBox="0 0 400 500" width={width} height={width * 1.25} style={{ overflow: 'visible' }} role="img" aria-label="A bouquet of roses and peonies">
      <defs>
        <linearGradient id="wrap-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf3" />
          <stop offset="1" stopColor="#f1e1cf" />
        </linearGradient>
        <linearGradient id="wrap-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9e0e3" />
          <stop offset="0.55" stopColor="#f3c6cf" />
          <stop offset="1" stopColor="#e2a3b5" />
        </linearGradient>
        <linearGradient id="wrap-fold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b23a5e" />
          <stop offset="0.5" stopColor="#8B1E3F" />
          <stop offset="1" stopColor="#5e0f28" />
        </linearGradient>
        <radialGradient id="bouquet-glow">
          <stop offset="0" stopColor="#ffe3b0" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#f8d7da" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f8d7da" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.ellipse cx="200" cy="200" rx="230" ry="210" fill="url(#bouquet-glow)" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2.4, ease: 'easeOut' }} />

      {/* back wrap — a fan of ivory paper */}
      <motion.g style={{ transformOrigin: '50% 100%', transformBox: 'fill-box' }} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.9, delay: d(0.1), ease: [0.22, 1, 0.36, 1] }}>
        <path d="M200 470 L44 190 C70 160 96 176 118 150 C140 128 170 140 200 118 C230 140 260 128 282 150 C304 176 330 160 356 190 Z" fill="url(#wrap-back)" stroke="rgba(150,110,90,0.25)" strokeWidth="1" />
        <path d="M200 470 L118 150 M200 470 L282 150" stroke="rgba(150,110,90,0.18)" strokeWidth="1" fill="none" />
      </motion.g>

      {/* greenery */}
      {LEAVES.map((l, i) => (
        <g key={i} transform={`translate(200 300) rotate(${l.a})`}>
          <motion.g style={{ transformOrigin: '50% 100%', transformBox: 'fill-box' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1, delay: d(0.4 + i * 0.06), ease: [0.22, 1, 0.36, 1] }}>
            <use href="#leaf-shape" x={-12 * l.s} y={-50 * l.s - 70} width={24 * l.s} height={52 * l.s} />
          </motion.g>
        </g>
      ))}

      {/* baby's-breath filler */}
      {FILLER.map((f, i) => (
        <motion.circle key={i} cx={f.x} cy={f.y} r={f.r} fill={f.gold ? '#D4AF37' : '#fffaf3'} stroke={f.gold ? 'none' : 'rgba(200,170,150,0.6)'} strokeWidth="0.6" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.95, scale: 1 }} transition={{ delay: d(1.4 + i * 0.03), duration: 0.5 }} />
      ))}

      {/* flowers */}
      {HEADS.map((h, i) => (
        <motion.g key={i} initial={{ scale: 0, rotate: -50, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ ...spring, delay: d(0.7 + i * 0.09), opacity: { duration: 0.3, delay: d(0.7 + i * 0.09) } }} style={{ transformOrigin: '50% 50%', transformBox: 'fill-box' }}>
          <use href={`#${h.k}`} x={h.x - h.r} y={h.y - h.r} width={h.r * 2} height={h.r * 2} />
        </motion.g>
      ))}

      {/* front wrap */}
      <motion.g initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: d(0.35), ease: [0.22, 1, 0.36, 1] }}>
        <path d="M200 478 L96 268 C126 284 150 272 168 290 C182 300 190 296 200 300 C210 296 218 300 232 290 C250 272 274 284 304 268 Z" fill="url(#wrap-front)" stroke="rgba(139,30,63,0.18)" strokeWidth="1" />
        <path d="M200 478 L96 268 C126 284 150 272 168 290 L200 478Z" fill="url(#wrap-fold)" />
        <path d="M200 478 L232 290 C250 272 274 284 304 268 Z" fill="rgba(139,30,63,0.06)" />
        <path d="M200 478 L168 290 M200 478 L232 290" stroke="rgba(139,30,63,0.14)" strokeWidth="1" fill="none" />
      </motion.g>

      {/* satin ribbon bow */}
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: d(1.9) }} style={{ transformOrigin: '50% 30%', transformBox: 'fill-box' }}>
        <path d="M198 392 C186 420 178 446 160 470 L172 474 L182 462 C190 440 198 418 204 396 Z" fill="url(#ribbon)" />
        <path d="M202 392 C214 420 224 446 244 468 L232 474 L222 462 C212 440 204 418 196 396 Z" fill="url(#ribbon)" />
        <path d="M200 386 C180 362 146 362 148 384 C150 404 182 400 200 390 Z" fill="url(#ribbon)" />
        <path d="M200 386 C220 362 254 362 252 384 C250 404 218 400 200 390 Z" fill="url(#ribbon)" />
        <path d="M160 378 C170 372 184 376 194 384" stroke="rgba(255,200,215,0.45)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M240 378 C230 372 216 376 206 384" stroke="rgba(255,200,215,0.3)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <ellipse cx="200" cy="389" rx="9" ry="8" fill="#7a1735" />
        <ellipse cx="197" cy="386" rx="3.5" ry="2.4" fill="rgba(255,210,220,0.35)" />
      </motion.g>
    </svg>
  )
}
