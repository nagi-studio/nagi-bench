import * as THREE from "three";
import { applyPose } from "@agentbench/voxel-kit";
import { clamp01, easeInOutCubic, lerp, segmentProgress } from "@agentbench/cinematic-player";
import { T } from "./constants";
import { hash } from "./geom";
import {
  benchWork,
  breathIdle,
  drawPistol,
  inspectPalm,
  leanInspect,
  lerpPose,
  limpFloat,
  offerStone,
  operateCnc,
  photoPose,
  pointCabinet,
  spaceAim,
  twistGlove,
  walk,
} from "./poses";
import { setVisor, type World } from "./world";

const dummy = new THREE.Object3D();
const _f = new THREE.Vector3();

function place(figureRoot: THREE.Object3D, x: number, y: number, z: number, rotY: number): void {
  figureRoot.position.set(x, y, z);
  figureRoot.rotation.set(0, rotY, 0);
  figureRoot.visible = true;
}

function burst(
  mesh: THREE.InstancedMesh,
  time: number,
  origin: THREE.Vector3,
  t0: number,
  count: number,
  life: number,
  speed: number,
  seed: number,
  gravity = 0,
  scale = 1,
  start = 0,
): number {
  if (time < t0 || time > t0 + life) return 0;
  const age = time - t0;
  const capacity = mesh.instanceMatrix.count;
  const n = Math.min(count, Math.max(0, capacity - start));
  for (let i = 0; i < n; i++) {
    const a = hash(seed + i * 3.1);
    const b = hash(seed + i * 7.7);
    const c = hash(seed + i * 11.3);
    dummy.position.set(
      origin.x + (a - 0.5) * speed * age * 2.2,
      origin.y + (b - 0.25) * speed * age * 2.0 - gravity * age * age,
      origin.z + (c - 0.5) * speed * age * 2.2,
    );
    const s = (1 - age / life) * (0.35 + a * 0.9) * scale;
    dummy.scale.setScalar(Math.max(0.02, s));
    dummy.rotation.set(a * 6, b * 6, c * 6);
    dummy.updateMatrix();
    mesh.setMatrixAt(start + i, dummy.matrix);
  }
  return n;
}

function setCount(mesh: THREE.InstancedMesh, n: number): void {
  mesh.count = n;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.visible = n > 0;
}

function shotTime(i: number): number {
  if (i < 10) return T.fire0 + i * 0.215;
  if (i < 20) return T.reload1 + (i - 10) * 0.215;
  return T.reload2 + (i - 20) * 0.215;
}

function astroSlot(i: number): [number, number, number] {
  if (i < 3) return [(i - 1) * 1.22, 7.42, -40.8];
  if (i < 7) return [((i - 3) - 1.5) * 1.12, 7.28, -42.35];
  return [((i - 7) - 1.5) * 1.12, 7.14, -43.9];
}

function hideHandProps(world: World): void {
  const p = world.props;
  p.pistol.visible = false;
  p.pistol2.visible = false;
  p.scope.visible = false;
  p.cup.visible = false;
  p.phone.visible = false;
  p.glove.visible = false;
  p.magnifier.visible = false;
  p.cup2.visible = false;
  p.handMeteor.visible = false;
}

export function perform(world: World, time: number): void {
  hideHandProps(world);
  world.muzzle.intensity = 0;
  world.muzzleFlash.visible = false;
  setCount(world.smoke, 0);
  setCount(world.sparks, 0);
  setCount(world.tracers, 0);
  setCount(world.gas, 0);
  setCount(world.ice, 0);

  if (time < T.titleEnd) {
    world.heroMeteor.rotation.set(0.35 + Math.sin(time * 0.28) * 0.12, time * 0.18, 0.1);
    return;
  }
  if (time < T.courtyardEnd) {
    stageCourtyard(world, time);
    return;
  }
  if (time < T.bargainEnd) {
    stageInterior(world, time);
    return;
  }
  if (time < T.workshopEnd) {
    stageWorkshop(world, time);
    return;
  }
  if (time < T.basementEnd) {
    stageBasement(world, time);
    return;
  }
  stageSpace(world, time);
}

function stageCourtyard(world: World, time: number): void {
  const u = segmentProgress(time, T.walkStart, T.walkEnd);
  const z = lerp(6.4, -3.1, easeInOutCubic(u));
  const walking = time >= T.walkStart && time <= T.walkEnd;
  place(world.zhang.figure.root, 0.15, 0, z, Math.PI);
  applyPose(world.zhang.figure, walking ? walk(time, 1.15) : breathIdle(time));
}

function stageInterior(world: World, time: number): void {
  const p = world.props;
  p.magnifier.visible = time < T.collectorArrive + 2;
  p.cup2.visible = time >= 47 && time < 86;
  p.cup.visible = time >= T.teaLift && time < 100;
  p.phone.visible = time >= T.pay && time < T.bargainEnd;

  for (let i = 0; i < p.tableMeteors.length; i++) {
    const m = p.tableMeteors[i]!;
    const side = i < 3 ? -1 : 1;
    m.position.set(side * 3.55, 0.85 + (i % 3) * 0.42, -1.8 + (i % 3) * 0.9);
    m.rotation.y = time * 0.05 + i;
    m.visible = true;
  }
  for (let i = 0; i < p.iron.length; i++) {
    const m = p.iron[i]!;
    m.visible = time >= T.ironShow;
    m.position.set(-0.35 + i * 0.28, 0.46, 0.48);
    m.rotation.set(0.2, time * 0.2 + i, 0.1);
  }
  p.handMeteor.visible = time >= T.safeOpen && time < T.ironShow;
  if (p.handMeteor.visible) p.handMeteor.rotation.y = time * 0.8;

  if (time < T.collectorWalk) {
    place(world.collector.figure.root, 2.15, 0, -2.85, Math.PI);
    applyPose(world.collector.figure, lerpPose(leanInspect, breathIdle(time, 0.4), 0.15));
  } else if (time < T.collectorArrive) {
    const u = segmentProgress(time, T.collectorWalk, T.collectorArrive);
    place(
      world.collector.figure.root,
      lerp(2.15, 0.55, u),
      0,
      lerp(-2.85, 0.85, u),
      lerp(Math.PI, Math.PI * 0.92, u),
    );
    applyPose(world.collector.figure, walk(time, 1.05));
  } else if (time < 82) {
    place(world.collector.figure.root, 0.55, 0, 0.85, Math.PI);
    const talk = breathIdle(time);
    talk.armR = [-0.55 + Math.sin(time * 1.3) * 0.12, 0.2, 0.25];
    talk.neck = [0.05, -0.15 + Math.sin(time * 0.5) * 0.08, 0];
    applyPose(world.collector.figure, talk);
  } else if (time < 96) {
    place(world.collector.figure.root, 0.9, 0, 0.4, Math.PI + 0.4);
    applyPose(world.collector.figure, lerpPose(breathIdle(time), pointCabinet, 0.7));
  } else if (time < T.ironShow) {
    place(world.collector.figure.root, 2.6, 0, -2.7, -0.6);
    applyPose(world.collector.figure, lerpPose(breathIdle(time), offerStone, 0.8));
  } else {
    place(world.collector.figure.root, 0.7, 0, 0.7, Math.PI);
    const pose = lerpPose(breathIdle(time), offerStone, time < T.pay ? 0.7 : 0.2);
    if (time > T.pay) {
      pose.neck = [0.12, 0.2, 0];
      pose.armL = [-0.4, 0, -0.2];
    }
    applyPose(world.collector.figure, pose);
  }

  if (time < 30) {
    const u = segmentProgress(time, T.courtyardEnd, 30);
    place(world.zhang.figure.root, lerp(0.1, -0.7, u), 0, lerp(3.2, 1.35, u), Math.PI);
    applyPose(world.zhang.figure, u < 0.95 ? walk(time, 1.05) : breathIdle(time));
  } else {
    place(world.zhang.figure.root, -0.7, 0, 1.35, 0.08);
    if (time >= T.teaLift && time < 100) {
      applyPose(world.zhang.figure, lerpPose(breathIdle(time), {
        neck: [0.12, 0.1, 0],
        armR: [-1.08, 0.28, 0.55],
        armL: [-0.2, 0, -0.12],
      }, 0.9));
    } else if (time >= T.pay) {
      applyPose(world.zhang.figure, lerpPose(breathIdle(time), {
        armL: [-1.0, -0.25, -0.45],
        neck: [0.15, 0.12, 0],
      }, 0.85));
    } else {
      const talk = breathIdle(time);
      if (time > 88 && time < 100) talk.neck = [0.08, -0.12, 0];
      applyPose(world.zhang.figure, talk);
    }
  }
}

function stageWorkshop(world: World, time: number): void {
  place(world.zhang.figure.root, -0.15, 0, 1.05, Math.PI);
  const cutting = time >= T.cncStart && time <= T.cncEnd;
  applyPose(world.zhang.figure, cutting ? lerpPose(breathIdle(time, 0.3), operateCnc, 0.85) : lerpPose(operateCnc, breathIdle(time), 0.4));

  const cutU = segmentProgress(time, T.cncStart, T.cncEnd);
  world.gantry.position.x = 0.9 + Math.sin(time * 0.9) * 0.55;
  world.spindle.position.y = 0.72 + Math.sin(time * 9) * 0.015;
  world.cncStock.scale.setScalar(0.7 * (1 - cutU * 0.55));
  world.cncStock.position.set(0.15 + Math.sin(time * 0.9) * 0.08, 0.52, 0.15);
  world.cncStock.visible = cutU < 0.98;
  world.cncStock.rotation.y = time * 0.4;

  const shown = Math.floor(cutU * 24);
  for (let i = 0; i < 24; i++) world.cylinders.children[i]!.visible = i < shown;

  if (cutting) {
    world.spindle.getWorldPosition(_f);
    const n = burst(world.sparks, time, _f, T.cncStart, 28, T.cncEnd - T.cncStart, 0.25, 90, 1.6, 0.8);
    setCount(world.sparks, n);
  }
}

function stageBasement(world: World, time: number): void {
  const shots = [T.shot0, T.shot1, T.shot2, T.shot3];
  const firing = time >= T.loadGun && time < T.inspect;
  if (time < T.loadGun) {
    place(world.zhang.figure.root, 0.05, 0, 0.55, Math.PI);
    applyPose(world.zhang.figure, lerpPose(breathIdle(time, 0.4), benchWork, 0.9));
  } else if (firing) {
    place(world.zhang.figure.root, -0.55, 0, 0.9, Math.atan2(-1.05, 0.45));
    applyPose(world.zhang.figure, lerpPose(drawPistol, {
      hips: [0, 0.25, 0],
      neck: [0.05, 0.35, 0],
      armR: [-1.52, 0.2, 0.05],
      armL: [-0.85, 0.1, -0.3],
    }, 0.8));
    world.props.pistol.visible = true;
  } else if (time < T.beefOpen + 4) {
    place(world.zhang.figure.root, -1.15, 0, 1.15, 0.4);
    applyPose(world.zhang.figure, inspectPalm);
  } else {
    place(world.zhang.figure.root, -0.2, 0, 0.4, Math.PI);
    applyPose(world.zhang.figure, lerpPose(inspectPalm, breathIdle(time), 0.6));
  }

  const assembled = Math.min(16, Math.floor(segmentProgress(time, T.bulletWork, T.loadGun) * 16));
  for (let i = 0; i < 16; i++) {
    world.bullets.children[i]!.visible = i < assembled && time < T.loadGun + 1.2;
  }

  world.cloth.visible = true;
  world.beef.visible = time >= T.beefOpen;
  world.fragments.visible = time >= T.beefOpen + 1.5;
  if (world.fragments.visible) {
    for (let i = 0; i < world.fragments.children.length; i++) {
      const f = world.fragments.children[i]!;
      f.position.set(-0.55 + (i % 3) * 0.06, 1.12, 1.05 + Math.floor(i / 3) * 0.05);
      f.rotation.set(i, time * 0.4 + i, 0.2);
    }
  }

  let smokeN = 0;
  for (let s = 0; s < shots.length; s++) {
    const t0 = shots[s]!;
    if (time >= t0 && time < t0 + 2.4) {
      _f.set(-1.3, 0.7, 1.55);
      smokeN += burst(world.smoke, time, _f, t0, 10, 2.4, 0.35, 200 + s * 9, 0.15, 1.4, smokeN);
    }
    if (time >= t0 && time < t0 + 0.09) {
      world.muzzle.intensity = 22;
      world.props.pistol.getWorldPosition(_f);
      world.muzzle.position.copy(_f);
      world.muzzleFlash.visible = true;
    }
  }
  setCount(world.smoke, smokeN);
  if (world.bulb) {
    let flicker = 1;
    for (const t0 of shots) {
      if (time >= t0 && time < t0 + 0.12) flicker = 0.15;
    }
    world.bulb.intensity = 10 * flicker;
  }
}

function stageSpace(world: World, time: number): void {
  world.earth.rotation.y = time * 0.02;
  world.station.rotation.y = time * 0.015;
  for (let i = 0; i < world.debris.children.length; i++) {
    const d = world.debris.children[i]!;
    d.rotation.x = time * 0.05 + i;
    d.rotation.y = time * 0.03 + i * 0.4;
  }

  const sunU = segmentProgress(time, T.solitudeEnd, T.sunsetEnd);
  world.sun.position.set(lerp(38, 26, sunU), lerp(-12, -24, sunU), -96);
  world.sunLight.position.copy(world.sun.position);
  world.sunLight.intensity = lerp(2.6, 1.1, sunU);

  const hatchOpen = time >= T.hatch;
  world.hatch.position.x = hatchOpen ? lerp(0, 1.35, segmentProgress(time, T.hatch, T.hatch + 1.4)) : 0;
  world.hatchLight.color.set(hatchOpen ? 0x3dff8a : 0xff3a3a);
  world.hatchLight.intensity = hatchOpen ? 3.2 : 2.2;

  const gloveOff = time >= T.glove;
  world.props.glove.visible = time >= T.aimEnd - 16 && time < T.glove;
  world.props.pistol.visible = time >= T.gunUp && time < T.escape;
  world.props.scope.visible = time >= T.gunUp && time < T.fire0;

  const zhangY = 6.15 + Math.sin(time * 0.35) * 0.12;
  if (time < T.escape) {
    place(world.zhang.figure.root, 0.1, zhangY, 0, Math.PI);
    if (time >= T.gunUp) {
      const recoil = pulseRecoil(time);
      applyPose(world.zhang.figure, spaceAim(-0.06 + recoil, 0.02, time));
    } else if (time >= T.glove) {
      applyPose(world.zhang.figure, lerpPose(twistGlove, spaceAim(-0.04, 0, time), segmentProgress(time, T.glove, T.gunUp)));
    } else {
      const f = {
        hips: [-0.18 + Math.sin(time * 0.4) * 0.05, Math.sin(time * 0.28) * 0.16, 0.04] as [number, number, number],
        neck: [0.12, 0.18, 0] as [number, number, number],
        armR: [-0.7, 0.3, 0.55] as [number, number, number],
        armL: [-0.55, -0.1, -0.4] as [number, number, number],
        legR: [-0.45, 0, 0.12] as [number, number, number],
        legL: [-0.3, 0, -0.12] as [number, number, number],
        lift: Math.sin(time * 0.5) * 0.4,
      };
      applyPose(world.zhang.figure, f);
    }
  } else {
    const u = segmentProgress(time, T.escape, T.end);
    place(
      world.zhang.figure.root,
      lerp(0.1, 14, easeInOutCubic(u)),
      lerp(zhangY, 5.2, u),
      lerp(0, -48, easeInOutCubic(u)),
      Math.PI + 0.5,
    );
    applyPose(world.zhang.figure, {
      hips: [-0.35, 0.4, 0.1],
      neck: [0.1, 0.2, 0],
      armR: [-0.2, 0, 0.7],
      armL: [-0.2, 0, -0.7],
      legR: [-0.25, 0, 0.15],
      legL: [-0.2, 0, -0.12],
      lift: 0.3,
    });
  }

  for (let i = 0; i < world.astronauts.length; i++) {
    const actor = world.astronauts[i]!;
    const [tx, ty, tz] = astroSlot(i);
    const hit = i < 5 && time >= T.impact0 + i * 0.35;
    const retreat = time >= T.retreat;
    if (time < T.groupOut) {
      actor.figure.root.visible = false;
      continue;
    }
    actor.figure.root.visible = true;
    const fly = segmentProgress(time, T.groupOut, T.groupStop);
    let x = lerp(0.15 * (i - 5), tx, easeInOutCubic(fly));
    let y = lerp(7.2, ty, easeInOutCubic(fly));
    let z = lerp(-44.4, tz, easeInOutCubic(fly));
    if (retreat) {
      const ru = segmentProgress(time, T.retreat, T.retreat + 4.5);
      const speed = hit ? ru * 0.55 : ru;
      x = lerp(tx, 0.1 * (i - 5), easeInOutCubic(speed));
      y = lerp(ty, 7.2, easeInOutCubic(speed));
      z = lerp(tz, -44.5, easeInOutCubic(speed));
    }
    place(actor.figure.root, x, y, z, 0);
    if (hit) {
      setVisor(actor, "blood");
      applyPose(actor.figure, limpFloat(time, i * 1.7));
    } else if (time >= T.visors) {
      setVisor(actor, "clear");
      applyPose(actor.figure, photoPose(time, i));
    } else {
      setVisor(actor, "dark");
      applyPose(actor.figure, photoPose(time, i));
    }
  }

  let tracerN = 0;
  for (let i = 0; i < 30; i++) {
    const t0 = shotTime(i);
    const tHit = t0 + 10;
    if (time < t0 || time > tHit) continue;
    const u = clamp01((time - t0) / 10);
    const targetIndex = i < 10 ? 0 : i < 20 ? 1 : 2;
    const extra = i % 7 === 0 ? 3 : i % 11 === 0 ? 4 : targetIndex;
    const [tx, ty, tz] = astroSlot(extra);
    dummy.position.set(lerp(0.15, tx, u), lerp(6.9, ty + 0.35, u), lerp(0.4, tz, u));
    dummy.scale.setScalar(0.7);
    dummy.lookAt(tx, ty, tz);
    dummy.updateMatrix();
    world.tracers.setMatrixAt(tracerN, dummy.matrix);
    tracerN += 1;
    if (time >= t0 && time < t0 + 0.08 && world.props.pistol.visible) {
      world.muzzle.intensity = 14;
      world.props.pistol.getWorldPosition(_f);
      world.muzzle.position.copy(_f);
      world.muzzleFlash.visible = true;
    }
  }
  setCount(world.tracers, tracerN);

  let gasN = 0;
  let iceN = 0;
  for (let i = 0; i < 5; i++) {
    const t0 = T.impact0 + i * 0.35;
    if (time < t0) continue;
    const [tx, ty, tz] = astroSlot(i);
    _f.set(tx, ty + 0.7, tz);
    gasN += burst(world.gas, time, _f, t0, 8, 6.5, 0.55, 400 + i * 13, 0, 1.6, gasN);
    iceN += burst(world.ice, time, _f, t0 + 0.12, 6, 5.5, 0.4, 510 + i * 17, 0, 0.9, iceN);
  }
  setCount(world.gas, gasN);
  setCount(world.ice, iceN);
}

function pulseRecoil(time: number): number {
  for (let i = 0; i < 30; i++) {
    const t0 = shotTime(i);
    if (time >= t0 && time < t0 + 0.08) return -0.12;
  }
  return 0;
}
