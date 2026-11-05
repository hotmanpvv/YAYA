import { motion } from 'motion/react'
import { useMemo } from 'react'
import { createRandom } from '../lib/random'
import { Heart } from './flora/Flora'

const COLORS = ['#8B1E3F', '#E8A0BF', '#c43c62', '#D4AF37', '#e27a9b']

/** Gentle glowing hearts drifting upward from the bottom of the screen (CSS animated). */
export function FloatingHearts({ count, seed = 3, className = '' }: { count: number; seed?: number; className?: string }) {
  const hearts = useMemo(() => {
    const r = createRandom(seed)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: r.range(4, 96),
      size: r.range(8, 17),
      color: r.pick(COLORS),
      d: r.range(9, 15),
      delay: (i / count) * 10 + r.range(0, 2),
      drift: r.range(-50, 50),
      rise: -r.range(55, 95),
      o: r.range(0.45, 0.8),
    }))
  }, [count, seed])

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="animate-heart-rise absolute bottom-[-24px]"
          style={
            {
              left: `${h.left}%`,
              '--d': `${h.d}s`,
              '--delay': `${h.delay}s`,
              '--drift': `${h.drift}px`,
              '--rise': `${h.rise}vh`,
              '--o': h.o,
            } as React.CSSProperties
          }
        >
          <Heart size={h.size} color={h.color} glow />
        </div>
      ))}
    </div>
  )
}

/** A one-off flurry of hearts rising from a point (used when the envelope opens / bouquet blooms). */
export function HeartBurst({ x, y, count, seed = 21, spread = 160, rise = 320 }: { x: number; y: number; count: number; seed?: number; spread?: number; rise?: number }) {
  const hearts = useMemo(() => {
    const r = createRandom(seed)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      dx: r.range(-spread, spread),
      dy: -r.range(rise * 0.5, rise),
      size: r.range(9, 18),
      color: r.pick(COLORS),
      delay: r.range(0, 0.9),
      d: r.range(2.6, 4),
    }))
  }, [count, seed, spread, rise])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: x, top: y }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
          animate={{ x: [0, h.dx * 0.6, h.dx], y: [0, h.dy * 0.6, h.dy], opacity: [0, 1, 0], scale: [0.3, 1, 0.8] }}
          transition={{ duration: h.d, delay: h.delay, ease: 'easeOut', times: [0, 0.55, 1] }}
        >
          <Heart size={h.size} color={h.color} glow />
        </motion.div>
      ))}
    </div>
  )
}
