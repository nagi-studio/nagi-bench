import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { GameCore } from './game/core/core.ts';
import { Renderer } from './game/render/renderer.ts';
import { InputController } from './game/render/input.ts';
import { AudioEngine } from './game/audio.ts';
import { HudStore } from './store.ts';
import type { Team } from './game/core/types.ts';
import { Menu } from './components/Menu.ts';
import { HUD } from './components/HUD.ts';
import { h } from './components/h.ts';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const storeRef = useRef<HudStore | null>(null);
  const coreRef = useRef<GameCore | null>(null);
  const audioRef = useRef<AudioEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const inputRef = useRef<InputController | null>(null);

  if (!storeRef.current) storeRef.current = new HudStore();
  if (!coreRef.current) coreRef.current = new GameCore();
  if (!audioRef.current) audioRef.current = new AudioEngine();

  const store = storeRef.current;
  const core = coreRef.current;
  const audio = audioRef.current;

  const snap = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [locked, setLocked] = useState(false);
  const [scoreboard, setScoreboard] = useState(false);

  useEffect(() => {
    if (screen !== 'game') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new Renderer(canvas, core, audio, store);
    const input = new InputController(canvas, core, renderer, {
      onLock: setLocked,
      onScoreboard: setScoreboard,
    });
    rendererRef.current = renderer;
    inputRef.current = input;
    renderer.start();
    return () => {
      input.dispose();
      renderer.dispose();
      rendererRef.current = null;
      inputRef.current = null;
    };
  }, [screen, core, audio, store]);

  const start = (team: Team) => {
    audio.resume();
    core.startMatch(team);
    store.publish(core.getSnapshot());
    setScreen('game');
  };

  const restart = () => {
    audio.resume();
    core.startMatch(core.playerTeam);
    store.publish(core.getSnapshot());
    inputRef.current?.requestLock();
  };

  return h(
    'div',
    { className: 'app' },
    h('canvas', { ref: canvasRef, className: 'game-canvas' }),
    screen === 'menu' ? h(Menu, { onStart: start }) : null,
    screen === 'game'
      ? h(HUD, { snap, core, map: core.map, locked, scoreboard, onRestart: restart })
      : null,
  );
}
