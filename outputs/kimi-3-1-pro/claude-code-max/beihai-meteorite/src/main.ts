import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  clamp01,
  easeInOutCubic,
  lerp,
  mountCinematicControls,
  smoothstep,
  validateVoiceCues,
  type Shot,
  type ShotFrame,
  type ThreeRendererLike,
} from "@agentbench/cinematic-player";
import { aim, applyPose, float, idle, lerpPose, walk, type Figure, type Pose, type Skin } from "@agentbench/voxel-kit";
import { soundCues, voiceCues, METEOR_SHOT_TIMES } from "./cues";
import { registerAudio } from "./audio";
import { buildWorld, type EnvironmentName, type World, type SpaceWorld } from "./world";
import "./style.css";

const DURATION = 342;
const TAU = Math.PI * 2;
const app = document.querySelector<HTMLDivElement>("#app")!;
const stageElement = document.querySelector<HTMLDivElement>("#stage")!;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const world = buildWorld();
scene.add(world.root);
scene.add(new THREE.AmbientLight(0x18232e, 0.12));

interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  world: World;
  currentEnvironment?: EnvironmentName;
}
const context: FilmContext = { scene, camera, world };

const backgrounds: Record<EnvironmentName, THREE.Color> = {
  space: new THREE.Color(0x02060e),
  macro: new THREE.Color(0x060a11),
  home: new THREE.Color(0x211b18),
  workshop: new THREE.Color(0x101a21),
  basement: new THREE.Color(0x111315),
  base: new THREE.Color(0x0b1822),
};
const fogs: Partial<Record<EnvironmentName, THREE.Fog>> = {
  home: new THREE.Fog(0x211b18, 9, 23),
  workshop: new THREE.Fog(0x101a21, 10, 25),
  basement: new THREE.Fog(0x111315, 7, 19),
  base: new THREE.Fog(0x0b1822, 8, 20),
};

function activate(name: EnvironmentName): void {
  world.activate(name);
  if (context.currentEnvironment === name) return;
  context.currentEnvironment = name;
  scene.background = backgrounds[name];
  scene.fog = fogs[name] ?? null;
}

function setCamera(position: [number, number, number], target: [number, number, number], fov = 45): void {
  camera.position.set(...position);
  camera.lookAt(...target);
  if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
}

function dolly(a: [number, number, number], b: [number, number, number], amount: number): [number, number, number] {
  return [lerp(a[0], b[0], amount), lerp(a[1], b[1], amount), lerp(a[2], b[2], amount)];
}

function targetDolly(a: [number, number, number], b: [number, number, number], amount: number): [number, number, number] {
  return dolly(a, b, amount);
}

function faceToward(figure: { root: THREE.Object3D }, x: number, z: number): void {
  figure.root.rotation.y = Math.atan2(x - figure.root.position.x, z - figure.root.position.z);
}

function pulse(time: number, at: number, width = 0.12): number {
  return clamp01(1 - Math.abs(time - at) / width);
}

function maxPulse(time: number, times: number[], width = 0.12): number {
  let value = 0;
  for (const at of times) value = Math.max(value, pulse(time, at, width));
  return value;
}

function workingPose(time: number, reach = 0.7): Pose {
  const pose = idle(time);
  pose.armR = [-reach, 0.04, 0.18];
  pose.armL = [-reach * 0.82, -0.04, -0.18];
  pose.neck = [0.12, Math.sin(time * 0.45) * 0.08, 0];
  return pose;
}

function makeShot(
  id: string,
  start: number,
  end: number,
  environment: EnvironmentName,
  update: (frame: ShotFrame<FilmContext>) => void,
): Shot<FilmContext> {
  return {
    id, start, end,
    enter: () => activate(environment),
    update: (frame) => { activate(environment); update(frame); },
  };
}

function updateHome(frame: ShotFrame<FilmContext>): void {
  const t = frame.time;
  const h = world.home;
  h.saleRocks.visible = t >= 72;
  h.marsRock.visible = t >= 62;
  h.safeDoor.rotation.y = -smoothstep((t - 65) / 2.2) * 1.18;
  h.microscope.rotation.y = Math.sin(t * 0.35) * 0.025;
  h.dust.rotation.y = t * 0.006;
  for (let i = 0; i < h.cabinetLights.length; i++) h.cabinetLights[i]!.intensity = 1.05 + Math.sin(t * 0.7 + i) * 0.08;

  const arrival = smoothstep((t - 30) / 4.2);
  const approach = smoothstep((t - 62) / 6);
  h.zhang.root.position.set(lerp(-4.1, -2.4, arrival) + approach * 2.5, 0, lerp(3.5, 1.65, arrival) - approach * 0.35);
  faceToward(h.zhang, 2.1, -0.45);
  if (t < 34.2) applyPose(h.zhang, lerpPose(walk(t, 1.25), idle(t), smoothstep((t - 30) / 4.2)));
  else {
    const pose = idle(t);
    if (t >= 58 && t < 65) { pose.armR = [-0.5, 0, 0.2]; pose.armL = [-0.3, 0, -0.18]; }
    if (t >= 72 && t < 84) { pose.armR = [-0.75, 0, 0.18]; pose.armL = [-0.4, 0, -0.2]; }
    if (t >= 95) { pose.armR = [-0.36, 0, 0.24]; pose.armL = [-0.25, 0, -0.2]; }
    applyPose(h.zhang, pose);
  }
  const collectorPose = idle(t * 0.8);
  if (t >= 44 && t < 62) { collectorPose.armR = [-0.8, 0.1, 0.3]; collectorPose.armL = [-0.25, 0, -0.2]; }
  if (t >= 65 && t < 72) { collectorPose.armR = [-1.15, 0, 0.25]; collectorPose.armL = [-0.7, 0, -0.25]; }
  if (t >= 78 && t < 88) { collectorPose.armR = [-0.85, 0, 0.35]; collectorPose.armL = [-0.8, 0, -0.3]; }
  if (t >= 88) { collectorPose.armR = [-0.35, 0, 0.65]; collectorPose.armL = [-0.35, 0, -0.65]; }
  applyPose(h.collector, collectorPose);

  if (t < 62) {
    const p = easeInOutCubic((t - 28) / 34);
    setCamera(dolly([7.4, 3.7, 8.7], [4.4, 2.65, 5.4], p), targetDolly([0, 1.25, -0.7], [0.7, 1.35, -0.4], p), 44);
  } else if (t < 72) {
    const p = smoothstep((t - 62) / 10);
    setCamera(dolly([-1.8, 2.6, 3.6], [-2.6, 2.1, 2.6], p), [-2.9, 1.5, -1.65], 43);
  } else if (t < 91) {
    const p = smoothstep((t - 72) / 19);
    setCamera(dolly([4.6, 2.6, 4.8], [3.5, 2.15, 3.5], p), [1.15, 1.35, 0.05], 42);
  } else {
    const p = smoothstep((t - 91) / 20);
    setCamera(dolly([3.9, 2.5, 4.5], [2.55, 1.95, 2.25], p), targetDolly([1.1, 1.4, 0.1], [0.15, 1.45, 0.8], p), 40);
  }
}

function updateWorkshop(frame: ShotFrame<FilmContext>): void {
  const t = frame.time;
  const w = world.workshop;
  const cutting = t >= 112 && t < 136;
  w.door.position.z = 1.05 + (1 - smoothstep((t - 111) / 3)) * 0.55;
  w.spindle.position.x = cutting ? Math.sin(t * 1.7) * 0.65 : 0;
  w.spindle.position.y = 2.7 + (cutting ? Math.sin(t * 2.2) * 0.12 : 0);
  w.spindle.rotation.y = t * 4.5;
  w.cuttingRock.visible = t < 137;
  w.cuttingRock.scale.setScalar(1 - smoothstep((t - 116) / 20) * 0.38);
  w.tray.visible = t >= 130;
  const count = Math.floor(clamp01((t - 130) / 7) * 36);
  w.rounds.forEach((round, i) => { round.visible = i < count; });
  w.tool.visible = t < 149;
  w.shavings.visible = t >= 130;
  (w.statusLight.material as THREE.MeshBasicMaterial).color.setHex(cutting ? 0xffbd72 : 0x76e0c7);
  w.sparks.visible = cutting;
  const positions = w.sparks.geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < w.sparkSeed.length; i++) {
    const seed = w.sparkSeed[i]!;
    const age = (t * (1.2 + seed) + seed * 7) % 1;
    const angle = seed * TAU * 5 + t * 0.8;
    positions.setXYZ(i, Math.cos(angle) * age * 0.8, 1.28 + (1 - age) * 0.35 - age * age * 0.7, -1.4 + Math.sin(angle) * age * 0.65);
  }
  positions.needsUpdate = true;
  const moveToTray = smoothstep((t - 137) / 5);
  w.zhang.root.position.set(lerp(-2.8, 1.9, moveToTray), 0, lerp(1.3, 1.9, moveToTray));
  faceToward(w.zhang, moveToTray > 0.5 ? 3 : 0, moveToTray > 0.5 ? 1.1 : -1.4);
  applyPose(w.zhang, workingPose(t, moveToTray > 0.5 ? 0.45 : 0.82));
  if (t < 137) {
    const p = smoothstep((t - 111) / 26);
    setCamera(dolly([7.5, 4.0, 7.8], [4.4, 2.7, 4.7], p), [0, 1.45, -1.1], 43);
  } else {
    const p = smoothstep((t - 137) / 16);
    setCamera(dolly([5.3, 2.75, 5.0], [3.7, 1.85, 3.15], p), [2.2, 1.12, 0.9], 39);
  }
}

const testTimes = [187, 188.2, 189.4, 190.6];
function updateBasement(frame: ShotFrame<FilmContext>): void {
  const t = frame.time;
  const b = world.basement;
  const assembled = clamp01((t - 158) / 17);
  b.rounds.forEach((round, i) => {
    round.visible = t < 184;
    (round.userData.copper as THREE.Mesh).visible = i >= assembled * 36;
    (round.userData.meteor as THREE.Mesh).visible = i < assembled * 36;
  });
  b.tableGun.visible = t < 184;
  b.handGun.visible = t >= 184;
  b.cloth.visible = true;
  const unwrap = smoothstep((t - 191.5) / 1.5);
  b.cloth.position.x = -unwrap * 1.15;
  b.beef.visible = t >= 191.5;
  b.fragments.visible = t >= 192;
  b.fragments.children.forEach((child, i) => { child.visible = t >= 192 + (i % 4) * 0.04; });
  b.holes.forEach((hole, i) => {
    hole.visible = t >= testTimes[i]!;
    hole.position.x = -0.42 + (i % 2) * 0.72 - unwrap * 1.15;
  });
  const recoil = maxPulse(t, testTimes, 0.18);
  b.flash.visible = recoil > 0.01;
  b.flash.scale.setScalar(0.7 + recoil * 1.4);
  b.lamp.intensity = 4.25 + Math.sin(t * 19) * 0.12 + recoil * 0.8;
  if (t < 184) {
    applyPose(b.zhang, workingPose(t, 0.58));
    b.zhang.root.rotation.y = Math.PI;
  } else {
    applyPose(b.zhang, aim(-0.06 - recoil * 0.18, 0));
    b.zhang.root.rotation.y = Math.PI;
  }
  if (t < 181) {
    const p = smoothstep((t - 153) / 28);
    setCamera(dolly([5.0, 3.25, 5.8], [3.15, 2.2, 3.45], p), [0, 1.2, -0.1], 43);
  } else if (t < 191.5) {
    const p = smoothstep((t - 181) / 10.5);
    setCamera(dolly([4.6, 2.6, 5.6], [3.4, 2.2, 4.0], p), [0, 1.25, -0.8], 44);
    camera.position.x += recoil * 0.045;
  } else {
    const p = smoothstep((t - 191.5) / 7.5);
    setCamera(dolly([1.9, 2.0, -0.65], [1.25, 1.8, -1.35], p), [0, 1.72, -3.25], 36);
  }
}

function updateBase(frame: ShotFrame<FilmContext>): void {
  const t = frame.time;
  const b = world.base;
  const place = smoothstep((t - 204) / 3);
  b.locator.position.set(lerp(-0.15, -2.2, place), lerp(1.35, 1.55, place), lerp(0.45, -1.3, place));
  b.lockerDoor.rotation.y = -smoothstep((t - 204.5) / 2.4) * 1.1;
  b.monitorDot.visible = true;
  (b.monitorDot.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(t * 3) > -0.7 ? 0x72e1bf : 0x2c7468);
  applyPose(b.zhang, workingPose(t, 0.65 + place * 0.2));
  b.zhang.root.rotation.y = -0.55 - place * 0.8;
  if (t < 204) setCamera(dolly([5.0, 3.0, 6.0], [3.4, 2.4, 4.3], smoothstep((t - 199) / 5)), [0, 1.35, -1.0], 42);
  else setCamera(dolly([1.2, 2.0, 3.1], [-0.7, 1.75, 1.9], smoothstep((t - 204) / 8)), [-1.2, 1.45, -1.15], 38);
}

type SpaceMode = "cold" | "departure" | "drift" | "hatch" | "photo" | "prep" | "firing" | "flight" | "impact" | "coda";
const meetingModes: SpaceMode[] = ["hatch", "photo", "prep", "firing", "flight", "impact"];

function setSuit(member: { figure: Figure; darkSkin: Skin; clearSkin: Skin; crackedSkin: Skin }, state: "dark" | "clear" | "cracked"): void {
  if (member.figure.root.userData.suitState === state) return;
  member.figure.root.userData.suitState = state;
  member.figure.setClothes(state === "dark" ? member.darkSkin.texture : state === "clear" ? member.clearSkin.texture : member.crackedSkin.texture);
}

function updateSpaceActors(time: number, mode: SpaceMode): void {
  const s = world.space;
  const meeting = meetingModes.includes(mode);
  s.station.visible = mode === "cold" || mode === "drift" || mode === "coda";
  s.meetingStation.visible = meeting;
  s.baseModel.visible = mode === "departure";
  s.debris.visible = mode !== "hatch" && mode !== "photo" && mode !== "prep" && mode !== "impact";
  s.crowdGroup.visible = meeting || mode === "cold";
  s.photographer.root.visible = meeting && time < 327;
  s.zhang.root.visible = ["cold", "departure", "drift", "prep", "firing", "coda"].includes(mode);
  s.gun.visible = mode === "cold" || mode === "prep" || mode === "firing";
  s.bulletGroup.visible = mode === "firing" || mode === "flight" || mode === "impact";
  s.stars.rotation.y = time * 0.00025;
  s.earth.rotation.y = time * 0.002;
  s.station.rotation.z = time * 0.003;
  s.debris.rotation.y = time * 0.004;
  const sunset = smoothstep((time - 220) / 45);
  s.sun.position.set(11 - sunset * 2.8, 5 - sunset * 5.2, -43);
  s.sun.scale.setScalar(1 + Math.sin(time * 0.22) * 0.018);
  s.hatchDoor.position.x = smoothstep((time - 249.5) / 2.2) * 3.0;
  s.hatchRed.visible = time < 249.5;
  s.hatchGreen.visible = time >= 249.5;

  if (mode === "drift") {
    s.zhang.root.position.set(0, -0.6, 1.2);
    s.zhang.root.rotation.y = 0.35 + Math.sin(time * 0.12) * 0.12;
    setSuit({ figure: s.zhang, darkSkin: s.zhangDark, clearSkin: s.zhangClear, crackedSkin: s.zhangDark }, "clear");
    applyPose(s.zhang, float(time));
  } else if (mode === "departure") {
    const p = smoothstep((time - 212) / 8);
    s.zhang.root.position.set(0, -0.6, 1.2 - p * 4.2);
    s.zhang.root.rotation.y = Math.PI;
    setSuit({ figure: s.zhang, darkSkin: s.zhangDark, clearSkin: s.zhangClear, crackedSkin: s.zhangDark }, "dark");
    applyPose(s.zhang, float(time));
  } else if (mode === "coda") {
    const p = time - 333;
    s.zhang.root.position.set(0, -0.6, 1.2 + p * 0.48);
    s.zhang.root.rotation.y = Math.PI + 0.22;
    setSuit({ figure: s.zhang, darkSkin: s.zhangDark, clearSkin: s.zhangClear, crackedSkin: s.zhangDark }, "dark");
    applyPose(s.zhang, float(time * 0.6));
  } else {
    s.zhang.root.position.set(0, -0.6, 1.2);
    s.zhang.root.rotation.y = Math.PI;
    setSuit({ figure: s.zhang, darkSkin: s.zhangDark, clearSkin: s.zhangClear, crackedSkin: s.zhangDark }, "dark");
    const shots = mode === "cold" ? [14, 14.45, 14.9] : METEOR_SHOT_TIMES;
    const recoil = maxPulse(time, shots, 0.16);
    applyPose(s.zhang, aim(-0.04 - recoil * 0.12, 0));
    s.flash.visible = recoil > 0.01 && (mode === "cold" || mode === "firing");
    s.flash.scale.setScalar(0.75 + recoil * 1.5);
  }
  s.thruster.visible = mode === "departure" || mode === "coda";

  for (const member of s.crowd) {
    const f = member.figure;
    const thruster = f.root.userData.thruster as THREE.Group;
    if (mode === "cold") {
      f.root.visible = true;
      f.root.position.copy(member.final);
      f.root.rotation.set(0, 0, 0);
      setSuit(member, "dark");
      applyPose(f, float(time * 0.35 + member.index));
      thruster.visible = false;
    } else if (meeting) {
      const emergence = smoothstep((time - (250.5 + member.index * 0.055)) / 2.8);
      const hatch = new THREE.Vector3((member.col - 4.5) * 0.15, 1.1 + member.row * 0.2, -15.9);
      f.root.visible = time >= 250.2 + member.index * 0.04;
      f.root.position.lerpVectors(hatch, member.final, emergence);
      if (time >= member.firstHit) {
        const drift = Math.min(1, (time - member.firstHit) / 4);
        f.root.position.x += Math.sin(time * 1.2 + member.index) * 0.1 * drift;
        f.root.position.y += Math.cos(time * 0.9 + member.index) * 0.08 * drift;
      }
      const returning = smoothstep((time - (325 + member.index * 0.025)) / 5.5);
      if (returning > 0) {
        const destination = hatch.clone().add(new THREE.Vector3(0, 0, 0.5));
        f.root.position.lerp(destination, returning);
        f.root.rotation.z = returning * (member.index % 2 ? 0.4 : -0.4);
      } else f.root.rotation.z = Math.sin(time * 0.4 + member.index) * 0.025;
      const state = time >= member.firstHit ? "cracked" : time >= 264 ? "clear" : "dark";
      setSuit(member, state);
      const floating = float(time * 0.5 + member.index * 0.17);
      if (time >= member.firstHit) { floating.armR = [-1.35, 0, 0.6]; floating.armL = [-0.9, 0, -0.7]; }
      applyPose(f, floating);
      thruster.visible = returning > 0.02;
    } else {
      f.root.visible = false;
      thruster.visible = false;
    }
    const age = time - member.lastHit;
    member.burst.visible = meeting && age >= 0 && age < 4.2;
    if (member.burst.visible) {
      member.burst.children.forEach((child, i) => {
        const direction = member.burstDirections[i]!;
        child.position.copy(direction).multiplyScalar(age * 1.25);
        child.scale.setScalar(0.65 + Math.min(2.2, age * 0.8));
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.78 * (1 - age / 4.2));
      });
    }
  }
  s.photographer.root.rotation.y = -1.9;
  if (meeting) applyPose(s.photographer, aim(0.03, 0));
  for (const bullet of s.bullets) {
    const age = time - bullet.shot;
    const visible = age >= 0 && age < 10;
    bullet.mesh.visible = visible;
    bullet.trail.visible = visible && age > 0.15;
    if (visible) {
      const p = clamp01(age / 10);
      bullet.mesh.position.lerpVectors(bullet.start, bullet.end, p);
      bullet.trail.position.copy(bullet.mesh.position);
      bullet.trail.position.z += 0.45;
      bullet.trail.scale.z = 0.35 + Math.sin(p * Math.PI) * 0.9;
    }
  }
}

function updateCold(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "cold");
  const p = smoothstep(frame.time / 20);
  setCamera(dolly([6.8, 2.7, 10.4], [3.7, 1.45, 7.0], p), targetDolly([0, 0.0, -5], [0, 0.2, -7], p), 46);
}

function updateMacro(frame: ShotFrame<FilmContext>): void {
  const t = frame.time;
  world.macro.rock.rotation.set(t * 0.16, t * 0.27, t * 0.08);
  world.macro.ring.rotation.z = t * 0.08;
  setCamera([0, 0.15, 4.7 - smoothstep((t - 20) / 8) * 0.55], [0, 0, 0], 42);
}

function updateDeparture(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "departure");
  const p = smoothstep((frame.time - 212) / 8);
  setCamera(dolly([4.6, 2.4, 7.6], [2.5, 1.35, 4.8], p), [0, -0.1, -4.0], 43);
}

function updateDrift(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "drift");
  const p = smoothstep((frame.time - 220) / 24);
  setCamera(dolly([6.8, 2.7, 9.5], [4.2, 3.1, 8.0], p), targetDolly([0, 0, -5.5], [0, 0, -7], p), 44);
}

function updateHatch(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "hatch");
  const p = smoothstep((frame.time - 244) / 20);
  setCamera(dolly([10.5, 4.8, 4.4], [7.0, 3.3, 1.2], p), [0, 1.35, -14.1], 45);
}

function updatePhoto(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "photo");
  const p = smoothstep((frame.time - 264) / 14);
  setCamera(dolly([9.0, 4.2, 1.8], [6.8, 3.1, -0.4], p), [0, 1.55, -12.3], 43);
}

function updatePreparation(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "prep");
  world.space.zhang.root.visible = frame.time < 283;
  if (frame.time < 283) {
    const p = smoothstep((frame.time - 278) / 5);
    setCamera(dolly([3.3, 1.8, 4.6], [2.35, 1.35, 3.2], p), [0, 0.65, 0.8], 38);
  } else {
    const p = smoothstep((frame.time - 283) / 5);
    setCamera([0, 0.68, 2.2], [0, 1.65 + p * 0.05, -12.1], 16);
  }
}

function updateFiring(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "firing");
  const scope = frame.time >= 295 && frame.time < 301;
  world.space.zhang.root.visible = !scope;
  if (scope) setCamera([0, 0.68, 2.2], [0.1, 1.62, -12.1], 16);
  else {
    const p = smoothstep((frame.time - 288) / 18);
    setCamera(dolly([3.7, 1.65, 4.3], [2.65, 1.25, 3.1], p), [0, 0.45, -0.1], 38);
  }
}

function updateFlight(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "flight");
  const p = smoothstep((frame.time - 306) / 8);
  setCamera(dolly([8.8, 3.2, 5.3], [4.2, 2.0, 0.5], p), [0, 1.0, -10.4], 43);
}

function updateImpact(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "impact");
  if (frame.time < 320) {
    const p = smoothstep((frame.time - 314) / 6);
    setCamera(dolly([4.0, 2.4, -4.4], [2.5, 1.9, -6.0], p), [0, 1.55, -12.15], 32);
  } else if (frame.time < 327) {
    const p = smoothstep((frame.time - 320) / 7);
    setCamera(dolly([7.8, 3.5, 0.5], [6.0, 2.8, -1.5], p), [0, 1.35, -12.4], 40);
  } else {
    const p = smoothstep((frame.time - 327) / 6);
    setCamera(dolly([10.0, 4.5, 4.8], [11.0, 5.0, 6.2], p), [0, 1.2, -14.7], 46);
  }
}

function updateCoda(frame: ShotFrame<FilmContext>): void {
  updateSpaceActors(frame.time, "coda");
  const p = frame.time - 333;
  setCamera([4.0 - p * 0.12, 1.9 + p * 0.03, 8.4 + p * 0.15], [0, -0.05, 1.2 + p * 0.48], 43);
}

const shots: Shot<FilmContext>[] = [
  makeShot("01-cold-open", 0, 20, "space", updateCold),
  makeShot("02-stone-match-cut", 20, 28, "macro", updateMacro),
  makeShot("03-the-collector", 28, 62, "home", updateHome),
  makeShot("04-the-mars-stone", 62, 72, "home", updateHome),
  makeShot("05-three-stones", 72, 91, "home", updateHome),
  makeShot("06-the-price", 91, 111, "home", updateHome),
  makeShot("07-cnc", 111, 137, "workshop", updateWorkshop),
  makeShot("08-thirty-six", 137, 153, "workshop", updateWorkshop),
  makeShot("09-caseless", 153, 181, "basement", updateBasement),
  makeShot("10-four-tests", 181, 199, "basement", updateBasement),
  makeShot("11-no-record", 199, 212, "base", updateBase),
  makeShot("12-departure", 212, 220, "space", updateDeparture),
  makeShot("13-independent-existence", 220, 244, "space", updateDrift),
  makeShot("14-the-hatch", 244, 264, "space", updateHatch),
  makeShot("15-the-photograph", 264, 278, "space", updatePhoto),
  makeShot("16-the-scope", 278, 288, "space", updatePreparation),
  makeShot("17-thirty-flashes", 288, 306, "space", updateFiring),
  makeShot("18-ten-seconds", 306, 314, "space", updateFlight),
  makeShot("19-meteorite-rain", 314, 333, "space", updateImpact),
  makeShot("20-direction", 333, DURATION, "space", updateCoda),
];

validateVoiceCues(voiceCues, DURATION);
const player = new CinematicPlayer({ duration: DURATION, context, shots, cues: [...voiceCues, ...soundCues] });
const audio = new WebAudioCueBus(player);
registerAudio(audio);
const stage = new ThreeStage({ player, renderer: renderer as unknown as ThreeRendererLike, scene, camera: () => camera, container: stageElement, maxPixelRatio: 1.5 });
const controls = mountCinematicControls({ player, audio, container: app, showFullscreen: true });

const chapterElement = document.querySelector<HTMLDivElement>("#chapter-name")!;
const timecodeElement = document.querySelector<HTMLDivElement>("#timecode")!;
const openingTitle = document.querySelector<HTMLDivElement>("#opening-title")!;
const endTitle = document.querySelector<HTMLDivElement>("#end-title")!;
const scopeOverlay = document.querySelector<HTMLDivElement>("#scope-overlay")!;
const fade = document.querySelector<HTMLDivElement>("#fade")!;
const chapters: Array<[number, string]> = [
  [0, "序 · 无声"], [20, "一块石头"], [28, "一 · 收藏家"], [111, "二 · 三十六段"], [153, "三 · 地下室"], [199, "四 · 离开记录"], [220, "五 · 失重"], [244, "六 · 合影"], [314, "七 · 陨石雨"], [333, "尾 · 方向"],
];
function chapterAt(time: number): string {
  let result = chapters[0]![1];
  for (const [start, name] of chapters) if (time >= start) result = name;
  return result;
}
function timecode(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
}
function updateInterface(time: number): void {
  chapterElement.textContent = chapterAt(time);
  timecodeElement.innerHTML = `${timecode(time)} <span>/ 05:42</span>`;
  openingTitle.classList.toggle("visible", time >= 2.2 && time < 10.8);
  endTitle.classList.toggle("visible", time >= 337.2);
  scopeOverlay.classList.toggle("visible", (time >= 283 && time < 288) || (time >= 295 && time < 301));
  let opacity = 0;
  for (const cut of [20, 28, 111, 153, 199, 220, 333]) opacity = Math.max(opacity, 1 - Math.abs(time - cut) / 0.16);
  if (time > 340.8) opacity = Math.max(opacity, smoothstep((time - 340.8) / 1.2) * 0.72);
  fade.style.opacity = String(clamp01(opacity));
}
player.addTypedEventListener("frame", ({ detail }) => updateInterface(detail.time));
updateInterface(0);

// A small keyboard transport is useful for a cinema screen and does not create a second timeline.
window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement) return;
  if (event.code === "Space") { event.preventDefault(); void audio.unlock().then(() => player.isPlaying ? player.pause() : player.play()); }
  if (event.code === "ArrowRight") player.seek(Math.min(DURATION, player.currentTime + 5));
  if (event.code === "ArrowLeft") player.seek(Math.max(0, player.currentTime - 5));
});

// Kept intentionally inspectable for the local browser verification pass.
Object.assign(window, { __meteoriteRain: { player, audio, stage, controls, voiceCues, soundCues, duration: DURATION } });
