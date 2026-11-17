import { useEffect, useRef } from "react";
import type { GameEngine } from "../game/Engine";
import { CELL, GRID_SIZE, MAP_MIN, SITES } from "../game/map";

export function Minimap({
  engine,
  large = false,
  preview = false,
}: {
  engine: GameEngine;
  large?: boolean;
  preview?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!,
      context = canvas.getContext("2d")!;
    let raf = 0,
      last = -1;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 90) return;
      last = now;
      const bounds = canvas.getBoundingClientRect(),
        ratio = Math.min(devicePixelRatio, 2),
        w = bounds.width,
        h = bounds.height;
      if (
        canvas.width !== Math.round(w * ratio) ||
        canvas.height !== Math.round(h * ratio)
      ) {
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) / 98,
        ox = w / 2,
        oz = h / 2;
      const px = (x: number) => ox + x * scale,
        pz = (z: number) => oz + z * scale;
      context.strokeStyle = "rgba(185,205,181,.035)";
      context.lineWidth = 0.5;
      for (let i = 0; i < w; i += w / 12) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, h);
        context.stroke();
      }
      for (let i = 0; i < h; i += h / 12) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(w, i);
        context.stroke();
      }
      context.fillStyle = large ? "#637266" : "#48594e";
      for (let z = 0; z < GRID_SIZE; z++)
        for (let x = 0; x < GRID_SIZE; x++)
          if (engine.map.cell(x, z))
            context.fillRect(
              px(MAP_MIN + x * CELL),
              pz(MAP_MIN + z * CELL),
              CELL * scale + 0.3,
              CELL * scale + 0.3,
            );
      context.lineWidth = large ? 1.5 : 1;
      context.strokeStyle = "#859381";
      for (const wall of engine.map.walls) {
        context.beginPath();
        context.moveTo(px(wall.minX), pz(wall.minZ));
        context.lineTo(px(wall.maxX), pz(wall.maxZ));
        context.stroke();
      }
      for (const c of engine.map.colliders) {
        if (c.kind !== "crate" && c.kind !== "door") continue;
        context.fillStyle = c.kind === "door" ? "#ab956b" : "#2b3c32";
        context.fillRect(
          px(c.minX),
          pz(c.minZ),
          (c.maxX - c.minX) * scale,
          (c.maxZ - c.minZ) * scale,
        );
      }
      for (const id of ["A", "B"] as const) {
        const site = SITES[id];
        context.fillStyle = "rgba(211,172,84,.13)";
        context.beginPath();
        context.arc(
          px(site.x),
          pz(site.z),
          site.radius * scale,
          0,
          Math.PI * 2,
        );
        context.fill();
        context.fillStyle = "#e3c779";
        context.font = `600 ${large ? 22 : 13}px Arial`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(id, px(site.x), pz(site.z));
      }
      context.fillStyle = "#a1ae9d";
      context.font = `500 ${large ? 11 : 7}px Arial`;
      context.fillText("T SPAWN", px(2), pz(41));
      context.fillText("CT", px(0), pz(-32));
      context.fillText("MID", px(0), pz(4));
      if (large) {
        context.font = "10px Arial";
        context.fillText("A LONG", px(39), pz(3));
        context.save();
        context.translate(px(-30), pz(7));
        context.rotate(-Math.PI / 2);
        context.fillText("B TUNNELS", 0, 0);
        context.restore();
        context.save();
        context.translate(px(14), pz(-3));
        context.rotate(-Math.PI / 2);
        context.fillText("CATWALK", 0, 0);
        context.restore();
      }
      if (!preview) {
        for (const a of engine.actors) {
          if (!a.alive) continue;
          const friendly = a.team === engine.config.team,
            isSelf = a.id === engine.viewed.id,
            intel = engine.intel.get(a.id);
          if (!friendly && (!intel || intel.until < engine.time)) continue;
          const p = friendly ? a.position : intel!;
          const x = px(p.x),
            z = pz(p.z);
          if (isSelf) {
            context.fillStyle = "rgba(148,226,204,.14)";
            context.beginPath();
            context.moveTo(x, z);
            context.arc(
              x,
              z,
              18,
              a.yaw === 0 ? -Math.PI * 0.75 : -a.yaw - Math.PI * 0.75,
              -a.yaw - Math.PI * 0.25,
            );
            context.closePath();
            context.fill();
          }
          context.fillStyle = isSelf
            ? "#e8fff1"
            : friendly
              ? "#7ed4bb"
              : "#f3a65b";
          context.beginPath();
          context.arc(x, z, isSelf ? 3.5 : 2.7, 0, Math.PI * 2);
          context.fill();
          if (isSelf) {
            context.strokeStyle = "#e8fff1";
            context.lineWidth = 1.5;
            context.beginPath();
            context.moveTo(x, z);
            context.lineTo(x - Math.sin(a.yaw) * 8, z - Math.cos(a.yaw) * 8);
            context.stroke();
          }
        }
        const bomb = engine.bomb;
        if (bomb.state !== "exploded" && bomb.state !== "defused") {
          context.save();
          context.translate(px(bomb.position.x), pz(bomb.position.z));
          context.rotate(Math.PI / 4);
          context.fillStyle = bomb.state === "planted" ? "#ff8060" : "#f4d183";
          context.fillRect(-2.7, -2.7, 5.4, 5.4);
          context.strokeStyle = "#1b2820";
          context.lineWidth = 1;
          context.strokeRect(-2.7, -2.7, 5.4, 5.4);
          context.restore();
          if (bomb.state === "planted") {
            context.strokeStyle = `rgba(255,130,90,${0.3 + 0.3 * Math.sin(engine.time * 4)})`;
            context.beginPath();
            context.arc(
              px(bomb.position.x),
              pz(bomb.position.z),
              8 + Math.sin(engine.time * 4) * 2,
              0,
              Math.PI * 2,
            );
            context.stroke();
          }
        }
      }
      context.fillStyle = "#93a68f";
      context.font = "9px Arial";
      context.textAlign = "right";
      context.fillText("N ↑", w - 9, 12);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [engine, large, preview]);
  return (
    <canvas
      ref={ref}
      className={`minimap ${large ? "minimap-large" : ""}`}
      aria-label="Dust2 俯视地图：A、B 点与全部通路"
    />
  );
}
