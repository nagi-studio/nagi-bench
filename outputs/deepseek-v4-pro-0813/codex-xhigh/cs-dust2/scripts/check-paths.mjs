import { NAV_EDGES, NAV_NODES, WALL_SPECS } from '../src/game/mapData.ts';

const nodes = new Map(NAV_NODES.map((node) => [node.id, node]));
const walls = WALL_SPECS.map((wall) => ({
  id: wall.id,
  minX: wall.x - wall.w / 2,
  maxX: wall.x + wall.w / 2,
  minZ: wall.z - wall.d / 2,
  maxZ: wall.z + wall.d / 2,
}));

function segmentIntersectsWall(ax, az, bx, bz, wall) {
  const dirX = bx - ax;
  const dirZ = bz - az;
  const lengthSq = dirX * dirX + dirZ * dirZ;
  if (lengthSq === 0) return false;
  let tmin = -Infinity;
  let tmax = Infinity;
  if (dirX !== 0) {
    const t1 = (wall.minX - ax) / dirX;
    const t2 = (wall.maxX - ax) / dirX;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));
  } else if (ax < wall.minX || ax > wall.maxX) return false;
  if (dirZ !== 0) {
    const t1 = (wall.minZ - az) / dirZ;
    const t2 = (wall.maxZ - az) / dirZ;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));
  } else if (az < wall.minZ || az > wall.maxZ) return false;
  return tmax >= 0 && tmin <= 1 && tmax >= tmin;
}

let failures = 0;
for (const [a, b] of NAV_EDGES) {
  const from = nodes.get(a);
  const to = nodes.get(b);
  const blockers = walls.filter((wall) => segmentIntersectsWall(from.x, from.z, to.x, to.z, wall));
  if (blockers.length > 0) {
    failures += 1;
    console.log(`${a} -> ${b}: blocked by ${blockers.map((wall) => wall.id).join(', ')}`);
  }
}
if (failures === 0) console.log('all nav edges clear');
process.exit(failures === 0 ? 0 : 1);
