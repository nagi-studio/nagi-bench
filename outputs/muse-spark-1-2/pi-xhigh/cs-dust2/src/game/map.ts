// @ts-ignore - Vite subproject deps installed via package.json on bench build
import * as THREE from 'three';

export interface Wall { min:{x:number,z:number}, max:{x:number,z:number}, h:number }
export const WORLD = { size: 88, half: 44 };

export const SPAWNS = {
  CT: [{x:-32,z:-28},{x:-30,z:-32},{x:-28,z:-26},{x:-34,z:-30},{x:-26,z:-30}],
  T:  [{x:32,z:30},{x:30,z:34},{x:34,z:28},{x:28,z:32},{x:36,z:32}],
  A: { x:-18, z:-18, r:8 },
  B: { x:14, z: -6, r:7 },
};

export const MID_DOOR: Wall = { min:{x:-4,z:-8}, max:{x:-2,z:-2}, h:3.2 };

// Dust2 walls - simplified but covers all required areas and keeps connectivity
export const WALLS: Wall[] = [
  // outer bounds
  {min:{x:-44,z:-44},max:{x:44,z:-42},h:6},{min:{x:-44,z:42},max:{x:44,z:44},h:6},
  {min:{x:-44,z:-44},max:{x:-42,z:44},h:6},{min:{x:42,z:-44},max:{x:44,z:44},h:6},
  // Long A corridor walls
  {min:{x:-22,z:-30},max:{x:-20,z:-10},h:4},{min:{x:-14,z:-30},max:{x:-12,z:-14},h:4},
  {min:{x:-28,z:-10},max:{x:-8,z:-8},h:3.5},
  // A site walls/boxes
  {min:{x:-26,z:-26},max:{x:-24,z:-18},h:2.2},{min:{x:-10,z:-26},max:{x:-8,z:-18},h:2.2},
  {min:{x:-24,z:-10},max:{x:-10,z:-8},h:1.2}, // low
  {min:{x:-20,z:-22},max:{x:-18,z:-20},h:1.6},{min:{x:-16,z:-20},max:{x:-14,z:-18},h:1.6}, // boxes
  // Catwalk
  {min:{x:-6,z:-18},max:{x:-4,z:-6},h:4},{min:{x:0,z:-18},max:{x:2,z:-6},h:4},
  {min:{x:-6,z:-6},max:{x:2,z:-4},h:2.5}, // cat floor is elevated handled as platform, wall below
  // Mid walls
  {min:{x:-10,z:-4},max:{x:-8,z:6},h:4},{min:{x:0,z:-2},max:{x:8,z:0},h:2}, // mid boxes
  {min:{x:-18,z:4},max:{x:-12,z:6},h:3},{min:{x:6,z:6},max:{x:12,z:8},h:3},
  // Mid doors frame (two walls leaving gap)
  {min:{x:-8,z:-10},max:{x:-4,z:-8},h:4},{min:{x:-8,z:-2},max:{x:-4,z:2},h:4},
  {min:{x:-2,z:-10},max:{x:2,z:-8},h:4},{min:{x:-2,z:-2},max:{x:2,z:2},h:4},
  // CT spawn to mid
  {min:{x:-30,z:-18},max:{x:-28,z:-8},h:4},{min:{x:-34,z:-8},max:{x:-18,z:-6},h:4},
  // B tunnels (upper)
  {min:{x:8,z:-10},max:{x:10,z:6},h:4},{min:{x:18,z:-10},max:{x:20,z:6},h:4},
  {min:{x:10,z:6},max:{x:18,z:8},h:4},{min:{x:10,z:-12},max:{x:18,z:-10},h:4},
  {min:{x:12,z:-2},max:{x:16,z:2},h:2}, // inside pillar
  // B site
  {min:{x:6,z:-14},max:{x:22,z:-12},h:3},{min:{x:6,z:2},max:{x:22,z:4},h:3},
  {min:{x:6,z:-12},max:{x:8,z:2},h:3},{min:{x:20,z:-12},max:{x:22,z:2},h:3},
  {min:{x:10,z:-8},max:{x:12,z:-6},h:1.8},{min:{x:16,z:-4},max:{x:18,z:-2},h:1.8}, // B boxes
  // T spawn to B / mid connector
  {min:{x:22,z:8},max:{x:28,z:10},h:4},{min:{x:22,z:18},max:{x:28,z:20},h:4},
  {min:{x:28,z:10},max:{x:30,z:20},h:4},{min:{x:20,z:20},max:{x:28,z:22},h:4},
  // extra cover
  {min:{x:-2,z:12},max:{x:2,z:18},h:2.5},{min:{x:10,z:14},max:{x:16,z:16},h:2.2},
];

export function isInsideWall(x:number,z:number, pad=0.35){
  for(const w of WALLS){ if(x+pad>w.min.x && x-pad<w.max.x && z+pad>w.min.z && z-pad<w.max.z) return true; }
  if(MID_DOOR && x> MID_DOOR.min.x-pad && x < MID_DOOR.max.x+pad && z> MID_DOOR.min.z-pad && z < MID_DOOR.max.z+pad) {
    // door is passable - actually gap, we treat walls around it, so door itself is not wall (we already have gap)
  }
  return false;
}

export function buildMap(scene:THREE.Scene){
  const g=new THREE.Group();
  const floorMat=new THREE.MeshStandardMaterial({color:0x9a8c7a, roughness:0.85, metalness:0.05});
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(WORLD.size*2, WORLD.size*2), floorMat); floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; g.add(floor);
  // grid lines
  const grid=new THREE.GridHelper(WORLD.size*2, 44, 0x6a6a6a, 0x3a3a3a); (grid.material as THREE.Material & {opacity:number}).opacity=0.12; (grid.material as THREE.Material & {transparent:boolean}).transparent=true; grid.position.y=0.02; g.add(grid);
  const wallMat=new THREE.MeshStandardMaterial({color:0xc8b89a, roughness:0.78});
  const wallMat2=new THREE.MeshStandardMaterial({color:0xb8a88e, roughness:0.8});
  for(const w of WALLS){
    const wi=w.max.x-w.min.x, wd=w.max.z-w.min.z;
    const m=new THREE.Mesh(new THREE.BoxGeometry(wi,w.h,wd), Math.random()>0.5?wallMat:wallMat2);
    m.position.set((w.min.x+w.max.x)/2, w.h/2, (w.min.z+w.max.z)/2); m.castShadow=true; m.receiveShadow=true; g.add(m);
    const top=new THREE.Mesh(new THREE.BoxGeometry(wi+0.02,0.06,wd+0.02), new THREE.MeshStandardMaterial({color:0x8a7a5e})); top.position.set(m.position.x, w.h+0.03, m.position.z); g.add(top);
  }
  // mid doors (visual)
  const doorFrameMat=new THREE.MeshStandardMaterial({color:0x4a3a2a});
  const d1=new THREE.Mesh(new THREE.BoxGeometry(0.12,3.2,1.8), doorFrameMat); d1.position.set(-3,1.6,-8); g.add(d1);
  const d2=new THREE.Mesh(new THREE.BoxGeometry(0.12,3.2,1.8), doorFrameMat); d2.position.set(-3,1.6,-2); g.add(d2);
  const doorMat=new THREE.MeshStandardMaterial({color:0x6b5a3e, transparent:true, opacity:0.92}); const door=new THREE.Mesh(new THREE.BoxGeometry(0.08,2.8,2.0), doorMat); door.position.set(-3,1.4,-5); g.add(door);
  // site markers
  const aMark=new THREE.Mesh(new THREE.RingGeometry(6,6.2,32), new THREE.MeshBasicMaterial({color:0x4a8cff, side:THREE.DoubleSide, transparent:true, opacity:0.22})); aMark.rotation.x=-Math.PI/2; aMark.position.set(SPAWNS.A.x,0.05,SPAWNS.A.z); g.add(aMark);
  const bMark=new THREE.Mesh(new THREE.RingGeometry(5.5,5.7,32), new THREE.MeshBasicMaterial({color:0xff8a2a, side:THREE.DoubleSide, transparent:true, opacity:0.2})); bMark.rotation.x=-Math.PI/2; bMark.position.set(SPAWNS.B.x,0.05,SPAWNS.B.z); g.add(bMark);
  // spawns
  const ctMat=new THREE.MeshBasicMaterial({color:0x4a8cff, transparent:true, opacity:0.12, side:THREE.DoubleSide});
  const tMat=new THREE.MeshBasicMaterial({color:0xff8a2a, transparent:true, opacity:0.12, side:THREE.DoubleSide});
  for(const s of SPAWNS.CT){ const c=new THREE.Mesh(new THREE.CircleGeometry(1.2,16), ctMat); c.rotation.x=-Math.PI/2; c.position.set(s.x,0.04,s.z); g.add(c); }
  for(const s of SPAWNS.T){ const c=new THREE.Mesh(new THREE.CircleGeometry(1.2,16), tMat); c.rotation.x=-Math.PI/2; c.position.set(s.x,0.04,s.z); g.add(c); }
  // catwalk elevated
  const cat=new THREE.Mesh(new THREE.BoxGeometry(6,0.4,10), new THREE.MeshStandardMaterial({color:0xa99a84})); cat.position.set(-2,2.2,-10); cat.receiveShadow=true; g.add(cat);
  const catRail1=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.9,10), new THREE.MeshStandardMaterial({color:0x5a4a2a})); catRail1.position.set(-4.8,2.7,-10); g.add(catRail1);
  const catRail2=catRail1.clone(); catRail2.position.x=0.8; g.add(catRail2);
  scene.add(g);
  return g;
}

export function hasLineOfSight(a:{x:number,z:number}, b:{x:number,z:number}){
  const dx=b.x-a.x, dz=b.z-a.z, dist=Math.hypot(dx,dz); const steps=Math.ceil(dist/0.6);
  for(let i=1;i<steps;i++){ const t=i/steps; const x=a.x+dx*t, z=a.z+dz*t; if(isInsideWall(x,z,0.2)) return false; }
  return true;
}
