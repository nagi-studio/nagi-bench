import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import type { Ctx } from "./context";
import { useSet, resetFX } from "./context";
import type { World } from "./world";
import { makeBlocking, eyeWorld, headWorld, handWorld, chestWorld } from "./blocking";
import { seg, sseg, eseg, mix, v3, setFov, worldPos } from "./util";
import { HATCH, EARTH_CENTER, BASE1, earthDir, sunDirection } from "./space";
import { SHOT_TIMES, TEST_SHOTS } from "./cues";

const PI = Math.PI;
type SetName = "space" | "hutong" | "room" | "workshop" | "basement" | "cabin";

export function buildShots(W: World): { shots: Shot<Ctx>[]; B: ReturnType<typeof makeBlocking> } {
  const B = makeBlocking(W);
  const ctx = W.ctx;
  const cam = ctx.camera;
  const fx = ctx.fx;
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();

  const states: Record<SetName, (t: number) => void> = {
    space: B.spaceState,
    hutong: B.hutongState,
    room: B.roomState,
    workshop: B.workshopState,
    basement: B.basementState,
    cabin: B.cabinState,
  };
  const particlesFor: Record<SetName, Array<{ update(t: number): void; setViewportHeight(h: number, f: number): void }>> = {
    space: [W.gas, W.ice, W.blood],
    hutong: [],
    room: [],
    workshop: [W.sparks],
    basement: [W.smoke, W.dust],
    cabin: [],
  };

  function look(pos: THREE.Vector3, target: THREE.Vector3, fov: number, roll = 0) {
    cam.position.copy(pos);
    cam.up.set(Math.sin(roll), Math.cos(roll), 0);
    cam.lookAt(target);
    setFov(cam, fov);
  }
  function shake(t: number, amt: number) {
    if (amt <= 0) return;
    cam.rotateX((Math.sin(t * 97) * 0.6 + Math.sin(t * 61) * 0.4) * amt);
    cam.rotateY((Math.sin(t * 83 + 1) * 0.6 + Math.sin(t * 47) * 0.4) * amt);
  }
  function drift(t: number, amt = 1) {
    cam.rotateX((Math.sin(t * 0.9) * 0.0025 + Math.sin(t * 2.1 + 1) * 0.001) * amt);
    cam.rotateY((Math.sin(t * 0.7 + 2) * 0.003 + Math.sin(t * 1.7) * 0.001) * amt);
  }
  /** Orient along a direction, then slide the camera so `subject` lands at an NDC position. */
  function framed(dir: THREE.Vector3, subject: THREE.Vector3, ndcX: number, ndcY: number, dist: number, fov: number) {
    setFov(cam, fov);
    cam.up.set(0, 1, 0);
    cam.position.set(0, 0, 0);
    cam.lookAt(dir);
    const tanV = Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const ray = v3(ndcX * tanV * cam.aspect, ndcY * tanV, -1).normalize().applyQuaternion(cam.quaternion);
    cam.position.copy(subject).addScaledVector(ray, -dist);
  }
  const kick = (t: number, times: number[], decay: number) => {
    let k = 0;
    for (const s of times) if (t >= s) k += Math.exp(-(t - s) * decay);
    return k;
  };

  const shots: Shot<Ctx>[] = [];
  function cut(id: string, start: number, end: number, set: SetName, camFn: (t: number, p: number, l: number) => void) {
    shots.push({
      id,
      start,
      end,
      update: ({ time, progress, localTime }) => {
        resetFX(fx);
        B.resetProps();
        useSet(ctx, set);
        states[set](time);
        camFn(time, progress, localTime);
        cam.updateMatrixWorld();
        const h = ctx.renderer.domElement.height || 720;
        for (const p of particlesFor[set]) { p.setViewportHeight(h, cam.fov); p.update(time); }
        fx.time = time;
      },
    });
  }

  const Z = W.zhang.fig;
  const C = W.collector.fig;
  const targets = W.crowd.filter((m) => m.target);
  const targetHead = (i: number, t: number) => B.crowdPos(targets[i]!, t, new THREE.Vector3()).add(v3(0, 1.5, 0.1));
  const sunDirAt = (off: number) => sunDirection(off, new THREE.Vector3());

  /** Figure-relative coverage: yaw 0 = straight in front, positive = toward the figure's left. */
  const LB = 0.744; // visible fraction of the frame height under the 2.39:1 bars at 16:9
  function cover(fig: typeof W.zhang.fig, yawDeg: number, frameH: number, fov: number, o: { dy?: number; lookDy?: number; ndcX?: number; level?: boolean; side?: number } = {}) {
    const head = headWorld(fig, new THREE.Vector3());
    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(fig.joints.neck.getWorldQuaternion(new THREE.Quaternion()));
    if (o.level !== false) { fwd.y = 0; fwd.normalize(); }
    fwd.applyAxisAngle(v3(0, 1, 0), THREE.MathUtils.degToRad(yawDeg));
    const dist = frameH / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * LB);
    const pos = head.clone().addScaledVector(fwd, dist).add(v3(0, o.dy ?? 0.04, 0));
    if (o.side) pos.add(v3(fwd.z, 0, -fwd.x).multiplyScalar(o.side));
    look(pos, head.clone().add(v3(0, o.lookDy ?? -0.06, 0)), fov);
    if (o.ndcX) cam.rotateY(Math.atan(o.ndcX * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * cam.aspect));
  }
  /** Over the shoulder of `fig`, looking at a world point. */
  function ots(fig: typeof W.zhang.fig, target: THREE.Vector3, back: number, side: number, up: number, fov: number) {
    const head = headWorld(fig, new THREE.Vector3());
    const dir = target.clone().sub(head);
    dir.y = 0;
    dir.normalize();
    const right = v3(-dir.z, 0, dir.x);
    const pos = head.clone().addScaledVector(dir, -back).addScaledVector(right, side).add(v3(0, up, 0));
    look(pos, target, fov);
  }
  const hideZhang = () => { W.zhang.fig.root.visible = false; };

  /* ============================== COLD OPEN ============================== */
  cut("c01-void", 0, 19, "space", (t, p) => {
    const dir = sunDirAt(5.2).applyAxisAngle(v3(0, 1, 0), -0.16);
    framed(dir, v3(0, 0.95, 0), 0.4, 0.16, mix(34, 21, eseg(t, 0, 19)), 30);
    drift(t, 0.6);
    fx.fade = 1 - sseg(t, 2.2, 6.5);
    fx.vignette = 0.55;
    fx.bloom = 0.85;
    void p;
  });
  cut("c02-visor", 19, 29, "space", (t, p) => {
    cover(Z, mix(24, 30, p), 0.78, 30, { dy: 0.06, lookDy: -0.03, ndcX: 0.18, level: false });
    drift(t, 0.8);
    fx.vignette = 0.6;
    fx.bloom = 0.7;
  });
  cut("c03-scope-closed", 29, 37, "space", (t) => {
    const eye = eyeWorld(Z);
    hideZhang();
    look(eye, v3(0.6, 0.8, HATCH.z), 1.25);
    drift(t, 0.25);
    fx.scope = 1;
    fx.fade = sseg(t, 35.8, 37);
  });
  cut("c04-title", 37, 45, "space", () => {
    look(v3(0, 0, 0), v3(0, 0, -1), 40);
    fx.fade = 1;
  });

  /* ============================== HUTONG ============================== */
  cut("c05-hutong-approach", 45, 51, "hutong", (t) => {
    const h = headWorld(Z);
    look(v3(-1.5, 0.5, -3.4), tmp.copy(h).add(v3(0.2, -0.15, 0)), 40);
    fx.fade = 1 - sseg(t, 45, 46.6);
    fx.tint.set(1.02, 0.98, 1.0);
  });
  cut("c06-hutong-gate", 51, 56, "hutong", (t) => {
    const h = headWorld(Z);
    look(v3(-2.2, 1.35, -4.9), tmp.copy(h).lerp(v3(2.4, 1.45, -9.4), 0.45), 38);
    fx.fade = sseg(t, 55.3, 56);
  });

  /* ============================== COLLECTOR'S ROOM ============================== */
  cut("c07-room-reveal", 56, 62.5, "room", (t, p) => {
    const h = headWorld(Z);
    look(v3(mix(0.4, -0.2, eseg(t, 56, 62.5)), 1.75, mix(3.1, 2.7, p)), tmp.copy(v3(1.8, 1.2, -0.6)).lerp(h, 0.35 * sseg(t, 59, 62)), 50);
    fx.fade = 1 - sseg(t, 56, 57.2);
  });
  cut("c08-cabinet-face", 62.5, 66.8, "room", (t) => {
    cover(Z, 35, 0.85, 32, { dy: 0.0, ndcX: -0.25 });
    drift(t);
  });
  cut("c08b-cabinet-ots", 66.8, 71.3, "room", (t) => {
    const k = sseg(t, 69.4, 71.2);
    if (k < 0.01) look(v3(-2.2, 1.68, 2.45), v3(-2.85, 1.3, 0.55), 40);
    else look(v3(mix(-1.8, 0.0, k), mix(1.75, 1.45, k), mix(1.9, 3.2, k)), headWorld(Z, tmp).lerp(v3(0, 0.95, 0.8), k), mix(36, 40, k));
  });
  cut("c09-tea-two", 71.3, 76.7, "room", (t) => {
    look(v3(0.05, 1.5, 3.95), v3(0, 1.0, 0.75), 38);
    drift(t);
  });
  cut("c10-ots-collector", 76.7, 82.0, "room", (t) => {
    ots(Z, headWorld(C, tmp).add(v3(0, -0.08, 0)), 0.95, -0.6, 0.12, 30);
    drift(t);
  });
  cut("c11-collector-mcu", 82.0, 92.7, "room", (t, p) => {
    cover(C, mix(-28, -22, p), mix(0.95, 0.72, p), 30, { ndcX: -0.2 });
    drift(t);
  });
  cut("c12-zhang-mcu", 92.7, 101.0, "room", (t, p) => {
    cover(Z, mix(28, 24, p), mix(0.95, 0.8, p), 30, { ndcX: 0.2, lookDy: -0.1 });
    drift(t);
  });
  cut("c13-laugh-two", 101.0, 105.0, "room", (t) => {
    look(v3(0.5, 1.6, 3.9), v3(0.25, 1.0, 0.8), 40);
    drift(t);
  });
  cut("c14-safe", 105.0, 108.6, "room", (t) => {
    look(v3(2.05, 0.98, 2.05), v3(2.95, 0.4, 1.0), 40);
    drift(t);
  });
  cut("c15-microscope", 108.6, 112.2, "room", (t, p) => {
    const s = worldPos(W.room.marsStone);
    look(tmp.copy(s).add(v3(0.004, 0.06, 0.012)), tmp2.copy(s).add(v3(0.002 * Math.sin(t), 0, 0.002)), mix(26, 18, p), t * 0.05);
    fx.scope = 1;
    fx.reticle = 0;
    fx.tint.set(1.05, 1.0, 0.92);
    fx.vignette = 0.2;
  });
  cut("c16-zhang-spec", 112.2, 116.5, "room", (t) => {
    cover(Z, 22, 0.75, 28, { ndcX: 0.22 });
    drift(t);
  });
  cut("c17-collector-guess", 116.5, 120.4, "room", (t) => {
    const h = headWorld(C);
    look(v3(1.7, 1.6, 2.9), tmp.copy(h).add(v3(0, -0.2, 0)), 38);
    drift(t);
  });
  cut("c18-cabinet-iron", 120.4, 125.4, "room", (t) => {
    const h = headWorld(C);
    const hand = handWorld(C, "handR");
    look(v3(-0.3, 1.55, 0.2), tmp.copy(h).lerp(hand, 0.4), 38);
    drift(t);
  });
  cut("c19-zhang-three", 125.4, 127.6, "room", (t) => {
    cover(Z, 18, 0.6, 26, { ndcX: 0.15 });
    drift(t);
  });
  cut("c20-irons-macro", 127.6, 135.2, "room", (t, p) => {
    look(v3(mix(-0.6, -0.05, p), mix(0.8, 0.74, p), mix(1.05, 0.98, p)), v3(mix(-0.4, -0.15, p), 0.6, 0.64), 26);
    drift(t, 0.4);
    fx.vignette = 0.6;
  });
  cut("c21-price", 135.2, 139.6, "room", (t) => {
    cover(C, -24, 0.8, 28, { ndcX: -0.2 });
    drift(t);
  });
  cut("c22-pay", 139.6, 142.4, "room", (t) => {
    cover(Z, 30, 0.95, 30, { ndcX: 0.18, lookDy: -0.16 });
    drift(t);
  });
  cut("c23-pendulum", 142.4, 143.6, "room", () => {
    look(v3(-2.55, 1.72, 1.3), v3(-3.16, 1.68, 1.35), 30);
  });
  cut("c24-awkward", 143.6, 148.8, "room", (t, p) => {
    cover(C, -22, mix(0.8, 0.66, p), 26, { ndcX: -0.18 });
    drift(t);
  });
  cut("c25-accept", 148.8, 150.6, "room", (t) => {
    cover(Z, 26, 0.75, 26, { ndcX: 0.2 });
    drift(t);
  });
  cut("c26-backpedal", 150.6, 153.4, "room", (t) => {
    ots(Z, headWorld(C, tmp).add(v3(0, -0.08, 0)), 0.95, -0.6, 0.12, 30);
    drift(t);
  });
  cut("c27-respect", 153.4, 158.2, "room", (t, p) => {
    cover(Z, mix(14, 6, p), mix(0.7, 0.5, eseg(t, 153.4, 158.2)), 24, { ndcX: 0.1, lookDy: -0.03 });
    drift(t, 0.5);
    fx.vignette = 0.5 + 0.2 * p;
    fx.fade = sseg(t, 157.6, 158.2);
  });

  /* ============================== EXIT ============================== */
  cut("c28-exit", 158.2, 163, "hutong", (t) => {
    look(v3(-0.6, 1.25, -3.6), v3(0.8, 1.25, -14), 40);
    fx.fade = Math.max(1 - sseg(t, 158.2, 158.9), sseg(t, 162.2, 163));
    fx.tint.set(0.75, 0.82, 1.0);
    W.hutong.lanterns.forEach((l) => (l.intensity *= t > 160.9 ? 0.35 : 1));
  });

  /* ============================== WORKSHOP ============================== */
  cut("c29-workshop-wide", 163, 167.2, "workshop", (t) => {
    look(v3(3.4, 2.3, 4.0), v3(0.0, 1.0, 0.1), 40);
    fx.fade = 1 - sseg(t, 163, 163.4);
  });
  cut("c30-chuck", 167.2, 171.2, "workshop", (t) => {
    look(v3(0.35, 1.5, 0.62), v3(-0.42, 1.24, 0.0), 40);
    drift(t, 0.5);
  });
  cut("c31-face", 171.2, 175.0, "workshop", (t) => {
    cover(Z, 28, 0.75, 30, { dy: -0.05, ndcX: 0.2 });
    drift(t);
    fx.tint.set(0.92, 0.98, 1.08);
  });
  cut("c32-tray", 175.0, 179.4, "workshop", (t) => {
    cam.up.set(0, 0, -1);
    cam.position.set(2.245, 1.32, 0.9);
    cam.lookAt(2.245, 0.92, 0.9);
    setFov(cam, 30);
    drift(t, 0.3);
  });
  cut("c33-cutter", 179.4, 182.6, "workshop", (t) => {
    look(v3(0.95, 1.55, 0.45), v3(-0.25, 1.15, 0.25), 38);
    drift(t);
  });
  cut("c34-dark", 182.6, 185.0, "workshop", (t) => {
    look(v3(-3.0, 1.9, 3.8), v3(0, 1.0, 0.2), 42);
    fx.fade = sseg(t, 184.2, 185);
  });

  /* ============================== BASEMENT ============================== */
  cut("c35-basement", 185, 189.4, "basement", (t) => {
    look(v3(1.55, 2.0, 1.55), v3(-0.3, 0.9, 0.0), 52);
    fx.fade = 1 - sseg(t, 185, 186);
  });
  cut("c36-rounds", 189.4, 194.6, "basement", (t, p) => {
    look(v3(mix(-0.05, -0.2, p), 1.02, -0.62), v3(-0.2, 0.8, -0.05), 36);
    drift(t, 0.4);
  });
  cut("c37-face-bulb", 194.6, 197.6, "basement", (t) => {
    cover(Z, 25, 0.75, 32, { dy: 0.12, ndcX: 0.2 });
    drift(t);
  });
  cut("c38-meteor-rounds", 197.6, 200.2, "basement", (t, p) => {
    look(v3(mix(-0.32, -0.02, p), 0.84, 0.03), v3(-0.17, 0.775, -0.12), 22);
  });
  cut("c39-load", 200.2, 203.5, "basement", (t) => {
    look(v3(-0.05, 1.08, -0.55), tmp.copy(handWorld(Z, "handL")).lerp(handWorld(Z, "handR"), 0.4), 36);
    drift(t);
  });
  cut("c40-test-fire", 203.5, 207.4, "basement", (t) => {
    look(v3(-0.1, 1.45, 1.75), v3(0.15, 0.95, -0.4), 54);
    const k = kick(t, TEST_SHOTS, 18);
    shake(t, 0.012 * k);
    fx.flash = 0.35 * kick(t, TEST_SHOTS, 40);
  });
  cut("c41-tinnitus", 207.4, 211.0, "basement", (t, p) => {
    cover(Z, mix(30, 20, p), mix(0.85, 0.62, p), 32, { ndcX: 0.15 });
    drift(t, 1.5);
    fx.sat = 0.55;
    fx.vignette = 0.75;
  });
  cut("c42-holes", 211.0, 214.2, "basement", (t) => {
    look(v3(0.85, 0.98, -0.62), v3(1.45, 0.78, -1.3), 30);
    drift(t);
    fx.sat = mix(0.55, 1, seg(t, 211, 214));
  });
  cut("c43-cut-open", 214.2, 217.8, "basement", (t) => {
    look(v3(2.0, 1.65, -0.45), v3(1.45, 0.75, -1.3), 44);
    drift(t);
  });
  cut("c44-palm", 217.8, 223.8, "basement", (t, p) => {
    const hl = handWorld(Z, "handL", tmp);
    look(tmp2.copy(hl).add(v3(mix(0.16, 0.1, p), mix(0.42, 0.34, p), mix(-0.5, -0.4, p))), tmp.copy(hl).add(v3(0, 0.03, 0)), 34);
    drift(t, 0.5);
    fx.vignette = 0.6;
  });
  cut("c45-pack", 223.8, 226, "basement", (t) => {
    look(v3(1.2, 1.8, 1.4), v3(-0.45, 0.8, 0.0), 44);
    fx.fade = sseg(t, 225.2, 226);
  });

  /* ============================== BASE ONE ============================== */
  cut("c46-cabin", 226, 231.4, "cabin", (t) => {
    const h = headWorld(Z);
    look(v3(0.3, 1.55, 1.5), tmp.copy(h).lerp(v3(-1.0, 1.3, -1.2), 0.45), 50);
    fx.fade = 1 - sseg(t, 226, 226.8);
    drift(t);
  });
  cut("c47-locator", 231.4, 234, "cabin", () => {
    look(v3(-0.55, 1.38, -0.72), v3(-0.95, 1.33, -1.22), 30);
  });

  /* ============================== ORBIT ============================== */
  cut("c48-establish", 234, 241, "space", (t, p) => {
    const pos = v3(mix(-300, -200, p), mix(190, 140, p), mix(-1950, -1750, p));
    const toHub = v3(0, 0, -1215).sub(pos).normalize();
    const toEarth = EARTH_CENTER.clone().sub(pos).normalize();
    look(pos, pos.clone().add(toHub.add(toEarth.multiplyScalar(0.9))), 52);
    drift(t, 0.3);
    fx.bloom = 0.8;
  });
  cut("c49-arrive", 241, 248, "space", (t) => {
    const h = headWorld(Z);
    look(v3(-2.6, 2.4, -8.5), tmp.copy(h).add(v3(0, -0.4, 0)), 36);
    drift(t);
  });
  cut("c50-sun-ring", 248, 252.2, "space", (t, p) => {
    const h = headWorld(Z);
    look(v3(mix(0.9, 0.75, p), 2.1, -3.4), tmp.copy(h).add(v3(0.25, 0.05, 2)), 34);
    drift(t);
    fx.bloom = 1.0;
  });
  cut("c51-scope-hatch", 252.2, 258.6, "space", (t) => {
    const eye = eyeWorld(Z);
    hideZhang();
    look(eye, v3(0.5, 0.6, HATCH.z + 2), 1.2);
    drift(t, 0.25);
    fx.scope = 1;
  });
  cut("c52-emerge", 258.6, 266, "space", (t, p) => {
    look(v3(2.2, 1.2, 3), v3(0.2, 0.6, HATCH.z + mix(14, 20, p)), 2.4);
    drift(t, 0.15);
  });
  cut("c53-sunset", 266, 270, "space", (t, p) => {
    const dir = sunDirAt(3.5).applyAxisAngle(v3(0, 1, 0), 0.12);
    framed(dir, v3(0, 1.0, 0), -0.45, -0.05, mix(9, 8, p), 36);
    drift(t, 0.5);
    fx.bloom = 0.95;
  });
  cut("c54-visors", 270, 274.2, "space", (t) => {
    look(v3(1.4, 1.4, 2.2), v3(0, 0.75, HATCH.z + 25.6), 0.62);
    drift(t, 0.1);
  });
  cut("c55-scope-faces", 274.2, 278, "space", (t) => {
    const eye = eyeWorld(Z);
    hideZhang();
    const sweep = eseg(t, 274.2, 277.2);
    const aimAt = targetHead(0, t).lerp(targetHead(1, t), sweep);
    look(eye, aimAt, mix(0.62, 0.2, eseg(t, 274.2, 276.6)));
    drift(t, 0.04);
    fx.scope = 1;
  });
  cut("c56-release", 278, 280.2, "space", (t) => {
    cover(Z, 32, 0.9, 32, { level: false, ndcX: 0.15 });
    drift(t);
  });
  cut("c57-glove", 280.2, 282.4, "space", (t) => {
    cover(Z, 40, 1.35, 32, { level: false, lookDy: -0.32, ndcX: 0.1 });
    drift(t);
  });
  cut("c58-bare-hand", 282.4, 285.6, "space", (t) => {
    cover(Z, -55, 1.5, 34, { level: false, lookDy: -0.3 });
    drift(t);
  });
  cut("c59-mount", 285.6, 290.6, "space", (t) => {
    cover(Z, 32, 1.05, 30, { level: false, lookDy: -0.38 });
    drift(t);
    fx.flash = 0.04 * kick(t, [288.2], 12);
  });
  cut("c60-eyes", 290.6, 294.4, "space", (t, p) => {
    cover(Z, 8, mix(0.62, 0.5, p), 24, { level: false, lookDy: -0.02 });
    drift(t, 0.6);
    fx.vignette = 0.6;
  });
  cut("c61-fire-a", 294.4, 298.8, "space", (t) => {
    const eye = eyeWorld(Z);
    hideZhang();
    const k = kick(t, SHOT_TIMES, 14);
    look(eye, targetHead(0, t).add(v3(0, -0.15, 0)), 0.3);
    cam.rotateX(0.0012 * k);
    drift(t, 0.03);
    fx.scope = 1;
    fx.flash = 0.18 * kick(t, SHOT_TIMES, 45);
  });
  cut("c62-firefly", 298.8, 303.0, "space", (t) => {
    look(v3(0.8, 3.75, HATCH.z + 12), v3(0, 0.9, 0), 6);
    drift(t, 0.06);
    W.flashSprite.scale.setScalar(2 + kick(t, SHOT_TIMES, 16) * 90);
  });
  cut("c63-profile-fire", 303.0, 306.6, "space", (t) => {
    cover(Z, 48, 1.2, 34, { level: false, ndcX: -0.12 });
    shake(t, 0.004 * kick(t, SHOT_TIMES, 18));
    fx.flash = 0.06 * kick(t, SHOT_TIMES, 45);
  });
  cut("c64-empty", 306.6, 308.4, "space", (t) => {
    cover(Z, 40, 1.5, 34, { level: false, ndcX: -0.15 });
    drift(t);
  });
  cut("c65-bullet", 308.4, 313.2, "space", (t) => {
    const b = W.bullets[10]!;
    const dir = tmp2.set(0, 0, 1).applyQuaternion(b.quaternion);
    const pos = tmp.copy(b.position).addScaledVector(dir, -0.11).add(v3(0.025, 0.018, 0));
    look(pos, b.position.clone().addScaledVector(dir, 0.6), 34, Math.sin(t * 0.3) * 0.05);
    fx.bloom = 0.7;
  });
  cut("c66-unaware", 313.2, 317.2, "space", (t) => {
    look(v3(2.2, 1.0, 2.8), v3(0.0, 0.5, HATCH.z + 25.5), 0.8);
    drift(t, 0.06);
  });
  cut("c67-wait", 317.2, 319.6, "space", (t) => {
    cover(Z, 4, 0.5, 20, { level: false, lookDy: -0.02 });
    drift(t, 0.4);
    fx.vignette = 0.7;
  });
  cut("c68-scope-drift", 319.6, 322.0, "space", (t) => {
    const eye = eyeWorld(Z);
    hideZhang();
    const aimAt = B.crowdPos(targets[1]!, 319.6, new THREE.Vector3()).add(v3(0, 1.35, 0.1));
    look(eye, aimAt, 0.24);
    drift(t, 0.02);
    fx.scope = 1;
  });
  cut("c69-impact-scope", 322.0, 325.2, "space", (t) => {
    const eye = eyeWorld(Z);
    hideZhang();
    look(eye, v3(0, 0.6, HATCH.z + 25.4), 0.5);
    drift(t, 0.03);
    fx.scope = 1;
  });
  cut("c70-panic", 325.2, 328.0, "space", (t) => {
    look(v3(2.0, 1.3, 2.4), v3(0.2, 0.5, HATCH.z + 25), 0.95);
    drift(t, 0.08);
  });
  cut("c71-visor", 328.0, 331.2, "space", (t, p) => {
    const head = headWorld(B.centre.actor.fig, new THREE.Vector3());
    look(tmp2.copy(head).add(v3(-0.1, 0.18, mix(1.25, 1.1, p))), head, 50);
    drift(t, 0.4);
  });
  cut("c72-five", 331.2, 334.2, "space", (t) => {
    look(v3(1.8, 1.2, 2.6), v3(0.0, 0.5, HATCH.z + 24.5), 1.35);
    drift(t, 0.1);
  });
  cut("c73-retreat", 334.2, 339.2, "space", (t) => {
    look(v3(2.2, 1.4, 3.0), v3(0.3, 0.5, HATCH.z + 13), 2.8);
    drift(t, 0.1);
  });
  cut("c74-hatch-close", 339.2, 342, "space", (t) => {
    const eye = eyeWorld(Z);
    hideZhang();
    look(eye, v3(0.5, 0.6, HATCH.z + 2), 1.2);
    drift(t, 0.1);
    fx.scope = 1;
  });
  cut("c75-depart", 342, 347, "space", (t) => {
    const mid = BASE1.clone().normalize().add(earthDir.clone().multiplyScalar(0.55)).normalize();
    look(v3(1.4, 1.7, -2.4), v3(0, 1.0, 0).addScaledVector(mid, 40), 48);
    drift(t);
  });
  cut("c76-alone", 347, 353, "space", (t, p) => {
    const z = B.zhangDepart(t, new THREE.Vector3());
    look(tmp.copy(z).add(v3(-60, 30, -40)).lerp(v3(-40, 20, -60), p), tmp2.copy(z).lerp(EARTH_CENTER, 0.08), 50);
    drift(t, 0.4);
    fx.fade = sseg(t, 351.6, 353);
  });
  cut("c77-end", 353, 358, "space", () => {
    look(v3(0, 0, 0), v3(0, 0, -1), 40);
    fx.fade = 1;
  });

  return { shots, B };
}
