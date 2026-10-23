//
//  三维呈现: 所有可动部件的网格都逐帧从物理引擎读取位姿(不做任何手写动画)
//
import * as THREE from "three";
import { L } from "./machine.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const Q = (b) => new THREE.Quaternion(b.rotation().x, b.rotation().y, b.rotation().z, b.rotation().w);

/* 材质库 */
const M = {
  wood:  new THREE.MeshStandardMaterial({ color: 0x6d4a2f, roughness: .82, metalness: .05 }),
  wood2: new THREE.MeshStandardMaterial({ color: 0x8a6238, roughness: .78, metalness: .05 }),
  bronze:new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: .42, metalness: .78 }),
  bronzeD:new THREE.MeshStandardMaterial({ color: 0x7c6035, roughness: .5, metalness: .72 }),
  iron:  new THREE.MeshStandardMaterial({ color: 0x4a4a50, roughness: .55, metalness: .62 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x43474e, roughness: .95 }),
  water: new THREE.MeshStandardMaterial({ color: 0x2a6b8f, roughness: .18, metalness: .1,
          transparent: true, opacity: .72 }),
  waterDeep: new THREE.MeshStandardMaterial({ color: 0x143c55, roughness: .25,
          transparent: true, opacity: .85 }),
  gold:  new THREE.MeshStandardMaterial({ color: 0xe8c377, roughness: .3, metalness: .9 }),
  tile:  new THREE.MeshStandardMaterial({ color: 0x2d3f52, roughness: .6, metalness: .25 }),
  bag:   new THREE.MeshStandardMaterial({ color: 0xc9a86a, roughness: .7, metalness: .1 }),
  dial:  new THREE.MeshStandardMaterial({ color: 0x123047, roughness: .45, metalness: .35 }),
};

function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export class Scene3D {
  constructor(container) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1018);
    this.scene.fog = new THREE.Fog(0x0c1420, 70, 190);

    this.camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 400);

    /* ---------- 灯光 ---------- */
    const sun = new THREE.DirectionalLight(0xffe3b8, 3.1);
    sun.position.set(18, 30, 16);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -26; sun.shadow.camera.right = 26;
    sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -6;
    sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.0006;
    this.scene.add(sun);
    this.scene.add(new THREE.HemisphereLight(0x6d93bd, 0x33261a, 1.55));
    const fill = new THREE.DirectionalLight(0xcfe2f5, .85);
    fill.position.set(-6, 14, 26);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0x7fb0e0, 1.1);
    rim.position.set(-14, 10, -18);
    this.scene.add(rim);

    this.buildStatic();
    this.buildDynamic();
    buildParticles(this);

    addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }

  /* ================ 静态布景 ================ */
  buildStatic() {
    const g = this.scene;
    // 地面
    const ground = mesh(new THREE.CylinderGeometry(60, 60, 1, 48), M.stone, 0, -0.5, 0);
    ground.receiveShadow = true; g.add(ground);
    // 台基
    g.add(mesh(new THREE.BoxGeometry(19.4, 0.9, 8.4), M.stone, 0, 0.45, 0));
    // 下池水体与池壁
    const P = L.pool;
    g.add(mesh(new THREE.BoxGeometry(P.halfX * 2, 1, P.halfZ * 2), M.waterDeep, 0, 0.9, 0));
    const wtr = mesh(new THREE.BoxGeometry(P.halfX * 2 - .3, P.waterY - 1, P.halfZ * 2 - .3),
      M.water, 0, (P.waterY + 1) / 2, 0);
    wtr.castShadow = false; g.add(wtr);
    for (const sx of [-1, 1])
      g.add(mesh(new THREE.BoxGeometry(P.wallT + .4, P.wallTop - .4, P.halfZ * 2 + 1),
        M.stone, sx * (P.halfX + .5), (P.wallTop + .4) / 2, 0));
    for (const sz of [-1, 1])
      g.add(mesh(new THREE.BoxGeometry(P.halfX * 2 + 1.4, P.wallTop - .4, P.wallT + .4),
        M.stone, 0, (P.wallTop + .4) / 2, sz * (P.halfZ + .5)));

    // 塔柱 / 横梁 / 台级
    for (const [px, pz] of [[-5.6,-2.9],[5.6,-2.9],[-5.6,2.9],[5.6,2.9]]) {
      g.add(mesh(new THREE.BoxGeometry(.72, 32, .72), M.wood, px, 16, pz));
      g.add(mesh(new THREE.BoxGeometry(1.1, .5, 1.1), M.stone, px, .65, pz));
    }
    for (const y of [5.9, 14.6, 20.6, 24.6]) {
      g.add(mesh(new THREE.BoxGeometry(11.5, .3, .3), M.wood2, 0, y, -2.9));
      g.add(mesh(new THREE.BoxGeometry(.3, .3, 2.6), M.wood2, -5.45, y, -1.6));
      g.add(mesh(new THREE.BoxGeometry(.3, .3, 2.6), M.wood2, 5.45, y, -1.6));
    }
    for (const y of [10.2, 17.6, 22.6]) for (const sx of [-1, 1])
      g.add(mesh(new THREE.BoxGeometry(.3, .3, 6.1), M.wood2, sx * 5.6, y, 0));

    // 屋顶(多重攒尖)
    const roof = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const r = 6.4 - i * 1.5, h = 1.5;
      const c = mesh(new THREE.ConeGeometry(r, h, 4, 1), M.tile, 0, i * 1.35, 0);
      c.rotation.y = Math.PI / 4; c.castShadow = false;
      roof.add(c);
    }
    roof.position.set(0, 32.4, 0);
    g.add(roof);
    g.add(mesh(new THREE.ConeGeometry(.5, 2.4, 8), M.gold, 0, 37.4, 0));

    // 天池(恒定水位水箱)
    const S = L.spout;
    const tank = new THREE.Group();
    tank.add(mesh(new THREE.BoxGeometry(S.x1 - S.x0, S.y1 - S.y0, S.z1 - S.z0),
      new THREE.MeshStandardMaterial({ color: 0x3a2b1c, roughness: .8 }), 0, 0, 0));
    const lv = mesh(new THREE.BoxGeometry(S.x1 - S.x0 - .2, .5, S.z1 - S.z0 - .2), M.water,
      0, (S.y1 - S.y0) / 2 - .55, 0);
    lv.castShadow = false; tank.add(lv);
    this.tankWater = lv;
    tank.add(mesh(new THREE.BoxGeometry(1.0, 1.1, .8), M.bronzeD, 0, -(S.y1 - S.y0) / 2 + .35, 0));
    tank.position.set((S.x0 + S.x1) / 2, (S.y0 + S.y1) / 2, (S.z0 + S.z1) / 2);
    g.add(tank);

    // 受水槽(漏斗)
    for (const sx of [-1, 1]) {
      const f = mesh(new THREE.BoxGeometry(.2, 2.1, 1.3), M.bronzeD, sx * 1.18, 18.125, L.wheel.z);
      f.rotation.z = -sx * 0.466; g.add(f);
    }
    // 退水斜槽
    {
      const x0 = -3.45, y0 = 16.65, x1 = -6.45, y1 = 11.35;
      const ch = mesh(new THREE.BoxGeometry(Math.hypot(x1 - x0, y1 - y0), .16, 1.3), M.wood2,
        (x0 + x1) / 2, (y0 + y1) / 2, L.wheel.z);
      ch.rotation.z = Math.atan2(y1 - y0, x1 - x0);
      g.add(ch);
    }
    // 天条搁架与支架
    const B = L.beam;
    g.add(mesh(new THREE.BoxGeometry(.6, .34, .9), M.stone, B.stopX, B.barY - B.barHalf - .16, L.wheel.z));
    g.add(mesh(new THREE.BoxGeometry(.5, .9, .7), M.stone, B.pivotX, B.barY - .7, L.wheel.z));
  }

  /* ================ 可动部件 ================ */
  buildDynamic() {
    const g = this.scene, w = L.wheel;
    this.S = {};

    /* 枢轮 */
    const wh = new THREE.Group();
    wh.add(mesh(new THREE.CylinderGeometry(w.rRim, w.rRim, w.rimHalf * 2, 40), M.bronzeD, 0, 0, 0))
      .children.at(-1).rotation.x = Math.PI / 2;
    const rim2 = mesh(new THREE.TorusGeometry(w.rRim + .12, .1, 8, 44), M.bronze, 0, 0, .3);
    rim2.castShadow = false; wh.add(rim2);
    for (let i = 0; i < 16; i++) {                                   // 辐条
      const a = (i / 16) * Math.PI * 2, sp = mesh(new THREE.BoxGeometry(3.5, .18, .16),
        M.wood2, Math.cos(a) * 2.1, Math.sin(a) * 2.1, -.35);
      sp.rotation.z = a; sp.castShadow = false; wh.add(sp);
    }
    wh.add(mesh(new THREE.CylinderGeometry(.42, .42, 4.6, 18), M.iron, 0, 0, 1.15))
      .children.at(-1).rotation.x = Math.PI / 2;
    wh.add(mesh(new THREE.CylinderGeometry(.62, .62, .5, 18), M.bronze, 0, 0, 1.15))
      .children.at(-1).rotation.x = Math.PI / 2;
    this.spokes = wh;
    this.buckets = [];
    for (let i = 0; i < w.buckets; i++) {                            // 水斗
      const a = (i / w.buckets) * Math.PI * 2 + 0.088;
      const b = new THREE.Group();
      const mk = (hw, ht, off) => {
        const m = mesh(new THREE.BoxGeometry(hw * 2, ht * 2, 1.66), M.bronze, 0, 0, 0);
        return m;
      };
      const bot = mesh(new THREE.BoxGeometry(.16, 1.1, 1.7), M.bronze);
      bot.rotation.z = Math.PI / 2; b.add(bot);
      for (const s of [-1, 1]) {
        const side = mesh(new THREE.BoxGeometry(.78, .15, 1.7), M.bronze, 0, s * .68, 0);
        b.add(side);
      }
      b.position.set(Math.cos(a) * w.bR, Math.sin(a) * w.bR, 0);
      b.rotation.z = a;
      wh.add(b); this.buckets.push(b);
    }
    wh.position.set(w.x, w.y, w.z);
    g.add(wh); this.S.wheel = wh;

    /* 天条(杠杆) */
    const bm = new THREE.Group();
    const B = L.beam;
    bm.add(mesh(new THREE.BoxGeometry(B.xR - B.xL, .44, .6), M.wood2, (B.xR + B.xL) / 2, 0, 0));
    const cwArm = mesh(new THREE.BoxGeometry(1.5, .14, .4), M.iron, (B.cwX + 0.9) / 2 - .0, -.1, 0);
    bm.add(cwArm);
    const cw = mesh(new THREE.CylinderGeometry(.42, .42, .8, 16), M.stone, B.cwX, B.cwY - B.barY - .1, 0);
    bm.add(cw);
    this.beamWeight = cw;
    bm.add(mesh(new THREE.BoxGeometry(.3, B.postTop - B.barY + .9, .5), M.wood, B.postX, (B.postTop - B.barY) / 2 + .1, 0));
    bm.add(mesh(new THREE.BoxGeometry(.62, .2, .56), M.wood, B.postX - .2, B.postTop + .85, 0));
    bm.position.set(0, B.barY, L.wheel.z);
    g.add(bm); this.S.beam = bm;

    /* 天关(摆杆) */
    const P = L.pawl, pw = new THREE.Group();
    const armA = Math.atan2(P.tipY, P.tipX), armL = Math.hypot(P.tipX, P.tipY);
    const arm = mesh(new THREE.BoxGeometry(armL - .2, .15, .78), M.bronzeD,
      Math.cos(armA) * armL / 2, Math.sin(armA) * armL / 2, 0);
    arm.rotation.z = armA; pw.add(arm);
    pw.add(mesh(new THREE.BoxGeometry(.22, .13, 1.0), M.gold, P.tipX, P.tipY, 0));
    pw.add(mesh(new THREE.SphereGeometry(.19, 14, 10), M.bronze, -.42, .16, 0));
    pw.position.set(P.px, P.py, L.wheel.z);
    g.add(pw); this.S.pawl = pw;

    /* 水袋 */
    this.S.boxes = [];
    for (let i = 0; i < L.box.count; i++) {
      const b = new THREE.Group();
      b.add(mesh(new THREE.BoxGeometry(.52, .52, .6), M.bag, 0, 0, 0));
      b.add(mesh(new THREE.BoxGeometry(.56, .12, .64), M.wood2, 0, -.24, 0));
      g.add(b); this.S.boxes.push(b);
    }

    /* 立轴 + 锥齿 + 天球 */
    const D = L.dial;
    const sh = new THREE.Group();
    sh.add(mesh(new THREE.CylinderGeometry(.17, .17, D.y - 12, 12), M.iron, 0, 0, 0));
    const pin = mesh(new THREE.CylinderGeometry(D.pinionR, D.pinionR, .2, 20), M.bronzeD, 0, D.y - 17, 0);
    pin.rotation.x = Math.PI / 2; sh.add(pin);
    const bev = mesh(new THREE.ConeGeometry(.5, .5, 14), M.bronzeD, 0, -(17 - 12) + .1, 0);
    bev.rotation.x = -Math.PI / 2; sh.add(bev);
    sh.position.set(D.shaftX, 17, D.shaftZ);
    g.add(sh); this.S.shaft = sh;

    const dl = new THREE.Group();
    dl.add(mesh(new THREE.CylinderGeometry(D.r, D.r, .16, 48), M.dial, 0, 0, 0))
      .children.at(-1).rotation.x = Math.PI / 2;
    const ring = mesh(new THREE.TorusGeometry(D.r, .1, 8, 48), M.gold, 0, 0, .02);
    ring.castShadow = false; dl.add(ring);
    this.markers = [];
    for (let i = 0; i < 12; i++) {                                    // 十二时辰
      const a = (i / 12) * Math.PI * 2;
      const mk = mesh(new THREE.BoxGeometry(.1, .42, .06), M.gold,
        Math.cos(a) * (D.r - .3), Math.sin(a) * (D.r - .3), .1);
      mk.rotation.z = a + Math.PI / 2; mk.castShadow = false;
      dl.add(mk); this.markers.push(mk);
      if (i % 3 === 0) {
        const big = mesh(new THREE.BoxGeometry(.14, .62, .07), M.gold,
          Math.cos(a) * (D.r - .34), Math.sin(a) * (D.r - .34), .11);
        big.rotation.z = a + Math.PI / 2; big.castShadow = false; dl.add(big);
      }
    }
    for (let i = 0; i < 24; i++) {                                    // 刻度
      const a = (i / 24) * Math.PI * 2 + Math.PI / 24;
      const tk = mesh(new THREE.BoxGeometry(.06, .2, .05), M.bronze,
        Math.cos(a) * (D.r - .62), Math.sin(a) * (D.r - .62), .1);
      tk.rotation.z = a + Math.PI / 2; tk.castShadow = false; dl.add(tk);
    }
    dl.add(mesh(new THREE.CylinderGeometry(.3, .3, .3, 14), M.gold, 0, 0, .1))
      .children.at(-1).rotation.x = Math.PI / 2;
    const gear = mesh(new THREE.CylinderGeometry(D.gearR, D.gearR, .18, 28), M.bronzeD, 0, 0, .42);
    gear.rotation.x = Math.PI / 2; gear.castShadow = false; dl.add(gear);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const th = mesh(new THREE.BoxGeometry(.1, .16, .2), M.bronze,
        Math.cos(a) * (D.gearR + .06), Math.sin(a) * (D.gearR + .06), .42);
      th.rotation.z = a; th.castShadow = false; dl.add(th);
    }
    // 指针(固定指标)
    const idx = mesh(new THREE.ConeGeometry(.16, .8, 4), M.gold, 0, D.r - .1, .5);
    idx.rotation.x = Math.PI / 2; idx.castShadow = false; dl.add(idx);
    dl.position.set(D.x, D.y, D.z);
    g.add(dl); this.S.dial = dl;

    /* 河车(提水轮) */
    const pm = new THREE.Group();
    pm.add(mesh(new THREE.CylinderGeometry(L.pump.r, L.pump.r, .4, 22), M.wood2, 0, 0, 0))
      .children.at(-1).rotation.x = Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const p = mesh(new THREE.BoxGeometry(.18, 1.0, .95), M.wood,
        Math.cos(a) * (L.pump.r + .2), Math.sin(a) * (L.pump.r + .2), 0);
      p.rotation.z = a; pm.add(p);
    }
    pm.position.set(L.pump.x, L.pump.y, L.pump.z);
    g.add(pm); this.S.pump = pm;
  }

  /* ---------- 逐帧: 从物理体读取位姿 ---------- */
  sync(m) {
    const set = (grp, b) => { grp.position.copy(b.translation()); grp.quaternion.copy(Q(b)); };
    set(this.S.wheel, m.wheel);
    set(this.S.beam, m.beam);
    set(this.S.pawl, m.pawl);
    set(this.S.shaft, m.shaft);
    set(this.S.dial, m.dial);
    set(this.S.pump, m.pump);
    m.boxes.forEach((bx, i) => set(this.S.boxes[i], bx.body));
    this.tankWater.position.y = (L.spout.y1 - L.spout.y0) / 2 - .55
      + Math.sin(m.time * 1.7) * .04;
  }

  render() { this.renderer.render(this.scene, this.camera); }
}

/* ---------- 粒子: 水花与水流(纯装饰) ---------- */
function buildParticles(S) {
  const N = 260;
  const pos = new Float32Array(N * 3), vel = [];
  for (let i = 0; i < N; i++) { pos[i * 3 + 1] = -100; vel.push([0, 0, 0, 0]); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x9fd4ef, size: .26, transparent: true,
    opacity: .85, depthWrite: false });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  S.scene.add(pts);
  S.particles = { pts, pos, vel, n: N, next: 0 };
}

const EMIT = [
  { x: 0.0, y: 19.0, z: -1.2, vx: 0, vy: -3, vz: 0, rate: 26, life: 1.5 },     // 注水口
  { x: -4.9, y: 12.0, z: -1.2, vx: -1.2, vy: -.5, vz: 0, rate: 12, life: 1.8 },// 退水槽
];
export function updateParticles(S, dt) {
  const P = S.particles; if (!P) return;
  for (const e of EMIT) {
    let n = e.rate * dt;
    while (n > 0) {
      if (Math.random() > n) break; n -= 1;
      const i = P.next = (P.next + 1) % P.n;
      P.pos[i * 3] = e.x + (Math.random() - .5) * .3;
      P.pos[i * 3 + 1] = e.y;
      P.pos[i * 3 + 2] = e.z + (Math.random() - .5) * .5;
      P.vel[i] = [e.vx + (Math.random() - .5), e.vy, e.vz + (Math.random() - .5) * .4, e.life];
    }
  }
  for (let i = 0; i < P.n; i++) {
    const v = P.vel[i]; if (v[3] <= 0) continue;
    v[3] -= dt; v[1] -= 9.8 * dt;
    P.pos[i * 3] += v[0] * dt; P.pos[i * 3 + 1] += v[1] * dt; P.pos[i * 3 + 2] += v[2] * dt;
    if (v[3] <= 0 || P.pos[i * 3 + 1] < 0.6) { P.pos[i * 3 + 1] = -100; v[3] = 0; }
  }
  P.pts.geometry.attributes.position.needsUpdate = true;
}
