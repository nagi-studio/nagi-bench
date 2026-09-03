import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type Team = 'T' | 'CT';
type SiteName = 'A' | 'B';
type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
type HitZone = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';
type AIState = 'patrol' | 'engage' | 'plant' | 'defuse' | 'recover';

interface WeaponDef {
  id: WeaponId;
  label: string;
  short: string;
  slot: number;
  damage: number;
  fireInterval: number;
  magSize: number;
  reserveMax: number;
  reloadTime: number;
  spread: number;
  recoil: number;
  range: number;
  automatic: boolean;
  color: number;
}

const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: { id: 'ak47', label: 'AK-47', short: 'AK', slot: 1, damage: 36, fireInterval: 0.105, magSize: 30, reserveMax: 90, reloadTime: 2.25, spread: 0.014, recoil: 0.052, range: 64, automatic: true, color: 0xb46b32 },
  m4a4: { id: 'm4a4', label: 'M4A4', short: 'M4', slot: 1, damage: 31, fireInterval: 0.092, magSize: 30, reserveMax: 90, reloadTime: 2.15, spread: 0.010, recoil: 0.031, range: 64, automatic: true, color: 0x485868 },
  awp: { id: 'awp', label: 'AWP', short: 'AWP', slot: 1, damage: 150, fireInterval: 1.55, magSize: 5, reserveMax: 25, reloadTime: 3.1, spread: 0.004, recoil: 0.09, range: 110, automatic: false, color: 0x6689a4 },
  glock: { id: 'glock', label: 'GLOCK-18', short: 'G18', slot: 2, damage: 18, fireInterval: 0.17, magSize: 20, reserveMax: 100, reloadTime: 1.8, spread: 0.024, recoil: 0.018, range: 42, automatic: true, color: 0x444b51 },
  usp: { id: 'usp', label: 'USP-S', short: 'USP', slot: 2, damage: 22, fireInterval: 0.19, magSize: 12, reserveMax: 72, reloadTime: 1.75, spread: 0.016, recoil: 0.016, range: 44, automatic: false, color: 0x252b30 },
  deagle: { id: 'deagle', label: 'DESERT EAGLE', short: 'DE', slot: 2, damage: 53, fireInterval: 0.42, magSize: 7, reserveMax: 35, reloadTime: 2.0, spread: 0.022, recoil: 0.06, range: 52, automatic: false, color: 0x9b7547 },
  knife: { id: 'knife', label: 'TACTICAL KNIFE', short: 'KNIFE', slot: 3, damage: 55, fireInterval: 0.55, magSize: 0, reserveMax: 0, reloadTime: 0, spread: 0, recoil: 0, range: 2.4, automatic: false, color: 0xb9c6ca },
};

const WORLD = { minX: -34, maxX: 34, minZ: -28, maxZ: 28 };
const EYE_HEIGHT = 1.62;
const PLAYER_RADIUS = 0.38;
const SITE_INFO: Record<SiteName, { label: string; pos: THREE.Vector3; radius: number; color: number }> = {
  A: { label: 'A SITE', pos: new THREE.Vector3(23, 0, 6), radius: 4.8, color: 0xe2a843 },
  B: { label: 'B SITE', pos: new THREE.Vector3(14, 0, -18), radius: 4.5, color: 0x4cc9a4 },
};

interface Collider {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  mesh: THREE.Mesh;
}

interface VisualRig {
  root: THREE.Group;
  armL: THREE.Object3D;
  armR: THREE.Object3D;
  legL: THREE.Object3D;
  legR: THREE.Object3D;
  weapon: THREE.Group;
}

interface Actor {
  id: string;
  name: string;
  team: Team;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  yaw: number;
  pitch: number;
  health: number;
  armor: number;
  alive: boolean;
  weapons: WeaponId[];
  weaponIndex: number;
  ammo: Partial<Record<WeaponId, number>>;
  reserve: Partial<Record<WeaponId, number>>;
  nextShot: number;
  reloadUntil: number;
  action: number;
  hasBomb: boolean;
  siteGoal: SiteName;
  ai: { state: AIState; targetId: string | null; path: string[]; pathGoal: string; patrolIndex: number; strafe: number; stuck: number };
  rig: VisualRig;
  flashUntil: number;
}

interface BombState {
  state: 'carried' | 'dropped' | 'planted';
  pos: THREE.Vector3;
  carrierId: string | null;
  site: SiteName | null;
  timer: number;
  plantProgress: number;
  defuseProgress: number;
  defuserId: string | null;
  pulse: number;
  mesh: THREE.Group;
}

interface KillEvent {
  id: number;
  killer: string;
  victim: string;
  team: Team;
  weapon: WeaponId;
  at: number;
}

interface SnapshotActor {
  id: string;
  name: string;
  team: Team;
  x: number;
  z: number;
  alive: boolean;
  visible: boolean;
  isPlayer: boolean;
  hasBomb: boolean;
}

interface HudSnapshot {
  locked: boolean;
  round: number;
  pistolRound: boolean;
  timeLeft: number;
  bombTime: number | null;
  bombState: BombState['state'];
  bombSite: SiteName | null;
  bombCarrier: string | null;
  bombX: number;
  bombZ: number;
  health: number;
  armor: number;
  weapon: WeaponId;
  ammo: number;
  reserve: number;
  reloading: boolean;
  scoped: boolean;
  spread: number;
  scoreT: number;
  scoreCT: number;
  playerAlive: boolean;
  spectatorName: string | null;
  roundWinner: Team | null;
  status: string;
  hitMarker: boolean;
  actors: SnapshotActor[];
  killfeed: KillEvent[];
}

interface NodePoint {
  id: string;
  pos: THREE.Vector3;
  links: string[];
}

interface InputState {
  keys: Set<string>;
  fire: boolean;
  aim: boolean;
  interact: boolean;
  jumpQueued: boolean;
}

interface Effect {
  object: THREE.Object3D;
  expires: number;
}

const INITIAL_HUD: HudSnapshot = {
  locked: false,
  round: 1,
  pistolRound: true,
  timeLeft: 110,
  bombTime: null,
  bombState: 'carried',
  bombSite: null,
  bombCarrier: 'T-FOX',
  bombX: -25,
  bombZ: 20,
  health: 100,
  armor: 0,
  weapon: 'glock',
  ammo: 20,
  reserve: 100,
  reloading: false,
  scoped: false,
  spread: 9,
  scoreT: 0,
  scoreCT: 0,
  playerAlive: true,
  spectatorName: null,
  roundWinner: null,
  status: '点击进入战场 · 音频将在首次操作时启用',
  hitMarker: false,
  actors: [],
  killfeed: [],
};

const MAP_ZONES = [
  { name: 'T SPAWN', x: -28, z: 18, w: 10, h: 8, tone: 'gold' },
  { name: 'A LONG', x: -2, z: 15, w: 40, h: 7, tone: 'sand' },
  { name: 'A SITE', x: 23, z: 6, w: 10, h: 10, tone: 'a' },
  { name: 'MID DOORS', x: 1, z: 3, w: 9, h: 6, tone: 'mid' },
  { name: 'CATWALK', x: 14, z: 5, w: 19, h: 4, tone: 'mid' },
  { name: 'B TUNNELS', x: -10, z: -10, w: 27, h: 5, tone: 'sand' },
  { name: 'B SITE', x: 14, z: -18, w: 11, h: 9, tone: 'b' },
  { name: 'CT SPAWN', x: 28, z: -22, w: 9, h: 8, tone: 'blue' },
];

const fmtTime = (seconds: number) => {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const distance2D = (a: THREE.Vector3, b: THREE.Vector3) => Math.hypot(a.x - b.x, a.z - b.z);
const vec2 = (x: number, z: number) => new THREE.Vector3(x, 0, z);

function createMaterial(color: number, roughness = 0.85, metalness = 0.02) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function addPart(group: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number], scale?: [number, number, number]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function weaponModel(id: WeaponId, firstPerson = false) {
  const group = new THREE.Group();
  const metal = createMaterial(WEAPONS[id].color, 0.36, id === 'knife' ? 0.8 : 0.45);
  const dark = createMaterial(0x171c20, 0.55, 0.3);
  const wood = createMaterial(id === 'ak47' ? 0x754728 : 0x252e35, 0.72, 0.05);
  const box = (size: [number, number, number], mat: THREE.Material, pos: [number, number, number]) => addPart(group, new THREE.BoxGeometry(...size), mat, pos);

  if (id === 'knife') {
    box([0.08, 0.12, 0.45], dark, [0, 0, -0.12]);
    box([0.06, 0.06, 0.72], metal, [0, 0.02, -0.65]);
    group.rotation.x = -0.16;
  } else if (id === 'glock' || id === 'usp' || id === 'deagle') {
    const width = id === 'deagle' ? 0.24 : 0.18;
    box([width, 0.18, 0.5], metal, [0, 0, -0.16]);
    box([width * 0.62, 0.34, 0.18], dark, [0, -0.22, 0.02]);
    box([width * 0.52, 0.12, id === 'deagle' ? 0.65 : 0.42], dark, [0, 0.05, -0.58]);
    if (id === 'usp') box([0.23, 0.16, 0.28], dark, [0, 0.03, -0.77]);
    box([0.04, 0.06, 0.17], metal, [0, 0.12, -0.22]);
  } else if (id === 'awp') {
    box([0.26, 0.22, 0.78], metal, [0, 0, -0.28]);
    box([0.15, 0.18, 1.4], metal, [0, 0.04, -1.18]);
    box([0.2, 0.4, 0.3], dark, [0, -0.22, -0.3]);
    box([0.32, 0.15, 0.68], wood, [0, -0.03, 0.42]);
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.62, 12), createMaterial(0x22292d, 0.35, 0.6));
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0, 0.18, -0.5);
    scope.castShadow = true;
    group.add(scope);
  } else {
    box([0.3, 0.26, 0.72], metal, [0, 0, -0.25]);
    box([0.12, 0.15, 1.2], dark, [0, 0.03, -1.18]);
    box([0.2, 0.48, 0.3], dark, [0, -0.25, -0.2]);
    box([0.28, 0.2, 0.7], wood, [0, -0.02, 0.42]);
    box([0.16, 0.35, 0.2], dark, [0, -0.29, -0.62]);
    box([0.18, 0.12, 0.18], dark, [0, 0.22, -0.35]);
  }
  if (firstPerson) {
    group.scale.setScalar(id === 'awp' ? 0.86 : id === 'knife' ? 1.2 : 1.08);
  }
  return group;
}

function createHumanoid(team: Team, weaponId: WeaponId): VisualRig {
  const root = new THREE.Group();
  const main = createMaterial(team === 'T' ? 0xb9783e : 0x456d93, 0.82, 0.02);
  const dark = createMaterial(team === 'T' ? 0x342a28 : 0x202d3b, 0.8, 0.06);
  const skin = createMaterial(0xd09a70, 0.95, 0);
  const helmet = createMaterial(team === 'T' ? 0x403b33 : 0x1d354c, 0.67, 0.12);
  const torso = addPart(root, new THREE.BoxGeometry(0.65, 0.76, 0.38), main, [0, 1.08, 0]);
  torso.name = 'torso';
  addPart(root, new THREE.BoxGeometry(0.48, 0.12, 0.44), helmet, [0, 1.47, 0]);
  addPart(root, new THREE.SphereGeometry(0.28, 14, 10), skin, [0, 1.72, 0]);
  addPart(root, new THREE.BoxGeometry(0.58, 0.12, 0.3), helmet, [0, 1.87, -0.01]);
  const armL = addPart(root, new THREE.BoxGeometry(0.18, 0.66, 0.2), main, [-0.47, 1.08, -0.15]);
  const armR = addPart(root, new THREE.BoxGeometry(0.18, 0.66, 0.2), main, [0.47, 1.08, -0.15]);
  armL.rotation.x = -0.32;
  armL.rotation.z = -0.06;
  armR.rotation.x = -0.48;
  armR.rotation.z = 0.06;
  const legL = addPart(root, new THREE.BoxGeometry(0.23, 0.72, 0.27), dark, [-0.2, 0.4, 0]);
  const legR = addPart(root, new THREE.BoxGeometry(0.23, 0.72, 0.27), dark, [0.2, 0.4, 0]);
  addPart(root, new THREE.BoxGeometry(0.28, 0.12, 0.42), dark, [-0.2, 0.08, -0.08]);
  addPart(root, new THREE.BoxGeometry(0.28, 0.12, 0.42), dark, [0.2, 0.08, -0.08]);
  const weapon = weaponModel(weaponId);
  weapon.position.set(0, 1.08, -0.58);
  weapon.rotation.x = -0.04;
  root.add(weapon);
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return { root, armL, armR, legL, legR, weapon };
}

function makeLabel(text: string, color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(8,12,16,.72)';
  ctx.roundRect(8, 16, 496, 96, 20);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.font = '700 42px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(4.6, 1.15, 1);
  return sprite;
}

function rayAabb(origin: THREE.Vector3, direction: THREE.Vector3, min: THREE.Vector3, max: THREE.Vector3): number | null {
  let tMin = -Infinity;
  let tMax = Infinity;
  const axes: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z'];
  for (const axis of axes) {
    const o = origin[axis];
    const d = direction[axis];
    if (Math.abs(d) < 1e-7) {
      if (o < min[axis] || o > max[axis]) return null;
      continue;
    }
    let t1 = (min[axis] - o) / d;
    let t2 = (max[axis] - o) / d;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return null;
  }
  if (tMax < 0) return null;
  return tMin >= 0 ? tMin : tMax;
}

class SynthAudio {
  private context: AudioContext | null = null;

  unlock() { this.getContext(); }

  private getContext() {
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  private tone(frequency: number, duration: number, type: OscillatorType = 'sine', gain = 0.06, endFrequency?: number) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const amp = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(amp).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  shot(id: WeaponId) {
    if (id === 'ak47') { this.tone(92, 0.12, 'sawtooth', 0.13, 42); this.tone(680, 0.035, 'square', 0.04, 180); }
    else if (id === 'm4a4') { this.tone(145, 0.09, 'square', 0.095, 68); this.tone(940, 0.025, 'triangle', 0.035, 250); }
    else if (id === 'awp') { this.tone(60, 0.42, 'sawtooth', 0.19, 24); this.tone(230, 0.18, 'square', 0.07, 55); }
    else if (id === 'deagle') this.tone(105, 0.16, 'square', 0.15, 34);
    else if (id === 'knife') this.tone(680, 0.045, 'triangle', 0.035, 260);
    else this.tone(id === 'usp' ? 190 : 165, 0.085, 'square', 0.08, 75);
  }

  reload() { this.tone(220, 0.08, 'square', 0.04, 150); window.setTimeout(() => this.tone(420, 0.11, 'triangle', 0.04, 260), 130); }
  step() { this.tone(95, 0.035, 'sine', 0.018, 60); }
  scope() { this.tone(520, 0.12, 'sine', 0.045, 870); }
  hit() { this.tone(880, 0.06, 'square', 0.045, 1240); }
  kill() { this.tone(760, 0.09, 'triangle', 0.07, 1180); this.tone(1180, 0.08, 'sine', 0.04, 1560); }
  plant() { this.tone(260, 0.15, 'square', 0.07, 420); }
  defuse() { this.tone(580, 0.12, 'sine', 0.045, 400); }
  explode() { this.tone(48, 0.85, 'sawtooth', 0.25, 20); this.tone(120, 0.55, 'square', 0.14, 26); }
  win() { this.tone(440, 0.12, 'sine', 0.06, 620); window.setTimeout(() => this.tone(660, 0.2, 'sine', 0.06, 880), 120); }
  lose() { this.tone(230, 0.2, 'sawtooth', 0.05, 115); }
}

class GameRuntime {
  readonly container: HTMLDivElement;
  readonly onHud: (hud: HudSnapshot) => void;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(75, 1, 0.05, 160);
  readonly renderer: THREE.WebGLRenderer;
  readonly audio = new SynthAudio();
  readonly world = new THREE.Group();
  readonly actorsGroup = new THREE.Group();
  readonly effectsGroup = new THREE.Group();
  readonly input: InputState = { keys: new Set(), fire: false, aim: false, interact: false, jumpQueued: false };
  readonly colliders: Collider[] = [];
  readonly nodes = new Map<string, NodePoint>();
  readonly effects: Effect[] = [];
  actors: Actor[] = [];
  playerId = 't-player';
  spectatorIndex = 0;
  bomb!: BombState;
  fpWeapon: THREE.Group | null = null;
  fpArms: THREE.Group | null = null;
  raf = 0;
  lastTime = 0;
  stepAt = 0;
  hudAt = 0;
  hitMarkerUntil = 0;
  killId = 0;
  killfeed: KillEvent[] = [];
  roundState: 'active' | 'ended' = 'active';
  roundWinner: Team | null = null;
  roundReason = '';
  roundEndAt = 0;
  roundStartedAt = 0;
  roundNumber = 1;
  scoreT = 0;
  scoreCT = 0;
  pistolRound = true;
  disposed = false;
  lastStatus = '点击进入战场 · 音频将在首次操作时启用';
  resizeObserver: ResizeObserver | null = null;
  private handlers: Array<[EventTarget, string, EventListener]> = [];

  constructor(container: HTMLDivElement, onHud: (hud: HudSnapshot) => void) {
    this.container = container;
    this.onHud = onHud;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = 'game-canvas';
    this.container.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0x92a4a2);
    this.scene.fog = new THREE.Fog(0x92a4a2, 48, 105);
    this.scene.add(this.world, this.actorsGroup, this.effectsGroup, this.camera);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(-27, EYE_HEIGHT, 18);
  }

  start() {
    this.buildLighting();
    this.buildMap();
    this.buildNavigation();
    this.resetRound(true);
    this.bindEvents();
    this.resize();
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    for (const [target, type, handler] of this.handlers) target.removeEventListener(type, handler);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  restartMatch = () => {
    this.scoreT = 0;
    this.scoreCT = 0;
    this.roundNumber = 1;
    this.pistolRound = true;
    this.killfeed = [];
    this.resetRound(true);
  };

  private buildLighting() {
    this.scene.add(new THREE.HemisphereLight(0xffe9c5, 0x31404c, 2.1));
    const sun = new THREE.DirectionalLight(0xfff0c5, 3.2);
    sun.position.set(-22, 42, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -48;
    sun.shadow.camera.right = 48;
    sun.shadow.camera.top = 48;
    sun.shadow.camera.bottom = -48;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 110;
    this.scene.add(sun);
    const fill = new THREE.PointLight(0x8ab5c9, 1.0, 44, 2);
    fill.position.set(2, 8, -5);
    this.scene.add(fill);
  }

  private addBox(center: [number, number, number], size: [number, number, number], color: number, collide = true, roughness = 0.88) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), createMaterial(color, roughness));
    mesh.position.set(...center);
    mesh.castShadow = size[1] > 0.3;
    mesh.receiveShadow = true;
    this.world.add(mesh);
    if (collide) {
      this.colliders.push({
        minX: center[0] - size[0] / 2,
        maxX: center[0] + size[0] / 2,
        minY: center[1] - size[1] / 2,
        maxY: center[1] + size[1] / 2,
        minZ: center[2] - size[2] / 2,
        maxZ: center[2] + size[2] / 2,
        mesh,
      });
    }
    return mesh;
  }

  private addFloorTile(x: number, z: number, w: number, h: number, color: number) {
    this.addBox([x, -0.055, z], [w, 0.1, h], color, false, 1);
  }

  private buildMap() {
    this.addFloorTile(0, 0, 68, 56, 0xb69b77);
    this.addFloorTile(-28, 18, 11, 9, 0xc7ac7b);
    this.addFloorTile(-1, 15, 43, 7, 0xc2a477);
    this.addFloorTile(20, 10, 9, 16, 0xb99a6c);
    this.addFloorTile(23, 6, 14, 11, 0xc5a36d);
    this.addFloorTile(-4, 3, 46, 7, 0xa98d6b);
    this.addFloorTile(14, 5, 22, 4, 0x9d8467);
    this.addFloorTile(-11, -9, 31, 5, 0x9f8767);
    this.addFloorTile(0, -13, 25, 6, 0x9a8064);
    this.addFloorTile(14, -18, 13, 11, 0xbfa06b);
    this.addFloorTile(28, -21, 10, 10, 0x70828b);

    const wall = 0x756657;
    const wallLight = 0x927961;
    // Outer shell. The side openings and the long/mid/tunnel gaps form the connected routes.
    this.addBox([0, 2.4, 27.75], [68, 4.8, 0.5], wall);
    this.addBox([0, 2.4, -27.75], [68, 4.8, 0.5], wall);
    this.addBox([-33.75, 2.4, 0], [0.5, 4.8, 56], wall);
    this.addBox([33.75, 2.4, 0], [0.5, 4.8, 56], wall);

    // A long: staggered plaster walls with a broad opening at T spawn and its turn into A.
    this.addBox([-5, 2.25, 20.3], [26, 4.5, 0.55], wallLight);
    this.addBox([10.8, 2.25, 20.3], [8, 4.5, 0.55], wallLight);
    this.addBox([-4, 2.25, 10.15], [27, 4.5, 0.55], wall);
    this.addBox([10.7, 2.25, 10.15], [5, 4.5, 0.55], wall);
    this.addBox([16.4, 2.25, 15.4], [0.6, 4.5, 10.2], wall);
    this.addBox([17.5, 2.25, 1.2], [0.6, 4.5, 5.4], wall);

    // Middle lane and the iconic wooden mid doors. The gap between the panels is walkable.
    this.addBox([-10.5, 2.2, 7.5], [15, 4.4, 0.5], wallLight);
    this.addBox([-16.2, 2.2, 0.0], [6.5, 4.4, 0.5], wall);
    this.addBox([7.0, 2.2, -0.2], [0.5, 4.4, 5.4], wall);
    this.addBox([7.0, 2.2, 7.5], [0.5, 4.4, 5], wall);
    this.addBox([3.6, 1.55, 1.05], [0.55, 3.1, 2.25], 0x543c2f, true, 0.75);
    this.addBox([3.6, 1.55, 4.95], [0.55, 3.1, 2.25], 0x543c2f, true, 0.75);
    this.addBox([3.6, 4.0, 3.0], [0.7, 0.5, 5.4], 0x685343, false);
    const doorStripe = createMaterial(0xa57948, 0.67, 0.05);
    for (const z of [1.05, 4.95]) {
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.75, 1.95), doorStripe);
      door.position.set(3.3, 1.55, z);
      door.castShadow = true;
      this.world.add(door);
    }

    // Catwalk / short: raised-looking trim, open lane from mid to A.
    this.addBox([11, 1.9, 7.7], [10, 3.8, 0.45], wallLight);
    this.addBox([15.4, 1.9, 2.2], [0.5, 3.8, 6.5], wallLight);
    this.addBox([23, 2.1, 12.2], [13, 4.2, 0.55], wall);
    this.addBox([29.2, 2.1, 8.0], [0.55, 4.2, 8], wall);

    // B tunnels: L-shaped tunnel with openings at T side and the B doors.
    this.addBox([-23.2, 2.2, -2.0], [0.55, 4.4, 18], wall);
    this.addBox([-12.6, 2.2, -11.2], [21.5, 4.4, 0.55], wall);
    this.addBox([-7.0, 2.2, -6.0], [16.5, 4.4, 0.55], wall);
    this.addBox([-2.0, 2.2, -8.6], [0.55, 4.4, 5.2], wall);
    this.addBox([5.1, 2.2, -11.2], [0.55, 4.4, 5.3], wall);
    this.addBox([8.6, 2.2, -14.7], [7, 4.4, 0.55], wallLight);
    this.addBox([8.0, 2.2, -21.2], [0.55, 4.4, 8], wall);
    this.addBox([20.2, 2.2, -14.2], [8, 4.4, 0.55], wall);
    this.addBox([20.2, 2.2, -22.2], [8, 4.4, 0.55], wall);

    // CT connector and spawn cover.
    this.addBox([25.8, 2.2, -7.3], [0.55, 4.4, 11], wall);
    this.addBox([29.0, 2.2, -12.8], [8, 4.4, 0.55], wallLight);
    this.addBox([29.0, 2.2, -27.0], [8, 4.4, 0.55], wallLight);

    // Procedural cover: crates, barrels and a few recognizable site stacks.
    const crate = (x: number, z: number, w: number, d: number, h = 1.15, color = 0x8d623c) => {
      this.addBox([x, h / 2, z], [w, h, d], color, true, 0.9);
      this.addBox([x, h + 0.025, z], [w * 0.92, 0.06, d * 0.92], 0x6f4b32, false);
    };
    crate(18.8, 4.0, 1.7, 1.7, 1.35);
    crate(21.2, 8.7, 1.5, 1.5, 1.1);
    crate(26.5, 3.6, 1.6, 1.6, 1.1);
    crate(27.0, 8.8, 1.8, 1.5, 1.5);
    crate(11.7, -17.0, 1.8, 1.8, 1.3);
    crate(16.2, -20.1, 1.6, 1.5, 1.1);
    crate(19.2, -17.5, 1.5, 1.5, 1.45);
    crate(-21.0, -1.2, 1.4, 1.4, 1.25);
    crate(0.0, 8.2, 1.7, 1.4, 1.25);

    for (const site of Object.values(SITE_INFO)) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(site.radius - 0.14, site.radius, 48), new THREE.MeshBasicMaterial({ color: site.color, transparent: true, opacity: 0.62, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(site.pos).setY(0.015);
      this.world.add(ring);
      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.7, 8), new THREE.MeshBasicMaterial({ color: site.color, transparent: true, opacity: 0.65 }));
      beacon.position.copy(site.pos).setY(1.35);
      this.world.add(beacon);
      const label = makeLabel(site.label, `#${site.color.toString(16).padStart(6, '0')}`);
      label.position.copy(site.pos).setY(3.7);
      this.world.add(label);
    }
    const callouts: Array<[string, number, number, string]> = [
      ['T SPAWN', -29, 21.8, '#e2a843'],
      ['A LONG', -7, 14.2, '#e2a843'],
      ['MID DOORS', 3.5, 5.9, '#a9c8cf'],
      ['B TUNNELS', -12, -8.9, '#4cc9a4'],
      ['CT SPAWN', 28, -23.5, '#83b8d8'],
    ];
    for (const [text, x, z, color] of callouts) {
      const label = makeLabel(text, color);
      label.position.set(x, 3.0, z);
      label.scale.set(3.3, 0.82, 1);
      this.world.add(label);
    }
  }

  private addNode(id: string, x: number, z: number) {
    this.nodes.set(id, { id, pos: vec2(x, z), links: [] });
  }

  private link(a: string, b: string) {
    this.nodes.get(a)?.links.push(b);
    this.nodes.get(b)?.links.push(a);
  }

  private buildNavigation() {
    const points: Array<[string, number, number]> = [
      ['tspawn', -28, 18], ['longEntry', -22, 15], ['long1', -13, 15], ['long2', -3, 15], ['longCorner', 13, 14], ['along', 20, 9], ['a', 23, 6],
      ['midEntry', -22, 9], ['mid1', -14, 4], ['midDoor', 1, 3], ['ctMid', 8, 3], ['cat', 14, 6], ['ctA', 27, 5],
      ['bEntry', -22, 9], ['tunnel1', -20, -3], ['tunnelTurn', -13, -9], ['tunnel2', -4, -9], ['bDoor', 4, -13.5], ['bLower', 4, -16.2], ['bGap', 9, -16], ['b', 14, -18], ['ctB', 23, -18], ['ct', 28, -22],
    ];
    for (const point of points) this.addNode(...point);
    const links: Array<[string, string]> = [
      ['tspawn', 'longEntry'], ['tspawn', 'midEntry'], ['tspawn', 'bEntry'],
      ['longEntry', 'long1'], ['long1', 'long2'], ['long2', 'longCorner'], ['longCorner', 'along'], ['along', 'a'],
      ['midEntry', 'mid1'], ['mid1', 'midDoor'], ['midDoor', 'ctMid'], ['ctMid', 'cat'], ['cat', 'a'], ['cat', 'ctA'], ['ctA', 'ct'],
      ['bEntry', 'tunnel1'], ['tunnel1', 'tunnelTurn'], ['tunnelTurn', 'tunnel2'], ['tunnel2', 'bDoor'], ['bDoor', 'bLower'], ['bLower', 'bGap'], ['bGap', 'b'], ['b', 'ctB'], ['ctB', 'ct'],
      ['bDoor', 'ctMid'], ['mid1', 'tunnel1'], ['along', 'ctA'],
    ];
    for (const [a, b] of links) this.link(a, b);
  }

  private bindEvents() {
    const on = (target: EventTarget, type: string, handler: EventListener) => {
      target.addEventListener(type, handler);
      this.handlers.push([target, type, handler]);
    };
    on(this.renderer.domElement, 'click', () => {
      if (document.pointerLockElement !== this.renderer.domElement) this.renderer.domElement.requestPointerLock();
      this.audio.unlock();
    });
    on(document, 'pointerlockchange', () => this.emitHud(true));
    on(document, 'mousemove', ((event: MouseEvent) => {
      if (document.pointerLockElement !== this.renderer.domElement) return;
      const player = this.getPlayer();
      if (!player || !player.alive) return;
      player.yaw -= event.movementX * 0.00225;
      player.pitch = clamp(player.pitch - event.movementY * 0.00175, -1.36, 1.36);
    }) as EventListener);
    on(document, 'keydown', ((event: KeyboardEvent) => {
      this.audio.unlock();
      const key = event.key.toLowerCase();
      this.input.keys.add(key);
      if (event.code === 'Space') {
        event.preventDefault();
        this.input.jumpQueued = true;
        if (!this.getPlayer()?.alive) this.switchSpectator();
      }
      if (key === 'e') this.input.interact = true;
      if (key === 'r') this.startReload(this.getPlayer());
      if (key === '1') this.equipSlot(1);
      if (key === '2') this.equipSlot(2);
      if (key === '3') this.equipSlot(3);
      if (key === '4') this.equipSlot(4);
      if (key === 'n' && this.roundState === 'ended') this.startNextRound();
      if (key === 'enter' && !this.getPlayer()?.alive) this.takeOverSpectator();
    }) as EventListener);
    on(document, 'keyup', ((event: KeyboardEvent) => {
      this.input.keys.delete(event.key.toLowerCase());
      if (event.key.toLowerCase() === 'e') this.input.interact = false;
    }) as EventListener);
    on(document, 'mousedown', ((event: MouseEvent) => {
      this.audio.unlock();
      if (event.button === 0) this.input.fire = true;
      if (event.button === 2) {
        event.preventDefault();
        const player = this.getPlayer();
        if (player?.alive && WEAPONS[player.weapons[player.weaponIndex]].id === 'awp' && !this.input.aim) this.audio.scope();
        this.input.aim = true;
      }
    }) as EventListener);
    on(document, 'mouseup', ((event: MouseEvent) => {
      if (event.button === 0) this.input.fire = false;
      if (event.button === 2) this.input.aim = false;
    }) as EventListener);
    on(document, 'contextmenu', ((event: MouseEvent) => event.preventDefault()) as EventListener);
    on(document, 'wheel', ((event: WheelEvent) => {
      if (document.pointerLockElement !== this.renderer.domElement) return;
      this.cycleWeapon(event.deltaY > 0 ? 1 : -1);
    }) as EventListener);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
  }

  private resize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private resetRound(forcePistol = false) {
    this.roundState = 'active';
    this.roundWinner = null;
    this.roundReason = '';
    this.roundStartedAt = performance.now();
    this.pistolRound = forcePistol || this.roundNumber === 1;
    this.input.fire = false;
    this.input.aim = false;
    this.input.interact = false;
    this.spectatorIndex = 0;
    for (const actor of this.actors) this.actorsGroup.remove(actor.rig.root);
    this.actors = [];
    const tLoadout: WeaponId[] = this.pistolRound ? ['glock', 'knife'] : ['ak47', 'awp', 'deagle', 'glock', 'knife'];
    const ctLoadout: WeaponId[] = this.pistolRound ? ['usp', 'knife'] : ['m4a4', 'awp', 'deagle', 'usp', 'knife'];
    const tSpawns: Array<[number, number]> = [[-31.5, 18], [-25, 22], [-28, 13], [-22, 18.4], [-25, 11.5]];
    const ctSpawns: Array<[number, number]> = [[28, -22], [30, -19], [26, -24], [30, -24.5], [24, -20]];
    const tNames = ['T-FOX', 'T-RUSH', 'T-SMOKE', 'T-ENTRY', 'T-LOBO'];
    const ctNames = ['CT-HAWK', 'CT-SHIELD', 'CT-NOVA', 'CT-VIPER', 'CT-ANCHOR'];
    for (let i = 0; i < 5; i++) {
      this.actors.push(this.createActor(`t-${i}`, tNames[i], 'T', tSpawns[i], tLoadout, i === 0));
      this.actors.push(this.createActor(`ct-${i}`, ctNames[i], 'CT', ctSpawns[i], ctLoadout, false));
    }
    const carrier = this.actors.find((actor) => actor.id === 't-1')!;
    carrier.hasBomb = true;
    carrier.siteGoal = 'A';
    this.playerId = 't-0';
    const player = this.getPlayer()!;
    player.yaw = -Math.PI / 2;
    player.pitch = 0;
    this.createBomb();
    this.setFirstPersonWeapon(player);
    this.lastStatus = this.pistolRound ? '手枪局 · T 方持包 · 前往 A/B 点下包' : '全枪械回合 · 与队友推进并控制包点';
  }

  private createActor(id: string, name: string, team: Team, spawn: [number, number], loadout: WeaponId[], isPlayer: boolean) {
    const weapons = [...loadout];
    const ammo: Partial<Record<WeaponId, number>> = {};
    const reserve: Partial<Record<WeaponId, number>> = {};
    for (const weapon of weapons) {
      ammo[weapon] = WEAPONS[weapon].magSize;
      reserve[weapon] = WEAPONS[weapon].reserveMax;
    }
    const primary = weapons.find((weapon) => WEAPONS[weapon].slot === 1) ?? weapons[0];
    const rig = createHumanoid(team, primary);
    rig.root.position.set(spawn[0], 0, spawn[1]);
    this.actorsGroup.add(rig.root);
    const actor: Actor = {
      id, name, team, pos: vec2(spawn[0], spawn[1]), vel: new THREE.Vector3(), yaw: team === 'T' ? -Math.PI / 2 : Math.PI / 2, pitch: 0,
      health: 100, armor: this.pistolRound ? 0 : 55, alive: true, weapons, weaponIndex: Math.max(0, weapons.indexOf(primary)), ammo, reserve,
      nextShot: 0, reloadUntil: 0, action: 0, hasBomb: false, siteGoal: id.endsWith('1') || id.endsWith('3') ? 'B' : 'A',
      ai: { state: 'patrol', targetId: null, path: [], pathGoal: '', patrolIndex: Math.floor(Math.random() * 3), strafe: Math.random() > 0.5 ? 1 : -1, stuck: 0 },
      rig, flashUntil: 0,
    };
    return actor;
  }

  private createBomb() {
    const bomb = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.25), createMaterial(0x252c31, 0.62, 0.28));
    body.castShadow = true;
    bomb.add(body);
    const display = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0xff334f }));
    display.position.set(0, 0.105, -0.07);
    bomb.add(display);
    const led = new THREE.PointLight(0xff2348, 1.5, 3);
    led.position.y = 0.2;
    bomb.add(led);
    this.bomb = { state: 'carried', pos: new THREE.Vector3(), carrierId: 't-1', site: null, timer: 0, plantProgress: 0, defuseProgress: 0, defuserId: null, pulse: 0, mesh: bomb };
    this.world.add(bomb);
  }

  private getPlayer() { return this.actors.find((actor) => actor.id === this.playerId) ?? null; }
  private getLiving(team?: Team) { return this.actors.filter((actor) => actor.alive && (!team || actor.team === team)); }
  private getCurrentWeapon(actor: Actor) { return WEAPONS[actor.weapons[actor.weaponIndex]]; }

  private setFirstPersonWeapon(actor: Actor | null) {
    if (this.fpWeapon) this.camera.remove(this.fpWeapon);
    if (this.fpArms) this.camera.remove(this.fpArms);
    this.fpWeapon = null;
    this.fpArms = null;
    if (!actor || !actor.alive) return;
    const weapon = weaponModel(this.getCurrentWeapon(actor).id, true);
    weapon.position.set(0.32, -0.29, -0.7);
    weapon.rotation.set(0.02, 0, 0);
    this.camera.add(weapon);
    this.fpWeapon = weapon;
    const arms = new THREE.Group();
    const skin = createMaterial(0xc78f69, 0.92, 0);
    const sleeve = createMaterial(actor.team === 'T' ? 0xb9783e : 0x456d93, 0.84, 0);
    const left = addPart(arms, new THREE.BoxGeometry(0.17, 0.66, 0.18), sleeve, [-0.18, -0.27, -0.5]);
    const right = addPart(arms, new THREE.BoxGeometry(0.17, 0.66, 0.18), sleeve, [0.19, -0.25, -0.53]);
    left.rotation.z = 0.2;
    right.rotation.z = -0.2;
    addPart(arms, new THREE.BoxGeometry(0.16, 0.34, 0.17), skin, [-0.13, -0.04, -0.73]);
    addPart(arms, new THREE.BoxGeometry(0.16, 0.34, 0.17), skin, [0.16, -0.02, -0.76]);
    this.camera.add(arms);
    this.fpArms = arms;
  }

  private equipSlot(slot: number) {
    const player = this.getPlayer();
    if (!player?.alive || this.roundState !== 'active') return;
    const index = player.weapons.findIndex((id) => WEAPONS[id].slot === slot);
    if (index < 0 || index === player.weaponIndex) return;
    player.weaponIndex = index;
    player.reloadUntil = 0;
    this.setFirstPersonWeapon(player);
  }

  private cycleWeapon(delta: number) {
    const player = this.getPlayer();
    if (!player?.alive) return;
    player.weaponIndex = (player.weaponIndex + delta + player.weapons.length) % player.weapons.length;
    this.setFirstPersonWeapon(player);
  }

  private startReload(actor: Actor | null) {
    if (!actor?.alive || this.roundState !== 'active') return;
    const weapon = this.getCurrentWeapon(actor);
    if (weapon.magSize === 0 || actor.reloadUntil > performance.now() || (actor.ammo[weapon.id] ?? 0) >= weapon.magSize || (actor.reserve[weapon.id] ?? 0) <= 0) return;
    actor.reloadUntil = performance.now() + weapon.reloadTime * 1000;
    if (actor.id === this.playerId) this.audio.reload();
  }

  private finishReload(actor: Actor, now: number) {
    if (actor.reloadUntil <= 0 || actor.reloadUntil > now) return;
    const weapon = this.getCurrentWeapon(actor);
    const need = weapon.magSize - (actor.ammo[weapon.id] ?? 0);
    const take = Math.min(need, actor.reserve[weapon.id] ?? 0);
    actor.ammo[weapon.id] = (actor.ammo[weapon.id] ?? 0) + take;
    actor.reserve[weapon.id] = (actor.reserve[weapon.id] ?? 0) - take;
    actor.reloadUntil = 0;
  }

  private pointCollides(x: number, z: number, radius: number) {
    if (x < WORLD.minX + radius || x > WORLD.maxX - radius || z < WORLD.minZ + radius || z > WORLD.maxZ - radius) return true;
    for (const box of this.colliders) {
      if (box.maxY < 0.2) continue;
      if (x > box.minX - radius && x < box.maxX + radius && z > box.minZ - radius && z < box.maxZ + radius) return true;
    }
    return false;
  }

  private moveActor(actor: Actor, dx: number, dz: number) {
    const beforeX = actor.pos.x;
    const beforeZ = actor.pos.z;
    if (!this.pointCollides(actor.pos.x + dx, actor.pos.z, PLAYER_RADIUS)) actor.pos.x += dx;
    if (!this.pointCollides(actor.pos.x, actor.pos.z + dz, PLAYER_RADIUS)) actor.pos.z += dz;
    const moved = Math.hypot(actor.pos.x - beforeX, actor.pos.z - beforeZ);
    if (moved < Math.hypot(dx, dz) * 0.25) actor.ai.stuck += 1;
    else actor.ai.stuck = 0;
  }

  private nearestNode(position: THREE.Vector3) {
    let best: NodePoint | null = null;
    let bestDistance = Infinity;
    for (const node of this.nodes.values()) {
      const d = distance2D(position, node.pos);
      if (d < bestDistance) { bestDistance = d; best = node; }
    }
    return best;
  }

  private findPath(start: THREE.Vector3, goal: THREE.Vector3) {
    const from = this.nearestNode(start);
    const to = this.nearestNode(goal);
    if (!from || !to) return [];
    if (from.id === to.id) return [to.id];
    const queue = [from.id];
    const previous = new Map<string, string | null>([[from.id, null]]);
    while (queue.length) {
      const current = queue.shift()!;
      if (current === to.id) break;
      for (const next of this.nodes.get(current)?.links ?? []) {
        if (!previous.has(next)) { previous.set(next, current); queue.push(next); }
      }
    }
    if (!previous.has(to.id)) return [to.id];
    const result: string[] = [];
    let cursor: string | null = to.id;
    while (cursor) { result.unshift(cursor); cursor = previous.get(cursor) ?? null; }
    return result;
  }

  private navigate(actor: Actor, goal: THREE.Vector3, goalKey: string, dt: number) {
    if (actor.ai.pathGoal !== goalKey || actor.ai.path.length === 0 || actor.ai.stuck > 38) {
      actor.ai.path = this.findPath(actor.pos, goal);
      actor.ai.pathGoal = goalKey;
      actor.ai.stuck = 0;
    }
    let target = goal;
    const nodeId = actor.ai.path[0];
    if (nodeId) {
      const node = this.nodes.get(nodeId);
      if (node && distance2D(actor.pos, node.pos) < 1.45) actor.ai.path.shift();
      else if (node) target = node.pos;
    }
    const dx = target.x - actor.pos.x;
    const dz = target.z - actor.pos.z;
    const length = Math.hypot(dx, dz);
    if (length > 0.45) {
      const speed = actor.team === 'CT' ? 3.1 : 3.25;
      const moveX = dx / length * speed * dt;
      const moveZ = dz / length * speed * dt;
      actor.yaw = Math.atan2(-dx, -dz);
      this.moveActor(actor, moveX, moveZ);
    }
  }

  private lineBlocked(origin: THREE.Vector3, target: THREE.Vector3) {
    const direction = target.clone().sub(origin);
    const distance = direction.length();
    direction.normalize();
    for (const box of this.colliders) {
      const hit = rayAabb(origin, direction, new THREE.Vector3(box.minX, box.minY, box.minZ), new THREE.Vector3(box.maxX, box.maxY, box.maxZ));
      if (hit !== null && hit > 0.05 && hit < distance - 0.25) return true;
    }
    return false;
  }

  private canSee(observer: Actor, target: Actor) {
    const from = observer.pos.clone().setY(observer.pos.y + 1.38);
    const to = target.pos.clone().setY(target.pos.y + 1.28);
    const direction = to.clone().sub(from);
    const distance = direction.length();
    if (distance > 35) return false;
    direction.normalize();
    const facing = new THREE.Vector3(-Math.sin(observer.yaw), 0, -Math.cos(observer.yaw));
    const horizontal = new THREE.Vector3(direction.x, 0, direction.z).normalize();
    if (facing.dot(horizontal) < -0.35) return false;
    return !this.lineBlocked(from, to);
  }

  private findVisibleEnemy(actor: Actor) {
    let best: Actor | null = null;
    let bestDistance = Infinity;
    for (const other of this.actors) {
      if (!other.alive || other.team === actor.team) continue;
      const distance = distance2D(actor.pos, other.pos);
      if (distance < bestDistance && this.canSee(actor, other)) { best = other; bestDistance = distance; }
    }
    return best;
  }

  private updatePlayer(dt: number, now: number) {
    const player = this.getPlayer();
    if (!player?.alive || this.roundState !== 'active') return;
    const forward = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
    const right = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
    const movement = new THREE.Vector3();
    if (this.input.keys.has('w')) movement.add(forward);
    if (this.input.keys.has('s')) movement.sub(forward);
    if (this.input.keys.has('d')) movement.add(right);
    if (this.input.keys.has('a')) movement.sub(right);
    const moving = movement.lengthSq() > 0;
    if (moving) {
      movement.normalize();
      const speed = this.input.aim ? 2.7 : this.input.keys.has('shift') ? 6.25 : 4.65;
      this.moveActor(player, movement.x * speed * dt, movement.z * speed * dt);
      if (now > this.stepAt && player.pos.y < 0.03) {
        this.stepAt = now + (this.input.keys.has('shift') ? 260 : 365);
        this.audio.step();
      }
    }
    if (this.input.jumpQueued && player.pos.y <= 0.03) player.vel.y = 7.2;
    player.vel.y -= 22 * dt;
    player.pos.y = Math.max(0, player.pos.y + player.vel.y * dt);
    if (player.pos.y === 0) player.vel.y = 0;
    this.input.jumpQueued = false;
    if (this.input.fire) this.fireActor(player, now);
    this.handleInteract(player, dt);
    this.camera.position.set(player.pos.x, player.pos.y + EYE_HEIGHT, player.pos.z);
    this.camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
  }

  private handleInteract(player: Actor, dt: number) {
    let didAction = false;
    if (player.team === 'T' && this.bomb.state === 'dropped' && distance2D(player.pos, this.bomb.pos) < 1.8) {
      this.bomb.state = 'carried';
      this.bomb.carrierId = player.id;
      player.hasBomb = true;
      this.lastStatus = '已拾取 C4 · 前往 A/B 点';
      this.audio.plant();
      didAction = true;
    }
    if (this.input.interact && player.team === 'T' && player.hasBomb && this.bomb.state === 'carried') {
      const site = this.nearestSite(player.pos);
      if (site && distance2D(player.pos, site.pos) <= site.radius) {
        player.action += dt;
        didAction = true;
        this.lastStatus = `下包中 · ${site.label} ${(player.action / 3).toFixed(1)}s`;
        if (player.action >= 3) this.plantBomb(player, site.id);
      }
    } else if (player.action > 0 && this.bomb.state === 'carried') player.action = 0;
    if (!didAction && player.team === 'T' && player.hasBomb && this.bomb.state === 'carried') {
      const site = this.nearestSite(player.pos);
      if (site && distance2D(player.pos, site.pos) <= site.radius) this.lastStatus = `按住 E 下包 · ${site.label}`;
    }
  }

  private nearestSite(position: THREE.Vector3) {
    let best: { id: SiteName; label: string; pos: THREE.Vector3; radius: number; color: number } | null = null;
    let bestDistance = Infinity;
    for (const [id, site] of Object.entries(SITE_INFO) as Array<[SiteName, typeof SITE_INFO.A]>) {
      const distance = distance2D(position, site.pos);
      if (distance < bestDistance) { best = { id, ...site }; bestDistance = distance; }
    }
    return best;
  }

  private plantBomb(actor: Actor, site: SiteName) {
    if (this.bomb.state !== 'carried') return;
    actor.action = 0;
    actor.hasBomb = false;
    this.bomb.state = 'planted';
    this.bomb.carrierId = null;
    this.bomb.site = site;
    this.bomb.pos.copy(SITE_INFO[site].pos);
    this.bomb.timer = 40;
    this.bomb.plantProgress = 0;
    this.bomb.defuseProgress = 0;
    this.bomb.defuserId = null;
    this.lastStatus = `C4 已安放于 ${site} · CT 拆包倒计时开始`;
    this.audio.plant();
  }

  private updateAI(actor: Actor, dt: number, now: number) {
    if (!actor.alive || actor.id === this.playerId || this.roundState !== 'active') return;
    this.finishReload(actor, now);
    const visibleEnemy = this.findVisibleEnemy(actor);
    if (visibleEnemy) {
      actor.ai.targetId = visibleEnemy.id;
      actor.ai.state = 'engage';
      actor.yaw = Math.atan2(-(visibleEnemy.pos.x - actor.pos.x), -(visibleEnemy.pos.z - actor.pos.z));
      const d = distance2D(actor.pos, visibleEnemy.pos);
      const weapon = this.getCurrentWeapon(actor);
      if (d > Math.min(weapon.range * 0.68, 18)) this.moveActor(actor, -Math.sin(actor.yaw) * 1.3 * dt, -Math.cos(actor.yaw) * 1.3 * dt);
      else {
        const strafeYaw = actor.yaw + actor.ai.strafe * Math.PI / 2;
        this.moveActor(actor, -Math.sin(strafeYaw) * 0.7 * dt, -Math.cos(strafeYaw) * 0.7 * dt);
      }
      this.fireActor(actor, now);
      return;
    }
    actor.ai.targetId = null;
    if (actor.team === 'T') {
      if (this.bomb.state === 'dropped' && distance2D(actor.pos, this.bomb.pos) < 18) {
        actor.ai.state = 'recover';
        this.navigate(actor, this.bomb.pos, 'dropped-bomb', dt);
        if (distance2D(actor.pos, this.bomb.pos) < 1.6) {
          this.bomb.state = 'carried';
          this.bomb.carrierId = actor.id;
          actor.hasBomb = true;
          this.lastStatus = `${actor.name} 拾起了 C4`;
        }
        return;
      }
      if (actor.hasBomb && this.bomb.state === 'carried') {
        const site = SITE_INFO[actor.siteGoal];
        if (distance2D(actor.pos, site.pos) <= site.radius) {
          actor.ai.state = 'plant';
          actor.action += dt;
          this.lastStatus = `${actor.name} 正在 ${site.label} 下包 ${(actor.action / 3).toFixed(1)}s`;
          if (actor.action >= 3) this.plantBomb(actor, actor.siteGoal);
        } else {
          actor.ai.state = 'patrol';
          this.navigate(actor, site.pos, `site-${actor.siteGoal}`, dt);
        }
      } else if (this.bomb.state === 'planted') {
        actor.ai.state = 'patrol';
        this.navigate(actor, this.bomb.pos, 'post-plant', dt);
      } else {
        const patrol: Array<[number, number]> = [
          [-4, 14], [6, 3], [5, -10],
        ];
        const point = vec2(...patrol[(actor.ai.patrolIndex + Math.floor(now / 9000)) % patrol.length]);
        this.navigate(actor, point, `patrol-${actor.ai.patrolIndex}`, dt);
      }
    } else if (this.bomb.state === 'planted') {
      actor.ai.state = 'defuse';
      const site = SITE_INFO[this.bomb.site!];
      if (distance2D(actor.pos, site.pos) <= 2.15) {
        const blocked = this.getLiving('T').some((enemy) => this.canSee(actor, enemy));
        if (!blocked) {
          actor.action += dt;
          this.bomb.defuseProgress = actor.action;
          this.bomb.defuserId = actor.id;
          this.lastStatus = `${actor.name} 正在拆包 · ${(actor.action / 5).toFixed(1)}s`;
          if (actor.action >= 5) this.defuseBomb(actor);
        } else actor.action = 0;
      } else this.navigate(actor, site.pos, `defuse-${this.bomb.site}`, dt);
    } else {
      const patrol: Array<[number, number]> = [[27, 5], [22, -18], [7, 2], [28, -22]];
      const point = vec2(...patrol[(actor.ai.patrolIndex + (actor.team === 'CT' ? 1 : 0)) % patrol.length]);
      this.navigate(actor, point, `ct-patrol-${actor.ai.patrolIndex}`, dt);
    }
  }

  private defuseBomb(actor: Actor) {
    if (this.bomb.state !== 'planted') return;
    this.bomb.state = 'dropped';
    this.bomb.pos.copy(SITE_INFO[this.bomb.site!].pos);
    this.bomb.site = null;
    this.bomb.timer = 0;
    this.bomb.defuseProgress = 0;
    this.bomb.defuserId = null;
    actor.action = 0;
    this.lastStatus = `${actor.name} 完成拆包`;
    this.audio.defuse();
    this.finishRound('CT', '成功拆包');
  }

  private fireActor(shooter: Actor, now: number) {
    if (!shooter.alive || shooter.reloadUntil > now || this.roundState !== 'active') return;
    const weapon = this.getCurrentWeapon(shooter);
    if (now < shooter.nextShot) return;
    if (weapon.magSize > 0 && (shooter.ammo[weapon.id] ?? 0) <= 0) {
      this.startReload(shooter);
      return;
    }
    shooter.nextShot = now + weapon.fireInterval * 1000;
    if (weapon.magSize > 0) shooter.ammo[weapon.id] = (shooter.ammo[weapon.id] ?? 0) - 1;
    shooter.flashUntil = now + 44;
    shooter.action = 0;
    shooter.ai.stuck = 0;
    this.audio.shot(weapon.id);
    const origin = shooter.id === this.playerId ? this.camera.getWorldPosition(new THREE.Vector3()) : shooter.pos.clone().setY(shooter.pos.y + 1.34);
    let direction: THREE.Vector3;
    if (shooter.id === this.playerId) {
      direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
    } else {
      direction = new THREE.Vector3(-Math.sin(shooter.yaw), 0, -Math.cos(shooter.yaw));
      direction.y = -0.015;
      direction.normalize();
    }
    if (weapon.spread > 0) {
      const spread = weapon.spread + (shooter.id === this.playerId ? shooter.action * 0.002 : 0);
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * spread);
      direction.y += (Math.random() - 0.5) * spread;
      direction.normalize();
    }
    if (weapon.id === 'knife') {
      const target = this.getLiving().filter((actor) => actor.team !== shooter.team && distance2D(actor.pos, shooter.pos) < 2.4).sort((a, b) => distance2D(a.pos, shooter.pos) - distance2D(b.pos, shooter.pos))[0];
      if (target && !this.lineBlocked(origin, target.pos.clone().setY(1.1))) this.applyDamage(shooter, target, weapon.damage, 'chest', weapon.id);
      this.addTracer(origin, origin.clone().add(direction.multiplyScalar(1.2)), weapon.color, now, true);
      return;
    }
    const result = this.traceShot(shooter, origin, direction, weapon.range);
    this.addTracer(origin, result.point, weapon.color, now, false);
    if (result.target && result.zone) this.applyDamage(shooter, result.target, weapon.damage, result.zone, weapon.id);
  }

  private traceShot(shooter: Actor, origin: THREE.Vector3, direction: THREE.Vector3, range: number) {
    let wallDistance = range;
    for (const box of this.colliders) {
      const hit = rayAabb(origin, direction, new THREE.Vector3(box.minX, box.minY, box.minZ), new THREE.Vector3(box.maxX, box.maxY, box.maxZ));
      if (hit !== null && hit > 0.02) wallDistance = Math.min(wallDistance, hit);
    }
    let target: Actor | null = null;
    let zone: HitZone | null = null;
    let targetDistance = wallDistance;
    const zones: Array<[HitZone, number, number, number, number, number, number]> = [
      ['head', -0.27, 0.27, 1.45, 1.98, -0.25, 0.25],
      ['chest', -0.38, 0.38, 0.92, 1.45, -0.27, 0.27],
      ['abdomen', -0.36, 0.36, 0.5, 0.92, -0.25, 0.25],
      ['arm', -0.62, 0.62, 0.72, 1.4, -0.24, 0.24],
      ['leg', -0.46, 0.46, 0.0, 0.56, -0.24, 0.24],
    ];
    for (const candidate of this.actors) {
      if (!candidate.alive || candidate.team === shooter.team) continue;
      for (const [candidateZone, minX, maxX, minY, maxY, minZ, maxZ] of zones) {
        const hit = rayAabb(origin, direction, new THREE.Vector3(candidate.pos.x + minX, candidate.pos.y + minY, candidate.pos.z + minZ), new THREE.Vector3(candidate.pos.x + maxX, candidate.pos.y + maxY, candidate.pos.z + maxZ));
        if (hit !== null && hit < targetDistance && hit <= range) { target = candidate; zone = candidateZone; targetDistance = hit; }
      }
    }
    return { target, zone, point: origin.clone().add(direction.clone().multiplyScalar(Math.max(0.2, targetDistance))) };
  }

  private addTracer(origin: THREE.Vector3, end: THREE.Vector3, color: number, now: number, melee: boolean) {
    const geometry = new THREE.BufferGeometry().setFromPoints([origin, end]);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: melee ? 0.18 : 0.8 }));
    this.effectsGroup.add(line);
    this.effects.push({ object: line, expires: now + (melee ? 50 : 75) });
    if (!melee) {
      const flash = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe3a2, transparent: true }));
      flash.position.copy(origin);
      this.effectsGroup.add(flash);
      this.effects.push({ object: flash, expires: now + 32 });
    }
  }

  private applyDamage(shooter: Actor, victim: Actor, baseDamage: number, zone: HitZone, weapon: WeaponId) {
    if (!victim.alive) return;
    const multiplier: Record<HitZone, number> = { head: 2, chest: 1, abdomen: 0.9, arm: 0.55, leg: 0.48 };
    let damage = baseDamage * multiplier[zone];
    if (victim.armor > 0) {
      const armorAbsorb = Math.min(victim.armor, damage * 0.38);
      victim.armor -= armorAbsorb;
      damage -= armorAbsorb * 0.78;
    }
    victim.health = Math.max(0, Math.round(victim.health - damage));
    victim.flashUntil = performance.now() + 75;
    if (shooter.id === this.playerId) {
      this.hitMarkerUntil = performance.now() + 115;
      this.audio.hit();
    }
    if (victim.health <= 0) this.killActor(shooter, victim, weapon);
  }

  private killActor(killer: Actor, victim: Actor, weapon: WeaponId) {
    if (!victim.alive) return;
    victim.alive = false;
    victim.health = 0;
    victim.reloadUntil = 0;
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bomb.state = 'dropped';
      this.bomb.carrierId = null;
      this.bomb.pos.copy(victim.pos);
      this.lastStatus = `${victim.name} 阵亡，C4 已掉落`;
    }
    const event: KillEvent = { id: ++this.killId, killer: killer.name, victim: victim.name, team: killer.team, weapon, at: performance.now() };
    this.killfeed = [event, ...this.killfeed].slice(0, 5);
    this.audio.kill();
    if (victim.id === this.playerId) {
      this.lastStatus = '你已阵亡 · SPACE 切换视角 · ENTER 接管队友';
      const living = this.getLiving(killer.team === 'T' ? 'T' : 'CT');
      this.spectatorIndex = Math.max(0, living.findIndex((actor) => actor.id !== victim.id));
    }
    this.checkRoundEnd();
  }

  private checkRoundEnd() {
    if (this.roundState !== 'active') return;
    const aliveT = this.getLiving('T').length;
    const aliveCT = this.getLiving('CT').length;
    if (aliveCT === 0) this.finishRound('T', 'CT 全员被清除');
    else if (aliveT === 0 && this.bomb.state !== 'planted') this.finishRound('CT', 'T 全员被清除');
  }

  private finishRound(winner: Team, reason: string) {
    if (this.roundState === 'ended') return;
    this.roundState = 'ended';
    this.roundWinner = winner;
    this.roundReason = reason;
    if (winner === 'T') this.scoreT += 1;
    else this.scoreCT += 1;
    this.roundEndAt = performance.now() + 5200;
    this.lastStatus = `${winner === 'T' ? 'T 方胜利' : 'CT 方胜利'} · ${reason}`;
    this.audio.win();
  }

  private startNextRound() {
    if (this.roundState !== 'ended') return;
    this.roundNumber += 1;
    this.pistolRound = false;
    this.resetRound(false);
  }

  private switchSpectator() {
    if (this.getPlayer()?.alive) return;
    const teammates = this.getLiving('T');
    if (!teammates.length) return;
    this.spectatorIndex = (this.spectatorIndex + 1) % teammates.length;
  }

  private takeOverSpectator() {
    const old = this.getPlayer();
    if (old?.alive) return;
    const teammates = this.getLiving('T');
    const selected = teammates[this.spectatorIndex % Math.max(1, teammates.length)];
    if (!selected) return;
    this.playerId = selected.id;
    this.setFirstPersonWeapon(selected);
    this.lastStatus = `已接管 ${selected.name}`;
  }

  private updateBomb(dt: number) {
    if (this.bomb.state === 'carried') {
      const carrier = this.actors.find((actor) => actor.id === this.bomb.carrierId && actor.alive);
      if (carrier) this.bomb.pos.copy(carrier.pos).setY(0.65);
    } else if (this.bomb.state === 'dropped') {
      this.bomb.pos.y = 0.18;
    } else if (this.bomb.state === 'planted') {
      this.bomb.timer -= dt;
      this.bomb.pulse += dt;
      if (this.bomb.timer <= 0) {
        this.bomb.timer = 0;
        this.audio.explode();
        for (const actor of this.getLiving()) {
          if (distance2D(actor.pos, this.bomb.pos) < 13) { actor.health = 0; actor.alive = false; }
        }
        this.lastStatus = 'C4 爆炸 · A/B 点被摧毁';
        this.finishRound('T', 'C4 爆炸');
      }
    }
    this.bomb.mesh.position.copy(this.bomb.pos);
    this.bomb.mesh.position.y = this.bomb.state === 'carried' ? 0.9 : 0.2;
    this.bomb.mesh.rotation.y += dt * 0.8;
    const led = this.bomb.mesh.children[2] as THREE.PointLight;
    led.intensity = this.bomb.state === 'planted' ? 1.2 + Math.abs(Math.sin(this.bomb.pulse * 7)) * 2.3 : 0.8;
    this.checkRoundEnd();
  }

  private updateVisuals(now: number, dt: number) {
    for (const actor of this.actors) {
      actor.rig.root.position.copy(actor.pos);
      actor.rig.root.rotation.y = actor.yaw;
      actor.rig.root.visible = actor.alive && actor.id !== this.playerId;
      const stride = Math.sin(now * 0.009 + actor.ai.patrolIndex) * (actor.ai.state === 'engage' ? 0.14 : 0.07);
      actor.rig.legL.rotation.x = stride;
      actor.rig.legR.rotation.x = -stride;
      actor.rig.armL.rotation.x = -0.32 - stride * 0.35;
      actor.rig.armR.rotation.x = -0.48 + stride * 0.35;
      actor.rig.root.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) child.material.emissive.set(actor.flashUntil > now ? 0x5d1111 : 0x000000);
      });
      const current = this.getCurrentWeapon(actor).id;
      if (actor.rig.weapon.userData.weaponId !== current) {
        actor.rig.root.remove(actor.rig.weapon);
        actor.rig.weapon = weaponModel(current);
        actor.rig.weapon.position.set(0, 1.08, -0.58);
        actor.rig.root.add(actor.rig.weapon);
        actor.rig.weapon.userData.weaponId = current;
      }
    }
    if (this.roundState === 'ended' && now >= this.roundEndAt) this.startNextRound();
    const player = this.getPlayer();
    if (player?.alive) {
      const targetFov = this.input.aim && this.getCurrentWeapon(player).id === 'awp' ? 34 : 75;
      this.camera.fov += (targetFov - this.camera.fov) * clamp(dt * 11, 0, 1);
      this.camera.updateProjectionMatrix();
      if (this.fpWeapon) {
        const targetX = this.input.aim && this.getCurrentWeapon(player).id === 'awp' ? 0.12 : 0.32;
        this.fpWeapon.position.x += (targetX - this.fpWeapon.position.x) * clamp(dt * 10, 0, 1);
      }
    } else {
      const living = this.getLiving('T');
      const spectator = living[this.spectatorIndex % Math.max(1, living.length)];
      if (spectator) {
        this.camera.position.lerp(new THREE.Vector3(spectator.pos.x, spectator.pos.y + 2.6, spectator.pos.z + 3.2), clamp(dt * 4, 0, 1));
        this.camera.lookAt(spectator.pos.x, spectator.pos.y + 1.15, spectator.pos.z);
      }
    }
  }

  private visibleToPlayer(actor: Actor, player: Actor | null) {
    if (!actor.alive) return false;
    if (!player || actor.team === player.team || actor.id === player.id) return true;
    return this.canSee(player, actor);
  }

  private emitHud(locked = document.pointerLockElement === this.renderer.domElement) {
    const player = this.getPlayer();
    const weapon = player ? this.getCurrentWeapon(player) : WEAPONS.glock;
    const spectator = !player?.alive ? this.getLiving('T')[this.spectatorIndex % Math.max(1, this.getLiving('T').length)] : null;
    const actors: SnapshotActor[] = this.actors.map((actor) => ({ id: actor.id, name: actor.name, team: actor.team, x: actor.pos.x, z: actor.pos.z, alive: actor.alive, visible: this.visibleToPlayer(actor, player), isPlayer: actor.id === this.playerId, hasBomb: actor.hasBomb }));
    this.onHud({
      locked, round: this.roundNumber, pistolRound: this.pistolRound, timeLeft: Math.max(0, 110 - (performance.now() - this.roundStartedAt) / 1000),
      bombTime: this.bomb.state === 'planted' ? this.bomb.timer : null, bombState: this.bomb.state, bombSite: this.bomb.site, bombCarrier: this.bomb.carrierId ? this.actors.find((actor) => actor.id === this.bomb.carrierId)?.name ?? null : null, bombX: this.bomb.pos.x, bombZ: this.bomb.pos.z,
      health: player?.health ?? 0, armor: player?.armor ?? 0, weapon: weapon.id, ammo: player?.ammo[weapon.id] ?? 0, reserve: player?.reserve[weapon.id] ?? 0, reloading: Boolean(player && player.reloadUntil > performance.now()), scoped: Boolean(player?.alive && this.input.aim && weapon.id === 'awp'), spread: 8 + (player?.action ?? 0) * 3 + (player && this.input.keys.size > 0 ? 2 : 0), scoreT: this.scoreT, scoreCT: this.scoreCT, playerAlive: Boolean(player?.alive), spectatorName: spectator?.name ?? null, roundWinner: this.roundWinner, status: this.lastStatus, hitMarker: this.hitMarkerUntil > performance.now(), actors, killfeed: this.killfeed,
    });
  }

  private update(now: number, dt: number) {
    this.finishReloads(now);
    this.updatePlayer(dt, now);
    for (const actor of this.actors) this.updateAI(actor, dt, now);
    this.updateBomb(dt);
    if (this.roundState === 'active' && now - this.roundStartedAt > 110000 && this.bomb.state !== 'planted') this.finishRound('CT', '回合时间耗尽');
    this.updateVisuals(now, dt);
    for (let index = this.effects.length - 1; index >= 0; index--) {
      if (this.effects[index].expires <= now) {
        this.effectsGroup.remove(this.effects[index].object);
        this.effects[index].object.traverse((child) => { if (child instanceof THREE.Mesh) { child.geometry.dispose(); if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose()); else child.material.dispose(); } });
        this.effects.splice(index, 1);
      }
    }
    if (now - this.hudAt > 90) { this.hudAt = now; this.emitHud(); }
  }

  private finishReloads(now: number) { for (const actor of this.actors) this.finishReload(actor, now); }

  private loop = (now: number) => {
    if (this.disposed) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
    this.lastTime = now;
    this.update(now, dt);
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
  };
}

function Minimap({ snapshot }: { snapshot: HudSnapshot }) {
  return (
    <div className="minimap-panel">
      <div className="mini-header"><span>TACTICAL MAP</span><span className="mini-live">LIVE</span></div>
      <svg className="minimap" viewBox="-36 -30 72 60" aria-label="Dust2 tactical minimap">
        <rect x="-34" y="-28" width="68" height="56" rx="1" className="mini-ground" />
        {MAP_ZONES.map((zone) => <rect key={zone.name} x={zone.x - zone.w / 2} y={-zone.z - zone.h / 2} width={zone.w} height={zone.h} className={`mini-zone ${zone.tone}`} />)}
        <path d="M-30 -18 L-22 -15 L-13 -15 L-3 -15 L13 -14 L20 -9 L23 -6 M-28 -18 L-22 -9 L-14 -4 L1 -3 L8 -3 L14 -5 L23 -6 M-22 -5 L-20 3 L-13 9 L-4 9 L6 14 L14 18 L23 18 L28 22" className="mini-path" />
        <line x1="3.6" x2="3.6" y1="-6" y2="-1" className="mini-door" />
        <text x="-28" y="-15" className="mini-label">T</text>
        <text x="23" y="-4" className="mini-label">A</text>
        <text x="14" y="20" className="mini-label">B</text>
        <text x="28" y="25" className="mini-label">CT</text>
        {snapshot.actors.filter((actor) => actor.alive && actor.visible).map((actor) => <g key={actor.id} className={actor.isPlayer ? 'mini-player' : actor.team === 'T' ? 'mini-teammate' : 'mini-enemy'}><circle cx={actor.x} cy={-actor.z} r={actor.isPlayer ? 1.35 : 0.92} /><circle cx={actor.x} cy={-actor.z} r={actor.isPlayer ? 0.35 : 0.22} className="mini-dot" /></g>)}
        {(() => { const carrier = snapshot.actors.find((actor) => actor.hasBomb && actor.visible); if (snapshot.bombState === 'carried' && !carrier) return null; const x = carrier?.x ?? snapshot.bombX; const z = carrier?.z ?? snapshot.bombZ; return <g className="mini-bomb"><rect x={x - 1.1} y={-z - 1.1} width="2.2" height="2.2" /><text x={x} y={-z + 0.5}>C4</text></g>; })()}
      </svg>
      <div className="mini-legend"><span><i className="legend-dot you" />YOU</span><span><i className="legend-dot friend" />TEAM</span><span><i className="legend-dot foe" />VISIBLE ENEMY</span></div>
    </div>
  );
}

function Hud({ snapshot, onRestart }: { snapshot: HudSnapshot; onRestart: () => void }) {
  const weapon = WEAPONS[snapshot.weapon];
  const aliveTeammates = snapshot.actors.filter((actor) => actor.team === 'T' && actor.alive).length;
  const aliveEnemies = snapshot.actors.filter((actor) => actor.team === 'CT' && actor.alive).length;
  return (
    <div className="hud-root">
      <div className="topbar">
        <div className="brand"><span className="brand-mark">✦</span><span>DUST<span className="brand-slash">//</span>2</span><small>TACTICAL PROTOTYPE</small></div>
        <div className="round-status"><span className="round-kicker">ROUND {String(snapshot.round).padStart(2, '0')}</span><span className="round-clock">{snapshot.bombTime !== null ? fmtTime(snapshot.bombTime) : fmtTime(snapshot.timeLeft)}</span><span className="round-type">{snapshot.pistolRound ? 'PISTOL ROUND' : 'LIVE FIRE'}</span></div>
        <div className="scoreboard"><span className="score-t">T {snapshot.scoreT}</span><span className="score-dash">:</span><span className="score-ct">{snapshot.scoreCT} CT</span></div>
      </div>
      <div className="killfeed">{snapshot.killfeed.map((kill) => <div className="kill-card" key={kill.id}><span className={kill.team === 'T' ? 'kill-t' : 'kill-ct'}>{kill.killer}</span><span className="kill-weapon">{WEAPONS[kill.weapon].short}</span><span className="kill-victim">{kill.victim}</span></div>)}</div>
      <Minimap snapshot={snapshot} />
      <div className="center-status"><div className="objective-chip"><span className={`status-led ${snapshot.bombState}`} />{snapshot.bombState === 'planted' ? `C4 PLANTED · ${snapshot.bombSite}` : snapshot.bombState === 'dropped' ? 'C4 DROPPED' : `C4 · ${snapshot.bombCarrier ?? 'CARRIER'}`}</div><div className="status-message">{snapshot.status}</div></div>
      <div className="crosshair" style={{ ['--spread' as string]: `${snapshot.spread}px` }}><span className="crosshair-line top" /><span className="crosshair-line right" /><span className="crosshair-line bottom" /><span className="crosshair-line left" /><span className={snapshot.hitMarker ? 'hit-marker active' : 'hit-marker'}>×</span></div>
      {snapshot.scoped && <div className="scope-overlay"><div className="scope-ring" /><div className="scope-crosshair"><i /><b /></div><span className="scope-label">AWP // 4X</span></div>}
      <div className="bottom-left"><div className="team-alive"><span className="team-badge t">T</span><span>{aliveTeammates} ALIVE</span><span className="team-separator">/</span><span className="team-badge ct">CT</span><span>{aliveEnemies} ALIVE</span></div><div className="vitals"><div className="vital health"><span className="vital-icon">+</span><strong>{snapshot.health}</strong><div className="meter"><i style={{ width: `${snapshot.health}%` }} /></div></div><div className="vital armor"><span className="vital-icon">◇</span><strong>{snapshot.armor}</strong><div className="meter"><i style={{ width: `${Math.min(100, snapshot.armor)}%` }} /></div></div></div></div>
      <div className="bottom-right"><div className="weapon-slot"><span className="slot-no">{weapon.slot}</span><span className="weapon-name">{weapon.label}</span><span className="weapon-mode">{weapon.automatic ? 'AUTO' : 'SEMI'}</span></div><div className="ammo"><span className="ammo-current">{snapshot.reloading ? '···' : String(snapshot.ammo).padStart(2, '0')}</span><span className="ammo-divider">/</span><span className="ammo-reserve">{String(snapshot.reserve).padStart(3, '0')}</span></div><div className="loadout-hint">[1] 主武器&nbsp;&nbsp; [2] 手枪&nbsp;&nbsp; [3] 刀&nbsp;&nbsp; [R] 换弹</div></div>
      <div className="control-strip"><span><b>WASD</b> MOVE</span><span><b>SPACE</b> JUMP / SPECTATE</span><span><b>LMB</b> FIRE</span><span><b>RMB</b> AWP SCOPE</span><span><b>E</b> C4</span></div>
      {!snapshot.locked && <div className="start-overlay"><div className="start-card"><div className="start-eyebrow">DUST // 2 · 5V5 ARENA</div><h1>ENTER THE<br /><em>FIRELINE</em></h1><p>程序化几何地图 · 视线 AI · C4 回合制原型</p><button onClick={() => document.querySelector<HTMLCanvasElement>('.game-canvas')?.requestPointerLock()}>点击进入战场 <span>→</span></button><div className="start-note">推荐使用耳机 · 首次点击后启用程序化音效</div></div></div>}
      {!snapshot.playerAlive && <div className="spectator-card"><span className="dead-label">ELIMINATED</span><strong>你已阵亡</strong><span>SPACE 切换存活队友 · ENTER 接管 {snapshot.spectatorName ?? '队友'}</span></div>}
      {snapshot.roundWinner && <div className="round-end"><span className={snapshot.roundWinner === 'T' ? 'winner-t' : 'winner-ct'}>{snapshot.roundWinner === 'T' ? 'TERRORISTS WIN' : 'COUNTER-TERRORISTS WIN'}</span><strong>{snapshot.status}</strong><small>N 立即开始下一回合 · 自动继续</small><button onClick={onRestart}>重新开始</button></div>}
    </div>
  );
}

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<GameRuntime | null>(null);
  const [snapshot, setSnapshot] = useState<HudSnapshot>(INITIAL_HUD);
  useEffect(() => {
    if (!mountRef.current) return;
    const runtime = new GameRuntime(mountRef.current, setSnapshot);
    runtimeRef.current = runtime;
    runtime.start();
    return () => { runtime.dispose(); runtimeRef.current = null; };
  }, []);
  return <main className="app-shell"><div ref={mountRef} className="scene-root" /><Hud snapshot={snapshot} onRestart={() => runtimeRef.current?.restartMatch()} /></main>;
}
