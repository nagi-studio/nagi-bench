import type { Shot } from "@agentbench/cinematic-player";
import { T } from "./constants";
import { applyCamera, shakeOffset, type CamKey } from "./camera";
import { perform } from "./performance";
import { activate, type EnvName, type World } from "./world";

function shot(
  id: string,
  start: number,
  end: number,
  env: EnvName,
  keys: CamKey[],
  handheld = 0.025,
  extras?: {
    enter?: (world: World) => void;
    update?: (world: World, time: number, localTime: number) => void;
  },
): Shot<World> {
  return {
    id,
    start,
    end,
    enter({ context: world }) {
      activate(world, env);
      extras?.enter?.(world);
    },
    update({ context: world, time, localTime }) {
      perform(world, time);
      applyCamera(world.camera, localTime, keys, handheld, time);
      if (env === "basement") {
        const shots = [T.shot0, T.shot1, T.shot2, T.shot3];
        for (const t0 of shots) {
          const sh = shakeOffset(time, t0, 0.38, 0.11);
          world.camera.position.add(sh);
          world.camera.updateMatrixWorld();
        }
      }
      extras?.update?.(world, time, localTime);
    },
  };
}

export function createShots(): Shot<World>[] {
  return [
    shot("title", 0, T.titleEnd, "void", [
      { t: 0, pos: [1.15, 0.35, 2.05], look: [0, 0.05, 0], fov: 28 },
      { t: 8, pos: [0.55, 0.22, 1.55], look: [0, 0, 0], fov: 24 },
    ], 0.012),

    shot("courtyard", T.titleEnd, T.courtyardEnd, "courtyard", [
      { t: 0, pos: [3.4, 1.55, 7.4], look: [0.2, 1.1, 5.2], fov: 38 },
      { t: 6, pos: [2.2, 1.45, 3.4], look: [0.1, 1.15, 1.2], fov: 36 },
      { t: 17, pos: [1.6, 1.6, -0.4], look: [0.1, 1.2, -3.0], fov: 34 },
    ], 0.03),

    shot("museum", T.courtyardEnd, T.museumEnd, "interior", [
      { t: 0, pos: [0.2, 1.45, 3.6], look: [0, 1.15, 0.2], fov: 40 },
      { t: 8, pos: [-1.8, 1.5, 0.4], look: [-3.2, 1.2, -0.6], fov: 32 },
      { t: 16, pos: [-0.2, 1.45, 2.4], look: [1.6, 1.15, -2.4], fov: 36 },
      { t: 28, pos: [-2.0, 1.55, 2.2], look: [0.1, 1.25, 0.9], fov: 34 },
      { t: 52, pos: [-1.6, 1.48, 2.55], look: [0.0, 1.28, 1.05], fov: 32 },
    ], 0.022),

    shot("bargain", T.museumEnd, T.bargainEnd, "interior", [
      { t: 0, pos: [-1.55, 1.42, 2.2], look: [-0.3, 1.2, 1.2], fov: 30 },
      { t: 10, pos: [-0.55, 1.15, 1.55], look: [-0.5, 1.05, 1.25], fov: 26 },
      { t: 18, pos: [1.8, 1.5, 1.8], look: [-0.4, 1.2, 0.6], fov: 34 },
      { t: 26, pos: [1.6, 1.35, -1.4], look: [2.5, 1.0, -2.5], fov: 30 },
      { t: 32, pos: [-1.3, 1.2, 1.5], look: [0.1, 0.7, 0.5], fov: 28 },
      { t: 45, pos: [-1.7, 1.52, 2.4], look: [0.1, 1.25, 0.9], fov: 32 },
    ], 0.02),

    shot("workshop", T.bargainEnd, T.workshopEnd, "workshop", [
      { t: 0, pos: [3.4, 2.2, 4.2], look: [0, 0.8, 0], fov: 42 },
      { t: 8, pos: [1.6, 1.55, 2.6], look: [-0.2, 1.0, 0.2], fov: 34 },
      { t: 18, pos: [0.9, 1.25, 1.7], look: [0.1, 0.7, 0.05], fov: 28 },
      { t: 28, pos: [-1.4, 1.4, 2.1], look: [-0.2, 0.95, 0.6], fov: 32 },
    ], 0.018),

    shot("basement", T.workshopEnd, T.basementEnd, "basement", [
      { t: 0, pos: [1.7, 1.55, 1.8], look: [0.1, 0.9, 0.2], fov: 40 },
      { t: 12, pos: [0.85, 1.35, 1.25], look: [0.05, 0.95, 0.15], fov: 32 },
      { t: 24, pos: [0.35, 1.45, 2.15], look: [-0.7, 1.15, 1.0], fov: 36 },
      { t: 32, pos: [0.15, 1.25, 1.85], look: [-1.2, 0.7, 1.45], fov: 30 },
      { t: 42, pos: [-0.55, 1.55, 1.95], look: [-0.7, 1.15, 1.15], fov: 28 },
      { t: 52, pos: [0.9, 1.4, 0.4], look: [-0.2, 1.1, 0.5], fov: 34 },
    ], 0.028),

    shot("space-est", T.basementEnd, T.spaceEstEnd, "space", [
      { t: 0, pos: [-18, 10, -18], look: [4, 2, -58], fov: 48 },
      { t: 10, pos: [-8, 8.5, -8], look: [6, -4, -62], fov: 42 },
      { t: 20, pos: [6, 7.2, -10], look: [16, -18, -70], fov: 40 },
      { t: 26, pos: [2.4, 6.8, 6.5], look: [8, -8, -40], fov: 38 },
    ], 0.01),

    shot("solitude", T.spaceEstEnd, T.solitudeEnd, "space", [
      { t: 0, pos: [2.4, 6.6, 3.6], look: [0.1, 6.3, 0.1], fov: 36 },
      { t: 10, pos: [1.6, 6.55, 2.2], look: [0.05, 6.4, -0.2], fov: 30 },
      { t: 22, pos: [0.9, 6.7, 2.8], look: [10, -6, -40], fov: 38 },
      { t: 30, pos: [-1.8, 6.9, 2.4], look: [18, -16, -70], fov: 34 },
    ], 0.016),

    shot("sunset", T.solitudeEnd, T.sunsetEnd, "space", [
      { t: 0, pos: [-4.5, 7.4, -8], look: [22, -20, -90], fov: 32 },
      { t: 10, pos: [-2.2, 7.6, -18], look: [0.4, 7.3, -44], fov: 36 },
      { t: 18, pos: [4.8, 8.2, -28], look: [0.2, 7.3, -42], fov: 40 },
      { t: 26, pos: [3.2, 8.0, -32], look: [0.1, 7.35, -41.5], fov: 34 },
      { t: 32, pos: [0.4, 7.6, -34], look: [0, 7.4, -41], fov: 30 },
    ], 0.012),

    shot("aim", T.sunsetEnd, T.aimEnd, "space", [
      { t: 0, pos: [1.8, 6.7, 2.4], look: [0.15, 6.45, 0.2], fov: 34 },
      { t: 6, pos: [0.85, 6.85, 1.35], look: [0.2, 6.55, 0.15], fov: 28 },
      { t: 10, pos: [0.35, 6.95, 1.05], look: [0.15, 6.7, -8], fov: 18 },
      { t: 18, pos: [0.22, 6.92, 0.9], look: [0.05, 7.35, -41], fov: 9 },
    ], 0.008),

    shot("fire", T.aimEnd, T.fireEnd, "space", [
      { t: 0, pos: [0.22, 6.92, 0.9], look: [0.05, 7.35, -41], fov: 8.5 },
      { t: 4, pos: [1.55, 6.85, 1.7], look: [0.2, 6.7, 0.3], fov: 28 },
      { t: 8, pos: [0.9, 6.9, 1.2], look: [0.15, 6.75, -10], fov: 22 },
      { t: 16, pos: [0.28, 6.95, 0.95], look: [0.0, 7.35, -41], fov: 10 },
    ], 0.01),

    shot("finale", T.fireEnd, T.end, "space", [
      { t: 0, pos: [3.6, 8.4, -30], look: [0.1, 7.35, -41.2], fov: 32 },
      { t: 5, pos: [2.2, 8.0, -34], look: [0.0, 7.3, -42], fov: 36 },
      { t: 9, pos: [-2.4, 7.2, 4.5], look: [4, 6.4, -20], fov: 40 },
      { t: 16, pos: [8, 8.5, -20], look: [14, 5.4, -48], fov: 34 },
    ], 0.014),
  ];
}

export function overlayState(time: number): {
  title: number;
  end: number;
  fade: number;
  scope: boolean;
} {
  const title =
    time < 1.2 ? time / 1.2
    : time < 5.6 ? 1
    : time < T.titleEnd ? 1 - (time - 5.6) / (T.titleEnd - 5.6)
    : 0;
  const fade =
    time < T.fadeStart ? 0
    : time < T.fadeStart + 3.6 ? (time - T.fadeStart) / 3.6
    : 1;
  const end =
    time < 344.4 ? 0
    : time < 347.2 ? (time - 344.4) / 2.8
    : 1;
  const scope = time >= T.aimEnd - 6.5 && time < T.fire0 + 1.2;
  return { title, end, fade, scope };
}
