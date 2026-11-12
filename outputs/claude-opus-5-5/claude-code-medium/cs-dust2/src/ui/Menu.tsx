import { useState } from 'react';
import type { Difficulty } from '../game/core/constants.ts';
import type { Team } from '../game/core/entity.ts';
import type { GameOptions } from '../game/client/Game.ts';

interface Props {
  onStart: (o: GameOptions) => void;
}

function Choice<T extends string | number | boolean>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { v: T; label: string; cls?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="menu-row">
      <div className="menu-label">{label}</div>
      <div className="menu-choices">
        {options.map((o) => (
          <button key={String(o.v)} className={`chip ${o.cls ?? ''} ${o.v === value ? 'active' : ''}`} onClick={() => onChange(o.v)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Menu({ onStart }: Props) {
  const [team, setTeam] = useState<Team>('CT');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [pistolStart, setPistolStart] = useState(true);
  const [wins, setWins] = useState(8);
  const [sens, setSens] = useState(1);
  const [vol, setVol] = useState(0.7);

  return (
    <div className="menu">
      <div className="menu-card">
        <h1>
          SANDSTONE <span>STRIKE</span>
        </h1>
        <p className="menu-sub">5v5 爆破模式 · 原创沙漠地图「Sandstone」· 纯代码生成的模型与音效</p>

        <Choice
          label="阵营"
          value={team}
          onChange={setTeam}
          options={[
            { v: 'CT', label: 'CT 反恐精英（防守）', cls: 'ct' },
            { v: 'T', label: 'T 恐怖分子（进攻）', cls: 't' },
          ]}
        />
        <Choice
          label="AI 难度"
          value={difficulty}
          onChange={setDifficulty}
          options={[
            { v: 'easy', label: '简单' },
            { v: 'normal', label: '普通' },
            { v: 'hard', label: '困难' },
          ]}
        />
        <Choice
          label="首回合"
          value={pistolStart}
          onChange={setPistolStart}
          options={[
            { v: true, label: '手枪局（标准）' },
            { v: false, label: '直接长枪局' },
          ]}
        />
        <Choice
          label="获胜回合数"
          value={wins}
          onChange={setWins}
          options={[
            { v: 5, label: '5' },
            { v: 8, label: '8' },
            { v: 13, label: '13' },
          ]}
        />
        <div className="menu-row">
          <div className="menu-label">鼠标灵敏度 {sens.toFixed(2)}</div>
          <input type="range" min={0.2} max={3} step={0.05} value={sens} onChange={(e) => setSens(Number(e.target.value))} />
        </div>
        <div className="menu-row">
          <div className="menu-label">音量 {Math.round(vol * 100)}%</div>
          <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(Number(e.target.value))} />
        </div>

        <button
          className="start-btn"
          onClick={() =>
            onStart({ team, difficulty, pistolStart, winsToMatch: wins, sensitivity: sens, volume: vol, playerName: '你' })
          }
        >
          开始游戏
        </button>

        <div className="controls">
          <div><b>WASD</b> 移动 · <b>Shift</b> 静步 · <b>空格</b> 跳跃</div>
          <div><b>左键</b> 开火 · <b>右键</b> AWP 开镜 / 匕首重击 · <b>R</b> 换弹</div>
          <div><b>1/2/3</b>、<b>滚轮</b>、<b>Q</b> 切换 主武器 / 副武器 / 近战</div>
          <div><b>E</b>（按住）安放 / 拆除 C4 · <b>B</b> 武器选择 · <b>Tab</b> 计分板</div>
          <div>阵亡后：<b>左/右键</b> 切换队友视角，<b>E</b> 接管该队友</div>
        </div>
      </div>
    </div>
  );
}
