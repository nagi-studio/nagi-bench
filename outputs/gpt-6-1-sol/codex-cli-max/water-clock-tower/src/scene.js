import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const GOLD = '#bc985e', AQUA = '#76b9bd';
const Y = new T.Vector3(0,1,0), Z = new T.Vector3(0,0,1);
const v = (x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const material = (color,metalness=.5,roughness=.4,extra={})=>new T.MeshStandardMaterial({color,metalness,roughness,...extra});
const mats = {
  brass:material('#b69762',.76,.3),edge:material('#dfc28a',.7,.25),bronze:material('#5c756d',.72,.39),
  copper:material('#a36643',.7,.36),wood:material('#4d3427',.12,.69),woodLight:material('#8c6541',.15,.58),
  dark:material('#263b3c',.65,.47),black:material('#172c2f',.4,.6),stone:material('#24383a',.18,.76),
  blue:material('#68afb3',.47,.19,{emissive:'#1e646c',emissiveIntensity:.24}),ivory:material('#e1ceb0',.1,.55),red:material('#863f30',.22,.58),
  globe:material('#153c43',.65,.3),ink:material('#355e5e',.45,.6),star:material('#f1dba2',.6,.22,{emissive:'#a78246',emissiveIntensity:.25})
};
const boxGeo = new T.BoxGeometry(1,1,1), ballGeo = new T.SphereGeometry(1,16,10);
// Static architecture and each rigid rotor are merged by material, keeping the
// procedural model detailed without hundreds of draw calls.
class Builder {
  constructor(){this.parts=new Map();this.group=new T.Group();}
  part(geo,mat,position=[0,0,0],scale=[1,1,1],rotation=[0,0,0]){
    const q=new T.Quaternion().setFromEuler(new T.Euler(...rotation));
    const g=geo.clone().applyMatrix4(new T.Matrix4().compose(v(...position),q,v(...scale)));
    if(!this.parts.has(mat))this.parts.set(mat,[]);this.parts.get(mat).push(g);return this;
  }
  box(pos,size,mat='brass',rot=[0,0,0]){return this.part(boxGeo,mats[mat],pos,size,rot);}
  ball(pos,r,mat='brass'){return this.part(ballGeo,mats[mat],pos,[r,r,r]);}
  cyl(pos,r,h,mat='brass',axis='y',rt=r){return this.part(new T.CylinderGeometry(rt,r,h,32),mats[mat],pos,[1,1,1],axis==='z'?[Math.PI/2,0,0]:[0,0,0]);}
  ring(pos,r,t,mat='brass',rot=[0,0,0]){return this.part(new T.TorusGeometry(r,t,8,72),mats[mat],pos,[1,1,1],rot);}
  rod(a,b,r=.025,mat='brass'){
    const aa=v(...a),bb=v(...b),d=bb.clone().sub(aa),q=new T.Quaternion().setFromUnitVectors(Y,d.clone().normalize());
    const g=new T.CylinderGeometry(r,r,d.length(),8).applyMatrix4(new T.Matrix4().compose(aa.add(bb).multiplyScalar(.5),q,v(1,1,1)));
    if(!this.parts.has(mats[mat]))this.parts.set(mats[mat],[]);this.parts.get(mats[mat]).push(g);return this;
  }
  finish(){for(const [mat,gs] of this.parts){const compatible=gs.map(g=>g.index?g.toNonIndexed():g);const merged=mergeGeometries(compatible,false);if(!merged)continue;const mesh=new T.Mesh(merged,mat);mesh.castShadow=true;mesh.receiveShadow=true;this.group.add(mesh);gs.forEach(g=>g.dispose());compatible.forEach(g=>g.dispose());}this.parts.clear();return this.group;}
}

function gear(b,r,teeth=24,axis='z',thickness=.12,mat='brass'){
  b.cyl([0,0,0],r*.85,thickness,mat,axis);
  b.cyl([0,0,axis==='z'?.07:0],r*.25,thickness*2,'dark',axis);
  if(axis==='z'){
    b.ring([0,0,thickness*.55],r*.66,.018,'edge');
    for(let i=0;i<teeth;i++){const a=i/teeth*Math.PI*2;b.box([Math.cos(a)*r*.92,Math.sin(a)*r*.92,0],[r*.18,r*.13,thickness],mat,[0,0,a]);}
    for(let i=0;i<6;i++){const a=i*Math.PI/3;b.ball([r*.52*Math.cos(a),r*.52*Math.sin(a),.075],.025,'black');}
  }else{
    b.ring([0,thickness*.55,0],r*.67,.015,'edge',[Math.PI/2,0,0]);
    for(let i=0;i<teeth;i++){const a=i/teeth*Math.PI*2;b.box([Math.cos(a)*r*.92,0,Math.sin(a)*r*.92],[r*.18,thickness,r*.13],mat,[0,-a,0]);}
  }
}
function puppet(b,x,y,z,sign=false,small=false){
  const s=small?.73:1;
  b.cyl([x,y+s*.21,z],s*.13,s*.40,'red','y',s*.07);
  b.ball([x,y+s*.51,z],s*.09,'woodLight');b.box([x,y+s*.59,z],[s*.25,s*.045,s*.15],'black');
  b.box([x,y+s*.34,z+s*.13],[s*.29,s*.05,s*.06],'woodLight');
  if(sign){b.box([x,y+s*.30,z+s*.21],[s*.22,s*.28,s*.035],'ivory');b.box([x,y+s*.30,z+s*.233],[s*.1,s*.014,s*.008],'red');b.box([x,y+s*.35,z+s*.233],[s*.014,s*.12,s*.008],'red');}
}
function roof(b,y,w,d,cx=.55,cz=.2){
  // Swept eave profile, entirely generated geometry.
  for(const side of [-1,1]){
    const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(side*w*.43,-.25);shape.quadraticCurveTo(side*w*.54,-.3,side*w*.57,-.12);shape.lineTo(side*w*.55,-.38);shape.lineTo(0,-.13);shape.closePath();
    const g=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false,steps:1});
    b.part(g,mats.bronze,[cx,y,cz-d/2]);
    for(let zz=cz-d/2;zz<=cz+d/2+.001;zz+=.17)b.rod([cx,y+.015,zz],[cx+side*w*.53,y-.24,zz],.012,'brass');
  }
  b.cyl([cx,y+.02,cz],.045,d+.2,'brass','z');
  b.ball([cx,y+.13,cz-d/2],.065,'brass');b.ball([cx,y+.13,cz+d/2],.065,'brass');
}
function textTexture(text,size=128,color='#d6c197',background=null){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=size;
  const c=canvas.getContext('2d');if(background){c.fillStyle=background;c.fillRect(0,0,512,size);}c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.font=`${size*.48}px "Noto Serif CJK SC",serif`;c.fillText(text,256,size/2);
  const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;return t;
}

export class Exhibition {
  constructor(canvas){
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.4));this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.35;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.scene=new T.Scene();this.scene.background=new T.Color('#101e23');this.scene.fog=new T.FogExp2('#101e23',.018);
    this.camera=new T.PerspectiveCamera(32,1,.1,100);this.camera.position.set(12,8,17);
    this.scene.add(new T.HemisphereLight('#b9d9d6','#292113',2));
    const key=new T.DirectionalLight('#ffe0ac',4.0);key.position.set(-3,11,8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-7,right:7,top:11,bottom:-4,near:.5,far:30});key.shadow.bias=-.001;key.shadow.normalBias=.025;this.scene.add(key);
    const rim=new T.DirectionalLight('#6bc7d4',2.8);rim.position.set(3,7,-5);this.scene.add(rim);
    const fill=new T.DirectionalLight('#b0cdd5',1);fill.position.set(6,4,10);this.scene.add(fill);
    const floor=new T.Mesh(new T.PlaneGeometry(200,200),material('#15272c',.25,.82));floor.rotation.x=-Math.PI/2;floor.position.y=-.28;floor.receiveShadow=true;this.scene.add(floor);
    this.dynamic={};this.waterFills=[];this.makeArchitecture();this.makeMechanisms();this.makeBackdrop();
    this.dropMesh=new T.InstancedMesh(new T.SphereGeometry(.045,7,5),mats.blue,220);this.dropMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);this.dropMesh.castShadow=false;this.dropMesh.frustumCulled=false;this.scene.add(this.dropMesh);
    this.dummy=new T.Object3D();this.target=v();this.resize();
    this.labels=[
      {name:'平水壶',detail:'溢流稳定水位',pos:[-2.8,4.62,.4],side:'left',stages:[0,1]},
      {name:'受水斗',detail:'蓄水 · 增重',pos:[-.65,3.05,.9],side:'right',stages:[1,2]},
      {name:'枢轮',detail:'水的重量提供动力',pos:[-2.6,1.35,1],side:'left',stages:[0,1]},
      {name:'衡杆与止轮机构',detail:'够重才放行一步',pos:[.55,3.15,1.5],side:'right',stages:[2]},
      {name:'传动齿轮',detail:'逐级传递转动',pos:[.75,2.0,1.4],side:'right',stages:[3]},
      {name:'天柱',detail:'把转动传向上方',pos:[.36,4.15,.65],side:'left',stages:[3]},
      {name:'浑象',detail:'模拟星空每日转动',pos:[1.1,4.95,.85],side:'right',stages:[0,3]},
      {name:'浑仪',detail:'观测日月星辰',pos:[1.45,7.38,.65],side:'right',stages:[0,3]},
      {name:'报时木偶',detail:'拨牙触发 · 敲钟报时',pos:[3.05,2.65,1.45],side:'right',stages:[0,4]},
      {name:'拨轮',detail:'把转动变成抬槌',pos:[2.44,1.75,1.56],side:'right',stages:[4]},
    ];
    for(const l of this.labels){l.el=document.createElement('div');l.el.className=`world-label ${l.side==='left'?'left':''}`;l.el.innerHTML=`<span class="label-dot"></span><span class="label-line"></span><span class="label-name">${l.name}<small>${l.detail}</small></span>`;document.querySelector('#labels').append(l.el);}
    this.causal=document.createElementNS('http://www.w3.org/2000/svg','svg');this.causal.classList.add('causal-overlay');
    this.causal.innerHTML='<defs><marker id="flow-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 6 4 1 7" fill="none" stroke="#ddc38d" stroke-width="1.2"/></marker></defs><path id="flow-path" fill="none" stroke="#d6bb81" stroke-width="1.3" stroke-dasharray="3 4" marker-end="url(#flow-arrow)" opacity=".7"/>';
    document.querySelector('#labels').prepend(this.causal);this.flowPath=this.causal.querySelector('#flow-path');
  }
  makeArchitecture(){
    const b=new Builder();
    b.cyl([0,-.12,.2],5.2,.28,'black','y');b.cyl([0,.015,.2],5.06,.08,'bronze','y');b.cyl([0,.08,.2],4.95,.09,'stone','y');
    b.ring([0,.14,.2],4.92,.014,'brass',[Math.PI/2,0,0]);b.ring([0,.135,.2],4.62,.007,'brass',[Math.PI/2,0,0]);
    for(let i=0;i<96;i++){const a=i*Math.PI/48,r=4.81;b.box([r*Math.cos(a),.145,.2+r*Math.sin(a)],[.01,.005,i%4===0?.13:.055],'brass',[0,Math.PI/2-a,0]);}
    // A cutaway timber frame: rear columns remain visible, the front opens up.
    const cx=.45;for(const x of [-1.2,2.05])for(const z of [-.8,.38]){
      if(z>.3&&x<0)continue;
      b.cyl([x,.35,z],.17,.35,'dark');b.cyl([x,3.30,z],.075,5.7,'wood');
      for(const y of [.6,3.58,5.96]){b.box([x,y,z],[.22,.12,.24],'brass');b.cyl([x,y-.1,z],.10,.12,'dark');}
    }
    for(const y of [.45,3.62,6.08]){
      b.box([cx,y,-.18],[3.55,.17,2.35],'wood');b.box([cx,y+.095,-.18],[3.67,.035,2.43],'woodLight');
      b.box([cx,y+.12,1.04],[3.66,.023,.027],'brass');
      for(let x=-1.25;x<2.2;x+=.18)b.box([x,y+.12,-.18],[.011,.006,2.3],'dark');
      if(y>1)for(const x of [-1.19,2.07])b.rod([x,y-.12,-.65],[x+(x<0?.43:-.43),y-.58,-.65],.052,'wood');
    }
    // The upper platform has railings at the back so the instrument stays clear.
    for(const yy of [3.8,6.25]){
      for(let x=-1.15;x<=2.11;x+=.38)b.box([x,yy+.18,-1.23],[.035,.4,.035],'woodLight');
      b.box([.45,yy+.4,-1.23],[3.45,.05,.06],'woodLight');b.box([.45,yy+.17,-1.23],[3.45,.025,.025],'brass');
    }
    roof(b,6.42,3.35,.75,.45,-.8);
    // Reservoir, overflow rim and a real open flume.
    const tank=[-2.75,4.19,-.18];b.cyl(tank,.59,.77,'copper','y',.7);b.ring([-2.75,4.59,-.18],.70,.045,'edge',[Math.PI/2,0,0]);
    b.cyl([-2.75,4.48,-.18],.64,.017,'blue');b.cyl([-2.75,3.77,-.18],.62,.07,'dark');
    for(const x of [-3.1,-2.42])b.box([x,2.08,-.3],[.075,3.37,.075],'wood');
    b.rod([-3.14,1.2,-.3],[-2.37,3.6,-.3],.035,'woodLight');
    b.box([-1.79,4.22,.65],[2.02,.055,.23],'copper');
    b.box([-1.79,4.29,.51],[2.02,.16,.035],'brass');b.box([-1.79,4.29,.79],[2.02,.16,.035],'brass');
    b.box([-1.79,4.255,.65],[2.0,.008,.20],'blue');
    b.box([-2.75,4.22,.29],[.23,.06,.9],'copper');b.box([-2.75,4.258,.29],[.19,.012,.9],'blue');
    b.cyl([-.795,4.17,.65],.075,.14,'copper');
    // Overflow path is open and visible next to the tank.
    b.rod([-3.34,4.46,-.18],[-3.61,4.46,-.18],.075,'copper');b.rod([-3.61,4.46,-.18],[-3.61,3.9,-.18],.052,'blue');
    // Wheel axle posts, bearings, and the receiving trough.
    for(const z of [.18,1.06]){b.box([-1.8,.93,z],[.14,1.72,.14],'wood');b.box([-1.8,1.85,z],[.28,.22,.23],'dark');b.ring([-1.8,1.85,z+.13],.10,.023,'brass');}
    b.box([-1.95,.24,.65],[3.25,.15,1.12],'dark');b.box([-1.95,.325,.65],[3.07,.018,.90],'blue');
    for(const z of [.05,1.25])b.box([-1.95,.40,z],[3.4,.24,.07],'bronze');
    // Bearing blocks around the vertical shaft.
    for(const yy of [2.45,3.78,5.97]){b.box([.36,yy,.65],[.31,.12,.31],'dark');b.ring([.36,yy+.07,.65],.11,.025,'brass',[Math.PI/2,0,0]);}
    b.box([-.03,2.94,1.25],[.10,.47,.12],'dark');b.box([.55,3.12,1.20],[.10,.47,.12],'dark');
    // Bell pavilion and reporting deck.
    b.box([2.49,.61,.65],[2.1,.16,1.7],'wood');b.box([2.49,.71,.65],[2.18,.04,1.78],'brass');
    for(const x of [1.72,3.37]){b.box([x,1.72,.18],[.08,2.0,.08],'wood');b.box([x,2.80,1.39],[.065,.50,.065],'woodLight');}
    b.box([2.55,2.98,1.39],[2.1,.08,.10],'woodLight');b.rod([3.08,2.98,1.41],[3.08,2.82,1.41],.019,'brass');
    puppet(b,2.14,1.83,1.34,false,false);
    b.cyl([3.17,1.06,.45],.26,.23,'red','z');b.cyl([3.17,1.06,.58],.27,.02,'ivory','z');b.ring([3.17,1.06,.6],.25,.02,'brass');
    // Small bronze name plaque on the plinth.
    b.box([.2,.29,3.62],[2.0,.035,.57],'dark',[.28,0,0]);
    this.scene.add(b.finish());
    const plaque=new T.Mesh(new T.PlaneGeometry(1.80,.44),new T.MeshBasicMaterial({map:textTexture('水 运 仪 象 台',128,'#bda77c'),transparent:true,depthWrite:false}));plaque.rotation.x=-Math.PI/2+.28;plaque.position.set(.2,.34,3.61);this.scene.add(plaque);
  }
  makeMechanisms(){
    // Pivot-local geometry. Only sync() copies the solver's rigid transforms.
    const wheel=new Builder();
    wheel.ring([0,0,0],1.30,.055,'woodLight');wheel.ring([0,0,.10],1.29,.022,'brass');wheel.ring([0,0,-.17],1.29,.035,'wood');
    wheel.cyl([0,0,.2],.15,.96,'brass','z');wheel.cyl([0,0,.47],.08,.16,'edge','z');
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6+Math.PI/4,xx=1.42*Math.cos(a),yy=1.42*Math.sin(a);
      wheel.rod([.17*Math.cos(a),.17*Math.sin(a),0],[1.32*Math.cos(a),1.32*Math.sin(a),0],.037,'woodLight');
      wheel.rod([.19*Math.cos(a),.19*Math.sin(a),.04],[1.26*Math.cos(a),1.26*Math.sin(a),.04],.011,'brass');
      // A scoop is an open cup, with its water volume represented separately.
      const g=new T.LatheGeometry([new T.Vector2(.001,-.10),new T.Vector2(.09,-.10),new T.Vector2(.18,.07),new T.Vector2(.18,.12),new T.Vector2(.155,.12),new T.Vector2(.07,-.065),new T.Vector2(.001,-.065)],16);
      wheel.part(g,mats.copper,[xx,yy,0],[1,1,1],[0,0,a-Math.PI/2]);
      const fill=new T.Mesh(new T.SphereGeometry(.115,10,7),mats.blue.clone());fill.scale.set(1,.4,1);fill.position.set(xx,yy,0);fill.material.transparent=true;fill.material.opacity=0;wheel.group.add(fill);this.waterFills.push(fill);
      wheel.ball([1.22*Math.cos(a),1.22*Math.sin(a),.08],.025,'edge');
    }
    const pinion=new Builder();gear(pinion,.42,20);const pin=pinion.finish();pin.position.z=.52;wheel.group.add(pin);
    this.addDynamic('wheel',wheel.finish());
    for(const name of ['gearB','gearC']){const b=new Builder();gear(b,.58,28);b.cyl([0,0,name==='gearC'?-.24:.10],.065,name==='gearC'?.88:.28,'copper','z');this.addDynamic(name,b.finish());}
    const shaft=new Builder();shaft.cyl([0,.3,0],.047,5.35,'brass');shaft.cyl([0,-1.64,0],.16,.14,'brass');
    for(const yy of [-1.65,-2.34]){const bg=new Builder();gear(bg,.30,18,'y');const g=bg.finish();g.position.y=yy;shaft.group.add(g);}for(let y=-1.3;y<2.6;y+=.48)shaft.cyl([0,y,0],.065,.045,'dark');
    // The bottom bevel and reporting gear are part of this single rigid shaft.
    shaft.cyl([0,-1.64,0],.30,.10,'bronze');
    this.addDynamic('shaft',shaft.finish());
    const globe=new Builder();globe.ball([0,0,0],.71,'globe');
    for(let i=0;i<8;i++)globe.ring([0,0,0],.718,.006,'brass',[0,i*Math.PI/8,0]);
    for(let i=-2;i<=2;i++){const yy=i*.22,rr=Math.sqrt(.718*.718-yy*yy);globe.ring([0,yy,0],rr,.007,'brass',[Math.PI/2,0,0]);}
    for(let i=0;i<65;i++){const yy=1-2*(i+.5)/65,ang=i*2.399963,rr=Math.sqrt(1-yy*yy);globe.ball([.726*rr*Math.cos(ang),.726*yy,.726*rr*Math.sin(ang)],i%8===0?.022:.012,'star');}
    globe.cyl([0,.0,0],.026,1.75,'edge');this.addDynamic('globe',globe.finish());
    const globeStand=new Builder();globeStand.ring([.36,4.91,.65],.83,.027,'bronze',[0,0,.25]);globeStand.ring([.36,4.91,.65],.83,.018,'brass',[Math.PI/2,0,0]);globeStand.cyl([.36,4.13,.65],.29,.12,'bronze');globeStand.cyl([.36,3.95,.65],.06,.35,'brass');this.scene.add(globeStand.finish());
    const sky=new Builder();sky.ring([0,0,0],.94,.026,'brass');sky.ring([0,0,0],.81,.023,'edge',[Math.PI/2,0,.35]);sky.ring([0,0,0],.89,.022,'copper',[0,Math.PI/2,.6]);sky.rod([0,-.97,0],[0,.97,0],.020,'brass');sky.ball([0,0,0],.07,'edge');sky.rod([-.78,-.16,0],[.78,.16,0],.022,'edge');
    for(let i=0;i<72;i++){const a=i*Math.PI/36;sky.rod([.91*Math.cos(a),.91*Math.sin(a),0],[.95*Math.cos(a),.95*Math.sin(a),0],i%6===0?.012:.006,'edge');}
    this.addDynamic('sky',sky.finish());
    const ss=new Builder();ss.ring([.36,7.16,.65],1.08,.032,'bronze',[Math.PI/2,0,0]);ss.ring([.36,7.16,.65],1.04,.032,'bronze',[0,0,.4]);ss.cyl([.36,6.28,.65],.54,.12,'bronze');ss.cyl([.36,6.36,.65],.18,.2,'brass');for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])ss.rod([.36+.5*Math.cos(a),6.32,.65+.5*Math.sin(a)],[.36+.96*Math.cos(a),7.11,.65+.96*Math.sin(a)],.032,'woodLight');this.scene.add(ss.finish());
    const rg=new Builder();gear(rg,.54,26,'y',.11,'copper');this.addDynamic('reportGear',rg.finish());
    const carousel=new Builder();gear(carousel,.70,32,'y',.10);carousel.cyl([0,.36,0],.04,.8,'brass');carousel.cyl([0,.62,0],.15,.08,'copper');carousel.cyl([0,.14,0],.69,.10,'wood');carousel.ring([0,.2,0],.67,.018,'edge',[Math.PI/2,0,0]);
    for(let i=0;i<4;i++){const a=i*Math.PI/2,xx=.46*Math.cos(a),zz=.46*Math.sin(a);puppet(carousel,xx,.20,zz,true,true);carousel.cyl([xx,-.13,zz],.035,.2,'edge');}
    this.addDynamic('carousel',carousel.finish());
    const cam=new Builder();gear(cam,.31,16,'z',.07,'bronze');for(let i=0;i<4;i++){const a=i*Math.PI/2;cam.cyl([.31*Math.cos(a),.31*Math.sin(a),.065],.055,.14,'edge','z');}cam.cyl([0,0,-.35],.06,.96,'copper','z');this.addDynamic('cam',cam.finish());
    const balance=new Builder();balance.box([-.08,0,0],[1.55,.055,.055],'brass');balance.ball([0,0,.06],.06,'edge');balance.box([.54,-.09,0],[.24,.22,.19],'dark');balance.rod([-.72,0,0],[-.72,-.21,0],.018,'brass');balance.box([-.72,-.22,0],[.24,.025,.18],'brass');this.addDynamic('balance',balance.finish());
    const latch=new Builder();latch.box([-.65,.02,0],[1.30,.05,.05],'copper');latch.box([-1.30,-.12,0],[.045,.31,.07],'brass');latch.ball([0,0,.06],.055,'edge');this.addDynamic('latch',latch.finish());
    const arm=new Builder();arm.rod([0,0,0],[.78,0,0],.027,'woodLight');arm.box([.76,0,0],[.11,.16,.12],'dark');arm.ball([0,0,.02],.055,'brass');arm.rod([.30,0,-.02],[.30,-.36,-.02],.019,'brass');arm.ball([.30,-.36,-.02],.055,'dark');this.addDynamic('arm',arm.finish());
    const bell=new Builder();const profile=[new T.Vector2(0,-.03),new T.Vector2(.12,-.08),new T.Vector2(.17,-.21),new T.Vector2(.21,-.48),new T.Vector2(.30,-.59),new T.Vector2(.31,-.64),new T.Vector2(.26,-.66),new T.Vector2(.24,-.58),new T.Vector2(.16,-.24)];bell.part(new T.LatheGeometry(profile,32),mats.brass);bell.ring([0,-.60,0],.285,.018,'edge',[Math.PI/2,0,0]);for(const yy of [-.30,-.39])bell.ring([0,yy,0],.2+(Math.abs(yy)-.3)*.3,.008,'copper',[Math.PI/2,0,0]);bell.ring([0,-.005,0],.055,.019,'dark');this.addDynamic('bell',bell.finish());
  }
  addDynamic(name,group){this.dynamic[name]=group;this.scene.add(group);}
  makeBackdrop(){
    const pts=[];
    // Quiet astronomical drafting lines behind the exhibit.
    for(let i=-8;i<=8;i++){pts.push(-12,i*.7,-5,12,i*.7,-5);pts.push(i*.7,-4,-5,i*.7,13,-5);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts,3));const lines=new T.LineSegments(g,new T.LineBasicMaterial({color:'#427176',transparent:true,opacity:.075}));this.scene.add(lines);
    const bp=new Builder();for(let i=0;i<32;i++){const a=i*2.39996,r=4.5+Math.sin(i*7.31)*1.3;bp.ball([r*Math.cos(a),5+r*Math.sin(a),-4.9],.012,'ink');}this.scene.add(bp.finish());
  }
  resize(){this.width=innerWidth;this.height=innerHeight;this.camera.aspect=this.width/this.height;this.camera.updateProjectionMatrix();this.renderer.setSize(this.width,this.height,false);}
  sync(physics){
    this.physics=physics;
    for(const [name,rotor] of Object.entries(physics.rotors)){const group=this.dynamic[name];group.position.copy(rotor.body.position);group.quaternion.copy(rotor.body.quaternion);}
    for(let i=0;i<12;i++)this.waterFills[i].material.opacity=Math.min(.92,physics.buckets[i]*1.5);
    this.dropMesh.count=Math.min(220,physics.drops.length);
    for(let i=0;i<this.dropMesh.count;i++){const d=physics.drops[i];this.dummy.position.copy(d.body.position);this.dummy.quaternion.copy(d.body.quaternion);this.dummy.scale.set(.8,d.spill?1:1.5,.8);this.dummy.updateMatrix();this.dropMesh.setMatrixAt(i,this.dummy.matrix);}
    this.dropMesh.instanceMatrix.needsUpdate=true;
  }
  frame(time,stage){
    // Camera is the sole choreographed transform. No mechanism reads film time.
    const keys=[
      {t:0,p:[12,8.0,17.7],look:[-1.8,3.9,.2],fov:32},
      {t:3.8,p:[11.4,7.7,17.1],look:[-1.8,3.85,.25],fov:32},
      {t:6,p:[5.6,5.9,13.8],look:[-2.25,3.25,.5],fov:29},
      {t:9.6,p:[5.2,5.6,13.4],look:[-2.2,3.1,.5],fov:29},
      {t:12,p:[4.6,5.3,12.2],look:[-1.55,2.7,.65],fov:29},
      {t:16.3,p:[4.4,5.15,12.0],look:[-1.55,2.7,.65],fov:29},
      {t:18.5,p:[9.1,7.4,15.0],look:[-1.1,4.45,.45],fov:31},
      {t:21.9,p:[8.9,7.5,14.8],look:[-1.1,4.5,.45],fov:31},
      {t:24.0,p:[7.1,4.3,9.6],look:[-.30,2.3,.8],fov:29},
      {t:27.2,p:[6.9,4.2,9.5],look:[-.30,2.3,.8],fov:29},
      {t:29.8,p:[11.4,7.9,17.5],look:[-1.8,3.9,.2],fov:32},
      {t:32,p:[12,8.0,17.7],look:[-1.8,3.9,.2],fov:32}
    ];
    let a=keys[0],b=keys[keys.length-1];for(let i=0;i<keys.length-1;i++)if(time>=keys[i].t&&time<keys[i+1].t){a=keys[i];b=keys[i+1];break;}
    let f=T.MathUtils.clamp((time-a.t)/(b.t-a.t),0,1);f=f*f*(3-2*f);
    this.camera.position.copy(v(...a.p).lerp(v(...b.p),f));this.target.copy(v(...a.look).lerp(v(...b.look),f));this.camera.fov=T.MathUtils.lerp(a.fov,b.fov,f);
    if(this.width<600){
      // Portrait composition keeps the mechanism below the title and inside
      // the narrow viewport, with a dedicated lower-deck view for reporting.
      const mobile=stage===4?{look:[1.1,3.3,.8],offset:[7,3,16.5]}:(stage===1||stage===2)?{look:[-.25,4.45,.5],offset:[9,4.1,23]}:{look:[.0,5.5,.4],offset:[11.5,4.8,27]};
      this.target.copy(v(...mobile.look));this.camera.position.copy(this.target.clone().add(v(...mobile.offset)));this.camera.fov=38;
    }
    this.camera.lookAt(this.target);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
    for(const l of this.labels){const p=v(...l.pos).project(this.camera);l.el.style.left=`${(p.x*.5+.5)*this.width}px`;l.el.style.top=`${(-p.y*.5+.5)*this.height}px`;const visible=l.stages.includes(stage)&&p.z<1&&(p.x>-.25||this.width<600);l.el.style.opacity=visible?'1':'0';l.el.classList.toggle('active',stage!==0&&visible);}
    const balanceLabel=this.labels.find(l=>l.name==='衡杆与止轮机构');
    balanceLabel.el.querySelector('small').textContent=this.physics?.moving?'已松开 · 前进一步':'锁住 · 等待水斗够重';
    const reportLabel=this.labels.find(l=>l.name==='报时木偶');
    reportLabel.el.querySelector('small').textContent=this.physics?.time-this.physics?.lastStrike<.8?'钟声响起':'拨牙触发 · 敲钟报时';
    let flow=[];
    if(stage===1)flow=[[-.54,3.93,.75],[-.54,3.28,.75]];
    if(stage===2)for(let i=0;i<=15;i++){const a=2.40-i/15*Math.PI/6;flow.push([-1.8+1.73*Math.cos(a),1.85+1.73*Math.sin(a),.70]);}
    if(stage===3)flow=[[-1.8,1.85,1.43],[-.8,1.85,1.43],[.36,1.85,1.43],[.36,2.6,.75],[.36,3.4,.75],[.36,4.1,.75]];
    this.flowPath.setAttribute('d',flow.map((p,i)=>{const a=v(...p).project(this.camera);return `${i?'L':'M'}${(a.x*.5+.5)*this.width},${(-a.y*.5+.5)*this.height}`;}).join(' '));
    this.causal.style.opacity=flow.length?'1':'0';
    this.renderer.render(this.scene,this.camera);
  }
}
