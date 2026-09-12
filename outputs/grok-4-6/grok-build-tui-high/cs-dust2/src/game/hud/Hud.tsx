import { useEffect, useRef } from "react";
import type { HudSnapshot } from "../types";
import "./Hud.css";

const MAP = { minX: -56, maxX: 56, minZ: -56, maxZ: 56 };

function wx(x: number, size: number) {
  return ((x - MAP.minX) / (MAP.maxX - MAP.minX)) * size;
}
function wz(z: number, size: number) {
  return (1 - (z - MAP.minZ) / (MAP.maxZ - MAP.minZ)) * size;
}

function drawMinimap(canvas: HTMLCanvasElement, hud: HudSnapshot) {
  const size = canvas.width;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#10160f";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "#2a3320";
  for (const f of hud.minimap.floors) {
    const x = wx(f.x, size);
    const z = wz(f.z + f.d, size);
    const w = (f.w / (MAP.maxX - MAP.minX)) * size;
    const d = (f.d / (MAP.maxZ - MAP.minZ)) * size;
    ctx.fillRect(x, z, w, d);
  }

  ctx.strokeStyle = "#8a9a68";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const w of hud.minimap.walls) {
    ctx.moveTo(wx(w.x1, size), wz(w.z1, size));
    ctx.lineTo(wx(w.x2, size), wz(w.z2, size));
  }
  ctx.stroke();

  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  for (const s of hud.minimap.sites) {
    ctx.fillStyle = s.name === "A" ? "#c45a5a" : "#5a7ac4";
    ctx.beginPath();
    ctx.arc(wx(s.x, size), wz(s.z, size), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(s.name, wx(s.x, size), wz(s.z, size) + 4);
  }

  if (hud.minimap.bomb) {
    const bx = wx(hud.minimap.bomb.x, size);
    const bz = wz(hud.minimap.bomb.z, size);
    ctx.fillStyle = hud.bombPlanted ? "#ff3b2a" : "#e6c14a";
    ctx.fillRect(bx - 3, bz - 3, 6, 6);
  }

  for (const b of hud.minimap.blips) {
    const x = wx(b.x, size);
    const z = wz(b.z, size);
    ctx.save();
    ctx.translate(x, z);
    ctx.rotate(b.yaw);
    ctx.fillStyle = b.self ? "#d8ff6a" : b.team === "T" ? "#e0a24a" : "#6ab4ea";
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4, 5);
    ctx.lineTo(0, 2);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();
    if (b.bomb) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(-1.5, -1, 3, 3);
    }
    ctx.restore();
  }
}

function fmt(t: number) {
  const s = Math.max(0, Math.ceil(t));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function Hud({ hud, showBoard }: { hud: HudSnapshot; showBoard: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    c.width = 196 * dpr;
    c.height = 196 * dpr;
    drawMinimap(c, hud);
  }, [hud]);

  const hp = Math.round(hud.hp);
  const magShown = hud.weapon === "knife" ? "—" : String(hud.mag);

  return (
    <div className="hud">
      <div className={`flash${hud.damageFlash > 0 ? " on" : ""}`} />
      {hud.scoped && (
        <div className="scope">
          <div className="reticle" />
          <div className="cx" />
          <div className="cy" />
        </div>
      )}
      {!hud.scoped && (
        <div className="crosshair">
          <i className="h l" />
          <i className="h r" />
          <i className="v t" />
          <i className="v b" />
          <i className="dot" />
        </div>
      )}
      <div className={`hitmark${hud.hitMarker > 0 ? " on" : ""}`} />

      <div className="minimap">
        <canvas ref={ref} />
      </div>

      <div className="topbar">
        <span className="ct">{hud.scoreCT}</span>
        <span className={`clock${hud.bombPlanted ? " bomb" : ""}`}>{fmt(hud.roundTime)}</span>
        <span className="t">{hud.scoreT}</span>
        <span className="round">
          R{hud.round}
          {hud.pistolRound ? " 手枪局" : ""}
          {hud.phase === "freezetime" ? " 准备" : hud.phase === "planted" ? " 已下包" : ""}
        </span>
      </div>

      <div className="killfeed">
        {hud.killfeed.map((k) => (
          <div className={`row ${k.attackerTeam}`} key={k.id}>
            {k.attacker} [{k.weapon.toUpperCase()}] {k.victim}
            {k.headshot ? <span className="hs">HS</span> : null}
          </div>
        ))}
      </div>

      <div className="bottom-left">
        <div className="hp">
          <div>
            <div className="lab">HP</div>
            <div className={`n${hp <= 20 ? " low" : ""}`}>{hp}</div>
          </div>
          <div>
            <div className="lab">ARMOR</div>
            <div className="n armor">
              {Math.round(hud.armor)}
              {hud.helmet ? " H" : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="ammo">
        {hud.weapon !== "knife" && (
          <>
            <span className="mag">{magShown}</span>
            <span className="res"> / {hud.reserve}</span>
          </>
        )}
        <div className="wname">{hud.weaponName}</div>
        {hud.reloading && <div className="reload">换弹中</div>}
      </div>

      {hud.holdingBomb && <div className="bomb-icon">C4</div>}
      {hud.message && (hud.phase === "roundend" || hud.phase === "freezetime" || hud.bombPlanted) && (
        <div className="banner">{hud.message}</div>
      )}
      {hud.hint && <div className="hint">{hud.hint}</div>}
      {(hud.plantProgress > 0 || hud.defuseProgress > 0) && (
        <div className="progress">
          <span style={{ width: `${Math.min(100, (hud.plantProgress || hud.defuseProgress) * 100)}%` }} />
        </div>
      )}
      {hud.spectating && (
        <div className="spec">
          正在观看 {hud.spectating}
          {hud.canTakeover ? " · 按 F 接管" : ""}
        </div>
      )}

      {showBoard && (
        <div className="scoreboard">
          <h3>TAB 计分板 · CT {hud.scoreCT} - {hud.scoreT} T</h3>
          <table>
            <thead>
              <tr>
                <th>阵营</th>
                <th>玩家</th>
                <th>HP</th>
                <th>武器</th>
              </tr>
            </thead>
            <tbody>
              {hud.names.map((n) => (
                <tr key={n.id} className={n.alive ? n.team : `dead ${n.team}`}>
                  <td className={n.team}>{n.team}</td>
                  <td>{n.name}</td>
                  <td>{n.alive ? Math.round(n.hp) : "—"}</td>
                  <td>{n.weapon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}