import * as THREE from 'three';
import type { Actor } from './types';

export type ColliderKind = 'building' | 'wall' | 'crate' | 'door' | 'floor';

export interface AABB {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  kind: ColliderKind;
  walkable?: boolean;
}

export interface MapBox extends AABB {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  color: number;
}

export interface FloorSurface {
  kind: 'flat' | 'rampX' | 'rampZ';
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  height: number;
}

export interface MapZone {
  id: 'A' | 'B' | 'TSpawn' | 'CTSpawn' | 'long' | 'mid' | 'catwalk' | 'tunnels';
  name: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface MapLayout {
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  boxes: Array<{ x: number; z: number; w: number; d: number; kind: ColliderKind }>;
  zones: MapZone[];
}

export interface DoorColliderSource {
  getColliders(): AABB[];
}

export interface MapData {
  group: THREE.Group;
  colliders: AABB[];
  doors: DoorColliderSource[];
  floors: FloorSurface[];
  zones: MapZone[];
  layout: MapLayout;
  tSpawns: Array<{ position: THREE.Vector3; yaw: number }>;
  ctSpawns: Array<{ position: THREE.Vector3; yaw: number }>;
  plantSpots: Record<'A' | 'B', THREE.Vector3>;
  updateDoors(actors: Actor[], dt: number): void;
  dispose(): void;
}

const SAND = 0xb99a6a;
const SAND_LIGHT = 0xc9ad7c;
const SAND_DARK = 0x96794f;
const WOOD = 0x59402a;

function makeLabel(text: string, color = '#ead9b6', background = '#423728') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const context = canvas.getContext('2d')!;
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#ad9365';
  context.lineWidth = 10;
  context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  context.fillStyle = color;
  context.font = '700 82px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 256, 100);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

class MidDoors implements DoorColliderSource {
  private left = new THREE.Group();
  private right = new THREE.Group();
  private amount = 0;

  constructor(parent: THREE.Group, material: THREE.Material) {
    this.left.position.set(-2, 0, -4);
    this.right.position.set(2, 0, -4);
    parent.add(this.left, this.right);
    this.buildPanel(this.left, 1, material);
    this.buildPanel(this.right, -1, material);
  }

  private buildPanel(pivot: THREE.Group, direction: number, material: THREE.Material) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2, 3.35, 0.22), material);
    panel.position.set(direction, 1.675, 0);
    panel.castShadow = true;
    panel.receiveShadow = true;
    pivot.add(panel);
    const braceMaterial = new THREE.MeshStandardMaterial({ color: 0x34271c, roughness: 0.9 });
    for (const y of [0.35, 1.65, 2.95]) {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.12, 0.28), braceMaterial);
      brace.position.set(direction, y, 0);
      pivot.add(brace);
    }
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.28, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x292b29, metalness: 0.7, roughness: 0.35 }),
    );
    handle.position.set(direction * 1.72, 1.55, -0.16);
    pivot.add(handle);
  }

  update(actors: Actor[], dt: number) {
    const nearby = actors.some((actor) => {
      if (!actor.alive) return false;
      const dx = actor.position.x;
      const dz = actor.position.z + 4;
      return dx * dx + dz * dz < 22;
    });
    const target = nearby ? 1 : 0;
    this.amount = THREE.MathUtils.damp(this.amount, target, 7, dt);
    const angle = this.amount * Math.PI * 0.49;
    this.left.rotation.y = angle;
    this.right.rotation.y = -angle;
  }

  getColliders(): AABB[] {
    return [this.left, this.right].map((pivot, index) => {
      const direction = index === 0 ? 1 : -1;
      const angle = pivot.rotation.y;
      const localCenterX = direction;
      const centerX = pivot.position.x + Math.cos(angle) * localCenterX;
      const centerZ = pivot.position.z - Math.sin(angle) * localCenterX;
      const extentX = Math.abs(Math.cos(angle)) + Math.abs(Math.sin(angle)) * 0.12;
      const extentZ = Math.abs(Math.sin(angle)) + Math.abs(Math.cos(angle)) * 0.12;
      return {
        minX: centerX - extentX,
        maxX: centerX + extentX,
        minY: 0,
        maxY: 3.35,
        minZ: centerZ - extentZ,
        maxZ: centerZ + extentZ,
        kind: 'door' as const,
      };
    });
  }
}

export function createMap(): MapData {
  const group = new THREE.Group();
  group.name = 'Dust2 procedural map';
  const colliders: AABB[] = [];
  const layoutBoxes: MapLayout['boxes'] = [];
  const floors: FloorSurface[] = [];
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const materials = new Map<number, THREE.MeshStandardMaterial>();
  const disposables: Array<{ dispose(): void }> = [unitBox];

  const material = (color: number) => {
    let value = materials.get(color);
    if (!value) {
      value = new THREE.MeshStandardMaterial({ color, roughness: 0.93, metalness: 0.01 });
      materials.set(color, value);
      disposables.push(value);
    }
    return value;
  };

  const meshBox = (x: number, y: number, z: number, w: number, h: number, d: number, color: number) => {
    const mesh = new THREE.Mesh(unitBox, material(color));
    mesh.position.set(x, y + h / 2, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = h > 0.3;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const addBox = (
    x: number, y: number, z: number, w: number, h: number, d: number,
    kind: ColliderKind = 'building', color = SAND, walkable = false, showOnMap = true,
  ) => {
    meshBox(x, y, z, w, h, d, color);
    const box: MapBox = {
      x, y, z, w, h, d, color, kind, walkable,
      minX: x - w / 2, maxX: x + w / 2,
      minY: y, maxY: y + h,
      minZ: z - d / 2, maxZ: z + d / 2,
    };
    colliders.push(box);
    if (showOnMap) layoutBoxes.push({ x, z, w, d, kind });
    return box;
  };

  const building = (x: number, z: number, w: number, d: number, h: number, color = SAND) => {
    addBox(x, 0, z, w, h, d, 'building', color);
    meshBox(x, h - 0.18, z, w + 0.16, 0.22, d + 0.16, SAND_LIGHT);
    meshBox(x, 0.12, z, w + 0.08, 0.28, d + 0.08, SAND_DARK);
    const merlonCount = Math.min(8, Math.floor(w / 2.4));
    for (let i = 0; i < merlonCount; i++) {
      const mx = x - w / 2 + 0.6 + (i / Math.max(1, merlonCount - 1)) * (w - 1.2);
      meshBox(mx, h, z - d / 2 + 0.18, 0.65, 0.5, 0.4, color);
    }
  };

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(110, 120),
    new THREE.MeshStandardMaterial({ color: 0xa78d64, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.025;
  ground.receiveShadow = true;
  group.add(ground);
  disposables.push(ground.geometry, ground.material);

  // Outer perimeter. All gameplay lanes stay inside these walls.
  addBox(-43, 0, 0, 2, 6, 98, 'wall', SAND_DARK);
  addBox(43, 0, 0, 2, 6, 98, 'wall', SAND_DARK);
  addBox(0, 0, -48, 88, 6, 2, 'wall', SAND_DARK);
  addBox(0, 0, 48, 88, 6, 2, 'wall', SAND_DARK);

  // Central west blocks: B site / mid / lower and upper B tunnels.
  building(-13.5, -5, 17, 22, 5.6);
  building(-13.5, 21, 17, 18, 5.1, SAND_LIGHT);
  building(-10.5, -21.5, 11, 11, 5.8);
  building(-38, 8, 8, 48, 6.2, SAND_DARK);

  // Central east blocks: mid / catwalk / A long.
  building(15, 12, 20, 36, 5.4);
  building(8.5, -19.5, 7, 15, 5.8, SAND_LIGHT);
  building(22.5, -15, 5, 18, 5.2);
  building(14, -25.5, 4, 3, 4.4, SAND_DARK);
  building(38.5, 11, 7, 54, 6.1, SAND_DARK);

  // North CT / site backdrop and south T spawn backdrop.
  building(-27.5, -41.5, 29, 13, 6.4, SAND_DARK);
  building(27.5, -41.5, 29, 13, 6.4, SAND_DARK);
  building(-27.5, 43, 29, 10, 5.6, SAND_DARK);
  building(27.5, 43, 29, 10, 5.6, SAND_DARK);

  // Mid door wall and real double door bodies.
  addBox(-3.5, 0, -4, 3, 4.4, 1, 'wall', SAND_LIGHT);
  addBox(3.5, 0, -4, 3, 4.4, 1, 'wall', SAND_LIGHT);
  addBox(0, 3.35, -4, 4.1, 1.05, 1, 'wall', SAND_LIGHT);
  meshBox(0, 3.25, -4.55, 4.4, 0.16, 0.15, SAND_DARK);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: WOOD, roughness: 0.88 });
  disposables.push(doorMaterial);
  const midDoors = new MidDoors(group, doorMaterial);

  // Catwalk: a traversable rising ramp, elevated platform, and down-ramp to A.
  floors.push(
    { kind: 'rampX', minX: 5, maxX: 11, minZ: -12, maxZ: -6, height: 1.4 },
    { kind: 'flat', minX: 11, maxX: 20, minZ: -12, maxZ: -6, height: 1.4 },
    { kind: 'flat', minX: 12, maxX: 20, minZ: -18, maxZ: -12, height: 1.4 },
    { kind: 'rampZ', minX: 12, maxX: 20, minZ: -24, maxZ: -18, height: 1.4 },
  );
  addBox(15.5, 0, -9, 9, 1.4, 6, 'floor', 0xa7895f, true);
  addBox(16, 0, -15, 8, 1.4, 6, 'floor', 0xa7895f, true);
  const rampMaterial = material(0xa7895f);
  const longRamp = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(6, 1.4), 0.18, 6), rampMaterial);
  longRamp.position.set(8, 0.67, -9);
  longRamp.rotation.z = Math.atan2(1.4, 6);
  longRamp.castShadow = true;
  longRamp.receiveShadow = true;
  group.add(longRamp);
  disposables.push(longRamp.geometry);
  const downRamp = new THREE.Mesh(new THREE.BoxGeometry(8, 0.18, Math.hypot(6, 1.4)), rampMaterial);
  downRamp.position.set(16, 0.67, -21);
  downRamp.rotation.x = -Math.atan2(1.4, 6);
  downRamp.castShadow = true;
  downRamp.receiveShadow = true;
  group.add(downRamp);
  disposables.push(downRamp.geometry);
  // Catwalk guard rails leave both endpoints open.
  addBox(15.5, 1.4, -5.86, 9, 0.65, 0.16, 'wall', SAND_DARK);
  addBox(11.86, 1.4, -15, 0.16, 0.65, 6, 'wall', SAND_DARK);
  addBox(20.14, 1.4, -15, 0.16, 0.65, 6, 'wall', SAND_DARK);

  // Site and lane cover. Crates have collision and can be jumped onto.
  const crate = (x: number, z: number, size: number, height: number) => {
    addBox(x, 0, z, size, height, size, 'crate', 0x715438, true);
    meshBox(x, height * 0.46, z, size + 0.035, 0.1, size + 0.035, 0x3f3225);
    meshBox(x, 0.04, z, size + 0.04, 0.11, size + 0.04, 0x3f3225);
  };
  crate(31, -21.5, 2.4, 1.25);
  crate(34.2, -23, 1.8, 1.0);
  crate(22, -31, 2.1, 1.1);
  crate(29.2, -30.8, 1.5, 0.85);
  crate(-31, -21.5, 2.4, 1.25);
  crate(-34, -29, 1.8, 1.0);
  crate(-23, -30, 2.1, 1.1);
  crate(30.5, 8, 2.0, 1.1);
  crate(27, 17, 1.5, 0.85);
  crate(2.1, 14, 1.65, 0.95);
  crate(-29, 17, 1.7, 1.0);
  crate(-8, 35, 1.8, 1.0);
  crate(8, -37, 1.6, 0.9);

  // Lane markings and site letters are generated at runtime, not asset files.
  const addGroundLabel = (text: string, x: number, z: number, size: number) => {
    const texture = makeLabel(text, 'rgba(234,217,182,.72)', 'rgba(70,58,39,0)');
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(size, size * 0.75), labelMaterial);
    label.rotation.x = -Math.PI / 2;
    label.position.set(x, 0.018, z);
    group.add(label);
    disposables.push(texture, labelMaterial, label.geometry);
  };
  addGroundLabel('A', 26, -26, 7);
  addGroundLabel('B', -27, -26, 7);

  const addSign = (text: string, x: number, y: number, z: number, rotationY: number) => {
    const texture = makeLabel(text);
    const signMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.98), signMaterial);
    sign.position.set(x, y, z);
    sign.rotation.y = rotationY;
    group.add(sign);
    disposables.push(texture, signMaterial, sign.geometry);
  };
  addSign('A  →', 25.2, 2.6, 29.94, 0);
  addSign('←  B', -24.8, 2.6, 29.94, 0);
  addSign('MID', 0, 4.0, -3.43, 0);
  addSign('CATWALK', 10, 2.8, -5.93, Math.PI);
  addSign('A SITE', 17, 2.7, -34.94, 0);
  addSign('B SITE', -17, 2.7, -34.94, 0);

  // Small architectural details make the otherwise procedural lanes readable.
  const dark = 0x403c32;
  for (const [x, z, rotation] of [
    [24.94, 5, Math.PI / 2], [24.94, 22, Math.PI / 2],
    [-4.94, 18, -Math.PI / 2], [-4.94, -18, -Math.PI / 2],
  ] as Array<[number, number, number]>) {
    const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.5), material(dark));
    windowMesh.position.set(x, 2.8, z);
    windowMesh.rotation.y = rotation;
    group.add(windowMesh);
  }
  // Awnings in T and the tunnel mouths.
  meshBox(0, 3.4, 32.4, 8, 0.18, 2.2, 0x7a5137);
  meshBox(-28, 3.2, 29.5, 9, 0.2, 2.0, 0x70513a);
  meshBox(-28, 3.1, -15.7, 11, 0.24, 1.6, SAND_DARK);
  meshBox(30, 3.4, -15.7, 10, 0.24, 1.5, SAND_DARK);
  // A real roof encloses the B tunnels; it is intentionally omitted from the
  // top-down navigation overlay, but remains a physical and bullet collision box.
  addBox(-28, 3.45, 7, 12, 0.4, 44, 'wall', SAND_DARK, false, false);

  const zones: MapZone[] = [
    { id: 'A', name: 'A 点', minX: 15, maxX: 40, minZ: -35, maxZ: -16 },
    { id: 'B', name: 'B 点', minX: -40, maxX: -15, minZ: -35, maxZ: -16 },
    { id: 'TSpawn', name: 'T 出生点', minX: -13, maxX: 13, minZ: 32, maxZ: 46 },
    { id: 'CTSpawn', name: 'CT 出生点', minX: -13, maxX: 13, minZ: -46, maxZ: -32 },
    { id: 'long', name: 'A 大', minX: 24, maxX: 36, minZ: -16, maxZ: 32 },
    { id: 'tunnels', name: 'B 洞', minX: -35, maxX: -21, minZ: -16, maxZ: 32 },
    { id: 'catwalk', name: '猫道', minX: 5, maxX: 20, minZ: -24, maxZ: -5 },
    { id: 'mid', name: '中路', minX: -5, maxX: 5, minZ: -32, maxZ: 30 },
  ];

  const tSpawns = [
    [-6, 39], [-2, 41], [2, 41], [6, 39], [0, 36],
  ].map(([x, z]) => ({ position: new THREE.Vector3(x, 0, z), yaw: 0 }));
  const ctSpawns = [
    [-6, -39], [-2, -41], [2, -41], [6, -39], [0, -36],
  ].map(([x, z]) => ({ position: new THREE.Vector3(x, 0, z), yaw: Math.PI }));

  return {
    group,
    colliders,
    doors: [midDoors],
    floors,
    zones,
    layout: {
      bounds: { minX: -44, maxX: 44, minZ: -49, maxZ: 49 },
      boxes: layoutBoxes,
      zones,
    },
    tSpawns,
    ctSpawns,
    plantSpots: { A: new THREE.Vector3(25, 0, -26), B: new THREE.Vector3(-27, 0, -25) },
    updateDoors(actors, dt) { midDoors.update(actors, dt); },
    dispose() {
      for (const disposable of disposables) disposable.dispose();
    },
  };
}

export function zoneAt(map: MapData, position: THREE.Vector3): MapZone | null {
  for (const zone of map.zones) {
    if (position.x >= zone.minX && position.x <= zone.maxX && position.z >= zone.minZ && position.z <= zone.maxZ) {
      return zone;
    }
  }
  return null;
}

export function allColliders(map: MapData): AABB[] {
  return [...map.colliders, ...map.doors.flatMap((door) => door.getColliders())];
}
