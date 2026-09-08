import * as THREE from "three";
import { CameraRig } from "../lib/cameraRig";
import { VoxelActor, makePistol } from "../art/characters";
import { PAL, SKIN } from "../lib/materials";
import { Effects } from "./fx";
import type { EnvState, World } from "./types";
import type { SetHandle } from "../sets/shared";
import { councilSet, corridorSet } from "../sets/act1";
import { marketSet, workshopSet } from "../sets/act2";
import { basementSet } from "../sets/act3";
import { labSet, reviewSet } from "../sets/act4";
import { modelshopSet, spaceSet, teststandSet } from "../sets/act5";

/** Each set lives in its own pocket of the scene so only one is ever lit. */
export const ORIGINS: Record<string, THREE.Vector3> = {
  space: new THREE.Vector3(0, 0, 0),
  council: new THREE.Vector3(320, 0, 0),
  corridor: new THREE.Vector3(640, 0, 0),
  market: new THREE.Vector3(960, 0, 0),
  workshop: new THREE.Vector3(1280, 0, 0),
  basement: new THREE.Vector3(1600, 0, 0),
  lab: new THREE.Vector3(1920, 0, 0),
  review: new THREE.Vector3(2240, 0, 0),
  modelshop: new THREE.Vector3(2560, 0, 0),
  teststand: new THREE.Vector3(2880, 0, 0)
};

export function at(set: string, x: number, y: number, z: number, out = new THREE.Vector3()): THREE.Vector3 {
  const o = ORIGINS[set] ?? ORIGINS.council;
  return out.set(o.x + x, y, o.z + z);
}

export interface Cast {
  zhang: VoxelActor;
  old1: VoxelActor;
  old2: VoxelActor;
  old3: VoxelActor;
  vendor: VoxelActor;
  smith: VoxelActor;
  investigator: VoxelActor;
  delegateA: VoxelActor;
  delegateB: VoxelActor;
  chair: VoxelActor;
  guard: VoxelActor;
  [k: string]: VoxelActor;
}

export interface FilmWorld extends World {
  cast: Cast;
  effects: Effects;
  showSet(id: string | null): void;
  activeSet: string | null;
  /** test-stand plume accessor */
  plume(): import("./fx").FlamePlume | null;
  applyEnv(env: Partial<EnvState>, instant?: boolean): void;
  /** Zhang's pistol, parented to his right hand and hidden until needed */
  pistol: THREE.Group;
}

function buildCast(scene: THREE.Scene): Cast {
  const mk = (cfg: ConstructorParameters<typeof VoxelActor>[0], name: string): VoxelActor => {
    const a = new VoxelActor(cfg);
    a.root.name = `actor:${name}`;
    scene.add(a.root);
    return a;
  };
  const oldCoat = 0x4a5666;
  const cast: Cast = {
    zhang: mk(
      { name: "zhang", height: 1.83, build: 0.92, skin: SKIN.light, hair: 0x12100e, hairStyle: "short", coat: PAL.navy, coatAccent: 0x35506e, trousers: 0x1a1f26, shirt: 0xcdd6dd, tie: 0x22303f, epaulettes: true },
      "zhang"
    ),
    old1: mk({ name: "old1", height: 1.74, build: 1.12, skin: SKIN.tan, hair: 0xcfd2d4, hairStyle: "grey", coat: oldCoat, coatAccent: 0x555f6a, trousers: 0x2a2e33, shirt: 0xcdd6dd, tie: 0x3a4450, glasses: true, stoop: 0.14, epaulettes: true }, "old1"),
    old2: mk({ name: "old2", height: 1.7, build: 1.06, skin: SKIN.mid, hair: 0xdadde0, hairStyle: "grey", coat: 0x424a54, coatAccent: 0x5a646e, trousers: 0x2a2e33, shirt: 0xcdd6dd, tie: 0x2f3842, glasses: true, stoop: 0.18, epaulettes: true }, "old2"),
    old3: mk({ name: "old3", height: 1.68, build: 1.0, skin: SKIN.pale, hair: 0xd0d3d6, hairStyle: "grey", coat: 0x353d47, coatAccent: 0x4d5762, trousers: 0x2a2e33, shirt: 0xcdd6dd, tie: 0x3a4450, glasses: false, stoop: 0.1, beard: true, epaulettes: true }, "old3"),
    vendor: mk({ name: "vendor", height: 1.7, build: 1.15, skin: SKIN.tan, hair: 0x2a1f16, hairStyle: "short", coat: 0x6a5a3a, coatAccent: 0x8a7a5a, trousers: 0x3a342a, shirt: 0x9a8f7a }, "vendor"),
    smith: mk({ name: "smith", height: 1.71, build: 1.18, skin: SKIN.tan, hair: 0x9a9a9a, hairStyle: "grey", coat: 0x4a3a28, coatAccent: 0x6a5a3a, trousers: 0x2e2a24, shirt: 0x8a8272, stoop: 0.12, beard: true }, "smith"),
    investigator: mk({ name: "investigator", height: 1.76, build: 0.98, skin: SKIN.light, hair: 0x1a1a1a, hairStyle: "short", coat: 0xdce4e8, coatAccent: 0xc4ced4, trousers: 0x2a3036, shirt: 0xffffff, tie: 0x3a6a8a }, "investigator"),
    delegateA: mk({ name: "delegateA", height: 1.72, build: 1.1, skin: SKIN.mid, hair: 0x2a2a2a, hairStyle: "short", coat: 0x2a3340, coatAccent: 0x3a4a5a, trousers: 0x22262b, shirt: 0xcdd6dd, tie: 0x3a4450 }, "delegateA"),
    delegateB: mk({ name: "delegateB", height: 1.68, build: 1.04, skin: SKIN.pale, hair: 0x3a2a1a, hairStyle: "bun", coat: 0x3a3540, coatAccent: 0x4a4550, trousers: 0x22262b, shirt: 0xd8dde2 }, "delegateB"),
    chair: mk({ name: "chair", height: 1.78, build: 1.0, skin: SKIN.light, hair: 0xcfd2d4, hairStyle: "grey", coat: 0x2a3340, coatAccent: 0x4a6a8a, trousers: 0x22262b, shirt: 0xcdd6dd, tie: 0x3a4450, glasses: true }, "chair"),
    guard: mk({ name: "guard", height: 1.8, build: 1.08, skin: SKIN.mid, hair: 0x14100d, hairStyle: "short", coat: 0x1f262e, coatAccent: 0x2f3a46, trousers: 0x1a1f26, shirt: 0x8a929a, hat: true }, "guard")
  };
  // start hidden; shots place them
  for (const k of Object.keys(cast)) cast[k].root.visible = false;
  return cast;
}

export function buildWorld(): FilmWorld {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.05, 2600);
  const rig = new CameraRig();
  const effects = new Effects();
  scene.add(effects.root);

  const sets: Record<string, SetHandle> = {
    space: spaceSet(),
    council: councilSet(),
    corridor: corridorSet(),
    market: marketSet(),
    workshop: workshopSet(),
    basement: basementSet(),
    lab: labSet(),
    review: reviewSet(),
    modelshop: modelshopSet(),
    teststand: teststandSet()
  };
  for (const key of Object.keys(sets)) {
    const s = sets[key];
    s.root.position.copy(ORIGINS[key]);
    s.root.visible = false;
    scene.add(s.root);
  }

  const cast = buildCast(scene);

  // the meteorite-bullet pistol: built once, parented to Zhang's right hand
  const pistol = makePistol();
  pistol.position.set(0, -0.055, 0.03);
  pistol.rotation.x = Math.PI / 2;
  pistol.visible = false;
  cast.zhang.handR.add(pistol);

  scene.fog = new THREE.FogExp2(0x05070a, 0.02);
  scene.background = new THREE.Color(0x05070a);

  const env: EnvState = { bg: new THREE.Color(0x05070a), fog: new THREE.Color(0x05070a), fogDensity: 0.02, exposure: 1.0, bloom: 0.55 };
  const envTarget: EnvState = { ...env, bg: env.bg.clone(), fog: env.fog.clone() };

  let active: string | null = null;

  const world: FilmWorld = {
    scene,
    camera,
    rig,
    sets,
    actors: cast,
    cast,
    effects,
    fx: effects,
    pistol,
    env,
    time: 0,
    dt: 0,
    activeSet: null,
    showSet(id: string | null) {
      if (active === id) return;
      for (const key of Object.keys(sets)) sets[key].root.visible = key === id;
      active = id;
      world.activeSet = id;
    },
    plume() {
      const s = sets.teststand as SetHandle & { plume?: import("./fx").FlamePlume };
      return s.plume ?? null;
    },
    applyEnv(e: Partial<EnvState>, instant = false) {
      if (e.bg !== undefined) envTarget.bg.copy(e.bg);
      if (e.fog !== undefined) envTarget.fog.copy(e.fog);
      if (e.fogDensity !== undefined) envTarget.fogDensity = e.fogDensity;
      if (e.exposure !== undefined) envTarget.exposure = e.exposure;
      if (e.bloom !== undefined) envTarget.bloom = e.bloom;
      if (instant) {
        env.bg.copy(envTarget.bg);
        env.fog.copy(envTarget.fog);
        env.fogDensity = envTarget.fogDensity;
        env.exposure = envTarget.exposure;
        env.bloom = envTarget.bloom;
      }
    },
    tick(time: number, dt: number) {
      // environment easing
      const k = 1 - Math.exp(-dt * 2.2);
      env.bg.lerp(envTarget.bg, k);
      env.fog.lerp(envTarget.fog, k);
      env.fogDensity += (envTarget.fogDensity - env.fogDensity) * k;
      env.exposure += (envTarget.exposure - env.exposure) * k;
      env.bloom += (envTarget.bloom - env.bloom) * k;
      if (scene.background instanceof THREE.Color) scene.background.copy(env.bg);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(env.fog);
        scene.fog.density = env.fogDensity;
      }
      for (const key of Object.keys(sets)) {
        if (sets[key].root.visible) sets[key].update?.(time, dt);
      }
      for (const key of Object.keys(cast)) cast[key].update(time, dt);
      effects.update(time, dt);
      rig.update(camera, time, dt);
    }
  };

  return world;
}
