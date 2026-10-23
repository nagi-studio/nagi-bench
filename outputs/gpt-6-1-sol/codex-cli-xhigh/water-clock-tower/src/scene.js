import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { WHEEL, PITCH } from './physics.js';

const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export class ClockScene {
  constructor(canvas) {
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));
    this.renderer.setClearColor('#0b2225');
    this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.22;
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.scene=new T.Scene();
    this.scene.fog=new T.FogExp2('#0b2225',.022);
    this.camera=new T.PerspectiveCamera(34,1,.1,100);
    this.scene.add(new T.HemisphereLight('#b8e1d5','#23332b',2.0));
    const key=new T.DirectionalLight('#ffe2af',3.3);key.position.set(-3,13,9);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=12;key.shadow.camera.bottom=-6;key.shadow.normalBias=.035;key.shadow.bias=-.0003;this.scene.add(key);
    const rim=new T.DirectionalLight('#85d2c8',2.4);rim.position.set(7,9,-7);this.scene.add(rim);
    const fill=new T.PointLight('#f1b56b',25,18,2);fill.position.set(-4,5,5);this.scene.add(fill);
    this.materials={
      bronze:new T.MeshStandardMaterial({color:'#ad844b',metalness:.78,roughness:.34}),
      gold:new T.MeshStandardMaterial({color:'#d7b876',metalness:.72,roughness:.3}),
      dark:new T.MeshStandardMaterial({color:'#1c3c39',metalness:.62,roughness:.48}),
      wood:new T.MeshStandardMaterial({color:'#5b3e2b',roughness:.67,metalness:.12}),
      woodlight:new T.MeshStandardMaterial({color:'#ad8050',roughness:.65,metalness:.1}),
      black:new T.MeshStandardMaterial({color:'#152a28',roughness:.7,metalness:.35}),
      stone:new T.MeshStandardMaterial({color:'#35504a',metalness:.18,roughness:.83}),
      water:new T.MeshStandardMaterial({color:'#80d8cf',emissive:'#1b655d',emissiveIntensity:.23,roughness:.17,metalness:.35}),
      ivory:new T.MeshStandardMaterial({color:'#d5cfab',roughness:.64,metalness:.15}),
    };
    this.materials.ghostWood=this.materials.wood.clone();this.materials.ghostWood.transparent=true;this.materials.ghostWood.opacity=.56;this.materials.ghostWood.depthWrite=false;
    this.materials.ghostGold=this.materials.gold.clone();this.materials.ghostGold.transparent=true;this.materials.ghostGold.opacity=.56;this.materials.ghostGold.depthWrite=false;
    this.static=new T.Group();this.scene.add(this.static);
    this.moving={};this.fluidFills=[];
    this.buildEnvironment();this.buildArchitecture();this.buildHydraulics();this.buildWheel();this.buildBalance();this.buildTransmission();this.buildAstronomy();this.buildClock();
    this.batch(this.static);
    for(const g of Object.values(this.moving))this.batch(g);
    // A single instanced draw for all falling and discharged water parcels.
    this.drops=new T.InstancedMesh(new T.SphereGeometry(.045,7,5),this.materials.water,160);
    this.drops.instanceMatrix.setUsage(T.DynamicDrawUsage);this.drops.frustumCulled=false;this.scene.add(this.drops);
    this.temp=new T.Object3D();
    this.resize();
  }
  mesh(parent,geo,mat,pos=[0,0,0],rot=[0,0,0]) {
    const m=new T.Mesh(geo,typeof mat==='string'?this.materials[mat]:mat);m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  box(p,s,mat,pos,rot){return this.mesh(p,new T.BoxGeometry(...s),mat,pos,rot);}
  cylinder(p,r,h,mat,pos,rot=[0,0,0],r2=r,n=24){return this.mesh(p,new T.CylinderGeometry(r,r2,h,n),mat,pos,rot);}
  sphere(p,r,mat,pos){return this.mesh(p,r<.045?new T.IcosahedronGeometry(r,0):new T.SphereGeometry(r,20,12),mat,pos);}
  ring(p,r,t,mat,pos=[0,0,0],rot=[0,0,0]){return this.mesh(p,new T.TorusGeometry(r,t,7,72),mat,pos,rot);}
  rod(p,a,b,r,mat){const va=V(...a),vb=V(...b),d=vb.clone().sub(va);const m=this.cylinder(p,r,d.length(),mat,va.clone().add(vb).multiplyScalar(.5).toArray(),[0,0,0],r,r<.06?8:16);m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return m;}
  group(name){const g=new T.Group();this.moving[name]=g;this.scene.add(g);return g;}
  batch(root){
    root.updateMatrixWorld(true);
    const buckets=new Map(),remove=[];
    const inv=root.matrixWorld.clone().invert();
    root.traverse(o=>{if(!o.isMesh||o.userData.keep)return;const key=o.material.uuid;if(!buckets.has(key))buckets.set(key,{mat:o.material,geos:[]});const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();if(!geo.getAttribute('normal'))geo.computeVertexNormals();if(!geo.getAttribute('uv'))geo.setAttribute('uv',new T.BufferAttribute(new Float32Array(geo.getAttribute('position').count*2),2));for(const attr of Object.keys(geo.attributes))if(!['position','normal','uv'].includes(attr))geo.deleteAttribute(attr);geo.applyMatrix4(inv.clone().multiply(o.matrixWorld));buckets.get(key).geos.push(geo);remove.push(o);});
    for(const o of remove){o.removeFromParent();o.geometry.dispose();}
    for(const {mat,geos}of buckets.values()){
      const merged=mergeGeometries(geos,false);for(const g of geos)g.dispose();
      if(merged){const m=new T.Mesh(merged,mat);m.castShadow=true;m.receiveShadow=true;root.add(m);}
    }
  }
  gear(parent,r,teeth,depth,pos,rot=[0,0,0],mat='bronze'){
    const shape=new T.Shape();
    for(let j=0;j<teeth*4;j++){const a=(j/(teeth*4))*Math.PI*2;const rr=r*(j%4===1||j%4===2?1:.89);const x=rr*Math.cos(a),y=rr*Math.sin(a);if(j===0)shape.moveTo(x,y);else shape.lineTo(x,y);}shape.closePath();
    const hole=new T.Path();hole.absarc(0,0,r*.67,0,Math.PI*2,true);shape.holes.push(hole);
    const geo=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.015,bevelThickness:.012});geo.translate(0,0,-depth/2);
    const g=new T.Group();g.position.set(...pos);g.rotation.set(...rot);parent.add(g);
    this.mesh(g,geo,mat);
    for(let i=0;i<6;i++){const a=i*Math.PI/3;this.rod(g,[0,0,0],[Math.cos(a)*r*.83,Math.sin(a)*r*.83,0],r*.047,mat);}
    this.cylinder(g,r*.19,depth+.1,'gold',[0,0,0],[Math.PI/2,0,0]);
    return g;
  }
  buildEnvironment(){
    this.cylinder(this.static,6.5,.17,'black',[.5,-.05,0],[0,0,0],6.6,96);
    this.cylinder(this.static,6.4,.06,'dark',[.5,.045,0],[0,0,0],6.4,96);
    for(const r of [5.75,5.82,6.15])this.ring(this.static,r,.009,'bronze',[.5,.083,0],[Math.PI/2,0,0]);
    for(let i=0;i<80;i++){const a=i*Math.PI/40;const r=6.0;this.box(this.static,[.012,.008,i%5===0?.16:.06],'bronze',[.5+Math.sin(a)*r,.084,Math.cos(a)*r],[0,a,0]);}
    const floor=new T.Mesh(new T.PlaneGeometry(300,300),new T.MeshStandardMaterial({color:'#0c2628',roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-.16;floor.receiveShadow=true;this.scene.add(floor);
    const positions=[];
    for(let i=0;i<210;i++){const a=i*2.39996;const r=16+(i%17)*.9;positions.push(Math.cos(a)*r,2+((i*71)%170)/10,Math.sin(a)*r-8);}
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    this.scene.add(new T.Points(geo,new T.PointsMaterial({color:'#a3bda7',size:.025,transparent:true,opacity:.35,sizeAttenuation:true})));
  }
  buildArchitecture(){
    const s=this.static;
    this.box(s,[7.8,.24,3.9],'wood', [.35,.29,0]);
    this.box(s,[7.95,.09,4.05],'bronze',[.35,.44,0]);
    this.box(s,[7.3,.08,3.55],'dark',[.35,.52,0]);
    for(const x of [-2.45,2.35])for(const z of [-1.3,1.25]){
      const wm=z>0?'ghostWood':'wood',gm=z>0?'ghostGold':'gold';
      this.box(s,[.24,6.85,.24],wm,[x,3.95,z]);
      this.box(s,[.34,.25,.34],gm,[x,.74,z]);
      for(const y of [4.8,7.15]){this.box(s,[.32,.18,.32],gm,[x,y,z]);this.box(s,[.49,.12,.43],wm,[x,y+.19,z]);this.box(s,[.64,.12,.49],wm,[x,y+.29,z]);}
    }
    for(const y of [4.88,7.28]){
      for(const z of [-1.3,1.25]){this.box(s,[5.15,.23,.25],z>0?'ghostWood':'wood',[ -.05,y,z]);this.box(s,[5.32,.055,.3],z>0?'ghostGold':'bronze',[-.05,y+.12,z]);}
      for(const x of [-2.45,2.35])this.box(s,[.28,.22,2.95],'wood',[x,y,0]);
      // Floor is open in the middle, keeping the mechanics visible.
      this.box(s,[4.65,.06,.42],'woodlight',[-.05,y+.14,-1.1]);
      for(const x of [-2.15,2.02])this.box(s,[.38,.06,2.5],'woodlight',[x,y+.14,0]);
    }
    for(const x of [-2.45,2.35]){
      for(const z of [-1.3,1.25])this.box(s,[.1,.54,.1],'bronze',[x,7.66,z]);
      this.rod(s,[x,7.9,-1.3],[x,7.9,1.25],.036,'gold');
    }
    for(let i=0;i<8;i++){
      const x=-2.45+i*4.8/7;
      this.rod(s,[x,7.45,-1.3],[x,7.86,-1.3],.022,'bronze');
    }
    this.rod(s,[-2.45,7.9,-1.3],[2.35,7.9,-1.3],.036,'gold');
    // Braces remain behind the cutaway, like an open museum reconstruction.
    this.rod(s,[-2.4,1.0,-1.3],[2.3,4.65,-1.3],.058,'wood');
    this.rod(s,[2.3,1,-1.3],[-2.4,4.65,-1.3],.058,'wood');
    for(const x of [-.25,1.2]){
      this.box(s,[.32,1.8,.36],'wood',[x,1.45,-.65]);
      this.box(s,[.47,.16,.5],'gold',[x,2.34,-.65]);
    }
    // Drain tray and its overflow channel.
    this.box(s,[4.35,.08,1.2],'bronze',[-.4,.63,.55]);
    for(const z of [-.08,1.18])this.box(s,[4.45,.16,.055],'dark',[-.4,.71,z]);
    this.box(s,[4.2,.015,1.12],'water',[-.4,.685,.55]);
  }
  buildHydraulics(){
    const s=this.static;
    for(const x of [-3.9,-2.8])for(const z of [-.1,.85]){
      this.box(s,[.13,4.4,.13],'wood',[x,2.75,z]);
      this.box(s,[.23,.15,.24],'gold',[x,4.88,z]);
    }
    const pos=[-3.35,5.01,.37];
    this.box(s,[1.45,.13,1.18],'bronze',pos);
    for(const z of [-.25,.99])this.box(s,[1.45,.67,.055],'bronze',[-3.35,5.32,z]);
    for(const x of [-4.08,-2.62])this.box(s,[.055,.67,1.25],'bronze',[x,5.32,.37]);
    this.box(s,[1.38,.015,1.13],'water',[-3.35,5.53,.37]);
    this.box(s,[1.56,.065,1.32],'gold',[-3.35,5.66,.37]);
    this.box(s,[1.37,.07,1.10],'water',[-3.35,5.7,.37]);
    // Spout and a visible level/overflow lip.
    this.rod(s,[-2.65,5.36,.55],[-1.63,5.36,.55],.083,'bronze');
    this.rod(s,[-1.63,5.36,.55],[-1.63,5.21,.55],.083,'gold');
    this.rod(s,[-4.08,5.53,.45],[-4.32,5.53,.45],.06,'gold');
    this.box(s,[.46,.08,.47],'dark',[-3.35,4.89,.37]);
    for(let i=0;i<5;i++)this.box(s,[.08,.015,.025],'gold',[-4.115,5.12+i*.1,1.027]);
    this.rod(s,[-3.7,6.65,-.25],[-3.7,5.83,-.25],.075,'bronze');
    this.box(s,[.8,.45,.7],'dark',[-3.7,6.75,-.25]);
    this.box(s,[.91,.08,.8],'gold',[-3.7,7,-.25]);
    this.rod(s,[-3.7,5.83,-.25],[-3.45,5.83,.15],.075,'bronze');
  }
  buildWheel(){
    const g=this.group('wheel');
    for(const z of [-.23,.23]){
      this.ring(g,1.73,.075,'wood',[0,0,z]);this.ring(g,1.83,.038,'gold',[0,0,z]);this.ring(g,1.64,.025,'bronze',[0,0,z]);
      for(let i=0;i<12;i++){
        const a=i*Math.PI/6;this.rod(g,[Math.cos(a)*.24,Math.sin(a)*.24,z],[Math.cos(a)*1.75,Math.sin(a)*1.75,z],.055,'woodlight');
        this.sphere(g,.038,'gold',[Math.cos(a)*1.73,Math.sin(a)*1.73,z+.055]);
      }
    }
    this.cylinder(g,.28,.75,'bronze',[0,0,0],[Math.PI/2,0,0]);
    this.cylinder(g,.12,1.8,'gold',[0,0,-.5],[Math.PI/2,0,0]);
    this.gear(g,.65,20,.15,[0,0,-1.17]);
    // Thirty-six rigidly mounted receiving cups, one for each tooth.
    for(let i=0;i<36;i++){
      const a=WHEEL.inlet+i*PITCH;
      const bucket=new T.Group();bucket.position.set(Math.cos(a)*WHEEL.r,Math.sin(a)*WHEEL.r,0);bucket.rotation.z=a-WHEEL.inlet;g.add(bucket);
      this.box(bucket,[.255,.035,.43],'bronze',[0,-.075,0]);
      for(const x of [-.135,.135])this.box(bucket,[.025,.16,.43],'gold',[x,-.01,0]);
      for(const z of [-.218,.218])this.box(bucket,[.29,.16,.025],'bronze',[0,-.01,z]);
      this.rod(g,[Math.cos(a)*1.7,Math.sin(a)*1.7,0],[Math.cos(a)*1.95,Math.sin(a)*1.95,0],.028,'bronze');
      const fill=this.box(bucket,[.22,.01,.36],'water',[0,-.04,0]);fill.userData.keep=true;fill.castShadow=false;this.fluidFills.push(fill);
    }
    // Ratchet teeth are part of this same rigid body.
    for(let i=0;i<36;i++){
      const a=i*PITCH;this.box(g,[.11,.045,.09],'gold',[Math.cos(a)*1.5,Math.sin(a)*1.5,.39],[0,0,a]);
    }
  }
  buildBalance(){
    const g=this.group('balance');
    this.box(g,[1.93,.09,.1],'gold',[.26,0,0]);
    this.cylinder(g,.12,.22,'bronze',[0,0,0],[Math.PI/2,0,0]);
    this.box(g,[.29,.34,.25],'dark',[-.68,-.1,0]);
    this.box(g,[.34,.06,.29],'gold',[-.68,.10,0]);
    this.rod(g,[.88,0,0],[1.02,.23,0],.044,'bronze');
    this.rod(g,[1.02,.23,0],[1.25,.23,0],.044,'gold');
    this.box(g,[.26,.07,.32],'gold',[.79,.15,-.28]);
    this.rod(this.static,[-2.28,3.4,1],[-2.28,4.04,1],.064,'wood');
    this.cylinder(this.static,.16,.1,'bronze',[-2.28,4.02,1.16],[Math.PI/2,0,0]);
  }
  buildTransmission(){
    const follower=this.group('follower');this.gear(follower,.8,24,.16,[0,0,0]);
    this.cylinder(follower,.1,1.28,'bronze',[0,0,.22],[Math.PI/2,0,0]);
    this.cylinder(follower,.13,.32,'gold',[0,0,.54],[Math.PI/2,0,0],.36);
    const idler=this.group('idler');this.gear(idler,.5,16,.16,[0,0,0]);
    const shaft=this.group('shaft');
    this.cylinder(shaft,.072,5.5,'gold',[0,-.05,0]);
    this.cylinder(shaft,.13,.32,'bronze',[0,-2.05,0],[0,0,0],.36);
    for(const y of [-2.25,.12,2.28]){
      this.gear(shaft,.42,16,.12,[0,y,0],[Math.PI/2,0,0]);
      this.cylinder(shaft,.14,.23,'bronze',[0,y,0]);
    }
    for(const y of [3.2,4.83,7.26]){
      this.box(this.static,[.36,.2,.36],'dark',[1.2,y,0]);
      this.ring(this.static,.145,.035,'gold',[1.2,y+.13,0],[Math.PI/2,0,0]);
    }
    for(const x of [2.5,3.65]){
      this.rod(this.static,[x,2.2,-1.0],[x,3.2,-1.0],.055,'wood');
      this.cylinder(this.static,.13,.45,'dark',[x,2.8,-.88],[Math.PI/2,0,0]);
    }
  }
  buildAstronomy(){
    const globe=this.group('globe');
    this.sphere(globe,.7,'dark',[0,0,0]);
    for(let i=0;i<7;i++)this.ring(globe,.71,.009,'gold',[0,0,0],[0,i*Math.PI/7,0]);
    for(const y of [-.5,-.3,0,.3,.5])this.ring(globe,Math.sqrt(.71**2-y*y),.009,'bronze',[0,y,0],[Math.PI/2,0,0]);
    const starPts=[];
    for(let i=0;i<68;i++){
      const y=1-2*(i+.5)/68,a=i*2.39996,r=Math.sqrt(1-y*y);const p=[.719*r*Math.cos(a),.719*y,.719*r*Math.sin(a)];this.sphere(globe,i%7===0?.027:.017,'ivory',p);starPts.push(p);
    }
    for(let i=0;i<12;i++)this.rod(globe,starPts[i*3],starPts[i*3+1],.005,'gold');
    this.cylinder(globe,.065,1.85,'gold',[0,0,0]);
    this.gear(globe,.58,22,.08,[0,-.87,0],[Math.PI/2,0,0]);
    this.ring(this.static,.83,.042,'bronze',[.2,6.03,0],[0,.18,0]);
    this.ring(this.static,.86,.022,'gold',[.2,6.03,0],[Math.PI/2,0,0]);
    for(const x of [-.68,1.08])this.rod(this.static,[x,5.05,0],[x,6.05,0],.04,'bronze');
    this.cylinder(this.static,.93,.12,'dark',[.2,5.13,0]);
    this.ring(this.static,.94,.025,'gold',[.2,5.19,0],[Math.PI/2,0,0]);

    const arm=this.group('armillary');
    this.ring(arm,1.02,.032,'gold',[0,0,0],[Math.PI/2,0,0]);
    this.ring(arm,.95,.028,'bronze');
    this.ring(arm,.95,.028,'bronze',[0,0,0],[0,Math.PI/2,0]);
    this.rod(arm,[0,-1.18,0],[0,1.18,0],.035,'gold');
    this.rod(arm,[-1.05,0,0],[1.05,0,0],.035,'gold');
    this.sphere(arm,.13,'ivory',[0,0,0]);
    for(let i=0;i<48;i++){
      const a=i*Math.PI/24;this.box(arm,[.026,i%4===0?.10:.04,.015],'ivory',[Math.cos(a)*1.025,0,Math.sin(a)*1.025],[0,-a,Math.PI/2]);
    }
    this.ring(this.static,1.20,.052,'bronze',[.2,8.65,0]);
    this.ring(this.static,1.27,.035,'gold',[.2,8.65,0],[Math.PI/2,0,0]);
    this.ring(this.static,1.31,.015,'bronze',[.2,8.65,0],[Math.PI/2,0,0]);
    for(let i=0;i<48;i++){
      const a=i*Math.PI/24;this.box(this.static,[.012,.012,i%4===0?.105:.045],'gold',[.2+Math.sin(a)*1.28,8.69,Math.cos(a)*1.28],[0,a,0]);
    }
    for(const x of [-.68,1.08])this.rod(this.static,[x,7.48,0],[x,8.1,0],.07,'bronze');
    this.cylinder(this.static,.85,.15,'dark',[.2,7.53,0]);
    this.cylinder(this.static,.62,.11,'gold',[.2,7.65,0]);
    // Drive gear below the polar bearing, attached to the rotating assembly.
    this.gear(arm,.49,20,.075,[0,-1.1,0],[Math.PI/2,0,0]);
    const polarFrame=new T.Group();for(const child of [...arm.children])polarFrame.add(child);polarFrame.rotation.x=.4;arm.add(polarFrame);
  }
  buildClock(){
    const s=this.static;
    const wheel=this.group('clock');this.gear(wheel,.65,20,.17,[0,0,0]);
    this.ring(wheel,.77,.035,'dark',[0,0,.64]);
    this.cylinder(wheel,.64,.16,'dark',[0,0,.64],[Math.PI/2,0,0]);
    this.ring(wheel,.63,.015,'gold',[0,0,.735]);
    for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;this.cylinder(wheel,.12,.19,'gold',[Math.cos(a)*.82,Math.sin(a)*.82,.64],[Math.PI/2,0,0]);}
    this.cylinder(wheel,.09,.85,'bronze',[0,0,.3],[Math.PI/2,0,0]);
    for(const x of [2.85,5.15])for(const z of [-.95,.85]){
      this.box(s,[.12,4.65,.12],z>0?'ghostWood':'wood',[x,2.85,z]);
      for(const y of [3.18,5.02])this.box(s,[.22,.12,.22],z>0?'ghostGold':'gold',[x,y,z]);
    }
    for(const y of [1.8,3.18,5.02]){
      this.box(s,[2.65,.15,2.05],'wood',[4,y,-.05]);
      this.box(s,[2.73,.05,2.13],'bronze',[4,y+.10,-.05]);
    }
    // Upturned tiled hip roof, constructed from geometry.
    const vertices=[],indices=[];
    for(let ring=0;ring<=9;ring++){
      const t=.045+ring*.106;const y=5.93-.91*t+.22*t**6;
      for(const [sx,sz]of [[-1,-1],[1,-1],[1,1],[-1,1]])vertices.push(4+sx*1.55*t,y,-.05+sz*1.21*t);
      if(ring>0)for(let k=0;k<4;k++){const a=(ring-1)*4+k,b=(ring-1)*4+(k+1)%4,c=ring*4+(k+1)%4,d=ring*4+k;indices.push(a,b,d,b,c,d);}
    }
    const rg=new T.BufferGeometry();rg.setAttribute('position',new T.Float32BufferAttribute(vertices,3));rg.setIndex(indices);rg.computeVertexNormals();this.mesh(s,rg,'dark');
    for(const [sx,sz]of [[-1,-1],[1,-1],[1,1],[-1,1]]){
      for(let j=0;j<8;j++){
        const t=j/8,t2=(j+1)/8;const point=t=>[4+sx*1.55*t,5.96-.91*t+.22*t**6,-.05+sz*1.21*t];this.rod(s,point(t),point(t2),.03,'gold');
      }
    }
    for(let j=-6;j<=6;j++){
      const x=4+j*.22;
      this.rod(s,[x,5.93-Math.abs(j*.22)/1.55*.91,-.05],[x,5.25,1.15],.014,'bronze');
    }
    this.sphere(s,.075,'gold',[4,5.98,-.05]);
    const drum=this.group('drum');
    this.cylinder(drum,.43,.2,'bronze',[0,-.18,0]);
    this.cylinder(drum,.075,1.25,'gold',[0,.1,0]);
    for(let i=0;i<4;i++){
      const a=i*Math.PI/2;const g=new T.Group();g.position.set(Math.sin(a)*.42,.05,Math.cos(a)*.42);g.rotation.y=a;drum.add(g);
      this.box(g,[.26,.46,.07],'wood',[0,.06,0]);
      this.box(g,[.28,.04,.09],'gold',[0,.30,0]);
      const tex=this.textTexture(['子正','卯正','午正','酉正'][i]);
      const face=this.mesh(g,new T.PlaneGeometry(.21,.38),new T.MeshBasicMaterial({map:tex}),[0,.06,.04]);face.userData.keep=true;
    }
    // Fixed wooden automaton; the hinged striking arm is driven by the cam.
    this.cylinder(s,.15,.5,'woodlight',[4.4,3.64,.02]);
    this.cylinder(s,.14,.36,'dark',[4.4,3.5,.02],[0,0,0],.21);
    this.sphere(s,.145,'woodlight',[4.4,3.97,.02]);
    this.sphere(s,.014,'black',[4.35,4,.155]);this.sphere(s,.014,'black',[4.45,4,.155]);
    this.cylinder(s,.18,.08,'dark',[4.4,4.09,.02]);
    this.box(s,[.2,.11,.16],'black',[4.4,4.16,.02]);
    this.rod(s,[4.32,3.35,.02],[4.30,3.24,.02],.05,'woodlight');
    this.rod(s,[4.48,3.35,.02],[4.50,3.24,.02],.05,'woodlight');
    const striker=this.group('striker');
    this.box(striker,[.96,.09,.1],'woodlight',[-.32,0,0]);
    this.rod(striker,[0,0,0],[.53,-.03,0],.036,'woodlight');
    this.cylinder(striker,.12,.21,'gold',[.52,-.03,0],[0,0,Math.PI/2]);
    this.sphere(striker,.075,'bronze',[-.76,0,0]);
    const slider=this.group('slider');this.cylinder(slider,.18,.16,'bronze',[0,0,0],[Math.PI/2,0,0]);this.ring(slider,.17,.018,'gold',[0,0,.09]);this.rod(slider,[0,0,0],[0,.20,0],.022,'gold');
    const bell=this.group('bell');
    const profile=[];for(let i=0;i<=16;i++){const t=i/16;profile.push(new T.Vector2(.08+.25*t**.7,-.08-.43*t));}
    this.mesh(bell,new T.LatheGeometry(profile,32),'gold');
    this.ring(bell,.33,.024,'bronze',[0,-.5,0],[Math.PI/2,0,0]);
    this.ring(bell,.08,.018,'bronze',[0,.015,0]);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;this.sphere(bell,.018,'bronze',[Math.sin(a)*.22,-.3,Math.cos(a)*.22]);}
    this.rod(s,[5.24,4.03,.02],[5.24,4.65,.02],.018,'bronze');
    this.rod(s,[4.8,4.65,.02],[5.37,4.65,.02],.04,'wood');
  }
  textTexture(text){
    const c=document.createElement('canvas');c.width=128;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#d3b279';ctx.fillRect(0,0,128,256);ctx.strokeStyle='#63472c';ctx.lineWidth=3;ctx.strokeRect(9,9,110,238);ctx.font='55px "Noto Serif CJK SC",serif';ctx.textAlign='center';ctx.fillStyle='#342b22';ctx.fillText(text[0],64,105);ctx.fillText(text[1],64,185);return new T.CanvasTexture(c);
  }
  sync(physics){
    for(const [name,group]of Object.entries(this.moving)){
      const b=physics.bodies[name];group.position.copy(b.position);group.quaternion.copy(b.quaternion);
    }
    for(let i=0;i<36;i++){
      const f=this.fluidFills[i];f.visible=physics.masses[i]>.002;f.scale.y=Math.min(10,1+physics.masses[i]*30);f.position.y=-.054+f.scale.y*.005;
    }
    const n=Math.min(physics.water.length,160);this.drops.count=n;
    for(let i=0;i<n;i++){
      const p=physics.water[i];this.temp.position.copy(p.body.position);this.temp.quaternion.copy(p.body.quaternion);this.temp.scale.set(.8,Math.min(2,1+Math.abs(p.body.velocity.y)*.13),.8);this.temp.updateMatrix();this.drops.setMatrixAt(i,this.temp.matrix);
    }
    this.drops.instanceMatrix.needsUpdate=true;
  }
  resize(){this.width=innerWidth;this.height=innerHeight;this.renderer.setSize(this.width,this.height);this.camera.aspect=this.width/this.height;this.camera.updateProjectionMatrix();}
  focus(chapter){const opacity=chapter===0||chapter===5?.68:.10;this.materials.ghostWood.opacity=opacity;this.materials.ghostGold.opacity=opacity;}
  cameraAt(position,target){
    const mobile=this.width<600;
    this.camera.fov=mobile?43:34;
    this.camera.position.set(...position);this.camera.lookAt(...target);
    if(mobile){this.camera.setViewOffset(this.width,this.height,-this.width*.015,-this.height*.10,this.width,this.height);}
    else this.camera.setViewOffset(this.width,this.height,-this.width*.145,-this.height*.012,this.width,this.height);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld(true);
  }
  project(point){const p=V(...point).project(this.camera);return {x:(p.x*.5+.5)*this.width,y:(-.5*p.y+.5)*this.height,z:p.z};}
  render(){this.renderer.render(this.scene,this.camera);}
}
