/**
 * .tsx 结构检查（Node 跑不了 JSX，这是没有 tsc 时的替代保护）：
 *   1. JSX 标签是否配对（扫描器能区分 <div> 和泛型 useState<Foo>，并跳过属性里的 =>）
 *   2. 大括号/圆括号是否平衡
 *   3. JSX 里用到的大写组件是否被 import 或在本文件定义
 *   4. React Hook 是否只在函数顶层调用（不在 if/for 里）
 *   5. useEffect 里注册的监听是否有对应的清理
 *
 *   node tools/tsxcheck.ts
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const problems: string[] = [];

/** 把字符串字面量和注释替换成等长空白，简化后续扫描。 */
function blankOut(src: string): string {
  const out = src.split('');
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') out[i++] = ' ';
    } else if (c === '/' && src[i + 1] === '*') {
      out[i++] = ' ';
      out[i++] = ' ';
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] !== '\n') out[i] = ' ';
        i++;
      }
      if (i < n) {
        out[i++] = ' ';
        out[i++] = ' ';
      }
    } else if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      out[i++] = ' ';
      while (i < n) {
        if (src[i] === '\\') {
          out[i++] = ' ';
          if (i < n) out[i++] = ' ';
          continue;
        }
        if (src[i] === quote) {
          out[i++] = ' ';
          break;
        }
        // 模板字符串里的 ${} 保留，方便检查里面的表达式
        if (quote === '`' && src[i] === '$' && src[i + 1] === '{') {
          let depth = 0;
          do {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            i++;
          } while (i < n && depth > 0);
          continue;
        }
        if (src[i] !== '\n') out[i] = ' ';
        i++;
      }
    } else {
      i++;
    }
  }
  return out.join('');
}

const JSX_PREV = new Set(['(', '{', ',', ':', '?', '=', '&', '|', '>', ';', '[', '\n', undefined as unknown as string]);

interface TagInfo {
  name: string;
  line: number;
  /** 进入该标签时的花括号深度，用来区分「JSX 文本」和「{} 表达式」 */
  braces: number;
}

function checkFile(file: string): void {
  const raw = readFileSync(file, 'utf8');
  const rel = file.replace(ROOT + '/', '');
  const src = blankOut(raw);

  // ---- 括号平衡 ----
  const pairs: Record<string, string> = { '}': '{', ')': '(', ']': '[' };
  const stack: string[] = [];
  for (const ch of src) {
    if (ch === '{' || ch === '(' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ')' || ch === ']') {
      const want = pairs[ch];
      if (stack.pop() !== want) {
        problems.push(`${rel}: 括号不平衡，多余的 "${ch}"`);
        return;
      }
    }
  }
  if (stack.length) {
    problems.push(`${rel}: 括号不平衡，${stack.length} 个未闭合`);
    return;
  }

  // ---- JSX 标签配对 ----
  const tagStack: TagInfo[] = [];
  const usedComponents = new Set<string>();
  let i = 0;
  const n = src.length;
  let line = 1;

  const prevMeaning = (idx: number): string | undefined => {
    let j = idx - 1;
    while (j >= 0 && (src[j] === ' ' || src[j] === '\t' || src[j] === '\r')) j--;
    if (j < 0) return undefined;
    // return / =>
    if (src[j] === '\n') return '\n';
    const before = src.slice(Math.max(0, j - 6), j + 1);
    if (/\breturn$/.test(before)) return '(';
    if (/=>$/.test(before)) return '(';
    return src[j];
  };

  let braces = 0;
  while (i < n) {
    const c = src[i];
    if (c === '\n') line++;
    if (c === '{') braces++;
    else if (c === '}') braces--;
    if (c !== '<') {
      i++;
      continue;
    }
    const prev = prevMeaning(i);
    const isClose = src[i + 1] === '/';
    const isFragment = src[i + 1] === '>' || (isClose && src[i + 2] === '>');
    // 在 JSX 子元素的纯文本区域里，"<" 一定是标签（比如 正在观战 <b>xxx</b>）
    const inJsxText =
      tagStack.length > 0 && braces === tagStack[tagStack.length - 1].braces;

    if (!isClose && !isFragment && !inJsxText && !JSX_PREV.has(prev as string)) {
      i++; // 泛型或比较运算符，不是 JSX
      continue;
    }

    // 读标签名
    let j = i + 1 + (isClose ? 1 : 0);
    let name = '';
    while (j < n && /[A-Za-z0-9_.$]/.test(src[j])) name += src[j++];

    if (!isFragment && name === '') {
      i++;
      continue;
    }
    if (!isClose && !isFragment && !/^[A-Za-z]/.test(name)) {
      i++;
      continue;
    }

    // 扫到标签结束，跳过属性里的 {} 与 =>
    let depth = 0;
    let selfClose = false;
    while (j < n) {
      const ch = src[j];
      if (ch === '\n') line++;
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (depth === 0 && ch === '>') {
        selfClose = src[j - 1] === '/';
        break;
      }
      j++;
    }
    if (j >= n) {
      problems.push(`${rel}:${line}: JSX 标签 <${name}> 没有闭合的 ">"`);
      return;
    }

    if (name && /^[A-Z]/.test(name)) usedComponents.add(name.split('.')[0]);

    if (isClose) {
      const open = tagStack.pop();
      if (!open) {
        problems.push(`${rel}:${line}: 多余的结束标签 </${name}>`);
        return;
      }
      if (open.name !== name) {
        problems.push(
          `${rel}:${line}: 标签不匹配，<${open.name}>(第 ${open.line} 行) 对上了 </${name}>`,
        );
        return;
      }
    } else if (!selfClose) {
      tagStack.push({ name, line, braces });
    }
    i = j + 1;
  }
  if (tagStack.length) {
    const t = tagStack[tagStack.length - 1];
    problems.push(`${rel}: JSX 标签未闭合 <${t.name}>（第 ${t.line} 行）`);
  }

  // ---- 组件是否有定义 ----
  const declared = new Set<string>();
  for (const m of raw.matchAll(/(?:function|const|class)\s+([A-Z][A-Za-z0-9_$]*)/g)) {
    declared.add(m[1]);
  }
  for (const m of raw.matchAll(/import\s+(?:type\s+)?(?:([A-Za-z0-9_$]+)|\{([^}]*)\})/g)) {
    if (m[1]) declared.add(m[1]);
    if (m[2]) {
      for (const part of m[2].split(',')) {
        const nm = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim();
        if (nm) declared.add(nm);
      }
    }
  }
  for (const comp of usedComponents) {
    if (!declared.has(comp)) {
      problems.push(`${rel}: JSX 里用到了 <${comp}>，但既没 import 也没定义`);
    }
  }

  // ---- Hook 规则 ----
  const lines = raw.split('\n');
  let braceDepth = 0;
  const condStack: number[] = [];
  lines.forEach((text, idx) => {
    const trimmed = text.trim();
    if (/^\s*(if|for|while|switch)\s*\(/.test(text)) condStack.push(braceDepth);
    for (const ch of text) {
      if (ch === '{') braceDepth++;
      else if (ch === '}') {
        braceDepth--;
        while (condStack.length && condStack[condStack.length - 1] >= braceDepth) condStack.pop();
      }
    }
    if (/\buse[A-Z][A-Za-z]*\s*\(/.test(trimmed) && condStack.length > 0) {
      problems.push(`${rel}:${idx + 1}: Hook 被写在了条件/循环里 -> ${trimmed.slice(0, 60)}`);
    }
  });

  // ---- 事件监听清理 ----
  const addCount = (raw.match(/addEventListener\(/g) ?? []).length;
  const removeCount = (raw.match(/removeEventListener\(/g) ?? []).length;
  if (addCount > removeCount) {
    problems.push(`${rel}: addEventListener(${addCount}) 多于 removeEventListener(${removeCount})，可能漏了清理`);
  }
  const rafCount = (raw.match(/requestAnimationFrame\(/g) ?? []).length;
  const cancelCount = (raw.match(/cancelAnimationFrame\(/g) ?? []).length;
  if (rafCount > 0 && cancelCount === 0) {
    problems.push(`${rel}: 有 requestAnimationFrame 但没有 cancelAnimationFrame`);
  }
}

const files = walk(join(ROOT, 'src'));
for (const f of files) checkFile(f);

console.log(`检查了 ${files.length} 个 .tsx 文件`);
if (problems.length) {
  console.log(`\n✗ 问题 ${problems.length} 条:`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
console.log('✓ .tsx 结构检查通过');
