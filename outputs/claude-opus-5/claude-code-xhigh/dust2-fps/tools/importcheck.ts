/**
 * 静态检查（在没有 tsc 的环境里当作最低限度的编译期保护）：
 *   1. 每个相对 import 的目标文件是否存在（本项目统一带 .ts/.tsx 后缀）
 *   2. 具名 import 的符号是否真的被目标模块导出
 *   3. 引擎核心（core/map/game/audio）绝对不能 import three —— headless 测试全靠这条
 *   4. 类型专用的符号是否用了 import type（verbatimModuleSyntax 要求）
 *
 *   node tools/importcheck.ts
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(full)) out.push(full);
  }
  return out;
}

const files = walk(SRC).concat([join(ROOT, 'vite.config.ts')]);
const problems: string[] = [];

/** 抽取一个模块导出的所有名字（正则版，够用了）。 */
function exportsOf(file: string): { values: Set<string>; types: Set<string> } {
  const src = readFileSync(file, 'utf8');
  const values = new Set<string>();
  const types = new Set<string>();

  const patterns: Array<[RegExp, Set<string>]> = [
    [/export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)/g, values],
    [/export\s+(?:abstract\s+)?class\s+([A-Za-z0-9_$]+)/g, values],
    [/export\s+(?:const|let|var)\s+([A-Za-z0-9_$]+)/g, values],
    [/export\s+interface\s+([A-Za-z0-9_$]+)/g, types],
    [/export\s+type\s+([A-Za-z0-9_$]+)/g, types],
    [/export\s+enum\s+([A-Za-z0-9_$]+)/g, values],
  ];
  for (const [re, set] of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) set.add(m[1]);
  }
  // export { a, b as c }
  const braceRe = /export\s*\{([^}]*)\}/g;
  let bm: RegExpExecArray | null;
  while ((bm = braceRe.exec(src))) {
    for (const part of bm[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) values.add(name.replace(/^type\s+/, ''));
    }
  }
  if (/export\s+default/.test(src)) values.add('default');
  return { values, types };
}

const exportCache = new Map<string, { values: Set<string>; types: Set<string> }>();
function getExports(file: string) {
  let e = exportCache.get(file);
  if (!e) {
    e = exportsOf(file);
    exportCache.set(file, e);
  }
  return e;
}

const IMPORT_RE =
  /import\s+(type\s+)?(?:([A-Za-z0-9_$]+)\s*,\s*)?(?:\{([^}]*)\}|\*\s+as\s+([A-Za-z0-9_$]+)|([A-Za-z0-9_$]+))?\s*(?:from\s*)?['"]([^'"]+)['"]/g;

let importCount = 0;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const rel = file.replace(ROOT + '/', '');

  // 规则 3：模拟核心不许碰 three
  const isCore = /\/src\/(core|map|game|audio)\//.test(file);
  if (isCore && /from\s+['"]three['"]/.test(src)) {
    problems.push(`${rel}: 模拟核心不能 import three（会破坏 headless 测试）`);
  }

  let m: RegExpExecArray | null;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(src))) {
    const isTypeOnly = !!m[1];
    const named = m[3];
    const spec = m[6];
    importCount++;

    if (!spec.startsWith('.')) continue; // 第三方包不检查
    if (/\.(css|json|svg|png)$/.test(spec)) continue; // 资源文件由 vite 处理

    const target = resolve(dirname(file), spec);
    let exists = true;
    try {
      statSync(target);
    } catch {
      exists = false;
    }
    if (!exists) {
      problems.push(`${rel}: import 的文件不存在 -> ${spec}`);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(spec)) {
      problems.push(`${rel}: 相对 import 必须带 .ts/.tsx 后缀 -> ${spec}`);
      continue;
    }

    if (!named) continue;
    const ex = getExports(target);
    for (let raw of named.split(',')) {
      raw = raw.trim();
      if (!raw) continue;
      const inlineType = raw.startsWith('type ');
      raw = raw.replace(/^type\s+/, '');
      const name = raw.split(/\s+as\s+/)[0].trim();
      if (!name) continue;
      const isValue = ex.values.has(name);
      const isType = ex.types.has(name);
      if (!isValue && !isType) {
        problems.push(`${rel}: ${spec} 没有导出 "${name}"`);
      } else if (isType && !isValue && !isTypeOnly && !inlineType) {
        problems.push(
          `${rel}: "${name}" 只是类型，必须写成 import type（verbatimModuleSyntax）-> ${spec}`,
        );
      }
    }
  }
}

console.log(`检查了 ${files.length} 个文件、${importCount} 条 import`);
if (problems.length) {
  console.log(`\n✗ 问题 ${problems.length} 条:`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
console.log('✓ import/export 检查通过');
