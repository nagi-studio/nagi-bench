// Parses every .ts source with Node's type-stripping loader (syntax check without a bundler).
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const files: string[] = [];
const walk = (d: string) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts')) files.push(p);
  }
};
walk('src');
let bad = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, ['--experimental-strip-types', '--check', f], { encoding: 'utf8' });
  const err = (r.stderr || '').split('\n').filter((l) => l && !/ExperimentalWarning|--trace-warnings|Type Stripping/.test(l));
  if (r.status !== 0) {
    bad++;
    console.log(`FAIL ${f}\n${err.slice(0, 8).join('\n')}`);
  }
}
console.log(`${files.length - bad}/${files.length} files parse OK`);
