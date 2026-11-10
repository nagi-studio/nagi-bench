import * as THREE from "three";
import { walk } from "@agentbench/voxel-kit";
import type { Ctx, ShotDef } from "../film";
import { T } from "../timeline";
import { soldier } from "../cast/actors";
import { keysV, lerp, seg, shootCam, sstep, win, type V3 } from "../lib/util";
import { cut } from "./common";

/** How long the walk from the gate to the door takes, and its cadence. */
export const YARD_WALK = { start: 14.6, end: 21.4, stride: 1.25 };

/** B1 — one descending crane shot: a man in a dark coat crosses a quiet yard. */
export function shotsYard(ctx: Ctx): ShotDef[] {
  const { camera, cast, yard, scene } = ctx;
  return [
    cut("B1-yard", T.B1, T.B2, (t, Tm) => {
      ctx.use("yard");
      ctx.exposure = 1.05;
      (scene.background as THREE.Color).setHex(yard.sky);
      scene.fog = scene.fog ?? null;
      const u = seg(Tm, YARD_WALK.start, YARD_WALK.end);
      const pos: V3 = [9, 0, lerp(17.6, 5.35, u)];
      cast.zhang.show().at(pos, Math.PI).pose(u > 0 && u < 1 ? walk(Tm, YARD_WALK.stride) : soldier(Tm)).face("open", "shut");
      const k = sstep(t / 8);
      const p = keysV(t, [[0, [13.6, 9.2, 23.5]], [8, [11.4, 3.4, 16.2]]]);
      shootCam(camera, p, [9 + (1 - k) * 0.6, lerp(0.6, 1.5, k), lerp(11, 5, k)], lerp(40, 34, k), lerp(-0.05, 0, k));
      ctx.overlay.fade = Math.max(1 - sstep(seg(t, 0, 1.2)), sstep(seg(t, 7.5, 8)));
      ctx.overlay.caption = "四个月前　北京 · 胡同深处";
      ctx.overlay.captionAlpha = win(t, 1.4, 6.6, 0.8, 0.8);
    }),
  ];
}
