import * as THREE from 'three';
import './style.css';

/* ---------------------------------------------------------------- manifest */
// Structured voice cue list: every on-screen subtitle is driven from here so
// each line can later be recorded against its id.
// fields: id, kind, speaker, text, delivery, start, end
const CUES = [
  { id: 'c01', kind: 'narration', speaker: '旁白', text: '他用了十三年，去赌一个可能性。', delivery: '低沉、克制', start: 2.0, end: 8.0 },
  { id: 'c02', kind: 'dialogue', speaker: '章北海', text: '常规推进，会让人类在第一次接触时就没有第二次机会。', delivery: '平静、几乎听不出情绪', start: 9.0, end: 16.5 },
  { id: 'c03', kind: 'dialogue', speaker: '老航天', text: '小章，工程是要讲余量的。你说的那套东西，五十年内看不见结果。', delivery: '不耐，长辈式的耐心告罄', start: 17.0, end: 25.0 },
  { id: 'c04', kind: 'inner', speaker: '章北海（内心）', text: '他们的判断没有错。错的是，他们的判断只在现在成立。', delivery: '内心独白，几乎贴着呼吸', start: 25.5, end: 33.0 },
  { id: 'c05', kind: 'narration', speaker: '旁白', text: '于是他不再争论。他去了一个更安静的地方。', delivery: '压低，留白', start: 34.0, end: 41.0 },
  { id: 'c06', kind: 'dialogue', speaker: '章北海', text: '这块陨石，帮我切成弹头的形状。', delivery: '像在谈一件工具', start: 45.0, end: 51.5 },
  { id: 'c07', kind: 'dialogue', speaker: '技工', text: '……陨铁？这东西脆，切出来也不规整。', delivery: '疑惑，手上活没停', start: 52.0, end: 58.5 },
  { id: 'c08', kind: 'dialogue', speaker: '章北海', text: '不规整才好。', delivery: '轻，几乎带笑意', start: 59.0, end: 63.0 },
  { id: 'c09', kind: 'narration', speaker: '旁白', text: '弹道测试那天，他站在靶场里，听了很久的回声。', delivery: '叙述，冷', start: 64.0, end: 71.0 },
  { id: 'c10', kind: 'dialogue', speaker: '章北海', text: '声音在水泥里会拐弯。记住这一点。', delivery: '对助手说，像在讲常识', start: 72.0, end: 78.0 },
  { id: 'c11', kind: 'radio', speaker: '通讯', text: '三号车库，目标三人，步行进入。', delivery: '无线电失真、短促', start: 82.0, end: 86.0 },
  { id: 'c12', kind: 'narration', speaker: '旁白', text: '他们走进来的时候，谁也没有抬头看那道门。', delivery: '极轻', start: 87.0, end: 93.0 },
  { id: 'c14', kind: 'narration', speaker: '旁白', text: '三个人倒下。现场留下的，只有几块不规则的金属。', delivery: '不带感情', start: 101.0, end: 108.0 },
  { id: 'c15', kind: 'inner', speaker: '章北海（内心）', text: '从今天起，人类的方向不再由谨慎的人决定。', delivery: '内心，慢', start: 109.0, end: 116.0 },
  { id: 'c16', kind: 'dialogue', speaker: '上级', text: '北海，组织决定让你去未来。', delivery: '公事公办', start: 121.0, end: 126.5 },
  { id: 'c17', kind: 'dialogue', speaker: '章北海', text: '好。我服从。', delivery: '平静，太快了一点', start: 127.0, end: 131.0 },
  { id: 'c18', kind: 'narration', speaker: '旁白', text: '他把自己也送进了未来——作为一枚更慢的子弹。', delivery: '收束', start: 133.0, end: 141.0 },
  { id: 'c20', kind: 'narration', speaker: '旁白', text: '他从不认为自己是在杀人。他认为自己是在修正一个时间差。', delivery: '最后一句，留白', start: 154.0, end: 162.0 }
];

const CHAPTERS = [
  { t: 0, label: '一 · 会议室' },
  { t: 44, label: '二 · 车间' },
  { t: 84, label: '三 · 车库' },
  { t: 118, label: '四 · 冬眠' },
  { t: 143, label: '五 · 真空' }
];

const DURATION = 168;

/* ---------------------------------------------------------------- renderer */
const err = document.createElement('div');
err.style.cssText = 'position:fixed;left:12px;top:12px;color:#ff9b9b;font:12px ui-monospace;white-space:pre-wrap;z-index:9';
document.body.appendChild(err);
window.addEventListener('error', (e) => { err.textContent = (e.error && e.error.stack) || e.message; });
window.addEventListener('unhandledrejection', (e) => { err.textContent = String(e.reason); });

const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x53627a, 1.35));
const hemi = new THREE.HemisphereLight(0x9fb4d0, 0x2a2620, 1.1);
scene.add(hemi);
const keyLight = new THREE.DirectionalLight(0xfff0d8, 1.5);
keyLight.position.set(0.5, 1, 0.75);
scene.add(keyLight);
const backLight = new THREE.DirectionalLight(0x8fa8c8, 0.8);
backLight.position.set(-0.6, 0.4, -0.8);
scene.add(backLight);
scene.background = new THREE.Color(0x040507);
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.05, 400);

/* --------------------------------------------------------------- materials */
const M = {
  concrete: new THREE.MeshStandardMaterial({ color: 0x6d6a63, roughness: 0.95 }),
  concreteDark: new THREE.MeshStandardMaterial({ color: 0x4a4842, roughness: 0.96 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x565349, roughness: 0.85 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8d949b, roughness: 0.42, metalness: 0.75 }),
  steelDark: new THREE.MeshStandardMaterial({ color: 0x3e444a, roughness: 0.55, metalness: 0.6 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xc8a583, roughness: 0.8 }),
  uniform: new THREE.MeshStandardMaterial({ color: 0x51637a, roughness: 0.8 }),
  uniformOld: new THREE.MeshStandardMaterial({ color: 0x6e6a62, roughness: 0.85 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x9fd0e0, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.28 }),
  meteor: new THREE.MeshStandardMaterial({ color: 0x3a3330, roughness: 0.9, metalness: 0.45 }),
  lamp: new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffe6b0, emissiveIntensity: 2.4 }),
  screen: new THREE.MeshStandardMaterial({ color: 0x08131c, emissive: 0x1b4a5e, emissiveIntensity: 1.1 })
};

const box = (w, h, d, mat, x, y, z, parent = scene) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
};

/** Block-built human: head, torso, two arms, two legs — all boxes. */
function person(mat = M.uniform, h = 1.72) {
  const g = new THREE.Group();
  const s = h / 1.72;
  const torso = box(0.44 * s, 0.6 * s, 0.26 * s, mat, 0, 1.16 * s, 0, g);
  const head = box(0.24 * s, 0.26 * s, 0.24 * s, M.skin, 0, 1.62 * s, 0, g);
  const armL = box(0.12 * s, 0.5 * s, 0.14 * s, mat, -0.28 * s, 1.12 * s, 0, g);
  const armR = box(0.12 * s, 0.5 * s, 0.14 * s, mat, 0.28 * s, 1.12 * s, 0, g);
  const legL = box(0.15 * s, 0.78 * s, 0.17 * s, M.steelDark, -0.12 * s, 0.39 * s, 0, g);
  const legR = box(0.15 * s, 0.78 * s, 0.17 * s, M.steelDark, 0.12 * s, 0.39 * s, 0, g);
  g.userData = { torso, head, armL, armR, legL, legR };
  return g;
}

function room(w, d, h, floorMat = M.floor, wallMat = M.concrete) {
  const g = new THREE.Group();
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat);
  fl.rotation.x = -Math.PI / 2;
  fl.receiveShadow = true;
  g.add(fl);
  box(w, h, 0.3, wallMat, 0, h / 2, -d / 2, g);
  box(w, h, 0.3, wallMat, 0, h / 2, d / 2, g);
  box(0.3, h, d, wallMat, -w / 2, h / 2, 0, g);
  box(0.3, h, d, wallMat, w / 2, h / 2, 0, g);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M.concreteDark);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = h;
  g.add(ceil);
  return g;
}

function stripLight(g, x, y, z, len = 2.2) {
  box(len, 0.06, 0.22, M.lamp, x, y, z, g);
  const l = new THREE.PointLight(0xffe9c0, 26, 14, 1.8);
  l.position.set(x, y - 0.1, z);
  g.add(l);
  return l;
}

/* ----------------------------------------------------------------- audio */
class Sound {
  ctx = null; master = null; verb = null; hum = null; muted = false;

  init() {
    if (this.ctx) return;
    const C = window.AudioContext || window.webkitAudioContext;
    this.ctx = new C();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.7;
    this.master.connect(this.ctx.destination);

    // procedural room impulse: a concrete basement tail
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * 2.6);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / ctx.sampleRate;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t / 2.6, 2.6) * 0.7;
      }
      // a few discrete slap-backs off the walls
      for (const tap of [0.043, 0.087, 0.131, 0.19]) {
        const i = Math.floor(tap * ctx.sampleRate);
        if (i < len) d[i] += (ch ? -1 : 1) * 0.5;
      }
    }
    this.verb = ctx.createConvolver();
    this.verb.buffer = buf;
    const wet = ctx.createGain();
    wet.gain.value = 0.85;
    this.verb.connect(wet).connect(this.master);

    // room hum
    this.hum = ctx.createGain();
    this.hum.gain.value = 0.05;
    this.hum.connect(this.master);
    for (const f of [50, 100.5, 151]) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = f === 50 ? 0.9 : 0.25;
      o.connect(g).connect(this.hum);
      o.start();
    }
  }

  noise(dur, gain, freq, q = 1, type = 'bandpass', wet = 0) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(f).connect(g);
    g.connect(this.master);
    if (wet > 0 && this.verb) {
      const w = ctx.createGain();
      w.gain.value = wet;
      g.connect(w).connect(this.verb);
    }
    src.start();
  }

  tone(f, dur, gain, type = 'sine', slide = null, wet = 0) {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.master);
    if (wet > 0 && this.verb) {
      const w = ctx.createGain();
      w.gain.value = wet;
      g.connect(w).connect(this.verb);
    }
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  shot() {
    this.noise(0.13, 0.9, 900, 0.6, 'lowpass', 1.1);
    this.noise(0.05, 0.5, 3000, 0.9, 'bandpass', 0.5);
    this.tone(120, 0.22, 0.32, 'sawtooth', 45);
  }
  step() { this.noise(0.08, 0.14, 320, 1.4, 'lowpass', 0.25); }
  lathe() { this.noise(0.5, 0.09, 1400, 2.2, 'bandpass'); this.tone(220, 0.4, 0.04, 'sawtooth'); }
  hiss() { this.noise(1.8, 0.16, 2600, 0.7, 'bandpass', 0.4); }
  beep() { this.tone(1400, 0.1, 0.12, 'square'); }
  thud() { this.tone(58, 0.5, 0.3, 'sine', 34); }
  vacuum() { if (this.hum) this.hum.gain.value = 0.0; }
  room() { if (this.hum) this.hum.gain.value = 0.05; }
}
const sfx = new Sound();

/* ------------------------------------------------------------------ sets */
const world = new THREE.Group();
scene.add(world);

// ---- Set 1: basement meeting room
const set1 = new THREE.Group();
world.add(set1);
{
  const r = room(10, 8.4, 3.2);
  set1.add(r);
  stripLight(set1, -1.4, 3.0, 0, 2.4);
  stripLight(set1, 1.6, 3.0, 0.4, 2.2);
  const table = box(3.4, 0.1, 1.25, M.steelDark, 0, 0.78, 0, set1);
  for (const [x, z] of [[-1.5, -0.5], [1.5, -0.5], [-1.5, 0.5], [1.5, 0.5]]) box(0.08, 0.78, 0.08, M.steelDark, x, 0.39, z, set1);
  box(3.2, 1.35, 0.06, M.screen, 0, 1.9, -2.85, set1);

  const seated = [];
  for (let i = 0; i < 4; i++) {
    const p = person(i % 2 ? M.uniformOld : M.uniform, 1.68);
    p.position.set(-1.35 + i * 0.9, 0, 0.86);
    p.rotation.y = Math.PI;
    set1.add(p);
    seated.push(p);
  }
  const zhang1 = person(M.uniform, 1.78);
  zhang1.position.set(0.2, 0, -1.15);
  set1.add(zhang1);
  set1.userData = { seated, zhang: zhang1, table };
}

// ---- Set 2: workshop / lathe
const set2 = new THREE.Group();
world.add(set2);
set2.position.set(40, 0, 0);
{
  set2.add(room(9.2, 9.0, 3.4, M.floor, M.concreteDark));
  stripLight(set2, 0, 2.9, 0, 2.0);
  const bench = box(2.4, 0.1, 0.9, M.steelDark, 1.0, 0.9, 0, set2);
  for (const x of [0.0, 2.0]) box(0.1, 0.9, 0.1, M.steelDark, x, 0.45, 0.36, set2);
  const lathe = box(1.5, 0.5, 0.6, M.steel, -1.5, 1.12, 0, set2);
  const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 18), M.steel);
  chuck.rotation.z = Math.PI / 2;
  chuck.position.set(-0.72, 1.3, 0);
  set2.add(chuck);

  const bullets = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const b = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 8), M.meteor);
    b.position.set(0.55 + (i % 4) * 0.11, 0.99, -0.18 + Math.floor(i / 4) * 0.13);
    b.rotation.z = Math.PI / 2;
    bullets.add(b);
  }
  set2.add(bullets);
  const rock = box(0.5, 0.38, 0.44, M.meteor, 1.55, 1.14, 0.1, set2);

  const zhang2 = person(M.uniform, 1.78);
  zhang2.position.set(-1.05, 0, 0.78);
  zhang2.rotation.y = Math.PI * 0.92;
  set2.add(zhang2);
  const worker = person(M.uniformOld, 1.68);
  worker.position.set(-2.05, 0, 0.35);
  set2.add(worker);

  const sparks = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(Array.from({ length: 90 }, () => new THREE.Vector3(-0.85 + Math.random() * 0.4, 1.15 + Math.random() * 0.5, -0.3 + Math.random() * 0.6))),
    new THREE.PointsMaterial({ color: 0xffc07a, size: 0.018, transparent: true, opacity: 0.9 })
  );
  set2.add(sparks);
  set2.userData = { chuck, sparks, bullets, rock, table: bench, lathe };
}

// ---- Set 3: concrete garage
const set3 = new THREE.Group();
world.add(set3);
set3.position.set(80, 0, 0);
{
  set3.add(room(13, 8.4, 3.4, M.floor, M.concrete));
  for (const z of [-3.2, 3.2]) {
    for (const x of [-5.4, -2.2, 2.2, 5.4]) box(0.34, 3.2, 0.34, M.concreteDark, x, 1.6, z, set3);
  }
  box(0.34, 3.2, 0.34, M.concreteDark, -5.4, 1.6, 0, set3);
  box(0.34, 3.2, 0.34, M.concreteDark, 5.4, 1.6, 0, set3);
  stripLight(set3, -3.4, 3.1, 1.2, 2.0);
  stripLight(set3, 2.6, 3.1, -1.2, 2.0);

  const car = new THREE.Group();
  box(1.7, 0.62, 3.0, M.steelDark, 0, 0.62, 0, car);
  box(1.5, 0.5, 1.4, M.glass, 0, 1.12, -0.1, car);
  for (const [x, z] of [[-0.85, 1.0], [0.85, 1.0], [-0.85, -1.0], [0.85, -1.0]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 14), M.steelDark);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.28, z);
    car.add(w);
  }
  car.position.set(2.6, 0, -1.9);
  car.rotation.y = 0.24;
  set3.add(car);

  const oldMen = [];
  for (let i = 0; i < 3; i++) {
    const p = person(M.uniformOld, 1.66);
    p.position.set(-2.6 + i * 0.85, 0, 1.3 - i * 0.25);
    p.rotation.y = -Math.PI / 2 + 0.12 * i;
    set3.add(p);
    oldMen.push(p);
  }
  const shooter = person(M.uniform, 1.78);
  shooter.position.set(-4.4, 0, -0.9);
  shooter.rotation.y = Math.PI / 2 - 0.1;
  set3.add(shooter);

  const flash = new THREE.PointLight(0xfff0c0, 0, 9, 2);
  flash.position.set(-3.7, 1.35, -0.7);
  set3.add(flash);
  const flashMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.34), new THREE.MeshBasicMaterial({ color: 0xfff3cf, transparent: true, opacity: 0 }));
  flashMesh.position.copy(flash.position);
  set3.add(flashMesh);

  set3.userData = { oldMen, shooter, flash, flashMesh, car };
}

// ---- Set 4: cryo hall
const set4 = new THREE.Group();
world.add(set4);
set4.position.set(120, 0, 0);
{
  set4.add(room(13, 11, 4.6, new THREE.MeshStandardMaterial({ color: 0x2b2f34, roughness: 0.7 }), M.steelDark));
  for (let i = 0; i < 6; i++) {
    for (const s of [-1, 1]) {
      const pod = new THREE.Group();
      box(1.1, 0.5, 2.1, M.steelDark, 0, 0.25, 0, pod);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.05, 18, 1, false, 0, Math.PI), M.steel);
      lid.rotation.x = Math.PI / 2;
      lid.rotation.z = Math.PI;
      lid.position.set(0, 0.55, 0);
      pod.add(lid);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.6), new THREE.MeshBasicMaterial({ color: 0x3fd0d8, transparent: true, opacity: 0.22 }));
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(0, 0.52, 0);
      pod.add(glow);
      pod.position.set(s * 2.4, 0, -3 + i * 1.25);
      set4.add(pod);
    }
  }
  stripLight(set4, 0, 4.2, 0, 3.4);
  const zhang4 = person(M.uniform, 1.78);
  zhang4.position.set(0, 0, 2.4);
  zhang4.rotation.y = Math.PI;
  set4.add(zhang4);
  const officer = person(M.uniformOld, 1.7);
  officer.position.set(0.8, 0, 3.2);
  officer.rotation.y = Math.PI * 0.85;
  set4.add(officer);
  set4.userData = { zhang: zhang4, officer };
}

// ---- Set 5: vacuum / space
const set5 = new THREE.Group();
world.add(set5);
set5.position.set(160, 0, 0);
{
  const hull = box(9, 3.2, 0.3, M.steelDark, 0, 0, -1.6, set5);
  const plating = new THREE.Group();
  for (let i = -8; i <= 8; i++) plating.add(box(1.0, 2.6, 0.08, M.steel, i * 1.05, 0, -1.42, set5));
  const starGeo = new THREE.BufferGeometry();
  const pts = [];
  for (let i = 0; i < 900; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(60 + Math.random() * 90);
    pts.push(v.x, v.y, v.z);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xdfe9f5, size: 0.35, sizeAttenuation: true }));
  set5.add(stars);
  const earth = new THREE.Mesh(new THREE.SphereGeometry(14, 32, 24), new THREE.MeshStandardMaterial({ color: 0x22415e, emissive: 0x0a1c2c, emissiveIntensity: 0.6, roughness: 1 }));
  earth.position.set(26, -16, -46);
  set5.add(earth);
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.position.set(-30, 20, 30);
  set5.add(sun);
  set5.add(new THREE.AmbientLight(0x223344, 1.2));
  const pod = box(1.0, 1.0, 2.2, M.steel, 0, 0.4, 1.0, set5);
  set5.userData = { stars };
}

const SETS = [set1, set2, set3, set4, set5];
function showOnly(i) {
  SETS.forEach((s, k) => (s.visible = k === i));
}

/* ---------------------------------------------------------------- timeline */
const shots = {
  1: [
    { t: 0, pos: [4.2, 2.2, 4.2], look: [0, 1.15, 0] },
    { t: 8, pos: [2.6, 1.9, 2.8], look: [-0.2, 1.2, 0] },
    { t: 18, pos: [-2.8, 1.8, 2.6], look: [0.2, 1.2, -0.2] },
    { t: 30, pos: [1.2, 1.6, 2.4], look: [0.2, 1.4, -0.9] },
    { t: 40, pos: [1.4, 1.7, 1.8], look: [0.2, 1.5, -1.1] },
    { t: 44, pos: [1.0, 1.7, 1.5], look: [0.2, 1.5, -1.2] }
  ],
  2: [
    { t: 44, pos: [3.4, 2.1, 4.0], look: [-0.4, 1.15, 0] },
    { t: 56, pos: [1.2, 1.6, 2.9], look: [-0.9, 1.15, 0] },
    { t: 66, pos: [1.6, 1.5, 1.9], look: [0.5, 1.0, 0] },
    { t: 78, pos: [0.9, 1.7, 3.0], look: [0.4, 1.05, 0] },
    { t: 84, pos: [1.6, 1.8, 3.2], look: [0.1, 1.1, 0] }
  ],
  3: [
    { t: 84, pos: [5.2, 2.2, 4.2], look: [-2.6, 1.1, 0.2] },
    { t: 92, pos: [3.6, 1.9, 4.0], look: [-3.2, 1.2, 0.2] },
    { t: 100, pos: [0.6, 1.8, 4.0], look: [-3.6, 1.0, -0.4] },
    { t: 108, pos: [-0.6, 1.7, 3.8], look: [-3.2, 0.7, 0.2] },
    { t: 116, pos: [-2.0, 1.9, 4.0], look: [-3.8, 1.0, -0.6] }
  ],
  4: [
    { t: 116, pos: [0.4, 2.2, 4.6], look: [0, 0.9, -1.0] },
    { t: 128, pos: [1.6, 1.7, 3.4], look: [0.2, 1.3, 1.0] },
    { t: 138, pos: [0.1, 1.5, 3.0], look: [0, 1.3, 2.0] },
    { t: 143, pos: [-0.4, 1.55, 2.6], look: [0, 1.3, 2.2] }
  ],
  5: [
    { t: 143, pos: [0, 0.6, 3.4], look: [0, 0.4, 0] },
    { t: 154, pos: [1.2, 1.2, 2.6], look: [0, 0.5, 0] },
    { t: 168, pos: [0.2, 0.8, 4.2], look: [0, 0.4, -0.4] }
  ]
};

function sceneIndex(t) {
  if (t < 44) return 1;
  if (t < 84) return 2;
  if (t < 116) return 3;
  if (t < 143) return 4;
  return 5;
}

const ease = (x) => x * x * (3 - 2 * x);
function applyCamera(t) {
  const i = sceneIndex(t);
  const arr = shots[i];
  let k = 0;
  while (k < arr.length - 2 && arr[k + 1].t <= t) k++;
  const a = arr[k], b = arr[k + 1];
  const u = ease(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))));
  const off = [0, 40, 80, 120, 160][i - 1];
  camera.position.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * u + off,
    a.pos[1] + (b.pos[1] - a.pos[1]) * u,
    a.pos[2] + (b.pos[2] - a.pos[2]) * u
  );
  camera.lookAt(
    a.look[0] + (b.look[0] - a.look[0]) * u + off,
    a.look[1] + (b.look[1] - a.look[1]) * u,
    a.look[2] + (b.look[2] - a.look[2]) * u
  );
}

/* ------------------------------------------------------------- subtitles */
const subsEl = document.getElementById('subs');
const chapterEl = document.getElementById('chapter');
const barEl = document.getElementById('bar');
let curCue = '';

function updateSubs(t) {
  const cue = CUES.find((c) => t >= c.start && t < c.end);
  if (!cue) {
    subsEl.classList.remove('show');
    curCue = '';
    return;
  }
  if (cue.id !== curCue) {
    curCue = cue.id;
    const span = document.createElement('span');
    span.className = 'sp';
    span.textContent = `【${cue.speaker}】`;
    subsEl.innerHTML = '';
    subsEl.append(span, document.createTextNode(cue.text));
  }
  subsEl.classList.toggle('show', cue.kind !== 'sfx');
}

let curChapter = -1;
function updateChapter(t) {
  let idx = -1;
  CHAPTERS.forEach((c, i) => { if (t >= c.t) idx = i; });
  if (idx !== curChapter) {
    curChapter = idx;
    if (idx >= 0 && t < CHAPTERS[idx].t + 6) {
      chapterEl.textContent = CHAPTERS[idx].label;
      chapterEl.classList.add('show');
      setTimeout(() => chapterEl.classList.remove('show'), 4200);
    }
  }
}

/* ---------------------------------------------------------------- events */
const fired = new Set();
function fire(e) {
  if (fired.has(e)) return;
  fired.add(e);
  switch (e) {
    case 'shot1': sfx.shot(); break;
    case 'shot2': setTimeout(() => sfx.shot(), 260); break;
    case 'shot3': setTimeout(() => sfx.shot(), 520); break;
    case 'fall': sfx.thud(); break;
    case 'hiss': sfx.hiss(); break;
    case 'beep': sfx.beep(); break;
    case 'vacuum': sfx.vacuum(); break;
    case 'room': sfx.room(); break;
  }
}

/* ------------------------------------------------------------------- loop */
const clock = new THREE.Clock();
let t = 0;
let lastChapter = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;
  if (t > DURATION) { t = 0; fired.clear(); sfx.room(); }

  const si = sceneIndex(t);
  showOnly(si - 1);
  applyCamera(t);

  // set-specific motion
  if (si === 1) {
    const z = set1.userData.zhang;
    z.position.z = -1.15 + Math.sin(t * 0.5) * 0.06;
    z.rotation.y = Math.sin(t * 0.34) * 0.12;
  } else if (si === 2) {
    const { chuck, sparks } = set2.userData;
    chuck.rotation.x += dt * 12;
    const p = sparks.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      p.setY(i, p.getY(i) - dt * (0.3 + (i % 5) * 0.06));
      if (p.getY(i) < 1.05) p.setY(i, 1.5);
    }
    p.needsUpdate = true;
    if (Math.random() < dt * 4) sfx.lathe();
  } else if (si === 3) {
    const { flash, flashMesh, oldMen } = set3.userData;
    const fireAt = [94.2, 95.4, 96.6, 99.2];
    const near = fireAt.find((f) => t >= f && t < f + 0.14);
    flash.intensity = near ? 26 : 0;
    flashMesh.material.opacity = near ? 0.9 : 0;
    fireAt.forEach((f, i) => { if (t >= f) fire('shot' + (i + 1)); });
    oldMen.forEach((m, i) => {
      const fallAt = 95.0 + i * 0.9;
      if (t > fallAt) {
        m.rotation.x = Math.min(Math.PI / 2, m.rotation.x + dt * 3.4);
        m.position.y = Math.max(0, 0.16 - m.rotation.x * 0.1);
      }
    });
    if (t > 95.0) fire('fall');
  } else if (si === 4) {
    fire('hiss');
    if (t > 130 && t < 132) fire('beep');
  } else if (si === 5) {
    fire('vacuum');
    set5.userData.stars.rotation.y += dt * 0.008;
  }

  updateSubs(t);
  updateChapter(t);
  barEl.style.width = `${(t / DURATION) * 100}%`;
  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// start audio on first gesture, and also attempt immediately for automated runs
const startAudio = () => { sfx.init(); if (sfx.ctx && sfx.ctx.state === 'suspended') sfx.ctx.resume(); };
addEventListener('pointerdown', startAudio, { once: true });
addEventListener('keydown', startAudio, { once: true });
startAudio();

window.__film = { get t() { return t; }, seek(v) { t = v; fired.clear(); }, CUES, duration: DURATION, camera, scene, subs: subsEl };
animate();
