import * as THREE from 'three';
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const mix = (a,b,t) => a + (b-a)*t;
export const smooth = x => { x = clamp(x); return x*x*(3-2*x); };
export const range = (t,a,b) => clamp((t-a)/(b-a));
export const pulse = (t,a,b) => smooth(range(t,a,a+.2)) * (1-smooth(range(t,b-.2,b)));
export const hash = (n) => { const x = Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); };
export function rng(seed=1){return()=>{seed|=0;seed=seed+0x6d2b79f5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function track(camera, from, to, targetFrom, targetTo, progress, fov=42, roll=0){
  const p=smooth(progress);
  camera.position.fromArray(from).lerp(new THREE.Vector3(...to),p);
  camera.up.set(Math.sin(roll),Math.cos(roll),0);
  camera.lookAt(new THREE.Vector3(...targetFrom).lerp(new THREE.Vector3(...targetTo),p));
  camera.fov=fov; camera.updateProjectionMatrix();
}
