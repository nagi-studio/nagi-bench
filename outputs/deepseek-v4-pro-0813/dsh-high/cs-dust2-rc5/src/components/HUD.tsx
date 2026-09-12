import { useHud } from '../hooks'

export function HUD() {
  const hud = useHud()
  const gap = Math.max(4, Math.min(60, hud.crosshairGap))

  const bombLabel =
    hud.bombState === 'planted'
      ? `C4 倒计时 ${hud.bombTimer.toFixed(1)}s`
      : hud.bombState === 'defusing'
        ? '正在拆除 C4…'
        : hud.bombState === 'carried'
          ? `C4 携带者：${hud.bombCarrier}`
          : 'C4 未安放'

  return (
    <>
      {/* scope overlay */}
      {hud.scope && (
        <div className="scope-overlay">
          <div className="scope-lens" />
          <div className="scope-cross-h" />
          <div className="scope-cross-v" />
        </div>
      )}

      {/* crosshair */}
      {!hud.scope && !hud.spectating && (
        <div className="crosshair">
          <div className="ch ch-t" style={{ transform: `translateY(${-gap}px)` }} />
          <div className="ch ch-b" style={{ transform: `translateY(${gap}px)` }} />
          <div className="ch ch-l" style={{ transform: `translateX(${-gap}px)` }} />
          <div className="ch ch-r" style={{ transform: `translateX(${gap}px)` }} />
          <div className="ch-dot" />
        </div>
      )}

      {/* top-left: score / round / bomb */}
      <div className="panel top-left">
        <div className="score-row">
          <span className={hud.team === 'CT' ? 'hl-ct' : ''}>CT {hud.scoreCT}</span>
          <span className="vs">:</span>
          <span className={hud.team === 'T' ? 'hl-t' : ''}>{hud.scoreT} T</span>
        </div>
        <div className="round-row">
          回合 {hud.round} · {hud.pistolRound ? '手枪局' : '全装备'}
        </div>
        <div className={`bomb-row bomb-${hud.bombState}`}>
          {hud.bombState === 'planted' || hud.bombState === 'defusing'
            ? `💣 ${bombLabel}`
            : hud.bombState === 'carried'
              ? `💣 由 ${hud.bombCarrier} 携带`
              : '💣 C4 未安放'}
        </div>
        {hud.roundPhase === 'freeze' && (
          <div className="freeze-row">冻结中… 即将开始</div>
        )}
      </div>

      {/* top-right: killfeed */}
      <div className="panel killfeed">
        {hud.killfeed.map((k) => (
          <div key={k.id} className="kf-row">
            <span className={k.attackerTeam === 'CT' ? 'kf-ct' : 'kf-t'}>{k.attacker}</span>
            <span className="kf-w"> [{k.weapon}{k.headshot ? ' 💀' : ''}] </span>
            <span className={k.victimTeam === 'CT' ? 'kf-ct' : 'kf-t'}>{k.victim}</span>
          </div>
        ))}
      </div>

      {/* bottom-left: health & armor */}
      <div className="panel bottom-left">
        <div className="health-row">
          <span className="hp-icon">♥</span>
          <div className="bar hp-bar"><div className="bar-fill" style={{ width: `${hud.hp}%` }} /></div>
          <span className="hp-num">{hud.hp}</span>
        </div>
        <div className="armor-row">
          <span className="armor-icon">🛡</span>
          <div className="bar armor-bar"><div className="bar-fill armor-fill" style={{ width: `${hud.armor}%` }} /></div>
          <span className="armor-num">{hud.armor}{hud.hasHelmet ? ' +盔' : ''}</span>
        </div>
      </div>

      {/* bottom-right: ammo */}
      <div className="panel bottom-right">
        <div className="weapon-name">{hud.weaponName}</div>
        {hud.weaponSlot !== 'melee' ? (
          <div className="ammo-row">
            <span className="mag">{hud.mag}</span>
            <span className="slash">/</span>
            <span className="reserve">{hud.reserve}</span>
            {hud.reloading && <span className="reload">换弹中…</span>}
          </div>
        ) : (
          <div className="ammo-row"><span className="mag">🔪</span></div>
        )}
      </div>

      {/* center hint */}
      {hud.hint && hud.roundPhase === 'live' && (
        <div className="hint">{hud.hint}</div>
      )}

      {/* round banner */}
      {hud.banner && (
        <div className="banner">
          <div className="banner-text">{hud.banner}</div>
        </div>
      )}

      {/* spectating indicator */}
      {hud.spectating && (
        <div className="spectate-indicator">
          <div>你已阵亡 — 观察 {hud.spectatedName}</div>
          <div className="small">按 E 切换队友 · 按 F 接管操控</div>
        </div>
      )}
    </>
  )
}
