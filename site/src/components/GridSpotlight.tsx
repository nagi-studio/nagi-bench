import { memo, useRef } from 'react'
import { gsap, useGSAP, hasFinePointer } from '../lib/gsap'

// Faint accent glow that trails the pointer across the blueprint grid.
// Desktop only; updates CSS vars via quickSetter, so no re-renders.
const GridSpotlight = memo(function GridSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !hasFinePointer()) return
      const setX = gsap.quickSetter(el, '--spot-x', 'px')
      const setY = gsap.quickSetter(el, '--spot-y', 'px')
      const onMove = (e: PointerEvent) => {
        setX(e.clientX)
        setY(e.clientY)
      }
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(640px circle at var(--spot-x, -640px) var(--spot-y, -640px), color-mix(in oklab, var(--color-accent) 6%, transparent), transparent 70%)',
      }}
    />
  )
})

export default GridSpotlight
