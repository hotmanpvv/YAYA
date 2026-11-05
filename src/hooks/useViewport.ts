import { useEffect, useState } from 'react'
import type { Viewport } from '../lib/layout'

function read(): Viewport {
  // visualViewport tracks the real visible area on mobile (address bar etc.)
  const vv = window.visualViewport
  return {
    width: Math.round(vv?.width ?? window.innerWidth),
    height: Math.round(window.innerHeight),
  }
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(read)

  useEffect(() => {
    let frame = 0
    let timeout = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setVp((prev) => {
          const next = read()
          // Ignore tiny height changes caused by mobile browser chrome showing/hiding.
          if (prev.width === next.width && Math.abs(prev.height - next.height) < 80) return prev
          return next
        })
      })
    }
    const settle = () => {
      clearTimeout(timeout)
      timeout = window.setTimeout(() => setVp(read()), 250)
    }
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', settle)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', settle)
    }
  }, [])

  return vp
}
