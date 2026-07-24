import { useState } from 'react';
import type { Team } from '../game/actor.ts';

export interface MatchConfig {
  team: Team;
  pistolOnly: boolean;
  botSkill: number;
  sensitivity: number;
  fov: number;
  shadows: boolean;
  volume: number;
  name: string;
}

const DIFFICULTY = [
  { label: '简单', value: 0.3 },
  { label: '普通', value: 0.55 },
  { label: '困难', value: 0.75 },
  { label: '专家', value: 0.9 },
];

export function MainMenu({ onStart }: { onStart: (c: MatchConfig) => void }) {
  const [team, setTeam] = useState<Team>('CT');
  const [pistolOnly, setPistolOnly] = useState(false);
  const [skill, setSkill] = useState(0.55);
  const [sens, setSens] = useState(2.2);
  const [fov, setFov] = useState(90);
  const [shadows, setShadows] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [name, setName] = useState('YOU');

  return (
    <div className="menu">
      <div className="menu-bg" />
      <div className="menu-panel">
        <div className="menu-title">
          <span className="mt-main">DUST2</span>
          <span className="mt-sub">5v5 战术射击原型 · React + three.js 程序化生成</span>
        </div>

        <div className="menu-section">选择阵营</div>
        <div className="team-picker">
          <button className={`tp ct ${team === 'CT' ? 'on' : ''}`} onClick={() => setTeam('CT')}>
            <b>反恐精英 CT</b>
            <span>防守 · 拆除炸弹</span>
          </button>
          <button className={`tp t ${team === 'T' ? 'on' : ''}`} onClick={() => setTeam('T')}>
            <b>恐怖分子 T</b>
            <span>进攻 · 安放 C4</span>
          </button>
        </div>

        <div className="menu-section">难度</div>
        <div className="diff-picker">
          {DIFFICULTY.map((d) => (
            <button
              key={d.label}
              className={skill === d.value ? 'on' : ''}
              onClick={() => setSkill(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="menu-section">选项</div>
        <label className="row check">
          <span>全程手枪局（每回合只有默认手枪）</span>
          <input
            type="checkbox"
            checked={pistolOnly}
            onChange={(e) => setPistolOnly(e.target.checked)}
          />
        </label>
        <label className="row">
          <span>昵称</span>
          <input
            className="text"
            type="text"
            maxLength={12}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="row">
          <span>鼠标灵敏度</span>
          <input
            type="range"
            min={0.4}
            max={6}
            step={0.1}
            value={sens}
            onChange={(e) => setSens(Number(e.target.value))}
          />
          <b>{sens.toFixed(1)}</b>
        </label>
        <label className="row">
          <span>视野 FOV</span>
          <input
            type="range"
            min={70}
            max={110}
            value={fov}
            onChange={(e) => setFov(Number(e.target.value))}
          />
          <b>{fov}</b>
        </label>
        <label className="row">
          <span>音量</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <b>{Math.round(volume * 100)}</b>
        </label>
        <label className="row check">
          <span>动态阴影</span>
          <input type="checkbox" checked={shadows} onChange={(e) => setShadows(e.target.checked)} />
        </label>

        <button
          className="start"
          onClick={() =>
            onStart({ team, pistolOnly, botSkill: skill, sensitivity: sens, fov, shadows, volume, name })
          }
        >
          开始比赛
        </button>

        <div className="menu-foot">
          第一回合固定为手枪局 · 先拿 16 分者获胜 · 阵亡后可观战并接管队友
        </div>
      </div>
    </div>
  );
}
