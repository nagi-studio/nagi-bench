// Syntax-check every TS/TSX source with Bun's transpiler (no type checking).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../src');
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f)) files.push(p);
  }
})(root);
let bad = 0;
for (const f of files) {
  const loader = f.endsWith('.tsx') ? 'tsx' : 'ts';
  const tr = new Bun.Transpiler({ loader });
  try {
    tr.transformSync(readFileSync(f, 'utf8'));
    console.log('ok   ', f.slice(root.length - 3));
  } catch (e) {
    bad++;
    console.error('FAIL ', f, '\n', String(e.message).slice(0, 400));
  }
}
console.log(bad === 0 ? 'ALL SYNTAX OK' : `${bad} SYNTAX FAILURES`);
process.exit(bad ? 1 : 0);
