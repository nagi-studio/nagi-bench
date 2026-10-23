import { Mechanism, DT } from '../src/physics.js';
import assert from 'node:assert/strict';

const bells=[];
const mechanism=new Mechanism(event=>{if(event.type==='bell')bells.push(event.time);});
let worstGearError=0,worstAnchorError=0;
const anchors=Object.fromEntries(Object.entries(mechanism.bodies).filter(([name])=>name!=='slider').map(([name,b])=>[name,b.position.clone()]));
for(let i=0;i<30/DT;i++){
  mechanism.step();
  for(const b of Object.values(mechanism.bodies)){
    for(const n of [...b.position.toArray(),...b.angularVelocity.toArray(),b.quaternion.x,b.quaternion.y,b.quaternion.z,b.quaternion.w])assert(Number.isFinite(n),'Finite rigid body state');
  }
  for(const [name,anchor] of Object.entries(anchors))worstAnchorError=Math.max(worstAnchorError,mechanism.bodies[name].position.distanceTo(anchor));
  for(const c of mechanism.world.constraints)for(const e of c.equations){
    if(e.phaseA!==undefined&&!e.lock)worstGearError=Math.max(worstGearError,Math.abs(e.phaseA+e.ratio*e.phaseB));
  }
}
assert(mechanism.releases>=25&&mechanism.releases<=55,'Water creates a stable sequence of tooth releases');
assert(worstAnchorError<.01,'Hinged axles remain in their bearings');
assert(worstGearError<.04,'Gear phases retain their physical ratios');
assert(bells.length>=3,'Cam causes repeated bell contacts');
assert(bells.some(t=>t>20&&t<26),'A physical bell strike occurs during the reporting close-up');
const dry=new Mechanism();dry.flowEnabled=false;
for(let i=0;i<5/DT;i++)dry.step();
assert.equal(dry.releases,0,'Without water the escapement never releases');
assert(Math.abs(dry.totalAngle)<.001,'No hidden motor drives the wheel');
console.log(JSON.stringify({result:'PASS',seconds:30,waterDrivenSteps:mechanism.releases,bellContacts:bells.length,bellContactsDuringCloseup:bells.filter(t=>t>20&&t<26),maxGearPhaseError:worstGearError,maxBearingDisplacement:worstAnchorError,dryWheelSteps:dry.releases},null,2));
