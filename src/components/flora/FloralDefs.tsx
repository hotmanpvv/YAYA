/**
 * Shared SVG gradients & flower symbols. Rendered once; every flower on the page
 * is a lightweight <use> reference, which keeps the DOM small and animations fast.
 */
import type { ReactNode } from 'react'

const ROSE_PETAL = 'M0 4 C-15 2 -30 -13 -27 -29 C-24 -43 -9 -48 0 -43 C9 -48 24 -43 27 -29 C30 -13 15 2 0 4Z'
const ROSE_EDGE = 'M-19 -38 C-11 -46 -3 -45 0 -42 C3 -45 11 -46 19 -38'
const PEONY_PETAL =
  'M0 4 C-13 2 -24 -9 -24 -23 C-25 -31 -19 -37 -14 -35 C-11 -42 -5 -44 -1 -40 C2 -45 9 -43 12 -37 C18 -39 25 -32 24 -23 C24 -9 13 2 0 4Z'
const PEONY_EDGE = 'M-20 -31 C-17 -36 -14 -35 -12 -36 M-6 -41 C-3 -43 1 -42 3 -41 M11 -38 C15 -39 19 -36 21 -31'

export const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

function ring(count: number, scale: number, offset: number, fill: string, path: string, edge?: string, edgeColor?: string): ReactNode[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = offset + (360 / count) * i
    return (
      <g key={`${scale}-${i}`} transform={`rotate(${angle}) scale(${scale})`}>
        <path d={path} fill={fill} stroke="rgba(60,0,20,0.18)" strokeWidth={0.6 / scale} />
        {edge && <path d={edge} fill="none" stroke={edgeColor} strokeWidth={1.3} strokeLinecap="round" />}
      </g>
    )
  })
}

function radial(id: string, stops: [number, string][]) {
  return (
    <radialGradient id={id} cx="0" cy="0" r="48" gradientUnits="userSpaceOnUse">
      {stops.map(([o, c]) => (
        <stop key={o} offset={o} stopColor={c} />
      ))}
    </radialGradient>
  )
}

function rose(id: string, outer: string, inner: string, edge: string, spiral: string) {
  return (
    <symbol id={id} viewBox="-50 -50 100 100" overflow="visible">
      <circle r="48" fill="url(#ff-shadow)" />
      {ring(5, 1, 0, `url(#${outer})`, ROSE_PETAL, ROSE_EDGE, edge)}
      {ring(5, 0.8, 36, `url(#${outer})`, ROSE_PETAL, ROSE_EDGE, edge)}
      {ring(5, 0.6, 14, `url(#${inner})`, ROSE_PETAL, ROSE_EDGE, edge)}
      {ring(4, 0.43, 52, `url(#${inner})`, ROSE_PETAL)}
      {ring(3, 0.28, 20, `url(#${inner})`, ROSE_PETAL)}
      <circle r="4.5" fill={`url(#${inner})`} />
      <path d="M0 -6 C5 -6 6 1 2 3 C-2 5 -6 1 -4 -3 C-2 -7 6 -8 8 -2" fill="none" stroke={spiral} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
    </symbol>
  )
}

export function FloralDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <radialGradient id="ff-shadow" cx="0" cy="3" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor="#4a0a1e" stopOpacity="0.28" />
          <stop offset="1" stopColor="#4a0a1e" stopOpacity="0" />
        </radialGradient>

        {radial('rr-o', [[0, '#3a0614'], [0.32, '#6a102d'], [0.7, '#9d213d'], [0.9, '#c33853'], [1, '#d65a70']])}
        {radial('rr-i', [[0, '#25020c'], [0.45, '#560b24'], [0.85, '#871a37'], [1, '#ad2c48']])}
        {radial('rp-o', [[0, '#9c3d62'], [0.35, '#c4668b'], [0.75, '#e8a0bf'], [1, '#f7d2e0']])}
        {radial('rp-i', [[0, '#7c2c4c'], [0.5, '#b1557a'], [1, '#e294b4']])}
        {radial('pe-o', [[0, '#d07a98'], [0.4, '#eab0c3'], [0.8, '#f8d7da'], [1, '#fff3f2']])}
        {radial('pe-i', [[0, '#bf6385'], [0.6, '#e6a1b8'], [1, '#fbe4e7']])}
        {radial('ch-o', [[0, '#c98f7a'], [0.4, '#e9c0a8'], [0.8, '#f8e3d2'], [1, '#fff8f0']])}

        <linearGradient id="leaf" x1="0" y1="1" x2="0.2" y2="0">
          <stop offset="0" stopColor="#3f5a3c" />
          <stop offset="0.6" stopColor="#6d8a62" />
          <stop offset="1" stopColor="#9db38d" />
        </linearGradient>
        <linearGradient id="petal-red" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="#5a0c24" />
          <stop offset="0.55" stopColor="#9b2140" />
          <stop offset="1" stopColor="#d4566e" />
        </linearGradient>
        <linearGradient id="petal-pink" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="#b85a7e" />
          <stop offset="0.6" stopColor="#e8a0bf" />
          <stop offset="1" stopColor="#f9dbe6" />
        </linearGradient>
        <linearGradient id="petal-blush" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="#e3a2b6" />
          <stop offset="0.6" stopColor="#f8d7da" />
          <stop offset="1" stopColor="#fff6f4" />
        </linearGradient>
        <radialGradient id="heart-glow">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {rose('rose-red', 'rr-o', 'rr-i', 'rgba(255,190,200,0.35)', '#e2647f')}
        {rose('rose-pink', 'rp-o', 'rp-i', 'rgba(255,240,245,0.55)', '#f3b6cb')}
        {rose('rose-champagne', 'ch-o', 'ch-o', 'rgba(255,255,255,0.6)', '#d9a58d')}

        <symbol id="peony" viewBox="-50 -50 100 100" overflow="visible">
          <circle r="49" fill="url(#ff-shadow)" />
          {ring(9, 1.04, 0, 'url(#pe-o)', PEONY_PETAL, PEONY_EDGE, 'rgba(255,255,255,0.7)')}
          {ring(8, 0.86, 20, 'url(#pe-o)', PEONY_PETAL, PEONY_EDGE, 'rgba(255,255,255,0.6)')}
          {ring(7, 0.68, 6, 'url(#pe-o)', PEONY_PETAL, PEONY_EDGE, 'rgba(255,255,255,0.5)')}
          {ring(6, 0.52, 30, 'url(#pe-i)', PEONY_PETAL)}
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 6} cy={Math.sin((a * Math.PI) / 180) * 6} r="1.6" fill="#d4af37" opacity="0.85" />
          ))}
          {ring(5, 0.36, 0, 'url(#pe-i)', PEONY_PETAL)}
          {ring(4, 0.22, 40, 'url(#pe-i)', PEONY_PETAL)}
        </symbol>

        <symbol id="leaf-shape" viewBox="-12 -50 24 52" overflow="visible">
          <path d="M0 2 C-10 -8 -12 -30 0 -48 C12 -30 10 -8 0 2Z" fill="url(#leaf)" />
          <path d="M0 0 C0 -16 0 -32 0 -44" stroke="rgba(230,245,220,0.35)" strokeWidth="0.9" fill="none" />
        </symbol>

        <symbol id="petal-shape-red" viewBox="-12 -24 24 26" overflow="visible">
          <path d="M0 1 C-9 -2 -12 -14 -6 -21 C-3 -24 0 -22 0 -20 C0 -22 3 -24 6 -21 C12 -14 9 -2 0 1Z" fill="url(#petal-red)" />
        </symbol>
        <symbol id="petal-shape-pink" viewBox="-12 -24 24 26" overflow="visible">
          <path d="M0 1 C-9 -2 -12 -14 -6 -21 C-3 -24 0 -22 0 -20 C0 -22 3 -24 6 -21 C12 -14 9 -2 0 1Z" fill="url(#petal-pink)" />
        </symbol>
        <symbol id="petal-shape-blush" viewBox="-12 -24 24 26" overflow="visible">
          <path d="M0 1 C-9 -2 -12 -14 -6 -21 C-3 -24 0 -22 0 -20 C0 -22 3 -24 6 -21 C12 -14 9 -2 0 1Z" fill="url(#petal-blush)" />
        </symbol>
      </defs>
    </svg>
  )
}
