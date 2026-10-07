import { useState } from 'react';
import type { Difficulty, MatchSettings, Team } from '../game/core/types';
import { ControlsHelp } from './ControlsHelp';

interface Props {
  initial: MatchSettings;
  onStart: (s: MatchSettings) => void;
}

function Segmented<T extends string | number>(props: { value: T; options: { value: T; label: string; hint?: string }[]; onChange: (v: T) => void; tone?: (v: T) => string }) {
  return (
    <div className="segmented">
      {props.options.map((o) => (
        <button
          key={String(o.value)}
          className={`seg ${props.value === o.value ? 'active' : ''} ${props.tone ? props.tone(o.value) : ''}`}
          onClick={() => props.onChange(o.value)}
          title={o.hint}
          type="button"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function MainMenu({ initial, onStart }: Props) {
  const [s, setS] = useState<MatchSettings>(initial);
  const set = <K extends keyof MatchSettings>(k: K, v: MatchSettings[K]) => setS((p) => ({ ...p, [k]: v }));

  return (
    <div className="menu-root">
      <div className="menu-bg" />
      <div className="menu-card">
        <header className="menu-head">
          <div className="logo">
            <span className="logo-mark">DUST</span>
            <span className="logo-num">II</span>
          </div>
          <div className="logo-sub">5v5 爆破模式 · 浏览器 3D 原型</div>
          <div className="logo-meta">React 18 + TypeScript + three.js · 地图 / 角色 / 武器 / 音效 全部程序化生成</div>
        </header>

        <div className="menu-grid">
          <section className="menu-section">
            <h3>阵营</h3>
            <Segmented<Team>
              value={s.playerTeam}
              onChange={(v) => set('playerTeam', v)}
              tone={(v) => (v === 'CT' ? 'ct' : 't')}
              options={[
                { value: 'CT', label: '反恐精英 CT', hint: '防守 A/B 点，拆除炸弹' },
                { value: 'T', label: '恐怖分子 T', hint: '进攻并安放 C4' },
              ]}
            />
            <h3>开局</h3>
            <Segmented<MatchSettings['firstRound']>
              value={s.firstRound}
              onChange={(v) => set('firstRound', v)}
              options={[
                { value: 'pistol', label: '手枪局开局（标准）' },
                { value: 'rifle', label: '直接长枪局' },
              ]}
            />
            <h3>手枪局护甲</h3>
            <Segmented<MatchSettings['pistolArmor']>
              value={s.pistolArmor}
              onChange={(v) => set('pistolArmor', v)}
              options={[
                { value: 'none', label: '无护甲' },
                { value: 'kevlar', label: '防弹衣（无头盔）' },
              ]}
            />
            <h3>AI 难度</h3>
            <Segmented<Difficulty>
              value={s.difficulty}
              onChange={(v) => set('difficulty', v)}
              options={[
                { value: 'easy', label: '简单' },
                { value: 'normal', label: '普通' },
                { value: 'hard', label: '困难' },
              ]}
            />
            <h3>胜利条件</h3>
            <Segmented<number>
              value={s.roundsToWin}
              onChange={(v) => set('roundsToWin', v)}
              options={[
                { value: 5, label: '先赢 5 局' },
                { value: 8, label: '先赢 8 局' },
                { value: 13, label: '先赢 13 局' },
              ]}
            />
          </section>

          <section className="menu-section">
            <h3>玩家名称</h3>
            <input className="text-input" maxLength={12} value={s.playerName} onChange={(e) => set('playerName', e.target.value)} />
            <h3>
              鼠标灵敏度 <em>{s.sensitivity.toFixed(2)}</em>
            </h3>
            <input type="range" min={0.3} max={6} step={0.05} value={s.sensitivity} onChange={(e) => set('sensitivity', Number(e.target.value))} />
            <h3>
              音量 <em>{Math.round(s.volume * 100)}%</em>
            </h3>
            <input type="range" min={0} max={1} step={0.01} value={s.volume} onChange={(e) => set('volume', Number(e.target.value))} />
            <h3>画质</h3>
            <Segmented<MatchSettings['quality']>
              value={s.quality}
              onChange={(v) => set('quality', v)}
              options={[
                { value: 'high', label: '高（实时阴影）' },
                { value: 'low', label: '流畅（无阴影）' },
              ]}
            />
            <label className="check">
              <input type="checkbox" checked={s.showFps} onChange={(e) => set('showFps', e.target.checked)} /> 显示 FPS
            </label>
            <ControlsHelp compact />
          </section>
        </div>

        <button className="start-btn" type="button" onClick={() => onStart({ ...s, playerName: s.playerName.trim() || '玩家' })}>
          开始对战
        </button>
        <div className="menu-foot">点击开始后进入游戏，单击画面锁定鼠标 · ESC 暂停</div>
      </div>
    </div>
  );
}
