// 全程序化音频（Web Audio API）：环境声、五声音阶配乐、擒纵咔嗒、钟/鼓/水声
// 无任何音频文件；master 经压缩器限幅，音量适中不爆音。
export function createAudio() {
  let ctx = null, master = null, musicGain = null, sfxGain = null, ambGain = null;
  let started = false, musicTimer = null;
  const scale = [0, 2, 4, 7, 9]; // 宫商角徵羽（D 调五声）
  const base = 146.83; // D3

  function ensure() {
    if (ctx) return ctx;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 20; comp.ratio.value = 6;
    comp.attack.value = 0.003; comp.release.value = 0.25;
    master.connect(comp); comp.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.32; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.7; sfxGain.connect(master);
    ambGain = ctx.createGain(); ambGain.gain.value = 0.18; ambGain.connect(master);
    return ctx;
  }

  function noiseBuffer(dur) {
    const c = ensure();
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---- 环境：夜风 + 持续水声 ------------------------------------------------
  function startAmbience() {
    const c = ensure();
    // 风（低通噪声 + 缓慢 LFO）
    const wind = c.createBufferSource(); wind.buffer = noiseBuffer(4); wind.loop = true;
    const wf = c.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 320; wf.Q.value = 0.5;
    const wg = c.createGain(); wg.gain.value = 0.25;
    const lfo = c.createOscillator(); lfo.frequency.value = 0.12;
    const lfoG = c.createGain(); lfoG.gain.value = 0.12;
    lfo.connect(lfoG); lfoG.connect(wg.gain);
    wind.connect(wf); wf.connect(wg); wg.connect(ambGain);
    wind.start(); lfo.start();
    // 水声（带通噪声）
    const water = c.createBufferSource(); water.buffer = noiseBuffer(3); water.loop = true;
    const bf = c.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = 1800; bf.Q.value = 0.8;
    const bg = c.createGain(); bg.gain.value = 0.12;
    const wlfo = c.createOscillator(); wlfo.frequency.value = 0.7;
    const wlfoG = c.createGain(); wlfoG.gain.value = 0.05;
    wlfo.connect(wlfoG); wlfoG.connect(bg.gain);
    water.connect(bf); bf.connect(bg); bg.connect(ambGain);
    water.start(); wlfo.start();
  }

  // ---- 拨弦（古琴感）：Karplus-Strong 简化 ----------------------------------
  function pluck(freq, time, dur = 2.2, gain = 0.5) {
    const c = ensure();
    const sr = c.sampleRate;
    const len = Math.floor(sr * dur);
    const buf = c.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const N = Math.round(sr / freq);
    const ring = new Float32Array(N);
    for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    for (let i = 0; i < len; i++) {
      const cur = ring[idx];
      const next = ring[(idx + 1) % N];
      const avg = 0.5 * (cur + next) * 0.996;
      ring[idx] = avg;
      d[i] = cur;
      idx = (idx + 1) % N;
    }
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
    src.connect(lp); lp.connect(g); g.connect(musicGain);
    src.start(time); src.stop(time + dur);
  }

  // ---- 配乐调度（前瞻式） --------------------------------------------------
  let nextNote = 0, noteIdx = 0;
  const melody = [0, 2, 4, 7, 4, 2, 0, -1, 4, 7, 9, 7, 4, 2, 0, 2, 4, 2, 0, -1, 7, 4, 2, 0];
  function scheduleMusic() {
    const c = ensure();
    while (nextNote < c.currentTime + 0.6) {
      const deg = melody[noteIdx % melody.length];
      if (deg >= 0) {
        const oct = (noteIdx % 8 < 4) ? 1 : 2;
        const freq = base * Math.pow(2, (scale[deg % 5] + 12 * Math.floor(deg / 5)) / 12) * oct;
        pluck(freq, nextNote, 2.6, 0.4);
        if (noteIdx % 4 === 0) pluck(freq / 2, nextNote, 3.2, 0.22);
      }
      // 节拍：每拍 0.62s，疏密相间
      nextNote += (noteIdx % 4 === 3) ? 1.24 : 0.62;
      noteIdx++;
    }
  }
  function startMusic() {
    const c = ensure();
    nextNote = c.currentTime + 0.3; noteIdx = 0;
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = setInterval(scheduleMusic, 200);
    // 低音持续音
    const drone = c.createOscillator(); drone.type = 'sine'; drone.frequency.value = base / 2;
    const dg = c.createGain(); dg.gain.value = 0.06;
    drone.connect(dg); dg.connect(musicGain); drone.start();
  }

  // ---- 音效 ----------------------------------------------------------------
  function clack() {
    const c = ensure(); const t = c.currentTime;
    const src = c.createBufferSource(); src.buffer = noiseBuffer(0.06);
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 1.2;
    const g = c.createGain();
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    src.connect(bp); bp.connect(g); g.connect(sfxGain); src.start(t); src.stop(t + 0.08);
    const thud = c.createOscillator(); thud.type = 'sine'; thud.frequency.setValueAtTime(180, t);
    thud.frequency.exponentialRampToValueAtTime(70, t + 0.06);
    const tg = c.createGain(); tg.gain.setValueAtTime(0.3, t); tg.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    thud.connect(tg); tg.connect(sfxGain); thud.start(t); thud.stop(t + 0.1);
  }

  function bell(force = 5) {
    const c = ensure(); const t = c.currentTime;
    const f0 = 320;
    const partials = [1, 2.0, 2.98, 4.2, 5.4, 6.8];
    const gains = [1, 0.6, 0.4, 0.25, 0.15, 0.1];
    const amp = Math.min(0.5, 0.18 + force * 0.02);
    partials.forEach((p, i) => {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.value = f0 * p * (1 + (Math.random() - 0.5) * 0.004);
      const g = c.createGain();
      const decay = 2.6 / (1 + i * 0.5);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp * gains[i], t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + decay);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + decay);
    });
    // 敲击瞬态
    const src = c.createBufferSource(); src.buffer = noiseBuffer(0.03);
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
    const ng = c.createGain(); ng.gain.setValueAtTime(0.2, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    src.connect(hp); hp.connect(ng); ng.connect(sfxGain); src.start(t); src.stop(t + 0.05);
  }

  function drum(force = 5) {
    const c = ensure(); const t = c.currentTime;
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.18);
    const g = c.createGain(); const amp = Math.min(0.5, 0.2 + force * 0.02);
    g.gain.setValueAtTime(amp, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.32);
    const src = c.createBufferSource(); src.buffer = noiseBuffer(0.05);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
    const ng = c.createGain(); ng.gain.setValueAtTime(0.25, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    src.connect(lp); lp.connect(ng); ng.connect(sfxGain); src.start(t); src.stop(t + 0.1);
  }

  function splash() {
    const c = ensure(); const t = c.currentTime;
    const src = c.createBufferSource(); src.buffer = noiseBuffer(0.25);
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(2200, t);
    bp.frequency.exponentialRampToValueAtTime(700, t + 0.2); bp.Q.value = 0.7;
    const g = c.createGain(); g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    src.connect(bp); bp.connect(g); g.connect(sfxGain); src.start(t); src.stop(t + 0.26);
  }

  function start() {
    if (started) return;
    started = true;
    const c = ensure();
    if (c.state === 'suspended') c.resume();
    startAmbience();
    startMusic();
  }

  function resume() { const c = ensure(); if (c.state === 'suspended') c.resume(); }
  function setMuted(m) { if (master) master.gain.value = m ? 0 : 0.55; }

  return { start, resume, clack, bell, drum, splash, setMuted, ensure, get ctx() { return ctx; } };
}
