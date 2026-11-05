import { motion } from 'motion/react'
import { Flower, Leaf, type FlowerKind } from './flora/Flora'

type Piece = { t: 'f'; k: FlowerKind; x: number; y: number; s: number } | { t: 'l'; x: number; y: number; s: number; r: number }

// Coordinates are in a 100×100 box anchored at the corner (0,0 = the very corner).
const CLUSTER: Piece[] = [
  { t: 'l', x: 52, y: 22, s: 34, r: 70 },
  { t: 'l', x: 20, y: 56, s: 32, r: 160 },
  { t: 'l', x: 44, y: 46, s: 26, r: 120 },
  { t: 'f', k: 'peony', x: 16, y: 18, s: 50 },
  { t: 'f', k: 'rose-red', x: 40, y: 10, s: 30 },
  { t: 'f', k: 'rose-pink', x: 10, y: 42, s: 30 },
  { t: 'f', k: 'rose-champagne', x: 36, y: 34, s: 20 },
]

type Corner = 'tl' | 'tr' | 'bl' | 'br'

const FLIP: Record<Corner, { sx: number; sy: number; pos: React.CSSProperties }> = {
  tl: { sx: 1, sy: 1, pos: { left: 0, top: 0 } },
  tr: { sx: -1, sy: 1, pos: { right: 0, top: 0 } },
  bl: { sx: 1, sy: -1, pos: { left: 0, bottom: 0 } },
  br: { sx: -1, sy: -1, pos: { right: 0, bottom: 0 } },
}

/** Luxurious floral corner arrangements that remain after the burst, framing the scene. */
export function CornerFlorals({ size, corners, visible }: { size: number; corners: Corner[]; visible: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {corners.map((c, ci) => {
        const { sx, sy, pos } = FLIP[c]
        return (
          <div key={c} className="absolute" style={{ ...pos, width: size, height: size, transform: `scale(${sx}, ${sy})` }}>
            {CLUSTER.map((p, i) => {
              const px = (p.s / 100) * size
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: (p.x / 100) * size - px / 2 - size * 0.08, top: (p.y / 100) * size - px / 2 - size * 0.08, width: px, height: px }}
                  initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                  animate={visible ? { opacity: 0.95, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.3, rotate: -30 }}
                  transition={{ duration: 1.6, delay: visible ? 0.25 * ci + i * 0.09 : 0, ease: [0.22, 1, 0.36, 1] }}
                >
                  {p.t === 'f' ? (
                    <Flower kind={p.k} size={px} />
                  ) : (
                    <div style={{ transform: `rotate(${p.r}deg)`, transformOrigin: '50% 100%', width: px, height: px, display: 'flex', justifyContent: 'center' }}>
                      <Leaf size={px} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
