import { WebAudioCueBus } from '@agentbench/cinematic-player';
import { rng } from './math.js';

export const shotTimes=Array.from({length:30},(_,i)=>231.4+Math.floor(i/10)*3.3+(i%10)*.26);
const cue=(id,sound,start,end,gain=1,sustain=false,group='foley')=>({id,kind:'sound',sound,start,end,gain,sustain,group});
/** All sound events are authored here. No audio is loaded or decoded. */
export const soundCues=[
  cue('s00','spaceTone',0,11.9,.45,true,'score'),
  cue('s01','courtyard',12,23,.5,true,'ambience'),
  cue('s02','room',23,81,.36,true,'ambience'),
  cue('s03','warmMotif',24,46,.28,true,'score'),
  cue('s04','cup',39.5,41.5,.38),
  cue('s05','cup',45,47,.28),
  cue('s06','stone',57.4,58.4,.48),
  cue('s07','stone',58.6,59.6,.44),
  cue('s08','cloth',70.8,72,.5),
  cue('s09','machine',81,94,.65,true,'ambience'),
  cue('s10','metal',90.2,91.5,.4),
  cue('s11','workroom',94,105,.46,true,'ambience'),
  cue('s12','mechanism',105.8,106.4,.42),
  cue('s13','basementGun',108.3,110.3,.65),
  cue('s14','basementGun',111,113,.65),
  cue('s15','basementGun',112.6,114.6,.65),
  cue('s16','basementGun',113.6,115.6,.65),
  cue('s17','stone',116,117.2,.4),
  cue('s18','coldMotif',115,137,.3,true,'score'),
  cue('s19','elevator',123,138,.45,true,'ambience'),
  cue('s20','room',138,151,.25,true,'ambience'),
  cue('s21','radio',125.4,126,.2),
  cue('s22','base',151,162,.38,true,'ambience'),
  cue('s23','beacon',153,154,.22),
  cue('s24','spaceTone',162,190,.35,true,'score'),
  cue('s25','breath',178,190,.54,true,'subjective'),
  cue('s26','radio',194,194.6,.3,false,'subjective'),
  cue('s27','radio',203,203.4,.2,false,'subjective'),
  cue('s28','breath',211,241,.4,true,'subjective'),
  cue('s29','cloth',212,213.3,.6,false,'subjective'),
  cue('s30','mechanism',219.5,220.2,.35,false,'subjective'),
  cue('s31','coldMotif',211,230.5,.32,true,'score'),
  ...shotTimes.map((t,i)=>cue(`s-shot-${i+1}`,'suitImpulse',t,t+.22,.44,false,'subjective')),
  cue('s32','mechanism',234.05,234.6,.32,false,'subjective'),
  cue('s33','mechanism',237.35,237.95,.32,false,'subjective'),
  // Deliberate full silence from 241 to 255: no exterior propagation in vacuum.
  cue('s34','radio',255,255.6,.36,false,'subjective'),
  cue('s35','radio',262,262.7,.42,false,'subjective'),
  cue('s36','airlock',267,273,.5,true,'ambience'),
  cue('s37','alarm',267.2,273,.55,true,'foley'),
  cue('s38','thruster',273,278.5,.43,true,'subjective'),
  cue('s39','radio',277,277.7,.25,false,'subjective'),
  cue('s40','breath',286,296,.45,true,'subjective'),
  cue('s41','farewell',280,317,.42,true,'score'),
  cue('s42','room',296,307,.22,true,'ambience'),
  cue('s43','cup',301,303,.24),
];

const buffers=new Map();
function noiseBuffer(ac,length=2,seed=25,decay=0){
  const key=`${ac.sampleRate}/${length}/${seed}/${decay}`;if(buffers.has(key))return buffers.get(key);
  const b=ac.createBuffer(1,Math.ceil(length*ac.sampleRate),ac.sampleRate),d=b.getChannelData(0),random=rng(seed);let brown=0;
  for(let i=0;i<d.length;i++){const white=random()*2-1;brown=(brown+.04*white)/1.04;d[i]=(white*.7+brown*1.8)*(decay?Math.exp(-i/ac.sampleRate*decay):1);}
  buffers.set(key,b);return b;
}
function rig(ctx){
  const ac=ctx.audioContext,now=ac.currentTime,left=Math.max(.04,ctx.cue.end-ctx.cue.start-ctx.offset),nodes=[],sources=[];
  const g=ac.createGain();g.connect(ctx.output);nodes.push(g);
  function osc(type,freq,level,dest=g){const o=ac.createOscillator(),v=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,now);v.gain.value=level;o.connect(v).connect(dest);o.start(now);o.stop(now+left+.05);nodes.push(v);sources.push(o);return o;}
  function noise(freq=1000,level=.1,q=.5,type='lowpass',dest=g){const s=ac.createBufferSource();s.buffer=noiseBuffer(ac);s.loop=true;const f=ac.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const v=ac.createGain();v.gain.value=level;s.connect(f).connect(v).connect(dest);s.start(now,ctx.offset%2);s.stop(now+left+.05);nodes.push(f,v);sources.push(s);return {source:s,filter:f,gain:v};}
  function env(level=.2,attack=.03,release=.12){g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(level,now+Math.min(attack,left*.2));g.gain.setValueAtTime(level,now+Math.max(attack,left-release));g.gain.linearRampToValueAtTime(0,now+left);}
  return {ac,now,left,g,osc,noise,env,nodes,sources,stop(){for(const s of sources)try{s.stop();}catch{}for(const n of nodes)try{n.disconnect();}catch{}}};
}
function ambience(ctx,type){
  const r=rig(ctx);r.env(1,.5,.8);
  if(type==='courtyard'){r.noise(350,.08);r.osc('sine',83,.016);r.noise(1800,.015,.4,'bandpass');}
  if(type==='room'){r.noise(340,.035);r.osc('sine',98,.012);r.osc('sine',147,.006);}
  if(type==='workroom'||type==='base'){r.noise(450,.055);r.osc('sine',61.7,.022);r.osc('sine',123.4,.008);}
  if(type==='elevator'){
    r.noise(180,.12);const o=r.osc('triangle',55,.06);o.frequency.linearRampToValueAtTime(73,r.now+r.left);r.osc('sine',110,.025);
  }
  if(type==='airlock'){r.noise(1800,.12,.4,'bandpass');r.noise(170,.15);r.osc('sine',82,.035);}
  return r;
}
function metallic(ctx,type){
  const r=rig(ctx);r.env(1,.003,.12);const bases=type==='cup'?[1060,1830,2810]:type==='stone'?[430,713,1130]:[810,1420,2183];
  for(const [i,f] of bases.entries()){
    const v=r.ac.createGain(),o=r.ac.createOscillator();o.frequency.value=f;o.type='sine';v.gain.setValueAtTime(.08/(i+1),r.now);v.gain.exponentialRampToValueAtTime(.0001,r.now+Math.min(r.left,.8-i*.15));o.connect(v).connect(r.g);o.start();o.stop(r.now+r.left);r.sources.push(o);r.nodes.push(v);
  }
  r.noise(2800,type==='cup'?.015:.05,.5,'highpass');return r;
}
function transient(ctx,type){
  const r=rig(ctx);
  if(type==='cloth'){r.env(.15,.06,.4);const n=r.noise(1200,1,.7,'bandpass');n.filter.frequency.linearRampToValueAtTime(500,r.now+r.left);}
  if(type==='mechanism'){r.env(.23,.002,.1);r.noise(2500,.32,1,'highpass');const o=r.osc('triangle',730,.18);o.frequency.exponentialRampToValueAtTime(180,r.now+.1);}
  if(type==='radio'){r.env(.13,.03,.15);r.noise(1950,1,2,'bandpass');r.osc('sine',1200,.06);}
  if(type==='suitImpulse'){
    r.env(.8,.002,.18);const o=r.osc('sine',112,.28);o.frequency.exponentialRampToValueAtTime(38,r.now+.15);r.noise(230,.1,.6,'lowpass');
  }
  return r;
}
function basementGun(ctx){
  const r=rig(ctx);r.env(.55,.001,.4);
  const impulse=r.ac.createBuffer(2,Math.floor(r.ac.sampleRate*1.9),r.ac.sampleRate),random=rng(541);
  for(let ch=0;ch<2;ch++){const d=impulse.getChannelData(ch);for(let i=0;i<d.length;i++){const t=i/r.ac.sampleRate;d[i]=(random()*2-1)*Math.exp(-t*4.2)*.37;}for(const [t,a] of [[.026,.9],[.048,.7],[.085,.55],[.137,.35],[.211,.2]])d[Math.floor((t+ch*.002)*r.ac.sampleRate)]+=a;}
  const verb=r.ac.createConvolver();verb.buffer=impulse;const wet=r.ac.createGain();wet.gain.value=.62;verb.connect(wet).connect(r.g);r.nodes.push(verb,wet);
  const src=r.ac.createBufferSource();src.buffer=noiseBuffer(r.ac,.13,89,35);const filter=r.ac.createBiquadFilter();filter.type='lowpass';filter.frequency.value=6500;const gain=r.ac.createGain();gain.gain.value=.7;src.connect(filter).connect(gain);gain.connect(r.g);gain.connect(verb);src.start();r.sources.push(src);r.nodes.push(filter,gain);
  const o=r.osc('sine',155,.26);o.frequency.exponentialRampToValueAtTime(40,r.now+.17);return r;
}
function machine(ctx){
  const r=rig(ctx);r.env(.6,.6,.7);const motor=r.osc('sawtooth',74,.07);motor.frequency.setValueAtTime(74+Math.sin(ctx.offset)*12,r.now);motor.frequency.linearRampToValueAtTime(105,r.now+Math.min(4,r.left));
  const n=r.noise(2800,.12,.8,'bandpass');const lfo=r.ac.createOscillator(),depth=r.ac.createGain();lfo.frequency.value=17;depth.gain.value=500;lfo.connect(depth).connect(n.filter.frequency);lfo.start();lfo.stop(r.now+r.left);r.sources.push(lfo);r.nodes.push(depth);r.osc('sine',148,.04);return r;
}
function breathing(ctx){
  const r=rig(ctx);r.env(1,.3,.3);const n=r.noise(950,1,.65,'bandpass');
  n.gain.gain.setValueAtTime(0,r.now);
  const step=.07;for(let i=0;i<=r.left/step;i++){const t=i*step,ph=(ctx.offset+t)%5.4;const env=ph<2.1?Math.sin(ph/2.1*Math.PI)*.05:ph<4.7?Math.sin((ph-2.1)/2.6*Math.PI)*.035:.002;n.gain.gain.linearRampToValueAtTime(Math.max(.001,env),r.now+t);}
  r.noise(150,.012);r.osc('sine',76,.009);return r;
}
function score(ctx,type){
  const r=rig(ctx);r.env(1,2,3);
  const notes=type==='warmMotif'?[146.83,220,293.66]:type==='coldMotif'?[73.42,110,155.56]:type==='farewell'?[73.42,110,146.83,207.65]:[55,82.407,116.54];
  notes.forEach((f,i)=>{r.osc('sine',f,.037/(1+i*.25));const o=r.osc('sine',f*2.001,.006);o.detune.value=i*2;});
  // Sparse struck partials recall the collection's glass; the final phrase never resolves.
  const strikes=type==='farewell'?[0,7.5,14,24,31]:[1,7,14];
  for(const [i,t] of strikes.entries()){
    if(t<ctx.offset||t>=ctx.cue.end-ctx.cue.start)continue;const at=r.now+t-ctx.offset;
    for(let k=1;k<=3;k++){
      const o=r.ac.createOscillator(),g=r.ac.createGain();o.frequency.value=notes[(i+1)%notes.length]*Math.pow(2,k-1);g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(.032/(k*k),at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+Math.min(4,r.left));o.connect(g).connect(r.g);o.start(at);o.stop(Math.min(r.now+r.left+.05,at+4.1));r.sources.push(o);r.nodes.push(g);
    }
  }
  return r;
}
export function makeAudio(player){
  const bus=new WebAudioCueBus(player);bus.setMasterGain(.75);
  for(const name of ['room','courtyard','workroom','base','elevator','airlock'])bus.define(name,c=>ambience(c,name));
  for(const name of ['stone','metal','cup'])bus.define(name,c=>metallic(c,name));
  for(const name of ['cloth','mechanism','radio','suitImpulse'])bus.define(name,c=>transient(c,name));
  for(const name of ['warmMotif','coldMotif','spaceTone','farewell'])bus.define(name,c=>score(c,name));
  bus.define('basementGun',basementGun);bus.define('machine',machine);bus.define('breath',breathing);
  bus.define('beacon',ctx=>{const r=rig(ctx);r.env(.045,.01,.3);r.osc('sine',880,1);return r;});
  bus.define('alarm',ctx=>{const r=rig(ctx);r.env(.08,.1,.2);const o=r.osc('sine',740,.65);for(let t=0;t<r.left;t+=.7){o.frequency.setValueAtTime(740,r.now+t);o.frequency.linearRampToValueAtTime(520,r.now+t+.35);}return r;});
  bus.define('thruster',ctx=>{const r=rig(ctx);r.env(.5,.4,1);r.noise(230,.17,.7,'lowpass');r.osc('sine',47,.08);return r;});
  return bus;
}
