// Hosts the engine. The Game instance lives outside React state: it is created in an effect
// (with its own <canvas>, so React StrictMode's double-mount never reuses a WebGL context) and
// torn down in the effect cleanup.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Game } from '../game/Game';
import { hud, resetHudForMenu, useHud } from '../state/store';
import { Hud, ScoreTables } from './Hud';

const CONTROLS: [string, string][] = [
  ['W A S D', '移动'],
  ['鼠标', '转动视角'],
  ['空格', '跳跃'],
  ['Ctrl / C', '蹲下'],
  ['Shift', '静步'],
  ['鼠标左键', '开火'],
  ['鼠标右键', 'AWP 开镜 / 刀重击'],
  ['R', '换弹'],
  ['1 / 2 / 3 · Q · 滚轮', '主武器 / 副武器 / 刀 · 上一把'],
  ['E（按住）', '安放 / 拆除 C4'],
  ['G', '丢弃 C4'],
  ['B', '准备时间内选择装备'],
  ['Tab', '计分板'],
  ['阵亡后：左/右键 · F', '切换队友视角 · 接管队友'],
  ['Esc', '暂停'],
];

function PauseOverlay({ onResume, onQuit, game }: { onResume: () => void; onQuit: () => void; game: () => Game | null }) {
  const locked = useHud((s) => s.locked);
  const matchOver = useHud((s) => s.matchOver);
  const settings = useHud((s) => s.settings);
  const roundNum = useHud((s) => s.roundNum);
  if (locked || matchOver) return null;
  return (
    <div className="overlay" onClick={onResume}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-title">{roundNum <= 1 ? '准备就绪' : '已暂停'}</div>
        <button className="btn primary big" onClick={onResume}>
          点击进入战场
        </button>
        <div className="controls">
          {CONTROLS.map(([k, v]) => (
            <div key={k} className="control">
              <span className="keys">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <div className="sliders">
          <label>
            鼠标灵敏度 <b>{settings.sensitivity.toFixed(2)}</b>
            <input
              type="range"
              min={0.2}
              max={3}
              step={0.05}
              value={settings.sensitivity}
              onChange={(e) => {
                const v = Number(e.target.value);
                hud.set({ settings: { ...hud.get().settings, sensitivity: v } });
                game()?.setSensitivity(v);
              }}
            />
          </label>
          <label>
            音量 <b>{Math.round(settings.volume * 100)}</b>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                hud.set({ settings: { ...hud.get().settings, volume: v } });
                game()?.setVolume(v);
              }}
            />
          </label>
        </div>
        <button className="btn ghost" onClick={onQuit}>
          返回主菜单
        </button>
      </div>
    </div>
  );
}

function MatchOver({ onQuit }: { onQuit: () => void }) {
  const result = useHud((s) => s.matchOver);
  const scoreAtk = useHud((s) => s.scoreAtk);
  const scoreDef = useHud((s) => s.scoreDef);
  if (!result) return null;
  return (
    <div className="overlay">
      <div className="overlay-card wide">
        <div className={`overlay-title ${result}`}>{result === 'win' ? '比赛胜利' : '比赛失败'}</div>
        <div className="final-score">
          <span className="def">守方 {scoreDef}</span>
          <span className="colon">:</span>
          <span className="atk">{scoreAtk} 攻方</span>
        </div>
        <ScoreTables />
        <button className="btn primary big" onClick={onQuit}>
          返回主菜单
        </button>
      </div>
    </div>
  );
}

export function GameView() {
  const stageRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let game: Game | null = null;
    try {
      game = new Game(el, { ...hud.get().settings });
      gameRef.current = game;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    }
    return () => {
      game?.dispose();
      gameRef.current = null;
    };
  }, []);

  const resume = useCallback(() => gameRef.current?.resume(), []);
  const quit = useCallback(() => resetHudForMenu(), []);
  const getGame = useCallback(() => gameRef.current, []);

  return (
    <div className="game-root" onContextMenu={(e) => e.preventDefault()}>
      <div className="game-stage" ref={stageRef} />
      {error ? (
        <div className="overlay">
          <div className="overlay-card">
            <div className="overlay-title lose">无法启动 3D 渲染</div>
            <p className="error-text">{error}</p>
            <p className="error-text">请确认浏览器已启用 WebGL / 硬件加速。</p>
            <button className="btn primary" onClick={quit}>
              返回主菜单
            </button>
          </div>
        </div>
      ) : (
        <>
          <Hud />
          <PauseOverlay onResume={resume} onQuit={quit} game={getGame} />
          <MatchOver onQuit={quit} />
        </>
      )}
    </div>
  );
}
