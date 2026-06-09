import { memo, useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { MODELS } from '../data/cases'

// Perpetual animation, isolated and memoized; duplicated track for a seamless
// -50% loop. Scroll velocity temporarily boosts the loop's timeScale.
const ModelMarquee = memo(function ModelMarquee() {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const track = scope.current?.querySelector<HTMLElement>('[data-marquee-track]')
      const tween = gsap.to('[data-marquee-track]', {
        xPercent: -50,
        duration: 32,
        ease: 'none',
        repeat: -1,
      })
      // Scroll velocity boosts the loop speed and skews the band; both decay
      // back to rest once scrolling stops.
      const proxy = { speed: 1, skew: 0 }
      const skewSetter = track ? gsap.quickSetter(track, 'skewX', 'deg') : () => {}
      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          const speed = gsap.utils.clamp(1, 5, 1 + Math.abs(velocity) / 350)
          const skew = gsap.utils.clamp(-9, 9, velocity / -250)
          if (speed > proxy.speed || Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.speed = Math.max(speed, proxy.speed)
            proxy.skew = Math.abs(skew) > Math.abs(proxy.skew) ? skew : proxy.skew
            tween.timeScale(proxy.speed)
            skewSetter(proxy.skew)
            gsap.to(proxy, {
              speed: 1,
              skew: 0,
              duration: 1.4,
              ease: 'power3.out',
              overwrite: true,
              onUpdate: () => {
                tween.timeScale(proxy.speed)
                skewSetter(proxy.skew)
              },
            })
          }
        },
      })
    },
    { scope },
  )

  const Sequence = () => (
    <>
      {MODELS.map((m) => (
        <span key={m.id} className="mx-7 inline-flex items-center gap-3">
          <span className={`size-1.5 rounded-full ${m.status === 'ran' ? 'bg-night' : 'bg-night/30'}`} />
          {m.label}
          <span className="text-night/55">{m.vendor}</span>
          <span className="text-night/55">[{m.status === 'ran' ? 'RAN' : 'PENDING'}]</span>
        </span>
      ))}
    </>
  )

  return (
    <div ref={scope} aria-hidden className="pointer-events-none relative z-10 -my-4 overflow-hidden">
      <div className="bg-acid text-night -mx-[2%] w-[104%] -rotate-[1.1deg] overflow-hidden py-2.5">
        <div
          data-marquee-track
          className="flex w-max font-mono text-xs font-bold tracking-[0.2em] whitespace-nowrap uppercase"
        >
          <Sequence />
          <Sequence />
        </div>
      </div>
    </div>
  )
})

export default ModelMarquee
