import { createDust2World } from '../src/map/dust2.ts';

const w = createDust2World();
const g = w.grid;
const step = 2;
const marks = new Map<string, string>();
const put = (x: number, z: number, c: string) => {
  marks.set(`${Math.floor((x - g.minX) / step)},${Math.floor((z - g.minZ) / step)}`, c);
};
put(19, 39, 'T');
put(-7, -43, 'C');
put(38, -33, 'A');
put(-38, -30, 'B');
put(4, 8, 'D'); // mid doors
put(22, -15, 'K'); // catwalk
put(44.5, 28, 'L'); // long doors
put(-16, 14, 'U'); // tunnel

let out = '';
for (let j = 0; j < g.nz; j += step) {
  let line = '';
  for (let i = 0; i < g.nx; i += step) {
    const m = marks.get(`${i / step},${j / step}`);
    if (m) {
      line += m;
      continue;
    }
    let open = 0;
    let h = 0;
    for (let dj = 0; dj < step; dj++)
      for (let di = 0; di < step; di++)
        if (g.inBounds(i + di, j + dj) && !g.isSolidCell(i + di, j + dj)) {
          open++;
          h = Math.max(h, g.floorCell(i + di, j + dj));
        }
    line += open === 0 ? ' ' : h > 0.9 ? '#' : h > 0.2 ? '+' : '.';
  }
  out += line.replace(/\s+$/, '') + '\n';
}
console.log('north(-Z) top, west(-X) left   . = ground  + = mid level  # = raised');
console.log(out);
