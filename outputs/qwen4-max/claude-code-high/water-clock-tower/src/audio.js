// ---------------------------------------------------------------------------
// 声音层:全部由 Web Audio API 运行时合成,无任何音频文件。
// 环境风声 + 古琴式拨弦 + 水流噪声 + 擒纵咔嗒 + 鼓 + 编钟式铃,
// 经压缩器与总音量控制,保证不爆音。
// ---------------------------------------------------------------------------
export function createAudio() {
  let ctx = null, master, comp, buses = {};
  let noiseBuf = null;
  let waterGain, waterSrc, windGain;
  let started = false, muted = false;
  let melodyIdx = 0;

  // 五声音阶(A 宫系):A C D E G
  const scale = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];
  const melody = [
    [0.6, 4, 0.5], [2.2, 2, 0.4], [4.8, 5, 0.55], [7.0, 4, 0.4],
    [9.4, 2, 0.5], [11.8, 3, 0.4], [14.2, 5, 0.5], [16.6, 6, 0.45],
    [18.8, 5, 0.4], [21.2, 4, 0.5], [23.6, 2, 0.4], [25.8, 3, 0.45],
    [27.6, 5, 0.6], [28.4, 7, 0.5], [29.2, 9, 0.55],
  ];

  const ensure = () => {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 5;
    comp.attack.value = 0.004; comp.release.value = 0.22;
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.6;
    comp.connect(master); master.connect(ctx.destination);
    for (const name of ['amb', 'water', 'mech', 'music']) {
      buses[name] = ctx.createGain();
      buses[name].gain.value = 1;
      buses[name].connect(comp);
    }
    // 白噪声缓冲
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // 风声
    const wind = ctx.createBufferSource(); wind.buffer = noiseBuf; wind.loop = true;
    const wf = ctx.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 260; wf.Q.value = 0.4;
    windGain = ctx.createGain(); windGain.gain.value = 0.05;
    wind.connect(wf); wf.connect(windGain); windGain.connect(buses.amb);
    wind.start();
    // 低音持续(宫音 drone)
    for (const [f, g] of [[110, 0.028], [164.8, 0.018]]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const og = ctx.createGain(); og.gain.value = g;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13 + Math.random() * 0.1;
      const lg = ctx.createGain(); lg.gain.value = g * 0.5;
      lfo.connect(lg); lg.connect(og.gain);
      o.connect(og); og.connect(buses.amb);
      o.start(); lfo.start();
    }
    // 水流(带通噪声,增益随注水状态)
    waterSrc = ctx.createBufferSource(); waterSrc.buffer = noiseBuf; waterSrc.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.7;
    const bp2 = ctx.createBiquadFilter(); bp2.type = 'highpass'; bp2.frequency.value = 500;
    waterGain = ctx.createGain(); waterGain.gain.value = 0;
    waterSrc.connect(bp); bp.connect(bp2); bp2.connect(waterGain); waterGain.connect(buses.water);
    waterSrc.start();
    started = true;
    return true;
  };

  const now = () => ctx.currentTime;

  const pluck = (freq, vel = 0.5, when = 0) => {
    if (!ctx) return;
    const t = now() + when;
    // 古琴式:基频 + 泛音,快起慢落
    for (const [mult, amp, dec] of [[1, 1, 1.6], [2, 0.4, 0.9], [3, 0.18, 0.5], [4.2, 0.07, 0.3]]) {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(freq * mult * 1.003, t);
      o.frequency.exponentialRampToValueAtTime(freq * mult, t + 0.06);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.11 * vel * amp, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
      o.connect(g); g.connect(buses.music);
      o.start(t); o.stop(t + dec + 0.05);
    }
    // 拨弦触弦声
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = freq * 3; nf.Q.value = 2;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.05 * vel, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    n.connect(nf); nf.connect(ng); ng.connect(buses.music);
    n.start(t); n.stop(t + 0.06);
  };

  const click = (vel = 1) => {
    if (!ctx) return;
    const t = now();
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.16 * vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    n.connect(f); f.connect(g); g.connect(buses.mech);
    n.start(t); n.stop(t + 0.06);
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(210, t);
    o.frequency.exponentialRampToValueAtTime(90, t + 0.07);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.2 * vel, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(og); og.connect(buses.mech);
    o.start(t); o.stop(t + 0.1);
  };

  const creak = () => {
    if (!ctx) return;
    const t = now();
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(95, t);
    o.frequency.linearRampToValueAtTime(62, t + 0.32);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420; f.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);
    o.connect(f); f.connect(g); g.connect(buses.mech);
    o.start(t); o.stop(t + 0.4);
  };

  const drum = (vel = 1) => {
    if (!ctx) return;
    const t = now();
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.22);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5 * vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g); g.connect(buses.mech);
    o.start(t); o.stop(t + 0.45);
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.22 * vel, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    n.connect(f); f.connect(ng); ng.connect(buses.mech);
    n.start(t); n.stop(t + 0.12);
  };

  const bell = (vel = 1) => {
    if (!ctx) return;
    const t = now();
    const base = 587.33;
    for (const [mult, amp, dec] of [[1, 0.3, 3.2], [2.76, 0.13, 2.0], [5.4, 0.06, 1.1], [8.9, 0.03, 0.6]]) {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.value = base * mult * (1 + (Math.random() - 0.5) * 0.004);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp * vel, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
      o.connect(g); g.connect(buses.mech);
      o.start(t); o.stop(t + dec + 0.05);
    }
  };

  const splash = () => {
    if (!ctx) return;
    const t = now();
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    n.playbackRate.value = 0.8 + Math.random() * 0.5;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400 + Math.random() * 900; f.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    n.connect(f); f.connect(g); g.connect(buses.water);
    n.start(t); n.stop(t + 0.09);
  };

  return {
    ensure,
    resume() { if (ensure() && ctx.state === 'suspended') ctx.resume(); },
    get running() { return !!ctx && ctx.state === 'running'; },
    setMuted(m) {
      muted = m;
      if (master) master.gain.setTargetAtTime(m ? 0 : 0.6, now(), 0.05);
    },
    get muted() { return muted; },
    event(e) {
      if (!ctx || ctx.state !== 'running') return;
      if (e.type === 'step') click(1);
      else if (e.type === 'release') creak();
      else if (e.type === 'drum') drum(Math.min(1, 0.5 + e.v));
      else if (e.type === 'bell') bell(Math.min(1, 0.5 + e.v));
      else if (e.type === 'splash') splash();
    },
    update(simTime, pouring, shotIdx) {
      if (!ctx || ctx.state !== 'running') return;
      // 旋律调度
      while (melodyIdx < melody.length && melody[melodyIdx][0] <= simTime) {
        const [, deg, vel] = melody[melodyIdx++];
        pluck(scale[deg - 1] || 220, vel);
      }
      // 水声:注水时明显,其余时候细流
      const target = pouring ? (shotIdx === 1 || shotIdx === 2 ? 0.16 : 0.07) : 0.03;
      waterGain.gain.setTargetAtTime(target, now(), 0.25);
      windGain.gain.setTargetAtTime(shotIdx === 5 ? 0.07 : 0.045, now(), 0.5);
    },
    reset() { melodyIdx = 0; },
  };
}
