import * as THREE from "three";
import type { Ctx, ShotDef } from "../film";
import { T } from "../timeline";
import { ROOM } from "../sets/room";
import { homely, mix, over } from "../cast/actors";
import { keys, lerp, seg, shootCam, sstep, win, wobble, type V3 } from "../lib/util";
import { anchorPos, cut, frameCam } from "./common";

/**
 * Sequence E — coda. Back in the room of stones, at night. The radio says
 * "meteor shower"; three stands on the iron shelf are empty; the man who loves
 * things from beyond the world hears only a wonder.
 */
export function shotsE(ctx: Ctx): ShotDef[] {
  const { cast, room, camera } = ctx;
  const c = cast.collector;
  const tmp = new THREE.Vector3();

  const stage = (Tm: number): V3 => {
    ctx.use("room");
    room.mood("night", 1);
    ctx.exposure = 1.1;
    room.walnut.visible = false;
    room.magnifier.visible = false;
    room.phoneLight.intensity = 0;
    room.radio.visible = true;
    (room.radioGlow.material as THREE.SpriteMaterial).opacity = 0.45 + wobble(Tm * 3, 31) * 0.08;
    room.doorLeaf.rotation.y = 0;
    room.pane.position.x = 0.6 + 0.05 + 2 * 1.7 + 0.82;
    for (const s of room.shelfStones) s.visible = false;
    for (const s of room.feltStones) s.visible = false;
    // He is polishing a small stone when the bulletin comes on; he stops, and looks up.
    const hear = sstep(seg(Tm, 339.6, 341.2));
    const up = sstep(seg(Tm, 343.4, 344.6));
    const rub = Math.sin(Tm * 6) * (1 - hear);
    const work = over(homely(Tm, 2), { hips: [0.3, 0, 0], neck: [0.3, 0, 0], armR: [-1.05, 0, 0.3 + rub * 0.08], armL: [-0.95, 0, -0.3 - rub * 0.05] });
    const listen = over(homely(Tm, 2), { hips: [0.05, 0.2, 0], neck: [lerp(0.0, -0.32, up), lerp(0.55, 0.15, up), 0], armR: [-0.7, 0, 0.25], armL: [-0.5, 0, -0.2] });
    c.show().at([6.25, 0, 3.05], Math.PI).pose(mix(work, listen, hear)).live(Tm, { mouth: "shut" });
    anchorPos(c, "head", tmp);
    return [tmp.x, tmp.y - 0.22, tmp.z];
  };

  return [
    cut("E1a-radio", T.E1, 341.4, (t, Tm) => {
      const h = stage(Tm);
      void h;
      shootCam(camera, [4.9 + t * 0.03 + wobble(Tm * 0.4, 1) * 0.01, 1.32, 1.12], [6.05, 1.22, 2.7], 40, 0);
      ctx.overlay.fade = 1 - sstep(seg(t, 0, 1.4));
    }),
    cut("E1b-empty", 341.4, T.E2, (t, Tm) => {
      stage(Tm);
      // Three pale stands under their little lights, with nothing on them.
      const s = ROOM.shelfSlots[1]!;
      frameCam(camera, [s[0], s[1] + 0.06, s[2]], [0.35 - t * 0.03, 0.14, 1], lerp(1.25, 0.82, sstep(t / 5.6)), 30, 0);
      ctx.overlay.fade = sstep(seg(t, 4.5, 5.6));
    }),
    cut("E2-card", T.E2, T.END, (t) => {
      ctx.overlay.fade = 1;
      ctx.overlay.endCard = sstep(seg(t, 0.4, 1.6));
    }),
  ];
}

void keys;
