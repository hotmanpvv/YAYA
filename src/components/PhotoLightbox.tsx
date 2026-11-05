import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'
import type { Photo } from '../hooks/usePhotos'

type Props = {
  photos: Photo[]
  index: number | null
  onIndex: (i: number | null) => void
}

/** A tapped photo, enlarged. Close with the ×, a tap outside, or Escape; arrows browse. */
export function PhotoLightbox({ photos, index, onIndex }: Props) {
  const open = index !== null && photos[index] !== undefined
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<Element | null>(null)
  const many = photos.length > 1

  const close = useCallback(() => onIndex(null), [onIndex])
  const step = useCallback(
    (d: number) => {
      if (index === null) return
      onIndex((index + d + photos.length) % photos.length)
    },
    [index, onIndex, photos.length],
  )

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'Tab') {
        // keep focus inside the dialog
        const nodes = document.querySelectorAll<HTMLElement>('[data-lightbox] button')
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      ;(returnFocus.current as HTMLElement | null)?.focus?.()
    }
  }, [open, close, step])

  const photo = open ? photos[index!] : null

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          key="lightbox"
          data-lightbox
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption || 'Photo'}
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-[rgba(70,20,35,0.45)] backdrop-blur-[6px]" onClick={close} />

          <AnimatePresence mode="wait">
            <motion.figure
              key={photo.src}
              className="relative max-h-full bg-[#fdfbf7] p-3 pb-4 sm:p-4 sm:pb-5"
              style={{ boxShadow: '0 30px 60px -20px rgba(40,5,20,0.6)', backgroundImage: 'var(--paper-noise)', maxWidth: 'min(92vw, 720px)' }}
              initial={{ opacity: 0, scale: 0.88, rotate: -3, y: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: -1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              <img
                src={photo.src}
                alt={photo.caption || photo.alt || 'One of our memories'}
                className="block max-h-[68svh] w-auto max-w-full object-contain"
                decoding="async"
              />
              {photo.caption && <figcaption className="mt-3 text-center font-hand text-2xl text-ink/90 sm:text-3xl">{photo.caption}</figcaption>}
            </motion.figure>
          </AnimatePresence>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close photo"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-2xl leading-none text-burgundy shadow-lg transition hover:bg-ivory"
          >
            ×
          </button>
          {many && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute bottom-6 left-1/2 flex h-11 w-11 -translate-x-[120%] items-center justify-center rounded-full bg-ivory/85 text-xl text-burgundy shadow-lg transition hover:bg-ivory sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute bottom-6 left-1/2 flex h-11 w-11 translate-x-[20%] items-center justify-center rounded-full bg-ivory/85 text-xl text-burgundy shadow-lg transition hover:bg-ivory sm:bottom-auto sm:left-auto sm:right-5 sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2"
              >
                ›
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
