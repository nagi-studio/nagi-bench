import type { Level } from '../game/world/Level';

export const RADAR_PX = 4; // pixels per meter in the base image

/**
 * Pre-renders the Dust2 top-down outline from the level raster: walkable floors shaded by
 * height, buildings dark, cover boxes outlined, bombsites tinted and callouts labelled.
 */
export function renderRadarBase(level: Level): HTMLCanvasElement {
  const b = level.def.bounds;
  const W = Math.round((b.x1 - b.x0) * RADAR_PX);
  const H = Math.round((b.z1 - b.z0) * RADAR_PX);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.clearRect(0, 0, W, H);

  const img = ctx.createImageData(W, H);
  const d = img.data;
  const nav = level.nav;
  const res = 0.5;
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const x = b.x0 + (px + 0.5) / RADAR_PX;
      const z = b.z0 + (py + 0.5) / RADAR_PX;
      const ci = Math.floor((x - b.x0) / res);
      const cj = Math.floor((z - b.z0) / res);
      const idx = cj * level.cols + ci;
      const fh = level.floorHeight[idx];
      const o = (py * W + px) * 4;
      if (Number.isNaN(fh)) {
        // building: draw only an outline band near floors for a crisp look
        d[o] = 28;
        d[o + 1] = 30;
        d[o + 2] = 34;
        d[o + 3] = 150;
        continue;
      }
      const walk = nav.walkable[idx] === 1;
      const shade = 150 + Math.max(-40, Math.min(60, fh * 28));
      let r = shade * 1.0;
      let g = shade * 0.93;
      let bl = shade * 0.78;
      if (!walk) {
        // inflated edges / props: slightly darker so cover reads on the radar
        r *= 0.86;
        g *= 0.86;
        bl *= 0.86;
      }
      d[o] = r;
      d[o + 1] = g;
      d[o + 2] = bl;
      d[o + 3] = 235;
    }
  }
  ctx.putImageData(img, 0, 0);

  // props (crates etc.) as dark boxes
  ctx.fillStyle = 'rgba(70,52,30,0.85)';
  for (const box of level.def.boxes) {
    if (box.kind === 'ceiling' || box.kind === 'lintel' || box.kind === 'beam') continue;
    ctx.fillRect((box.x0 - b.x0) * RADAR_PX, (box.z0 - b.z0) * RADAR_PX, (box.x1 - box.x0) * RADAR_PX, (box.z1 - box.z0) * RADAR_PX);
  }
  // covered areas (tunnels) hatched darker
  ctx.fillStyle = 'rgba(40,40,50,0.28)';
  for (const box of level.def.boxes) {
    if (box.kind !== 'ceiling') continue;
    ctx.fillRect((box.x0 - b.x0) * RADAR_PX, (box.z0 - b.z0) * RADAR_PX, (box.x1 - box.x0) * RADAR_PX, (box.z1 - box.z0) * RADAR_PX);
  }
  // doors
  ctx.strokeStyle = 'rgba(60,140,160,0.95)';
  ctx.lineWidth = 2;
  for (const dl of level.def.doors) {
    ctx.beginPath();
    ctx.moveTo((dl.hx - b.x0) * RADAR_PX, (dl.hz - b.z0) * RADAR_PX);
    ctx.lineTo((dl.hx + Math.cos(dl.angle) * dl.length - b.x0) * RADAR_PX, (dl.hz + Math.sin(dl.angle) * dl.length - b.z0) * RADAR_PX);
    ctx.stroke();
  }
  // bombsites
  for (const s of level.def.bombsites) {
    ctx.fillStyle = 'rgba(220,60,50,0.16)';
    ctx.strokeStyle = 'rgba(230,80,70,0.55)';
    ctx.lineWidth = 2;
    const x = (s.x0 - b.x0) * RADAR_PX;
    const y = (s.z0 - b.z0) * RADAR_PX;
    ctx.fillRect(x, y, (s.x1 - s.x0) * RADAR_PX, (s.z1 - s.z0) * RADAR_PX);
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(x, y, (s.x1 - s.x0) * RADAR_PX, (s.z1 - s.z0) * RADAR_PX);
    ctx.setLineDash([]);
  }
  // labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const l of level.def.labels) {
    const x = (l.x - b.x0) * RADAR_PX;
    const y = (l.z - b.z0) * RADAR_PX;
    if (l.big) {
      ctx.font = `900 ${10 * RADAR_PX}px "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = 'rgba(255,90,70,0.9)';
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 4;
      ctx.strokeText(l.text, x, y);
      ctx.fillText(l.text, x, y);
    } else {
      ctx.font = `700 ${2.6 * RADAR_PX}px "Microsoft YaHei", "PingFang SC", sans-serif`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.65)';
      ctx.strokeText(l.text, x, y);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.fillText(l.text, x, y);
    }
  }
  return c;
}
