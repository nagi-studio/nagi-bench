import * as THREE from 'three';

export interface Region { name: string; x1: number; x2: number; z1: number; z2: number }
export const REGIONS: Region[] = [
  { name:'T SPAWN', x1:-10,x2:20,z1:28,z2:40 },
  { name:'T RAMP', x1:-10,x2:2,z1:12,z2:30 },
  { name:'OUTSIDE TUNNELS', x1:-32,x2:-8,z1:24,z2:34 },
  { name:'UPPER TUNNELS', x1:-36,x2:-24,z1:0,z2:28 },
  { name:'B SITE', x1:-40,x2:-18,z1:-34,z2:0 },
  { name:'LOWER TUNNELS', x1:-26,x2:-6,z1:8,z2:16 },
  { name:'MID', x1:-6,x2:8,z1:-20,z2:22 },
  { name:'CT SPAWN', x1:-18,x2:20,z1:-36,z2:-20 },
  { name:'B DOORS', x1:-26,x2:-16,z1:-30,z2:-20 },
  { name:'CATWALK', x1:6,x2:20,z1:6,z2:16 },
  { name:'SHORT A', x1:12,x2:20,z1:-20,z2:16 },
  { name:'A RAMP', x1:18,x2:28,z1:-24,z2:-14 },
  { name:'A SITE', x1:20,x2:42,z1:-36,z2:-14 },
  { name:'LONG A', x1:32,x2:44,z1:-16,z2:22 },
  { name:'LONG DOORS', x1:16,x2:44,z1:20,z2:34 },
  { name:'CT CROSS', x1:14,x2:28,z1:-34,z2:-26 },
];
export const SITES = { A:new THREE.Vector3(30,0,-26), B:new THREE.Vector3(-30,0,-24) };
export const SPAWNS = { T:new THREE.Vector3(5,0,35), CT:new THREE.Vector3(1,0,-29) };
export const ROUTES = [
  [new THREE.Vector3(24,0,28),new THREE.Vector3(38,0,14),new THREE.Vector3(38,0,-8),SITES.A.clone()],
  [new THREE.Vector3(-3,0,18),new THREE.Vector3(4,0,11),new THREE.Vector3(16,0,9),new THREE.Vector3(16,0,-15),SITES.A.clone()],
  [new THREE.Vector3(-19,0,29),new THREE.Vector3(-30,0,18),new THREE.Vector3(-30,0,2),SITES.B.clone()],
];
export interface Solid { box: THREE.Box3; kind: 'wall' | 'cover' | 'door' | 'roof' }
export const insideMap = (x:number,z:number) => REGIONS.some(r=>x>r.x1&&x<r.x2&&z>r.z1&&z<r.z2);
export function locationName(x:number,z:number) {
  if (z>-17&&z<-10&&x>-6&&x<8) return 'MID DOORS';
  if (x>12&&x<20&&z>-14&&z<8) return 'CATWALK';
  return REGIONS.find(r=>x>=r.x1&&x<=r.x2&&z>=r.z1&&z<=r.z2)?.name ?? 'DUST II';
}

let seed = 517;
export function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
function stoneMaterial(color: number) {
  const mat = new THREE.MeshStandardMaterial({color,roughness:.96});
  mat.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vStone;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvStone = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = 'varying vec3 vStone;\nfloat hashStone(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}\n'+shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\nfloat grit = hashStone(floor(vStone * 65.0)); float stonePatch = hashStone(floor(vStone * 2.0)); diffuseColor.rgb *= 0.93 + grit * 0.10 + stonePatch * 0.06;');
  };
  return mat;
}

export class DustMap {
  group = new THREE.Group();
  solids: Solid[] = [];
  wallSegments: {x:number;z:number;w:number;d:number}[] = [];
  cover: {x:number;z:number;w:number;d:number}[] = [];
  nav: NavigationGrid;
  private stone = stoneMaterial(0xc8ad81);
  private trim = new THREE.MeshStandardMaterial({color:0xdcc8a1,roughness:.95});
  private wood = stoneMaterial(0x786249);
  private metal = new THREE.MeshStandardMaterial({color:0x4d5551,roughness:.75,metalness:.35});

  constructor(scene:THREE.Scene) {
    scene.add(this.group);
    this.build();
    this.nav = new NavigationGrid(this);
  }
  box(x:number,y:number,z:number,w:number,h:number,d:number,mat:THREE.Material,kind?:Solid['kind']) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
    mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true;
    this.group.add(mesh);
    if(kind) this.solids.push({box:new THREE.Box3(new THREE.Vector3(x-w/2,y-h/2,z-d/2),new THREE.Vector3(x+w/2,y+h/2,z+d/2)),kind});
    return mesh;
  }
  private build() {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(250,250),stoneMaterial(0xc7b38e));
    ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; this.group.add(ground);
    const walk = (x:number,z:number)=>insideMap(x,z);
    for(let axis=0;axis<2;axis++) {
      for(let line=-44;line<=46;line+=2) {
        let start:number|null=null;
        for(let along=-44;along<=48;along+=2) {
          const edge=along<46&&(axis===0 ? walk(along+1,line-1)!==walk(along+1,line+1) : walk(line-1,along+1)!==walk(line+1,along+1));
          if(edge&&start===null) start=along;
          if(!edge&&start!==null) {
            const length=along-start;
            const x=axis===0?(start+along)/2:line, z=axis===0?line:(start+along)/2;
            const w=axis===0?length+.3:.65,d=axis===0?.65:length+.3;
            const height=4.5+random()*1.2;
            this.box(x,height/2,z,w,height,d,this.stone,'wall');
            this.box(x,height+.12,z,w+.2,.24,d+.2,this.trim);
            this.box(x,.24,z,w+.09,.48,d+.09,this.trim);
            this.wallSegments.push({x,z,w,d});
            if(length>7) this.wallDetails(x,z,length,axis,height);
            start=null;
          }
        }
      }
    }
    // Solid, open double doors. The central lane remains traversable.
    this.doors(1,-13,14);
    this.doors(30,24,12);
    this.box(20,2.5,24,8,5,1.1,this.stone,'wall');
    this.box(40,2.5,24,8,5,1.1,this.stone,'wall');
    this.box(-21,1.7,-29,1,3.4,2,this.stone,'wall');
    this.box(-21,1.7,-21,1,3.4,2,this.stone,'wall');
    this.box(-21,3.65,-25,1,1,10,this.stone,'roof');
    this.box(-21.5,1.55,-27.5,2.8,3.1,.22,this.wood,'door');
    this.box(-20.5,1.55,-22.5,2.8,3.1,.22,this.wood,'door');
    // Tunnel ceilings and rhythmic stone ribs.
    this.box(-30,4.1,12,12,.7,24,this.stone,'roof');
    this.box(-17,3.7,12,18,.6,8,this.stone,'roof');
    for(let z=2;z<=22;z+=5) {
      this.box(-30,3.65,z,12,.45,.6,this.trim,'roof');
      this.box(-35.6,1.8,z,.6,3.6,.6,this.trim,'wall');
      this.box(-24.4,1.8,z,.6,3.6,.6,this.trim,'wall');
      const lamp = new THREE.PointLight(0xffcc83,8,11,2); lamp.position.set(-30,3.3,z); this.group.add(lamp);
      this.box(-30,3.65,z,.7,.08,.35,new THREE.MeshStandardMaterial({color:0xffe0a0,emissive:0xffc060,emissiveIntensity:2}));
    }
    this.crate(29,-25,3.5,2.4,3.5); this.crate(34,-30,3,3.6,3);
    this.crate(23,-32,2.8,1.2,2.8); this.crate(24,-17,2.5,2.1,2.4);
    this.crate(-32,-26,3.5,2.6,3.5); this.crate(-36,-17,3,2.3,3);
    this.crate(-22,-7,3.5,2.7,3); this.crate(-25,-31,2,1.2,2);
    this.crate(4,-4,2.4,2.6,2.6); this.crate(-4,3,2.2,1.3,3.4);
    this.crate(36,6,2.5,1.2,4); this.crate(40,-11,2.5,2.5,2.5);
    this.crate(19,25,2.2,2.2,3); this.crate(-18,27,2.6,1.6,2.6);
    this.crate(-16,-31,2,2.4,3); this.crate(14,-30,2.4,2.2,3);
    this.crate(10,37,3,1.4,2.2);
    // A raised curb gives the short route a distinct visual silhouette.
    this.box(12.35,.38,-2,.4,.76,22,this.trim,'cover');
    for(const [name,pos] of Object.entries(SITES)) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(4.9,5,64),new THREE.MeshBasicMaterial({color:0xd48246,transparent:true,opacity:.6,side:THREE.DoubleSide}));
      ring.rotation.x=-Math.PI/2; ring.position.set(pos.x,.026,pos.z); this.group.add(ring);
      this.sign(name,pos.x,.04,pos.z+4,3,true);
    }
    this.sign('A  →',31.64,2.5,13,2.5,false,Math.PI/2);
    this.sign('B  ←',-6.33,2.4,20,2.4,false,-Math.PI/2);
    this.sign('A',20.36,2.8,-28,3,false,Math.PI/2);
    this.sign('B',-30,2.8,-33.62,3);
    this.sign('DUST II',8,2.5,39.65,3.8,false,Math.PI);
    // Inaccessible city blocks, towers and rooftop details form the skyline.
    for(let x=-56;x<=56;x+=8) for(let z=-48;z<=48;z+=8) {
      if(insideMap(x,z)||insideMap(x-3,z-3)||insideMap(x+3,z+3)||insideMap(x-3,z+3)||insideMap(x+3,z-3)) continue;
      const h=5+random()*8;
      const mat=stoneMaterial(new THREE.Color().setHSL(.105+random()*.025,.19+random()*.13,.55+random()*.14).getHex());
      this.box(x,h/2,z,7.8,h,7.8,mat);
      this.box(x,h+.15,z,8.1,.3,8.1,this.trim);
      if(random()>.5) {
        this.box(x+1,h+.9,z+1,2.2,1.5,2.2,mat);
        this.box(x-1,h+2,z-2,.07,4,.07,this.metal);
        this.box(x-1,h+3.5,z-2,2,.06,.06,this.metal);
      }
      for(let yy=3;yy<h-1;yy+=2.9) for(let xx=-2;xx<=2;xx+=4) {
        this.window(x+xx,yy,z+3.94,0);
        this.window(x+xx,yy,z-3.94,Math.PI);
        this.window(x+3.94,yy,z+xx,Math.PI/2);
      }
    }
    this.palm(44,-32,8); this.palm(-42,-5,8.5); this.palm(23,38,9); this.palm(-12,-39,10); this.palm(47,12,10);
    this.tower(-47,-37); this.tower(47,-43);
    // Mountains use only low-poly geometry.
    const mountainMat=new THREE.MeshStandardMaterial({color:0xc3b6a0,roughness:1});
    for(let i=0;i<25;i++) {
      const a=i/25*Math.PI*2;
      const m=new THREE.Mesh(new THREE.ConeGeometry(15+random()*18,10+random()*22,5),mountainMat);
      m.position.set(Math.cos(a)*115,2,Math.sin(a)*115); this.group.add(m);
    }
  }
  private wallDetails(x:number,z:number,length:number,axis:number,height:number) {
    for(let p=-length/2+2;p<length/2-1;p+=4.5) {
      if(axis===0) { this.box(x+p,height/2,z,.28,height,.78,this.trim); }
      else { this.box(x,height/2,z+p,.78,height,.28,this.trim); }
    }
  }
  private window(x:number,y:number,z:number,rotation:number) {
    const group=new THREE.Group(); group.position.set(x,y,z); group.rotation.y=rotation;
    const dark=new THREE.Mesh(new THREE.PlaneGeometry(1.05,1.6),new THREE.MeshStandardMaterial({color:0x424f4b,roughness:.9}));
    group.add(dark);
    for(let i=0;i<5;i++) {
      const slat=new THREE.Mesh(new THREE.BoxGeometry(1.15,.045,.055),this.wood); slat.position.set(0,-.65+i*.31,.025);group.add(slat);
    }
    const sill=new THREE.Mesh(new THREE.BoxGeometry(1.35,.14,.3),this.trim);sill.position.y=-.85;group.add(sill);this.group.add(group);
  }
  private doors(x:number,z:number,width:number) {
    const gap=4.6,side=(width-gap)/2;
    this.box(x-gap/2-side/2,1.9,z,side,3.8,1.1,this.stone,'wall');
    this.box(x+gap/2+side/2,1.9,z,side,3.8,1.1,this.stone,'wall');
    this.box(x,4,z,width,1.2,1.1,this.stone,'roof');
    const radius=gap/2+.04,archBase=1.12;
    for(const side of [-1,1]) {
      const arch=new THREE.Mesh(new THREE.TorusGeometry(radius,.17,5,24,Math.PI),this.trim);
      arch.position.set(x,archBase,z+side*.61);arch.castShadow=true;arch.receiveShadow=true;this.group.add(arch);
    }
    for(let i=0;i<16;i++) {
      const a=i/16*Math.PI,b=(i+1)/16*Math.PI;
      const x1=x+Math.cos(a)*radius,x2=x+Math.cos(b)*radius,y1=archBase+Math.sin(a)*radius,y2=archBase+Math.sin(b)*radius;
      this.solids.push({kind:'roof',box:new THREE.Box3(new THREE.Vector3(Math.min(x1,x2)-.13,Math.min(y1,y2)-.13,z-.77),new THREE.Vector3(Math.max(x1,x2)+.13,Math.max(y1,y2)+.13,z+.77))});
    }
    for(const s of [-1,1]) {
      const dx=x+s*1.95;
      this.box(dx,1.65,z+s*.7,.26,3.3,2.5,this.wood,'door');
      for(let y=.5;y<3;y+=1.1) this.box(dx, y,z+s*.7,.3,.12,2.52,this.metal);
      for(let k=-1;k<=1;k++)this.box(dx-s*.16,1.6,z+s*.7+k*.65,.035,3.1,.025,this.trim);
    }
  }
  private crate(x:number,z:number,w:number,h:number,d:number) {
    this.box(x,h/2,z,w,h,d,this.wood,'cover'); this.cover.push({x,z,w,d});
    const board = new THREE.MeshStandardMaterial({color:0x93816a,roughness:.95});
    for(const yy of [.14,h-.14]) {
      this.box(x,yy,z,w+.08,.16,d+.08,board);
    }
    for(const xx of [-w/2+.12,w/2-.12]) this.box(x+xx,h/2,z,.18,h+.04,d+.1,board);
    for(let yy=.5;yy<h;yy+=.44) this.box(x,yy,z,w+.015,.022,d+.015,this.metal);
    for(const s of [-1,1]) this.box(x+s*w*.27,h+.026,z,.065,.05,d+.02,this.metal);
  }
  private sign(label:string,x:number,y:number,z:number,size:number,ground=false,rotation=0) {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
    const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,512,256);
    ctx.fillStyle='#ab482b';ctx.font='bold 152px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,256,135);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(size,size/2),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));
    mesh.position.set(x,y,z);if(ground)mesh.rotation.x=-Math.PI/2;else mesh.rotation.y=rotation;this.group.add(mesh);
  }
  private palm(x:number,z:number,h:number) {
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.17,.32,h,7),this.wood);trunk.position.set(x,h/2,z);trunk.rotation.z=.09;this.group.add(trunk);
    const leafMat=new THREE.MeshStandardMaterial({color:0x657254,side:THREE.DoubleSide,roughness:1});
    for(let i=0;i<9;i++) {
      const a=i/9*Math.PI*2;
      const verts=new Float32Array([0,0,0,Math.cos(a)*1.5-.45,.25,Math.sin(a)*1.5-.4,Math.cos(a)*4,-1.2,Math.sin(a)*4,Math.cos(a)*1.5+.45,.25,Math.sin(a)*1.5+.4]);
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(verts,3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();
      const leaf=new THREE.Mesh(geo,leafMat);leaf.position.set(x-h*.09,h,z);leaf.castShadow=true;this.group.add(leaf);
    }
  }
  private tower(x:number,z:number) {
    this.box(x,7,z,4,14,4,this.stone);this.box(x,13,z,5,1,5,this.trim);
    const dome=new THREE.Mesh(new THREE.SphereGeometry(2.6,16,10,0,Math.PI*2,0,Math.PI/2),this.trim);dome.position.set(x,14,z);this.group.add(dome);
    this.box(x,17,z,.08,2,.08,this.metal);
  }
  blocked(x:number,z:number,r=.35,y=0,height=1.8) {
    if(!insideMap(x,z))return true;
    return this.solids.some(s=>s.box.min.y<y+height-.05&&s.box.max.y>y+.08&&x+r>s.box.min.x&&x-r<s.box.max.x&&z+r>s.box.min.z&&z-r<s.box.max.z);
  }
  move(pos:THREE.Vector3,dx:number,dz:number,r=.34) {
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.18));
    for(let i=0;i<steps;i++) {
      if(!this.blocked(pos.x+dx/steps,pos.z,r,pos.y))pos.x+=dx/steps;
      if(!this.blocked(pos.x,pos.z+dz/steps,r,pos.y))pos.z+=dz/steps;
    }
  }
  vertical(pos:THREE.Vector3,velocity:number,dt:number) {
    let next=pos.y+velocity*dt,grounded=false;
    for(const {box} of this.solids) {
      if(pos.x+.31<=box.min.x||pos.x-.31>=box.max.x||pos.z+.31<=box.min.z||pos.z-.31>=box.max.z)continue;
      if(velocity<=0&&pos.y>=box.max.y-.06&&next<=box.max.y) {next=Math.max(next,box.max.y);velocity=0;grounded=true;}
      if(velocity>0&&pos.y+1.8<=box.min.y+.06&&next+1.8>box.min.y) {next=box.min.y-1.8;velocity=0;}
    }
    if(next<=0){next=0;velocity=0;grounded=true;} pos.y=next;
    return {velocity,grounded};
  }
  rayDistance(origin:THREE.Vector3,direction:THREE.Vector3,max=200) {
    const ray=new THREE.Ray(origin,direction),point=new THREE.Vector3();let nearest=max;
    for(const s of this.solids) if(ray.intersectBox(s.box,point))nearest=Math.min(nearest,origin.distanceTo(point));
    return nearest;
  }
  canSee(from:THREE.Vector3,to:THREE.Vector3) {
    const delta=to.clone().sub(from);const distance=delta.length();return this.rayDistance(from,delta.normalize(),distance+.1)>=distance-.12;
  }
  dispose() {
    const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>();
    this.group.traverse(obj=>{if(obj instanceof THREE.Mesh){geos.add(obj.geometry);(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>mats.add(m));}});
    geos.forEach(g=>g.dispose());mats.forEach(m=>{if('map'in m)(m.map as THREE.Texture|null)?.dispose();m.dispose();});
  }
}

export class NavigationGrid {
  readonly step=1;readonly min=-44;readonly size=92;
  walkable:Uint8Array;
  constructor(private map:DustMap) {
    this.walkable=new Uint8Array(this.size*this.size);
    for(let z=0;z<this.size;z++)for(let x=0;x<this.size;x++)this.walkable[z*this.size+x]=map.blocked(this.min+x+.5,this.min+z+.5,.43)?0:1;
  }
  private index(x:number,z:number) {const gx=Math.floor(x-this.min),gz=Math.floor(z-this.min);return gx>=0&&gz>=0&&gx<this.size&&gz<this.size?gz*this.size+gx:-1;}
  private point(index:number) {return new THREE.Vector3(this.min+index%this.size+.5,0,this.min+Math.floor(index/this.size)+.5);}
  private nearest(pos:THREE.Vector3) {
    const index=this.index(pos.x,pos.z);if(index>=0&&this.walkable[index])return index;
    for(let r=1;r<10;r++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++) {
      const candidate=this.index(pos.x+dx,pos.z+dz);if(candidate>=0&&this.walkable[candidate])return candidate;
    }
    return -1;
  }
  path(from:THREE.Vector3,to:THREE.Vector3):THREE.Vector3[] {
    const start=this.nearest(from),end=this.nearest(to);if(start<0||end<0)return [];
    const count=this.size*this.size,g=new Float32Array(count).fill(Infinity),parent=new Int32Array(count).fill(-1),closed=new Uint8Array(count);
    const heap:{id:number;f:number}[]=[];
    const push=(id:number,f:number)=>{heap.push({id,f});let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p].f<=f)break;[heap[i],heap[p]]=[heap[p],heap[i]];i=p;}};
    const pop=()=>{const first=heap[0],last=heap.pop()!;if(heap.length){heap[0]=last;let i=0;for(;;){let j=i*2+1;if(j>=heap.length)break;if(j+1<heap.length&&heap[j+1].f<heap[j].f)j++;if(heap[i].f<=heap[j].f)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return first.id;};
    const ex=end%this.size,ez=Math.floor(end/this.size);
    const heuristic=(id:number)=>Math.hypot(id%this.size-ex,Math.floor(id/this.size)-ez);
    g[start]=0;push(start,heuristic(start));let found=false;
    while(heap.length) {
      const cur=pop();if(closed[cur])continue;closed[cur]=1;if(cur===end){found=true;break;}
      const cx=cur%this.size,cz=Math.floor(cur/this.size);
      for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++) {
        if(!dx&&!dz)continue;const nx=cx+dx,nz=cz+dz;if(nx<0||nz<0||nx>=this.size||nz>=this.size)continue;
        const next=nz*this.size+nx;if(!this.walkable[next]||closed[next])continue;
        if(dx&&dz&&(!this.walkable[cz*this.size+nx]||!this.walkable[nz*this.size+cx]))continue;
        const score=g[cur]+(dx&&dz?Math.SQRT2:1);if(score<g[next]){parent[next]=cur;g[next]=score;push(next,score+heuristic(next));}
      }
    }
    if(!found)return [];
    const result:THREE.Vector3[]=[];let cur=end;while(cur!==start){result.push(this.point(cur));cur=parent[cur];if(cur<0)return [];}
    result.reverse();
    if(!this.map.blocked(to.x,to.z,.43))result.push(to.clone().setY(0));
    return result;
  }
}
