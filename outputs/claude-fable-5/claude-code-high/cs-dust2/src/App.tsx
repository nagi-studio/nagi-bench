import { useEffect, useRef, useState } from 'react'
import { Engine } from './game/engine'
import HUD from './ui/HUD'

export default function App() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [engine, setEngine] = useState<Engine | null>(null)

  useEffect(() => {
    const e = new Engine(viewportRef.current!)
    setEngine(e)
    ;(window as unknown as { __engine?: Engine }).__engine = e
    if (new URLSearchParams(location.search).has('auto')) e.start('CT', true)
    return () => e.dispose()
  }, [])

  return (
    <div className="app">
      <div ref={viewportRef} className="viewport" />
      {engine && <HUD engine={engine} />}
    </div>
  )
}
