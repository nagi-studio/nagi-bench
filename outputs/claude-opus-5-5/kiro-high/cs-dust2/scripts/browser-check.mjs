// Dev-only smoke test: launches headless Edge/Chrome, opens the game, collects console
// errors, evaluates engine state through window.__game and captures screenshots.
// Usage: node scripts/browser-check.mjs <url> <seconds> [shotEverySeconds] [evalFile]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error('no chromium browser found');
const url = process.argv[2] ?? 'http://localhost:5173/?demo';
const seconds = Number(process.argv[3] ?? 20);
const shotEvery = Number(process.argv[4] ?? 10);
const evalFile = process.argv[5];
const port = 9300 + Math.floor(Math.random() * 500);
mkdirSync('.tmp', { recursive: true });
const profile = join(tmpdir(), `fps-check-${port}`);
const proc = spawn(browser, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1280,720',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  '--autoplay-policy=no-user-gesture-required',
  '--no-first-run',
  `--user-data-dir=${profile}`,
  'about:blank',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list;
for (let i = 0; i < 50; i++) {
  try {
    list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    if (list.find((t) => t.type === 'page')) break;
  } catch {}
  await sleep(200);
}
const page = list.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
const logs = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === 'Runtime.consoleAPICalled') {
    const text = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
    logs.push(`[console.${msg.params.type}] ${text}`);
  } else if (msg.method === 'Runtime.exceptionThrown') {
    const d = msg.params.exceptionDetails;
    logs.push(`[EXCEPTION] ${d.exception?.description ?? d.text}`);
  } else if (msg.method === 'Log.entryAdded') {
    const e = msg.params.entry;
    if (e.level === 'error' || e.level === 'warning') logs.push(`[log.${e.level}] ${e.text}`);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const mid = ++id;
    pending.set(mid, resolve);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description;
};

await send('Runtime.enable');
await send('Log.enable');
await send('Page.enable');
await send('Page.navigate', { url });
const extra = evalFile ? readFileSync(evalFile, 'utf8') : null;
const stateExpr = `(() => { const g = window.__game; if (!g) return 'no game';
  const r = g.round; const alive = g.soldiers.map(s => s.team + ':' + s.name + (s.alive ? '' : '(dead)') + '@' + s.pos.x.toFixed(1) + ',' + s.pos.z.toFixed(1) + ' ' + (s.brain ? s.brain.state : '')).join(' | ');
  return JSON.stringify({ t: g.time.toFixed(1), round: r.round, type: r.roundType, phase: r.phase, score: r.score, bomb: r.bomb.state, site: r.bomb.site, fps: g.store.get().fps, kills: g.soldiers.reduce((a,s)=>a+s.kills,0), alive }); })()`;

let shot = 0;
const start = Date.now();
let nextShot = shotEvery;
while ((Date.now() - start) / 1000 < seconds) {
  await sleep(1000);
  const el = (Date.now() - start) / 1000;
  if (el >= nextShot) {
    nextShot += shotEvery;
    console.log(`t=${el.toFixed(0)}s`, await evaluate(stateExpr));
    if (extra) console.log('eval:', await evaluate(extra));
    const r = await send('Page.captureScreenshot', { format: 'png' });
    if (r.result?.data) {
      const f = `.tmp/shot-${shot++}.png`;
      writeFileSync(f, Buffer.from(r.result.data, 'base64'));
      console.log('screenshot', f);
    }
  }
}
console.log('---- browser logs ----');
console.log(logs.slice(0, 60).join('\n') || '(none)');
ws.close();
proc.kill();
process.exit(0);
