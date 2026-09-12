import { useEffect, useState } from 'react';
import { HudState } from '../store';
import { Minimap } from './Minimap';

function Crosshair({ hud }: { hud: HudState }) {
  const gap = Math.min(60, hud.spread);
  const len = 7;
  const th = 2;
  const color = 'rgba(0,255,120,0.9)';
  const line = (style: React.CSSProperties) => (
    <div style={{ position: 'absolute', background: color, ...style }} />
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }}
    >
      {line({ width: th, height: len, left: -th / 2, top: -gap - len })}
      {line({ width: th, height: len, left: -th / 2, top: gap })}
      {line({ width: len, height: th, top: -th / 2, left: -gap - len })}
      {line({ width: len, height: th, top: -th / 2, left: gap })}
      <div style={{ position: 'absolute', width: 2, height: 2, background: color, left: -1, top: -1 }} />
    </div>
  );
}

function Scope({ hud }: { hud: HudState }) {
  if (!hud.scoped) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 32vh, rgba(0,0,0,0.98) 32.5vh)',
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,0,0,0.9)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(0,0,0,0.9)' }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 6,
          height: 6,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: 'red',
        }}
      />
    </div>
  );
}

function HitMarker({ hud }: { hud: HudState }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!hud.hitMarker) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 120);
    return () => clearTimeout(t);
  }, [hud.hitMarker]);
  if (!show) return null;
  const s: React.CSSProperties = { position: 'absolute', background: 'white', width: 12, height: 2 };
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
      <div style={{ ...s, transform: 'rotate(45deg)' }} />
      <div style={{ ...s, transform: 'rotate(-45deg)' }} />
    </div>
  );
}

function DamageFlash({ hud }: { hud: HudState }) {
  const [op, setOp] = useState(0);
  useEffect(() => {
    if (!hud.damageFlash) return;
    setOp(0.5);
    const t = setInterval(() => setOp((o) => Math.max(0, o - 0.08)), 40);
    return () => clearInterval(t);
  }, [hud.damageFlash]);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        boxShadow: `inset 0 0 220px rgba(200,0,0,${op})`,
      }}
    />
  );
}

function Killfeed({ hud }: { hud: HudState }) {
  return (
    <div style={{ position: 'absolute', top: 12, right: 12, textAlign: 'right', fontSize: 13 }}>
      {hud.kills.map((k) => (
        <div
          key={k.id}
          style={{
            marginBottom: 4,
            padding: '3px 8px',
            background: 'rgba(0,0,0,0.55)',
            borderRadius: 3,
            display: 'inline-block',
          }}
        >
          <span style={{ color: k.killerTeam === 'CT' ? '#5ba8e8' : '#e8b45b', fontWeight: 700 }}>
            {k.killer}
          </span>
          <span style={{ color: '#ddd', margin: '0 6px' }}>
            {k.weapon === 'knife' ? '🔪' : '➤'}
            {k.headshot ? ' HS' : ''}
          </span>
          <span style={{ color: k.victimTeam === 'CT' ? '#5ba8e8' : '#e8b45b', fontWeight: 700 }}>
            {k.victim}
          </span>
        </div>
      ))}
    </div>
  );
}

function TopBar({ hud }: { hud: HudState }) {
  const mm = Math.floor(hud.roundTime / 60);
  const ss = (hud.roundTime % 60).toString().padStart(2, '0');
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'rgba(0,0,0,0.6)',
        padding: '6px 16px',
        borderRadius: 6,
        fontWeight: 700,
      }}
    >
      <span style={{ color: '#e8b45b', fontSize: 22 }}>{hud.scoreT}</span>
      <div style={{ textAlign: 'center', minWidth: 70 }}>
        <div style={{ color: hud.bombPlanted ? '#ff4040' : '#fff', fontSize: 20 }}>
          {hud.bombPlanted ? `☢ ${hud.bombTimer}` : `${mm}:${ss}`}
        </div>
        <div style={{ fontSize: 10, color: '#aaa' }}>
          {hud.phase === 'freezetime' ? 'FREEZE' : `ROUND ${hud.roundNumber}`}
        </div>
      </div>
      <span style={{ color: '#5ba8e8', fontSize: 22 }}>{hud.scoreCT}</span>
    </div>
  );
}

function AlivePips({ hud }: { hud: HudState }) {
  const pip = (n: number, color: string) =>
    Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: i < n ? color : 'rgba(255,255,255,0.15)',
        }}
      />
    ));
  return (
    <div
      style={{
        position: 'absolute',
        top: 52,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 22,
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>{pip(hud.alivesT, '#e8b45b')}</div>
      <div style={{ display: 'flex', gap: 4 }}>{pip(hud.alivesCT, '#5ba8e8')}</div>
    </div>
  );
}

function BottomHud({ hud }: { hud: HudState }) {
  return (
    <>
      <div style={{ position: 'absolute', left: 20, bottom: 18, textShadow: '0 1px 2px #000' }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: hud.health > 25 ? '#fff' : '#ff5252' }}>
          ♥ {hud.health}
        </div>
        <div style={{ fontSize: 20, color: '#8fd0ff' }}>
          🛡 {hud.armor}
          {hud.helmet ? ' + HELM' : ''}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 24, bottom: 18, textAlign: 'right', textShadow: '0 1px 2px #000' }}>
        <div style={{ fontSize: 16, color: '#ddd' }}>{hud.weaponName}</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: hud.reloading ? '#ffcc00' : '#fff' }}>
          {hud.ammo === Infinity ? '∞' : hud.ammo}
          {hud.ammo !== Infinity && (
            <span style={{ fontSize: 22, color: '#aaa' }}> / {hud.reserve}</span>
          )}
        </div>
        {hud.reloading && <div style={{ color: '#ffcc00', fontSize: 13 }}>RELOADING…</div>}
      </div>
    </>
  );
}

function BombProgress({ hud }: { hud: HudState }) {
  const active = hud.planting > 0 || hud.defusing > 0;
  if (!active) return null;
  const isPlant = hud.planting > 0;
  const p = isPlant ? hud.planting : hud.defusing;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '62%',
        transform: 'translateX(-50%)',
        width: 240,
        textAlign: 'center',
      }}
    >
      <div style={{ color: isPlant ? '#ff6a00' : '#40c0ff', marginBottom: 4, fontWeight: 700 }}>
        {isPlant ? 'PLANTING BOMB' : 'DEFUSING'}
      </div>
      <div style={{ height: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 5 }}>
        <div
          style={{
            width: `${Math.min(100, p * 100)}%`,
            height: '100%',
            background: isPlant ? '#ff6a00' : '#40c0ff',
            borderRadius: 5,
          }}
        />
      </div>
    </div>
  );
}

function Prompts({ hud }: { hud: HudState }) {
  let prompt = '';
  if (hud.hasBomb && !hud.bombPlanted) prompt = 'Hold [E] on A/B site to PLANT';
  if (hud.team === 'CT' && hud.bombPlanted) prompt = 'Reach C4 and hold [E] to DEFUSE';
  if (!prompt) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 90,
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.5)',
        padding: '5px 12px',
        borderRadius: 4,
        fontSize: 14,
        color: '#ffd',
      }}
    >
      {prompt}
    </div>
  );
}

export function HUD({ hud }: { hud: HudState }) {
  return (
    <div style={{ position: 'absolute', inset: 0, color: '#fff', pointerEvents: 'none', fontFamily: 'Segoe UI, sans-serif' }}>
      <Scope hud={hud} />
      {!hud.scoped && hud.alive && <Crosshair hud={hud} />}
      <HitMarker hud={hud} />
      <DamageFlash hud={hud} />
      <Minimap hud={hud} />
      <Killfeed hud={hud} />
      <TopBar hud={hud} />
      <AlivePips hud={hud} />
      <BottomHud hud={hud} />
      <BombProgress hud={hud} />
      <Prompts hud={hud} />
      {!hud.alive && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '42%',
            transform: 'translate(-50%,-50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 800, color: '#ff5252' }}>YOU DIED</div>
          <div style={{ fontSize: 14, color: '#ccc' }}>
            Spectating {hud.spectating} · press [V] to take over a teammate
          </div>
        </div>
      )}
      {hud.message && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '22%',
            transform: 'translateX(-50%)',
            fontSize: 26,
            fontWeight: 800,
            color: hud.winner === 'CT' ? '#5ba8e8' : hud.winner === 'T' ? '#e8b45b' : '#fff',
            textShadow: '0 2px 6px #000',
          }}
        >
          {hud.message}
        </div>
      )}
    </div>
  );
}
