import * as THREE from "three";
import { type Shot, segmentProgress, easeInOutCubic, smoothstep } from "@agentbench/cinematic-player";
import { applyPose, idle, walk, aim, float, lerpPose } from "@agentbench/voxel-kit";
import type { CinematicContext } from "./main";

export function createShots(): Shot<CinematicContext>[] {
  return [
    // ============================================================
    // SHOT 1: PROLOGUE - THE CRADLE & THE DEEP (0s - 18s)
    // ============================================================
    {
      id: "shot-01-prologue",
      start: 0,
      end: 18,
      enter: ({ context }) => {
        context.environments.orbit.visible = true;
        context.environments.courtyard.visible = false;
        context.environments.workshop.visible = false;
        context.environments.basement.visible = false;

        context.characters.beihaiUniform.root.visible = false;
        context.characters.beihaiSpacesuit.root.visible = false;
        context.characters.collector.root.visible = false;
        context.characters.delegates.forEach((d) => (d.root.visible = false));
        context.characters.photographer.root.visible = false;
      },
      update: ({ context, localTime, progress }) => {
        const t = easeInOutCubic(progress);
        // Majestic sweeping orbit camera
        const startPos = new THREE.Vector3(35, 25, 45);
        const endPos = new THREE.Vector3(5, 10, 25);
        context.camera.position.lerpVectors(startPos, endPos, t);
        context.camera.lookAt(-20, -80, -90);
        context.camera.fov = 48;
        context.camera.updateProjectionMatrix();

        // Slow rotation of space station in background
        const station = context.environments.orbit.getObjectByName("huanghe-station");
        if (station) {
          station.rotation.z = localTime * 0.05;
        }
      },
      leave: ({ context }) => {
        context.environments.orbit.visible = false;
      },
    },

    // ============================================================
    // SHOT 2: THE METEORITE HOUSE (18s - 45s)
    // ============================================================
    {
      id: "shot-02-courtyard",
      start: 18,
      end: 45,
      enter: ({ context }) => {
        context.environments.courtyard.visible = true;
        context.environments.orbit.visible = false;
        context.environments.workshop.visible = false;
        context.environments.basement.visible = false;

        // Position characters in courtyard
        context.characters.beihaiUniform.root.visible = true;
        context.characters.collector.root.visible = true;
        context.characters.beihaiSpacesuit.root.visible = false;
        context.characters.delegates.forEach((d) => (d.root.visible = false));
        context.characters.photographer.root.visible = false;

        // Teacups on workbench
        context.props.teacups[0]!.position.set(0.2, 0.05, 0.1);
        context.props.teacups[1]!.position.set(-0.2, 0.05, 0.1);
        context.environments.courtyard.add(context.props.teacups[0]!);
        context.environments.courtyard.add(context.props.teacups[1]!);

        // Collector behind workbench
        context.characters.collector.root.position.set(0, -0.6, -0.5);
        context.characters.collector.root.rotation.set(0, 0, 0);

        // Zhang Beihai enters and stands in front of workbench
        context.characters.beihaiUniform.root.position.set(0.6, -0.6, 1.2);
        context.characters.beihaiUniform.root.rotation.set(0, Math.PI, 0);
      },
      update: ({ context, localTime, progress }) => {
        const { collector, beihaiUniform } = context.characters;

        // Camera moves smoothly from entrance wide shot to intimate dialogue two-shot
        const t = smoothstep(progress);
        const camA = new THREE.Vector3(1.8, 0.9, 2.6);
        const camB = new THREE.Vector3(1.2, 0.6, 1.6);
        context.camera.position.lerpVectors(camA, camB, t);
        context.camera.lookAt(0.1, 0.2, 0.3);
        context.camera.fov = 42;
        context.camera.updateProjectionMatrix();

        // Collector performance: Examining stone, then looking up with friendly warmth
        if (localTime < 8.0) {
          applyPose(collector, {
            neck: [0.35, 0.1, 0],
            armR: [-1.1, 0.2, 0.4],
            armL: [-0.9, -0.1, -0.3],
          });
        } else {
          // Greeting & chatting
          const chat = idle(localTime);
          applyPose(collector, lerpPose(chat, {
            neck: [-0.05, -0.15, 0],
            armR: [-0.4, 0.2, 0.2],
          }, 0.6));
        }

        // Zhang Beihai performance: composed, respectful, military poise
        const beihaiIdle = idle(localTime * 0.9);
        if (localTime >= 10.5 && localTime < 18.0) {
          // Raising teacup in handR subtly while speaking of Earth as a meteorite
          applyPose(beihaiUniform, lerpPose(beihaiIdle, {
            armR: [-0.95, -0.3, 0.2],
            neck: [0.08, 0.12, 0],
          }, 0.8));
        } else {
          applyPose(beihaiUniform, beihaiIdle);
        }
      },
      leave: ({ context }) => {},
    },

    // ============================================================
    // SHOT 3: THE THREE IRON METEORITES (45s - 72s)
    // ============================================================
    {
      id: "shot-03-meteorites",
      start: 45,
      end: 72,
      enter: ({ context }) => {
        context.environments.courtyard.visible = true;

        // Place 3 iron meteorites on the workbench
        const coords = [
          [-0.32, 0.04, 0.15],
          [0.0, 0.04, 0.22],
          [0.32, 0.04, 0.12],
        ];
        context.props.meteorites.slice(0, 3).forEach((m, i) => {
          m.position.set(coords[i]![0]!, coords[i]![1]!, coords[i]![2]!);
          context.environments.courtyard.add(m);
        });
      },
      update: ({ context, localTime, progress }) => {
        const { collector, beihaiUniform } = context.characters;

        // Camera close-up framing the dark metallic stones on wood surface
        const t = smoothstep(progress);
        const camStart = new THREE.Vector3(0.6, 0.55, 0.85);
        const camEnd = new THREE.Vector3(0.2, 0.45, 0.65);
        context.camera.position.lerpVectors(camStart, camEnd, t);
        context.camera.lookAt(0.0, 0.1, 0.15);
        context.camera.fov = 38;
        context.camera.updateProjectionMatrix();

        // Collector presenting stones
        applyPose(collector, {
          neck: [0.25, 0, 0],
          armR: [-0.85, 0.4, 0.3],
          armL: [-0.8, -0.3, -0.2],
        });

        // Zhang Beihai examining, then decisive nod
        const nod = Math.sin(localTime * 1.5) * 0.06;
        applyPose(beihaiUniform, {
          neck: [0.2 + nod, 0, 0],
          armR: [-0.3, 0, 0.1],
          armL: [-0.3, 0, -0.1],
        });
      },
      leave: ({ context }) => {
        context.environments.courtyard.visible = false;
      },
    },

    // ============================================================
    // SHOT 4: THE CNC LATHE - PRECISION CRAFTING (72s - 96s)
    // ============================================================
    {
      id: "shot-04-lathe",
      start: 72,
      end: 96,
      enter: ({ context }) => {
        context.environments.workshop.visible = true;
        context.environments.courtyard.visible = false;
        context.environments.basement.visible = false;
        context.environments.orbit.visible = false;

        context.characters.beihaiUniform.root.visible = true;
        context.characters.collector.root.visible = false;
        context.characters.beihaiUniform.root.position.set(1.4, -0.6, 0.8);
        context.characters.beihaiUniform.root.rotation.set(0, -Math.PI * 0.6, 0);
      },
      update: ({ context, localTime, progress }) => {
        const { beihaiUniform } = context.characters;

        // Camera tracks along the lathe axis, viewing glowing spindle and tool
        const t = smoothstep(progress);
        const camStart = new THREE.Vector3(0.8, 0.7, 1.4);
        const camEnd = new THREE.Vector3(0.1, 0.45, 0.85);
        context.camera.position.lerpVectors(camStart, camEnd, t);
        context.camera.lookAt(0.2, 0.2, 0.0);
        context.camera.fov = 40;
        context.camera.updateProjectionMatrix();

        // Zhang Beihai observing lathe monitor & precision dials
        applyPose(beihaiUniform, {
          neck: [0.15, -0.2, 0],
          armR: [-0.6, -0.2, 0.1],
          armL: [-0.3, 0, -0.1],
        });
      },
      leave: ({ context }) => {
        context.environments.workshop.visible = false;
      },
    },

    // ============================================================
    // SHOT 5: THE BASEMENT BALLISTICS TEST (96s - 124s)
    // ============================================================
    {
      id: "shot-05-basement",
      start: 96,
      end: 124,
      enter: ({ context }) => {
        context.environments.basement.visible = true;
        context.environments.workshop.visible = false;
        context.environments.courtyard.visible = false;
        context.environments.orbit.visible = false;

        context.characters.beihaiUniform.root.visible = true;
        context.characters.collector.root.visible = false;

        // Beef target bundle in corner
        context.props.beefTarget.position.set(1.8, 0.2, -2.0);
        context.environments.basement.add(context.props.beefTarget);

        // Put pistol in Zhang Beihai's hand
        context.characters.beihaiUniform.anchors.handR.add(context.props.pistol);
      },
      update: ({ context, localTime, progress }) => {
        const { beihaiUniform } = context.characters;

        if (localTime < 10.0) {
          // Part A: Working at table, assembling bullets
          beihaiUniform.root.position.set(-0.8, -0.6, 1.3);
          beihaiUniform.root.rotation.set(0, 0, 0);
          applyPose(beihaiUniform, {
            neck: [0.4, 0, 0],
            armR: [-0.9, 0.2, 0.3],
            armL: [-0.9, -0.2, -0.3],
          });

          // Camera close to table
          context.camera.position.set(-0.3, 0.6, 2.2);
          context.camera.lookAt(-0.8, 0.2, 1.3);
          context.camera.fov = 42;
          context.camera.updateProjectionMatrix();
        } else if (localTime < 16.0) {
          // Part B: Raising gun, aiming at beef target bundle
          beihaiUniform.root.position.set(-0.2, -0.6, 1.2);
          beihaiUniform.root.rotation.set(0, -0.6, 0);

          // Aim pose
          applyPose(beihaiUniform, aim(0.05, 0.0));

          // Camera over shoulder
          context.camera.position.set(-0.7, 0.65, 1.8);
          context.camera.lookAt(1.8, 0.2, -2.0);
          context.camera.fov = 36;
          context.camera.updateProjectionMatrix();

          // Gunshot flash at t=11.8 (timeline = 107.8)
          if (localTime >= 11.8 && localTime < 12.0) {
            context.effects.muzzleFlash.trigger(
              new THREE.Vector3(0.3, 0.35, 0.5),
              new THREE.Vector3(0.8, 0, -1.2).normalize(),
              false,
            );
          }
        } else {
          // Part C: Inspecting shattered meteorite gravel in palm
          beihaiUniform.root.position.set(1.4, -0.6, -1.5);
          beihaiUniform.root.rotation.set(0, Math.PI * 0.7, 0);
          applyPose(beihaiUniform, {
            neck: [0.45, 0, 0],
            armR: [-0.85, -0.3, 0.4],
            armL: [-0.3, 0, -0.1],
          });

          // Camera close-up on his calm face and hand
          context.camera.position.set(1.8, 0.4, -0.9);
          context.camera.lookAt(1.4, 0.25, -1.5);
          context.camera.fov = 34;
          context.camera.updateProjectionMatrix();
        }

        context.effects.muzzleFlash.update(0.016);
      },
      leave: ({ context }) => {
        context.environments.basement.visible = false;
        context.characters.beihaiUniform.anchors.handR.remove(context.props.pistol);
      },
    },

    // ============================================================
    // SHOT 6: GEOSTATIONARY ORBIT - THE VOID (124s - 152s)
    // ============================================================
    {
      id: "shot-06-orbit-void",
      start: 124,
      end: 152,
      enter: ({ context }) => {
        context.environments.orbit.visible = true;
        context.environments.basement.visible = false;
        context.environments.workshop.visible = false;
        context.environments.courtyard.visible = false;

        context.characters.beihaiUniform.root.visible = false;
        context.characters.collector.root.visible = false;
        context.characters.beihaiSpacesuit.root.visible = true;

        // Position Zhang Beihai drifting in empty void
        context.characters.beihaiSpacesuit.root.position.set(0, 0, 0);
      },
      update: ({ context, localTime, progress }) => {
        const { beihaiSpacesuit } = context.characters;

        // Weightless zero-G drift pose
        applyPose(beihaiSpacesuit, float(localTime));

        // Subtle body pitch & yaw in vacuum
        beihaiSpacesuit.root.rotation.set(
          Math.sin(localTime * 0.2) * 0.15,
          Math.cos(localTime * 0.15) * 0.2,
          Math.sin(localTime * 0.25) * 0.08,
        );

        // Camera: orbits from front close-up of helmet visor to grand cosmic backdrop
        const t = easeInOutCubic(progress);
        const radius = 2.4 + t * 4.5;
        const angle = localTime * 0.08;
        context.camera.position.set(
          Math.sin(angle) * radius,
          0.4 + t * 1.2,
          Math.cos(angle) * radius,
        );
        context.camera.lookAt(0, 0.2, 0);
        context.camera.fov = 44;
        context.camera.updateProjectionMatrix();

        // Rotate space station wheel
        const station = context.environments.orbit.getObjectByName("huanghe-station");
        if (station) station.rotation.z = localTime * 0.06;
      },
      leave: ({ context }) => {},
    },

    // ============================================================
    // SHOT 7: SUNSET GROUP PHOTO (152s - 176s)
    // ============================================================
    {
      id: "shot-07-sunset-photo",
      start: 152,
      end: 176,
      enter: ({ context }) => {
        context.environments.orbit.visible = true;
        context.characters.beihaiSpacesuit.root.visible = true;

        // Reveal delegates and photographer in front of Huanghe Station airlock
        const baseX = 0;
        const baseY = 15;
        const baseZ = -46;

        context.characters.delegates.forEach((d, i) => {
          d.root.visible = true;
          // Row arrangement: front row (0..2 leaders), back row (3..7)
          const row = i < 3 ? 0 : 1;
          const col = i < 3 ? i - 1 : i - 5;
          d.root.position.set(
            baseX + col * 1.8,
            baseY - row * 1.5,
            baseZ - row * 1.2,
          );
          d.root.rotation.set(0, Math.PI, 0);
        });

        // Photographer holding space camera
        context.characters.photographer.root.visible = true;
        context.characters.photographer.root.position.set(-4.2, baseY - 0.2, baseZ + 4.5);
        context.characters.photographer.root.rotation.set(0, Math.PI * 0.75, 0);
        context.characters.photographer.anchors.handR.add(context.props.spaceCamera);
      },
      update: ({ context, localTime, progress }) => {
        // Delegates drifting in photo formation
        context.characters.delegates.forEach((d, i) => {
          applyPose(d, float(localTime + i * 0.7));
        });

        // Photographer posing with camera
        applyPose(context.characters.photographer, {
          neck: [0.1, 0.3, 0],
          armR: [-1.2, 0.4, 0.2],
          armL: [-1.1, -0.3, -0.2],
        });

        // Telescopic / sniper surveillance camera view of the group photo against sunset
        const t = smoothstep(progress);
        const camStart = new THREE.Vector3(0, 15, -28);
        const camEnd = new THREE.Vector3(0, 15, -34);
        context.camera.position.lerpVectors(camStart, camEnd, t);
        context.camera.lookAt(0, 14.5, -46);
        context.camera.fov = 28; // tight telephoto
        context.camera.updateProjectionMatrix();
      },
      leave: ({ context }) => {},
    },

    // ============================================================
    // SHOT 8: THE SILENT SNIPER (176s - 200s)
    // ============================================================
    {
      id: "shot-08-sniper",
      start: 176,
      end: 200,
      enter: ({ context }) => {
        context.environments.orbit.visible = true;
        context.characters.beihaiSpacesuit.root.visible = true;
        context.characters.beihaiSpacesuit.root.position.set(0, 0, 0);

        // Put scoped pistol in Beihai's hand
        context.characters.beihaiSpacesuit.anchors.handR.add(context.props.pistol);
      },
      update: ({ context, localTime, progress }) => {
        const { beihaiSpacesuit } = context.characters;

        if (localTime < 10.0) {
          // Mounting magnetic scope & raising pistol into shooting stance
          const raiseT = Math.min(1, localTime / 5.0);
          const aimP = aim(0.12, 0.0);
          applyPose(beihaiSpacesuit, lerpPose(float(localTime), aimP, raiseT));

          // Camera close-up on Beihai's helmet and pistol
          context.camera.position.set(0.65, 0.35, 0.95);
          context.camera.lookAt(0, 0.15, 0);
          context.camera.fov = 35;
          context.camera.updateProjectionMatrix();
        } else {
          // Firing sequence: 30 silent rounds
          applyPose(beihaiSpacesuit, aim(0.12, 0.0));

          // Firing muzzle flashes (simulated fireflies in the dark)
          const fireInterval = 0.45;
          const shotIndex = Math.floor((localTime - 10.0) / fireInterval);
          const withinFlash = ((localTime - 10.0) % fireInterval) < 0.09;

          if (shotIndex < 30 && withinFlash) {
            context.effects.muzzleFlash.trigger(
              new THREE.Vector3(0, 0.15, 0.6),
              new THREE.Vector3(0, 0.1, -1).normalize(),
              true, // space firefly
            );
          }

          // Camera tracks bullet trajectory towards distant station
          const bulletT = easeInOutCubic(segmentProgress(localTime, 10.0, 24.0));
          const camStart = new THREE.Vector3(0.4, 0.25, 0.5);
          const camEnd = new THREE.Vector3(0, 12, -35);
          context.camera.position.lerpVectors(camStart, camEnd, bulletT);
          context.camera.lookAt(0, 15, -46);
          context.camera.fov = 30;
          context.camera.updateProjectionMatrix();
        }

        context.effects.muzzleFlash.update(0.016);
      },
      leave: ({ context }) => {},
    },

    // ============================================================
    // SHOT 9: THE METEORITE SHOWER (200s - 222s)
    // ============================================================
    {
      id: "shot-09-meteorite-shower",
      start: 200,
      end: 222,
      enter: ({ context }) => {
        context.environments.orbit.visible = true;
        context.characters.beihaiSpacesuit.root.visible = false;
        context.characters.delegates.forEach((d) => (d.root.visible = true));
        context.characters.photographer.root.visible = true;
      },
      update: ({ context, localTime, progress }) => {
        // Dramatic impacts at t=0.8..4.0
        const { delegates, photographer } = context.characters;
        const { gasPlume, bloodCrystals } = context.effects;

        if (localTime >= 0.8 && localTime < 1.0) {
          // Decompression burst from leader 0
          gasPlume.emit(delegates[0]!.root.position.clone().add(new THREE.Vector3(0, 0.6, 0.2)), new THREE.Vector3(0, 0.5, 1.2), 15);
        }
        if (localTime >= 1.4 && localTime < 1.6) {
          // Visor shattered on leader 1: blood ice crystals + gas
          bloodCrystals.emit(delegates[1]!.root.position.clone().add(new THREE.Vector3(0, 0.9, 0)), new THREE.Vector3(0.5, 0.3, 0.8), 20);
          gasPlume.emit(delegates[1]!.root.position.clone().add(new THREE.Vector3(0, 0.9, 0)), new THREE.Vector3(-0.3, 0.8, 1.0), 12);
        }
        if (localTime >= 2.2 && localTime < 2.4) {
          // Backpack thruster blowout on leader 2
          gasPlume.emit(delegates[2]!.root.position.clone().add(new THREE.Vector3(0, 0.5, -0.4)), new THREE.Vector3(0, 1.5, -1.8), 25);
        }

        // Delegates reacting in zero-G chaos
        delegates.forEach((d, i) => {
          if (i < 3) {
            // Hit victims tumble backward
            const tumbleT = Math.min(1, (localTime - 1.0) * 0.4);
            d.root.rotation.x = tumbleT * Math.PI * 0.6;
            d.root.position.z -= 0.02;
          } else {
            // Surrounding members scramble to pull victims towards airlock
            const scrambleT = Math.min(1, (localTime - 2.5) * 0.3);
            d.root.position.z -= scrambleT * 0.04;
          }
        });

        // Dynamic handheld-style camera tracking the panic
        const t = smoothstep(progress);
        const camStart = new THREE.Vector3(2.5, 16, -38);
        const camEnd = new THREE.Vector3(0, 15, -42);
        context.camera.position.lerpVectors(camStart, camEnd, t);
        context.camera.lookAt(0, 14.5, -46);
        context.camera.fov = 38;
        context.camera.updateProjectionMatrix();

        gasPlume.update(localTime, 0.016);
        bloodCrystals.update(localTime, 0.016);
      },
      leave: ({ context }) => {
        context.effects.gasPlume.reset();
        context.effects.bloodCrystals.reset();
        context.characters.delegates.forEach((d) => (d.root.visible = false));
        context.characters.photographer.root.visible = false;
      },
    },

    // ============================================================
    // SHOT 10: EPILOGUE - TO THE STARS (222s - 240s)
    // ============================================================
    {
      id: "shot-10-epilogue",
      start: 222,
      end: 240,
      enter: ({ context }) => {
        context.environments.orbit.visible = true;
        context.characters.beihaiSpacesuit.root.visible = true;
        context.characters.beihaiSpacesuit.anchors.handR.remove(context.props.pistol);
        context.characters.beihaiSpacesuit.root.position.set(0, 0, 0);
      },
      update: ({ context, localTime, progress }) => {
        const { beihaiSpacesuit } = context.characters;

        // Zhang Beihai turns and accelerates into the abyss
        const turnT = Math.min(1, localTime / 4.0);
        beihaiSpacesuit.root.rotation.y = turnT * Math.PI;

        // Propelling forward into distance
        const moveDist = Math.pow(Math.max(0, localTime - 2.0), 1.6) * 0.45;
        beihaiSpacesuit.root.position.z = moveDist;

        applyPose(beihaiSpacesuit, float(localTime));

        // Camera pulls back to reveal the infinite cosmos, Earth, and the lone traveler
        const t = easeInOutCubic(progress);
        const camStart = new THREE.Vector3(1.2, 0.4, 2.2);
        const camEnd = new THREE.Vector3(25, 18, 55);
        context.camera.position.lerpVectors(camStart, camEnd, t);
        context.camera.lookAt(0, 0, beihaiSpacesuit.root.position.z);
        context.camera.fov = 48;
        context.camera.updateProjectionMatrix();

        // Thruster cold gas trail
        if (localTime >= 2.0 && localTime < 6.0) {
          context.effects.gasPlume.emit(
            beihaiSpacesuit.root.position.clone().add(new THREE.Vector3(0, 0.4, -0.3)),
            new THREE.Vector3(0, 0, -1.5),
            2,
          );
        }
        context.effects.gasPlume.update(localTime, 0.016);
      },
      leave: ({ context }) => {
        context.effects.gasPlume.reset();
      },
    },
  ];
}
