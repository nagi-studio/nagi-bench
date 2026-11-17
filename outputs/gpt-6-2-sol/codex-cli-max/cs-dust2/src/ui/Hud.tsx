import type { CSSProperties } from 'react'
import { TEAM_NAMES, WEAPONS, type Team } from '../game/arsenal'
import type { HudState } from '../game/client'
import { Icon, WeaponGlyph } from './icons'
import { Radar } from './Radar'

export function Key({ children }: { children: string }) {
  return <kbd>{children}</kbd>
}

function formatClock(time: number) {
  const value = Math.ceil(time)
  return [Math.floor(value / 60), value % 60].map(n => String(n).padStart(2, '0')).join(':')
}

function TeamScore({ team, hud }: { team: Team; hud: HudState }) {
  const members = hud.roster.filter(actor => actor.team === team)
  return <div className={'team-score ' + team.toLowerCase()}>
    <div className="team-score-name"><Icon name={team === 'CT' ? 'shield' : 'strike'} size={17} /> {team}</div>
    <strong>{hud.score[team]}</strong>
    <div className="lives" aria-label={members.filter(member => member.alive).length + ' 人存活'}>
      {members.map(member => <i key={member.id} className={member.alive ? 'alive' : ''} />)}
    </div>
  </div>
}

function Scoreboard({ hud }: { hud: HudState }) {
  return <div className="scoreboard">
    <div className="scoreboard-title"><Icon name="users" size={21} /><h2>对局记分</h2><span>第 {hud.round} 回合</span></div>
    <div className="scoreboard-content">
      {(['CT', 'T'] as const).map(team => <div key={team} className={'squad ' + team.toLowerCase()}>
        <div className="squad-title"><Icon name={team === 'CT' ? 'shield' : 'strike'} size={17} /><b>{team} {TEAM_NAMES[team]}</b><strong>{hud.score[team]}</strong></div>
        <div className="squad-labels"><span>队员</span><span>击杀</span><span>阵亡</span></div>
        {hud.roster.filter(member => member.team === team).map(member =>
          <div key={member.id} className={'member' + (member.alive ? ' active' : '') + (member.id === hud.controlled ? ' self' : '')}>
            <span><i />{member.name}</span><span>{member.kills}</span><span>{member.deaths}</span>
          </div>)}
      </div>)}
    </div>
  </div>
}

export function Hud({ hud }: { hud: HudState }) {
  const bombLive = hud.bomb.state === 'planted' && hud.phase === 'live'
  const identity = hud.roster.find(member => member.id === hud.controlled)
  const canAim = hud.alive && !hud.watched
  return (
    <div className={'hud ' + hud.team.toLowerCase()}>
      {hud.hurt > 0 && <div className="hurt" style={{ opacity: hud.hurt }} />}
      <Radar hud={hud} />
      <div className="match-score" aria-label="回合时间与比分">
        <TeamScore team="CT" hud={hud} />
        <div className={'timer' + (bombLive ? ' planted' : '')}>
          <span>{bombLive ? <><Icon name="bomb" size={12} /> {hud.bomb.site} 点已下包</> : hud.phase === 'ready' ? '准备阶段' : '第 ' + hud.round + ' 回合'}</span>
          <strong>{formatClock(hud.clock)}</strong>
          {bombLive && <i className="fuse" style={{ width: clampedPercent(hud.bombProgress) }} />}
        </div>
        <TeamScore team="T" hud={hud} />
      </div>
      {hud.feed.length > 0 && <div className="killfeed" role="log" aria-label="击杀播报">
        {hud.feed.map(frag => <div className="frag" key={frag.id}>
          <b className={frag.killerTeam.toLowerCase()}>{frag.killer}</b>
          <WeaponGlyph id={frag.weapon} />
          {frag.zone === 'head' && <Icon name="reticle" size={13} />}
          <b className={frag.victimTeam.toLowerCase()}>{frag.victim}</b>
        </div>)}
      </div>}

      {hud.scoped ? <div className="scope" aria-label="AWP 瞄准镜"><div className="scope-lens"><i /><b /><em /></div></div>
        : canAim && <div className="crosshair" style={{ '--gap': hud.spread + 'px' } as CSSProperties}><i /><i /><i /><i /><b /></div>}
      {hud.hit && <div className={'hitmarker ' + hud.hit}><i /><i /><i /><i /></div>}

      {hud.phase === 'ready' && <div className="round-call">
        <span className="round-call-accent" /> <div><b>{hud.mode === 'pistol' ? '手枪局' : '标准回合'}</b><small>第 {hud.round} 回合 · {TEAM_NAMES[hud.team]}</small></div>
      </div>}
      {hud.result && <div className={'round-call round-end ' + hud.result.team.toLowerCase()}>
        <Icon name={hud.result.team === 'CT' ? 'shield' : 'strike'} size={34} />
        <div><b>{TEAM_NAMES[hud.result.team]}获胜</b><small>{hud.result.reason} · 下一回合 {Math.ceil(hud.clock)} 秒</small></div>
      </div>}

      {hud.phase === 'live' && hud.watched && <div className="spectating">
        <span><Icon name="eye" size={17} /> 观战中 <b>{hud.watched}</b></span>
        <span className="spectating-keys"><Key>←</Key><Key>→</Key> 切换 <Key>E</Key> 接管队友</span>
      </div>}
      {hud.phase === 'live' && !hud.alive && !hud.watched && <div className="spectating"><span><Icon name="skull" size={17} /> 等待下一回合</span></div>}
      {hud.phase === 'live' && hud.interaction && !hud.watched && <div className="interact">
        <div><Icon name="bomb" size={17} /><strong>{hud.interaction.kind === 'plant' ? '安放 C4' : '拆除 C4'}</strong><span>按住 <Key>E</Key></span></div>
        {hud.interaction.progress !== null && <i className="progress"><i style={{ width: clampedPercent(hud.interaction.progress) }} /></i>}
      </div>}

      <div className="vitals">
        <div className="vitals-item">
          <div className="vital-label"><Icon name="health" size={15} /> 生命</div>
          <strong className={hud.health < 26 ? 'critical' : ''}>{hud.health}</strong>
          <div className="meter health-meter"><i style={{ width: hud.health + '%' }} /></div>
        </div>
        <div className="vitals-item">
          <div className="vital-label"><Icon name="armor" size={15} /> 护甲</div>
          <strong>{hud.armor}</strong>
          <div className="meter armor-meter"><i style={{ width: hud.armor + '%' }} /></div>
        </div>
        <div className="vitals-tag"><span className="team-dot" /> {hud.team} {TEAM_NAMES[hud.team]}{hud.tookOver && ' · ' + identity?.name}</div>
      </div>

      {hud.bomb.mine && hud.alive && !hud.watched && <div className="bomb-status"><Icon name="bomb" size={18} /><b>携带 C4</b><span>前往 A / B 点</span></div>}

      <div className="weapons">
        <div className="weapon-slots" aria-label="武器槽">
          {hud.slots.map(({ slot, id }, i) => id && <div key={slot} className={id === hud.weapon ? 'equipped' : ''} aria-label={WEAPONS[id].name}><Key>{String(i + 1)}</Key><WeaponGlyph id={id} /></div>)}
        </div>
        <div className="ammo">
          <div className="ammo-weapon"><WeaponGlyph id={hud.weapon} /><span>{WEAPONS[hud.weapon].name}</span></div>
          {hud.weapon === 'knife' ? <div className="ammo-knife">近战</div>
            : <div className="ammo-count"><strong className={hud.loaded < 5 ? 'critical' : ''}>{String(hud.loaded).padStart(2, '0')}</strong><span>/</span><b>{hud.reserve}</b></div>}
          {hud.reload !== null && <i className="ammo-reload"><i style={{ width: clampedPercent(hud.reload) }} /></i>}
        </div>
      </div>
      {hud.tab && <div className="scoreboard-backdrop"><Scoreboard hud={hud} /></div>}
    </div>
  )
}

function clampedPercent(value: number) {
  return Math.max(0, Math.min(100, value * 100)) + '%'
}
