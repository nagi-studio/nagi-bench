// HUD 覆盖层：准星、生命/护甲、弹药、击杀播报、小地图、炸弹状态、回合横幅

import { useEffect, useRef } from 'react';
import { MINIMAP_REGIONS, SITES } from '../game/map';
import type { HudState } from '../game/types';

const WX0 = -34, WX1 = 34, WZ0 = -38, WZ1 = 38;

export function Minimap({ snap }: { snap: HudState }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width, H = cv.height;
    const s = Math.min(W / (WX1 - WX0), H / (WZ1 - WZ0));
    const ox = (W - (WX1 - WX0) * s) / 2;
    const oy = (H - (WZ1 - WZ0) * s) / 2;
    const px = (x: number) => ox + (x - WX0) * s;
    const py = (z: number) => oy + (z - WZ0) * s;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);
    // 区域底图
    for (const r of MINIMAP_REGIONS) {
      ctx.fillStyle = r.color;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(px(r.x0), py(r.z0), (r.x1 - r.x0) * s, (r.z1 - r.z0) * s);
    }
    ctx.globalAlpha = 1;
    // 包点环
    for (const st of SITES) {
      ctx.strokeStyle = st.name === 'A' ? '#4fc3f7' : '#ffb74d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px(st.x), py(st.z), st.radius * s, 0, Math.PI * 2);
      ctx.stroke();
    }
    const m = snap.minimap;
    // 炸弹
    if (m.bomb) {
      const bx = px(m.bomb.x), by = py(m.bomb.z);
      ctx.fillStyle = m.bomb.state === 'planted' ? '#ff5722' : '#ff9800';
      if (m.bomb.state === 'planted') {
        const pulse = 3 + Math.sin(Date.now() / 150) * 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff5722';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-3.5, -3.5, 7, 7);
      ctx.restore();
    }
    // 队友
    for (const a of m.allies) {
      ctx.fillStyle = a.alive ? '#33b5ff' : '#555a66';
      ctx.beginPath();
      ctx.arc(px(a.x), py(a.z), 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    // 被看见的敌人
    for (const e of m.enemies) {
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(px(e.x), py(e.z), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // 自己（方向箭头）
    if (m.self.alive) {
      const sx = px(m.self.x), sy = py(m.self.z);
      ctx.save();
      ctx.translate(sx, sy);
      // 世界前向 (cos yaw, sin yaw) → 屏幕方向（屏幕 y 与 z 同向，向下）
      ctx.rotate(Math.atan2(Math.cos(m.self.yaw), -Math.sin(m.self.yaw)));
      ctx.fillStyle = '#7CFF6B';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.5, 4.5);
      ctx.lineTo(0, 1.8);
      ctx.lineTo(-4.5, 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#888';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('×', px(m.self.x), py(m.self.z) + 3);
    }
  }, [snap.minimap, snap.roundNum]);
  return <canvas ref={ref} width={240} height={240} className="minimap-canvas" />;
}

function Crosshair({ spread, zooming }: { spread: number; zooming: boolean }) {
  if (zooming) return null;
  const gap = 6 + spread * 60;
  const len = 7 + spread * 30;
  return (
    <div className="crosshair">
      <div className="ch-v" style={{ top: `calc(50% - ${gap + len}px)`, height: len }} />
      <div className="ch-v" style={{ top: `calc(50% + ${gap}px)`, height: len }} />
      <div className="ch-h" style={{ left: `calc(50% - ${gap + len}px)`, width: len }} />
      <div className="ch-h" style={{ left: `calc(50% + ${gap}px)`, width: len }} />
      <div className="ch-dot" />
    </div>
  );
}

function ScopeOverlay() {
  return (
    <div className="scope-overlay">
      <svg className="scope-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,0,0,0.9)" strokeWidth="46" />
        <circle cx="50" cy="50" r="49" fill="none" stroke="#000" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="1.2" fill="#000" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#000" strokeWidth="0.7" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#000" strokeWidth="0.7" />
      </svg>
      <div className="scope-cross">
        <div className="sc-v" style={{ top: 'calc(50% - 46vh)', height: '40vh' }} />
        <div className="sc-v" style={{ top: 'calc(50% + 6vh)', height: '40vh' }} />
        <div className="sc-h" style={{ left: 'calc(50% - 46vw)', width: '40vw' }} />
        <div className="sc-h" style={{ left: 'calc(50% + 6vw)', width: '40vw' }} />
      </div>
    </div>
  );
}

export function Hud(props: {
  snap: HudState;
  started: boolean;
  locked: boolean;
  onStart: () => void;
  onRestart: () => void;
}) {
  const { snap, started, locked, onStart, onRestart } = props;
  const kf = snap.killfeed.slice(-6).reverse();

  return (
    <div className="hud">
      {/* 十字准星 */}
      {started && !snap.zooming && <Crosshair spread={snap.spread} zooming={snap.zooming} />}
      {started && snap.zooming && <ScopeOverlay />}

      {/* 命中反馈 */}
      {snap.hitmark > 0 && (
        <div className="hitmark" style={{ opacity: Math.min(1, snap.hitmark * 4) }}>
          <div className="hm hm1" /><div className="hm hm2" />
          <div className="hm hm3" /><div className="hm hm4" />
        </div>
      )}

      {/* 受击红屏 */}
      {snap.damageFlash > 0 && <div className="damage-flash" style={{ opacity: snap.damageFlash * 3 }} />}

      {/* 低血量警示 */}
      {snap.hp < 35 && started && <div className="lowhp" />}

      {/* 顶部：比分 + 回合信息 */}
      <div className="top-center">
        <div className="score">
          <span className="score-ct">{snap.scoreCT}</span>
          <span className="score-vs">Dust2 对决</span>
          <span className="score-t">{snap.scoreT}</span>
        </div>
        <div className="round-info">
          第 {snap.roundNum} 回合 {snap.phase === 'freeze' && `· 开始倒计时 ${snap.freezeTime}`}
          <span className="alive-info"> CT {snap.aliveCT} vs T {snap.aliveT}</span>
        </div>
        {snap.bombPlanted && (
          <div className={`bomb-timer ${snap.bombTime <= 10 ? 'urgent' : ''}`}>
            💣 爆炸倒计时 {snap.bombTime}s
          </div>
        )}
        {snap.actionLabel && <div className="action-label">{snap.actionLabel}</div>}
        {snap.plantProgress >= 0 && <ProgressBar v={snap.plantProgress} color="#ff9800" />}
        {snap.defuseProgress >= 0 && <ProgressBar v={snap.defuseProgress} color="#4fc3f7" />}
      </div>

      {/* 击杀播报 */}
      <div className="killfeed">
        {kf.map((item, i) => (
          <div key={item.id} className={`kf-item ${item.killer === 0 ? 'me' : ''}`} style={{ opacity: 1 - i * 0.14 }}>
            <span className="kf-name">{item.killerName}</span>
            <span className="kf-weapon">[{item.weaponName}{item.headshot ? ' ◎' : ''}]</span>
            <span className="kf-name">{item.victimName}</span>
          </div>
        ))}
      </div>

      {/* 左下：生命 / 护甲 */}
      {started && (
        <div className="bottom-left">
          <div className="stat hp">
            <div className="bar"><div className="fill" style={{ width: `${snap.hp}%`, background: snap.hp > 50 ? '#4caf50' : snap.hp > 25 ? '#ff9800' : '#f44336' }} /></div>
            <span className="num">{snap.hp}</span>
          </div>
          <div className="stat armor">
            <div className="bar"><div className="fill" style={{ width: `${snap.armor}%`, background: '#42a5f5' }} /></div>
            <span className="num">{snap.armor}</span>
          </div>
          {snap.hasBomb && <div className="bomb-icon">💣 持有 C4</div>}
          {snap.spectating && <div className="spec-hint">观战中 · 按 F2 切换队友 · 当前操控 {snap.weapons.length > 0 ? '队友' : ''}</div>}
        </div>
      )}

      {/* 右下：弹药 */}
      {started && (
        <div className="bottom-right">
          <div className="weapon-name">{snap.weaponName}</div>
          <div className="ammo">
            {snap.ammoMag === Infinity ? (
              <span className="ammo-mag inf">∞</span>
            ) : (
              <>
                <span className="ammo-mag">{snap.ammoMag}</span>
                <span className="ammo-sep"> / </span>
                <span className="ammo-res">{snap.ammoReserve === Infinity ? '∞' : snap.ammoReserve}</span>
              </>
            )}
            {snap.reloading && <span className="reloading">换弹中...</span>}
          </div>
        </div>
      )}

      {/* 小地图 */}
      <div className="minimap-wrap">
        <Minimap snap={snap} />
      </div>

      {/* 回合结束横幅 */}
      {snap.phase === 'over' && (
        <div className={`round-end ${snap.lastRoundWinner === 0 ? 'ct' : 't'}`}>
          <div className="re-title">
            {snap.lastRoundWinner === 0 ? 'CT 阵营获胜' : 'T 阵营获胜'}
          </div>
          <div className="re-reason">{snap.lastRoundReason}</div>
          {snap.scoreCT >= 8 || snap.scoreT >= 8 ? (
            <button className="btn" onClick={onRestart}>再来一局</button>
          ) : (
            <div className="re-next">下一回合即将开始...</div>
          )}
        </div>
      )}

      {/* 暂停遮罩 */}
      {started && !locked && (
        <div className="pause-overlay">
          <div className="pause-box">
            <div className="pause-title">已暂停</div>
            <div className="pause-tip">点击画面继续</div>
          </div>
        </div>
      )}

      {/* 开始界面 */}
      {!started && (
        <div className="intro">
          <div className="intro-box">
            <h1 className="intro-title">DUST2 · 5v5</h1>
            <p className="intro-sub">第一人称射击原型 · 全程序化生成</p>
            <div className="controls">
              <div><b>WASD</b> 移动</div>
              <div><b>鼠标</b> 视角 · <b>左键</b> 开火 · <b>右键</b> 开镜(AWP)</div>
              <div><b>空格</b> 跳跃 · <b>R</b> 换弹 · <b>E</b> 下包/拆包</div>
              <div><b>1/2/3</b> 或 <b>滚轮</b> 切换武器 · <b>Q</b> 循环切换</div>
              <div><b>F2</b> 阵亡后切换队友视角 · <b>M</b> 静音</div>
            </div>
            <button className="btn big" onClick={onStart}>进入战场</button>
            <p className="intro-note">第 1 回合为手枪局（仅手枪 · 无护甲）</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ v, color }: { v: number; color: string }) {
  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${v * 100}%`, background: color }} />
    </div>
  );
}
