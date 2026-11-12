import * as THREE from "three";
import type { FX } from "./post";

export interface SetDef {
  name: string;
  group: THREE.Group;
  background: THREE.Color | THREE.Texture | null;
  fog: THREE.Fog | THREE.FogExp2 | null;
  exposure: number;
}

export interface Ctx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  fx: FX;
  sets: Record<string, SetDef>;
  active: string;
  [key: string]: unknown;
}

export function useSet(ctx: Ctx, name: string) {
  if (ctx.active !== name) {
    for (const s of Object.values(ctx.sets)) s.group.visible = s.name === name;
    ctx.active = name;
  }
  const s = ctx.sets[name]!;
  ctx.scene.background = s.background;
  ctx.scene.fog = s.fog;
  ctx.renderer.toneMappingExposure = s.exposure;
}

/** Reset grading values every frame so shots only declare what they change. */
export function resetFX(fx: FX) {
  fx.fade = 0;
  fx.vignette = 0.38;
  fx.grain = 0.045;
  fx.scope = 0;
  fx.flash = 0;
  fx.tint.set(1, 1, 1);
  fx.lift.set(0, 0, 0);
  fx.sat = 1;
  fx.bloom = 0.55;
  fx.reticle = 1;
}
