import * as THREE from "three";
import { walk } from "@agentbench/voxel-kit";
import type { Ctx, ShotDef } from "../film";
import { T, STONE_THUNKS } from "../timeline";
import { ROOM } from "../sets/room";
import { gesturing, homely, mix, over, soldier, type Pose } from "../cast/actors";
import { easeOut, keys, keysV, lerp, seg, shootCam, sstep, win, wobble, type V3 } from "../lib/util";
import { anchorPos, cut, frameCam, holdUpright, pointArm, yawTo } from "./common";
import { shotsYard } from "./b_yard";

/**
 * Sequence B — the collector. A warm, slow, talkative scene played against the
 * cold purpose of the visitor; it ends on the one line that lets the cold in.
 */
export function shotsB(ctx: Ctx): ShotDef[] {
  const { cast, room, camera } = ctx;
  const { zhang, collector, cup } = cast;
  const tmp = new THREE.Vector3();

  const BENCH_C: V3 = [6.3, 0, 1.22]; // collector behind the bench
  const BENCH_Z: V3 = [6.2, 0, 3.2]; // Zhang in front of it
  const CASE: V3 = [3.95, 0, 1.32]; // at the iron shelf

  /** Blocking for the whole scene as a function of absolute time. */
  const stage = (Tm: number): { zhangHead: V3; collHead: V3; cupPos: V3 } => {
    ctx.use("room");
    room.mood("dusk", 1);
    ctx.exposure = 1.15;
    zhang.show();
    collector.show();
    room.walnut.visible = false;
    room.radio.visible = false;
    room.magnifier.visible = false;
    room.phoneLight.intensity = 0;
    room.pane.position.x = 0.6 + 0.05 + 2 * 1.7 + 0.82 - 1.5 * sstep(seg(Tm, 91.8, 93.0));

    // Door swings in for the visitor and is left ajar.
    room.doorLeaf.rotation.y = -keys(Tm, [[22.2, 0], [23.6, 1.35], [27.5, 1.35], [29.5, 0.25]]);

    // Stones: on the shelf until taken, on the felt once set down.
    room.shelfStones.forEach((s, i) => (s.visible = Tm < 93.6 + i * 0.7));
    room.feltStones.forEach((s, i) => {
      const land = STONE_THUNKS[i]!;
      s.visible = Tm > land - 0.35;
      const f = ROOM.feltSlots[i]!;
      const drop = 1 - easeOut(seg(Tm, land - 0.35, land));
      s.position.set(f[0], f[1] + (s.userData.halfHeight as number) + drop * 0.16, f[2]);
    });

    let zPos: V3, zYaw: number, zPose: Pose, cPos: V3, cYaw: number, cPose: Pose;
    let cupHolder: "none" | "collector" | "zhang" = "none";
    let cEyes: "open" | "wide" = "open";
    let cMouth: "shut" | "smile" = "shut";
    let zEyes: "open" | "narrow" = "open";

    if (Tm < T.B3) {
      // He comes in from the dusk; the owner looks up from his magnifier.
      const w = seg(Tm, 22.9, 26.6);
      zPos = keysV(Tm, [[22.9, [6.75, 0, 6.3]], [26.6, [5.6, 0, 4.2]]], (x) => x);
      zYaw = yawTo(zPos, [5.2, 0, 2.6]);
      zPose = w > 0 && w < 1 ? walk(Tm, 1.15) : soldier(Tm);
      if (Tm > 27) zPose = over(zPose, { neck: [0, keys(Tm, [[27, 0], [28.2, 0.5], [29.6, -0.3]]), 0] });
      cPos = [6.15, 0, 3.02];
      const turn = sstep(seg(Tm, 24.0, 25.2));
      cYaw = lerp(Math.PI, yawTo(cPos, [5.6, 0, 4.2]), turn);
      const bent: Pose = { hips: [0.42, 0, 0], neck: [0.25, 0, 0], armR: [-1.25, 0, 0.35], armL: [-0.9, 0, -0.3], lift: -0.4 };
      cPose = mix(bent, gesturing(Tm, 0.8, 2), turn);
      cMouth = Tm > 24.2 ? "smile" : "shut";
      room.magnifier.visible = Tm < 26;
    } else if (Tm < T.B4) {
      // Tea, and two soldiers recognising each other.
      zPos = [4.7, 0, 3.6];
      cPos = [3.3, 0, 3.6];
      zYaw = -Math.PI / 2;
      cYaw = Math.PI / 2;
      const give = win(Tm, 30.5, 32.6, 0.5, 0.5);
      cPose = collector.isSpeaking(Tm) ? gesturing(Tm, 0.75, 2) : homely(Tm, 2);
      cPose = mix(cPose, over(homely(Tm, 2), { armR: [-1.35, 0, 0.05], hips: [0.12, 0, 0] }), give);
      const take = sstep(seg(Tm, 31.5, 32.3));
      zPose = over(soldier(Tm), { armR: [lerp(0.03, -1.0, take), 0, lerp(0.03, 0.22, take)] });
      if (zhang.isSpeaking(Tm)) zPose = over(zPose, { neck: [0.05 + Math.sin(Tm * 5) * 0.02, 0, 0] });
      cupHolder = Tm < 32.0 ? "collector" : "zhang";
      cMouth = Tm > 42 ? "smile" : "shut";
    } else if (Tm < T.B5) {
      // He turns to his cases; this is where he lives.
      zPos = [4.7, 0, 3.6];
      const go = seg(Tm, 46.2, 49.4);
      cPos = keysV(Tm, [[46.2, [3.3, 0, 3.6]], [49.4, [3.0, 0, 1.55]]], (x) => x);
      cYaw = go < 1 ? yawTo([3.3, 0, 3.6], [3.0, 0, 1.55]) : keys(Tm, [[49.4, Math.PI], [50.2, Math.PI * 0.86], [54, Math.PI * 0.86], [55.4, Math.PI * 0.55]]);
      cPose = go > 0 && go < 1 ? walk(Tm, 1.3) : gesturing(Tm, 0.6, 2);
      zYaw = keys(Tm, [[45.5, -Math.PI / 2], [47.5, -Math.PI / 2 - 0.5], [50, yawTo(zPos, [3.0, 0, 1.55])]]);
      zPose = over(soldier(Tm), { armR: [-1.0, 0, 0.22], neck: [0, keys(Tm, [[45.6, 0.5], [46.8, -0.6], [48.6, 0]]), 0] });
      cupHolder = "zhang";
      cMouth = Tm > 52 ? "smile" : "shut";
    } else if (Tm < T.B6) {
      // "The earth is one big meteorite." The cup comes up into the light.
      zPos = [4.7, 0, 3.5];
      cPos = [3.4, 0, 2.4];
      zYaw = yawTo(zPos, cPos);
      cYaw = yawTo(cPos, zPos);
      const raise = keys(Tm, [[62.4, 0], [63.6, 1], [70.6, 1], [72, 0]]);
      const shake = win(Tm, 57.7, 60.2, 0.3, 0.5) * Math.sin(Tm * 4.2) * 0.22;
      const look = keys(Tm, [[66.8, 0], [67.8, 0.34], [70.8, 0.34], [71.8, 0]]);
      zPose = over(soldier(Tm), { armR: [lerp(-1.0, -1.42, raise), 0, lerp(0.22, 0.34, raise)], neck: [look, shake, 0] });
      const laugh = win(Tm, 71.6, 76, 0.3, 0.4);
      cPose = mix(homely(Tm, 2), gesturing(Tm, 1, 2), laugh);
      cPose = over(cPose, { lift: (cPose.lift ?? 0) + laugh * Math.abs(Math.sin(Tm * 9)) * 0.35 });
      cupHolder = "zhang";
      cMouth = Tm > 71.4 ? "smile" : "shut";
    } else if (Tm < T.B7) {
      // The specification. The collector hears "carving".
      zPos = keysV(Tm, [[76, [4.7, 0, 3.5]], [78.5, [5.0, 0, 2.75]]]);
      const go = seg(Tm, 89.6, 91.6);
      cPos = keysV(Tm, [[89.6, [3.4, 0, 2.4]], [91.6, CASE]], (x) => x);
      zYaw = yawTo(zPos, cPos);
      cYaw = go <= 0 ? yawTo(cPos, zPos) : go < 1 ? yawTo([3.4, 0, 2.4], CASE) : lerp(yawTo([3.4, 0, 2.4], CASE), Math.PI, sstep(seg(Tm, 91.6, 92.2)));
      const walking = Tm > 76.2 && Tm < 78.3;
      zPose = over(walking ? walk(Tm, 1.1) : soldier(Tm), { armR: [-1.0, 0, 0.22] });
      cPose = go > 0 && go < 1 ? walk(Tm, 1.4) : collector.isSpeaking(Tm) ? gesturing(Tm, 0.7, 2) : homely(Tm, 2);
      if (Tm > 91.8) cPose = over(homely(Tm, 2), { hips: [0.1, 0, 0] });
      cupHolder = "zhang";
      zEyes = Tm > 87.8 && Tm < 89.4 ? "narrow" : "open";
    } else {
      // Under the lamp: three stones, a price, and no haggling.
      zPos = BENCH_Z;
      cPos = BENCH_C;
      zYaw = Math.PI;
      cYaw = 0;
      const setting = win(Tm, 99.2, 102.3, 0.4, 0.5);
      const rub = win(Tm, 102.4, 106.6, 0.4, 0.4);
      const stunned = win(Tm, 109.8, 114.2, 0.25, 0.6);
      cPose = collector.isSpeaking(Tm) ? gesturing(Tm, 0.55, 2) : homely(Tm, 2);
      cPose = mix(cPose, over(homely(Tm, 2), { armR: [-0.9, 0, 0.55 + Math.sin(Tm * 9) * 0.06], armL: [-0.9, 0, -0.55 - Math.sin(Tm * 9 + 1) * 0.06] }), rub);
      cPose = mix(cPose, { hips: [-0.04, 0, 0], neck: [-0.06, 0, 0.05], armR: [-0.25, 0, 0.1], armL: [-0.2, 0, -0.1] }, stunned);
      cPose = mix(cPose, over(homely(Tm, 2), { hips: [0.42, 0, 0], neck: [0.2, 0, 0] }), setting);
      const phoneUp = keys(Tm, [[106.6, 0], [107.4, 1], [118.2, 1], [119.4, 0]]);
      zPose = over(soldier(Tm), {
        armL: [lerp(0.03, -1.05, phoneUp), 0, lerp(-0.03, -0.28, phoneUp)],
        neck: [keys(Tm, [[106.8, 0.02], [107.6, 0.26], [109.4, 0.05], [117, 0.05], [118.6, 0.3]]), 0, 0],
      });
      cast.phone.visible = phoneUp > 0.05;
      cEyes = stunned > 0.4 ? "wide" : "open";
      cMouth = (Tm > 102.2 && Tm < 106.8) || (Tm > 110.2 && Tm < 114.4) ? "smile" : "shut";
      zEyes = Tm > 117 ? "narrow" : "open";
    }

    zhang.at(zPos, zYaw).pose(zPose).live(Tm, { eyes: zEyes });
    collector.at(cPos, cYaw).pose(cPose).live(Tm, { eyes: cEyes, mouth: cMouth });

    // Hands that have to hit a mark.
    if (Tm >= T.B4 && Tm < T.B5 && Tm > 49.6 && Tm < 55) {
      pointArm(collector, "armR", [2.2 + Math.sin(Tm * 1.3) * 0.5, 1.35 + Math.sin(Tm * 2.1) * 0.15, 0.5], sstep(seg(Tm, 49.6, 50.4)));
    }
    if (Tm >= T.B5 && Tm > 72 && Tm < 75.6) {
      pointArm(collector, "armR", [4.7, 1.3 + Math.sin(Tm * 10) * 0.06, 3.5], win(Tm, 72, 75.6, 0.4, 0.5));
    }
    if (Tm >= 91.9 && Tm < T.B7) {
      const reach = Math.max(win(Tm, 92.6, 94.4, 0.5, 0.4), win(Tm, 94.5, 95.3, 0.3, 0.3) * 0.9, win(Tm, 95.3, 96.2, 0.3, 0.2) * 0.9);
      const slot = Tm < 94.4 ? 0 : Tm < 95.3 ? 1 : 2;
      const s = ROOM.shelfSlots[slot]!;
      pointArm(collector, "armR", [s[0], s[1] + 0.12, s[2] + 0.12], reach);
    }
    if (Tm >= T.B7 && Tm > 99.2 && Tm < 102.3) {
      const i = Tm < STONE_THUNKS[0]! + 0.25 ? 0 : Tm < STONE_THUNKS[1]! + 0.25 ? 1 : 2;
      const f = ROOM.feltSlots[i]!;
      const lift = 1 - easeOut(seg(Tm, STONE_THUNKS[i]! - 0.35, STONE_THUNKS[i]!));
      pointArm(collector, "armR", [f[0], f[1] + 0.22 + lift * 0.16, f[2] - 0.05], win(Tm, 99.2, 102.3, 0.4, 0.4));
    }

    // The cup, the phone glow.
    let cupPos: V3 = [0, -10, 0];
    if (cupHolder !== "none") {
      const p = holdUpright(cup, cupHolder === "zhang" ? zhang : collector, "handR", 0.1);
      cupPos = [p.x, p.y, p.z];
    }
    if (cast.phone.visible) {
      cast.phone.getWorldPosition(tmp);
      room.phoneLight.position.set(tmp.x, tmp.y + 0.05, tmp.z - 0.12);
      room.phoneLight.intensity = 0.9 + wobble(Tm * 3, 4) * 0.05;
    }
    if (room.magnifier.visible) {
      anchorPos(collector, "handR", tmp);
      room.magnifier.position.set(tmp.x, tmp.y + 0.02, tmp.z - 0.12);
      room.magnifier.rotation.set(0.5, Math.PI / 2, 0);
    }
    anchorPos(zhang, "head", tmp);
    const zhangHead: V3 = [tmp.x, tmp.y - 0.22, tmp.z];
    anchorPos(collector, "head", tmp);
    const collHead: V3 = [tmp.x, tmp.y - 0.22, tmp.z];
    return { zhangHead, collHead, cupPos };
  };

  /** A little operator's breath on every frame, so nothing is locked off dead. */
  const drift = (Tm: number, amt = 0.012): V3 => [wobble(Tm * 0.5, 1) * amt, wobble(Tm * 0.43, 2) * amt, wobble(Tm * 0.37, 3) * amt];
  const head = (h: V3, dy = 0): V3 => [h[0], h[1] + dy, h[2]];

  return [
    ...shotsYard(ctx),

    cut("B2a-enter", T.B2, 26.3, (t, Tm) => {
      stage(Tm);
      frameCam(camera, [5.9, 1.12, 3.9], [-2.6, 0.22 + t * 0.01, -2.9], 2.9, 38, 0, drift(Tm));
      ctx.overlay.fade = 1 - sstep(seg(t, 0, 0.6));
    }),
    cut("B2b-greeting", 26.3, T.B3, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.collHead, -0.2), [-1.7, 0.04, 0.8], lerp(1.5, 1.36, sstep(t / 4.2)), 33, 0, drift(Tm));
    }),
    cut("B3a-soldier", T.B3, 38.7, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.collHead, -0.22), [1.5, 0.06, 1.3], lerp(1.5, 1.32, sstep(t / 8.2)), 32, 0, drift(Tm));
    }),
    cut("B3b-you-too", 38.7, 41.8, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.16), [-0.7, 0.03, 1.6], lerp(1.2, 1.1, t / 3.1), 30, 0, drift(Tm));
    }),
    cut("B3c-two-shot", 41.8, T.B4, (t, Tm) => {
      stage(Tm);
      frameCam(camera, [4.0 + t * 0.02, 1.22, 3.6], [0, 0.04, 1], 1.86, 46, 0, drift(Tm));
    }),
    cut("B4a-why", T.B4, 49.0, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.18), [-0.3, 0.02, -1.3], 1.25, 32, 0, drift(Tm));
    }),
    cut("B4b-cases", 49.0, T.B5, (t, Tm) => {
      const s = stage(Tm);
      const p = keysV(t, [[0, [1.05, 1.52, 0.84]], [8.5, [1.75, 1.5, 0.9]]], (x) => x);
      shootCam(camera, [p[0] + drift(Tm, 0.006)[0], p[1], p[2]], [s.collHead[0] + 0.5, s.collHead[1] - 0.1, s.collHead[2] - 0.45], 42);
    }),
    cut("B5a-earth", T.B5, 62.3, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.14), [-0.6, 0.02, -1.5], lerp(1.2, 1.06, sstep(t / 4.8)), 30, 0, drift(Tm));
    }),
    cut("B5b-cup", 62.3, 67.4, (t, Tm) => {
      const s = stage(Tm);
      const c = s.cupPos;
      frameCam(camera, [c[0], c[1] + 0.12, c[2]], [-0.75, -0.02, -1.0], lerp(0.74, 0.66, t / 5.1), 30, 0, drift(Tm, 0.005));
    }),
    cut("B5c-tea", 67.4, 71.6, (t, Tm) => {
      const s = stage(Tm);
      const c = s.cupPos;
      frameCam(camera, [c[0], c[1] + 0.1, c[2]], [-0.18, 1, -0.3], lerp(0.5, 0.36, sstep(t / 4.2)), 30, 0.2 + t * 0.035);
    }),
    cut("B5d-haggle", 71.6, T.B6, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.collHead, -0.2), [1.3, 0.04, -0.5], 1.4, 32, 0, drift(Tm));
    }),
    cut("B6a-what-kind", T.B6, 79.2, (t, Tm) => {
      stage(Tm);
      frameCam(camera, [4.2, 1.15, 2.6], [-0.3 + t * 0.02, 0.1, 1.0], 2.25, 40, 0, drift(Tm));
    }),
    cut("B6b-spec", 79.2, 84.8, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.08), [-1.5, 0.02, -0.9], lerp(1.0, 0.72, sstep(t / 5.6)), 28, 0, drift(Tm, 0.005));
    }),
    cut("B6c-carving", 84.8, 87.6, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.collHead, -0.18), [1.2, 0.03, -1.0], 1.2, 30, 0, drift(Tm));
    }),
    cut("B6d-lathe", 87.6, 91.4, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.03), [-1.1, 0.0, -1.4], lerp(0.86, 0.76, t / 3.8), 24, 0, drift(Tm, 0.004));
    }),
    cut("B6e-shelf", 91.4, T.B7, (t, Tm) => {
      const s = stage(Tm);
      stage(Tm);
      void s;
      frameCam(camera, [4.8, 1.36, 0.42], [1.25 - t * 0.03, 0.12, 1.0], lerp(1.05, 0.92, t / 4.8), 30, 0, drift(Tm, 0.004));
    }),
    cut("B7a-three", T.B7, 99.4, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.2), [-1.0, -0.1, -1.6], lerp(1.36, 1.24, t / 3.2), 32, 0, drift(Tm));
    }),
    cut("B7b-felt", 99.4, 102.4, (t, Tm) => {
      stage(Tm);
      frameCam(camera, [6.3, 0.97, 2.08], [0.02, 0.9, 0.85], lerp(0.92, 0.84, t / 3), 36, 0, drift(Tm, 0.004));
    }),
    cut("B7c-price", 102.4, 106.7, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.collHead, -0.25), [-0.9, 0.02, 1.6], 1.45, 33, 0, drift(Tm));
    }),
    cut("B7d-pay", 106.7, 110.2, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.3), [-0.9, -0.1, -1.0], 1.5, 34, 0, drift(Tm));
    }),
    cut("B7e-stunned", 110.2, 114.4, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.collHead, -0.08), [-0.4, 0.0, 1.5], lerp(0.92, 0.84, t / 4.2), 27, 0, drift(Tm, 0.004));
    }),
    cut("B7f-no", 114.4, 118.9, (t, Tm) => {
      const s = stage(Tm);
      frameCam(camera, head(s.zhangHead, -0.06), [-0.5, 0.0, -1.5], lerp(1.02, 0.66, sstep(t / 4.5)), 26, 0, drift(Tm, 0.004));
    }),
    cut("B7g-stones", 118.9, T.C1, (t, Tm) => {
      stage(Tm);
      // The room falls away; only the lamp's pool and the three stones remain.
      const dim = sstep(seg(t, 0.2, 3.2));
      room.hemi.intensity = lerp(0.5, 0.12, dim);
      room.windowLight.intensity = lerp(0.9, 0.1, dim);
      for (const l of room.cabinetLights) l.intensity = lerp(1.0, 0.1, dim);
      frameCam(camera, [6.3, 0.97, 2.08], [-1.0, 0.5, 0.42], lerp(0.95, 0.56, sstep(t / 3.6)), 26);
      ctx.overlay.fade = sstep(seg(t, 2.7, 3.55));
    }),
  ];
}
