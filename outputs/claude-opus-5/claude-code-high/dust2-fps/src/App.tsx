import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioEngine } from './audio/audio.ts';
import { GameEngine } from './game/engine.ts';
import type { MatchConfig } from './game/engine.ts';
import { InputController } from './input/input.ts';
import { GameRenderer } from './render/renderer.ts';
import { useEngineSnapshot } from './hooks/useEngineSnapshot.ts';
import { BuyMenu } from './ui/BuyMenu.tsx';
import { HUD } from './ui/HUD.tsx';
import { Scoreboard } from './ui/Scoreboard.tsx';
import { StartScreen } from './ui/StartScreen.tsx';

/**
 * Session root. Owns the three long-lived systems — simulation (GameEngine),
 * presentation (GameRenderer + AudioEngine) and input — and the single
 * requestAnimationFrame loop that drives them:
 *
 *   rAF -> engine.advance(dt)      fixed 64 Hz ticks, gameplay truth
 *       -> renderer.render(dt)     samples engine state, interpolation-free
 *       -> engine.notify()         throttled snapshot -> React HUD
 */
function Game({ config, onQuit }: { config: Partial<MatchConfig>; onQuit: () => void }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine] = useState(() => new GameEngine(config));
  const [locked, setLocked] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [muted, setMuted] = useState(false);
  const inputRef = useRef<InputController | null>(null);
  const audioRef = useRef<AudioEngine | null>(null);
  const snap = useEngineSnapshot(engine);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new GameRenderer(canvas, engine);
    const audio = new AudioEngine();
    audio.bind(engine);
    audioRef.current = audio;

    let isMuted = false;
    const input = new InputController(engine, canvas, {
      onLockChange: (l) => setLocked(l),
      onToggleScoreboard: (s) => setShowScoreboard(s),
      onToggleBuy: () => setShowBuy((v) => !v),
      onToggleMute: () => {
        isMuted = !isMuted;
        audio.setMuted(isMuted);
        setMuted(isMuted);
      },
      onFirstInteraction: () => void audio.resume(),
    });
    input.attach();
    inputRef.current = input;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      engine.advance(dt);
      const view = engine.viewActor;
      if (view) audio.setListener(view.pos, view.yaw);
      renderer.render(dt);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => renderer.resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      input.detach();
      audio.dispose();
      renderer.dispose();
    };
  }, [engine]);

  // The buy menu is only meaningful during freeze time.
  useEffect(() => {
    if (snap.phase !== 'freeze' && showBuy) setShowBuy(false);
  }, [snap.phase, showBuy]);

  // Releasing the pointer while a modal is open keeps the cursor usable, and
  // the engine is told so its snapshot stays truthful.
  useEffect(() => {
    engine.toggleBuyMenu(showBuy);
    if (showBuy) inputRef.current?.exitLock();
  }, [showBuy, engine]);

  const requestLock = useCallback(() => {
    if (showBuy) return;
    inputRef.current?.requestLock();
    void audioRef.current?.resume();
  }, [showBuy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setShowBuy(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <canvas id="game" ref={canvasRef} onClick={requestLock} />
      <HUD snap={snap} engine={engine} />
      {showScoreboard && <Scoreboard snap={snap} />}
      {showBuy && <BuyMenu snap={snap} engine={engine} onClose={() => setShowBuy(false)} />}
      {!locked && !showBuy && (
        <div className="paused" onClick={requestLock}>
          <div className="box panel">
            点击画面锁定鼠标并开始游戏
            <small>
              第 {snap.roundNumber} 回合 · CT {snap.scoreCT} : {snap.scoreT} T · 按 Esc 释放鼠标 ·{' '}
              {muted ? '已静音 (M)' : '音效开启 (M)'}
            </small>
            <small style={{ marginTop: 12 }}>
              <span
                style={{ pointerEvents: 'auto', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuit();
                }}
              >
                返回主菜单
              </span>
            </small>
          </div>
        </div>
      )}
    </>
  );
}

export default function App(): JSX.Element {
  const [config, setConfig] = useState<Partial<MatchConfig> | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  if (!config) {
    return (
      <StartScreen
        onStart={(cfg) => {
          setConfig(cfg);
          setSessionKey((k) => k + 1);
        }}
      />
    );
  }
  return <Game key={sessionKey} config={config} onQuit={() => setConfig(null)} />;
}
