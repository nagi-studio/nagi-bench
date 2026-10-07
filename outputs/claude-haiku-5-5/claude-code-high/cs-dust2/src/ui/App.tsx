import { useState } from 'react'
import { MainMenu, type MenuConfig } from './MainMenu.tsx'
import { GameScreen } from './GameScreen.tsx'

export function App() {
  const [config, setConfig] = useState<MenuConfig | null>(null)
  return config ? <GameScreen config={config} onExit={() => setConfig(null)} /> : <MainMenu onStart={setConfig} />
}
