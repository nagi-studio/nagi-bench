import * as THREE from 'three';
import { applyPose, idle, walk, float, aim, lerpPose } from './cast.js';
import { clamp, mix, smooth, range, hash, track } from './math.js';
import { shotTimes } from './sound.js';

export const DURATION=318;
export const edit=[
  ['00-dust',0,12,'orbit','尘外'],
  ['01-alley',12,23,'courtyard','胡同深处'],
  ['02-smallworld',23,35,'collection','一个人的世界'],
  ['03-tea',35,46,'collection','地球也是陨石'],
  ['04-laughter',46,54,'collection','还价'],
  ['05-threestones',54,59,'collection','三块铁陨石'],
  ['06-request',59,70,'collection','礼物'],
  ['07-respect',70,81,'collection','尊重'],
  ['08-lathe',81,88,'workshop','切削'],
  ['09-metal',88,94,'workshop','形状'],
  ['10-afterhours',94,105,'workshop','下班以后'],
  ['11-test',105,114,'basement','地下室'],
  ['12-fragments',114,123,'basement','碎片'],
  ['13-ascent',123,138,'elevator','增援未来'],
  ['14-policy',138,151,'council','旧的航线'],
  ['15-locator',151,162,'base','一个没有离开的人'],
  ['16-unmoored',162,178,'orbit','无依之地'],
  ['17-father',178,190,'orbit','父亲'],
  ['18-hatch',190,201,'photo','日落时分'],
  ['19-portrait',201,211,'photo','最后的合影'],
  ['20-scope',211,221,'orbit','瞄准'],
  ['21-choice',221,231,'orbit','选择'],
  ['22-volleyone',231,235,'orbit','第一次闪光'],
  ['23-volleytwo',235,238,'orbit','第二次闪光'],
  ['24-volleythree',238,241,'orbit','第三次闪光'],
  ['25-flight',241,246,'orbit','十秒钟'],
  ['26-still',246,251,'photo','无辜'],
  ['27-impact',251,261,'photo','陨石雨'],
  ['28-rescue',261,267,'photo','抓住我'],
  ['29-airlock',267,273,'airlock','空气以内'],
  ['30-return',273,286,'orbit','归途'],
  ['31-empty',286,296,'orbit','能做的'],
  ['32-memory',296,307,'collection','世界的回声'],
  ['33-end',307,318,'orbit','尘外'],
];

const suitPose=(t)=>{const p=float(t);p.neck=[.02,.05*Math.sin(t*.3),-.03];return p;};
const hitTimes=[251.4,252.5,253.6,254.6,255.2];
const hitIndices=[0,1,2,5,8];

export function buildShots(scene,camera,worlds,dom){
  const fogs={courtyard:new THREE.FogExp2(0x182d31,.025),collection:new THREE.FogExp2(0x1b231e,.018),workshop:new THREE.FogExp2(0x14292c,.023),basement:new THREE.FogExp2(0x182625,.025),council:new THREE.FogExp2(0x172e39,.013),base:new THREE.FogExp2(0x10232d,.02),airlock:new THREE.FogExp2(0x19383c,.016)};
  const bg={courtyard:0x17292e,collection:0x15221d,workshop:0x10262b,basement:0x172322,base:0x0a1924,council:0x122c38,airlock:0x17333a};
  const v3=new THREE.Vector3(),dummy=new THREE.Object3D();
  function active(name,t){
    for(const [key,w] of Object.entries(worlds))w.root.visible=key===name;
    scene.background.set(bg[name]??0x03090f);scene.fog=fogs[name]??null;
    dom.scope.style.opacity='0';
    dom.title.style.opacity=String(t<12?1-smooth(range(t,7.5,11)):0);
    dom.credits.style.opacity=String(smooth(range(t,308,311)));
    dom.location.textContent=t>=12&&t<17?'地球 · 胡同深处':t>=81&&t<85?'太空军研究所 · 闭馆之后':t>=123&&t<128?'增援未来 · 第一特遣队':t>=151&&t<157?'三个月后 · 一号基地':t>=190&&t<194?'黄河空间站 · 日落':t>=267&&t<270?'黄河站 · 气闸舱':'';
    dom.location.style.opacity=dom.location.textContent?'1':'0';
    // Transitions use the master clock; there are no CSS-timed scene changes.
    let black=0;
    for(const cut of [12,81,105,123,151,162,190,267,296])black=Math.max(black,1-clamp(Math.abs(t-cut)/.38));
    if(t>=307)black=Math.max(black,smooth(range(t,307,310.8))*.96);
    dom.fade.style.opacity=String(black);
  }
  function collection(t){
    const w=worlds.collection;w.dust.update(t);
    w.collector.root.position.set(.5,0,-.95);w.collector.root.rotation.set(0,0,0);w.zhang.root.position.set(-1.3,0,1.2);w.zhang.root.rotation.set(0,2.8,0);
    const p=idle(t);p.neck=[.05,-.28+Math.sin(t*.2)*.035,0];p.armR=[-.62,0,.13];p.armL=[-.25,0,-.2];
    if(t>=23&&t<35){p.armR=[-.91+Math.sin(t*1.2)*.07,0,.15];p.neck=[.02,-.2,0];}
    if(t>=46&&t<54){p.hips=[0,0,-.025*Math.sin(t)];p.armL=[-.82,0,-.45];p.neck=[-.06,-.35,0];}
    if(t>=54&&t<70){p.armR=[-.9,0,.45];p.neck=[.2,-.22,0];}
    if(t>=70&&t<81){p.neck=[.03,-.4,.015];p.armR=[-.3,0,.1];}
    applyPose(w.collector,p);w.collector.expression(t>=46&&t<59?'smile':'calm');
    const z=idle(t+.7);z.neck=[.04,.12,0];z.armR=[-.17,0,.06];z.armL=[-.28,0,-.07];
    if(t>=35&&t<46){const raise=smooth(range(t,35,38))*(1-smooth(range(t,43,46)));z.armL=[-.25-raise*.85,.05,-.12];z.neck=[.05+raise*.07,.15,0];}
    if(t>=59&&t<70){z.neck=[.15,.2,0];z.armR=[-.7,0,.25];}
    if(t>=70&&t<81){z.armR=[-.45,0,.1];z.neck=[.02,.2,0];}
    applyPose(w.zhang,z);w.zhang.expression(t>=35&&t<46?'smile':'calm');
    w.handCup.visible=t>=23&&t<35;w.handCup.rotation.x=-.65;
    w.zhangCup.visible=t>=35&&t<46;w.zhangCup.rotation.x=-.55;
    w.tea1.visible=!(t>=35&&t<46);w.tea2.visible=!(t>=23&&t<35);
    for(const s of w.rocks)s.visible=t<296;
    if(t>=296){w.zhang.root.visible=false;w.collector.root.visible=false;}else{w.zhang.root.visible=true;w.collector.root.visible=true;}
    w.key.intensity=32+Math.sin(t*.3)*.25;
  }
  function workshop(t){
    const w=worlds.workshop;w.spindle.rotation.x=t*16;w.tool.position.x=.05+Math.sin(t*2)*.045;
    w.zhang.root.position.set(t<94?.6:.2,0,t<94?.8:1);w.zhang.root.rotation.y=t<94?3.3:2.6;
    const p=idle(t);p.neck=[.33,-.15,0];p.armR=[-1.1,0,.15];p.armL=[-.8,0,-.2];if(t>=94){p.neck=[.3,.4,0];p.armR=[-.7,0,.3];}
    applyPose(w.zhang,p);
    w.pieces.forEach((m,i)=>m.visible=i<Math.floor(range(t,87,99)*37));
    w.sparks.mesh.visible=t<94;w.sparks.mesh.position.set(.02,1.6,-.6);w.sparks.update(t*20);
    w.sparks.mesh.scale.setScalar(.7+Math.sin(t*25)*.3);
  }
  function basement(t){
    const w=worlds.basement;w.zhang.root.position.set(-.1,0,1.4);w.zhang.root.rotation.set(0,Math.PI,0);w.palm.position.set(1.5,.99,1.35);
    const p=aim(.015,0);p.legR=[0,0,.02];p.legL=[0,0,-.04];
    let recoil=0;[108.3,111,112.6,113.6].forEach((a,i)=>{if(t>=a&&t<a+.4)recoil+=Math.exp(-(t-a)*18)*.22;w.holes[i].visible=t>=a;});
    p.armR[0]-=recoil;p.hips=[recoil*.13,0,0];applyPose(w.zhang,p);
    w.handGun.visible=t<114;w.gun.visible=t>=114;w.palm.visible=t>=114;
    w.flash.intensity=recoil*140;w.flash.position.set(0,1.3,.6);
  }
  function orbit(t){
    const w=worlds.orbit;w.heroStone.visible=t<12;w.heroStone.rotation.set(t*.06+.4,t*.1,t*.03);w.heroStone.position.set(3.7,2.9,1.5);
    w.earth.rotation.set(.12,.65+t*.0007,.08);w.wheel.rotation.z=.12+t*.00045;
    w.debris.update(t);w.debris.mesh.position.set(0,-6,-50);
    w.fragment.visible=t>=241&&t<246;w.fragment.position.set(mix(-1.3,1,range(t,241,246)),1.2,-.2);w.fragment.rotation.set(t*.1,t*.2,0);
    w.zhang.root.visible=!(t>=241&&t<246)&&t<307;
    w.zhang.root.position.set(0,Math.sin(t*.25)*.04,0);w.zhang.root.rotation.set(.02,.12,.06);
    let p=suitPose(t);w.zhang.visor(t>=178&&t<190||t>=211);w.zhang.expression('calm');
    if(t<12){w.zhang.root.position.set(-4,-1.7,-8);w.zhang.root.rotation.set(-.1,2.6,-.25);}
    if(t>=178&&t<190){p.armR=[-.5,0,.2];p.armL=[-.65,0,-.1];p.neck=[-.05,-.17+range(t,178,190)*.3,-.02];}
    if(t>=211&&t<221){const a=smooth(range(t,211,220));p=lerpPose(suitPose(t),aim(-.05,0),a);p.neck=[.16,-.1,0];p.legR=[-.45,0,.1];p.legL=[-.25,0,-.12];}
    if(t>=221&&t<241){
      w.zhang.root.rotation.set(-.04,2.7,-.08);p=aim(-.02,-.03);p.hips=[-.08,0,.03];p.legR=[-.45,0,.12];p.legL=[-.25,0,-.14];
      let recoil=0;for(const a of shotTimes)if(t>=a&&t<a+.22)recoil=Math.max(recoil,Math.exp(-(t-a)*18));
      p.armR[0]-=recoil*.16;p.armL[0]-=recoil*.07;p.neck=[.04,-.08,-.015];
      for(const [a,b] of [[234,234.65],[237.2,237.95]])if(t>=a&&t<b){const reload=Math.sin(range(t,a,b)*Math.PI);p.armR[0]+=reload*.35;p.armL[0]+=reload*.65;p.neck[0]+=reload*.1;}
      w.zhang.root.position.z=recoil*.008;
    }
    if(t>=273&&t<286){const a=range(t,273,286);w.zhang.root.position.set(-a*20,a*4,-a*45);w.zhang.root.rotation.set(-.2,3.6,-.4);p.armR=[-.45,0,.12];p.armL=[-.32,0,-.12];}
    if(t>=286){w.zhang.root.rotation.set(.04,.25,.05);p.neck=[.18,.15,-.02];p.armR=[-.25,0,.08];p.armL=[-.5,0,-.2];w.zhang.expression(t>290?'down':'calm');}
    applyPose(w.zhang,p);
    w.gun.visible=t>=211&&t<273;w.scope.visible=t>=218&&t<273;
    w.zhang.root.updateMatrixWorld(true);w.flash.visible=false;w.flashLight.intensity=0;
    let flash=0;for(const a of shotTimes)if(t>=a&&t<a+.105)flash=Math.max(flash,1-(t-a)/.105);
    if(flash>0){w.zhang.anchors.handR.getWorldPosition(v3);const muzzle=new THREE.Vector3(0,1.2,8);w.zhang.anchors.handR.localToWorld(muzzle);w.flash.position.copy(muzzle);w.flash.quaternion.copy(w.zhang.root.quaternion);w.flash.scale.set(.1*flash,.1*flash,.21*flash);w.flash.visible=true;w.flashLight.position.copy(muzzle);w.flashLight.intensity=flash*2;}
    w.exhaust.mesh.visible=t>=273&&t<279;
    if(w.exhaust.mesh.visible){w.exhaust.update(t*10);w.exhaust.mesh.position.copy(w.zhang.root.position).add(new THREE.Vector3(.1,.5,1));w.exhaust.mesh.rotation.y=.6;}
    w.key.intensity=mix(3.5,1.8,range(t,190,267));w.sun.position.y=mix(20,-26,range(t,190,273));
  }
  function photo(t){
    const w=worlds.photo,open=smooth(range(t,191,194));w.hatchL.position.x=-.8-open*1.6;w.hatchR.position.x=.8+open*1.6;
    w.earth.rotation.y=.65+t*.0007;w.key.intensity=mix(3,1.45,range(t,190,261));w.sun.position.y=mix(7,-18,range(t,190,261));
    w.crew.forEach((a,i)=>{
      const exiting=smooth(range(t,192+i*.11,198+i*.11));a.root.position.set(6,.4,-5.5).lerp(a.base,exiting);
      a.root.position.x+=Math.sin(t*.3+i)*.025;a.root.position.y+=Math.sin(t*.6+i)*.025;
      a.root.rotation.set(.025*Math.sin(t+i),.04*Math.sin(t*.2+i),.045*Math.sin(t*.3+i));
      const p=float(t+i*2);p.hips=[-.08,0,.01];p.neck=[-.03,.04*Math.sin(i+t*.4),0];p.armR=[-.43,0,.18];p.armL=[-.36,0,-.16];p.legR=[-.22,0,.07];p.legL=[-.17,0,-.07];
      a.visor(t>=200+hash(i)*1.8);a.expression(i<3&&t<251?'smile':t>=254?'shock':'calm');
      const hit=hitIndices.indexOf(i);
      if(hit>=0&&t>hitTimes[hit]){
        const age=t-hitTimes[hit];a.root.position.add(new THREE.Vector3(age*.015,-age*.035,age*.012));a.root.rotation.z+=Math.min(age*.1,.8)*(i%2?1:-1);p.armR=[-.1,0,.35];p.armL=[-.2,0,-.3];p.neck=[.24,0,.12];a.expression(i<3?'down':'shock');
      }
      if(t>=260){const escape=smooth(range(t,260+hash(i)*1.3,267+hash(i)));a.root.position.lerp(new THREE.Vector3(6,.4,-5.5),escape);a.root.rotation.y=-.7;p.armR=[-.95,0,.25];p.armL=[-.85,0,-.25];}
      applyPose(a,p);a.root.visible=t<267;
    });
    w.photographer.root.position.set(3.5,1.1,7);w.photographer.root.rotation.set(0,Math.PI+.2,.06);w.photographer.expression(t>254?'shock':'calm');
    const pp=float(t);pp.hips=[-.1,0,0];pp.armR=[-1.3,0,.16];pp.armL=[-.98,0,-.18];pp.neck=[.05,0,0];
    if(t>254){const move=smooth(range(t,254,261));w.photographer.root.position.lerp(new THREE.Vector3(1.3,1.4,1.3),move);pp.armR=[-1.4,0,.35];pp.armL=[-1.25,.1,-.35];w.photographer.expression('shock');}
    if(t>261){const move=smooth(range(t,261,267));w.photographer.root.position.lerp(new THREE.Vector3(5,.9,-4),move);w.photographer.root.rotation.y=3.5;}
    applyPose(w.photographer,pp);
    for(let k=0;k<3;k++)w.crew[k].damage(t>=hitTimes[k]);
    w.gas.visible=t<203||(t>=251.4&&t<267);
    for(let i=0;i<160;i++){
      const d=w.gasData[i];let origin,age,opacity=1;
      if(t<203){const a=w.crew[i%27];origin=a.root.position;age=((t-192+hash(i)*2)%1.7+1.7)%1.7;opacity=1-smooth(range(t,199,203));dummy.position.set(origin.x+Math.sin(d.a)*age*.1,origin.y-.2-age*.5,origin.z+Math.cos(d.a)*age*.2);}
      else {const hit=i%5,ti=hitTimes[hit];origin=w.crew[hitIndices[hit]].root.position;age=t-ti-hash(i)*.65;opacity=age<0?0:1;age=((age%2.4)+2.4)%2.4;dummy.position.set(origin.x+Math.sin(d.a)*age*d.v*.3,origin.y+1.25+age*(.6+d.b*.3),origin.z+.18+age*d.v*.28);}
      dummy.scale.setScalar(d.s*(1+age*1.4)*opacity);dummy.rotation.set(d.a,t*.1,d.b);dummy.updateMatrix();w.gas.setMatrixAt(i,dummy.matrix);
    }
    w.gas.instanceMatrix.needsUpdate=true;
  }
  function other(name,t){
    if(name==='courtyard'){const w=worlds.courtyard;w.zhang.root.position.set(-.1,0,mix(5,-2.3,smooth(range(t,12,23))));w.zhang.root.rotation.y=Math.PI;applyPose(w.zhang,walk(t,.78));}
    if(name==='elevator'){const w=worlds.elevator;w.car.position.y=mix(-9,7,smooth(range(t,123,138)));w.earth.rotation.y=.65+t*.0008;for(const a of [w.a,w.b]){const p=idle(t);p.armR=[-.2,0,.06];p.armL=[-.25,0,-.06];applyPose(a,p);}}
    if(name==='council'){const w=worlds.council;w.directors.forEach((a,i)=>{const p=idle(t+i);p.neck=[.06,i===1?.07:-.2,0];p.armR=[-.75,0,.16];p.armL=[-.38,0,-.16];if(i===1)p.armR=[-.9+Math.sin(t*.6)*.08,0,.22];applyPose(a,p);});applyPose(w.zhang,{...idle(t),neck:[.06,.1,0]});}
    if(name==='base'){worlds.base.led.material.emissiveIntensity=.5+Math.pow(Math.max(0,Math.sin(t*2.8)),8)*2;}
    if(name==='airlock'){
      const w=worlds.airlock,p=float(t);p.armR=[-1.25,0,.4];p.armL=[-1.3,0,-.3];p.neck=[.3,-.3,0];p.legR=[-.1,0,.16];applyPose(w.rescuer,p);
      applyPose(w.victim,{neck:[.25,0,.12],armR:[-.3,0,.2],armL:[-.9,0,-.2],legR:[-.2,0,.08],legL:[-.4,0,-.08]});
      applyPose(w.other,{neck:[.2,0,.1],armR:[-.5,0,.2],armL:[-.1,0,-.2]});w.warning.intensity=7+Math.pow(Math.max(0,Math.sin(t*6)),4)*18;
      const move=range(t,267,273);w.rescuer.root.position.z=mix(-.6,.8,move);w.victim.root.position.z=mix(-.2,1.2,move);
    }
  }
  function frame(name,t){active(name,t);if(name==='collection')collection(t);else if(name==='workshop')workshop(t);else if(name==='basement')basement(t);else if(name==='orbit')orbit(t);else if(name==='photo')photo(t);else other(name,t);}
  const cameraMoves={
    '00-dust':[[6.4,4.2,15],[5.3,3.9,13],[0,2,-15],[0,2,-18],43,0],
    '01-alley':[[3.4,2.5,7],[2.5,2.1,3.2],[-.2,1.3,-2.5],[0,1.4,-3],44,0],
    '02-smallworld':[[3.5,2.05,4],[2.7,1.9,3.2],[.15,1.1,-.35],[.3,1.25,-.7],43,0],
    '03-tea':[[-2.5,1.4,-.6],[-2.05,1.35,-.35],[-1.3,1.3,1.2],[-1.3,1.4,1.2],38,0],
    '04-laughter':[[1.7,1.9,1.2],[1.5,1.8,1],[.5,1.4,-.9],[.5,1.45,-.9],35,0],
    '05-threestones':[[.4,1.35,1.1],[.25,1.28,.8],[0,1.05,.12],[0,1.05,.12],36,0],
    '06-request':[[-3.2,1.8,1.4],[-2.8,1.7,1.1],[-.4,1.2,0],[-.4,1.3,0],42,0],
    '07-respect':[[-2.9,1.65,-.2],[-2.5,1.6,-.15],[-1.3,1.45,1.2],[-1.3,1.45,1.2],36,0],
    '08-lathe':[[2.9,2.3,2.7],[2.4,2,2.2],[0,1.45,-.4],[0,1.5,-.5],42,-.04],
    '09-metal':[[.8,1.95,.25],[.6,1.85,.15],[-.2,1.6,-.6],[-.2,1.6,-.6],35,-.07],
    '10-afterhours':[[4.5,3.4,4.7],[3.5,3,4],[0,1,1],[0,1,1],43,0],
    '11-test':[[3,1.9,3.8],[2.6,1.8,3.3],[0,1.1,-.7],[0,1.2,-1],45,-.025],
    '12-fragments':[[2.05,1.56,2.15],[1.93,1.43,1.98],[1.5,1.04,1.35],[1.5,1.04,1.35],35,0],
    '13-ascent':[[7,-3,14],[6,12,12],[0,-7.5,0],[0,8.5,0],47,.05],
    '14-policy':[[4.4,2.2,4.6],[3.7,2.05,3.9],[0,1.4,-.85],[0,1.4,-.85],43,0],
    '15-locator':[[-.15,1.5,.6],[-.6,1.25,-.1],[-1.5,.9,-1.2],[-1.5,.9,-1.2],40,-.03],
    '16-unmoored':[[13,7,22],[10,5.5,19],[1,0,-24],[2,-1,-24],49,-.08],
    '17-father':[[1.5,1.7,2.55],[1.1,1.68,2.15],[0,1.47,0],[0,1.48,0],38,0],
    '18-hatch':[[12,5.3,10],[9.5,4.8,9],[3.5,2,-4],[2,2.9,-1],49,.035],
    '19-portrait':[[3.6,3.7,7.5],[2.8,3.55,6.6],[0,2.85,0],[0,2.85,0],41,0],
    '20-scope':[[-1.35,1.55,1.35],[-1.15,1.5,1.18],[-.2,1.17,.44],[-.2,1.2,.5],40,-.035],
    '21-choice':[[-.6,1.95,1.6],[-.4,1.85,1.4],[3.5,2.4,-8],[4,2.7,-9],44,-.03],
    '22-volleyone':[[3.5,1.75,1.4],[3.1,1.7,1.2],[.1,1.3,-.1],[.1,1.3,-.1],40,-.05],
    '23-volleytwo':[[1.1,1.8,-.4],[1,1.75,-.5],[0,1.5,.1],[0,1.5,.1],37,.06],
    '24-volleythree':[[-1.3,1.6,3.4],[-1.1,1.6,3.1],[2,2,-9],[2,2,-9],48,-.08],
    '25-flight':[[2.9,1.9,3.9],[2.4,1.7,3.3],[0,1.2,0],[0,1.2,0],39,.05],
    '26-still':[[.45,3.2,4.6],[.4,3.2,4.4],[0,2.95,0],[0,2.95,0],38,0],
    '27-impact':[[3.1,3.65,7.6],[4.2,4,8.7],[.3,3,0],[.3,3.1,0],44,.035],
    '28-rescue':[[4.2,3.2,6],[5,3,4.4],[1.1,2.4,.6],[3.3,1.9,-1.5],43,.08],
    '29-airlock':[[2.8,1.75,3.9],[2.3,1.55,3.2],[-.1,1.1,-.3],[-.1,1.15,.1],43,-.035],
    '30-return':[[6,4,12],[5,4,11],[-2,1,-10],[-9,2,-22],46,-.12],
    '31-empty':[[.95,1.7,2.15],[.85,1.68,2.05],[0,1.48,0],[0,1.46,0],38,0],
    '32-memory':[[.35,1.2,1.3],[2.3,1.7,3.6],[0,1.04,.1],[.1,1.1,-.5],40,0],
    '33-end':[[3,3,30],[3,3,33],[-25,-28,-194],[-25,-28,-194],47,0],
  };
  return edit.map(([id,start,end,world])=>({
    id,start,end,
    enter(){worlds[world].root.visible=true;},
    leave(){worlds[world].root.visible=false;},
    update({time,progress}){
      frame(world,time);const m=cameraMoves[id];track(camera,...m.slice(0,4),progress,m[4],m[5]);
      if(id==='21-choice'){dom.scope.style.opacity=String(smooth(range(time,224,226))*.65);}
      // A visual breath after the confession, then the cut lands on the first jet of gas.
      if(id==='26-still')camera.fov=38-range(time,246,251)*.7;
    },
  }));
}
