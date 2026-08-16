import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

/**
 * `?inline` asset imports → base64 data URLs.
 * The pinned rolldown-based Vite build treats `.ogg` as an unknown asset and
 * refuses to resolve it, so this plugin implements the documented `?inline`
 * query directly on the filesystem (all such imports are relative project
 * paths) and hands the cinematic runtime the `data:audio/*;base64` URLs it
 * requires.
 */
function inlineAssets(): Plugin {
  const MIME: Record<string, string> = {
    ".ogg": "audio/ogg",
    ".oga": "audio/ogg",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".flac": "audio/flac",
  };
  return {
    name: "agentbench-inline-assets",
    enforce: "pre",
    resolveId(source, importer) {
      if (!source.endsWith("?inline")) return null;
      const base = source.slice(0, -"?inline".length);
      const dir = importer ? dirname(importer) : process.cwd();
      let file = resolve(dir, base);
      if (!existsSync(file)) file = resolve(process.cwd(), base);
      return file + "?inline";
    },
    load(id) {
      if (!id.endsWith("?inline")) return null;
      const file = id.slice(0, -"?inline".length);
      if (!existsSync(file)) return null;
      const data = readFileSync(file);
      const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
      const mime = MIME[ext] ?? "application/octet-stream";
      const base64 = data.toString("base64");
      return `export default "data:${mime};base64,${base64}";`;
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [inlineAssets()],
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 4000,
  },
});
