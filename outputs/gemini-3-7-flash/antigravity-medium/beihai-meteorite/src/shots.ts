import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import {
  aim,
  applyPose,
  float,
  idle,
  lerpPose,
  walk,
  type Pose,
} from "@agentbench/voxel-kit";
import {
  easeInOutCubic,
  fadeEnvelope,
  lerp,
  segmentProgress,
  smoothstep,
} from "@agentbench/cinematic-player";
import type { CourtyardSceneHandle } from "./scenes/courtyardScene";
import type { WorkshopSceneHandle } from "./scenes/workshopScene";
import type { BasementSceneHandle } from "./scenes/basementScene";
import type { SpaceSceneHandle } from "./scenes/spaceScene";

export interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  courtyard: CourtyardSceneHandle;
  workshop: WorkshopSceneHandle;
  basement: BasementSceneHandle;
  space: SpaceSceneHandle;
}

export const shots: Shot<FilmContext>[] = [
  // ==========================================
  // ACT I: The Courtyard Collector (0s - 55s)
  // ==========================================
  {
    id: "shot-01-courtyard-intro",
    start: 0,
    end: 18,
    enter: ({ context }) => {
      context.courtyard.root.visible = true;
      context.workshop.root.visible = false;
      context.basement.root.visible = false;
      context.space.root.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const p = easeInOutCubic(progress);
      // Camera dolly from high angle display cabinet down to conversational two-shot
      context.camera.position.set(
        lerp(-2.8, -1.6, p),
        lerp(2.6, 1.6, p),
        lerp(3.8, 2.4, p),
      );
      context.camera.lookAt(
        lerp(0, -0.2, p),
        lerp(1.2, 1.1, p),
        lerp(0, 0.4, p),
      );

      // Character animations
      applyPose(context.courtyard.zhang, idle(localTime));
      applyPose(context.courtyard.collector, idle(localTime + 1.2));
    },
    leave: () => {},
  },
  {
    id: "shot-02-cosmic-philosophy",
    start: 18,
    end: 38,
    enter: ({ context }) => {
      context.courtyard.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = smoothstep(progress);
      // Orbiting close camera framing the teacup and meteorites
      const angle = lerp(0.2, 0.8, p);
      const dist = 1.9;
      context.camera.position.set(
        Math.sin(angle) * dist - 0.4,
        1.45 + Math.sin(p * Math.PI) * 0.1,
        Math.cos(angle) * dist + 0.4,
      );
      context.camera.lookAt(-0.1, 1.15, 0.1);

      // Gestures: Collector leans in, Zhang raises arm slightly as if gesturing with teacup
      const zhangPose = lerpPose(
        idle(localTime),
        { armR: [-0.6, 0.2, 0.4], neck: [0.1, -0.2, 0] },
        smoothstep(segmentProgress(localTime, 8, 14)),
      );
      applyPose(context.courtyard.zhang, zhangPose);

      const collPose = lerpPose(
        idle(localTime + 2.0),
        { armL: [-0.5, -0.3, -0.3], neck: [-0.1, 0.3, 0] },
        smoothstep(segmentProgress(localTime, 1, 7)),
      );
      applyPose(context.courtyard.collector, collPose);
    },
    leave: () => {},
  },
  {
    id: "shot-03-widmanstatten-bargain",
    start: 38,
    end: 55,
    enter: ({ context }) => {
      context.courtyard.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = easeInOutCubic(progress);
      // Macro shot on the 3 iron meteorites on the wooden table
      context.camera.position.set(
        lerp(0.6, 0.1, p),
        lerp(1.35, 1.25, p),
        lerp(0.6, 0.35, p),
      );
      context.camera.lookAt(0.1, 1.15, -0.1);

      // Subtle lighting glint on the Widmanstätten patterns
      context.courtyard.spotlight.intensity = 2.2 + Math.sin(localTime * 2.0) * 0.4;
      applyPose(context.courtyard.zhang, idle(localTime));
      applyPose(context.courtyard.collector, idle(localTime));
    },
    leave: ({ context }) => {
      context.courtyard.root.visible = false;
    },
  },

  // ==========================================
  // ACT II: CNC Lathe Machining (55s - 94s)
  // ==========================================
  {
    id: "shot-04-cnc-machining",
    start: 55,
    end: 75,
    enter: ({ context }) => {
      context.courtyard.root.visible = false;
      context.workshop.root.visible = true;
      context.basement.root.visible = false;
      context.space.root.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const p = smoothstep(progress);
      // Camera tracking shot past the lathe spindle and cutting head
      context.camera.position.set(
        lerp(-1.4, 0.8, p),
        lerp(1.6, 1.3, p),
        lerp(1.8, 1.1, p),
      );
      context.camera.lookAt(-0.2, 0.9, 0.1);

      // Rotate lathe spindle rapidly
      context.workshop.spindle.rotation.x = localTime * 24.0;

      // Spark particle flutter
      const sparkMat = context.workshop.sparks.material as THREE.PointsMaterial;
      const cutting1 = localTime >= 9.0 && localTime <= 11.5;
      const cutting2 = localTime >= 14.0 && localTime <= 16.5;
      sparkMat.opacity = cutting1 || cutting2 ? 0.9 : 0.05;

      // Zhang Beihai operating controls
      const operPose: Pose = {
        hips: [0.1, 0, 0],
        neck: [0.2, 0.1, 0],
        armR: [-0.9, 0.2, 0.1],
        armL: [-0.7, -0.2, -0.1],
      };
      applyPose(context.workshop.zhang, operPose);
    },
    leave: () => {},
  },
  {
    id: "shot-05-recovering-evidence",
    start: 75,
    end: 94,
    enter: ({ context }) => {
      context.workshop.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = easeInOutCubic(progress);
      // Close shot looking at the 36 cut meteorite cylinders on the tool tray
      context.camera.position.set(
        lerp(1.8, 1.2, p),
        lerp(1.3, 1.15, p),
        lerp(0.8, 0.45, p),
      );
      context.camera.lookAt(1.4, 0.95, 0.2);

      // Zhang inspects and gathers tools
      const inspectPose = lerpPose(
        { neck: [0.4, 0.3, 0], armR: [-0.8, 0.4, 0], armL: [-0.4, 0, -0.2] },
        idle(localTime),
        smoothstep(segmentProgress(localTime, 10, 16)),
      );
      applyPose(context.workshop.zhang, inspectPose);
    },
    leave: ({ context }) => {
      context.workshop.root.visible = false;
    },
  },

  // ==========================================
  // ACT III: Secret Basement Ballistics (94s - 144s)
  // ==========================================
  {
    id: "shot-06-basement-assembly",
    start: 94,
    end: 114,
    enter: ({ context }) => {
      context.courtyard.root.visible = false;
      context.workshop.root.visible = false;
      context.basement.root.visible = true;
      context.space.root.visible = false;

      context.basement.targetIntact.visible = true;
      context.basement.targetPenetrated.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const p = smoothstep(progress);
      // Low moody single-source light camera gliding over the workbench
      context.camera.position.set(
        lerp(-0.8, 0.6, p),
        lerp(1.25, 1.15, p),
        lerp(1.6, 1.2, p),
      );
      context.camera.lookAt(0, 0.85, 0.8);

      // Light bulb subtle sway
      context.basement.bulbLight.position.x = Math.sin(localTime * 1.2) * 0.08;

      // Zhang Beihai assembling ammunition
      const assemblePose: Pose = {
        neck: [0.35, 0, 0],
        armR: [-0.85, 0.25, 0.1],
        armL: [-0.85, -0.25, -0.1],
      };
      applyPose(context.basement.zhang, assemblePose);
    },
    leave: () => {},
  },
  {
    id: "shot-07-basement-firing-test",
    start: 114,
    end: 134,
    enter: ({ context }) => {
      context.basement.root.visible = true;
    },
    update: ({ context, localTime }) => {
      // Over the shoulder aiming down range at target
      const shotTime = 1.0; // 115.0s on master timeline (localTime = 1.0)
      const isShot = localTime >= shotTime && localTime <= shotTime + 0.15;
      const postShot = localTime > shotTime;

      // Camera recoil shake
      const shake = isShot ? (Math.random() - 0.5) * 0.08 : 0;
      context.camera.position.set(-0.35 + shake, 1.55 + shake, 2.2);
      context.camera.lookAt(0, 1.4, -4.5);

      // Aiming pose
      if (!postShot) {
        applyPose(context.basement.zhang, aim(0, 0));
      } else {
        // Lower weapon and walk forward to inspect target
        const inspectTime = segmentProgress(localTime, 5, 12);
        const zPos = lerp(1.6, -2.5, easeInOutCubic(inspectTime));
        context.basement.zhang.root.position.z = zPos;
        if (inspectTime > 0 && inspectTime < 1) {
          applyPose(context.basement.zhang, walk(localTime, 1.2));
        } else {
          applyPose(context.basement.zhang, { neck: [0.4, 0, 0], armR: [-0.4, 0, 0.1] });
        }
      }

      // Muzzle flash burst
      context.basement.muzzleFlash.intensity = isShot ? 8.0 : 0;

      // Smoke puff fade
      const smokeMat = context.basement.smoke.material as THREE.PointsMaterial;
      if (postShot && localTime <= shotTime + 6.0) {
        smokeMat.opacity = fadeEnvelope(localTime, shotTime, shotTime + 6.0, 0.1, 4.0) * 0.8;
      } else {
        smokeMat.opacity = 0;
      }

      // Swap target mesh to penetrated version with shattered meteorite dust
      if (postShot) {
        context.basement.targetIntact.visible = false;
        context.basement.targetPenetrated.visible = true;
      }
    },
    leave: () => {},
  },
  {
    id: "shot-08-basement-exit",
    start: 134,
    end: 144,
    enter: ({ context }) => {
      context.basement.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = easeInOutCubic(progress);
      // Low angle cinematic hero shot looking up at Zhang Beihai as he packs the rounds
      context.camera.position.set(
        lerp(0.8, 0, p),
        lerp(0.6, 1.2, p),
        lerp(-1.5, 3.0, p),
      );
      context.camera.lookAt(0, 1.5, 0);

      applyPose(context.basement.zhang, idle(localTime));
    },
    leave: ({ context }) => {
      context.basement.root.visible = false;
    },
  },

  // ==========================================
  // ACT IV: Synchronic Orbit Sniper (144s - 216s)
  // ==========================================
  {
    id: "shot-09-orbit-vista",
    start: 144,
    end: 165,
    enter: ({ context }) => {
      context.courtyard.root.visible = false;
      context.workshop.root.visible = false;
      context.basement.root.visible = false;
      context.space.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = smoothstep(progress);
      // Grand epic wide establishing shot: Earth with glowing orange sunset rim,
      // rotating Yellow River Station wheel, and Zhang floating in vacuum
      context.camera.position.set(
        lerp(6.0, 1.8, p),
        lerp(3.5, 0.6, p),
        lerp(12.0, 5.5, p),
      );
      context.camera.lookAt(0, 1.5, -12);

      // Rotate space station wheel and Earth
      context.space.stationWheel.rotation.y = localTime * 0.05;
      context.space.earthMesh.rotation.y = localTime * 0.01;

      // Zhang Beihai weightless float
      applyPose(context.space.zhang, float(localTime));

      // Space officials floating near airlock
      context.space.astronauts.forEach((a, i) => {
        applyPose(a, float(localTime + i * 0.4));
      });
    },
    leave: () => {},
  },
  {
    id: "shot-10-airlock-group-photo",
    start: 165,
    end: 176,
    enter: ({ context }) => {
      context.space.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = easeInOutCubic(progress);
      // Medium shot of the ~12 officials lining up outside the airlock in space
      context.camera.position.set(
        lerp(4.0, 0, p),
        lerp(6.5, 5.5, p),
        lerp(-14.0, -18.0, p),
      );
      context.camera.lookAt(0, 5.0, -22);

      // Rotate wheel
      context.space.stationWheel.rotation.y = localTime * 0.05;

      context.space.astronauts.forEach((a, i) => {
        applyPose(a, float(localTime + i * 0.5));
      });
    },
    leave: () => {},
  },
  {
    id: "shot-11-aim-and-scope",
    start: 176,
    end: 188,
    enter: ({ context }) => {
      context.space.root.visible = true;
    },
    update: ({ context, localTime }) => {
      // Close-up on Zhang Beihai's helmet visor and scoped pistol raising to eye level
      context.camera.position.set(-0.28, 0.4, 1.9);
      context.camera.lookAt(0, 0.35, 0.8);

      // Raising sniper arm and aligning with station
      const aimProgress = smoothstep(segmentProgress(localTime, 1, 6));
      const sniperPose = lerpPose(
        float(localTime),
        aim(0, 0),
        aimProgress,
      );
      applyPose(context.space.zhang, sniperPose);
    },
    leave: () => {},
  },
  {
    id: "shot-12-vacuum-snipe",
    start: 188,
    end: 198,
    enter: ({ context }) => {
      context.space.root.visible = true;
    },
    update: ({ context, localTime }) => {
      // Steady sniper camera tracking the 30 silent muzzle flashes
      context.camera.position.set(0.45, 0.3, 2.3);
      context.camera.lookAt(0, 0.4, 0.5);

      applyPose(context.space.zhang, aim(0, 0));

      // 30 shots firing between 189.5s and 194.0s (localTime 1.5..6.0)
      const isFiring = localTime >= 1.5 && localTime <= 6.0;
      const muzzleMat = context.space.muzzleSparks.material as THREE.PointsMaterial;
      if (isFiring) {
        muzzleMat.opacity = (Math.sin(localTime * 45) > 0.3) ? 1.0 : 0.0;
      } else {
        muzzleMat.opacity = 0;
      }

      // Bullet tracer lines traveling across vacuum
      const tracerMat = context.space.bulletTracers.material as THREE.LineBasicMaterial;
      if (localTime >= 1.8 && localTime <= 9.5) {
        tracerMat.opacity = 0.65;
      } else {
        tracerMat.opacity = 0;
      }
    },
    leave: () => {},
  },
  {
    id: "shot-13-impact-meteorite-rain",
    start: 198,
    end: 208,
    enter: ({ context }) => {
      context.space.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = easeInOutCubic(progress);
      // Dramatic zoom on the group photo spacewalkers being struck by meteorite bullets
      context.camera.position.set(
        lerp(2.5, 0.5, p),
        lerp(6.0, 5.2, p),
        lerp(-16.0, -21.0, p),
      );
      context.camera.lookAt(0, 4.8, -24.0);

      // Expanding venting gas cloud & blood ice crystals
      const gasMat = context.space.impactGas.material as THREE.PointsMaterial;
      const bloodMat = context.space.bloodCrystals.material as THREE.PointsMaterial;
      gasMat.opacity = fadeEnvelope(localTime, 0.2, 9.5, 0.3, 2.0) * 0.9;
      bloodMat.opacity = fadeEnvelope(localTime, 0.3, 9.5, 0.3, 2.0) * 0.85;

      context.space.impactGas.scale.setScalar(1 + localTime * 0.6);
      context.space.bloodCrystals.scale.setScalar(1 + localTime * 0.5);

      // Astronaut panic & scattering
      context.space.astronauts.forEach((a, i) => {
        const panic: Pose = {
          neck: [(Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.6, 0],
          armR: [-1.2 + Math.sin(localTime * 3 + i) * 0.4, 0, 0.4],
          armL: [-1.2 + Math.cos(localTime * 3 + i) * 0.4, 0, -0.4],
        };
        applyPose(a, panic);
      });
    },
    leave: () => {},
  },
  {
    id: "shot-14-epilogue-peace",
    start: 208,
    end: 216,
    enter: ({ context }) => {
      context.space.root.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const p = smoothstep(progress);
      // Pulling back into the deep infinite void as Zhang drifts away into stars
      context.camera.position.set(
        lerp(0, -3.0, p),
        lerp(0.5, 2.5, p),
        lerp(3.0, 14.0, p),
      );
      context.camera.lookAt(0, 0, -20);

      // Thruster retreat drift
      context.space.zhang.root.position.z = lerp(2.0, 8.0, p);
      context.space.zhang.root.rotation.y = lerp(Math.PI, Math.PI * 1.25, p);
      applyPose(context.space.zhang, float(localTime));
    },
    leave: () => {},
  },
];
