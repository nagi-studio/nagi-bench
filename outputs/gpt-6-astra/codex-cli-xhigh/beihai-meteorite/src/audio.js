import step from './assets/audio/footstep_wood_001.ogg?inline';
import cup from './assets/audio/impactGlass_light_001.ogg?inline';
import click from './assets/audio/impactMetal_light_002.ogg?inline';
import metal from './assets/audio/impactMetal_heavy_002.ogg?inline';
import motor from './assets/audio/engineCircular_001.ogg?inline';
import door from './assets/audio/doorOpen_001.ogg?inline';
import report from './assets/audio/explosionCrunch_000.ogg?inline';
import thruster from './assets/audio/thrusterFire_000.ogg?inline';
import radio from './assets/audio/computerNoise_000.ogg?inline';
const cues=[];
function s(id,sound,start,end,gain=.3,sustain=false,group='sfx'){cues.push({id,kind:'sound',sound,start,end,gain,sustain,group});}
s('score-earth','warm-score',.05,68,.38,true,'music');
s('room-air','room',12,68,.15,true,'ambience');
for(let i=0;i<8;i++)s(`step-${i}`,'step',13+i*.8,13.7+i*.8,.12);
s('door-wood','door',18,20,.13);s('tea-ceramic','cup',47,48,.23);s('stone-table','metal',59,60,.13);s('case-close','click',66.8,67.7,.2);
s('machine-loop','motor',68,85,.3,true);s('machine-bass','machine',68,85,.24,true);for(let i=0;i<8;i++)s(`lathe-${i}`,'cut',77+i*.86,77.8+i*.86,.07);
s('cellar-air','room',85,111,.11,true);s('weapon-contact','click',89,90,.25);s('weapon-ready','click',93.4,94,.18);
for(const [i,t] of [95,96.3,97.6].entries()){s(`test-report-${i}`,'report',t,t+1.5,.53);s(`test-reverb-${i}`,'room-hit',t,t+1.8,.55);for(let j=1;j<=3;j++)s(`test-echo-${i}-${j}`,'report',t+j*.11,t+1.3+j*.11,.18/(j*j));}
s('stone-fall','click',100.5,101.7,.12);s('fragment-tone','dark-score',100,126,.18,true,'music');
s('station-score','wide-score',126,150,.32,true,'music');
s('suit-air','suit',149,211,.2,true,'ambience');
s('radio-open','radio',153,153.4,.035);s('radio-photo','radio',164,164.3,.045);
s('suit-contact','click',188,188.7,.1);
for(const [i,t] of [194,196,198].entries()){s(`conducted-${i}`,'conducted',t,t+.24,.2);s(`conducted-metal-${i}`,'inside-metal',t,t+.38,.07);}
s('radio-emergency','radio',214,214.7,.06);s('suit-warning','alarm',215,222,.12,true);s('radio-return','radio',223,223.6,.08);
s('return-thrust','thruster',231,233,.08);s('return-air','suit',231,241,.14,true,'ambience');s('return-score','dark-score',231,246,.32,true,'music');s('room-memory','room',241,246,.13,true,'ambience');s('last-note','last-note',246,252,.3,true,'music');
export const soundCues=cues;
export function registerAudio(bus){
 bus.defineSample('step',step,{playbackRate:.83}).defineSample('cup',cup).defineSample('click',click,{playbackRate:.78}).defineSample('metal',metal,{playbackRate:.65}).defineSample('inside-metal',metal,{playbackRate:.25}).defineSample('motor',motor,{loop:true,playbackRate:.7}).defineSample('cut',metal,{playbackRate:1.4}).defineSample('door',door,{playbackRate:.8}).defineSample('report',report,{playbackRate:1.5}).defineSample('radio',radio,{playbackRate:1.6}).defineSample('thruster',thruster,{playbackRate:.62});
 const noise=(ac,duration,seed=4)=>{const buf=ac.createBuffer(1,Math.ceil(ac.sampleRate*duration),ac.sampleRate),a=buf.getChannelData(0);let x=seed,prev=0;for(let i=0;i<a.length;i++){x=(Math.imul(x,1664525)+1013904223)|0;prev=(prev+((x>>>0)/2147483648-1)*.1)/1.04;a[i]=prev;}return buf};
 function airy(name,freq,q,amp,breathing=false){bus.define(name,({audioContext:ac,output,cue,offset})=>{const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),g=ac.createGain();src.buffer=noise(ac,4);src.loop=true;filter.type='bandpass';filter.frequency.value=freq;filter.Q.value=q;src.connect(filter).connect(g).connect(output);const now=ac.currentTime;g.gain.value=amp;if(breathing){for(let j=0;j<Math.ceil((cue.end-cue.start-offset)*10);j++){const ph=(offset+j/10)%4.5;g.gain.setValueAtTime(amp*(.14+.86*Math.pow(Math.max(0,Math.sin(ph/4.5*Math.PI*2)),2)),now+j/10)}}src.start(0,offset%4);return{stop(){src.stop()}}})}
 airy('room',330,.3,.45);airy('suit',720,.75,1.7,true);airy('machine',2400,1.7,.9);
 function tone(name,freq,duration=.3){bus.define(name,({audioContext:ac,output})=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(freq,ac.currentTime);o.frequency.exponentialRampToValueAtTime(30,ac.currentTime+duration);g.gain.setValueAtTime(.6,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+duration);o.connect(g).connect(output);o.start();o.stop(ac.currentTime+duration+.02);return{stop(){try{o.stop()}catch{}}}})}
 tone('conducted',95,.21);
 bus.define('room-hit',({audioContext:ac,output})=>{const src=ac.createBufferSource();src.buffer=noise(ac,.065,8);const conv=ac.createConvolver(),imp=ac.createBuffer(2,ac.sampleRate*1.7,ac.sampleRate);for(let ch=0;ch<2;ch++){const a=imp.getChannelData(ch);for(let i=0;i<a.length;i++){const env=Math.exp(-i/ac.sampleRate*3.5);a[i]=Math.sin(i*1783.23+ch)*env*(i/ac.sampleRate>.025?1:0)}for(let t of [.034,.067,.091,.132,.191,.247])a[Math.floor(ac.sampleRate*(t+ch*.007))]=.9;}conv.buffer=imp;src.connect(conv).connect(output);src.start();return{stop(){src.stop()}}});
 bus.define('alarm',({audioContext:ac,output,cue,offset})=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=720;o.connect(g).connect(output);const now=ac.currentTime;g.gain.value=0;for(let j=0;j<cue.end-cue.start-offset;j++){g.gain.setValueAtTime(.24,now+j);g.gain.setValueAtTime(0,now+j+.11);}o.start();return{stop(){o.stop()}}});
 const score=(name,notes,interval)=>bus.define(name,({audioContext:ac,output,cue,offset})=>{const voices=[],now=ac.currentTime,remaining=cue.end-cue.start-offset;for(let t=0;t<cue.end-cue.start;t+=interval){const rel=t-offset;if(rel<-.5)continue;const n=notes[Math.floor(t/interval)%notes.length];for(let k=0;k<3;k++){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=n*(k===0?1:k===1?2:3);o.detune.value=k===1?3:0;const at=now+Math.max(0,rel);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(k===0?.18:.035,at+.12);g.gain.exponentialRampToValueAtTime(.0001,at+Math.min(7,remaining-Math.max(0,rel)+.01));o.connect(g).connect(output);o.start(at);o.stop(at+7.1);voices.push(o)}}return{stop(){voices.forEach(o=>{try{o.stop()}catch{}})}}});
 score('warm-score',[146.83,220,196,164.81,146.83,110],8.2);score('dark-score',[73.42,77.78,110,73.42],6);score('wide-score',[73.42,146.83,220,293.66],5.3);score('last-note',[146.83],10);
 return bus;
}
