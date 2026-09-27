import * as THREE from "three";
import { applyPose, float, lerpPose, walk, type Pose } from "@agentbench/voxel-kit";
import { clamp01, lerp, segmentProgress, smoothstep } from "@agentbench/cinematic-player";
import { FIRE_TIMES, FLIGHT, ROUNDS, TEST_FIRES, flashes, impactOf, reactAt } from "./timeline";
import type { CrewMember, World } from "./world";

const _v = new THREE.Vector3();
const _muzzle = new THREE.Vector3();
const _target = new THREE.Vector3();
const _hold = new THREE.Vector3(0.15, 2.12, 1.25);

function breath(pose: Pose, time: number, amp = 1): Pose {
  const sway = Math.sin(time * 1.45) * amp;
  const neck = pose.neck ?? [0, 0, 0];
  return {
    ...pose,
    neck: [neck[0] + sway * 0.012, neck[1], neck[2] ?? 0],
    lift: (pose.lift ?? 0) + sway * 0.045,
  };
}

function zhangPoint(time: number, out: THREE.Vector3): THREE.Vector3 {
  if (time < 324) {
    const amp = time < 282 ? 0.07 : time < 300 ? 0.012 : 0.035;
    out.set(
      _hold.x + Math.sin(time * 0.17) * amp,
      _hold.y + Math.sin(time * 0.23) * amp * 0.75,
      _hold.z + Math.cos(time * 0.13) * amp * 0.45,
    );
    return out;
  }
  const u = smoothstep(segmentProgress(time, 324, 341));
  out.set(lerp(_hold.x, -7.6, u), lerp(_hold.y, 3.35, u), lerp(_hold.z, 9.2, u));
  return out;
}

function zhangYaw(time: number): number {
  const earth = Math.atan2(0.25, -53);
  const crew = Math.atan2(7.65, -17.7);
  if (time < 236) return earth;
  if (time < 250) return lerp(earth, crew, smoothstep(segmentProgress(time, 236, 250)));
  if (time < 324) return crew;
  const away = Math.atan2(-7.75, 8);
  return lerp(crew, away, smoothstep(segmentProgress(time, 324, 330.5)));
}

function facing(yaw: number, out: THREE.Vector3): THREE.Vector3 {
  return out.set(Math.sin(yaw), 0, Math.cos(yaw));
}

function crewLocal(member: CrewMember, time: number, out: THREE.Vector3): THREE.Vector3 {
  const emerge = smoothstep(segmentProgress(time, 256, 261.8));
  const hit = impactOf(member.index);
  const react = reactAt(member.index);
  const wounded = hit !== null && (member.index === 0 || member.index === 1 || member.index === 2 || member.index === 4 || member.index === 7);
  let x = lerp(0.05, member.home.x, emerge);
  let y = lerp(0.02, member.home.y, emerge);
  let z = lerp(-5.05, member.home.z, emerge);
  const scatter = (1 - emerge) * 0.22;
  x += Math.sin(member.phase) * scatter;
  y += Math.cos(member.phase * 1.3) * scatter * 0.6;
  if (time > react + 2.6) {
    const dur = wounded ? 10.5 : 6.4;
    const u = smoothstep(segmentProgress(time, react + 2.6, react + 2.6 + dur));
    x = lerp(x, member.home.x * 0.08, u);
    y = lerp(y, 0.12, u);
    z = lerp(z, -5.35, u);
  }
  const bob = Math.sin(time * 0.55 + member.phase) * 0.04 * (time > react ? 0.25 : 1);
  out.set(x, y + bob, z);
  return out;
}

const ATTENTION: Pose = {
  hips: [0.04, 0, 0],
  neck: [0.05, 0, 0],
  armR: [0.18, 0, 0.14],
  armL: [0.16, 0, -0.14],
  legR: [-0.08, 0, 0.05],
  legL: [-0.06, 0, -0.05],
  lift: 0,
};

export function performTitle(world: World, time: number): void {
  const rock = world.title.rock;
  rock.rotation.y = time * 0.35;
  rock.rotation.x = 0.35 + Math.sin(time * 0.2) * 0.08;
  const card = world.title.card;
  const fadeIn = smoothstep(segmentProgress(time, 3.1, 5.4));
  const fadeOut = 1 - smoothstep(segmentProgress(time, 9.1, 10.7));
  const opacity = fadeIn * fadeOut;
  const material = card.material as THREE.MeshBasicMaterial;
  material.opacity = opacity;
  card.visible = opacity > 0.02;
}

export function performHouse(world: World, time: number): void {
  const { zhang, collector } = world.cast;
  const house = world.house;
  if (zhang.root.parent !== house.root) house.root.add(zhang.root);
  zhang.root.visible = true;
  collector.root.visible = true;

  if (time < 29.5) {
    const u = smoothstep(segmentProgress(time, 12.2, 29.2));
    zhang.root.position.set(0.42 - u * 0.2, 0, lerp(8.5, 0.4, u));
    zhang.root.rotation.set(0, Math.PI, 0);
    applyPose(zhang, walk(time, 1.12));
  } else if (time < 34.2) {
    const u = smoothstep(segmentProgress(time, 29.7, 33.9));
    zhang.root.position.set(lerp(0.22, -0.16, u), 0, lerp(0.4, -2.18, u));
    zhang.root.rotation.set(0, Math.PI, 0);
    applyPose(zhang, walk(time, 0.92));
  } else {
    zhang.root.position.set(-0.16, 0, -2.18);
    zhang.root.rotation.set(0, Math.PI, 0);
    const nod = Math.sin(Math.PI * segmentProgress(time, 33.1, 34.5)) * 0.24;
    const shake = Math.sin(Math.PI * segmentProgress(time, 115.0, 116.5)) * 0.26;
    const liftingCup = time > 66.4 && time < 76.6;
    const paying = time > 100.8 && time < 116.2;
    applyPose(
      zhang,
      breath(
        {
          hips: [0.02, time > 86 && time < 94 ? -0.08 : 0, 0],
          neck: [0.05 + nod, -shake, 0],
          armR: paying ? [-0.95, 0.22, 0.32] : [0.12, 0.02, 0.08],
          armL: liftingCup ? [-0.82, 0.12, -0.38] : [0.1, 0, -0.08],
        },
        time,
        0.55,
      ),
    );
  }

  collector.root.position.set(0.22, 0, -3.92);
  collector.root.rotation.set(0, 0.06, 0);
  const rising = smoothstep(segmentProgress(time, 30.5, 33.8));
  const pose = lerpPose(
    {
      hips: [0.5, 0.32, 0],
      neck: [0.46, 0.18, 0],
      armR: [-0.9, -0.15, 0.28],
      armL: [-0.42, 0, -0.22],
      lift: 0,
    },
    {
      hips: [0.02, 0.04, 0],
      neck: [0.05, -0.06, 0],
      armR: [0.16, 0, 0.1],
      armL: [0.2, 0, -0.16],
      lift: 0,
    },
    rising,
  );
  if (time > 56.6 && time < 66.6) {
    pose.armR = [-1.05, -0.32, 0.12];
    pose.neck = [0.02, -0.18, 0.03];
  } else if (time > 93.4 && time < 101) {
    pose.armR = [-0.58, -0.42, 0.18];
    pose.neck = [0.16, -0.1, 0];
  }
  if (time > 107.2 && time < 114.2) pose.neck = [0.32, 0.04, 0];
  const laugh = Math.sin(Math.PI * segmentProgress(time, 76.6, 79.4));
  if (laugh > 0) {
    pose.neck = [-0.14 * laugh, 0.12, 0.05 * laugh];
    pose.hips = [-0.05 * laugh, 0.04, 0];
  }
  applyPose(collector, breath(pose, time + 1.4, 0.85));

  const showStone = time > 56.6 && time < 66.6;
  house.handStone.visible = showStone;
  house.glass.visible = !showStone && time < 34.2;
  house.handCup.visible = time > 66.2 && time < 76.8;
  house.tableCup.visible = !(time > 66.2 && time < 76.8);
  house.phone.visible = time > 100.6 && time < 116.4;
  const shown = smoothstep(segmentProgress(time, 87.4, 89.6));
  house.irons.forEach((mesh, index) => {
    mesh.visible = shown > 0.04 && time < 126;
    mesh.scale.setScalar(0.85 + shown * 0.15);
    mesh.rotation.y = time * 0.2 + index;
  });
  zhang.root.updateMatrixWorld(true);
  collector.root.updateMatrixWorld(true);
}

export function performEpilogue(world: World, time: number): void {
  const { collector } = world.cast;
  const house = world.house;
  collector.root.visible = true;
  collector.root.position.set(0.18, 0, -3.9);
  collector.root.rotation.set(0, 0.18, 0);
  applyPose(
    collector,
    breath(
      {
        hips: [0.18, 0.12, 0],
        neck: [0.12, -0.04, 0],
        armR: [-0.55, -0.08, 0.18],
        armL: [-0.36, 0, -0.18],
        lift: 0.04,
      },
      time,
      0.7,
    ),
  );
  house.glass.visible = true;
  house.handStone.visible = false;
  house.handCup.visible = false;
  house.phone.visible = false;
  house.tableCup.visible = true;
  house.irons.forEach((mesh) => {
    mesh.visible = false;
  });
  world.cast.zhang.root.visible = false;
  collector.root.updateMatrixWorld(true);
}

export function performShop(world: World, time: number): void {
  const zhang = world.cast.zhang;
  if (zhang.root.parent !== world.shop.root) world.shop.root.add(zhang.root);
  zhang.root.visible = true;
  zhang.root.position.set(1.62, 0, 1.12);
  zhang.root.rotation.set(0, Math.PI + 0.5, 0);
  const reach = smoothstep(segmentProgress(time, 146.4, 149.4));
  applyPose(
    zhang,
    breath(
      {
        hips: [0.2, -0.18, 0],
        neck: [0.34, -0.22, 0],
        armR: [-0.95 - reach * 0.25, 0.08, 0.22],
        armL: [-0.52, -0.08, -0.28],
      },
      time,
      0.4,
    ),
  );
  const cut = segmentProgress(time, 127.5, 145.5);
  const sweep = Math.sin(cut * Math.PI * 5) * 0.5 + 0.5;
  world.shop.gantry.position.x = lerp(-1.2, 0.45, sweep);
  world.shop.spindle.position.z = lerp(-0.15, 0.22, Math.sin(time * 3.2) * 0.5 + 0.5);
  world.shop.chuck.position.set(0.08, 1.26, world.shop.spindle.position.z);
  world.shop.chuck.visible = time < 143;
  world.shop.chuck.rotation.y = time * 2.4;
  world.shop.cylinders.forEach((mesh, index) => {
    mesh.visible = cut > (index + 0.6) / 16;
  });
  zhang.root.updateMatrixWorld(true);
}

export function performPit(world: World, time: number): void {
  const zhang = world.cast.zhang;
  const pit = world.pit;
  if (zhang.root.parent !== pit.root) pit.root.add(zhang.root);
  zhang.root.visible = true;
  const approach = smoothstep(segmentProgress(time, 182.5, 186.6));
  const atBundle = time >= 186.6;
  if (time < 176) {
    zhang.root.position.set(0.42, 0, -0.05);
    zhang.root.rotation.set(0, Math.PI / 2, 0);
  } else {
    zhang.root.position.set(lerp(0.08, 0.02, approach), 0, lerp(0.72, -0.85, approach));
    zhang.root.rotation.set(0, atBundle ? Math.PI - 0.4 : Math.PI, 0);
  }

  const firing = time >= 176 && time < 182.3;
  const showing = time > 191.5;
  let pose: Pose;
  if (time < 176) {
    pose = {
      hips: [0.32, 0.08, 0],
      neck: [0.48, 0.12, 0],
      armR: [-0.95, 0.18, 0.28],
      armL: [-0.72, -0.08, -0.32],
    };
  } else if (showing) {
    pose = {
      hips: [0.08, -0.2, 0],
      neck: [0.42, -0.15, 0],
      armR: [-1.05, 0.45, 0.35],
      armL: [-0.35, 0, -0.2],
    };
  } else if (!firing && time < 188.5) {
    pose = walk(time, 0.8);
    pose.neck = [0.2, 0, 0];
  } else if (time >= 188.5 && time < 191.5) {
    pose = {
      hips: [0.28, 0.1, 0],
      neck: [0.5, 0.05, 0],
      armR: [-0.7, 0.15, 0.3],
      armL: [-0.85, -0.1, -0.25],
    };
  } else {
    const kick = flashes(TEST_FIRES, time, 0.14) * 0.22;
    pose = {
      hips: [0.06, 0.12, 0],
      neck: [0.08, 0.16, 0],
      armR: [-Math.PI / 2 + 0.08 - kick, 0.06, 0.16],
      armL: [-0.55, 0.05, -0.32],
      legR: [0.06, 0, 0.04],
      legL: [-0.04, 0, -0.04],
    };
  }
  applyPose(zhang, breath(pose, time, firing ? 0.25 : 0.5));

  const armed = time > 176.4 && time < 192;
  if (pit.pistol.parent !== zhang.anchors.handR) zhang.anchors.handR.add(pit.pistol);
  pit.pistol.visible = armed && !showing;
  pit.pistol.position.set(0, 0.05, 0.15);
  pit.pistol.rotation.set(0, 0, 0);
  pit.pistol.scale.setScalar(1);
  pit.knife.visible = time > 188.2 && time < 192.4;
  pit.crumbs.visible = time > 191.6;
  const open = smoothstep(segmentProgress(time, 186.8, 188.6));
  pit.clothL.position.x = -0.15 - open * 0.28;
  pit.clothR.position.x = 0.15 + open * 0.32;
  pit.clothL.rotation.z = -open * 0.4;
  pit.clothR.rotation.z = open * 0.35;
  pit.beef.visible = open > 0.35;
  pit.holes.forEach((hole, index) => {
    hole.visible = time > TEST_FIRES[index]! + 0.05 && open < 0.2;
  });
  const flash = flashes(TEST_FIRES, time, 0.09);
  pit.muzzle.intensity = flash * 56;
  pit.muzzle.position.set(0.05, 1.38, 0.22);
  pit.bulb.intensity = 28 + Math.sin(time * 19) * 1.1 + flash * 10;
  pit.smoke.forEach((mesh, index) => {
    const start = TEST_FIRES[index % TEST_FIRES.length]!;
    const age = time - start;
    const column = Math.floor(index / TEST_FIRES.length);
    mesh.visible = age > 0 && age < 3.4;
    if (!mesh.visible) return;
    mesh.position.set(0.08 + column * 0.12, 1.25 + age * 0.28, 0.15 - age * 0.05);
    mesh.scale.setScalar(0.4 + age * 0.7);
  });
  zhang.root.updateMatrixWorld(true);
}

export function performSpace(world: World, time: number): void {
  const fig = world.cast.zhangSpace;
  const space = world.space;
  zhangPoint(time, _v);
  fig.root.position.copy(_v);
  const yaw = zhangYaw(time);
  fig.root.rotation.set(0, yaw, 0);
  fig.setClothes(time >= 279.4 ? world.cast.suitOff : world.cast.suitOn);

  const pose = spacePose(time, yaw);
  applyPose(fig, pose);

  const gloveOff = time >= 279.4;
  if (!gloveOff) {
    if (space.glove.parent !== fig.anchors.handR) fig.anchors.handR.add(space.glove);
    space.glove.visible = true;
    space.glove.scale.setScalar(1.15);
    space.glove.position.set(0, 0.15, 0.55);
    space.glove.rotation.set(0, 0, 0);
  } else {
    space.root.add(space.glove);
    const age = time - 279.4;
    space.glove.visible = age < 14;
    space.glove.scale.setScalar(fig.root.scale.x * 1.15);
    facing(yaw, _muzzle);
    space.glove.position.set(
      _v.x + _muzzle.x * 0.35 + Math.cos(yaw) * 0.28,
      _v.y + 1.42 - age * 0.015,
      _v.z + _muzzle.z * 0.35,
    );
    space.glove.rotation.set(age * 0.4, age * 0.2, 0);
  }

  const pistol = space.pistol;
  const scope = space.scope;
  const inHand = time >= 283.1;
  if (inHand) {
    if (pistol.parent !== fig.anchors.handR) fig.anchors.handR.add(pistol);
    pistol.position.set(0, 0.02, 0.12);
    pistol.rotation.set(0, 0, 0);
    pistol.scale.setScalar(1);
  } else {
    if (pistol.parent !== fig.anchors.hipR) fig.anchors.hipR.add(pistol);
    pistol.position.set(0.15, -1.4, 0.35);
    pistol.rotation.set(1.15, 0.15, 0.35);
    pistol.scale.setScalar(1);
  }
  pistol.visible = true;

  fig.root.updateMatrixWorld(true);
  const scopeMounted = time >= 286.5;
  const scopeInHand = time < 276.4;
  if (scopeMounted) {
    if (scope.parent !== pistol) pistol.add(scope);
    scope.visible = true;
    scope.scale.setScalar(1);
    scope.position.set(0, 1.35, 0.45);
    scope.rotation.set(0, 0, 0);
  } else if (scopeInHand) {
    if (scope.parent !== fig.anchors.handL) fig.anchors.handL.add(scope);
    scope.visible = time > 246;
    scope.scale.setScalar(1);
    scope.position.set(0.1, 0.2, 1.1);
    scope.rotation.set(0.2, 0, 0);
  } else {
    space.root.add(scope);
    scope.visible = true;
    scope.scale.setScalar(fig.root.scale.x);
    facing(yaw, _muzzle);
    scope.position.set(_v.x + _muzzle.x * 0.55, _v.y + 1.55, _v.z + _muzzle.z * 0.55);
    scope.rotation.set(0, yaw, 0.1);
  }

  const plume = fig.anchors.back.getObjectByName("zhang-plume");
  if (plume) {
    plume.visible = time > 324.5 && time < 340.5;
    const pulse = 0.85 + Math.sin(time * 28) * 0.2;
    plume.scale.setScalar(pulse);
  }

  const sunF = clamp01((time - 226) / 78);
  space.sun.position.set(lerp(20, 1.1, sunF), lerp(15, 4.4, sunF), lerp(-38, -62, sunF));
  space.earth.rotation.y = time * 0.012;
  space.clouds.rotation.y = time * 0.009;
  space.atmo.rotation.y = time * 0.012;

  const doorOpen = smoothstep(segmentProgress(time, 255.6, 258.2));
  space.door.position.x = -0.48 + doorOpen * 1.25;
  const green = time > 255.1;
  space.lamp.color.setHex(green ? 0x3dff7a : 0xff2a3a);
  space.lamp.emissive.setHex(green ? 0x3dff7a : 0xff2a3a);
  space.lamp.emissiveIntensity = green ? 2.4 : 1.6;
  space.baseLight.emissiveIntensity = 1.2 + Math.sin(time * 3) * 0.4;

  const shouting = time >= 302.6 && time <= 306.3;
  for (const member of space.crew) {
    crewLocal(member, time, _target);
    member.fig.root.position.copy(_target);
    const react = reactAt(member.index);
    const turn = time > react + 2.3 ? smoothstep(segmentProgress(time, react + 2.3, react + 3.8)) : 0;
    member.fig.root.rotation.y = lerp(0, Math.PI, turn);
    const order = smoothstep(segmentProgress(time, 258, 265));
    let body = lerpPose(float(time * 0.72 + member.phase), ATTENTION, lerp(0.15, 0.84, order));
    if (member.role === "photo" && time < react) {
      body = {
        ...body,
        armR: [-1.02, 0.18, 0.08],
        armL: [-0.32, 0, -0.18],
        neck: [0.04, -0.25, 0],
      };
    }
    if (time > react) {
      const panic = smoothstep(segmentProgress(time, react, react + 1.1));
      const hard = member.index === 0 || member.index === 2 || member.index === 4;
      body = lerpPose(
        body,
        {
          hips: [0.35, 0, hard ? 0.85 : 0.2],
          neck: [hard ? 0.55 : 0.2, 0.15, 0],
          armR: [-0.45, 0, 0.55],
          armL: [-0.75, 0, -0.62],
          legR: [0.35, 0, 0.12],
          legL: [-0.15, 0, -0.1],
        },
        hard ? panic : panic * (member.index === 1 ? 0.35 : 0.55),
      );
    }
    applyPose(member.fig, breath(body, time + member.phase, 0.35));
    const back = time > react + 2.6
      ? segmentProgress(time, react + 2.6, react + 2.6 + (impactOf(member.index) !== null ? 10.2 : 6.6))
      : 0;
    member.fig.root.visible = time > 255.75 && back < 0.96;
    const arrive = time > 256.4 && time < 263.8;
    const flee = time > react + 2.8 && back < 0.92;
    const leaking = impactOf(member.index) !== null && time > impactOf(member.index)! && back < 0.95;
    member.plume.visible = arrive || flee || leaking;
    member.plume.scale.setScalar(leaking ? 1.15 : 0.75 + Math.sin(time * 26 + member.phase) * 0.18);

    const cracked = (member.index === 0 || member.index === 2) && time >= (impactOf(member.index) ?? 999) + 0.65;
    const clear = time >= 262.1;
    member.fig.setClothes(cracked ? member.look.crack : clear ? member.look.clear : member.look.gold);
    const mouth = shouting && !cracked;
    member.fig.setBody(mouth ? member.look.shout : member.look.calm);
  }

  space.crewRoot.updateMatrixWorld(true);
  fig.root.updateMatrixWorld(true);

  const flash = flashes(FIRE_TIMES, time, 0.07);
  pistol.getWorldPosition(space.muzzle.position);
  space.muzzle.intensity = flash * 18;

  ROUNDS.forEach((round, index) => {
    const mesh = space.bullets[index];
    if (!mesh) return;
    const age = time - round.t;
    mesh.visible = age >= 0 && age <= FLIGHT;
    if (!mesh.visible) return;
    muzzleAt(round.t, _muzzle);
    const member = space.crew[round.target];
    if (!member) return;
    aimPoint(member, round.t, _target);
    const u = clamp01(age / FLIGHT);
    mesh.position.lerpVectors(_muzzle, _target, u);
  });

  for (const puff of space.puffs) {
    const born = impactOf(puff.index);
    if (born === null) {
      puff.mesh.visible = false;
      continue;
    }
    const age = time - born;
    const life = puff.kind === "blood" ? 20 : 16;
    puff.mesh.visible = age > 0 && age < life;
    if (!puff.mesh.visible) continue;
    const member = space.crew[puff.index];
    if (!member) continue;
    aimPoint(member, born, _target);
    puff.mesh.position.copy(_target).addScaledVector(puff.dir, puff.speed * age);
    const fade = 1 - smoothstep(age / life);
    const scale = (puff.kind === "blood" ? 0.85 : 0.7 + age * 0.85) * Math.max(fade, 0.02);
    puff.mesh.scale.setScalar(scale);
  }

  space.debris.forEach((mesh, index) => {
    mesh.rotation.y = time * 0.15 + index;
    mesh.position.set(
      -6 + index * 2.4,
      4.2 + (index % 3) + Math.sin(time * 0.3 + index) * 0.28,
      -28 - (index % 4) * 2,
    );
  });

  space.commuters.forEach((commuter, index) => {
    const phase = time * 0.045 + index * 2.1;
    const u = (Math.sin(phase) + 1) / 2;
    commuter.root.position.set(lerp(-14, 12, u), 7.4 + index * 0.8, -32 - index * 3);
    commuter.root.rotation.y = u > 0.5 ? 0.4 : Math.PI - 0.2;
    applyPose(commuter, float(time * 0.6 + index));
  });
}

function spacePose(time: number, yaw: number): Pose {
  const crewYaw = Math.atan2(7.65, -17.7);
  const watch = lerpPose(float(time * 0.85), {
    hips: [-0.08, (yaw - crewYaw) * 0.2, 0],
    neck: [0.08, 0.05, 0],
    armL: [-1.15, -0.15, -0.35],
    armR: [-0.35, 0, 0.28],
    legR: [-0.4, 0, 0.1],
    legL: [-0.22, 0, -0.12],
  }, time > 248 && time < 276 ? 0.72 : 0.35);

  const glove = smoothstep(segmentProgress(time, 276.4, 279.6));
  const draw = smoothstep(segmentProgress(time, 282.2, 285.8));
  const aim = smoothstep(segmentProgress(time, 286.2, 289.2));
  const kick = flashes(FIRE_TIMES, time, 0.12);

  const gloves: Pose = {
    hips: [-0.12, 0.35, 0.04],
    neck: [0.18, 0.28, 0],
    armR: [-0.5, 0.15, 0.62],
    armL: [-1.25, -0.45, -0.9],
    legR: [-0.28, 0, 0.08],
    legL: [-0.12, 0, -0.08],
  };
  const drawing: Pose = {
    hips: [-0.05, 0.2, 0],
    neck: [0.12, 0.1, 0],
    armR: [-0.45, 0.55, 0.4],
    armL: [-0.7, -0.1, -0.45],
    legR: [-0.2, 0, 0.06],
    legL: [-0.1, 0, -0.06],
  };
  const aimed: Pose = {
    hips: [0.02, 0.18, 0],
    neck: [0.04, 0.22, 0],
    armR: [-Math.PI / 2 + 0.06 - kick * 0.2, 0.04, 0.12],
    armL: [-1.28, 0.22, -0.38],
    legR: [-0.18, 0, 0.08],
    legL: [-0.08, 0, -0.06],
  };
  let pose = lerpPose(watch, gloves, glove);
  pose = lerpPose(pose, drawing, draw);
  pose = lerpPose(pose, aimed, aim);
  if (time > 324) {
    pose = lerpPose(pose, float(time), smoothstep(segmentProgress(time, 324, 329)));
  }
  return breath(pose, time, time > 286 && time < 306 ? 0.2 : 0.45);
}

function muzzleAt(time: number, out: THREE.Vector3): void {
  zhangPoint(time, out);
  const yaw = zhangYaw(time);
  facing(yaw, _v);
  out.addScaledVector(_v, 0.7);
  out.y += 1.5;
  out.x += Math.cos(yaw) * 0.1;
}

function aimPoint(member: CrewMember, time: number, out: THREE.Vector3): void {
  crewLocal(member, time, out);
  out.y += member.height * 0.78;
  worldAddCrew(out);
}

function worldAddCrew(out: THREE.Vector3): void {
  out.x += 7.8;
  out.y += 3.05;
  out.z += -16.4;
}

export function scopeAlpha(time: number): number {
  const aim = smoothstep(segmentProgress(time, 286.4, 287.6)) * (1 - smoothstep(segmentProgress(time, 289.6, 290.5)));
  const impact = smoothstep(segmentProgress(time, 300.3, 301.1)) * (1 - smoothstep(segmentProgress(time, 306.2, 307.1)));
  return Math.max(aim, impact);
}
