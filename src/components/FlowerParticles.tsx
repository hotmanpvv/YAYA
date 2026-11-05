import { motion } from 'motion/react'
import { useMemo } from 'react'
import { createRandom } from '../lib/random'
import { Flower, Leaf, Petal, type FlowerKind, type PetalKind } from './flora/Flora'

type Props = {
  /** burst origin (the envelope's mouth) */
  x: number
  y: number
  width: number
  height: number
  flowers: number
  petals: number
  /** once true, the burst flowers drift outward and fade, leaving the stage clear for the letter */
  settle: boolean
}

type Item =
  | { kind: 'flower'; flower: FlowerKind; size: number }
  | { kind: 'petal'; petal: PetalKind; size: number }
  | { kind: 'leaf'; size: number }

/**
 * Roses, peonies, leaves and loose petals bursting out of the envelope in every
 * direction. Everything is transform/opacity only so it stays smooth on phones.
 */
export function FlowerParticles({ x, y, width, height, flowers, petals, settle }: Props) {
  const items = useMemo(() => {
    const r = createRandom(1987)
    const diag = Math.hypot(width, height)
    const total = flowers + petals
    const scale = Math.min(1, width / 900) * 0.45 + 0.65
    return Array.from({ length: total }, (_, i) => {
      const isFlower = i < flowers
      const item: Item = isFlower
        ? r.next() < 0.12
          ? { kind: 'leaf', size: r.range(40, 70) * scale }
          : { kind: 'flower', flower: r.pick<FlowerKind>(['rose-red', 'rose-red', 'rose-pink', 'peony', 'peony', 'rose-champagne']), size: r.range(46, 104) * scale }
        : { kind: 'petal', petal: r.pick<PetalKind>(['red', 'pink', 'blush', 'pink']), size: r.range(12, 24) }
      // evenly spread angles with jitter, biased upward (out of the envelope's mouth)
      const base = (i / total) * Math.PI * 2 + r.range(-0.25, 0.25)
      const angle = base - Math.PI / 2
      const dirY = Math.sin(angle) < 0.3 ? Math.sin(angle) : Math.sin(angle) * 0.75
      const dist = (isFlower ? r.range(0.3, 0.55) : r.range(0.22, 0.6)) * diag
      const tx = Math.cos(angle) * dist
      const ty = dirY * dist
      const depth = r.next()
      return {
        id: i,
        item,
        tx,
        ty,
        // first, a quick pop out of the envelope's mouth
        px: Math.cos(angle) * r.range(30, 80),
        py: -r.range(60, 140),
        rot: r.range(-200, 200),
        delay: r.range(0, 0.45) + (isFlower ? 0 : 0.15),
        duration: r.range(2.2, 3.1),
        depth,
        blur: isFlower && depth > 0.88 ? 2 : 0,
        drift: 1.25 + r.range(0, 0.35),
      }
    })
  }, [width, height, flowers, petals])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {items.map((p) => {
        const size = p.item.size * (p.blur ? 1.35 : 1)
        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, zIndex: Math.round(p.depth * 10) }}
            initial={{ x: 0, y: 0, scale: 0.15, opacity: 0, rotate: 0 }}
            animate={
              settle
                ? { x: p.tx * p.drift, y: p.ty * p.drift + 60, scale: 0.9, opacity: 0, rotate: p.rot * 1.3 }
                : { x: [0, p.px, p.tx], y: [0, p.py, p.ty], scale: [0.15, 0.85, 1], opacity: [0, 1, 1], rotate: [0, p.rot * 0.3, p.rot] }
            }
            transition={
              settle
                ? { duration: 2.6, ease: [0.4, 0, 0.6, 1] }
                : { duration: p.duration, delay: p.delay, times: [0, 0.22, 1], ease: [[0.2, 0.9, 0.4, 1], [0.16, 1, 0.3, 1]] }
            }
          >
            <div style={p.blur ? { filter: `blur(${p.blur}px)`, width: '100%', height: '100%' } : { width: '100%', height: '100%' }}>
              {p.item.kind === 'flower' && <Flower kind={p.item.flower} size={size} />}
              {p.item.kind === 'leaf' && <Leaf size={size} style={{ marginLeft: size * 0.26 }} />}
              {p.item.kind === 'petal' && <Petal kind={p.item.petal} size={size} />}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/** A soft golden bloom of light at the moment the envelope opens. */
export function BurstGlow({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <motion.div
      className="pointer-events-none fixed rounded-full"
      aria-hidden="true"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background: 'radial-gradient(closest-side, rgba(255,232,180,0.95) 0%, rgba(255,205,150,0.55) 35%, rgba(232,160,191,0.2) 65%, transparent 100%)',
      }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 0.95, 0], scale: [0.2, 1, 1.6] }}
      transition={{ duration: 2.2, ease: 'easeOut', times: [0, 0.35, 1] }}
    />
  )
}
