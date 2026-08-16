import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  type Shot,
  type ShotFrame,
  type ThreeRendererLike,
} from "@agentbench/cinematic-player";
import { applyPose, aim, float, idle, lerpPose, walk, type Figure, type Pose } from "@agentbench/voxel-kit";
import { buildCast, dressZhang, type Cast } from "./characters";
import { buildWorld, type World } from "./sets";
import { configureAudio } from "./audio-design";
import { voiceCues, soundCues, FIRE_TIMES } from "./cues";
import { pistolProp, voxelRock } from "./props";

const DURATION = 348;

type V3 = [number, number, number];

interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  world: World;
  cast: Cast;
  fade: number;
  title: number;
  scope: number;
  titleRock: THREE.Mesh;
  pistol: THREE.Group;
  pistolMuzzle: THREE.Group;
}

const lerpV3 = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

interface CamKey {
  at: number;
  pos: V3;
  look: V3;
  fov?: number;
}

function runCam(cam: THREE.PerspectiveCamera, keys: CamKey[], p: number, shake = 0): void {
  if (keys.length === 0) return;
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1]!.at <= p) i += 1;
  const a = keys[i]!;
  const b = keys[Math.min(i + 1, keys.length - 1)]!;
  const span = Math.max(1e-4, b.at - a.at);
  const t = THREE.MathUtils.clamp((p - a.at) / span, 0, 1);
  const e = t * t * (3 - 2 * t);
  const pos = lerpV3(a.pos, b.pos, e);
  const look = lerpV3(a.look, b.look, e);
  const fa = a.fov ?? cam.fov;
  const fb = b.fov ?? fa;
  const fov = fa + (fb - fa) * e;
  cam.position.set(pos[0] + (shake ? Math.sin(p * 71.3) * shake : 0), pos[1] + (shake ? Math.sin(p * 83.7 + 1.3) * shake : 0), pos[2]);
  cam.lookAt(new THREE.Vector3(look[0], look[1], look[2]));
  if (Math.abs(cam.fov - fov) > 0.001) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }
}

function place(fig: Figure, x: number, y: number, z: number, ry = 0): void {
  fig.root.visible = true;
  fig.root.position.set(x, y, z);
  fig.root.rotation.y = ry;
}

function hideCast(cast: Cast): void {
  cast.zhang.root.visible = false;
  cast.collector.root.visible = false;
  cast.chang.root.visible = false;
  cast.father.root.visible = false;
  for (const f of cast.crowd) f.root.visible = false;
}

function hideAllSets(world: World): void {
  world.sets.shop.visible = false;
  world.sets.office.visible = false;
  world.sets.workshop.visible = false;
  world.sets.basement.visible = false;
  world.sets.space.visible = false;
  world.sets.memory.visible = false;
}

function setSpaceMain(world: World, visible: boolean): void {
  world.earth.visible = visible;
  world.sun.visible = visible;
  world.sunLight.visible = visible;
  world.station.visible = visible;
  world.baseStation.visible = visible;
  world.elevatorCable.visible = visible;
  for (const d of world.debris) d.visible = visible;
}

/** 把 30 颗弹道子弹的目标点分布到合影人群附近（5 个命中 + 其余偏斜）。 */
function tracerTargets(): V3[] {
  const targets: V3[] = [];
  for (let i = 0; i < 30; i += 1) {
    const mag = Math.floor(i / 10);
    const idx = i % 10;
    const row = mag === 0 ? 0 : 1 + (idx % 2);
    const x = (idx - 4.5) * 0.8 + (mag - 1) * 0.3;
    const z = 251 + row * 1.6 + Math.sin(i) * 0.5;
    targets.push([x, 5.6 + row * 0.5 + (idx % 3) * 0.2, z]);
  }
  return targets;
}

const TRACER_TARGETS = tracerTargets();

function build(): void {
  const container = document.querySelector<HTMLElement>("#stage")!;
  const fadeEl = document.querySelector<HTMLElement>("#fade-layer")!;
  const titleEl = document.querySelector<HTMLElement>("#title-card")!;
  const scopeEl = document.querySelector<HTMLElement>("#scope-overlay")!;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 3000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const cast = buildCast(scene);
  const world = buildWorld(scene, cast);

  const fatherGlow = new THREE.PointLight(0xffc890, 22, 9, 1.5);
  fatherGlow.position.set(0, 1.6, 0.9);
  cast.father.root.add(fatherGlow);

  const titleRock = voxelRock(7, 12, 0.12);
  titleRock.visible = false;
  scene.add(titleRock);

  const pistol = pistolProp();
  const handPistol = new THREE.Group();
  handPistol.add(pistol);
  handPistol.scale.setScalar(1 / cast.zhang.root.scale.x);
  cast.zhang.anchors.handR.add(handPistol);
  const pistolMuzzle = new THREE.Group();
  const muzzleCore = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.09, 0.09),
    new THREE.MeshBasicMaterial({ color: 0xfff2c0 }),
  );
  const muzzleLight = new THREE.PointLight(0xffb45e, 0, 3, 1.5);
  pistolMuzzle.add(muzzleCore, muzzleLight);
  pistolMuzzle.position.set(0, 0, 0.16);
  pistol.add(pistolMuzzle);
  pistolMuzzle.visible = false;
  handPistol.visible = false;

  const ctx: FilmContext = { scene, camera, world, cast, fade: 1, title: 1, scope: 0, titleRock, pistol: handPistol, pistolMuzzle };

  // ───────────────────────────────────────────────────────────────
  // 镜头
  // ───────────────────────────────────────────────────────────────
  const shots: Shot<FilmContext>[] = [];

  // 片头：黑暗中一块陨石。
  shots.push({
    id: "s_title",
    start: 0,
    end: 12,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      setSpaceMain(context.world, false);
      context.world.sets.space.visible = true;
      context.titleRock.visible = true;
      context.titleRock.position.set(0, 0, -6);
      context.titleRock.rotation.set(0.6, 0, 0.2);
      context.fade = 1;
      context.title = 1;
    },
    update: ({ context, localTime, progress }) => {
      const t = localTime;
      context.fade = 1;
      context.title = 1 - THREE.MathUtils.clamp((t - 9.0) / 2.4, 0, 1);
      context.titleRock.rotation.y = 0.2 + t * 0.12;
      context.titleRock.rotation.x = 0.6 + Math.sin(t * 0.4) * 0.1;
      runCam(context.camera, [
        { at: 0, pos: [0, 0.3, 2.4], look: [0, 0.4, -6], fov: 34 },
        { at: 1, pos: [1.4, 0.5, 1.2], look: [0, 0.2, -6], fov: 30 },
      ], progress);
    },
    leave: ({ context }) => {
      context.titleRock.visible = false;
      context.world.sets.space.visible = false;
      context.title = 0;
    },
  });

  // 老宅：章北海进门。
  shots.push({
    id: "s_shop_entry",
    start: 12,
    end: 30,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      setSpaceMain(context.world, true);
      context.world.sets.shop.visible = true;
      dressZhang(context.cast.zhang, "uniform");
      place(context.cast.zhang, 5.6, 0, 1.7, -Math.PI / 2);
      place(context.cast.collector, 0.6, 0, -0.6, Math.PI / 2);
      context.pistol.visible = false;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const col = context.cast.collector;
      const walkT = THREE.MathUtils.clamp(localTime / 3.4, 0, 1);
      const e = walkT * walkT * (3 - 2 * walkT);
      zhang.root.position.set(5.6 - 3.0 * e, 0, 1.7 - 1.3 * e);
      zhang.root.rotation.y = -Math.PI / 2;
      applyPose(zhang, walkT < 0.999 ? walk(zhang.root.position.x * 6) : idle(zhang.root.position.x * 3));
      applyPose(col, idle(localTime + 2));
      runCam(context.camera, [
        { at: 0, pos: [4.6, 2.1, 3.6], look: [1.6, 1.3, -0.4], fov: 44 },
        { at: 0.35, pos: [3.6, 1.7, 2.2], look: [1.6, 1.3, -0.4], fov: 40 },
        { at: 1, pos: [3.0, 1.65, 1.4], look: [1.1, 1.35, -0.5], fov: 38 },
      ], progress);
    },
    leave: ({ context }) => {
      context.world.sets.shop.visible = false;
      hideCast(context.cast);
    },
  });

  // 老宅：火星陨石与"地球也是陨石"。
  shots.push({
    id: "s_shop_martian",
    start: 30,
    end: 52,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.shop.visible = true;
      dressZhang(context.cast.zhang, "uniform");
      place(context.cast.zhang, 4.3, 0, 1.6, -Math.PI * 0.7);
      place(context.cast.collector, 3.4, 0, 1.1, Math.PI * 0.6);
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const col = context.cast.collector;
      const turnT = THREE.MathUtils.clamp(localTime / 3, 0, 1);
      const e = turnT * turnT * (3 - 2 * turnT);
      zhang.root.position.set(4.3 - 0.5 * e, 0, 1.6 + 0.3 * e);
      col.root.position.set(3.4 + 0.3 * e, 0, 1.1 + 0.4 * e);
      zhang.root.rotation.y = -Math.PI * 0.7 + 0.2 * e;
      col.root.rotation.y = Math.PI * 0.6 - 0.4 * e;
      const present: Pose = { armR: [-1.0, 0.5, 0.15], armL: [-0.25, 0, -0.1] };
      applyPose(col, lerpPose(idle(localTime + 2), present, THREE.MathUtils.clamp(localTime / 2, 0, 1)));
      applyPose(zhang, idle(localTime + 1));
      runCam(context.camera, [
        { at: 0, pos: [3.0, 1.7, 1.5], look: [1.4, 1.3, -0.4], fov: 40 },
        { at: 0.5, pos: [3.9, 1.6, 2.4], look: [4.2, 1.2, 1.2], fov: 36 },
        { at: 1, pos: [4.4, 1.45, 1.1], look: [4.6, 1.1, 1.2], fov: 32 },
      ], progress);
    },
    leave: ({ context }) => {
      context.world.sets.shop.visible = false;
      hideCast(context.cast);
    },
  });

  // 老宅：铁陨石成交。
  shots.push({
    id: "s_shop_deal",
    start: 52,
    end: 86,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.shop.visible = true;
      dressZhang(context.cast.zhang, "uniform");
      place(context.cast.zhang, 0.9, 0, -2.2, -Math.PI * 0.5);
      place(context.cast.collector, -0.9, 0, -2.6, Math.PI * 0.5);
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const col = context.cast.collector;
      zhang.root.rotation.y = -Math.PI * 0.5;
      col.root.rotation.y = Math.PI * 0.5;
      const hold: Pose = { armR: [-1.05, 0.1, 0.1], armL: [-0.3, 0, -0.1] };
      const gesture: Pose = { armR: [-0.7, 0.4, 0.2], armL: [-0.2, 0, -0.1] };
      applyPose(zhang, lerpPose(idle(localTime + 1), hold, THREE.MathUtils.clamp((localTime - 4) / 2, 0, 1)));
      applyPose(col, lerpPose(idle(localTime + 3), gesture, THREE.MathUtils.clamp((localTime - 2) / 2, 0, 1)));
      const camKeys: CamKey[] = [
        { at: 0, pos: [1.6, 1.7, -0.8], look: [0, 1.4, -2.5], fov: 38 },
        { at: 0.45, pos: [1.1, 1.6, -0.6], look: [0, 1.4, -2.5], fov: 34 },
        { at: 0.75, pos: [0.4, 1.62, -0.9], look: [0.85, 1.55, -2.3], fov: 26 },
        { at: 1, pos: [0.35, 1.6, -1.1], look: [0.85, 1.6, -2.2], fov: 24 },
      ];
      runCam(context.camera, camKeys, progress);
    },
    leave: ({ context }) => {
      context.world.sets.shop.visible = false;
      hideCast(context.cast);
    },
  });

  // 未来：太空电梯与黄河站。
  shots.push({
    id: "s_elevator",
    start: 86,
    end: 104,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      context.world.sun.visible = true;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const w = context.world;
      // 缓慢推近黄河站。
      runCam(context.camera, [
        { at: 0, pos: [-30, 14, 180], look: [0, 6, 260], fov: 46 },
        { at: 0.6, pos: [-14, 12, 210], look: [0, 6, 260], fov: 40 },
        { at: 1, pos: [6, 10, 232], look: [0, 6, 260], fov: 34 },
      ], progress);
      w.station.rotation.y = localTime * 0.02;
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      setSpaceMain(context.world, true);
    },
  });

  // 未来：常伟思的任命。
  shots.push({
    id: "s_office",
    start: 104,
    end: 132,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.office.visible = true;
      dressZhang(context.cast.zhang, "uniform");
      place(context.cast.zhang, 0.7, 0, 1.9, -Math.PI * 0.7);
      place(context.cast.chang, -0.5, 0, 0.6, Math.PI * 0.6);
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const chang = context.cast.chang;
      applyPose(zhang, idle(localTime + 1));
      applyPose(chang, idle(localTime + 4));
      runCam(context.camera, [
        { at: 0, pos: [1.7, 1.8, 3.4], look: [0, 1.4, 1.0], fov: 40 },
        { at: 0.5, pos: [0.6, 1.75, 2.7], look: [0.1, 1.4, 1.2], fov: 36 },
        { at: 1, pos: [0.4, 1.7, 2.2], look: [0.1, 1.4, 1.2], fov: 32 },
      ], progress);
      zhang.root.rotation.y = -Math.PI * 0.7 + Math.sin(localTime * 0.3) * 0.04;
    },
    leave: ({ context }) => {
      context.world.sets.office.visible = false;
      hideCast(context.cast);
    },
  });

  // 制作：车间切割。
  shots.push({
    id: "s_workshop",
    start: 132,
    end: 158,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.workshop.visible = true;
      dressZhang(context.cast.zhang, "uniform");
      place(context.cast.zhang, 0.4, 0, 1.6, -Math.PI * 0.6);
      context.world.workpiece.visible = true;
      context.world.cylTray.visible = true;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const work: Pose = { armR: [-0.8, 0.1, 0.2], armL: [-0.5, 0, -0.1], neck: [-0.2, 0, 0] };
      applyPose(zhang, lerpPose(idle(localTime + 1), work, THREE.MathUtils.clamp(localTime / 2, 0, 1)));
      context.world.latheChuck.rotation.z = localTime * 6;
      const bob = Math.sin(localTime * 0.7) * 0.02;
      runCam(context.camera, [
        { at: 0, pos: [2.2, 1.9, 2.6], look: [0, 1.1, 0.4], fov: 40 },
        { at: 0.35, pos: [1.1, 1.5, 1.9], look: [-0.5, 1.1, 0.4], fov: 32 },
        { at: 0.7, pos: [0.6, 1.35, 0.9], look: [-0.5, 1.15, 0.42], fov: 26 },
        { at: 1, pos: [0.4, 1.3, 0.7], look: [-0.5, 1.15, 0.42], fov: 24 },
      ], progress, 0.01 + bob);
    },
    leave: ({ context }) => {
      context.world.sets.workshop.visible = false;
      context.world.workpiece.visible = false;
      context.world.cylTray.visible = false;
      hideCast(context.cast);
    },
  });

  // 制作：地下室装配子弹。
  shots.push({
    id: "s_basement_make",
    start: 158,
    end: 178,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.basement.visible = true;
      dressZhang(context.cast.zhang, "uniform");
      place(context.cast.zhang, 0, 0, -1.0, 0);
      context.world.gun.visible = true;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const make: Pose = { armR: [-0.6, 0, 0.2], armL: [-0.5, 0, -0.1], neck: [-0.4, 0, 0] };
      applyPose(zhang, lerpPose(idle(localTime + 1), make, THREE.MathUtils.clamp(localTime / 1.5, 0, 1)));
      runCam(context.camera, [
        { at: 0, pos: [1.4, 1.7, 0.3], look: [0, 1.0, -1.8], fov: 38 },
        { at: 0.5, pos: [0.9, 1.35, -0.2], look: [0, 1.0, -1.8], fov: 30 },
        { at: 1, pos: [0.55, 1.2, -0.5], look: [0, 1.0, -1.8], fov: 26 },
      ], progress);
    },
    leave: ({ context }) => {
      context.world.sets.basement.visible = false;
      hideCast(context.cast);
    },
  });

  // 制作：地下室试射。
  shots.push({
    id: "s_basement_test",
    start: 178,
    end: 198,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.basement.visible = true;
      dressZhang(context.cast.zhang, "uniform");
      place(context.cast.zhang, -1.2, 0, -0.8, -Math.PI * 0.6);
      context.world.gun.visible = true;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const aimPose = aim(-0.15, -0.3);
      applyPose(zhang, lerpPose(idle(localTime), aimPose, THREE.MathUtils.clamp(localTime / 3, 0, 1)));
      const recoil = localTime > 184.6 && localTime < 185.1 ? Math.sin((localTime - 184.6) / 0.5 * Math.PI) * 0.12 : 0;
      zhang.joints.armR.rotation.x += recoil;
      const shake = localTime > 184.5 && localTime < 185.3 ? 0.03 : 0;
      runCam(context.camera, [
        { at: 0, pos: [0.2, 1.6, 0.6], look: [-1.2, 1.5, -0.5], fov: 36 },
        { at: 0.45, pos: [0.4, 1.6, 1.4], look: [2.6, 1.0, -0.4], fov: 34 },
        { at: 0.62, pos: [0.1, 1.5, 1.2], look: [2.6, 1.0, -0.4], fov: 26 },
        { at: 1, pos: [2.2, 1.35, 0.6], look: [2.6, 0.95, -0.4], fov: 30 },
      ], progress, shake);
    },
    leave: ({ context }) => {
      context.world.sets.basement.visible = false;
      context.world.gun.visible = false;
      hideCast(context.cast);
    },
  });

  // 等待：离开基地，进入太空。
  shots.push({
    id: "s_space_depart",
    start: 198,
    end: 222,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      dressZhang(context.cast.zhang, "suit");
      place(context.cast.zhang, -70, 20, 130, 0);
      context.pistol.visible = false;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const w = context.world;
      const t = THREE.MathUtils.clamp(localTime / 16, 0, 1);
      const e = t * t * (3 - 2 * t);
      zhang.root.position.set(-70 + 70 * e, 20 - 18 * e, 130 - 130 * e);
      zhang.root.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.1, e);
      applyPose(zhang, float(localTime));
      runCam(context.camera, [
        { at: 0, pos: [-110, 40, 190], look: [-70, 20, 130], fov: 46 },
        { at: 0.5, pos: [-20, 18, 60], look: [0, 2, 40], fov: 42 },
        { at: 1, pos: [-8, 4, 12], look: [0, 1, 40], fov: 38 },
      ], progress);
      w.station.rotation.y = localTime * 0.01;
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      hideCast(context.cast);
    },
  });

  // 等待：虚空与父亲。
  shots.push({
    id: "s_space_wait",
    start: 222,
    end: 252,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      dressZhang(context.cast.zhang, "suit");
      place(context.cast.zhang, 0, 0, 0, 0);
      context.pistol.visible = false;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const w = context.world;
      zhang.root.position.y = Math.sin(localTime * 0.4) * 0.3;
      applyPose(zhang, float(localTime));
      // 日落：太阳沿地球边缘下沉。
      const sunset = THREE.MathUtils.clamp(localTime / 26, 0, 1);
      w.sun.position.set(0, -8 - sunset * 30, -240);
      w.sunLight.position.copy(w.sun.position);
      w.sunLight.intensity = 2.4 * (1 - sunset * 0.8);
      w.sunLight.color.setHex(THREE.MathUtils.lerp(0xffc98a, 0xff6a2a, sunset) as number);
      // 父亲的记忆在第二段淡入（漂浮于虚空中的父亲）。
      const mem = THREE.MathUtils.clamp((localTime - 6) / 3, 0, 1) * (1 - THREE.MathUtils.clamp((localTime - 16) / 3, 0, 1));
      const father = context.cast.father;
      father.root.visible = mem > 0.2;
      if (mem > 0.01) {
        father.root.position.set(2.6 + Math.sin(localTime * 0.5) * 0.15, 1.0, 2.2);
        father.root.rotation.set(0, Math.PI * 0.3, 0);
        applyPose(father, idle(localTime + 9));
      }
      // 镜头：由远及近，中段与父亲并置，再切向地球/太阳。
      runCam(context.camera, [
        { at: 0, pos: [-14, 5, 20], look: [0, 1, 0], fov: 40 },
        { at: 0.25, pos: [-7, 2.6, 8], look: [0.8, 1.1, 0.8], fov: 36 },
        { at: 0.45, pos: [-4.5, 2.0, 5.5], look: [1.1, 1.2, 1.1], fov: 33 },
        { at: 0.6, pos: [2, 2, -8], look: [0, -14, -300], fov: 30 },
        { at: 0.8, pos: [4, 3, -14], look: [0, -20, -320], fov: 28 },
        { at: 1, pos: [4, 3, -14], look: [0, -20, -320], fov: 28 },
      ], progress);
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      context.cast.father.root.visible = false;
      hideCast(context.cast);
    },
  });

  // 射击：门开、合影、瞄准。
  shots.push({
    id: "s_space_aim",
    start: 252,
    end: 278,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      dressZhang(context.cast.zhang, "suit");
      place(context.cast.zhang, 0, 0, 0, 0);
      context.pistol.visible = true;
      context.scope = 0;
      // 人群先在出口处集合。
      for (let i = 0; i < context.cast.crowd.length; i += 1) {
        const f = context.cast.crowd[i]!;
        f.root.visible = false;
        f.setClothes(context.cast.crowdOpenSuit[i]!);
        f.root.position.set(0, 6, 257);
        f.root.rotation.set(0, Math.PI, 0);
        applyPose(f, float(i * 0.7));
      }
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const w = context.world;
      const crowd = context.cast.crowd;
      zhang.root.position.y = Math.sin(localTime * 0.3) * 0.2;
      applyPose(zhang, float(localTime));
      // 人群从出口飞出，排成三排合影。
      const lineup = THREE.MathUtils.clamp((localTime - 6) / 10, 0, 1);
      const e = lineup * lineup * (3 - 2 * lineup);
      for (let i = 0; i < crowd.length; i += 1) {
        const f = crowd[i]!;
        const row = i < 3 ? 0 : i < 8 ? 1 : 2;
        const col = i < 3 ? i - 1 : i < 8 ? i - 5 : i - 9;
        const tx = col * 1.5;
        const tz = 250 + row * 1.7;
        const sx = 0;
        const sz = 257;
        f.root.visible = localTime > 7;
        f.root.position.set(sx + (tx - sx) * e, 6 + row * 0.4, sz + (tz - sz) * e);
        f.root.rotation.set(0, Math.PI, 0);
        applyPose(f, float(localTime * 0.8 + i * 0.7));
      }
      // 日落继续，光线更暖更暗。
      const sunset = THREE.MathUtils.clamp((localTime + 30) / 56, 0, 1);
      w.sun.position.set(0, -8 - sunset * 40, -240);
      w.sunLight.position.copy(w.sun.position);
      w.sunLight.intensity = 2.2 * (1 - sunset * 0.9);
      w.sunLight.color.setHex(THREE.MathUtils.lerp(0xff6a2a, 0xff3a12, sunset) as number);
      // 镜头：先广角看章北海，再切瞄准镜视角（拉近的"镜中"构图），最后对准目标。
      const camKeys: CamKey[] = [
        { at: 0, pos: [12, 6, 16], look: [0, 1, 0], fov: 42 },
        { at: 0.3, pos: [4, 2.5, 7], look: [0, 1.2, 0], fov: 34 },
        { at: 0.5, pos: [1.6, 2.0, 3.6], look: [0, 1.3, 0], fov: 20 },
        { at: 0.62, pos: [0, 9.5, 226], look: [0, 6.2, 253], fov: 17 },
        { at: 0.8, pos: [0, 9.3, 228], look: [0, 6.3, 252], fov: 16 },
        { at: 1, pos: [0, 9.3, 229], look: [0, 6.3, 251], fov: 15 },
      ];
      runCam(context.camera, camKeys, progress);
      context.scope = progress > 0.6 && progress < 0.95 ? 1 : 0;
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      context.scope = 0;
      context.pistol.visible = false;
      hideCast(context.cast);
    },
  });

  // 射击：三十次击发与十秒飞行。
  shots.push({
    id: "s_space_fire",
    start: 278,
    end: 298,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      dressZhang(context.cast.zhang, "suit");
      place(context.cast.zhang, 0, 0, 0, 0);
      context.pistol.visible = true;
      context.scope = 0;
      for (let i = 0; i < context.cast.crowd.length; i += 1) {
        const f = context.cast.crowd[i]!;
        f.setClothes(context.cast.crowdOpenSuit[i]!);
        const row = i < 3 ? 0 : i < 8 ? 1 : 2;
        const col = i < 3 ? i - 1 : i < 8 ? i - 5 : i - 9;
        f.root.visible = true;
        f.root.position.set(col * 1.5, 6 + row * 0.4, 250 + row * 1.7);
        f.root.rotation.set(0, Math.PI, 0);
        applyPose(f, float(i * 0.7));
      }
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const w = context.world;
      const crowd = context.cast.crowd;
      // 瞄准姿态，保持稳定。
      applyPose(zhang, { ...aim(-0.06, 0), hips: [0, 0, 0] });
      zhang.root.position.y = Math.sin(localTime * 0.25) * 0.1;
      zhang.root.rotation.y = 0.06;
      for (let i = 0; i < crowd.length; i += 1) {
        applyPose(crowd[i]!, float(localTime * 0.7 + i * 0.7));
      }
      // 枪口火光。
      let flashing = false;
      for (const ft of FIRE_TIMES) {
        const dt = localTime - (ft - 278);
        if (dt >= 0 && dt < 0.12) flashing = true;
      }
      context.pistolMuzzle.visible = flashing;
      if (flashing) {
        context.pistolMuzzle.scale.setScalar(1 + 0.55 * Math.abs(Math.sin(localTime * 130)));
        (context.pistolMuzzle.children[1] as THREE.PointLight).intensity = 22;
      }
      // 弹道。
      for (let i = 0; i < 30; i += 1) {
        const tr = w.tracers[i]!;
        const ft = FIRE_TIMES[i]!;
        const el = localTime - (ft - 278);
        const target = TRACER_TARGETS[i]!;
        if (el < 0 || el > 10) {
          tr.visible = false;
          continue;
        }
        const p = el / 10;
        tr.visible = true;
        tr.position.set(
          (0.5 + (target[0] - 0.5) * p),
          (1.3 + (target[1] - 1.3) * p),
          (1.6 + (target[2] - 1.6) * p),
        );
        const dir = new THREE.Vector3(target[0] - 0.5, target[1] - 1.3, target[2] - 1.6).normalize();
        tr.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
        const fade = p > 0.9 ? (1 - p) / 0.1 : 1;
        (tr.material as THREE.MeshStandardMaterial).opacity = fade;
        (tr.material as THREE.MeshStandardMaterial).transparent = true;
      }
      // 镜头：瞄准镜视角 → 快速后拉看章北海 → 观察。
      runCam(context.camera, [
        { at: 0, pos: [0, 9.3, 229], look: [0, 6.3, 251], fov: 15 },
        { at: 0.25, pos: [2.2, 1.7, 3.2], look: [0, 1.2, 0], fov: 26 },
        { at: 0.6, pos: [5, 3, 8], look: [0, 1, 0], fov: 30 },
        { at: 1, pos: [9, 5, 14], look: [0, 6, 252], fov: 26 },
      ], progress, 0.005);
      context.scope = progress < 0.2 ? 1 : 0;
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      context.scope = 0;
      context.pistol.visible = false;
      context.pistolMuzzle.visible = false;
      for (const tr of context.world.tracers) tr.visible = false;
      hideCast(context.cast);
    },
  });

  // 射击：命中与陨石雨。
  shots.push({
    id: "s_space_impact",
    start: 298,
    end: 318,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      dressZhang(context.cast.zhang, "suit");
      place(context.cast.zhang, 0, 0, 0, 0);
      context.pistol.visible = true;
      context.scope = 0;
      for (let i = 0; i < context.cast.crowd.length; i += 1) {
        const f = context.cast.crowd[i]!;
        f.setClothes(context.cast.crowdOpenSuit[i]!);
        const row = i < 3 ? 0 : i < 8 ? 1 : 2;
        const col = i < 3 ? i - 1 : i < 8 ? i - 5 : i - 9;
        f.root.visible = true;
        f.root.position.set(col * 1.5, 6 + row * 0.4, 250 + row * 1.7);
        f.root.rotation.set(0, Math.PI, 0);
        applyPose(f, float(i * 0.7));
      }
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const w = context.world;
      const crowd = context.cast.crowd;
      applyPose(zhang, { ...aim(-0.05, 0), hips: [0, 0, 0] });
      zhang.root.position.y = Math.sin(localTime * 0.2) * 0.1;
      // 命中点：前排三人 + 相邻两人。
      const hitIdx = [0, 1, 2, 3, 4];
      for (let k = 0; k < hitIdx.length; k += 1) {
        const idx = hitIdx[k]!;
        const f = crowd[idx]!;
        const puff = w.impactPuffs[k]!;
        const blood = w.bloodParticles[k]!;
        const grow = THREE.MathUtils.clamp((localTime - 0.6 - k * 0.25) / 1.6, 0, 1);
        puff.visible = grow > 0.01;
        puff.position.copy(f.root.position).add(new THREE.Vector3(0, 0.3, 0.3));
        const s = 0.3 + grow * 2.2;
        puff.scale.setScalar(s);
        ((puff.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.9 * (1 - grow * 0.4);
        blood.visible = grow > 0.25;
        if (blood.visible) {
          blood.position.copy(f.root.position).add(new THREE.Vector3(Math.sin(k * 3) * 0.3, 0.5 + grow * 1.4, 0.4 + grow * 0.8));
        }
      }
      // 人群惊慌后撤（向黄河站入口）。
      const flee = THREE.MathUtils.clamp((localTime - 3.5) / 8, 0, 1);
      const e = flee * flee * (3 - 2 * flee);
      for (let i = 0; i < crowd.length; i += 1) {
        const f = crowd[i]!;
        const base: V3 = [
          (i < 3 ? i - 1 : i < 8 ? i - 5 : i - 9) * 1.5,
          6 + (i < 3 ? 0 : i < 8 ? 1 : 2) * 0.4,
          250 + (i < 3 ? 0 : i < 8 ? 1 : 2) * 1.7,
        ];
        f.root.position.set(base[0], base[1], base[2] + e * 6);
        applyPose(f, float(localTime * 1.4 + i * 0.7));
      }
      // 命中者瘫软（后倒）。
      for (let k = 0; k < hitIdx.length; k += 1) {
        const f = crowd[hitIdx[k]!]!;
        const slump = THREE.MathUtils.clamp((localTime - 1.5 - k * 0.2) / 3, 0, 1);
        f.root.rotation.z = -slump * 0.9;
      }
      runCam(context.camera, [
        { at: 0, pos: [0, 9.3, 229], look: [0, 6.3, 251], fov: 15 },
        { at: 0.18, pos: [0, 9.3, 229], look: [0, 6.3, 250], fov: 15 },
        { at: 0.5, pos: [4, 9.5, 242], look: [0, 6.3, 252], fov: 20 },
        { at: 1, pos: [14, 9, 238], look: [0, 6, 254], fov: 18 },
      ], progress);
      context.scope = progress < 0.3 ? 1 : 0;
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      context.scope = 0;
      context.pistol.visible = false;
      for (const p of context.world.impactPuffs) p.visible = false;
      for (const b of context.world.bloodParticles) b.visible = false;
      hideCast(context.cast);
    },
  });

  // 尾声：返航与安心。
  shots.push({
    id: "s_space_return",
    start: 318,
    end: 334,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      dressZhang(context.cast.zhang, "suit");
      place(context.cast.zhang, 0, 0, 0, 0);
      context.pistol.visible = true;
      context.scope = 0;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const w = context.world;
      const t = THREE.MathUtils.clamp(localTime / 14, 0, 1);
      const e = t * t * (3 - 2 * t);
      zhang.root.position.set(0 - 40 * e, 0 + 12 * e, 0 - 70 * e);
      zhang.root.rotation.y = Math.PI * 0.2 + e * 0.3;
      applyPose(zhang, float(localTime));
      context.pistol.visible = t < 0.25;
      runCam(context.camera, [
        { at: 0, pos: [7, 4, 10], look: [0, 1, 0], fov: 34 },
        { at: 0.5, pos: [14, 8, 22], look: [0, 1, -30], fov: 36 },
        { at: 1, pos: [26, 14, 40], look: [0, -10, -260], fov: 34 },
      ], progress);
      w.station.rotation.y = localTime * 0.01;
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      context.pistol.visible = false;
      hideCast(context.cast);
    },
  });

  // 尾声：父亲的目光与结尾。
  shots.push({
    id: "s_coda",
    start: 334,
    end: 348,
    enter: ({ context }) => {
      hideAllSets(context.world);
      hideCast(context.cast);
      context.world.sets.space.visible = true;
      setSpaceMain(context.world, true);
      context.cast.father.root.visible = true;
      place(context.cast.father, 2.4, 1.0, 2.2, Math.PI * 0.3);
      applyPose(context.cast.father, idle(3));
      dressZhang(context.cast.zhang, "suit");
      place(context.cast.zhang, 0, 0, 0, 0);
      context.pistol.visible = false;
      context.fade = 1;
    },
    update: ({ context, localTime, progress }) => {
      const w = context.world;
      const father = context.cast.father;
      const zhang = context.cast.zhang;
      applyPose(father, idle(localTime + 9));
      zhang.root.position.y = Math.sin(localTime * 0.3) * 0.2;
      applyPose(zhang, float(localTime));
      const fadeOut = THREE.MathUtils.clamp((localTime - 8) / 5, 0, 1);
      context.fade = 1 - fadeOut;
      // 父亲在星空间渐渐远去。
      father.root.position.set(2.4, 1.0 + localTime * 0.08, 2.2 + localTime * 1.3);
      father.root.rotation.set(0, Math.PI * 0.3, 0);
      runCam(context.camera, [
        { at: 0, pos: [3.2, 2, 6], look: [1.1, 1.4, 1.4], fov: 30 },
        { at: 0.4, pos: [2.2, 2, 8], look: [1.2, 1.4, 2.2], fov: 28 },
        { at: 0.75, pos: [1.2, 2.4, 12], look: [0, -14, -300], fov: 30 },
        { at: 1, pos: [1, 2.4, 14], look: [0, -18, -320], fov: 30 },
      ], progress);
      w.sun.position.set(0, -48, -240);
      w.sunLight.position.copy(w.sun.position);
      w.sunLight.intensity = 0.8;
    },
    leave: ({ context }) => {
      context.world.sets.space.visible = false;
      context.cast.father.root.visible = false;
      context.fade = 0;
    },
  });

  // ───────────────────────────────────────────────────────────────
  // 播放器与渲染
  // ───────────────────────────────────────────────────────────────
  validateVoiceCues(voiceCues, DURATION);
  const player = new CinematicPlayer<FilmContext>({
    duration: DURATION,
    context: ctx,
    shots,
    cues: [...voiceCues, ...soundCues],
  });

  const stage = new ThreeStage({
    player,
    renderer: renderer as unknown as ThreeRendererLike,
    scene,
    camera: () => ctx.camera,
    container,
    maxPixelRatio: 2,
  });

  const audio = new WebAudioCueBus<FilmContext>(player);
  configureAudio(audio);

  const controls = mountCinematicControls({ player, audio, container: document.body });

  const updateDom = (): void => {
    fadeEl.style.opacity = String(Math.max(0, Math.min(1, 1 - ctx.fade)));
    titleEl.style.opacity = String(Math.max(0, Math.min(1, ctx.title)));
    scopeEl.style.opacity = String(Math.max(0, Math.min(1, ctx.scope)));
  };
  player.addTypedEventListener("frame", updateDom);
  updateDom();

  // 播放手势解锁音频。
  const unlockOnGesture = async (): Promise<void> => {
    await audio.unlock();
  };
  window.addEventListener("pointerdown", unlockOnGesture, { once: true });

  void stage;
  void controls;
}

build();
