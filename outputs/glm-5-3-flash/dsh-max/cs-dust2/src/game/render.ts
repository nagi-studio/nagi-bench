/**
 * render.ts — builds the static three.js scene from the World data:
 * greedy-meshed walls & floors, crates, barrels, doors, sky, lighting.
 */

import * as THREE from 'three';
import { World, WALL_H } from './world';
import { SITE_A, SITE_B } from './mapdata';
import { sandTexture, groundTexture, crateTexture, metalTexture, siteMarkerTexture, skyTexture } from './textures';

interface MeshArrays {
  pos: number[]; norm: number[]; uv: number[]; idx: number[];
}

function pushQuad(m: MeshArrays, v: number[][], n: number[], uvScale: number, uvs?: number[][]) {
  const base = m.pos.length / 3;
  for (let i = 0; i < 4; i++) {
    m.pos.push(v[i][0], v[i][1], v[i][2]);
    m.norm.push(n[0], n[1], n[2]);
    if (uvs) m.uv.push(uvs[i][0], uvs[i][1]);
    else m.uv.push(
      (v[i][0] + v[i][1] + v[i][2]) / uvScale * 0.7071,
      (v[i][0] - v[i][1] + v[i][2]) / uvScale * 0.7071,
    );
  }
  m.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
}

/** axis aligned box; skips bottom face, optional top skip */
function pushBox(m: MeshArrays, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, uvScale: number, skipTop = false) {
  // +x
  pushQuad(m, [[x2, y1, z1], [x2, y2, z1], [x2, y2, z2], [x2, y1, z2]], [1, 0, 0], uvScale);
  // -x
  pushQuad(m, [[x1, y1, z2], [x1, y2, z2], [x1, y2, z1], [x1, y1, z1]], [-1, 0, 0], uvScale);
  // +z
  pushQuad(m, [[x1, y1, z2], [x1, y2, z2], [x2, y2, z2], [x2, y1, z2]], [0, 0, 1], uvScale);
  // -z
  pushQuad(m, [[x2, y1, z1], [x2, y2, z1], [x1, y2, z1], [x1, y1, z1]], [0, 0, -1], uvScale);
  if (!skipTop) {
    pushQuad(m, [[x1, y2, z1], [x1, y2, z2], [x2, y2, z2], [x2, y2, z1]], [0, 1, 0], uvScale);
  }
}

function toGeometry(m: MeshArrays): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(m.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(m.norm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(m.uv, 2));
  g.setIndex(m.idx);
  g.computeBoundingSphere();
  return g;
}

export interface StaticWorld {
  group: THREE.Group;
  dispose(): void;
}

export function buildStaticWorld(scene: THREE.Scene, world: World): StaticWorld {
  const group = new THREE.Group();
  scene.add(group);

  // ---- sky ----
  const skyGeo = new THREE.SphereGeometry(600, 24, 16);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, depthWrite: false, fog: false });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.position.y = -40;
  group.add(sky);

  scene.fog = new THREE.Fog(0xcfc0a0, 110, 480);

  // ---- lights ----
  const hemi = new THREE.HemisphereLight(0xbcd7f5, 0x9a8560, 0.62);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff2da, 1.25);
  sun.position.set(60, 95, -45);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -110; sc.right = 110; sc.top = 110; sc.bottom = -110; sc.near = 10; sc.far = 320;
  sun.shadow.bias = -0.0007;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xffffff, 0.1));

  // ---- materials ----
  const sandMap = sandTexture();
  const groundMap = groundTexture();
  const crateMap = crateTexture();
  const metalMap = metalTexture();
  const wallMat = new THREE.MeshLambertMaterial({ map: sandMap });
  const floorMat = new THREE.MeshLambertMaterial({ map: groundMap });
  const trimMat = new THREE.MeshLambertMaterial({ color: 0xa98f63 });
  const crateMat = new THREE.MeshLambertMaterial({ map: crateMap });
  const metalMat = new THREE.MeshLambertMaterial({ map: metalMap });

  // ---- walls ----
  const wallMeshes: MeshArrays = { pos: [], norm: [], uv: [], idx: [] };
  const trimMeshes: MeshArrays = { pos: [], norm: [], uv: [], idx: [] };
  for (const b of world.wallBoxes) {
    pushBox(wallMeshes, b.x1, 0, b.z1, b.x2, WALL_H, b.z2, 4.5, true);
    // a darker base skirting for silhouette readability
    pushBox(trimMeshes, b.x1 - 0.06, 0, b.z1 - 0.06, b.x2 + 0.06, 0.55, b.z2 + 0.06, 4.5, true);
  }

  // ---- floors (tops + plateau cliffs) ----
  const floorMeshes: MeshArrays = { pos: [], norm: [], uv: [], idx: [] };
  for (const b of world.floorBoxes) {
    if (b.h <= 0.3) {
      pushQuad(floorMeshes, [[b.x1, b.h, b.z1], [b.x1, b.h, b.z2], [b.x2, b.h, b.z2], [b.x2, b.h, b.z1]], [0, 1, 0], 4.5);
    } else {
      pushBox(floorMeshes, b.x1, b.h - 1.2, b.z1, b.x2, b.h, b.z2, 4.5, false);
    }
  }

  const wallGeo = toGeometry(wallMeshes);
  const trimGeo = toGeometry(trimMeshes);
  const floorGeo = toGeometry(floorMeshes);
  const wallMesh = new THREE.Mesh(wallGeo, wallMat);
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  for (const m of [wallMesh, trimMesh, floorMesh]) { m.castShadow = false; m.receiveShadow = true; }
  wallMesh.castShadow = true;
  group.add(wallMesh, trimMesh, floorMesh);

  // ---- crates & barrels ----
  const crateGroup = new THREE.Group();
  group.add(crateGroup);
  for (const c of world.crates) {
    const base = world.groundBaseAt(c.x, c.z);
    if (c.kind === 'barrel') {
      const geo = new THREE.CylinderGeometry(c.w / 2, c.w / 2, c.h, 14);
      const mesh = new THREE.Mesh(geo, metalMat);
      mesh.position.set(c.x, base + c.h / 2, c.z);
      mesh.castShadow = true; mesh.receiveShadow = true;
      crateGroup.add(mesh);
      const ringGeo = new THREE.TorusGeometry(c.w / 2 + 0.02, 0.05, 6, 16);
      for (const ry of [0.28, 0.72]) {
        const ring = new THREE.Mesh(ringGeo, metalMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(c.x, base + c.h * ry, c.z);
        crateGroup.add(ring);
      }
    } else {
      const geo = new THREE.BoxGeometry(c.w, c.h, c.d);
      const mesh = new THREE.Mesh(geo, crateMat);
      mesh.position.set(c.x, base + c.h / 2, c.z);
      mesh.rotation.y = c.yaw ?? 0;
      mesh.castShadow = true; mesh.receiveShadow = true;
      crateGroup.add(mesh);
      // lid seam for readability
      const seam = new THREE.Mesh(new THREE.BoxGeometry(c.w + 0.04, 0.06, c.d + 0.04), trimMat);
      seam.position.set(c.x, base + c.h * 0.5, c.z);
      crateGroup.add(seam);
    }
  }

  // ---- bombsite markers ----
  for (const site of [SITE_A, SITE_B]) {
    const base = world.groundBaseAt(site.cx, site.cz);
    const size = Math.min(site.x2 - site.x1, site.z2 - site.z1) * 0.55;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({ map: siteMarkerTexture(site.name), transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(site.cx, base + 0.03, site.cz);
    group.add(mesh);
  }

  // ---- tunnel ceilings ----
  const ceilMeshes: MeshArrays = { pos: [], norm: [], uv: [], idx: [] };
  for (const c of world.ceilings) {
    pushBox(ceilMeshes, c.x1, c.h, c.z1, c.x2, c.h + 0.4, c.z2, 4.5, true);
  }
  if (ceilMeshes.pos.length) {
    const ceilMesh = new THREE.Mesh(toGeometry(ceilMeshes), wallMat);
    ceilMesh.castShadow = true; ceilMesh.receiveShadow = true;
    group.add(ceilMesh);
  }

  return {
    group,
    dispose() {
      scene.remove(group);
      group.traverse(o => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      wallMat.dispose(); floorMat.dispose(); crateMat.dispose(); metalMat.dispose(); trimMat.dispose();
      sandMap.dispose(); groundMap.dispose(); crateMap.dispose(); metalMap.dispose();
    },
  };
}

/* ------------------------------------------------------------------ */
/* doors (mid doors / B doors / long doors) — physical, passable bodies */
/* Panels sit flush inside the doorway edges (swung open), so they are  */
/* solid, visible door bodies while the gaps stay fully traversable.    */
/* ------------------------------------------------------------------ */

interface PanelDef { x: number; z: number; rot: number; w: number; h: number }

const PANELS: PanelDef[] = [
  // mid double doors — two openings, four panels in the wall plane
  { x: -4.16, z: -3.2, rot: Math.PI / 2, w: 2.9, h: 3.4 },
  { x: -0.84, z: -3.2, rot: Math.PI / 2, w: 2.9, h: 3.4 },
  { x: 0.34, z: -3.2, rot: Math.PI / 2, w: 2.9, h: 3.4 },
  { x: 3.66, z: -3.2, rot: Math.PI / 2, w: 2.9, h: 3.4 },
  // B doors — two openings along z
  { x: -26.5, z: -59.64, rot: Math.PI / 2, w: 2.9, h: 3.2 },
  { x: -26.5, z: -56.36, rot: Math.PI / 2, w: 2.9, h: 3.2 },
  { x: -26.5, z: -55.14, rot: Math.PI / 2, w: 2.9, h: 3.2 },
  { x: -26.5, z: -51.86, rot: Math.PI / 2, w: 2.9, h: 3.2 },
  // long doors
  { x: 33.24, z: 41.3, rot: Math.PI / 2, w: 3.4, h: 3.4 },
  { x: 36.76, z: 41.3, rot: Math.PI / 2, w: 3.4, h: 3.4 },
];

export function buildDoors(scene: THREE.Scene, world: World): THREE.Mesh[] {
  const mat = new THREE.MeshLambertMaterial({ map: metalTexture() });
  const trim = new THREE.MeshLambertMaterial({ color: 0x3b4238 });
  const meshes: THREE.Mesh[] = [];
  for (const d of PANELS) {
    const geo = new THREE.BoxGeometry(d.w, d.h, 0.16);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(d.x, d.h / 2, d.z);
    m.rotation.y = d.rot;
    m.castShadow = true; m.receiveShadow = true;
    scene.add(m);
    meshes.push(m);
    // handle bar + collider (flush with the solid doorway edge)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, d.w * 0.6), trim);
    bar.position.set(0, d.h * 0.5, 0);
    m.add(bar);
    const alongX = Math.abs(Math.cos(d.rot)) > 0.5;
    const hx = alongX ? d.w / 2 : 0.1;
    const hz = alongX ? 0.1 : d.w / 2;
    world.colliders.push({
      x1: d.x - hx, y1: 0, z1: d.z - hz,
      x2: d.x + hx, y2: d.h, z2: d.z + hz,
    });
  }
  return meshes;
}
