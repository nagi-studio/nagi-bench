import RAPIER from '@dimforge/rapier3d-compat';
import { buildSim, G } from './sim.js';
import { buildView } from './view.js';
import { createFilm, END } from './film.js';
import { createAudio } from './audio.js';

const $ = (id) => document.getElementById(id);
const dom = {
  stage: $('stage'), canvas: $('gl'), labels: $('labels'), leaders: $('leaders'), chain: $('chain'), note: $('note'), title: $('title'),
  caption: $('caption'), capStep: document.querySelector('#caption .step'), capText: document.querySelector('#caption .text'), endcard: $('endcard'), replay: $('replay'), sound: $('sound'), loading: $('loading'),
};
dom.note.textContent = '演示已加速 · 原物高约 12 米';

const PERF = /perf/.test(location.hash);
async function boot() {
  const tb = [performance.now()]; const mark = (n) => { tb.push(performance.now()); if (PERF) console.log(`[boot] ${n}: ${(tb[tb.length - 1] - tb[tb.length - 2]).toFixed(0)} ms`); };
  await RAPIER.init(); mark('rapier');
  let sim = buildSim(RAPIER); mark('sim');
  const Q = {}; for (const m of location.hash.matchAll(/q(\w+)[=:](\w+)/g)) Q[m[1]] = m[2] === '0' ? false : m[2] === '1' ? true : Number(m[2]);
  const view = buildView(dom.canvas, sim, Q); mark('view');
  const film = createFilm(view, dom);
  const audio = createAudio(); mark('audio');

  let W = 0, H = 0;
  const resize = () => { W = dom.stage.clientWidth || window.innerWidth; H = dom.stage.clientHeight || window.innerHeight; view.resize(W, H); dom.leaders.setAttribute('viewBox', `0 0 ${W} ${H}`); };
  window.addEventListener('resize', resize); resize();

  // 影片时间 T 与物理时间严格同步：每帧把物理世界按固定步长推进到 T
  let T = 0, last = performance.now(), shot = 0, slow = 0, frames = 0, fps = 60;
  // 调试用：#t=12 → 物理先快进到影片第 12 秒再开始放映（仅用于自检截图）
  const jump = Number((location.hash.match(/t=([\d.]+)/) || [])[1] || 0);
  if (jump > 0) { while (sim.t < jump) sim.step(); sim.events.length = 0; T = sim.t; }
  const restart = () => { sim.world.free(); sim = buildSim(RAPIER); view.setSim(sim); film.reset(); audio.reset(); T = 0; shot = 0; last = performance.now(); };
  dom.replay.addEventListener('click', (e) => { e.stopPropagation(); audio.resume(); restart(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'r' || e.key === 'R') restart(); });

  // 浏览器通常要等用户手势才允许出声：先正常放映，首次点击后开声；若影片刚开始则从头再放一遍
  const unlock = () => { if (!audio.ok || audio.running()) return; audio.resume(); if (T > 1.5 && T < END) restart(); };
  window.addEventListener('pointerdown', unlock); window.addEventListener('keydown', unlock); window.addEventListener('touchstart', unlock, { passive: true });
  audio.resume();

  // 推进一帧：物理按固定步长追到影片时间 T，再把事件交给画面与声音
  function advance(dt, live) {
    T += dt;
    const t0 = performance.now(); let n = 0;
    while (sim.t < T && n < 400) { sim.step(); n++; if (live && (n & 15) === 0 && performance.now() - t0 > 700) break; }
    if (sim.t < T - G.H) T = sim.t; // 机器太慢时让影片时间等物理，而不是跳过物理
    for (const e of sim.events) { film.onEvent(e, T); if (live) audio.onEvent(e, T); }
    sim.events.length = 0;
    const s = film.shotAt(T); if (s !== shot) { shot = s; if (live) audio.whoosh(); }
    view.update(dt); film.update(T, dt, W, H);
  }
  let paused = false;
  function frame(now) {
    if (paused) { last = now; requestAnimationFrame(frame); return; }
    let dt = (now - last) / 1000; last = now; if (!(dt > 0)) dt = 0; dt = Math.min(dt, 3.0); // 掉帧时按真实时间追赶
    if (frames < 3) dt = Math.min(dt, 1 / 30); // 开场头几帧还在编译着色器，不计入影片时间
    const p0 = performance.now(); advance(dt, true); const p1 = performance.now();
    view.sync(); audio.update(T, shot); const p2 = performance.now();
    view.render(); const p3 = performance.now();
    if (PERF && (p3 - p0 > 250 || frames % 30 === 0)) console.log(`[frame ${frames}] T=${T.toFixed(2)} dt=${(dt * 1000).toFixed(0)} physics=${(p1 - p0).toFixed(0)} sync=${(p2 - p1).toFixed(0)} render=${(p3 - p2).toFixed(0)} ms`);
    dom.sound.classList.toggle('show', audio.ok && !audio.running());
    fps += ((dt > 0 ? 1 / dt : 60) - fps) * 0.1;
    // 软件渲染等极慢环境：自动降低分辨率与阴影开销
    frames++; if (frames > 3 && frames < 40) { if (dt > 0.12) slow++; if (slow === 6) { view.renderer.setPixelRatio(1); view.key.shadow.mapSize.set(1024, 1024); if (view.key.shadow.map) { view.key.shadow.map.dispose(); view.key.shadow.map = null; } slow++; } }
    requestAnimationFrame(frame);
  }
  // 自检用：暂停并精确跳到某一影片时刻（物理照常逐步推进，只是不等真实时间）
  const seek = (to) => { paused = true; if (to < T) restart(); while (T < to - 1e-6) advance(Math.min(1 / 60, to - T), false); view.sync(); view.render(); return T; };
  window.__film = { get T() { return T; }, get sim() { return sim; }, get fps() { return fps; }, get frames() { return frames; }, view, audio, ready: false, timeRender: () => { const gl = view.renderer.getContext(); const a = performance.now(); view.render(); gl.finish(); return performance.now() - a; }, seek, play: () => { paused = false; } };
  // 预热一帧（编译着色器）后再揭幕，保证 T=0 即是完整画面
  view.sync(); film.update(T, 0, W, H);
  if (PERF) { const t1 = performance.now(); view.renderer.compile(view.scene, view.camera); console.log(`[boot] compile(): ${(performance.now() - t1).toFixed(0)} ms, programs=${view.renderer.info.programs.length}`); }
  view.render(); mark('first render');
  if (PERF) { console.log(`[boot] programs=${view.renderer.info.programs.length} geometries=${view.renderer.info.memory.geometries} textures=${view.renderer.info.memory.textures} calls=${view.renderer.info.render.calls} tris=${view.renderer.info.render.triangles}`); for (const p of view.renderer.info.programs) console.log(`[boot]   prog ${p.name} used=${p.usedTimes}`); }
  dom.loading.classList.add('gone'); window.__film.ready = true;
  last = performance.now(); requestAnimationFrame(frame);
}
boot().catch((err) => { console.error(err); dom.loading.innerHTML = `<span>加载失败：${String((err && err.message) || err)}</span>`; });
