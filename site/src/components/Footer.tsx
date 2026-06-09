import { useRef } from 'react'
import { gsap, useGSAP, SplitText, prefersReducedMotion } from '../lib/gsap'
import { useLang } from '../i18n'
import { REPO_URL } from '../data/cases'

export default function Footer() {
  const { t } = useLang()
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create('[data-footer-title]', { type: 'chars', mask: 'chars' })
      gsap.from(split.chars, {
        yPercent: 120,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.03,
        scrollTrigger: { trigger: scope.current, start: 'top 88%', once: true },
      })
      gsap.from('[data-footer-fade]', {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: 'top 88%', once: true },
      })
      return () => split.revert()
    },
    { scope },
  )

  return (
    <footer ref={scope} className="border-line border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20">
        <p data-footer-fade className="text-accent font-mono text-xs tracking-[0.35em] uppercase">
          {t('footer.tagline')}
        </p>
        <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <a
            href="https://github.com/nagi-studio"
            target="_blank"
            rel="noreferrer"
            data-footer-title
            className="text-outline hover:text-paper text-5xl font-bold tracking-tight uppercase transition-colors duration-300 md:text-7xl"
          >
            NAGI STUDIO
          </a>
          <div data-footer-fade className="text-dim font-mono text-xs leading-relaxed">
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              github.com/nagi-studio/nagi-bench
            </a>
            <p className="mt-2">{t('footer.built')}</p>
            <p className="mt-1">© 2026 NAGI STUDIO</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
