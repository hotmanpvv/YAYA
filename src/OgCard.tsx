import { AmbientBackground } from './components/AmbientBackground'
import { CornerFlorals } from './components/CornerFlorals'
import { Envelope } from './components/Envelope'
import { FloralDefs } from './components/flora/FloralDefs'

/**
 * DEV ONLY — the 1200×630 link-preview card (public/og.png).
 * Open http://localhost:5173/?og at 1200×630 and screenshot it to regenerate.
 */
export function OgCard() {
  return (
    <main className="relative h-full w-full overflow-hidden">
      <FloralDefs />
      <AmbientBackground warm final={false} particleCount={26} />
      <div className="fixed inset-0">
        <CornerFlorals size={250} corners={['tl', 'tr', 'bl', 'br']} visible />
      </div>
      <div className="fixed inset-0 flex flex-col items-center justify-center">
        <h1 className="font-script text-[5.2rem] leading-none text-burgundy">Open me</h1>
        <div className="mt-8" style={{ filter: 'drop-shadow(0 18px 24px rgba(110,30,50,0.18))' }}>
          <Envelope width={330} height={220} opening={false} />
        </div>
        <p className="mt-10 font-serif text-lg uppercase tracking-[0.42em] text-burgundy/70">a letter for you</p>
      </div>
    </main>
  )
}
