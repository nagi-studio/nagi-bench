import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4184;
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
    window.D = [];
    for (const c of g.characters) {
      if (!c.brain) continue;
      const orig = c.startReload.bind(c);
      let calls = 0;
      c.startReload = (now) => { calls++; return orig(now); };
      c._reloadCalls = () => calls;
    }
  });
  for (let i = 0; i < 8; i++) {
    await wait(2500);
    const o = await page.evaluate(() => {
      const g = window.__game;
      const cs = g.characters.filter(c => c.brain && c.alive).slice(0, 4);
      return cs.map(c => `${c.name.slice(0,5)} mag=${c.current().mag} rEnd=${c.reloadEnd === -1 ? '-' : (c.reloadEnd - g.time).toFixed(1)} calls=${c._reloadCalls()} fire=${c.firing} tgt=${c.brain.target ? 'Y' : 'n'}`).join(' | ');
    });
    console.log(`t=?? ${o}`);
  }
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }
