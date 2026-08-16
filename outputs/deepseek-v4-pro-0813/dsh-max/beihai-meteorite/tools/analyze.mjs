/* In-page visual + scene verification via CDP (Node >= 22, built-in WebSocket). */

const CDP_HTTP = "http://localhost:9222";
const PAGE_URL = "http://localhost:4173/";

async function connect() {
  let targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
  let target = targets.find((t) => t.type === "page" && t.url.includes("localhost:4173"));
  if (!target) {
    target = await (await fetch(`${CDP_HTTP}/json/new?${encodeURIComponent(PAGE_URL)}`, { method: "PUT" })).json();
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id !== undefined && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    } else if (msg.method) {
      events.push(msg);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  return { ws, send, events };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* in-page: read a 6x4 grid of average RGB from the webgl canvas */
const GRID_STATS = `
(() => {
  const cv = document.querySelector('#stage canvas');
  const c = document.createElement('canvas');
  c.width = 192; c.height = 108;
  const ctx = c.getContext('2d');
  ctx.drawImage(cv, 0, 0, 192, 108);
  const d = ctx.getImageData(0, 0, 192, 108).data;
  const cols = 6, rows = 4;
  const out = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let cc = 0; cc < cols; cc++) {
      let R = 0, G = 0, B = 0, n = 0;
      for (let y = r * 27; y < (r + 1) * 27; y++) {
        for (let x = cc * 32; x < (cc + 1) * 32; x++) {
          const i = (y * 192 + x) * 4;
          R += d[i]; G += d[i + 1]; B += d[i + 2]; n++;
        }
      }
      row.push([Math.round(R / n), Math.round(G / n), Math.round(B / n)]);
    }
    out.push(row);
  }
  return out;
})()
`;

const PROJECT = `
  const T = window.__film.three;
(() => {
  const w = window.__film.world;
  const cam = w.camera;
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  const names = [
    ["zhang", w.figures.zhang.root.position],
    ["collector", w.figures.collector.root.position],
    ["zhangS", w.figures.zhangSpace.root.position],
    ["station", w.sets.space.station.position],
    ["sun", w.sets.space.sun.position],
    ["group0", w.figures.group[0].figure.root.position],
    ["base1", w.sets.space.baseOne.position],
    ["zhangWS", w.figures.zhangWorkshop.root.position],
    ["zhangBS", w.figures.zhangBasement.root.position],
  ];
  const out = {};
  for (const [n, p] of names) {
    const v = new T.Vector3(p.x, p.y, p.z);
    v.project(cam);
    out[n] = [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)];
  }
  out.camPos = [+cam.position.x.toFixed(1), +cam.position.y.toFixed(1), +cam.position.z.toFixed(1)];
  const dir = new T.Vector3();
  cam.getWorldDirection(dir);
  out.camDir = [dir.x.toFixed(2), dir.y.toFixed(2), dir.z.toFixed(2)];
  out.vis = {};
  for (const k of ["courtyard","room","office","workshop","basement","space","cabin","bay"]) {
    const s = w.sets[k];
    out.vis[k] = ("group" in s ? s.group.visible : s.visible);
  }
  return out;
})()
`;

async function main() {
  const times = process.argv.slice(2).map(Number);
  if (times.length === 0) {
    console.error("usage: node analyze.mjs <t1> <t2> ...");
    process.exit(1);
  }
  const { ws, send, events } = await connect();
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "http://localhost:4173/?t=" + Date.now() });
  await sleep(4500);
  for (const t of times) {
    await send("Runtime.evaluate", {
      expression: `window.__film.player.seek(${t}); window.__film.player.refresh();`,
    });
    await sleep(320);
    const g = await send("Runtime.evaluate", { expression: GRID_STATS, returnByValue: true });
    const p = await send("Runtime.evaluate", { expression: PROJECT, returnByValue: true });
    console.log(`== t=${t}`);
    const grid = g.result.value;
    for (const row of grid) {
      console.log("  " + row.map(([r, g2, b]) => `(${r},${g2},${b})`).join(" "));
    }
    const proj = p.result.value;
    console.log("  cam", proj.camPos, "dir", proj.camDir);
    console.log("  vis", JSON.stringify(proj.vis));
    for (const k of ["zhang", "collector", "zhangS", "station", "sun", "group0", "base1", "zhangWS", "zhangBS"]) {
      const v = proj[k];
      if (v) {
        const inFrame = Math.abs(v[0]) <= 1.1 && Math.abs(v[1]) <= 1.1 && v[2] < 1;
        console.log(`  ${k} ndc=(${v[0]},${v[1]}) depth=${v[2]} inFrame=${inFrame}`);
      }
    }
  }
  const errs = events.filter((e) => e.method === "Runtime.exceptionThrown");
  console.log("exceptions:", errs.length);
  for (const e of errs.slice(0, 5)) console.log(JSON.stringify(e).slice(0, 400));
  ws.close();
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
