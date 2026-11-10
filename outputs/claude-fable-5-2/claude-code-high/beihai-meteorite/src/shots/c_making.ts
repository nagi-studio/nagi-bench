import * as THREE from "three";
import { walk, aim } from "@agentbench/voxel-kit";
import type { Ctx, ShotDef } from "../film";
import { T, LIGHTS_OUT, MAG_INSERT, SLIDE_RACK, TEST_SHOTS } from "../timeline";
import { SHOP } from "../sets/shop";
import { CELLAR } from "../sets/cellar";
import { mix, over, soldier, type Pose } from "../cast/actors";
import { keys, keysV, lerp, seg, shootCam, sstep, win, wobble, type V3 } from "../lib/util";
import { anchorPos, cut, frameCam, pointArm } from "./common";

/**
 * Sequence C — the making. No dialogue, only a few clipped thoughts. The
 * audience is not told what the stones are for; it watches them become rounds.
 */
export function shotsC(ctx: Ctx): ShotDef[] {
  const { cast, shop, cellar, camera } = ctx;
  const z = cast.zhang;
  const tmp = new THREE.Vector3();
  const drift = (Tm: number, a = 0.006): V3 => [wobble(Tm * 0.5, 21) * a, wobble(Tm * 0.43, 22) * a, wobble(Tm * 0.37, 23) * a];

  /* ---------- workshop ---------- */
  const stageShop = (Tm: number): { head: V3; state: ReturnType<typeof shop.animate> } => {
    ctx.use("shop");
    ctx.exposure = 1.1;
    const state = shop.animate(Tm);
    z.show();
    const arrive = seg(Tm, T.C1 + 0.3, T.C1 + 4.2);
    const pos = keysV(Tm, [[T.C1 + 0.3, [8.9, 0, 6.9]], [T.C1 + 4.2, SHOP.operator]], (x) => x);
    const yaw = arrive < 1 ? Math.atan2(SHOP.operator[0] - 8.9, SHOP.operator[2] - 6.9) : Math.PI;
    let pose: Pose = arrive > 0 && arrive < 1 ? walk(Tm, 1.2) : over(soldier(Tm), { hips: [0.16, 0, 0], neck: [0.2, 0, 0], armR: [-0.7, 0, 0.1], armL: [-0.35, 0, -0.05] });
    if (Tm > T.C4) {
      // Sweeping the swarf into a bag: every grain.
      const sweep = Math.sin(Tm * 5.2);
      const done = sstep(seg(Tm, LIGHTS_OUT - 1.3, LIGHTS_OUT - 0.5));
      pose = mix(
        { hips: [0.5, sweep * 0.08, 0], neck: [0.1, 0, 0], armR: [-1.15, 0, 0.1 + sweep * 0.3], armL: [-1.0, 0, -0.3], lift: -0.3 },
        over(soldier(Tm), { armL: [-0.5, 0, -0.1], neck: [0, 0.7, 0] }),
        done,
      );
    }
    z.at(pos, yaw).pose(pose).live(Tm, { eyes: state.contact || state.cutting ? "narrow" : "open" });
    anchorPos(z, "head", tmp);
    return { head: [tmp.x, tmp.y - 0.22, tmp.z], state };
  };

  /* ---------- basement ---------- */
  const stageCellar = (Tm: number, opened = 0): { head: V3; muzzle: THREE.Vector3; flash: number; hand: V3 } => {
    ctx.use("cellar");
    ctx.exposure = 1.1;
    z.show();
    cast.pliers.visible = false;
    cast.knife.visible = false;
    cast.pistolCivil.visible = false;
    cellar.crumbs.visible = false;
    let pos: V3 = CELLAR.stand, yaw = Math.PI;
    let pose: Pose;
    let eyes: "open" | "narrow" = "open";
    let workAt: V3 | null = null;
    if (Tm < T.C6) {
      // Pliers, then adhesive: thirty-six times.
      const pulled = 36 * seg(Tm, 150.6, 155.6), glued = 36 * seg(Tm, 154.8, 160.5);
      const i = Math.min(35, Math.floor(Tm < 155.6 ? pulled : glued));
      const tap = Math.abs(Math.sin((Tm < 155.6 ? pulled : glued) * Math.PI));
      const r = CELLAR.round(i);
      workAt = [r[0], r[1] + 0.2 + tap * 0.05, r[2]];
      pose = { hips: [0.42, 0, 0], neck: [0.28, 0, 0], armR: [-1.0, 0, 0.2], armL: [-1.0, 0, -0.35], lift: -0.3 };
      cast.pliers.visible = Tm < 155.6;
    } else if (Tm < T.C7) {
      cast.pistolCivil.visible = true;
      const raise = sstep(seg(Tm, 164.5, 165.3)) * (1 - sstep(seg(Tm, 168.7, 169.6)));
      let kick = 0;
      for (const s of TEST_SHOTS) if (Tm >= s) kick += Math.exp(-(Tm - s) / 0.09);
      const slap = win(Tm, MAG_INSERT - 0.25, MAG_INSERT + 0.2, 0.2, 0.15);
      const rack = win(Tm, SLIDE_RACK - 0.2, SLIDE_RACK + 0.3, 0.15, 0.2);
      const low: Pose = {
        hips: [0.08, 0, 0], neck: [0.3, 0, 0],
        armR: [-0.95, 0, 0.28],
        armL: [-0.75 - slap * 0.35 - rack * 0.2, 0, -0.42 + rack * 0.1],
      };
      const up = aim(-0.02 - Math.min(kick, 1.3) * 0.16, 0);
      pose = mix(low, { ...up, hips: [-0.02 - Math.min(kick, 1) * 0.04, 0, 0] }, raise);
      eyes = raise > 0.5 ? "narrow" : "open";
    } else {
      // At the target: cutting the cloth open, then weighing what is left in his palm.
      pos = [1.8, 0, 1.6];
      yaw = Math.atan2(CELLAR.bundle[0] - 1.8, CELLAR.bundle[2] - 1.6);
      const palm = sstep(seg(Tm, 174.2, 175.0));
      const cutting = win(Tm, 172.4, 174.3, 0.4, 0.3);
      pose = mix(over(soldier(Tm), { hips: [0.14, 0, 0], neck: [0.22, 0, 0], armR: [-0.4 - cutting * 0.9, 0, 0.1] }), {
        hips: [0.1, 0, 0], neck: [0.34, 0.1, 0], armL: [-1.25, 0, -0.42], armR: [-0.3, 0, 0.05],
      }, palm);
      cast.knife.visible = Tm < 174.6;
      cellar.crumbs.visible = Tm > 174.3;
    }
    z.at(pos, yaw).pose(pose).live(Tm, { eyes });
    if (workAt) {
      pointArm(z, "armR", workAt);
      pointArm(z, "armL", [workAt[0] - 0.16, workAt[1] - 0.02, workAt[2] + 0.02]);
    }
    z.root.updateWorldMatrix(true, true);
    const muzzle = cast.pistolCivil.localToWorld(new THREE.Vector3(0, 1.3, 4.2));
    const st = cellar.animate(Tm, Tm >= T.C6 && Tm < T.C7 ? muzzle : null, opened);
    const hand = anchorPos(z, "handL");
    if (cellar.crumbs.visible) {
      cellar.crumbs.position.set(hand.x, hand.y + 0.15, hand.z);
      cellar.crumbs.rotation.y = z.root.rotation.y;
    }
    anchorPos(z, "head", tmp);
    return { head: [tmp.x, tmp.y - 0.22, tmp.z], muzzle, flash: st.flash, hand: [hand.x, hand.y, hand.z] };
  };

  const caption = (t: number, text: string, a: number, b: number): void => {
    ctx.overlay.caption = text;
    ctx.overlay.captionAlpha = win(t, a, b, 0.7, 0.7);
  };

  return [
    cut("C1-workshop", T.C1, T.C2, (t, Tm) => {
      stageShop(Tm);
      shootCam(camera, [9.9 - t * 0.12, 2.3, 8.2 - t * 0.1], [5.7, 1.05, 3.1], 36, 0.02);
      ctx.overlay.fade = 1 - sstep(seg(t, 0, 0.9));
      caption(t, "太空军某研究所 · 模型车间　下班之后", 0.9, 4.6);
    }),
    cut("C2a-core", T.C2, 131.6, (t, Tm) => {
      stageShop(Tm);
      const b = SHOP.bed;
      shootCam(camera, [b[0] + 0.5 - t * 0.02 + drift(Tm)[0], b[1] + 0.34, b[2] + 0.5], [b[0] - 0.01, b[1] + 0.2, b[2]], 30, 0.03);
    }),
    cut("C2b-watching", 131.6, 134, (t, Tm) => {
      const s = stageShop(Tm);
      frameCam(camera, [s.head[0], s.head[1] - 0.06, s.head[2]], [0.5, 0.0, -1], lerp(1.25, 1.1, t / 2.4), 32, 0, drift(Tm));
    }),
    cut("C2c-holes", 134, T.C3, (t, Tm) => {
      stageShop(Tm);
      const b = SHOP.bed;
      frameCam(camera, [b[0], shop.stoneTop - 0.02, b[2] + 0.01], [0.35 - t * 0.04, 0.8, 1], lerp(0.46, 0.38, t / 3), 30, 0, drift(Tm, 0.002));
    }),
    cut("C3a-parting", T.C3, 140.6, (t, Tm) => {
      stageShop(Tm);
      const c = SHOP.cutter;
      shootCam(camera, [c[0] + 0.42 + drift(Tm)[0], c[1] + 0.3, c[2] + 0.46 - t * 0.02], [c[0] + 0.02, c[1] + 0.17, c[2]], 30, -0.03);
    }),
    cut("C3b-thirty-six", 140.6, T.C4, (t, Tm) => {
      stageShop(Tm);
      const c = SHOP.cutter;
      frameCam(camera, [c[0] + 0.04, c[1] + 0.05, c[2] + 0.02], [0.02, 1, 0.16], lerp(0.52, 0.46, t / 3.4), 30, 0.12 - t * 0.02);
    }),
    cut("C4-sweep", T.C4, T.C5, (t, Tm) => {
      stageShop(Tm);
      shootCam(camera, [7.9 - t * 0.05, 1.45, 5.0], [5.75, 1.05, 3.3], 34, -0.02);
      ctx.overlay.fade = sstep(seg(Tm, LIGHTS_OUT + 0.15, LIGHTS_OUT + 0.7));
    }),

    cut("C5a-basement", T.C5, 153, (t, Tm) => {
      stageCellar(Tm);
      shootCam(camera, [4.45 - t * 0.05, 1.95, 1.7], [2.35, 0.95, 4.5], 44, -0.03);
      ctx.overlay.fade = 1 - sstep(seg(t, 0, 0.8));
    }),
    cut("C5b-rounds", 153, T.C6, (t, Tm) => {
      stageCellar(Tm);
      const c = CELLAR.table;
      frameCam(camera, [c[0] + 0.03, c[1] + 0.05, c[2] + 0.04], [0.12, 1, -0.6], lerp(0.84, 0.64, sstep(t / 8)), 32, 0.05 - t * 0.008, drift(Tm, 0.003));
    }),
    cut("C6a-load", T.C6, 164.7, (t, Tm) => {
      const s = stageCellar(Tm);
      frameCam(camera, [s.head[0], s.head[1] - 0.42, s.head[2] - 0.2], [-0.5, -0.05, -1], lerp(1.5, 1.35, t / 3.7), 32, 0, drift(Tm));
    }),
    cut("C6b-fire", 164.7, 167, (t, Tm) => {
      const s = stageCellar(Tm);
      const shake = s.flash * 0.05;
      shootCam(camera, [0.4 + shake, 1.3 + shake * 0.6, 3.05], [2.5, 1.12, 3.05], 66, shake * 0.2);
      ctx.overlay.flash = s.flash * 0.3;
    }),
    cut("C6c-muzzle", 167, 168.7, (t, Tm) => {
      const s = stageCellar(Tm);
      const shake = s.flash * 0.05;
      shootCam(camera, [3.25 + shake, 1.52 - shake, 0.5], [s.head[0], s.head[1] - 0.2, s.head[2]], 34, -0.04 + shake * 0.3);
      ctx.overlay.flash = s.flash * 0.45;
    }),
    cut("C6d-smoke", 168.7, T.C7, (t, Tm) => {
      const s = stageCellar(Tm);
      frameCam(camera, [s.head[0], s.head[1] - 0.2, s.head[2]], [0.7, 0.0, -1], lerp(1.35, 1.25, t / 1.3), 30, 0.02, drift(Tm));
    }),
    cut("C7a-holes", T.C7, 174.4, (t, Tm) => {
      stageCellar(Tm);
      const b = CELLAR.bundle;
      frameCam(camera, [b[0] - 0.01, b[1] + 0.02, b[2] + 0.18], [0.3, 0.1, 1], lerp(0.72, 0.5, sstep(t / 4.4)), 30, 0, drift(Tm, 0.003));
    }),
    cut("C7b-gravel", 174.4, 177.6, (t, Tm) => {
      const s = stageCellar(Tm);
      frameCam(camera, [s.hand[0], s.hand[1] + 0.16, s.hand[2]], [1, 0.75, 0.25], lerp(0.7, 0.5, sstep(t / 3.2)), 30, 0, drift(Tm, 0.003));
    }),
    cut("C7c-cloth", 177.6, T.D1, (t, Tm) => {
      stageCellar(Tm, 1);
      z.show(false);
      cellar.crumbs.visible = false;
      const b = CELLAR.bundle;
      // Push into the cut edge until the white suit cloth is all there is.
      frameCam(camera, [b[0] - lerp(0.0, 0.2, sstep(t / 1.2)), b[1] + lerp(0.0, 0.21, sstep(t / 1.2)), b[2] + 0.2], [0.08, 0.05, 1], lerp(0.62, 0.07, Math.pow(t / 1.4, 1.5)), 30, 0);
      ctx.overlay.fadeColour = "#fff";
      ctx.overlay.fade = sstep(seg(t, 0.85, 1.4)) * 0.6;
    }),
  ];
}

void keys;
