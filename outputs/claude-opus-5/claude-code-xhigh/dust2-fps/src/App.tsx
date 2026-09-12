import { useState } from 'react';
import { MainMenu } from './ui/MainMenu.tsx';
import type { MatchConfig } from './ui/MainMenu.tsx';
import { GameView } from './ui/GameView.tsx';

export default function App() {
  const [config, setConfig] = useState<MatchConfig | null>(null);
  // key 用 config 引用，退出再进入时彻底重建引擎与渲染器
  return config ? (
    <GameView config={config} onExit={() => setConfig(null)} />
  ) : (
    <MainMenu onStart={setConfig} />
  );
}
