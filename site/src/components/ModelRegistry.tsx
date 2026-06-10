import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { useLang } from '../i18n'
import { MODELS } from '../data/cases'

// Registry of model x harness x effort combinations — replaces the old
// marquee with something you can actually read.
export default function ModelRegistry() {
  const { t } = useLang()
  const scope = useRef<HTMLElement>(null)
  const ranCount = MODELS.filter((m) => m.status === 'ran').length
  const pad = (n: number) => String(n).padStart(2, '0')

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-registry-head]', {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope.current, start: 'top 78%', once: true },
      })
      gsap.from('[data-registry-row]', {
        x: -24,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: scope.current, start: 'top 72%', once: true },
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="models" className="border-line relative overflow-hidden border-t">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 md:py-20">
        <header data-registry-head>
          <div className="text-dim flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] tracking-[0.25em] uppercase">
            <span className="flex items-center gap-2.5">
              <span className="bg-acid inline-block size-2.5" />
              <span className="text-accent">{t('registry.label')}</span>
            </span>
            <span>
              {pad(ranCount)}/{pad(MODELS.length)} {t('registry.ran')}
            </span>
          </div>
          <p className="text-dim mt-4 max-w-2xl text-sm leading-relaxed">{t('registry.sub')}</p>
        </header>

        <div
          data-registry-row
          className="border-line text-dim mt-8 hidden border-b pb-2 font-mono text-[10px] tracking-[0.2em] uppercase md:grid md:grid-cols-[2fr_1fr_1.3fr_1fr_0.5fr] md:gap-4"
        >
          <span>{t('registry.model')}</span>
          <span>{t('registry.vendor')}</span>
          <span>{t('registry.harness')}</span>
          <span>{t('registry.effort')}</span>
          <span className="text-right">{t('registry.runs')}</span>
        </div>

        <ul>
          {MODELS.map((m) => {
            const ran = m.status === 'ran'
            return (
              <li
                key={m.id}
                data-registry-row
                className={`border-line hover:bg-ink-2/70 grid grid-cols-2 gap-x-4 gap-y-1.5 border-b py-3.5 transition-colors md:grid-cols-[2fr_1fr_1.3fr_1fr_0.5fr] md:items-center ${
                  ran ? '' : 'opacity-55'
                }`}
              >
                <span className="flex items-center gap-2.5 font-mono text-sm font-bold tracking-tight">
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${ran ? 'bg-accent' : 'bg-amber dot-breathe'}`}
                  />
                  {m.label}
                </span>
                <span className="text-dim text-right font-mono text-xs md:text-left">{m.vendor}</span>
                <span className="text-dim font-mono text-xs">
                  {m.harness ?? t('registry.tbd')}
                </span>
                <span>
                  {ran ? (
                    <span className="border-line text-paper inline-block border px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                      {m.effort ?? 'Max'}
                    </span>
                  ) : (
                    <span className="text-dim font-mono text-xs">{t('registry.tbd')}</span>
                  )}
                </span>
                <span className="text-paper text-right font-mono text-xs">
                  {ran ? pad(m.runCount) : '—'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
