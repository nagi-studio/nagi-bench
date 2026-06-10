import { memo, useMemo, useRef } from 'react'
import { gsap, useGSAP, SplitText, prefersReducedMotion, hasFinePointer } from '../lib/gsap'
import { useLang } from '../i18n'
import { CASES, MODELS } from '../data/cases'

type Entry = { id: string; text: string }

// Terminal-style prompt feed. Each prompt types out IN FULL inside a
// fixed-height window that auto-scrolls like a real terminal, so the page
// below never reflows. Perpetual animation, isolated and memoized.
const PromptTerminal = memo(function PromptTerminal({ entries }: { entries: Entry[] }) {
  const scope = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const body = bodyRef.current
      const text = textRef.current
      if (!body || !text) return
      if (prefersReducedMotion()) {
        text.textContent = entries[0]?.text ?? ''
        if (labelRef.current) labelRef.current.textContent = entries[0]?.id ?? ''
        return
      }
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
      })
      const follow = () => {
        body.scrollTop = body.scrollHeight
      }
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
      entries.forEach((entry) => {
        tl.set(labelRef.current, { text: entry.id })
          .to(text, {
            duration: gsap.utils.clamp(2, 9, entry.text.length * 0.028),
            text: entry.text,
            ease: 'none',
            onUpdate: follow,
          })
          .to({}, { duration: 2.8 })
          .to(body, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' })
          .set(text, { text: '' })
          .set(body, { scrollTop: 0 })
          .to(body, { autoAlpha: 1, duration: 0.2 })
      })
    },
    { scope, dependencies: [entries], revertOnUpdate: true },
  )

  return (
    <div ref={scope} className="border-line bg-ink-2/60 max-w-3xl border backdrop-blur-sm">
      <div className="border-line flex items-center justify-between gap-4 border-b px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase">
        <span className="text-dim">stdin</span>
        <span className="text-accent truncate normal-case">
          $ <span ref={labelRef} />
        </span>
      </div>
      <div ref={bodyRef} className="h-44 overflow-hidden px-4 py-3">
        <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap md:text-sm">
          <span ref={textRef} className="text-paper/90" />
          <span
            ref={cursorRef}
            aria-hidden
            className="bg-accent ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em]"
          />
        </pre>
      </div>
    </div>
  )
})

export default function Hero() {
  const { t, lang } = useLang()
  const scope = useRef<HTMLElement>(null)

  const entries = useMemo<Entry[]>(
    () => CASES.map((c) => ({ id: c.id, text: c.prompt[lang] })),
    [lang],
  )

  const ranCount = MODELS.filter((m) => m.status === 'ran').length
  const pendingCount = MODELS.length - ranCount
  const pad = (n: number) => String(n).padStart(2, '0')

  useGSAP(
    (_, contextSafe) => {
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

      // Count the stats up once the meta row fades in.
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 1.4,
          delay: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v)).padStart(2, '0')
          },
        })
      })

      // Subtle pointer parallax on the giant title.
      if (hasFinePointer() && contextSafe) {
        const xTo = gsap.quickTo('[data-hero-parallax]', 'x', { duration: 0.9, ease: 'power3' })
        const yTo = gsap.quickTo('[data-hero-parallax]', 'y', { duration: 0.9, ease: 'power3' })
        const onMove = contextSafe((e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 26)
          yTo((e.clientY / window.innerHeight - 0.5) * 14)
        })
        window.addEventListener('pointermove', onMove)
        return () => {
          window.removeEventListener('pointermove', onMove)
          split.revert()
        }
      }
      return () => split.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} id="top" className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 md:pt-44 md:pb-28">
        <p
          data-hero-fade
          className="text-dim font-mono text-xs tracking-[0.2em] uppercase md:tracking-[0.35em]"
        >
          {t('hero.kicker')}
        </p>

        <h1 data-hero-parallax className="mt-8 leading-[0.92] font-bold tracking-tight uppercase">
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

        <div data-hero-fade className="mt-10">
          <PromptTerminal entries={entries} />
        </div>

        <dl
          data-hero-fade
          className="border-line text-dim mt-10 flex flex-wrap gap-x-8 gap-y-5 border-t pt-6 font-mono text-[11px] tracking-[0.25em] uppercase md:mt-12 md:gap-x-14"
        >
          <div>
            <dt>{t('meta.cases')}</dt>
            <dd className="text-paper mt-1 text-2xl tracking-normal md:text-3xl">
              <span data-count={CASES.length}>{pad(CASES.length)}</span>
            </dd>
          </div>
          <div>
            <dt>{t('meta.models')}</dt>
            <dd className="text-paper mt-1 text-2xl tracking-normal md:text-3xl">
              <span data-count={ranCount}>{pad(ranCount)}</span>
              <span className="text-amber ml-2 align-middle text-xs tracking-[0.2em]">
                +{pad(pendingCount)} {t('meta.pending')}
              </span>
            </dd>
          </div>
          <div>
            <dt>{t('meta.updated')}</dt>
            <dd className="text-paper mt-1 text-2xl tracking-normal md:text-3xl">2026.06</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
