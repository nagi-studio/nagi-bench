import type { Ctx, ShotDef } from "../film";
import { T } from "../timeline";
import { seg, shootCam, sstep, win } from "../lib/util";
import { cut } from "./common";
import { stageZhang, sunK } from "./d_orbit";

/**
 * Sequence A — cold open. One held image: a man adrift over the Earth, waiting
 * for a sunset. No explanation; the rest of the film is the explanation.
 */
export function shotsA(ctx: Ctx): ShotDef[] {
  const { space, camera, cast } = ctx;
  return [
    cut("A1-waiting", T.A1, T.B1, (t, Tm) => {
      ctx.use("space");
      camera.near = 0.2;
      space.update(camera, sunK(Tm), Tm);
      space.focusShadow([0, 0, 0], 9);
      space.slugs.count = 0;
      space.gas.begin().end();
      space.blood.begin().end();
      space.puffs.begin().end();
      // Reuse the orbit blocking at a quiet moment before anything has started.
      stageZhang(ctx, 200 + t * 0.6);
      cast.scope.visible = false;
      const k = sstep(t / 14);
      shootCam(camera, [7.5 - k * 2.2, -3.2 + k * 0.6, 34 - k * 9], [-3.2, -1.8, 0], 30, -0.14 + k * 0.03);
      ctx.overlay.title = win(t, 9.6, 13.7, 1.2, 0.5);
      ctx.overlay.fade = Math.max(0.0, sstep(seg(t, 13.6, 14)));
    }),
  ];
}
