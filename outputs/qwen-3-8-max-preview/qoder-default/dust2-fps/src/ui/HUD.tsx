import React from 'react';
import { GameState, WEAPONS, WeaponId, Team } from '../game/types';

interface HUDProps {
  state: GameState;
  scopeOverlay: boolean;
}

const weaponNames: Record<WeaponId, string> = {
  ak47: 'AK-47', m4a4: 'M4A4', awp: 'AWP',
  glock: 'Glock-18', usp: 'USP-S', deagle: 'Deagle', knife: 'Knife'
};

export const HUD: React.FC<HUDProps> = ({ state, scopeOverlay }) => {
  const player = state.characters.find(c => c.id === state.playerCharacterId);
  const activeChar = player?.isAlive ? player :
    state.characters.find(c => c.id === state.spectatingId);

  if (!activeChar) return null;

  const weaponState = activeChar.weapons[activeChar.currentWeapon];
  const weaponData = weaponState ? WEAPONS[weaponState.id] : null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Crosshair */}
      {!scopeOverlay && <Crosshair spread={activeChar.recoilOffset} />}

      {/* Scope overlay */}
      {scopeOverlay && <ScopeOverlay />}

      {/* Health & Armor - bottom left */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 20, alignItems: 'flex-end' }}>
        <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#4ade80', fontSize: 14 }}>+</span>
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{Math.max(0, Math.ceil(activeChar.health))}</span>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#60a5fa', fontSize: 14 }}>🛡</span>
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{Math.ceil(activeChar.armor)}</span>
        </div>
      </div>

      {/* Ammo - bottom right */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '10px 16px', textAlign: 'right' }}>
        <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>{weaponData?.name || ''}</div>
        {weaponData && weaponData.magazineSize !== Infinity ? (
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>
            {weaponState?.ammo ?? 0} <span style={{ color: '#888', fontSize: 18 }}>/ {weaponState?.reserve ?? 0}</span>
          </div>
        ) : (
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>∞</div>
        )}
        {activeChar.isReloading && <div style={{ color: '#fbbf24', fontSize: 12, marginTop: 4 }}>RELOADING...</div>}
      </div>

      {/* Weapon slots */}
      <div style={{ position: 'absolute', bottom: 80, right: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {(['primary', 'secondary', 'melee'] as const).map((slot, i) => {
          const ws = activeChar.weapons[slot];
          if (!ws) return null;
          const isActive = activeChar.currentWeapon === slot;
          return (
            <div key={slot} style={{
              background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)',
              border: isActive ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
              borderRadius: 4, padding: '4px 10px', color: isActive ? '#fff' : '#888', fontSize: 12
            }}>
              {i + 1} {weaponNames[ws.id]}
            </div>
          );
        })}
      </div>

      {/* Kill Feed - top right */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
        {state.killFeed.slice(-5).map((entry, i) => (
          <div key={i} style={{
            background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '4px 10px',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12
          }}>
            <span style={{ color: entry.killerTeam === 'CT' ? '#60a5fa' : '#fbbf24' }}>{entry.killer}</span>
            <span style={{ color: '#888' }}>[{weaponNames[entry.weapon]}{entry.headshot ? ' ☠' : ''}]</span>
            <span style={{ color: entry.victimTeam === 'CT' ? '#60a5fa' : '#fbbf24' }}>{entry.victim}</span>
          </div>
        ))}
      </div>

      {/* Score & Round - top center */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 15 }}>
        <span style={{ color: '#60a5fa', fontSize: 20, fontWeight: 'bold' }}>{state.round.ctScore}</span>
        <span style={{ color: '#888', fontSize: 12 }}>Round {state.round.roundNumber}</span>
        <span style={{ color: '#fbbf24', fontSize: 20, fontWeight: 'bold' }}>{state.round.tScore}</span>
      </div>

      {/* C4 indicator */}
      {state.c4.planted && (
        <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', background: 'rgba(200,0,0,0.8)', borderRadius: 4, padding: '4px 12px', color: '#fff', fontSize: 14, fontWeight: 'bold', animation: 'blink 1s infinite' }}>
          💣 BOMB PLANTED
        </div>
      )}

      {/* Player has C4 */}
      {activeChar.hasC4 && (
        <div style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', background: 'rgba(200,100,0,0.8)', borderRadius: 4, padding: '4px 12px', color: '#fff', fontSize: 12 }}>
          Press F to plant (at bombsite)
        </div>
      )}

      {/* Defuse progress */}
      {state.c4.defuserId === activeChar.id && state.c4.defuseProgress > 0 && (
        <div style={{ position: 'absolute', bottom: 130, left: '50%', transform: 'translateX(-50%)', width: 200 }}>
          <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
            <div style={{ background: '#60a5fa', height: '100%', width: `${(state.c4.defuseProgress / 5) * 100}%`, transition: 'width 0.1s' }} />
          </div>
          <div style={{ color: '#fff', fontSize: 11, textAlign: 'center', marginTop: 2 }}>Defusing...</div>
        </div>
      )}

      {/* Minimap */}
      <Minimap state={state} />

      {/* Death / Spectating overlay */}
      {player && !player.isAlive && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ color: '#ff4444', fontSize: 24, fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>YOU DIED</div>
          <div style={{ color: '#ccc', fontSize: 14, marginTop: 8 }}>Spectating: {state.characters.find(c => c.id === state.spectatingId)?.name || 'N/A'}</div>
          <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Press E to switch teammate</div>
        </div>
      )}

      {/* Round end message */}
      {state.round.phase === 'roundEnd' && (
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{state.round.roundEndMessage}</div>
        </div>
      )}

      {/* Freeze time */}
      {state.round.freezeTime && state.round.phase === 'playing' && (
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: 16, background: 'rgba(0,0,0,0.5)', padding: '6px 16px', borderRadius: 4 }}>
          Freeze Time - Get Ready!
        </div>
      )}
    </div>
  );
};

const Crosshair: React.FC<{ spread: { x: number; y: number } }> = ({ spread }) => {
  const gap = 4 + Math.abs(spread.x) * 500 + Math.abs(spread.y) * 500;
  const size = 8;
  const color = '#00ff00';
  const thickness = 2;

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      {/* Top */}
      <div style={{ position: 'absolute', width: thickness, height: size, background: color, left: -thickness / 2, top: -gap - size }} />
      {/* Bottom */}
      <div style={{ position: 'absolute', width: thickness, height: size, background: color, left: -thickness / 2, top: gap }} />
      {/* Left */}
      <div style={{ position: 'absolute', width: size, height: thickness, background: color, top: -thickness / 2, left: -gap - size }} />
      {/* Right */}
      <div style={{ position: 'absolute', width: size, height: thickness, background: color, top: -thickness / 2, left: gap }} />
      {/* Center dot */}
      <div style={{ position: 'absolute', width: 2, height: 2, background: color, left: -1, top: -1 }} />
    </div>
  );
};

const ScopeOverlay: React.FC = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    {/* Black borders */}
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 30%, black 31%)' }} />
    {/* Crosshair lines */}
    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 1, background: 'rgba(0,0,0,0.8)' }} />
    <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'rgba(0,0,0,0.8)' }} />
    {/* Center dot */}
    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 3, height: 3, background: 'red', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
  </div>
);

const Minimap: React.FC<{ state: GameState }> = ({ state }) => {
  const size = 160;
  const scale = 1.4;
  const offsetX = 5;
  const offsetZ = -5;

  const toMap = (x: number, z: number) => ({
    mx: (x - offsetX) * scale + size / 2,
    my: (z - offsetZ) * scale + size / 2
  });

  const player = state.characters.find(c => c.id === state.playerCharacterId);

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, width: size, height: size, background: 'rgba(0,0,0,0.6)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
      {/* Map outline (simplified) */}
      <svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Simple map shape */}
        <rect x={toMap(-35, -35).mx} y={toMap(-35, -35).my} width={80 * scale} height={85 * scale} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        {/* A site */}
        <circle cx={toMap(28, -22).mx} cy={toMap(28, -22).my} r={6 * scale} fill="rgba(255,100,100,0.2)" stroke="rgba(255,100,100,0.4)" strokeWidth={1} />
        <text x={toMap(28, -22).mx} y={toMap(28, -22).my + 3} fill="rgba(255,100,100,0.8)" fontSize={8} textAnchor="middle">A</text>
        {/* B site */}
        <circle cx={toMap(-21, -18).mx} cy={toMap(-21, -18).my} r={6 * scale} fill="rgba(255,100,100,0.2)" stroke="rgba(255,100,100,0.4)" strokeWidth={1} />
        <text x={toMap(-21, -18).mx} y={toMap(-21, -18).my + 3} fill="rgba(255,100,100,0.8)" fontSize={8} textAnchor="middle">B</text>
      </svg>

      {/* Characters */}
      {state.characters.map(char => {
        if (!char.isAlive) return null;
        const isTeammate = player && char.team === player.team;
        const isVisible = isTeammate || true; // Show teammates always, enemies only if visible (simplified)
        if (!isVisible) return null;

        const { mx, my } = toMap(char.position.x, char.position.z);
        if (mx < 0 || mx > size || my < 0 || my > size) return null;

        const isPlayerChar = char.id === state.playerCharacterId;
        let color = '#fff';
        if (isPlayerChar) color = '#00ff00';
        else if (isTeammate) color = '#60a5fa';
        else color = '#ff4444';

        return (
          <div key={char.id} style={{
            position: 'absolute', left: mx - 2, top: my - 2,
            width: isPlayerChar ? 5 : 4, height: isPlayerChar ? 5 : 4,
            background: color, borderRadius: '50%',
            border: isPlayerChar ? '1px solid #fff' : 'none'
          }} />
        );
      })}

      {/* C4 */}
      {state.c4.planted && state.c4.plantPosition && (
        <div style={{
          position: 'absolute',
          left: toMap(state.c4.plantPosition.x, state.c4.plantPosition.z).mx - 3,
          top: toMap(state.c4.plantPosition.x, state.c4.plantPosition.z).my - 3,
          width: 6, height: 6, background: '#ff0000', borderRadius: 2,
          animation: 'blink 0.5s infinite'
        }} />
      )}
      {state.c4.carrierId !== null && !state.c4.planted && (() => {
        const carrier = state.characters.find(c => c.id === state.c4.carrierId);
        if (!carrier || !carrier.isAlive) return null;
        const { mx, my } = toMap(carrier.position.x, carrier.position.z);
        return <div style={{ position: 'absolute', left: mx - 2, top: my - 2, width: 4, height: 4, background: '#ff8800', borderRadius: 1 }} />;
      })()}
    </div>
  );
};
