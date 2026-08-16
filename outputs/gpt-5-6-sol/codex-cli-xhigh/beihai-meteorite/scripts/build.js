import { build } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

await build();

const dist = resolve(process.cwd(), "dist");
const indexPath = resolve(dist, "index.html");
let html = await readFile(indexPath, "utf8");

const scriptMatch = html.match(/<script type="module" crossorigin src="\.\/([^"]+)"><\/script>/);
const styleMatch = html.match(/<link rel="stylesheet" crossorigin href="\.\/([^"]+)">/);

if (!scriptMatch || !styleMatch) {
  throw new Error("Vite output did not contain the expected local JS and CSS references");
}

const [javascript, css] = await Promise.all([
  readFile(resolve(dist, scriptMatch[1]), "utf8"),
  readFile(resolve(dist, styleMatch[1]), "utf8"),
]);

html = html
  .replace(scriptMatch[0], `<script type="module">${javascript.replaceAll("</script", "<\\/script")}</script>`)
  .replace(styleMatch[0], `<style>${css.replaceAll("</style", "<\\/style")}</style>`);

await writeFile(indexPath, html);
console.log(`Standalone cinematic: ${indexPath}`);
