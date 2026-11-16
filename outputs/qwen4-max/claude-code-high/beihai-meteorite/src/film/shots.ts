import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import { applyPose, idle, walk, aim, float, lerpPose, type Pose } from "@agentbench/voxel-kit";
import { driveCamera, dolly, ramp, envelope, V, lerp, clamp01, hash, type CamKey } from "./helpers";
import { showOnly, dressZhang, type FilmContext } from "./world";
import { setSunElevation, STATION_POS, PHOTO_CENTER } from "./space";
import { meteoriteProp, voxelMaterial } from "./cast";

type Ctx = FilmContext;
type S = Shot<Ctx>;

function bg(ctx: Ctx, color: number, fog?: number, density = 0.02): void {
  (ctx.scene.background as THREE.Color).setHex(color);
  if (fog !== undefined) {
    ctx.scene.fog = new THREE.FogExp2(fog, density);
  } else {
    ctx.scene.fog = null;
  }
}

/** Centralized, seek-safe attendee performance for the space act. */
function updateAttendees(ctx: Ctx, time: number): void {
  const exit = V(0, 6, -150);
  for (const m of ctx.attendees) {
    const root = m.figure.root;
    const home = root.userData.home as THREE.Vector3;
    const idx = root.userData.idx as number;
    const isHit = ctx.hitIdx.includes(idx);
    // visibility: inside before emergence, inside after retreat
    const out = time >= 260 && time < 319;
    root.visible = out;
    if (!out) continue;
    // visor state (only swap textures when the state actually changes)
    const visor = time < 264 ? "gold" : (time >= 307 && idx === 4) ? "cracked" : "clear";
    if (root.userData.visor !== visor) {
      root.userData.visor = visor;
      m.figure.setClothes(visor === "gold" ? m.suitGold : visor === "cracked" ? m.suitCracked : m.suitClear);
    }
    // position
    if (time < 266) {
      const k = ramp(time, 260, 266);
      root.position.lerpVectors(exit, home, k);
    } else if (time < 312) {
      root.position.copy(home);
      root.position.y += Math.sin(time * 0.5 + idx) * 0.3;
      root.position.x += Math.sin(time * 0.3 + idx * 2) * 0.2;
    } else {
      const k = ramp(time, 312, isHit ? 319 : 317);
      root.position.lerpVectors(home, exit, k);
      root.position.y += Math.sin(time * 2 + idx) * 0.2 * (1 - k);
    }
    applyPose(m.figure, float(time + idx));
    // flee orientation: turn toward exit
    if (time >= 312) root.rotation.y = Math.PI * ramp(time, 312, 314);
    else root.rotation.y = 0;
  }
  // photographer
  const ph = ctx.photographer.figure.root;
  ph.visible = time >= 260 && time < 319;
  if (ph.visible) {
    applyPose(ctx.photographer.figure, float(time));
    const pv = time < 264 ? "gold" : "clear";
    if (ph.userData.visor !== pv) {
      ph.userData.visor = pv;
      ctx.photographer.figure.setClothes(pv === "gold" ? ctx.photographer.suitGold : ctx.photographer.suitClear);
    }
    if (time >= 312) ph.position.lerpVectors(V(24, PHOTO_CENTER.y + 2, PHOTO_CENTER.z + 16), exit, ramp(time, 312, 317));
  }
}

/** Zhang's floating performance in space. */
function zhangFloat(ctx: Ctx, time: number, aiming = false): void {
  const f = ctx.zhang.figure;
  if (aiming) {
    const a = aim(-0.06, 0);
    applyPose(f, lerpPose(float(time), a, 0.85));
  } else {
    applyPose(f, float(time));
  }
}

const FIRE_TIMES = [283.0, 284.2, 285.4, 290.0, 291.2, 295.0, 296.2];

function muzzleEnvelope(time: number): number {
  let v = 0;
  for (const ft of FIRE_TIMES) v = Math.max(v, envelope(time, ft, ft + 0.02, ft + 0.05, ft + 0.16));
  return v;
}

/* ================================================================== */

export function buildShots(ctx: Ctx): S[] {
  const shots: S[] = [];

  /* S1 — cold open: a meteorite crosses the void, title. */
  shots.push({
    id: "s1-coldopen", start: 0, end: 8,
    enter: () => { showOnly(ctx, null); ctx.coldOpen.group.visible = true; bg(ctx, 0x010208); },
    update: ({ time }) => {
      const k = clamp01(time / 8);
      const p = V(lerp(-70, 14, k), lerp(46, -10, k), lerp(-150, -16, k));
      ctx.coldOpen.meteorite.position.copy(p);
      ctx.coldOpen.meteorite.rotation.set(time * 2, time * 1.3, 0);
      const dir = V(84, -56, 134).normalize();
      ctx.coldOpen.trail.position.copy(p).addScaledVector(dir, -9);
      ctx.coldOpen.trail.quaternion.setFromUnitVectors(V(0, 0, 1), dir);
      (ctx.coldOpen.trail.material as THREE.MeshBasicMaterial).opacity = 0.5 * envelope(time, 0.3, 1.2, 6.5, 8);
      ctx.camera.position.set(0, 0, 0);
      ctx.camera.up.set(0, 1, 0);
      ctx.camera.lookAt(-10, 6, -60);
      if (ctx.camera.fov !== 62) { ctx.camera.fov = 62; ctx.camera.updateProjectionMatrix(); }
    },
  });

  /* S2 — hutong dusk, Zhang walks to the door. */
  shots.push({
    id: "s2-hutong", start: 8, end: 17,
    enter: () => { showOnly(ctx, "hutong", true); dressZhang(ctx, "uniform"); bg(ctx, 0x10141f, 0x10141f, 0.022); ctx.zhang.figure.root.rotation.y = Math.PI; },
    update: ({ time, localTime }) => {
      const f = ctx.zhang.figure;
      const walkK = ramp(time, 8.5, 15);
      f.root.position.set(0, 0, lerp(4.5, -0.1, walkK));
      applyPose(f, walkK < 1 ? walk(time, 1.3) : idle(time));
      ctx.hutong.lantern.scale.setScalar(1 + Math.sin(time * 9) * 0.03);
      driveCamera(ctx.camera, [
        { t: 8, pos: V(3.2, 1.75, 7.5), look: V(0, 1.4, 0), fov: 52 },
        { t: 13, pos: V(1.8, 1.6, 3.2), look: V(0, 1.3, -0.5), fov: 46 },
        { t: 17, pos: V(1.2, 1.55, 1.8), look: V(0, 1.3, -0.7), fov: 42 },
      ], time, 0.5);
    },
  });

  /* S3 — the collector's museum of stones. */
  shots.push({
    id: "s3-room", start: 17, end: 31,
    enter: () => {
      showOnly(ctx, "room", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0a0806, 0x0a0806, 0.03);
      ctx.zhang.figure.root.position.set(-0.6, 0, 2.6);
      ctx.zhang.figure.root.rotation.y = 1.74;
      ctx.collector.root.position.set(2.4, 0, 1.9); ctx.collector.root.rotation.y = -1.34;
      ctx.collectorProps.magnifier.visible = true; ctx.collectorProps.cup.visible = false;
      ctx.zhang.cup.visible = false; ctx.zhang.pistol.visible = false; ctx.zhang.scope.visible = false;
    },
    update: ({ time }) => {
      applyPose(ctx.zhang.figure, idle(time));
      const lean: Pose = { ...idle(time), neck: [0.18, 0, 0], armR: [-1.1, 0, 0.2], hips: [0.06, 0, 0] };
      applyPose(ctx.collector, lean);
      ctx.room.dust.rotation.y = time * 0.02;
      driveCamera(ctx.camera, [
        { t: 17, pos: V(-3, 1.85, 4.9), look: V(0.5, 1.3, -1), fov: 56 },
        { t: 24, pos: V(0, 1.6, 3.7), look: V(2, 1.2, 1.2), fov: 47 },
        { t: 31, pos: V(1.2, 1.5, 3.0), look: V(2.4, 1.25, 1.6), fov: 42 },
      ], time, 0.3);
    },
  });

  /* S4 — tea, and two soldiers recognizing each other. */
  shots.push({
    id: "s4-tea", start: 31, end: 49,
    enter: () => {
      showOnly(ctx, "room", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0a0806, 0x0a0806, 0.03);
      ctx.zhang.figure.root.position.set(-1.2, 0, 1.95); ctx.zhang.figure.root.rotation.y = 2.76;
      ctx.collector.root.position.set(-0.5, 0, 0.4); ctx.collector.root.rotation.y = -0.38;
      ctx.collectorProps.magnifier.visible = false; ctx.collectorProps.cup.visible = true;
      ctx.zhang.cup.visible = true;
      ctx.room.ironStones.forEach((s) => (s.visible = false));
    },
    update: ({ time }) => {
      applyPose(ctx.zhang.figure, { ...idle(time), armR: [-0.5, 0, 0.15] });
      applyPose(ctx.collector, { ...idle(time + 1), armL: [-0.6, 0, -0.2], neck: [0.05, Math.sin(time * 0.4) * 0.1, 0] });
      driveCamera(ctx.camera, [
        { t: 31, pos: V(-3.0, 1.7, 1.7), look: V(-0.85, 1.25, 1.2), fov: 46 },
        { t: 40, pos: V(-2.7, 1.6, 1.3), look: V(-0.85, 1.3, 1.2), fov: 44 },
        { t: 49, pos: V(-2.5, 1.6, 1.0), look: V(-0.85, 1.3, 1.2), fov: 44 },
      ], time, 0.25);
    },
  });

  /* S5 — Antarctica, and a new alien world in every stone. */
  shots.push({
    id: "s5-antarctica", start: 49, end: 65,
    enter: () => {
      showOnly(ctx, "room", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0a0806, 0x0a0806, 0.03);
      ctx.collector.root.position.set(3.2, 0, 1.7); ctx.collector.root.rotation.y = -1.3;
      ctx.collectorProps.magnifier.visible = true; ctx.collectorProps.cup.visible = false;
      ctx.zhang.cup.visible = false;
      ctx.zhang.figure.root.position.set(0.6, 0, 2.6); ctx.zhang.figure.root.rotation.y = 1.9;
    },
    update: ({ time }) => {
      applyPose(ctx.collector, { ...idle(time), neck: [0.22, 0, 0], armR: [-1.5, 0, 0.3], hips: [0.08, 0, 0] });
      applyPose(ctx.zhang.figure, idle(time));
      driveCamera(ctx.camera, [
        { t: 49, pos: V(3.2, 1.55, 3.1), look: V(3.2, 1.5, 1.7), fov: 36 },
        { t: 57, pos: V(2.6, 1.3, 2.8), look: V(2.8, 1.1, 1.5), fov: 33 },
        { t: 61, pos: V(2.0, 1.15, 2.5), look: V(2.7, 1.0, 1.4), fov: 30 },
        { t: 65, pos: V(1.9, 1.12, 2.4), look: V(2.7, 1.0, 1.4), fov: 29 },
      ], time, 0.2);
    },
  });

  /* S6 — the Earth is a meteorite; the teacup is a meteorite. */
  shots.push({
    id: "s6-bigmeteorite", start: 65, end: 81,
    enter: () => {
      showOnly(ctx, "room", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0a0806, 0x0a0806, 0.03);
      ctx.zhang.figure.root.position.set(-1.2, 0, 1.95); ctx.zhang.figure.root.rotation.y = 2.76;
      ctx.collector.root.position.set(-0.5, 0, 0.4); ctx.collector.root.rotation.y = -0.38;
      ctx.collectorProps.magnifier.visible = false; ctx.collectorProps.cup.visible = true;
      ctx.zhang.cup.visible = true;
    },
    update: ({ time }) => {
      const raise = ramp(time, 73, 75) * (1 - ramp(time, 78, 80));
      applyPose(ctx.zhang.figure, { ...idle(time), armR: [lerp(-0.5, -1.2, raise), 0, 0.15], neck: [lerp(0, -0.1, raise), 0, 0] });
      applyPose(ctx.collector, { ...idle(time + 2), armR: [-0.9, 0, 0.4], neck: [0.05, 0.2, 0] });
      driveCamera(ctx.camera, [
        { t: 65, pos: V(-2.4, 1.5, 2.7), look: V(-0.9, 1.3, 1.1), fov: 42 },
        { t: 74, pos: V(-1.9, 1.5, 2.6), look: V(-1.1, 1.4, 1.6), fov: 38 },
        { t: 81, pos: V(-1.6, 1.5, 2.9), look: V(-0.9, 1.35, 1.1), fov: 40 },
      ], time, 0.25);
    },
  });

  /* S7 — iron meteorites, three of them, paid in full. */
  shots.push({
    id: "s7-trade", start: 81, end: 101,
    enter: () => {
      showOnly(ctx, "room", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0a0806, 0x0a0806, 0.03);
      ctx.zhang.figure.root.position.set(-1.2, 0, 1.95); ctx.zhang.figure.root.rotation.y = 2.76;
      ctx.collector.root.position.set(-0.5, 0, 0.4); ctx.collector.root.rotation.y = -0.38;
      ctx.collectorProps.cup.visible = false; ctx.zhang.cup.visible = false;
      ctx.room.ironStones.forEach((s) => (s.visible = true));
    },
    update: ({ time }) => {
      applyPose(ctx.zhang.figure, { ...idle(time), armR: [-0.4, 0, 0.1] });
      applyPose(ctx.collector, { ...idle(time + 1), armR: [-0.8, 0.3, 0.3], neck: [0.1, 0.15, 0] });
      driveCamera(ctx.camera, [
        { t: 81, pos: V(-1.6, 1.6, 2.8), look: V(-0.6, 1.0, 1.2), fov: 42 },
        { t: 92, pos: V(-0.6, 1.25, 2.15), look: V(-0.6, 0.62, 1.2), fov: 37 },
        { t: 101, pos: V(-1.4, 1.5, 2.7), look: V(-0.9, 1.2, 1.1), fov: 42 },
      ], time, 0.2);
    },
  });

  /* S8 — "out of respect for the person I'm giving them to." */
  shots.push({
    id: "s8-respect", start: 101, end: 113,
    enter: () => {
      showOnly(ctx, "room", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0a0806, 0x0a0806, 0.03);
      ctx.zhang.figure.root.position.set(-1.2, 0, 1.95); ctx.zhang.figure.root.rotation.y = 2.76;
      ctx.collector.root.position.set(-1.9, 0, 0.3); ctx.collector.root.rotation.y = 0.29;
      ctx.room.ironStones.forEach((s) => (s.visible = true));
    },
    update: ({ time }) => {
      applyPose(ctx.zhang.figure, { ...idle(time), armR: [-0.2, 0, 0.05], neck: [0.02, 0, 0] });
      applyPose(ctx.collector, { ...idle(time + 3), neck: [0.08, -0.15, 0], armR: [-0.3, 0, 0.2] });
      driveCamera(ctx.camera, [
        { t: 101, pos: V(0.0, 1.68, 0.4), look: V(-1.2, 1.5, 1.95), fov: 40 },
        { t: 113, pos: V(-0.1, 1.65, 0.55), look: V(-1.2, 1.52, 1.95), fov: 37 },
      ], time, 0.15);
    },
  });

  /* S9 — context: the elevator, the century ahead, Reinforce the Future. */
  shots.push({
    id: "s9-context", start: 113, end: 120,
    enter: () => { showOnly(ctx, "space", false); bg(ctx, 0x02030a); setSunElevation(ctx.space, 0); ctx.space.station.visible = false; ctx.space.shipyard.visible = false; ctx.space.baseOne.visible = false; ctx.space.debris.visible = false; },
    update: ({ time }) => {
      ctx.space.station.visible = false;
      ctx.space.climber.position.y = lerp(-100, 180, ramp(time, 113, 120));
      ctx.space.earth.rotation.y = time * 0.01;
      driveCamera(ctx.camera, [
        { t: 113, pos: V(10, -30, -250), look: V(0, 40, -300), fov: 52 },
        { t: 120, pos: V(10, 30, -250), look: V(0, 160, -300), fov: 52 },
      ], time, 0.3);
    },
    leave: () => { ctx.space.station.visible = true; ctx.space.shipyard.visible = true; ctx.space.baseOne.visible = true; ctx.space.debris.visible = true; },
  });

  /* S10 — the CNC machine cuts the meteorites into segments. */
  shots.push({
    id: "s10-workshop", start: 120, end: 136,
    enter: () => { showOnly(ctx, "workshop", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0c1018, 0x0c1018, 0.025); ctx.zhang.figure.root.position.set(0, 0, 0.3); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.pistol.visible = false; ctx.zhang.cup.visible = false; ctx.zhang.scope.visible = false; },
    update: ({ time, localTime }) => {
      applyPose(ctx.zhang.figure, { ...idle(time), armR: [-0.7, 0, 0.2], armL: [-0.5, 0, -0.2], neck: [0.15, 0, 0] });
      ctx.workshop.spindle.position.x = Math.sin(localTime * 1.6) * 0.8;
      ctx.workshop.spindle.position.y = 2.0 + Math.sin(localTime * 3) * 0.05;
      const spark = ctx.workshop.sparks;
      const mat = spark.material as THREE.PointsMaterial;
      const active = (localTime % 1.6) < 1.2;
      mat.opacity = active ? 0.8 : 0;
      const pos = spark.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const a = hash(i * 3.7) * Math.PI * 2, r = hash(i * 1.3) * 0.4 * ((localTime * 3 + i) % 1);
        pos.setXYZ(i, ctx.workshop.cutPoint.x + Math.cos(a) * r, ctx.workshop.cutPoint.y + hash(i) * 0.3 * ((localTime * 3 + i) % 1), ctx.workshop.cutPoint.z + Math.sin(a) * r);
      }
      pos.needsUpdate = true;
      driveCamera(ctx.camera, [
        { t: 120, pos: V(-3.2, 1.9, 2.8), look: V(0, 1.3, -1.6), fov: 46 },
        { t: 128, pos: V(-2.4, 1.7, 2.0), look: V(0, 1.4, -1.6), fov: 42 },
        { t: 136, pos: V(-1.6, 1.6, 1.6), look: V(0, 1.3, -1.6), fov: 40 },
      ], time, 0.3);
    },
  });

  /* S11 — every shaving collected, the special blade removed. */
  shots.push({
    id: "s11-shavings", start: 136, end: 144,
    enter: () => { showOnly(ctx, "workshop", true); dressZhang(ctx, "uniform"); bg(ctx, 0x0c1018, 0x0c1018, 0.025); ctx.zhang.figure.root.position.set(0, 0, 0.3); ctx.zhang.figure.root.rotation.y = Math.PI; },
    update: ({ time }) => {
      applyPose(ctx.zhang.figure, { ...idle(time), hips: [0.12, 0, 0], armR: [-1.0, 0, 0.3], armL: [-0.8, 0, -0.3], neck: [0.3, 0, 0] });
      (ctx.workshop.sparks.material as THREE.PointsMaterial).opacity = 0;
      driveCamera(ctx.camera, [
        { t: 136, pos: V(1.6, 1.5, 0.2), look: V(0, 1.0, -1.4), fov: 38 },
        { t: 144, pos: V(1.2, 1.4, -0.2), look: V(0, 1.05, -1.5), fov: 35 },
      ], time, 0.2);
    },
  });

  /* S12 — the basement: meteorite segments glued to propellant. */
  shots.push({
    id: "s12-basement", start: 144, end: 160,
    enter: () => { showOnly(ctx, "basement", true); dressZhang(ctx, "uniform"); bg(ctx, 0x080604, 0x080604, 0.04); ctx.zhang.figure.root.position.set(-0.7, 0, 0.3); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.pistol.visible = false; ctx.basement.muzzle.intensity = 0; (ctx.basement.muzzleFlash.material as THREE.MeshBasicMaterial).opacity = 0; },
    update: ({ time }) => {
      applyPose(ctx.zhang.figure, { ...idle(time), hips: [0.1, 0, 0], armR: [-0.9, 0, 0.25], armL: [-0.7, 0, -0.25], neck: [0.25, 0, 0] });
      ctx.basement.bulb.intensity = 16 + Math.sin(time * 13) * 0.6;
      driveCamera(ctx.camera, [
        { t: 144, pos: V(-2.2, 1.6, 1.8), look: V(-0.7, 0.9, -0.6), fov: 43 },
        { t: 152, pos: V(-1.8, 1.4, 1.3), look: V(-0.7, 0.86, -0.6), fov: 40 },
        { t: 160, pos: V(-1.3, 1.45, 1.2), look: V(-0.7, 0.9, -0.6), fov: 40 },
      ], time, 0.2);
    },
  });

  /* S13 — the test shot. The basement explodes with sound. */
  shots.push({
    id: "s13-testshot", start: 160, end: 178,
    enter: () => {
      showOnly(ctx, "basement", true); dressZhang(ctx, "uniform"); bg(ctx, 0x080604, 0x080604, 0.04);
      ctx.zhang.figure.root.position.set(-0.2, 0, 0.8); ctx.zhang.figure.root.rotation.y = 2.52;
      ctx.zhang.pistol.visible = true; ctx.zhang.scope.visible = false;
    },
    update: ({ time, localTime }) => {
      const raise = ramp(time, 160.5, 163);
      applyPose(ctx.zhang.figure, lerpPose(idle(time), aim(-0.12, 0), raise));
      const flash = envelope(localTime, 5.0, 5.02, 5.06, 5.4);
      ctx.basement.muzzle.intensity = flash * 50;
      const fm = ctx.basement.muzzleFlash.material as THREE.MeshBasicMaterial;
      fm.opacity = flash;
      ctx.basement.muzzleFlash.scale.setScalar(0.6 + flash * 1.6);
      ctx.basement.muzzleFlash.lookAt(ctx.camera.position);
      // recoil
      ctx.zhang.figure.root.position.z = 0.8 + flash * 0.06;
      driveCamera(ctx.camera, [
        { t: 160, pos: V(-1.9, 1.6, 1.4), look: V(0.6, 1.15, -0.8), fov: 50 },
        { t: 164, pos: V(-1.7, 1.5, 0.9), look: V(0.7, 1.1, -0.9), fov: 48 },
        { t: 166, pos: V(-1.6, 1.5, 0.5), look: V(0.8, 1.1, -1.0), fov: 48 },
        { t: 178, pos: V(0.2, 1.25, 0.6), look: V(1.3, 0.95, -1.3), fov: 38 },
      ], time, flash * 1.5 + 0.2);
    },
    leave: () => { ctx.basement.muzzle.intensity = 0; (ctx.basement.muzzleFlash.material as THREE.MeshBasicMaterial).opacity = 0; },
  });

  /* S14 — the meteorite is gravel now. Nature will take the blame. */
  shots.push({
    id: "s14-gravel", start: 178, end: 188,
    enter: () => {
      showOnly(ctx, "basement", true); dressZhang(ctx, "uniform"); bg(ctx, 0x080604, 0x080604, 0.04);
      ctx.zhang.figure.root.position.set(1.0, 0, -0.4); ctx.zhang.figure.root.rotation.y = 2.6;
      ctx.zhang.pistol.visible = false;
    },
    update: ({ time }) => {
      applyPose(ctx.zhang.figure, { ...idle(time), armR: [-1.0, 0, 0.4], neck: [0.25, 0, 0], hips: [0.08, 0, 0] });
      driveCamera(ctx.camera, [
        { t: 178, pos: V(0.2, 1.35, 0.7), look: V(1.2, 1.0, -0.9), fov: 38 },
        { t: 188, pos: V(0.3, 1.25, 0.4), look: V(1.2, 1.0, -0.9), fov: 35 },
      ], time, 0.15);
    },
  });

  /* S15 — the sublime reveal: Earth, the wheel, the shipyard bones. */
  shots.push({
    id: "s15-spacereveal", start: 188, end: 202,
    enter: () => {
      showOnly(ctx, "space", true); dressZhang(ctx, "suitGold"); bg(ctx, 0x02030a);
      setSunElevation(ctx.space, 0);
      ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI;
      ctx.zhang.pack.visible = true; ctx.zhang.pistol.visible = false; ctx.zhang.scope.visible = false; ctx.zhang.cup.visible = false;
      ctx.space.exitDoor.position.x = 0;
      (ctx.space.exitLight.material as THREE.MeshStandardMaterial).emissive.setHex(0xd04a3a);
    },
    update: ({ time }) => {
      zhangFloat(ctx, time);
      updateAttendees(ctx, time);
      ctx.space.earth.rotation.y = time * 0.008;
      ctx.space.climber.position.y = ((time * 8) % 400) - 160;
      ctx.space.debris.rotation.y = time * 0.003;
      driveCamera(ctx.camera, [
        { t: 188, pos: V(70, 34, 50), look: V(0, 0, -170), fov: 56 },
        { t: 196, pos: V(24, 14, 12), look: V(0, 6, -150), fov: 50 },
        { t: 202, pos: V(4, 3, 6), look: V(0, 2, -120), fov: 48 },
      ], time, 0.3);
    },
  });

  /* S16 — the locator unit stays behind. No record of this exit. */
  shots.push({
    id: "s16-locator", start: 202, end: 210,
    enter: () => {
      showOnly(ctx, "space", false); bg(ctx, 0x02030a);
      ctx.locator.visible = true; ctx.locator.position.set(-262, 40, -392);
      ctx.space.station.visible = false; ctx.space.debris.visible = false;
    },
    update: ({ time }) => {
      ctx.locator.rotation.y = time * 0.3;
      const blink = (Math.sin(time * 6) > 0.6) ? 1 : 0.2;
      ctx.locator.scale.setScalar(1);
      driveCamera(ctx.camera, [
        { t: 202, pos: V(-250, 42, -378), look: V(-266, 40, -396), fov: 42 },
        { t: 210, pos: V(-256, 41, -386), look: V(-266, 40, -396), fov: 36 },
      ], time, 0.2);
    },
    leave: () => { ctx.space.station.visible = true; ctx.space.debris.visible = true; ctx.locator.visible = false; },
  });

  /* S17 — the wait. A tiny figure against the abyss. */
  shots.push({
    id: "s17-wait", start: 210, end: 222,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitGold"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.pack.visible = true; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 0.15);
      zhangFloat(ctx, time);
      updateAttendees(ctx, time);
      ctx.space.earth.rotation.y = time * 0.008;
      driveCamera(ctx.camera, [
        { t: 210, pos: V(3, 2, 5), look: V(0, 1, -100), fov: 50 },
        { t: 222, pos: V(9, 4, 15), look: V(0, 2, -120), fov: 55 },
      ], time, 0.25);
    },
  });

  /* S18 — the void. "Just existing." The still center of the film. */
  shots.push({
    id: "s18-void", start: 222, end: 246,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitGold"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 0.3);
      zhangFloat(ctx, time * 0.6);
      updateAttendees(ctx, time);
      ctx.space.earth.rotation.y = time * 0.006;
      driveCamera(ctx.camera, [
        { t: 222, pos: V(-2, 2, 7), look: V(0, 1.2, -40), fov: 48 },
        { t: 234, pos: V(-3.5, 2.8, 10), look: V(0, 1, -60), fov: 50 },
        { t: 246, pos: V(-2, 3.2, 12), look: V(0, 0.5, -80), fov: 52 },
      ], time, 0.15);
    },
  });

  /* S19 — sunset begins. The scope finds the closed door. */
  shots.push({
    id: "s19-sunset", start: 246, end: 258,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitGold"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.scope.visible = true; ctx.zhang.pistol.visible = false; },
    update: ({ time }) => {
      setSunElevation(ctx.space, lerp(0.5, 0.66, ramp(time, 246, 258)));
      const raise = ramp(time, 247, 249);
      applyPose(ctx.zhang.figure, lerpPose(float(time), { ...aim(-0.05, 0), armL: [-0.6, 0, -0.3] }, raise));
      updateAttendees(ctx, time);
      ctx.space.earth.rotation.y = time * 0.006;
      driveCamera(ctx.camera, [
        { t: 246, pos: V(1.6, 2.1, 1.6), look: V(0, 4, -150), fov: 45 },
        { t: 252, pos: V(0.3, 1.75, -0.4), look: V(0, 5, -160), fov: 28 },
        { t: 258, pos: V(0, 1.62, -0.45), look: V(0, 6, -160), fov: 16 },
      ], time, 0.15);
    },
  });

  /* S20 — the airlock opens; the conference poses for history. */
  shots.push({
    id: "s20-airlock", start: 258, end: 270,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitGold"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.scope.visible = true; ctx.zhang.pistol.visible = false; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 0.72);
      applyPose(ctx.zhang.figure, { ...float(time), armR: [-1.4, 0, 0.2] });
      updateAttendees(ctx, time);
      // airlock light red -> green, door slides
      const green = ramp(time, 259, 260);
      (ctx.space.exitLight.material as THREE.MeshStandardMaterial).emissive.setHex(green > 0.5 ? 0x4ad06a : 0xd04a3a);
      ctx.space.exitDoor.position.x = green * 3.6;
      ctx.space.earth.rotation.y = time * 0.006;
      driveCamera(ctx.camera, [
        { t: 258, pos: V(0, 1.62, -0.45), look: V(0, 6, -150), fov: 18 },
        { t: 264, pos: V(8, 9, -70), look: V(0, 9, -104), fov: 40 },
        { t: 270, pos: V(6, 8.5, -66), look: V(0, 9, -104), fov: 38 },
      ], time, 0.2);
    },
  });

  /* S21 — lock the three. Glove off, pistol drawn, scope mounted. */
  shots.push({
    id: "s21-lock", start: 270, end: 282,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitClear"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.scope.visible = false; ctx.zhang.pistol.visible = false; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 0.8);
      updateAttendees(ctx, time);
      ctx.space.earth.rotation.y = time * 0.006;
      if (time < 275.5) {
        // scope POV on the front-row targets
        applyPose(ctx.zhang.figure, { ...float(time), armR: [-1.5, 0, 0.1] });
        ctx.camera.position.set(0, 1.62, -0.45);
        ctx.camera.up.set(0, 1, 0);
        ctx.camera.lookAt(0, 6, -104);
        if (ctx.camera.fov !== 6) { ctx.camera.fov = 6; ctx.camera.updateProjectionMatrix(); }
      } else {
        // the drilled draw: glove off, pistol up, scope seated
        const k = ramp(time, 275.5, 279);
        ctx.zhang.pistol.visible = k > 0.3;
        ctx.zhang.scope.visible = k > 0.6;
        applyPose(ctx.zhang.figure, lerpPose(float(time), aim(-0.06, 0), k));
        // reveal the bare right hand (remove the suit sleeve shell)
        ctx.zhang.figure.clothing.armR.visible = k < 0.5;
        driveCamera(ctx.camera, [
          { t: 275.5, pos: V(2.7, 1.6, 0.7), look: V(0, 1.3, 0), fov: 42 },
          { t: 282, pos: V(2.3, 1.5, 0.2), look: V(0, 1.4, 0), fov: 38 },
        ], time, 0.2);
      }
    },
    leave: () => { ctx.zhang.figure.clothing.armR.visible = true; },
  });

  /* S22 — thirty silent flashes. A firefly in the dark. */
  shots.push({
    id: "s22-fire", start: 282, end: 298,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitClear"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.pistol.visible = true; ctx.zhang.scope.visible = true; ctx.zhang.figure.clothing.armR.visible = false; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 0.85);
      updateAttendees(ctx, time);
      const me = muzzleEnvelope(time);
      applyPose(ctx.zhang.figure, { ...aim(-0.06 + me * 0.04, 0), lift: me * 0.3 });
      ctx.zhang.flash.visible = me > 0.01;
      (ctx.zhang.flash.material as THREE.MeshBasicMaterial).opacity = me;
      ctx.zhang.flash.scale.setScalar(0.7 + me * 1.8);
      ctx.zhang.flash.lookAt(ctx.camera.position);
      ctx.zhang.flashLight.intensity = me * 20;
      ctx.space.earth.rotation.y = time * 0.006;
      driveCamera(ctx.camera, [
        { t: 282, pos: V(2.6, 1.6, 1.8), look: V(0, 1.45, -1), fov: 42 },
        { t: 290, pos: V(2.4, 1.55, 1.3), look: V(0, 1.45, -1), fov: 40 },
        { t: 298, pos: V(2.6, 1.6, 1.6), look: V(0, 1.5, -1), fov: 42 },
      ], time, 0.25 + me * 0.8);
    },
    leave: () => { ctx.zhang.flash.visible = false; ctx.zhang.flashLight.intensity = 0; ctx.zhang.figure.clothing.armR.visible = true; },
  });

  /* S23 — ten seconds of flight. Pray they do not drift. */
  shots.push({
    id: "s23-flight", start: 298, end: 306,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitClear"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.pistol.visible = true; ctx.zhang.scope.visible = true; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 0.88);
      applyPose(ctx.zhang.figure, aim(-0.06, 0));
      updateAttendees(ctx, time);
      const k = ramp(time, 298, 306);
      const gun = V(0, 1.5, 0.6);
      for (let i = 0; i < 30; i++) {
        const b = ctx.space.bullets[i];
        b.visible = true;
        // assign targets: 10 each to the three, a few diverted to the others
        let targetIdx: number;
        if (i < 10) targetIdx = i === 7 ? 12 : 3;
        else if (i < 20) targetIdx = i === 15 ? 21 : 4;
        else targetIdx = 5;
        const home = ctx.attendees[targetIdx].figure.root.userData.home as THREE.Vector3;
        const spread = V((hash(i * 3.1) - 0.5) * 1.2, (hash(i * 7.7) - 0.5) * 1.2, 0);
        const end = home.clone().add(spread);
        b.position.lerpVectors(gun, end, k);
        b.lookAt(end);
      }
      ctx.space.earth.rotation.y = time * 0.006;
      driveCamera(ctx.camera, [
        { t: 298, pos: V(0, 1.62, -0.6), look: V(0, 6, -104), fov: 28 },
        { t: 302, pos: V(0, 3.5, -45), look: V(0, 6, -104), fov: 24 },
        { t: 306, pos: V(0, 5.5, -82), look: V(0, 6, -104), fov: 20 },
      ], time, 0.1);
    },
    leave: () => { for (const b of ctx.space.bullets) b.visible = false; },
  });

  /* S24 — "Meteorite shower!" Gas, ice, and the flight back. */
  shots.push({
    id: "s24-impact", start: 306, end: 320,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitClear"); bg(ctx, 0x02030a); ctx.zhang.figure.root.position.set(0, 0, 0); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.pistol.visible = true; ctx.zhang.scope.visible = true; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 0.92);
      applyPose(ctx.zhang.figure, aim(-0.06, 0));
      updateAttendees(ctx, time);
      // impacts: gas + ice at the five hit figures
      for (let i = 0; i < ctx.hitIdx.length; i++) {
        const idx = ctx.hitIdx[i];
        const home = ctx.attendees[idx].figure.root.userData.home as THREE.Vector3;
        const et = 306 + i * 0.4;
        const jet = ctx.space.gasJets[i];
        const ice = ctx.space.ice[i];
        if (time >= et) { jet.emit(home, et); ice.emit(home, et + 0.2); } else { jet.reset(); ice.reset(); }
        jet.update(time); ice.update(time);
      }
      // thruster trails for the fleeing figures
      for (let i = 0; i < ctx.space.trails.length; i++) {
        const tr = ctx.space.trails[i];
        const idx = (i * 2 + 1) % 30;
        const root = ctx.attendees[idx].figure.root;
        if (time >= 312 && root.visible) { tr.emit(root.position, 312 + (i % 4) * 0.2); } else tr.reset();
        tr.update(time);
      }
      ctx.space.earth.rotation.y = time * 0.006;
      if (time < 312) {
        ctx.camera.position.set(0, 1.62, -0.45); ctx.camera.up.set(0, 1, 0); ctx.camera.lookAt(0, 6, -104);
        if (ctx.camera.fov !== 8) { ctx.camera.fov = 8; ctx.camera.updateProjectionMatrix(); }
      } else {
        driveCamera(ctx.camera, [
          { t: 312, pos: V(8, 10, -66), look: V(0, 9, -110), fov: 42 },
          { t: 320, pos: V(6, 9, -60), look: V(0, 9, -130), fov: 45 },
        ], time, 0.25);
      }
    },
    leave: () => { for (const p of [...ctx.space.gasJets, ...ctx.space.ice, ...ctx.space.trails]) p.reset(); },
  });

  /* S25 — the long drift home. Cold and calm as the void. */
  shots.push({
    id: "s25-return", start: 320, end: 334,
    enter: () => { showOnly(ctx, "space", true); dressZhang(ctx, "suitGold"); bg(ctx, 0x02030a); ctx.zhang.figure.root.rotation.y = Math.PI; ctx.zhang.pistol.visible = false; ctx.zhang.scope.visible = false; ctx.zhang.pack.visible = true; },
    update: ({ time }) => {
      setSunElevation(ctx.space, 1.0);
      const k = ramp(time, 320, 334);
      ctx.zhang.figure.root.position.set(lerp(0, -50, k), lerp(0, 4, k), lerp(0, -70, k));
      ctx.zhang.figure.root.rotation.y = Math.PI + k * 0.6;
      zhangFloat(ctx, time);
      updateAttendees(ctx, time);
      // his own thruster mist
      const tr = ctx.space.trails[0];
      if (time >= 320.5) tr.emit(ctx.zhang.figure.root.position, 320.5); else tr.reset();
      tr.update(time);
      ctx.space.earth.rotation.y = time * 0.006;
      driveCamera(ctx.camera, [
        { t: 320, pos: V(2, 2, 5), look: V(0, 1, 0), fov: 46 },
        { t: 327, pos: V(7, 4, 18), look: V(-25, 3, -45), fov: 50 },
        { t: 334, pos: V(12, 6, 34), look: V(-60, 4, -120), fov: 55 },
      ], time, 0.2);
    },
    leave: () => { ctx.space.trails[0].reset(); },
  });

  /* S26 — coda. Earth turns. A meteorite echoes the opening. */
  shots.push({
    id: "s26-coda", start: 334, end: 345,
    enter: () => {
      showOnly(ctx, "space", false); bg(ctx, 0x02030a);
      ctx.space.station.visible = false; ctx.space.shipyard.visible = false; ctx.space.baseOne.visible = false; ctx.space.debris.visible = false; ctx.space.elevator.visible = false;
      ctx.space.bullets.forEach((b) => (b.visible = false));
    },
    update: ({ time }) => {
      setSunElevation(ctx.space, 1.0);
      ctx.space.earth.rotation.y = time * 0.005;
      ctx.space.earthGlow.rotation.y = time * 0.005;
      driveCamera(ctx.camera, [
        { t: 334, pos: V(0, 2, 12), look: V(0, -50, -240), fov: 50 },
        { t: 345, pos: V(0, 5, 16), look: V(0, -70, -280), fov: 52 },
      ], time, 0.1);
    },
    leave: () => { ctx.space.elevator.visible = true; },
  });

  return shots;
}