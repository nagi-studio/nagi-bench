/** Measure where bullets go relative to the intended target. */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4179;
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
  await page.setViewport({ width: 500, height: 360 });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t'); await page.click('.play');
  await wait(1200);
  await page.evaluate(() => {
    const g = window.__game; g.speed = 5;
    window.M = [];
    const orig = g.fireBullet.bind(g);
    g.fireBullet = (shooter, ox, oy, oz, dx, dy, dz, def) => {
      const t = shooter.brain?.target;
      const res = orig(shooter, ox, oy, oz, dx, dy, dz, def);
      if (t) {
        // perpendicular miss distance from the ray to the target chest
        const px = t.x - ox, py = (t.y + 1.3) - oy, pz = t.z - oz;
        const tp = px * dx + py * dy + pz * dz;
        const cx = px - dx * tp, cy = py - dy * tp, cz = pz - dz * tp;
        window.M.push({ d: Math.hypot(t.x - ox, t.z - oz).toFixed(1), miss: Math.hypot(cx, cy, cz).toFixed(2), tp: tp.toFixed(1), yaw: shooter.yaw.toFixed(2) });
      }
      return res;
    };
  });
  await wait(20000);
  const m = await page.evaluate(() => window.M.slice(0, 40));
  console.log('shots with a target:', m.length);
  for (const r of m) console.log(`  dist=${r.d}  miss=${r.miss}  projT=${r.tp}  yaw=${r.yaw}`);
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }
