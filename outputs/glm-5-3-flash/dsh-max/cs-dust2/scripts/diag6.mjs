/** Dump engage() internals for bots that have a target. */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4181;
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
  await wait(1000);
  await page.evaluate(() => {
    const g = window.__game; g.speed = 6; g.renderEnabled = false;
    // patch: expose engage internals by wrapping canSee
    window.S = [];
    const cs = g.canSee.bind(g);
    g.canSee = (a, b) => { const r = cs(a, b); window.S.push({ a: a.name, b: b.name, r }); return r; };
  });
  for (let i = 0; i < 14; i++) {
    await wait(2000);
    const o = await page.evaluate(() => {
      const g = window.__game;
      const engaged = g.characters.filter(c => c.brain && c.brain.target && c.alive);
      const sees = window.S.filter(s => s.r).length, total = window.S.length;
      window.S = [];
      const lines = engaged.slice(0, 3).map(c => {
        const b = c.brain, t = b.target;
        const d = Math.hypot(t.x - c.x, t.z - c.z);
        const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);
        const dx = t.x - c.x, dz = t.z - c.z;
        const aligned = Math.abs(Math.atan2(dx, dz) + b.aimErrX - c.yaw) < 0.06;
        return `${c.name.slice(0,5)}→${t.name.slice(0,5)} d=${d.toFixed(0)} los? last=${b.targetSeenAt.toFixed(1)} fire=${c.firing} mag=${c.current().mag} y=${c.yaw.toFixed(2)} want=${Math.atan2(dx, dz).toFixed(2)} hp=${t.hp ?? t.health}`;
      });
      return `t=${g.time.toFixed(0)} sees=${sees}/${total} | ${lines.join(' || ')}`;
    });
    console.log(o);
  }
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }
