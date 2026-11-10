import type { Team } from '../sim/actor';
import type { GameMode } from '../sim/sim';
import { hud, useHud } from '../state/store';

const TEAMS: { id: Team; name: string; desc: string }[] = [
  { id: 'def', name: '守方', desc: '蓝色作战服 · 默认 USP / M4A1 · 守住 A、B 两点，拆除 C4' },
  { id: 'atk', name: '攻方', desc: '橙色夹克 · 默认 Glock / AK-47 · 携带 C4 进攻并安放' },
];

const MODES: { id: GameMode; name: string; desc: string }[] = [
  { id: 'match', name: '标准比赛', desc: '第 1 回合为手枪局，之后为步枪局，先赢 7 回合获胜' },
  { id: 'pistol', name: '纯手枪局', desc: '每回合都只有默认手枪，无护甲' },
  { id: 'rifle', name: '步枪局', desc: '全员满甲步枪开局，准备时间按 B 换装备' },
];

const DIFFS = ['简单', '普通', '困难'];

export function Menu() {
  const settings = useHud((s) => s.settings);
  const set = (patch: Partial<typeof settings>) => hud.set({ settings: { ...hud.get().settings, ...patch } });
  return (
    <div className="menu">
      <div className="menu-bg" />
      <div className="menu-card">
        <div className="menu-kicker">5 v 5 · 爆破模式 · 原创地图</div>
        <h1 className="menu-title">
          潮汐货场 <span>TIDAL YARD</span>
        </h1>
        <p className="menu-sub">
          集装箱码头上的攻防战：攻方携带 C4 经码头长廊、中路铁轨或仓库暗道推进，在 A / B 包点安放；守方清除入侵者或拆除炸弹。
        </p>

        <div className="menu-section">选择阵营</div>
        <div className="choice-row">
          {TEAMS.map((t) => (
            <button key={t.id} className={`choice ${t.id} ${settings.team === t.id ? 'sel' : ''}`} onClick={() => set({ team: t.id })}>
              <b>{t.name}</b>
              <span>{t.desc}</span>
            </button>
          ))}
        </div>

        <div className="menu-section">对局模式</div>
        <div className="choice-row three">
          {MODES.map((m) => (
            <button key={m.id} className={`choice ${settings.mode === m.id ? 'sel' : ''}`} onClick={() => set({ mode: m.id })}>
              <b>{m.name}</b>
              <span>{m.desc}</span>
            </button>
          ))}
        </div>

        <div className="menu-section">电脑难度</div>
        <div className="choice-row three">
          {DIFFS.map((d, i) => (
            <button key={d} className={`choice slim ${settings.difficulty === i ? 'sel' : ''}`} onClick={() => set({ difficulty: i })}>
              <b>{d}</b>
            </button>
          ))}
        </div>

        <button className="btn primary big start" onClick={() => hud.set({ screen: 'game' })}>
          开始对局
        </button>
        <div className="menu-foot">WASD 移动 · 鼠标瞄准 · 左键开火 · 右键开镜 · E 安放 / 拆除 C4 · Tab 计分板 · Esc 暂停</div>
      </div>
    </div>
  );
}
