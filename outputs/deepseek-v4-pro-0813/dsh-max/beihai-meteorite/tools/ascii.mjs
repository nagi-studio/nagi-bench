/* ASCII-render a frame: 64x36 chars, classified by hue/brightness. */
const CDP_HTTP = "http://localhost:9222";
async function connect() {
  const targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
  const target = targets.find((t) => t.type === "page" && t.url.includes("4173"));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id !== undefined && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => { const mid = ++id; pending.set(mid, resolve); ws.send(JSON.stringify({ id: mid, method, params })); });
  return { ws, send };
}
const { ws, send } = await connect();
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Page.navigate", { url: "http://localhost:4173/?v=" + Date.now() });
await new Promise((r) => setTimeout(r, 4500));
const expr = (code) => send("Runtime.evaluate", { expression: code, returnByValue: true });

const ASCII = `
(() => {
  const cv = document.querySelector('#stage canvas');
  const c = document.createElement('canvas'); c.width = 96; c.height = 54;
  const ctx = c.getContext('2d'); ctx.drawImage(cv, 0, 0, 96, 54);
  const d = ctx.getImageData(0, 0, 96, 54).data;
  let out = "";
  for (let y = 0; y < 54; y++) {
    let row = "";
    for (let x = 0; x < 96; x++) {
      const i = (y * 96 + x) * 4;
      const R = d[i], G = d[i+1], B = d[i+2];
      const mx = Math.max(R,G,B), mn = Math.min(R,G,B);
      const sat = mx - mn;
      let ch = " ";
      if (mx < 8) ch = ".";
      else if (mx < 28) ch = ":";
      else if (sat < 14 && mx < 90) ch = "o";      // gray mid
      else if (B > R + 24 && B > G + 10) ch = "b"; // blue
      else if (B > R + 10) ch = "c";               // cyan
      else if (R > G + 26 && G > B) ch = "y";      // yellow-orange
      else if (R > B + 30 && R > G) ch = "r";      // red
      else if (G > R + 18 && G > B) ch = "g";      // green
      else if (mx > 200) ch = "#";                 // white
      else if (mx > 150) ch = "W";
      else if (mx > 100) ch = "w";
      else if (mx > 60) ch = "+";
      else ch = "-";
      row += ch;
    }
    out += row + "\\n";
  }
  return out;
})()
`;

const times = (process.argv[2] ?? "0").split(",").map(Number);
for (const t of times) {
  await expr(`window.__film.player.seek(${t}); window.__film.player.refresh();`);
  const ci = await expr(`window.__film.world.camera.position.toArray().join(',')`);
  console.log("cam:", ci.result.result.value);
  await new Promise((r) => setTimeout(r, 400));
  const r = await expr(ASCII);
  console.log(`\n========== t=${t} ==========`);
  console.log(r.result.result.value);
}
ws.close();
