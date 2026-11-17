import * as THREE from 'three';
import type { Box, Point, Rect } from './types';
import { circleBox, clamp, rayBox, seeded } from './math';

export const MAP_BOUNDS = { x1: -44, x2: 46, z1: -46, z2: 36 };
export const ZONES: Rect[] = [
  { x1: -12, x2: 12, z1: -44, z2: -32, name: 'T SPAWN' },
  { x1: -30, x2: 28, z1: -36, z2: -28, name: 'T CROSS' },
  { x1: 16, x2: 34, z1: -32, z2: -18, name: 'OUTSIDE LONG' },
  { x1: 26, x2: 36, z1: -22, z2: -12, name: 'LONG DOORS' },
  { x1: 30, x2: 40, z1: -14, z2: 20, name: 'A LONG' },
  { x1: 36, x2: 44, z1: -12, z2: 0, name: 'PIT' },
  { x1: 22, x2: 40, z1: 10, z2: 28, name: 'A SITE' },
  { x1: 8, x2: 28, z1: 22, z2: 30, name: 'CT RAMP' },
  { x1: -8, x2: 14, z1: 22, z2: 34, name: 'CT SPAWN' },
  { x1: -6, x2: 6, z1: 6, z2: 26, name: 'CT MID' },
  { x1: -6, x2: 6, z1: -32, z2: 8, name: 'MID' },
  { x1: -12, x2: 8, z1: -30, z2: -20, name: 'TOP MID' },
  { x1: -2, x2: 20, z1: -18, z2: -10, name: 'CATWALK' },
  { x1: 14, x2: 22, z1: -12, z2: 16, name: 'A SHORT' },
  { x1: 18, x2: 30, z1: 10, z2: 18, name: 'SHORT RAMP' },
  { x1: -34, x2: -22, z1: -32, z2: -12, name: 'UPPER TUNNELS' },
  { x1: -38, x2: -24, z1: -16, z2: -4, name: 'B TUNNELS' },
  { x1: -38, x2: -28, z1: -4, z2: 10, name: 'TUNNEL EXIT' },
  { x1: -40, x2: -20, z1: 4, z2: 22, name: 'B SITE' },
  { x1: -24, x2: -4, z1: 16, z2: 24, name: 'B DOORS' },
  { x1: -28, x2: -20, z1: -16, z2: -4, name: 'TUNNEL STAIRS' },
  { x1: -24, x2: -4, z1: -12, z2: -4, name: 'LOWER TUNNELS' },
];
export const SITES = { A: { x: 31, z: 19, radius: 6.5 }, B: { x: -30, z: 13, radius: 6.6 } };
export const SPAWNS = { T: { x: 0, z: -39 }, CT: { x: 2, z: 29 } };
export const ROUTES: Record<string, Point[]> = {
  long: [{ x: 22, z: -30 }, { x: 31, z: -22 }, { x: 33, z: -12 }, { x: 35, z: 5 }, { x: 32, z: 19 }],
  short: [{ x: 0, z: -24 }, { x: 1, z: -14 }, { x: 18, z: -14 }, { x: 18, z: 9 }, { x: 29, z: 16 }],
  tunnels: [{ x: -26, z: -31 }, { x: -28, z: -20 }, { x: -31, z: -10 }, { x: -33, z: 1 }, { x: -30, z: 13 }],
  mid: [{ x: 0, z: -22 }, { x: 0, z: 0 }, { x: 0, z: 12 }, { x: -16, z: 20 }, { x: -29, z: 14 }],
};

export class World {
  readonly group = new THREE.Group();
  readonly colliders: Box[] = [];
  readonly boundary: Box[] = [];
  readonly crates: Box[] = [];
  private materials = new Map<string, THREE.MeshStandardMaterial>();
  private boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  private cellSet = new Set<string>();

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
    this.floor();
    this.walls();
    this.cover();
    this.doors();
    this.tunnels();
    this.environment();
    this.siteMarker('A', SITES.A.x, SITES.A.z, 0xba6341);
    this.siteMarker('B', SITES.B.x, SITES.B.z, 0xba6341);
    this.batchBuildings();
  }

  private batchBuildings() {
    const boxes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>[] = [];
    for (const child of [...this.group.children]) {
      if (!(child instanceof THREE.Mesh) || child instanceof THREE.InstancedMesh || child.geometry !== this.boxGeometry || Array.isArray(child.material)) continue;
      boxes.push(child as THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>);
    }
    const mesh = new THREE.InstancedMesh(this.boxGeometry, this.material(0xffffff), boxes.length);
    boxes.forEach((object, i) => { object.updateMatrix(); mesh.setMatrixAt(i, object.matrix); mesh.setColorAt(i, object.material.color); this.group.remove(object); });
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); this.group.add(mesh);
  }

  contains(x: number, z: number) { return ZONES.some(r => x > r.x1 && x < r.x2 && z > r.z1 && z < r.z2); }
  heightAt(x: number, z: number) { return 2.4 * clamp((x - 18) / 8, 0, 1) * clamp((z - 2) / 10, 0, 1); }
  zoneAt(x: number, z: number) {
    const site = Object.entries(SITES).find(([, s]) => Math.hypot(x - s.x, z - s.z) < s.radius);
    if (site) return `${site[0]} SITE`;
    const found = [...ZONES].reverse().find(r => x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2);
    return found?.name ?? 'DUST II';
  }
  siteAt(x: number, z: number): 'A' | 'B' | null {
    for (const key of ['A', 'B'] as const) { const s = SITES[key]; if (Math.hypot(x - s.x, z - s.z) < s.radius) return key; }
    return null;
  }
  clear(x: number, z: number, radius = .38, y = this.heightAt(x, z)) {
    for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [.71, .71], [-.71, .71], [.71, -.71], [-.71, -.71]]) {
      if (!this.contains(x + dx * radius, z + dz * radius)) return false;
    }
    return !this.colliders.some(b => b.maxY > y + .12 && b.minY < y + 1.8 && circleBox(x, z, radius, b));
  }
  lineWalkable(a: Point, b: Point, radius = .42) {
    const steps = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / .45);
    for (let i = 0; i <= steps; i++) {
      const t = steps ? i / steps : 0;
      if (!this.clear(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t, radius)) return false;
    }
    return true;
  }
  raycast(origin: THREE.Vector3, direction: THREE.Vector3, limit = 160) {
    let nearest = limit;
    for (const box of this.colliders) nearest = Math.min(nearest, rayBox(origin, direction, box, nearest));
    // Ground blocks sight across the raised A platform as well as walls.
    for (let t = .6; t < nearest; t += .7) {
      const x = origin.x + direction.x * t, z = origin.z + direction.z * t;
      if (origin.y + direction.y * t < this.heightAt(x, z)) { nearest = t; break; }
    }
    return nearest;
  }
  visible(from: THREE.Vector3, to: THREE.Vector3) {
    const dir = to.clone().sub(from); const d = dir.length();
    return this.raycast(from, dir.normalize(), d) >= d - .12;
  }

  material(color: number, roughness = .88, metalness = 0) {
    const key = `${color}/${roughness}/${metalness}`;
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    return this.materials.get(key)!;
  }
  box(x: number, y: number, z: number, w: number, h: number, d: number, color: number, shadow = true) {
    const mesh = new THREE.Mesh(this.boxGeometry, this.material(color));
    mesh.position.set(x, y + h / 2, z); mesh.scale.set(w, h, d);
    mesh.castShadow = shadow; mesh.receiveShadow = true; this.group.add(mesh);
    return mesh;
  }
  obstacle(x: number, z: number, w: number, d: number, height: number, color: number, kind: Box['kind'] = 'wall', base = this.heightAt(x, z)) {
    const b: Box = { x, z, w, d, minY: base, maxY: base + height, kind };
    this.colliders.push(b); this.box(x, base, z, w, height, d, color);
    return b;
  }

  private floor() {
    const positions: number[] = [], colors: number[] = [];
    const color = new THREE.Color();
    for (let x = -44; x < 46; x += 2) for (let z = -46; z < 36; z += 2) {
      if (!this.contains(x + 1, z + 1)) continue;
      this.cellSet.add(`${x},${z}`);
      const vertices = [[x, z], [x, z + 2], [x + 2, z], [x + 2, z], [x, z + 2], [x + 2, z + 2]];
      color.setHex(0xbeb193).multiplyScalar(.94 + seeded(x * 9 + z * 2) * .10);
      for (const [vx, vz] of vertices) { positions.push(vx, this.heightAt(vx, vz), vz); colors.push(color.r, color.g, color.b); }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); mesh.receiveShadow = true; this.group.add(mesh);
    this.box(0, -1, -5, 240, .8, 240, 0xc3b79c, false);
    // Hairline paving joints are geometry, never image textures.
    const lines: number[] = [];
    for (const key of this.cellSet) {
      const [x, z] = key.split(',').map(Number);
      if (seeded(x + z * 11) > .4) {
        lines.push(x, this.heightAt(x, z) + .006, z, x + 1.97, this.heightAt(x + 1.97, z) + .006, z);
        lines.push(x, this.heightAt(x, z) + .006, z, x, this.heightAt(x, z + 1.97) + .006, z + 1.97);
      }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    this.group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x988d75, transparent: true, opacity: .23 })));
  }
  private walls() {
    const edges = new Map<string, number[]>();
    const add = (key: string, n: number) => { const list = edges.get(key) ?? []; list.push(n); edges.set(key, list); };
    for (const key of this.cellSet) {
      const [x, z] = key.split(',').map(Number);
      if (!this.cellSet.has(`${x - 2},${z}`)) add(`v:${x}`, z);
      if (!this.cellSet.has(`${x + 2},${z}`)) add(`v:${x + 2}`, z);
      if (!this.cellSet.has(`${x},${z - 2}`)) add(`h:${z}`, x);
      if (!this.cellSet.has(`${x},${z + 2}`)) add(`h:${z + 2}`, x);
    }
    for (const [key, values] of edges) {
      values.sort((a, b) => a - b);
      let start = values[0], end = start + 2;
      const finish = () => {
        const [axis, coord] = key.split(':'); const c = Number(coord); const vertical = axis === 'v';
        const x = vertical ? c : (start + end) / 2, z = vertical ? (start + end) / 2 : c;
        const h = 6.2 + Math.floor(seeded(x + z * 3) * 3) * 1.3;
        const shade = new THREE.Color(0xd3bf98).multiplyScalar(.9 + seeded(x * 2 + z) * .15).getHex();
        const w = vertical ? .65 : end - start + .4, d = vertical ? end - start + .4 : .65;
        const b = this.obstacle(x, z, w, d, h, shade, 'wall', -.25);
        this.boundary.push(b);
        this.box(x, h - .4, z, w + .22, .26, d + .22, 0xb09b7d);
        this.box(x, .22, z, w + .08, .32, d + .08, 0xb5a27e);
        const count = Math.floor((end - start) / 4.5);
        for (let j = 0; j < count; j++) {
          const t = start + (j + .5) * ((end - start) / count);
          if (seeded(t + c * 13) < .17) continue;
          // Shutters on both faces make the enclosing buildings readable from either route.
          const wx = vertical ? c : t, wz = vertical ? t : c;
          this.box(wx, 3.6, wz, vertical ? .74 : 1.1, 1.35, vertical ? 1.1 : .74, 0x647b79);
          this.box(wx, 3.48, wz, vertical ? .86 : 1.35, .12, vertical ? 1.35 : .86, 0xbcb29a);
          for (let s = 0; s < 4; s++) this.box(wx, 3.8 + s * .24, wz, vertical ? .76 : 1.03, .035, vertical ? 1.03 : .76, 0x455b5b, false);
        }
      };
      for (let i = 1; i < values.length; i++) {
        if (values[i] === end) end += 2;
        else { finish(); start = values[i]; end = start + 2; }
      }
      finish();
    }
  }
  private crate(x: number, z: number, w = 2, d = 2, h = 2, stack = false) {
    const y = this.heightAt(x, z); const color = stack ? 0x819183 : 0x998466;
    const b = this.obstacle(x, z, w, d, h, color, 'crate'); this.crates.push(b);
    for (const side of [-1, 1]) {
      this.box(x, y + .14, z + side * (d / 2 + .02), w + .07, .13, .08, 0x655c4a);
      this.box(x, y + h - .26, z + side * (d / 2 + .02), w + .07, .13, .08, 0x655c4a);
      for (const sx of [-1, 1]) this.box(x + sx * (w / 2 - .15), y, z + side * (d / 2 + .035), .16, h, .1, 0x776b53);
      this.box(x + side * (w / 2 + .025), y + .16, z, .08, .11, d, 0x655c4a);
      this.box(x + side * (w / 2 + .025), y + h - .27, z, .08, .11, d, 0x655c4a);
    }
    for (let i = 1; i < Math.ceil(w); i++) this.box(x - w / 2 + i, y, z, .018, h, d + .025, 0x827252, false);
  }
  private cover() {
    this.crate(27.4, 18, 3.4, 3, 2.5, true); this.crate(27.4, 18, 2.8, 2.6, 3.5, true);
    this.crate(35.8, 24.2, 3.4, 2.3, 2.2); this.crate(36.2, 14.5, 2, 2, 1.1);
    this.crate(-24, 9, 3, 3, 2.7, true); this.crate(-36.5, 16.5, 3, 2.3, 1.6);
    this.crate(-27.5, 19.2, 3, 2, 2.2); this.crate(-22.1, 18.4, 2, 2, 1.1);
    this.crate(-3.8, -18.2, 2.2, 2, 1.3); this.crate(3.9, -3.5, 2, 2.4, 2.5);
    this.crate(-10, -31, 2, 2, 1.5); this.crate(27, -27, 2, 2, 2.2);
    this.crate(39, -6, 2.4, 2, 1.1); this.crate(-25.5, -23, 1.7, 2.5, 1.5);
    this.crate(8, 30.5, 3, 2, 1.4); this.crate(19.7, -5, 1.6, 2, 1.05);
    // A wrecked car is assembled from box geometry; the entire silhouette collides.
    const carY = this.heightAt(38, 5);
    this.obstacle(38, 5, 1.6, 3.9, 1.2, 0x9bada6, 'crate');
    this.box(38, carY + 1.1, 5.2, 1.45, .65, 1.9, 0x738c8b);
    this.colliders.push({ x: 38, z: 5.2, w: 1.45, d: 1.9, minY: carY + 1.1, maxY: carY + 1.75, kind: 'crate' });
    this.box(38, carY + 1.25, 4.18, 1.3, .4, .04, 0x405658);
    for (const sx of [-.84, .84]) for (const sz of [-1.25, 1.25]) this.box(38 + sx, carY + .15, 5 + sz, .18, .55, .65, 0x343a38);
  }
  private door(x: number, z: number, width: number) {
    const y = this.heightAt(x, z);
    this.obstacle(x - width / 2 - .3, z, .6, 1.1, 4.9, 0xbca582);
    this.obstacle(x + width / 2 + .3, z, .6, 1.1, 4.9, 0xbca582);
    this.obstacle(x, z, width + 1.2, 1.1, .7, 0xc6ad87, 'roof', y + 4.2);
    const gap = 3.1, leaf = (width - gap) / 2;
    for (const s of [-1, 1]) {
      const px = x + s * (gap / 2 + leaf / 2), pz = z + s * .5;
      this.obstacle(px, pz, leaf, .26, 4.1, 0x705b3f, 'door');
      for (let j = 0; j < 6; j++) this.box(px - leaf / 2 + (j + .5) * leaf / 6, y, pz, .025, 4.08, .29, 0x4b422f);
      for (const h of [.5, 2, 3.6]) this.box(px, y + h, pz, leaf + .06, .13, .32, 0x343b35);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.12, .028, 6, 12), this.material(0x2d342f, .5, .5)); ring.position.set(px - s * (leaf / 2 - .3), y + 1.9, pz - .2); this.group.add(ring);
    }
  }
  private doors() { this.door(0, 4, 10.6); this.door(31, -18, 8.6); this.door(-15.5, 20, 7.4); }
  private tunnels() {
    this.obstacle(-28, -23, 11.5, 15, .6, 0xa38f73, 'roof', 4.1);
    this.obstacle(-31, -10, 13, 10, .6, 0xa38f73, 'roof', 4.1);
    this.obstacle(-14, -8, 19, 7.5, .6, 0xa38f73, 'roof', 3.9);
    for (const [x, z] of [[-28, -26], [-30, -11], [-14, -8]]) {
      this.box(x, 3.7, z, .35, .25, .35, 0xffe6a5);
      const light = new THREE.PointLight(0xffc780, 14, 12, 2); light.position.set(x, 3.4, z); this.group.add(light);
    }
    // Portal ribs frame the tunnel mouth without obstructing its middle.
    for (const x of [-37.5, -28.5]) this.obstacle(x, 3, .55, .8, 4, 0xb19d7c);
    this.obstacle(-33, 3, 9.5, .8, .65, 0xb19d7c, 'roof', 3.7);
  }
  private siteMarker(letter: 'A' | 'B', x: number, z: number, color: number) {
    const y = this.heightAt(x, z) + .018;
    const points = [new THREE.Vector3(x - 5, y, z - 5), new THREE.Vector3(x + 5, y, z - 5), new THREE.Vector3(x + 5, y, z + 5), new THREE.Vector3(x - 5, y, z + 5), new THREE.Vector3(x - 5, y, z - 5)];
    this.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color })));
    const strokes = letter === 'A' ? [[-1, 1, 0, -1], [0, -1, 1, 1], [-.6, .3, .6, .3]] : [[-.8, -1, -.8, 1], [-.8, -1, .6, -1], [.6, -1, 1, -.5], [1, -.5, -.8, 0], [-.8, 0, .7, 0], [.7, 0, 1, .6], [1, .6, .6, 1], [.6, 1, -.8, 1]];
    for (const [a, b, c, d] of strokes) {
      const ax = x + a * 1.4, az = z + b * 1.4, bx = x + c * 1.4, bz = z + d * 1.4;
      const mesh = this.box((ax + bx) / 2, y, (az + bz) / 2, Math.hypot(bx - ax, bz - az), .025, .12, color, false); mesh.rotation.y = -Math.atan2(bz - az, bx - ax);
    }
    // Monumental wall sign: shape geometry instead of a font or image asset.
    const signX = letter === 'A' ? 39.6 : -39.55, signZ = z;
    this.box(signX, y + 1.8, signZ, .1, 2.5, 2.9, 0xbba17b);
    for (const [a, b, c, d] of strokes) {
      const mesh = this.box(signX + (letter === 'A' ? -.09 : .09), y + 3 - (b + d) / 2 * .8, signZ + (a + c) / 2 * .8, .05, .13, Math.hypot(c - a, d - b) * .8, color, false);
      mesh.rotation.x = Math.atan2(d - b, c - a);
    }
  }
  private environment() {
    // Buildings occupy inaccessible blocks. Boundary walls already provide all collisions.
    for (const [x, z, w, d, h] of [[10, 5, 6, 24, 10], [26, -3, 5, 19, 8], [-14, 4, 12, 17, 9], [-15, -20, 8, 12, 10], [0, -49, 38, 6, 11], [48, 4, 7, 70, 11], [-45, 0, 6, 66, 10], [-16, 31, 12, 10, 9]]) {
      this.obstacle(x, z, w, d, h, 0xc7b28f, 'wall', -.2);
      this.box(x, h - .25, z, w + .4, .35, d + .4, 0xa18e72);
      this.box(x, h, z, w * .65, .45, d * .65, 0xb7a17e);
      for (let i = 0; i < Math.floor(d / 4); i++) {
        for (const s of [-1, 1]) this.box(x + s * (w / 2 + .03), 5.4, z - d / 2 + 2 + i * 4, .08, 1.5, 1, 0x5c7371);
      }
    }
    const dome = new THREE.Mesh(new THREE.SphereGeometry(3.8, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), this.material(0xa5b9b5)); dome.position.set(-17, 10, 33); this.group.add(dome);
    this.box(-17, 8, 33, 8, 2, 8, 0xcbb897);
    this.box(-23, 0, 33, 2.2, 15, 2.2, 0xcebb9c); this.box(-23, 12, 33, 3, .4, 3, 0xaaa78a);
    for (const [x, z] of [[43, 25], [-43, -20], [12, -44], [-41, 25]]) {
      this.box(x, 0, z, .6, 9, .6, 0x766f4d);
      for (let i = 0; i < 8; i++) {
        const g = new THREE.ConeGeometry(.55, 5, 3); const mesh = new THREE.Mesh(g, this.material(0x677653));
        const a = i * Math.PI / 4; mesh.position.set(x + Math.cos(a) * 1.5, 8.6, z + Math.sin(a) * 1.5); mesh.rotation.set(Math.cos(a) * 1.1, a, Math.sin(a) * 1.1); this.group.add(mesh);
      }
    }
    // Overhead cables.
    for (const [x1, z1, x2, z2] of [[-6, -20, 6, -20], [30, -4, 40, -4], [-40, 10, -20, 10], [14, -5, 22, -5]]) {
      const points = [];
      for (let t = 0; t <= 1.01; t += .05) points.push(new THREE.Vector3(x1 + (x2 - x1) * t, 6.4 - Math.sin(t * Math.PI) * 1.1, z1 + (z2 - z1) * t));
      this.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x4e5044 })));
    }
    // Small rubble and weeds are drawn with instancing.
    const instances = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), this.material(0xa99d80), 180);
    const matrix = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), s = new THREE.Vector3(); let count = 0;
    for (let i = 0; i < 900 && count < 180; i++) {
      const x = -42 + seeded(i * 7) * 86, z = -44 + seeded(i * 13) * 78;
      if (!this.clear(x, z, .3)) continue;
      v.set(x, this.heightAt(x, z) + .025, z); s.set(.03 + seeded(i) * .12, .025 + seeded(i * 5) * .06, .04 + seeded(i * 9) * .09); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), i); matrix.compose(v, q, s); instances.setMatrixAt(count++, matrix);
    }
    instances.count = count; this.group.add(instances);
  }
}
