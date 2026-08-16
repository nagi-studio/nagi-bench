import * as THREE from "three";

/** Deterministic PRNG (mulberry32) so every frame is a pure function of time. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const matCache = new Map<string, THREE.MeshStandardMaterial>();

export function mat(color: number, rough = 0.85, metal = 0.0): THREE.MeshStandardMaterial {
  const key = `${color}:${rough}:${metal}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    matCache.set(key, m);
  }
  return m;
}

export interface BoxOpts {
  x?: number; y?: number; z?: number;
  rx?: number; ry?: number; rz?: number;
  material?: THREE.Material;
  shadow?: boolean;
  name?: string;
}

export function box(w: number, h: number, d: number, color: number, o: BoxOpts = {}): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.material ?? mat(color));
  m.position.set(o.x ?? 0, o.y ?? 0, o.z ?? 0);
  m.rotation.set(o.rx ?? 0, o.ry ?? 0, o.rz ?? 0);
  m.castShadow = o.shadow ?? true;
  m.receiveShadow = true;
  if (o.name) m.name = o.name;
  return m;
}

export function emissive(color: number, intensity = 1): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x111111,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    roughness: 0.6,
  });
}

/* ------------------------------------------------------------------ */
/* Pixel-face textures drawn on canvas (procedural, no external art).  */
/* ------------------------------------------------------------------ */

export type FaceKind = "stern" | "kind" | "plain" | "calm";

function faceCanvas(kind: FaceKind, skin: string, hair: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 16; c.height = 16;
  const g = c.getContext("2d")!;
  g.fillStyle = skin;
  g.fillRect(0, 0, 16, 16);
  // hairline
  g.fillStyle = hair;
  g.fillRect(0, 0, 16, 3);
  // eyes
  const eyeY = kind === "kind" ? 7 : 6;
  g.fillStyle = "#181410";
  g.fillRect(4, eyeY, 2, 2);
  g.fillRect(10, eyeY, 2, 2);
  // brows
  if (kind === "stern") {
    g.fillRect(3, 4, 4, 1);
    g.fillRect(9, 4, 4, 1);
  } else {
    g.fillRect(4, 4, 2, 1);
    g.fillRect(10, 4, 2, 1);
  }
  // nose shadow
  g.fillStyle = "rgba(0,0,0,0.18)";
  g.fillRect(7, 9, 2, 2);
  // mouth
  g.fillStyle = "#4a2c22";
  if (kind === "kind") { g.fillRect(5, 12, 6, 1); g.fillRect(4, 11, 1, 1); g.fillRect(11, 11, 1, 1); }
  else if (kind === "calm") { g.fillRect(6, 12, 4, 1); }
  else { g.fillRect(6, 12, 4, 1); }
  return c;
}

function tex(c: HTMLCanvasElement): THREE.Texture {
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function solidCanvas(color: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 4; c.height = 4;
  const g = c.getContext("2d")!;
  g.fillStyle = color;
  g.fillRect(0, 0, 4, 4);
  return c;
}

/* ------------------------------------------------------------------ */
/* Blocky articulated human. Origin at feet center, faces +Z.          */
/* ------------------------------------------------------------------ */

export interface HumanOptions {
  skin?: string;
  hair?: string;
  shirt?: number;
  sleeve?: number;
  pants?: number;
  shoes?: number;
  face?: FaceKind;
  suit?: boolean;      // bulky white space suit
  helmet?: boolean;    // suit helmet with animated visor
  scale?: number;
}

export interface Human {
  group: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  torso: THREE.Mesh;
  visor?: THREE.MeshStandardMaterial;
  faceMesh?: THREE.Mesh;
  setVisor: (clear: number) => void;
}

export function makeHuman(o: HumanOptions = {}): Human {
  const suit = o.suit ?? false;
  const helmet = o.helmet ?? false;
  const skin = o.skin ?? "#d9a077";
  const hair = o.hair ?? "#22201e";
  const shirt = suit ? 0xd8dde2 : (o.shirt ?? 0x37424e);
  const sleeve = suit ? 0xcfd5da : (o.sleeve ?? o.shirt ?? 0x37424e);
  const pants = suit ? 0xc6ccd2 : (o.pants ?? 0x2b2f33);
  const shoes = suit ? 0x9aa2a9 : (o.shoes ?? 0x1c1c1c);

  const group = new THREE.Group();
  const W = suit ? 1.16 : 1.0; // bulk factor

  // torso
  const torso = box(0.62 * W, 0.72, 0.36 * W, shirt, { y: 1.08 });
  group.add(torso);
  if (suit) {
    // chest control block + backpack
    torso.add(box(0.3, 0.18, 0.06, 0x39424a, { y: 0.12, z: 0.21 }));
    const pack = box(0.5 * W, 0.62, 0.22, 0xb7bec5, { y: 1.1, z: -0.3 });
    group.add(pack);
  }

  // head (pivot at neck y=1.44)
  const head = new THREE.Group();
  head.position.y = 1.44;
  group.add(head);

  let visorMat: THREE.MeshStandardMaterial | undefined;
  let faceMesh: THREE.Mesh | undefined;

  if (helmet) {
    const shell = box(0.56, 0.54, 0.56, 0xe4e8ec, { y: 0.3 });
    head.add(shell);
    faceMesh = box(0.34, 0.3, 0.05, 0, { y: 0.28, z: 0.26, shadow: false });
    faceMesh.material = new THREE.MeshStandardMaterial({
      map: tex(faceCanvas(o.face ?? "calm", skin, hair)), roughness: 0.9,
    });
    head.add(faceMesh);
    visorMat = new THREE.MeshStandardMaterial({
      color: 0x2a2013,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.96,
    });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.34, 0.06), visorMat);
    visor.position.set(0, 0.28, 0.31);
    head.add(visor);
  } else {
    const faceTex = tex(faceCanvas(o.face ?? "plain", skin, hair));
    const hairTexSide = tex(solidCanvas(hair));
    const skinTex = tex(solidCanvas(skin));
    const headMats = [
      new THREE.MeshStandardMaterial({ map: skinTex, roughness: 0.9 }), // +x
      new THREE.MeshStandardMaterial({ map: skinTex, roughness: 0.9 }), // -x
      new THREE.MeshStandardMaterial({ map: hairTexSide, roughness: 0.95 }), // top
      new THREE.MeshStandardMaterial({ map: skinTex, roughness: 0.9 }), // bottom
      new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.9 }), // +z face
      new THREE.MeshStandardMaterial({ map: hairTexSide, roughness: 0.95 }), // back
    ];
    faceMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.52, 0.48), headMats);
    faceMesh.position.y = 0.28;
    faceMesh.castShadow = true;
    head.add(faceMesh);
  }

  // arms: pivot at shoulder (y=1.38), hang down
  const mkArm = (side: 1 | -1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.42 * W, 1.38, 0);
    const upper = box(0.2 * W, 0.68, 0.24 * W, sleeve, { y: -0.32 });
    pivot.add(upper);
    const hand = box(0.19 * W, 0.14, 0.22 * W, suit ? 0xe0e4e8 : 0, { y: -0.72 });
    if (!suit) hand.material = new THREE.MeshStandardMaterial({ map: tex(solidCanvas(skin)), roughness: 0.9 });
    pivot.add(hand);
    group.add(pivot);
    return pivot;
  };
  const armL = mkArm(-1);
  const armR = mkArm(1);

  // legs: pivot at hip (y=0.74)
  const mkLeg = (side: 1 | -1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.16, 0.74, 0);
    pivot.add(box(0.24 * W, 0.66, 0.26 * W, pants, { y: -0.33 }));
    pivot.add(box(0.25 * W, 0.1, 0.3 * W, shoes, { y: -0.69, z: 0.02 }));
    group.add(pivot);
    return pivot;
  };
  const legL = mkLeg(-1);
  const legR = mkLeg(1);

  if (o.scale) group.scale.setScalar(o.scale);

  return {
    group, head, armL, armR, legL, legR, torso,
    visor: visorMat,
    faceMesh,
    setVisor: (clear: number) => {
      if (visorMat) visorMat.opacity = 0.96 - clear * 0.82;
    },
  };
}

/** Standard poses, all angles radians. */
export function pose(h: Human, p: {
  armL?: [number, number]; armR?: [number, number]; // [x-rot, z-rot]
  legL?: number; legR?: number;
  head?: [number, number]; // [x, y]
  torsoY?: number;
}): void {
  if (p.armL) h.armL.rotation.set(p.armL[0], 0, p.armL[1]);
  if (p.armR) h.armR.rotation.set(p.armR[0], 0, p.armR[1]);
  if (p.legL !== undefined) h.legL.rotation.x = p.legL;
  if (p.legR !== undefined) h.legR.rotation.x = p.legR;
  if (p.head) h.head.rotation.set(p.head[0], p.head[1], 0);
  if (p.torsoY !== undefined) h.torso.rotation.y = p.torsoY;
}

/** Sit on a chair: bend both legs 90°. */
export function sitPose(h: Human): void {
  h.legL.rotation.x = -Math.PI / 2;
  h.legR.rotation.x = -Math.PI / 2;
}

export function radialSprite(inner: string, outer: string, size = 128): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
