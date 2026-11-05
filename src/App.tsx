import { MotionConfig, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { CornerFlorals } from './components/CornerFlorals'
import { EnvelopeScene } from './components/EnvelopeScene'
import { FallingPetals } from './components/FallingPetals'
import { FinalSurprise } from './components/FinalSurprise'
import { FloatingHearts, HeartBurst } from './components/FloatingHearts'
import { FloatingMemories } from './components/FloatingMemories'
import { BurstGlow, FlowerParticles } from './components/FlowerParticles'
import { LoveLetter } from './components/LoveLetter'
import { PhotoLightbox } from './components/PhotoLightbox'
import { FloralDefs } from './components/flora/FloralDefs'
import { preloadPhotos, usePhotos, type Photo } from './hooks/usePhotos'
import { useViewport } from './hooks/useViewport'
import { getBreakpoint, getEnvelopeLayout } from './lib/layout'

/**
 * closed  → the envelope waits to be tapped
 * opening → seal breaks, flap opens, flowers burst, photos float out
 * letter  → the letter rises, unfolds and writes itself
 * final   → the bouquet & last message
 */
type Phase = 'closed' | 'opening' | 'letter' | 'final'

export default function App() {
  const [run, setRun] = useState(0)
  return (
    <MotionConfig reducedMotion="user">
      <FloralDefs />
      <Experience key={run} onReplay={() => setRun((r) => r + 1)} />
    </MotionConfig>
  )
}

function Experience({ onReplay }: { onReplay: () => void }) {
  const reduce = useReducedMotion()
  const viewport = useViewport()
  const bp = getBreakpoint(viewport)
  const env = getEnvelopeLayout(viewport)
  const { photos } = usePhotos()

  const [phase, setPhase] = useState<Phase>('closed')
  const [burst, setBurst] = useState(false)
  const [memories, setMemories] = useState(false)
  const [failed, setFailed] = useState<Set<string>>(() => new Set())
  const [lightbox, setLightbox] = useState<{ list: Photo[]; index: number } | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const alivePhotos = useMemo(() => photos.filter((p) => !failed.has(p.src)), [photos, failed])
  const markFailed = useCallback((src: string) => setFailed((prev) => (prev.has(src) ? prev : new Set(prev).add(src))), [])

  const open = useCallback(() => {
    if (phase !== 'closed') return
    setPhase('opening')
    preloadPhotos(photos)
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    if (reduce) {
      at(300, () => setBurst(true))
      at(500, () => setMemories(true))
      at(1200, () => setPhase('letter'))
    } else {
      at(2050, () => setBurst(true))
      at(2900, () => setMemories(true))
      at(2900 + Math.min(alivePhotos.length, 4) * 420 + 1700, () => setPhase('letter'))
    }
  }, [phase, photos, reduce, alivePhotos.length])

  const counts = {
    particles: bp === 'mobile' ? 14 : bp === 'tablet' ? 22 : 30,
    flowers: bp === 'mobile' ? 11 : bp === 'tablet' ? 16 : 22,
    burstPetals: bp === 'mobile' ? 10 : 18,
    petals: bp === 'mobile' ? 9 : bp === 'tablet' ? 13 : 18,
    hearts: bp === 'mobile' ? 6 : 10,
  }
  const opened = phase !== 'closed'
  const final = phase === 'final'
  const mouthY = env.cy - env.height * 0.25

  return (
    <main className="relative h-full w-full overflow-hidden">
      <AmbientBackground warm={burst} final={final} particleCount={counts.particles} />

      <div className="fixed inset-0 z-[2]">
        <CornerFlorals
          size={bp === 'mobile' ? 150 : bp === 'tablet' ? 210 : 270}
          corners={bp === 'mobile' ? ['tl', 'br'] : ['tl', 'tr', 'bl', 'br']}
          visible={burst}
        />
      </div>

      {phase !== 'final' && <EnvelopeScene viewport={viewport} state={phase === 'closed' ? 'closed' : phase === 'opening' ? 'opening' : 'gone'} onOpen={open} />}

      {burst && !reduce && (
        <div className="fixed inset-0 z-[22] pointer-events-none">
          <BurstGlow x={env.cx} y={mouthY} size={Math.max(viewport.width, viewport.height) * 0.9} />
        </div>
      )}

      {memories && alivePhotos.length > 0 && (
        <div className="fixed inset-0 z-[25] pointer-events-none">
          <FloatingMemories
            photos={alivePhotos}
            viewport={viewport}
            mode={final ? 'frame' : 'letter'}
            origin={{ x: env.cx, y: mouthY }}
            dimmed={phase === 'letter'}
            onOpen={(photo, list) => setLightbox({ list, index: Math.max(0, list.indexOf(photo)) })}
            onFailed={markFailed}
          />
        </div>
      )}

      {/* petals & hearts drift above the photos but beneath the letter */}
      {burst && !reduce && (
        <div className="fixed inset-0 z-[27] pointer-events-none">
          <FallingPetals count={counts.petals} />
          <FloatingHearts count={counts.hearts} />
          {final && <FallingPetals count={Math.round(counts.petals * 0.8)} seed={77} />}
        </div>
      )}

      {(phase === 'letter' || final) && (
        <LoveLetter viewport={viewport} faded={final} onSurprise={() => setPhase('final')} />
      )}

      {final && <FinalSurprise viewport={viewport} onReplay={onReplay} onBackToLetter={() => setPhase('letter')} />}

      {final && !reduce && (
        <div className="fixed inset-0 z-[36] pointer-events-none">
          <HeartBurst x={viewport.width / 2} y={viewport.height * 0.38} count={bp === 'mobile' ? 10 : 16} seed={5} spread={bp === 'mobile' ? 130 : 220} />
        </div>
      )}

      {/* the burst sits on top of everything while it happens, then clears away */}
      {burst && !reduce && (
        <div className="fixed inset-0 z-[40] pointer-events-none">
          <FlowerParticles
            x={env.cx}
            y={mouthY}
            width={viewport.width}
            height={viewport.height}
            flowers={counts.flowers}
            petals={counts.burstPetals}
            settle={phase === 'letter' || final}
          />
          <HeartBurst x={env.cx} y={mouthY} count={bp === 'mobile' ? 8 : 14} />
        </div>
      )}

      {opened && <PhotoLightbox photos={lightbox?.list ?? []} index={lightbox?.index ?? null} onIndex={(i) => setLightbox((lb) => (lb && i !== null ? { ...lb, index: i } : null))} />}
    </main>
  )
}
