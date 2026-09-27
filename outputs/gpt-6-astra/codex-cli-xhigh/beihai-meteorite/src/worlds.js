import {createSkin} from '@agentbench/voxel-kit';
import {T,box,beam,mat,point,areaKey,label,rock,prop,person,particles,dust,rnd,voxelSphere,voxelMaterial,buildVoxelGeometry,voxelTerrain,batchBoxes} from './art.js';
export function makeWorlds(scene){
 const worlds={};
 function world(name,bg,fog=null){const root=new T.Group();root.name=name;root.visible=false;scene.add(root);const w={root,bg,fog};worlds[name]=w;return w}
 function ambient(root,sky,ground,intensity){root.add(new T.HemisphereLight(sky,ground,intensity))}
 const warm=world('home',0x111917,new T.FogExp2(0x24251d,.027));const r=warm.root;
 ambient(r,0xb7c9bd,0x493520,.5);
 box(r,[10,.2,8],[0,-.13,0],0x514539);
 for(let i=0;i<25;i++)box(r,[.014,.009,8],[-5+i*.42,-.022,0],0x302e28,{shadow:false});
 box(r,[10,4,.18],[0,1.9,-3.7],0x4f5144);box(r,[.2,4,8],[-4.6,1.9,0],0x434a41);box(r,[.2,4,8],[4.6,1.9,0],0x39473e);
 for(let x=-4.4;x<4.5;x+=2.2){box(r,[.16,4,.18],[x,1.9,-3.54],0x282f28);box(r,[.15,.17,7.8],[x,3.65,0],0x272d26)}
 for(let j=0;j<3;j++)box(r,[9,.14,.15],[0,j*1.6+.25,-3.52],0x29372f);
 const glass=new T.MeshPhysicalMaterial({color:0x8dac9c,transparent:true,opacity:.065,roughness:.15,metalness:.15,depthWrite:false});
 for(let i=0;i<5;i++){const x=(i-2)*1.63;
 box(r,[1.42,2.85,.065],[x,1.44,-3.36],0x25372f);box(r,[1.3,2.58,.035],[x,1.56,-3.31],0x1e2623);for(const side of [-1,1])box(r,[.065,2.85,.68],[x+side*.7,1.44,-3.04],0x324237);point(r,0xffca82,.8,[x,1.8,-2.55]);
 for(let j=0;j<3;j++){const y=.54+j*.86;box(r,[1.34,.045,.62],[x,y,-2.98],0x9d8963);box(r,[1.25,.025,.15],[x,y+.69,-2.88],new T.MeshBasicMaterial({color:0xffcb77}));for(let k=0;k<2;k++){rock(r,[x-.33+k*.65,y+.19,-2.87],.105+rnd(i*22+j*3+k)*.06,i+j+k);box(r,[.21,.015,.1],[x-.33+k*.65,y+.022,-2.65],0xd4c19b)}}
 box(r,[1.32,2.55,.025],[x,1.52,-2.68],glass,{shadow:false});for(const a of [-.69,.69])box(r,[.035,2.7,.045],[x+a,1.5,-2.64],0xb19c6c);
 }
 box(r,[2.65,.12,1.2],[0,.85,.65],0x765f40);for(const x of [-1.1,1.1])for(const z of [.2,1.1])box(r,[.12,.88,.12],[x,.39,z],0x3e4131);
 box(r,[1.15,.035,.55],[.02,.93,.68],0x283e39);warm.stones=[-.38,0,.4].map((x,i)=>rock(r,[x,1.03,.71],.1+i*.012,i*2));
 // Tea bowls are voxel props, rendered in world metres here.
 warm.cup=prop('cup');warm.cup.scale.setScalar(.06);warm.cup.position.set(.86,1.02,.91);r.add(warm.cup);
 const teapot=prop('cup');teapot.scale.set(.1,.085,.1);teapot.position.set(-.87,1.04,.88);r.add(teapot);
 warm.collector=person('collector');warm.collector.root.position.set(-1.55,0,-.25);warm.collector.root.rotation.y=.7;r.add(warm.collector.root);warm.heldStone=prop('stone');warm.heldStone.position.z=1.5;warm.collector.anchors.handL.add(warm.heldStone);warm.heldStone.visible=false;
 warm.zhang=person('zhang');warm.zhang.root.position.set(1.5,0,.03);warm.zhang.root.rotation.y=-.82;r.add(warm.zhang.root);
 warm.heldCup=prop('cup');warm.zhang.anchors.handL.add(warm.heldCup);warm.heldCup.visible=false;
 box(r,[.52,.08,.43],[-1.55,.47,-.3],0x5a4932);for(const x of [-1.73,-1.37])box(r,[.05,.49,.05],[x,.23,-.3],0x3d3928);
 // Amber desk lamp, with a rectangular shade.
 beam(r,[-2.7,.85,-.25],[-2.7,1.6,-.25],.045,0x8a7751);box(r,[.54,.12,.36],[-2.7,1.66,-.25],0x2d4539);box(r,[.44,.022,.28],[-2.7,1.595,-.25],new T.MeshBasicMaterial({color:0xffd88c}));point(r,0xffbf6a,2.8,[-2.7,1.55,-.2]);
 box(r,[1.3,.08,.6],[-2.75,.85,-.3],0x6d593c);box(r,[.06,.86,.06],[-3.2,.4,-.3],0x4b4936);
 areaKey(r,0xffd399,28,[-1.5,3.3,2.0],[0,1,0],.85);areaKey(r,0x7cadbd,16,[4,2.8,.8],[0,1,0],.65);
 // Window lattice and slanted slices of light.
 box(r,[.05,2.4,2.5],[4.46,2,.5],0x788d83);for(let j=0;j<7;j++)box(r,[.1,2.45,.045],[4.4,2,-.72+j*.4],0x25372e);for(let j=0;j<5;j++)box(r,[.1,.045,2.5],[4.4,.85+j*.58,.5],0x25372e);
 for(let j=0;j<5;j++){const a=box(r,[.32,.015,4],[2.4-j*.5,.005,.5],new T.MeshBasicMaterial({color:0xbec4a2,transparent:true,opacity:.1,depthWrite:false}),{shadow:false});a.rotation.y=-.45;}
 warm.dust=dust(r,95);

 const court=world('court',0x111f27,new T.FogExp2(0x172b30,.045));const c=court.root;ambient(c,0xa4b7c9,0x242c2b,.55);
 const floor=new T.Mesh(voxelTerrain(30,28,(x,z)=>1+(rnd(x+z*33)>.9?1:0),(x,y,z)=>rnd(x+z*3)>.5?0x394747:0x45504c,{voxel:.38}),voxelMaterial());floor.scale.y=.15;floor.position.set(0,-.045,2);floor.receiveShadow=true;c.add(floor);
 for(let s of [-1,1]){box(c,[3.7,3.2,.4],[s*2.5,1.45,-1.7],0x6b7264);box(c,[.24,3.4,.6],[s*.85,1.6,-1.5],0x4b3829);box(c,[.25,3.5,.6],[s*4.5,1.6,-1.5],0x364542)}
 box(c,[1.48,2.6,.12],[0,1.2,-2.6],new T.MeshBasicMaterial({color:0xa5804d}));box(c,[1.8,.26,1.6],[0,0,-1.5],0x4d5248);box(c,[2.1,.16,1.5],[0,-.12,-.7],0x414a48);
 for(let j=0;j<5;j++){box(c,[9.8-j*.25,.13,.5],[0,3.0+j*.14,-.8-j*.35],0x273e42);for(let i=0;i<25;i++)box(c,[.31,.06,.48],[-4.5+i*.375,3.1+j*.14,-.8-j*.35],i%2?0x364d4e:0x2b4246)}
 label(c,'观 石',[1][0],[0,2.85,-1.37],'#cdb889','#2e382e',70);
 for(let s of [-1,1]){box(c,[.25,.4,.25],[s*1.16,2.24,-1.27],new T.MeshBasicMaterial({color:0xffb455}));point(c,0xffbd6f,2,[s*1.16,2,-.9]);beam(c,[s*1.16,2.48,-1.27],[s*1.16,2.8,-1.27],.028,0x35362b)}
 court.zhang=person('zhang');c.add(court.zhang.root);court.zhang.root.rotation.y=Math.PI;
 court.elder=person('collector');court.elder.root.position.set(.18,0,-2.0);c.add(court.elder.root);
 beam(c,[-3.7,0,1],[-3.7,3.5,1],.24,0x30362d);beam(c,[-3.7,2.4,1],[-2.5,4,.3],.15,0x394031);beam(c,[-3.7,2.8,1],[-4.8,3.8,1.3],.15,0x394031);
 for(let i=0;i<7;i++){const g=new T.Mesh(voxelSphere(3,0x314a3b,{voxel:.27}),voxelMaterial());g.position.set(-4+rnd(i)*2.1,3.5+rnd(i+5),.5+rnd(i+8)*1.8);c.add(g)}
 areaKey(c,0x8cc1d0,24,[3,7,4],[0,0,1]);court.dust=dust(c,35);

 const shop=world('shop',0x0c1b22,new T.FogExp2(0x12242d,.026));const s=shop.root;ambient(s,0x9bc3cd,0x20323a,.4);
 box(s,[12,.2,10],[0,-.1,0],0x29393d);box(s,[12,4,.3],[0,1.9,-3.4],0x334b50);box(s,[.3,4,10],[-5,1.9,0],0x2b3c44);
 for(let i=0;i<12;i++){box(s,[.025,.006,10],[-5+i,0,0],0x111f29,{shadow:false});box(s,[12,.005,.025],[0,0,-4+i],0x111f29,{shadow:false})}
 for(let x=-4;x<=4;x+=2){box(s,[.12,4,.12],[x,2,-3.15],0x57696a);box(s,[1.3,.055,.25],[x,3.65,-.1],new T.MeshBasicMaterial({color:0x96e1ec}));point(s,0x85d5e2,3,[x,3.5,-.1])}
 for(let i=0;i<3;i++)beam(s,[-5,2.2+i*.23,-3],[5,2.2+i*.23,-3],.08,0x63746e);
 box(s,[2.9,.8,1.65],[0,.4,-.1],0x233a40);box(s,[3,.16,1.7],[0,.84,-.1],0x748888);box(s,[2.3,.18,1.2],[0,1.01,-.2],0x344c53);
 box(s,[.4,2.2,.38],[-1.22,1.8,-.55],0x7d8e8d);box(s,[.4,2.2,.38],[1.22,1.8,-.55],0x7d8e8d);box(s,[2.8,.32,.48],[0,2.74,-.55],0x7e9290);
 shop.head=new T.Group();s.add(shop.head);box(shop.head,[.55,.68,.58],[0,2.35,-.18],0x405f65);box(shop.head,[.16,.52,.16],[0,1.8,-.18],0xbac6bb);
 shop.workRock=rock(s,[0,1.26,-.18],.21,3);shop.workRock.rotation.set(0,0,0);
 shop.sparks=particles(s,45,0xffc26b,.02);shop.sparkLight=point(s,0xffb34d,0,[0,1.45,-.1]);
 box(s,[.68,.9,.16],[1.97,1.55,.1],0x1b2c32);label(s,'CNC  /  07\nCUTTING',[.55][0],[1.97,1.62,.19],'#a1d7cf','#16313b',54);
 shop.zhang=person('zhang');shop.zhang.root.position.set(1.8,0,1);shop.zhang.root.rotation.y=-2.6;s.add(shop.zhang.root);
 box(s,[1.6,.1,.8],[-2.9,.85,-.4],0x617876);for(let i=0;i<12;i++)box(s,[.06,.1,.06],[-3.45+(i%6)*.18,.95,-.6+Math.floor(i/6)*.2],0x9eafa3);
 areaKey(s,0x94d7eb,36,[0,3.8,1.5],[0,1,0],.7);areaKey(s,0xffb15c,11,[-3,2,1],[0,1,0],.5);
 shop.dust=dust(s,30);

 const cellar=world('cellar',0x141918,new T.FogExp2(0x19211f,.06));const b=cellar.root;ambient(b,0x718780,0x231f1a,.4);
 box(b,[8,.2,9],[0,-.1,0],0x373c35);box(b,[8,3.5,.3],[0,1.7,-3],0x56594e);box(b,[.3,3.5,9],[-3.3,1.7,0],0x41483f);
 for(let j=0;j<9;j++)for(let i=0;i<11;i++)box(b,[.65,.31,.025],[-3.8+i*.74+(j%2)*.35,.2+j*.37,-2.82],0x474d44,{shadow:false});
 box(b,[2,.14,.8],[.7,.84,.6],0x524d3d);for(const x of [0,1.4])box(b,[.09,.85,.09],[x,.4,.6],0x292d25);
 cellar.gun=prop('gun');cellar.gun.scale.setScalar(.065);cellar.gun.position.set(.5,.99,.63);cellar.gun.rotation.y=1.2;b.add(cellar.gun);
 cellar.fragments=[];for(let i=0;i<9;i++)cellar.fragments.push(rock(b,[.88+rnd(i)*.35,.98,.48+rnd(i+55)*.27],.025+rnd(i+4)*.02,i));
 box(b,[1,.6,.32],[-.75,1.15,-2.5],0xb0b3a1);box(b,[.95,.54,.025],[-.75,1.15,-2.32],0xc6c5ad);for(let i=0;i<5;i++)box(b,[.022,.4,.025],[-1.17+i*.2,1.17,-2.30],0x67776f);
 cellar.holes=[];for(let i=0;i<3;i++)cellar.holes.push(box(b,[.05,.055,.011],[-.91+i*.15,1.27-(i%2)*.16,-2.29],0x1d2828,{shadow:false}));
 cellar.zhang=person('zhang');cellar.zhang.root.position.set(-.8,0,1.3);cellar.zhang.root.rotation.y=Math.PI;b.add(cellar.zhang.root);
 cellar.heldGun=prop('gun');cellar.heldGun.position.set(0,.7,1.7);cellar.zhang.anchors.handR.add(cellar.heldGun);
 cellar.flash=point(b,0xffcc8c,0,[-.8,1.2,.5]);
 const lamp=box(b,[.65,.09,.35],[.5,2.7,.6],0x838775);box(b,[.53,.02,.28],[.5,2.64,.6],new T.MeshBasicMaterial({color:0xffda9d}));beam(b,[.5,2.75,.6],[.5,3.5,.6],.025,0x343a32);
 areaKey(b,0xffd3a0,19,[.5,2.6,.6],[.5,.8,.5],.8);areaKey(b,0x86a2a3,13,[-1,2.8,0],[-.7,1,-2.4],.65);areaKey(b,0xc5ceba,12,[1.4,2.3,1.8],[-.7,1.2,1.1],.65);label(b,'EVA  /  试样',.8,[-.75,.7,-2.79],'#a8b5ac','#39433b',58);cellar.smoke=particles(b,35,0x9eada1,.024);

 const meeting=world('meeting',0x111e27,new T.FogExp2(0x162730,.026));const m=meeting.root;ambient(m,0xa0c9d9,0x202a30,.75);
 box(m,[10,.2,9],[0,-.12,0],0x263d45);box(m,[10,3.8,.3],[0,1.8,-2.8],0x1a303c);
 box(m,[7.5,.1,1.25],[0,.85,-.15],0x395966);box(m,[7,.04,1.05],[0,.925,-.15],0x748887);
 label(m,'三体危机 / 舰队推进路线 · 论证会\n现有路线：继续投入   /   星际方案：暂缓',5.9,[0,2.43,-2.59],'#a9d8dd','#203f4c',38);
 meeting.elders=[];for(let i=0;i<3;i++){const f=person('elder',false,i);f.root.position.set((i-1)*2.1,0,-1.0);m.add(f.root);meeting.elders.push(f);box(m,[.6,.8,.12],[(i-1)*2.1,.75,-1.3],0x142733);label(m,['推进工程','航天系统','总体设计'][i],.8,[(i-1)*2.1,.99,.44],'#bcc7b7','#20343d',60)}
 meeting.zhang=person('zhang');meeting.zhang.root.position.set(3.1,0,1.4);meeting.zhang.root.rotation.y=-2.65;m.add(meeting.zhang.root);
 for(let i=0;i<5;i++)box(m,[.9,.035,.18],[(i-2)*1.8,3.3,-.8],new T.MeshBasicMaterial({color:0xa0d0da}));areaKey(m,0x8fc6de,45,[-1,3.4,1],[0,1,-.7],.95);point(m,0xebbb77,2,[3.5,2.3,1.5]);

 const orbit=world('orbit',0x03080e);const o=orbit.root;ambient(o,0x749eb4,0x090f18,.9);
 const sunLight=new T.DirectionalLight(0xffca8e,3.5);sunLight.position.set(30,12,-5);o.add(sunLight);orbit.sunLight=sunLight;
 const fill=new T.DirectionalLight(0x7ab8d7,1.5);fill.position.set(-8,0,15);o.add(fill);
 // Procedural continental masses and latitude-driven clouds, all on a voxel sphere.
 const radius=32,span=radius*2;
 const earthGeo=voxelSphere(radius,(x,y,z)=>{const nx=(x-radius)/radius,ny=(y-radius)/radius,nz=(z-radius)/radius;const lon=Math.atan2(nz,nx),lat=Math.asin(Math.max(-1,Math.min(1,ny)));const n=Math.sin(lon*3+Math.sin(lat*5))*Math.cos(lat*4-.6)+Math.sin(lon*7+lat*6)*.33+Math.cos(lon*11-lat*4)*.16;const cloud=Math.sin(lon*8+lat*20+Math.sin(lon*4)*2)+Math.sin(lat*33-lon*5)*.45;if(Math.abs(ny)>.92)return 0xd2ded7;if(cloud>1.05&&Math.abs(ny)<.85)return 0x9cbbc0;if(n>.39)return n>.7?0x78806b:0x426c60;return n>.2?0x226079:0x153b57},{voxel:1.9});
 orbit.earth=new T.Mesh(earthGeo,voxelMaterial({roughness:.95}));orbit.earth.position.set(-40,-34,-135);orbit.earth.rotation.z=.18;o.add(orbit.earth);
 const haloGeo=voxelSphere(32,0xffffff,{voxel:1.96});const haloMat=new T.MeshBasicMaterial({color:0x58a9cf,transparent:true,opacity:.075,side:T.BackSide,depthWrite:false,blending:T.AdditiveBlending});orbit.halo=new T.Mesh(haloGeo,haloMat);orbit.halo.position.copy(orbit.earth.position);o.add(orbit.halo);
 const stars=new T.BufferGeometry(),starP=[],starC=[];for(let i=0;i<1900;i++){const v=new T.Vector3(rnd(i*3)-.5,rnd(i*3+1)-.5,rnd(i*3+2)-.5).normalize().multiplyScalar(330+rnd(i)*120);starP.push(...v.toArray());const k=.25+rnd(i+7)*.55;starC.push(k*.85,k*.93,k)}stars.setAttribute('position',new T.Float32BufferAttribute(starP,3));stars.setAttribute('color',new T.Float32BufferAttribute(starC,3));o.add(new T.Points(stars,new T.PointsMaterial({size:.4,vertexColors:true,sizeAttenuation:true})));
 const sun=new T.Mesh(voxelSphere(5,0xffdc98,{voxel:1.1}),new T.MeshBasicMaterial({color:0xffd99c}));sun.position.set(20,12,-170);o.add(sun);orbit.sun=sun;
 // Square optical glow; texture painted locally, no image files.
 const cv=document.createElement('canvas');cv.width=cv.height=128;const cx=cv.getContext('2d'),gr=cx.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'#fff4ba');gr.addColorStop(.12,'#ffc773bb');gr.addColorStop(.35,'#d476252b');gr.addColorStop(1,'#d4762500');cx.fillStyle=gr;cx.fillRect(0,0,128,128);const glow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),color:0xffc07e,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));glow.position.copy(sun.position);glow.scale.set(48,48,1);o.add(glow);orbit.glow=glow;
 orbit.station=new T.Group();orbit.station.position.set(4,3,-40);o.add(orbit.station);const st=orbit.station;
 // An angular wheel: habitable rectangular modules, open central hub and trusses.
 const n=32,rad=13;
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=Math.cos(a)*rad,y=Math.sin(a)*rad;const mod=box(st,[2.6,1.25,2.8],[x,y,0],i%4===0?0x768d92:0x506a75);mod.rotation.z=a+Math.PI/2;const strip=box(st,[1.75,.055,.05],[x,y,1.44],new T.MeshBasicMaterial({color:i%4?0x9fc3c2:0xeac493}));strip.rotation.z=a+Math.PI/2;for(let k=0;k<2;k++){const stripe=box(st,[.22,1.34,2.88],[x+(k-.5)*.5,y,0],0x263f4c);stripe.rotation.z=a+Math.PI/2}}
 for(let i=0;i<8;i++){const a=i*Math.PI/4;beam(st,[Math.cos(a)*2,Math.sin(a)*2,0],[Math.cos(a)*12.4,Math.sin(a)*12.4,0],.45,0x82949a);beam(st,[Math.cos(a)*2,Math.sin(a)*2,-1],[Math.cos(a)*12.4,Math.sin(a)*12.4,0],.18,0x3d5968)}
 box(st,[3.4,3.4,4],[0,0,0],0x74939c);box(st,[2.5,2.5,4.15],[0,0,0],0x304957);label(st,'黄 河\nHUANG HE',3,[0,0,2.1],'#d6d4b6','#263e4d',60);
 for(let side of [-1,1]){beam(st,[side*2,0,-1],[side*24,0,-1],.25,0x8399a1);for(let i=0;i<4;i++){box(st,[3.5,8,.12],[side*(17+i*1.7),0,-1.1],0x193d5c);for(let j=0;j<10;j++)box(st,[3.4,.027,.03],[side*(17+i*1.7),-3.8+j*.8,-1],0x659197,{shadow:false})}}
 beam(st,[0,-2,0],[0,-115,0],.12,0x87969b);
 orbit.dock=new T.Group();orbit.dock.position.set(-40,16,-75);orbit.dock.rotation.set(.2,.4,-.16);o.add(orbit.dock);for(let z=0;z<8;z++){for(let x of [-7,7]){beam(orbit.dock,[x,-5,z*6],[x,5,z*6],.32,0x68818b);beam(orbit.dock,[x,-5,z*6],[x,-5,z*6+6],.32,0x68818b);beam(orbit.dock,[x,5,z*6],[x,5,z*6+6],.32,0x68818b);beam(orbit.dock,[x,-5,z*6],[x,5,z*6+6],.16,0x485d68)}beam(orbit.dock,[-7,5,z*6],[7,5,z*6],.32,0x68818b)}
 orbit.zhang=person('zhang',true,5);o.add(orbit.zhang.root);orbit.zhang.root.position.set(1,0,2);
 orbit.gun=prop('gun');orbit.gun.position.set(0,.7,1.7);orbit.zhang.anchors.handR.add(orbit.gun);orbit.gun.visible=false;point(o,0x74acc8,2.5,[0,2,-.5]);
 orbit.muzzle=new T.Mesh(voxelSphere(2,0xffeac0,{voxel:.35}),new T.MeshBasicMaterial({color:0xffe9be}));orbit.muzzle.position.z=3.1;orbit.gun.add(orbit.muzzle);orbit.muzzle.visible=false;
 orbit.thrust=particles(o,55,0xb9dbeb,.065);orbit.debris=[];for(let i=0;i<9;i++){const a=box(o,[.4+rnd(i),.2,.8],[rnd(i)*24-12,rnd(i+4)*15-5,-15-rnd(i+7)*15],0x435965);a.rotation.set(i,i/2,i/3);orbit.debris.push(a)}
 orbit.heroRock=rock(o,[3.8,1.5,3],.48,4);orbit.heroRock.visible=false;
 // Close, separate orbit stage for the photograph, using the same kit figures.
 const photo=world('photo',0x040b12);const p=photo.root;ambient(p,0xaacddd,0x172b3a,1.3);const pk=new T.DirectionalLight(0xffbd83,3);pk.position.set(10,5,12);pk.castShadow=true;pk.shadow.mapSize.set(1024,1024);Object.assign(pk.shadow.camera,{left:-15,right:15,top:12,bottom:-8,near:.5,far:50});pk.shadow.bias=-.0002;pk.shadow.normalBias=.025;p.add(pk);photo.key=pk;const rim=new T.DirectionalLight(0x7ebae0,1.3);rim.position.set(-5,1,-1);p.add(rim);
 const farStars=new T.Points(stars,new T.PointsMaterial({size:.6,vertexColors:true}));p.add(farStars);
 // Crop of the station hull, with inset hatch and structural ribs.
 box(p,[25,17,1],[0,3,-7],0x455c68);for(let i=-6;i<7;i++){box(p,[1.75,7.8,.06],[i*2,2.2,-6.46],i%2?0x516979:0x617985);box(p,[.055,15,.1],[i*2,3,-6.4],0x273f4d)}
 label(p,'黄 河 空 间 站  /  HUANG HE',8,[1,6,-6.34],'#c4d3d4','#425c6b',43);
 box(p,[3.2,3.5,.5],[-7,1.1,-6.3],0x1a3241);box(p,[2.8,3.1,.05],[-7,1.1,-6.01],0x070f19);photo.door=box(p,[2.72,3.07,.1],[-7,1.1,-5.96],0x79949c);photo.hatchLight=box(p,[2.6,.08,.1],[-7,3,-5.91],new T.MeshBasicMaterial({color:0x7bcabc}));
 photo.people=[];for(let i=0;i<15;i++){const f=person(i<3?'elder':'crew',true,i<3?i:i+3);p.add(f.root);f.opaque=createSkin(paint=>{paint.ctx.drawImage(f.userData.clothes.canvas,0,0);paint.rect('head','front',1,2,6,5,'#1e3a47');paint.rect('head','front',1,2,5,1,'#638896');paint.px('head','front',1,3,'#8aa8a9')},{transparent:true});f.cracked=createSkin(paint=>{paint.ctx.drawImage(f.userData.clothes.canvas,0,0);paint.rect('head','front',1,2,6,5,'#a7b9bb');for(let k=0;k<5;k++){paint.px('head','front',1+k,2+k,'#345461');paint.px('head','front',6-k,2+k,'#345461')}paint.px('head','front',3,4,'#e6e8de')},{transparent:true});photo.people.push(f)}
 photo.clouds=particles(p,170,0xd7e6e4,.048);photo.specks=particles(p,45,0xa6c5d9,.018);photo.warmLight=point(p,0xff3725,0,[-7,2,-5]);
 const movable=new Set([...cellar.holes,photo.door,photo.hatchLight]);
 for(const w of Object.values(worlds))batchBoxes(w.root,movable);
 return worlds;
}
