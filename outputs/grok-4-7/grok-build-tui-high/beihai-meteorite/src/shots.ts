import * as THREE from "three";
import { lerp, segmentProgress, smoothstep } from "@agentbench/cinematic-player";
import type { Shot } from "@agentbench/cinematic-player";
import {
  performEpilogue,
  performHouse,
  performPit,
  performShop,
  performSpace,
  performTitle,
  scopeAlpha,
} from "./perform";
import { TEST_FIRES, flashes } from "./timeline";
import type { World } from "./world";
import { showSet } from "./world";

const eye = new THREE.Vector3();
const look = new THREE.Vector3();

function frame(
  camera: THREE.PerspectiveCamera,
  ex: number,
  ey: number,
  ez: number,
  tx: number,
  ty: number,
  tz: number,
  fov: number,
  time: number,
  drift = 0.012,
): void {
  camera.up.set(0, 1, 0);
  camera.position.set(
    ex + Math.sin(time * 0.37) * drift,
    ey + Math.cos(time * 0.29) * drift * 0.6,
    ez + Math.sin(time * 0.17) * drift * 0.35,
  );
  camera.lookAt(tx, ty, tz);
  if (Math.abs(camera.fov - fov) > 0.02) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

function mixFrame(
  camera: THREE.PerspectiveCamera,
  a: [number, number, number, number, number, number, number],
  b: [number, number, number, number, number, number, number],
  t: number,
  time: number,
  drift = 0.01,
): void {
  const k = smoothstep(t);
  frame(
    camera,
    lerp(a[0], b[0], k),
    lerp(a[1], b[1], k),
    lerp(a[2], b[2], k),
    lerp(a[3], b[3], k),
    lerp(a[4], b[4], k),
    lerp(a[5], b[5], k),
    lerp(a[6], b[6], k),
    time,
    drift,
  );
}

function fitShadow(world: World, size: number): void {
  const cam = world.key.shadow.camera as THREE.OrthographicCamera;
  cam.left = -size;
  cam.right = size;
  cam.top = size;
  cam.bottom = -size;
  cam.near = 0.4;
  cam.far = 180;
  cam.updateProjectionMatrix();
  world.key.target.updateMatrixWorld();
  world.fill.target.updateMatrixWorld();
}

function applyRig(
  world: World,
  bg: number,
  fog: number,
  density: number,
  exposure: number,
  shadow: number,
): void {
  world.bg.setHex(bg);
  world.fog.color.setHex(fog);
  world.fog.density = density;
  world.renderer.setClearColor(bg, 1);
  world.renderer.toneMappingExposure = exposure;
  fitShadow(world, shadow);
}

function hideScope(world: World): void {
  world.scope.visible = false;
  (world.scopeMat.uniforms.uAlpha as THREE.IUniform).value = 0;
}

function showScope(world: World, time: number): void {
  const alpha = scopeAlpha(time);
  world.scope.visible = alpha > 0.02;
  (world.scopeMat.uniforms.uAlpha as THREE.IUniform).value = alpha;
  (world.scopeMat.uniforms.uAspect as THREE.IUniform).value = world.camera.aspect || 1.6;
}

function gradeTitle(world: World): void {
  applyRig(world, 0x000000, 0x000000, 0.09, 1.02, 3);
  world.ambient.color.setHex(0xfff4e4);
  world.ambient.intensity = 0.16;
  world.hemi.intensity = 0.08;
  world.key.color.setHex(0xfff1d2);
  world.key.intensity = 3.4;
  world.key.position.set(1.6, 3.4, 2.1);
  world.key.target.position.set(0, 0.35, 0);
  world.fill.color.setHex(0x88a0c8);
  world.fill.intensity = 0.25;
  world.fill.position.set(-2, 1, -1);
  world.fill.target.position.set(0, 0.3, 0);
}

function gradeHouse(world: World, density = 0.055): void {
  applyRig(world, 0x121722, 0x121722, density, 0.94, 8);
  world.ambient.color.setHex(0xffe6cc);
  world.ambient.intensity = 0.22;
  world.hemi.color.setHex(0x1c2434);
  world.hemi.groundColor.setHex(0x3a2a1e);
  world.hemi.intensity = 0.38;
  world.key.color.setHex(0xffe0b8);
  world.key.intensity = 1.7;
  world.key.position.set(2.4, 6.5, 3);
  world.key.target.position.set(0, 1.2, -1);
  world.fill.color.setHex(0x7f92b4);
  world.fill.intensity = 0.42;
  world.fill.position.set(-3, 2.2, 4);
  world.fill.target.position.set(0, 1.3, -2);
}

function gradeShop(world: World): void {
  applyRig(world, 0x0e1216, 0x0e1216, 0.04, 0.98, 6);
  world.ambient.color.setHex(0xd5e4e0);
  world.ambient.intensity = 0.24;
  world.hemi.color.setHex(0x1a2428);
  world.hemi.groundColor.setHex(0x2a3034);
  world.hemi.intensity = 0.3;
  world.key.color.setHex(0xd7ece6);
  world.key.intensity = 1.45;
  world.key.position.set(-2, 5, 3);
  world.key.target.position.set(0.4, 1.2, 0.2);
  world.fill.color.setHex(0x8090a0);
  world.fill.intensity = 0.35;
  world.fill.position.set(3, 2, 2);
  world.fill.target.position.set(0, 1, 0);
}

function gradePit(world: World, time: number): void {
  const flash = flashes(TEST_FIRES, time, 0.08);
  applyRig(world, 0x070605, 0x100c0a, 0.09, 0.7 + flash * 0.28, 4);
  world.ambient.color.setHex(0xffd0a8);
  world.ambient.intensity = 0.14;
  world.hemi.intensity = 0.05;
  world.key.color.setHex(0xffc090);
  world.key.intensity = 0.18;
  world.key.position.set(0.2, 3.2, 0.4);
  world.key.target.position.set(0, 1, -0.4);
  world.fill.color.setHex(0x3a4250);
  world.fill.intensity = 0.12;
  world.fill.position.set(-1, 1.2, 1);
  world.fill.target.position.set(0, 1, 0);
}

function gradeSpace(world: World, time: number): void {
  const fade = smoothstep(segmentProgress(time, 226, 304));
  applyRig(world, 0x000000, 0x000000, 0, lerp(1.04, 0.8, fade), 8);
  world.c1.setHex(0xffe4c0);
  world.c2.setHex(0x722c16);
  world.key.color.copy(world.c1).lerp(world.c2, fade);
  world.key.intensity = lerp(3.5, 0.2, fade);
  world.key.position.copy(world.space.sun.position);
  world.key.target.position.set(0.4, 2.4, -12);
  world.fill.color.setHex(0x6e92c6);
  world.fill.intensity = lerp(0.26, 0.85, fade);
  world.fill.position.set(-8, 1.5, 12);
  world.fill.target.position.set(0, 2, -8);
  world.ambient.color.setHex(0x0c1018);
  world.ambient.intensity = lerp(0.06, 0.14, fade);
  world.hemi.color.setHex(0x07090e);
  world.hemi.groundColor.setHex(0x040506);
  world.hemi.intensity = 0.1;
}

export function createShots(): Shot<World>[] {
  return [
    {
      id: "title",
      start: 0,
      end: 11,
      update: ({ context, time }) => {
        showSet(context, "title");
        hideScope(context);
        performTitle(context, time);
        gradeTitle(context);
        frame(context.camera, 0.15, 0.95, 1.85, 0, 0.5, 0, 34, time, 0.008);
      },
    },
    {
      id: "alley",
      start: 11,
      end: 30,
      update: ({ context, time }) => {
        showSet(context, "house");
        hideScope(context);
        performHouse(context, time);
        gradeHouse(context, 0.062);
        const z = context.cast.zhang.root.position.z;
        const u = segmentProgress(time, 14, 28);
        mixFrame(
          context.camera,
          [2.4, 2.15, 10.2, 0.4, 1.3, 4, 42],
          [1.8, 1.85, z + 3.4, 0.3, 1.25, z - 2.2, 36],
          u,
          time,
          0.016,
        );
      },
    },
    {
      id: "greet",
      start: 30,
      end: 56,
      update: ({ context, time }) => {
        showSet(context, "house");
        hideScope(context);
        performHouse(context, time);
        gradeHouse(context, 0.04);
        const u = segmentProgress(time, 34, 44);
        mixFrame(
          context.camera,
          [1.6, 1.7, 0.2, 0.1, 1.4, -2.4, 40],
          [2.15, 1.62, -2.7, 0.05, 1.45, -3.2, 34],
          u,
          time,
          0.01,
        );
      },
    },
    {
      id: "worlds",
      start: 56,
      end: 84,
      update: ({ context, time }) => {
        showSet(context, "house");
        hideScope(context);
        performHouse(context, time);
        gradeHouse(context, 0.036);
        if (time < 67) {
          frame(context.camera, 1.35, 1.55, -3.15, 0.15, 1.42, -3.9, 32, time, 0.008);
        } else if (time < 77) {
          frame(context.camera, 0.4, 1.55, -3.5, -0.16, 1.52, -2.18, 30, time, 0.008);
        } else {
          frame(context.camera, 1.45, 1.55, -3.25, 0.22, 1.48, -3.92, 32, time, 0.01);
        }
      },
    },
    {
      id: "iron",
      start: 84,
      end: 106,
      update: ({ context, time }) => {
        showSet(context, "house");
        hideScope(context);
        performHouse(context, time);
        gradeHouse(context, 0.034);
        if (time < 94) {
          frame(context.camera, 0.35, 1.28, -2.35, 0.05, 0.95, -3.1, 30, time, 0.006);
        } else if (time < 101.2) {
          frame(context.camera, 1.55, 1.55, -3.2, 0.22, 1.48, -3.92, 32, time, 0.008);
        } else {
          frame(context.camera, 0.85, 1.55, -1.55, -0.16, 1.5, -2.18, 30, time, 0.006);
        }
      },
    },
    {
      id: "respect",
      start: 106,
      end: 124,
      update: ({ context, time }) => {
        showSet(context, "house");
        hideScope(context);
        performHouse(context, time);
        gradeHouse(context, 0.032);
        if (time < 114.6) {
          frame(context.camera, 1.5, 1.52, -3.2, 0.22, 1.46, -3.92, 30, time, 0.006);
        } else {
          const u = segmentProgress(time, 114.6, 123);
          mixFrame(
            context.camera,
            [0.85, 1.58, -3.55, -0.16, 1.52, -2.18, 32],
            [0.55, 1.55, -3.35, -0.16, 1.52, -2.18, 26],
            u,
            time,
            0.005,
          );
        }
      },
    },
    {
      id: "lathe",
      start: 124,
      end: 150,
      update: ({ context, time }) => {
        showSet(context, "shop");
        hideScope(context);
        performShop(context, time);
        gradeShop(context);
        const u = segmentProgress(time, 124, 149);
        mixFrame(
          context.camera,
          [3.5, 2.15, 2.75, 0.3, 1.15, 0.15, 42],
          [2.7, 1.85, 2.25, 0.7, 1.2, 0.35, 36],
          u,
          time,
          0.01,
        );
      },
    },
    {
      id: "load",
      start: 150,
      end: 176,
      update: ({ context, time }) => {
        showSet(context, "pit");
        hideScope(context);
        performPit(context, time);
        gradePit(context, time);
        frame(context.camera, 2.35, 1.55, 0.9, 0.4, 1.25, -0.05, 38, time, 0.008);
      },
    },
    {
      id: "proof",
      start: 176,
      end: 202,
      update: ({ context, time }) => {
        showSet(context, "pit");
        hideScope(context);
        performPit(context, time);
        gradePit(context, time);
        if (time < 183) {
          frame(context.camera, -1.75, 1.55, 1.35, 0.15, 1.25, -0.4, 40, time, 0.01);
        } else if (time < 191.2) {
          frame(context.camera, -1.45, 1.4, -0.15, 0.05, 0.7, -1.45, 36, time, 0.008);
        } else if (time < 199) {
          frame(context.camera, -1.15, 1.48, -1.7, 0.05, 1.25, -0.7, 36, time, 0.006);
        } else {
          frame(context.camera, 0.7, 1.7, 1.1, 0.05, 2.2, 0.1, 30, time, 0.006);
        }
      },
    },
    {
      id: "bridge",
      start: 202,
      end: 216,
      update: ({ context, time }) => {
        showSet(context, "space");
        hideScope(context);
        performSpace(context, time);
        gradeSpace(context, time);
        const u = segmentProgress(time, 202, 216);
        mixFrame(
          context.camera,
          [0.4, 2.8, 4.2, 1.2, 8, -36, 28],
          [1.8, 3.5, 8.2, 2.2, 5.2, -28, 40],
          u,
          time,
          0.02,
        );
      },
    },
    {
      id: "void",
      start: 216,
      end: 246,
      update: ({ context, time }) => {
        showSet(context, "space");
        hideScope(context);
        performSpace(context, time);
        gradeSpace(context, time);
        const u = segmentProgress(time, 226, 242);
        mixFrame(
          context.camera,
          [1.4, 3.55, 9.2, 2.4, 3.1, -22, 40],
          [1.55, 2.48, 2.35, 0.15, 2.35, -4, 30],
          u,
          time,
          0.014,
        );
      },
    },
    {
      id: "sunset",
      start: 246,
      end: 270,
      update: ({ context, time }) => {
        showSet(context, "space");
        hideScope(context);
        performSpace(context, time);
        gradeSpace(context, time);
        const u = segmentProgress(time, 252, 266);
        mixFrame(
          context.camera,
          [2.2, 3.1, 4.2, 5, 3.6, -18, 38],
          [6.6, 4.9, -12.4, 7.8, 4.5, -16.5, 28],
          u,
          time,
          0.01,
        );
      },
    },
    {
      id: "aim",
      start: 270,
      end: 290,
      update: ({ context, time }) => {
        showSet(context, "space");
        performSpace(context, time);
        gradeSpace(context, time);
        showScope(context, time);
        if (time < 276.2) {
          frame(context.camera, 1.7, 2.7, 3.1, 0.2, 2.5, 0.4, 32, time, 0.008);
        } else if (time < 286.2) {
          frame(context.camera, 1.15, 2.55, 2.55, 0.25, 2.35, 1.1, 28, time, 0.006);
        } else {
          frame(context.camera, 7.85, 4.75, -13.05, 7.8, 4.55, -16.15, 46, time, 0.004);
        }
      },
    },
    {
      id: "volley",
      start: 290,
      end: 314,
      update: ({ context, time }) => {
        showSet(context, "space");
        performSpace(context, time);
        gradeSpace(context, time);
        showScope(context, time);
        if (time < 296.4) {
          frame(context.camera, 3.2, 3.1, 5.4, 1.4, 2.8, -12, 36, time, 0.008);
        } else if (time < 300.4) {
          frame(context.camera, 1.05, 2.85, 2.35, 0.2, 2.55, 1.15, 26, time, 0.004);
        } else if (time < 306.8) {
          frame(context.camera, 7.9, 4.8, -13.1, 7.8, 4.55, -16.2, 44, time, 0.004);
        } else {
          frame(context.camera, 4.8, 4.6, -10.8, 7.8, 4.2, -18, 36, time, 0.01);
        }
      },
    },
    {
      id: "snow",
      start: 314,
      end: 350,
      update: ({ context, time }) => {
        hideScope(context);
        if (time < 340) {
          showSet(context, "space");
          performSpace(context, time);
          gradeSpace(context, time);
          const lead = context.space.crew[0];
          if (lead && time < 322) {
            lead.fig.anchors.head.getWorldPosition(look);
            frame(context.camera, look.x + 0.55, look.y, look.z + 1.55, look.x, look.y - 0.05, look.z, 28, time, 0.005);
          } else if (time < 333) {
            frame(context.camera, 3.6, 5.1, -9.5, 7.6, 4.2, -20, 40, time, 0.012);
          } else {
            context.cast.zhangSpace.root.getWorldPosition(eye);
            frame(context.camera, eye.x + 3.2, eye.y + 1.4, eye.z + 4.5, eye.x, eye.y + 1.2, eye.z, 34, time, 0.01);
          }
        } else {
          showSet(context, "house");
          performEpilogue(context, time);
          gradeHouse(context, 0.04);
          const dim = smoothstep(segmentProgress(time, 346.5, 350));
          context.renderer.toneMappingExposure = lerp(0.96, 0.62, dim);
          const u = segmentProgress(time, 340, 349);
          mixFrame(
            context.camera,
            [2.2, 1.7, -2.4, 0.2, 1.35, -3.85, 36],
            [1.45, 1.58, -2.7, 0.2, 1.42, -3.9, 30],
            u,
            time,
            0.006,
          );
        }
      },
    },
  ];
}
