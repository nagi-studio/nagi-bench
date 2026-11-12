// Builds the three.js scene graph for the map from the shared MapData so the
// visuals always match the collision boxes exactly.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BOMBSITES, CELL, COLS, ORIGIN_X, ORIGIN_Z, ROWS } from '../core/map.ts';
import type { AABB, MapData } from '../core/map.ts';
import {
  boxGeometry,
  crateTexture,
  doorTexture,
  floorTexture,
  metalTexture,
  plasterTexture,
  sandstoneTexture,
  siteLetterTexture,
} from './textures.ts';

function geoFromBox(b: AABB, texScale: number): THREE.BufferGeometry {
  const w = b.maxX - b.minX;
  const h = b.maxY - b.minY;
  const d = b.maxZ - b.minZ;
  const g = boxGeometry(w, h, d, texScale);
  g.translate(b.minX + w / 2, b.minY + h / 2, b.minZ + d / 2);
  return g;
}

function merged(boxes: AABB[], mat: THREE.Material, texScale: number, shadows = true): THREE.Mesh | null {
  if (!boxes.length) return null;
  const geos = boxes.map((b) => geoFromBox(b, texScale));
  const g = mergeGeometries(geos, false);
  geos.forEach((x) => x.dispose());
  if (!g) return null;
  const m = new THREE.Mesh(g, mat);
  m.castShadow = shadows;
  m.receiveShadow = true;
  return m;
}

export function buildMapView(map: MapData): THREE.Group {
  const group = new THREE.Group();
  group.name = 'map';

  const sandMat = new THREE.MeshLambertMaterial({ map: sandstoneTexture() });
  const plasterMat = new THREE.MeshLambertMaterial({ map: plasterTexture() });
  const crateMat = new THREE.MeshLambertMaterial({ map: crateTexture() });
  const metalMat = new THREE.MeshLambertMaterial({ map: metalTexture() });
  const doorMat = new THREE.MeshLambertMaterial({ map: doorTexture() });
  const ceilMat = new THREE.MeshLambertMaterial({ map: sandstoneTexture(), color: 0x8a7a66 });
  const trimMat = new THREE.MeshLambertMaterial({ color: 0x9c7f58 });

  const walls = map.boxes.filter((b) => b.kind === 'wall');
  // Alternate between two wall finishes for visual variety.
  const wallsA = walls.filter((_, i) => i % 3 !== 0);
  const wallsB = walls.filter((_, i) => i % 3 === 0);
  const wA = merged(wallsA, sandMat, 3);
  const wB = merged(wallsB, plasterMat, 4);
  if (wA) group.add(wA);
  if (wB) group.add(wB);

  // Decorative trim on wall tops
  const trims: AABB[] = walls.map((b) => ({
    minX: b.minX - 0.08,
    maxX: b.maxX + 0.08,
    minY: b.maxY - 0.25,
    maxY: b.maxY,
    minZ: b.minZ - 0.08,
    maxZ: b.maxZ + 0.08,
    kind: 'wall',
  }));
  const tr = merged(trims, trimMat, 2, false);
  if (tr) group.add(tr);

  const crates = merged(
    map.crateBoxes.filter((b) => b.kind === 'crate'),
    crateMat,
    1.2,
  );
  if (crates) group.add(crates);
  const metals = merged(
    map.crateBoxes.filter((b) => b.kind === 'metal'),
    metalMat,
    1.5,
  );
  if (metals) group.add(metals);

  const doors = merged(map.doorLeaves, doorMat, 3);
  if (doors) group.add(doors);
  const lintel = merged(map.lintels, sandMat, 3);
  if (lintel) group.add(lintel);
  // door hinges / frame posts
  const posts: AABB[] = map.doorLeaves.map((d) => ({
    minX: d.minX - 0.12,
    maxX: d.maxX + 0.12,
    minY: 0,
    maxY: 3.3,
    minZ: d.maxZ - 0.25,
    maxZ: d.maxZ + 0.05,
    kind: 'wall',
  }));
  const p = merged(posts, trimMat, 2);
  if (p) group.add(p);

  const ceil = merged(map.ceilings, ceilMat, 3);
  if (ceil) group.add(ceil);

  // Floor
  const W = COLS * CELL;
  const H = ROWS * CELL;
  const floorTex = floorTexture();
  floorTex.repeat.set(W / 6, H / 6);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshLambertMaterial({ map: floorTex }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(ORIGIN_X + W / 2, 0, ORIGIN_Z + H / 2);
  floor.receiveShadow = true;
  group.add(floor);

  // Bombsite markings
  for (const [letter, rect] of Object.entries(BOMBSITES)) {
    const cx = ORIGIN_X + ((rect.c0 + rect.c1 + 1) / 2) * CELL;
    const cz = ORIGIN_Z + ((rect.r0 + rect.r1 + 1) / 2) * CELL;
    const decal = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshLambertMaterial({ map: siteLetterTexture(letter), transparent: true, depthWrite: false }),
    );
    decal.rotation.x = -Math.PI / 2;
    decal.position.set(cx, 0.02, cz);
    decal.receiveShadow = true;
    group.add(decal);
    // painted boundary
    const w = (rect.c1 - rect.c0 + 1) * CELL;
    const h = (rect.r1 - rect.r0 + 1) * CELL;
    const pts = [
      new THREE.Vector3(-w / 2, 0, -h / 2),
      new THREE.Vector3(w / 2, 0, -h / 2),
      new THREE.Vector3(w / 2, 0, h / 2),
      new THREE.Vector3(-w / 2, 0, h / 2),
      new THREE.Vector3(-w / 2, 0, -h / 2),
    ];
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xb8322a, transparent: true, opacity: 0.6 }),
    );
    line.position.set(cx, 0.03, cz);
    group.add(line);
  }

  return group;
}

/** Simple gradient sky dome. */
export function buildSky(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(500, 24, 12);
  const colors: number[] = [];
  const top = new THREE.Color(0x4f8fd6);
  const horizon = new THREE.Color(0xf0dcb8);
  const pos = geo.attributes.position;
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 500;
    c.copy(horizon).lerp(top, Math.pow(Math.max(0, y), 0.6));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = -1;
  return m;
}
