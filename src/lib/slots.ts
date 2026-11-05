import { clamp, getBreakpoint, getLetterLayout, type Viewport } from './layout'
import { createRandom } from './random'

export type MemoryMode = 'letter' | 'frame'

export type Slot = {
  x: number // centre, px
  y: number
  rotate: number
  scale: number
  opacity: number
  blur: number
  width: number // polaroid width, px
}

/**
 * Where each floating photograph rests.
 *
 * - `letter`: around the letter. On wide screens they live in the side gutters and never
 *   touch the letter; on narrower screens they tuck behind its edges at reduced opacity
 *   (the letter always sits above them).
 * - `frame`: pushed outward to frame the final surprise.
 */
export function computeSlots(vp: Viewport, mode: MemoryMode): Slot[] {
  const bp = getBreakpoint(vp)
  const r = createRandom(mode === 'letter' ? 314 : 271)
  const L = getLetterLayout(vp)
  const slots: Slot[] = []

  if (mode === 'letter') {
    if (bp === 'mobile') {
      const w = clamp(vp.width * 0.27, 92, 118)
      const spots = [
        { x: 0.16, y: L.top + 4, rot: -10 },
        { x: 0.84, y: L.top + w * 0.5, rot: 9 },
        { x: 0.13, y: L.bottom - w * 0.3, rot: 8 },
        { x: 0.86, y: L.bottom + 6, rot: -7 },
      ]
      spots.forEach((s) => slots.push({ x: s.x * vp.width, y: s.y, rotate: s.rot, scale: 1, opacity: 0.55, blur: 0, width: w }))
      return slots
    }

    const gutter = L.left
    const roomy = gutter >= 170
    const w = roomy ? clamp(gutter - 56, 132, 196) : clamp(vp.width * 0.17, 120, 150)
    const h = w * 1.2
    const perSide = clamp(Math.floor((vp.height - 40) / (h * 0.92)), 2, 4)
    const stepY = vp.height / perSide
    ;[-1, 1].forEach((side) => {
      for (let i = 0; i < perSide; i++) {
        const offset = side === 1 ? stepY * 0.35 : 0
        const y = clamp(stepY * (i + 0.5) + offset + r.range(-stepY * 0.12, stepY * 0.12), h * 0.45, vp.height - h * 0.4)
        const jitter = roomy ? r.range(-1, 1) * Math.max(0, (gutter - w) / 2 - 16) : 0
        const cx = roomy ? gutter / 2 + jitter : Math.max(w * 0.38, gutter * 0.5)
        const far = roomy && r.next() < 0.25
        slots.push({
          x: side === -1 ? cx : vp.width - cx,
          y,
          rotate: r.range(4, 11) * (r.sign() as number),
          scale: far ? 0.86 : 1,
          opacity: roomy ? (far ? 0.85 : 1) : 0.72,
          blur: far ? 1.2 : 0,
          width: w,
        })
      }
    })
    // interleave left/right so the first photos alternate sides
    const left = slots.filter((s) => s.x < vp.width / 2)
    const right = slots.filter((s) => s.x >= vp.width / 2)
    const out: Slot[] = []
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      if (left[i]) out.push(left[i])
      if (right[i]) out.push(right[i])
    }
    return out
  }

  // frame mode
  if (bp === 'mobile') {
    const w = clamp(vp.width * 0.25, 86, 108)
    return [
      { x: 0.13, y: 0.075, rot: -9 },
      { x: 0.87, y: 0.09, rot: 8 },
      { x: 0.12, y: 0.93, rot: 7 },
      { x: 0.88, y: 0.915, rot: -8 },
    ].map((s) => ({ x: s.x * vp.width, y: s.y * vp.height, rotate: s.rot, scale: 1, opacity: 1, blur: 0, width: w }))
  }
  const w = bp === 'tablet' ? 124 : clamp(vp.width * 0.11, 130, 170)
  const spots =
    bp === 'tablet'
      ? [
          { x: 0.13, y: 0.14 },
          { x: 0.87, y: 0.16 },
          { x: 0.11, y: 0.86 },
          { x: 0.89, y: 0.84 },
          { x: 0.1, y: 0.5 },
          { x: 0.9, y: 0.5 },
        ]
      : [
          { x: 0.1, y: 0.2 },
          { x: 0.9, y: 0.22 },
          { x: 0.21, y: 0.5 },
          { x: 0.79, y: 0.52 },
          { x: 0.1, y: 0.8 },
          { x: 0.9, y: 0.78 },
          { x: 0.27, y: 0.13 },
          { x: 0.73, y: 0.87 },
        ]
  return spots.map((s) => ({
    x: s.x * vp.width,
    y: clamp(s.y * vp.height, w * 0.65, vp.height - w * 0.65),
    rotate: r.range(4, 10) * (r.sign() as number),
    scale: 1,
    opacity: 1,
    blur: 0,
    width: w,
  }))
}
