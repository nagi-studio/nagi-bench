import { useEffect, useRef, useState } from 'react';
import { HUD } from './components/HUD';
import { Minimap } from './components/Minimap';
import { GameEngine } from './game/engine';
import type { EngineSnapshot, MapLayout, Team } from './game/types';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [snapshot, setSnapshot] = useState<EngineSnapshot | null>(null);
  const [layout, setLayout] = useState<MapLayout | null>(null);
  const [team, setTeam] = useState<Team>('T');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!containerRef.current) return;
    try {
      const engine = new GameEngine(containerRef.current, setSnapshot);
      engineRef.current = engine;
      setLayout(engine.getLayout());
      return () => {
        engine.dispose();
        engineRef.current = null;
      };
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'WebGL 初始化失败');
    }
  }, []);

  const start = () => engineRef.current?.start(team);

  return (
    <main className="game-shell">
      <div className="world-container" ref={containerRef} />
      {error && (
        <div className="modal-layer"><section className="error-panel"><small>RENDERER OFFLINE</small><h1>无法启动 WebGL</h1><p>{error}</p><p>请使用支持 WebGL 2 的现代浏览器并开启硬件加速。</p></section></div>
      )}
      {!error && !snapshot && <div className="loading-screen"><div className="loading-mark">//</div><span>正在生成 Dust2 战场</span><small>GEOMETRY · NAVIGATION · BALLISTICS</small></div>}
      {snapshot?.started && layout && (
        <>
          <Minimap layout={layout} snapshot={snapshot} />
          <HUD
            snapshot={snapshot}
            onBuy={(id) => engineRef.current?.buy(id)}
            onCloseBuy={() => engineRef.current?.closeBuy()}
          />
        </>
      )}
      {snapshot && !snapshot.started && (
        <div className="start-screen">
          <div className="start-grid" />
          <section className="start-content">
            <header className="start-header">
              <div className="start-kicker"><span>//</span> PROTOCOL 07 <i /> DUST2 COMBAT SIMULATION</div>
              <h1>SANDLINE<br /><strong>STRIKE</strong></h1>
              <p>沙漠防线，一触即发。纯程序化构建的 5v5 第一人称战术射击原型。</p>
              <div className="feature-row"><span>10 COMBATANTS</span><span>2 BOMB SITES</span><span>0 EXTERNAL ASSETS</span></div>
            </header>
            <div className="deployment-card">
              <div className="deployment-heading"><small>01 // DEPLOYMENT</small><h2>选择阵营</h2><span>你 + 4 名 AI 队友 vs 5 名敌方 AI</span></div>
              <div className="team-select">
                <button className={team === 'CT' ? 'selected ct-selected' : ''} onClick={() => setTeam('CT')}>
                  <span className="team-emblem">◆</span><strong>CT</strong><b>COUNTER-TERRORISTS</b><small>防守目标区域 · 拆除 C4</small>
                </button>
                <button className={team === 'T' ? 'selected t-selected' : ''} onClick={() => setTeam('T')}>
                  <span className="team-emblem">▲</span><strong>T</strong><b>TERRORISTS</b><small>突破防线 · 安放 C4</small>
                </button>
              </div>
              <button className="deploy-button" onClick={start}><span>开始手枪局</span><b>DEPLOY</b><i>→</i></button>
              <div className="deploy-note"><i className="status-dot" /> 点击部署将锁定鼠标并启用程序化音频</div>
            </div>
            <div className="start-controls">
              <div><kbd>W A S D</kbd><span>移动</span></div>
              <div><kbd>鼠标</kbd><span>瞄准 / 开火</span></div>
              <div><kbd>SPACE</kbd><span>跳跃</span></div>
              <div><kbd>1 2 3 / Q</kbd><span>切换武器</span></div>
              <div><kbd>E</kbd><span>安放 / 拆除</span></div>
              <div><kbd>B</kbd><span>购买装备</span></div>
              <div><kbd>R</kbd><span>换弹</span></div>
              <div><kbd>F / G</kbd><span>阵亡后观战 / 接管</span></div>
            </div>
          </section>
          <footer className="start-footer"><span>REACT 18 // TYPESCRIPT // THREE.JS</span><span>ESC 释放鼠标 · AWP 右键开镜</span></footer>
        </div>
      )}
      {snapshot?.started && snapshot.paused && !snapshot.buyOpen && (
        <div className="modal-layer pause-layer">
          <section className="pause-menu">
            <small>TACTICAL PAUSE</small>
            <h2>战术暂停</h2>
            <p>鼠标已释放，战场仿真已暂停。</p>
            <button onClick={() => engineRef.current?.resume()}>返回战场 <span>→</span></button>
            <div>点击后重新锁定鼠标 · ESC 暂停</div>
          </section>
        </div>
      )}
    </main>
  );
}
