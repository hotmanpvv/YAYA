export type Viewport = { width: number; height: number }
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function getBreakpoint({ width }: Viewport): Breakpoint {
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/** Where the envelope sits on screen (its centre). Flowers and photos burst from here. */
export function getEnvelopeLayout(vp: Viewport) {
  const width = Math.min(vp.width * 0.84, 400)
  const height = width / 1.5
  return { width, height, cx: vp.width / 2, cy: vp.height * 0.53 }
}

/** The letter card's size and position — shared by the letter and the photos that avoid it. */
export function getLetterLayout(vp: Viewport) {
  const bp = getBreakpoint(vp)
  const width = Math.min(vp.width - (bp === 'mobile' ? 28 : 64), 580)
  const buttonSpace = 84
  const top = bp === 'mobile' ? 30 : Math.max(28, vp.height * 0.05)
  const height = Math.max(320, Math.min(vp.height - top - buttonSpace, 800))
  const left = (vp.width - width) / 2
  return { width, height, top, left, right: left + width, bottom: top + height }
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
