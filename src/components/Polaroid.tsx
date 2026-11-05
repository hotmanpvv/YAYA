import { forwardRef, useState } from 'react'
import type { Photo } from '../hooks/usePhotos'
import { Heart } from './flora/Flora'

type Props = {
  photo: Photo
  width: number
  blur?: number
  hearts?: boolean
  onOpen?: () => void
  onError?: () => void
  tabIndex?: number
}

/** A white-bordered instant photo with an optional handwritten caption. */
export const Polaroid = forwardRef<HTMLButtonElement, Props>(function Polaroid({ photo, width, blur = 0, hearts = true, onOpen, onError, tabIndex }, ref) {
  const [loaded, setLoaded] = useState(false)
  const pad = Math.round(width * 0.06)
  const label = photo.caption || photo.alt || 'one of our memories'

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      tabIndex={tabIndex}
      aria-label={`Enlarge photo: ${label}`}
      className="group relative block cursor-zoom-in text-left"
      style={{ width }}
    >
      {hearts && (
        <>
          <Heart size={Math.max(9, width * 0.075)} color="#8B1E3F" glow className="animate-heart-pulse absolute -top-2 -right-2 z-10 inline-block" style={{ '--delay': '-1.2s' } as React.CSSProperties} />
          <Heart size={Math.max(7, width * 0.055)} color="#E8A0BF" glow className="animate-heart-pulse absolute bottom-6 -left-2.5 z-10 inline-block" style={{ '--d': '4s' } as React.CSSProperties} />
        </>
      )}
      <div
        className="relative bg-[#fdfbf7] transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
        style={{
          padding: `${pad}px ${pad}px ${Math.round(width * (photo.caption ? 0.22 : 0.17))}px`,
          boxShadow: '0 14px 28px -12px rgba(90,20,40,0.42), 0 3px 8px rgba(60,20,30,0.10), inset 0 0 0 1px rgba(0,0,0,0.03)',
          filter: blur ? `blur(${blur}px)` : undefined,
          backgroundImage: 'var(--paper-noise)',
        }}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#efe4dc]">
          <img
            src={photo.src}
            alt={label}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={onError}
            className="h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: loaded ? 1 : 0, objectPosition: photo.focus ?? '50% 40%' }}
          />
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 18px rgba(80,40,30,0.18)', background: 'linear-gradient(135deg, rgba(255,240,220,0.12), transparent 50%)' }} />
        </div>
        {photo.caption && (
          <p className="absolute inset-x-0 truncate px-2 text-center font-hand leading-none text-ink/85" style={{ bottom: width * 0.055, fontSize: Math.max(12, width * 0.11) }}>
            {photo.caption}
          </p>
        )}
      </div>
    </button>
  )
})
