// 用法: bun check/shot.mjs <seek秒> <out.png> [waitMs]
// 以 ?seek=N 快进物理到 N 秒后立即截图,便于逐镜头调试
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
const [seek, out, waitMs = 1200] = process.argv.slice(2);
const root = '/workspace/dist';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.wasm': 'application/wasm' };
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('[console.error]', m.text()); });
await page.route('**/*', async (route) => {
  const u = new URL(route.request().url());
  if (u.origin !== 'http://shot.local') return route.abort();
  let p = u.pathname; if (p.endsWith('/')) p += 'index.html';
  try { const body = await readFile(join(root, p)); route.fulfill({ status: 200, body, contentType: TYPES[extname(p)] ?? 'application/octet-stream' }); }
  catch { route.fulfill({ status: 404, body: 'nf' }); }
});
await page.goto(`http://shot.local/?seek=${seek}`, { waitUntil: 'load' });
await page.waitForTimeout(Number(waitMs));
const info = await page.evaluate(() => {
  const THREE = window.__THREE__;
  const c = window.__film.visuals.camera;
  const out = { cam: c.position.toArray().map(v => +v.toFixed(2)), sim: +window.__film.machine.time.toFixed(2), hits: [] };
  if (THREE) {
    const rc = new THREE.Raycaster();
    rc.params.Points.threshold = 0.001;
    for (const [nx, ny] of [[-0.2, -0.1], [0.0, -0.2], [-0.5, -0.3], [0.3, 0.3]]) {
      rc.setFromCamera(new THREE.Vector2(nx, ny), c);
      const hs = rc.intersectObjects(window.__film.visuals.scene.children, true).slice(0, 2);
      out.hits.push(hs.map(h => {
        h.object.geometry.computeBoundingBox();
        const bb = h.object.geometry.boundingBox;
        return {
          d: +h.distance.toFixed(2),
          p: h.point.toArray().map(v => +v.toFixed(2)),
          col: h.object.material && h.object.material.color ? '#' + h.object.material.color.getHexString() : null,
          type: h.object.geometry ? h.object.geometry.type : h.object.type,
          obj: h.object.position.toArray().map(v => +v.toFixed(2)),
          bb: [bb.min.toArray().map(v => +v.toFixed(2)), bb.max.toArray().map(v => +v.toFixed(2))],
          parent: h.object.parent.type,
        };
      }));
    }
  }
  return out;
});
console.log(JSON.stringify(info));
await page.screenshot({ path: out, timeout: 120000 });
await browser.close();
