import { useEffect, useRef, useSyncExternalStore } from 'react'
import { Game } from './game/Game'
import { HudBus } from './game/snapshot'
import { HUD } from './ui/HUD'

export default function App() {
  const host = useRef<HTMLDivElement>(null)
  const bus = useRef(new HudBus()).current
  const game = useRef<Game | null>(null)
  const snap = useSyncExternalStore(bus.subscribe, bus.get, bus.get)

  useEffect(() => {
    const node = host.current
    if (!node) return
    const g = new Game(node, bus)
    game.current = g
    g.start()
    return () => {
      g.dispose()
      game.current = null
    }
  }, [bus])

  return (
    <div className="app">
      <div className="view" ref={host} />
      <HUD
        snap={snap}
        bake={bus.bake}
        onStart={(team) => game.current?.startMatch(team)}
        onResume={() => game.current?.resume()}
      />
    </div>
  )
}
