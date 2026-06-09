import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'
export type Bilingual = { zh: string; en: string }

const STRINGS = {
  zh: {
    'doc.title': 'NAGI BENCH · LLM 测评案例',
    'hero.kicker': '由 NAGI STUDIO 维护的 LLM 测评案例集',
    'hero.badge': '一次性生成 · 可运行作品',
    'hero.sub': '同一段提示词，不同模型，一次生成、不许返工。这里收录它们交出的可运行作品，并排对比真实效果。',
    'hero.stdin': '提示词',
    'meta.cases': '案例',
    'meta.models': '模型',
    'meta.pending': '待测',
    'meta.updated': '更新于',
    'cases.label': '测评案例',
    'case.prompt': '提示词',
    'case.note': '运行备注',
    'case.copy': '复制',
    'case.copied': '已复制',
    'case.output': '模型产出',
    'case.run': '运行作品',
    'case.runHint': '点击后在下方沙盒中加载',
    'case.open': '新窗口打开',
    'case.raw': '查看源文件',
    'case.loading': '加载中',
    'case.loadError': '资源加载失败，请尝试打开源文件。',
    'empty.title': '待测',
    'empty.desc': '该模型暂未跑过这个案例，产出就位后会出现在这里。',
    'footer.tagline': '提示词不会说谎。',
    'footer.built': '使用 React · GSAP · Tailwind · Bun 构建，部署于 GitHub Pages。',
  },
  en: {
    'doc.title': 'NAGI BENCH · LLM eval cases',
    'hero.kicker': 'An LLM eval case collection by NAGI STUDIO',
    'hero.badge': 'One-shot · Runnable artifacts',
    'hero.sub': 'Same prompt, different models, one attempt and no retries. A side-by-side record of the runnable artifacts they ship.',
    'hero.stdin': 'prompt',
    'meta.cases': 'cases',
    'meta.models': 'models',
    'meta.pending': 'pending',
    'meta.updated': 'updated',
    'cases.label': 'Eval cases',
    'case.prompt': 'Prompt',
    'case.note': 'Run notes',
    'case.copy': 'Copy',
    'case.copied': 'Copied',
    'case.output': 'Model output',
    'case.run': 'Run artifact',
    'case.runHint': 'Loads in the sandbox below',
    'case.open': 'Open in new tab',
    'case.raw': 'View source file',
    'case.loading': 'Loading',
    'case.loadError': 'Failed to load the artifact. Try opening the source file.',
    'empty.title': 'Pending',
    'empty.desc': 'This model has not run this case yet. The artifact will appear here once it lands.',
    'footer.tagline': 'Prompts do not lie.',
    'footer.built': 'Built with React · GSAP · Tailwind · Bun. Deployed on GitHub Pages.',
  },
} as const

export type StringKey = keyof (typeof STRINGS)['zh']

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: StringKey) => string
  pick: (field: Bilingual) => string
}

const LangContext = createContext<LangContextValue | null>(null)

const STORAGE_KEY = 'nagi-bench-lang'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved === 'en' || saved === 'zh' ? saved : 'zh'
    } catch {
      return 'zh'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage unavailable (private mode / embedded webview); language still works for the session
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    document.title = STRINGS[lang]['doc.title']
  }, [lang])

  const value: LangContextValue = {
    lang,
    setLang,
    t: (key) => STRINGS[lang][key],
    pick: (field) => field[lang],
  }

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
