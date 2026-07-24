/**
 * 游戏主视图：负责把「引擎(固定步长模拟) / 渲染循环(rAF) / React 状态」三条线接起来。
 *
 *   rAF 循环   : 读输入 -> engine.step(dt) -> drain 事件 -> 分发给渲染和音频 -> 画一帧
 *   React      : 通过 useSyncExternalStore 订阅引擎的 20Hz 快照，只负责 HUD
 *   小地图/准星: 自己开 rAF 直接读引擎，避免高频 setState 把 React 拖垮
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/engine.ts';
import { InputSystem } from '../game/input.ts';
import type { InputAction } from '../game/input.ts';
import { GameRenderer } from '../render/renderer.ts';
import { audio } from '../audio/audio.ts';
import { consumeAudio, updateAudioListener } from '../audio/bridge.ts';
import { Hud } from './Hud.tsx';
import { Minimap } from './Minimap.tsx';
import { Scoreboard } from './Scoreboard.tsx';
import { BuyMenu } from './BuyMenu.tsx';
import { PauseMenu } from './PauseMenu.tsx';
import { useEngineSnapshot } from '../hooks/useEngineSnapshot.ts';
import type { MatchConfig } from './MainMenu.tsx';

interface Props {
  config: MatchConfig;
  onExit: () => void;
}

export function GameView({ config, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [locked, setLocked] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fps, setFps] = useState(0);

  const inputRef = useRef<InputSystem | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const pausedRef = useRef(false);
  const buyRef = useRef(false);

  pausedRef.current = paused;
  buyRef.current = showBuy;

  // 引擎构建（烘焙导航网格）比较重，先让浏览器画出 loading 再做
  useEffect(() => {
    const id = window.setTimeout(() => {
      const e = new GameEngine({
        seed: (Math.random() * 0xffffff) | 0,
        playerTeam: config.team,
        pistolOnly: config.pistolOnly,
        botSkill: config.botSkill,
        playerName: config.name || 'YOU',
      });
      e.startMatch();
      setEngine(e);
    }, 40);
    return () => window.clearTimeout(id);
  }, [config]);

  const handleAction = useCallback(
    (action: InputAction) => {
      const e = engine;
      if (!e) return;
      switch (action) {
        case 'buy':
          if (e.phase === 'freeze' && e.localActor?.alive) {
            // 副作用放在 setState 外面：更新函数必须保持纯净
            const next = !buyRef.current;
            buyRef.current = next;
            setShowBuy(next);
            if (next) inputRef.current?.exitLock();
            else inputRef.current?.requestLock();
          }
          break;
        case 'scoreboardOn':
          setShowScore(true);
          break;
        case 'scoreboardOff':
          setShowScore(false);
          break;
        case 'spectateNext':
          if (!e.localActor?.alive) e.spectateNext(1);
          break;
        case 'takeControl':
          if (!e.localActor?.alive) e.takeControl();
          break;
        case 'menu': {
          setShowBuy(false);
          buyRef.current = false;
          const next = !pausedRef.current;
          pausedRef.current = next;
          setPaused(next);
          if (next) inputRef.current?.exitLock();
          else inputRef.current?.requestLock();
          break;
        }
        default:
          break;
      }
    },
    [engine],
  );

  // 主循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;

    const renderer = new GameRenderer(canvas, engine, {
      fov: config.fov,
      shadows: config.shadows,
      viewmodel: true,
    });
    rendererRef.current = renderer;

    const input = new InputSystem();
    input.settings.sensitivity = config.sensitivity;
    inputRef.current = input;
    input.attach(canvas, handleAction, setLocked);

    audio.setVolume(config.volume);
    audio.enabled = config.volume > 0;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.resize(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();
    let fpsAccum = 0;
    let fpsFrames = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      const blocked = pausedRef.current || buyRef.current;
      const me = engine.localActor;

      if (!blocked && me) {
        if (me.alive) {
          input.applyLook(me);
          input.fillIntent(me, engine.phase !== 'over');
        } else {
          // 死亡后仍然可以用鼠标自由观察（跟随队友视角）
          input.fillIntent(me, false);
        }
      }

      if (!blocked) {
        engine.step(dt);
      }

      const events = engine.drainEvents();
      consumeAudio(events, engine);
      updateAudioListener(engine);
      renderer.sync(engine, dt, events);
      renderer.render();

      fpsAccum += dt;
      fpsFrames++;
      if (fpsAccum >= 0.5) {
        setFps(Math.round(fpsFrames / fpsAccum));
        fpsAccum = 0;
        fpsFrames = 0;
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      input.detach();
      renderer.dispose();
      rendererRef.current = null;
      inputRef.current = null;
    };
  }, [engine, config, handleAction]);

  // 点击画布开始/恢复
  const handleCanvasClick = useCallback(() => {
    audio.ensureStarted();
    if (!paused && !showBuy) inputRef.current?.requestLock();
  }, [paused, showBuy]);

  return (
    <div className="game-root">
      <canvas ref={canvasRef} onClick={handleCanvasClick} />
      {!engine && (
        <div className="loading">
          <div className="loading-title">正在生成 DUST2…</div>
          <div className="loading-sub">构建几何体 · 烘焙导航网格</div>
        </div>
      )}
      {engine && (
        <GameOverlays
          engine={engine}
          locked={locked}
          showScore={showScore}
          showBuy={showBuy}
          paused={paused}
          fps={fps}
          config={config}
          onCloseBuy={() => {
            setShowBuy(false);
            inputRef.current?.requestLock();
          }}
          onResume={() => {
            setPaused(false);
            inputRef.current?.requestLock();
          }}
          onExit={onExit}
          onSettings={(s) => {
            rendererRef.current?.applySettings(s.render);
            if (inputRef.current) inputRef.current.settings.sensitivity = s.sensitivity;
            audio.setVolume(s.volume);
          }}
        />
      )}
    </div>
  );
}

interface OverlayProps {
  engine: GameEngine;
  locked: boolean;
  showScore: boolean;
  showBuy: boolean;
  paused: boolean;
  fps: number;
  config: MatchConfig;
  onCloseBuy: () => void;
  onResume: () => void;
  onExit: () => void;
  onSettings: (s: {
    render: { fov: number; shadows: boolean };
    sensitivity: number;
    volume: number;
  }) => void;
}

function GameOverlays({
  engine,
  locked,
  showScore,
  showBuy,
  paused,
  fps,
  config,
  onCloseBuy,
  onResume,
  onExit,
  onSettings,
}: OverlayProps) {
  const snap = useEngineSnapshot(engine);

  return (
    <>
      <Hud engine={engine} snap={snap} fov={config.fov} />
      <Minimap engine={engine} />
      {showScore && <Scoreboard snap={snap} />}
      {showBuy && <BuyMenu engine={engine} snap={snap} onClose={onCloseBuy} />}
      {paused && (
        <PauseMenu
          onResume={onResume}
          onExit={onExit}
          onSettings={onSettings}
          fps={fps}
          initial={{
            fov: config.fov,
            shadows: config.shadows,
            sensitivity: config.sensitivity,
            volume: config.volume,
          }}
        />
      )}
      {!locked && !paused && !showBuy && (
        <div className="click-to-play" onClick={() => undefined}>
          <div className="ctp-box">
            <div className="ctp-title">点击画面进入游戏</div>
            <div className="ctp-keys">
              <span>WASD 移动</span>
              <span>空格 跳跃</span>
              <span>Ctrl 蹲</span>
              <span>左键 开火</span>
              <span>右键 开镜(AWP)</span>
              <span>R 换弹</span>
              <span>E 下包/拆包</span>
              <span>1/2/3 切枪</span>
              <span>B 购买</span>
              <span>Tab 记分板</span>
              <span>Esc 菜单</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
