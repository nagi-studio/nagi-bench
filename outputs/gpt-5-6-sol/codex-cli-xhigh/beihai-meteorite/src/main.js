import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { voiceCues } from "./voiceCues.js";
import { registerAudioDesign, soundCues } from "./audioDesign.js";
import { createWorld, showOnly, setCamera, lerp3, ease, setPose } from "./world.js";
import "./styles.css";

export { voiceCues } from "./voiceCues.js";

const DURATION = 228;
validateVoiceCues(voiceCues, DURATION);

const app = document.querySelector("#app");
const stageContainer = document.querySelector("#stage");
const startButton = document.querySelector("#start-film");
const chapter = document.querySelector("#chapter");
const hud = document.querySelector("#hud");
const curtain = document.querySelector("#curtain");
const endCard = document.querySelector("#end-card");

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x030508, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030508);
const camera = new THREE.PerspectiveCamera(42, 1, 0.08, 1200);
const world = createWorld(scene);

const context = {
  scene,
  camera,
  world,
  renderer,
  ui: { chapter, hud, curtain, endCard },
};

function title(text, opacity = 1) {
  chapter.textContent = text;
  chapter.style.opacity = String(opacity);
}

function telemetry(text = "", opacity = 0) {
  hud.textContent = text;
  hud.style.opacity = String(opacity);
}

function veil(opacity = 0) {
  curtain.style.opacity = String(Math.max(0, Math.min(1, opacity)));
}

function resetOverlay() {
  title("", 0);
  telemetry("", 0);
  veil(0);
  endCard.classList.remove("visible");
  endCard.setAttribute("aria-hidden", "true");
}

function interior(background = 0x16130f, fogColor = background, near = 18, far = 42) {
  scene.background = new THREE.Color(background);
  scene.fog = new THREE.Fog(fogColor, near, far);
  renderer.toneMappingExposure = 1.0;
}

function vacuum(exposure = 1.1) {
  scene.background = new THREE.Color(0x010205);
  scene.fog = null;
  renderer.toneMappingExposure = exposure;
}

function shot(id, start, end, key, update) {
  return {
    id,
    start,
    end,
    enter: () => {
      resetOverlay();
      showOnly(world, key);
    },
    update,
    leave: () => {
      world[key].root.visible = false;
    },
  };
}

const fireTimes = [
  170.8,171.0,171.2,171.4,171.6,171.8,172.0,172.2,172.4,172.6,
  173.5,173.7,173.9,174.1,174.3,174.5,174.7,174.9,175.1,175.3,
  176.2,176.4,176.6,176.8,177.0,177.2,177.4,177.6,177.8,178.0,
];

function nearestPulse(time, pulses, width = 0.08) {
  let distance = Infinity;
  for (const pulse of pulses) distance = Math.min(distance, Math.abs(time - pulse));
  return Math.max(0, 1 - distance / width);
}

function resetAttendees() {
  for (const rig of world.space.attendees) {
    rig.root.position.copy(rig.root.userData.base);
    rig.root.rotation.set(0, Math.PI, 0);
    rig.root.visible = true;
    setPose(rig, {
      leftArm: [0, 0, 0.04],
      rightArm: [0, 0, -0.04],
      leftLeg: [0, 0, 0.03],
      rightLeg: [0, 0, -0.03],
    });
  }
  world.space.leaks.forEach((leak) => leak.children.forEach((piece) => { piece.visible = false; }));
}

function spaceContinuity(time) {
  world.space.earth.rotation.y = 0.45 + time * 0.0014;
  world.space.station.rotation.z = -0.12 + time * 0.00035;
  world.space.shooter.root.scale.setScalar(1.12);
}

const shots = [
  shot("01-prologue", 0, 9, "prologue", ({ localTime, progress }) => {
    vacuum(0.92);
    world.prologue.stone.rotation.set(localTime * 0.07, localTime * 0.115, localTime * 0.035);
    world.prologue.stars.rotation.y = localTime * 0.004;
    setCamera(camera, lerp3([10.5, 4.5, 14.5], [7.6, 2.5, 10.2], ease(progress)), [0, 0, 0], 38);
    const labelEnvelope = Math.min(1, Math.max(0, (localTime - 0.8) / 1.2)) * Math.min(1, Math.max(0, (8.6 - localTime) / 1.1));
    title("尘 世 之 外", labelEnvelope * 0.75);
    veil(Math.max(0, 1 - localTime / 1.2));
  }),

  shot("02-alley", 9, 18, "alley", ({ localTime, progress }) => {
    interior(0x1d2324, 0x1d2324, 11, 30);
    const walk = ease(progress);
    world.alley.zhang.root.position.set(0.35 * Math.sin(localTime * 1.3), 0.2, THREE.MathUtils.lerp(7, -5.5, walk));
    world.alley.zhang.root.rotation.y = Math.PI;
    setPose(world.alley.zhang, {
      leftArm: [Math.sin(localTime * 4.2) * 0.48, 0, 0],
      rightArm: [-Math.sin(localTime * 4.2) * 0.48, 0, 0],
      leftLeg: [-Math.sin(localTime * 4.2) * 0.43, 0, 0],
      rightLeg: [Math.sin(localTime * 4.2) * 0.43, 0, 0],
      head: [0, -0.05, 0],
    });
    const camPos = lerp3([5.5, 3.5, 10.5], [3.0, 3.2, -1.5], ease(progress));
    const target = [0, 2.5, THREE.MathUtils.lerp(5.5, -6.0, walk)];
    setCamera(camera, camPos, target, 43);
    const envelope = Math.min(1, localTime / 0.8) * Math.min(1, (9 - localTime) / 1.4);
    title("北京 · 深巷", envelope);
    veil(Math.max(0, 0.32 - localTime * 0.25));
  }),

  shot("03-collector", 18, 47, "collector", ({ time, localTime }) => {
    interior(0x241b15, 0x241b15, 18, 42);
    world.collector.three.forEach((item) => { item.visible = false; });
    world.collector.treasure.visible = localTime > 18;
    const collectorGesture = Math.sin(localTime * 1.4) * 0.15;
    setPose(world.collector.collector, {
      rightArm: localTime < 12 ? [-0.5 + collectorGesture, 0, -0.5] : [-1.0 + collectorGesture, 0, -0.7],
      leftArm: [-0.25, 0, 0.18],
      head: [0, Math.sin(localTime * 0.42) * 0.08, 0],
    });
    setPose(world.collector.zhang, {
      rightArm: time >= 37 && time < 42.5 ? [-1.23, 0.05, 0.28] : [-0.12, 0, 0.04],
      leftArm: [0.03, 0, -0.03],
      head: [0, -0.14, 0],
    });
    if (localTime < 10.5) {
      const p = ease(localTime / 10.5);
      setCamera(camera, lerp3([5.7, 4.0, 7.4], [4.3, 3.35, 5.2], p), [0, 2.6, 0.4], 41);
    } else if (localTime < 19.0) {
      const p = ease((localTime - 10.5) / 8.5);
      setCamera(camera, lerp3([-0.3, 3.7, 5.3], [-3.3, 3.25, 4.2], p), [-2.0, 3.0, 1.0], 34);
    } else if (localTime < 25.0) {
      const p = ease((localTime - 19) / 6);
      setCamera(camera, lerp3([2.8, 3.3, 4.4], [1.25, 3.0, 2.4], p), [0.2, 2.65, 0.0], 31);
    } else {
      const p = ease((localTime - 25) / 4);
      setCamera(camera, lerp3([-4.1, 3.4, 4.4], [-1.7, 3.0, 2.8], p), [-0.2, 2.7, -0.5], 33);
    }
    const envelope = Math.min(1, localTime / 0.9) * Math.max(0, 1 - Math.max(0, localTime - 4) / 1.3);
    title("一座仍按旧日节奏呼吸的房子", envelope * 0.9);
  }),

  shot("04-three-stones", 47, 62, "collector", ({ localTime, progress }) => {
    interior(0x211914, 0x211914, 17, 40);
    world.collector.treasure.visible = false;
    world.collector.three.forEach((item, index) => {
      item.visible = true;
      item.rotation.y = localTime * (0.08 + index * 0.015);
    });
    setPose(world.collector.collector, {
      rightArm: [-1.0 + Math.sin(localTime * 1.7) * 0.1, 0.1, -0.65],
      leftArm: [-0.6, 0, 0.45],
      head: [0, 0.14, 0],
    });
    setPose(world.collector.zhang, {
      rightArm: localTime > 10 ? [-1.08, 0.1, 0.38] : [-0.25, 0, 0.05],
      leftArm: [-0.15, 0, -0.08],
      head: [0, -0.1, 0],
    });
    if (localTime < 7.5) {
      const p = ease(localTime / 7.5);
      setCamera(camera, lerp3([4.2, 3.2, 4.3], [2.6, 3.03, 2.2], p), [0, 2.75, -0.15], 28);
    } else {
      const p = ease((localTime - 7.5) / 7.5);
      setCamera(camera, lerp3([0, 5.1, 5.2], [5.2, 3.65, 5.8], p), [0, 2.65, 0.1], 38);
    }
    title("三 块", Math.min(0.7, localTime / 1.2) * Math.max(0, 1 - Math.max(0, localTime - 4.8) / 1.2));
    veil(progress > 0.94 ? (progress - 0.94) / 0.06 : 0);
  }),

  shot("05-lathe", 62, 83, "workshop", ({ localTime, progress }) => {
    interior(0x101a1f, 0x101a1f, 16, 45);
    veil(Math.max(0, 0.7 - localTime * 0.65));
    world.workshop.chuck.rotation.x = localTime * 17;
    world.workshop.stock.rotation.x = localTime * 17;
    world.workshop.cutter.position.x = 0.6 - Math.min(4.1, Math.max(0, (localTime - 2) * 0.32));
    world.workshop.screen.material.emissiveIntensity = 0.7 + Math.sin(localTime * 9) * 0.2;
    world.workshop.rods.forEach((rod, index) => {
      rod.visible = localTime > 5.8 + index * 0.33;
      rod.rotation.x = localTime * 0.8 + index;
    });
    world.workshop.pellets.forEach((pellet, index) => {
      pellet.visible = localTime > 13.2 + index * 0.1;
    });
    world.workshop.chips.forEach((chip, index) => {
      const seed = chip.userData.seed;
      const emission = (localTime * 2.4 + seed[0] * 2.5) % 2.5;
      chip.visible = localTime > 2 && localTime < 16.5 && emission < 1.3;
      chip.position.set(-0.2 + seed[1] * 0.7, 2.65 + emission * (1.6 + seed[2]), -1 + (seed[0] - 0.5) * emission * 1.4);
      chip.rotation.set(emission * 5, index, emission * 3);
    });
    setPose(world.workshop.zhang, {
      rightArm: [-0.9, 0.1, 0.6],
      leftArm: [-0.65, 0, -0.45],
      head: [0.12, -0.28, 0],
    });
    if (localTime < 8) {
      setCamera(camera, lerp3([4.5, 4.4, 7.0], [1.4, 3.15, 3.1], ease(localTime / 8)), [0, 2.7, -1], 37);
    } else if (localTime < 15) {
      setCamera(camera, lerp3([-4.1, 3.1, 2.6], [-2.1, 2.85, 1.2], ease((localTime - 8) / 7)), [-0.6, 2.85, -1], 28);
    } else {
      setCamera(camera, lerp3([0, 8.2, 7.8], [0, 6.5, 5.1], ease((localTime - 15) / 6)), [0, 2.0, 1.1], 42);
    }
    const count = Math.min(36, Math.max(0, Math.floor((localTime - 13.2) * 10)));
    telemetry(localTime > 13 ? `MATERIAL  Fe/Ni\nØ 7.62 mm\nCOUNT  ${String(count).padStart(2, "0")} / 36` : "CNC // MATERIAL SCAN", Math.min(0.82, localTime / 2));
    title("模型制作车间 · 下班后", Math.min(1, localTime / 0.8) * Math.max(0, 1 - Math.max(0, localTime - 4) / 1));
    veil(progress > 0.97 ? (progress - 0.97) / 0.03 : 0);
  }),

  shot("06-basement", 83, 108, "basement", ({ time, localTime, progress }) => {
    interior(0x151718, 0x151718, 15, 35);
    veil(Math.max(0, 0.5 - localTime * 0.55));
    world.basement.bullets.forEach((bullet, index) => {
      const lift = Math.max(0, 1 - Math.abs(localTime - (2 + index * 0.23)) / 0.55);
      bullet.position.y = lift * 0.45;
      bullet.rotation.x = lift * 0.35;
    });
    const shotPulse = nearestPulse(time, [96.0, 96.72, 97.45, 98.18], 0.085);
    world.basement.flash.intensity = shotPulse * 32;
    world.basement.gun.position.set(0, localTime >= 11 ? 3.05 : 2.65, localTime >= 11 ? 2.8 : 2.3);
    world.basement.gun.rotation.z = shotPulse * 0.12;
    setPose(world.basement.zhang, localTime < 11 ? {
      rightArm: [-1.1, 0.2, 0.55], leftArm: [-0.8, 0, -0.4], head: [0.2, -0.35, 0],
    } : {
      rightArm: [-1.52 + shotPulse * 0.13, 0, 0.08], leftArm: [-1.43, 0, -0.15], head: [0.02, -0.5, 0],
    });
    world.basement.holes.forEach((hole, index) => { hole.visible = time >= [96.08, 96.8, 97.53, 98.26, 98.3][index]; });
    world.basement.fragments.forEach((fragment, index) => {
      const seed = fragment.userData.seed;
      fragment.visible = localTime > 17.2;
      fragment.position.set(2.0 + (seed[0] - 0.5) * 0.9, 3.4 + (seed[1] - 0.5) * 0.35, 2.5 + (seed[2] - 0.5) * 0.65);
      fragment.rotation.set(index, localTime, seed[0] * 6);
    });
    if (localTime < 11) {
      setCamera(camera, lerp3([-5.3, 5.7, 5.8], [-3.8, 4.1, 3.5], ease(localTime / 11)), [0, 2.4, 1.0], 38);
    } else if (localTime < 16.2) {
      const shake = shotPulse * 0.12;
      setCamera(camera, [4.8 + shake, 3.9 - shake, 6.4], [0, 2.75, -2.8], 42, shotPulse * 0.012);
    } else if (localTime < 19.5) {
      setCamera(camera, lerp3([2.8, 3.2, -3.2], [1.1, 2.8, -5.9], ease((localTime - 16.2) / 3.3)), [0, 2.4, -7.7], 31);
    } else {
      setCamera(camera, lerp3([5.2, 4.2, 5.7], [4.0, 3.7, 4.5], ease((localTime - 19.5) / 5.5)), [2.0, 3.4, 2.5], 29);
    }
    title("隐蔽地下室", Math.min(1, localTime / 0.7) * Math.max(0, 1 - Math.max(0, localTime - 3.5) / 1));
    telemetry(localTime > 12.5 && localTime < 16.5 ? "TEST  04 / 04\nROOM  SEALED\nRESONANCE  HIGH" : "", localTime > 12.5 && localTime < 16.5 ? 0.82 : 0);
    veil(progress > 0.94 ? (progress - 0.94) / 0.06 : 0);
  }),

  shot("07-orbit", 108, 123, "establish", ({ localTime, progress }) => {
    vacuum(1.12);
    world.establish.earth.rotation.y = 0.2 + localTime * 0.012;
    world.establish.station.rotation.z = -0.25 + localTime * 0.025;
    world.establish.dock.rotation.y = -0.2 + localTime * 0.006;
    const p = ease(progress);
    setCamera(camera, lerp3([0, 26, 42], [-20, 12, -36], p), lerp3([28, -8, -112], [10, 1, -112], p), THREE.MathUtils.lerp(48, 37, p), -0.03);
    title("同步轨道 · 黄河空间站", Math.min(1, localTime / 1.0) * Math.max(0, 1 - Math.max(0, localTime - 5.4) / 1.2));
    telemetry("ALT  35,786 km\nTETHER  ONLINE\nDOCKYARD  03%", Math.min(0.7, localTime / 2.5));
    veil(Math.max(0, 0.75 - localTime * 0.65));
  }),

  shot("08-alone", 123, 144, "space", ({ time, localTime, progress }) => {
    vacuum(1.06);
    spaceContinuity(time);
    resetAttendees();
    world.space.shooterGun.visible = false;
    world.space.bullets.forEach((bullet) => { bullet.visible = false; });
    world.space.muzzle.visible = false;
    world.space.shooter.root.position.set(THREE.MathUtils.lerp(4, 0, ease(Math.min(1, localTime / 5))), Math.sin(localTime * 0.28) * 0.22, THREE.MathUtils.lerp(8, 0, ease(Math.min(1, localTime / 5))));
    world.space.shooter.root.rotation.set(0.05 * Math.sin(localTime * 0.2), Math.PI, 0.16 * Math.sin(localTime * 0.14));
    setPose(world.space.shooter, {
      leftArm: [-0.26 + Math.sin(localTime * 0.3) * 0.06, 0, 0.2],
      rightArm: [0.12 + Math.sin(localTime * 0.28) * 0.05, 0, -0.18],
      leftLeg: [0.15, 0, 0.1], rightLeg: [-0.2, 0, -0.1], head: [0, 0.12, 0],
    });
    if (localTime < 8) {
      setCamera(camera, lerp3([15, 8, 27], [10, 6, 18], ease(localTime / 8)), [0, 1.5, -4], 48, -0.04);
    } else {
      setCamera(camera, lerp3([-11, 6, 18], [-7.5, 4.8, 11.5], ease((localTime - 8) / 13)), [10, -6, -62], 42, 0.025);
    }
    title("一号基地外 · 等待", Math.min(1, localTime / 0.8) * Math.max(0, 1 - Math.max(0, localTime - 4.6) / 1.1));
    const oxygen = (11.7 - localTime / 3600).toFixed(1);
    telemetry(`SUIT  NOMINAL\nO₂  ${oxygen} h\nRANGE  10.0 km\nLOCATOR  —`, Math.min(0.78, localTime / 1.2));
  }),

  shot("09-photograph", 144, 157, "space", ({ time, localTime, progress }) => {
    vacuum(1.13);
    spaceContinuity(time);
    world.space.shooter.root.position.set(0, 0, 0);
    world.space.shooter.root.rotation.set(0, Math.PI, 0);
    world.space.shooterGun.visible = false;
    world.space.bullets.forEach((bullet) => { bullet.visible = false; });
    world.space.muzzle.visible = false;
    for (let i = 0; i < world.space.attendees.length; i += 1) {
      const rig = world.space.attendees[i];
      const base = rig.root.userData.base;
      const depart = Math.max(0, Math.min(1, (localTime - i * 0.075) / 4.2));
      const p = ease(depart);
      rig.root.position.set(
        THREE.MathUtils.lerp(0, base.x, p),
        THREE.MathUtils.lerp(-18, base.y, p) + Math.sin(localTime * 0.7 + i) * 0.07,
        THREE.MathUtils.lerp(-9, base.z, p),
      );
      rig.root.rotation.y = Math.PI;
      setPose(rig, {
        leftArm: [-0.14 + Math.sin(localTime + i) * 0.07, 0, 0.03],
        rightArm: [-0.1 + Math.cos(localTime * 0.9 + i) * 0.07, 0, -0.03],
        leftLeg: [0.08, 0, 0.03], rightLeg: [-0.1, 0, -0.03],
      });
    }
    if (localTime < 6) {
      setCamera(camera, lerp3([-24, 2, -132], [-15, 2, -136], ease(localTime / 6)), [0, -1, -153], 42, -0.015);
    } else {
      setCamera(camera, lerp3([17, 5, -135], [10, 4, -138], ease((localTime - 6) / 7)), [0, 0, -153], 38, 0.018);
    }
    title("黄河站 · 会后合影", Math.min(1, localTime / 0.8) * Math.max(0, 1 - Math.max(0, localTime - 4.7) / 1.1));
    telemetry("AIRLOCK  GREEN\nGROUP  30\nVISORS  CLEAR", Math.min(0.8, localTime / 1.4));
    veil(progress > 0.985 ? (progress - 0.985) / 0.015 * 0.18 : 0);
  }),

  shot("10-prepare", 157, 170, "space", ({ time, localTime, progress }) => {
    vacuum(1.08);
    spaceContinuity(time);
    resetAttendees();
    world.space.shooter.root.position.set(0, 0, 0);
    world.space.shooter.root.rotation.set(0, Math.PI, 0);
    world.space.shooterGun.visible = localTime >= 3.8;
    world.space.muzzle.visible = false;
    world.space.bullets.forEach((bullet) => { bullet.visible = false; });
    const ready = ease(Math.max(0, (localTime - 3.4) / 4.8));
    setPose(world.space.shooter, {
      rightArm: [THREE.MathUtils.lerp(-0.1, -1.48, ready), 0.04, THREE.MathUtils.lerp(-0.1, 0.06, ready)],
      leftArm: [THREE.MathUtils.lerp(-0.2, -1.38, ready), -0.04, THREE.MathUtils.lerp(0.12, -0.1, ready)],
      leftLeg: [0.16, 0, 0.08], rightLeg: [-0.18, 0, -0.08], head: [0, 0, 0],
    });
    if (localTime < 4.4) {
      setCamera(camera, lerp3([3.4, 4.8, 8.5], [2.3, 4.2, 6.3], ease(localTime / 4.4)), [0, 3.3, 0], 31);
    } else if (localTime < 8.7) {
      setCamera(camera, lerp3([4.7, 3.6, 5.5], [2.0, 3.15, 2.4], ease((localTime - 4.4) / 4.3)), [0, 3.0, -0.8], 26);
    } else {
      const p = ease((localTime - 8.7) / 4.3);
      setCamera(camera, lerp3([0.45, 3.45, 0.8], [0.2, 3.25, -0.2], p), [0, 0.2, -153], THREE.MathUtils.lerp(22, 12, p));
    }
    title("三个目标", Math.min(0.85, localTime / 0.7) * Math.max(0, 1 - Math.max(0, localTime - 3.2) / 0.9));
    telemetry(localTime > 8.5 ? "OPTIC  ×10\nVACUUM  TRUE\nGRAVITY  0.000 g\nRANGE  10,002 m" : "SUIT SEAL\nRIGHT GLOVE  OPEN", Math.min(0.86, localTime / 1));
    veil(progress > 0.985 ? 0.12 : 0);
  }),

  shot("11-fire", 170, 179, "space", ({ time, localTime }) => {
    vacuum(1.09);
    spaceContinuity(time);
    resetAttendees();
    world.space.shooterGun.visible = true;
    const flash = nearestPulse(time, fireTimes, 0.055);
    const fired = fireTimes.filter((value) => value <= time).length;
    world.space.muzzle.visible = flash > 0.04;
    world.space.muzzle.scale.set(1 + flash * 2.2, 1 + flash * 2.2, 1 + flash * 1.8);
    world.space.muzzle.material.emissiveIntensity = 4 + flash * 5;
    world.space.shooter.root.position.set(0, 0, fired * 0.028);
    world.space.shooter.root.rotation.set(0, Math.PI, -fired * 0.0015);
    setPose(world.space.shooter, {
      rightArm: [-1.48 + flash * 0.1, 0.04, 0.06], leftArm: [-1.38 + flash * 0.07, -0.04, -0.1],
      leftLeg: [0.18, 0, 0.08], rightLeg: [-0.2, 0, -0.08], head: [0, 0, flash * 0.02],
    });
    world.space.bullets.forEach((bullet, index) => {
      const age = time - fireTimes[index];
      bullet.visible = age >= 0 && age < 0.45;
      bullet.position.set((index % 3 - 1) * 0.018, 3.0 + (index % 2) * 0.012, -2.1 - Math.max(0, age) * 33);
    });
    const volley = fired < 10 ? "01" : fired < 20 ? "02" : "03";
    setCamera(camera, [4.0 + flash * 0.08, 3.8, 6.2 + fired * 0.025], [0, 2.7, -6], 31, -0.025 + fired * 0.0008);
    title("真空中没有枪声", Math.min(1, localTime / 0.7) * Math.max(0, 1 - Math.max(0, localTime - 3.4) / 1.0));
    telemetry(`VOLLEY  ${volley} / 03\nROUNDS  ${String(fired).padStart(2, "0")} / 30\nEXTERNAL AUDIO  —`, 0.86);
  }),

  shot("12-ten-seconds", 179, 191, "space", ({ time, localTime, progress }) => {
    vacuum(1.11);
    spaceContinuity(time);
    world.space.shooter.root.position.set(0, 0, 0);
    world.space.shooter.root.rotation.set(0, Math.PI, 0);
    resetAttendees();
    world.space.shooterGun.visible = true;
    world.space.muzzle.visible = false;
    const p = ease(progress);
    world.space.bullets.forEach((bullet, index) => {
      const laneX = ((index % 10) - 4.5) * 0.03;
      const laneY = (Math.floor(index / 10) - 1) * 0.04;
      bullet.visible = progress < 0.985;
      bullet.position.set(laneX * (1 + p * 6), 3 + laneY * (1 + p * 4), THREE.MathUtils.lerp(-4, -151.5, p));
      bullet.rotation.z = index * 0.4;
    });
    const cameraZ = THREE.MathUtils.lerp(-10, -140, ease(Math.min(1, progress * 0.94)));
    setCamera(camera, [0.6, 3.5, cameraZ], [0, 1, -153], THREE.MathUtils.lerp(38, 31, p), Math.sin(localTime * 0.4) * 0.005);
    const remaining = Math.max(0, 10 - Math.floor(progress * 10));
    title("十 秒", Math.min(0.75, localTime / 0.6) * Math.max(0, 1 - Math.max(0, localTime - 3.2) / 0.8));
    telemetry(`BALLISTIC  CLEAN\nDRAG  0\nTIME TO IMPACT  ${String(remaining).padStart(2, "0")}`, 0.88);
    veil(progress > 0.99 ? (progress - 0.99) / 0.01 * 0.25 : 0);
  }),

  shot("13-impact", 191, 205, "space", ({ time, localTime, progress }) => {
    vacuum(1.17);
    spaceContinuity(time);
    world.space.shooter.root.position.set(0, 0, 0);
    world.space.shooter.root.rotation.set(0, Math.PI, 0);
    world.space.bullets.forEach((bullet) => { bullet.visible = false; });
    world.space.muzzle.visible = false;
    const impactStarts = [0.4, 0.75, 1.05, 1.35, 1.65];
    world.space.impacted.forEach((rig, rigIndex) => {
      const impactP = ease(Math.max(0, Math.min(1, (localTime - impactStarts[rigIndex]) / 1.2)));
      const base = rig.root.userData.base;
      rig.root.position.set(base.x + (rigIndex - 2) * 0.12 * impactP, base.y + 0.45 * impactP, base.z + 0.32 * impactP);
      rig.root.rotation.set(impactP * (rigIndex % 2 ? -0.45 : 0.36), Math.PI, impactP * (rigIndex - 2) * 0.18);
      setPose(rig, { leftArm: [-0.5 * impactP, 0, 0.5], rightArm: [0.6 * impactP, 0, -0.45], leftLeg: [0.3, 0, 0.1], rightLeg: [-0.34, 0, -0.1], head: [0, 0.2 * impactP, 0] });
    });
    world.space.leaks.forEach((leak, leakIndex) => {
      const age = Math.max(0, localTime - impactStarts[leakIndex]);
      leak.children.forEach((piece, index) => {
        const seed = piece.userData.seed;
        const delay = index * 0.035;
        const flight = Math.max(0, age - delay);
        piece.visible = flight > 0 && flight < 8;
        piece.position.set(
          (seed[0] - 0.35) * flight * 1.6,
          (seed[1] - 0.5) * flight * 1.05,
          flight * (0.55 + seed[2] * 1.3),
        );
        piece.scale.setScalar(1 + flight * 0.05);
      });
    });
    for (const rig of world.space.attendees) {
      if (world.space.impacted.includes(rig)) continue;
      const base = rig.root.userData.base;
      const flee = ease(Math.max(0, Math.min(1, (localTime - 5.0 - rig.root.userData.row * 0.4 - rig.root.userData.col * 0.025) / 5.8)));
      rig.root.position.set(THREE.MathUtils.lerp(base.x, 0, flee), THREE.MathUtils.lerp(base.y, -18, flee), THREE.MathUtils.lerp(base.z, -9, flee));
      rig.root.rotation.z = flee * (rig.root.userData.col % 2 ? 0.22 : -0.22);
      setPose(rig, { leftArm: [-0.8 * flee, 0, 0.3], rightArm: [-0.9 * flee, 0, -0.3], leftLeg: [0.3, 0, 0.1], rightLeg: [-0.3, 0, -0.1] });
    }
    if (localTime < 5.2) {
      setCamera(camera, lerp3([0, 2, -135], [4, 2.5, -138], ease(localTime / 5.2)), [0, 0, -153], 36, -0.01);
    } else {
      setCamera(camera, lerp3([10, 5, -137], [-12, 3, -135], ease((localTime - 5.2) / 8.8)), [0, -2, -153], 43, 0.02);
    }
    title("陨 石 雨", Math.min(0.9, Math.max(0, (localTime - 3.6) / 0.5)) * Math.max(0, 1 - Math.max(0, localTime - 7) / 1));
    telemetry(localTime > 3.3 ? "SUIT PRESSURE  ↓\nCASUALTIES  05\nAIRLOCK  RECALL" : "IMPACT  //  UNKNOWN", 0.88);
    veil(progress > 0.98 ? (progress - 0.98) / 0.02 * 0.22 : 0);
  }),

  shot("14-return", 205, 220, "space", ({ time, localTime, progress }) => {
    vacuum(1.03);
    spaceContinuity(time);
    world.space.bullets.forEach((bullet) => { bullet.visible = false; });
    world.space.muzzle.visible = false;
    world.space.shooterGun.visible = true;
    const p = ease(progress);
    world.space.shooter.root.position.set(THREE.MathUtils.lerp(0, -38, p), THREE.MathUtils.lerp(0, 10, p), THREE.MathUtils.lerp(0, -76, p));
    world.space.shooter.root.rotation.set(0.08, THREE.MathUtils.lerp(Math.PI, Math.PI * 1.32, p), THREE.MathUtils.lerp(0, -0.35, p));
    setPose(world.space.shooter, { leftArm: [-0.05, 0, 0.2], rightArm: [0.2, 0, -0.15], leftLeg: [0.2, 0, 0.1], rightLeg: [-0.22, 0, -0.1], head: [0, -0.12, 0] });
    world.space.leaks.forEach((leak) => leak.children.forEach((piece) => { piece.visible = false; }));
    const shooterPos = world.space.shooter.root.position;
    setCamera(camera, [shooterPos.x + 9, shooterPos.y + 5, shooterPos.z + 17], [shooterPos.x - 4, shooterPos.y + 1, shooterPos.z - 12], 45, -0.035);
    title("返航 · 一号基地", Math.min(1, localTime / 0.8) * Math.max(0, 1 - Math.max(0, localTime - 4.5) / 1.2));
    telemetry(`THRUST  100%\nBASE RANGE  ${(80 - p * 42).toFixed(1)} km\nHEART RATE  62`, Math.min(0.8, localTime / 1));
    veil(progress > 0.95 ? (progress - 0.95) / 0.05 : 0);
  }),

  shot("15-end", 220, 228, "space", ({ time, localTime, progress }) => {
    vacuum(0.76);
    spaceContinuity(time);
    world.space.bullets.forEach((bullet) => { bullet.visible = false; });
    world.space.muzzle.visible = false;
    world.space.shooterGun.visible = false;
    world.space.shooter.root.position.set(-52 - localTime * 1.4, 15 + localTime * 0.2, -102 - localTime * 1.1);
    world.space.shooter.root.scale.setScalar(1.12 * (1 - progress * 0.35));
    world.space.earth.rotation.y = 0.84 + localTime * 0.004;
    setCamera(camera, lerp3([20, 6, -12], [25, 8, -20], ease(progress)), [68, -45, -220], 49);
    telemetry("", 0);
    title("", 0);
    veil(localTime < 1.5 ? 1 - localTime / 1.5 : Math.max(0, (localTime - 7.4) / 0.6));
    if (localTime > 1.35) {
      endCard.classList.add("visible");
      endCard.setAttribute("aria-hidden", "false");
      endCard.style.opacity = String(Math.min(1, (localTime - 1.35) / 1.25) * Math.min(1, (8 - localTime) / 0.7));
    }
  }),
];

const player = new CinematicPlayer({
  duration: DURATION,
  context,
  shots,
  cues: [...voiceCues, ...soundCues],
  loop: false,
});

const audio = registerAudioDesign(new WebAudioCueBus(player));
const stage = new ThreeStage({
  player,
  renderer,
  scene,
  camera: () => camera,
  container: stageContainer,
  maxPixelRatio: 1.7,
});
const controls = mountCinematicControls({ player, audio, container: app, showFullscreen: true });

async function begin() {
  await audio.unlock();
  audio.setMasterGain(0.8);
  audio.setGroupGain("score", 0.82);
  audio.setGroupGain("ambience", 0.78);
  audio.setGroupGain("sfx", 0.92);
  audio.setGroupGain("suit", 0.9);
  audio.setGroupGain("radio", 0.72);
  startButton.classList.add("hidden");
  player.play();
}

startButton.addEventListener("click", () => void begin(), { once: true });

window.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
  event.preventDefault();
  if (!startButton.classList.contains("hidden")) void begin();
  else if (player.isPlaying) player.pause();
  else player.play();
});

player.addTypedEventListener("statechange", ({ detail }) => {
  if (detail.state === "ended") controls.root.classList.add("film-ended");
  else controls.root.classList.remove("film-ended");
});

// A small inspection surface for deterministic timeline checks in browser tooling.
window.__CINEMATIC__ = { player, audio, stage, world, voiceCues, soundCues, duration: DURATION };
