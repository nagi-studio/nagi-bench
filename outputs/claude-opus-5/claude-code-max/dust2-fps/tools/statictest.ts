/**
 * Static checks that do not need a TypeScript compiler: run with `node tools/statictest.ts`.
 *
 *  - every relative import resolves to a file that exists (and carries its extension, which
 *    is what lets Node run the sim modules directly)
 *  - brackets balance in every source file
 *  - JSX tags open and close consistently in every .tsx file
 *  - the sim layer never imports three.js or React (that separation is what keeps the
 *    simulation headlessly testable)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { check, report, section } from './harness.ts';

const ROOT = resolve(import.meta.dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const files = [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'tools'))];

/** Removes comments, strings, template literals and regex literals so brackets balance. */
function stripLiterals(src: string): string {
  let out = '';
  let i = 0;
  const n = src.length;
  const regexAllowedBefore = /[(,=:[!&|?{};+\-*%~^\n]/;

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];
    if (c === '/' && next === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // Regex literal: only where a value is expected, otherwise it is a division or part
    // of a JSX tag (`</div>`, `<br />`).
    if (c === '/' && next !== '>') {
      let j = out.length - 1;
      while (j >= 0 && /\s/.test(out[j])) j--;
      const prev = j >= 0 ? out[j] : '\n';
      if (prev !== '<' && regexAllowedBefore.test(prev)) {
        i++;
        let inClass = false;
        while (i < n) {
          if (src[i] === '\\') {
            i += 2;
            continue;
          }
          if (src[i] === '[') inClass = true;
          else if (src[i] === ']') inClass = false;
          else if (src[i] === '/' && !inClass) {
            i++;
            break;
          } else if (src[i] === '\n') break;
          i++;
        }
        while (i < n && /[gimsuy]/.test(src[i])) i++;
        out += 'RE';
        continue;
      }
    }

    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      i++;
      out += '""';
      while (i < n) {
        if (src[i] === '\\') {
          i += 2;
          continue;
        }
        if (src[i] === quote) {
          i++;
          break;
        }
        // Keep template expressions: they contain real code.
        if (quote === '`' && src[i] === '$' && src[i + 1] === '{') {
          let depth = 1;
          i += 2;
          const start = i;
          while (i < n && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            if (depth > 0) i++;
          }
          out += `(${stripLiterals(src.slice(start, i))})`;
          i++;
          continue;
        }
        i++;
      }
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

section('imports resolve');

{
  let broken = 0;
  let total = 0;
  const importRe = /(?:^|\n)\s*(?:import|export)\s[^;]*?from\s+'([^']+)'/g;
  const dynamicRe = /import\(\s*'([^']+)'\s*\)/g;

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    for (const re of [importRe, dynamicRe]) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src))) {
        const spec = m[1];
        total++;
        if (!spec.startsWith('.')) continue; // bare package specifiers
        const target = resolve(dirname(file), spec);
        try {
          statSync(target);
        } catch {
          broken++;
          console.log(`  ${file.replace(ROOT, '.')}: cannot resolve '${spec}'`);
        }
        if (!/\.(ts|tsx|css|json)$/.test(spec)) {
          broken++;
          console.log(`  ${file.replace(ROOT, '.')}: '${spec}' is missing its file extension`);
        }
      }
    }
  }
  check('all relative imports resolve with explicit extensions', broken === 0, `${total} imports across ${files.length} files`);
}

section('bracket balance');

{
  let bad = 0;
  for (const file of files) {
    const src = stripLiterals(readFileSync(file, 'utf8'));
    const stack: Array<{ ch: string; line: number }> = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    let line = 1;
    let failed = false;
    for (const ch of src) {
      if (ch === '\n') line++;
      else if (ch === '(' || ch === '[' || ch === '{') stack.push({ ch, line });
      else if (ch === ')' || ch === ']' || ch === '}') {
        const top = stack.pop();
        if (!top || top.ch !== pairs[ch]) {
          console.log(`  ${file.replace(ROOT, '.')}:${line} unexpected '${ch}'`);
          failed = true;
          break;
        }
      }
    }
    if (!failed && stack.length > 0) {
      console.log(`  ${file.replace(ROOT, '.')}: ${stack.length} unclosed '${stack[stack.length - 1].ch}' (line ${stack[stack.length - 1].line})`);
      failed = true;
    }
    if (failed) bad++;
  }
  check('brackets balance in every source file', bad === 0, `${files.length} files checked`);
}

section('JSX structure');

{
  const VOID_TAGS = new Set(['input', 'br', 'img', 'hr', 'meta', 'link']);
  const tsxFiles = files.filter((f) => f.endsWith('.tsx'));
  let bad = 0;
  let tagsChecked = 0;

  for (const file of tsxFiles) {
    const src = stripLiterals(readFileSync(file, 'utf8'));
    const stack: Array<{ name: string; line: number }> = [];
    const tagRe = /<(\/?)([A-Za-z][A-Za-z0-9.]*)?((?:[^<>{}]|\{[^{}]*\}|\{[^{}]*\{[^{}]*\}[^{}]*\})*?)(\/?)>/g;
    let m: RegExpExecArray | null;
    let failed = false;

    while ((m = tagRe.exec(src))) {
      const [full, closing, name, attrs, selfClose] = m;
      const before = src[m.index - 1] ?? ' ';

      // A generic argument list (`useState<Foo>`, `Map<a, b>`) always follows an
      // identifier; an opening JSX tag never does. Closing tags are exempt because JSX
      // text runs straight into them (`CT</span>`). Standalone type params carry `extends`.
      // ...unless we are already inside JSX, where text runs into tags (`DUST<span>`).
      if (!closing && stack.length === 0 && /[A-Za-z0-9_$]/.test(before)) continue;
      if (/\bextends\b/.test(attrs)) continue;
      if (!name) continue;
      void full;

      const line = src.slice(0, m.index).split('\n').length;
      const tagName = name ?? '';
      tagsChecked++;

      if (closing) {
        const top = stack.pop();
        if (!top || top.name !== tagName) {
          console.log(`  ${file.replace(ROOT, '.')}:${line} </${tagName}> does not match <${top ? top.name : 'nothing'}>`);
          failed = true;
          break;
        }
      } else if (!selfClose && !VOID_TAGS.has(tagName)) {
        stack.push({ name: tagName, line });
      }
    }

    if (!failed && stack.length > 0) {
      const top = stack[stack.length - 1];
      console.log(`  ${file.replace(ROOT, '.')}: <${top.name}> opened on line ${top.line} is never closed`);
      failed = true;
    }
    if (failed) bad++;
  }
  check('JSX tags are balanced', bad === 0, `${tagsChecked} tags in ${tsxFiles.length} components`);
}

section('layer separation');

{
  const simFiles = files.filter(
    (f) => f.includes('/src/game/') || f.includes('/src/core/'),
  );
  const leaks: string[] = [];
  for (const file of simFiles) {
    const src = readFileSync(file, 'utf8');
    if (/from\s+'three'/.test(src)) leaks.push(`${file.replace(ROOT, '.')} imports three`);
    if (/from\s+'react'/.test(src)) leaks.push(`${file.replace(ROOT, '.')} imports react`);
  }
  for (const leak of leaks) console.log(`  ${leak}`);
  check(
    'simulation layer is free of three.js and React',
    leaks.length === 0,
    `${simFiles.length} simulation modules`,
  );

  // And the reverse: UI components must not reach into the renderer's internals.
  const uiFiles = files.filter((f) => f.includes('/src/ui/'));
  let uiLeaks = 0;
  for (const file of uiFiles) {
    if (/from\s+'three'/.test(readFileSync(file, 'utf8'))) uiLeaks++;
  }
  check('UI layer does not import three.js', uiLeaks === 0, `${uiFiles.length} UI modules`);
}

report();
