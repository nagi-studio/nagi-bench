let ctx: AudioContext | null = null;
function AC(){
 // SAFETY: window cast to unknown is safe - we only read optional prefix property
 const wUnknown = window as unknown;
 // SAFETY: unknown cast to typed prefix is safe - existence checked before use
 const wTyped = wUnknown as {webkitAudioContext: typeof AudioContext};
 if(!ctx) ctx = new (window.AudioContext || wTyped.webkitAudioContext)(); if(ctx.state==='suspended') ctx.resume(); return ctx; }

function osc(freq:number, type:OscillatorType, gain:number, dur:number, attack=0.005, _decay=0.08){
  const c=AC(); const o=c.createOscillator(); const g=c.createGain(); o.type=type; o.frequency.value=freq; o.connect(g); g.connect(c.destination);
  const t=c.currentTime; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(gain,t+attack); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t); o.stop(t+dur+0.02);
}
function noise(gain:number, dur:number, lp=1200){
  const c=AC(); const n=c.createBufferSource(); const len=Math.floor(c.sampleRate*dur); const buf=c.createBuffer(1,len,c.sampleRate); const ch=buf.getChannelData(0);
  for(let i=0;i<len;i++) ch[i]=(Math.random()*2-1)*(1-i/len) ** 1.5;
  const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=lp; const g=c.createGain(); g.gain.value=gain;
  n.buffer=buf; n.connect(f); f.connect(g); g.connect(c.destination); n.start();
}

export const SFX = {
  ak:()=>{ osc(180,'square',0.5,0.08); noise(0.35,0.12,2200); osc(90,'sawtooth',0.25,0.06); },
  m4:()=>{ osc(220,'square',0.42,0.06,0.002,0.05); noise(0.28,0.09,2600); },
  awp:()=>{ osc(110,'square',0.9,0.22,0.002,0.14); noise(0.6,0.28,900); osc(55,'sine',0.4,0.35); },
  glock:()=>{ osc(260,'square',0.32,0.05); noise(0.22,0.08,2800); },
  usp:()=>{ osc(240,'square',0.33,0.055); noise(0.2,0.07,3000); },
  deagle:()=>{ osc(140,'square',0.62,0.11); noise(0.45,0.16,1800); },
  reload:()=>{ osc(520,'sine',0.18,0.12); setTimeout(()=>osc(680,'sine',0.16,0.14),120); setTimeout(()=>osc(420,'square',0.12,0.08),260); },
  foot:()=>{ osc(80,'sine',0.1,0.07); noise(0.08,0.05,800); },
  hit:()=>{ osc(880,'sine',0.22,0.08); setTimeout(()=>osc(1320,'sine',0.14,0.08),60); },
  kill:()=>{ osc(660,'sine',0.28,0.12); setTimeout(()=>osc(880,'sine',0.28,0.18),90); },
  scope:()=>{ osc(1200,'sine',0.12,0.06); osc(800,'triangle',0.1,0.08); },
  plant:()=>{ for(let i=0;i<4;i++) setTimeout(()=>osc(600+i*80,'square',0.18,0.09), i*140); },
  defuse:()=>{ osc(520,'square',0.15,0.2); },
  explode:()=>{ noise(0.9,0.9,600); osc(60,'sine',0.9,0.8); setTimeout(()=>osc(30,'triangle',0.5,0.6),120); },
  empty:()=>{ osc(180,'square',0.12,0.07); },
};
