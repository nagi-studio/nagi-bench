import * as THREE from 'three';
import { WALL_HEIGHT } from '../map/grid.ts';
import type { World } from '../map/world.ts';
import { PALETTE, boxGeometry, jitterColor } from './materials.ts';

/**
 * Turns the collision grid into renderable geometry.
 *
 * Floors and walls are greedy-meshed into rectangles and pushed into two
 * InstancedMeshes, so the entire level costs two draw calls no matter how many
 * cells it has. Props (crates, barrels, cars, doors) are individual meshes
 * because they need their own rotation and detail geometry.
 */
export function buildMapMesh(world: World): THREE.Group {
  const group = new THREE.Group();
  group.name = 'dust2';
  const grid = world.grid;
  const geo = boxGeometry();
  const dummy = new THREE.Object3D();

  // ------------------------------------------------------------- floors
  const floorRects = grid.floorRects();
  const floorMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const floors = new THREE.InstancedMesh(geo, floorMat, floorRects.length);
  floors.receiveShadow = true;
  floors.castShadow = false;
  floorRects.forEach((r, idx) => {
    const h = r.key / 20;
    const x0 = grid.minX + r.i0;
    const z0 = grid.minZ + r.j0;
    const w = r.i1 - r.i0 + 1;
    const d = r.j1 - r.j0 + 1;
    const depth = h + 3; // slab reaches below the world so steps read as ledges
    dummy.position.set(x0 + w / 2, h - depth, z0 + d / 2);
    dummy.scale.set(w, depth, d);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    floors.setMatrixAt(idx, dummy.matrix);
    const base = h > 0.9 ? PALETTE.sandLight : h > 0.2 ? PALETTE.sandMid : PALETTE.sandDark;
    floors.setColorAt(idx, jitterColor(base, idx + 1, 0.05));
  });
  floors.instanceMatrix.needsUpdate = true;
  if (floors.instanceColor) floors.instanceColor.needsUpdate = true;
  group.add(floors);

  // -------------------------------------------------------------- walls
  const wallRects = grid.wallRects();
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const walls = new THREE.InstancedMesh(geo, wallMat, wallRects.length);
  walls.castShadow = true;
  walls.receiveShadow = true;
  wallRects.forEach((r, idx) => {
    const base = r.key / 4;
    const x0 = grid.minX + r.i0;
    const z0 = grid.minZ + r.j0;
    const w = r.i1 - r.i0 + 1;
    const d = r.j1 - r.j0 + 1;
    const height = WALL_HEIGHT + base + 1.2;
    dummy.position.set(x0 + w / 2, base - 1, z0 + d / 2);
    dummy.scale.set(w, height, d);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    walls.setMatrixAt(idx, dummy.matrix);
    const tone = idx % 3 === 0 ? PALETTE.wallLight : idx % 3 === 1 ? PALETTE.wallMid : PALETTE.wallDark;
    walls.setColorAt(idx, jitterColor(tone, idx + 7, 0.07));
  });
  walls.instanceMatrix.needsUpdate = true;
  if (walls.instanceColor) walls.instanceColor.needsUpdate = true;
  group.add(walls);

  // -------------------------------------------------------------- props
  for (const p of world.props) {
    const mesh = buildProp(p);
    group.add(mesh);
  }

  // ------------------------------------------------- desert skyline filler
  group.add(buildSkyline(world));
  return group;
}

function buildProp(p: {
  name: string;
  kind: string;
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  color: number;
  rot?: number;
}): THREE.Object3D {
  const g = new THREE.Group();
  g.position.set(p.x, p.y, p.z);
  if (p.rot) g.rotation.y = p.rot;

  const add = (
    sx: number,
    sy: number,
    sz: number,
    x: number,
    y: number,
    z: number,
    color: number,
  ): THREE.Mesh => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(sx, sy, sz),
      new THREE.MeshLambertMaterial({ color }),
    );
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };

  switch (p.kind) {
    case 'barrel': {
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(p.sx / 2, p.sx / 2, p.sy, 12),
        new THREE.MeshLambertMaterial({ color: p.color }),
      );
      body.position.y = p.sy / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      g.add(body);
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(p.sx / 2 + 0.03, p.sx / 2 + 0.03, 0.09, 12),
        new THREE.MeshLambertMaterial({ color: 0x4b5540 }),
      );
      ring.position.y = p.sy * 0.62;
      g.add(ring);
      break;
    }
    case 'car': {
      add(p.sx, p.sy * 0.55, p.sz, 0, p.sy * 0.28, 0, p.color);
      add(p.sx * 0.55, p.sy * 0.45, p.sz * 0.92, -p.sx * 0.05, p.sy * 0.72, 0, 0x6f7d88);
      const wheel = (dx: number, dz: number) => {
        const w = new THREE.Mesh(
          new THREE.CylinderGeometry(0.34, 0.34, 0.24, 10),
          new THREE.MeshLambertMaterial({ color: 0x25262a }),
        );
        w.rotation.z = Math.PI / 2;
        w.position.set(dx, 0.32, dz);
        g.add(w);
      };
      wheel(p.sx * 0.32, p.sz * 0.5);
      wheel(-p.sx * 0.32, p.sz * 0.5);
      wheel(p.sx * 0.32, -p.sz * 0.5);
      wheel(-p.sx * 0.32, -p.sz * 0.5);
      break;
    }
    case 'door': {
      // Door leaf hinged open next to its frame.
      add(p.sx, p.sy, p.sz, p.sx / 2, p.sy / 2, 0, p.color);
      add(p.sx * 0.8, 0.08, p.sz + 0.04, p.sx / 2, p.sy * 0.62, 0, 0x4a3a26);
      add(p.sx * 0.8, 0.08, p.sz + 0.04, p.sx / 2, p.sy * 0.3, 0, 0x4a3a26);
      break;
    }
    default: {
      // Crate: body plus darker edge bands so it reads as wood without textures.
      add(p.sx, p.sy, p.sz, 0, p.sy / 2, 0, p.color);
      const dark = new THREE.Color(p.color).multiplyScalar(0.72).getHex();
      add(p.sx * 1.02, 0.1, p.sz * 1.02, 0, p.sy * 0.14, 0, dark);
      add(p.sx * 1.02, 0.1, p.sz * 1.02, 0, p.sy * 0.86, 0, dark);
      break;
    }
  }
  return g;
}

/** Blocky buildings outside the playable area to hide the horizon. */
function buildSkyline(world: World): THREE.Group {
  const g = new THREE.Group();
  const grid = world.grid;
  const mat = [PALETTE.wallDark, PALETTE.trim, PALETTE.wallMid].map(
    (c) => new THREE.MeshLambertMaterial({ color: c }),
  );
  let seed = 1;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const ring = [
    { x: grid.minX - 8, z: 0, w: 16, d: 140 },
    { x: grid.maxX + 8, z: 0, w: 16, d: 140 },
    { x: 0, z: grid.minZ - 8, w: 150, d: 16 },
    { x: 0, z: grid.maxZ + 8, w: 150, d: 16 },
  ];
  for (const r of ring) {
    for (let i = 0; i < 14; i++) {
      const h = 6 + rand() * 16;
      const sx = 6 + rand() * 10;
      const sz = 6 + rand() * 10;
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, h, sz), mat[i % mat.length]);
      m.position.set(
        r.x + (rand() - 0.5) * r.w,
        h / 2 - 1,
        r.z + (rand() - 0.5) * r.d,
      );
      g.add(m);
    }
  }
  // Sand plane far below/around everything.
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshLambertMaterial({ color: PALETTE.sandDark }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3.05;
  ground.receiveShadow = true;
  g.add(ground);
  return g;
}

/** Gradient sky dome (no texture, pure shader). */
export function buildSky(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(400, 24, 16);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(PALETTE.skyTop) },
      bottomColor: { value: new THREE.Color(PALETTE.skyBottom) },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vWorldPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos).y * 0.5 + 0.5;
        gl_FragColor = vec4(mix(bottomColor, topColor, smoothstep(0.42, 0.78, h)), 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}
