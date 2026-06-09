import { Moon, Sun } from 'lucide-react'
import { useLang, type Lang } from '../i18n'
import { useTheme } from '../theme'
import { REPO_URL } from '../data/cases'

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export default function TopBar() {
  const { lang, setLang } = useLang()
  const { theme, setTheme } = useTheme()

  const LangButton = ({ target, label }: { target: Lang; label: string }) => (
    <button
      onClick={() => setLang(target)}
      aria-pressed={lang === target}
      className={`px-1 transition-colors ${
        lang === target ? 'text-accent' : 'text-dim hover:text-paper'
      }`}
    >
      {label}
    </button>
  )

  return (
    <header className="border-line bg-ink/80 fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-colors duration-500">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2.5 font-mono text-sm font-bold tracking-[0.2em]">
          <span className="bg-acid inline-block size-3" />
          NAGI BENCH
        </a>
        <div className="flex items-center gap-5">
          <nav className="flex items-center font-mono text-xs" aria-label="Language">
            <LangButton target="zh" label="中文" />
            <span className="text-dim select-none">/</span>
            <LangButton target="en" label="EN" />
          </nav>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="text-dim hover:text-paper transition-colors"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="text-dim hover:text-paper transition-colors"
          >
            <GithubMark className="size-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
