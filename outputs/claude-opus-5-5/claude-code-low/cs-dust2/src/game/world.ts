/**
 * Builds the static 3D scene for the map from the grid, plus transient effects (tracers, impacts, explosions).
 */
import * as THREE from 'three';
import { CELL, GH, GW, GameMap, Kind, WALL_H } from './map';
import { Textures } from './models';

export function buildWorld(scene: THREE.Scene, map: GameMap) {
  // ---- sky & fog
  scene.background = new THREE.Color(0xbfd8ec);
  scene.fog = new THREE.Fog(0xd9cdb4, 70, 190);

  // ---- lights
  const hemi = new THREE.HemisphereLight(0xdfefff, 0xb89a6a, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
  const cx = (GW * CELL) / 2, cz = (GH * CELL) / 2;
  sun.position.set(cx + 50, 90, cz + 35);
  sun.target.position.set(cx, 0, cz);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -95;
  sc.right = 95;
  sc.top = 95;
  sc.bottom = -95;
  sc.near = 10;
  sc.far = 260;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  // ---- ground
  const sandTex = Textures.sand();
  sandTex.repeat.set((GW * CELL) / 4, (GH * CELL) / 4);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(GW * CELL, GH * CELL),
    new THREE.MeshStandardMaterial({ map: sandTex, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(cx, 0, cz);
  ground.receiveShadow = true;
  scene.add(ground);

  // ---- walls (only those touching walkable space are rendered)
  const isOpen = (x: number, z: number) => map.inGrid(x, z) && map.kindAt(x, z) !== Kind.Wall && map.kindAt(x, z) !== Kind.Door;
  const wallCells: [number, number][] = [];
  const doorCells: [number, number][] = [];
  const crateCells: [number, number, number][] = [];
  for (let z = 0; z < GH; z++)
    for (let x = 0; x < GW; x++) {
      const k = map.kindAt(x, z);
      if (k === Kind.Wall) {
        let touch = false;
        for (let oz = -1; oz <= 1 && !touch; oz++) for (let ox = -1; ox <= 1; ox++) if (isOpen(x + ox, z + oz)) touch = true;
        if (touch) wallCells.push([x, z]);
      } else if (k === Kind.Door) doorCells.push([x, z]);
      else if (k === Kind.Crate) crateCells.push([x, z, map.heightAt(x, z)]);
    }

  const wallTex = Textures.wall();
  wallTex.repeat.set(1, WALL_H / CELL);
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 });
  const wallGeo = new THREE.BoxGeometry(CELL, WALL_H, CELL);
  const walls = new THREE.InstancedMesh(wallGeo, wallMat, wallCells.length);
  const m4 = new THREE.Matrix4();
  wallCells.forEach(([x, z], i) => {
    m4.makeTranslation(x * CELL + CELL / 2, WALL_H / 2, z * CELL + CELL / 2);
    walls.setMatrixAt(i, m4);
  });
  walls.castShadow = true;
  walls.receiveShadow = true;
  scene.add(walls);

  // wall caps (darker top trim) for readability
  const capGeo = new THREE.BoxGeometry(CELL, 0.25, CELL);
  const caps = new THREE.InstancedMesh(capGeo, new THREE.MeshStandardMaterial({ color: 0xa88a5c, roughness: 1 }), wallCells.length);
  wallCells.forEach(([x, z], i) => {
    m4.makeTranslation(x * CELL + CELL / 2, WALL_H + 0.12, z * CELL + CELL / 2);
    caps.setMatrixAt(i, m4);
  });
  scene.add(caps);

  // ---- doors: wooden leaves (bottom 4m) + wall above
  const DOOR_H = 4.2;
  const doorTex = Textures.door();
  const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.85 });
  for (const [x, z] of doorCells) {
    const wx = x * CELL + CELL / 2, wz = z * CELL + CELL / 2;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(CELL, DOOR_H, 0.5), doorMat);
    leaf.position.set(wx, DOOR_H / 2, wz);
    leaf.castShadow = leaf.receiveShadow = true;
    scene.add(leaf);
    // backing wall behind the door leaf so the cell reads as solid
    const back = new THREE.Mesh(new THREE.BoxGeometry(CELL, DOOR_H, CELL - 0.6), wallMat);
    back.position.set(wx, DOOR_H / 2, wz);
    scene.add(back);
    const top = new THREE.Mesh(new THREE.BoxGeometry(CELL, WALL_H - DOOR_H, CELL), wallMat);
    top.position.set(wx, DOOR_H + (WALL_H - DOOR_H) / 2, wz);
    top.castShadow = true;
    scene.add(top);
  }
  // lintels over door gaps (mid doors and long doors) — purely visual, high above head height
  const lintel = (x0: number, x1: number, z: number) => {
    const w = (x1 - x0 + 1) * CELL;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, WALL_H - DOOR_H - 0.6, CELL), wallMat);
    m.position.set(x0 * CELL + w / 2, DOOR_H + 0.6 + (WALL_H - DOOR_H - 0.6) / 2, z * CELL + CELL / 2);
    m.castShadow = true;
    scene.add(m);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, CELL * 0.8), new THREE.MeshStandardMaterial({ color: 0x4a3420 }));
    beam.position.set(x0 * CELL + w / 2, DOOR_H + 0.45, z * CELL + CELL / 2);
    scene.add(beam);
    // an opened door leaf swung against the wall
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.15, DOOR_H - 0.3, CELL * 1.4), doorMat);
    leaf.position.set(x0 * CELL + 0.1, (DOOR_H - 0.3) / 2, z * CELL + CELL / 2 + CELL * 0.75);
    leaf.castShadow = true;
    scene.add(leaf);
  };
  lintel(29, 31, 24);
  lintel(50, 52, 44);

  // ---- crates
  const crateTex = Textures.crate();
  const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.9 });
  const crateGeo = new THREE.BoxGeometry(CELL * 0.98, 1, CELL * 0.98);
  const crates = new THREE.InstancedMesh(crateGeo, crateMat, crateCells.length);
  crateCells.forEach(([x, z, h], i) => {
    m4.makeScale(1, h, 1).setPosition(x * CELL + CELL / 2, h / 2, z * CELL + CELL / 2);
    crates.setMatrixAt(i, m4);
  });
  crates.castShadow = crates.receiveShadow = true;
  scene.add(crates);

  // ---- bombsite markings
  for (const zone of [map.siteA, map.siteB]) {
    const w = (zone.x1 - zone.x0 + 1) * CELL, d = (zone.z1 - zone.z0 + 1) * CELL;
    const ox = zone.x0 * CELL + w / 2, oz = zone.z0 * CELL + d / 2;
    const tint = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({ color: 0xff4020, transparent: true, opacity: 0.07, depthWrite: false })
    );
    tint.rotation.x = -Math.PI / 2;
    tint.position.set(ox, 0.02, oz);
    scene.add(tint);
    const letter = letterDecal(zone.name);
    letter.position.set(zone.name === 'A' ? map.points.plantA.x : map.points.plantB.x, 0.03, zone.name === 'A' ? map.points.plantA.z : map.points.plantB.z);
    scene.add(letter);
  }

  // ---- direction signs painted on walls (call-outs)
  const sign = (text: string, x: number, y: number, z: number, rotY: number) => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 96;
    const g = c.getContext('2d')!;
    g.fillStyle = 'rgba(0,0,0,0)';
    g.fillRect(0, 0, 256, 96);
    g.font = 'bold 64px sans-serif';
    g.fillStyle = 'rgba(140,30,20,0.85)';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 128, 50);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), new THREE.MeshBasicMaterial({ map: t, transparent: true }));
    m.position.set(x, y, z);
    m.rotation.y = rotY;
    scene.add(m);
  };
  // arrows toward sites
  sign('← B', 44, 2.4, 114.02, 0);
  sign('A →', 76, 2.4, 114.02, 0);
  sign('MID', 54.02, 2.4, 72, Math.PI / 2);
  sign('B', 16.02, 2.4, 60, Math.PI / 2);
  sign('A', 94.02, 2.4, 100, Math.PI / 2);

  return { sun };
}

function letterDecal(ch: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.strokeStyle = 'rgba(170,25,20,0.8)';
  g.lineWidth = 14;
  g.beginPath();
  g.arc(128, 128, 110, 0, Math.PI * 2);
  g.stroke();
  g.font = 'bold 170px sans-serif';
  g.fillStyle = 'rgba(170,25,20,0.8)';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(ch, 128, 138);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

// ====================================================================== effects

interface Fx {
  obj: THREE.Object3D;
  life: number;
  max: number;
  kind: 'tracer' | 'impact' | 'explosion' | 'blood';
}

export class Effects {
  list: Fx[] = [];
  private tracerMat = new THREE.LineBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.9 });
  private impactGeo = new THREE.SphereGeometry(0.06, 5, 4);
  private impactMat = new THREE.MeshBasicMaterial({ color: 0x3a2e1e });
  private sparkMat = new THREE.MeshBasicMaterial({ color: 0xffd080, transparent: true });
  private bloodMat = new THREE.MeshBasicMaterial({ color: 0x9a1010, transparent: true });

  constructor(private scene: THREE.Scene) {}

  tracer(a: THREE.Vector3, b: THREE.Vector3) {
    const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
    const line = new THREE.Line(geo, this.tracerMat.clone());
    this.scene.add(line);
    this.list.push({ obj: line, life: 0.07, max: 0.07, kind: 'tracer' });
  }

  impact(p: THREE.Vector3) {
    const m = new THREE.Mesh(this.impactGeo, this.impactMat);
    m.position.copy(p);
    this.scene.add(m);
    this.list.push({ obj: m, life: 8, max: 8, kind: 'impact' });
    const s = new THREE.Mesh(this.impactGeo, this.sparkMat.clone());
    s.position.copy(p);
    s.scale.setScalar(2.5);
    this.scene.add(s);
    this.list.push({ obj: s, life: 0.12, max: 0.12, kind: 'tracer' });
  }

  blood(p: THREE.Vector3) {
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(this.impactGeo, this.bloodMat.clone());
      m.position.copy(p).add(new THREE.Vector3((Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25));
      m.scale.setScalar(1 + Math.random() * 1.5);
      this.scene.add(m);
      this.list.push({ obj: m, life: 0.35, max: 0.35, kind: 'blood' });
    }
  }

  explosion(p: THREE.Vector3) {
    const g = new THREE.Group();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 1 }));
    g.add(ball);
    const light = new THREE.PointLight(0xffa040, 80, 60);
    g.add(light);
    g.position.copy(p).setY(1.5);
    this.scene.add(g);
    this.list.push({ obj: g, life: 1.6, max: 1.6, kind: 'explosion' });
  }

  update(dt: number) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const f = this.list[i];
      f.life -= dt;
      const k = Math.max(0, f.life / f.max);
      if (f.kind === 'tracer' || f.kind === 'blood') {
        const m = (f.obj as THREE.Mesh).material as THREE.Material;
        m.opacity = k;
        if (f.kind === 'blood') f.obj.position.y -= dt * 1.5;
      } else if (f.kind === 'explosion') {
        const t = 1 - k;
        const ball = (f.obj as THREE.Group).children[0] as THREE.Mesh;
        ball.scale.setScalar(2 + t * 14);
        (ball.material as THREE.MeshBasicMaterial).opacity = k;
        ((f.obj as THREE.Group).children[1] as THREE.PointLight).intensity = 80 * k;
      }
      if (f.life <= 0) {
        this.scene.remove(f.obj);
        if (f.kind === 'tracer' || f.kind === 'blood') {
          const mm = f.obj as THREE.Mesh;
          (mm.material as THREE.Material).dispose();
          if (f.obj instanceof THREE.Line) f.obj.geometry.dispose();
        }
        this.list.splice(i, 1);
      }
    }
    // cap impacts
    let impacts = 0;
    for (let i = this.list.length - 1; i >= 0; i--) {
      if (this.list[i].kind === 'impact' && ++impacts > 120) this.list[i].life = 0;
    }
  }

  clear() {
    for (const f of this.list) this.scene.remove(f.obj);
    this.list = [];
  }
}
