import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { GameEngine } from './game/engine';
import type { UiState } from './game/engine';
import type { HudState } from './game/types';
import HUD from './ui/HUD';

export default function App(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [hud, setHud] = useState<HudState | null>(null);
  const [ui, setUi] = useState<UiState>({ started: false, paused: false });

  useEffect(() => {
    if (!containerRef.current) return;
    const engine = new GameEngine(containerRef.current, setHud, setUi);
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const engine = engineRef.current;
  const matchOver = hud?.matchWinner != null;

  return (
    <div className="app">
      <div ref={containerRef} className="viewport" />
      {hud && ui.started && !matchOver && <HUD hud={hud} engine={engine} />}

      {!ui.started && (
        <div className="overlay menu">
          <div className="menu-card">
            <h1>DUST2 <span>5v5</span></h1>
            <p className="sub">React + TypeScript + three.js · 全程序化生成 · 无外部资产</p>
            <div className="menu-cols">
              <div>
                <h3>操作</h3>
                <ul>
                  <li><b>WASD</b> 移动 · <b>空格</b> 跳跃 · <b>Shift</b> 静步</li>
                  <li><b>鼠标</b> 视角 · <b>左键</b> 开火 · <b>右键</b> AWP 开镜 / 刀重击</li>
                  <li><b>1 / 2 / 3</b> 主武器 / 副武器 / 刀 · <b>R</b> 换弹</li>
                  <li><b>E</b> 安放 / 拆除 C4 · <b>G</b> 丢弃 C4</li>
                  <li><b>B</b> 冻结时间购买 · <b>Tab</b> 计分板</li>
                  <li>阵亡后：<b>空格</b> 切换观战 · <b>F</b> 接管队友</li>
                </ul>
              </div>
              <div>
                <h3>规则</h3>
                <ul>
                  <li>你是 <span className="ct">CT</span>，带领 4 名 AI 对抗 5 名 T</li>
                  <li>第 1 回合为手枪局：默认手枪、无护甲</li>
                  <li>T 安放 C4 后 40 秒爆炸；CT 拆除需 10 秒</li>
                  <li>半场换边 · 先到 <b>8</b> 分获胜</li>
                </ul>
              </div>
            </div>
            <button className="btn primary" onClick={() => engine?.enterGame()}>
              进入战场（锁定鼠标）
            </button>
            <p className="tip">提示：点击画面锁定鼠标，Esc 暂停。声音为 Web Audio 实时合成。</p>
          </div>
        </div>
      )}

      {ui.started && ui.paused && !matchOver && (
        <div className="overlay pause">
          <div className="menu-card small">
            <h2>已暂停</h2>
            <button className="btn primary" onClick={() => engine?.resume()}>继续游戏</button>
            <button className="btn" onClick={() => engine?.restart()}>重新开始比赛</button>
          </div>
        </div>
      )}

      {matchOver && hud && (
        <div className="overlay matchend">
          <div className="menu-card small">
            <h2 className={hud.matchWinner === 'CT' ? 'ct' : 't'}>
              {hud.matchWinner === 'CT' ? 'CT 胜利！' : 'T 胜利！'}
            </h2>
            <p className="final-score">
              <span className="ct">{hud.scores.CT}</span> : <span className="t">{hud.scores.T}</span>
            </p>
            <button className="btn primary" onClick={() => engine?.restart()}>再来一局</button>
          </div>
        </div>
      )}
    </div>
  );
}
