import * as THREE from "three";
import { CinematicPlayer, validateVoiceCues, type Shot } from "@agentbench/cinematic-player";
import { DURATION } from "./timeline";
import { voiceCues } from "./cues/voice";
import { soundCues } from "./cues/sound";
import { buildCast, type Cast } from "./cast/cast";
import { buildRoom, type RoomSet } from "./sets/room";
import { buildYard, type YardSet } from "./sets/yard";
import { buildShop, type ShopSet } from "./sets/shop";
import { buildCellar, type CellarSet } from "./sets/cellar";
import { buildSpace, type SpaceSet } from "./sets/space";
import { shotsA } from "./shots/a_open";
import { shotsB } from "./shots/b_collector";
import { shotsC } from "./shots/c_making";
import { shotsD } from "./shots/d_orbit";
import { shotsE } from "./shots/e_coda";

/** Screen-space dressing that sits over the 3D picture; applied to the DOM by main.ts. */
export interface Overlay {
  /** 0..1 black (or `fadeColour`) over the whole frame. */
  fade: number;
  fadeColour: string;
  /** Location / time stamp, top-left. Not speech. */
  caption: string;
  captionAlpha: number;
  title: number;
  endCard: number;
  /** Telescopic sight mask and reticle. */
  scope: number;
  scopeX: number;
  scopeY: number;
  /** White flash for muzzle blasts. */
  flash: number;
}

export interface Ctx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  exposure: number;
  overlay: Overlay;
  cast: Cast;
  room: RoomSet;
  yard: YardSet;
  shop: ShopSet;
  cellar: CellarSet;
  space: SpaceSet;
  /** Show exactly one set and reset the frame's transient state. */
  use(set: "room" | "yard" | "shop" | "cellar" | "space"): void;
}

export interface ShotDef {
  id: string;
  start: number;
  end: number;
  /** `t` is shot-local, `T` absolute. Must be a pure function of time. */
  update(t: number, T: number): void;
}

export function createFilm(options: { partial?: boolean } = {}): { player: CinematicPlayer<Ctx>; ctx: Ctx; shots: ShotDef[] } {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 9000);
  scene.add(camera);

  const cast = buildCast();
  const room = buildRoom();
  const yard = buildYard();
  const shop = buildShop();
  const cellar = buildCellar();
  const space = buildSpace();
  scene.add(cast.group, room.group, yard.group, shop.group, cellar.group, space.group);

  const overlay: Overlay = {
    fade: 0, fadeColour: "#000", caption: "", captionAlpha: 0, title: 0, endCard: 0, scope: 0, scopeX: 0, scopeY: 0, flash: 0,
  };
  const sets = { room, yard, shop, cellar, space };
  const ctx: Ctx = {
    scene, camera, exposure: 1, overlay, cast, room, yard, shop, cellar, space,
    use(name) {
      for (const key of Object.keys(sets) as Array<keyof typeof sets>) sets[key].group.visible = key === name;
    },
  };

  const reset = (): void => {
    for (const key of Object.keys(sets) as Array<keyof typeof sets>) sets[key].group.visible = false;
    cast.hideAll();
    overlay.fade = 0;
    overlay.fadeColour = "#000";
    overlay.caption = "";
    overlay.captionAlpha = 0;
    overlay.title = 0;
    overlay.endCard = 0;
    overlay.scope = 0;
    overlay.scopeX = 0;
    overlay.scopeY = 0;
    overlay.flash = 0;
    ctx.exposure = 1;
    (scene.background as THREE.Color).setHex(0x000000);
    scene.fog = null;
    camera.near = 0.05;
    camera.far = 9000;
  };

  const defs: ShotDef[] = [...shotsA(ctx), ...shotsB(ctx), ...shotsC(ctx), ...shotsD(ctx), ...shotsE(ctx)];
  defs.sort((a, b) => a.start - b.start);
  for (let i = 0; i < defs.length && !options.partial; i++) {
    const d = defs[i]!;
    const expected = i === 0 ? 0 : defs[i - 1]!.end;
    if (Math.abs(d.start - expected) > 1e-6) throw new Error(`Shot ${d.id} starts at ${d.start}, expected ${expected}`);
  }
  if (!options.partial && Math.abs(defs[defs.length - 1]!.end - DURATION) > 1e-6) throw new Error("Shots do not reach the end of the film");

  const shots: Shot<Ctx>[] = defs.map((d) => ({
    id: d.id,
    start: d.start,
    end: d.end,
    update: (frame) => {
      reset();
      d.update(frame.localTime, frame.time);
    },
  }));

  const player = new CinematicPlayer<Ctx>({
    duration: DURATION,
    context: ctx,
    shots,
    cues: [...validateVoiceCues(voiceCues, DURATION), ...soundCues],
  });
  return { player, ctx, shots: defs };
}
