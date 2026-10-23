import assert from 'node:assert/strict';
import { Mechanism,DT } from '../src/physics.js';
const events=[],m=new Mechanism((type,t)=>events.push({type,t}));
const anchors=Object.fromEntries(Object.entries(m.rotors).map(([n,r])=>[n,r.body.position.clone()]));
let maxAnchorError=0,maxGearError=0,held=0,advancing=0;
for(let i=0;i<Math.round(32/DT);i++){
  m.step();for(const [name,r] of Object.entries(m.rotors)){assert.ok(Number.isFinite(r.angle));maxAnchorError=Math.max(maxAnchorError,r.body.position.distanceTo(anchors[name]));}
  const r=m.rotors;maxGearError=Math.max(maxGearError,Math.abs(.42*r.wheel.angle+.58*r.gearB.angle),Math.abs(r.gearC.angle-r.shaft.angle));
  if(Math.abs(r.wheel.body.angularVelocity.z)<.01)held++;else advancing++;
}
assert.ok(maxAnchorError<.001,'Every bearing must stay anchored');assert.ok(maxGearError<.025,'Gears must transmit motion without slipping');assert.ok(m.steps>=10&&m.steps<=20,'Water must cause repeated discrete advances');assert.ok(held>100&&advancing>100,'The wheel must both stop and advance');
const bells=events.filter(e=>e.type==='bell');assert.ok(bells.some(e=>e.t>=23&&e.t<=28.5),'A physics-triggered strike must occur in the reporting shot');
const dry=new Mechanism();dry.emit=()=>{};for(let i=0;i<Math.round(32/DT);i++)dry.step();assert.equal(dry.steps,0,'No water means no escapement releases');assert.ok(Math.abs(dry.rotors.wheel.angle)<1e-6,'No hidden motor may drive the wheel');
console.log(JSON.stringify({seconds:m.time,steps:m.steps,bells,maxAnchorError,maxGearError,heldFrames:held,movingFrames:advancing,dryWheelAngle:dry.rotors.wheel.angle},null,2));
