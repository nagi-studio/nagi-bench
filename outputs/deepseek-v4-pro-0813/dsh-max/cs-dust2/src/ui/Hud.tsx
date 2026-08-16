// HUD 覆盖层：准星、血甲、弹药、击杀信息、小地图、开镜遮罩、观战
import { CSSProperties, useEffect, useRef } from 'react';
import { HudState } from '../game/engine';
import { minimapShapes } from '../game/map';

const MAP_X0 = -60, MAP_X1 = 66, MAP_Z0 = -60, MAP_Z1 = 60;

function Minimap({ hud }: { hud: HudState }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width, H = cv.height;
    const sx = W / (MAP_X1 - MAP_X0);
    const sz = H / (MAP_Z1 - MAP_Z0);
    const tx = (x: number) => (x - MAP_X0) * sx;
    const tz = (z: number) => (z - MAP_Z0) * sz;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(20,22,28,0.72)';
    ctx.fillRect(0, 0, W, H);
    for (const f of minimapShapes.floors) {
      ctx.fillStyle = 'rgba(150,140,115,0.5)';
      ctx.fillRect(tx(f.x0), tz(f.z0), (f.x1 - f.x0) * sx, (f.z1 - f.z0) * sz);
    }
    for (const w of minimapShapes.walls) {
      ctx.fillStyle = 'rgba(235,225,200,0.75)';
      ctx.fillRect(tx(w.x0), tz(w.z0), (w.x1 - w.x0) * sx, (w.z1 - w.z0) * sz);
    }
    // 包点
    ctx.fillStyle = 'rgba(240,180,60,0.35)';
    ctx.fillRect(tx(-58), tz(-58), 36 * sx, 26 * sz);
    ctx.fillStyle = 'rgba(90,140,240,0.35)';
    ctx.fillRect(tx(29), tz(-46), 29 * sx, 20 * sz);
    // C4
    const b = hud.minimap.bomb;
    if (b) {
      ctx.fillStyle = b.planted ? '#ff4030' : '#ffd24a';
      ctx.beginPath();
      ctx.arc(tx(b.x), tz(b.z), 4, 0, Math.PI * 2);
      ctx.fill();
    }
    // 队友
    for (const m of hud.minimap.teammates) {
      ctx.fillStyle = '#58c06a';
      ctx.beginPath();
      ctx.arc(tx(m.x), tz(m.z), 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    // 已发现敌人
    for (const m of hud.minimap.enemies) {
      ctx.fillStyle = '#e04848';
      ctx.beginPath();
      ctx.arc(tx(m.x), tz(m.z), 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    // 玩家朝向箭头
    const px = tx(hud.minimap.px), pz = tz(hud.minimap.pz);
    const ang = Math.atan2(-Math.cos(hud.minimap.pyaw) * sz, -Math.sin(hud.minimap.pyaw) * sx);
    ctx.save();
    ctx.translate(px, pz);
    ctx.rotate(ang);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(-4, 4.5);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-4, -4.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [hud]);
  return <canvas ref={ref} width={200} height={200} style={{ width: 200, height: 200, imageRendering: 'pixelated' }} />;
}

const bar: CSSProperties = { height: 12, borderRadius: 3, transition: 'width 0.15s' };

export function Hud({
  hud, onCycleSpec, onTakeover,
}: {
  hud: HudState;
  onCycleSpec: () => void;
  onTakeover: () => void;
}) {
  const spreadGap = 7 + hud.spread * 420;
  const scoped = hud.zoom > 0;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', userSelect: 'none', color: '#e8e8e8', fontFamily: 'system-ui, sans-serif' }}>
      {/* 受伤红闪 */}
      {hud.hurtFlash > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(200,30,20,${Math.min(0.55, hud.hurtFlash)}) 100%)`,
        }} />
      )}
      {/* 顶部：比分 + 时间 + 存活 */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 18, alignItems: 'center', background: 'rgba(10,12,16,0.55)', padding: '6px 18px', borderRadius: 6 }}>
        <span style={{ fontWeight: 700 }}>T <b style={{ color: '#ffcf6e' }}>{hud.scoreT}</b> : <b style={{ color: '#7ea8ff' }}>{hud.scoreCT}</b> CT</span>
        <span style={{ fontSize: 22, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{hud.timerLabel}</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>回合 {hud.roundNum}</span>
      </div>
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8, background: 'rgba(10,12,16,0.55)', padding: '6px 12px', borderRadius: 6, fontSize: 12 }}>
        <span style={{ color: '#ffcf6e' }}>T {hud.playersAlive.t}</span>
        <span style={{ color: '#7ea8ff' }}>CT {hud.playersAlive.ct}</span>
      </div>
      {/* 小地图 */}
      <div style={{ position: 'absolute', top: 12, right: 12, border: '2px solid rgba(255,255,255,0.25)', borderRadius: 6, overflow: 'hidden' }}>
        <Minimap hud={hud} />
      </div>
      {/* 击杀信息 */}
      <div style={{ position: 'absolute', top: 64, right: 12, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
        {hud.killfeed.map((k) => (
          <div key={`${k.t}-${k.text}`} style={{
            background: 'rgba(10,12,16,0.6)', padding: '3px 10px', borderRadius: 4, fontSize: 13,
            animation: 'kf-fade 5s linear forwards',
          }}>
            {k.headshot && <span style={{ color: '#ff8a6e' }}>☠ </span>}
            <span style={{ color: k.team === 'T' ? '#ffcf6e' : '#7ea8ff' }}>{k.text}</span>
          </div>
        ))}
      </div>
      {/* 底部左：血甲弹药 */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, width: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 700, width: 58, textAlign: 'right' }}>❤ {hud.hp}</span>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', ...bar }}>
            <div style={{ width: `${hud.hp}%`, background: hud.hp > 30 ? '#d6483a' : '#a02014', ...bar }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 13, width: 58, textAlign: 'right', opacity: 0.85 }}>🛡 {hud.armor}</span>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', ...bar }}>
            <div style={{ width: `${hud.armor}%`, background: '#3f6fb8', ...bar }} />
          </div>
        </div>
        <div style={{ fontSize: 14, opacity: 0.9 }}>{hud.weaponName}</div>
        <div style={{ fontSize: 22, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
          {hud.mag} <span style={{ fontSize: 13, opacity: 0.7, fontWeight: 400 }}>/ {hud.reserve}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {hud.slots.map((s) => (
            <div key={s.key} style={{
              padding: '3px 8px', borderRadius: 4, fontSize: 12,
              background: s.cur ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.4)',
              opacity: s.has ? 1 : 0.35,
              border: s.cur ? '1px solid rgba(255,255,255,0.7)' : '1px solid transparent',
            }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>
      {/* 底部中：提示 / 交互进度 */}
      <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        {hud.interact && (
          <div style={{ marginBottom: 6, fontSize: 15, fontWeight: 600 }}>
            {hud.interact.label}
            {hud.interact.progress > 0 && (
              <div style={{ width: 160, height: 6, background: 'rgba(0,0,0,0.5)', margin: '6px auto 0', borderRadius: 3 }}>
                <div style={{ width: `${Math.min(1, hud.interact.progress) * 100}%`, height: 6, background: '#ffd24a', borderRadius: 3 }} />
              </div>
            )}
          </div>
        )}
        <div style={{ fontSize: 13, opacity: 0.75 }}>{hud.siteHint}</div>
      </div>
      {/* 准星 */}
      {!scoped && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
          <div style={{ position: 'absolute', width: 2, height: 10, background: '#7df07d', left: -1, top: -10 - spreadGap }} />
          <div style={{ position: 'absolute', width: 2, height: 10, background: '#7df07d', left: -1, top: spreadGap }} />
          <div style={{ position: 'absolute', width: 10, height: 2, background: '#7df07d', top: -1, left: -10 - spreadGap }} />
          <div style={{ position: 'absolute', width: 10, height: 2, background: '#7df07d', top: -1, left: spreadGap }} />
          {hud.hitmarkerT > 0 && (
            <div style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18 }}>
              <div style={{ position: 'absolute', width: 2, height: 8, background: hud.hitHead ? '#ff5040' : '#ffffff', transform: 'rotate(45deg)', left: 8, top: 5 }} />
              <div style={{ position: 'absolute', width: 2, height: 8, background: hud.hitHead ? '#ff5040' : '#ffffff', transform: 'rotate(-45deg)', left: 8, top: 5 }} />
              <div style={{ position: 'absolute', width: 2, height: 8, background: hud.hitHead ? '#ff5040' : '#ffffff', transform: 'rotate(135deg)', left: 8, top: 5 }} />
              <div style={{ position: 'absolute', width: 2, height: 8, background: hud.hitHead ? '#ff5040' : '#ffffff', transform: 'rotate(-135deg)', left: 8, top: 5 }} />
            </div>
          )}
        </div>
      )}
      {/* AWP 开镜：2D 遮罩 + 十字准线 */}
      {scoped && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.96) 100%)',
        }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
            <div style={{ position: 'absolute', width: 1, height: '46vh', background: 'rgba(0,0,0,0.9)', left: -0.5, top: '-46vh' }} />
            <div style={{ position: 'absolute', width: 1, height: '46vh', background: 'rgba(0,0,0,0.9)', left: -0.5, top: 0 }} />
            <div style={{ position: 'absolute', width: '46vw', height: 1, background: 'rgba(0,0,0,0.9)', top: -0.5, left: '-46vw' }} />
            <div style={{ position: 'absolute', width: '46vw', height: 1, background: 'rgba(0,0,0,0.9)', top: -0.5, left: 0 }} />
            <div style={{ position: 'absolute', width: 6, height: 6, background: 'rgba(0,0,0,0.85)', borderRadius: 3, left: -3, top: -3 }} />
          </div>
        </div>
      )}
      {/* 死亡观战 */}
      {hud.dead && hud.spectate && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70,
        }}>
          <div style={{ background: 'rgba(10,12,16,0.85)', padding: '14px 22px', borderRadius: 8, textAlign: 'center', pointerEvents: 'auto' }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>你已阵亡</div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>
              观战中：<b>{hud.spectate.name}</b>（{hud.spectate.index + 1}/{hud.spectate.list.length}）
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={onCycleSpec} style={{ padding: '8px 16px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
                切换视角（点击）
              </button>
              {hud.spectate.takeover && (
                <button onClick={onTakeover} style={{ padding: '8px 16px', borderRadius: 5, border: '1px solid #ffd24a', background: 'rgba(255,210,74,0.25)', color: '#ffd24a', cursor: 'pointer', fontSize: 14 }}>
                  接管该队友（F）
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 回合结束横幅 */}
      {hud.roundEndText && (
        <div style={{ position: 'absolute', top: '34%', left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(10,12,16,0.85)', padding: '12px 30px', borderRadius: 8, fontSize: 24, fontWeight: 700, animation: 'kf-in 0.3s ease' }}>
            {hud.roundEndText}
          </div>
        </div>
      )}
      <style>{`
        @keyframes kf-fade { 0% { opacity: 0; } 6% { opacity: 1; } 78% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes kf-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
