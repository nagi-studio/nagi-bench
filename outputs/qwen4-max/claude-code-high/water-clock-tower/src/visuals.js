// ---------------------------------------------------------------------------
// 视觉层:全部几何体/贴图均在运行时程序化生成,无外部资产。
// 机械部件的位姿每帧从物理刚体同步(绝不在此处手写机械动画)。
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { L, DEG } from './layout.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createVisuals(renderer, machine) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0e18, 0.015);
  const camera = new THREE.PerspectiveCamera(46, 16 / 9, 0.1, 300);

  // ---- 材质 ----------------------------------------------------------------
  const M = {
    woodDark: new THREE.MeshStandardMaterial({ color: 0x5c3222, roughness: 0.82 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x8a5230, roughness: 0.78 }),
    woodRed: new THREE.MeshStandardMaterial({ color: 0x8e3a24, roughness: 0.7 }),
    woodLight: new THREE.MeshStandardMaterial({ color: 0xb07a48, roughness: 0.75 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0x9a7b42, roughness: 0.5, metalness: 0.45 }),
    bronzeDark: new THREE.MeshStandardMaterial({ color: 0x6e5630, roughness: 0.55, metalness: 0.4 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd8b46a, roughness: 0.4, metalness: 0.5, emissive: 0x2a1e08 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x565b63, roughness: 0.95 }),
    stoneDark: new THREE.MeshStandardMaterial({ color: 0x3a3e46, roughness: 0.95 }),
    tile: new THREE.MeshStandardMaterial({ color: 0x1d282a, roughness: 0.9, metalness: 0.0 }),
    water: new THREE.MeshStandardMaterial({ color: 0x59c4e0, roughness: 0.25, transparent: true, opacity: 0.8, emissive: 0x0e4a5e, emissiveIntensity: 0.5 }),
    surface: new THREE.MeshStandardMaterial({ color: 0x2f9db8, roughness: 0.15, transparent: true, opacity: 0.72, emissive: 0x0a3844, emissiveIntensity: 0.6 }),
    globe: new THREE.MeshStandardMaterial({ color: 0x1d3c60, roughness: 0.55, emissive: 0x0a1830, emissiveIntensity: 0.5 }),
    lantern: new THREE.MeshStandardMaterial({ color: 0xffc27a, emissive: 0xff9a3c, emissiveIntensity: 2.2, roughness: 0.5 }),
    robeR: new THREE.MeshStandardMaterial({ color: 0x9e3b2c, roughness: 0.8 }),
    robeT: new THREE.MeshStandardMaterial({ color: 0x2e6e62, roughness: 0.8 }),
    robeO: new THREE.MeshStandardMaterial({ color: 0xa8763a, roughness: 0.8 }),
    skin: new THREE.MeshStandardMaterial({ color: 0xd9b48f, roughness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x141821, roughness: 0.9 }),
  };

  const syncList = [];
  const bind = (body, obj) => { syncList.push({ body, obj }); scene.add(obj); return obj; };

  const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    return m;
  };
  const box = (w, h, d, mat, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
  const cyl = (rt, rb, h, mat, seg = 14) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);

  // 合并几何工具
  const geoBag = [];
  const pushBox = (w, h, d, x, y, z, rz = 0, ry = 0, rx = 0) => {
    const g = new THREE.BoxGeometry(w, h, d);
    const m = new THREE.Matrix4().compose(V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), V3(1, 1, 1));
    g.applyMatrix4(m); geoBag.push(g);
  };
  const pushCyl = (rt, rb, h, x, y, z, rx = 0, rz = 0, seg = 10) => {
    const g = new THREE.CylinderGeometry(rt, rb, h, seg);
    const m = new THREE.Matrix4().compose(V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, 0, rz)), V3(1, 1, 1));
    g.applyMatrix4(m); geoBag.push(g);
  };
  const flush = (mat, parent = scene) => {
    if (!geoBag.length) return null;
    const g = mergeGeometries(geoBag.splice(0), false);
    const m = new THREE.Mesh(g, mat);
    parent.add(m);
    return m;
  };

  // ---- 天空 / 环境 ----------------------------------------------------------
  const skyGeo = new THREE.SphereGeometry(140, 24, 16);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x04060e) }, mid: { value: new THREE.Color(0x141d38) }, bot: { value: new THREE.Color(0x241d2a) } },
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 top,mid,bot; varying vec3 vP;
      void main(){ float h = normalize(vP).y; vec3 c = h>0.0 ? mix(mid,top,pow(h,0.65)) : mix(mid,bot,pow(-h,0.5));
      gl_FragColor = vec4(c,1.0); }`,
  });
  scene.add(new THREE.Mesh(skyGeo, skyMat));

  const glowTex = canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  });

  // 星
  {
    const n = 1400, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.92);
      const r = 120;
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) + 4;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 0.9, map: glowTex, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false, fog: false }));
    scene.add(stars);
  }

  const glow = (color, scale, x, y, z, opacity = 0.8) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    s.scale.setScalar(scale); s.position.set(x, y, z);
    scene.add(s); return s;
  };

  // 月
  const moon = mesh(new THREE.SphereGeometry(3.2, 20, 20), new THREE.MeshBasicMaterial({ color: 0xe8ecf5, fog: false }), -58, 36, -62);
  scene.add(moon); glow(0xaabbee, 14, -58, 36, -62, 0.35);

  // 地面与远城
  scene.add(mesh(new THREE.CircleGeometry(90, 48), new THREE.MeshStandardMaterial({ color: 0x10131c, roughness: 1 }), 0, 0, 0).rotateX(-Math.PI / 2));
  {
    const g = new THREE.BoxGeometry(1, 1, 1);
    const inst = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ color: 0x0c1019, roughness: 1 }), 46);
    const d = new THREE.Object3D();
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 2 + Math.sin(i * 7.3) * 0.2;
      const r = 40 + (i % 5) * 6;
      const h = 2 + ((i * 37) % 7);
      d.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
      d.scale.set(2.5 + (i % 3), h, 2.5 + ((i + 1) % 3));
      d.rotation.y = a;
      d.updateMatrix(); inst.setMatrixAt(i, d.matrix);
    }
    scene.add(inst);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      glow(0xff9a4c, 1.6, Math.cos(a) * 30, 1.5 + (i % 4), Math.sin(a) * 30, 0.35);
    }
  }

  // ---- 灯光 ----------------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0x36436e, 0x1c130c, 0.6));
  const moonLight = new THREE.DirectionalLight(0x93a9e6, 0.7);
  moonLight.position.set(-14, 20, -10);
  scene.add(moonLight);
  const fill = new THREE.DirectionalLight(0x5a6a9a, 0.5);
  fill.position.set(10, 8, 14);
  scene.add(fill);
  const warm1 = new THREE.PointLight(0xffa85c, 16, 11, 2); warm1.position.set(0.4, 3.5, 1.7); scene.add(warm1);
  const warm2 = new THREE.PointLight(0xffa85c, 13, 10, 2); warm2.position.set(0, 6.4, 1.6); scene.add(warm2);
  const warm3 = new THREE.PointLight(0xffb46a, 9, 8, 2); warm3.position.set(0.3, 5.7, 3.6); scene.add(warm3);
  const topLight = new THREE.PointLight(0x8fb0ff, 10, 9, 2); topLight.position.set(0, 10.4, 1.2); scene.add(topLight);

  // ---- 台基 ----------------------------------------------------------------
  scene.add(box(7.0, 0.7, 7.0, M.stone, 0, 0.35, 0));
  scene.add(box(7.5, 0.18, 7.5, M.stoneDark, 0, 0.09, 0));
  for (let i = 0; i < 3; i++) scene.add(box(2.4, 0.22, 0.5, M.stone, 0, 0.12 + i * 0.22, 3.75 + (2 - i) * 0.45));
  // 台基接触阴影(伪造软阴影)
  {
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(11, 11), new THREE.MeshBasicMaterial({ map: glowTex, color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.02; scene.add(sh);
  }

  // ---- 栏杆工具 -------------------------------------------------------------
  const railing = (half, y, h, parent = scene, gapFront = false, cx0 = 0, cz0 = 0) => {
    const n = 7;
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i <= n; i++) {
        const t = -half + (2 * half * i) / n;
        let x, z;
        if (side === 0) { x = t; z = half; } else if (side === 1) { x = t; z = -half; }
        else if (side === 2) { x = half; z = t; } else { x = -half; z = t; }
        if (gapFront && side === 0 && Math.abs(t) < half * 0.4) continue;
        pushBox(0.07, h, 0.07, x + cx0, y + h / 2, z + cz0);
        pushBox(0.11, 0.06, 0.11, x + cx0, y + h + 0.03, z + cz0);
      }
    }
    for (let side = 0; side < 4; side++) {
      const horiz = side < 2;
      const len = gapFront && side === 0 ? half * 0.6 : half;
      for (const sgn of gapFront && side === 0 ? [-1, 1] : [0]) {
        const cx = horiz ? (sgn ? sgn * (half * 0.7) : 0) : (side === 2 ? half : -half);
        const cz = horiz ? (side === 0 ? half : -half) : 0;
        pushBox(horiz ? len * 2 : 0.05, 0.06, horiz ? 0.05 : half * 2, cx + cx0, y + h * 0.92, cz + cz0);
        pushBox(horiz ? len * 2 : 0.04, 0.04, horiz ? 0.04 : half * 2, cx + cx0, y + h * 0.5, cz + cz0);
      }
    }
    flush(M.woodRed, parent);
  };

  // ---- 底层柱墙 -------------------------------------------------------------
  const latticeTex = canvasTexture(128, 128, (ctx) => {
    ctx.fillStyle = '#3a2417'; ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#6b4a2e'; ctx.lineWidth = 5;
    for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i * 32, 0); ctx.lineTo(i * 32, 128); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * 32); ctx.lineTo(128, i * 32); ctx.stroke(); }
    ctx.strokeStyle = '#54381f'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { ctx.strokeRect(i * 32 + 8, j * 32 + 8, 16, 16); }
  });
  latticeTex.wrapS = latticeTex.wrapT = THREE.RepeatWrapping;
  const latticeMat = new THREE.MeshStandardMaterial({ map: latticeTex, color: 0xb09070, roughness: 0.85 });

  const storey = (half, y0, y1, withWalls = true) => {
    const h = y1 - y0;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      pushCyl(0.15, 0.17, h, sx * (half - 0.15), y0 + h / 2, sz * (half - 0.15));
    }
    // 额枋
    pushBox(half * 2, 0.22, 0.18, 0, y1 - 0.11, half - 0.1);
    pushBox(half * 2, 0.22, 0.18, 0, y1 - 0.11, -half + 0.1);
    pushBox(0.18, 0.22, half * 2, half - 0.1, y1 - 0.11, 0);
    pushBox(0.18, 0.22, half * 2, -half + 0.1, y1 - 0.11, 0);
    flush(M.woodRed);
    if (withWalls) {
      // 单面朝内的墙:剖面视角,机内镜头不会撞墙
      const wm = latticeMat;
      const mk = (w, hh, x, y, z, ry) => {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), wm);
        p.position.set(x, y, z); p.rotation.y = ry; scene.add(p);
      };
      mk(half * 2 - 0.4, h - 0.4, 0, y0 + h / 2, -half + 0.12, 0);
      mk(half * 2 - 0.4, h - 0.4, -half + 0.12, y0 + h / 2, 0, -Math.PI / 2);
      mk(half * 2 - 0.4, h - 0.4, half - 0.12, y0 + h / 2, 0, Math.PI / 2);
      // 裙板
      pushBox(half * 2 - 0.3, 0.5, 0.12, 0, y0 + 0.25, -half + 0.12);
      pushBox(0.12, 0.5, half * 2 - 0.3, -half + 0.12, y0 + 0.25, 0);
      pushBox(0.12, 0.5, half * 2 - 0.3, half - 0.12, y0 + 0.25, 0);
      flush(M.woodDark);
    }
  };
  storey(L.storey1.half, L.storey1.y0, L.storey1.y1);
  storey(L.storey2.half, L.storey2.y0, L.storey2.y1);

  // ---- 屋檐(攒尖裙檐,Lathe 4 段) ------------------------------------------
  const roof = (y, rOut, rIn, h) => {
    const pts = [];
    const n = 9;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const r = rOut + (rIn - rOut) * t;
      const yy = h * Math.pow(t, 1.55) + (t < 0.12 ? (0.12 - t) * 0.55 : 0); // 檐口微翘
      pts.push(new THREE.Vector2(r, yy));
    }
    const g = new THREE.LatheGeometry(pts, 4);
    const m = new THREE.Mesh(g, M.tile);
    m.rotation.y = Math.PI / 4;
    m.position.y = y;
    m.material.side = THREE.DoubleSide;
    scene.add(m);
    // 檐口封板 + 角梁
    const fascia = new THREE.Mesh(new THREE.TorusGeometry(rOut * 0.985, 0.055, 6, 4), M.woodDark);
    fascia.rotation.x = Math.PI / 2; fascia.rotation.z = Math.PI / 4;
    fascia.position.y = y + 0.02; fascia.scale.set(1, 1, 1);
    scene.add(fascia);
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2;
      const tip = glow(0xffb46a, 0.7, Math.cos(a) * rOut * 0.98, y + 0.28, Math.sin(a) * rOut * 0.98, 0.5);
      tip.userData.corner = true;
    }
  };
  roof(L.storey1.y1, 5.35, 3.45, 0.95);
  roof(L.storey2.y1, 4.85, 2.75, 0.9);

  // 顶层平台
  scene.add(box(5.2, 0.35, 5.2, M.wood, 0, L.topDeck.y + 0.17, 0));
  railing(2.5, L.topDeck.y + 0.35, 0.62);
  // 匾额
  const plaqueTex = canvasTexture(512, 128, (ctx) => {
    ctx.fillStyle = '#181008'; ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#d8b46a'; ctx.lineWidth = 6; ctx.strokeRect(10, 10, 492, 108);
    ctx.fillStyle = '#e8c87a'; ctx.font = '700 72px "Noto Serif CJK SC", serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('水运仪象台', 256, 70);
  });
  scene.add(box(2.3, 0.58, 0.08, new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.6 }), 0, 7.28, 2.78));

  // 灯笼
  const lanterns = [];
  const lantern = (x, y, z, s = 1) => {
    const g = new THREE.Group();
    g.add(mesh(new THREE.SphereGeometry(0.16 * s, 12, 10), M.lantern));
    const cap = cyl(0.06 * s, 0.06 * s, 0.05, M.woodDark, 8); cap.position.y = 0.17 * s; g.add(cap);
    const str = cyl(0.008, 0.008, 0.3, M.woodDark, 5); str.position.y = 0.33 * s; g.add(str);
    g.position.set(x, y, z);
    scene.add(g);
    const gl = glow(0xff9a3c, 1.5 * s, x, y, z, 0.65);
    lanterns.push({ g, gl, base: 0.65, ph: Math.random() * 9 });
    return g;
  };
  lantern(-2.9, 4.15, 2.9); lantern(2.9, 4.15, 2.9);
  lantern(-2.5, 7.15, 2.5); lantern(2.5, 7.15, 2.5);
  lantern(-1.6, 5.0, 3.15, 0.8); lantern(1.7, 6.6, 3.15, 0.8);

  // ---- 枢轮 ----------------------------------------------------------------
  const wheelGroup = new THREE.Group();
  {
    const R = L.wheel.R;
    // 轮缘双环
    for (const z of [-0.3, 0.3]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R - 0.05, 0.05, 8, 56), M.wood);
      ring.position.z = z; wheelGroup.add(ring);
    }
    // 36 受水壶(与物理形状一致)
    for (let i = 0; i < L.wheel.buckets; i++) {
      const th = machine.bucketLocalAngles[i];
      const u = V3(Math.cos(th), Math.sin(th), 0);
      const q = new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), th);
      const plates = [
        [0.05, 0.32, 0.54, R - 0.12, 0, 0],
        [0.38, 0.32, 0.04, R + 0.05, 0, 0.27],
        [0.38, 0.32, 0.04, R + 0.05, 0, -0.27],
        [0.12, 0.04, 0.54, R - 0.08, 0.14, 0],
      ];
      for (const [w, h, d, r, off, z] of plates) {
        const g = new THREE.BoxGeometry(w, h, d);
        const p = V3(u.x * r - Math.sin(th) * off, u.y * r + Math.cos(th) * off, z);
        g.applyMatrix4(new THREE.Matrix4().compose(p, q, V3(1, 1, 1)));
        geoBag.push(g);
      }
    }
    flush(M.woodLight, wheelGroup);
    // 辐条 + 轮毂 + 轴
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      pushBox(1.5, 0.09, 0.07, Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0, a);
    }
    pushCyl(0.18, 0.18, 0.66, 0, 0, 0, Math.PI / 2);
    pushCyl(0.07, 0.07, 1.5, 0, 0, -0.2, Math.PI / 2);
    flush(M.woodDark, wheelGroup);
    // 锁销(天关所擒)
    for (let i = 0; i < 36; i++) {
      const a = (20 + i * 10) * DEG;
      pushCyl(0.035, 0.035, 0.12, Math.cos(a) * 1.5, Math.sin(a) * 1.5, -0.34, Math.PI / 2, 0, 8);
    }
    flush(M.bronze, wheelGroup);
    // 大齿轮(主动)
    pushCyl(0.5, 0.5, 0.07, 0, 0, -0.55, Math.PI / 2, 0, 24);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      pushBox(0.1, 0.09, 0.07, Math.cos(a) * 0.53, Math.sin(a) * 0.53, -0.55, a);
    }
    flush(M.bronzeDark, wheelGroup);
  }
  bind(machine.bodies.wheel, wheelGroup);

  // ---- 天衡 ----------------------------------------------------------------
  const leverGroup = new THREE.Group();
  {
    const P = L.lever;
    const bar = (x1, y1, w, d, mat) => {
      const dx = x1 - P.px, dy = y1 - P.py, len = Math.hypot(dx, dy);
      const g = new THREE.BoxGeometry(len, w * 2, d * 2);
      g.applyMatrix4(new THREE.Matrix4().compose(V3(dx / 2, dy / 2, 0), new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), Math.atan2(dy, dx)), V3(1, 1, 1)));
      const m = new THREE.Mesh(g, mat); leverGroup.add(m);
    };
    bar(0.45, 4.16, 0.035, 0.03, M.wood);
    bar(1.62, 4.62, 0.035, 0.03, M.wood);
    bar(1.41, 3.18, 0.028, 0.028, M.bronze);
    leverGroup.add(box(0.12, 0.14, 0.1, M.bronze, 0.45 - P.px, 4.12 - P.py, 0));
    leverGroup.add(box(0.28, 0.36, 0.24, M.bronzeDark, 1.86 - P.px, 4.32 - P.py, 0));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 6, 12), M.gold);
    ring.position.set(1.86 - P.px, 4.52 - P.py, 0); leverGroup.add(ring);
  }
  bind(machine.bodies.lever, leverGroup);
  // 衡枢支架(静态)
  scene.add(box(0.12, 1.0, 0.12, M.woodDark, L.lever.px, L.lever.py - 0.5, L.lever.pz - 0.14));
  scene.add(box(0.5, 0.1, 0.3, M.woodDark, L.lever.px, L.lever.py + 0.08, L.lever.pz));

  // ---- 水系统 ---------------------------------------------------------------
  const tankBuild = (t, waterY) => {
    const g = new THREE.Group();
    const { w, h, d } = t;
    g.add(box(w, 0.06, d, M.bronzeDark, 0, -h / 2, 0));
    g.add(box(w, h, 0.05, M.bronze, 0, 0, d / 2));
    g.add(box(w, h, 0.05, M.bronze, 0, 0, -d / 2));
    g.add(box(0.05, h, d, M.bronze, w / 2, 0, 0));
    g.add(box(0.05, h, d, M.bronze, -w / 2, 0, 0));
    const surf = box(w - 0.08, 0.02, d - 0.08, M.surface, 0, waterY, 0);
    g.add(surf);
    g.position.set(t.x, t.y, t.z);
    scene.add(g);
    return g;
  };
  tankBuild(L.skyTank, 0.14);
  tankBuild(L.tank, 0.1);
  // 天池 → 平水壶 下水管(渴乌)
  pushCyl(0.06, 0.06, 1.55, L.skyTank.x - 0.4, 6.2, L.skyTank.z + 0.3);
  pushCyl(0.06, 0.06, 1.15, L.skyTank.x - 0.4, 5.45, -0.28, Math.PI / 2);
  pushCyl(0.06, 0.06, 0.5, L.tank.x + 0.2, 5.55, 0);
  flush(M.bronzeDark);
  // 平水壶 → 注水口 渡槽
  pushBox(1.1, 0.04, 0.16, 0.85, 4.94, 0);
  pushBox(1.1, 0.07, 0.03, 0.85, 4.98, 0.08);
  pushBox(1.1, 0.07, 0.03, 0.85, 4.98, -0.08);
  pushBox(0.16, 0.04, 0.16, L.spout.x, 4.9, 0);
  flush(M.bronze);
  scene.add(box(1.05, 0.025, 0.1, M.surface, 0.85, 4.965, 0));
  // 溢流唇 → 退水管
  pushBox(0.3, 0.04, 0.14, L.overflowLip.x + 0.1, L.overflowLip.y - 0.02, L.overflowLip.z);
  pushCyl(0.05, 0.05, 4.2, L.overflowLip.x + 0.24, 3.1, L.overflowLip.z);
  flush(M.bronzeDark);
  // 退水池
  scene.add(box(2.9, 0.26, 1.5, M.stoneDark, 1.25, 0.78, 0.1));
  scene.add(box(2.7, 0.03, 1.3, M.surface, 1.25, L.basinY, 0.1));
  // 支架(平水壶/天池托架)
  pushBox(0.12, 1.6, 0.12, L.tank.x + 0.45, 4.4, 0.3);
  pushBox(0.12, 1.6, 0.12, L.tank.x + 0.45, 4.4, -0.3);
  pushBox(0.12, 2.4, 0.12, L.skyTank.x + 0.6, 5.85, L.skyTank.z + 0.4);
  pushBox(0.12, 2.4, 0.12, L.skyTank.x - 0.6, 5.85, L.skyTank.z + 0.4);
  flush(M.woodDark);

  // ---- 传动轴与齿轮 ----------------------------------------------------------
  const gearMesh = (r, teeth, thick, mat) => {
    const g = new THREE.Group();
    g.add(cyl(r, r, thick, mat, 22));
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const t = box(0.09, thick, 0.08, mat, Math.cos(a) * (r + 0.035), 0, Math.sin(a) * (r + 0.035));
      t.rotation.y = -a; g.add(t);
    }
    return g;
  };
  const shaftGroup = (len, axis, gears) => {
    const g = new THREE.Group();
    const sh = cyl(0.06, 0.06, len, M.woodDark, 10);
    if (axis === 'z') sh.rotation.x = Math.PI / 2;
    g.add(sh);
    for (const [r, teeth, off, rot] of gears) {
      const gm = gearMesh(r, teeth, 0.07, M.bronzeDark);
      if (axis === 'z') { gm.rotation.x = Math.PI / 2; gm.position.z = off; }
      else { gm.position.y = off; if (rot) gm.rotation.z = rot; }
      g.add(gm);
    }
    return g;
  };
  // 中间轴:小齿轮与大齿轮啮合(z=-0.55),后端锥齿轮
  const layG = shaftGroup(1.75, 'z', [[0.2, 10, -0.55], [0.24, 12, -1.62]]);
  bind(machine.bodies.lay, layG);
  // 立轴(天梯):上下锥齿轮 + 中段驱动轮
  const vertG = shaftGroup(7.3, 'y', [[0.24, 12, -3.6], [0.2, 10, 0.55], [0.2, 10, 2.9]]);
  bind(machine.bodies.vert, vertG);
  const hsGG = shaftGroup(1.55, 'z', [[0.16, 9, -0.72], [0.16, 9, 0.7]]);
  bind(machine.bodies.hsG, hsGG);
  const hsAG = shaftGroup(1.85, 'z', [[0.16, 9, -0.88], [0.16, 9, 0.85]]);
  bind(machine.bodies.hsA, hsAG);
  // 轴承架
  pushBox(0.3, 0.3, 0.16, 0, L.lay.y, -1.95);
  pushBox(0.24, 0.24, 0.2, L.vert.x, 4.4, L.vert.z);
  pushBox(0.24, 0.24, 0.2, L.vert.x, 7.3, L.vert.z);
  flush(M.woodDark);

  // ---- 浑象(天球仪) ---------------------------------------------------------
  const globeGroup = new THREE.Group();
  {
    globeGroup.add(mesh(new THREE.SphereGeometry(L.globe.r, 36, 28), M.globe));
    const n = 700, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      const r = L.globe.r * 1.006;
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    globeGroup.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe9b0, size: 0.055, map: glowTex, transparent: true, opacity: 0.95, depthWrite: false })));
    const eq = new THREE.Mesh(new THREE.TorusGeometry(L.globe.r * 1.015, 0.014, 6, 48), M.gold);
    eq.rotation.x = Math.PI / 2; globeGroup.add(eq);
    const ecl = new THREE.Mesh(new THREE.TorusGeometry(L.globe.r * 1.02, 0.012, 6, 48), M.bronze);
    ecl.rotation.x = Math.PI / 2 + 24 * DEG; globeGroup.add(ecl);
    // 极轴
    const axis = cyl(0.025, 0.025, 2.5, M.bronze, 8);
    axis.quaternion.setFromUnitVectors(V3(0, 1, 0), V3(L.polar.x, L.polar.y, L.polar.z));
    globeGroup.add(axis);
  }
  bind(machine.bodies.globe, globeGroup);
  // 浑象静态框架:子午环 + 底座
  {
    const mer = new THREE.Mesh(new THREE.TorusGeometry(L.globe.r * 1.16, 0.035, 8, 48), M.bronzeDark);
    mer.position.set(L.globe.x, L.globe.y, L.globe.z);
    mer.rotation.y = Math.PI / 2;
    mer.rotation.x = 0;
    scene.add(mer);
    const hor = new THREE.Mesh(new THREE.TorusGeometry(L.globe.r * 1.2, 0.04, 8, 48), M.bronzeDark);
    hor.position.set(L.globe.x, L.globe.y - 0.25, L.globe.z);
    hor.rotation.x = Math.PI / 2; scene.add(hor);
    for (const sx of [-1, 1]) {
      scene.add(box(0.12, 1.3, 0.12, M.woodRed, L.globe.x + sx * 0.9, L.globe.y - 0.95, L.globe.z - 0.6));
    }
    scene.add(box(2.1, 0.12, 0.7, M.woodDark, L.globe.x, L.globe.y - 1.6, L.globe.z - 0.6));
  }

  // ---- 浑仪(台顶) -----------------------------------------------------------
  const armGroup = new THREE.Group();
  {
    const inner = new THREE.Group();
    inner.quaternion.setFromUnitVectors(V3(0, 1, 0), V3(L.polar.x, L.polar.y, L.polar.z));
    const ring = (r, tube, mat, rx = 0, rz = 0) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, 48), mat);
      t.rotation.x = rx; t.rotation.z = rz; inner.add(t); return t;
    };
    ring(0.8, 0.035, M.bronze, Math.PI / 2);            // 赤道环
    ring(0.72, 0.03, M.gold, Math.PI / 2 + 24 * DEG);   // 黄道环
    ring(0.62, 0.028, M.bronze);                        // 四游环(含极轴)
    ring(0.62, 0.028, M.bronze, 0, 0).position.z = 0.07;
    const tube = cyl(0.045, 0.045, 1.05, M.bronzeDark, 10); // 窥管
    tube.rotation.z = 0.5; tube.position.set(0.1, 0.05, 0.035);
    inner.add(tube);
    const ax = cyl(0.03, 0.03, 1.9, M.bronze, 8); inner.add(ax);
    armGroup.add(inner);
  }
  bind(machine.bodies.armillary, armGroup);
  {
    const A = L.armillary;
    const fix = (r, tube, rx, ry) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, 56), M.bronzeDark);
      t.position.set(A.x, A.y, A.z); t.rotation.x = rx; t.rotation.y = ry; scene.add(t);
    };
    fix(0.95, 0.045, 0, 0);                 // 子午环
    fix(0.95, 0.045, Math.PI / 2, 0);       // 地平环
    // 龙柱支撑(简化为斜柱 + 云板)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const c = cyl(0.07, 0.1, 1.15, M.woodRed, 8);
      c.position.set(A.x + sx * 0.55, A.y - 0.85, A.z + sz * 0.55);
      c.rotation.z = sx * 0.28; c.rotation.x = -sz * 0.28;
      scene.add(c);
    }
    scene.add(box(1.7, 0.14, 1.7, M.woodDark, A.x, A.y - 1.4, A.z));
    scene.add(box(1.9, 0.1, 1.9, M.wood, A.x, A.y - 1.5, A.z));
  }

  // ---- 木阁(报时层) ---------------------------------------------------------
  const CZ = L.carousel.z;
  {
    // 五层阁体框架
    const tiers = [4.85, 5.4, 5.95, 6.5, 7.05];
    for (const y of tiers) {
      pushBox(2.0, 0.07, 0.85, 0, y - 0.28, CZ);
      pushBox(2.0, 0.07, 0.85, 0, y + 0.28, CZ);
      // 前壁留门洞
      pushBox(0.62, 0.56, 0.06, -0.69, y, CZ + 0.42);
      pushBox(0.62, 0.56, 0.06, 0.69, y, CZ + 0.42);
      pushBox(0.76, 0.1, 0.06, 0, y + 0.24, CZ + 0.42);
    }
    pushBox(0.08, 2.8, 0.85, -1.0, 5.95, CZ);
    pushBox(0.08, 2.8, 0.85, 1.0, 5.95, CZ);
    pushBox(2.0, 2.8, 0.06, 0, 5.95, CZ - 0.42);
    flush(M.woodRed);
    // 阁顶小檐
    const pts = [new THREE.Vector2(1.55, 0), new THREE.Vector2(1.2, 0.16), new THREE.Vector2(0.7, 0.34), new THREE.Vector2(0.12, 0.5)];
    const cap = new THREE.Mesh(new THREE.LatheGeometry(pts, 4), M.tile);
    cap.rotation.y = Math.PI / 4; cap.position.set(0, 7.35, CZ);
    cap.material.side = THREE.DoubleSide; scene.add(cap);
    const fin = mesh(new THREE.SphereGeometry(0.09, 10, 10), M.gold, 0, 7.9, CZ); scene.add(fin);
    // 门洞拱券装饰
    for (const y of tiers) {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 6, 16, Math.PI), M.gold);
      arch.position.set(0, y + 0.02, CZ + 0.45); scene.add(arch);
    }
  }
  // 木人轮(同步物理刚体)
  const carGroup = new THREE.Group();
  {
    carGroup.add(cyl(0.16, 0.16, 2.5, M.woodDark, 12));
    const figGeo = (() => {
      const robe = new THREE.CylinderGeometry(0.075, 0.115, 0.34, 10); robe.translate(0, 0.17, 0);
      const head = new THREE.SphereGeometry(0.062, 10, 8); head.translate(0, 0.4, 0);
      const hat = new THREE.BoxGeometry(0.15, 0.05, 0.13); hat.translate(0, 0.46, 0);
      const arms = new THREE.BoxGeometry(0.2, 0.05, 0.06); arms.translate(0, 0.28, 0.07);
      return mergeGeometries([robe, head, hat, arms]);
    })();
    const plaqueGeo = new THREE.BoxGeometry(0.1, 0.15, 0.02);
    plaqueGeo.translate(0, 0.3, 0.13);
    const tiers = [[-0.78, M.robeO], [0, M.robeR], [0.78, M.robeT]];
    const d = new THREE.Object3D();
    for (const [dy, mat] of tiers) {
      const inst = new THREE.InstancedMesh(figGeo, mat, 12);
      const plq = new THREE.InstancedMesh(plaqueGeo, M.gold, 12);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        d.position.set(Math.sin(a) * L.carousel.r, dy - 0.2, Math.cos(a) * L.carousel.r);
        d.rotation.set(0, a, 0);
        d.updateMatrix();
        inst.setMatrixAt(i, d.matrix); plq.setMatrixAt(i, d.matrix);
      }
      carGroup.add(inst); carGroup.add(plq);
    }
  }
  bind(machine.bodies.carousel, carGroup);

  // ---- 鼓 / 钟 / 槌木人 ------------------------------------------------------
  const drumG = new THREE.Group();
  {
    const body = cyl(L.drum.r, L.drum.r, L.drum.len, M.woodRed, 20);
    body.rotation.x = Math.PI / 2; drumG.add(body);
    for (const z of [-L.drum.len / 2, L.drum.len / 2]) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(L.drum.r, 0.025, 6, 24), M.gold);
      rim.position.z = z; drumG.add(rim);
      const face = mesh(new THREE.CircleGeometry(L.drum.r - 0.02, 24), M.skin, 0, 0, z + Math.sign(z) * 0.005);
      drumG.add(face);
    }
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      drumG.add(mesh(new THREE.SphereGeometry(0.02, 6, 6), M.gold, Math.cos(a) * (L.drum.r - 0.04), Math.sin(a) * (L.drum.r - 0.04), L.drum.len / 2 + 0.01));
    }
    drumG.position.set(L.drum.x, L.drum.y, L.drum.z);
    scene.add(drumG);
    // 鼓架
    scene.add(box(0.08, 0.5, 0.08, M.woodDark, -0.32, 4.95, L.drum.z));
    scene.add(box(0.08, 0.5, 0.08, M.woodDark, 0.32, 4.95, L.drum.z));
    scene.add(box(0.8, 0.07, 0.12, M.woodDark, 0, 4.72, L.drum.z));
  }
  const hammerG = new THREE.Group();
  {
    hammerG.add(box(0.05, 0.46, 0.05, M.woodLight, 0, -0.23, 0));
    hammerG.add(mesh(new THREE.SphereGeometry(0.085, 10, 8), M.woodDark, 0, -0.5, 0));
  }
  bind(machine.bodies.hammer, hammerG);
  // 击鼓木人(静态躯干,手臂即物理摆)
  const drummer = new THREE.Group();
  {
    const robe = cyl(0.09, 0.13, 0.4, M.robeR, 10); robe.position.y = -0.2; drummer.add(robe);
    drummer.add(mesh(new THREE.SphereGeometry(0.07, 10, 8), M.skin, 0, 0.08, 0));
    drummer.add(box(0.17, 0.05, 0.15, M.dark, 0, 0.15, 0));
    drummer.position.set(L.hammerPivot.x - 0.16, L.hammerPivot.y - 0.06, L.hammerPivot.z - 0.06);
    scene.add(drummer);
  }
  // 钟
  const bellG = new THREE.Group();
  {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      pts.push(new THREE.Vector2(0.055 + 0.13 * Math.pow(t, 1.7), -0.34 * t));
    }
    const g = new THREE.LatheGeometry(pts, 18);
    bellG.add(new THREE.Mesh(g, M.bronze));
    bellG.add(mesh(new THREE.SphereGeometry(0.045, 8, 8), M.gold, 0, 0.02, 0));
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.014, 6, 10), M.bronzeDark);
    loop.position.y = 0.06; bellG.add(loop);
  }
  bind(machine.bodies.bell, bellG);
  scene.add(box(0.5, 0.08, 0.1, M.woodDark, L.bellPivot.x, L.bellPivot.y + 0.1, L.bellPivot.z));
  scene.add(box(0.07, 0.62, 0.07, M.woodDark, L.bellPivot.x + 0.24, L.bellPivot.y - 0.2, L.bellPivot.z));
  const malletG = new THREE.Group();
  {
    malletG.add(box(0.04, 0.32, 0.04, M.woodLight, 0, -0.16, 0));
    const head = cyl(0.055, 0.055, 0.13, M.woodDark, 8);
    head.rotation.x = Math.PI / 2; head.position.set(0, -0.36, 0); malletG.add(head);
  }
  bind(machine.bodies.mallet, malletG);
  const bellman = new THREE.Group();
  {
    const robe = cyl(0.08, 0.12, 0.36, M.robeT, 10); robe.position.y = -0.18; bellman.add(robe);
    bellman.add(mesh(new THREE.SphereGeometry(0.065, 10, 8), M.skin, 0, 0.06, 0));
    bellman.add(box(0.15, 0.05, 0.14, M.dark, 0, 0.12, 0));
    bellman.position.set(L.malletPivot.x + 0.2, L.malletPivot.y - 0.02, L.malletPivot.z + 0.02);
    scene.add(bellman);
  }
  // 报时层地板(前廊)
  scene.add(box(2.6, 0.1, 1.1, M.wood, 0.2, 4.68, 2.95));
  railing(1.25, 4.73, 0.45, scene, true, 0.2, 2.95);

  // ---- 水珠(实例化,逐帧同步物理球) ----------------------------------------
  const waterInst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), M.water, 128);
  waterInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  waterInst.frustumCulled = false;
  scene.add(waterInst);
  const dummy = new THREE.Object3D();

  // ---- 标注锚点 -------------------------------------------------------------
  const anchors = {
    skyTank: V3(L.skyTank.x, L.skyTank.y + 0.45, L.skyTank.z),
    tank: V3(L.tank.x, L.tank.y + 0.42, L.tank.z),
    spout: V3(L.spout.x, L.spout.y + 0.15, L.spout.z),
    bucket: V3(0.55, 4.35, 0.3),
    lever: V3(L.lever.px + 0.55, L.lever.py + 0.3, L.lever.pz),
    weight: V3(1.86, 4.62, -0.34),
    wheel: V3(-1.3, 3.3, 0.3),
    gear: V3(0.35, 2.2, -0.55),
    vert: V3(0.25, 4.9, -1.8),
    globe: V3(L.globe.x + 0.9, L.globe.y + 0.75, L.globe.z),
    armillary: V3(L.armillary.x + 0.85, L.armillary.y + 0.7, L.armillary.z),
    carousel: V3(-0.85, 6.6, CZ + 0.4),
    drum: V3(L.drum.x - 0.35, L.drum.y + 0.42, L.drum.z),
    bell: V3(L.bell.x + 0.28, L.bell.y + 0.42, L.bell.z),
    basin: V3(1.9, 1.05, 0.6),
  };

  // ---- 每帧同步 -------------------------------------------------------------
  const q = new THREE.Quaternion();
  let flick = 0;
  const update = (t, dt) => {
    for (const { body, obj } of syncList) {
      obj.position.set(body.position.x, body.position.y, body.position.z);
      obj.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
    }
    let n = 0;
    for (const b of machine.balls) {
      if (!b.userData.active) continue;
      dummy.position.set(b.position.x, b.position.y, b.position.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      waterInst.setMatrixAt(n++, dummy.matrix);
    }
    waterInst.count = n;
    waterInst.instanceMatrix.needsUpdate = true;
    // 灯火摇曳(呈现层)
    flick += dt;
    for (const l of lanterns) {
      const f = 0.85 + 0.15 * Math.sin(flick * 7 + l.ph) * Math.sin(flick * 3.1 + l.ph * 2);
      l.gl.material.opacity = l.base * f;
    }
    warm1.intensity = 16 * (0.92 + 0.08 * Math.sin(flick * 6.3));
    warm2.intensity = 13 * (0.92 + 0.08 * Math.sin(flick * 5.1 + 2));
    warm3.intensity = 9 * (0.92 + 0.08 * Math.sin(flick * 7.7 + 4));
  };

  return { scene, camera, update, anchors, materials: M };
}
