/**
 * Menus.tsx — start screen, pause overlay and match-over screen.
 */

import { useState } from 'react';

export function StartMenu({ onStart }: { onStart: (team: 'T' | 'CT', opts: { sens: number; vol: number }) => void }) {
  const [team, setTeam] = useState<'T' | 'CT'>('T');
  const [sens, setSens] = useState(2.1);
  const [vol, setVol] = useState(0.7);

  return (
    <div className="menu-overlay">
      <div className="menu-card">
        <h1>DE_DUST2 <span>5v5</span></h1>
        <p className="tagline">纯代码生成的战术射击原型 · React + TypeScript + three.js</p>

        <div className="team-pick">
          <button className={`team-btn t ${team === 'T' ? 'sel' : ''}`} onClick={() => setTeam('T')}>
            <b>恐怖分子 T</b><i>AK-47 · 携带 C4 · 进攻 A/B 点</i>
          </button>
          <button className={`team-btn ct ${team === 'CT' ? 'sel' : ''}`} onClick={() => setTeam('CT')}>
            <b>反恐精英 CT</b><i>M4A4 · 防守 · 拆除 C4</i>
          </button>
        </div>

        <div className="opt-row">
          <label>鼠标灵敏度 {sens.toFixed(1)}</label>
          <input type="range" min={0.5} max={5} step={0.1} value={sens}
            onChange={e => setSens(parseFloat(e.target.value))} />
          <label>音量 {Math.round(vol * 100)}%</label>
          <input type="range" min={0} max={1} step={0.05} value={vol}
            onChange={e => setVol(parseFloat(e.target.value))} />
        </div>

        <button className="play" onClick={() => onStart(team, { sens, vol })}>进 入 游 戏</button>

        <div className="controls">
          <div><b>WASD</b> 移动</div><div><b>空格</b> 跳跃</div><div><b>Ctrl</b> 蹲下</div>
          <div><b>Shift</b> 静步</div><div><b>左键</b> 开火</div><div><b>右键</b> AWP 开镜</div>
          <div><b>R</b> 换弹</div><div><b>1/2/3/Q/滚轮</b> 切枪</div><div><b>E</b> 下包 / 拆包</div>
          <div><b>Tab</b> 计分板</div><div><b>Esc</b> 菜单</div><div><b>F</b> 死亡后接管队友</div>
        </div>
        <p className="note">第一回合为手枪局 · 消灭敌方 / C4 爆炸 / 拆包即获胜 · 先赢 8 回合</p>
      </div>
    </div>
  );
}

export function PauseMenu({ onResume, onRestart, onQuit, vol, onVolume }: {
  onResume: () => void; onRestart: () => void; onQuit: () => void;
  vol: number; onVolume: (v: number) => void;
}) {
  return (
    <div className="menu-overlay translucent">
      <div className="menu-card small">
        <h2>已暂停</h2>
        <p className="tagline">鼠标已解锁 — 游戏仍在后台进行</p>
        <div className="opt-row">
          <label>音量 {Math.round(vol * 100)}%</label>
          <input type="range" min={0} max={1} step={0.05} value={vol}
            onChange={e => onVolume(parseFloat(e.target.value))} />
        </div>
        <button className="play" onClick={onResume}>继续游戏</button>
        <div className="row">
          <button className="ghost" onClick={onRestart}>重新开始比赛</button>
          <button className="ghost" onClick={onQuit}>返回主菜单</button>
        </div>
      </div>
    </div>
  );
}

export function MatchOver({ winner, scoreT, scoreCT, onRestart }: {
  winner: 'T' | 'CT'; scoreT: number; scoreCT: number; onRestart: () => void;
}) {
  return (
    <div className="menu-overlay translucent">
      <div className="menu-card small">
        <h1 className={winner === 'T' ? 't-win' : 'ct-win'}>
          {winner === 'T' ? '恐怖分子 获胜' : '反恐精英 获胜'}
        </h1>
        <p className="big-score">{scoreT} : {scoreCT}</p>
        <button className="play" onClick={onRestart}>再来一场</button>
      </div>
    </div>
  );
}
