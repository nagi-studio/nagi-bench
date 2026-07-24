/**
 * Lightweight structural check for .tsx files.
 *
 * Node cannot parse JSX, and there is no TypeScript compiler available in this
 * environment, so this verifies the two things that actually break a build in
 * practice: bracket balance and JSX tag pairing.
 *
 *   node tools/tsxcheck.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

/** Strip comments and string/template literals so bracket counting is honest. */
function strip(src) {
  let out = '';
  let i = 0;
  const n = src.length;
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
    if (c === '"' || c === "'") {
      const quote = c;
      i++;
      while (i < n && src[i] !== quote) {
        if (src[i] === '\\') i++;
        i++;
      }
      i++;
      out += '""';
      continue;
    }
    if (c === '`') {
      i++;
      // Template literals may embed ${ ... } with real code: keep those.
      while (i < n && src[i] !== '`') {
        if (src[i] === '\\') {
          i += 2;
          continue;
        }
        if (src[i] === '$' && src[i + 1] === '{') {
          out += '{';
          i += 2;
          let depth = 1;
          while (i < n && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            if (depth === 0) break;
            out += src[i];
            i++;
          }
          out += '}';
          i++;
          continue;
        }
        i++;
      }
      i++;
      out += '""';
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

let failed = 0;
const files = walk('src');
for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const src = strip(raw);
  const problems = [];

  // ---- bracket balance --------------------------------------------------
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  let line = 1;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '\n') line++;
    if (c === '(' || c === '[' || c === '{') stack.push({ c, line });
    else if (c === ')' || c === ']' || c === '}') {
      const top = stack.pop();
      if (!top || top.c !== pairs[c]) {
        problems.push(`unbalanced '${c}' at line ${line}`);
        break;
      }
    }
  }
  if (stack.length) problems.push(`${stack.length} unclosed bracket(s), first at line ${stack[0].line}`);

  // ---- JSX tag pairing --------------------------------------------------
  // Runs on the stripped source (no comments/strings). `=>` is allowed inside
  // attributes so inline arrow handlers do not terminate the match early.
  const tagStack = [];
  const tagRe = /<(\/?)([A-Za-z][A-Za-z0-9.]*)((?:=>|[^<>])*?)(\/?)>/g;
  let m;
  while ((m = tagRe.exec(src)) !== null) {
    const [, closing, name, attrs, selfClose] = m;
    // A generic type argument (`useRef<Foo>`, `Set<number>`) is always glued to
    // an identifier; a JSX tag never is.
    const prev = src[m.index - 1] ?? ' ';
    if (!closing && /[A-Za-z0-9_.]/.test(prev)) continue;
    if (closing) {
      const top = tagStack.pop();
      if (!top || top !== name) {
        problems.push(`JSX close </${name}> does not match <${top ?? 'nothing'}>`);
        break;
      }
    } else if (!selfClose) {
      tagStack.push(name);
    }
  }
  if (tagStack.length) problems.push(`unclosed JSX tag <${tagStack[tagStack.length - 1]}>`);

  // ---- imports resolve --------------------------------------------------
  const importRe = /from\s+'(\.[^']+)'/g;
  while ((m = importRe.exec(raw)) !== null) {
    const spec = m[1];
    const base = join(file, '..', spec);
    try {
      statSync(base);
    } catch {
      problems.push(`import target not found: ${spec}`);
    }
  }

  if (problems.length) {
    failed++;
    console.log(`FAIL ${file}`);
    for (const p of problems) console.log(`     ${p}`);
  } else {
    console.log(`ok   ${file}`);
  }
}
console.log(failed === 0 ? '\nTSX STRUCTURE OK' : `\n${failed} file(s) with problems`);
process.exit(failed === 0 ? 0 : 1);
