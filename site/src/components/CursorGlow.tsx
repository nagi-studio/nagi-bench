import { memo, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion, hasFinePointer } from '../lib/gsap'

// Pointer-follower (acid dot + trailing ring). Desktop only, isolated and
// memoized; hidden until the first pointer event positions it.
const CursorGlow = memo(function CursorGlow() {
  const scope = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion() || !hasFinePointer()) return
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring || !contextSafe) return

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200, autoAlpha: 1 })
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' })
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' })
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

      const onMove = contextSafe((e: PointerEvent) => {
        dotX(e.clientX)
        dotY(e.clientY)
        ringX(e.clientX)
        ringY(e.clientY)
      })
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope },
  )

  return (
    <div ref={scope} aria-hidden className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      <div ref={dotRef} className="bg-acid invisible absolute top-0 left-0 size-1.5 rounded-full" />
      <div ref={ringRef} className="border-accent/50 invisible absolute top-0 left-0 size-9 rounded-full border" />
    </div>
  )
})

export default CursorGlow
