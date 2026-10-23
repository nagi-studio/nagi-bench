import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildVoxelGeometry, voxelSphere, voxelTerrain, voxelMaterial, voxelModel } from '@agentbench/voxel-kit';
import { makeActor, makeGun, makeCup, makeScope } from './cast.js';
import { hash, rng } from './math.js';

const unit=new THREE.BoxGeometry(1,1,1), matCache=new Map();
export function material(color, extra={}){
  const key=String(color)+JSON.stringify(extra);if(matCache.has(key))return matCache.get(key);
  const m=new THREE.MeshStandardMaterial({color,roughness:.8,...extra});matCache.set(key,m);return m;
}
export const C={wood:0x453b2e,woodEdge:0x6b5138,metal:0x42585d,pale:0xb5c6c2,dark:0x13242c,cream:0xe1d1ad,amber:0xf7bd72,cyan:0x6fc3c3,red:0xc55242};
export function box(root,size,pos,color,extra={},movable=false){
  const m=new THREE.Mesh(unit, typeof color==='object'?color:material(color,extra));m.scale.set(...size);m.position.set(...pos);
  m.castShadow=true;m.receiveShadow=true;m.userData.static=!movable;root.add(m);return m;
}
function batch(root,shadows=true){
  root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert(),groups=new Map(),remove=[];
  root.traverse(m=>{if(!m.isMesh||!m.userData.static)return;const key=m.material.uuid;if(!groups.has(key))groups.set(key,{mat:m.material,geos:[]});const g=m.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld));groups.get(key).geos.push(g);remove.push(m);});
  for(const m of remove)m.removeFromParent();
  for(const {mat,geos} of groups.values()){const g=mergeGeometries(geos);const m=new THREE.Mesh(g,mat);m.castShadow=shadows;m.receiveShadow=shadows;root.add(m);geos.forEach(g=>g.dispose());}
}
function light(root,color,intensity,pos,shadow=false){
  const l=new THREE.PointLight(color,intensity,30,2);l.position.set(...pos);l.castShadow=shadow;if(shadow){l.shadow.mapSize.set(1024,1024);l.shadow.bias=-.0005;l.shadow.normalBias=.025;l.shadow.camera.near=.1;}root.add(l);return l;
}
function areaKey(root,color,intensity,pos,target,angle=.7){
  const l=new THREE.SpotLight(color,intensity,35,angle,.55,1.5);l.position.set(...pos);l.target.position.set(...target);root.add(l,l.target);l.castShadow=true;l.shadow.mapSize.set(2048,2048);l.shadow.bias=-.0003;l.shadow.normalBias=.025;return l;
}
function ambient(root,color,intensity){const a=new THREE.AmbientLight(color,intensity);root.add(a);return a;}
function label(root,text,pos,width=1.4,color='#d3d4bc',back='#1a2b2b',size=30){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');
  ctx.fillStyle=back;ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font=`500 ${size}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,65);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width/4),new THREE.MeshBasicMaterial({map:tex}));m.position.set(...pos);root.add(m);return m;
}
export function stone(radius=.16,seed=0,metal=true){
  const g=voxelSphere(4,(x,y,z)=>{
    const n=hash(x*11+y*61+z*31+seed*127);const cut=hash(x*3+y*17+z*41+seed);
    if(Math.hypot(x-4,y-4,z-4)>3.7&&cut>.65)return null;
    return new THREE.Color().setHSL(.12+seed*.008,.065,.035+n*.065).getHex();
  },{voxel:radius/4});
  const m=new THREE.Mesh(g,voxelMaterial({roughness:metal?.52:.95,metalness:metal?.32:0}));m.rotation.set(.24+seed,.43*seed,.12);m.castShadow=true;m.receiveShadow=true;return m;
}
function particles(root,n,size=.013,color=0xd9c09a,spread=[8,3,6],seed=2){
  const rnd=rng(seed),mat=material(color,{transparent:true,opacity:.42,emissive:color,emissiveIntensity:.1,depthWrite:false});
  const inst=new THREE.InstancedMesh(unit,mat,n);root.add(inst);const data=Array.from({length:n},()=>({p:[(rnd()-.5)*spread[0],rnd()*spread[1],(rnd()-.5)*spread[2]],s:size*(.6+rnd()),phase:rnd()*6.28}));
  const obj=new THREE.Object3D();
  return {mesh:inst,update(t){data.forEach((d,i)=>{obj.position.set(d.p[0]+Math.sin(t*.06+d.phase)*.13,d.p[1]+Math.sin(t*.1+d.phase)*.1,d.p[2]);obj.rotation.set(t*.04+d.phase,t*.03,0);obj.scale.setScalar(d.s);obj.updateMatrix();inst.setMatrixAt(i,obj.matrix);});inst.instanceMatrix.needsUpdate=true;}};
}
function roomShell(root,w,d,h,wall=0x414c48,floor=0x4a473a,window=false){
  box(root,[w,.16,d],[0,-.1,0],floor);
  if(!window)box(root,[w,h,.18],[0,h/2,-d/2],wall);
  else {box(root,[w,.7,.18],[0,.35,-d/2],wall);box(root,[w,.5,.18],[0,h-.25,-d/2],wall);}
  box(root,[.18,h,d],[-w/2,h/2,0],wall);box(root,[.18,h,d],[w/2,h/2,0],wall);
  const woodFloor=floor===0x554a36||floor===0x4a473a;
  if(woodFloor)for(let x=-w/2+.18;x<w/2;x+=.35)box(root,[.025,.012,d],[x,.001,0],0x282b26);
  else {
    for(let x=-w/2+.7;x<w/2;x+=1.4)box(root,[.014,.009,d],[x,.001,0],0x182d32);
    for(let z=-d/2+.7;z<d/2;z+=1.4)box(root,[w,.009,.014],[0,.001,z],0x182d32);
  }
  for(let x=-w/2;x<=w/2;x+=w/3){box(root,[.18,h,.23],[x,h/2,-d/2+.13],C.wood);box(root,[.2,.2,d],[x,h-.05,0],C.wood);}
  box(root,[w,.22,.25],[0,h-.05,-d/2+.1],C.wood);
}

export function createCourtyard(){
  const root=new THREE.Group();root.name='胡同';
  root.add(new THREE.Mesh(voxelTerrain(50,64,(x,z)=>1+(hash(x+z*50)>.98?1:0),(x,y,z)=>[0x4b5554,0x505b5a,0x596261][Math.floor(hash(x*3+z*11)*3)],{voxel:.25}),voxelMaterial()));
  // The slab top is brought to ground level; stones remain visibly cubical.
  root.children[0].position.y=-.25;
  box(root,[11,3.2,.35],[0,1.6,-4],0x4d5550);
  for(let row=0;row<11;row++)for(let c=0;c<27;c++)box(root,[.38,.24,.06],[-5.2+c*.4+(row%2)*.2,.18+row*.27,-3.79],(row+c)%5===0?0x68706a:0x59625c);
  const door=box(root,[1.7,2.35,.15],[0,1.18,-3.64],0x483f2d);
  for(const x of [-.8,.8])box(root,[.14,2.6,.23],[x,1.3,-3.51],0x804e34);
  box(root,[1.95,.16,.23],[0,2.57,-3.5],0x804e34);
  for(const x of [-3.5,3.5]){
    box(root,[2.3,1.6,.13],[x,1.65,-3.7],0x8d704b,{emissive:0xd7a363,emissiveIntensity:.4});
    for(let j=0;j<8;j++)box(root,[.045,1.7,.16],[x-1.05+j*.3,1.65,-3.59],C.wood);
    for(let j=0;j<4;j++)box(root,[2.3,.05,.16],[x,1+j*.42,-3.57],C.wood);
  }
  const roofGeo=buildVoxelGeometry({size:[52,8,12],at(x,y,z){const roofY=6-Math.floor(Math.abs(z-5.5)*.7);return y===roofY||y===roofY-1?([0x343f3e,0x3f4947,0x48524e][(x+z)%3]):null;}},{voxel:.23});
  const roof=new THREE.Mesh(roofGeo,voxelMaterial());roof.position.set(0,3.45,-4.25);root.add(roof);
  for(const x of [-5.6,5.6]){
    box(root,[.4,3,14],[x,1.5,1],0x424e4c);
    box(root,[.7,.18,14],[x,3.05,1],0x293d3e);
    for(let k=0;k<10;k++)box(root,[.47,.06,14],[x, .23+k*.29,1],0x566360);
  }
  for(const x of [-1.35,1.35]){
    box(root,[.06,.5,.06],[x,2.6,-3.16],C.dark);
    box(root,[.34,.42,.3],[x,2.2,-3.15],0xd3a15e,{emissive:0xedac59,emissiveIntensity:.75});
    box(root,[.44,.07,.4],[x,2.44,-3.15],C.wood);box(root,[.42,.06,.4],[x,1.97,-3.15],C.wood);
  }
  // An old ginkgo is an angular arrangement of trunks and clustered voxels.
  box(root,[.32,3,.35],[-3.5,1.5,.8],0x4e4936);const branch=box(root,[.2,1.5,.2],[-3.1,2.8,.8],0x4e4936);branch.rotation.z=-.6;
  for(let i=0;i<7;i++){const m=new THREE.Mesh(voxelSphere(3,()=>[0xa59d55,0x8f914e,0xb4a25b][Math.floor(hash(i*13)*3)],{voxel:.24}),voxelMaterial());m.position.set(-3.5+Math.sin(i*4)*1.1,3.3+hash(i)*.9,.8+Math.cos(i*3)*.8);root.add(m);}
  for(let i=0;i<80;i++)box(root,[.08,.012,.055],[-4+hash(i*3)*8,.03,-3+hash(i*11)*9],0xaca05b);
  const zhang=makeActor();root.add(zhang.root);
  ambient(root,0x6d929d,.65);areaKey(root,0xabc8d0,12,[-3,7,5],[0,0,0],1);light(root,0xffbc6e,28,[0,2,-2.8]);
  batch(root);return {root,zhang,door};
}

export function createCollection(){
  const root=new THREE.Group();root.name='陨石收藏室';roomShell(root,9,7,3.3,0x555543,0x554a36);
  for(let i=0;i<4;i++){
    const x=-3.3+i*2.2;
    box(root,[1.9,2.5,.75],[x,1.35,-2.9],C.wood);
    box(root,[1.65,2.2,.75],[x,1.4,-2.8],0x1f302d);
    for(let shelf=0;shelf<3;shelf++){
      const y=.65+shelf*.7;box(root,[1.8,.06,.9],[x,y-.09,-2.62],C.woodEdge);
      box(root,[1.5,.035,.13],[x,y+.48,-2.52],0xd2b37d,{emissive:0xffd392,emissiveIntensity:1.2});
      for(let k=0;k<2;k++){
        const s=stone(.12+hash(i*7+shelf*3+k)*.1,i+shelf+k,false);s.position.set(x-.42+k*.78,y+.15,-2.5);root.add(s);
        box(root,[.35,.065,.35],[s.position.x,y-.02,-2.5],0x807b60);
      }
    }
    const glass=box(root,[1.76,2.2,.025],[x,1.4,-2.17],0xabc9b8,{transparent:true,opacity:.065,roughness:.12,metalness:.25,depthWrite:false});glass.castShadow=false;
    box(root,[.04,2.35,.05],[x-.88,1.4,-2.12],0x9f956f);box(root,[.04,2.35,.05],[x+.88,1.4,-2.12],0x9f956f);
  }
  box(root,[2.75,.16,1.25],[0,.8,.15],0x7d6541);
  for(const x of [-1.18,1.18])for(const z of [-.35,.65])box(root,[.12,.8,.12],[x,.4,z],C.wood);
  box(root,[2.4,.035,1.05],[0,.9,.15],0x515849);
  const tea1=makeCup();tea1.position.set(-.8,.99,.5);root.add(tea1);
  const tea2=makeCup();tea2.position.set(.75,.99,-.1);root.add(tea2);
  box(root,[.105,.008,.105],[-.8,1.052,.5],0x5c4025,{roughness:.13});
  box(root,[.105,.008,.105],[.75,1.052,-.1],0x5c4025,{roughness:.13});
  const tray=new THREE.Group();root.add(tray);box(tray,[1.02,.045,.52],[0,.96,.16],0x9b8862);
  const rocks=Array.from({length:3},(_,i)=>{const s=stone(.15,i+2);s.position.set(-.32+i*.32,1.08,.16);root.add(s);return s;});
  const collector=makeActor('collector','collector');collector.root.position.set(.5,0,-.95);root.add(collector.root);
  const zhang=makeActor();zhang.root.position.set(-1.3,0,1.2);zhang.root.rotation.y=2.8;root.add(zhang.root);
  const handCup=makeCup(true);handCup.position.set(0,1.2,0);collector.anchors.handR.add(handCup);
  const zhangCup=makeCup(true);zhangCup.position.set(0,1.2,0);zhang.anchors.handL.add(zhangCup);
  // Slatted side window: a second, cold world beyond the warm room.
  box(root,[.05,1.6,2.4],[-4.37,1.9,.8],0x657d77,{emissive:0x8aa3a0,emissiveIntensity:.45});
  for(let i=0;i<8;i++)box(root,[.09,1.7,.05],[-4.3,1.9,-.3+i*.31],C.wood);
  for(let i=0;i<3;i++)box(root,[.1,.06,2.4],[-4.3,1.25+i*.55,.8],C.wood);
  label(root,'天 外 来 客',[0,2.95,-3.37],2.6,'#c4ae7b','#393d30',44);
  box(root,[.6,.14,.6],[.2,3.05,0],0x6e684a);box(root,[.42,.1,.42],[.2,2.95,0],0xf0cca0,{emissive:0xffcd8a,emissiveIntensity:1.5});
  ambient(root,0xa4aa88,.6);const key=areaKey(root,0xffd59c,32,[1.2,3.1,1.7],[0,.8,0],.95);
  light(root,0x9ebbc3,10,[-3.6,2,.3]);light(root,0xeec17b,18,[1,2.6,-2]);
  const dust=particles(root,45,.012,0xd3c092);
  batch(root);return {root,collector,zhang,rocks,tea1,tea2,handCup,zhangCup,dust,key};
}

export function createWorkshop(){
  const root=new THREE.Group();root.name='模型车间';roomShell(root,11,8,4,0x2a4142,0x303b3b);
  for(let i=0;i<5;i++){
    box(root,[1.5,1.4,.6],[-4.2+i*2.1,.7,-3.4],0x385454);
    for(let j=0;j<4;j++)box(root,[1.35,.025,.025],[-4.2+i*2.1,.3+j*.3,-3.07],0x102b30);
  }
  const machine=new THREE.Group();root.add(machine);
  box(machine,[2.9,.85,1.4],[0,.45,-.6],0x3b6768);box(machine,[3.1,.16,1.6],[0,.94,-.6],0x8ca4a0);
  box(machine,[.65,1.4,1.35],[-1.2,1.65,-.6],0x557e7d);box(machine,[.45,.45,.45],[-.76,1.6,-.6],0x536266,{metalness:.7});
  box(machine,[2.6,1.8,.13],[0,1.82,-1.32],0x274c50);box(machine,[3,.18,1.6],[0,2.65,-.6],0x366466);
  for(const x of [-1.4,1.4])box(machine,[.13,1.7,.14],[x,1.8,.1],0x6a8f8e);
  const spindle=new THREE.Group();spindle.position.set(-.25,1.6,-.6);machine.add(spindle);
  const rock=stone(.25,2);spindle.add(rock);box(spindle,[.25,.35,.35],[-.38,0,0],0x778986,{metalness:.8},true);
  const tool=box(root,[.08,.52,.12],[.1,1.9,-.4],0xc3b98b,{metalness:.85,roughness:.3},true);
  box(root,[.7,.9,.5],[1.9,1.7,-.55],0x26464b);box(root,[.55,.3,.02],[1.9,1.9,-.28],0x6caaa1,{emissive:0x4c9f9a,emissiveIntensity:.4});
  for(let i=0;i<4;i++)box(root,[.07,.07,.02],[1.72+i*.12,1.65,-.28],i===3?0xa4583c:0x9aa994);
  box(root,[2.7,.13,1.1],[-.1,.82,1.8],0x677973);
  for(const x of [-1.2,1])box(root,[.12,.8,.7],[x,.4,1.8],0x334e4f);
  const tray=box(root,[1.2,.05,.7],[-.1,.92,1.8],0x303f3e);
  const pieces=[];for(let i=0;i<36;i++)pieces.push(box(root,[.045,.055,.1],[-.57+(i%9)*.118,.98,1.56+Math.floor(i/9)*.16],0x7e8f89,{metalness:.7,roughness:.4},true));
  const sparks=particles(root,48,.018,0xffbb52,[.6,.5,.6],18);sparks.mesh.material.opacity=.9;sparks.mesh.material.emissiveIntensity=3;
  const zhang=makeActor();zhang.root.position.set(.6,0,.8);zhang.root.rotation.y=3.3;root.add(zhang.root);
  label(root,'模型制造 / 07',[3.5,2.8,-3.87],2.1,'#94b6ae','#243c3c',29);
  for(const x of [-3,1,4]){box(root,[1.8,.04,.1],[x,3.85,0],0xbdded5,{emissive:0xc1e9e2,emissiveIntensity:2});}
  ambient(root,0x86b7b8,.52);areaKey(root,0xb7e2d7,39,[0,3.9,1],[0,0,0],1.1);light(root,0xf9bb70,15,[-1,2.3,-.3]);
  batch(root);return {root,zhang,spindle,tool,pieces,sparks};
}

export function createBasement(){
  const root=new THREE.Group();root.name='地下室';roomShell(root,7,9,2.65,0x414d49,0x41423a);
  for(let row=0;row<12;row++)for(let col=0;col<20;col++)box(root,[.31,.18,.025],[-3.3+col*.35+(row%2)*.15,.15+row*.21,-4.39],(col+row)%3?0x4b5650:0x59615a);
  for(let i=0;i<3;i++)box(root,[.09,.09,8],[-2.8+i*.17,2.4,0],0x6c7667,{metalness:.4});
  box(root,[1.7,.13,.85],[1.6,.83,1.4],0x685d44);for(const x of [.9,2.3])box(root,[.1,.8,.7],[x,.4,1.4],C.wood);
  const gun=makeGun();gun.position.set(1.4,.97,1.4);gun.rotation.y=.5;root.add(gun);
  const pieces=[];for(let i=0;i<12;i++)pieces.push(box(root,[.045,.05,.08],[1.7+(i%4)*.1,.94,1.15+Math.floor(i/4)*.13],0x8c927d,{metalness:.5}));
  const target=box(root,[1.25,1.4,.35],[0,1.05,-3.5],0xadaf96);
  box(root,[1.4,.12,.9],[0,.23,-3.5],0x666c58);
  const fabric=document.createElement('canvas');fabric.width=fabric.height=128;const ctx=fabric.getContext('2d');ctx.fillStyle='#a3ac9d';ctx.fillRect(0,0,128,128);ctx.strokeStyle='#788b7f';ctx.lineWidth=3;
  for(let i=0;i<128;i+=16){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,128);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(128,i);ctx.stroke();}
  const tex=new THREE.CanvasTexture(fabric);tex.magFilter=THREE.NearestFilter;tex.colorSpace=THREE.SRGBColorSpace;
  const cloth=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.35),material(0xffffff,{map:tex}));cloth.position.set(0,1.05,-3.315);root.add(cloth);
  const holes=Array.from({length:4},(_,i)=>box(root,[.035,.035,.008],[-.14+(i%2)*.23,.94+Math.floor(i/2)*.24,-3.3],0x243631,{},true));
  const zhang=makeActor();zhang.root.position.set(-.1,0,1.4);zhang.root.rotation.y=Math.PI;root.add(zhang.root);
  const handGun=makeGun(true);zhang.anchors.handR.add(handGun);
  const palm=new THREE.Group();root.add(palm);box(palm,[.35,.04,.3],[0,0,0],0x5c6d64,{},true);
  for(let i=0;i<9;i++){const s=stone(.035,i+20);s.position.set((hash(i)-.5)*.24,.05,(hash(i*3)-.5)*.2);palm.add(s);}
  const flash=light(root,0xffd5a3,0,[0,1.3,.8]);
  box(root,[.35,.06,.35],[.4,2.5,.2],0xd9b67b,{emissive:0xffcb7b,emissiveIntensity:1.4});
  ambient(root,0x617d7b,.45);areaKey(root,0xf6c893,26,[.5,2.5,.4],[0,0,-1],1.2);light(root,0x73a5a6,10,[-2,2,-3]);
  light(root,0xb9c9b4,5,[1.7,1.75,1.7]);
  batch(root);return {root,zhang,handGun,gun,holes,palm,flash};
}

function earthGeometry(){
  const landPolygons=[
    [[-168,65],[-145,71],[-130,55],[-122,48],[-116,31],[-100,20],[-84,15],[-78,30],[-64,47],[-54,53],[-70,70],[-112,73]],
    [[-81,13],[-62,9],[-46,-2],[-36,-10],[-50,-30],[-66,-55],[-74,-46],[-78,-20]],
    [[-18,35],[2,38],[31,31],[43,10],[50,-12],[33,-35],[18,-35],[7,-13],[-5,3],[-17,16]],
    [[-10,36],[-8,58],[13,70],[42,68],[59,75],[91,73],[126,68],[179,60],[160,44],[139,38],[124,20],[106,8],[98,18],[80,9],[66,25],[44,32],[29,42],[11,39]],
    [[112,-11],[136,-12],[153,-25],[146,-39],[119,-36],[113,-23]],
    [[-55,59],[-44,59],[-20,75],[-39,83],[-60,76]],
  ];
  function inside(p,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
  return voxelSphere(36,(x,y,z)=>{
    const dx=x-35.5,dy=y-35.5,dz=z-35.5;const lat=Math.atan2(dy,Math.hypot(dx,dz))*180/Math.PI,lon=Math.atan2(dx,dz)*180/Math.PI;
    const n=hash(x*7+y*11+z*31);const isLand=landPolygons.some(p=>inside([lon,lat],p));
    const cloud=Math.sin(lon*.12+lat*.065+Math.sin(lat*.12)*2)+Math.sin(lat*.29-lon*.06)*.52+Math.sin(lon*.31+lat*.23)*.25;
    if(Math.abs(lat)>73||cloud>1.14)return new THREE.Color().setHSL(.15,.11,.68+n*.17).getHex();
    if(isLand)return new THREE.Color().setHSL(.36,.22,.16+n*.07+Math.max(0,1-Math.abs(lat-23)/15)*.035).getHex();
    return new THREE.Color().setHSL(.555,.6,.19+n*.045).getHex();
  },{voxel:2.3});
}
let planetGeo;
export function planet(root,pos=[0,-58,-180],scale=1){
  if(!planetGeo)planetGeo=earthGeometry();
  const group=new THREE.Group();group.position.set(...pos);group.scale.setScalar(scale);root.add(group);
  const globe=new THREE.Mesh(planetGeo,voxelMaterial({roughness:.94,metalness:.04}));group.add(globe);
  const atmosphere=new THREE.Mesh(planetGeo,new THREE.ShaderMaterial({
    vertexShader:'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
    fragmentShader:'varying vec3 n; varying vec3 v; void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),3.8);gl_FragColor=vec4(.22,.62,.7,rim*.27);}',
    transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.FrontSide,
  }));atmosphere.scale.setScalar(1.014);group.add(atmosphere);return group;
}
function spaceLights(root){
  ambient(root,0x88a8b3,.32);
  const sun=new THREE.DirectionalLight(0xffd1a1,3.5);sun.position.set(70,35,30);root.add(sun);
  const bounce=new THREE.DirectionalLight(0x3e98ae,1.05);bounce.position.set(-30,-60,20);root.add(bounce);return sun;
}
function stars(root,seed=28){
  const rnd=rng(seed),n=900,pts=[];
  for(let i=0;i<n;i++){const a=rnd()*Math.PI*2,z=rnd()*2-1,s=Math.sqrt(1-z*z);pts.push(Math.cos(a)*s*600,z*600,Math.sin(a)*s*600);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  root.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xc3d2c8,size:.48,sizeAttenuation:true,transparent:true,opacity:.62})));return g;
}
export function station(root,pos=[0,0,0],scale=1){
  const g=new THREE.Group();g.position.set(...pos);g.scale.setScalar(scale);root.add(g);
  const geo=buildVoxelGeometry({size:[76,76,8],at(x,y,z){
    const d=Math.hypot(x-37.5,y-37.5),a=Math.atan2(y-37.5,x-37.5);if(d<31.5||d>37)return null;
    if(z===7&&d>33&&d<35&&Math.floor(a*19)%3!==0)return 0x334f58;
    if(d<32.5)return 0x5c777e;
    return (x+y)%11===0?0x8ea3a3:0xb0bab1;
  }},{voxel:.32});
  g.add(new THREE.Mesh(geo,voxelMaterial({metalness:.32,roughness:.62})));
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const beam=box(g,[.55,10,.65],[Math.sin(a)*5,Math.cos(a)*5,0],0x738d90);beam.rotation.z=-a;
    const p=box(g,[.22,.6,.13],[Math.sin(a)*11,Math.cos(a)*11,1.35],i===0?0xe9a16a:0x71b6b2,{emissive:i===0?0xe9a16a:0x71b6b2,emissiveIntensity:.6});p.rotation.z=-a;
  }
  box(g,[3.4,3.4,2.6],[0,0,0],0xb4c0b6);box(g,[2.1,2.1,.5],[0,0,1.55],0x4a6c72);
  box(g,[.11,150,.11],[0,-75,0],0x5e9098,{metalness:.7});
  for(const side of [-1,1]){
    box(g,[15,.22,.22],[side*13,0,-1.3],0x547681);
    for(let k=0;k<3;k++){
      box(g,[4.3,6.5,.12],[side*(16+k*4.6),0,-1.4],0x1d4353,{metalness:.55,roughness:.45});
      for(let j=0;j<8;j++)box(g,[4.1,.035,.025],[side*(16+k*4.6),-3+j*.85,-1.31],0x547477);
      box(g,[.04,6.5,.03],[side*(16+k*4.6),0,-1.31],0x6d8b8c);
    }
  }
  return g;
}
function sunSprite(root){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d'),grad=c.createRadialGradient(64,64,0,64,64,64);
  grad.addColorStop(0,'rgba(255,239,190,1)');grad.addColorStop(.09,'rgba(255,228,170,.95)');grad.addColorStop(.18,'rgba(255,191,113,.35)');grad.addColorStop(.5,'rgba(255,176,100,.07)');grad.addColorStop(1,'rgba(255,170,100,0)');c.fillStyle=grad;c.fillRect(0,0,128,128);
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));sprite.scale.set(45,45,1);sprite.position.set(40,20,-210);root.add(sprite);return sprite;
}
export function createOrbit(){
  const root=new THREE.Group();root.name='静默轨道';stars(root);
  const earth=planet(root,[-25,-58,-194]);const wheel=station(root,[28,9,-59],1.25);wheel.rotation.set(-.1,-.22,.12);
  // Unfinished dock: humanity has only just reached the shore.
  const dock=new THREE.Group();dock.position.set(-49,12,-73);dock.rotation.set(.2,.4,-.22);root.add(dock);
  for(let i=0;i<7;i++){
    for(const x of [-5,5])box(dock,[.24,8,.24],[x,0,-i*6],0x6b8587);
    for(const y of [-4,4])box(dock,[10,.24,.24],[0,y,-i*6],0x6b8587);
    if(i<6)for(const x of [-5,5])for(const y of [-4,4])box(dock,[.24,.24,6],[x,y,-i*6-3],0x91a19a);
  }
  const zhang=makeActor('zhang','suit');root.add(zhang.root);zhang.visor(false);
  const gun=makeGun(true);zhang.anchors.handR.add(gun);
  const scope=makeScope(true);scope.position.set(0,3.5,3);zhang.anchors.handR.add(scope);
  const flash=box(root,[.13,.13,.28],[0,0,0],0xffdda0,{emissive:0xffd49e,emissiveIntensity:8},true);flash.castShadow=false;
  const flashLight=light(root,0xffcd84,0,[0,1.4,.3]);
  const heroStone=stone(1.5,9);heroStone.position.set(3.3,2.5,3);root.add(heroStone);
  const sun=sunSprite(root);const key=spaceLights(root);
  const debris=particles(root,40,.16,0x7b9b9a,[80,55,65],32);debris.mesh.material.opacity=.55;
  // Exhaust consists of many hard-edged crystals, never a fire plume in vacuum.
  const exhaust=particles(root,65,.045,0xb2d8d4,[.7,.5,3],13);exhaust.mesh.material.opacity=.3;
  const fragment=stone(.12,6);root.add(fragment);
  batch(wheel,false);batch(root,false);return {root,earth,wheel,dock,zhang,gun,scope,flash,flashLight,heroStone,sun,key,debris,exhaust,fragment};
}

export function createElevator(){
  const root=new THREE.Group();root.name='太空电梯';stars(root,80);const earth=planet(root,[0,-118,-170],1.55);const sun=spaceLights(root);
  for(const x of [-.7,.7])box(root,[.065,400,.1],[x,0,-2.1],0x73a5ae,{metalness:.6});
  const car=new THREE.Group();root.add(car);
  box(car,[3.4,3,.15],[0,1.5,-1.4],0x71918f);
  for(const x of [-1.6,1.6])box(car,[.18,3,2.8],[x,1.5,0],0x71918f);
  box(car,[3.4,.65,.15],[0,.33,1.4],0x71918f);box(car,[3.4,.35,.15],[0,2.83,1.4],0x71918f);
  box(car,[3.6,.2,3],[0,0,0],0xc0c6b5);box(car,[3.6,.2,3],[0,3,0],0xc0c6b5);
  for(const x of [-1.7,1.7])box(car,[.16,5,.3],[x,1.5,-1.1],0x41676c);
  const glass=box(car,[2.8,1.7,.03],[0,1.65,1.42],0x305f69,{metalness:.2,roughness:.25,transparent:true,opacity:.18,depthWrite:false});glass.castShadow=false;
  for(let i=0;i<4;i++)box(car,[.05,1.5,.06],[-1.1+i*.75,1.7,1.45],0x9ea99c);
  const a=makeActor();a.root.position.set(-.4,.2,.4);car.add(a.root);
  const b=makeActor('crew','uniform');b.root.position.set(.5,.2,.4);car.add(b.root);
  light(car,0xc6dfd5,4,[0,2.7,.1]);
  label(car,'增援未来 / 01',[0,2.78,1.51],1.9,'#d7d2b3','#355b63',28);
  batch(car,false);batch(root,false);return {root,earth,car,a,b,sun};
}

export function createCouncil(){
  const root=new THREE.Group();root.name='路线会议';roomShell(root,10,9,4,0x253f49,0x25343c,true);
  const windowPane=box(root,[9,2.5,.02],[0,2.25,-4.36],0x456a72,{transparent:true,opacity:.08,depthWrite:false,roughness:.2});windowPane.castShadow=false;
  const e=planet(root,[-18,-58,-147],.92);spaceLights(root);
  // A window with an uninterrupted view gives these people a world to protect.
  box(root,[10,.22,.4],[0,3.5,-4.1],0x829695);box(root,[10,.4,.4],[0,.75,-4.1],0x829695);
  for(const x of [-4.7,-2.5,2.5,4.7])box(root,[.15,2.7,.3],[x,2.15,-4.12],0x819593);
  // Remove the wall's visual center by moving its back slab: the viewport sits in front of it.
  const table=box(root,[5.3,.15,2],[0,.9,.1],0x4a6569);box(root,[3.8,.8,1.3],[0,.4,.1],0x243e48);
  const directors=['director2','director','director3'].map((id,i)=>{const a=makeActor(id,'director',1);a.root.position.set(-1.7+i*1.7,0,-1.4);root.add(a.root);return a;});
  const zhang=makeActor();zhang.root.position.set(-2.8,0,1.65);zhang.root.rotation.y=2.8;root.add(zhang.root);
  for(let i=0;i<3;i++){
    box(root,[.8,.045,.5],[-1.7+i*1.7,1.01,-.3],0x0f2b36);
    box(root,[.65,.01,.3],[-1.7+i*1.7,1.04,-.3],0x529b9a,{emissive:0x417d85,emissiveIntensity:.5});
  }
  label(root,'恒星际推进   /   暂缓',[3.2,2.1,-4.21],2.8,'#d2b786','#1c3e48',29);
  ambient(root,0xb0c5ba,.32);areaKey(root,0xc1e1d7,30,[1,3.7,2],[0,1,-1],1);light(root,0xf1c79b,8,[-3,2,0]);
  batch(root);return {root,directors,zhang,earth:e};
}

export function createBase(){
  const root=new THREE.Group();root.name='空的舱室';roomShell(root,5.5,8,2.8,0x243c44,0x22353a);
  box(root,[1.25,.45,2.8],[-1.55,.3,-1.2],0x395861);box(root,[1.2,.2,2.7],[-1.55,.62,-1.2],0xa0b0a1);
  box(root,[1.1,.11,.55],[-1.55,.78,-2.1],0xc1c6ad);
  box(root,[1.1,.06,2],[-1.55,.75,-.65],0x43575a);
  const beacon=box(root,[.24,.13,.35],[-1.5,.87,-1.2],0x8a9e90,{},true);
  const led=box(root,[.07,.02,.07],[-1.5,.945,-1.16],0x8bcebb,{emissive:0x83d6bc,emissiveIntensity:2},true);
  box(root,[1.6,2.3,.15],[.75,1.2,-3.87],0x0b1c26);for(const x of [-.1,1.6])box(root,[.08,2.5,.16],[x,1.3,-3.7],0x789693);
  box(root,[1.8,.09,.17],[.75,2.55,-3.7],0x6daba8,{emissive:0x6daba8,emissiveIntensity:.6});
  label(root,'章北海  /  定位在线',[-1.55,1.85,-3.82],1.7,'#9fbcad','#284047',24);
  ambient(root,0x6e9eac,.45);areaKey(root,0x9bc5c3,12,[-2,2.65,-1],[-1,0,-1],.9);light(root,0xd1b383,5,[1,2,-3]);
  batch(root);return {root,beacon,led};
}

export function createPhoto(){
  const root=new THREE.Group();root.name='最后的合影';stars(root,28);const earth=planet(root,[-66,-61,-180],1.2);const key=spaceLights(root);
  const wheel=station(root,[0,5,-19],1.8);wheel.rotation.y=.05;
  // The station's local airlock is octagonal, with a sliding double hatch.
  const gate=new THREE.Group();gate.position.set(6,1,-6);root.add(gate);
  const frame=buildVoxelGeometry({size:[20,24,3],at(x,y,z){const cut=(x<3&&y<3)||(x>16&&y<3)||(x<3&&y>20)||(x>16&&y>20);if(cut)return null;return x<2||x>17||y<2||y>21?0x95aca8:null;}},{voxel:.18});
  gate.add(new THREE.Mesh(frame,voxelMaterial({metalness:.5})));
  const hatchL=box(gate,[1.6,3.6,.25],[-.8,0,0],0x485f64,{},true),hatchR=box(gate,[1.6,3.6,.25],[.8,0,0],0x485f64,{},true);
  const led=box(gate,[.3,.1,.04],[0,2.3,.24],0x7fbba1,{emissive:0x7fbba1,emissiveIntensity:1.4},true);
  const crew=[];const ids=['director2','director','director3'];
  // The front three are people we have already met. The rest form four irregular rows.
  for(let i=0;i<27;i++){
    const identity=i<3?ids[i]:i%4===0?'director2':'crew';const a=makeActor(identity,'suit',i<3?1:0);
    const row=i<3?0:1+Math.floor((i-3)/8),col=i<3?i-1:(i-3)%8-3.5;
    a.base=new THREE.Vector3(col*(i<3?1.65:1.3),1.35+row*1.6,-row*.8);
    a.root.position.copy(a.base);a.visor(false);root.add(a.root);crew.push(a);
  }
  const photographer=makeActor('crew','suit');photographer.root.position.set(3.5,1.1,7);photographer.root.rotation.y=Math.PI+.2;root.add(photographer.root);
  const camGeo=voxelModel({palette:{'#':0x2b484f,g:0x87aaa2},layers:[['.###.','##g##','#####'],['.###.','##g##','#####'],['.###.','##g##','#####']],axis:'z',voxel:.65});
  const cam=new THREE.Mesh(camGeo,voxelMaterial({metalness:.5}));cam.position.set(0,1,1);photographer.anchors.handR.add(cam);
  const gasMat=material(0xcbe4d7,{transparent:true,opacity:.34,depthWrite:false,roughness:1,emissive:0x99bdb2,emissiveIntensity:.23});
  const gas=new THREE.InstancedMesh(unit,gasMat,160);root.add(gas);
  const gasData=Array.from({length:160},(_,i)=>({a:hash(i*3)*6.28,b:hash(i*13)*2-1,s:.02+hash(i*29)*.08,v:.3+hash(i*17)*1.8}));
  const sun=sunSprite(root);sun.position.set(15,7,-200);sun.scale.set(35,35,1);
  batch(root,false);return {root,earth,wheel,gate,hatchL,hatchR,led,crew,photographer,gas,gasData,sun,key};
}

export function createAirlock(){
  const root=new THREE.Group();root.name='救援';roomShell(root,6,9,3.4,0x324f53,0x516760);
  for(const x of [-2.8,2.8]){box(root,[.15,.15,8],[x,1.15,0],0x98aaa0);box(root,[.04,.03,7.8],[x,2.7,0],0xb8d8c3,{emissive:0x84bdad,emissiveIntensity:1});}
  box(root,[2.6,2.8,.25],[0,1.4,-4.35],0x102c37);
  for(const x of [-1.4,1.4])box(root,[.2,3,.45],[x,1.5,-4.2],0x8da79e);
  box(root,[3,.22,.45],[0,3,-4.2],0x98aaa0);
  const victim=makeActor('director','suit',1);victim.root.position.set(.65,.55,.25);victim.root.rotation.z=1.35;root.add(victim.root);victim.expression('down');victim.damage(true);
  const rescuer=makeActor('crew','suit');rescuer.root.position.set(.8,.05,0);root.add(rescuer.root);rescuer.expression('shock');
  const other=makeActor('director2','suit',1);other.root.position.set(-1.5,.1,-2.3);other.root.rotation.z=-1.4;root.add(other.root);other.expression('down');
  const warning=light(root,0xe76443,12,[-2,2.7,-1]);
  for(const x of [-2,2])box(root,[.35,.15,.3],[x,3,-1],0xf19b68,{emissive:0xf16f46,emissiveIntensity:1.4});
  label(root,'急 救  /  保 持 气 密',[0,3.19,-4.08],2.3,'#c2c6a1','#25414b',31);
  ambient(root,0x8cb7b0,.55);areaKey(root,0xb5dac8,25,[0,3.2,2],[0,0,-1],1.2);batch(root);return {root,victim,rescuer,other,warning};
}

export function makeWorlds(scene){
  const worlds={courtyard:createCourtyard(),collection:createCollection(),workshop:createWorkshop(),basement:createBasement(),elevator:createElevator(),council:createCouncil(),base:createBase(),orbit:createOrbit(),photo:createPhoto(),airlock:createAirlock()};
  Object.values(worlds).forEach(w=>{w.root.visible=false;scene.add(w.root);});
  return worlds;
}
