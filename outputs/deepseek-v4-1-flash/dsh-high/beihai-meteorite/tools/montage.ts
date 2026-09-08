/** Compose a contact sheet from rendered PNGs (offline tool). */
import { createRequire } from "node:module";
import { readdirSync } from "node:fs";
const req = createRequire(import.meta.url);
// @ts-ignore platform-provided encoder
const sharp: any = req("/home/DuanZ/.dsh-launcher/node_modules/sharp");

const dir = process.argv[2] ?? "preview/sheet";
const out = process.argv[3] ?? "preview/contact.png";
const cols = parseInt(process.argv[4] ?? "5", 10);
const files = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
if (!files.length) throw new Error("no frames");
const meta = await sharp(`${dir}/${files[0]}`).metadata();
const w = meta.width;
const h = meta.height;
const rows = Math.ceil(files.length / cols);
const comps: any[] = [];
files.forEach((f, i) => {
  comps.push({ input: `${dir}/${f}`, left: (i % cols) * w, top: Math.floor(i / cols) * h });
});
await sharp({ create: { width: cols * w, height: rows * h, channels: 3, background: { r: 8, g: 8, b: 10 } } })
  .composite(comps)
  .png()
  .toFile(out);
console.log(`montage ${files.length} frames -> ${out} (${cols * w}x${rows * h})`);
