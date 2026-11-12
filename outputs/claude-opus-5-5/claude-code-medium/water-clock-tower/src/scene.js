// 场景：静态建筑 + 与物理刚体绑定的机械可视化
// 所有活动部件的位姿每帧都直接读取自 Rapier 刚体（不做任何手写动画）。
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as TX from './textures.js';
import { GEO } from './physics.js';

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

export function buildScene(renderer, sim) {
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;
  scene.fog = new THREE.FogExp2(0x2a2230, 0.012);

  // ------------------------------------------------------------------ 材质
  const M = {};
  M.wood = new THREE.MeshStandardMaterial({ map: TX.woodTexture('#7b4c28', '#3e220f', 1), roughness: 0.75 });
  M.woodLight = new THREE.MeshStandardMaterial({ map: TX.woodTexture('#a8743f', '#5c3818', 2), roughness: 0.7 });
  M.woodDark = new THREE.MeshStandardMaterial({ map: TX.woodTexture('#4a2c18', '#24140a', 4), roughness: 0.8 });
  M.lacquer = new THREE.MeshStandardMaterial({ map: TX.lacquerTexture(), roughness: 0.45 });
  M.bronze = new THREE.MeshStandardMaterial({ map: TX.bronzeTexture(), metalness: 0.75, roughness: 0.38, color: 0xffffff });
  M.brass = new THREE.MeshStandardMaterial({ color: 0xc9a24a, metalness: 0.85, roughness: 0.3 });
  M.iron = new THREE.MeshStandardMaterial({ color: 0x3a3a3e, metalness: 0.6, roughness: 0.5 });
  M.stone = new THREE.MeshStandardMaterial({ map: TX.stoneTexture(), roughness: 0.95 });
  M.tile = new THREE.MeshStandardMaterial({ map: TX.tileTexture(), roughness: 0.8 });
  M.plaster = new THREE.MeshStandardMaterial({ color: 0xd8cdb5, roughness: 0.95 });
  M.water = new THREE.MeshStandardMaterial({ map: TX.waterTexture(), color: 0x8fd0ff, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.85 });
  M.drop = new THREE.MeshStandardMaterial({ color: 0x5fb6ff, roughness: 0.08, metalness: 0.05, emissive: 0x0b3a66, emissiveIntensity: 0.6 });
  M.rope = new THREE.MeshStandardMaterial({ color: 0x2b2420, metalness: 0.5, roughness: 0.6 });
  M.globe = new THREE.MeshStandardMaterial({ map: TX.starGlobeTexture(), roughness: 0.55, metalness: 0.1, emissive: 0x0a1430, emissiveIntensity: 0.3 });
  M.cloth = new THREE.MeshStandardMaterial({ color: 0x2f5d7a, roughness: 0.9 });
  M.skin = new THREE.MeshStandardMaterial({ color: 0xe0b48a, roughness: 0.8 });
  M.hat = new THREE.MeshStandardMaterial({ color: 0x1b1b1f, roughness: 0.7 });
  M.glow = new THREE.MeshBasicMaterial({ color: 0xffd27a });

  const highlightables = {}; // 名称 → 材质集合（用于讲解时高亮）
  const staticRoot = new THREE.Group();
  scene.add(staticRoot);
  function hl(name, mesh) {
    // 每个可高亮部件克隆一份材质（同一部件内共享），便于单独调节自发光
    const map = new Map();
    const list = (highlightables[name] ??= []);
    mesh.traverse((o) => {
      if (o.isMesh) {
        if (list.includes(o.material)) return;
        if (!map.has(o.material)) {
          const c = o.material.clone();
          c.emissive = c.emissive || new THREE.Color(0);
          map.set(o.material, c);
          list.push(c);
        }
        o.material = map.get(o.material);
      }
    });
    return mesh;
  }
  // 合并：把一个组内使用同一材质的网格合并成一个，大幅减少绘制调用
  function mergeGroup(root) {
    root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const buckets = new Map();
    root.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh || o.userData.noMerge || o === root) return;
      const key = o.material.uuid + (o.castShadow ? 'c' : 'n');
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(o);
    });
    for (const list of buckets.values()) {
      if (list.length < 2) continue;
      const geos = [];
      for (const o of list) {
        let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
        g = new THREE.BufferGeometry().copy(g);
        for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
        if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
        if (!g.attributes.normal) g.computeVertexNormals();
        g.clearGroups();
        g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
        geos.push(g);
      }
      const merged = mergeGeometries(geos, false);
      if (!merged) continue;
      const m = new THREE.Mesh(merged, list[0].material);
      m.castShadow = list[0].castShadow; m.receiveShadow = true;
      for (const o of list) o.parent.remove(o);
      root.add(m);
    }
  }

  // ------------------------------------------------------------------ 工具
  function mesh(geo, mat, pos, parent, opts = {}) {
    const m = new THREE.Mesh(geo, mat);
    if (pos) m.position.set(pos[0], pos[1], pos[2]);
    if (opts.rot) m.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
    m.castShadow = opts.cast ?? true;
    m.receiveShadow = opts.receive ?? true;
    (parent || staticRoot).add(m);
    return m;
  }
  const box = (w, h, d, mat, pos, parent, opts) => mesh(new THREE.BoxGeometry(w, h, d), mat, pos, parent, opts);
  // 从 a 到 b 的圆柱
  function rod(a, b, r, mat, parent, seg = 10) {
    const A = V3(a), Bv = V3(b);
    const len = A.distanceTo(Bv);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
    m.position.copy(A).add(Bv).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bv.clone().sub(A).normalize());
    m.castShadow = true; m.receiveShadow = true;
    (parent || staticRoot).add(m);
    return m;
  }
  // 齿轮（直齿，沿 +z 挤出），返回 Mesh；可通过 rotation 摆到需要的轴向
  function gearGeo(R, teeth, depth, toothH = 0.08) {
    const s = new THREE.Shape();
    const n = teeth * 4;
    for (let i = 0; i <= n; i++) {
      const a = i / n * Math.PI * 2;
      const phase = i % 4;
      const r = phase === 1 || phase === 2 ? R + toothH : R;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i ? s.lineTo(x, y) : s.moveTo(x, y);
    }
    const hole = new THREE.Path();
    hole.absarc(0, 0, Math.min(0.06, R * 0.3), 0, Math.PI * 2, true);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 4 });
    g.translate(0, 0, -depth / 2);
    return g;
  }
  function gearMesh(R, teeth, depth, mat, parent, toothH) {
    const m = new THREE.Mesh(gearGeo(R, teeth, depth, toothH), mat);
    m.castShadow = true; m.receiveShadow = true;
    // 辐条
    for (let k = 0; k < 4; k++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(R * 1.9, 0.05, depth * 0.8), mat);
      sp.rotation.z = k * Math.PI / 4;
      m.add(sp);
    }
    (parent || staticRoot).add(m);
    return m;
  }

  // 刚体绑定
  const bound = [];
  function bind(body, obj) {
    bound.push({ body, obj });
    scene.add(obj);
    return obj;
  }

  // ------------------------------------------------------------------ 天空与大地
  {
    const g = new THREE.SphereGeometry(300, 32, 16);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { },
      vertexShader: `varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vp;
        void main(){
          float h = vp.y;
          vec3 top = vec3(0.06,0.08,0.18);
          vec3 mid = vec3(0.42,0.24,0.30);
          vec3 hor = vec3(0.98,0.62,0.36);
          vec3 c = mix(hor, mid, smoothstep(0.0, 0.18, h));
          c = mix(c, top, smoothstep(0.15, 0.7, h));
          // 太阳光晕
          vec3 sd = normalize(vec3(0.75, 0.10, -0.65));
          float s = max(dot(vp, sd), 0.0);
          c += vec3(1.0,0.6,0.3) * pow(s, 24.0) * 0.8 + vec3(1.0,0.75,0.45)*pow(s, 400.0)*2.0;
          if (h < 0.0) c = mix(hor*0.6, vec3(0.12,0.10,0.10), smoothstep(0.0,-0.2,h));
          gl_FragColor = vec4(c,1.0);
        }`,
    });
    scene.add(new THREE.Mesh(g, mat));
    // 星星
    const sg = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 600; i++) {
      const u = Math.random(), v = Math.random() * 0.45 + 0.25;
      const th = u * Math.PI * 2, ph = Math.acos(v);
      pts.push(Math.cos(th) * Math.sin(ph) * 280, Math.cos(ph) * 280, Math.sin(th) * Math.sin(ph) * 280);
    }
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xfff4dd, size: 0.9, sizeAttenuation: true, fog: false, transparent: true, opacity: 0.8 })));
    // 地面
    const gtex = TX.stoneTexture(21); gtex.repeat.set(60, 60);
    const ground = mesh(new THREE.PlaneGeometry(260, 260), new THREE.MeshStandardMaterial({ map: gtex, roughness: 1, color: 0x7a6a58 }), [0, -3.95, 0], null, { rot: [-Math.PI / 2, 0, 0], cast: false });
    // 庭院铺地（近处）
    const ctex = TX.stoneTexture(22); ctex.repeat.set(8, 6);
    mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshStandardMaterial({ map: ctex, roughness: 0.95, color: 0xa89c88 }), [1.5, -3.93, 2], null, { rot: [-Math.PI / 2, 0, 0], cast: false });
    // 远山：压扁的椭球，层层叠叠，被雾吞没
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x3a3040, roughness: 1 });
    const hillMat2 = new THREE.MeshStandardMaterial({ color: 0x2a2433, roughness: 1 });
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + (i % 2) * 0.1;
      const r = 95 + (i % 3) * 28;
      const s = 22 + ((i * 53) % 17);
      const h = 7 + ((i * 37) % 9);
      const m = mesh(new THREE.SphereGeometry(1, 20, 10), i % 2 ? hillMat : hillMat2, [Math.cos(a) * r, -4.5, Math.sin(a) * r], null, { cast: false, receive: false });
      m.scale.set(s, h, s * 0.7);
    }
    // 院中树木（简洁的球形树冠）
    const leaf = new THREE.MeshStandardMaterial({ color: 0x2d3b26, roughness: 1 });
    const trunk = new THREE.MeshStandardMaterial({ color: 0x3a2a1e, roughness: 1 });
    for (const [x, z, s] of [[-12, -6, 1.3], [-15, 4, 1.0], [14, -8, 1.2], [18, 3, 0.9], [-9, -14, 1.1], [11, -16, 1.4]]) {
      mesh(new THREE.CylinderGeometry(0.2 * s, 0.3 * s, 3 * s, 8), trunk, [x, -3.95 + 1.5 * s, z]);
      const c = mesh(new THREE.SphereGeometry(1.8 * s, 14, 10), leaf, [x, -3.95 + 3.6 * s, z]);
      c.scale.y = 0.85;
    }
  }

  // ------------------------------------------------------------------ 灯光
  const sun = new THREE.DirectionalLight(0xffc48a, 2.4);
  sun.position.set(18, 14, 16);
  sun.target.position.set(0, 3, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera; sc.left = -14; sc.right = 14; sc.top = 18; sc.bottom = -8; sc.near = 1; sc.far = 60;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(0x9bb0ff, 0x4a3020, 0.55));
  const fill = new THREE.DirectionalLight(0x8fb5ff, 0.5);
  fill.position.set(-10, 6, 12);
  scene.add(fill);
  const back = new THREE.DirectionalLight(0xbcd0ff, 0.9);
  back.position.set(-6, 9, -14);
  scene.add(back);
  // 室内暖光（光源放在镜头不经过的高处/后部）
  const lanterns = [];
  for (const p of [[0.6, 2.9, 1.2], [-3.2, 2.6, 1.0], [3.4, 1.0, 1.6], [-1.5, 8.0, 1.4], [-3.0, -0.6, 1.0]]) {
    const l = new THREE.PointLight(0xffb060, 5, 8, 1.6);
    l.position.set(...p);
    scene.add(l);
    lanterns.push(l);
  }

  // ------------------------------------------------------------------ 建筑（台基、柱、楼层、屋檐、木阁）
  const X0 = -5.0, X1 = 4.9, Z0 = -2.4, Z1 = 2.1;
  const facadeMat = M.lacquer.clone();
  const plasterX = M.plaster.clone();
  const floorX = M.wood.clone();
  const xrayMats = [facadeMat, plasterX, floorX];
  const FLOOR = -3.3;
  // 台基
  box(X1 - X0 + 2.6, 0.65, Z1 - Z0 + 2.4, M.stone, [(X0 + X1) / 2 + 0.6, FLOOR - 0.33, (Z0 + Z1) / 2]);
  box(4.6, 0.65, 3.4, M.stone, [7.0, FLOOR - 0.33, 0]); // 升水轮附屋台基
  // 台阶
  for (let i = 0; i < 3; i++) box(2.4, 0.2, 0.4, M.stone, [-0.1, FLOOR - 0.55 + i * 0.2 - 0.1, Z1 + 1.6 - i * 0.35]);
  // 柱子（前排留空以便观看内部）
  const colR = 0.15;
  const cols = [];
  const colXs = [X0, -1.7, 1.2, X1];
  for (const x of colXs) for (const z of [Z0, Z1]) if (!(z === Z1 && x === 1.2)) cols.push([x, z]);
  const colX = M.lacquer.clone(); xrayMats.push(colX);
  for (const [x, z] of cols) mesh(new THREE.CylinderGeometry(colR, colR * 1.1, 6.6, 12), z === Z0 ? colX : M.lacquer, [x, FLOOR + 3.3, z]);
  // 一层顶梁
  for (const z of [Z0, Z1]) box(X1 - X0 + 0.4, 0.28, 0.28, M.lacquer, [(X0 + X1) / 2, 3.3, z]);
  for (const x of colXs) box(0.28, 0.28, Z1 - Z0 + 0.4, M.lacquer, [x, 3.3, (Z0 + Z1) / 2]);
  // 二层楼板（中部开洞透出天柱位置）
  box(X1 - X0 + 0.8, 0.22, Z1 - Z0 + 0.8, floorX, [(X0 + X1) / 2, 3.55, (Z0 + Z1) / 2]);
  // 后墙（一层）
  box(X1 - X0, 6.6, 0.12, plasterX, [(X0 + X1) / 2, FLOOR + 3.3, Z0 - 0.05], null, { cast: false });
  // 侧墙（带格窗）
  function lattice(x, zc, w, h, y) {
    const g = new THREE.Group();
    for (let i = 0; i <= 8; i++) box(0.05, h, 0.05, M.woodDark, [0, 0, -w / 2 + i * w / 8], g, { cast: false });
    for (let i = 0; i <= 6; i++) box(0.05, 0.05, w, M.woodDark, [0, -h / 2 + i * h / 6, 0], g, { cast: false });
    g.position.set(x, y, zc);
    scene.add(g);
  }
  box(0.12, 6.6, Z1 - Z0, plasterX, [X0 - 0.05, FLOOR + 3.3, (Z0 + Z1) / 2], null, { cast: false });
  box(0.12, 2.2, Z1 - Z0, M.plaster, [X1 + 0.05, FLOOR + 1.1, (Z0 + Z1) / 2], null, { cast: false });
  lattice(X1 + 0.05, (Z0 + Z1) / 2, Z1 - Z0 - 0.2, 3.6, 1.2);

  // 木阁（左侧前立面五层，开窗露出报时木人）
  const facadeZ = 1.95;
  const fX0 = X0 + 0.05, fX1 = -1.75;
  const tiers = 5, tierH = 6.6 / tiers;
  const fw = fX1 - fX0;
  const winW = 1.5;
  // 窗：底部一个大窗（露出拨牙、木人与钟），其上为时辰牌窗等
  const wins = [[-2.62, -0.74], [-0.5, 0.5], [0.85, 1.75], [2.15, 3.05]];
  const lw = (-3.0 - winW / 2) - fX0, rw = fX1 - (-3.0 + winW / 2);
  box(lw, 6.6, 0.1, facadeMat, [fX0 + lw / 2, FLOOR + 3.3, facadeZ], null, { cast: false });
  box(rw, 6.6, 0.1, facadeMat, [fX1 - rw / 2, FLOOR + 3.3, facadeZ], null, { cast: false });
  let yPrev = FLOOR;
  for (const [a, b] of wins) {
    box(winW, a - yPrev, 0.1, facadeMat, [-3.0, (a + yPrev) / 2, facadeZ], null, { cast: false });
    yPrev = b;
    const h = b - a, yc = (a + b) / 2;
    box(winW + 0.16, 0.08, 0.16, M.woodLight, [-3.0, b, facadeZ + 0.03]);
    box(winW + 0.16, 0.08, 0.16, M.woodLight, [-3.0, a, facadeZ + 0.03]);
    box(0.08, h, 0.16, M.woodLight, [-3.0 - winW / 2, yc, facadeZ + 0.03]);
    box(0.08, h, 0.16, M.woodLight, [-3.0 + winW / 2, yc, facadeZ + 0.03]);
  }
  box(winW, 3.3 - yPrev, 0.1, facadeMat, [-3.0, (3.3 + yPrev) / 2, facadeZ], null, { cast: false });
  // 小腰檐（窗口处断开）
  for (const ey of [-0.62, 0.68, 1.98]) {
    for (const [x0, x1] of [[fX0 - 0.2, -3.0 - winW / 2 - 0.05], [-3.0 + winW / 2 + 0.05, fX1 + 0.25]]) {
      const eave = box(x1 - x0, 0.06, 0.45, M.tile, [(x0 + x1) / 2, ey, facadeZ + 0.22]);
      eave.rotation.x = 0.35;
    }
  }

  // 屋檐（歇山式简化：四坡 + 起翘）
  function roof(cx, cy, cz, w, d, h, over = 0.9) {
    const W = w / 2 + over, D = d / 2 + over;
    const geo = new THREE.BufferGeometry();
    const lift = 0.35;
    const v = [
      -W, lift, -D, W, lift, -D, W, lift, D, -W, lift, D,         // 檐口四角（起翘）
      -W * 0.35, h, 0, W * 0.35, h, 0,                              // 正脊
      -W * 0.7, 0, -D * 0.95, W * 0.7, 0, -D * 0.95, W * 0.7, 0, D * 0.95, -W * 0.7, 0, D * 0.95, // 檐口中段（略低）
    ];
    const idx = [
      // 前坡
      3, 9, 4, 9, 8, 4, 8, 5, 4, 8, 2, 5,
      // 后坡
      0, 4, 6, 6, 4, 7, 7, 4, 5, 7, 5, 1,
      // 左右山面
      0, 3, 4, 1, 5, 2,
      // 底面
      0, 6, 3, 6, 9, 3, 6, 7, 9, 7, 8, 9, 7, 1, 8, 1, 2, 8,
    ];
    geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    // uv：按 x,z 投影
    const uv = [];
    for (let i = 0; i < v.length; i += 3) uv.push(v[i] * 0.5, v[i + 2] * 0.5 + v[i + 1] * 0.5);
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    const m = mesh(geo, M.tile, [cx, cy, cz]);
    m.material = M.tile.clone(); m.material.side = THREE.DoubleSide;
    xrayMats.push(m.material);
    // 正脊
    box(W * 0.7 + 0.2, 0.18, 0.22, M.woodDark, [cx, cy + h + 0.05, cz]);
    // 鸱吻
    for (const s of [-1, 1]) mesh(new THREE.SphereGeometry(0.2, 8, 6), M.woodDark, [cx + s * (W * 0.35 + 0.1), cy + h + 0.22, cz]);
    return m;
  }
  // 一层腰檐（前檐只在木阁上方）
  roof((X0 + X1) / 2, 3.45, (Z0 + Z1) / 2, X1 - X0, Z1 - Z0, 0.9, 0.8).scale.set(1, 0.6, 1);
  // 二层：浑象室
  const L2y = 3.66;
  for (const x of [X0 + 0.6, -1.7, 1.6, X1 - 0.6]) for (const z of [Z0 + 0.3, Z1 - 0.3]) mesh(new THREE.CylinderGeometry(0.13, 0.13, 4.6, 10), z < 0 ? colX : M.lacquer, [x, L2y + 2.3, z]);
  box(X1 - X0 - 0.8, 4.6, 0.1, plasterX, [(X0 + X1) / 2, L2y + 2.3, Z0 + 0.25], null, { cast: false });
  box(0.1, 4.6, Z1 - Z0 - 0.6, plasterX, [X0 + 0.55, L2y + 2.3, (Z0 + Z1) / 2], null, { cast: false });
  box(0.1, 4.6, Z1 - Z0 - 0.6, M.plaster, [X1 - 0.55, L2y + 2.3, (Z0 + Z1) / 2], null, { cast: false });
  // 栏杆
  for (let i = 0; i < 14; i++) box(0.05, 0.6, 0.05, M.woodLight, [X0 + 0.8 + i * 0.66, L2y + 0.3, Z1 + 0.15]);
  box(X1 - X0 - 1.0, 0.07, 0.08, M.woodLight, [(X0 + X1) / 2, L2y + 0.62, Z1 + 0.15]);
  roof((X0 + X1) / 2, 8.25, (Z0 + Z1) / 2, X1 - X0 - 1.2, Z1 - Z0 - 0.6, 1.1, 0.9).scale.set(1, 0.7, 1);
  // 三层：浑仪平台
  const L3y = 9.55;
  box(5.6, 0.25, 4.4, M.wood, [-1.3, L3y, -0.1]);
  for (let i = 0; i < 12; i++) box(0.05, 0.55, 0.05, M.woodLight, [-3.9 + i * 0.47, L3y + 0.4, 2.05]);
  box(5.4, 0.06, 0.08, M.woodLight, [-1.3, L3y + 0.68, 2.05]);
  box(0.6, 0.6, 0.6, M.woodDark, [-1.3, L3y + 0.3, -0.1]);
  // 浑仪上方的轻便屋顶（四柱）
  for (const x of [-3.8, 1.2]) for (const z of [-2.0, 1.8]) mesh(new THREE.CylinderGeometry(0.09, 0.09, 4.2, 8), M.lacquer, [x, L3y + 2.1, z]);
  roof(-1.3, L3y + 4.1, -0.1, 5.0, 3.8, 1.3, 0.7);

  // ------------------------------------------------------------------ 水箱：天池、平水壶、渴乌（出水管）、退水壶
  const ST = sim.station;
  const spout = sim.spout;
  {
    // 平水壶（恒水位箱）
    const g = new THREE.Group();
    const potMat = M.bronze.clone(); potMat.color.set(0x8a7a62);
    const px = 3.45, py = -0.1;
    const W = 0.62, H = 0.7, D = 0.62, T = 0.05;
    box(W, T, D, potMat, [0, -H / 2, 0], g);
    box(T, H, D, potMat, [-W / 2, 0, 0], g);
    box(T, H, D, potMat, [W / 2, 0, 0], g);
    box(W, H, T, potMat, [0, 0, -D / 2], g);
    box(W, H * 0.8, T, potMat, [0, -H * 0.1, D / 2], g);
    const ws = mesh(new THREE.PlaneGeometry(W - T, D - T), M.water, [0, 0.2, 0], g, { rot: [-Math.PI / 2, 0, 0], cast: false });
    // 溢流口
    rod([W / 2, 0.22, 0], [W / 2 + 0.3, 0.05, 0], 0.035, M.bronze, g);
    g.position.set(px, py, 0);
    scene.add(hl('平水壶', g));
    // 出水管（渴乌）
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(px - W / 2 + 0.02, spout[1] + 0.02, 0),
      new THREE.Vector3(spout[0] + 0.05, spout[1] + 0.0, 0),
    ]), 4, 0.045, 10, false), M.brass);
    tube.castShadow = true;
    scene.add(tube);
    hl('平水壶', tube);
    // 天池（上水箱）
    const g2 = new THREE.Group();
    const tw = 1.3, th = 0.9, td = 1.1;
    box(tw, 0.06, td, M.wood, [0, -th / 2, 0], g2);
    box(0.06, th, td, M.wood, [-tw / 2, 0, 0], g2);
    box(0.06, th, td, M.wood, [tw / 2, 0, 0], g2);
    box(tw, th, 0.06, M.wood, [0, 0, -td / 2], g2);
    box(tw, th, 0.06, M.wood, [0, 0, td / 2], g2);
    mesh(new THREE.PlaneGeometry(tw - 0.08, td - 0.08), M.water, [0, th * 0.3, 0], g2, { rot: [-Math.PI / 2, 0, 0], cast: false });
    g2.position.set(3.95, 1.75, -0.2);
    scene.add(hl('天池', g2));
    // 天池 → 平水壶 竖管
    rod([3.6, 1.3, 0.0], [3.6, 0.35, 0.0], 0.04, M.brass);
    // 支架
    for (const x of [3.35, 4.55]) box(0.1, 1.9, 0.1, M.woodDark, [x, 0.3, -0.7]);
    box(1.4, 0.1, 0.1, M.woodDark, [3.95, 1.25, -0.7]);
    box(0.08, 0.95, 0.08, M.woodDark, [3.45, -0.92, -0.25]);
    // 退水壶（承接溢水）
    const g3 = new THREE.Group();
    const sw = 6.0, sh = 0.75, sd = 2.0;
    box(sw, 0.08, sd, M.stone, [0, -sh / 2, 0], g3);
    box(0.12, sh, sd, M.stone, [-sw / 2, 0, 0], g3);
    box(0.12, sh, sd, M.stone, [sw / 2, 0, 0], g3);
    box(sw, sh, 0.12, M.stone, [0, 0, -sd / 2], g3);
    box(sw, sh, 0.12, M.stone, [0, 0, sd / 2], g3);
    mesh(new THREE.PlaneGeometry(sw - 0.1, sd - 0.1), M.water, [0, GEO.sumpY - (FLOOR + sh / 2) + 0.0, 0], g3, { rot: [-Math.PI / 2, 0, 0], cast: false });
    g3.position.set(0.5, FLOOR + sh / 2, 0);
    scene.add(hl('退水壶', g3));
    // 通往升水轮的水渠
    const g4 = new THREE.Group();
    box(2.6, 0.06, 1.0, M.stone, [0, -0.3, 0], g4);
    box(2.6, 0.5, 0.08, M.stone, [0, -0.05, -0.5], g4);
    box(2.6, 0.5, 0.08, M.stone, [0, -0.05, 0.5], g4);
    mesh(new THREE.PlaneGeometry(2.6, 0.9), M.water, [0, -0.1, 0], g4, { rot: [-Math.PI / 2, 0, 0], cast: false });
    g4.position.set(4.6, FLOOR + 0.35, 0);
    scene.add(g4);
    const g5 = new THREE.Group(); // 升水轮下的水池
    box(3.4, 0.08, 1.6, M.stone, [0, -0.6, 0], g5);
    for (const s of [-1, 1]) box(0.1, 1.2, 1.6, M.stone, [s * 1.7, 0, 0], g5);
    for (const s of [-1, 1]) box(3.4, 1.2, 0.1, M.stone, [0, 0, s * 0.8], g5);
    mesh(new THREE.PlaneGeometry(3.3, 1.5), M.water, [0, 0.35, 0], g5, { rot: [-Math.PI / 2, 0, 0], cast: false });
    g5.position.set(GEO.noria[0], FLOOR + 0.25, 0);
    scene.add(g5);
    // 升水轮顶部 → 天池 的天河（水槽）
    const g6 = new THREE.Group();
    const L = GEO.noria[0] - 4.55;
    box(L, 0.05, 0.4, M.wood, [0, 0, 0], g6);
    box(L, 0.18, 0.05, M.wood, [0, 0.09, 0.2], g6);
    box(L, 0.18, 0.05, M.wood, [0, 0.09, -0.2], g6);
    mesh(new THREE.PlaneGeometry(L, 0.34), M.water, [0, 0.05, 0], g6, { rot: [-Math.PI / 2, 0, 0], cast: false });
    g6.position.set((GEO.noria[0] + 4.55) / 2 - 0.3, 2.28, -0.2);
    g6.rotation.z = 0.04;
    scene.add(hl('天河', g6));
    for (const x of [5.4, 6.2]) box(0.08, 2.4, 0.08, M.woodDark, [x, 1.1, -0.45]);
    // 附屋屋顶
    roof(7.0, 3.0, 0, 3.4, 2.6, 0.8, 0.6).scale.set(1, 0.8, 1);
    for (const x of [5.3, 8.7]) for (const z of [-1.4, 1.4]) if (!(x === 5.3 && z === 1.4)) mesh(new THREE.CylinderGeometry(0.1, 0.1, 6.3, 8), M.lacquer, [x, FLOOR + 3.15, z]);
  }

  // ------------------------------------------------------------------ 枢轮
  const wheelG = new THREE.Group();
  {
    const R = GEO.R;
    // 双轮辋
    for (const z of [-0.33, 0.33]) {
      const rim = mesh(new THREE.TorusGeometry(R, 0.06, 8, 72), M.wood, [0, 0, z], wheelG);
      const rim2 = mesh(new THREE.TorusGeometry(R * 0.55, 0.05, 8, 48), M.wood, [0, 0, z], wheelG);
    }
    // 轮毂与轴
    mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.9, 20), M.woodDark, [0, 0, 0], wheelG, { rot: [Math.PI / 2, 0, 0] });
    mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.7, 12), M.iron, [0, 0, -0.45], wheelG, { rot: [Math.PI / 2, 0, 0] });
    // 72 辐的简化：每个受水壶两根辐（前后）
    for (let i = 0; i < GEO.N; i++) {
      const a = ST + i * 2 * Math.PI / GEO.N;
      for (const z of [-0.33, 0.33]) rod([0.3 * Math.cos(a), 0.3 * Math.sin(a), z], [R * Math.cos(a), R * Math.sin(a), z], 0.045, M.wood, wheelG, 6);
      // 中间加辐
      const a2 = a + Math.PI / GEO.N;
      for (const z of [-0.33, 0.33]) rod([0.3 * Math.cos(a2), 0.3 * Math.sin(a2), z], [R * 0.55 * Math.cos(a2), R * 0.55 * Math.sin(a2), z], 0.035, M.wood, wheelG, 6);
      // 辐端销（天关卡住的就是它们）
      const ap = i * 2 * Math.PI / GEO.N + GEO.pegHold;
      const pp = [GEO.Rp * Math.cos(ap), GEO.Rp * Math.sin(ap)];
      rod([pp[0] * 0.9, pp[1] * 0.9, 0.33], [pp[0], pp[1], GEO.pegZ + 0.06], 0.035, M.woodDark, wheelG, 6);
      const peg = mesh(new THREE.CylinderGeometry(GEO.pegR, GEO.pegR, 0.18, 14), M.brass, [pp[0], pp[1], GEO.pegZ], wheelG, { rot: [Math.PI / 2, 0, 0] });
      // 辐端到轮辋
      rod([R * Math.cos(ap), R * Math.sin(ap), 0.33], [pp[0] * 0.9, pp[1] * 0.9, 0.33], 0.04, M.wood, wheelG, 6);
    }
    // 轴上的地毂伞齿轮
    const bg = gearMesh(0.42, 16, 0.12, M.bronze, wheelG, 0.07);
    bg.position.set(0, 0, -1.08);
    bind(sim.wheel, hl('枢轮', wheelG));
  }
  // 轴承架
  for (const z of [-1.3, 0.75]) {
    box(0.18, 3.3, 0.18, M.woodDark, [0, FLOOR + 1.6, z]);
    box(0.5, 0.3, 0.3, M.woodDark, [0, -0.05, z]);
  }

  // ------------------------------------------------------------------ 受水壶
  const B = GEO.bucket;
  const bucketMeshes = [];
  const glassWood = new THREE.MeshStandardMaterial({ map: M.woodLight.map, color: 0xffffff, transparent: true, opacity: 0.22, roughness: 0.4, depthWrite: false });
  sim.buckets.forEach((bk, i) => {
    const g = new THREE.Group();
    const inner = new THREE.Group();
    inner.rotation.z = bk.tilt;
    g.add(inner);
    const xm = (B.x0 + B.x1) / 2, hx = B.x1 - B.x0, ym = (B.y0 + B.y1) / 2, hy = B.y1 - B.y0;
    const m = M.woodLight;
    box(hx, B.t, B.hz * 2, m, [xm, B.y0 + B.t / 2, 0], inner);
    box(B.t, hy, B.hz * 2, m, [B.x0 + B.t / 2, ym, 0], inner);
    box(B.t, hy, B.hz * 2, m, [B.x1 - B.t / 2, ym, 0], inner);
    // 前侧板做成半透明“剖面”，便于看到壶里的水
    box(hx, hy, B.t, glassWood, [xm, ym, B.hz - B.t / 2], inner, { cast: false });
    box(hx, 0.03, B.t + 0.01, m, [xm, B.y0 + 0.015, B.hz - B.t / 2], inner);
    box(0.03, hy, B.t + 0.01, m, [B.x0 + 0.015, ym, B.hz - B.t / 2], inner);
    box(0.03, hy, B.t + 0.01, m, [B.x1 - 0.015, ym, B.hz - B.t / 2], inner);
    box(hx, hy, B.t, m, [xm, ym, -B.hz + B.t / 2], inner);
    // 铜箍
    box(hx + 0.02, 0.04, B.hz * 2 + 0.02, M.brass, [xm, B.y1 - 0.03, 0], inner);
    // 托销
    const pin = mesh(new THREE.CylinderGeometry(GEO.pinR, GEO.pinR, 0.2, 12), M.brass, [GEO.pinLocal[0], GEO.pinLocal[1], GEO.pinZ - 0.04], inner, { rot: [Math.PI / 2, 0, 0] });
    // 铰轴
    mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.75, 8), M.iron, [0, 0, 0], inner, { rot: [Math.PI / 2, 0, 0] });
    bind(bk.body, g);
    bucketMeshes.push(g);
  });

  // ------------------------------------------------------------------ 格叉 + 枢衡 + 枢权
  {
    const FP = sim.forkPivot;
    const g = new THREE.Group();
    const [pl0, pl1] = sim.plate;
    // 托板做成叉形：两根叉齿
    for (const dz of [-0.045, 0.045]) box(pl1 - pl0, sim.plateTh * 2, 0.04, M.bronze, [(pl0 + pl1) / 2, 0, dz], g);
    box(0.08, sim.plateTh * 2, 0.14, M.bronze, [pl1 - 0.04, 0, 0], g);
    box(1.0 - pl1, 0.08, 0.1, M.wood, [(pl1 + 1.0) / 2, -0.01, 0], g);
    // 枢权
    const cw = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.24, 16), M.iron, [GEO.cwX, -0.05, 0], g);
    // 枢轴
    mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.3, 10), M.iron, [0, 0, 0], g, { rot: [Math.PI / 2, 0, 0] });
    bind(sim.fork, hl('格叉', g));
    // 支座
    box(0.12, FP[1] - FLOOR, 0.12, M.woodDark, [FP[0], (FP[1] + FLOOR) / 2, FP[2] - 0.15]);
    // 限位块
    const sx = FP[0] - sim.stopX;
    box(0.1, 0.06, 0.12, M.iron, [sx, FP[1] + 0.06, FP[2]]);
    box(0.04, 0.4, 0.04, M.iron, [sx, FP[1] + 0.27, FP[2] - 0.05]);
  }

  // ------------------------------------------------------------------ 天衡 + 天关
  {
    const BP = sim.beamPivot;
    const g = new THREE.Group();
    const L = sim.beamRight - sim.beamL;
    box(L, 0.09, 0.1, M.woodDark, [(sim.beamRight + sim.beamL) / 2, 0.06, 0], g);
    // 天关（卡齿）
    const tooth = box(0.14, sim.toothTop - sim.toothBot, 0.14, M.bronze, [sim.beamL + 0.07, (sim.toothTop + sim.toothBot) / 2, 0], g);
    // 配重
    box(0.16, 0.16, 0.16, M.iron, [sim.beamL + 0.1, 0.16, 0], g);
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 10), M.iron, [0, 0, 0], g, { rot: [Math.PI / 2, 0, 0] });
    bind(sim.beam, hl('天衡', g));
    // 吊架
    box(0.1, 3.3 - BP[1], 0.1, M.woodDark, [BP[0], (3.3 + BP[1]) / 2, BP[2] - 0.12]);
    // 托块
    box(0.08, 0.06, 0.1, M.iron, [BP[0] - 1.2, BP[1] - 0.03, BP[2]]);
    box(0.04, 3.3 - BP[1], 0.04, M.iron, [BP[0] - 1.2, (3.3 + BP[1]) / 2, BP[2] - 0.08]);
  }
  // 天锁（棘爪）
  {
    const LP = sim.lockPivot;
    const g = new THREE.Group();
    const p = sim.pawl;
    const dx = Math.cos(p.ang) * p.L, dy = Math.sin(p.ang) * p.L;
    const nx = -Math.sin(p.ang), ny = Math.cos(p.ang);
    const b = box(p.L, p.th * 2, 0.1, M.bronze, [dx / 2 + nx * p.th, dy / 2 + ny * p.th, 0], g);
    b.rotation.z = p.ang;
    mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 10), M.iron, [0, 0, 0], g, { rot: [Math.PI / 2, 0, 0] });
    bind(sim.lock, hl('天锁', g));
    box(0.08, 3.3 - LP[1], 0.08, M.woodDark, [LP[0], (3.3 + LP[1]) / 2, LP[2] - 0.1]);
    mesh(new THREE.SphereGeometry(0.03, 8, 6), M.iron, p.stop);
  }
  // 天条（链）：每帧根据两端刚体位置重算
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 6), M.rope);
  chain.castShadow = true;
  scene.add(hl('天条', chain));
  const chainLinks = new THREE.InstancedMesh(new THREE.TorusGeometry(0.03, 0.009, 5, 10), M.iron, 60);
  scene.add(chainLinks);
  hl('天条', chainLinks);

  // ------------------------------------------------------------------ 传动：地毂、天柱、齿轮
  {
    // 地毂（水平轴，沿 x）
    const g = new THREE.Group();
    const dg = sim.shafts.digu;
    mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.1, 10), M.iron, [0, 0, 0], g, { rot: [0, 0, Math.PI / 2] });
    const gA = gearMesh(0.42, 16, 0.12, M.bronze, g, 0.07); gA.position.set(1.5 - 0.45, 0, 0); gA.rotation.y = Math.PI / 2;
    const gB = gearMesh(0.42, 16, 0.12, M.bronze, g, 0.07); gB.position.set(-1.5 + 0.45, 0, 0); gB.rotation.y = Math.PI / 2;
    bind(dg.body, hl('天柱', g));
    for (const x of [-2.4, -0.7]) box(0.14, 3.3, 0.14, M.woodDark, [x, FLOOR + 1.6, dg.pos[2] - 0.25]);
    // 天柱（竖轴）
    const tz = sim.shafts.tianzhu;
    const g2 = new THREE.Group();
    const y0 = -2.9, y1 = 12.6;
    mesh(new THREE.CylinderGeometry(0.13, 0.13, y1 - y0, 14), M.wood, [0, (y0 + y1) / 2 - tz.pos[1], 0], g2);
    const gC = gearMesh(0.42, 16, 0.12, M.bronze, g2, 0.07); gC.position.set(0, 0.45 - tz.pos[1], 0); gC.rotation.x = Math.PI / 2;
    const gE = gearMesh(0.95, 30, 0.14, M.bronze, g2, 0.08); gE.position.set(0, -2.95 - tz.pos[1], 0); gE.rotation.x = Math.PI / 2;
    const gG = gearMesh(0.7, 22, 0.12, M.bronze, g2, 0.08); gG.position.set(0, 6.9 - tz.pos[1], 0); gG.rotation.x = Math.PI / 2;
    const gI = gearMesh(0.7, 22, 0.12, M.bronze, g2, 0.08); gI.position.set(0, 12.45 - tz.pos[1], 0); gI.rotation.x = Math.PI / 2;
    bind(tz.body, hl('天柱', g2));
    // 天柱轴承
    for (const y of [-2.2, 3.55, 9.55]) box(0.4, 0.15, 0.4, M.woodDark, [tz.pos[0], y, tz.pos[2]]);
  }

  // ------------------------------------------------------------------ 机轮（报时轮）+ 木人 + 钟 + 时辰牌
  const shichen = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  {
    const js = sim.shafts.jack;
    const g = new THREE.Group();
    const ax = sim.jackAxlePos;
    mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.6, 12), M.woodDark, [0, 1.2, 0], g);
    // 与天柱啮合的齿轮
    const gF = gearMesh(0.95, 30, 0.14, M.bronze, g, 0.08); gF.position.set(0, -2.95 - ax[1], 0); gF.rotation.x = Math.PI / 2;
    gF.rotation.z = Math.PI / 30;
    // 拨牙轮
    const tY = sim.tripY - ax[1];
    mesh(new THREE.CylinderGeometry(sim.tripR + 0.12, sim.tripR + 0.12, 0.08, 36), M.wood, [0, tY - 0.04, 0], g);
    for (let i = 0; i < GEO.N; i++) {
      const a = i * 2 * Math.PI / GEO.N + sim.tripPhase;
      mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.17, 8), M.brass, [sim.tripR * Math.sin(a), tY + 0.085, sim.tripR * Math.cos(a)], g);
    }
    // 时辰牌轮：12 个木人各持一块时辰牌
    const pY = -0.05 - ax[1];
    mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.08, 36), M.wood, [0, pY - 0.42, 0], g);
    for (let k = 0; k < GEO.N; k++) {
      const a = k * 2 * Math.PI / GEO.N;
      const fig = new THREE.Group();
      // 身体
      mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.42, 10), M.cloth, [0, -0.17, 0], fig);
      mesh(new THREE.SphereGeometry(0.085, 12, 10), M.skin, [0, 0.12, 0], fig);
      mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.07, 10), M.hat, [0, 0.21, 0], fig);
      // 时辰牌
      const name = shichen[(k + 11) % 12];
      const plate = mesh(new THREE.PlaneGeometry(0.2, 0.36), new THREE.MeshStandardMaterial({ map: TX.textTexture(name + '时'), roughness: 0.8, side: THREE.DoubleSide }), [0.0, -0.05, 0.13], fig, { cast: false });
      fig.position.set(1.0 * Math.sin(a), pY, 1.0 * Math.cos(a));
      fig.rotation.y = a;
      g.add(fig);
    }
    bind(js.body, hl('机轮', g));
    // 木人（击钟者）：手臂即物理杠杆
    const jg = new THREE.Group();
    box(0.05, 0.5, 0.06, M.woodDark, [0, -0.25, 0], jg);
    mesh(new THREE.SphereGeometry(0.05, 10, 8), M.iron, [0, -0.5, 0], jg);
    box(0.045, 0.64, 0.045, M.cloth, [0, 0.32, 0], jg);
    mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 12), M.woodLight, [0, 0.66, 0], jg, { rot: [0, 0, Math.PI / 2] });
    bind(sim.jack, hl('木人', jg));
    // 木人身体（静态的身躯，手臂由物理杠杆驱动）
    const JP = sim.jackPivot;
    const body = new THREE.Group();
    mesh(new THREE.CylinderGeometry(0.13, 0.2, 0.62, 12), new THREE.MeshStandardMaterial({ color: 0x8a3020, roughness: 0.85 }), [0, -0.3, 0], body);
    mesh(new THREE.SphereGeometry(0.11, 14, 10), M.skin, [0, 0.12, 0], body);
    mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.1, 12), M.hat, [0, 0.24, 0], body);
    body.position.set(JP[0] + 0.2, JP[1] - 0.05, JP[2] - 0.3);
    // 肩到枢轴的短臂（静态）
    rod([JP[0] + 0.14, JP[1] + 0.0, JP[2] - 0.22], [JP[0], JP[1], JP[2] - 0.03], 0.03, M.cloth);
    scene.add(hl('木人', body));
    // 钟
    const bp = sim.bellPos;
    const prof = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; prof.push(new THREE.Vector2(0.06 + 0.12 * Math.pow(t, 1.6) + (t > 0.9 ? 0.02 : 0), 0.18 - t * 0.36)); }
    const bell = mesh(new THREE.LatheGeometry(prof, 24), M.bronze, bp);
    bell.material = M.bronze.clone(); bell.material.side = THREE.DoubleSide;
    hl('钟', bell);
    rod([bp[0], bp[1] + 0.18, bp[2]], [bp[0], bp[1] + 0.5, bp[2]], 0.02, M.iron);
    box(0.6, 0.06, 0.08, M.woodDark, [bp[0] + 0.1, bp[1] + 0.52, bp[2]]);
    // 后挡
    mesh(new THREE.SphereGeometry(0.05, 10, 8), M.woodDark, sim.jstopPos);
  }

  // ------------------------------------------------------------------ 浑象（中层）
  {
    const gs = sim.shafts.globe;
    const axis = V3(sim.latAxis);
    const g = new THREE.Group();
    const inner = new THREE.Group();
    inner.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
    g.add(inner);
    mesh(new THREE.SphereGeometry(1.1, 48, 32), M.globe, [0, 0, 0], inner);
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8), M.brass, [0, 0, 0], inner);
    const gH = gearMesh(0.66, 20, 0.12, M.bronze, inner, 0.08); gH.position.set(0, 1.5, 0); gH.rotation.x = Math.PI / 2;
    bind(gs.body, hl('浑象', g));
    // 地柜（地平）：遮住下半球
    const c = gs.pos;
    const cab = new THREE.Group();
    box(2.7, 0.08, 2.7, M.woodLight, [0, 0, 0], cab);
    for (const s of [-1, 1]) { box(2.7, 0.9, 0.08, M.woodDark, [0, -0.45, s * 1.35], cab); box(0.08, 0.9, 2.7, M.woodDark, [s * 1.35, -0.45, 0], cab); }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.16, 1.6, 0.16, M.lacquer, [sx * 1.35, -0.8, sz * 1.35], cab);
    // 地平圈开口
    const ring = mesh(new THREE.TorusGeometry(1.14, 0.05, 8, 48), M.brass, [0, 0.05, 0], cab, { rot: [Math.PI / 2, 0, 0] });
    cab.position.set(c[0], c[1] - 0.04, c[2]);
    scene.add(cab);
    // 地柜顶板挖洞：用遮罩环代替（顶板四边条）
    cab.children[0].visible = false;
    for (const s of [-1, 1]) { box(2.7, 0.08, 0.2, M.woodLight, [0, 0, s * 1.25], cab); box(0.2, 0.08, 2.7, M.woodLight, [s * 1.25, 0, 0], cab); }
    // 浑象内部（地柜内）黑色遮挡，使下半球不显得穿帮
    const disk = mesh(new THREE.CircleGeometry(1.25, 40), new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 1, transparent: true, opacity: 0.0 }), [c[0], c[1] - 0.04, c[2]], null, { rot: [-Math.PI / 2, 0, 0], cast: false });
    // 地平板：带圆孔
    const shape = new THREE.Shape();
    shape.moveTo(-1.35, -1.35); shape.lineTo(1.35, -1.35); shape.lineTo(1.35, 1.35); shape.lineTo(-1.35, 1.35); shape.lineTo(-1.35, -1.35);
    const h = new THREE.Path(); h.absarc(0, 0, 1.12, 0, Math.PI * 2, true); shape.holes.push(h);
    const plate = mesh(new THREE.ShapeGeometry(shape, 48), M.woodLight, [c[0], c[1] - 0.0, c[2]], null, { rot: [-Math.PI / 2, 0, 0] });
  }

  // ------------------------------------------------------------------ 浑仪（顶层）
  {
    const ga = sim.shafts.arm;
    const axis = V3(sim.latAxis);
    const c = ga.pos;
    // 固定部分：地平环、子午环、底座
    const fixed = new THREE.Group();
    mesh(new THREE.TorusGeometry(1.35, 0.045, 8, 64), M.brass, [0, 0, 0], fixed, { rot: [Math.PI / 2, 0, 0] });
    mesh(new THREE.TorusGeometry(1.42, 0.045, 8, 64), M.brass, [0, 0, 0], fixed);
    // 子午环在 yz 平面
    fixed.children[1].rotation.y = Math.PI / 2;
    for (const s of [-1, 1]) rod([s * 1.1, -1.95, s * 0.6], [s * 0.9, -0.5, s * 0.5], 0.05, M.bronze, fixed);
    // 龙柱（简化为扭曲柱）
    for (const s of [-1, 1]) for (const t of [-1, 1]) rod([s * 1.2, -2.0, t * 1.2], [s * 1.0, -0.05, t * 1.0], 0.05, M.bronze, fixed);
    fixed.position.set(c[0], c[1], c[2]);
    scene.add(hl('浑仪', fixed));
    // 转动部分：赤道环 + 四游环 + 窥管
    const g = new THREE.Group();
    const inner = new THREE.Group();
    inner.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
    g.add(inner);
    mesh(new THREE.TorusGeometry(1.2, 0.04, 8, 64), M.brass, [0, 0, 0], inner, { rot: [Math.PI / 2, 0, 0] }); // 赤道
    mesh(new THREE.TorusGeometry(1.08, 0.04, 8, 64), M.brass, [0, 0, 0], inner); // 四游环
    mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.0, 10), M.bronze, [0, 0, 0], inner, { rot: [0, 0, Math.PI / 2] }); // 窥管
    mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.0, 8), M.iron, [0, 0, 0], inner); // 极轴
    const gJ = gearMesh(0.62, 20, 0.1, M.bronze, inner, 0.08); gJ.position.set(0, 1.5, 0); gJ.rotation.x = Math.PI / 2;
    mesh(new THREE.SphereGeometry(0.1, 12, 8), M.brass, [0, 0, 0], inner);
    bind(ga.body, hl('浑仪', g));
  }

  // ------------------------------------------------------------------ 升水轮
  {
    const g = new THREE.Group();
    const R = 2.45;
    for (const z of [-0.35, 0.35]) mesh(new THREE.TorusGeometry(R, 0.05, 8, 64), M.wood, [0, 0, z], g);
    mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 14), M.woodDark, [0, 0, 0], g, { rot: [Math.PI / 2, 0, 0] });
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      for (const z of [-0.35, 0.35]) rod([0, 0, z], [R * Math.cos(a), R * Math.sin(a), z], 0.035, M.wood, g, 6);
      const b = box(0.3, 0.22, 0.6, M.woodLight, [R * Math.cos(a), R * Math.sin(a), 0], g);
      b.rotation.z = a;
    }
    bind(sim.noria, hl('升水轮', g));
    const NP = GEO.noria;
    for (const z of [-0.6, 0.6]) box(0.14, NP[1] - FLOOR, 0.14, M.woodDark, [NP[0], (NP[1] + FLOOR) / 2, z]);
  }

  // ------------------------------------------------------------------ 水滴（实例化）
  const MAXD = 260;
  const dropMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 10, 8), M.drop, MAXD);
  dropMesh.castShadow = false;
  dropMesh.frustumCulled = false;
  scene.add(dropMesh);
  // 平水壶出水口处的连续水柱（由水滴位置连成的线带，直观显示"恒定水流"）

  // ------------------------------------------------------------------ 每帧更新
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpP = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  function localToWorld(body, l) {
    const p = body.translation(), q = body.rotation();
    tmpQ.set(q.x, q.y, q.z, q.w);
    return new THREE.Vector3(l[0], l[1], l[2]).applyQuaternion(tmpQ).add(new THREE.Vector3(p.x, p.y, p.z));
  }
  function update() {
    for (const { body, obj } of bound) {
      const p = body.translation(), q = body.rotation();
      obj.position.set(p.x, p.y, p.z);
      obj.quaternion.set(q.x, q.y, q.z, q.w);
    }
    // 天条
    const a = localToWorld(sim.fork, sim.rodA), b = localToWorld(sim.beam, sim.rodB);
    const len = a.distanceTo(b);
    chain.position.copy(a).add(b).multiplyScalar(0.5);
    chain.scale.set(1, len, 1);
    chain.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    const nLinks = Math.min(60, Math.floor(len / 0.055));
    const dir = b.clone().sub(a).normalize();
    for (let i = 0; i < 60; i++) {
      if (i < nLinks) {
        tmpP.copy(a).addScaledVector(dir, (i + 0.5) * len / nLinks);
        tmpQ.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
        if (i % 2) tmpQ.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2));
        tmpM.compose(tmpP, tmpQ, one);
      } else tmpM.makeScale(0, 0, 0);
      chainLinks.setMatrixAt(i, tmpM);
    }
    chainLinks.instanceMatrix.needsUpdate = true;
    // 水滴
    const n = Math.min(MAXD, sim.drops.length);
    for (let i = 0; i < n; i++) {
      const p = sim.drops[i].body.translation();
      tmpM.makeTranslation(p.x, p.y, p.z);
      dropMesh.setMatrixAt(i, tmpM);
    }
    dropMesh.count = n;
    dropMesh.instanceMatrix.needsUpdate = true;
  }

  // 透视（X 光）效果：讲传动时让墙、楼板、木阁立面变半透明
  // 材质始终处于“可透明”状态（避免切换时重新编译着色器），仅调节不透明度与深度写入
  for (const m of xrayMats) { m.transparent = true; m.opacity = 1; }
  function xray(a) {
    for (const m of xrayMats) {
      m.opacity = 1 - 0.85 * a;
      m.depthWrite = a < 0.05;
    }
  }
  // 绘制调用优化：静态建筑与每个刚体组内部按材质合并
  for (const c of [...scene.children]) if (c.isGroup) mergeGroup(c);
  return { scene, update, highlightables, localToWorld, M, sun, lanterns, xray };
}
