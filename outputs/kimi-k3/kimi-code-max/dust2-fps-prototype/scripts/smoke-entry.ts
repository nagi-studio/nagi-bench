/* Headless smoke test: map connectivity, nav grid, and movement simulation. */
/* Bundled with esbuild and run in node (see package.json "smoke" script). */

// ---- DOM stubs (map.ts generates a canvas ground texture) ----
(globalThis as any).document = {
  createElement: () => {
    const ctx = new Proxy(
      {},
      {
        get: (_t, k) => {
          if (k === 'createRadialGradient') return () => ({ addColorStop: () => {} });
          return () => {};
        },
      },
    );
    return { width: 0, height: 0, getContext: () => ctx, style: {} };
  },
};

async function main() {
  const THREE = await import('three');
  const { buildMap, zoneAt } = await import('../src/game/map');
  const { findPath } = await import('../src/game/ai');
  const { moveBody } = await import('../src/game/physics');

  let failures = 0;
  const ok = (cond: boolean, label: string) => {
    if (cond) console.log(`PASS  ${label}`);
    else {
      console.log(`FAIL  ${label}`);
      failures++;
    }
  };

  const map = buildMap();
  ok(map.solids.length > 50, `solids built (${map.solids.length})`);
  ok(map.doors.length === 2, `doors built (${map.doors.length})`);

  // zone detection
  ok(zoneAt(map.zones, -40, -42) === 'A', 'zoneAt A plant point');
  ok(zoneAt(map.zones, 48, -30) === 'B', 'zoneAt B plant point');

  // nav walkability at key points
  const nav = map.nav;
  const cellWalk = (x: number, z: number): boolean => {
    const cx = Math.floor((x - nav.ox) / nav.cell);
    const cz = Math.floor((z - nav.oz) / nav.cell);
    return nav.walk[cz * nav.w + cx] === 1;
  };
  for (const s of map.spawns.T) ok(cellWalk(s.x, s.z), `T spawn walkable (${s.x},${s.z})`);
  for (const s of map.spawns.CT) ok(cellWalk(s.x, s.z), `CT spawn walkable (${s.x},${s.z})`);
  ok(cellWalk(map.plantPoints.A.x, map.plantPoints.A.z), 'A plant point walkable');
  ok(cellWalk(map.plantPoints.B.x, map.plantPoints.B.z), 'B plant point walkable');
  ok(cellWalk(-7, -10), 'catwalk walkway walkable');

  // path existence between key areas
  const T = map.spawns.T[0];
  const CT = map.spawns.CT[0];
  const routes: [string, number, number, number, number][] = [
    ['T -> A plant', T.x, T.z, map.plantPoints.A.x, map.plantPoints.A.z],
    ['T -> B plant', T.x, T.z, map.plantPoints.B.x, map.plantPoints.B.z],
    ['CT -> A plant', CT.x, CT.z, map.plantPoints.A.x, map.plantPoints.A.z],
    ['CT -> B plant', CT.x, CT.z, map.plantPoints.B.x, map.plantPoints.B.z],
    ['mid -> catwalk', -5, 40, -7, -10],
    ['long -> A site', -50, 50, -40, -40],
    ['tunnels -> B site', 20, 48, 48, -30],
    ['mid -> CT', -5, 30, 20, -30],
  ];
  for (const [label, x1, z1, x2, z2] of routes) {
    const p = findPath(nav, x1, z1, x2, z2);
    ok(p !== null && p.length > 0, `path ${label}${p ? ` (${p.length} wp)` : ''}`);
  }

  // movement simulation along paths (walls must not trap a walking body)
  const simulate = (x1: number, z1: number, x2: number, z2: number): boolean => {
    const path = findPath(nav, x1, z1, x2, z2);
    if (!path) return false;
    const pos = new THREE.Vector3(x1, 0, z1);
    const vel = new THREE.Vector3();
    let pi = 0;
    let simT = 0;
    let stuckT = 0;
    let lastX = x1;
    let lastZ = z1;
    const dt = 1 / 60;
    while (pi < path.length && simT < 120) {
      simT += dt;
      const wp = path[pi];
      const dx = wp[0] - pos.x;
      const dz = wp[1] - pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.5) {
        pi++;
        continue;
      }
      const speed = 4.6;
      vel.x += ((dx / d) * speed - vel.x) * Math.min(1, 40 * dt);
      vel.z += ((dz / d) * speed - vel.z) * Math.min(1, 40 * dt);
      moveBody(pos, vel, 0.35, 1.8, dt, map.solids, map.floors);
      stuckT += dt;
      if (stuckT > 0.6) {
        if (Math.hypot(pos.x - lastX, pos.z - lastZ) < 0.2) {
          vel.y = 4.8; // jump, like the bots do
        }
        lastX = pos.x;
        lastZ = pos.z;
        stuckT = 0;
      }
    }
    return pi >= path.length && Math.hypot(pos.x - x2, pos.z - z2) < 2.5;
  };

  ok(simulate(T.x, T.z, map.plantPoints.A.x, map.plantPoints.A.z), 'sim walk T -> A plant');
  ok(simulate(T.x, T.z, map.plantPoints.B.x, map.plantPoints.B.z), 'sim walk T -> B plant');
  ok(simulate(CT.x, CT.z, map.plantPoints.B.x, map.plantPoints.B.z), 'sim walk CT -> B plant');
  ok(simulate(CT.x, CT.z, map.plantPoints.A.x, map.plantPoints.A.z), 'sim walk CT -> A plant');
  ok(simulate(-5, 40, -7, -10), 'sim walk mid -> catwalk (stairs)');
  ok(simulate(-7, -10, -40, -40), 'sim walk catwalk -> A site (drop/stairs)');

  console.log(failures === 0 ? 'SMOKE OK' : `SMOKE FAILED (${failures})`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
