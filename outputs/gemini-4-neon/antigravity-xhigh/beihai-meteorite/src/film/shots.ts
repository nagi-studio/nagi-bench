import * as THREE from "three";
import {
  clamp01,
  easeInOutCubic,
  fadeEnvelope,
  lerp,
  segmentProgress,
  smoothstep,
  type Shot,
} from "@agentbench/cinematic-player";
import { applyPose, lerpPose } from "@agentbench/voxel-kit";
import {
  poseBasementCraft,
  poseBasementShoot,
  poseCasualtyImpact,
  poseHoldPhone,
  poseHoldTeacup,
  poseInspectWorkbench,
  poseMilitaryStand,
  poseOperateCNC,
  poseOrbitPistolFire,
  poseOrbitScopeScan,
  poseOrbitSolitude,
  posePanicEvac,
  posePhotographer,
  posePhotoLineup,
  posePourTea,
  poseRemoveGlove,
  poseWalkMilitary,
  poseWarmTalk,
} from "../characters/poses";
import { multiShotPulse, setCameraLerp, type FilmContext } from "./timeline";

// Exact timestamps of the 4 deafening basement test shots
const BASEMENT_SHOT_TIMES = [124.2, 125.6, 127.0, 128.4] as const;

// Exact timestamps of the 30 silent orbital vacuum shots (3 bursts of 10 rounds)
const ORBIT_SHOT_TIMES: readonly number[] = [
  ...Array.from({ length: 10 }, (_, i) => 203.0 + i * 0.35),
  ...Array.from({ length: 10 }, (_, i) => 208.6 + i * 0.35),
  ...Array.from({ length: 10 }, (_, i) => 214.2 + i * 0.33),
];

const _muzzleWorld = new THREE.Vector3();

/** Deterministically position & pose all 25 orbital photo astronauts for any timeline time! */
function updateOrbitalCrew(ctx: FilmContext, time: number): {
  airlockGreen: boolean;
  airlockOpen: number;
  evacProgress: number;
} {
  const airlockGreen = time >= 180.6 && time < 258.6;
  const openIn = smoothstep(segmentProgress(time, 181.0, 182.8));
  const closeOut = 1 - smoothstep(segmentProgress(time, 257.4, 259.2));
  const airlockOpen = time < 250 ? openIn : closeOut;

  // Exit flight from airlock (z = -12 relative to crewGroup -> baseOffset) over 181.6..186.5s
  const exitP = easeInOutCubic(segmentProgress(time, 181.6, 186.5));
  // Visors switch to transparent right after lining up (186.6s)
  const visorsOpen = time >= 186.6;
  // Impact hits at t = 234.0s!
  const impacted = time >= 234.0;
  const sinceImpact = Math.max(0, time - 234.0);
  // Panicked evacuation back into Yellow River Station airlock over 243.5..257.2s
  const evacProgress = easeInOutCubic(segmentProgress(time, 243.5, 257.2));

  const visibleCrew = time >= 181.3 && time < 258.0;
  ctx.orbit.crewGroup.visible = visibleCrew;

  if (!visibleCrew) {
    return { airlockGreen, airlockOpen, evacProgress: 0 };
  }

  for (const member of ctx.orbit.crew) {
    const fig = member.figure;
    const isHitTarget =
      member.role === "leaderA" ||
      member.role === "leaderB" ||
      member.role === "leaderC" ||
      member.role === "bystanderHit";

    // Deterministic visor & expression state
    if (impacted && isHitTarget) {
      member.setVisorAndFace("hit");
    } else if (impacted && sinceImpact > 1.2) {
      member.setVisorAndFace("panic");
    } else if (visorsOpen) {
      member.setVisorAndFace("open");
    } else {
      member.setVisorAndFace("gold");
    }

    // Starting point inside airlock hatch
    const hatchX = Math.sin(member.seed * 1.7) * 0.9;
    const hatchY = Math.cos(member.seed * 1.3) * 0.7;
    const hatchZ = -11.8;

    // Slight staggered exit timing per astronaut so they stream out organically
    const stagger = (member.seed % 8) * 0.08;
    const myExit = easeInOutCubic(clamp01((exitP - stagger * 0.35) / (1 - stagger * 0.35)));

    let px = lerp(hatchX, member.baseOffset.x, myExit);
    let py = lerp(hatchY, member.baseOffset.y, myExit) + Math.sin(time * 0.8 + member.seed) * 0.08;
    let pz = lerp(hatchZ, member.baseOffset.z, myExit);

    // Photographer turns toward the group (-Z); everyone else faces +Z toward camera/Zhang!
    let ry = member.role === "photographer" ? Math.PI : 0;

    if (impacted && isHitTarget) {
      // Knockback jolt & slow limp zero-G tumble before colleagues drag them back!
      const jolt = Math.min(1, sinceImpact * 0.55);
      const dragP = easeInOutCubic(segmentProgress(time, 245.5, 257.2));
      const hitPx = px + Math.sin(member.seed * 2.1) * 0.65 * jolt;
      const hitPy = py + Math.cos(member.seed * 1.9) * 0.45 * jolt;
      const hitPz = pz - 1.4 * jolt;
      px = lerp(hitPx, hatchX, dragP);
      py = lerp(hitPy, hatchY, dragP);
      pz = lerp(hitPz, hatchZ, dragP);
      ry += sinceImpact * (member.role === "leaderA" ? 0.14 : 0.35);
      applyPose(fig, poseCasualtyImpact(time, sinceImpact, member.seed));
    } else if (impacted && sinceImpact > 2.0) {
      // Panicked colleagues scatter slightly then rush full-throttle back into airlock!
      const scatter = Math.sin(Math.min(1, (sinceImpact - 2.0) / 3.0) * Math.PI) * 0.8;
      const sPx = px + Math.sin(member.seed * 3.3) * scatter;
      const sPy = py + Math.cos(member.seed * 2.7) * scatter * 0.5;
      px = lerp(sPx, hatchX, evacProgress);
      py = lerp(sPy, hatchY, evacProgress);
      pz = lerp(pz, hatchZ, evacProgress);
      ry = lerp(ry, Math.PI, smoothstep(segmentProgress(time, 242.5, 244.5)));
      applyPose(fig, posePanicEvac(time, member.seed));
    } else if (member.role === "photographer") {
      applyPose(fig, posePhotographer(time));
    } else {
      applyPose(fig, posePhotoLineup(time, member.seed));
    }

    fig.root.position.set(px, py, pz);
    fig.root.rotation.set(0, ry, 0);
  }

  return { airlockGreen, airlockOpen, evacProgress };
}

export function createFilmShots(): Shot<FilmContext>[] {
  return [
    // =========================================================================
    // SHOT 01 (0.0 – 12.0s) — COLD OPEN: ALONE IN THE ABYSS
    // =========================================================================
    {
      id: "shot-01-cold-open",
      start: 0.0,
      end: 12.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("suit-gold");
        context.zhang.hideAllHandProps();
        context.orbit.floatingScope.visible = false;
        context.orbit.floatingGlove.visible = false;
        context.orbit.spentMags.forEach((m) => (m.visible = false));
        context.overlays.setScope(0);
        context.overlays.setOpeningTitle(0);
        context.overlays.setEndingTitle(0);
      },
      update({ context, time, localTime, progress }) {
        const zhang = context.zhang.figure.root;
        zhang.position.set(0, Math.sin(time * 0.4) * 0.14, 0);
        zhang.rotation.set(0.08, Math.PI + 0.25, -0.05);
        applyPose(context.zhang.figure, poseOrbitSolitude(time));

        const p = easeInOutCubic(progress);
        // Opening frame at t=0 is immediately crisp and iconic (zero black curtain at t=0!)
        context.overlays.setFade(0);

        setCameraLerp(
          context.camera,
          [1.65, 1.48, 3.65],
          [-1.25, 1.55, 3.85],
          [-0.65, 1.15, -18.0],
          [-0.45, 1.08, -24.0],
          p,
          45,
        );

        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);
        context.orbit.update({
          time,
          sunDrop: 0.22 + localTime * 0.008,
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
    },

    // =========================================================================
    // SHOT 02 (12.0 – 24.0s) — TITLE CARD OVER SOLAR DIAMOND RING -> MATCH CUT
    // =========================================================================
    {
      id: "shot-02-opening-title",
      start: 12.0,
      end: 24.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("suit-gold");
        context.zhang.hideAllHandProps();
        context.zhang.looseScope.visible = true;
        context.overlays.setScope(0);
        context.overlays.setEndingTitle(0);
      },
      update({ context, time, localTime, progress }) {
        const zhang = context.zhang.figure.root;
        zhang.position.set(0, Math.sin(time * 0.4) * 0.12, 0);
        zhang.rotation.set(0.05, Math.PI - 0.15, 0);
        applyPose(context.zhang.figure, poseOrbitScopeScan(time, -0.1));

        // Opening title cleanly appears 1.0..9.2s then fades before solar flare match-cut!
        const titleOpacity = fadeEnvelope(localTime, 0.8, 9.6, 1.2, 1.4);
        context.overlays.setOpeningTitle(titleOpacity);

        // Blazing warm solar flare iris into Act I Hutong desk lamp at 22.0..24.0s!
        const flare = smoothstep(segmentProgress(localTime, 9.8, 12.0));
        context.overlays.setFade(flare, "#ffd99c");

        setCameraLerp(
          context.camera,
          [-1.7, 1.48, 2.25],
          [-2.3, 1.75, 1.85],
          [-0.4, 1.25, -45.0],
          [-6.0, 4.5, -180.0],
          easeInOutCubic(progress),
          40,
        );

        context.orbit.update({
          time,
          sunDrop: 0.34 + progress * 0.18,
          airlockGreen: false,
          airlockOpen: 0,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress: 0,
          heroBulletProgress: -1,
        });
      },
      leave({ context }) {
        context.overlays.setOpeningTitle(0);
        context.overlays.setFade(0);
      },
    },

    // =========================================================================
    // SHOT 03 (24.0 – 38.0s) — HUTONG STUDY: ENTERING THE MUSEUM
    // =========================================================================
    {
      id: "shot-03-hutong-enter",
      start: 24.0,
      end: 38.0,
      enter({ context }) {
        context.setActiveEnvironment("hutong");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("uniform");
        context.zhang.hideAllHandProps();
        context.collector.figure.root.visible = true;
        context.collector.magnifier.visible = true;
        context.collector.handTeacup.visible = false;
        context.overlays.setScope(0);
        context.overlays.setOpeningTitle(0);
      },
      update({ context, time, localTime, progress }) {
        // Warm amber fade-in from orbital sun match-cut
        const fadeIn = 1 - smoothstep(segmentProgress(localTime, 0, 1.2));
        context.overlays.setFade(fadeIn, "#ffd99c");

        // Door opens 0.5..2.2s, Zhang walks steadily from doorway to workbench 1.6..5.0s
        const doorOpen = smoothstep(segmentProgress(localTime, 0.5, 2.1));
        const walkP = easeInOutCubic(segmentProgress(localTime, 1.5, 5.2));

        const zhangRoot = context.zhang.figure.root;
        zhangRoot.position.set(
          lerp(1.9, 0.22, walkP),
          0,
          lerp(-3.45, 1.05, walkP),
        );
        const turnToCollector = smoothstep(segmentProgress(localTime, 4.4, 5.6));
        zhangRoot.rotation.set(0, lerp(-0.35, Math.PI - 0.14, turnToCollector), 0);

        if (walkP > 0.01 && walkP < 0.99) {
          applyPose(context.zhang.figure, poseWalkMilitary(time, 0.12));
        } else {
          applyPose(context.zhang.figure, poseMilitaryStand(time, -0.08, 0.03));
        }

        // Collector bends over magnifying glass, then straightens warmly as Zhang approaches
        const lookUp = smoothstep(segmentProgress(localTime, 2.6, 4.6));
        context.collector.magnifier.visible = lookUp < 0.85;
        context.collector.figure.root.position.set(-0.08, 0, -0.92);
        context.collector.figure.root.rotation.set(0, 0.12, 0);
        applyPose(
          context.collector.figure,
          lerpPose(poseInspectWorkbench(time), poseWarmTalk(time, 0.8), lookUp),
        );

        // Slow cinematic dolly across the warm lantern-lit meteorite cabinets onto the two veterans
        setCameraLerp(
          context.camera,
          [-2.35, 1.68, 2.15],
          [-1.45, 1.48, 2.25],
          [0.35, 1.18, -1.6],
          [0.05, 1.28, -0.25],
          easeInOutCubic(progress),
          42,
        );

        context.hutong.update(time, doorOpen, 0, false);
      },
    },

    // =========================================================================
    // SHOT 04 (38.0 – 56.0s) — TEA & COSMIC PHILOSOPHY ("茶杯里盛的也是陨石")
    // =========================================================================
    {
      id: "shot-04-hutong-tea",
      start: 38.0,
      end: 56.0,
      enter({ context }) {
        context.setActiveEnvironment("hutong");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("uniform");
        context.zhang.hideAllHandProps();
        context.collector.figure.root.visible = true;
        context.collector.magnifier.visible = false;
        context.overlays.setFade(0);
      },
      update({ context, time, localTime }) {
        const zhangRoot = context.zhang.figure.root;
        zhangRoot.position.set(0.18, 0, 1.05);
        zhangRoot.rotation.set(0, Math.PI - 0.12, 0);

        const colRoot = context.collector.figure.root;
        colRoot.position.set(-0.08, 0, -0.92);
        colRoot.rotation.set(0, 0.12, 0);

        // Collector pours tea 0.6..3.2s, then gestures warmly talking about space
        const pourAmt = fadeEnvelope(localTime, 0.4, 3.4, 0.5, 0.6);
        if (pourAmt > 0.05) {
          applyPose(context.collector.figure, posePourTea(time, pourAmt));
          context.hutong.teapot.position.set(0.24, 0.96 + pourAmt * 0.14, 0.08);
          context.hutong.teapot.rotation.z = pourAmt * 0.55;
        } else {
          applyPose(context.collector.figure, poseWarmTalk(time, localTime < 10 ? 1.1 : 0.7));
          context.hutong.teapot.position.set(0.32, 0.965, -0.06);
          context.hutong.teapot.rotation.z = 0;
        }

        // Zhang Beihai lifts ceramic teacup thoughtfully during his cosmic line (9.2..15.2s)!
        const cupLift = fadeEnvelope(localTime, 9.0, 15.6, 0.9, 0.9);
        context.zhang.handTeacup.visible = cupLift > 0.12;
        context.hutong.benchCupZhang.visible = cupLift <= 0.12;
        applyPose(context.zhang.figure, poseHoldTeacup(time, cupLift));

        // Edited 2-angle dialogue coverage inside Shot 04:
        // 0..8.8s: Collector over-Zhang's-shoulder warm medium shot
        // 8.8..18.0s: Reverse slow push-in onto Zhang Beihai raising the teacup!
        if (localTime < 8.8) {
          const p = easeInOutCubic(localTime / 8.8);
          setCameraLerp(
            context.camera,
            [1.15, 1.52, 1.65],
            [0.82, 1.46, 1.38],
            [-0.08, 1.36, -0.88],
            [-0.06, 1.38, -0.92],
            p,
            38,
          );
        } else {
          const p = easeInOutCubic((localTime - 8.8) / 9.2);
          setCameraLerp(
            context.camera,
            [-0.95, 1.5, -0.35],
            [-0.72, 1.48, 0.05],
            [0.18, 1.46, 1.05],
            [0.18, 1.5, 1.05],
            p,
            35,
          );
        }

        context.hutong.update(time, 0.15, 0, localTime > 1.8);
      },
      leave({ context }) {
        context.zhang.handTeacup.visible = false;
        context.hutong.benchCupZhang.visible = true;
        context.hutong.teapot.position.set(0.32, 0.965, -0.06);
        context.hutong.teapot.rotation.z = 0;
      },
    },

    // =========================================================================
    // SHOT 05 (56.0 – 72.0s) — THREE APPLE-SIZED IRON METEORITES
    // =========================================================================
    {
      id: "shot-05-three-meteorites",
      start: 56.0,
      end: 72.0,
      enter({ context }) {
        context.setActiveEnvironment("hutong");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("uniform");
        context.zhang.hideAllHandProps();
        context.collector.figure.root.visible = true;
      },
      update({ context, time, localTime }) {
        context.zhang.figure.root.position.set(0.18, 0, 1.05);
        context.zhang.figure.root.rotation.set(0, Math.PI - 0.12, 0);
        applyPose(context.zhang.figure, poseMilitaryStand(time, -0.05, 0.14));

        context.collector.figure.root.position.set(-0.08, 0, -0.92);
        context.collector.figure.root.rotation.set(0, 0.1, 0);
        applyPose(context.collector.figure, poseWarmTalk(time, 0.95));

        // 3 Iron meteorites thud onto hardwood workbench at 62.9s, 63.8s, 64.7s!
        const meteoritesShown =
          time >= 64.7 ? 3 : time >= 63.8 ? 2 : time >= 62.9 ? 1 : 0;

        // 0..6.2s: Medium two-shot as Zhang states lathe specs
        // 6.2..16.0s: Crisp low-angle hero tabletop shot as the 3 heavy iron meteorites land!
        if (localTime < 6.2) {
          const p = easeInOutCubic(localTime / 6.2);
          setCameraLerp(
            context.camera,
            [1.65, 1.48, 0.35],
            [1.45, 1.42, 0.15],
            [0.0, 1.25, 0.05],
            [0.0, 1.15, 0.0],
            p,
            40,
          );
        } else {
          const p = easeInOutCubic((localTime - 6.2) / 9.8);
          setCameraLerp(
            context.camera,
            [-0.55, 1.22, 0.85],
            [0.48, 1.16, 0.78],
            [0.0, 0.94, 0.1],
            [0.0, 0.95, 0.08],
            p,
            34,
          );
        }

        context.hutong.update(time, 0.15, meteoritesShown, true);
      },
    },

    // =========================================================================
    // SHOT 06 (72.0 – 84.0s) — RESPECT FOR THE RECIPIENTS (NO HAGGLING)
    // =========================================================================
    {
      id: "shot-06-respect",
      start: 72.0,
      end: 84.0,
      enter({ context }) {
        context.setActiveEnvironment("hutong");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("uniform");
        context.zhang.hideAllHandProps();
        context.collector.figure.root.visible = true;
      },
      update({ context, time, localTime }) {
        context.zhang.figure.root.position.set(0.18, 0, 1.05);
        context.zhang.figure.root.rotation.set(0, Math.PI - 0.12, 0);

        context.collector.figure.root.position.set(-0.08, 0, -0.92);
        context.collector.figure.root.rotation.set(0, 0.1, 0);

        // Zhang raises phone immediately to transfer 180,000 yuan (0..4.5s), then lowers it calmly
        const phoneLift = fadeEnvelope(localTime, 0.2, 4.6, 0.6, 0.8);
        context.zhang.handPhone.visible = phoneLift > 0.1;
        applyPose(
          context.zhang.figure,
          lerpPose(poseMilitaryStand(time, -0.04, -0.02), poseHoldPhone(time, 1), phoneLift),
        );

        applyPose(context.collector.figure, poseWarmTalk(time, localTime > 3.0 && localTime < 7.2 ? 0.55 : 0.1));

        // 0..6.8s: Collector looking surprised across the 3 meteorites
        // 6.8..12.0s: Chilling slow push-in onto Zhang Beihai's half-lit face ("就算表示我对要送的人的尊重吧")
        if (localTime < 6.8) {
          const p = easeInOutCubic(localTime / 6.8);
          setCameraLerp(
            context.camera,
            [1.1, 1.52, 1.48],
            [0.95, 1.48, 1.32],
            [-0.08, 1.42, -0.9],
            [-0.08, 1.44, -0.9],
            p,
            36,
          );
        } else {
          const p = easeInOutCubic((localTime - 6.8) / 5.2);
          setCameraLerp(
            context.camera,
            [-0.65, 1.52, 0.12],
            [-0.38, 1.54, 0.36],
            [0.18, 1.54, 1.05],
            [0.18, 1.56, 1.05],
            p,
            30,
          );
        }

        // Crisp dark cut transition at very end into cold CNC workshop
        const cutFade = smoothstep(segmentProgress(localTime, 11.4, 12.0));
        context.overlays.setFade(cutFade, "#04080e");

        context.hutong.update(time, 0.15, 3, true);
      },
      leave({ context }) {
        context.zhang.handPhone.visible = false;
        context.overlays.setFade(0);
      },
    },

    // =========================================================================
    // SHOT 07 (84.0 – 102.0s) — AFTER-HOURS CNC WORKSHOP: FORGING 36 SLUGS
    // =========================================================================
    {
      id: "shot-07-cnc-workshop",
      start: 84.0,
      end: 102.0,
      enter({ context }) {
        context.setActiveEnvironment("workshop");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("workshop");
        context.zhang.hideAllHandProps();
        context.overlays.setScope(0);
      },
      update({ context, time, localTime }) {
        const fadeIn = 1 - smoothstep(segmentProgress(localTime, 0, 0.6));
        const fadeOut = smoothstep(segmentProgress(localTime, 17.3, 18.0));
        context.overlays.setFade(Math.max(fadeIn, fadeOut), "#03060a");

        const zhangRoot = context.zhang.figure.root;
        if (localTime < 13.8) {
          zhangRoot.position.set(-0.85, 0, 0.18);
          zhangRoot.rotation.set(0, Math.PI - 0.32, 0);
          const inspectAmt = smoothstep(segmentProgress(localTime, 3.0, 5.0));
          applyPose(context.zhang.figure, poseOperateCNC(time, inspectAmt));
        } else {
          // Steps cleanly to side bench inspecting 36 slugs & brushing away shavings
          const stepP = easeInOutCubic(segmentProgress(localTime, 13.8, 15.6));
          zhangRoot.position.set(lerp(-0.85, 1.9, stepP), 0, lerp(0.18, 0.08, stepP));
          zhangRoot.rotation.set(0, Math.PI + 0.08, 0);
          applyPose(
            context.zhang.figure,
            stepP < 0.95 ? poseWalkMilitary(time, 0) : poseBasementCraft(time, localTime * 0.4),
          );
        }

        // Pure cinema craft montage (3 crisp deterministic camera setups — zero speech!):
        // 0..4.5s: Cold wide establishing shot of dark military workshop & glowing emerald CNC
        // 4.5..12.8s: Dramatic tight macro dolly on spinning meteorite rod & blazing voxel sparks!
        // 12.8..18.0s: Crisp push-in onto the 36 gleaming cylindrical meteorite slugs on the steel tray!
        if (localTime < 4.5) {
          const p = easeInOutCubic(localTime / 4.5);
          setCameraLerp(
            context.camera,
            [2.45, 1.85, 2.55],
            [1.65, 1.68, 2.05],
            [-0.25, 1.15, -0.95],
            [-0.35, 1.15, -0.95],
            p,
            44,
          );
        } else if (localTime < 12.8) {
          const p = easeInOutCubic((localTime - 4.5) / 8.3);
          setCameraLerp(
            context.camera,
            [1.05, 1.38, 0.55],
            [0.05, 1.28, 0.35],
            [-0.28, 1.14, -0.95],
            [-0.12, 1.14, -0.95],
            p,
            38,
          );
        } else {
          const p = easeInOutCubic((localTime - 12.8) / 5.2);
          setCameraLerp(
            context.camera,
            [1.45, 1.52, -0.05],
            [2.02, 1.28, -0.32],
            [2.05, 0.92, -0.82],
            [2.05, 0.92, -0.82],
            p,
            32,
          );
        }

        context.workshop.update(time, localTime);
      },
    },

    // =========================================================================
    // SHOT 08 (102.0 – 122.0s) — HIDDEN BASEMENT: ASSEMBLING 36 METEORITE ROUNDS
    // =========================================================================
    {
      id: "shot-08-basement-assembly",
      start: 102.0,
      end: 122.0,
      enter({ context }) {
        context.setActiveEnvironment("basement");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("workshop");
        context.zhang.hideAllHandProps();
      },
      update({ context, time, localTime }) {
        const fadeIn = 1 - smoothstep(segmentProgress(localTime, 0, 0.7));
        context.overlays.setFade(fadeIn, "#020305");

        const zhangRoot = context.zhang.figure.root;
        zhangRoot.position.set(0.0, 0, 0.14);
        zhangRoot.rotation.set(0, Math.PI, 0);

        // Copper tips convert cleanly into dark iron-meteorite tips across 1.5..12.0s!
        const converted = Math.min(36, Math.floor(segmentProgress(localTime, 1.2, 12.2) * 36));

        const loadingPhase = localTime >= 12.6;
        context.zhang.handPliers.visible = !loadingPhase;
        context.zhang.pistol.group.visible = loadingPhase;
        context.zhang.pistol.scope.visible = false;
        // Magazine inserts at localTime = 16.4s (t = 118.4s)
        context.zhang.pistol.magazine.visible = localTime >= 16.4;

        applyPose(
          context.zhang.figure,
          poseBasementCraft(time, localTime * (loadingPhase ? 0.65 : 0.45)),
        );

        // 0..12.6s: High-angle Noir glide over the 36 caseless cartridges morphing into meteorite rounds
        // 12.6..20.0s: Tight side profile as Zhang loads 4 rounds, slaps mag home, and racks slide!
        if (!loadingPhase) {
          const p = easeInOutCubic(localTime / 12.6);
          setCameraLerp(
            context.camera,
            [0.98, 1.52, -0.05],
            [-0.78, 1.32, -0.15],
            [-0.08, 0.86, -0.68],
            [-0.05, 0.88, -0.68],
            p,
            34,
          );
        } else {
          const p = easeInOutCubic((localTime - 12.6) / 7.4);
          setCameraLerp(
            context.camera,
            [-1.25, 1.38, 0.42],
            [-0.95, 1.44, 0.08],
            [0.0, 1.25, -0.15],
            [0.0, 1.32, -0.12],
            p,
            34,
          );
        }

        context.basement.update(time, converted, 0, 0, 0, false);
      },
    },

    // =========================================================================
    // SHOT 09 (122.0 – 136.0s) — BASEMENT TEST FIRE (DEAFENING 4 ROUNDS!)
    // =========================================================================
    {
      id: "shot-09-basement-test-fire",
      start: 122.0,
      end: 136.0,
      enter({ context }) {
        context.setActiveEnvironment("basement");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("workshop");
        context.zhang.hideAllHandProps();
        context.zhang.pistol.group.visible = true;
        context.zhang.pistol.scope.visible = false;
        context.zhang.pistol.magazine.visible = true;
        context.overlays.setFade(0);
      },
      update({ context, time, localTime }) {
        const zhangRoot = context.zhang.figure.root;
        zhangRoot.position.set(-0.22, 0, 1.32);
        zhangRoot.rotation.set(0, Math.PI - 0.05, 0);

        const { intensity: flash, countFired } = multiShotPulse(time, BASEMENT_SHOT_TIMES, 0.22);
        const { intensity: recoil } = multiShotPulse(time, BASEMENT_SHOT_TIMES, 0.34);

        const raiseP = smoothstep(segmentProgress(localTime, 0.0, 1.6));
        const aimPose = poseBasementShoot(0.02, 0.04, recoil);
        applyPose(
          context.zhang.figure,
          lerpPose(poseMilitaryStand(time, 0, 0), aimPose, raiseP),
        );

        // Update world matrices so muzzle flash locks precisely to pistol barrel tip!
        zhangRoot.updateMatrixWorld(true);
        context.zhang.pistol.muzzlePoint.getWorldPosition(_muzzleWorld);
        context.basement.muzzleFlashGroup.position.copy(_muzzleWorld);
        context.basement.muzzleFlashLight.position.copy(_muzzleWorld);

        const smokeAge = Math.max(0, time - BASEMENT_SHOT_TIMES[0]);

        // Subtle camera shock micro-shake on each deafening indoor blast!
        const shakeX = Math.sin(time * 95) * flash * 0.045;
        const shakeY = Math.cos(time * 112) * flash * 0.035;

        // 0..7.6s: Dramatic low-angle side-behind firing shot framing shooter + concrete wall target
        // 7.6..14.0s: Cut straight to smoking white spacesuit-cloth target showing 4 crisp dark bullet holes!
        if (localTime < 7.6) {
          const p = easeInOutCubic(localTime / 7.6);
          setCameraLerp(
            context.camera,
            [1.42 + shakeX, 1.18 + shakeY, 2.05],
            [1.08 + shakeX, 1.24 + shakeY, 1.65],
            [-0.12, 1.36, -1.9],
            [-0.08, 1.38, -2.5],
            p,
            42,
          );
        } else {
          const p = easeInOutCubic((localTime - 7.6) / 6.4);
          setCameraLerp(
            context.camera,
            [0.35, 1.42, -2.35],
            [0.08, 1.38, -2.85],
            [0.0, 1.38, -3.95],
            [0.0, 1.38, -3.95],
            p,
            34,
          );
        }

        context.basement.update(time, 32, flash, countFired, smokeAge, false);
      },
    },

    // =========================================================================
    // SHOT 10 (136.0 – 148.0s) — SHATTERED METEORITE GRAVEL IN RAW BEEF
    // =========================================================================
    {
      id: "shot-10-beef-inspection",
      start: 136.0,
      end: 148.0,
      enter({ context }) {
        context.setActiveEnvironment("basement");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("workshop");
        context.zhang.hideAllHandProps();
        context.zhang.handKnife.visible = true;
      },
      update({ context, time, localTime }) {
        const zhangRoot = context.zhang.figure.root;
        zhangRoot.position.set(0.0, 0, 0.16);
        zhangRoot.rotation.set(0, Math.PI, 0);

        const sliceDone = smoothstep(segmentProgress(localTime, 2.0, 4.5));
        context.zhang.handKnife.visible = localTime < 5.5;
        applyPose(
          context.zhang.figure,
          lerpPose(
            poseBasementCraft(time, localTime * 0.4),
            poseMilitaryStand(time, 0, 0.28),
            sliceDone,
          ),
        );

        // Camera sweeps from macro shot of shattered iron gravel & crimson beef up to Zhang's cold gaze!
        const p = easeInOutCubic(localTime / 12.0);
        setCameraLerp(
          context.camera,
          [0.48, 1.32, -0.32],
          [-0.62, 1.56, -0.68],
          [0.02, 0.88, -0.68],
          [0.0, 1.48, 0.14],
          p,
          34,
        );

        const fadeOut = smoothstep(segmentProgress(localTime, 11.1, 12.0));
        context.overlays.setFade(fadeOut, "#020307");

        const smokeAge = time - BASEMENT_SHOT_TIMES[0];
        context.basement.update(time, 32, 0, 4, smokeAge, true);
      },
      leave({ context }) {
        context.zhang.handKnife.visible = false;
        context.overlays.setFade(0);
      },
    },

    // =========================================================================
    // SHOT 11 (148.0 – 164.0s) — SYNCHRONOUS ORBIT: YELLOW RIVER STATION & DOCK
    // =========================================================================
    {
      id: "shot-11-orbit-vista",
      start: 148.0,
      end: 164.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("suit-gold");
        context.zhang.hideAllHandProps();
        context.orbit.floatingScope.visible = false;
        context.orbit.floatingGlove.visible = false;
        context.orbit.spentMags.forEach((m) => (m.visible = false));
        context.overlays.setScope(0);
      },
      update({ context, time, localTime }) {
        const fadeIn = 1 - smoothstep(segmentProgress(localTime, 0, 1.0));
        context.overlays.setFade(fadeIn, "#020307");

        const zhang = context.zhang.figure.root;
        zhang.position.set(0, Math.sin(time * 0.35) * 0.14, 0);
        zhang.rotation.set(0.06, Math.PI, 0);
        applyPose(context.zhang.figure, poseOrbitSolitude(time));

        // 0..8.5s: Sweeping grand vista of Yellow River rotating wheel, Space Elevator & skeletal Space Dock!
        // 8.5..16.0s: Pull back behind lone Zhang Beihai hovering 5km out watching the station!
        if (localTime < 8.5) {
          const p = easeInOutCubic(localTime / 8.5);
          setCameraLerp(
            context.camera,
            [-68, 28, -72],
            [-28, 16, -68],
            [-14, 10, -155],
            [0, 10, -150],
            p,
            48,
          );
        } else {
          const p = easeInOutCubic((localTime - 8.5) / 7.5);
          setCameraLerp(
            context.camera,
            [2.4, 1.55, 3.6],
            [1.55, 1.48, 2.75],
            [0, 1.2, -32],
            [0, 1.35, -60],
            p,
            44,
          );
        }

        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);
        context.orbit.update({
          time,
          sunDrop: 0.14 + (localTime / 16.0) * 0.16,
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
    },

    // =========================================================================
    // SHOT 12 (164.0 – 180.0s) — ORBITAL SUNSET: THE DIAMOND RING
    // =========================================================================
    {
      id: "shot-12-orbital-sunset",
      start: 164.0,
      end: 180.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("suit-open"); // Visor open so his intense eyes read clearly!
        context.zhang.hideAllHandProps();
        context.zhang.looseScope.visible = true;
        context.orbit.floatingScope.visible = false;
        context.orbit.floatingGlove.visible = false;
        context.orbit.spentMags.forEach((m) => (m.visible = false));
        context.overlays.setScope(0);
      },
      update({ context, time, localTime, progress }) {
        const zhang = context.zhang.figure.root;
        zhang.position.set(0, Math.sin(time * 0.35) * 0.12, 0);
        zhang.rotation.set(0.04, Math.PI, 0);

        const raiseScope = smoothstep(segmentProgress(localTime, 3.5, 6.2));
        applyPose(
          context.zhang.figure,
          lerpPose(poseOrbitSolitude(time), poseOrbitScopeScan(time, 0.05), raiseScope),
        );

        // Heroic three-quarter medium shot: Zhang raising scope with glowing sunset Earth & diamond-ring Sun behind him!
        setCameraLerp(
          context.camera,
          [2.35, 1.48, 0.85],
          [1.85, 1.54, 0.15],
          [-0.2, 1.32, -0.25],
          [-0.1, 1.38, -0.2],
          easeInOutCubic(progress),
          42,
        );

        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);
        context.orbit.update({
          time,
          sunDrop: 0.3 + progress * 0.22, // Sun settles halfway behind Earth -> diamond ring!
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
    },

    // =========================================================================
    // SHOT 13 (180.0 – 192.0s) — SCOPE POV: AIRLOCK GREEN, 25 ASTRONAUTS EXIT!
    // =========================================================================
    {
      id: "shot-13-scope-airlock",
      start: 180.0,
      end: 192.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = false; // First-person telephoto scope view!
        context.zhang.figure.root.position.set(0, 0, 0);
        context.orbit.floatingScope.visible = false;
        context.orbit.floatingGlove.visible = false;
        context.orbit.spentMags.forEach((m) => (m.visible = false));
      },
      update({ context, time, localTime }) {
        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);

        // Crisp telephoto zoom: starts framed on airlock door (fov 18), zooms onto 3 center leaders (fov 10.5)!
        const zoomP = easeInOutCubic(segmentProgress(localTime, 6.6, 10.5));
        const swayX = Math.sin(time * 0.9) * 0.12;
        const swayY = Math.cos(time * 0.7) * 0.09;
        const fov = lerp(18.5, 10.2, zoomP);

        context.overlays.setScope(
          1,
          localTime >= 7.0 ? "3 TARGETS LOCKED · VISOR CLEAR" : airlockGreen ? "AIRLOCK OPEN · EVA" : "STANDBY · 5000M",
        );

        setCameraLerp(
          context.camera,
          [0.0, 2.2, -92.0],
          [0.65, 2.15, -96.0],
          [0.0 + swayX, 2.0 + swayY, -135.0],
          [0.72 + swayX * 0.4, 2.35 + swayY * 0.4, -124.0],
          zoomP,
          fov,
        );

        context.orbit.update({
          time,
          sunDrop: 0.52 + (localTime / 12.0) * 0.08,
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: context.zhang.figure.root.position,
          zhangQuat: context.zhang.figure.root.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
      leave({ context }) {
        context.overlays.setScope(0);
        context.zhang.figure.root.visible = true;
      },
    },

    // =========================================================================
    // SHOT 14 (192.0 – 202.0s) — BARE CLOTH HAND IN -100°C VACUUM & MAGNETIC SCOPE
    // =========================================================================
    {
      id: "shot-14-glove-and-pistol",
      start: 192.0,
      end: 202.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.hideAllHandProps();
        context.overlays.setScope(0);
      },
      update({ context, time, localTime, progress }) {
        const zhang = context.zhang.figure.root;
        zhang.position.set(0, Math.sin(time * 0.35) * 0.1, 0);
        // Rotates slightly mid-shot so dying sunset light warms his cloth-gloved right hand!
        const warmTurn = fadeEnvelope(localTime, 3.6, 7.6, 1.0, 1.2) * 0.35;
        zhang.rotation.set(0.04, Math.PI + warmTurn, 0);

        // Right EVA glove comes off at localTime = 3.2s (t = 195.2s)!
        const gloveRemoved = localTime >= 3.2;
        context.zhang.setWardrobe(gloveRemoved ? "suit-barehand" : "suit-open");

        // Floating free-drifting scope until snapped magnetically onto pistol at localTime = 7.1s (t = 199.1s)!
        const scopeMounted = localTime >= 7.1;
        context.orbit.floatingScope.visible = !scopeMounted;
        context.orbit.floatingScope.position.set(
          -0.18 + Math.sin(time * 0.7) * 0.04,
          1.42 + Math.cos(time * 0.6) * 0.03,
          -0.62,
        );
        context.orbit.floatingScope.rotation.set(0.15, time * 0.25, 0.1);

        // Removed white EVA glove drifts gently upward/left in zero-G!
        context.orbit.floatingGlove.visible = gloveRemoved;
        if (gloveRemoved) {
          const dt = localTime - 3.2;
          context.orbit.floatingGlove.position.set(
            0.32 + dt * 0.07,
            1.22 + dt * 0.05,
            -0.45 + dt * 0.04,
          );
          context.orbit.floatingGlove.rotation.set(dt * 0.4, dt * 0.6, dt * 0.3);
        }

        // Pistol drawn from utility pouch at localTime = 4.6s (t = 196.6s)
        const pistolDrawn = localTime >= 4.6;
        context.zhang.pistol.group.visible = pistolDrawn;
        context.zhang.pistol.magazine.visible = pistolDrawn;
        context.zhang.pistol.scope.visible = scopeMounted;

        applyPose(context.zhang.figure, poseRemoveGlove(time, progress));

        // Crisp, clean three-quarter medium close-up showing visor, floating scope, drifting glove & pistol!
        setCameraLerp(
          context.camera,
          [1.72, 1.5, -1.78],
          [-1.42, 1.54, -1.68],
          [0.02, 1.26, -0.22],
          [0.0, 1.32, -0.18],
          easeInOutCubic(progress),
          38,
        );

        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);
        context.orbit.update({
          time,
          sunDrop: 0.6 + progress * 0.06,
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
      leave({ context }) {
        context.orbit.floatingScope.visible = false;
        context.orbit.floatingGlove.visible = false;
      },
    },

    // =========================================================================
    // SHOT 15 (202.0 – 218.0s) — THIRTY SILENT SHOTS: A FIREFLY IN THE ABYSS
    // =========================================================================
    {
      id: "shot-15-thirty-silent-shots",
      start: 202.0,
      end: 218.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("suit-barehand");
        context.zhang.hideAllHandProps();
        context.zhang.pistol.group.visible = true;
        context.zhang.pistol.scope.visible = true;
        context.zhang.pistol.magazine.visible = true;
        context.overlays.setScope(0);
      },
      update({ context, time, localTime }) {
        const { intensity: flash, countFired } = multiShotPulse(time, ORBIT_SHOT_TIMES, 0.14);
        const { intensity: recoil } = multiShotPulse(time, ORBIT_SHOT_TIMES, 0.24);

        // Two zero-G magazine swaps: 207.0..208.2s and 212.6..213.8s!
        const reload1 = segmentProgress(time, 207.0, 208.2);
        const reload2 = segmentProgress(time, 212.6, 213.8);
        const reloading =
          time >= 207.0 && time <= 208.2
            ? reload1
            : time >= 212.6 && time <= 213.8
              ? reload2
              : 0;

        // Slight target shift yaw across the 3 front-row leaders (B -> A -> C)
        const aimYaw = time < 207.6 ? -0.08 : time < 213.2 ? 0.0 : 0.08;

        // Subtle Newton's-third-law recoil drift backward (+Z) with every shot!
        const zhang = context.zhang.figure.root;
        zhang.position.set(0, Math.sin(time * 0.35) * 0.08, countFired * 0.022);
        zhang.rotation.set(0.03, Math.PI, 0);
        applyPose(context.zhang.figure, poseOrbitPistolFire(time, aimYaw, recoil, reloading));

        // Tumbling spent magazines drifting weightlessly away after each swap!
        context.orbit.spentMags[0]!.visible = time >= 207.2;
        if (time >= 207.2) {
          const dt = time - 207.2;
          context.orbit.spentMags[0]!.position.set(0.25 + dt * 0.14, 1.1 - dt * 0.1, -0.35 + dt * 0.06);
          context.orbit.spentMags[0]!.rotation.set(dt * 1.4, dt * 0.9, dt * 1.1);
        }
        context.orbit.spentMags[1]!.visible = time >= 212.8;
        if (time >= 212.8) {
          const dt = time - 212.8;
          context.orbit.spentMags[1]!.position.set(0.22 + dt * 0.16, 1.08 - dt * 0.08, -0.15 + dt * 0.09);
          context.orbit.spentMags[1]!.rotation.set(dt * 1.2, dt * 1.5, dt * 0.8);
        }

        zhang.updateMatrixWorld(true);
        context.zhang.pistol.muzzlePoint.getWorldPosition(_muzzleWorld);

        // 3 Iconic Camera Setups inside Shot 15:
        // 0..4.8s (Burst 1): Over-the-shoulder aiming toward Yellow River Station
        // 4.8..10.4s (Swap 1 + Burst 2): Tight close-up on his calm eyes behind visor & flashing barrel
        // 10.4..16.0s (Swap 2 + Burst 3): PULLED BACK IN DARK SPACE ("a lone firefly in the abyss"!)
        if (localTime < 4.8) {
          const p = easeInOutCubic(localTime / 4.8);
          setCameraLerp(
            context.camera,
            [1.38, 1.5, 2.05],
            [1.08, 1.46, 1.72],
            [-0.25, 1.3, -38.0],
            [-0.2, 1.34, -55.0],
            p,
            42,
          );
        } else if (localTime < 10.4) {
          const p = easeInOutCubic((localTime - 4.8) / 5.6);
          setCameraLerp(
            context.camera,
            [-0.92, 1.46, -1.28],
            [-0.78, 1.5, -1.05],
            [0.02, 1.38, 0.12],
            [0.02, 1.42, 0.18],
            p,
            32,
          );
        } else {
          const p = easeInOutCubic((localTime - 10.4) / 5.6);
          setCameraLerp(
            context.camera,
            [9.5, 3.8, -16.5],
            [15.5, 5.4, -24.0],
            [0.0, 1.2, 0.4],
            [0.0, 1.2, 0.6],
            p,
            46,
          );
        }

        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);
        context.orbit.update({
          time,
          sunDrop: 0.66 + (localTime / 16.0) * 0.06,
          airlockGreen,
          airlockOpen,
          muzzleFlash: flash,
          muzzleWorldPos: _muzzleWorld,
          zhangThrust: 0,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
      leave({ context }) {
        context.orbit.spentMags.forEach((m) => (m.visible = false));
      },
    },

    // =========================================================================
    // SHOT 16 (218.0 – 234.0s) — TEN SECONDS OF FLIGHT: "ARE THEY INNOCENT?"
    // =========================================================================
    {
      id: "shot-16-ten-seconds-flight",
      start: 218.0,
      end: 234.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("suit-barehand");
        context.zhang.hideAllHandProps();
        context.zhang.pistol.group.visible = true;
        context.zhang.pistol.scope.visible = true;
        context.overlays.setScope(0);
      },
      update({ context, time, localTime }) {
        const zhang = context.zhang.figure.root;
        zhang.position.set(0, Math.sin(time * 0.35) * 0.08, 0.66);
        zhang.rotation.set(0.03, Math.PI, 0);
        // Holding empty pistol steady, watching calmly through the scope
        applyPose(context.zhang.figure, poseOrbitPistolFire(time, 0, 0, 0));

        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);

        // Surreal 3-beat parallel suspense cutting across the 10-second ballistic flight!
        // 0..6.2s: Macro tracking alongside the silent gleaming iron meteorite bullets slicing across Earth!
        // 6.2..11.2s: Unsuspecting smiling aerospace leaders waiting peacefully for the group photo!
        // 11.2..16.0s: Tight portrait of Zhang Beihai's resolute face behind the scope counting down to zero!
        let bulletProg = -1;
        if (localTime < 6.2) {
          bulletProg = localTime / 6.2;
          const bz = -18 - bulletProg * 74;
          // Camera tracks smoothly alongside the tight cluster of 12 gleaming iron meteorite bullets (oz in [-12.6, 0])!
          setCameraLerp(
            context.camera,
            [2.85, 1.85, bz + 2.4],
            [2.15, 1.6, bz + 1.2],
            [0.0, 1.4, bz - 5.5],
            [0.0, 1.4, bz - 6.8],
            bulletProg,
            38,
          );
        } else if (localTime < 11.2) {
          const p = easeInOutCubic((localTime - 6.2) / 5.0);
          setCameraLerp(
            context.camera,
            [-2.2, 2.15, -118.4],
            [2.1, 2.25, -118.8],
            [0.45, 2.1, -124.2],
            [0.55, 2.15, -124.2],
            p,
            34,
          );
        } else {
          const p = easeInOutCubic((localTime - 11.2) / 4.8);
          setCameraLerp(
            context.camera,
            [-0.78, 1.54, -0.58],
            [-0.54, 1.52, -0.35],
            [0.0, 1.48, 0.66],
            [0.0, 1.5, 0.66],
            p,
            30,
          );
        }

        context.orbit.update({
          time,
          sunDrop: 0.72 + (localTime / 16.0) * 0.06,
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: bulletProg,
        });
      },
    },

    // =========================================================================
    // SHOT 17 (234.0 – 258.0s) — SILENT IMPACT, BLOOD-SNOW & "METEOR SHOWER!"
    // =========================================================================
    {
      id: "shot-17-impact-chaos",
      start: 234.0,
      end: 258.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = false;
        context.zhang.figure.root.position.set(0, 0, 0.66);
        context.orbit.floatingScope.visible = false;
        context.orbit.floatingGlove.visible = false;
        context.orbit.spentMags.forEach((m) => (m.visible = false));
        context.overlays.setFade(0);
      },
      update({ context, time, localTime }) {
        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);
        const centerLeader = context.orbit.crew.find((c) => c.role === "leaderA")!;
        const leaderWorldX = context.orbit.crewGroup.position.x + centerLeader.figure.root.position.x;
        const leaderWorldY = context.orbit.crewGroup.position.y + centerLeader.figure.root.position.y;
        const leaderWorldZ = context.orbit.crewGroup.position.z + centerLeader.figure.root.position.z;

        // 3 unforgettable visual chapters inside the climax:
        // 0..5.8s: Telephoto Scope POV watching white gas geysers & backpack explosion erupt in dead silence!
        // 5.8..12.2s: Haunting close-up right on Leader A's cracked crimson visor & glittering frozen blood-snow!
        // 12.2..24.0s: Dynamic wide orbital chaos as colleagues ignite full-power jets dragging the 5 casualties back to airlock!
        if (localTime < 5.8) {
          const p = easeInOutCubic(localTime / 5.8);
          context.overlays.setScope(1, "IMPACT CONFIRMED · 5 SUIT BREACHES");
          setCameraLerp(
            context.camera,
            [0.65, 2.2, -97.0],
            [0.2, 2.4, -95.0],
            [0.5, 2.2, -124.0],
            [0.3, 2.3, -124.8],
            p,
            12.5,
          );
        } else if (localTime < 12.2) {
          const p = easeInOutCubic((localTime - 5.8) / 6.4);
          context.overlays.setScope(0);
          setCameraLerp(
            context.camera,
            [leaderWorldX + 0.65, leaderWorldY + 1.56, leaderWorldZ + 2.55],
            [leaderWorldX - 0.55, leaderWorldY + 1.58, leaderWorldZ + 2.75],
            [leaderWorldX, leaderWorldY + 1.48, leaderWorldZ],
            [leaderWorldX, leaderWorldY + 1.46, leaderWorldZ],
            p,
            34,
          );
        } else {
          const p = easeInOutCubic((localTime - 12.2) / 11.8);
          context.overlays.setScope(0);
          setCameraLerp(
            context.camera,
            [-9.5, 6.2, -112.0],
            [8.2, 4.8, -116.5],
            [0.0, 2.0, -128.0],
            [0.0, 2.0, -136.0],
            p,
            46,
          );
        }

        context.orbit.update({
          time,
          sunDrop: 0.78 + (localTime / 24.0) * 0.08,
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: 0,
          zhangPos: context.zhang.figure.root.position,
          zhangQuat: context.zhang.figure.root.quaternion,
          impactTime: localTime,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
      leave({ context }) {
        context.overlays.setScope(0);
        context.zhang.figure.root.visible = true;
      },
    },

    // =========================================================================
    // SHOT 18 (258.0 – 274.0s) — EPILOGUE: THRUSTER BURN & FATHER'S GAZE
    // =========================================================================
    {
      id: "shot-18-departure",
      start: 258.0,
      end: 274.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.hideAllHandProps();
        context.orbit.floatingScope.visible = false;
        context.orbit.floatingGlove.visible = false;
        context.orbit.spentMags.forEach((m) => (m.visible = false));
        context.overlays.setScope(0);
        context.overlays.setEndingTitle(0);
        context.overlays.setFade(0);
      },
      update({ context, time, localTime }) {
        const { airlockGreen, airlockOpen, evacProgress } = updateOrbitalCrew(context, time);

        // Locks glove back on at 259.8s, closes visor gold at 262.0s, ignites cold-gas thrusters at 263.0s!
        const wardrobe =
          localTime < 1.8 ? "suit-barehand" : localTime < 4.0 ? "suit-open" : "suit-gold";
        context.zhang.setWardrobe(wardrobe);

        const thrust = smoothstep(segmentProgress(localTime, 5.0, 6.6));
        const accelT = Math.max(0, localTime - 5.0);
        const travel = 0.28 * accelT * accelT; // crisp Newtonian acceleration toward Base One (+Z/+X/+Y)!

        const zhang = context.zhang.figure.root;
        zhang.position.set(
          travel * 0.25,
          Math.sin(time * 0.35) * 0.08 + travel * 0.14,
          0.66 + travel * 0.85,
        );
        // Rotates cleanly away from Yellow River Station toward Base One (+Z)
        const turnP = easeInOutCubic(segmentProgress(localTime, 2.5, 5.2));
        zhang.rotation.set(0.18 * thrust, lerp(Math.PI, 0.28, turnP), 0);

        applyPose(
          context.zhang.figure,
          lerpPose(
            poseOrbitSolitude(time),
            {
              hips: [0.22, 0, 0],
              neck: [-0.14, 0, 0],
              armR: [-0.2, 0, 0.18],
              armL: [-0.2, 0, -0.18],
              legR: [0.18, 0, 0.06],
              legL: [0.12, 0, -0.06],
            },
            thrust,
          ),
        );

        // 0..3.2s: Brief parting glance at Yellow River airlock sealing shut (RED lamp)
        // 3.2..16.0s: Serene wide tracking shot as Zhang ignites thrusters and glides away above sunset Earth!
        if (localTime < 3.2) {
          const p = easeInOutCubic(localTime / 3.2);
          setCameraLerp(
            context.camera,
            [2.4, 3.2, -118.0],
            [3.2, 3.6, -114.0],
            [0.0, 2.0, -135.0],
            [0.0, 2.0, -135.0],
            p,
            42,
          );
        } else {
          const p = easeInOutCubic((localTime - 3.2) / 12.8);
          setCameraLerp(
            context.camera,
            [-2.2, 1.75, 4.2],
            [4.6, 3.4, 24.5],
            [zhang.position.x, zhang.position.y + 1.05, zhang.position.z - 12.0],
            [zhang.position.x * 0.7, zhang.position.y + 0.4, zhang.position.z - 28.0],
            p,
            46,
          );
        }

        context.orbit.update({
          time,
          sunDrop: 0.86 + (localTime / 16.0) * 0.06,
          airlockGreen,
          airlockOpen,
          muzzleFlash: 0,
          zhangThrust: thrust,
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress,
          heroBulletProgress: -1,
        });
      },
    },

    // =========================================================================
    // SHOT 19 (274.0 – 288.0s) — FINAL IMAGE & END CREDITS
    // =========================================================================
    {
      id: "shot-19-final-credits",
      start: 274.0,
      end: 288.0,
      enter({ context }) {
        context.setActiveEnvironment("orbit");
        context.zhang.figure.root.visible = true;
        context.zhang.setWardrobe("suit-gold");
        context.zhang.hideAllHandProps();
        context.overlays.setScope(0);
        context.overlays.setOpeningTitle(0);
      },
      update({ context, time, localTime, progress }) {
        // Zhang shrinks serenely into a solitary speck drifting through cosmic night above Earth
        const zhang = context.zhang.figure.root;
        const drift = localTime * 2.6;
        zhang.position.set(8.5 + drift * 0.25, 4.8 + drift * 0.14, 29.0 + drift * 0.85);
        zhang.rotation.set(0.18, 0.28, 0);
        applyPose(context.zhang.figure, poseOrbitSolitude(time));

        // Monumental still-drift cosmic vista: Earth's blue-orange horizon & Yellow River wheel in the deep void
        setCameraLerp(
          context.camera,
          [-10.5, 4.5, -2.5],
          [-16.0, 6.2, -12.0],
          [-8.0, -8.0, -145.0],
          [-12.0, -14.0, -165.0],
          easeInOutCubic(progress),
          48,
        );

        // Minimalist end title & credits card fades in over the dark starry sky, then fades cleanly to black!
        const endTitleOpacity = fadeEnvelope(localTime, 1.4, 12.2, 1.8, 1.8);
        context.overlays.setEndingTitle(endTitleOpacity);

        const finalFade = smoothstep(segmentProgress(localTime, 11.4, 14.0));
        context.overlays.setFade(finalFade, "#010205");

        context.orbit.update({
          time,
          sunDrop: 0.92 + progress * 0.08,
          airlockGreen: false,
          airlockOpen: 0,
          muzzleFlash: 0,
          zhangThrust: Math.max(0, 1 - localTime * 0.14),
          zhangPos: zhang.position,
          zhangQuat: zhang.quaternion,
          impactTime: -1,
          evacProgress: 0,
          heroBulletProgress: -1,
        });
      },
      leave({ context }) {
        context.overlays.setEndingTitle(0);
        context.overlays.setFade(0);
      },
    },
  ];
}
