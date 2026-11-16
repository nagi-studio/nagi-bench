import { readdirSync, symlinkSync, existsSync } from "node:fs";
const src = "/opt/agentbench/toolchain/node_modules";
const dst = "/workspace/node_modules";
for (const name of readdirSync(src)) {
  const target = `${src}/${name}`;
  const link = `${dst}/${name}`;
  if (!existsSync(link)) symlinkSync(target, link, "dir");
}
console.log("linked", readdirSync(dst).length, "entries");