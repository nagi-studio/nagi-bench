// @ts-ignore - Vite subproject deps installed via package.json on bench build
import * as THREE from 'three';

export function box(
  parent: THREE.Object3D, w: number, h: number, d: number,
  color: number, x: number, y: number, z: number,
  emissive = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color, emissive }),
  );
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

export interface Figure {
  g: THREE.Group;
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  head: THREE.Mesh;
}

export function figure(coat: number, skin = 0xd8b08c, hat = 0): Figure {
  const g = new THREE.Group();
  const head = box(g, 0.42, 0.42, 0.42, skin, 0, 1.62, 0);
  if (hat) box(g, 0.5, 0.14, 0.5, hat, 0, 1.9, 0);
  box(g, 0.62, 0.72, 0.36, coat, 0, 1.05, 0);
  const armL = box(g, 0.17, 0.62, 0.17, coat, -0.42, 1.02, 0);
  const armR = box(g, 0.17, 0.62, 0.17, coat, 0.42, 1.02, 0);
  box(g, 0.21, 0.5, 0.21, 0x3a3a44, -0.15, 0.28, 0);
  box(g, 0.21, 0.5, 0.21, 0x3a3a44, 0.15, 0.28, 0);
  return { g, armL, armR, head };
}

export function house(parent: THREE.Object3D, x: number, z: number, wall: number, roof: number, lit: boolean): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  box(g, 4, 2.6, 3.4, wall, 0, 1.3, 0);
  const r = box(g, 4.6, 0.5, 4, roof, 0, 2.85, 0);
  r.rotation.z = 0;
  box(g, 4.62, 0.35, 2.2, roof, 0, 3.15, -0.7);
  box(g, 4.62, 0.35, 2.2, roof, 0, 3.15, 0.7);
  box(g, 1, 1.4, 0.1, 0x4a3423, 0.6, 0.7, 1.72);
  const win = box(g, 0.9, 0.7, 0.1, 0xffe9a8, -0.8, 1.5, 1.72, lit ? 0xaa7722 : 0);
  win.name = 'win';
  parent.add(g);
  return g;
}

export interface Lighthouse {
  g: THREE.Group;
  lamp: THREE.Mesh;
  beam: THREE.Group;
}

export function lighthouse(parent: THREE.Object3D, x: number, z: number): Lighthouse {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  for (let i = 0; i < 6; i++) {
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5 - i * 0.12, 1.62 - i * 0.12, 1.4, 10),
      new THREE.MeshLambertMaterial({ color: i % 2 === 0 ? 0xe8e4da : 0xb03a30 }),
    );
    seg.position.y = 0.7 + i * 1.4;
    g.add(seg);
  }
  box(g, 3.4, 0.5, 3.4, 0x3a3a44, 0, 8.9, 0);
  const lamp = box(g, 1.6, 1.4, 1.6, 0xfff2c0, 0, 9.9, 0, 0xcc9933);
  box(g, 2.4, 0.4, 2.4, 0x3a3a44, 0, 10.9, 0);
  const beam = new THREE.Group();
  beam.position.y = 9.9;
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff2c0, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false,
  });
  for (const s of [1, -1]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.2, 16, 12, 1, true), beamMat);
    cone.rotation.z = s * Math.PI / 2;
    cone.position.x = s * 8;
    beam.add(cone);
  }
  g.add(beam);
  parent.add(g);
  return { g, lamp, beam };
}

export function boat(parent: THREE.Object3D): THREE.Group {
  const g = new THREE.Group();
  box(g, 1.6, 0.5, 4.2, 0x6b4a2c, 0, 0.3, 0);
  box(g, 0.3, 0.7, 4.2, 0x7d5a36, -0.85, 0.6, 0);
  box(g, 0.3, 0.7, 4.2, 0x7d5a36, 0.85, 0.6, 0);
  box(g, 1.9, 0.7, 0.3, 0x7d5a36, 0, 0.6, -2.0);
  box(g, 1.9, 0.7, 0.3, 0x7d5a36, 0, 0.6, 2.0);
  const oar = box(g, 0.12, 0.12, 3.4, 0x8a6a42, 1.2, 0.8, 0.4);
  oar.name = 'oar';
  parent.add(g);
  return g;
}

export function meteorite(parent: THREE.Object3D, s: number): { g: THREE.Group; glow: THREE.PointLight; cracks: THREE.Mesh[] } {
  const g = new THREE.Group();
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(s, 0),
    new THREE.MeshLambertMaterial({ color: 0x2e2a28 }),
  );
  rock.scale.y = 0.75;
  g.add(rock);
  const cracks: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) {
    const c = new THREE.Mesh(
      new THREE.BoxGeometry(s * 0.5, s * 0.08, s * 0.12),
      new THREE.MeshBasicMaterial({ color: 0xff9a3c }),
    );
    const a = (i / 7) * Math.PI * 2;
    c.position.set(Math.cos(a) * s * 0.55, (i % 3 - 1) * s * 0.3, Math.sin(a) * s * 0.55);
    c.lookAt(0, 0, 0);
    g.add(c);
    cracks.push(c);
  }
  const glow = new THREE.PointLight(0xff9a3c, 8, 12);
  glow.position.y = 0.6;
  g.add(glow);
  parent.add(g);
  return { g, glow, cracks };
}
