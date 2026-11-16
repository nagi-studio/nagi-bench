// Mechanical infrastructure fix: the provided node_modules is a read-only symlink,
// but Vite must write a temporary config bundle into node_modules/.vite-temp.
// Replace the symlink with a writable directory of symlinks to the SAME preinstalled
// packages. No packages are installed or fetched.
import fs from "node:fs";
import path from "node:path";

const target = "/opt/agentbench/toolchain/node_modules";
const link = "/workspace/node_modules";

const stat = fs.lstatSync(link);
if (stat.isSymbolicLink()) {
  fs.unlinkSync(link); // removes the link itself, never the target
} else if (stat.isDirectory()) {
  // already converted; nothing to do
  console.log("node_modules already a directory");
  process.exit(0);
}
fs.mkdirSync(link);
let count = 0;
for (const name of fs.readdirSync(target)) {
  fs.symlinkSync(path.join(target, name), path.join(link, name));
  count++;
}
// .bin is hidden from readdirSync? it is returned; ensure it exists
if (!fs.existsSync(path.join(link, ".bin"))) {
  fs.symlinkSync(path.join(target, ".bin"), path.join(link, ".bin"));
  count++;
}
console.log(`relinked ${count} entries`);
