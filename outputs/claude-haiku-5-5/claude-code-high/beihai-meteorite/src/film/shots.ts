import * as THREE from "three";
import { applyPose, aim, float, idle, lerpPose, walk, type Figure, type Pose } from "@agentbench/voxel-kit";
import {
  clamp01,
  easeInOutCubic,
  fadeEnvelope,
  lerp,
  segmentProgress,
  smoothstep,
  type Shot,
} from "@agentbench/cinematic-player";
import { GROUP_CENTRE, SUIT_COLS, suitBase, type Cast } from "./cast";
import { rockCanvas, rng, VOXEL_MATERIAL } from "./voxels";
import type { Sets } from "./sets";

/** Everything a shot needs: the built scene, the cast, and the subtitle card. */
export interface Film {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  sets: Sets;
  cast: Cast;
  title: THREE.Group;
  titleRock: THREE.Mesh;
  particles: THREE.Points;
  particleEvents: HitEvent[];
  worldFlash: THREE.Sprite;
  card: HTMLElement;
  cardKey: string;
  zhangDress: "uniform" | "suit" | "suitOpen";
  suitDress: string[];
}

type Env = "title" | "hutong" | "collector" | "lathe" | "underground" | "space" | "end";
type Vec3 = [number, number, number];

interface CameraKey {
  t: number;
  pos: Vec3;
  look: Vec3;
  fov?: number;
}

interface HitEvent {
  time: number;
  origin: THREE.Vector3;
  seed: number;
}

/* ------------------------------------------------------------ timeline */

const TIMES = {
  title: [0, 7],
  hutong: [7, 30],
  collector: [30, 92],
  lathe: [92, 106],
  underground: [106, 130],
  elevator: [130, 144],
  base: [144, 166],
  float: [166, 190],
  photo: [190, 206],
  scope: [206, 240],
  aftermath: [240, 264],
  alone: [264, 302],
  end: [302, 312],
} as const;

/** Positions that recur across shots. */
const DOOR = new THREE.Vector3(0, 1060, 168);
const ZHANG_SPACE_START = new THREE.Vector3(-258, 1098.8, 22);
const ZHANG_PHOTO = new THREE.Vector3(-50, 1092, 232);
const ZHANG_ALONE = new THREE.Vector3(-210, 1127, 142);
const SUN_EVENING = new THREE.Vector3(0.55, 0.6, 0.45).normalize();
const SUN_PHOTO = new THREE.Vector3(0.3, 0.12, 0.95).normalize();
const SUN_SET = new THREE.Vector3(-0.5, -0.2, -0.85).normalize();

/** Shot times in the scope sequence: three magazines of ten, a six-second flight. */
const FIRE_TIMES: number[] = [];
const FIRING_STARTS = [209.0, 214.5, 219.5];
for (const start of FIRING_STARTS) for (let i = 0; i < 10; i++) FIRE_TIMES.push(start + i * 0.4);
const FLIGHT = 6.0;

/** The five rounds into the beef bundle, fired indoors. */
const UNDER_SHOTS = [117.0, 117.5, 118.0, 118.5, 119.0];

/** Suit grid indices: targets in the front row centre, two more casualties later. */
const TARGETS = [3, 4, 5];
const VICTIMS = [3, 4, 5, 12, 6];
const CRACK_AT: Record<number, number> = { 3: 215.0, 4: 220.5, 5: 225.5, 12: 221.2, 6: 226.0 };

/** Each victim's hit times: the target's ten rounds arrive a flight later. */
function hitTimesFor(index: number): number[] {
  if (index === 12) return [221.2];
  if (index === 6) return [226.0];
  const first = FIRING_STARTS[index - 3] ?? 215;
  return Array.from({ length: 10 }, (_, i) => first + FLIGHT + i * 0.4);
}

const HIT_TIMES: Array<{ index: number; time: number }> = VICTIMS.flatMap((index) =>
  hitTimesFor(index).map((time) => ({ index, time })),
);

/* ------------------------------------------------------------ helpers */

/** Piecewise camera track with eased segments between keys. */
function sampleCamera(time: number, keys: CameraKey[]): { pos: THREE.Vector3; look: THREE.Vector3; fov: number } {
  let i = 0;
  while (i < keys.length - 2 && time >= keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const k = easeInOutCubic(segmentProgress(time, a.t, b.t));
  const mix = (p: Vec3, q: Vec3) => new THREE.Vector3(lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2], q[2], k));
  return {
    pos: mix(a.pos, b.pos),
    look: mix(a.look, b.look),
    fov: lerp(a.fov ?? 40, b.fov ?? 40, k),
  };
}

function applyCamera(film: Film, keys: CameraKey[], time: number): void {
  const shot = sampleCamera(time, keys);
  film.camera.position.copy(shot.pos);
  film.camera.lookAt(shot.look);
  if (Math.abs(film.camera.fov - shot.fov) > 0.01) {
    film.camera.fov = shot.fov;
    film.camera.updateProjectionMatrix();
  }
}

/** Blend a gesture over a base pose by a 0..1 weight. */
function over(base: Pose, gesture: Pose, weight: number): Pose {
  return lerpPose(base, gesture, clamp01(weight));
}

/** Place a figure: feet at (x, y, z), turned to yaw radians about Y. */
function place(figure: Figure, x: number, y: number, z: number, yaw: number): void {
  figure.root.position.set(x, y, z);
  figure.root.rotation.set(0, yaw, 0);
}

/** Sum of recoil impulses from shots at `times`, decaying over about half a second. */
function kickAt(time: number, times: number[], decay = 9): number {
  let sum = 0;
  for (const shot of times) {
    const age = time - shot;
    if (age >= 0 && age < 0.5) sum += Math.exp(-age * decay);
  }
  return sum;
}

function setZhangDress(film: Film, key: Film["zhangDress"]): void {
  if (film.zhangDress === key) return;
  film.zhangDress = key;
  film.cast.zhang.setClothes(film.cast.zhangLooks[key]);
}

function setCard(film: Film, key: string, html: string, opacity: number, background: string): void {
  if (film.cardKey !== key) {
    film.card.innerHTML = html;
    film.cardKey = key;
  }
  film.card.style.display = opacity <= 0 ? "none" : "";
  film.card.style.opacity = String(clamp01(opacity));
  film.card.style.background = background;
}

const BACKGROUND: Record<Env, number> = {
  title: 0x000000,
  hutong: 0x1c2336,
  collector: 0x0d0907,
  lathe: 0x0e1218,
  underground: 0x0a0a0c,
  space: 0x000005,
  end: 0x000000,
};

function applyEnv(film: Film, env: Env): void {
  const s = film.sets;
  film.title.visible = env === "title";
  s.hutong.visible = env === "hutong";
  s.collector.visible = env === "collector";
  s.lathe.visible = env === "lathe";
  s.underground.visible = env === "underground";
  s.space.visible = env === "space";
  film.worldFlash.visible = false;
  film.particles.visible = false;
  film.scene.background = new THREE.Color(BACKGROUND[env]);
  film.scene.fog = env === "hutong" ? new THREE.Fog(BACKGROUND.hutong, 22, 80) : null;
  for (const figure of [film.cast.zhang, film.cast.collector, ...film.cast.suits]) figure.root.visible = false;
}

function setSun(film: Film, direction: THREE.Vector3, intensity: number): void {
  const s = film.sets;
  s.sunLight.position.copy(direction).multiplyScalar(1000);
  s.sunLight.intensity = intensity;
  s.sunGroup.position.copy(direction).multiplyScalar(6000);
  s.hemi.intensity = 0.35 + 0.25 * (intensity / 3);
}

/** A suit's position in the photograph, with a slow float drift. */
function suitPosition(index: number, time: number, out: THREE.Vector3): THREE.Vector3 {
  const row = Math.floor(index / SUIT_COLS), col = index % SUIT_COLS;
  const base = suitBase(row, col);
  return out.set(
    base.x + Math.sin(time * 0.31 + index) * 0.35,
    base.y + Math.sin(time * 0.5 + index * 1.3) * 0.25,
    base.z + Math.cos(time * 0.27 + index * 0.7) * 0.35,
  );
}

const tmp = new THREE.Vector3();
const basePos = new THREE.Vector3();
const awayDir = new THREE.Vector3();

/** Where a suit is at time `time`: emerging from the station door, floating in formation, then scattering. */
function suitAt(index: number, time: number, out: THREE.Vector3): THREE.Vector3 {
  if (time < 240) {
    suitPosition(index, time, basePos);
    const p = smoothstep(clamp01((time - (192 + index * 0.1)) / 3));
    return out.copy(DOOR).lerp(basePos, p);
  }
  suitPosition(index, 240, basePos);
  if (VICTIMS.includes(index)) {
    // Casualties are dragged back toward the station door by their crews.
    return out.copy(basePos).lerp(DOOR, smoothstep(clamp01((time - 240) / 14)));
  }
  awayDir.copy(basePos).sub(GROUP_CENTRE);
  awayDir.y = 0;
  awayDir.normalize();
  const spread = (1 - Math.exp(-(time - 240) * 0.35)) * 18;
  return out.copy(basePos).addScaledVector(awayDir, spread);
}

/** Clothing state a suit wears: the visor cracks at its first hit. */
function suitDressKey(index: number, time: number): string {
  const target = TARGETS.includes(index);
  const cracked = index in CRACK_AT && time >= CRACK_AT[index];
  if (cracked) return target ? "targetCracked" : "plainCracked";
  return target ? "target" : "plain";
}

function applySuitDress(film: Film, index: number, time: number): void {
  const key = suitDressKey(index, time);
  if (film.suitDress[index] === key) return;
  film.suitDress[index] = key;
  film.cast.suits[index].setClothes(film.cast.suitTextures[key as keyof Cast["suitTextures"]]);
}

/** Fire the rounds into the particle pool: a puff of ice and blood at each hit. */
function updateParticles(film: Film, time: number): void {
  const attribute = film.particles.geometry.getAttribute("position") as THREE.BufferAttribute;
  const colour = film.particles.geometry.getAttribute("color") as THREE.BufferAttribute;
  const perHit = 14;
  for (let e = 0; e < film.particleEvents.length; e++) {
    const event = film.particleEvents[e];
    const random = rng(event.seed);
    for (let p = 0; p < perHit; p++) {
      const index = e * perHit + p;
      const age = time - event.time;
      // Draw every random value first so the same particle always gets the same velocity.
      const vx = (random() * 2 - 1) * 1.1;
      const vy = random() * 1.0 + 0.2;
      const vz = -(0.8 + random() * 1.4);
      const red = random() < 0.3;
      if (age < 0 || age > 2.4) {
        attribute.setXYZ(index, 0, -1e5, 0);
        continue;
      }
      const travel = (1 - Math.exp(-2.2 * age)) / 2.2;
      attribute.setXYZ(
        index,
        event.origin.x + vx * travel,
        event.origin.y + vy * travel - 0.6 * age * age * 0.1,
        event.origin.z + vz * travel,
      );
      if (red) colour.setXYZ(index, 0.75, 0.16, 0.12);
      else colour.setXYZ(index, 0.95, 0.98, 1.0);
    }
  }
  attribute.needsUpdate = true;
  colour.needsUpdate = true;
}

/* ------------------------------------------------------------ shots */

function updateTitle(film: Film, time: number): void {
  film.titleRock.rotation.set(0.2, time * 0.12, 0.05);
  applyCamera(film, [{ t: 0, pos: [0, 0.2, 0], look: [0, 0, -6.5], fov: 40 }], time);
  const fade = 1 - smoothstep(clamp01((time - 5.0) / 1.8));
  setCard(
    film,
    "title",
    '<div class="card-main">三十六颗陨石</div><div class="card-sub">一部体素影片</div>',
    fade,
    "transparent",
  );
}

function updateHutong(film: Film, time: number): void {
  const { zhang, collector } = film.cast;
  collector.root.visible = false;
  for (const figure of film.cast.suits) figure.root.visible = false;

  // Walk up the lane to the gate, pass through it, then the lane is left behind.
  const arrive = smoothstep(clamp01((time - 9) / 17.5));
  let z = lerp(-27, -1.6, arrive);
  let base: Pose = idle(time);
  if (time >= 9 && time < 26.5) base = walk(time);
  if (time >= 27.0) {
    z = lerp(-1.6, 2.0, smoothstep((time - 27.0) / 2.6));
    base = walk(time);
  }
  zhang.root.visible = time < 29.4;
  setZhangDress(film, "uniform");
  place(zhang, -0.5, 0, z, 0);
  applyPose(zhang, base);

  // The gate door swings open for him and closes behind.
  const open = smoothstep(clamp01((time - 26.8) / 1.2));
  const close = smoothstep(clamp01((time - 29.0) / 1.0));
  film.sets.door.rotation.y = -1.5 * (open - close);

  applyCamera(
    film,
    [
      { t: 7, pos: [3.2, 2.4, -32], look: [-2.2, 1.5, -6] },
      { t: 18, pos: [2.6, 2.0, -22], look: [0, 1.6, -3] },
      { t: 26, pos: [1.6, 1.7, -9], look: [0, 1.5, -1] },
      { t: 30, pos: [1.0, 1.6, -4], look: [0, 1.5, 0.5] },
    ],
    time,
  );
}

function updateCollector(film: Film, time: number): void {
  const { zhang, collector } = film.cast;
  zhang.root.visible = true;
  collector.root.visible = true;
  for (const figure of film.cast.suits) figure.root.visible = false;
  setZhangDress(film, "uniform");

  const entering = smoothstep(clamp01((time - 30) / 4));
  place(zhang, 0, 0, lerp(6.5, 2.4, entering), Math.PI);
  // Zhang listens, then gestures while he argues the price.
  const zhangBase = idle(time);
  const talking = over(zhangBase, { armR: [-0.8, 0, 0.2], neck: [0.12, 0, 0] }, fadeEnvelope(time, 58, 68, 0.5, 0.5));
  applyPose(zhang, talking);

  // The collector holds the iron stone up for inspection, then sets the tray.
  place(collector, 0, 0, -1.6, 0);
  const pointing = over(idle(time), { armR: [-1.2, 0, 0.15], neck: [-0.1, 0, 0] }, fadeEnvelope(time, 62, 68, 0.6, 0.6));
  applyPose(collector, pointing);

  film.sets.trayStones.forEach((stone, index) => {
    stone.visible = time >= 67 + index * 0.6;
  });

  applyCamera(
    film,
    [
      { t: 30, pos: [-1.0, 1.65, 4.6], look: [0, 1.35, -0.8] },
      { t: 44, pos: [-0.4, 1.6, 4.0], look: [0.2, 1.35, -1.2] },
      { t: 52, pos: [1.3, 1.6, -0.4], look: [-0.3, 1.4, -1.6] },
      { t: 62, pos: [0.9, 1.9, 2.2], look: [-0.2, 1.4, -1.5] },
      { t: 66, pos: [0.5, 1.55, 1.4], look: [0.0, 1.0, -0.2] },
      { t: 76, pos: [0.4, 1.45, 1.6], look: [0.2, 1.0, -0.4] },
      { t: 84, pos: [-1.3, 1.7, 3.5], look: [0, 1.3, -1.2] },
      { t: 92, pos: [2.6, 2.0, 5.2], look: [0, 1.3, -1.0] },
    ],
    time,
  );
}

function updateLathe(film: Film, time: number): void {
  const { zhang } = film.cast;
  zhang.root.visible = true;
  for (const figure of [film.cast.collector, ...film.cast.suits]) figure.root.visible = false;
  setZhangDress(film, "uniform");
  place(zhang, -0.8, 0, -1.2, Math.PI / 2);
  const working: Pose = {
    ...idle(time),
    armR: [-0.9 + Math.sin(time * 3.1) * 0.06, 0, 0.15],
    armL: [-0.7, 0, -0.1],
    neck: [0.22, 0, 0],
  };
  applyPose(zhang, working);

  // Pellets fall out of the cut one by one onto the tray.
  const count = Math.max(0, Math.min(36, Math.floor((time - 96) / 0.27)));
  film.sets.lathePellets.forEach((pellet, index) => {
    pellet.visible = index < count;
  });

  // Sparks from the cutting point, animated from absolute time.
  const sparks = film.sets.latheSparks;
  sparks.visible = time >= 94 && time <= 104;
  if (sparks.visible) {
    const attribute = sparks.geometry.getAttribute("position") as THREE.BufferAttribute;
    const origin = new THREE.Vector3(2.9, 2.1, -1.7);
    for (let i = 0; i < attribute.count; i++) {
      const random = rng(i + 7);
      const age = ((time * 1.7 + i * 0.173) % 1 + 1) % 1;
      const vx = (random() * 2 - 1) * 1.6;
      const vy = 1.2 + random() * 1.8;
      const vz = (random() * 2 - 1) * 1.2;
      attribute.setXYZ(
        i,
        origin.x + vx * age,
        origin.y + vy * age - 4.9 * age * age,
        origin.z + vz * age,
      );
    }
    attribute.needsUpdate = true;
  }

  applyCamera(
    film,
    [
      { t: 92, pos: [-3.2, 2.0, 4.0], look: [0.9, 1.2, -1.0] },
      { t: 97, pos: [-2.6, 2.2, 3.6], look: [0.9, 1.3, -1.0] },
      { t: 101, pos: [2.6, 2.4, 1.2], look: [2.6, 1.5, -1.2] },
      { t: 103, pos: [4.6, 1.9, 0.2], look: [2.6, 1.8, -1.6] },
      { t: 106, pos: [-3.5, 2.4, 4.5], look: [1.0, 1.2, -1.0] },
    ],
    time,
  );
}

function updateUnderground(film: Film, time: number): void {
  const { zhang } = film.cast;
  zhang.root.visible = true;
  for (const figure of [film.cast.collector, ...film.cast.suits]) figure.root.visible = false;
  setZhangDress(film, "uniform");

  film.cast.pistol.visible = time >= 111;
  const turn = smoothstep(clamp01((time - 111) / 2));
  const yaw = lerp(Math.PI, 2.68, turn);
  place(zhang, 0, 0, 1.4, yaw);

  // Pliers at the table, then the pistol comes up for the shots.
  const pliers: Pose = {
    ...idle(time),
    armR: [-0.9 + Math.sin(time * 5.2) * 0.2, 0, 0.1],
    armL: [-0.7, 0, -0.1],
    neck: [0.3, 0, 0],
  };
  const raise = over(pliers, aim(0, 0), turn);
  const recoil = kickAt(time, UNDER_SHOTS, 10) * 0.5;
  const shotPose: Pose = { ...raise, armR: [(raise.armR?.[0] ?? 0) - recoil, 0, (raise.armR?.[2] ?? 0)] };
  applyPose(zhang, shotPose);

  // Bulb flicker, sparse muzzle flashes, and the five holes punched into the bundle.
  film.sets.bulbLight.intensity = 9 + Math.sin(time * 11.3) * 0.4 + Math.sin(time * 2.1) * 0.6;
  film.sets.bundleHoles.forEach((hole, index) => {
    hole.visible = time >= UNDER_SHOTS[index] + 0.02;
  });
  film.sets.shards.forEach((shard, index) => {
    shard.visible = time >= 120.5 + index * 0.08;
  });

  const lastShot = [...UNDER_SHOTS].reverse().find((t) => t <= time);
  const flashing = lastShot !== undefined && time - lastShot < 0.08;
  film.worldFlash.visible = flashing && time < 130;
  if (film.worldFlash.visible) {
    const muzzle = film.cast.pistol.getWorldPosition(new THREE.Vector3());
    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    film.worldFlash.position.copy(muzzle).addScaledVector(forward, 0.35);
    film.worldFlash.scale.setScalar(0.5);
  }

  applyCamera(
    film,
    [
      { t: 106, pos: [-1.2, 1.5, 4.0], look: [0.3, 1.0, -0.6] },
      { t: 111, pos: [-0.9, 1.4, 2.4], look: [0.2, 1.0, -0.8] },
      { t: 116, pos: [-1.6, 1.6, 2.6], look: [0.8, 1.3, -1.4] },
      { t: 121, pos: [0.4, 1.5, 0.6], look: [-0.5, 1.1, -1.0] },
      { t: 130, pos: [-2.6, 2.2, 3.2], look: [1.0, 1.2, -2.2] },
    ],
    time,
  );
}

function updateElevator(film: Film, time: number): void {
  setSun(film, SUN_EVENING, 3.0);
  applyCamera(
    film,
    [
      { t: 130, pos: [260, 880, 380], look: [0, 880, 0] },
      { t: 144, pos: [300, 1080, 430], look: [0, 1060, 0] },
    ],
    time,
  );
}

function updateBase(film: Film, time: number): void {
  const { zhang } = film.cast;
  zhang.root.visible = true;
  for (const figure of [film.cast.collector, ...film.cast.suits]) figure.root.visible = false;
  setZhangDress(film, "suit");
  place(zhang, ZHANG_SPACE_START.x, ZHANG_SPACE_START.y, ZHANG_SPACE_START.z, 0);

  // He reaches to his chest for the locator and seats it in the base's slot.
  const reach = fadeEnvelope(time, 145, 151, 1.0, 1.0);
  const reaching: Pose = { ...float(time), armR: [-1.5, 0, 0.3], neck: [0.5, 0, 0] };
  applyPose(zhang, over(float(time), reaching, reach));

  const locator = film.sets.locator;
  locator.visible = time >= 145;
  const chest = new THREE.Vector3(ZHANG_SPACE_START.x, ZHANG_SPACE_START.y + 1.2, ZHANG_SPACE_START.z + 0.3);
  const seat = smoothstep(clamp01((time - 146) / 5));
  locator.position.copy(chest).lerp(film.sets.baseSlot, seat);
  locator.rotation.set(0, time * 0.2, 0);

  applyCamera(
    film,
    [
      { t: 144, pos: [-268, 1106, 4], look: [-257, 1100, 26] },
      { t: 152, pos: [-270, 1104, 8], look: [-257, 1100, 28] },
      { t: 166, pos: [-276, 1108, 8], look: [-258, 1099, 22] },
    ],
    time,
  );
  setSun(film, SUN_EVENING, 3.0);
}

/** Quadratic Bezier between three points. */
function bezier(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, t: number, out: THREE.Vector3): THREE.Vector3 {
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * b.x + t * t * c.x,
    u * u * a.y + 2 * u * t * b.y + t * t * c.y,
    u * u * a.z + 2 * u * t * b.z + t * t * c.z,
  );
}

function updateFloat(film: Film, time: number): void {
  const { zhang } = film.cast;
  zhang.root.visible = true;
  for (const figure of [film.cast.collector, ...film.cast.suits]) figure.root.visible = false;
  setZhangDress(film, "suit");

  // Thrust out from the base along an arc; the suit tips back as it drifts.
  const u = easeInOutCubic(segmentProgress(time, 166, 190));
  const control = new THREE.Vector3(-150, 1132, 80);
  const position = bezier(ZHANG_SPACE_START, control, ZHANG_PHOTO, u, new THREE.Vector3());
  const ahead = bezier(ZHANG_SPACE_START, control, ZHANG_PHOTO, Math.min(1, u + 0.01), new THREE.Vector3());
  const heading = Math.atan2(ahead.x - position.x, ahead.z - position.z);
  place(zhang, position.x, position.y, position.z, heading);
  applyPose(zhang, float(time));

  setSun(film, SUN_EVENING.clone().lerp(SUN_PHOTO, smoothstep(clamp01((time - 166) / 24))).normalize(), lerp(3.0, 2.0, smoothstep(clamp01((time - 166) / 24))));

  // A slow orbit that keeps Zhang in frame with the curve of the Earth below.
  const theta = 0.9 + (time - 166) * 0.035;
  const centre = position.clone();
  applyCameraOrbit(film, centre, theta, 14);
}

/** Camera circling a drifting figure from just above, pitched down so the Earth's limb fills the lower frame. */
function applyCameraOrbit(film: Film, centre: THREE.Vector3, theta: number, radius: number): void {
  film.camera.position.set(centre.x + Math.sin(theta) * radius, centre.y + 4, centre.z + Math.cos(theta) * radius);
  film.camera.lookAt(centre.x, centre.y - 2.5, centre.z);
  if (Math.abs(film.camera.fov - 40) > 0.01) {
    film.camera.fov = 40;
    film.camera.updateProjectionMatrix();
  }
}

function updatePhoto(film: Film, time: number): void {
  const { zhang } = film.cast;
  zhang.root.visible = true;
  film.cast.collector.root.visible = false;
  setZhangDress(film, "suit");
  const toGroup = Math.atan2(GROUP_CENTRE.x - ZHANG_PHOTO.x, GROUP_CENTRE.z - ZHANG_PHOTO.z);
  place(zhang, ZHANG_PHOTO.x, ZHANG_PHOTO.y, ZHANG_PHOTO.z, toGroup);
  applyPose(zhang, lerpPose(float(time), idle(time), 0.6));
  film.cast.pistol.visible = time >= 196;

  // The station door opens without a sound: the vacuum carries nothing.
  film.sets.stationDoor.scale.y = Math.max(0.02, 1 - smoothstep(clamp01((time - 190) / 2)));

  film.cast.suits.forEach((figure, index) => {
    figure.root.visible = time >= 192;
    suitAt(index, time, tmp);
    figure.root.position.copy(tmp);
    figure.root.rotation.set(0, 0, 0);
    applyPose(figure, lerpPose(float(time + index * 0.31), idle(time + index), 0.25));
    applySuitDress(film, index, time);
  });

  setSun(film, SUN_PHOTO, 2.0);
  applyCamera(
    film,
    [
      { t: 190, pos: [120, 1104, 470], look: [0, 1076, 300] },
      { t: 206, pos: [70, 1098, 420], look: [0, 1078, 300] },
    ],
    time,
  );
}

function updateScope(film: Film, time: number): void {
  hideZhang(film);
  setSun(film, SUN_PHOTO, 2.0);
  const { cast } = film;
  cast.suits.forEach((figure, index) => {
    figure.root.visible = true;
    suitAt(index, time, tmp);
    figure.root.position.copy(tmp);
    figure.root.rotation.set(0, 0, 0);
    applyPose(figure, lerpPose(float(time + index * 0.31), idle(time + index), 0.25));
    applySuitDress(film, index, time);
  });

  // Scope: the lens is at Zhang's eye, looking through the sight.
  const eye = new THREE.Vector3(ZHANG_PHOTO.x, ZHANG_PHOTO.y + 1.55, ZHANG_PHOTO.z).add(
    new THREE.Vector3(Math.sin(time * 1.3) * 0.002, Math.sin(time * 0.9) * 0.002, 0),
  );
  const target = (index: number) => suitPosition(index, time, new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0));
  const look = trackVector(time, [
    { t: 206, v: GROUP_CENTRE.clone() },
    { t: 208.5, v: target(3) },
    { t: 213.8, v: target(3) },
    { t: 214.9, v: target(4) },
    { t: 218.4, v: target(4) },
    { t: 219.8, v: target(5) },
    { t: 240, v: target(5) },
  ]);
  const kick = kickAt(time, FIRE_TIMES, 10) * 0.35;
  look.y += kick;

  // Lift the pistol to the eye, zoom to scope power, then pull back.
  const zoomIn = smoothstep(clamp01((time - 206) / 2.2));
  const zoomOut = smoothstep(clamp01((time - 233) / 6));
  const fov = time < 233 ? lerp(40, 7, zoomIn) : lerp(7, 40, zoomOut);
  film.camera.position.copy(eye);
  film.camera.lookAt(look);
  if (Math.abs(film.camera.fov - fov) > 0.01) {
    film.camera.fov = fov;
    film.camera.updateProjectionMatrix();
  }

  // The scope mask: a black ring and crosshair in camera space, sized to the field of view.
  const h = 0.3 * Math.tan(THREE.MathUtils.degToRad(fov / 2));
  film.sets.scope.visible = fov < 12;
  film.sets.scopeRing.scale.setScalar(h);
  film.sets.scopeReticle.scale.setScalar(h);
  film.sets.muzzle.visible = FIRE_TIMES.some((shot) => time >= shot && time < shot + 0.07);
  film.sets.muzzle.scale.setScalar(0.04);
  film.sets.muzzle.position.set(0, -0.012, 0);

  film.particles.visible = true;
  updateParticles(film, time);
}

/** Piecewise linear track over vectors, eased within each segment. */
function trackVector(time: number, keys: Array<{ t: number; v: THREE.Vector3 }>): THREE.Vector3 {
  let i = 0;
  while (i < keys.length - 2 && time >= keys[i + 1].t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const k = easeInOutCubic(segmentProgress(time, a.t, b.t));
  return new THREE.Vector3().copy(a.v).lerp(b.v, k);
}

function hideZhang(film: Film): void {
  film.cast.zhang.root.visible = false;
  film.cast.collector.root.visible = false;
}

function updateAftermath(film: Film, time: number): void {
  const { zhang } = film.cast;
  zhang.root.visible = true;
  setZhangDress(film, "suit");
  film.cast.pistol.visible = true;
  const drift = smoothstep(clamp01((time - 246) / 16));
  const position = new THREE.Vector3().copy(ZHANG_PHOTO).lerp(ZHANG_ALONE, drift);
  place(zhang, position.x, position.y, position.z, Math.atan2(GROUP_CENTRE.x - ZHANG_PHOTO.x, GROUP_CENTRE.z - ZHANG_PHOTO.z));
  applyPose(zhang, float(time));

  film.cast.suits.forEach((figure, index) => {
    figure.root.visible = true;
    suitAt(index, time, tmp);
    figure.root.position.copy(tmp);
    figure.root.rotation.set(0, 0, 0);
    applyPose(figure, lerpPose(float(time + index * 0.31), idle(time + index), 0.25));
    applySuitDress(film, index, time);
  });

  setSun(film, SUN_PHOTO.clone().lerp(SUN_SET, smoothstep(clamp01((time - 240) / 24))).normalize(), lerp(2.0, 1.2, smoothstep(clamp01((time - 240) / 24))));
  film.sets.muzzle.visible = false;
  film.particles.visible = true;
  updateParticles(film, time);
  applyCamera(
    film,
    [
      { t: 240, pos: [150, 1118, 430], look: [0, 1078, 300] },
      { t: 264, pos: [70, 1104, 400], look: [-40, 1080, 280] },
    ],
    time,
  );
}

function updateAlone(film: Film, time: number): void {
  const { zhang } = film.cast;
  zhang.root.visible = true;
  setZhangDress(film, "suit");
  film.cast.pistol.visible = false;
  const drift = new THREE.Vector3(Math.sin(time * 0.05) * 4, Math.sin(time * 0.07) * 1.0, Math.cos(time * 0.05) * 2);
  const position = new THREE.Vector3().copy(ZHANG_ALONE).add(drift);
  place(zhang, position.x, position.y, position.z, 1.2);
  applyPose(zhang, float(time));

  setSun(film, SUN_SET, lerp(1.2, 0.6, smoothstep(clamp01((time - 264) / 38))));
  applyCamera(
    film,
    [
      { t: 264, pos: [-150, 1126, 200], look: [-210, 1127, 142] },
      { t: 302, pos: [-300, 1190, 320], look: [-200, 1110, 100] },
    ],
    time,
  );
  const fade = smoothstep(clamp01((time - 292) / 10));
  setCard(film, "fade", "", fade, "#000");
}

function updateEnd(film: Film, time: number): void {
  const fade = smoothstep(clamp01((time - 302) / 2));
  setCard(
    film,
    "end",
    '<div class="card-main">陨石</div><div class="card-sub">— 完 —</div>',
    fade,
    "#000",
  );
}

/* ------------------------------------------------------------ build */

export function createFilm(scene: THREE.Scene, camera: THREE.PerspectiveCamera, sets: Sets, cast: Cast, card: HTMLElement): Film {
  // Title: a single voxel meteorite under a warm key light.
  const title = new THREE.Group();
  title.name = "title";
  const rock = rockCanvas(9, [0x2b2623, 0x3b3530, 0x55493f, 0x8a8175, 0x4a4d52], 3, 0.25).mesh(0.2, VOXEL_MATERIAL, true);
  rock.position.set(1.4, 0, -6.5);
  title.add(rock);
  const key = new THREE.DirectionalLight(0xffe4b8, 2.4);
  key.position.set(3, 4, -2);
  const fill = new THREE.HemisphereLight(0x6d7fa8, 0x140f0a, 0.6);
  title.add(key, key.target, fill);
  key.target.position.set(1.4, 0, -6.5);
  scene.add(title);

  // Hit puffs: a pool of points, positioned from absolute time.
  const events: HitEvent[] = HIT_TIMES.map(({ index, time }, n) => {
    suitPosition(index, time, tmp);
    return { time, origin: tmp.clone().add(new THREE.Vector3(0.1, 0.5, -0.2)), seed: 1000 + n * 17 };
  });
  const count = events.length * 14;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3).fill(1), 3));
  const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ size: 0.16, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false }),
  );
  particles.visible = false;
  scene.add(particles);

  const flashCanvas = document.createElement("canvas");
  flashCanvas.width = flashCanvas.height = 64;
  const ctx = flashCanvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,230,180,0.8)");
  gradient.addColorStop(1, "rgba(255,190,110,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const worldFlash = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(flashCanvas),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  }));
  worldFlash.visible = false;
  scene.add(worldFlash);

  return {
    scene,
    camera,
    sets,
    cast,
    title,
    titleRock: rock,
    particles,
    particleEvents: events,
    worldFlash,
    card,
    cardKey: "",
    zhangDress: "uniform",
    suitDress: [],
  };
}

export function buildShots(film: Film): Shot<Film>[] {
  const shot = (
    id: string,
    [start, end]: readonly [number, number],
    env: Env,
    update: (f: Film, t: number) => void,
  ): Shot<Film> => ({
    id,
    start,
    end,
    enter: ({ context }) => applyEnv(context, env),
    update: ({ context, time }) => update(context, time),
  });
  void film;
  return [
    shot("title", TIMES.title, "title", updateTitle),
    shot("hutong", TIMES.hutong, "hutong", updateHutong),
    shot("collector", TIMES.collector, "collector", updateCollector),
    shot("lathe", TIMES.lathe, "lathe", updateLathe),
    shot("underground", TIMES.underground, "underground", updateUnderground),
    shot("elevator", TIMES.elevator, "space", updateElevator),
    shot("base", TIMES.base, "space", updateBase),
    shot("float", TIMES.float, "space", updateFloat),
    shot("photo", TIMES.photo, "space", updatePhoto),
    shot("scope", TIMES.scope, "space", updateScope),
    shot("aftermath", TIMES.aftermath, "space", updateAftermath),
    shot("alone", TIMES.alone, "space", updateAlone),
    shot("end", TIMES.end, "end", updateEnd),
  ];
}
