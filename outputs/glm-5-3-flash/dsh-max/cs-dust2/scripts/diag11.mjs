import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4186;
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const waitForPort = async (port, tries = 60) => {
  for (let i = 0; i < tries; i++) { try { const r = await fetch(`http://localhost:${port}/`); if (r.ok) return true; } catch {} await wait(400); }
  return false;
};
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
let browser;
try {
  if (!await waitForPort(PORT)) throw new Error('no server');
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 480, height: 320 });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t'); await page.click('.play');
  await wait(1200);
  await page.evaluate(() => {
    const g = window.__game; g.speed = 8; g.renderEnabled = false;
    window.LOG = [];
    const orig = g.fireBullet.bind(g);
    g.fireBullet = (shooter, ox, oy, oz, dx, dy, dz, def) => {
      const t = shooter.brain?.target;
      orig(shooter, ox, oy, oz, dx, dy, dz, def);
      if (!t) return;
      const px = t.x - ox, py = (t.y + 1.3) - oy, pz = t.z - oz;
      const dist = Math.hypot(px, pz);
      const tp = px * dx + py * dy + pz * dz;
      const miss = Math.hypot(px - dx * tp, py - dy * tp, pz - dz * tp);
      // wall distance along this ray
      let wall = 1e9;
      for (const b of g.world.colliders) {
        // quick reuse of the engine's ray test via a manual AABB intersection
        const inv = [1 / dx, 1 / dy, 1 / dz];
        let t1 = (b.x1 - ox) * inv[0], t2 = (b.x2 - ox) * inv[0];
        if (t1 > t2) { const q = t1; t1 = t2; t2 = q; }
        let tmin = t1, tmax = t2;
        t1 = (b.y1 - oy) * inv[1]; t2 = (b.y2 - oy) * inv[1];
        if (t1 > t2) { const q = t1; t1 = t2; t2 = q; }
        tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
        t1 = (b.z1 - oz) * inv[2]; t2 = (b.z2 - oz) * inv[2];
        if (t1 > t2) { const q = t1; t1 = t2; t2 = q; }
        tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
        if (tmax >= Math.max(0, tmin) && tmin < wall) wall = tmin;
      }
      // find the box that contains the ray origin (tmin<0<tmax)
      let insideBox = null;
      for (const b of g.world.colliders) {
        if (ox > b.x1 && ox < b.x2 && oy > b.y1 && oy < b.y2 && oz > b.z1 && oz < b.z2) {
          insideBox = { x1: b.x1, y1: b.y1, z1: b.z1, x2: b.x2, y2: b.y2, z2: b.z2 };
          break;
        }
      }
      window.LOG.push({ d: dist, miss: +miss.toFixed(2), wall: wall > 1e8 ? -1 : +wall.toFixed(1), tp: +tp.toFixed(1), oy: +oy.toFixed(1), inside: insideBox, sx: +shooter.x.toFixed(1), sz: +shooter.z.toFixed(1), sy: +shooter.y.toFixed(2) });
    };
  });
  await wait(15000);
  const log = await page.evaluate(() => window.LOG.slice(0, 45));
  console.log('shots at targets:', log.length);
  const insideCount = log.filter(l => l.inside).length;
  console.log('shots with origin inside a collider:', insideCount, '/', log.length);
  for (const l of log.slice(0, 10)) console.log(`  d=${l.d.toFixed(1)} miss=${l.miss} wallT=${l.wall} inside=${JSON.stringify(l.inside)} shooter=(${l.sx},${l.sz},${l.sy})`);
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }
