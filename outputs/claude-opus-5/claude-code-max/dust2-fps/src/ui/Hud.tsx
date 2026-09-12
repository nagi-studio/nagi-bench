import { WEAPONS } from '../game/weapons.ts';
import { Crosshair } from './Crosshair.tsx';
import { KillFeed } from './KillFeed.tsx';
import { Minimap } from './Minimap.tsx';
import { ScopeOverlay } from './ScopeOverlay.tsx';
import type { HudSnapshot } from './store.ts';

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const SLOT_KEYS: Record<string, string> = { primary: '1', secondary: '2', melee: '3' };

/** Round timer, score and how many are still standing on each side. */
function TopBar({ snap }: { snap: HudSnapshot }) {
  const bombTicking = snap.bombState === 'planted';
  return (
    <div className="topbar">
      <div className={`team-block team-ct ${snap.playerTeam === 'CT' ? 'is-you' : ''}`}>
        <span className="team-name">CT</span>
        <span className="team-score">{snap.scoreCT}</span>
        <span className="team-alive">
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={i < snap.aliveCT ? 'alive' : 'dead'} />
          ))}
        </span>
      </div>

      <div className={`round-timer ${bombTicking ? 'bomb' : ''}`}>
        <div className="timer-value">
          {bombTicking ? formatTime(snap.bombTimer) : formatTime(snap.timeLeft)}
        </div>
        <div className="timer-sub">
          {snap.phase === 'freeze'
            ? '准备阶段'
            : bombTicking
              ? `C4 已安放 · ${snap.bombSite} 点`
              : `第 ${snap.round} 回合${snap.pistolRound ? ' · 手枪局' : ''}`}
        </div>
      </div>

      <div className={`team-block team-t ${snap.playerTeam === 'T' ? 'is-you' : ''}`}>
        <span className="team-alive">
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={i < snap.aliveT ? 'alive' : 'dead'} />
          ))}
        </span>
        <span className="team-score">{snap.scoreT}</span>
        <span className="team-name">T</span>
      </div>
    </div>
  );
}

function HealthPanel({ snap }: { snap: HudSnapshot }) {
  const low = snap.health <= 35;
  return (
    <div className="panel panel-health">
      <div className={`stat ${low ? 'stat-low' : ''}`}>
        <span className="stat-icon">✚</span>
        <span className="stat-value">{snap.health}</span>
      </div>
      <div className="stat stat-armor">
        <span className="stat-icon">{snap.helmet ? '⛑' : '🛡'}</span>
        <span className="stat-value">{snap.armor}</span>
      </div>
      <div className="health-bar">
        <div className="health-bar-fill" style={{ width: `${snap.health}%` }} />
        <div className="armor-bar-fill" style={{ width: `${snap.armor}%` }} />
      </div>
    </div>
  );
}

function AmmoPanel({ snap }: { snap: HudSnapshot }) {
  const melee = snap.slot === 'melee';
  return (
    <div className="panel panel-ammo">
      <div className="weapon-name">
        {snap.weaponName}
        {snap.reloading && <span className="reloading">换弹中…</span>}
      </div>
      {!melee && (
        <div className="ammo">
          <span className={`ammo-mag ${snap.magAmmo === 0 ? 'empty' : ''}`}>{snap.magAmmo}</span>
          <span className="ammo-sep">/</span>
          <span className="ammo-reserve">{snap.reserveAmmo}</span>
        </div>
      )}
      {melee && <div className="ammo"><span className="ammo-mag">∞</span></div>}
      <div className="inventory">
        {snap.inventory.map((entry) => (
          <div
            key={entry.slot}
            className={`inv-slot ${entry.active ? 'active' : ''} ${entry.id ? '' : 'empty'}`}
          >
            <span className="inv-key">{SLOT_KEYS[entry.slot]}</span>
            <span className="inv-name">{entry.id ? WEAPONS[entry.id].name : '—'}</span>
          </div>
        ))}
      </div>
      {snap.bombCarriedByMe && <div className="bomb-badge">C4 已携带</div>}
      {snap.playerTeam === 'CT' && snap.defuseHasKit && <div className="kit-badge">拆弹器</div>}
    </div>
  );
}

function CenterPrompts({ snap }: { snap: HudSnapshot }) {
  const planting = snap.plantProgress > 0;
  const defusing = snap.defuseProgress > 0;
  const progress = planting ? snap.plantProgress : snap.defuseProgress;

  return (
    <div className="center-prompts">
      {(planting || defusing) && (
        <div className="progress-block">
          <div className="progress-label">{planting ? '正在安放 C4' : '正在拆除 C4'}</div>
          <div className="progress-track">
            <div
              className={`progress-fill ${planting ? 'plant' : 'defuse'}`}
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </div>
      )}
      {!planting && !defusing && snap.usePrompt && (
        <div className="use-prompt">
          {snap.usePrompt !== 'pickup' && <kbd>E</kbd>}
          {snap.usePrompt === 'plant' && '按住安放 C4'}
          {snap.usePrompt === 'defuse' && '按住拆除 C4'}
          {snap.usePrompt === 'pickup' && '走到 C4 上即可拾取'}
        </div>
      )}
      {snap.spectating && (
        <div className="spectate-prompt">
          <div className="spectate-title">你已阵亡</div>
          <div className="spectate-sub">
            正在观察 <b>{snap.viewName}</b> · <kbd>空格</kbd> 切换队友 · <kbd>F</kbd> 接管该队友
          </div>
        </div>
      )}
    </div>
  );
}

function RoundBanner({ snap }: { snap: HudSnapshot }) {
  if (!snap.roundResultWinner) return null;
  const won = snap.roundResultWinner === snap.playerTeam;
  return (
    <div className={`round-banner ${won ? 'win' : 'lose'}`}>
      <div className="round-banner-title">
        {snap.roundResultWinner === 'CT' ? '反恐精英获胜' : '恐怖分子获胜'}
      </div>
      <div className="round-banner-sub">{snap.roundResultReason}</div>
      {snap.matchWinner && (
        <div className="round-banner-match">
          比赛结束 · {snap.matchWinner === 'CT' ? '反恐精英' : '恐怖分子'} 赢得比赛
        </div>
      )}
    </div>
  );
}

export function Hud({ snap, fps }: { snap: HudSnapshot; fps: number }) {
  const bombWarning = snap.bombState === 'planted' && snap.bombTimer < 10;

  return (
    <div className="hud">
      {snap.damageFlash > 0 && (
        <div className="damage-vignette" style={{ opacity: Math.min(0.85, snap.damageFlash) }} />
      )}
      {bombWarning && <div className="bomb-vignette" />}

      <ScopeOverlay snap={snap} />

      <TopBar snap={snap} />
      <Minimap snap={snap} />
      <KillFeed snap={snap} />

      <Crosshair snap={snap} />
      <CenterPrompts snap={snap} />
      <RoundBanner snap={snap} />

      <HealthPanel snap={snap} />
      <AmmoPanel snap={snap} />

      <div className="fps">{fps} FPS</div>
    </div>
  );
}
