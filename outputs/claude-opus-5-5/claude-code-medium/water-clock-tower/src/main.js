import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { createSim, DT } from './physics.js';
import { buildScene } from './scene.js';
import { createAudio } from './audio.js';
import { PREWARM, DURATION, SHOTS, CAPTIONS, LABELS, CHAIN, chainIndex, HIGHLIGHTS, cameraAt, xrayAt } from './timeline.js';

const params = new URLSearchParams(location.search);
const CAPTURE = params.has('capture');
const $ = (s) => document.querySelector(s);

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  (parent || document.body).appendChild(e);
  return e;
}

// ------------------------------------------------------------------ 叠加层 UI
const ui = el('div', 'ui', $('#app'));
const labelLayer = el('div', 'labels', ui);
const chainBar = el('div', 'chain', ui);
CHAIN.forEach((c, i) => {
  if (i) el('span', 'arrow', chainBar, '→');
  el('span', 'node', chainBar, c);
});
const chainNodes = [...chainBar.querySelectorAll('.node')];
const titleCard = el('div', 'title-card', ui, `
  <div class="t-era">北宋 · 元祐三年（1088）</div>
  <div class="t-main">水运仪象台</div>
  <div class="t-sub">苏颂、韩公廉 主持建造 · 以水为动力、自动报时的天文钟楼</div>
  <div class="t-q">水，是怎样让它“走时”的？</div>`);
const caption = el('div', 'caption', ui);
const capStep = el('div', 'cap-step', caption);
const capText = el('div', 'cap-text', caption);
const capMain = el('div', 'cap-main', capText);
const capSub = el('div', 'cap-sub', capText);
const endCard = el('div', 'end-card', ui, `
  <div class="e-chain"><b>水流</b><i>→</i><b>受水壶</b><i>→</i><b>格叉</b><i>→</i><b>天条·天衡</b><i>→</i><b>天关放行一格</b><i>→</i><b>枢轮</b><i>→</i><b>天柱·齿轮</b><i>→</i><b>浑仪 · 浑象 · 报时</b></div>
  <div class="e-main">连续的水流，被“擒纵”切成等长的一格一格——这就是时间。</div>
  <div class="e-sub">流到底部的水，由人力转动升水轮提回天池，循环使用。（演示中时间已大大加快）</div>`);
const tickHud = el('div', 'tick-hud', ui);
const fade = el('div', 'fade', ui);
const soundBtn = el('button', 'sound-btn', ui, '🔊 点击开启声音并从头播放');
const replayBtn = el('button', 'replay-btn', ui, '↻ 重新播放');
const physBadge = el('div', 'phys-badge', ui, '机械运动均由 Rapier 物理引擎实时计算');
const loading = el('div', 'loading', ui, '<div class="ld-t">水运仪象台</div><div class="ld-s">正在搭建物理模型……</div>');

const labelEls = LABELS.map((L) => {
  const e = el('div', 'label' + (L.below ? ' below' : ''), labelLayer, `<span class="dot"></span><span class="txt">${L.name}</span>`);
  return e;
});

// 无头物理测试：?simtest=[{...opts}] → window.__simtest 结果（不渲染）
async function simtest() {
  await RAPIER.init();
  const list = JSON.parse(params.get('simtest') || '[{}]');
  const res = [];
  for (const opts of list) {
    const sim = createSim(RAPIER, opts);
    const T = opts.T ?? 34;
    let last = 0; const steps = [];
    while (sim.time < T) {
      sim.step();
      const st = Math.floor((sim.wheelAngle * 180 / Math.PI + 3) / 30);
      if (st > last) { last = st; steps.push(+sim.time.toFixed(2)); }
    }
    const bells = sim.collisions.filter((c) => (c.a === 'bell' || c.b === 'bell') && c.v > 0.06).map((c) => +c.t.toFixed(1));
    res.push({ opts, steps, bells, final: +(sim.wheelAngle * 180 / Math.PI).toFixed(1) });
  }
  window.__simtest = res;
}

// 离线音频电平测试：?audiotest → 用 OfflineAudioContext 渲染整片声音，统计峰值/响度
async function audiotest() {
  await RAPIER.init();
  const sim = createSim(RAPIER, {});
  while (sim.time < DURATION) sim.step();
  const sr = 44100;
  const off = new OfflineAudioContext(2, Math.ceil(sr * (DURATION + 2)), sr);
  const a = createAudio(off);
  a.start(0);
  a.setAmbience({ water: 0.5, rumble: 0.6, wind: 0.25 });
  for (const e of sim.collisions) {
    const k = [e.a, e.b].sort().join('-');
    const t = e.t - PREWARM;
    if (t < 0) continue;
    if (k === 'peg-tooth' && e.v > 0.12) a.tick(e.v * 0.9, 1, t);
    else if (k === 'lock-peg' && e.v > 0.15) a.tick(e.v * 0.35, 1.5, t);
    else if (k === 'fork-pin' && e.v > 0.15) a.thud(e.v * 0.6, t);
    else if (k === 'bell-mallet' && e.v > 0.06) a.bell(0.4 + e.v * 0.9, t);
    else if (k === 'beam-bstop' && e.v > 0.3) a.tick(e.v * 0.25, 0.6, t);
  }
  for (let t = 0.2; t < DURATION; t += 0.17) a.plink(0.6, t);
  const buf = await off.startRendering();
  let peak = 0; const rms = [];
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch);
    for (let s = 0; s < d.length; s += sr) {
      let acc = 0, n = 0;
      for (let i = s; i < Math.min(d.length, s + sr); i++) { const x = d[i]; acc += x * x; n++; if (Math.abs(x) > peak) peak = Math.abs(x); }
      rms[s / sr] = Math.max(rms[s / sr] || 0, Math.sqrt(acc / n));
    }
  }
  window.__audiotest = { peak: +peak.toFixed(3), peakDb: +(20 * Math.log10(peak)).toFixed(1), rmsDb: rms.map((r) => +(20 * Math.log10(r + 1e-9)).toFixed(1)) };
}

async function boot() {
  if (params.has('simtest')) return simtest();
  if (params.has('audiotest')) return audiotest();
  await RAPIER.init();
  // 软件渲染（无 GPU）时自动降低画质，保证能流畅播放
  let lowQ = params.has('low');
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
    if (/swiftshader|llvmpipe|software/i.test(name)) lowQ = true;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch (e) { /* ignore */ }
  const renderer = new THREE.WebGLRenderer({ antialias: !lowQ, powerPreference: 'high-performance' });
  renderer.setPixelRatio(lowQ ? 1 : Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = lowQ ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  $('#app').prepend(renderer.domElement);
  const cam = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.05, 700);

  let audio = null;
  if (!params.has('mute')) { try { audio = createAudio(); } catch (e) { console.warn('audio unavailable', e); } }

  let sim, S, collIdx, steps, lastStepIdx, filmStart, ended, flash;
  const dbgOn = params.has('debug');
  let dbg = null;

  function reset() {
    if (S) { S.scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
    sim = createSim(RAPIER, JSON.parse(params.get('opts') || '{}'));
    S = buildScene(renderer, sim);
    if (lowQ) {
      S.sun.shadow.mapSize.set(1024, 1024);
      S.lanterns.forEach((l, i) => { if (i > 0) l.visible = false; else l.intensity *= 2; });
    }
    for (const k in S.highlightables) for (const m of S.highlightables[k]) { m.userData.baseE = m.emissive.clone(); m.userData.baseI = m.emissiveIntensity; }
    // 预编译全部着色器，避免播放中途首次出现某材质时卡顿
    try { renderer.compile(S.scene, cam); } catch (e) { /* ignore */ }
    while (sim.time < PREWARM - 1e-9) sim.step();
    collIdx = sim.collisions.length;
    steps = [];
    lastStepIdx = Math.floor((sim.wheelAngle * 180 / Math.PI + 3) / 30);
    ended = false;
    flash = {};
    if (dbgOn) {
      dbg = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ vertexColors: true, depthTest: false }));
      S.scene.add(dbg);
    }
  }

  // ---------------------------------------------------------------- 每帧：根据影片时间 t 更新画面
  const tmpV = new THREE.Vector3();
  const zAng = (b) => { const r = b.rotation(); return 2 * Math.atan2(r.z, r.w); };
  function setHighlight(name, x) {
    const mats = S.highlightables[name];
    if (!mats) return;
    for (const m of mats) {
      if (x > 0.01) {
        m.emissive.setRGB(1.0, 0.55, 0.15);
        m.emissiveIntensity = x * (name === '浑象' || name === '浑仪' ? 0.22 : 0.5);
      } else {
        m.emissive.copy(m.userData.baseE); m.emissiveIntensity = m.userData.baseI;
      }
    }
  }
  const win = (t, a, b, f = 0.35) => Math.max(0, Math.min(1, (t - a) / f, (b - t) / f));

  function frame(t, live) {
    const ft = Math.max(0, Math.min(DURATION, t));
    // 镜头
    const c = cameraAt(ft);
    cam.position.set(...c.pos);
    cam.lookAt(c.tgt[0], c.tgt[1], c.tgt[2]);
    if (cam.fov !== c.fov || cam.aspect !== innerWidth / innerHeight) { cam.fov = c.fov; cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }
    cam.updateMatrixWorld();

    S.update();

    // 物理事件 → 音效 / 闪光 / 计数
    const evs = sim.collisions.slice(collIdx);
    collIdx = sim.collisions.length;
    for (const e of evs) {
      const k = [e.a, e.b].sort().join('-');
      if (k === 'peg-tooth' && e.v > 0.12) { live && audio?.tick(e.v * 0.9, 1); flash['天关'] = 1; }
      else if (k === 'lock-peg' && e.v > 0.15) { live && audio?.tick(e.v * 0.35, 1.5); }
      else if (k === 'fork-pin' && e.v > 0.15) { live && audio?.thud(e.v * 0.6); }
      else if (k === 'bell-mallet' && e.v > 0.06) { live && audio?.bell(0.4 + e.v * 0.9); flash['钟'] = 1; }
      else if (k === 'beam-bstop' && e.v > 0.3) { live && audio?.tick(e.v * 0.25, 0.6); }
    }
    steps = sim.stepTimes.map((s) => s - PREWARM);
    S.xray(xrayAt(ft));

    // 高亮：讲解时段 + 物理状态驱动
    const H = {};
    for (const h of HIGHLIGHTS) H[h.name] = Math.max(H[h.name] || 0, win(ft, h.t[0], h.t[1], 0.4) * (0.6 + 0.4 * Math.sin(ft * 6)));
    const forkA = zAng(sim.fork) * 180 / Math.PI;
    const beamA = -zAng(sim.beam) * 180 / Math.PI;
    const focusEsc = win(ft, 8.4, 18.6, 0.5);
    H['格叉'] = Math.max(H['格叉'] || 0, focusEsc * Math.min(1, Math.max(0, (forkA - 1.0) / 4)));
    H['天衡'] = Math.max(H['天衡'] || 0, focusEsc * Math.min(1, Math.max(0, (beamA - 0.5) / 2.5)));
    {
      const a = S.localToWorld(sim.fork, sim.rodA), b = S.localToWorld(sim.beam, sim.rodB);
      const taut = a.distanceTo(b) > sim.ropeLen - 0.003 && forkA > 1.5;
      H['天条'] = Math.max(H['天条'] || 0, focusEsc * (taut ? 1 : 0));
    }
    const jackA = Math.abs(zAng(sim.jack)) * 180 / Math.PI;
    H['木人'] = Math.max(H['木人'] || 0, win(ft, 23.8, 28.7) * Math.min(1, jackA / 10));
    for (const k in flash) { H[k] = Math.max(H[k] || 0, flash[k]); flash[k] *= 0.9; if (flash[k] < 0.02) delete flash[k]; }
    if (!(ft >= 8.4 && ft < 18.6)) delete H['天关'];
    if (!(ft >= 23.8)) delete H['钟'];
    for (const name in S.highlightables) setHighlight(name, H[name] || 0);

    // 标签
    const W = innerWidth, Hh = innerHeight;
    LABELS.forEach((L, i) => {
      const o = win(ft, L.t[0], L.t[1], 0.3);
      const e = labelEls[i];
      if (o <= 0) { e.style.opacity = 0; e.style.display = 'none'; return; }
      let p;
      if (L.at.w) p = tmpV.set(...L.at.w);
      else {
        const body = L.at.body === 'fork' ? sim.fork : L.at.body === 'beam' ? sim.beam : sim.lock;
        p = S.localToWorld(body, L.at.l);
      }
      p = p.clone().project(cam);
      if (p.z > 1 || p.x < -1.2 || p.x > 1.2 || p.y < -1.2 || p.y > 1.2) { e.style.display = 'none'; return; }
      e.style.display = 'block';
      e.style.opacity = o;
      e.style.transform = `translate(${(p.x * 0.5 + 0.5) * W}px, ${Math.max(Hh * 0.13, (-p.y * 0.5 + 0.5) * Hh)}px)`;
    });

    // 字幕
    const cap = CAPTIONS.find((c) => ft >= c.t0 && ft < c.t1);
    titleCard.style.opacity = cap && cap.kind === 'title' ? win(ft, cap.t0, cap.t1, 0.7) : 0;
    endCard.style.opacity = cap && cap.kind === 'end' ? win(ft, cap.t0 + 0.3, 99, 0.8) : 0;
    if (cap && !cap.kind) {
      caption.style.opacity = win(ft, cap.t0, cap.t1, 0.25);
      if (capMain.textContent !== cap.text) { capStep.textContent = cap.step; capMain.textContent = cap.text; capSub.textContent = cap.sub; }
    } else caption.style.opacity = 0;

    // 流程链
    const ci = chainIndex(ft);
    chainBar.style.opacity = ci >= 0 ? Math.min(1, (ft - 6.0) / 0.5) * (ft > 28.4 ? Math.max(0, 1 - (ft - 28.4) / 0.5) : 1) : 0;
    chainNodes.forEach((n, i) => n.classList.toggle('on', i === ci || ci === 9));
    chainNodes.forEach((n, i) => n.classList.toggle('done', i < ci));

    // 走格节拍 HUD（显示真实物理计算出的每一格时刻与间隔）
    const hudO = win(ft, 15.4, 18.6, 0.4);
    tickHud.style.opacity = hudO;
    if (hudO > 0) {
      const ss = steps.filter((s) => s > 0.5);
      let html = '<div class="th-title">枢轮走格时刻（物理实时计算）</div><div class="th-row">';
      ss.forEach((s, i) => {
        html += `<span class="th-tick">嗒<small>${s.toFixed(1)}s</small></span>`;
        if (i < ss.length - 1) html += `<span class="th-gap">${(ss[i + 1] - s).toFixed(1)}s</span>`;
      });
      html += '</div>';
      if (tickHud.innerHTML !== html) tickHud.innerHTML = html;
    }

    // 淡入淡出
    let f = 0;
    if (ft < 0.6) f = 1 - ft / 0.6;
    for (const s of SHOTS) if (s.cut) f = Math.max(f, 1 - Math.abs(ft - s.t0) / 0.3);
    if (t > DURATION - 0.6) f = Math.max(f, Math.min(0.55, (t - (DURATION - 0.6)) / 0.6 * 0.55));
    fade.style.opacity = Math.max(0, Math.min(1, f));

    // 环境声
    if (live && audio) {
      const sp = tmpV.set(...sim.spout);
      const d = cam.position.distanceTo(sp);
      const wz = Math.abs(sim.wheel.angvel().z);
      audio.setAmbience({ water: 0.12 + 0.5 / (1 + d * d * 0.05), rumble: Math.min(0.6, wz * 1.6) * (0.4 + 2.5 / (1 + cam.position.length() * 0.3)), wind: ft < 6 || ft > 28.7 ? 0.18 : 0.05 });
      if (Math.random() < 0.15 / (1 + d * 0.3)) audio.plink(0.6);
    }

    if (dbg) {
      const { vertices, colors } = sim.world.debugRender();
      dbg.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      dbg.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    }
    renderer.render(S.scene, cam);
  }

  reset();

  // 字体预热：把片中所有文字先以极低不透明度绘制一遍，并渲染一帧，避免播放中途首次排版大字号中文时卡顿
  {
    const warm = el('div', 'font-warm', ui);
    const texts = [titleCard.textContent, endCard.textContent, CHAIN.join(''), ...CAPTIONS.map((c) => (c.text || '') + (c.sub || '')), ...LABELS.map((l) => l.name), '①②③④⑤⑥⑦嗒枢轮走格时刻（物理实时计算）0123456789.s'];
    warm.innerHTML = texts.map((t, i) => `<span class="w${i % 3}">${t}</span>`).join('');
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    frame(0, false);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 50));
    warm.remove();
    loading.remove();
  }

  // ---------------------------------------------------------------- 截图模式：确定性按影片时间推进
  if (CAPTURE) {
    document.body.classList.add('capture');
    window.__seek = (t) => {
      while (sim.time < t + PREWARM - 1e-9) sim.step();
      frame(t, false);
      return sim.time - PREWARM;
    };
    window.__steps = () => steps;
    window.__ready = true;
    return;
  }

  // ---------------------------------------------------------------- 播放
  let wallStart = performance.now();
  let lastNow = wallStart;
  function startFilm(withSound) {
    reset();
    wallStart = performance.now();
    lastNow = wallStart;
    replayBtn.style.display = 'none';
    if (withSound && audio) audio.start(0);
  }
  async function tryAutoAudio() {
    if (!audio) { soundBtn.style.display = 'none'; return; }
    const ok = params.has('forcebtn') ? false : await audio.resume();
    window.__audioState = audio.ctx.state;
    if (ok) { soundBtn.style.display = 'none'; audio.start((performance.now() - wallStart) / 1000); }
    else soundBtn.style.display = 'block';
  }
  soundBtn.addEventListener('click', async () => {
    soundBtn.style.display = 'none';
    if (audio) { await audio.resume(); audio.stop(); }
    startFilm(true);
  });
  replayBtn.addEventListener('click', async () => {
    if (audio) { await audio.resume(); audio.stop(); }
    startFilm(!!audio && audio.running);
    soundBtn.style.display = audio && audio.running ? 'none' : 'block';
  });
  tryAutoAudio();

  // 影片时间跟随物理时间：每帧尽量把物理推进到“墙钟时间”，若算不过来则影片随之放慢，保证解说与机械动作同步
  function loop(now) {
    requestAnimationFrame(loop);
    if (params.has('perf') && now - lastNow > 1200) console.log(`[perf] gap ${(now - lastNow).toFixed(0)}ms at film ${(sim.time - PREWARM).toFixed(2)} phys ${Math.round(window.__physMs || 0)}ms/${window.__physN}`);
    lastNow = now;
    const target = (now - wallStart) / 1000;
    if (!ended) {
      let n = 0;
      const maxSteps = 300; // 帧率很低时（如软件渲染）也尽量让影片跟上真实时间
      const tp0 = performance.now();
      while (sim.time - PREWARM < target && n < maxSteps) { sim.step(); n++; }
      window.__physMs = performance.now() - tp0; window.__physN = n;
      if (n === maxSteps) wallStart += Math.max(0, (target - (sim.time - PREWARM)) * 1000); // 卡顿时整体顺延
    }
    const ft = sim.time - PREWARM;
    const tr0 = performance.now();
    frame(ft, true);
    window.__stats = { frames: (window.__stats?.frames || 0) + 1, calls: renderer.info.render.calls, film: +ft.toFixed(2), physMs: Math.round(window.__physMs || 0), physN: window.__physN, frameMs: Math.round(performance.now() - tr0) };
    if (!ended && ft >= DURATION) {
      ended = true;
      replayBtn.style.display = 'block';
      audio?.fadeOut(2.0);
    }
  }
  requestAnimationFrame(loop);
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); });
  window.__sim = () => sim;
}
boot();
