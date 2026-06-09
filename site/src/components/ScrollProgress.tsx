import { memo, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

// Thin acid progress line pinned to the very top, scrubbed across the page.
const ScrollProgress = memo(function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
      )
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden
      className="bg-accent fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0"
    />
  )
})

export default ScrollProgress
