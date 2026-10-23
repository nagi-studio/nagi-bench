/**
 * AI battle simulation: runs the match at high speed and records a timeline
 * (rounds, kills, plants, defuses) to verify the 5v5 AI actually plays CS.
 */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const PORT = 4175;
const REAL_SECONDS = Number(process.argv[2] ?? 75);
const SPEED = Number(process.argv[3] ?? 6);
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const waitForPort = async (port, tries = 60) => {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(`http://localhost:${port}/`); if (r.ok) return true; } catch { /* retry */ }
    await wait(400);
  }
  return false;
};

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
const errors = [];
let browser;
try {
  if (!await waitForPort(PORT)) throw new Error('server did not start');
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 500 });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('ERROR: ' + m.text()); });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t');
  await page.click('.play');
  await wait(1500);

  await page.evaluate((speed) => { const g = window.__game; g.speed = speed; g.renderEnabled = false; }, SPEED);

  const samples = [];
  const t0 = Date.now();
  while ((Date.now() - t0) / 1000 < REAL_SECONDS) {
    await wait(3000);
    const s = await page.evaluate(() => {
      const g = window.__game;
      return {
        t: g.time.toFixed(0), round: g.round, phase: g.phase,
        T: g.scoreT, CT: g.scoreCT, bomb: g.bomb.state, site: g.bomb.site,
        aliveT: g.characters.filter(c => c.team === 'T' && c.alive).length,
        aliveCT: g.characters.filter(c => c.team === 'CT' && c.alive).length,
        kills: g.characters.reduce((a, c) => a + c.kills, 0),
        plants: g.plantCount ?? 0,
      };
    });
    samples.push(s);
    console.log(`t=${s.t.padStart(4)} r${s.round} ${s.phase.padEnd(7)} T ${s.T}-${s.CT} CT  bomb=${s.bomb}${s.site ? '@' + s.site : ''}  alive ${s.aliveT}v${s.aliveCT}  kills=${s.kills}`);
  }
  const final = samples[samples.length - 1];
  console.log('\n--- summary ---');
  console.log(`rounds played: ${final.round}, score T:${final.T} CT:${final.CT}, total kills: ${final.kills}, last bomb: ${final.bomb}`);
  const problems = [];
  if (final.round < 2) problems.push('fewer than 2 rounds completed');
  if (final.kills < 3) problems.push('bots barely killed each other');
  const planted = samples.some(s => s.bomb === 'planted');
  const exploded = samples.some(s => s.bomb === 'exploded');
  console.log(`plants observed: ${planted}, explosions: ${exploded}`);
  if (errors.length) { console.log(`\nCONSOLE ERRORS (${errors.length}):\n` + errors.slice(0, 12).join('\n')); problems.push('console errors'); }
  console.log(problems.length ? '\nSIM ISSUES: ' + problems.join('; ') : '\nSIM OK');
  process.exit(problems.length ? 1 : 0);
} catch (e) {
  console.error('SIM FAILED:', e.message);
  process.exit(1);
} finally {
  if (browser) await browser.close();
  try { process.kill(-server.pid); } catch { /* gone */ }
}
