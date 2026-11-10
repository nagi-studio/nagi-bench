// 全部声音在运行时用 Web Audio API 合成：拨弦（Karplus–Strong 预渲染）、长音铺底、
// 水声、木件撞击、钟与铃。音效由物理事件触发；配乐按影片时间调度。没有任何音频文件。

const N = { D2: 73.42, A2: 110, D3: 146.83, E3: 164.81, 'F#3': 185, A3: 220, B3: 246.94, D4: 293.66, E4: 329.63, 'F#4': 369.99, A4: 440, B4: 493.88, D5: 587.33, E5: 659.25, 'F#5': 739.99, A5: 880, B5: 987.77, D6: 1174.66 };
const BEAT = 0.9; // 一拍的秒数
// 配乐（D 宫调五声）：[拍, 音名, 力度]
const SCORE = (() => {
  const s = []; const add = (b, n, v = 0.6) => s.push([b * BEAT, n, v]);
  // 引子（外景）
  add(0.3, 'D3', 0.5); add(1.0, 'A3', 0.45); add(1.5, 'D4', 0.5); add(2.5, 'F#4', 0.45); add(3.0, 'A4', 0.55); add(3.5, 'B4', 0.4); add(4.0, 'A4', 0.5);
  // 一 · 水：流动的分解和弦
  const flow = ['D4', 'A4', 'B4', 'D5', 'B4', 'A4', 'F#4', 'A4', 'E4', 'A4', 'B4', 'E5', 'D5', 'B4', 'A4', 'F#4'];
  for (let i = 0; i < 12; i++) add(4.6 + i * 0.5, flow[i % flow.length], i % 4 === 0 ? 0.55 : 0.36);
  add(4.6, 'D3', 0.5); add(6.6, 'B3', 0.4); add(8.6, 'A3', 0.45);
  // 二 · 擒纵：留白，低音等待
  add(10.7, 'D3', 0.5); add(11.2, 'D4', 0.32); add(12.2, 'E4', 0.3); add(12.7, 'D4', 0.3); add(13.7, 'A3', 0.45); add(14.2, 'D4', 0.32); add(15.2, 'F#4', 0.34); add(15.7, 'E4', 0.3); add(16.4, 'D4', 0.36);
  // 三 · 传动：上行
  const up = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5'];
  for (let i = 0; i < 8; i++) add(17.1 + i * 0.5, up[i], 0.36 + i * 0.025); add(17.1, 'D3', 0.5); add(19.1, 'A3', 0.45);
  // 四 · 仪象：高处的星光
  add(21.6, 'A5', 0.4); add(22.1, 'F#5', 0.34); add(22.6, 'D5', 0.36); add(23.1, 'E5', 0.34); add(23.6, 'A5', 0.4); add(24.1, 'B5', 0.36); add(24.6, 'D6', 0.38); add(25.1, 'A5', 0.32); add(21.6, 'D3', 0.5); add(23.6, 'B3', 0.42); add(25.6, 'A3', 0.42);
  // 五 · 报时：让位给钟铃
  add(26.6, 'D4', 0.4); add(27.6, 'A4', 0.34); add(28.6, 'B4', 0.3); add(29.6, 'A4', 0.34); add(30.6, 'F#4', 0.32); add(31.6, 'E4', 0.32); add(26.6, 'D3', 0.45); add(29.6, 'A2', 0.45);
  // 六 · 收束
  const fin = ['D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6'];
  for (let i = 0; i < 7; i++) add(32.9 + i * 0.42, fin[i], 0.42 + i * 0.03); add(32.9, 'D3', 0.55); add(32.9, 'A2', 0.4); add(36.2, 'D5', 0.4); add(36.2, 'D3', 0.5);
  return s.sort((a, b) => a[0] - b[0]);
})();

export function createAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return { ok: false, running: () => false, resume() {}, onEvent() {}, update() {}, reset() {}, whoosh() {} };
  const ctx = new AC({ latencyHint: 'interactive' });
  const sr = ctx.sampleRate;
  // 总线：各分组 → 压限 → 总音量（整体偏轻，防止爆音）
  const master = ctx.createGain(); master.gain.value = 0.0;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 8; comp.attack.value = 0.004; comp.release.value = 0.22;
  const soft = ctx.createWaveShaper(); { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = (i / 511.5) - 1; c[i] = Math.tanh(1.4 * x) / Math.tanh(1.4); } soft.curve = c; }
  comp.connect(soft); soft.connect(master); master.connect(ctx.destination);
  const meter = ctx.createAnalyser(); meter.fftSize = 2048; master.connect(meter); const meterBuf = new Float32Array(2048);
  const peak = () => { meter.getFloatTimeDomainData(meterBuf); let m = 0; for (let i = 0; i < meterBuf.length; i++) m = Math.max(m, Math.abs(meterBuf[i])); return m; };
  const bus = (g) => { const n = ctx.createGain(); n.gain.value = g; n.connect(comp); return n; };
  const musicBus = bus(0.5), sfxBus = bus(0.9), waterBus = bus(0.0);
  // 简易混响
  const rev = ctx.createConvolver(); { const len = Math.floor(sr * 2.2); const b = ctx.createBuffer(2, len, sr); for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let s = 12345 + c * 777; for (let i = 0; i < len; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = ((s / 2147483648) - 1) * Math.pow(1 - i / len, 2.6) * (i < 400 ? i / 400 : 1); } } rev.buffer = b; }
  const revGain = ctx.createGain(); revGain.gain.value = 0.3; rev.connect(revGain); revGain.connect(comp);
  const musicSend = ctx.createGain(); musicSend.gain.value = 0.5; musicBus.connect(musicSend); musicSend.connect(rev);
  const bellSend = ctx.createGain(); bellSend.gain.value = 0.55; bellSend.connect(rev);

  const noiseBuf = (() => { const b = ctx.createBuffer(1, sr * 2, sr); const d = b.getChannelData(0); let s = 987654321; for (let i = 0; i < d.length; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = s / 2147483648 - 1; } return b; })();

  // ---- 拨弦：Karplus–Strong，按需预渲染成缓冲 ----
  const pluckCache = new Map();
  function pluckBuf(freq) {
    if (pluckCache.has(freq)) return pluckCache.get(freq);
    const dur = freq < 200 ? 3.4 : 2.6; const len = Math.floor(sr * dur); const b = ctx.createBuffer(1, len, sr); const d = b.getChannelData(0);
    const n = Math.max(2, Math.round(sr / freq)); const ring = new Float32Array(n); let s = Math.floor(freq * 1000) | 1;
    for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) >>> 0; ring[i] = (s / 2147483648 - 1); }
    // 模拟拨弦位置：梳状滤波去掉部分泛音，音色更像筝
    const pk = Math.max(1, Math.floor(n * 0.18)); const tmp = new Float32Array(n); for (let i = 0; i < n; i++) tmp[i] = ring[i] - ring[(i + pk) % n]; for (let i = 0; i < n; i++) ring[i] = tmp[i] * 0.5;
    let lp = 0; for (let i = 0; i < n; i++) { lp = lp + 0.55 * (ring[i] - lp); ring[i] = lp; }
    const damp = freq < 200 ? 0.9975 : freq < 500 ? 0.9962 : 0.994; let idx = 0, prev = 0;
    for (let i = 0; i < len; i++) { const cur = ring[idx]; const y = (cur + prev) * 0.5 * damp; d[i] = cur; ring[idx] = y; prev = cur; idx = (idx + 1) % n; }
    let mx = 0; for (let i = 0; i < len; i++) mx = Math.max(mx, Math.abs(d[i])); const fo = Math.floor(sr * 0.25);
    for (let i = 0; i < len; i++) d[i] = (d[i] / (mx || 1)) * (i > len - fo ? (len - i) / fo : 1);
    pluckCache.set(freq, b); return b;
  }
  for (const k of new Set(SCORE.map((n) => n[1]))) pluckBuf(N[k]);
  function pluck(name, when, vel) {
    const f = N[name]; const src = ctx.createBufferSource(); src.buffer = pluckBuf(f); const g = ctx.createGain(); g.gain.value = vel * (f < 200 ? 0.75 : 0.55);
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null; if (pan) { pan.pan.value = Math.max(-0.5, Math.min(0.5, Math.log2(f / 330) * 0.28)); src.connect(g); g.connect(pan); pan.connect(musicBus); } else { src.connect(g); g.connect(musicBus); }
    src.start(when);
  }
  // ---- 铺底长音 ----
  const pad = ctx.createGain(); pad.gain.value = 0; pad.connect(musicBus);
  const padLP = ctx.createBiquadFilter(); padLP.type = 'lowpass'; padLP.frequency.value = 520; padLP.Q.value = 0.4; padLP.connect(pad);
  for (const [f, g, det] of [[73.42, 0.5, 0], [110, 0.34, 3], [146.83, 0.3, -4], [220.4, 0.16, 5], [293.2, 0.1, -3]]) { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; const og = ctx.createGain(); og.gain.value = g * 0.22; o.connect(og); og.connect(padLP); o.start(); }
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.11; const lfoG = ctx.createGain(); lfoG.gain.value = 140; lfo.connect(lfoG); lfoG.connect(padLP.frequency); lfo.start();

  // ---- 水声：连续的细流 + 水珠落下的"叮咚" ----
  { const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.6; const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
    const g = ctx.createGain(); g.gain.value = 0.16; const l2 = ctx.createOscillator(); l2.frequency.value = 0.37; const l2g = ctx.createGain(); l2g.gain.value = 420; l2.connect(l2g); l2g.connect(bp.frequency); l2.start(); src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(waterBus); src.start(); }
  let dripSeed = 1;
  function drip(when, vol, low) {
    dripSeed = (dripSeed * 1103515245 + 12345) >>> 0; const r = dripSeed / 4294967296; const f0 = (low ? 380 : 900) + r * (low ? 320 : 1300);
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f0, when); o.frequency.exponentialRampToValueAtTime(f0 * (low ? 0.55 : 1.9), when + 0.07);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, when + (low ? 0.16 : 0.09)); o.connect(g); g.connect(waterBus); o.start(when); o.stop(when + 0.2);
  }
  function noiseHit(when, { f = 1000, q = 1, dur = 0.08, vol = 0.3, type = 'bandpass', dest = sfxBus }) {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loopStart = 0; src.loop = true; const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, when + dur); src.connect(fl); fl.connect(g); g.connect(dest); src.start(when, (when * 0.37) % 1.5); src.stop(when + dur + 0.05);
  }
  function tone(when, { f = 200, f1 = null, dur = 0.2, vol = 0.3, type = 'sine', dest = sfxBus, att = 0.003 }) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, when); if (f1) o.frequency.exponentialRampToValueAtTime(f1, when + dur * 0.8);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + att); g.gain.exponentialRampToValueAtTime(0.0001, when + dur); o.connect(g); g.connect(dest); o.start(when); o.stop(when + dur + 0.05); return g;
  }
  // ---- 各种音效 ----
  const sfx = {
    clack(when, v) { // 天关卡住枢轮：厚实的木头"咔嗒"
      const a = Math.min(1, 0.6 + v * 1.6);
      noiseHit(when, { f: 950, q: 2.2, dur: 0.07, vol: 0.5 * a }); noiseHit(when, { f: 2600, q: 1.2, dur: 0.03, vol: 0.22 * a }); tone(when, { f: 150, f1: 78, dur: 0.16, vol: 0.5 * a, type: 'triangle' }); tone(when + 0.005, { f: 420, f1: 300, dur: 0.06, vol: 0.14 * a, type: 'square' });
    },
    release(when) { // 格叉被压下、天条一拉：轻响 + 链条细碎声
      tone(when, { f: 1900, f1: 1400, dur: 0.05, vol: 0.07, type: 'triangle' }); for (let i = 0; i < 6; i++) noiseHit(when + 0.05 + i * 0.045 + (i % 2) * 0.012, { f: 3800 + i * 350, q: 6, dur: 0.02, vol: 0.06 });
      noiseHit(when + 0.3, { f: 520, q: 1.2, dur: 0.5, vol: 0.05 }); // 枢轮转动时的低沉摩擦
    },
    gear(when) { noiseHit(when, { f: 1500, q: 3, dur: 0.028, vol: 0.085 }); tone(when, { f: 240, f1: 170, dur: 0.04, vol: 0.05, type: 'triangle' }); },
    bellA(when, v) { // 钟：低沉、带不和谐泛音
      const a = Math.min(1, 0.5 + v * 0.12); const out = ctx.createGain(); out.gain.value = 0.32 * a; out.connect(sfxBus); out.connect(bellSend);
      const base = 220; for (const [m, g, d] of [[0.5, 0.35, 3.2], [1, 1, 2.8], [1.19, 0.5, 2.2], [1.5, 0.35, 1.8], [2.0, 0.55, 1.6], [2.74, 0.3, 1.0], [3.76, 0.2, 0.7], [5.1, 0.1, 0.4]]) tone(when, { f: base * m, dur: d, vol: g * 0.42, dest: out, att: 0.002 });
      noiseHit(when, { f: 1800, q: 1, dur: 0.03, vol: 0.2 * a });
    },
    bellB(when, v) { // 铃：清亮短促，两下
      const a = Math.min(1, 0.5 + v * 0.1); const out = ctx.createGain(); out.gain.value = 0.16 * a; out.connect(sfxBus); out.connect(bellSend);
      for (const dt of [0, 0.13]) for (const [m, g, d] of [[1, 1, 0.9], [2.41, 0.5, 0.55], [3.9, 0.3, 0.35], [5.6, 0.14, 0.2]]) tone(when + dt, { f: 1318.5 * m, dur: d * (dt ? 0.8 : 1), vol: g * 0.45 * (dt ? 0.6 : 1), dest: out, att: 0.001 });
    },
    whoosh(when) { const src = ctx.createBufferSource(); src.buffer = noiseBuf; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.9; f.frequency.setValueAtTime(300, when); f.frequency.exponentialRampToValueAtTime(1400, when + 0.22); f.frequency.exponentialRampToValueAtTime(260, when + 0.55);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(0.07, when + 0.2); g.gain.exponentialRampToValueAtTime(0.0001, when + 0.6); src.connect(f); f.connect(g); g.connect(sfxBus); src.start(when, 0.3); src.stop(when + 0.7); },
  };

  let nextNote = 0, lastGear = -1, lastPlop = -1, started = false, muffled = 0;
  const lp = ctx.createBiquadFilter(); // 外景时"隔墙"听到的机括声
  const running = () => ctx.state === 'running';
  function resume() { if (ctx.state !== 'running') ctx.resume().catch(() => {}); }
  function onEvent(e, T) {
    if (!running()) return; const now = ctx.currentTime + 0.012; const far = T < 3.9 || T > 29.6 ? 0.55 : 1;
    if (e.type === 'clack') sfx.clack(now, e.v * far);
    else if (e.type === 'release') { if (far === 1) sfx.release(now); }
    else if (e.type === 'bellA') sfx.bellA(now, e.v * far);
    else if (e.type === 'bellB') sfx.bellB(now, e.v * far);
    else if (e.type === 'gear') { if (T - lastGear > 0.06 && T > 4) { lastGear = T; sfx.gear(now); } }
    else if (e.type === 'plop') { if (T - lastPlop > 0.07) { lastPlop = T; drip(now, 0.05, true); } }
    else if (e.type === 'emit') drip(now + 0.42, 0.035, false);
  }
  // 每帧：推进配乐调度、根据镜头调节水声远近
  function update(T, shot) {
    if (!running()) return; const now = ctx.currentTime;
    if (T > 35.5 && started !== 'tail') { started = 'tail'; master.gain.setTargetAtTime(0.3, now, 2.5); } // 片尾之后机器仍在走，声音退到背景
    if (!started) { started = true; master.gain.setTargetAtTime(0.62, now, 0.25); while (nextNote < SCORE.length && SCORE[nextNote][0] < T - 0.05) nextNote++; }
    while (nextNote < SCORE.length && SCORE[nextNote][0] < T + 0.25) { const [t, n, v] = SCORE[nextNote++]; pluck(n, now + Math.max(0.01, t - T), v); }
    pad.gain.setTargetAtTime(T < 0.2 ? 0 : T > 36 ? 0.25 : 0.55, now, 0.8);
    const w = [0.05, 0.85, 0.6, 0.22, 0.08, 0.12, 0.14][shot] ?? 0.1; waterBus.gain.setTargetAtTime(w, now, 0.35);
  }
  function reset() { nextNote = 0; started = false; lastGear = lastPlop = -1; if (running()) master.gain.setTargetAtTime(0.0, ctx.currentTime, 0.05); }
  return { ok: true, ctx, running, resume, onEvent, update, reset, peak, whoosh: () => running() && sfx.whoosh(ctx.currentTime + 0.01) };
}
