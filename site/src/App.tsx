import { useEffect } from 'react'
import { LangProvider, useLang } from './i18n'
import { ThemeProvider } from './theme'
import { CASES } from './data/cases'
import { ScrollTrigger } from './lib/gsap'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import ModelMarquee from './components/ModelMarquee'
import CaseSection from './components/CaseSection'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import GridSpotlight from './components/GridSpotlight'

function Shell() {
  const { lang } = useLang()

  useEffect(() => {
    // Text reflows when the language changes, which shifts trigger positions.
    ScrollTrigger.refresh()
  }, [lang])

  useEffect(() => {
    // Deep links (#<case-id> or #<case-id>:<model-id>) point at elements that
    // do not exist until React mounts, so scroll to them manually once.
    const caseId = window.location.hash.slice(1).split(':')[0]
    if (!caseId) return
    document.getElementById(caseId)?.scrollIntoView()
  }, [])

  return (
    <div className="bg-blueprint min-h-[100dvh]">
      <TopBar />
      <main>
        <Hero />
        <ModelMarquee />
        <div id="cases">
          {CASES.map((c) => (
            <CaseSection key={c.id} caseDef={c} />
          ))}
        </div>
      </main>
      <Footer />
      <GridSpotlight />
      <ScrollProgress />
      <CursorGlow />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Shell />
      </LangProvider>
    </ThemeProvider>
  )
}
