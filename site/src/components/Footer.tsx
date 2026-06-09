import { useLang } from '../i18n'
import { REPO_URL } from '../data/cases'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-line border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20">
        <p className="text-accent font-mono text-xs tracking-[0.35em] uppercase">
          {t('footer.tagline')}
        </p>
        <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <a
            href="https://github.com/nagi-studio"
            target="_blank"
            rel="noreferrer"
            className="text-outline hover:text-paper text-5xl font-bold tracking-tight uppercase transition-colors duration-300 md:text-7xl"
          >
            NAGI STUDIO
          </a>
          <div className="text-dim font-mono text-xs leading-relaxed">
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
