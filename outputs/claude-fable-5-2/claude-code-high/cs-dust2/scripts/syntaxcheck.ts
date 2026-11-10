// Transpile-only syntax check of every source file (no type checking):  bun run scripts/syntaxcheck.ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

declare const Bun: { Transpiler: new (o: { loader: string }) => { transformSync(code: string): string } };

function walk(dir: string, out: string[]): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

const root = join(import.meta.dir, '..');
const files = [...walk(join(root, 'src'), []), ...walk(join(root, 'scripts'), [])];
let failed = 0;
let lines = 0;
for (const f of files) {
  const code = readFileSync(f, 'utf8');
  lines += code.split('\n').length;
  try {
    new Bun.Transpiler({ loader: f.endsWith('x') ? 'tsx' : 'ts' }).transformSync(code);
  } catch (e) {
    failed++;
    console.log('SYNTAX ERROR in', f, '\n', String(e));
  }
}
console.log(`${files.length} files, ${lines} lines, ${failed} with syntax errors`);
if (failed) process.exit(1);
