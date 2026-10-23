import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4187;
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
  await page.evaluate(() => { const g = window.__game; g.speed = 6; g.renderEnabled = false; });
  for (let i = 0; i < 18; i++) {
    await wait(2000);
    const o = await page.evaluate(() => {
      const g = window.__game;
      const c = g.characters.find(x => x.hasC4 && x.alive) || g.characters.find(x => x.team === 'T' && x.brain && x.alive);
      if (!c) return 'no carrier';
      const b = c.brain;
      if (!b) return 'carrier is player';
      const wps = b.path.map(p => `(${p.x.toFixed(0)},${p.z.toFixed(0)})`).join(' ');
      const wp = b.path[b.pathIdx];
      return `${c.name.slice(0,5)} @(${c.x.toFixed(1)},${c.z.toFixed(1)}) goal=${b.goalKey}(${b.goal ? b.goal.x.toFixed(0) + ',' + b.goal.z.toFixed(0) : '-'}) idx=${b.pathIdx}/${b.path.length} path=[${wps}] wp=${wp ? `(${wp.x.toFixed(0)},${wp.z.toFixed(0)})` : '-'} stuck=${b.stuckTime.toFixed(1)} tgt=${b.target ? b.target.name.slice(0, 4) : '-'} lke=${b.lastKnownEnemy ? `(${b.lastKnownEnemy.x.toFixed(0)},${b.lastKnownEnemy.z.toFixed(0)})` : '-'} yaw=${c.yaw.toFixed(2)} mf=${c.moveFwd.toFixed(2)} site=${g.tacticSite}`;
    });
    console.log(`[${i}] ${o}`);
  }
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }
