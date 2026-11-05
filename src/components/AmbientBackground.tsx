import { motion } from 'motion/react'
import { useMemo } from 'react'
import { createRandom } from '../lib/random'

type Props = { warm: boolean; final: boolean; particleCount: number }

/**
 * Soft ivory → blush backdrop. Once the envelope opens, a warm golden-rose glow
 * fades in on top; it deepens a touch for the final surprise.
 */
export function AmbientBackground({ warm, final, particleCount }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, #fffaf4 0%, rgba(255,248,240,0) 60%), linear-gradient(180deg, #FFF8F0 0%, #fcefe9 50%, #F8D7DA 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: warm ? 1 : 0 }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(70% 55% at 50% 52%, rgba(212,175,55,0.16) 0%, rgba(232,160,191,0.10) 45%, rgba(255,248,240,0) 75%), linear-gradient(180deg, rgba(248,215,218,0.35) 0%, rgba(232,160,191,0.28) 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: final ? 1 : 0 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(60% 50% at 50% 45%, rgba(255,236,214,0.55) 0%, rgba(232,160,191,0.12) 55%, rgba(139,30,63,0.10) 100%)',
        }}
      />
      {/* soft vignette for depth */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 100% at 50% 50%, transparent 60%, rgba(139,30,63,0.10) 100%)' }} />
      <div className="paper absolute inset-0 opacity-[0.35] mix-blend-multiply" style={{ backgroundColor: 'transparent' }} />
      <GlowParticles count={particleCount} warm={warm} />
    </div>
  )
}

function GlowParticles({ count, warm }: { count: number; warm: boolean }) {
  const particles = useMemo(() => {
    const r = createRandom(7)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: r.range(2, 98),
      top: r.range(4, 96),
      size: r.range(2, 5.5),
      color: r.pick(['#D4AF37', '#E8A0BF', '#ffffff', '#f3c9a8']),
      d: r.range(5, 11),
      delay: -r.range(0, 10),
      dx: r.range(-14, 14),
      dy: r.range(-30, -8),
      o: r.range(0.45, 0.95),
    }))
  }, [count])

  return (
    <motion.div className="absolute inset-0" initial={false} animate={{ opacity: warm ? 1 : 0.75 }} transition={{ duration: 2 }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-twinkle absolute rounded-full"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.color}66`,
              '--d': `${p.d}s`,
              '--delay': `${p.delay}s`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--o': p.o,
            } as React.CSSProperties
          }
        />
      ))}
    </motion.div>
  )
}
