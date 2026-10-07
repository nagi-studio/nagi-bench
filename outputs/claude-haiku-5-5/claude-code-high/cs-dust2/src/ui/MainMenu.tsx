import { useState } from 'react'
import { PRIMARY_CHOICES, SECONDARY_CHOICES, WEAPONS, type WeaponId } from '../game/weapons/weapons.ts'
import type { Team } from '../game/types.ts'
import type { WorldConfig } from '../game/world/gameWorld.ts'

export type MenuConfig = Omit<WorldConfig, 'winScore'>

interface Props {
  onStart: (cfg: MenuConfig) => void
}

export function MainMenu({ onStart }: Props) {
  const [team, setTeam] = useState<Team>('CT')
  const [primary, setPrimary] = useState<WeaponId>(PRIMARY_CHOICES.CT[0])
  const [secondary, setSecondary] = useState<WeaponId>(SECONDARY_CHOICES.CT[0])
  const [pistolRound, setPistolRound] = useState(true)

  const pickTeam = (t: Team) => {
    setTeam(t)
    setPrimary(PRIMARY_CHOICES[t][0])
    setSecondary(SECONDARY_CHOICES[t][0])
  }

  return (
    <div className="menu">
      <div className="menu-card">
        <h1>
          DUST <span>STRIKE</span>
        </h1>
        <p className="menu-sub">程序化生成的 Dust2 中路 · 5v5 原型（1 名玩家 + 4 名 AI 队友 对抗 5 名 AI）</p>

        <div className="menu-row">
          <label>阵营</label>
          <div className="seg">
            <button className={team === 'T' ? 'on t' : 't'} onClick={() => pickTeam('T')}>
              恐怖分子 T
            </button>
            <button className={team === 'CT' ? 'on ct' : 'ct'} onClick={() => pickTeam('CT')}>
              反恐精英 CT
            </button>
          </div>
        </div>

        <div className="menu-row">
          <label>主武器</label>
          <select value={primary} onChange={(e) => setPrimary(e.target.value as WeaponId)}>
            {PRIMARY_CHOICES[team].map((id) => (
              <option key={id} value={id}>
                {WEAPONS[id].name}
              </option>
            ))}
          </select>
        </div>

        <div className="menu-row">
          <label>副武器</label>
          <select value={secondary} onChange={(e) => setSecondary(e.target.value as WeaponId)}>
            {SECONDARY_CHOICES[team].map((id) => (
              <option key={id} value={id}>
                {WEAPONS[id].name}
              </option>
            ))}
          </select>
        </div>

        <div className="menu-row">
          <label>第一回合</label>
          <label className="check">
            <input type="checkbox" checked={pistolRound} onChange={(e) => setPistolRound(e.target.checked)} />
            手枪局（全员只带默认手枪，护甲 50）
          </label>
        </div>

        <button
          className="start"
          onClick={() => onStart({ playerTeam: team, primary, secondary, startWithPistolRound: pistolRound })}
        >
          开始比赛
        </button>

        <div className="help">
          <div>
            <kbd>W A S D</kbd> 移动 <kbd>空格</kbd> 跳跃 <kbd>鼠标</kbd> 视角 <kbd>左键</kbd> 射击
          </div>
          <div>
            <kbd>右键</kbd> 开镜 / 刀刺 <kbd>R</kbd> 换弹 <kbd>1 2 3</kbd> 切换武器 <kbd>E</kbd> 下包 / 拆包 / 开门（按住）
          </div>
          <div>
            阵亡后：<kbd>左键 / 滚轮</kbd> 切换观察队友，<kbd>F</kbd> 接管该队友操控。<kbd>ESC</kbd> 暂停。
          </div>
        </div>
      </div>
    </div>
  )
}
