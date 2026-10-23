// 自检: 加载页面 → 点播放 → 逐个时间点快进 → 截图 + 收集报错
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const OUT = process.env.OUT ?? "shots";
const TIMES = (process.env.TIMES ?? "0.5,3,8,14,20,27,31").split(",").map(Number);
const BROWSER = "/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: BROWSER, chromiumSandbox: false,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist",
         "--disable-dev-shm-usage", "--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log(`[console.${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => console.log(`[pageerror] ${e.message}`));

await page.route("**/*", async (route) => {
  const url = new URL(route.request().url());
  if (url.hostname !== "localhost") return route.abort();
  await route.continue();
});
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const DIST = process.cwd() + "/dist";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm" };
const handler = async (route) => {
  const url = new URL(route.request().url());
  let p = normalize(decodeURIComponent(url.pathname));
  if (p.endsWith("/")) p += "index.html";
  try { const body = await readFile(join(DIST, p));
    await route.fulfill({ status: 200, body, contentType: TYPES[extname(p)] ?? "application/octet-stream" });
  } catch { await route.fulfill({ status: 404 }); }
};
await page.unroute("**/*");
await page.route("**/*", handler);
await page.goto("http://localhost/index.html");
await page.click("#play");
await page.waitForFunction(() => window.__seek !== undefined, null, { timeout: 30000 });

for (const tm of TIMES) {
  await page.evaluate((x) => window.__seek(x), tm);
  await page.evaluate(() => window.__shot());
  await page.waitForTimeout(120);
  await page.screenshot({ path: `${OUT}/t${String(tm).padStart(4, "0").replace(".", "_")}s.png` });
  console.log(`[shot] t=${tm}  filmT=${await page.evaluate(() => window.__filmT)}`);
}
await browser.close();
console.log("done");
