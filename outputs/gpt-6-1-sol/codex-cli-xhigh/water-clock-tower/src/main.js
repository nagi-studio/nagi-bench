import './style.css';
import { ClockScene } from './scene.js';
import { Mechanism, DT } from './physics.js';
import { Soundtrack } from './audio.js';

const $=id=>document.getElementById(id);
const audio=new Soundtrack();
const stage=new ClockScene($('world'));
let physics=new Mechanism(e=>audio.event(e));
let playing=true,filmTime=0,lastWall=performance.now(),lastChapter=-1,seeking=false;
const duration=30;
const mobile=()=>innerWidth<600;
const chapters=[
  {start:0,end:4,no:'序 / 00',kicker:'北宋 · 苏颂 · 1092',title:'水落<span class="title-dot">·</span><br>星移',deck:'一座以水为动力的<br>天文钟，如何自己守时？',symbol:'水运仪象台',en:'THE WATER-POWERED<br>ASTRONOMICAL CLOCK',diagram:'',label:'水运仪象台 · 原理剖视',small:'开封，中国 · 公元 1092 年',tag:'引子',caption:'九百多年前，苏颂让流水驱动天象，也让木偶按时报时。',camera:[[12.6,9.1,18.4],[.4,4.9,0]],endCamera:[[11.6,8.6,18.0],[.4,4.9,0]],calls:[['浑仪',[-1.0,9.2,0],0,0],['浑象',[.9,6.35,0],0,0],['报时装置',[4.1,4.5,0],0,0]]},
  {start:4,end:9,no:'壹 / 01',kicker:'流水 → 重量',title:'水入<br>受水壶',deck:'平水壶保持水位，<br>细流匀速注入轮上的小壶。',symbol:'动力从这里开始',en:'A STEADY FLOW<br>BECOMES WEIGHT',diagram:'<span>稳水位</span><i></i><b>积水重</b>',label:'01 / 平水与注水',small:'蓝色为水 · 金色为承力构件',tag:'水重',caption:'水位稳定，出水才均匀。受水壶越装越重，向下的力随之增大。',camera:[[-.1,6.9,11.6],[-1.7,4.3,.4]],endCamera:[[-.65,6.3,10.7],[-1.55,4.25,.4]],calls:[['平水壶',[-3.75,5.7,1],0,0,'water'],['匀速细流',[-1.63,4.95,.7],0,0,'water'],['受水壶 · 积水增重',[-1.66,4.2,.95],10,7,'water']]},
  {start:9,end:15,no:'贰 / 02',kicker:'重量 → 间歇转动',title:'够重<br>才放行',deck:'水重压下天衡，关舌松开。<br>枢轮走过一齿，随即再锁住。',symbol:'擒纵：把连续变成一步步',en:'THE ESCAPEMENT<br>RELEASE · ADVANCE · LOCK',diagram:'<span>积重</span><i></i><b id="esc-state">放行一齿</b><i></i><span>再锁住</span>',label:'02 / 天衡与擒纵',small:'停住 → 积重 → 放行 → 停住',tag:'擒纵',caption:'天衡像一杆秤：水够重才开锁；每次只让枢轮前进一齿。',camera:[[-.8,5.7,9.5],[-.95,3.6,.75]],endCamera:[[.2,5.3,9.0],[-.95,3.6,.75]],calls:[['天衡 · 称量水重',[-2.27,4.03,1.18],-125,-10],['关舌 · 一放一锁',[-1.1,4.25,1.1],15,15],['枢轮 · 三十六受水壶',[1.25,2.65,.95],0,0]]},
  {start:15,end:20,no:'叁 / 03',kicker:'枢轮 → 齿轮 → 天象',title:'轮转<br>星随',deck:'轮轴把力传给齿轮与立轴，<br>带动上层浑仪、中层浑象。',symbol:'同一水力，上下相连',en:'TRANSMISSION<br>FROM WATER TO THE SKY',diagram:'<span>枢轮</span><i></i><span>传动</span><i></i><b>天象</b>',label:'03 / 向上传递的动力',small:'浑象演示星空 · 浑仪随天周转',tag:'传动',caption:'枢轮带动齿轮，齿轮再带立轴；同一节律传到楼上的天文仪器。',camera:[[9.2,8.6,13.0],[.6,6.35,-.1]],endCamera:[[7.7,9.6,12.2],[.55,6.8,-.1]],calls:[['传动立轴',[1.25,5,-.55],10,0],['浑象 · 演示星空',[.5,6.15,.65],0,0],['浑仪 · 随天周转',[.5,8.9,.7],0,0]]},
  {start:20,end:26,no:'肆 / 04',kicker:'传动 → 触发 → 报时',title:'到刻<br>自鸣',deck:'报时轮的凸起顶动木偶手臂，<br>槌落击钟；轮上时牌依次转出。',symbol:'有声，也有形的时间',en:'THE TIME SIGNAL<br>CAM · JACK · BELL',diagram:'<span>凸起顶动</span><i></i><b>击钟报时</b>',label:'04 / 报时机构',small:'以击钟与时牌演示 · 原台兼有鼓、钲',tag:'报时',caption:'传动也推动报时轮：到达设定刻度，木偶击钟，时牌转出，告诉人们时刻。',camera:[[8.2,5.9,8.1],[4.0,3.95,.1]],endCamera:[[7.5,5.5,7.8],[4.0,3.95,.1]],calls:[['报时轮 · 凸起触发',[3.65,3.48,.1],-150,-10],['木偶执槌',[4.45,4.05,.2],-130,-28],['铜钟 · 报时',[5.4,3.85,.2],10,0],['时牌 · 依次转出',[3.45,4.58,.5],-130,0]]},
  {start:26,end:30,no:'终 / 05',kicker:'以水为力 · 以衡为节',title:'以水<br>刻时',deck:'一滴滴水，积成一次次放行。<br>天上的星与地上的时，就此相连。',symbol:'苏颂 · 水运仪象台',en:'A DROP OF WATER.<br>A MEASURE OF TIME.',diagram:'<span>水重</span><i></i><span>擒纵</span><i></i><span>传动</span><i></i><b>报时</b>',label:'水的重量，变成时间',small:'观天 · 演象 · 报时，合于一台',tag:'合奏',caption:'水给动力，擒纵定节律，传动送天象，木偶报时辰。',camera:[[11.6,8.6,18],[.4,4.9,0]],endCamera:[[12.8,9.3,19.1],[.4,4.9,0]],calls:[]},
];
const callouts=[];
function setChapter(index){
  const c=chapters[index];
  $('chapter-no').textContent=c.no;$('chapter-kicker').textContent=c.kicker;$('chapter-title').innerHTML=c.title;$('chapter-deck').innerHTML=c.deck;$('chapter-symbol').textContent=c.symbol;$('chapter-en').innerHTML=c.en;$('micro-diagram').innerHTML=c.diagram;
  $('scene-label-text').textContent=c.label;$('scene-label-small').textContent=c.small;$('caption-index').textContent=c.tag;$('caption').textContent=c.caption;
  $('callouts').replaceChildren();callouts.length=0;
  c.calls.forEach((a,i)=>{const el=document.createElement('div');el.className='callout '+(a[4]||'');el.innerHTML=`<em>${i+1}</em><span>${a[0]}</span>`;$('callouts').append(el);callouts.push({el,data:a});});
  document.querySelectorAll('[data-jump]').forEach((e,i)=>e.classList.toggle('active',i===index));lastChapter=index;
  stage.focus(index);
}
function drawForces(index,progress){
  const path=points=>points.map((pt,i)=>{const p=stage.project(pt);return `${i?'L':'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;}).join(' ');
  let paths=[];
  if(index===1||index===2){
    paths.push({p:[[-1.99,4.53,1.12],[-1.99,3.94,1.12]],c:'#8dd8c5'});
    if(index===2){const arc=[];for(let i=0;i<=12;i++){const a=Math.PI*.75+i*.017;arc.push([-.25+2.18*Math.cos(a),2.8+2.18*Math.sin(a),.95]);}paths.push({p:arc,c:physics.locked?'#c2ac77':'#b0efcf'});}
  }
  if(index===3){
    paths.push({p:[[.35,2.95,1.05],[1.22,2.95,1.05],[1.28,5.0,.15],[1.28,7.5,.15]],c:'#d3bd83'});
    paths.push({p:[[1.28,5.7,.15],[.45,5.7,.9]],c:'#91d3b8'});
    paths.push({p:[[1.28,7.55,.15],[.28,8.0,.9]],c:'#91d3b8'});
  }
  if(index===4){
    const sy=physics.bodies.slider.position.y;
    paths.push({p:[[3.65,3.25,.3],[3.65,sy,.3],[4.25,3.82,.3]],c:'#a4ddbf'});
  }
  $('flow-paths').innerHTML=paths.map(({p,c})=>`<path d="${path(p)}" fill="none" stroke="${c}" stroke-width="1.7" stroke-dasharray="5 7" stroke-dashoffset="${-physics.totalAngle*25}" marker-end="url(#flow-tip)" opacity=".75"/>`).join('');
  $('flow-overlay').style.opacity=progress>.12?'1':'0';
}
const smooth=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function framePresentation(){
  let index=chapters.findIndex(c=>filmTime>=c.start&&filmTime<c.end);if(index<0)index=chapters.length-1;
  if(index!==lastChapter)setChapter(index);
  const c=chapters[index],progress=Math.min(1,(filmTime-c.start)/(c.end-c.start));
  let pos=lerp(c.camera[0],c.endCamera[0],progress),target=lerp(c.camera[1],c.endCamera[1],progress);
  // Camera alone is keyframed; the machinery always comes from Cannon bodies.
  if(index>0&&filmTime-c.start<.8){
    const prev=chapters[index-1],blend=smooth((filmTime-c.start)/.8);pos=lerp(prev.endCamera[0],pos,blend);target=lerp(prev.endCamera[1],target,blend);
  }
  if(mobile()){
    const distance=index===0||index===5?1.25:1.30;
    pos=pos.map((v,i)=>target[i]+(v-target[i])*distance);
    target[1]+=.05;
  }
  stage.cameraAt(pos,target);
  drawForces(index,progress);
  for(const {el,data}of callouts){
    const p=stage.project(data[1]);const dx=mobile()?0:data[2],dy=mobile()?0:data[3];
    el.style.left=`${p.x+dx}px`;el.style.top=`${p.y+dy}px`;
    el.style.opacity=progress>.12&&p.x>innerWidth*(mobile()?.10:.33)&&p.x<innerWidth*.90&&p.y>innerHeight*.18&&p.y<innerHeight*.75?'1':'0';
  }
  const esc=$('esc-state');if(esc){esc.textContent=physics.locked?'锁住 · 等水重':'放行 · 走一齿';esc.style.color=physics.locked?'#c3ba93':'#9de6cd';}
  $('cycle-hud').classList.toggle('visible',index===1||index===2);$('load-bar').style.width=`${Math.min(100,physics.load/.19*100)}%`;$('cycle-state').textContent=physics.locked?'积水 · 锁住':'放行 · 走一齿';$('cycle-hud').classList.toggle('released',!physics.locked);
  $('time').textContent=String(Math.floor(filmTime+.001)).padStart(2,'0');$('timeline').value=filmTime;$('timeline-fill').style.width=`${filmTime/30*100}%`;
  $('ending').classList.toggle('visible',filmTime>=29.9);
}
function setPlaying(value){playing=value;audio.setPlaying(value);$('play').setAttribute('aria-label',value?'暂停':'播放');$('play-icon').innerHTML=value?'<path d="M8 5v14M16 5v14"/>':'<path d="m8 4 12 8-12 8Z"/>';lastWall=performance.now();}
function seekTo(time){
  const dest=Math.max(0,Math.min(duration,time));seeking=true;
  const enabled=audio.enabled;audio.enabled=false;
  if(dest<physics.time)physics=new Mechanism(e=>audio.event(e));
  while(physics.time+DT/2<dest)physics.step();
  audio.enabled=enabled;audio.reset();filmTime=dest;stage.sync(physics);framePresentation();stage.render();lastWall=performance.now();seeking=false;
}
function restart(){seekTo(0);setPlaying(true);}
$('play').addEventListener('click',()=>{if(filmTime>=duration)restart();else setPlaying(!playing);});
$('replay').addEventListener('click',restart);$('ending-replay').addEventListener('click',restart);
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();restart();});
$('sound').addEventListener('click',async()=>{
  if(audio.enabled){audio.mute();$('sound-text').textContent='开启声音';$('sound').setAttribute('aria-label','开启合成声音');$('sound-waves').setAttribute('d','m16 9 5 6m0-6-5 6');}
  else {await audio.enable();$('sound-text').textContent='声音已开';$('sound').setAttribute('aria-label','关闭声音');$('sound-waves').setAttribute('d','M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14');if(filmTime>=duration)restart();}
});
$('timeline').addEventListener('input',e=>{seekTo(Number(e.target.value));if(filmTime<duration&&!playing)setPlaying(false);});
document.querySelectorAll('[data-jump]').forEach(e=>{e.style.left=`${Number(e.dataset.jump)/30*100}%`;e.addEventListener('click',()=>{seekTo(Number(e.dataset.jump));setPlaying(true);});});
window.addEventListener('resize',()=>{stage.resize();framePresentation();stage.render();});
window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.code==='Space'){e.preventDefault();$('play').click();}if(e.code==='KeyM')$('sound').click();if(e.code==='KeyR')restart();});
document.addEventListener('visibilitychange',()=>{lastWall=performance.now();});
function loop(wall){
  const delta=Math.max(0,Math.min(duration,(wall-lastWall)/1000));lastWall=wall;
  const advancing=playing&&!seeking&&!document.hidden;
  if(advancing){
    filmTime=Math.min(duration,filmTime+delta);
    while(physics.time+DT/2<filmTime)physics.step();
    audio.update(filmTime);
    if(filmTime>=duration)setPlaying(false);
  }
  if(advancing){stage.sync(physics);framePresentation();stage.render();}
  requestAnimationFrame(loop);
}
stage.sync(physics);framePresentation();stage.render();$('loading').classList.add('done');
// Local, read-only diagnostics make offline previews and solver checks easy.
window.__film={get time(){return filmTime},get playing(){return playing},get physics(){return physics.state()},get sound(){return audio.status()},get drawCalls(){return stage.renderer.info.render.calls},seek:seekTo,pause:()=>setPlaying(false),play:()=>setPlaying(true),restart};
requestAnimationFrame(loop);
