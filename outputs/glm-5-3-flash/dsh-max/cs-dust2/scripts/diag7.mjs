import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4182;
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
  await wait(1500);
  console.log(await page.evaluate(() => ({
    vis: document.visibilityState,
    hasGame: !!window.__game,
    t0: window.__game?.time.toFixed(2),
    phase: window.__game?.phase,
  })));
  await page.evaluate(() => {
    window.__game.speed = 6; window.__game.renderEnabled = false;
    window._raf = 0;
    const loop = () => { window._raf++; requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });
  await wait(3000);
  console.log(await page.evaluate(() => ({
    raf: window._raf, t: window.__game.time.toFixed(2), phase: window.__game.phase,
    vis: document.visibilityState,
  })));
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }
