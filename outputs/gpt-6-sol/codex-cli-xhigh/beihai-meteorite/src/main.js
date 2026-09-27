import * as THREE from 'three';
import { CinematicPlayer, ThreeStage, WebAudioCueBus, mountCinematicControls, validateVoiceCues, smoothstep } from '@agentbench/cinematic-player';
import { createSkin, createFigure, applyPose, idle, aim, float, lerpPose, voxelSphere, voxelMaterial, voxelModel, buildVoxelGeometry } from '@agentbench/voxel-kit';
import { voiceCues } from './voice.js';
import './style.css';

import footWood from './assets/audio/footstep_wood_002.ogg?inline';
import metalLight from './assets/audio/impactMetal_light_003.ogg?inline';
import metalHeavy from './assets/audio/impactMetal_heavy_002.ogg?inline';
import softHeavy from './assets/audio/impactSoft_heavy_001.ogg?inline';
import doorOpen from './assets/audio/doorOpen_001.ogg?inline';
import doorClose from './assets/audio/doorClose_001.ogg?inline';
import machineSound from './assets/audio/engineCircular_002.ogg?inline';
import blast from './assets/audio/explosionCrunch_002.ogg?inline';
import lowBlast from './assets/audio/lowFrequency_explosion_000.ogg?inline';
import thruster from './assets/audio/thrusterFire_002.ogg?inline';

const DURATION = 230;
validateVoiceCues(voiceCues, DURATION);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080d16);
scene.fog = new THREE.FogExp2(0x080d16, 0.011);
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const world = new THREE.Group();
scene.add(world);
scene.add(new THREE.AmbientLight(0x9cb1ce, 0.67));

const room = new THREE.Group(), workshop = new THREE.Group(), cellar = new THREE.Group(), space = new THREE.Group();
world.add(room, workshop, cellar, space);
const worlds = { room, workshop, cellar, space };
function showWorld(name) {
  for (const [key, group] of Object.entries(worlds)) group.visible = key === name;
  scene.fog = name === 'space' ? null : new THREE.FogExp2(name === 'room' ? 0x231a16 : 0x111922, name === 'room' ? 0.042 : 0.032);
  scene.background.setHex(name === 'room' ? 0x261d19 : name === 'space' ? 0x030712 : 0x101820);
  renderer.toneMappingExposure = name === 'space' ? 1.27 : name === 'room' ? 1.16 : 1.1;
}
const mat = (c, emissive=0, metalness=0, roughness=.82) => new THREE.MeshStandardMaterial({color:c,emissive,metalness,roughness});
const M = { wood:mat(0x4b3325,0,0,.94), darkWood:mat(0x261c19), brass:mat(0xa78350,0,.7,.35), iron:mat(0x343b43,0,.75,.35), pale:mat(0xb1b6b5), black:mat(0x111820), floor:mat(0x343a40), amber:mat(0xf8c582,0xf0a535,.1,.3), cyan:mat(0x8fd8e7,0x2c91b1), white:mat(0xedf5fb,0x678fac), red:mat(0xc24739,0x6d100c), cloud:mat(0xeaf8ff,0xa7d2ea) };
function box(parent, x,y,z,w,h,d,material, shadow=true) { const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material); o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;parent.add(o);return o; }
function light(parent,x,y,z,color,intensity,range=18,shadow=false) { const l=new THREE.PointLight(color,intensity,range);l.position.set(x,y,z);l.castShadow=shadow; if(shadow){l.shadow.mapSize.set(1024,1024);l.shadow.bias=-.0003;} parent.add(l);return l; }
function look(pos,target,fov=45){camera.position.set(...pos); camera.lookAt(...target);camera.fov=fov;camera.updateProjectionMatrix();}
function cameraPath(a,b,ta,tb,p,fovA=45,fovB=fovA){const t=smoothstep(Math.max(0,Math.min(1,p)));const lerp=(u,v)=>u+(v-u)*t;look(a.map((v,i)=>lerp(v,b[i])),ta.map((v,i)=>lerp(v,tb[i])),lerp(fovA,fovB));}
function hash(x,y=0,z=0){const q=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return q-Math.floor(q);}
function rock(parent,scale=1,seed=1) { const r=4, n=r*2; const geo=buildVoxelGeometry({size:[n,n,n],at(x,y,z){ const dx=x+.5-r,dy=y+.5-r,dz=z+.5-r;const wobble=(hash(x+seed,y,z)-.5)*1.45;const dist=Math.sqrt(dx*dx*.88+dy*dy*1.08+dz*dz); if(dist>r-.2+wobble)return null;const h=hash(x*2+seed,y*3,z*2);return h>.77?0x8a8178:h>.46?0x5b5b58:h>.18?0x3e4349:0x252d34;}},{voxel:.125*scale});const o=new THREE.Mesh(geo,voxelMaterial({metalness:.27,roughness:.69}));o.castShadow=true;parent.add(o);return o; }
function skinBody(tone,hair,eyes='#25313a') {return createSkin(p=>{for(const n of ['head','torso','armR','armL','legR','legL'])p.fill(n,'all',tone);p.fill('head','top',hair);p.rect('head','front',0,0,8,2,hair);p.rect('head','left',0,0,8,2,hair);p.rect('head','right',0,0,8,2,hair);p.rect('head','front',1,3,2,1,eyes);p.rect('head','front',5,3,2,1,eyes);p.rect('head','front',3,5,2,1,'#774e49');p.rect('head','front',1,2,2,1,hair);p.rect('head','front',5,2,2,1,hair);}).texture;}
function uniform(color,accent,kind='coat') {return createSkin(p=>{const pants=kind==='coat'?'#303c44':color; p.fill('torso','all',color);p.fill('armR','all',color);p.fill('armL','all',color);p.fill('legR','all',pants);p.fill('legL','all',pants);p.rect('torso','front',3,0,2,12,accent);p.rect('torso','front',1,3,2,1,accent);p.rect('torso','front',5,3,2,1,accent);p.rect('armR','front',0,9,4,2,accent);p.rect('armL','front',0,9,4,2,accent);p.rect('legR','front',0,10,4,2,'#1c252c');p.rect('legL','front',0,10,4,2,'#1c252c');}, {transparent:true}).texture;}
function suit(color='#d8e1e5',stripe='#b98d52',visor='#738d9a'){return createSkin(p=>{for(const part of ['torso','armR','armL','legR','legL'])p.fill(part,'all',color);p.fill('head','all',color);p.rect('head','front',1,2,6,4,visor);p.erase('head','front',2,3,4,2);p.rect('head','front',0,1,8,1,'#9daab1');p.rect('head','front',0,6,8,1,'#73838c');p.rect('torso','front',0,0,8,2,stripe);p.rect('torso','front',1,4,2,3,'#4f6976');p.rect('torso','front',5,4,2,3,'#e5a864');p.rect('armR','front',0,9,4,2,'#71818c');p.rect('armL','front',0,9,4,2,'#71818c');p.rect('legR','front',0,10,4,2,'#71818c');p.rect('legL','front',0,10,4,2,'#71818c');p.rect('torso','back',1,2,6,8,'#6f7b82');},{transparent:true}).texture;}
const zhangBody=skinBody('#c69772','#273039');
const collectorBody=skinBody('#ce9c79','#70645d');
const zhangCoat=uniform('#253743','#a47c54');
const collectorCoat=uniform('#665542','#c3a77c');
const heroSuit=suit('#dbe6e9','#bf8750','#2e5065');
const crewSuit=suit('#e2ebeb','#99b3bc','#557281');
const targetSuit=suit('#e1e7e7','#c69459','#597380');
const backpackGeo=voxelModel({palette:{'#':0x71818a,'+':0xe5edf0,'o':0xa76c39},layers:[[".####.","######","##++##","##++##","##oo##",".####."],[".####.","######","##++##","##++##","##oo##",".####."]],axis:'z',voxel:.85});
function person(body,clothes,height=1.8,pack=false){const f=createFigure({body,clothes,heightM:height});if(pack){const p=new THREE.Mesh(backpackGeo,voxelMaterial({metalness:.38,roughness:.52}));p.position.set(0,-.5,-.4);p.scale.set(.8,.8,.8);f.anchors.back.add(p);}return f;}

// The courtyard collector's room: a warm, low-ceilinged cabinet of miniature worlds.
box(room,0,-.16,0,12,.3,10,M.wood);box(room,0,3,-4.7,12,6,.3,M.darkWood);box(room,-6,3,0,.3,6,10,M.darkWood);box(room,6,3,0,.3,6,10,M.darkWood);
for(let i=0;i<4;i++){const x=-4.4+i*2.9;box(room,x,2.6,-4.45,2.3,4.7,.23,M.iron);for(let j=0;j<4;j++){const y=.65+j*.95;box(room,x,y,-4.21,2.1,.08,.7,M.brass);const rr=rock(room,.45+(j%2)*.18,i*5+j);rr.position.set(x+((j%2)?-.45:.4),y+.21,-4.05);box(room,x,y+.52,-4.14,1.85,.02,.03,M.amber,false);}}
box(room,0,.75,1.35,5.7,1.35,2.15,M.wood);box(room,0,1.47,1.35,5.9,.12,2.3,M.darkWood);box(room,4.65,2,-3.95,1.25,2,.25,M.brass);
for(let i=0;i<3;i++){box(room,-3.3+i*3.2,4.9,-4.4,.12,1.65,.14,M.brass);box(room,-1.7+i*3.2,4.9,-4.4,.12,1.65,.14,M.brass);}
light(room,-2.5,4.8,2.2,0xffc68a,33,14,true);light(room,3.4,3.9,-2,0xf7ad65,19,10);light(room,0,3.3,3.4,0x8399b0,5,8);
const roomZ=person(zhangBody,zhangCoat,1.87), roomC=person(collectorBody,collectorCoat,1.72);room.add(roomZ.root,roomC.root);roomZ.root.position.set(-1.55,0,.05);roomC.root.position.set(1.5,0,-.35);roomC.root.rotation.y=-.35;
const roomStones=[0,1,2].map((i)=>{const r=rock(room,1.05,i+17);r.position.set(-.85+i*.9,1.82,1.2);return r;});
const smallStone=rock(room,.72,31);smallStone.position.set(1.1,1.82,1.2);
const teaCup=box(room,-2.1,1.68,1.95,.28,.35,.28,mat(0xddd2b5));

// Research institute: hard cyan cutting light and thirty-six future fragments.
box(workshop,0,-.2,0,14,.4,10,M.floor);box(workshop,0,3,-4.7,14,6,.3,mat(0x19242c));
for(let i=0;i<10;i++)box(workshop,-6.2+i*1.4,5.65,0,.035,.08,10,mat(0x385666));
const cnc= new THREE.Group();workshop.add(cnc);cnc.position.set(0,0,-.65);
box(cnc,0,.82,0,7,1.65,3.15,M.iron);box(cnc,0,1.7,0,6.6,.12,2.95,M.pale);box(cnc,-2.65,2.55,-.8,.3,1.8,.3,M.pale);box(cnc,2.65,2.55,-.8,.3,1.8,.3,M.pale);box(cnc,0,3.42,-.8,5.6,.18,.4,M.pale);
const cncHead=box(cnc,0,2.45,.1,.48,1.45,.48,M.brass);const cutter=box(cnc,0,1.54,.1,.12,.45,.12,M.white);
const rod=box(cnc,0,1.78,.1,2.2,.27,.27,M.iron);rod.rotation.z=.02;
const tray=new THREE.Group();workshop.add(tray);tray.position.set(0,1.8,2.1);box(tray,0,-.08,0,3.5,.12,1.8,M.black);
const blanks=[];for(let i=0;i<36;i++){const x=-1.37+(i%9)*.34,z=-.6+Math.floor(i/9)*.37;const b=box(tray,x,.07,z,.2,.23,.22,mat(i%3===0?0x626b71:0x46515a,0,.45,.45));blanks.push(b);}
const sparks=[];for(let i=0;i<18;i++){const s=box(workshop,0,0,0,.035,.035,.035,M.amber,false);sparks.push(s);}
const shopZ=person(zhangBody,zhangCoat,1.87);workshop.add(shopZ.root);shopZ.root.position.set(-3.85,0,2.3);shopZ.root.rotation.y=.7;
light(workshop,0,4.5,1.3,0x70ddfa,29,15,true);light(workshop,-5,3.2,1,0xf3ad6c,8,12);

// The cellar is built as a narrow acoustic box. Its test material is the same three-layer cloth as the space suit.
box(cellar,0,-.2,0,10,.4,8,mat(0x343539));box(cellar,0,2.9,-3.9,10,6,.3,mat(0x37383a));box(cellar,-5,2.9,0,.3,6,8,mat(0x31363a));box(cellar,5,2.9,0,.3,6,8,mat(0x31363a));
for(let i=0;i<5;i++)box(cellar,-4+i*2,.02,-3,1.4,.03,.03,M.iron);
box(cellar,0,.7,.7,4.1,1.35,1.5,M.iron);box(cellar,0,1.4,.7,4.3,.12,1.7,M.floor);
const cartridges=[];for(let i=0;i<32;i++){const x=-1.5+(i%8)*.43,z=.27+Math.floor(i/8)*.31;const p=new THREE.Group();cellar.add(p);p.position.set(x,1.53,z);box(p,0,0,0,.15,.24,.15,M.brass);box(p,0,.15,0,.15,.12,.15,M.iron);cartridges.push(p);}
const cellarZ=person(zhangBody,zhangCoat,1.87);cellar.add(cellarZ.root);cellarZ.root.position.set(-2.9,0,1.9);cellarZ.root.rotation.y=2.37;
const pistolGeo=voxelModel({palette:{'#':0x111b23,'g':0x5b6570,'o':0x9a7850},layers:[[".#######..","##########","..ggggggg#","....##....","....##....","....oo...."],[".#######..","##########","..ggggggg#","....##....","....##....","....oo...."],[".#######..","##########","..ggggggg#","....##....","....##....","....oo...."]],axis:'x',voxel:.8});
const cellarGun=new THREE.Mesh(pistolGeo,voxelMaterial({metalness:.6,roughness:.45}));cellarGun.scale.set(.7,.7,.7);cellarZ.anchors.handR.add(cellarGun);
const target=new THREE.Group();cellar.add(target);target.position.set(2.1,1.55,-2.8);box(target,0,0,0,1.55,1.5,.3,mat(0xaaa89b));box(target,0,0,.18,1.42,1.39,.08,mat(0xcaccc5));for(let j=0;j<5;j++)box(target,-.6+j*.3,-.35,.245,.06,.6,.03,mat(0x9ba9a9));const holes=[];for(let i=0;i<5;i++){const h=box(target,-.44+(i%3)*.32,-.08+Math.floor(i/3)*.28,.28,.095,.095,.01,M.black);holes.push(h);}
const muzzle=box(cellarZ.anchors.handR,0,0,4.2,3.2,3.2,4.2,M.amber,false);
light(cellar,-1.8,4,1.5,0xe8ae79,22,11,true);light(cellar,3,2.6,-2.9,0x97acb9,6,7);

// Orbital world: one voxel planet, the ring station, an unfinished dock, and the small human group.
const earthGeometry=voxelSphere(25,(x,y,z)=>{const v=Math.sin(x*.31+Math.sin(y*.21))*Math.cos(z*.23)+.45*Math.sin(z*.47-y*.25);const cloud=Math.sin(x*.56+y*.33+z*.13)*Math.sin(z*.49-y*.27);if(cloud>.70)return 0xd5e4e9;if(v>.37)return 0x668b74;if(v>.12)return 0x4e7778;return v<-.36?0x163d65:0x27617f;},{voxel:1.05});
const earth=new THREE.Mesh(earthGeometry,voxelMaterial({emissive:0x102238,roughness:1}));earth.position.set(0,-20,-91);earth.rotation.z=-.32;space.add(earth);
const earthGlow=new THREE.PointLight(0x376eaf,11,110);earthGlow.position.set(0,-24,-68);space.add(earthGlow);
box(space,22,-2,-104,4.5,4.5,4.5,mat(0xffd7a0,0xffad5a,0,1),false);light(space,25,0,-66,0xffd2a0,45,180);
const stationGeo=buildVoxelGeometry({size:[37,37,7],at(x,y,z){const dx=x-18,dy=y-18,r=Math.sqrt(dx*dx+dy*dy);if(r>17||r<13.5)return null;if(z===0||z===6)return 0x7f98a4;return (Math.floor(Math.atan2(dy,dx)*10)%3===0)?0xaebdc4:0x506676;}},{voxel:.58});
const station=new THREE.Group();space.add(station);const ring=new THREE.Mesh(stationGeo,voxelMaterial({metalness:.65,roughness:.4}));ring.castShadow=true;station.add(ring);
for(let a=0;a<8;a++){const ang=a*Math.PI/4;const beam=box(station,Math.cos(ang)*4.1,Math.sin(ang)*4.1,0,8,.32,.45,M.pale);beam.rotation.z=ang;}
box(station,0,0,0,3.7,3.7,3.6,M.iron);box(station,0,0,2.15,2.5,2.5,.5,M.pale);box(station,0,0,2.48,1.4,1.4,.08,M.black);box(station,0,0,2.55,.7,.7,.09,M.cyan);
for(let i=0;i<12;i++){const a=i*Math.PI/6;box(station,Math.cos(a)*8.7,Math.sin(a)*8.7,2.15,.28,.28,.25,i%3===0?M.red:M.cyan,false);}
station.position.set(0,0,-5);station.rotation.z=.09;
const dock=new THREE.Group();space.add(dock);dock.position.set(22,6,-40);for(let x=-2;x<=2;x+=2)for(let y=-1;y<=1;y+=2){for(let z=-2;z<=2;z+=2){box(dock,x*3.5,y*4,z*5,.23,.23,10,M.pale);box(dock,x*3.5,y*4,z*5,.23,8,.23,M.pale);}}for(let z=-2;z<=2;z+=2){box(dock,0,0,z*5,15,.2,.2,M.pale);box(dock,0,0,z*5,.2,9,.2,M.pale);}dock.rotation.y=.38;
const starGeo=new THREE.BufferGeometry();const starPositions=[];const starColors=[];for(let i=0;i<1800;i++){const a=hash(i,1)*Math.PI*2,b=(hash(i,2)-.5)*Math.PI;const rad=190+hash(i,4)*90;starPositions.push(Math.cos(a)*Math.cos(b)*rad,Math.sin(b)*rad,Math.sin(a)*Math.cos(b)*rad);const c=.3+hash(i,3)*.7;starColors.push(c,c*.94,c*.86);}starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));starGeo.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));space.add(new THREE.Points(starGeo,new THREE.PointsMaterial({size:.65,vertexColors:true,sizeAttenuation:true,transparent:true,opacity:.86})));
const hero=person(zhangBody,heroSuit,1.87,true);space.add(hero.root);hero.root.position.set(-1.1,0,52);hero.root.rotation.y=Math.PI;
const spaceGun=new THREE.Mesh(pistolGeo,voxelMaterial({metalness:.65,roughness:.44}));hero.anchors.handR.add(spaceGun);spaceGun.scale.set(.7,.7,.7);spaceGun.visible=false;
const photo=[];for(let i=0;i<15;i++){const f=person(i%5===0?collectorBody:zhangBody,(i===1||i===2||i===3)?targetSuit:crewSuit,1.76,true);space.add(f.root);photo.push(f);}
const bulletMeshes=[];for(let i=0;i<3;i++){const b=rock(space,.13,55+i);bulletMeshes.push(b);b.visible=false;}
const vapor=[];for(let i=0;i<90;i++){const p=box(space,0,0,0,.11,.11,.11,i%5===0?M.cyan:M.cloud,false);vapor.push(p);p.visible=false;}
const gunFlash=box(hero.anchors.handR,0,0,4.2,3.2,3.2,4.2,M.amber,false);gunFlash.visible=false;
const redAlarm=light(space,0,0,8,0xf27258,0,20);

function roomAct(t,which){roomStones.forEach((r,i)=>r.visible=which!=='opening' || i===0);smallStone.visible=which==='opening';if(which==='opening'){roomZ.root.visible=false;roomC.root.visible=false;}else{roomZ.root.visible=true;roomC.root.visible=true;applyPose(roomZ,lerpPose(idle(t),{neck:[.06,-.2,0],armR:[-.28,0,.1],armL:[-.05,0,-.1]},.7));applyPose(roomC,lerpPose(idle(t+1),{neck:[.09,.15,0],armR:[-.65,0,-.18],armL:[-.32,0,.2]},which==='stones'?.9:.48));}teaCup.visible=which!=='opening';}
function workshopAct(t){applyPose(shopZ,lerpPose(idle(t),{neck:[.15,0,0],armR:[-.4,0,.2],armL:[-.3,0,-.2]},.85));cncHead.position.x=Math.sin(t*1.25)*1.1; cutter.position.x=cncHead.position.x;rod.rotation.x=t*9;for(let i=0;i<sparks.length;i++){const p=sparks[i],q=(t*2+i*.137)%1;p.position.set(cncHead.position.x+(hash(i,1)-.5)*q*1.2,1.56+q*.65,.1+(hash(i,3)-.5)*q*.9);p.visible=q<.72 && t<14;}}
function cellarAct(t,testing=false){const fire=testing&&[1.2,2.4,3.5,4.7].some(s=>t>=s&&t<s+.14);muzzle.visible=fire;applyPose(cellarZ,testing?lerpPose(idle(t),aim(-.08,.03),.96):lerpPose(idle(t),{neck:[.12,.1,0],armR:[-.7,0,.07],armL:[-.65,0,-.08]},.8));holes.forEach((h,i)=>h.visible=testing&&t>1+i*.8);cartridges.forEach((c,i)=>c.visible=i<Math.min(32,Math.floor((testing?32:t*2.3)+2)));}
function spaceAct(t,mode='wait'){
  earth.rotation.y=.05+t*.00085;station.rotation.z=.09+t*.002;
  const setup=mode==='shoot'||mode==='flight'||mode==='impact'||mode==='depart';
  hero.root.visible=mode!=='impact';
  hero.root.position.set(-1.1+Math.sin(t*.12)*.12,Math.sin(t*.21)*.18,52);
  hero.root.rotation.set(-.06,Math.PI,Math.sin(t*.15)*.04);
  applyPose(hero, mode==='shoot'||mode==='flight'?lerpPose(float(t),aim(.03,0),.96):float(t));
  spaceGun.visible=setup;gunFlash.visible=mode==='shoot'&&t>=162.4&&t<171.4&&((t-162.4)%0.3<.08);
  photo.forEach((f,i)=>{
    const row=Math.floor(i/5),col=i%5;
    const baseX=(col-2)*1.43,baseY=1.6-row*1.45,baseZ=9+row*.52;
    const hit=mode==='impact'||mode==='depart';
    const wounded=[1,2,3,7,8].includes(i);
    const d=Math.max(0,t-184-i*.11);
    const retreat=hit?Math.max(0,t-190)*.32:0;
    f.root.position.set(baseX+Math.sin(t*.38+i)*.1+(wounded?d*.12:0),baseY+Math.sin(t*.43+i)*.15+(wounded?d*.08:0),baseZ-retreat);
    f.root.rotation.set(hit&&wounded?Math.min(d*.11,1.3):Math.sin(t*.13+i)*.05,Math.PI+Math.sin(i)*.13,hit&&wounded?Math.min(d*.18,1.4):Math.sin(t*.2+i)*.06);
    applyPose(f,hit&&wounded?lerpPose(float(t+i),{armR:[-.2,.5,.7],armL:[-.4,-.5,-.7],legR:[-.8,0,.4],legL:[-.5,0,-.3]},.65):float(t+i));
    f.root.visible=mode==='photo'||mode==='load'||setup;
  });
  vapor.forEach((p,i)=>{let on=false;let origin=[0,0,0];let age=0;if(mode==='impact'||mode==='depart'){const victim=[1,2,3,7,8][i%5];age=t-(184.4+(i%5)*.85);on=age>0&&age<7;const f=photo[victim];origin=[f.root.position.x,f.root.position.y+.6,f.root.position.z];}p.visible=on;if(on){const s=(i%3===0?-1:1);p.position.set(origin[0]+s*age*(.17+hash(i,1)*.19),origin[1]+(hash(i,2)-.5)*age*.42,origin[2]+(hash(i,3)-.5)*age*.26);const sc=Math.max(.2,1-age/8);p.scale.setScalar(sc);}});
  redAlarm.intensity=mode==='impact'?5+Math.sin(t*8)*4:0;
}

const shot=(id,start,end,worldName,update)=>({id,start,end,enter:()=>showWorld(worldName),update:({localTime,time,progress})=>update(localTime,time,progress)});
const shots=[
  shot('01-stone',0,10,'room',(l,t,p)=>{roomAct(t,'opening');cameraPath([.6,2.8,4.5],[.9,1.95,2.45],[.8,1.75,1.3],[1.05,1.8,1.2],p,48,34);}),
  shot('02-collector',10,27,'room',(l,t,p)=>{roomAct(t,'talk');cameraPath([4.2,2.3,4.1],[-3.8,2.25,3.8],[.5,1.25,.1],[0,1.3,.4],p,45,40);}),
  shot('03-choice',27,43,'room',(l,t,p)=>{roomAct(t,'stones');cameraPath([1.8,2.65,4.2],[-1.1,2.3,2.9],[0,1.65,1.1],[-.3,1.65,1.3],p,43,39);}),
  shot('04-price',43,56,'room',(l,t,p)=>{roomAct(t,'price');cameraPath([-3.6,1.96,3.65],[2.7,1.92,2.9],[-.1,1.5,.4],[.2,1.5,.7],p,39,44);}),
  shot('05-machine',56,72,'workshop',(l,t,p)=>{workshopAct(l);cameraPath([-5,3.55,5.5],[2.9,2.25,4.4],[0,1.8,-.4],[0,1.7,1.6],p,49,36);}),
  shot('06-cartridges',72,86,'cellar',(l,t,p)=>{cellarAct(l,false);cameraPath([-.9,3.35,3.6],[.4,2.22,2.5],[0,1.5,.7],[-.1,1.55,.65],p,46,33);}),
  shot('07-test',86,100,'cellar',(l,t,p)=>{cellarAct(l,true);cameraPath([-4.3,2.15,2.9],[3.2,2.1,1.15],[.3,1.55,-1.2],[1,1.6,-2],p,45,42);}),
  shot('08-orbit',100,116,'space',(l,t,p)=>{spaceAct(t,'establish');cameraPath([38,16,69],[18,9,47],[0,-3,-25],[0,-7,-32],p,47,44);}),
  shot('09-wait',116,137,'space',(l,t,p)=>{spaceAct(t,'wait');cameraPath([2.3,1.8,57],[-3.5,1.4,55],[-.9,.7,47],[0,-8,-45],p,36,50);}),
  shot('10-photo',137,150,'space',(l,t,p)=>{spaceAct(t,'photo');cameraPath([8,5,28],[1.5,2.4,23],[0,0,6],[0,0,7],p,41,36);}),
  shot('11-prepare',150,162,'space',(l,t,p)=>{spaceAct(t,'load');spaceGun.visible=true;cameraPath([-2.9,1.7,53],[-1.9,1.5,54],[-1.1,.6,51],[-.6,.75,48],p,38,29);}),
  shot('12-fire',162,172,'space',(l,t,p)=>{spaceAct(t,'shoot');cameraPath([-3.3,1.65,52],[-2.4,1.5,51.5],[-.4,1.1,38],[0,.7,19],p,35,30);}),
  shot('13-flight',172,184,'space',(l,t,p)=>{spaceAct(t,'flight');const f=Math.min(1,l/10);bulletMeshes.forEach((b,i)=>{b.visible=l<10.3;b.position.set(-1.1+(i-1)*.17,(i-1)*.14,49-f*40);});cameraPath([-.9,.6,47-f*26],[2.9,1.1,29-f*14],[-.9,0,36-f*26],[0,.3,11],p,26,37);}),
  shot('14-impact',184,202,'space',(l,t,p)=>{spaceAct(t,'impact');bulletMeshes.forEach(b=>b.visible=false);cameraPath([2.2,2.3,20],[10,5,29],[0,0,9],[0,0,7],p,34,44);}),
  shot('15-depart',202,218,'space',(l,t,p)=>{spaceAct(t,'depart');hero.root.visible=true;hero.root.position.z=52+Math.max(0,l-2)*.75;hero.root.position.x=-1.1-l*.1;photo.forEach(f=>f.root.visible=false);vapor.forEach(v=>v.visible=false);cameraPath([-7,3,55],[-18,10,75],[-1,0,50],[0,-7,-32],p,41,52);}),
  shot('16-end',218,230,'space',(l,t,p)=>{spaceAct(t,'depart');photo.forEach(f=>f.root.visible=false);vapor.forEach(v=>v.visible=false);hero.root.position.set(-4-l*.4,Math.sin(t*.21)*.18,60+l);hero.root.scale.setScalar(Math.max(.3,1-l*.04));cameraPath([6,2,65],[15,9,80],[0,-8,-34],[0,-19,-70],p,48,55);})
];

const soundCues=[];
function sound(id,sound,start,end,gain=.5,group='sfx',sustain=false){soundCues.push({id,kind:'sound',sound,group,gain,sustain,start,end});}
sound('room-tone','warm-tone',0,56,.34,'ambience',true);
for(const t of [10.4,11.2,30.1,31.2,45.3])sound('wood-'+t,'wood-step',t,t+.55,.24);
for(const t of [27.4,32.6,38.1,44.0,51.8])sound('stone-'+t,'metal-light',t,t+.45,.22);
sound('machine','machine',56,72,.35,'ambience',true);sound('machine-cut','metal-heavy',60.3,61.2,.24);sound('machine-cut2','metal-heavy',67.1,68,.22);
sound('cellar-tone','low-tone',72,100,.34,'ambience',true);
for(const t of [76.2,78.4,80.1,84.3])sound('bullet-'+t,'metal-light',t,t+.4,.27);
for(const t of [87.2,88.4,89.5,90.7]){sound('test-'+t,'blast',t,t+1.2,.82);sound('echo-a-'+t,'blast',t+.19,t+.65,.29);sound('echo-b-'+t,'low-blast',t+.43,t+1.3,.2);}
sound('station-door','door-open',137.7,139.4,.5);sound('station-door-close','door-close',199.0,200.4,.48);
sound('orbit-hum','low-tone',100,230,.19,'ambience',true);sound('helmet-breath','breath',116,218,.24,'ambience',true);
for(const t of [164.0,167.0,169.9])sound('suit-recoil-'+t,'metal-light',t,t+.36,.16);
for(const t of [185.0,186.1,187.2,188.3,189.4])sound('suit-rupture-'+t,'soft-heavy',t,t+.58,.3);
sound('alarm','alarm-tone',185,202,.22,'ambience',true);sound('thruster1','thruster',192,198,.28,'sfx',true);sound('thruster2','thruster',203,214,.25,'sfx',true);
sound('ending-tone','end-tone',205,230,.45,'score',true);

const context={scene,camera};
const player=new CinematicPlayer({duration:DURATION,context,shots,cues:[...voiceCues,...soundCues]});
const stage=new ThreeStage({player,renderer,scene,camera:()=>camera,container:document.querySelector('#stage'),maxPixelRatio:1.7});
const audio=new WebAudioCueBus(player);
audio.defineSample('wood-step',footWood);audio.defineSample('metal-light',metalLight);audio.defineSample('metal-heavy',metalHeavy);audio.defineSample('soft-heavy',softHeavy);
audio.defineSample('door-open',doorOpen);audio.defineSample('door-close',doorClose);
audio.defineSample('machine',machineSound,{loop:true,playbackRate:.63});audio.defineSample('blast',blast,{playbackRate:.8});audio.defineSample('low-blast',lowBlast,{playbackRate:.8});audio.defineSample('thruster',thruster,{loop:true,playbackRate:.72});
function drone(base,shape='sine'){return ({audioContext:ac,output})=>{const osc=ac.createOscillator(),o2=ac.createOscillator(),gain=ac.createGain(),filter=ac.createBiquadFilter();osc.type=shape;o2.type='sine';osc.frequency.value=base;o2.frequency.value=base*.502;filter.type='lowpass';filter.frequency.value=460;gain.gain.value=.22;osc.connect(filter);o2.connect(filter);filter.connect(gain).connect(output);osc.start();o2.start();return {stop:()=>{try{osc.stop();o2.stop();}catch{}}};};}
audio.define('warm-tone',drone(74,'triangle'));audio.define('low-tone',drone(52,'sawtooth'));audio.define('end-tone',drone(41,'sine'));
audio.define('breath',({audioContext:ac,output})=>{const size=ac.sampleRate*2,buffer=ac.createBuffer(1,size,ac.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<size;i++)data[i]=(Math.random()*2-1)*.15;const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain(),lfo=ac.createOscillator(),depth=ac.createGain();src.buffer=buffer;src.loop=true;filter.type='lowpass';filter.frequency.value=280;gain.gain.value=.08;lfo.frequency.value=.26;depth.gain.value=.07;lfo.connect(depth).connect(gain.gain);src.connect(filter).connect(gain).connect(output);src.start();lfo.start();return {stop:()=>{try{src.stop();lfo.stop();}catch{}}};});
audio.define('alarm-tone',({audioContext:ac,output})=>{const osc=ac.createOscillator(),gain=ac.createGain();osc.type='triangle';osc.frequency.value=740;gain.gain.value=.11;osc.connect(gain).connect(output);osc.start();return {stop:()=>{try{osc.stop();}catch{}}};});
audio.setMasterGain(.8);
const controls=mountCinematicControls({player,audio,container:document.querySelector('#app')});
const title=document.querySelector('#film-title'),chapter=document.querySelector('#chapter'),end=document.querySelector('#end-card');
const chapters=[[0,'01  /  尘世之外'],[56,'02  /  三十六段'],[100,'03  /  黄河空间站'],[162,'04  /  十秒'],[202,'05  /  方向']];
player.addTypedEventListener('frame',({detail})=>{const t=detail.time;title.classList.toggle('visible',t<8.8);end.classList.toggle('visible',t>=224);let label='';for(const [s,v] of chapters)if(t>=s)label=v;chapter.textContent=t<218?label:'';chapter.style.opacity=(t<6||t>216)?'0':'.82';});
player.refresh();
window.__film={player,stage,audio,controls,voiceCues,soundCues};
