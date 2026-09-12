/* Minimal CDP driver over the built-in WebSocket (Node >= 22). */
/* Usage: node cdp.mjs <command> [args]                                 */

const CDP_HTTP = "http://localhost:9222";
const PAGE_URL = process.env.PAGE_URL ?? "http://localhost:4173/";

async function getWsUrl() {
  // reuse existing target or create one
  let targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
  let target = targets.find((t) => t.type === "page" && t.url.includes("localhost:4173"));
  if (!target) {
    target = await (await fetch(`${CDP_HTTP}/json/new?${encodeURIComponent(PAGE_URL)}`, { method: "PUT" })).json();
  }
  return target.webSocketDebuggerUrl;
}

async function connect() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const cmd = process.argv[2];
  const { ws, send, events } = await connect();
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await sleep(600);

  if (cmd === "shot") {
    const times = (process.argv[3] ?? "0,15,34,60,95,130,147,175,212,224.4,240,280,305,322,327,335,345,347.9").split(",").map(Number);
    for (const t of times) {
      await send("Runtime.evaluate", { expression: `window.__film.player.seek(${t}); window.__film.player.refresh();` });
      await sleep(350);
      const shot = await send("Page.captureScreenshot", { format: "png" });
      const fs = await import("node:fs");
      fs.writeFileSync(`/tmp/shots/frame-${String(t).replace(".", "_")}.png`, Buffer.from(shot.data, "base64"));
      console.log(`saved t=${t}`);
    }
  } else if (cmd === "playtest") {
    // click play, verify timeline advances, pause, seek, console check
    await send("Runtime.evaluate", { expression: `document.querySelector('[data-action="play"]').click()` });
    await sleep(1500);
    const t1 = await send("Runtime.evaluate", { expression: "window.__film.player.currentTime", returnByValue: true });
    await sleep(2000);
    const t2 = await send("Runtime.evaluate", { expression: "window.__film.player.currentTime", returnByValue: true });
    const st = await send("Runtime.evaluate", { expression: "window.__film.player.state", returnByValue: true });
    console.log("playing:", t1.result.value, "->", t2.result.value, "state:", st.result.value);
    // pause
    await send("Runtime.evaluate", { expression: `document.querySelector('[data-action="play"]').click()` });
    await sleep(400);
    const st2 = await send("Runtime.evaluate", { expression: "window.__film.player.state", returnByValue: true });
    console.log("after pause:", st2.result.value);
    // seek to midpoint via slider
    await send("Runtime.evaluate", { expression: `const s=document.querySelector('[data-action="seek"]'); s.value=174; s.dispatchEvent(new Event('input'));` });
    await sleep(400);
    const t3 = await send("Runtime.evaluate", { expression: "window.__film.player.currentTime", returnByValue: true });
    console.log("after seek:", t3.result.value);
    // resume
    await send("Runtime.evaluate", { expression: `document.querySelector('[data-action="play"]').click()` });
    await sleep(1200);
    const t4 = await send("Runtime.evaluate", { expression: "window.__film.player.currentTime", returnByValue: true });
    console.log("resumed:", t4.result.value);
  } else if (cmd === "console") {
    await send("Runtime.evaluate", { expression: `window.__film.player.seek(120); window.__film.player.refresh();` });
    await sleep(2500);
    const errors = events.filter((e) => e.method === "Runtime.exceptionThrown" || e.method === "Log.entryAdded");
    console.log("console events:", errors.length);
    for (const e of errors.slice(0, 10)) {
      console.log(JSON.stringify(e).slice(0, 500));
    }
  }
  ws.close();
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
