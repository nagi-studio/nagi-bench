import { useState } from 'react';
import type { ClientOptions } from '../client/gameClient.ts';
import type { Team } from '../core/character.ts';
import type { Difficulty } from '../core/sim.ts';

interface Props {
  initial: ClientOptions;
  onStart: (o: ClientOptions) => void;
}

const DIFFS: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: '简单' },
  { id: 'normal', label: '普通' },
  { id: 'hard', label: '困难' },
];

export function Menu({ initial, onStart }: Props) {
  const [o, setO] = useState<ClientOptions>(initial);
  const set = <K extends keyof ClientOptions>(k: K, v: ClientOptions[K]) => setO((p) => ({ ...p, [k]: v }));

  return (
    <div className="menu">
      <div className="menu-bg" />
      <div className="menu-card">
        <div className="menu-title">
          <span className="logo">DUST</span>
          <span className="logo-2">II</span>
        </div>
        <div className="menu-sub">5v5 爆破模式 · 手枪局开局 · 先赢 8 回合获胜</div>

        <div className="menu-section">选择阵营</div>
        <div className="team-pick">
          {(['CT', 'T'] as Team[]).map((t) => (
            <button key={t} className={`team-btn ${t} ${o.team === t ? 'active' : ''}`} onClick={() => set('team', t)}>
              <div className="team-badge">{t}</div>
              <div className="team-name">{t === 'CT' ? '反恐精英' : '恐怖分子'}</div>
              <div className="team-desc">{t === 'CT' ? '防守 A/B 点 · 拆除炸弹' : '携带 C4 · 进攻并安放'}</div>
            </button>
          ))}
        </div>

        <div className="menu-row">
          <label>昵称</label>
          <input value={o.playerName} maxLength={14} onChange={(e) => set('playerName', e.target.value || 'Player')} />
        </div>
        <div className="menu-row">
          <label>电脑难度</label>
          <div className="seg">
            {DIFFS.map((d) => (
              <button key={d.id} className={o.difficulty === d.id ? 'active' : ''} onClick={() => set('difficulty', d.id)}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="menu-row">
          <label>鼠标灵敏度</label>
          <input type="range" min={0.2} max={3} step={0.05} value={o.sensitivity} onChange={(e) => set('sensitivity', Number(e.target.value))} />
          <span className="val">{o.sensitivity.toFixed(2)}</span>
        </div>
        <div className="menu-row">
          <label>音量</label>
          <input type="range" min={0} max={1} step={0.05} value={o.volume} onChange={(e) => set('volume', Number(e.target.value))} />
          <span className="val">{Math.round(o.volume * 100)}%</span>
        </div>
        <div className="menu-row">
          <label>每回合都是手枪局</label>
          <input type="checkbox" checked={o.allPistolRounds} onChange={(e) => set('allPistolRounds', e.target.checked)} />
          <span className="val dim">默认：第 1 回合手枪局，其后长枪局</span>
        </div>
        <div className="menu-row">
          <label>实时阴影</label>
          <input type="checkbox" checked={o.shadows} onChange={(e) => set('shadows', e.target.checked)} />
          <span className="val dim">低配电脑可关闭</span>
        </div>

        <button className="start-btn" onClick={() => onStart(o)}>
          开始游戏
        </button>

        <div className="controls">
          <div><kbd>W A S D</kbd> 移动</div>
          <div><kbd>Shift</kbd> 静步</div>
          <div><kbd>空格</kbd> 跳跃</div>
          <div><kbd>鼠标左键</kbd> 开火</div>
          <div><kbd>鼠标右键</kbd> AWP 开镜 / 刀重击</div>
          <div><kbd>R</kbd> 换弹</div>
          <div><kbd>1 2 3 5</kbd> 主武器 / 手枪 / 刀 / C4</div>
          <div><kbd>Q</kbd> 上一把武器 · 滚轮切换</div>
          <div><kbd>E</kbd> 安放 / 拆除 C4 · 死亡后接管队友</div>
          <div><kbd>B</kbd> 购买菜单（长枪局）</div>
          <div><kbd>Tab</kbd> 计分板</div>
          <div><kbd>Esc</kbd> 暂停</div>
        </div>
      </div>
    </div>
  );
}
