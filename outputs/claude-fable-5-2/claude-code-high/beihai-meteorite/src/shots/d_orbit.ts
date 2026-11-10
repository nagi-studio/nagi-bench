import * as THREE from "three";
import type { Pose } from "@agentbench/voxel-kit";
import type { Ctx, ShotDef } from "../film";
import { STRIPE, TARGETS, PHOTOGRAPHER, suit } from "../cast/cast";
import { mix } from "../cast/actors";
import { SPACE } from "../sets/space";
import {
  T, BURST1, BURST2, BURST3, ORBIT_SHOTS, MAG_SWAP1, MAG_SWAP2, HATCH_GREEN, HATCH_OPEN, HATCH_CLOSE, THRUST, IMPACT,
} from "../timeline";
import { clamp, easeIn, hash1, keys, keysV, lerp, seg, shootCam, sstep, win, wobble, type V3 } from "../lib/util";
import { anchorPos, cut, frameCam, pointArm, PXM } from "./common";
import { crewParticles, stageCrew } from "./d_crew";

/**
 * Sequence D — orbit. Almost wordless outside his own head. Every sound cue in
 * this sequence is something heard inside a suit; the pictures carry the rest.
 */

const PROP_S = PXM * (1.82 / 1.8);

export function sunK(Tm: number): number {
  return keys(Tm, [
    [0, 0.2], [14, 0.27],
    [179, 0.12], [193, 0.27], [209, 0.4], [216, 0.46], [239, 0.57], [252, 0.61], [266.5, 0.65], [279.5, 0.68],
    [291.5, 0.7], [308.5, 0.73], [318.5, 0.77], [327, 0.9], [333, 1],
  ], (x) => x);
}

const HANG = (Tm: number): Pose => {
  const w = wobble(Tm * 0.35, 3), u = wobble(Tm * 0.27, 8);
  return {
    hips: [-0.06 + w * 0.02, 0, u * 0.02],
    neck: [0.04 + u * 0.02, w * 0.05, 0],
    armR: [-0.42 + w * 0.05, 0, 0.08],
    armL: [-0.5 - w * 0.05, 0, -0.1],
    legR: [-0.24 + u * 0.04, 0, 0.05],
    legL: [-0.08 - u * 0.04, 0, -0.06],
  };
};

export interface ZhangState {
  pos: V3;
  head: V3;
  eye: V3;
  muzzle: V3;
  handR: V3;
  flash: number;
}

export function stageZhang(ctx: Ctx, Tm: number): ZhangState {
  const { cast, space } = ctx;
  const z = cast.zhangSuit;
  z.show();

  // Where he is: adrift, nudged back by thirty recoils, then leaving.
  let kick = 0;
  for (const s of ORBIT_SHOTS) if (Tm > s) kick += Math.min(Tm, 282) - s;
  const leave = Math.max(0, Tm - THRUST);
  const away = 0.5 * 1.25 * leave * leave;
  const pos: V3 = [
    wobble(Tm * 0.11, 1) * 0.06 + SPACE.baseDir.x * away,
    wobble(Tm * 0.09, 2) * 0.06 + SPACE.baseDir.y * away,
    wobble(Tm * 0.1, 3) * 0.05 - kick * 0.0035 + SPACE.baseDir.z * away,
  ];
  const baseYaw = Math.atan2(SPACE.baseDir.x, SPACE.baseDir.z);
  const turnAway = sstep(seg(Tm, 318.8, 321.4));
  const yaw = keys(Tm, [[243.2, 0], [245, 0.75], [249.6, 0.75], [251.8, 0]]) + baseYaw * turnAway + wobble(Tm * 0.13, 5) * 0.03;
  const pitch = wobble(Tm * 0.12, 6) * 0.03 - kick * 0.0009 - turnAway * 0.25 - sstep(seg(Tm, THRUST, THRUST + 2)) * 0.9;
  z.at(pos, yaw, pitch, wobble(Tm * 0.1, 7) * 0.03);

  const gloveOff = Tm > 243.2 && Tm < 317.6;
  z.clothes(suit({ visor: "clear", stripe: STRIPE.zhang, gloveR: !gloveOff }));

  // Arms by phase.
  const aimK = sstep(seg(Tm, 250.4, 252.2)) * (1 - sstep(seg(Tm, 313.6, 315.2)));
  let pose = HANG(Tm);
  const scopeUp = sstep(seg(Tm, 209.2, 210.8)) * (1 - sstep(seg(Tm, 239.0, 240.0)));
  if (Tm >= 240 && Tm < 250.4) {
    const fwd = sstep(seg(Tm, 240.0, 241.0));
    const sunlit = win(Tm, 243.2, 245.8, 0.8, 0.6);
    const toBag = win(Tm, 245.6, 247.9, 0.6, 0.35);
    const draw = sstep(seg(Tm, 247.7, 248.7));
    let r: [number, number, number] = [lerp(-0.42, -1.2, fwd), 0, lerp(0.08, 0.32, fwd)];
    r = [lerp(r[0], -1.5, sunlit), 0, lerp(r[2], -0.55, sunlit)];
    r = [lerp(r[0], 0.42, toBag), 0, lerp(r[2], -0.12, toBag)];
    r = [lerp(r[0], -1.42, draw), 0, lerp(r[2], 0.16, draw)];
    pose = { ...pose, armR: r, neck: [0.18 * (1 - draw), -0.25 * fwd * (1 - draw), 0] };
  }
  if (Tm > 313.6) {
    const stow = win(Tm, 314.2, 316.4, 0.8, 0.5);
    const reglove = win(Tm, 316.2, 318.4, 0.5, 0.5);
    pose = { ...pose, armR: [lerp(lerp(-0.42, 0.42, stow), -1.1, reglove), 0, lerp(0.08, 0.3, reglove)] };
  }
  const thrust = sstep(seg(Tm, THRUST - 0.4, THRUST + 1.2));
  pose = mix(pose, { hips: [0, 0, 0], neck: [-0.75, 0, 0], armR: [0.25, 0, -0.1], armL: [0.25, 0, 0.1], legR: [0.12, 0, 0.03], legL: [0.04, 0, -0.03] }, thrust);
  const narrow = aimK > 0.5 && Tm < 310;
  z.pose(pose).live(Tm, { eyes: narrow ? "narrow" : "open" });

  // Recoil: each round kicks the wrists up and decays.
  let recoil = 0, flash = 0;
  for (const s of ORBIT_SHOTS) {
    const dt = Tm - s;
    if (dt >= 0 && dt < 0.5) recoil += Math.exp(-dt / 0.07);
    if (dt >= 0 && dt < 0.085) flash = Math.max(flash, 1 - dt / 0.085);
  }
  recoil = Math.min(1.4, recoil);

  z.root.updateWorldMatrix(true, true);
  const local = (x: number, y: number, zz: number): THREE.Vector3 => z.root.localToWorld(new THREE.Vector3(x, y, zz));

  if (aimK > 0) {
    pointArm(z, "armR", local(0.02, 0.5 + recoil * 0.1, 2.4), aimK);
    const swap = Math.max(win(Tm, MAG_SWAP1 - 0.1, MAG_SWAP1 + 1.35, 0.3, 0.35), win(Tm, MAG_SWAP2 - 0.1, MAG_SWAP2 + 1.05, 0.25, 0.3));
    pointArm(z, "armL", local(lerp(0.1, 0.5, swap), lerp(0.44 + recoil * 0.08, -0.5, swap), lerp(2.2, 0.5, swap)), aimK);
    z.figure.joints.neck.rotation.x += 0.1 * aimK;
  }
  if (scopeUp > 0) pointArm(z, "armL", local(0.06, 0.74, 0.62), scopeUp);
  if (Tm >= 240.2 && Tm < 243.4) pointArm(z, "armL", anchorPos(z, "handR").add(new THREE.Vector3(0, 0.06 + Math.sin(Tm * 9) * 0.02, 0)), win(Tm, 240.2, 243.6, 0.6, 0.3));
  if (Tm >= 316.2 && Tm < 318.4) pointArm(z, "armL", anchorPos(z, "handR"), win(Tm, 316.2, 318.4, 0.5, 0.5));

  // Pistol.
  const armed = Tm > 247.7 && Tm < 315.4;
  cast.pistol.visible = armed;
  z.root.updateWorldMatrix(true, true);
  const muzzleV = cast.pistol.localToWorld(new THREE.Vector3(0, 1.3, 4.2));
  const handR = anchorPos(z, "handR");

  // Scope: left hand → adrift → on the slide.
  const scope = cast.scope;
  scope.scale.setScalar(PROP_S);
  scope.visible = Tm >= 179 && Tm < 315.4;
  const drift = local(-0.1, 0.62, 0.95);
  const grab = sstep(seg(Tm, 248.3, 249.0));
  if (Tm < 239.6) {
    const a = z.figure.anchors.handL;
    a.updateWorldMatrix(true, false);
    a.localToWorld(scope.position.set(0, 1.3, 0.6));
    a.getWorldQuaternion(scope.quaternion);
    if (scopeUp > 0.5) {
      // Held to the eye: barrel along his line of sight.
      z.root.getWorldQuaternion(scope.quaternion);
    }
  } else if (Tm < 249.0) {
    scope.position.set(-0.12 + (Tm - 239.6) * 0.004, 0.66 + Math.sin(Tm * 0.7) * 0.01, 0.86);
    scope.rotation.set((Tm - 239.6) * 0.09, 0.2 + (Tm - 239.6) * 0.05, (Tm - 239.6) * 0.07);
    if (grab > 0) pointArm(z, "armL", scope.position, grab);
  } else {
    const mount = sstep(seg(Tm, 249.0, 250.25));
    const onGun = cast.pistol.localToWorld(new THREE.Vector3(0, 2.75, 1.6));
    if (mount < 1) {
      scope.position.lerpVectors(drift, onGun, mount);
      pointArm(z, "armL", scope.position, 1);
    } else scope.position.copy(onGun);
    cast.pistol.getWorldQuaternion(scope.quaternion);
  }
  void drift;

  // Glove, tethered at the wrist.
  cast.glove.visible = gloveOff;
  if (gloveOff) {
    const dt = Tm - 243.2;
    const out = 1 - Math.exp(-dt * 1.2);
    const anchor = local(-0.55, -0.25, 0.25);
    cast.glove.scale.setScalar(PROP_S);
    cast.glove.position.copy(handR).lerp(anchor, Math.min(1, out)).add(new THREE.Vector3(0, Math.sin(Tm * 0.6) * 0.03, 0));
    cast.glove.rotation.set(dt * 0.3, dt * 0.2, 0.5);
  }

  // Spent magazines tumbling away.
  [MAG_SWAP1, MAG_SWAP2].forEach((s, i) => {
    const m = cast.mags[i]!;
    const dt = Tm - s;
    m.visible = dt > 0 && dt < 40;
    if (!m.visible) return;
    m.scale.setScalar(PROP_S);
    m.position.set(-0.05 - dt * 0.12, 0.25 - dt * 0.3, 0.6 - kickAt(s) + dt * 0.06);
    m.rotation.set(dt * 1.7, dt * 0.9, dt * 0.4);
  });

  // Muzzle blast: a brief sphere of burning gas, no sound.
  const fl = space.flash.begin();
  space.muzzle.intensity = 0;
  (space.muzzleGlow.material as THREE.SpriteMaterial).opacity = 0;
  if (flash > 0 && armed) {
    const age = 1 - flash;
    const shotIndex = ORBIT_SHOTS.findIndex((s) => Tm - s >= 0 && Tm - s < 0.085);
    for (let k = 0; k < 9; k++) {
      const h1 = hash1(shotIndex * 7 + k), h2 = hash1(shotIndex * 3 + k * 5), h3 = hash1(shotIndex + k * 9);
      const d = 0.08 + age * 0.55;
      fl.put(muzzleV.x + (h1 - 0.5) * d, muzzleV.y + (h2 - 0.5) * d, muzzleV.z + 0.1 + h3 * d * 1.6, 0.12 * flash + 0.02, k % 3 === 0 ? 0xfff6d8 : 0xffb24a, h1 * 6, 1.5);
    }
    space.muzzle.position.copy(muzzleV);
    space.muzzle.intensity = 26 * flash;
    space.muzzleGlow.position.copy(muzzleV);
    (space.muzzleGlow.material as THREE.SpriteMaterial).opacity = flash;
    const camDist = ctx.camera.position.distanceTo(muzzleV);
    space.muzzleGlow.scale.setScalar(1.5 + camDist * 0.035);
  }
  fl.end();

  // His own cold-gas wake as he leaves.
  const head = anchorPos(z, "head");
  const eye = local(0, 0.7, 0.3);
  return {
    pos, head: [lerp(pos[0], head.x, 0.74), lerp(pos[1], head.y, 0.74), lerp(pos[2], head.z, 0.74)],
    eye: [eye.x, eye.y, eye.z], muzzle: [muzzleV.x, muzzleV.y, muzzleV.z], handR: [handR.x, handR.y, handR.z], flash,
  };
}

function kickAt(s: number): number {
  let k = 0;
  for (const t of ORBIT_SHOTS) if (s > t) k += s - t;
  return k * 0.0035;
}

export function shotsD(ctx: Ctx): ShotDef[] {
  const { cast, space, camera } = ctx;
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();

  /** Common per-frame setup for the whole orbit sequence. */
  const orbit = (Tm: number, shadowAt: V3 = [0, 0, 0], shadowR = 9, fill = 0.3): void => {
    ctx.use("space");
    ctx.exposure = 1.0;
    camera.near = 0.2;
    const k = sunK(Tm);
    // Hatch state.
    const green = Tm > HATCH_GREEN && Tm < HATCH_CLOSE + 1.6;
    space.lamp.color.setHex(green ? 0x2aff5a : 0xff2a1a);
    (space.lampGlow.material as THREE.SpriteMaterial).color.setHex(green ? 0x2aff5a : 0xff2a1a);
    const open = sstep(seg(Tm, HATCH_OPEN, HATCH_OPEN + 1.5)) * (1 - sstep(seg(Tm, HATCH_CLOSE, HATCH_CLOSE + 1.5)));
    space.hatchDoor.position.x = SPACE.hatch[0] + open * 3.9;
    (space.airlockGlow.material as THREE.SpriteMaterial).opacity = 0.55 * open;
    space.slugs.count = 0;
    space.update(camera, k, Tm);
    space.focusShadow(shadowAt, shadowR);
    space.frontFill.intensity = fill;
    // Vapour takes the colour of whatever light is left.
    const tint = space.sunLight.color;
    const lvl = clamp(space.sunLight.intensity / 3.3, 0.12, 1);
    for (const fx of [space.gas, space.puffs]) {
      (fx.mesh.material as THREE.MeshBasicMaterial).color.setRGB(lerp(0.2, tint.r, lvl) * (0.35 + lvl * 0.7), lerp(0.24, tint.g, lvl) * (0.35 + lvl * 0.7), lerp(0.34, tint.b, lvl) * (0.35 + lvl * 0.7));
    }
  };

  const crewOnly = (Tm: number): ReturnType<typeof stageCrew> => {
    const r = stageCrew(ctx, Tm);
    crewParticles(ctx, Tm);
    return r;
  };

  /** Hide the gas systems when the crew is not being staged. */
  const noCrewFx = (): void => {
    space.gas.begin().end();
    space.blood.begin().end();
  };

  /** Zhang's own thruster wake. */
  const zhangWake = (Tm: number, z: V3): void => {
    const p = space.puffs.begin();
    if (Tm > THRUST - 0.1) {
      for (let k = 0; k < 90; k++) {
        const born = THRUST + k * 0.12;
        const age = Tm - born;
        if (age < 0 || age > 3.2) continue;
        const dt = born - THRUST;
        const d = 0.5 * 1.25 * dt * dt;
        const h1 = hash1(k * 3.1), h2 = hash1(k * 5.7);
        const size = (0.12 + age * 0.3) * (1 - Math.pow(age / 3.2, 2));
        p.put(
          SPACE.baseDir.x * (d - 0.5 - age * 0.9) + (h1 - 0.5) * 0.4 * age,
          SPACE.baseDir.y * (d - 0.5 - age * 0.9) + (h2 - 0.5) * 0.4 * age,
          SPACE.baseDir.z * (d - 0.5 - age * 0.9),
          size, 0xe9eef5, h1 * 6 + age,
        );
      }
    }
    p.end();
    void z;
  };

  /** View through the sight: a real long lens from his eye, plus the reticle overlay. */
  const scopeView = (Tm: number, target: V3, fov: number, sway = 1): void => {
    const st = stageZhang(ctx, Tm);
    cast.zhangSuit.show(false);
    cast.pistol.visible = false;
    cast.scope.visible = false;
    cast.glove.visible = false;
    for (const m of cast.mags) m.visible = false;
    const sx = wobble(Tm * 0.9, 11) * 0.5 * sway + wobble(Tm * 2.7, 12) * 0.12 * sway;
    const sy = wobble(Tm * 0.8, 13) * 0.4 * sway + Math.sin(Tm * 1.3) * 0.25 * sway;
    camera.near = 20;
    camera.far = 9000;
    shootCam(camera, [st.eye[0], st.eye[1], st.eye[2] + 1], [target[0] + sx, target[1] + sy, target[2]], fov);
    ctx.overlay.scope = 1;
  };

  const caption = (t: number, text: string, a = 0.8, b = 5.5): void => {
    ctx.overlay.caption = text;
    ctx.overlay.captionAlpha = win(t, a, b, 0.8, 0.8);
  };

  const placeSlugs = (Tm: number): V3 => {
    // Thirty rounds in three loose strings, crossing the void in a straight line.
    const lead = lerp(40, 838, seg(Tm, T.D8, IMPACT));
    space.slugs.count = 30;
    for (let i = 0; i < 30; i++) {
      const group = Math.floor(i / 10), n = i % 10;
      const tgt = SPACE.slot(TARGETS[group]!);
      const zpos = lead - group * 9 - n * 1.7;
      const k = zpos / 850;
      dummy.position.set(
        tgt[0] * k + (hash1(i * 3.3) - 0.5) * 0.5 * k,
        (tgt[1] + 0.3) * k + 0.45 * (1 - k) + (hash1(i * 7.1) - 0.5) * 0.6 * k,
        zpos,
      );
      dummy.rotation.set(0, 0, Tm * 9 + i);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      space.slugs.setMatrixAt(i, dummy.matrix);
    }
    space.slugs.instanceMatrix.needsUpdate = true;
    void col;
    const tg = SPACE.slot(TARGETS[0]!), kk = lead / 850;
    return [tg[0] * kk, (tg[1] + 0.3) * kk + 0.45 * (1 - kk), lead];
  };

  return [
    // ── D1: match cut from the test cloth to the suit he is wearing ──
    cut("D1a-reveal", T.D1, 185.5, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      const k = sstep(seg(t, 1.0, 6.5));
      shootCam(camera, [lerp(0.02, 1.5, k), lerp(0.16, 0.7, k), lerp(0.62, 8.2, k)], [st.pos[0], lerp(0.16, 0.25, k), st.pos[2]], lerp(34, 38, k), lerp(0, -0.06, k));
      ctx.overlay.flash = (1 - sstep(seg(t, 0, 0.7))) * 0.55;
      caption(t, "三个月后　地球同步轨道 · 黄河空间站外五公里", 2.6, 6.4);
    }),
    cut("D1b-station", 185.5, T.D2, (t, Tm) => {
      orbit(Tm);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      shootCam(camera, [-3.4 + t * 0.06, 1.5, -8.2 + t * 0.12], [10, 6, 160], 34, 0.05);
    }),
    // ── D2: the void, and the father ──
    cut("D2a-void", T.D2, 201, (t, Tm) => {
      orbit(Tm);
      stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, [0, 0, 0]);
      shootCam(camera, [10 - t * 0.25, -5 + t * 0.1, 40 - t * 0.6], [-2.5, -1.4, 0], 30, -0.12);
    }),
    cut("D2b-father", 201, T.D3, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      // He turns his head to look at the sun going under.
      const look = keys(Tm, [[204.4, 0], [206, 1], [207.6, 1], [208.8, 0]]);
      cast.zhangSuit.figure.joints.neck.rotation.y -= look * 0.6;
      cast.zhangSuit.figure.joints.hips.rotation.y -= look * 0.2;
      frameCam(camera, [st.head[0], st.head[1] - 0.08, st.head[2]], [0.75 - t * 0.02, 0.1, 1.5], lerp(1.5, 1.05, sstep(t / 8)), 28, -0.05);
    }),
    // ── D3: the sight comes up; the airlock light goes green ──
    cut("D3a-raise", T.D3, 211, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      frameCam(camera, [st.pos[0], st.pos[1] + 0.35, st.pos[2] + 0.2], [-1.6, 0.2, 0.9], 2.1, 32, 0.04);
    }),
    cut("D3b-hatch", 211, T.D4, (t, Tm) => {
      orbit(Tm, [0, 0, 870], 30);
      crewOnly(Tm);
      scopeView(Tm, [SPACE.hatch[0] + 0.6, SPACE.hatch[1] + 0.5, 886], lerp(0.62, 0.42, sstep(t / 5)), 0.5);
    }),
    // ── D4: the group photo assembles ──
    cut("D4a-egress", T.D4, 223, (t, Tm) => {
      orbit(Tm, [0, 0, 868], 34);
      crewOnly(Tm);
      shootCam(camera, [-13.5 + t * 0.2, -0.6 - t * 0.1, 880.5 - t * 0.3], [SPACE.hatch[0] + 1.2, SPACE.hatch[1] + 0.2, 885.6 - t * 1.0], 46, -0.08);
    }),
    cut("D4b-rows", 223, 229, (t, Tm) => {
      orbit(Tm, [0, 0, 858], 30);
      crewOnly(Tm);
      frameCam(camera, [0.2, 0.45, 851], [-0.42 + t * 0.03, -0.2, -1], 6.8, 40, 0.05);
    }),
    cut("D4c-faces", 229, 233.5, (t, Tm) => {
      orbit(Tm, [0, 0, 855], 22);
      crewOnly(Tm);
      const x = lerp(-5.6, -0.4, t / 4.5);
      shootCam(camera, [x - 1.2, -0.1, 844.3], [x + 1.4, -0.25, 850.6], 30, 0.03);
    }),
    cut("D4d-lifetime", 233.5, T.D5, (t, Tm) => {
      orbit(Tm, [0, 0, 855], 22);
      const r = crewOnly(Tm);
      const h = r.heads[TARGETS[1]!]!;
      frameCam(camera, [h[0], h[1] - 0.12, h[2]], [0.35, 0.02, -1.5], lerp(1.9, 1.5, sstep(t / 5.5)), 28, 0.02);
    }),
    // ── D5: glove, pistol, sight ──
    cut("D5a-glove", T.D5, 244.8, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      frameCam(camera, [st.handR[0] - 0.05, st.handR[1] + 0.12, st.handR[2] - 0.12], [-1.0, 0.35, 1.25], lerp(1.15, 0.95, t / 5.8), 30, 0.05);
    }),
    cut("D5b-arm", 244.8, T.D6, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      frameCam(camera, [st.pos[0], st.pos[1] + 0.32, st.pos[2] + 0.3], [1.15 - t * 0.04, 0.12, 1.5], lerp(2.3, 2.0, t / 7.2), 32, -0.05);
    }),
    // ── D6: aim; the reason ──
    cut("D6a-aim", T.D6, 258, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      frameCam(camera, [st.pos[0], st.pos[1] + 0.34, st.pos[2] + 0.35], [0.62 - t * 0.015, 0.07, 1.0], lerp(2.7, 2.3, t / 6), 30, -0.04);
    }),
    cut("D6b-reticle", 258, T.D7, (t, Tm) => {
      orbit(Tm, [0, 0, 855], 22);
      const r = crewOnly(Tm);
      const a = r.heads[TARGETS[0]!]!, b = r.heads[TARGETS[1]!]!;
      const k = sstep(seg(t, 0.4, 4.2));
      scopeView(Tm, [lerp(a[0] - 1.6, b[0], k), lerp(a[1] + 0.9, b[1] - 0.08, k), b[2]], lerp(0.5, 0.17, sstep(t / 8.5)), lerp(1, 0.25, k));
    }),
    // ── D7: thirty rounds ──
    cut("D7a-burst1", T.D7, 271.6, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      const shake = st.flash * 0.02;
      frameCam(camera, [st.muzzle[0] * 0.5, st.muzzle[1] + 0.02, st.muzzle[2] - 0.4], [-1.2, 0.18, 1.35], 1.45, 30, 0.03, [shake, -shake, 0]);
      ctx.overlay.flash = st.flash * 0.1;
    }),
    cut("D7b-firefly", 271.6, 276, (t, Tm) => {
      orbit(Tm);
      stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, [0, 0, 0]);
      shootCam(camera, [38, 12, 250 - t * 2], [-9, -4, 0], 19, -0.1);
    }),
    cut("D7c-burst3", 276, T.D8, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      const shake = st.flash * 0.025;
      frameCam(camera, [st.head[0] - 0.12, st.head[1] - 0.2, st.head[2] + 0.2], [0.42, -0.06, 1.5], lerp(1.5, 1.25, t / 3.5), 30, -0.04, [shake, shake, 0]);
      ctx.overlay.flash = st.flash * 0.14;
    }),
    // ── D8: ten seconds of straight line ──
    cut("D8a-flight", T.D8, 286, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.5);
      stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, [0, 0, 0]);
      const lead = placeSlugs(Tm);
      shootCam(camera, [lead[0] + 0.55 - t * 0.03, lead[1] + 0.42, lead[2] - 35.2 + t * 0.35], [lead[0] - 0.3, lead[1] - 0.15, lead[2] + 60], 22, 0.06);
    }),
    cut("D8b-closing", 286, T.D9, (t, Tm) => {
      orbit(Tm, [0, 0, 855], 22);
      crewOnly(Tm);
      const lead = placeSlugs(Tm);
      shootCam(camera, [lead[0] - 0.35, lead[1] + 0.4, lead[2] - 2.6], [0, -0.1, 850], lerp(26, 6.5, Math.pow(t / 5.5, 1.5)), -0.03);
    }),
    // ── D9: impact ──
    cut("D9a-impact", T.D9, 294.3, (t, Tm) => {
      orbit(Tm, [0, 0, 855], 22);
      const r = crewOnly(Tm);
      void r;
      const s = SPACE.slot(TARGETS[1]!);
      const jolt = win(Tm, IMPACT, IMPACT + 0.5, 0.03, 0.4);
      frameCam(camera, [s[0], s[1] + 0.5, s[2]], [0.28, 0.03, -1.5], 2.3, 30, 0.02 + jolt * 0.02, [wobble(Tm * 31, 1) * jolt * 0.06, wobble(Tm * 27, 2) * jolt * 0.06, 0]);
    }),
    cut("D9b-leak", 294.3, 297.7, (t, Tm) => {
      orbit(Tm, [0, 0, 855], 22);
      crewOnly(Tm);
      shootCam(camera, [7.5 - t * 0.2, 2.8, 839.5 + wobble(Tm * 7, 4) * 0.05], [0.4 + wobble(Tm * 8, 5) * 0.06, 0.3, 851.2], 36, -0.09);
    }),
    cut("D9c-scream", 297.7, 301.1, (t, Tm) => {
      orbit(Tm, [0, 0, 855], 22);
      const r = crewOnly(Tm);
      const h = r.heads[11]!;
      frameCam(camera, [h[0], h[1] - 0.1, h[2]], [-0.5, -0.05, -1.5], lerp(1.35, 1.15, t / 3.4), 28, 0.07, [wobble(Tm * 9, 6) * 0.03, wobble(Tm * 8, 7) * 0.03, 0]);
    }),
    cut("D9d-flee", 301.1, 305.4, (t, Tm) => {
      orbit(Tm, [0, 0, 862], 30);
      crewOnly(Tm);
      shootCam(camera, [-11.5, -4.4, 836 + t * 0.5], [0.5, 0.5 + t * 0.1, 856 + t * 2.2], 40, 0.1 + wobble(Tm * 2, 9) * 0.01);
    }),
    cut("D9e-lips", 305.4, T.D10, (t, Tm) => {
      orbit(Tm, [0, 0, 862], 30);
      const r = crewOnly(Tm);
      const h = r.heads[TARGETS[1]!] ?? [0, 0, 860];
      scopeView(Tm, [h[0], h[1] + 0.3, h[2]], 0.62, 0.6);
    }),
    // ── D10: tally ──
    cut("D10a-hatch", T.D10, 313.5, (t, Tm) => {
      orbit(Tm, [0, 0, 870], 30);
      crewOnly(Tm);
      scopeView(Tm, [SPACE.hatch[0] + 1.5, SPACE.hatch[1] + 0.8, 884], lerp(0.8, 0.6, t / 5), 0.5);
    }),
    cut("D10b-lower", 313.5, T.D11, (t, Tm) => {
      orbit(Tm, [0, 0, 0], 9, 1.25);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      frameCam(camera, [st.head[0], st.head[1] - 0.3, st.head[2]], [-0.55, 0.04, 1.5], lerp(1.7, 1.45, t / 5), 28, 0.04);
    }),
    // ── D11: home, and nightfall ──
    cut("D11a-leave", T.D11, 326, (t, Tm) => {
      orbit(Tm);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      const follow = sstep(seg(t, 0, 7.5));
      void follow;
      shootCam(camera, [-1.2 - t * 0.04, 0.7, 8.5], [-0.2 + t * 0.03, 0.55 + t * 0.02, -2], 42, 0.05);
    }),
    cut("D11b-night", 326, T.E1, (t, Tm) => {
      orbit(Tm);
      const st = stageZhang(ctx, Tm);
      noCrewFx();
      zhangWake(Tm, st.pos);
      const dir = SPACE.dE;
      shootCam(camera, [-2 - t * 0.2, 1.5, 16], [dir.x * 200 + 46, dir.y * 200 + 34, dir.z * 200], lerp(34, 38, t / 9), -0.08);
      void st;
      ctx.overlay.fade = sstep(seg(t, 6.6, 8.8));
    }),
  ];
}

void easeIn;
void keysV;
void BURST1;
void BURST2;
void BURST3;
