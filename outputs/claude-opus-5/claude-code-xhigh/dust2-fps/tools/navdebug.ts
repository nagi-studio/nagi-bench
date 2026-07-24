/** 导航连通性诊断：从 T 出生点洪泛，看哪些区域到不了，并打印局部网格。 */
import { AREAS } from '../src/map/dust2.ts';
import { areaAt, buildMap } from '../src/map/build.ts';
import { NavGrid, STEP_HEIGHT } from '../src/map/nav.ts';

const map = buildMap();
const nav = new NavGrid(map.world);

const start = nav.nearestWalkable(-1, 64.5, 0);
const seen = new Uint8Array(nav.nx * nav.nz);
const queue = [start];
seen[start] = 1;
while (queue.length) {
  const cur = queue.pop()!;
  const cx = cur % nav.nx;
  const cz = (cur / nav.nx) | 0;
  for (let dz = -1; dz <= 1; dz++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dz === 0) continue;
      const nxc = cx + dx;
      const nzc = cz + dz;
      if (!nav.inBounds(nxc, nzc)) continue;
      const ni = nav.index(nxc, nzc);
      if (seen[ni] || !nav.walkable[ni]) continue;
      const dh = nav.height[ni] - nav.height[cur];
      if (dh > STEP_HEIGHT || dh < -1.8) continue;
      if (dx !== 0 && dz !== 0) {
        const a = nav.index(cx + dx, cz);
        const b = nav.index(cx, cz + dz);
        if (!nav.walkable[a] || !nav.walkable[b]) continue;
      }
      seen[ni] = 1;
      queue.push(ni);
    }
  }
}

const perArea = new Map<string, { total: number; reached: number }>();
for (const a of AREAS) perArea.set(a.id, { total: 0, reached: 0 });
for (let cz = 0; cz < nav.nz; cz++) {
  for (let cx = 0; cx < nav.nx; cx++) {
    const i = nav.index(cx, cz);
    if (!nav.walkable[i]) continue;
    const a = areaAt(nav.worldX(cx), nav.worldZ(cz));
    if (!a) continue;
    const rec = perArea.get(a.id)!;
    rec.total++;
    if (seen[i]) rec.reached++;
  }
}
console.log('区域可达情况:');
for (const a of AREAS) {
  const r = perArea.get(a.id)!;
  const pct = r.total ? ((r.reached / r.total) * 100).toFixed(0) : '-';
  const mark = r.reached === 0 ? ' <== 完全不可达' : r.reached < r.total * 0.5 ? ' <== 大部分不可达' : '';
  console.log(`  ${a.id.padEnd(14)} ${String(r.reached).padStart(4)}/${String(r.total).padEnd(4)} ${pct}%${mark}`);
}

function dump(x0: number, z0: number, x1: number, z1: number, title: string) {
  console.log(`\n${title}  (# = 不可走, . = 可走, o = 从T出生点可达)`);
  const cx0 = nav.cellX(x0);
  const cx1 = nav.cellX(x1);
  const cz0 = nav.cellZ(z0);
  const cz1 = nav.cellZ(z1);
  for (let cz = cz0; cz <= cz1; cz++) {
    let line = `z=${nav.worldZ(cz).toFixed(1).padStart(6)} `;
    for (let cx = cx0; cx <= cx1; cx++) {
      const i = nav.index(cx, cz);
      line += !nav.walkable[i] ? '#' : seen[i] ? 'o' : '.';
    }
    console.log(line);
  }
  let head = '        ';
  for (let cx = cx0; cx <= cx1; cx++) head += Math.abs(Math.round(nav.worldX(cx))) % 10;
  console.log(head + '  <- |x| 个位');
}

function dumpHeights(x0: number, z0: number, x1: number, z1: number, title: string) {
  console.log(`\n${title} 的地面高度 (## = 不可走)`);
  const cx0 = nav.cellX(x0);
  const cx1 = nav.cellX(x1);
  const cz0 = nav.cellZ(z0);
  const cz1 = nav.cellZ(z1);
  for (let cz = cz0; cz <= cz1; cz++) {
    let line = `z=${nav.worldZ(cz).toFixed(1).padStart(6)} `;
    for (let cx = cx0; cx <= cx1; cx++) {
      const i = nav.index(cx, cz);
      line += nav.walkable[i] ? nav.height[i].toFixed(1).padStart(5) : '   ##';
    }
    console.log(line);
  }
}

const which = process.argv[2] ?? 'mid';
if (which === 'mid') dump(-14, 12, 2, 20, '中门附近');
else if (which === 'ctmid') dumpHeights(-10, -17, -2, -11, '中路->CT中路 台阶');
else if (which === 'tunstep') dumpHeights(-34, 17, -26, 23, 'B洞台阶');
else if (which === 'tun') dump(-38, 16, -18, 26, 'B洞上下层交界');
else if (which === 'ct') dump(2, -46, 16, -28, 'A小道/CT上口');
else if (which === 'asite') dump(14, -44, 44, -36, 'A点南侧入口');
