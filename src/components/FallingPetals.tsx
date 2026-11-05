import { useMemo } from 'react'
import { createRandom } from '../lib/random'
import { Petal, type PetalKind } from './flora/Flora'

type Props = { count: number; seed?: number; className?: string }

/** Rose petals drifting down from the top of the screen — pure CSS animation for smoothness. */
export function FallingPetals({ count, seed = 11, className = '' }: Props) {
  const petals = useMemo(() => {
    const r = createRandom(seed)
    return Array.from({ length: count }, (_, i) => {
      const depth = r.next() // 0 = far, 1 = near
      return {
        id: i,
        left: r.range(-2, 100),
        size: 10 + depth * 16,
        kind: r.pick<PetalKind>(['red', 'red', 'pink', 'pink', 'blush']),
        d: 18 - depth * 6 + r.range(-2, 2),
        delay: (i / count) * 9 + r.range(0, 1.5),
        drift: r.range(-90, 90),
        sway: r.range(30, 80),
        sd: r.range(2.6, 4.6),
        fd: r.range(4, 8),
        spin: r.range(140, 360) * r.sign(),
        o: 0.55 + depth * 0.4,
      }
    })
  }, [count, seed])

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="animate-petal absolute top-0"
          style={
            {
              left: `${p.left}%`,
              '--d': `${p.d}s`,
              '--delay': `${p.delay}s`,
              '--drift': `${p.drift}px`,
              '--o': p.o,
            } as React.CSSProperties
          }
        >
          <div className="animate-petal-sway" style={{ '--sway': `${p.sway}px`, '--sd': `${p.sd}s` } as React.CSSProperties}>
            <div className="animate-petal-flutter" style={{ '--fd': `${p.fd}s`, '--spin': `${p.spin}deg` } as React.CSSProperties}>
              <Petal kind={p.kind} size={p.size} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
