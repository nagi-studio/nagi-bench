// ---------------------------------------------------------------------------
// App：菜单（选边）+ 游戏挂载
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import { Game } from './game/engine';
import { audio } from './game/audio';
import { Team } from './game/types';
import { Hud } from './ui/Hud';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [team, setTeam] = useState<Team>('CT');

  useEffect(() => {
    return () => { game?.dispose(); };
  }, [game]);

  const start = () => {
    if (!canvasRef.current || game) return;
    audio.init();
    const g = new Game(canvasRef.current, team);
    g.start();
    (window as unknown as { __game: Game }).__game = g;
    setGame(g);
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="game-canvas" />
      {game && <Hud game={game} />}
      {!game && (
        <div className="menu-overlay">
          <div className="menu-card">
            <h1 className="menu-title">DUST<span>2</span> · 5v5</h1>
            <p className="menu-sub">React + TypeScript + three.js 程序化 FPS 原型</p>
            <div className="team-select">
              <button
                className={`team-btn ct ${team === 'CT' ? 'sel' : ''}`}
                onClick={() => setTeam('CT')}
              >
                <b>CT 阵营</b>
                <small>防守 A / B 点，拆除 C4</small>
              </button>
              <button
                className={`team-btn t ${team === 'T' ? 'sel' : ''}`}
                onClick={() => setTeam('T')}
              >
                <b>T 阵营</b>
                <small>进攻包点，安放并引爆 C4</small>
              </button>
            </div>
            <button className="start-btn" onClick={start}>进入战场</button>
            <div className="menu-help">
              <p><b>WASD</b> 移动 · <b>空格</b> 跳跃 · <b>Shift</b> 静步 · <b>鼠标</b> 转视角</p>
              <p><b>左键</b> 开火 · <b>右键</b> AWP 开镜 · <b>R</b> 换弹 · <b>1/2/3</b> 武器 · <b>Q</b> 快切</p>
              <p><b>E</b> 安放 / 拆除 C4 · 阵亡后 <b>F</b> 接管存活队友</p>
              <p className="dim">第 1 回合为手枪局；第 2 回合起发放步枪 / AWP 与护甲</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
