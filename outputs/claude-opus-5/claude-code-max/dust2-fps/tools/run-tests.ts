/**
 * Runs every headless suite in sequence: `npm test`.
 *
 * These use Node's native TypeScript support (Node >= 22.6), which is possible because the
 * simulation layer has no three.js or React dependency.
 */

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const here = import.meta.dirname;

const SUITES = [
  ['static analysis', 'statictest.ts'],
  ['map and navigation', 'maptest.ts'],
  ['gameplay simulation', 'simtest.ts'],
  ['render layer', 'rendertest.ts'],
] as const;

let failed = 0;

for (const [label, file] of SUITES) {
  console.log(`\n\x1b[1m\x1b[36m═══ ${label} (${file}) ═══\x1b[0m`);
  const result = spawnSync(process.execPath, [join(here, file)], { stdio: 'inherit' });
  if (result.status !== 0) {
    failed++;
    console.log(`\x1b[31msuite failed: ${file}\x1b[0m`);
  }
}

if (failed > 0) {
  console.log(`\n\x1b[31m${failed} suite(s) failed\x1b[0m`);
  process.exit(1);
}
console.log('\n\x1b[32mall suites passed\x1b[0m');
