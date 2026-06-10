import { useEffect, useRef, useState } from 'react'
import { Check, Copy, ExternalLink, Maximize2, Play } from 'lucide-react'
import { gsap, useGSAP, SplitText, prefersReducedMotion, hasFinePointer } from '../lib/gsap'
import { useLang } from '../i18n'
import {
  MODELS,
  RUNS,
  REPO_URL,
  outputUrl,
  runPath,
  type CaseDef,
  type ModelDef,
  type RunDef,
} from '../data/cases'

function Spinner({ label }: { label: string }) {
  return (
    <span className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3" role="status">
      <span className="border-line border-t-accent size-6 animate-spin rounded-full border-2" />
      <span className="text-dim font-mono text-[10px] tracking-[0.25em] uppercase">{label}</span>
    </span>
  )
}

function FrameFooter({ path, onFullscreen }: { path: string; onFullscreen?: () => void }) {
  const { t } = useLang()
  const file = path.split('/').pop() ?? path
  return (
    <div className="text-dim mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
      <span className="truncate">{file}</span>
      <span className="flex items-center gap-4">
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="hover:text-accent inline-flex items-center gap-1.5 transition-colors"
          >
            <Maximize2 className="size-3" />
            {t('case.fullscreen')}
          </button>
        )}
        <a
          href={outputUrl(path)}
          target="_blank"
          rel="noreferrer"
          className="hover:text-accent inline-flex items-center gap-1.5 transition-colors"
        >
          <ExternalLink className="size-3" />
          {t('case.open')}
        </a>
        <a
          href={`${REPO_URL}/blob/main/${path}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-accent transition-colors"
        >
          {t('case.raw')}
        </a>
      </span>
    </div>
  )
}

function EmptyState() {
  const { t } = useLang()
  return (
    <div className="border-line bg-ink-2/50 mt-6 flex h-64 flex-col items-center justify-center gap-3 border border-dashed px-6 md:h-80">
      <span className="bg-amber dot-breathe size-2.5 rounded-full" />
      <p className="text-paper font-mono text-xs tracking-[0.25em] uppercase">{t('empty.title')}</p>
      <p className="text-dim max-w-xs text-center text-xs leading-relaxed">{t('empty.desc')}</p>
    </div>
  )
}

function SvgViewer({ path, label }: { path: string; label: string }) {
  const { t } = useLang()
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  return (
    <figure>
      <div className="border-line bg-ink-2 relative mt-6 flex min-h-72 items-center justify-center overflow-hidden border p-4 md:p-12">
        {state === 'loading' && <Spinner label={t('case.loading')} />}
        {state === 'error' ? (
          <p className="text-dim max-w-sm text-center font-mono text-xs leading-relaxed">
            {t('case.loadError')}
          </p>
        ) : (
          <img
            src={outputUrl(path)}
            alt={label}
            onLoad={() => setState('ready')}
            onError={() => setState('error')}
            className={`max-h-[44rem] w-full object-contain transition-opacity duration-500 ${
              state === 'ready' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>
      <FrameFooter path={path} />
    </figure>
  )
}

function HtmlViewer({ path, label }: { path: string; label: string }) {
  const { t } = useLang()
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready'>('idle')
  const frameRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<HTMLSpanElement>(null)

  const run = () => {
    setPhase('loading')
    frameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const goFullscreen = () => frameRef.current?.requestFullscreen?.()

  // Magnetic pull on the play circle while the pointer roams the cover.
  useGSAP(
    (_, contextSafe) => {
      const cover = coverRef.current
      const circle = circleRef.current
      if (!cover || !circle || !contextSafe) return
      if (prefersReducedMotion() || !hasFinePointer()) return
      const xTo = gsap.quickTo(circle, 'x', { duration: 0.45, ease: 'power3' })
      const yTo = gsap.quickTo(circle, 'y', { duration: 0.45, ease: 'power3' })
      const onMove = contextSafe((e: PointerEvent) => {
        const r = cover.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.12)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.12)
      })
      const onLeave = contextSafe(() => {
        xTo(0)
        yTo(0)
      })
      cover.addEventListener('pointermove', onMove)
      cover.addEventListener('pointerleave', onLeave)
      return () => {
        cover.removeEventListener('pointermove', onMove)
        cover.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: coverRef },
  )

  return (
    <div>
      <div
        ref={frameRef}
        className="border-line bg-ink-2 relative mt-6 aspect-video max-h-[calc(100dvh-10rem)] w-full overflow-hidden border [&:fullscreen]:aspect-auto [&:fullscreen]:max-h-none"
      >
        {phase === 'idle' ? (
          <button
            ref={coverRef}
            onClick={run}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-5"
          >
            <span
              ref={circleRef}
              className="border-accent text-accent flex size-20 items-center justify-center rounded-full border transition-[background-color,color] duration-300 group-hover:bg-acid group-hover:text-night"
            >
              <Play className="size-7 translate-x-0.5" />
            </span>
            <span className="text-paper font-mono text-xs tracking-[0.25em] uppercase">
              {t('case.run')}
            </span>
            <span className="text-dim font-mono text-[10px]">{t('case.runHint')}</span>
          </button>
        ) : (
          <>
            {phase === 'loading' && <Spinner label={t('case.loading')} />}
            <button
              onClick={goFullscreen}
              title={t('case.fullscreen')}
              aria-label={t('case.fullscreen')}
              className="border-line bg-ink/70 text-dim hover:text-accent absolute top-3 right-3 z-20 flex size-9 items-center justify-center border backdrop-blur-sm transition-colors"
            >
              <Maximize2 className="size-4" />
            </button>
            <iframe
              src={outputUrl(path)}
              title={label}
              allow="fullscreen; pointer-lock"
              onLoad={() => setPhase('ready')}
              className={`absolute inset-0 size-full transition-opacity duration-500 ${
                phase === 'ready' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        )}
      </div>
      <FrameFooter path={path} onFullscreen={phase === 'idle' ? undefined : goFullscreen} />
    </div>
  )
}

function Viewer({ caseDef, model, run }: { caseDef: CaseDef; model: ModelDef; run?: RunDef }) {
  const { pick } = useLang()
  if (!run) return <EmptyState />
  const path = runPath(caseDef, model.id, run)
  const label = `${pick(caseDef.title)} - ${model.label}`
  return caseDef.kind === 'svg' ? (
    <SvgViewer path={path} label={label} />
  ) : (
    <HtmlViewer path={path} label={label} />
  )
}

export default function CaseSection({ caseDef }: { caseDef: CaseDef }) {
  const { t, pick, lang } = useLang()
  const scope = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<HTMLDivElement>(null)
  // Deep link: #<case-id> anchors the case, #<case-id>:<model-id> also
  // preselects the model tab.
  const [activeModelId, setActiveModelId] = useState(() => {
    const [caseId, modelId] = window.location.hash.slice(1).split(':')
    if (caseId === caseDef.id && modelId && MODELS.some((m) => m.id === modelId)) return modelId
    return MODELS[0].id
  })
  const activeModel = MODELS.find((m) => m.id === activeModelId) ?? MODELS[0]
  const run = RUNS[caseDef.id]?.[activeModelId]
  const [copied, setCopied] = useState(false)

  const selectModel = (modelId: string) => {
    setActiveModelId(modelId)
    history.replaceState(null, '', `#${caseDef.id}:${modelId}`)
  }

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  // Magic-ink underline that glides to the active model tab.
  useEffect(() => {
    const tabs = tabsRef.current
    const ink = inkRef.current
    const active = tabs?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!tabs || !ink || !active) return
    gsap.to(ink, {
      x: active.offsetLeft,
      y: active.offsetTop + active.offsetHeight - 1,
      width: active.offsetWidth,
      autoAlpha: 1,
      duration: prefersReducedMotion() ? 0 : 0.45,
      ease: 'power3.out',
    })
    // On narrow screens the tab strip scrolls horizontally; keep the active
    // tab in view.
    if (tabs.scrollWidth > tabs.clientWidth) {
      tabs.scrollTo({ left: Math.max(0, active.offsetLeft - 24), behavior: 'smooth' })
    }
  }, [activeModelId, lang])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-reveal]', {
        y: 36,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
      })
      gsap.from('[data-prompt-line]', {
        autoAlpha: 0,
        x: -16,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: { trigger: preRef.current, start: 'top 82%', once: true },
      })
      gsap.fromTo(
        '[data-frame]',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power4.inOut',
          clearProps: 'clipPath',
          scrollTrigger: { trigger: '[data-frame]', start: 'top 80%', once: true },
        },
      )
      gsap.fromTo(
        '[data-ghost]',
        { yPercent: -14, rotation: 4 },
        {
          yPercent: 16,
          rotation: 9,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
      gsap.fromTo(
        '[data-divider]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top 92%', end: 'top 45%', scrub: true },
        },
      )
    },
    { scope },
  )

  // Cross-fade the viewer when the active model changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '[data-viewer]',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
      )
    },
    { scope, dependencies: [activeModelId] },
  )

  // Per-character title reveal; re-split when the language swaps the text.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !titleRef.current) return
      const split = SplitText.create(titleRef.current, { type: 'chars', mask: 'chars' })
      gsap.from(split.chars, {
        yPercent: 120,
        duration: 0.7,
        ease: 'power4.out',
        stagger: 0.035,
        scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
      })
      return () => split.revert()
    },
    { scope, dependencies: [lang], revertOnUpdate: true },
  )

  const prompt = pick(caseDef.prompt)
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section ref={scope} id={caseDef.id} className="relative overflow-hidden">
      <div data-divider className="bg-line absolute inset-x-0 top-0 h-px origin-left" />
      <div
        aria-hidden
        data-ghost
        className="text-outline-faint pointer-events-none absolute -top-4 right-0 font-mono text-[clamp(8rem,20vw,15rem)] leading-none font-bold select-none"
      >
        {caseDef.index}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-32">
        <header className="max-w-3xl">
          <div
            data-reveal
            className="text-dim flex flex-wrap items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] uppercase"
          >
            <span className="text-accent">CASE {caseDef.index}</span>
            {caseDef.tags.map((tag) => (
              <span key={tag} className="border-line border px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
          <h2 ref={titleRef} className="mt-5 text-4xl font-bold tracking-tight uppercase md:text-6xl">
            {pick(caseDef.title)}
          </h2>
          <p data-reveal className="text-dim mt-4 max-w-xl leading-relaxed">
            {pick(caseDef.tagline)}
          </p>
        </header>

        <div data-reveal className="mt-10 max-w-4xl md:mt-14">
          <div className="border-line text-dim flex items-center justify-between border-b pb-3 font-mono text-[11px] tracking-[0.25em] uppercase">
            <span>{t('case.prompt')}</span>
            <button
              onClick={copyPrompt}
              className="hover:text-accent inline-flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="text-accent size-3" /> : <Copy className="size-3" />}
              {copied ? t('case.copied') : t('case.copy')}
            </button>
          </div>
          <pre
            ref={preRef}
            className="border-accent text-paper/90 mt-6 border-l-2 pl-5 font-mono text-sm leading-loose whitespace-pre-wrap"
          >
            {prompt.split('\n').map((line, i) => (
              <span key={i} data-prompt-line className="block min-h-[1.6em]">
                {line}
              </span>
            ))}
          </pre>
        </div>

        <div className="mt-12 md:mt-20">
          <div
            data-reveal
            className="border-line flex flex-col gap-3 border-b pb-3 md:flex-row md:items-center md:justify-between"
          >
            <span className="text-dim font-mono text-[11px] tracking-[0.25em] uppercase">
              {t('case.output')}
            </span>
            <div
              ref={tabsRef}
              className="no-scrollbar relative flex gap-1.5 overflow-x-auto md:flex-wrap md:overflow-x-visible"
              role="tablist"
            >
              <div
                ref={inkRef}
                aria-hidden
                className="bg-accent invisible absolute top-0 left-0 h-[2px] w-8"
              />
              {MODELS.map((m) => {
                // The dot reflects whether THIS model has a run for THIS case,
                // not its global status.
                const hasRun = Boolean(RUNS[caseDef.id]?.[m.id])
                return (
                  <button
                    key={m.id}
                    role="tab"
                    aria-selected={m.id === activeModelId}
                    onClick={() => selectModel(m.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] whitespace-nowrap transition-colors ${
                      m.id === activeModelId
                        ? 'border-line text-accent'
                        : 'text-dim hover:text-paper border-transparent'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        hasRun ? 'bg-accent' : 'bg-amber dot-breathe'
                      }`}
                    />
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div
            data-frame
            className="xl:relative xl:left-1/2 xl:w-[min(100vw-3rem,90rem)] xl:-translate-x-1/2"
          >
            <div data-viewer key={`${caseDef.id}-${activeModelId}`}>
              <Viewer caseDef={caseDef} model={activeModel} run={run} />
            </div>
          </div>

          {run?.note && (
            <p className="text-dim mt-5 max-w-4xl font-mono text-[11px] leading-relaxed">
              <span className="text-amber">{t('case.note')}</span>
              <span className="mx-2">·</span>
              {pick(run.note)}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
