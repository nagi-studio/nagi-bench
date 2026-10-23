import { useState } from 'react';
import { GameView } from './components/GameView';
import type { Team } from './game/types';

export default function App() {
  const [team, setTeam] = useState<Team | null>(null);
  if (team) return <GameView key={team} team={team} onExit={() => setTeam(null)} />;
  return (
    <main className="menu-screen">
      <div className="menu-grid" />
      <section className="menu-brand">
        <div className="eyebrow"><span className="status-dot" /> PROCEDURAL TACTICAL FPS</div>
        <h1>DUSTLINE<span>//</span><br />PROTOCOL</h1>
        <p className="menu-subtitle">5V5 · DUST2 CORE · ZERO EXTERNAL ASSETS</p>
        <div className="menu-rule" />
        <p className="menu-description">经典沙漠战场，完整战术回合。所有几何、角色、武器与声音均在浏览器中实时生成。</p>
        <div className="feature-row">
          <span>01 / 手枪局</span><span>02 / C4 爆破</span><span>03 / AI 协同</span>
        </div>
      </section>
      <section className="deploy-panel">
        <div className="panel-index">DEPLOYMENT / 001</div>
        <h2>选择你的阵营</h2>
        <p>你将与 4 名 AI 队友协同，对抗 5 名敌方 AI。</p>
        <button className="team-button ct" onClick={() => setTeam('CT')}>
          <span className="team-icon">CT</span>
          <span><strong>COUNTER-TERRORISTS</strong><small>防守 A / B 点 · 拆除 C4</small></span>
          <span className="button-arrow">→</span>
        </button>
        <button className="team-button t" onClick={() => setTeam('T')}>
          <span className="team-icon">T</span>
          <span><strong>TERRORISTS</strong><small>突破防线 · 安放 C4</small></span>
          <span className="button-arrow">→</span>
        </button>
        <div className="controls-grid">
          <span><kbd>WASD</kbd> 移动</span><span><kbd>鼠标</kbd> 瞄准 / 射击</span>
          <span><kbd>1 2 3</kbd> 切换武器</span><span><kbd>R</kbd> 换弹</span>
          <span><kbd>E</kbd> 安放 / 拆除</span><span><kbd>B</kbd> 购买装备</span>
          <span><kbd>SPACE</kbd> 跳跃 / 观战切换</span><span><kbd>F</kbd> 接管队友</span>
        </div>
        <div className="menu-footer">React 18 · TypeScript · three.js · Web Audio</div>
      </section>
    </main>
  );
}
