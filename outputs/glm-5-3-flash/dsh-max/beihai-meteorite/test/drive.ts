/**
 * 用 CDP 驱动 chrome-headless-shell 真实播放影片：
 * 截取多个时刻的画面、检查控制台异常、验证暂停/跳转。
 * 用法: bun test/drive.ts [--shots "3,30,60,..."]
 */

const CHROME_WS = process.env.CHROME_WS ?? "http://127.0.0.1:9222";
const FILM_URL = process.env.FILM_URL ?? "http://127.0.0.1:4173/?fast=1";
const OUT_DIR = process.env.OUT_DIR ?? "/tmp/frames";

interface Msg { id: number; method: string; params?: Record<string, unknown>; result?: unknown; error?: { message: string } }

const wsUrl = await (async () => {
  const res = await fetch(`${CHROME_WS}/json/new?${encodeURIComponent(FILM_URL)}`, { method: "PUT" });
  const tab = (await res.json()) as { webSocketDebuggerUrl: string };
  return tab.webSocketDebuggerUrl;
})();

const socket = new WebSocket(wsUrl);
await new Promise<void>((resolve, reject) => {
  socket.onopen = () => resolve();
  socket.onerror = (e) => reject(new Error("ws error"));
});

let nextId = 1;
const pending = new Map<number, (m: Msg) => void>();
const consoleLogs: string[] = [];
const exceptions: string[] = [];

socket.onmessage = (event) => {
  const m = JSON.parse(String(event.data)) as Msg & { method?: string; params?: Record<string, unknown> };
  if (m.id !== undefined && pending.has(m.id)) {
    pending.get(m.id)!(m);
    pending.delete(m.id);
    return;
  }
  if (m.method === "Runtime.consoleAPICalled") {
    const args = (m.params!.args as Array<{ value?: unknown }>).map((a) => String(a.value)).join(" ");
    consoleLogs.push(`[${m.params!.type}] ${args}`);
  } else if (m.method === "Runtime.exceptionThrown") {
    const detail = m.params!.exceptionDetails as { text?: string; exception?: { description?: string } };
    exceptions.push(detail.exception?.description ?? detail.text ?? "unknown");
  }
};

function send(method: string, params: Record<string, unknown> = {}): Promise<Msg> {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m)));
    socket.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        console.log(`  (timeout: ${method})`);
        resolve({ id, error: { message: "timeout" } });
      }
    }, 20000);
  });
}

async function evaluate<T>(expression: string): Promise<T> {
  try {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    return (res.result as { result?: { value?: T } }).result?.value as T;
  } catch {
    return undefined as T;
  }
}

async function screenshot(name: string): Promise<void> {
  try {
    const res = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
    const data = (res.result as { data?: string }).data;
    if (!data) return;
    await Bun.write(`${OUT_DIR}/${name}.jpg`, Buffer.from(data, "base64"));
    console.log(`shot ${name}`);
  } catch (e) {
    console.log(`  (screenshot failed: ${name})`);
  }
}

await send("Runtime.enable");
await send("Page.enable");
await new Promise((r) => setTimeout(r, 20000)); // 等待体素世界构建

let ready = false;
try {
  ready = await evaluate<boolean>("!document.querySelector('#loading')");
} catch {
  ready = true;
}
console.log("world ready:", ready);
if (!ready) {
  console.log(await evaluate<string>("document.body.innerText.slice(0,200)"));
}

// 全屏画布尺寸
await evaluate("document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen().catch(() => 0) : 0");
await new Promise((r) => setTimeout(r, 600));

const argShots = process.argv.find((a) => a.startsWith("--shots="));
const moments = argShots
  ? argShots.slice(8).split(",").map(Number)
  : [1, 6, 12, 18, 30, 40, 47, 55, 63, 76, 90, 96, 105, 114, 120, 130, 137, 146, 147.5, 152, 158, 166, 178, 185, 191, 201, 209, 215, 221, 228, 233, 240, 248, 253, 259, 266, 275, 286, 297, 310, 322, 326];

// 直接驱动播放器（无头环境无真实用户激活，音频自动挂起属预期）
await evaluate("window.__abPlayer.play(); 0");
await new Promise((r) => setTimeout(r, 800));

for (const t of moments) {
  try {
    await evaluate(`window.__abPlayer.seek(${t}); 0`);
    await new Promise((r) => setTimeout(r, 420));
    await screenshot(`t${String(t).replace(".", "_")}`);
  } catch (e) {
    console.log(`  (skip t=${t}: ${e})`);
    continue;
  }
  const state = await evaluate("({t: window.__abPlayer.currentTime, playing: window.__abPlayer.isPlaying})");
  process.stdout.write(`  t=${(state as { t: number }).t.toFixed(1)}  `);
}
console.log();

// 暂停（画面应停住）→ 再播放（时间应推进）
await evaluate("document.querySelector('[data-action=\"play\"]').click(); 0");
await new Promise((r) => setTimeout(r, 300));
const p1 = await evaluate<number>("window.__abPlayer.currentTime");
await new Promise((r) => setTimeout(r, 700));
const p2 = await evaluate<number>("window.__abPlayer.currentTime");
console.log(`paused: ${p1.toFixed(2)} -> ${p2.toFixed(2)} (should hold)`);
await evaluate("document.querySelector('[data-action=\"play\"]').click(); 0");
const t1 = await evaluate<number>("window.__abPlayer.currentTime");
await new Promise((r) => setTimeout(r, 900));
const t2 = await evaluate<number>("window.__abPlayer.currentTime");
console.log(`resumed: ${t1.toFixed(2)} -> ${t2.toFixed(2)} (should advance)`);
const ok = Math.abs(p2 - p1) < 0.001 && t2 > t1;
console.log("console errors:", exceptions.length, exceptions.slice(0, 5));
console.log("console warnings/errors sample:", consoleLogs.filter((l) => l.startsWith("[error") || l.startsWith("[warn")).slice(0, 8));
console.log(ok && exceptions.length === 0 ? "DRIVE OK" : "DRIVE FAILED");
process.exit(ok && exceptions.length === 0 ? 0 : 1);
