import type { CSSProperties } from 'react'
import { HEART_PATH } from './FloralDefs'

export type FlowerKind = 'rose-red' | 'rose-pink' | 'rose-champagne' | 'peony'
export type PetalKind = 'red' | 'pink' | 'blush'

type Common = { size: number; className?: string; style?: CSSProperties }

export function Flower({ kind, size, className, style }: Common & { kind: FlowerKind }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" className={className} style={{ overflow: 'visible', ...style }} aria-hidden="true">
      <use href={`#${kind}`} x="-50" y="-50" width="100" height="100" />
    </svg>
  )
}

export function Petal({ kind, size, className, style }: Common & { kind: PetalKind }) {
  return (
    <svg width={size} height={size * 1.08} viewBox="-12 -24 24 26" className={className} style={style} aria-hidden="true">
      <use href={`#petal-shape-${kind}`} x="-12" y="-24" width="24" height="26" />
    </svg>
  )
}

export function Leaf({ size, className, style }: Common) {
  return (
    <svg width={size * 0.48} height={size} viewBox="-12 -50 24 52" className={className} style={{ overflow: 'visible', ...style }} aria-hidden="true">
      <use href="#leaf-shape" x="-12" y="-50" width="24" height="52" />
    </svg>
  )
}

export function Heart({ size, color = '#8B1E3F', glow = false, className, style }: Common & { color?: string; glow?: boolean }) {
  return (
    <span className={className ?? 'relative inline-block'} style={{ width: size, height: size, ...style }} aria-hidden="true">
      {glow && (
        <span
          style={{
            position: 'absolute',
            inset: -size * 0.9,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}55 0%, ${color}22 35%, transparent 70%)`,
          }}
        />
      )}
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'relative', display: 'block' }}>
        <path d={HEART_PATH} fill={color} />
        <path d="M6.2 6.3c.9-.9 2.3-1 3.2-.3" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  )
}
