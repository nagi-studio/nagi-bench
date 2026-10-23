import './style.css';
import { Mechanism, DT } from './physics.js';
import { Exhibition } from './scene.js';
import { Soundtrack } from './audio.js';

const $=s=>document.querySelector(s),duration=32;
const sound=new Soundtrack();
let simulation=new Mechanism(type=>sound.event(type)),playing=true,filmTime=0,accumulator=0,last=performance.now(),seeking=false,lastStage=-1,lastCaption=-1;
const exhibit=new Exhibition($('#scene'));
const stages=[
 {from:0,kicker:'一座用水走动的天文钟',title:'以水为钟',subtitle:'苏颂的水运仪象台',description:'水的重量，变成齿轮的脚步。<br>一千年前，人们让时间自己走动。',concept:'从一滴水，看见一整座机械的秩序。',number:'序',heading:'水运仪象台 · 原理剖面'},
 {from:4,kicker:'01 / 动力从哪里来',title:'水落，轮动',subtitle:'水的重量，就是动力',description:'平水壶维持稳定水位，水流较为均匀。<br>水落进受水斗，水斗一点点变重。',concept:'水越积越多，向下的重力也越大。',number:'01',heading:'近看 · 供水与受水斗'},
 {from:10,kicker:'02 / 如何走得有节奏',title:'够重，才放行',subtitle:'把水流，变成一步一步',description:'水斗压动衡杆，止轮机构松开。<br>水轮前进一步，又被下一道止齿拦住。',concept:'蓄水 → 放行 → 前进一步 → 再锁住',number:'02',heading:'近看 · 衡杆与止轮机构'},
 {from:17,kicker:'03 / 一处动力，逐级传递',title:'一轮，带众轮',subtitle:'齿轮，把脚步传向上方',description:'水轮的轴带动相邻齿轮，再传给天柱。<br>上方的浑仪与浑象随之缓缓转动。',concept:'这套传动让天象与报时共用一个节奏。',number:'03',heading:'循着动力 · 从水轮到天象'},
 {from:23,kicker:'04 / 时间如何被听见',title:'到时，自鸣',subtitle:'拨牙触发木偶，敲钟报时',description:'报时轮转到设定位置，拨牙抬起槌臂。<br>槌臂落下敲钟，让人听见时刻。',concept:'报时的间隔，由水轮节奏与传动比决定。',number:'04',heading:'近看 · 拨轮与报时木偶'},
 {from:28.5,kicker:'从流水，到有序的时间',title:'以水为钟',subtitle:'苏颂 · 水运仪象台',description:'水供动力，衡杆定步，齿轮传动。<br>天象随之运转，木偶按时报时。',concept:'水 → 定步 → 传动 → 天象与报时',number:'终',heading:'水运仪象台 · 一座机械的秩序'}
];
const captions=[
 [0,'它既能演示天象，也能自动报时。秘密，藏在下方的水轮里。','00'],
 [4,'平水壶溢走多余的水，让水位和出水保持稳定。','01'],
 [7.4,'水斗蓄水变重；水轮暂时被止轮机构拦住。','01'],
 [10,'水斗够重，就压动衡杆，让止轮机构松开。','02'],
 [13.3,'水轮只前进一步，又被拦住；下一斗继续蓄水。','02'],
 [17,'轮轴带动齿轮，再把转动传给向上的天柱。','03'],
 [20.2,'浑仪与浑象随之转动，模拟星空每天的转动。','03'],
 [23,'报时轮的拨牙到位，抬起木偶的槌臂。','04'],
 [26,'槌臂在重力下落，敲响铜钟，按时报时。','04'],
 [28.5,'水供动力，衡杆定步，齿轮传动，木偶报时。','终']
];
function renderText(){
 let index=0;for(let i=0;i<stages.length;i++)if(filmTime>=stages[i].from)index=i;
 const s=stages[index];if(index!==lastStage){lastStage=index;$('#chapter-kicker').textContent=s.kicker;$('#title').textContent=s.title;$('#subtitle').textContent=s.subtitle;$('#description').innerHTML=s.description;$('#concept-text').textContent=s.concept;$('.concept-number').textContent=s.number;$('#scene-heading').textContent=s.heading;$('.eyebrow #eyebrow').textContent=index===0||index===5?'北宋 · 开封 · 公元 1092 年':'苏颂 · 水运仪象台';document.querySelectorAll('.chapters button').forEach((b,i)=>b.classList.toggle('active',i===(index===5?0:index)));}
 let ci=0;for(let i=0;i<captions.length;i++)if(filmTime>=captions[i][0])ci=i;
 if(ci!==lastCaption){lastCaption=ci;$('#caption').textContent=captions[ci][1];$('#caption-index').textContent=captions[ci][2];}
 $('#current-time').textContent=`00:${String(Math.floor(filmTime)).padStart(2,'0')}`;$('#progress').style.width=`${filmTime/duration*100}%`;$('#timeline').value=filmTime;
 $('#mechanism-text').textContent=simulation.state||'水正在流入受水斗';$('#end-replay').hidden=filmTime<duration;
 return index===5?0:index;
}
function setPlaying(value){playing=value;$('#play').setAttribute('aria-label',value?'暂停':'播放');$('#play-icon').innerHTML=value?'<path d="M4 3h3v10H4zM9 3h3v10H9z"/>':'<path d="m4 2 10 6-10 6z"/>';sound.setPlaying(value);last=performance.now();}
function seek(time,continuePlaying=playing){
 seeking=true;const target=Math.max(0,Math.min(duration,Number(time)));simulation=new Mechanism();
 while(simulation.time+DT/2<target)simulation.step();
 simulation.onEvent=type=>sound.event(type);filmTime=target;accumulator=0;last=performance.now();sound.nextNote=target+.4;lastStage=-1;lastCaption=-1;exhibit.sync(simulation);exhibit.frame(filmTime,renderText());seeking=false;setPlaying(continuePlaying&&target<duration);
}
$('#play').addEventListener('click',()=>{if(filmTime>=duration)seek(0,true);else setPlaying(!playing);});
$('#replay').addEventListener('click',()=>seek(0,true));$('#end-replay').addEventListener('click',()=>seek(0,true));
$('#timeline').addEventListener('input',e=>seek(e.target.value));document.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>seek(b.dataset.time,true)));
$('#sound').addEventListener('click',async()=>{if(sound.enabled)sound.mute();else await sound.enable();sound.setPlaying(playing);$('#sound').setAttribute('aria-pressed',sound.enabled);$('#sound').setAttribute('aria-label',sound.enabled?'关闭声音':'开启程序合成声音');$('#sound span').textContent=sound.enabled?'声音已开启':'开启声音';});
$('#fullscreen').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else $('#app').requestFullscreen?.();});
let beforeDialog=true;$('#info').addEventListener('click',()=>{beforeDialog=playing;setPlaying(false);$('#notes').showModal();});$('#close-notes').addEventListener('click',()=>$('#notes').close());$('#notes').addEventListener('close',()=>setPlaying(beforeDialog));$('#notes').addEventListener('click',e=>{if(e.target===$('#notes')){const rect=e.target.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)$('#notes').close();}});
window.addEventListener('resize',()=>{exhibit.resize();exhibit.frame(filmTime,renderText());});
document.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement||$('#notes').open)return;if(e.code==='Space'){e.preventDefault();if(filmTime>=duration)seek(0,true);else setPlaying(!playing);}if(e.code==='ArrowRight')seek(filmTime+5);if(e.code==='ArrowLeft')seek(filmTime-5);if(e.key.toLowerCase()==='m')$('#sound').click();});
document.addEventListener('visibilitychange',()=>{last=performance.now();});
function frame(now){
 const elapsed=(now-last)/1000;last=now;
 if(playing&&!seeking&&!document.hidden){accumulator+=Math.min(elapsed,4);while(accumulator>=DT&&filmTime<duration){simulation.step();filmTime=Math.min(duration,filmTime+DT);accumulator-=DT;}const stage=renderText();exhibit.sync(simulation);exhibit.frame(filmTime,stage);if(filmTime>=duration)setPlaying(false);sound.update(filmTime,playing);}
 requestAnimationFrame(frame);
}
// Read-only inspection and deterministic replay make verification possible at
// low software-rendering frame rates. Seeking re-simulates forces from t=0.
window.__film={get time(){return filmTime;},get playing(){return playing;},get state(){return simulation.snapshot();},seek,pause:()=>setPlaying(false),play:()=>setPlaying(true),get renderer(){return {calls:exhibit.renderer.info.render.calls,triangles:exhibit.renderer.info.render.triangles};}};
exhibit.sync(simulation);renderText();exhibit.frame(0,0);
requestAnimationFrame(()=>{last=performance.now();requestAnimationFrame(frame);});
