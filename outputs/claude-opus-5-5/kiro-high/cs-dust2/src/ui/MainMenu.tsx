import { useState } from 'react';
import type { GameOptions } from '../game/Game';
import type { Team } from '../game/types';
import { useGame, useHud } from './context';

const CONTROLS: [string, string][] = [
  ['WASD', '移动'],
  ['鼠标', '视角（指针锁定）'],
  ['左键', '开火 / 刀轻击'],
  ['右键', 'AWP 开镜（两级） / 刀重击'],
  ['空格', '跳跃'],
  ['Shift', '静步'],
  ['C / Ctrl', '蹲下'],
  ['R', '换弹'],
  ['1 / 2 / 3', '主武器 / 副武器 / 刀'],
  ['Q · 滚轮', '上一把 / 切换武器'],
  ['E（按住）', '安放 / 拆除 C4 · 观战时接管队友'],
  ['G', '丢弃 C4'],
  ['B', '购买菜单（长枪局冻结时间）'],
  ['Tab', '计分板'],
  ['Esc', '暂停（释放鼠标）'],
];

export function ControlsList() {
  return (
    <div className="controls">
      {CONTROLS.map(([k, v]) => (
        <div key={k} className="control-row">
          <kbd>{k}</kbd>
          <span>{v}</span>
        </div>
      ))}
    </div>
  );
}

export function MainMenu({ onStart }: { onStart: (o: GameOptions) => void }) {
  const started = useHud((s) => s.started);
  const paused = useHud((s) => s.paused);
  const game = useGame();
  const [team, setTeam] = useState<Team>('CT');
  const [pistol, setPistol] = useState(true);
  const [sens, setSens] = useState(1);
  const [vol, setVol] = useState(0.7);

  if (started && !paused) return null;

  if (started && paused) {
    return (
      <div className="menu-backdrop" onClick={() => game.requestLock()}>
        <div className="menu-card pause" onClick={(e) => e.stopPropagation()}>
          <h2>已暂停</h2>
          <p className="muted">单机原型：释放鼠标时模拟暂停。</p>
          <div className="settings">
            <label>
              鼠标灵敏度 <b>{sens.toFixed(2)}</b>
              <input
                type="range"
                min={0.2}
                max={3}
                step={0.05}
                value={sens}
                onChange={(e) => {
                  setSens(+e.target.value);
                  game.setSensitivity(+e.target.value);
                }}
              />
            </label>
            <label>
              音量 <b>{Math.round(vol * 100)}%</b>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={vol}
                onChange={(e) => {
                  setVol(+e.target.value);
                  game.setVolume(+e.target.value);
                }}
              />
            </label>
          </div>
          <button className="btn primary" onClick={() => game.requestLock()}>
            继续游戏
          </button>
          <ControlsList />
        </div>
      </div>
    );
  }

  return (
    <div className="menu-backdrop">
      <div className="menu-card">
        <div className="title">
          <span className="title-main">DUST II</span>
          <span className="title-sub">5v5 · 程序化生成 FPS 原型</span>
        </div>
        <div className="team-pick">
          <button className={`team-btn ct ${team === 'CT' ? 'active' : ''}`} onClick={() => setTeam('CT')}>
            <span className="team-name">反恐精英</span>
            <span className="team-desc">CT · USP-S / M4A4 · 防守 A/B 点</span>
          </button>
          <button className={`team-btn t ${team === 'T' ? 'active' : ''}`} onClick={() => setTeam('T')}>
            <span className="team-name">恐怖分子</span>
            <span className="team-desc">T · Glock-18 / AK-47 · 安放 C4</span>
          </button>
        </div>
        <div className="settings">
          <label className="check">
            <input type="checkbox" checked={pistol} onChange={(e) => setPistol(e.target.checked)} />
            第一回合为手枪局（全员默认手枪、无护甲）
          </label>
          <label>
            鼠标灵敏度 <b>{sens.toFixed(2)}</b>
            <input type="range" min={0.2} max={3} step={0.05} value={sens} onChange={(e) => setSens(+e.target.value)} />
          </label>
          <label>
            音量 <b>{Math.round(vol * 100)}%</b>
            <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(+e.target.value)} />
          </label>
        </div>
        <div className="menu-actions">
          <button className="btn primary" onClick={() => onStart({ team, pistolStart: pistol, sensitivity: sens, volume: vol, demo: false })}>
            开始游戏
          </button>
          <button className="btn" onClick={() => onStart({ team, pistolStart: pistol, sensitivity: sens, volume: vol, demo: true })}>
            观战模式（10 AI）
          </button>
        </div>
        <ControlsList />
        <p className="muted small">先到 8 胜者赢得比赛。所有模型、贴图与音效均由代码实时生成。</p>
      </div>
    </div>
  );
}
