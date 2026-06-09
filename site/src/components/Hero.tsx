import { memo, useMemo, useRef } from 'react'
import { gsap, useGSAP, SplitText, prefersReducedMotion } from '../lib/gsap'
import { useLang } from '../i18n'
import { CASES, MODELS } from '../data/cases'

const truncate = (s: string, max: number) =>
  s.length > max ? `${s.slice(0, max).trimEnd()} …` : s

// Perpetual animation, isolated and memoized so it never re-renders the hero.
// The parent reserves a fixed-height box, so typing never reflows the page.
const Typewriter = memo(function Typewriter({ lines }: { lines: string[] }) {
  const scope = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!textRef.current) return
      if (prefersReducedMotion()) {
        textRef.current.textContent = lines[0] ?? ''
        return
      }
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
      })
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 })
      lines.forEach((line) => {
        tl.to(textRef.current, {
          duration: Math.min(2.6, line.length * 0.045),
          text: line,
          ease: 'none',
        })
          .to({}, { duration: 2.2 })
          .to(textRef.current, { duration: 0.25, autoAlpha: 0, ease: 'power1.in' })
          .set(textRef.current, { text: '' })
          .set(textRef.current, { autoAlpha: 1 })
      })
    },
    { scope, dependencies: [lines], revertOnUpdate: true },
  )

  return (
    <span ref={scope} className="text-paper/90 leading-relaxed">
      <span ref={textRef} />
      <span
        ref={cursorRef}
        aria-hidden
        className="bg-accent ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em]"
      />
    </span>
  )
})

export default function Hero() {
  const { t, lang } = useLang()
  const scope = useRef<HTMLElement>(null)

  const promptLines = useMemo(
    () =>
      CASES.map((c) =>
        truncate(c.prompt[lang].replace(/\s+/g, ' '), lang === 'zh' ? 80 : 140),
      ),
    [lang],
  )

  const ranCount = MODELS.filter((m) => m.status === 'ran').length
  const pendingCount = MODELS.length - ranCount
  const pad = (n: number) => String(n).padStart(2, '0')

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create('[data-hero-title]', { type: 'chars', mask: 'chars' })
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from(split.chars, { yPercent: 120, duration: 1, stagger: 0.04 })
        .from(
          '[data-hero-badge]',
          { scale: 0, rotation: -14, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.55',
        )
        .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, '-=0.35')
      return () => split.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} id="top" className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-36 pb-20 md:pt-44 md:pb-28">
        <p data-hero-fade className="text-dim font-mono text-xs tracking-[0.35em] uppercase">
          {t('hero.kicker')}
        </p>

        <h1 className="mt-8 leading-[0.92] font-bold tracking-tight uppercase">
          <span data-hero-title className="block text-[clamp(4rem,14vw,10.5rem)]">
            NAGI
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-7 gap-y-5">
            <span data-hero-title className="text-outline block text-[clamp(4rem,14vw,10.5rem)]">
              BENCH
            </span>
            <span
              data-hero-badge
              className="bg-acid text-night inline-block -rotate-3 px-3.5 py-2 font-mono text-[10px] font-bold tracking-[0.15em] whitespace-nowrap normal-case md:text-xs"
            >
              {t('hero.badge')}
            </span>
          </span>
        </h1>

        <p data-hero-fade className="text-dim mt-8 max-w-xl text-base leading-relaxed md:text-lg">
          {t('hero.sub')}
        </p>

        <div
          data-hero-fade
          className="mt-10 flex h-32 items-start gap-3 overflow-hidden font-mono text-sm sm:h-24 md:h-20 md:text-base"
        >
          <span className="text-accent shrink-0 select-none">{t('hero.stdin')} &gt;</span>
          <Typewriter lines={promptLines} />
        </div>

        <dl
          data-hero-fade
          className="border-line text-dim mt-12 flex flex-wrap gap-x-14 gap-y-6 border-t pt-6 font-mono text-[11px] tracking-[0.25em] uppercase"
        >
          <div>
            <dt>{t('meta.cases')}</dt>
            <dd className="text-paper mt-1 text-3xl tracking-normal">{pad(CASES.length)}</dd>
          </div>
          <div>
            <dt>{t('meta.models')}</dt>
            <dd className="text-paper mt-1 text-3xl tracking-normal">
              {pad(ranCount)}
              <span className="text-amber ml-2 align-middle text-xs tracking-[0.2em]">
                +{pad(pendingCount)} {t('meta.pending')}
              </span>
            </dd>
          </div>
          <div>
            <dt>{t('meta.updated')}</dt>
            <dd className="text-paper mt-1 text-3xl tracking-normal">2026.06</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
