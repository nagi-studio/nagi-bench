import { useState } from 'react';
import type { Team } from '../core/types.ts';
import type { MatchConfig } from '../game/engine.ts';

const KEYS: [string, string][] = [
  ['WASD', '移动'],
  ['空格', '跳跃'],
  ['Ctrl / C', '蹲下'],
  ['Shift', '静步'],
  ['鼠标左键', '开火'],
  ['鼠标右键', 'AWP 开镜'],
  ['R', '换弹'],
  ['1 / 2 / 3', '主武器 / 手枪 / 刀'],
  ['滚轮', '切换武器'],
  ['E (按住)', '安放 / 拆除 C4'],
  ['B', '购买菜单'],
  ['Tab', '记分板'],
  ['F', '阵亡后接管队友'],
  ['M', '静音'],
  ['Esc', '释放鼠标'],
];

interface SkillOption {
  label: string;
  value: number;
  desc: string;
}

const SKILLS: SkillOption[] = [
  { label: '菜鸟', value: 0.35, desc: '反应慢、枪法散' },
  { label: '普通', value: 0.62, desc: '接近真人对局' },
  { label: '高手', value: 0.85, desc: '反应快、爱打头' },
];

export function StartScreen({ onStart }: { onStart: (cfg: Partial<MatchConfig>) => void }): JSX.Element {
  const [team, setTeam] = useState<Team>('CT');
  const [pistolOnly, setPistolOnly] = useState(false);
  const [skill, setSkill] = useState(0.62);

  return (
    <div className="start">
      <div className="start-card panel">
        <h1>de_dust2</h1>
        <div className="tagline">
          5v5 第一人称射击原型 · React + TypeScript + three.js · 全程序化生成，无任何外部素材
        </div>

        <section>
          <h3>选择阵营</h3>
          <div className="choices">
            <button
              className={`choice ct${team === 'CT' ? ' sel' : ''}`}
              onClick={() => setTeam('CT')}
            >
              反恐精英 CT
              <small>默认 USP-S · 防守炸弹点 / 拆弹</small>
            </button>
            <button className={`choice t${team === 'T' ? ' sel' : ''}`} onClick={() => setTeam('T')}>
              恐怖分子 T
              <small>默认 Glock-18 · 推包安放 C4</small>
            </button>
          </div>
        </section>

        <section>
          <h3>开局模式</h3>
          <div className="choices">
            <button className={`choice${!pistolOnly ? ' sel' : ''}`} onClick={() => setPistolOnly(false)}>
              标准比赛
              <small>第 1 / 13 回合为手枪局，其余回合可购买步枪</small>
            </button>
            <button className={`choice${pistolOnly ? ' sel' : ''}`} onClick={() => setPistolOnly(true)}>
              纯手枪局
              <small>每一回合都只有默认手枪与护甲</small>
            </button>
          </div>
        </section>

        <section>
          <h3>AI 难度</h3>
          <div className="choices">
            {SKILLS.map((s) => (
              <button
                key={s.label}
                className={`choice${s.value === skill ? ' sel' : ''}`}
                onClick={() => setSkill(s.value)}
              >
                {s.label}
                <small>{s.desc}</small>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3>操作</h3>
          <div className="keys">
            {KEYS.map(([k, d]) => (
              <div key={k}>
                <kbd>{k}</kbd>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </section>

        <button
          className="play"
          onClick={() => onStart({ playerTeam: team, pistolOnly, botSkill: skill, seed: Date.now() % 100000 })}
        >
          进入战场
        </button>
      </div>
    </div>
  );
}
