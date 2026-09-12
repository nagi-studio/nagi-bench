/** Tiny assertion harness for the headless tests in this folder. */

let passed = 0;
let failed = 0;
const failures: string[] = [];

export function section(name: string): void {
  console.log(`\n\x1b[1m── ${name} ──\x1b[0m`);
}

export function check(label: string, ok: boolean, detail = ''): boolean {
  if (ok) {
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${label}${detail ? `  \x1b[90m${detail}\x1b[0m` : ''}`);
  } else {
    failed++;
    failures.push(label);
    console.log(`  \x1b[31m✗ ${label}\x1b[0m${detail ? `  ${detail}` : ''}`);
  }
  return ok;
}

export function skip(label: string, reason: string): void {
  console.log(`  \x1b[33m•\x1b[0m ${label}  \x1b[90mskipped: ${reason}\x1b[0m`);
}

export function report(): void {
  console.log(`\n${failed === 0 ? '\x1b[32m' : '\x1b[31m'}${passed} passed, ${failed} failed\x1b[0m`);
  if (failed > 0) {
    for (const f of failures) console.log(`  failed: ${f}`);
    process.exitCode = 1;
  }
}
