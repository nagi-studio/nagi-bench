// ============================================================================
// 菜单 —— 开始菜单（选阵营）/ 比赛结算
// ============================================================================
import { useSyncExternalStore } from 'react';
import type { Game } from '../game/engine';

export function Menus({ game }: { game: Game }) {
  const g = game;
  const s = useSyncExternalStore(g.store.subscribe, g.store.getSnapshot);
  if (!s) return null;

  if (s.phase === 'menu') {
    return (
      <div className="menu">
        <div className="menu-card">
          <h1 className="menu-title">DUST2 <span>5v5</span></h1>
          <div className="menu-subtitle">React + TypeScript + three.js · 程序化生成 FPS 原型</div>
          <div className="menu-features">
            <span>复刻 Dust2：A大 / A点 / 中门 / 猫道 / B洞 / B点</span>
            <span>AK-47 · M4A4 · AWP(右键开镜) · Glock/USP · 沙鹰 · 刀</span>
            <span>手枪局 → 经济购买 → C4 下包 / 拆包 · 5v5 AI</span>
          </div>
          <div className="menu-buttons">
            <button className="join-t" onClick={() => g.startMatch('T')}>加入 T（进攻方）</button>
            <button className="join-ct" onClick={() => g.startMatch('CT')}>加入 CT（防守方）</button>
          </div>
          <div className="menu-controls">
            <div><b>WASD</b> 移动 · <b>空格</b> 跳 · <b>Shift</b> 静步 · <b>Ctrl</b> 蹲</div>
            <div><b>1/2/3/5</b> 切换武器 · <b>R</b> 换弹 · <b>G</b> 丢包 · <b>B</b> 购买</div>
            <div><b>右键</b> AWP 开镜 / 刀重击 · <b>E</b> 拆包 · 阵亡后 <b>E</b> 接管队友</div>
            <div><b>Tab</b> 记分板 · <b>Esc</b> 释放鼠标</div>
          </div>
          <div className="menu-tip">点击阵营按钮开始（将请求鼠标指针锁定，声音为程序合成）</div>
        </div>
      </div>
    );
  }

  if (s.phase === 'matchover') {
    const win = s.matchWinner === s.self.team;
    return (
      <div className="menu">
        <div className="menu-card">
          <h1 className={`menu-title ${win ? 'win' : 'lose'}`}>{win ? '比赛胜利！' : '比赛失败'}</h1>
          <div className="menu-subtitle">最终比分 {s.scores.t} : {s.scores.ct}（{s.matchWinner === 'T' ? 'T' : 'CT'} 阵营获胜）</div>
          <div className="menu-buttons">
            <button className="join-ct" onClick={() => g.restartMatch()}>返回大厅</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
