import type { Team } from '../game/types';
import type { WeaponId } from '../game/weapons';
import { WEAPONS } from '../game/weapons';

export interface LoadoutPrefs {
  primary: WeaponId | null;
  secondary: WeaponId;
}

interface Props {
  team: Team;
  prefs: LoadoutPrefs;
  onTeam: (t: Team) => void;
  onPrefs: (p: LoadoutPrefs) => void;
  onStart: () => void;
  title?: string;
  buttonLabel?: string;
}

const PRIMARY_CHOICES: { id: WeaponId | null; name: string; desc: string }[] = [
  { id: 'ak47', name: 'AK-47', desc: '高伤害 · 后坐力剧烈' },
  { id: 'm4a4', name: 'M4A4', desc: '低后坐力 · 高射速' },
  { id: 'awp', name: 'AWP', desc: '单发致命 · 右键开镜' },
  { id: null, name: '不带主武器', desc: '只用手枪' },
];

const SECONDARY_CHOICES: { id: WeaponId; name: string; desc: string }[] = [
  { id: 'deagle', name: '沙鹰', desc: '高伤害 · 7 发' },
  { id: 'usp', name: 'USP-S', desc: 'CT 默认 · 12 发' },
  { id: 'glock', name: 'Glock', desc: 'T 默认 · 20 发' },
];

export function StartScreen({ team, prefs, onTeam, onPrefs, onStart, title, buttonLabel }: Props) {
  return (
    <div className="start-screen">
      <div className="start-card">
        <h1>DUST2 · 5v5</h1>
        <div className="sub">
          程序化生成的 3D 第一人称射击原型 — 地图、角色、武器、音效全部由代码生成，无任何外部资源文件
        </div>

        <div className="section">
          <div className="label">选择阵营</div>
          <div className="choice-row">
            <button
              className={`choice team-ct${team === 'CT' ? ' active' : ''}`}
              onClick={() => onTeam('CT')}
            >
              <span className="n">反恐精英 · CT</span>
              <span className="d">防守 A / B 点，阻止下包并拆弹。默认武器 USP-S。</span>
            </button>
            <button
              className={`choice team-t${team === 'T' ? ' active' : ''}`}
              onClick={() => onTeam('T')}
            >
              <span className="n">恐怖分子 · T</span>
              <span className="d">携带 C4 进攻 A 或 B 点并安放。默认武器 Glock-18。</span>
            </button>
          </div>
        </div>

        <div className="section">
          <div className="label">主武器（长枪局生效）</div>
          <div className="choice-row">
            {PRIMARY_CHOICES.map((w) => (
              <button
                key={w.id ?? 'none'}
                className={`choice${prefs.primary === w.id ? ' active' : ''}`}
                onClick={() => onPrefs({ ...prefs, primary: w.id })}
              >
                <span className="n">{w.name}</span>
                <span className="d">{w.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="label">副武器（长枪局生效）</div>
          <div className="choice-row">
            {SECONDARY_CHOICES.map((w) => (
              <button
                key={w.id}
                className={`choice${prefs.secondary === w.id ? ' active' : ''}`}
                onClick={() => onPrefs({ ...prefs, secondary: w.id })}
              >
                <span className="n">{w.name}</span>
                <span className="d">{w.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="label">操作</div>
          <div className="keys">
            <div><b>WASD</b> 移动</div>
            <div><b>鼠标</b> 转视角</div>
            <div><b>空格</b> 跳跃</div>
            <div><b>左键</b> 开火</div>
            <div><b>右键</b> AWP 开镜</div>
            <div><b>R</b> 换弹</div>
            <div><b>Shift</b> 慢走</div>
            <div><b>E</b> 下包 / 拆包</div>
            <div><b>1 / 2 / 3</b> 主 / 副 / 刀</div>
            <div><b>Tab</b> 计分板</div>
            <div><b>Esc</b> 暂停</div>
            <div><b>滚轮 + F</b> 观战接管</div>
          </div>
        </div>

        <div className="section" style={{ marginBottom: 10 }}>
          <div className="label">规则</div>
          <div style={{ fontSize: 12, color: 'var(--dim)', lineHeight: 1.8 }}>
            第 1 回合为<b style={{ color: 'var(--text)' }}>手枪局</b>：全员只有默认手枪且无护甲。
            之后每回合为长枪局（护甲 100）。T 清空 CT 或 C4 爆炸 → T 胜；
            CT 清空 T 或成功拆包或时间耗尽 → CT 胜。你阵亡后可观战队友，按 <b style={{ color: 'var(--text)' }}>F</b> 接管操控。
          </div>
        </div>

        <button className="start-btn" onClick={onStart}>
          {buttonLabel ?? '点击进入战场'}
        </button>
        {title ? null : (
          <div style={{ fontSize: 11, color: 'var(--dim)', textAlign: 'center', marginTop: 10 }}>
            共 10 人：你 + 4 名 AI 队友 vs 5 名 AI 敌人 · 武器库 {Object.keys(WEAPONS).length} 种
          </div>
        )}
      </div>
    </div>
  );
}
