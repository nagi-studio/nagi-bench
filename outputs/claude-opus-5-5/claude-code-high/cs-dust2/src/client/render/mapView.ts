// Builds the static Dust2 scene (floors, walls, props, decals, sky) from the core World data.
import * as THREE from 'three';
import type { World, Solid } from '../../core/world.ts';
import { areaHeight } from '../../core/world.ts';
import { BOMBSITES, PROPS } from '../../core/mapData.ts';
import type { RegionId } from '../../core/mapData.ts';
import { GeoBuilder } from './geom.ts';
import type { RGB } from './geom.ts';
import * as T from './textures.ts';
import { makeRng } from '../../core/math.ts';

const TILE_REGIONS: RegionId[] = ['asite', 'bsite', 'ctspawn', 'short', 'bdoors', 'middoors'];
const REGION_TINT: Partial<Record<RegionId, RGB>> = {
  tunnels: [0.78, 0.74, 0.7],
  lowertunnel: [0.78, 0.74, 0.7],
  cat: [1.02, 0.98, 0.92],
  long: [1.0, 0.97, 0.93],
  tspawn: [1.03, 1.0, 0.95],
};

export interface MapMaterials {
  sandstone: THREE.MeshLambertMaterial;
  plaster: THREE.MeshLambertMaterial;
  sandFloor: THREE.MeshLambertMaterial;
  tiles: THREE.MeshLambertMaterial;
  crate: THREE.MeshLambertMaterial;
  door: THREE.MeshLambertMaterial;
  container: THREE.MeshLambertMaterial;
  concrete: THREE.MeshLambertMaterial;
  wood: THREE.MeshLambertMaterial;
  trim: THREE.MeshLambertMaterial;
}

function makeMaterials(): MapMaterials {
  const lam = (map: THREE.Texture, color = 0xffffff) => new THREE.MeshLambertMaterial({ map, color, vertexColors: true });
  const trimTex = T.sandstoneTexture(11);
  return {
    sandstone: lam(T.sandstoneTexture(1)),
    plaster: lam(T.plasterTexture(2)),
    sandFloor: lam(T.sandFloorTexture(3)),
    tiles: lam(T.stoneTilesTexture(4)),
    crate: lam(T.crateTexture(5)),
    door: lam(T.doorTexture(6)),
    container: lam(T.containerTexture(7)),
    concrete: lam(T.concreteTexture(8)),
    wood: lam(T.woodBeamTexture(9)),
    trim: lam(trimTex, 0x9c8260),
  };
}

export class MapView {
  readonly group = new THREE.Group();
  readonly materials: MapMaterials;

  constructor(world: World) {
    this.materials = makeMaterials();
    this.buildFloors(world);
    this.buildWalls(world);
    this.buildProps(world);
    this.buildDecals(world);
    this.group.add(buildSky());
  }

  private addMesh(b: GeoBuilder, mat: THREE.Material, cast = true, receive = true) {
    if (b.empty) return;
    const m = new THREE.Mesh(b.build(), mat);
    m.castShadow = cast;
    m.receiveShadow = receive;
    m.matrixAutoUpdate = false;
    m.updateMatrix();
    this.group.add(m);
  }

  private buildFloors(world: World) {
    const sand = new GeoBuilder();
    const tiles = new GeoBuilder();
    const rng = makeRng(99);
    for (let j = 0; j < world.gh; j++) {
      for (let i = 0; i < world.gw; i++) {
        if (!world.isOpenCell(i, j)) continue;
        const x0 = world.gx0 + i;
        const z0 = world.gz0 + j;
        const x1 = x0 + 1;
        const z1 = z0 + 1;
        const a = world.areaAt(x0 + 0.5, z0 + 0.5)!;
        const h = (x: number, z: number) => areaHeight(a, x, z);
        const tint = REGION_TINT[a.region] ?? [1, 1, 1];
        const v = 0.95 + rng() * 0.08;
        const col: RGB = [tint[0] * v, tint[1] * v, tint[2] * v];
        const b = TILE_REGIONS.includes(a.region) ? tiles : sand;
        const s = 4;
        b.quadAuto(
          [
            [x0, h(x0, z1), z1],
            [x1, h(x1, z1), z1],
            [x1, h(x1, z0), z0],
            [x0, h(x0, z0), z0],
          ],
          [
            [x0 / s, -z1 / s],
            [x1 / s, -z1 / s],
            [x1 / s, -z0 / s],
            [x0 / s, -z0 / s],
          ],
          col,
        );
      }
    }
    this.addMesh(sand, this.materials.sandFloor, false, true);
    this.addMesh(tiles, this.materials.tiles, false, true);
  }

  private adjacentFloor(world: World, s: Solid): number {
    let best = -Infinity;
    const sample = (x: number, z: number) => {
      const f = world.floorAt(x, z);
      if (f !== null && f > best) best = f;
    };
    for (let x = s.minX + 0.5; x < s.maxX; x += 1) {
      sample(x, s.minZ - 0.5);
      sample(x, s.maxZ + 0.5);
    }
    for (let z = s.minZ + 0.5; z < s.maxZ; z += 1) {
      sample(s.minX - 0.5, z);
      sample(s.maxX + 0.5, z);
    }
    return best === -Infinity ? 0 : best;
  }

  private buildWalls(world: World) {
    const sandstone = new GeoBuilder();
    const plaster = new GeoBuilder();
    const trim = new GeoBuilder();
    const caps = new GeoBuilder();
    world.solids.forEach((s, idx) => {
      if (s.kind !== 'wall') return;
      const floor = this.adjacentFloor(world, s);
      const b = (Math.floor(s.minX * 3.1 + s.minZ * 1.7) + idx) % 3 === 0 ? plaster : sandstone;
      const tone = 0.93 + ((idx * 37) % 10) / 100;
      b.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { texScale: 4, color: [tone, tone * 0.99, tone * 0.97], skipBottom: true, bottomShade: 0.9 });
      // stone foundation band and a top cap: gives the walls the chunky Dust2 silhouette
      const e = 0.05;
      trim.box(s.minX - e, floor - 0.3, s.minZ - e, s.maxX + e, floor + 0.45, s.maxZ + e, { texScale: 2, color: [0.9, 0.88, 0.85], skipBottom: true });
      const c = 0.12;
      caps.box(s.minX - c, s.maxY, s.minZ - c, s.maxX + c, s.maxY + 0.28, s.maxZ + c, { texScale: 2, color: [1.05, 1.03, 1.0] });
    });
    this.addMesh(sandstone, this.materials.sandstone);
    this.addMesh(plaster, this.materials.plaster);
    this.addMesh(trim, this.materials.trim, false, true);
    this.addMesh(caps, this.materials.trim);
  }

  private buildProps(world: World) {
    const crates = new GeoBuilder();
    const doors = new GeoBuilder();
    const containers = new GeoBuilder();
    const concrete = new GeoBuilder();
    const wood = new GeoBuilder();
    const walls = new GeoBuilder();
    const propSolids = world.solids.filter((s) => s.kind !== 'wall');
    const rng = makeRng(7);
    for (const s of propSolids) {
      switch (s.kind) {
        case 'crate': {
          const v = 0.9 + rng() * 0.15;
          crates.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { uv: 'face', color: [v, v, v], bottomShade: 0.8 });
          break;
        }
        case 'door':
          doors.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { uv: 'face' });
          break;
        case 'container':
          containers.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { texScale: 2 });
          // top rim
          containers.box(s.minX - 0.04, s.maxY - 0.12, s.minZ - 0.04, s.maxX + 0.04, s.maxY, s.maxZ + 0.04, { texScale: 2, color: [0.7, 0.7, 0.7] });
          break;
        case 'concrete':
          concrete.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { texScale: 2, bottomShade: 0.8 });
          break;
        case 'lintel':
          walls.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { texScale: 4, skipBottom: false });
          // wooden beam under the lintel
          wood.box(s.minX - 0.3, s.minY - 0.22, s.minZ - 0.05, s.maxX + 0.3, s.minY, s.maxZ + 0.05, { texScale: 1 });
          break;
        case 'roof':
          wood.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { texScale: 2, color: [0.8, 0.8, 0.8] });
          // cross beams
          for (let z = s.minZ + 1; z < s.maxZ; z += 3) wood.box(s.minX, s.minY - 0.25, z, s.maxX, s.minY, z + 0.3, { texScale: 1, color: [0.7, 0.7, 0.7] });
          break;
        case 'car':
          break; // separate detailed mesh below
        case 'barrel':
          break;
        default:
          crates.box(s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, { uv: 'face' });
      }
    }
    this.addMesh(crates, this.materials.crate);
    this.addMesh(doors, this.materials.door);
    this.addMesh(containers, this.materials.container);
    this.addMesh(concrete, this.materials.concrete);
    this.addMesh(wood, this.materials.wood);
    this.addMesh(walls, this.materials.sandstone);

    // B-site car: body + cabin + wheels
    const cars = PROPS.filter((p) => p.kind === 'car');
    if (cars.length) {
      const body = cars[0];
      const carMat = new THREE.MeshLambertMaterial({ color: 0x8c3a2b });
      const glassMat = new THREE.MeshLambertMaterial({ color: 0x2c3a44 });
      const tireMat = new THREE.MeshLambertMaterial({ color: 0x1b1b1b });
      const g = new THREE.Group();
      const bw = body.x1 - body.x0;
      const bd = body.z1 - body.z0;
      const by0 = body.y0 ?? 0.25;
      const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, body.h, bd), carMat);
      bodyMesh.position.set((body.x0 + body.x1) / 2, by0 + body.h / 2, (body.z0 + body.z1) / 2);
      g.add(bodyMesh);
      if (cars[1]) {
        const c = cars[1];
        const cab = new THREE.Mesh(new THREE.BoxGeometry(c.x1 - c.x0, c.h, c.z1 - c.z0), glassMat);
        cab.position.set((c.x0 + c.x1) / 2, (c.y0 ?? 1.25) + c.h / 2, (c.z0 + c.z1) / 2);
        g.add(cab);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(c.x1 - c.x0 + 0.05, 0.06, c.z1 - c.z0 + 0.05), carMat);
        roof.position.set(cab.position.x, (c.y0 ?? 1.25) + c.h, cab.position.z);
        g.add(roof);
      }
      const wheelGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.25, 14);
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const w = new THREE.Mesh(wheelGeo, tireMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(bodyMesh.position.x + sx * (bw / 2 - 0.05), 0.33, bodyMesh.position.z + sz * (bd / 2 - 0.75));
          g.add(w);
        }
      g.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      this.group.add(g);
    }
    // Barrels (visual cylinders over their collision boxes)
    const barrelMat = new THREE.MeshLambertMaterial({ color: 0x7a3322 });
    const ringMat = new THREE.MeshLambertMaterial({ color: 0x4a2a1a });
    for (const s of propSolids.filter((p) => p.kind === 'barrel')) {
      const r = (s.maxX - s.minX) / 2;
      const h = s.maxY - s.minY;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), barrelMat);
      m.position.set((s.minX + s.maxX) / 2, s.minY + h / 2, (s.minZ + s.maxZ) / 2);
      m.castShadow = m.receiveShadow = true;
      this.group.add(m);
      for (const f of [0.25, 0.75]) {
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.015, r + 0.015, 0.05, 16), ringMat);
        ring.position.set(m.position.x, s.minY + h * f, m.position.z);
        this.group.add(ring);
      }
    }
  }

  private buildDecals(world: World) {
    for (const [letter, site] of Object.entries(BOMBSITES)) {
      const tex = T.siteLetterTexture(letter);
      const mat = new THREE.MeshLambertMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), mat);
      m.rotation.x = -Math.PI / 2;
      const [px, pz] = site.plant;
      m.position.set(px, (world.floorAt(px, pz) ?? 0) + 0.02, pz);
      m.receiveShadow = true;
      this.group.add(m);
    }
  }
}

function buildSky(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(450, 32, 16);
  const colors: number[] = [];
  const pos = geo.getAttribute('position');
  const top = new THREE.Color(0x5f97d1);
  const mid = new THREE.Color(0xa9c9e6);
  const hor = new THREE.Color(0xe8d9bd);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 450;
    if (y > 0.25) c.copy(mid).lerp(top, Math.min(1, (y - 0.25) / 0.75));
    else c.copy(hor).lerp(mid, Math.max(0, y / 0.25));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = -10;
  m.frustumCulled = false;
  return m;
}
