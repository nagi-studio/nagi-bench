import * as T from 'three';
import {createSkin,applyPose,idle,float as floatPose} from '@agentbench/voxel-kit';
import {box,mat,glow,lineBox,label,rock,cup,weapon,figure,starField,earth,station,particles,rng} from './assets.js';
function world(bg,fog=false){const root=new T.Group();const light=new T.Group();root.add(light);return{root,light,bg,fog}}
function lighting(w,{ambient=.4,key=3,color=0xffd6a1,pos=[-3,6,4],shadow=true}={}){const amb=new T.HemisphereLight(0xbad5db,0x172029,ambient);w.light.add(amb);const l=new T.DirectionalLight(color,key);l.position.set(...pos);l.castShadow=shadow;l.shadow.mapSize.set(2048,2048);Object.assign(l.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.1,far:55});l.shadow.bias=-.00035;l.shadow.normalBias=.035;w.light.add(l);w.key=l;return l}
function practical(w,x,y,z,color,power=12){box(w.root,x,y,z,.42,.08,.3,0,glow(color,2));const p=new T.PointLight(color,power,7,2);p.position.set(x,y-.15,z);w.light.add(p)}
export function buildCollector(){const w=world(0x101a1d,true),g=w.root;lighting(w,{ambient:.62,key:2.8,pos:[-5,7,3]});
 box(g,0,4.08,-.3,12,.16,9,0x292d29);const fill=new T.DirectionalLight(0xb2c6c7,.65);fill.position.set(4,3,7);w.light.add(fill);box(g,0,-.16,0,12,.3,11,0x302b26);for(let i=0;i<24;i++)box(g,(i-11.5)*.49,.005,0,.475,.04,10, i%3===0?0x504132:i%3===1?0x463a2e:0x3e342a);
 box(g,0,2,-4.4,12,4,.22,0x504b3d);box(g,-5.8,2,0,.25,4,9,0x5a5849);box(g,5.8,2,0,.25,4,9,0x524936);
 for(let x of [-5.4,-2.8,0,2.8,5.4])box(g,x,2,-4.15,.16,4,.18,0x2d2b27);box(g,0,3.8,-4.1,11,.24,.3,0x242b28);
 const glass=new T.MeshPhysicalMaterial({color:0xa5c5bd,transparent:true,opacity:.075,roughness:.18,metalness:.15,depthWrite:false});
 for(let i=0;i<5;i++){const x=(i-2)*2.05;box(g,x,1.7,-3.8,1.9,3.1,.6,0x282d28);box(g,x,1.7,-3.43,1.75,2.85,.035,0,glass);for(let y of [.58,1.45,2.33,3.15]){box(g,x,y,-3.42,1.88,.055,.75,0x8b7960);if(y<3){for(let k=0;k<3;k++){const r=rock(.18+(i+k)%3*.06,i*3+k);r.position.set(x+(k-1)*.54,y+.17,-3.38);g.add(r);const lbl=label('Fe–Ni · '+(100+i*3+k),.42,.1,'#c6bb9d');lbl.position.set(x+(k-1)*.54,y+.045,-3.005);g.add(lbl)}}}practical(w,x,3.25,-3.28,0xffc477,8)}
 // Lattice window; the warm beam cuts across the dark room.
 box(g,-5.6,2.2,-.5,.05,2.4,3.4,0,glow(0xc6d6c3,.6));for(let i=0;i<7;i++)box(g,-5.52,2.2,-2+i*.5,.09,2.5,.04,0x343831);for(let i=0;i<5;i++)box(g,-5.52,1.1+i*.56,-.5,.09,.035,3.5,0x343831);
 box(g,0,.8,.2,3.5,.16,1.5,0x6c5033);for(let x of [-1.45,1.45])for(let z of [-.3,.7])box(g,x,.39,z,.16,.78,.16,0x3c3026);box(g,0,.89,.2,2.6,.025,1,0x2d4442);
 w.cups=[cup(),cup()];w.cups[0].position.set(-.85,.97,.28);w.cups[1].position.set(.9,.97,-.1);w.cups.forEach(o=>g.add(o));
 w.stones=[];for(let i=0;i<3;i++){const r=rock(.27,11+i);r.position.set((i-1)*.42,.99,.15);g.add(r);w.stones.push(r)}
 w.hero=figure();w.hero.root.position.set(-1.35,0,1.45);w.hero.root.rotation.y=.65;g.add(w.hero.root);
 w.collector=figure('collector');w.collector.root.position.set(1.35,0,-.38);w.collector.root.rotation.y=-.76;g.add(w.collector.root);
 const lamp=box(g,2.5,1.7,-1.8,.6,.12,.5,0,glow(0xffc773,1.7));lineBox(g,[2.5,.9,-1.8],[2.5,1.7,-1.8],.045,0x777e6d);const lp=new T.PointLight(0xffbc6d,14,6);lp.position.set(2.5,1.6,-1.7);w.light.add(lp);
 w.dust=particles(g,75,0xe2c68e,.012,5);w.steam=particles(g,24,0xc9d1c7,.014,6);return w}
export function buildAlley(){const w=world(0x1a262d,true),g=w.root;lighting(w,{ambient:.9,key:2.5,color:0xfad6a1,pos:[-6,10,1]});box(g,0,-.16,0,16,.3,24,0x494c47);
 const r=rng(4);for(let i=0;i<160;i++){let x=(i%10-4.5)*.68,z=(Math.floor(i/10)-8)*.72;box(g,x,.005,z,.65,.06,.69,[0x64665c,0x575c56,0x72766b][i%3])}
 for(let x of [-4.1,4.1]){box(g,x,1.8,-2,1,3.6,22,0x777363);for(let j=0;j<16;j++)for(let k=0;k<7;k++){const b=box(g,x+(x<0?.52:-.52),k*.43+.15,j*1.1-10,.03,.035,1.06,0x535c55)}box(g,x,3.65,-2,1.35,.15,22,0x253a40);for(let j=0;j<45;j++)box(g,x,3.83,-12+j*.48,1.6,.21,.45,0x35464a)}
 box(g,0,1.75,-7.7,7.4,3.5,.45,0x555d53);box(g,0,1.45,-7.43,2.6,2.9,.12,0x433b2d);for(let i=0;i<9;i++)box(g,(i-4)*.28,1.5,-7.32,.025,2.6,.02,0x7b6747);box(g,0,3.2,-7.13,3.2,.2,.8,0x283e42);const plate=label('观 石',1.1,.35,'#c3ae7d','#273736');plate.position.set(0,2.8,-7.23);g.add(plate);
 for(const x of [-1.9,1.9]){box(g,x,2.5,-7.12,.36,.56,.35,0,glow(0xd3a259,1));const p=new T.PointLight(0xffc47b,5,4);p.position.set(x,2.4,-6.9);w.light.add(p)}
 w.hero=figure();w.hero.root.position.set(.3,0,-1);w.hero.root.rotation.y=Math.PI;g.add(w.hero.root);return w}
export function buildWorkshop(){const w=world(0x071619,true),g=w.root;lighting(w,{ambient:.5,key:2.4,color:0xb5e0dc,pos:[-2,7,4]});box(g,0,-.1,0,12,.2,11,0x233a40);box(g,0,2.2,-4,12,4.5,.3,0x253e44);for(let i=0;i<8;i++)box(g,(i-3.5)*1.4,2.2,-3.8,.04,4.4,.05,0x3e5558);
 for(let x of [-3,0,3]){box(g,x,3.5,-1.2,1.8,.07,.4,0,glow(0xb8e4dd,1.8));const p=new T.PointLight(0xbce9e2,14,7);p.position.set(x,3.3,-1.2);w.light.add(p)}
 box(g,0,.6,0,3.6,1.2,1.8,0x627c7d);box(g,0,1.3,-.55,3.7,.18,.5,0x8b9b94);box(g,0,1.1,.3,3.1,.12,.95,0x263f44);box(g,-1.25,1.7,.05,.5,.9,1.1,0x80948d);box(g,1.2,1.6,.05,.4,.7,.8,0x78958e);
 w.stock=rock(.65,7);w.stock.position.set(-.35,1.35,.1);g.add(w.stock);
 w.tool=new T.Group();g.add(w.tool);box(w.tool,0,2.1,.1,.2,.65,.24,0x536d76);box(w.tool,0,1.73,.1,.08,.15,.08,0xbed1c9);lineBox(g,[-1.5,2.5,-.1],[1.5,2.5,-.1],.22,0x839a9b);
 box(g,2.4,1.6,-.6,.8,.6,.12,0x1a303b);w.readout=label('CNC / Fe–Ni\n36 : COMPLETE',.7,.36,'#86c5bf','#102b35');w.readout.position.set(2.4,1.6,-.52);g.add(w.readout);
 w.hero=figure();w.hero.root.position.set(-2.2,0,1.2);w.hero.root.rotation.y=2.1;g.add(w.hero.root);
 w.sparks=particles(g,48,0xf2bc73,.023,10);w.tray=new T.Group();w.tray.position.set(0,1.05,1.7);g.add(w.tray);box(w.tray,0,0,0,1.5,.035,.9,0x16272e);w.pellets=[];for(let i=0;i<36;i++){const b=box(w.tray,(i%9-4)*.145,.07,(Math.floor(i/9)-1.5)*.18,.06,.12,.06,0xb1b1a0,mat(0xabb4aa,.3,.75));w.pellets.push(b)}return w}
export function buildBasement(){const w=world(0x0d1518,true),g=w.root;lighting(w,{ambient:.22,key:1.7,color:0xb6d7ca,pos:[-3,5,3]});box(g,0,-.14,0,10,.25,14,0x353a35);box(g,0,2,-4,10,4,.5,0x626359);box(g,-4.6,2,0,.4,4,8,0x434c45);box(g,4.6,2,0,.4,4,8,0x343e39);for(let i=0;i<7;i++)box(g,0,i*.58,-3.73,9,.024,.02,0x414c47);
 practical(w,0,3.1,0,0xd9d4a2,18);lineBox(g,[0,3.2,0],[0,4.2,0],.03,0x7d8171);
 box(g,0,.76,.2,2.1,.12,1.15,0x423d31);for(let x of [-.85,.85])box(g,x,.35,.2,.15,.7,.8,0x333a33);
 w.hero=figure();w.hero.root.position.set(-2,0,1.2);w.hero.root.rotation.y=2.6;g.add(w.hero.root);w.gun=weapon();w.hero.anchors.handR.add(w.gun);
 w.target=box(g,0,1.25,-3.3,.9,1.05,.55,0xa49b7f);box(g,0,.43,-3.3,1.3,.25,1,0x3a4039);w.holes=[];for(let i=0;i<4;i++){const h=box(g,(i%2-.5)*.14,1.2+Math.floor(i/2)*.17,-3.012,.035,.035,.008,0x17262a);h.userData.dynamic=true;w.holes.push(h)}
 w.flash=new T.PointLight(0xffd18e,0,5);g.add(w.flash);w.smoke=particles(g,38,0x777d70,.06,12);
 w.cloth=box(g,0,.87,.15,1.45,.025,.8,0x999b7e);w.cloth.userData.dynamic=true;w.fragments=[];for(let i=0;i<22;i++){const r=rock(.025+(i%3)*.008,i);r.position.set(Math.sin(i*23)*.3,.92,Math.cos(i*13)*.22);g.add(r);w.fragments.push(r)}return w}
export function buildLocker(){const w=world(0x0a1921,true),g=w.root;lighting(w,{ambient:.7,key:1.8,color:0xa5ccd4,pos:[-2,6,3]});box(g,0,-.1,0,10,.2,11,0x263d46);box(g,0,2,-3.1,10,4,.3,0x3b5259);for(let x=-4;x<=4;x+=1.2){box(g,x,1.7,-2.85,1.1,3.2,.25,0x233945);box(g,x+.4,1.5,-2.68,.06,.5,.05,0x92a5a5)}box(g,0,3.4,-2.62,1.7,.08,.06,0,glow(0x8bc2ca,1.5));const p=label('一号基地 / 舱室 07',2,.4);p.position.set(0,3,-2.64);g.add(p);
 box(g,0,.8,0,2,.12,1.2,0x7a8e8b);box(g,0,.4,0,.2,.8,.8,0x304750);w.locator=box(g,0,.92,.1,.24,.08,.32,0x283c47);box(g,-.06,.968,.18,.025,.01,.025,0,glow(0x94d2a4,2));const t=label('SIGNAL / ONLINE',.78,.15,'#91bda8');t.position.set(0,1.08,-.05);t.rotation.x=-Math.PI/2;g.add(t);
 w.hero=figure('suit',9);w.hero.root.position.set(1.7,0,.2);w.hero.root.rotation.y=-.8;g.add(w.hero.root);return w}
export function buildSpace(){const w=world(0x02060d),g=w.root;lighting(w,{ambient:.72,key:3.2,color:0xffd8a3,pos:[-22,13,-10],shadow:false});const fill=new T.DirectionalLight(0x94bfd8,1.3);fill.position.set(15,22,50);w.light.add(fill);starField(g);
 w.earth=earth();w.earth.position.set(-44,-38,-87);w.earth.rotation.set(.05,.4,-.12);g.add(w.earth);
 const sunMat=new T.MeshBasicMaterial({color:0xffda9b});w.sun=box(g,-70,-4,-98,6,6,6,0,sunMat);const c=document.createElement('canvas');c.width=256;c.height=256;const ctx=c.getContext('2d');const grad=ctx.createRadialGradient(128,128,0,128,128,128);grad.addColorStop(0,'rgba(255,231,183,.85)');grad.addColorStop(.1,'rgba(255,199,132,.5)');grad.addColorStop(.35,'rgba(245,158,87,.12)');grad.addColorStop(1,'rgba(225,126,54,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,256,256);w.halo=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),color:0xffc98f,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));w.halo.position.copy(w.sun.position);w.halo.scale.set(28,28,1);g.add(w.halo);
 w.station=station();w.station.position.set(9,7,-24);w.station.rotation.set(.12,-.3,.28);g.add(w.station);
 w.hero=figure('suit',10);g.add(w.hero.root);w.hero.root.position.set(-2,0,2);w.hero.root.rotation.set(0,.4,-.15);
 w.gun=weapon(true);w.hero.anchors.handR.add(w.gun);w.gun.visible=false;
 const flashGeo=new T.BoxGeometry(1,1,1);w.flash=new T.Mesh(flashGeo,new T.MeshBasicMaterial({color:0xffd9a1}));w.flash.position.set(0,1.8,5.1);w.flash.scale.set(.9,.9,2);w.gun.add(w.flash);w.flash.visible=false;
 w.shipyard=new T.Group();g.add(w.shipyard);w.shipyard.position.set(-22,8,-12);w.shipyard.rotation.set(.2,.15,-.12);for(let i=0;i<8;i++){const z=i*3;for(const x of [-4,4])for(const y of [-3,3]){if(i<7)lineBox(w.shipyard,[x,y,z],[x,y,z+3],.17,0x59747a);if(i%2===0)lineBox(w.shipyard,[x,y,z],[x,-y,z+3],.09,0x5e7372)}for(const y of [-3,3])lineBox(w.shipyard,[-4,y,z],[4,y,z],.17,0x6e8586);for(const x of [-4,4])lineBox(w.shipyard,[x,-3,z],[x,3,z],.17,0x748886)}
 w.debris=[];const rand=rng(31);for(let i=0;i<38;i++){const b=box(g,(rand()-.5)*80,(rand()-.5)*45,-rand()*40-10,.15+rand()*.3,.1+rand()*.3,.15+rand()*.4,0x344f59);w.debris.push(b)}
 w.exhaust=particles(g,65,0x9fc4cb,.09,18);return w}
export function buildPhoto(){const w=world(0x03070e),g=w.root;lighting(w,{ambient:.65,key:3,color:0xffd4a0,pos:[-14,5,8],shadow:false});starField(g);
 w.earth=earth();w.earth.position.set(-65,-56,-110);w.earth.scale.setScalar(1.7);w.earth.rotation.set(.2,-.4,-.2);g.add(w.earth);
 // Station's block-cut curved rim, exterior ribs and an eight-stepped airlock.
 const wall=new T.Group();g.add(wall);for(let i=-12;i<=12;i++){const x=i*1.25;box(wall,x,-.2-Math.abs(i)*.12,-5.6,1.22,7.8,.9,(i%4===0)?0x687b7e:0x435e6b);if(i%2===0)box(wall,x,-.1-Math.abs(i)*.12,-4.95,.075,7,.25,0x8b9b96)}
 w.door=new T.Group();w.door.position.set(0,0,-4.95);g.add(w.door);box(w.door,0,0,0,2.6,3.3,.18,0x243f4a);for(let i=0;i<4;i++){const x=i<2?-1.5:1.5;box(wall,x,(i%2-.5)*2.5,-4.8,.3,.55,.3,0xb3b7a5)}
 w.hatchLight=box(g,-2,1.8,-4.7,.1,.3,.08,0,glow(0x77b8a0,2));const lbl=label('黄河站 / HUANG HE',4,.55,'#bdc9ba');lbl.position.set(5,2.4,-5);g.add(lbl);
 w.people=[];for(let i=0;i<18;i++){const f=figure('suit',i);const visor=createSkin(p=>{p.ctx.drawImage(f.userData.clothes.canvas,0,0);p.rect('head','front',1,2,6,4,'#314956');p.rect('head','front',1,2,6,1,'#b6c4ba');p.rect('head','front',1,3,1,3,'#738e94');p.px('head','front',5,3,'#899f9e')},{transparent:true});f.userData.opaqueTexture=visor.texture;g.add(f.root);w.people.push(f)}
 w.plumes=[];for(let i=0;i<5;i++){const p=particles(g,42,0xcbdedc,.07,100+i);w.plumes.push(p)}
 w.cracks=createCrackSkin();return w}
function createCrackSkin(){// Alternate helmet sheet: all damage remains painted into the canonical shell.
 const f=figure('suit',2);const skin=createSkin(p=>{p.ctx.drawImage(f.userData.clothes.canvas,0,0);p.fill('head','all','#c1ceca');p.rect('head','front',0,1,8,6,'#64828b');for(let i=0;i<8;i++){p.px('head','front',i,i%7,'#dfe4dc');p.px('head','front',7-i,Math.floor(i*.7),'#dfe4dc')}p.rect('head','front',3,4,3,2,'#694b48');p.px('head','front',2,5,'#79534c')},{transparent:true});f.dispose();return skin.texture}
export function buildDecision(){const w=world(0x0b161c),g=w.root;lighting(w,{ambient:.5,key:1.6,color:0x85b9c0,pos:[-2,4,5]});box(g,0,-.1,0,12,.2,9,0x1d303a);box(g,0,2,-2,11,4.5,.25,0x223e48);box(g,0,2,-1.8,8,3.3,.05,0x102630);const title=label('推进路线 / 技术委员会',6,.55,'#bdd5d4');title.position.set(0,3.1,-1.73);g.add(title);for(let i=0;i<3;i++){const f=figure('officer',i);f.root.position.set((i-1)*2.3,.2,-1.15);g.add(f.root);applyPose(f,idle(0));const text=label(['总体设计','动力系统','航天工程'][i],1.8,.35,'#75979e');text.position.set((i-1)*2.3,2.55,-1.7);g.add(text)}const red=label('辐射推进：暂不立项',5,.65,'#d4a078','#392e29');red.position.set(0,.65,.5);g.add(red);return w}
export function buildWorlds(){return{collector:buildCollector(),alley:buildAlley(),workshop:buildWorkshop(),basement:buildBasement(),locker:buildLocker(),space:buildSpace(),photo:buildPhoto(),decision:buildDecision()}}
