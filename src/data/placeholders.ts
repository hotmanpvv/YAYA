import type { Photo } from '../hooks/usePhotos'

/**
 * DEVELOPMENT ONLY — soft abstract placeholders so the layout can be previewed
 * before real photos are added. They are never shown in a production build.
 */
const tones: [string, string][] = [
  ['#f8d7da', '#e8a0bf'],
  ['#fff1e0', '#e9c9a8'],
  ['#f3dfe6', '#c98aa5'],
  ['#fbe9d7', '#d4af37'],
  ['#efd6dc', '#a65a74'],
  ['#fdeef0', '#e3b3c4'],
]

function svg(a: string, b: string, n: number) {
  const markup = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>
<rect width='600' height='600' fill='url(#g)'/>
<circle cx='420' cy='170' r='120' fill='white' opacity='.18'/>
<text x='300' y='300' text-anchor='middle' font-family='Georgia, serif' font-style='italic' font-size='34' fill='white' opacity='.9'>your photo ${n}</text>
<text x='300' y='345' text-anchor='middle' font-family='Georgia, serif' font-size='18' fill='white' opacity='.75'>public/photos/</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
}

export const PLACEHOLDER_PHOTOS: Photo[] = tones.map(([a, b], i) => ({
  src: svg(a, b, i + 1),
  caption: i % 2 === 0 ? 'a caption goes here' : undefined,
  alt: `Placeholder photo ${i + 1}`,
}))
