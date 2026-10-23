import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Game } from './game/engine';
import { WEAPONS } from './game/weapons';
import type { GameSnapshot, Team, WeaponId, WeaponSlot } from './game/types';

type GameMode = 'pistol' | 'rifle';

interface MinimapShape {
  x: number;
  z: number;
  width: number;
  depth: number;
  kind: string;
}

const SLOT_ORDER: Array<{ slot: WeaponSlot; key: string; label: string }> = [
  { slot: 'primary', key: '1', label: '主武器' },
  { slot: 'secondary', key: '2', label: '副武器' },
  { slot: 'knife', key: '3', label: '近战' },
];

const GUIDE_ITEMS = [
  ['WASD', '战术移动'],
  ['左 / 右键', '射击 / 瞄准'],
  ['R', '更换弹匣'],
  ['E', '安放 / 拆除'],
  ['1 / 2 / 3', '切换武器'],
  ['B / N', '购买时段换枪'],
  ['F', '死亡接管队友'],
  ['TAB', '按住记分板'],
  ['ESC', '暂停行动'],
  ['M', '切换静音'],
] as const;

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function formatTime(value: number) {
  const seconds = Math.max(0, Math.ceil(Number.isFinite(value) ? value : 0));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function TeamMark({ team }: { team: Team }) {
  if (team === 'CT') {
    return (
      <svg className="team-mark" viewBox="0 0 32 36" aria-hidden="true">
        <path d="M16 2 29 7v10c0 8.4-5.2 14.1-13 17C8.2 31.1 3 25.4 3 17V7L16 2Z" />
        <path d="M10 12h12M16 9v15M11 24l5-4 5 4" />
      </svg>
    );
  }
  return (
    <svg className="team-mark" viewBox="0 0 32 36" aria-hidden="true">
      <path d="m16 2 13 7-5 18-8 7-8-7L3 9l13-7Z" />
      <path d="m9 11 7 4 7-4M16 15v11M11 26l5-5 5 5" />
    </svg>
  );
}

function HealthIcon() {
  return (
    <svg className="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.5S3.5 15.7 3.5 9.3A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.5 3.2c0 6.4-8.5 11.2-8.5 11.2Z" />
      <path d="M12 8v6M9 11h6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2.5 8 3v6.2c0 5.1-3.2 8.5-8 10.8-4.8-2.3-8-5.7-8-10.8V5.5l8-3Z" />
    </svg>
  );
}

function BombIcon() {
  return (
    <svg className="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="7" width="14" height="13" rx="2" />
      <path d="M9 7V4h6v3M9 11h6M9 15h4M16 4l2-2M18 6l2-2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg className="hud-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {muted ? <path d="m17 9 5 6M22 9l-5 6" /> : <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="button-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M14 6l6 6-6 6" />
    </svg>
  );
}

function HeadshotIcon() {
  return (
    <svg className="headshot-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="6" />
      <circle cx="10" cy="10" r="1.5" />
      <path d="M10 0v5M10 15v5M0 10h5M15 10h5" />
    </svg>
  );
}

function WeaponGlyph({ id }: { id: WeaponId }) {
  const slot = WEAPONS[id].slot;
  return (
    <svg className="weapon-glyph" viewBox="0 0 160 48" aria-hidden="true">
      {slot === 'knife' ? (
        <>
          <path d="m17 34 22-8 67-17 31 1-26 13-65 13-15 7Z" />
          <path d="m39 26 7 10M31 28l8 12" />
        </>
      ) : slot === 'secondary' ? (
        <>
          <path d="M29 14h80l22 7-5 8H78l-8 6H48l-4-6H29Z" />
          <path d="m75 34 18 1-5 12H72l-7-5M110 14V9h13v5" />
          <path d="M43 19h55" />
        </>
      ) : (
        <>
          <path d="M8 17h95l25 5 25 1v5h-34l-15 7H83l-9-6H47l-13 8H17l8-15H8Z" />
          <path d="m77 34 22 1-7 13H78l-9-7M49 14V9h32v5M119 22v13" />
          {id === 'awp' && <><path d="M42 8h54" /><circle cx="61" cy="8" r="5" /><path d="M145 18v15" /></>}
        </>
      )}
    </svg>
  );
}

function MenuScreen({
  team,
  mode,
  onTeam,
  onMode,
  onStart,
}: {
  team: Team;
  mode: GameMode;
  onTeam: (team: Team) => void;
  onMode: (mode: GameMode) => void;
  onStart: () => void;
}) {
  return (
    <section className="menu-screen" aria-label="主菜单">
      <div className="menu-grid" />
      <div className="menu-build"><span /> LOCAL SIMULATION <b>READY</b></div>
      <div className="menu-content">
        <header className="menu-header">
          <div className="eyebrow"><span>DP—01</span> TACTICAL COMBAT SIMULATION</div>
          <h1>DUST <em>//</em> PROTOCOL</h1>
          <p>沙尘遮蔽视野，纪律决定胜负。组建五人小队，执行精确突破。</p>
        </header>

        <div className="menu-section-heading"><span>01</span> 选择作战阵营 <small>5 V 5</small></div>
        <div className="team-options" role="group" aria-label="作战阵营">
          {(['T', 'CT'] as Team[]).map((option) => (
            <button
              type="button"
              key={option}
              className={`team-option ${option.toLowerCase()} ${team === option ? 'selected' : ''}`}
              onClick={() => onTeam(option)}
              aria-pressed={team === option}
            >
              <TeamMark team={option} />
              <span className="option-copy">
                <strong>{option === 'T' ? 'T 阵营' : 'CT 阵营'}</strong>
                <small>{option === 'T' ? '突破防线 · 安放 C4' : '固守目标 · 拆除 C4'}</small>
              </span>
              <span className="option-check" />
            </button>
          ))}
        </div>

        <div className="menu-section-heading"><span>02</span> 选择行动协议</div>
        <div className="mode-options" role="group" aria-label="行动模式">
          <button type="button" className={mode === 'pistol' ? 'selected' : ''} onClick={() => onMode('pistol')} aria-pressed={mode === 'pistol'}>
            <span><strong>手枪局</strong><small>STANDARD OPENING</small></span>
            <b>标准</b>
          </button>
          <button type="button" className={mode === 'rifle' ? 'selected' : ''} onClick={() => onMode('rifle')} aria-pressed={mode === 'rifle'}>
            <span><strong>步枪训练</strong><small>WEAPON TRAINING</small></span>
            <b>全武器</b>
          </button>
        </div>
        <p className="mode-description">
          {mode === 'pistol' ? '重置比分，无护甲手枪开局；后续回合自动配备主武器。' : '全武器训练配置，直接进入步枪作战与弹道演练。'}
        </p>

        <button type="button" className="deploy-button" onClick={onStart}>
          <span><small>CONFIRM LOADOUT</small>进入行动</span>
          <ArrowIcon />
        </button>

        <div className="guide-heading">操作指南 <span>FIELD MANUAL</span></div>
        <div className="controls-guide">
          {GUIDE_ITEMS.map(([key, label]) => (
            <div className="guide-item" key={key}><kbd>{key}</kbd><span>{label}</span></div>
          ))}
        </div>

        <footer className="menu-tags">
          <span>100% PROCEDURAL</span><span>NO EXTERNAL ASSETS</span><span>LOCAL 5V5</span>
        </footer>
      </div>
      <div className="menu-coordinate">DUST2 // 96 × 92<br />TACTICAL ENVIRONMENT</div>
    </section>
  );
}

function Minimap({ snapshot, shapes }: { snapshot: GameSnapshot; shapes: MinimapShape[] }) {
  const visibleEnemies = new Set(snapshot.visibleEnemies);
  const focusedPlayerId = snapshot.spectatorId ?? snapshot.controlledId;
  const bomb = snapshot.bomb;
  const showBomb = bomb.visiblePosition && (bomb.status === 'carried' || bomb.status === 'dropped' || bomb.status === 'planted');

  return (
    <div className="minimap-panel">
      <div className="minimap-heading"><strong>DUST2</strong><span>战术地图</span></div>
      <svg className="minimap" viewBox="-48 -46 96 92" role="img" aria-label="战术小地图">
        <rect className="map-ground" x="-48" y="-46" width="96" height="92" />
        <path className="map-grid-lines" d="M-24-46V46M0-46V46M24-46V46M-48-23H48M-48 0H48M-48 23H48" />
        <rect className="bomb-site site-a" x="20" y="18" width="24" height="20" />
        <rect className="bomb-site site-b" x="-43" y="17" width="19" height="18" />
        {shapes.map((shape, index) => (
          <rect
            key={`${shape.kind}-${index}`}
            className={`map-shape map-shape-${shape.kind}`}
            x={shape.x}
            y={-shape.z - shape.depth}
            width={shape.width}
            height={shape.depth}
          />
        ))}
        <g className="map-labels" textAnchor="middle">
          <text className="site-label" x="32" y="30">A</text>
          <text className="site-label" x="-33.5" y="28">B</text>
          <text x="0" y="-38">T</text>
          <text x="1" y="39">CT</text>
          <text className="mid-label" x="0" y="3">MID</text>
        </g>
        {snapshot.players.filter((player) => player.alive && player.team === snapshot.team && player.id !== focusedPlayerId).map((player) => (
          <g className="map-teammate" key={player.id} transform={`translate(${player.x} ${-player.z})`}>
            <circle className="unit-ring" r="2.2" />
            <circle r="1.25" />
          </g>
        ))}
        {snapshot.players.filter((player) => player.alive && player.team !== snapshot.team && visibleEnemies.has(player.id)).map((player) => (
          <g className="map-enemy" key={player.id} transform={`translate(${player.x} ${-player.z})`}>
            <circle className="unit-ring" r="2.35" />
            <circle r="1.4" />
          </g>
        ))}
        {showBomb && (
          <g className={`map-bomb ${bomb.status}`} transform={`translate(${bomb.x} ${-bomb.z})`}>
            <circle className="bomb-pulse" r="3.2" />
            <circle r="1.55" />
          </g>
        )}
        <g className="map-self" transform={`translate(${snapshot.position.x} ${-snapshot.position.z}) rotate(${snapshot.yaw * 180 / Math.PI})`}>
          <path d="M0 2.2-1.65-1.55 0-.7 1.65-1.55Z" />
        </g>
      </svg>
      <div className="minimap-footer"><span>T ↑</span><i /> <span>CT ↓</span></div>
    </div>
  );
}

function Scoreboard({ snapshot }: { snapshot: GameSnapshot }) {
  return (
    <div className="scoreboard-layer">
      <section className="scoreboard" aria-label="回合记分板">
        <header className="scoreboard-header">
          <div><small>TACTICAL SIMULATION</small><strong>DUST // PROTOCOL</strong></div>
          <span>第 {snapshot.round} 回合</span>
        </header>
        {(['CT', 'T'] as Team[]).map((team) => {
          const players = snapshot.players
            .filter((player) => player.team === team)
            .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths || a.id - b.id);
          return (
            <div className={`scoreboard-team ${team.toLowerCase()}`} key={team}>
              <div className="scoreboard-team-title">
                <span><TeamMark team={team} />{team} 阵营</span>
                <strong>{snapshot.score[team]}</strong>
              </div>
              <div className="score-row score-columns"><span>作战人员</span><span>击杀</span><span>死亡</span><span>K/D</span><span>状态</span></div>
              {players.map((player) => (
                <div className={`score-row ${player.controlled || player.id === snapshot.controlledId ? 'controlled' : ''} ${player.alive ? '' : 'dead'}`} key={player.id}>
                  <span className="score-player"><i />{player.name}{player.hasBomb && <b>C4</b>}</span>
                  <span>{player.kills}</span>
                  <span>{player.deaths}</span>
                  <span>{(player.kills / Math.max(1, player.deaths)).toFixed(2)}</span>
                  <span>{player.alive ? '存活' : '阵亡'}</span>
                </div>
              ))}
            </div>
          );
        })}
        <footer className="scoreboard-footer"><kbd>TAB</kbd> 松开关闭记分板 <span>{snapshot.location}</span></footer>
      </section>
    </div>
  );
}

function bombStatusText(snapshot: GameSnapshot) {
  const bomb = snapshot.bomb;
  if (bomb.status === 'carried') return bomb.carrierId === snapshot.controlledId ? '你携带 C4' : 'C4 携带中';
  if (bomb.status === 'dropped') return 'C4 已掉落';
  if (bomb.status === 'planted') return `C4 已安放${bomb.site ? ` · ${bomb.site} 点` : ''}`;
  if (bomb.status === 'defused') return 'C4 已拆除';
  return 'C4 已引爆';
}

function ScopeOverlay() {
  return (
    <div className="scope-overlay">
      <div className="scope-lens">
        <i className="scope-line horizontal left" /><i className="scope-line horizontal right" />
        <i className="scope-line vertical top" /><i className="scope-line vertical bottom" />
        <span className="scope-center" />
      </div>
    </div>
  );
}

function GameHud({
  snapshot,
  shapes,
  showScoreboard,
  onCycleSpectator,
  onToggleMute,
  onResume,
}: {
  snapshot: GameSnapshot;
  shapes: MinimapShape[];
  showScoreboard: boolean;
  onCycleSpectator: () => void;
  onToggleMute: () => void;
  onResume: () => void;
}) {
  const ctAlive = snapshot.players.filter((player) => player.team === 'CT' && player.alive).length;
  const tAlive = snapshot.players.filter((player) => player.team === 'T' && player.alive).length;
  const spectator = snapshot.players.find((player) => player.id === snapshot.spectatorId) ?? null;
  const crosshairStyle = { '--spread': `${5 + Math.min(28, Math.max(0, snapshot.spread) * 1200)}px` } as CSSProperties;
  const reloadProgress = clampPercent(snapshot.weapon.reloadProgress * 100);
  const interactionProgress = snapshot.interaction ? clampPercent(snapshot.interaction.progress * 100) : 0;

  return (
    <>
      {snapshot.scoped && snapshot.alive && <ScopeOverlay />}
      {snapshot.damageAt > 0 && <div className="damage-vignette" key={snapshot.damageAt} />}

      <div className="hud-layer">
        <Minimap snapshot={snapshot} shapes={shapes} />

        <div className="match-strip">
          <div className="match-team ct">
            <div><strong>CT</strong><span>{ctAlive} 存活</span></div>
            <b>{snapshot.score.CT}</b>
            <div className="alive-pips">{snapshot.players.filter((player) => player.team === 'CT').map((player) => <i className={player.alive ? 'alive' : ''} key={player.id} />)}</div>
          </div>
          <div className={`match-clock ${snapshot.roundTime <= 10 ? 'urgent' : ''}`}>
            <span>ROUND {String(snapshot.round).padStart(2, '0')}</span>
            <time>{formatTime(snapshot.roundTime)}</time>
          </div>
          <div className="match-team t">
            <b>{snapshot.score.T}</b>
            <div><strong>T</strong><span>{tAlive} 存活</span></div>
            <div className="alive-pips">{snapshot.players.filter((player) => player.team === 'T').map((player) => <i className={player.alive ? 'alive' : ''} key={player.id} />)}</div>
          </div>
        </div>
        {snapshot.bomb.status === 'planted' && (
          <div className="bomb-countdown"><BombIcon /><span>{snapshot.bomb.site ? `${snapshot.bomb.site} 点` : 'C4'}</span><strong>{snapshot.bomb.timer.toFixed(1)}</strong></div>
        )}

        <button type="button" className="mute-button" onClick={onToggleMute} aria-label={snapshot.muted ? '取消静音' : '静音'}>
          <VolumeIcon muted={snapshot.muted} /><kbd>M</kbd>
        </button>
        <div className="killfeed" aria-label="击杀信息">
          {snapshot.killfeed.slice(-5).reverse().map((item) => (
            <div className="killfeed-item" key={item.id}>
              <span className={item.killerTeam.toLowerCase()}>{item.killer}</span>
              <div>{item.headshot && <HeadshotIcon />}<b>{WEAPONS[item.weapon].shortName}</b></div>
              <span className={item.victimTeam.toLowerCase()}>{item.victim}</span>
            </div>
          ))}
        </div>

        {snapshot.notice && snapshot.noticeAt > 0 && (
          <div className="system-notice" key={`${snapshot.noticeAt}-${snapshot.notice}`} role="status">
            <span>TACTICAL UPDATE</span>{snapshot.notice}
          </div>
        )}

        {!snapshot.scoped && snapshot.alive && (
          <div className="crosshair" style={crosshairStyle}>
            <i className="crosshair-line top" /><i className="crosshair-line right" />
            <i className="crosshair-line bottom" /><i className="crosshair-line left" />
            <span />
          </div>
        )}
        {snapshot.hitMarkerAt > 0 && snapshot.alive && (
          <div className="hit-marker" key={snapshot.hitMarkerAt}><i /><i /><i /><i /></div>
        )}

        {snapshot.interaction && (
          <div className="interaction-progress">
            <div><span>{snapshot.interaction.label}</span><b>{Math.round(interactionProgress)}%</b></div>
            <div className="progress-track"><i style={{ width: `${interactionProgress}%` }} /></div>
          </div>
        )}

        {!snapshot.alive && (
          <div className="spectator-panel">
            <span className="death-label">YOU ARE DOWN // 你已阵亡</span>
            <div className="spectator-name">
              <small>正在观战</small>
              <strong className={spectator?.team.toLowerCase() ?? ''}>{spectator?.name ?? '等待可用视角'}</strong>
            </div>
            <div className="spectator-actions">
              <button type="button" onClick={onCycleSpectator}>切换观战</button>
              <span><kbd>F</kbd> 接管存活队友</span>
            </div>
          </div>
        )}

        <div className="vitals-panel">
          <div className={`vital-row health ${snapshot.health <= 25 ? 'critical' : ''}`}>
            <HealthIcon /><span>生命</span><strong>{Math.ceil(Math.max(0, snapshot.health))}</strong>
            <div className="vital-track"><i style={{ width: `${clampPercent(snapshot.health)}%` }} /></div>
          </div>
          <div className="vital-row armor">
            <ShieldIcon /><span>护甲</span><strong>{Math.ceil(Math.max(0, snapshot.armor))}</strong>
            <div className="vital-track"><i style={{ width: `${clampPercent(snapshot.armor)}%` }} /></div>
          </div>
        </div>

        <div className="weapon-panel">
          <WeaponGlyph id={snapshot.weapon.id} />
          <div className="weapon-name"><span>{WEAPONS[snapshot.weapon.id].slot === 'primary' ? 'PRIMARY' : WEAPONS[snapshot.weapon.id].slot === 'secondary' ? 'SECONDARY' : 'MELEE'}</span><strong>{snapshot.weapon.name}</strong></div>
          {snapshot.weapon.slot === 'knife' ? (
            <div className="ammo-count melee"><strong>—</strong><span>近战武器</span></div>
          ) : (
            <div className="ammo-count"><strong>{String(snapshot.weapon.ammo).padStart(2, '0')}</strong><span>/ {snapshot.weapon.reserve}</span></div>
          )}
          {snapshot.weapon.reloading && (
            <div className="reload-progress"><div><span>更换弹匣</span><b>{Math.round(reloadProgress)}%</b></div><div className="progress-track"><i style={{ width: `${reloadProgress}%` }} /></div></div>
          )}
        </div>

        <div className="bottom-center">
          {snapshot.canBuy && snapshot.alive && <div className="buy-hint"><span>购买时段</span><kbd>B</kbd> 主武器 <kbd>N</kbd> 手枪</div>}
          <div className="location-strip">
            <span><MapPinIcon />{snapshot.location}</span>
            <i />
            <span className={`bomb-status ${snapshot.bomb.status}`}><BombIcon />{bombStatusText(snapshot)}</span>
          </div>
          <div className="weapon-slots">
            {SLOT_ORDER.map(({ slot, key, label }) => {
              const weapon = snapshot.weapons[slot];
              return (
                <div className={`weapon-slot ${snapshot.weapon.slot === slot ? 'active' : ''}`} key={slot}>
                  <kbd>{key}</kbd>
                  <span><small>{label}</small><strong>{weapon ? WEAPONS[weapon.id].shortName : '—'}</strong></span>
                  {weapon && slot !== 'knife' && <b>{weapon.ammo}</b>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showScoreboard && <Scoreboard snapshot={snapshot} />}
      {snapshot.paused && (
        <div className="modal-layer pause-layer">
          <section className="pause-panel">
            <small>SIMULATION SUSPENDED</small>
            <h2>行动已暂停</h2>
            <p>战术状态已保留。准备好后返回战场。</p>
            <button type="button" className="primary-button" onClick={onResume}><span>继续行动</span><ArrowIcon /></button>
            <div className="modal-shortcut"><kbd>ESC</kbd> 也可继续</div>
          </section>
        </div>
      )}
    </>
  );
}

function RoundEndScreen({ snapshot, onNextRound, onRestart }: { snapshot: GameSnapshot; onNextRound: () => void; onRestart: () => void }) {
  const winner = snapshot.roundWinner;
  return (
    <div className="modal-layer round-end-layer">
      <section className={`round-end-panel ${winner?.toLowerCase() ?? 'draw'}`}>
        <div className="round-end-kicker">ROUND {String(snapshot.round).padStart(2, '0')} // COMPLETE</div>
        {winner ? <TeamMark team={winner} /> : <div className="draw-mark">//</div>}
        <h2>{winner ? `${winner} 阵营获胜` : '回合结束'}</h2>
        <p>{snapshot.roundReason || '回合目标已完成'}</p>
        <div className="round-end-score"><span>CT <b>{snapshot.score.CT}</b></span><i>:</i><span><b>{snapshot.score.T}</b> T</span></div>
        <div className="round-end-actions">
          <button type="button" className="primary-button" onClick={onNextRound}><span>下一回合</span><ArrowIcon /></button>
          <button type="button" className="secondary-button" onClick={onRestart}>重新手枪局</button>
        </div>
        <small className="round-end-note">下一回合将配备主武器</small>
      </section>
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [minimapShapes, setMinimapShapes] = useState<MinimapShape[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team>('CT');
  const [selectedMode, setSelectedMode] = useState<GameMode>('pistol');
  const [scoreboardHeld, setScoreboardHeld] = useState(false);
  const phase = snapshot?.phase ?? 'menu';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let active = true;
    const game = new Game(container, (nextSnapshot: GameSnapshot) => {
      if (active) setSnapshot(nextSnapshot);
    });
    gameRef.current = game;
    setMinimapShapes(game.getMinimapShapes());
    return () => {
      active = false;
      if (gameRef.current === game) gameRef.current = null;
      game.dispose();
    };
  }, []);

  useEffect(() => {
    const releaseScoreboard = () => setScoreboardHeld(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Tab' || phase !== 'playing') return;
      event.preventDefault();
      setScoreboardHeld(true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Tab') return;
      if (phase === 'playing') event.preventDefault();
      releaseScoreboard();
    };
    const onVisibilityChange = () => {
      if (document.hidden) releaseScoreboard();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseScoreboard);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseScoreboard);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      releaseScoreboard();
    };
  }, [phase]);

  const restartPistol = () => {
    if (!snapshot) return;
    setSelectedTeam(snapshot.team);
    setSelectedMode('pistol');
    gameRef.current?.start(snapshot.team, 'pistol');
  };

  const menuVisible = !snapshot || snapshot.phase === 'menu';

  return (
    <main className="app-shell">
      <div className="game-viewport" ref={containerRef} aria-label="DUST PROTOCOL 三维游戏画面" />
      <div className="game-ui">
        {menuVisible ? (
          <MenuScreen
            team={selectedTeam}
            mode={selectedMode}
            onTeam={setSelectedTeam}
            onMode={setSelectedMode}
            onStart={() => gameRef.current?.start(selectedTeam, selectedMode)}
          />
        ) : snapshot.phase === 'playing' ? (
          <GameHud
            snapshot={snapshot}
            shapes={minimapShapes}
            showScoreboard={scoreboardHeld}
            onCycleSpectator={() => gameRef.current?.cycleSpectator()}
            onToggleMute={() => gameRef.current?.toggleMute()}
            onResume={() => gameRef.current?.resume()}
          />
        ) : (
          <RoundEndScreen
            snapshot={snapshot}
            onNextRound={() => gameRef.current?.nextRound()}
            onRestart={restartPistol}
          />
        )}
      </div>
    </main>
  );
}
