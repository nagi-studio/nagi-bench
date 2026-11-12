// 全部声音在运行时用 Web Audio API 合成：配乐（古筝式拨弦 + 持续低音）与音效（水流、擒纵“嗒”、钟声、齿轮低鸣）。
// 不使用任何音频文件。总线经压缩器限幅，避免爆音。

export function createAudio(offlineCtx) {
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = offlineCtx || new AC();
  const master = ctx.createGain();
  master.gain.value = 0.0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 6; comp.attack.value = 0.004; comp.release.value = 0.2;
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -3; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.1;
  master.connect(comp); comp.connect(limiter); limiter.connect(ctx.destination);

  const musicBus = ctx.createGain(); musicBus.gain.value = 0.32; musicBus.connect(master);
  const sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8; sfxBus.connect(master);

  // 简易混响：程序生成的衰减噪声脉冲响应
  const verb = ctx.createConvolver();
  {
    const len = Math.floor(ctx.sampleRate * 2.4);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    verb.buffer = ir;
  }
  const verbGain = ctx.createGain(); verbGain.gain.value = 0.28;
  verb.connect(verbGain); verbGain.connect(master);
  const toVerb = (node, amt) => { const g = ctx.createGain(); g.gain.value = amt; node.connect(g); g.connect(verb); };

  // 白噪声缓冲
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  { const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }

  // ---------------------------------------------------------------- 持续声：水流、齿轮低鸣、环境
  const water = ctx.createBufferSource(); water.buffer = noiseBuf; water.loop = true;
  const wbp = ctx.createBiquadFilter(); wbp.type = 'bandpass'; wbp.frequency.value = 1500; wbp.Q.value = 0.9;
  const whp = ctx.createBiquadFilter(); whp.type = 'highpass'; whp.frequency.value = 500;
  const wGain = ctx.createGain(); wGain.gain.value = 0;
  // 水声的“汩汩”起伏：低频随机调制带通中心
  const wl = ctx.createOscillator(); wl.frequency.value = 5.3; const wlg = ctx.createGain(); wlg.gain.value = 420;
  wl.connect(wlg); wlg.connect(wbp.frequency); wl.start();
  water.connect(whp); whp.connect(wbp); wbp.connect(wGain); wGain.connect(sfxBus); toVerb(wGain, 0.15);
  water.start();

  const rumble = ctx.createBufferSource(); rumble.buffer = noiseBuf; rumble.loop = true;
  const rlp = ctx.createBiquadFilter(); rlp.type = 'lowpass'; rlp.frequency.value = 140; rlp.Q.value = 2;
  const rGain = ctx.createGain(); rGain.gain.value = 0;
  rumble.connect(rlp); rlp.connect(rGain); rGain.connect(sfxBus);
  rumble.start();

  const wind = ctx.createBufferSource(); wind.buffer = noiseBuf; wind.loop = true; wind.playbackRate.value = 0.5;
  const wilp = ctx.createBiquadFilter(); wilp.type = 'lowpass'; wilp.frequency.value = 420;
  const wiGain = ctx.createGain(); wiGain.gain.value = 0;
  wind.connect(wilp); wilp.connect(wiGain); wiGain.connect(sfxBus);
  wind.start();

  // ---------------------------------------------------------------- 一次性音效
  function env(g, t, a, peak, d) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  // 擒纵“嗒”：木头撞击
  function tick(strength = 1, pitch = 1, at) {
    const t = (at ?? ctx.currentTime) + 0.005;
    const s = Math.min(1, Math.max(0.15, strength));
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(820 * pitch, t); o.frequency.exponentialRampToValueAtTime(260 * pitch, t + 0.07);
    const g = ctx.createGain(); env(g, t, 0.002, 0.5 * s, 0.09);
    o.connect(g); g.connect(sfxBus); toVerb(g, 0.25);
    o.start(t); o.stop(t + 0.2);
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400 * pitch; bp.Q.value = 3;
    const ng = ctx.createGain(); env(ng, t, 0.001, 0.35 * s, 0.035);
    n.connect(bp); bp.connect(ng); ng.connect(sfxBus);
    n.start(t, Math.random()); n.stop(t + 0.08);
  }
  // 低沉的“咚”：壶落托板 / 格叉复位
  function thud(strength = 1, at) {
    const t = (at ?? ctx.currentTime) + 0.005;
    const s = Math.min(1, Math.max(0.1, strength));
    const o = ctx.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.15);
    const g = ctx.createGain(); env(g, t, 0.004, 0.4 * s, 0.18);
    o.connect(g); g.connect(sfxBus); toVerb(g, 0.2);
    o.start(t); o.stop(t + 0.3);
  }
  // 钟：非谐泛音叠加
  function bell(strength = 1, at) {
    const t = (at ?? ctx.currentTime) + 0.005;
    const s = Math.min(1, Math.max(0.25, strength));
    const f0 = 392;
    const partials = [[0.5, 0.35, 4.5], [1, 0.5, 3.6], [1.19, 0.22, 2.8], [1.56, 0.18, 2.2], [2.0, 0.22, 1.8], [2.51, 0.12, 1.2], [2.66, 0.1, 1.0], [3.01, 0.08, 0.8], [4.1, 0.05, 0.5]];
    const out = ctx.createGain(); out.gain.value = 0.55 * s;
    out.connect(sfxBus); toVerb(out, 0.6);
    for (const [r, a, d] of partials) {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.value = f0 * r * (1 + (Math.random() - 0.5) * 0.002);
      const g = ctx.createGain(); env(g, t, 0.003, a, d);
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + d + 0.1);
    }
    // 击打瞬态
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
    const ng = ctx.createGain(); env(ng, t, 0.001, 0.15 * s, 0.03);
    n.connect(hp); hp.connect(ng); ng.connect(out); n.start(t); n.stop(t + 0.06);
  }
  // 水滴“叮咚”
  function plink(strength = 0.5, at) {
    const t = (at ?? ctx.currentTime) + 0.003;
    const o = ctx.createOscillator(); o.type = 'sine';
    const f = 900 + Math.random() * 900;
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.8, t + 0.05);
    const g = ctx.createGain(); env(g, t, 0.002, 0.08 * strength, 0.06);
    o.connect(g); g.connect(sfxBus); toVerb(g, 0.3);
    o.start(t); o.stop(t + 0.12);
  }

  // ---------------------------------------------------------------- 配乐：宫调五声音阶，古筝式拨弦 + 低音持续
  const scale = [0, 2, 4, 7, 9]; // 宫 商 角 徵 羽
  const base = 146.83; // D3
  const freq = (deg, oct = 0) => base * Math.pow(2, (scale[((deg % 5) + 5) % 5] + 12 * (Math.floor(deg / 5) + oct)) / 12);
  function pluck(f, t, vel = 0.5, dur = 2.2) {
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 1.003;
    o1.frequency.setValueAtTime(f * 1.012, t); o1.frequency.exponentialRampToValueAtTime(f, t + 0.08);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(Math.min(8000, f * 9), t); lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.5), t + dur * 0.6);
    const g = ctx.createGain(); env(g, t, 0.004, vel * 0.22, dur);
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(musicBus); toVerb(g, 0.5);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
  }
  let drone = null;
  function startDrone(t) {
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 4);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12; const lg = ctx.createGain(); lg.gain.value = 180;
    lfo.connect(lg); lg.connect(lp.frequency); lfo.start(t);
    const oscs = [base / 2, base / 2 * 1.5, base].map((f, i) => {
      const o = ctx.createOscillator(); o.type = i === 2 ? 'sine' : 'triangle'; o.frequency.value = f * (1 + (i - 1) * 0.0015);
      o.connect(lp); o.start(t); return o;
    });
    lp.connect(g); g.connect(musicBus); toVerb(g, 0.4);
    drone = { g, oscs, lfo };
  }
  // 旋律（度数, 拍）: 一段舒缓的五声旋律，约 30 秒
  const melody = [
    [5, 1], [7, 1], [8, 2], [7, 1], [5, 1], [4, 2],
    [2, 1], [4, 1], [5, 2], [7, 2],
    [8, 1], [9, 1], [10, 2], [9, 1], [7, 1], [8, 2],
    [7, 1], [5, 1], [4, 1], [2, 1], [4, 2], [5, 2],
    [7, 1], [8, 1], [7, 1], [5, 1], [4, 3],
  ];
  const beat = 0.5;
  let scheduled = [];
  function scheduleMusic(t0, filmOffset) {
    // filmOffset: 当前影片时间（秒），用于从中途开始时跳过已过的音符
    startDrone(t0);
    let tt = 0.8;
    const notes = [];
    for (const [d, b] of melody) { notes.push([tt, d, b]); tt += b * beat * 1.6; }
    for (const [nt, d, b] of notes) {
      if (nt < filmOffset) continue;
      const at = t0 + nt - filmOffset;
      pluck(freq(d), at, 0.55, Math.min(3.2, b * 1.3 + 0.8));
      if (b >= 2) pluck(freq(d - 5), at + 0.02, 0.28, 2.6); // 低八度和音
    }
    // 结尾和弦
    const end = 29.4 - filmOffset;
    if (end > 0) for (const d of [0, 2, 4, 7]) pluck(freq(d), t0 + end + d * 0.06, 0.4, 3.5);
  }
  function stopMusic() {
    if (drone) {
      const t = ctx.currentTime;
      drone.g.gain.cancelScheduledValues(t); drone.g.gain.setTargetAtTime(0.0001, t, 0.4);
      drone.oscs.forEach((o) => o.stop(t + 2)); drone.lfo.stop(t + 2);
      drone = null;
    }
  }

  const api = {
    ctx,
    get running() { return ctx.state === 'running'; },
    // 未经用户手势时 resume() 可能一直挂起，所以与超时赛跑
    async resume() {
      try { await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 400))]); } catch (e) { /* ignore */ }
      return ctx.state === 'running';
    },
    start(filmTime = 0) {
      const t = ctx.currentTime + 0.05;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(0.0001, t);
      master.gain.exponentialRampToValueAtTime(0.5, t + 0.6);
      scheduleMusic(t, filmTime);
    },
    stop() { stopMusic(); master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2); },
    fadeOut(sec = 1.5) { master.gain.setTargetAtTime(0.0001, ctx.currentTime, sec / 3); },
    // 每帧：持续声的音量
    setAmbience({ water: w = 0, rumble: r = 0, wind: wi = 0 }) {
      const t = ctx.currentTime;
      wGain.gain.setTargetAtTime(Math.min(0.5, w), t, 0.15);
      rGain.gain.setTargetAtTime(Math.min(0.7, r), t, 0.08);
      wiGain.gain.setTargetAtTime(Math.min(0.25, wi), t, 0.5);
    },
    tick, thud, bell, plink,
  };
  return api;
}
