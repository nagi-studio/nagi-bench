/**
 * 一键跑全部自检。这套检查不依赖 npm 依赖（three/react/tsc 都不需要），
 * 因为模拟核心是纯 TypeScript，渲染层用替身跑，UI 用结构扫描。
 *
 *   node tools/checkall.ts
 */

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

interface Step {
  name: string;
  args: string[];
}

const steps: Step[] = [
  { name: 'import/export 静态检查', args: ['tools/importcheck.ts'] },
  { name: '.tsx 结构检查', args: ['tools/tsxcheck.ts'] },
  { name: '地图数据检查', args: ['tools/mapcheck.ts'] },
  { name: '导航与射线检查', args: ['tools/navcheck.ts'] },
  { name: '玩法规则验收', args: ['tools/rulescheck.ts'] },
  { name: '整局模拟', args: ['tools/simtest.ts', '6', '1'] },
  { name: '渲染层冒烟测试', args: ['--import', './tools/mock/hook.mjs', 'tools/rendercheck.ts'] },
  { name: '平衡性评估', args: ['tools/balance.ts', '6', '6'] },
];

let failed = 0;
for (const step of steps) {
  process.stdout.write(`\n\x1b[1m▶ ${step.name}\x1b[0m\n`);
  const res = spawnSync(process.execPath, step.args, {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (res.status !== 0) {
    failed++;
    process.stdout.write(`\x1b[31m  ↑ 失败\x1b[0m\n`);
  }
}

process.stdout.write('\n' + '─'.repeat(52) + '\n');
if (failed) {
  process.stdout.write(`\x1b[31m${failed}/${steps.length} 项检查失败\x1b[0m\n`);
  process.exit(1);
}
process.stdout.write(`\x1b[32m全部 ${steps.length} 项检查通过\x1b[0m\n`);
