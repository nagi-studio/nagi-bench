import * as C from 'cannon-es';

// All moving mechanisms are dynamic rigid bodies. A pinned rotor has one free
// angular degree of freedom; ideal gearing is solved in the SAME impulse solver
// as the escapement's unilateral tooth contact, not by assigning rotations.
const STEP = Math.PI / 6;
export const DT = 1 / 120;
const AXIS = { z: new C.Vec3(0, 0, 1), y: new C.Vec3(0, 1, 0) };

class AngularEquation extends C.Equation {
  constructor(a, b, ca, cb, error, min = -1e5, max = 1e5) {
    super(a.body, b.body, min, max);
    this.jacobianElementA.rotational.copy(AXIS[a.axis].scale(ca));
    this.jacobianElementB.rotational.copy(AXIS[b.axis].scale(cb));
    this.error = error;
    this.setSpookParams(2e7, 4, DT);
  }
  computeB(h) { return -this.a * this.error() - this.b * this.computeGW() - h * this.computeGiMf(); }
  computeGiMGt() {
    const va = new C.Vec3(), vb = new C.Vec3();
    this.bi.invInertiaWorldSolve.vmult(this.jacobianElementA.rotational, va);
    this.bj.invInertiaWorldSolve.vmult(this.jacobianElementB.rotational, vb);
    return va.dot(this.jacobianElementA.rotational) + vb.dot(this.jacobianElementB.rotational);
  }
}

export class Mechanism {
  constructor(onEvent = () => {}) {
    this.onEvent = onEvent;
    this.world = new C.World({ gravity: new C.Vec3(0, -9.81, 0), allowSleep: false });
    this.world.solver.iterations = 18;
    this.world.solver.tolerance = 1e-8;
    this.rotors = {};
    this.time = 0; this.steps = 0; this.target = 0; this.moving = false;
    this.buckets = Array(12).fill(0); this.drops = []; this.dropClock = 0;
    this.spillClock = 0; this.lastStrike = -10; this.strikes = 0;
    this.fixed = { body: new C.Body({ mass: 0 }), axis: 'z', angle: 0 };
    this.world.addBody(this.fixed.body);
    this.rotor('wheel', [-1.8, 1.85, .65], 'z', 1.05, 1.42);
    this.rotor('gearB', [-.8, 1.85, 1.18], 'z', .22, .58);
    this.rotor('gearC', [.36, 1.85, 1.18], 'z', .16, .58);
    this.rotor('shaft', [.36, 3.5, .65], 'y', .20, .27);
    this.rotor('globe', [.36, 4.91, .65], 'y', .08, .73);
    this.rotor('sky', [.36, 7.16, .65], 'y', .08, .94);
    this.rotor('reportGear', [1.2, 1.16, .65], 'y', .16, .54);
    this.rotor('carousel', [2.45, 1.16, .65], 'y', .22, .7);
    this.rotor('cam', [2.36, 1.78, 1.37], 'z', .06, .38);
    this.rotor('balance', [-.03, 3.02, 1.36], 'z', .18, .65);
    this.rotor('latch', [.55, 3.12, 1.4], 'z', .08, .35);
    this.rotor('arm', [2.14, 2.43, 1.41], 'z', .16, .48);
    this.rotor('bell', [3.08, 2.82, 1.41], 'z', .30, .38);
    this.gear('wheel', 'gearB', .42, .58);
    this.gear('gearB', 'gearC', .58, .58);
    this.gear('gearC', 'shaft', 1, -1);
    this.gear('shaft', 'globe', 1, -1);
    this.gear('shaft', 'sky', .55, -1);
    this.gear('shaft', 'reportGear', .3, .54);
    this.gear('reportGear', 'carousel', .54, .7);
    this.gear('carousel', 'cam', 1, -1.3);
    this.gear('balance', 'latch', 1.45, 1);
    const wheel = this.rotors.wheel;
    this.stop = new AngularEquation(wheel, this.fixed, 1, 0, () => Math.min(0, wheel.angle - this.target), 0, 1e5);
    const contact = new C.Constraint(wheel.body, this.fixed.body);
    contact.equations = [this.stop]; contact.update = () => {}; this.world.addConstraint(contact);
    const floor = new C.Body({ mass: 0, shape: new C.Plane(), position: new C.Vec3(0,.19,0), material: new C.Material({ friction:.6, restitution:.03 }) });
    floor.quaternion.setFromEuler(-Math.PI / 2, 0, 0); this.world.addBody(floor);
    this.world.addBody(new C.Body({mass:0,shape:new C.Box(new C.Vec3(1.68,.08,.60)),position:new C.Vec3(-1.95,.25,.65),material:new C.Material({friction:.5,restitution:.025})}));
  }
  rotor(name, position, axis, mass, radius) {
    const body = new C.Body({ mass, shape: new C.Sphere(radius), position: new C.Vec3(...position), angularDamping: .03, linearDamping: 0, collisionFilterGroup: 2, collisionFilterMask: 0 });
    body.angularFactor.copy(AXIS[axis]);
    this.world.addBody(body);
    const bearing = new C.HingeConstraint(body, this.fixed.body, { pivotA:new C.Vec3(), pivotB:body.position.clone(), axisA:AXIS[axis], axisB:AXIS[axis], maxForce:1e6, collideConnected:false });
    this.world.addConstraint(bearing);
    this.rotors[name] = { body, axis, angle: 0, name };
  }
  gear(na, nb, ca, cb) {
    const a = this.rotors[na], b = this.rotors[nb];
    const c = new C.Constraint(a.body, b.body, { collideConnected: false });
    c.equations = [new AngularEquation(a, b, ca, cb, () => ca * a.angle + cb * b.angle)]; c.update = () => {};
    this.world.addConstraint(c);
  }
  torque(rotor, amount) { rotor.body.torque[rotor.axis] += amount; }
  emit(x, y, z, vx = 0, vy = -.3, mass = .036, spill = false) {
    const body = new C.Body({ mass, shape: new C.Sphere(.037), position: new C.Vec3(x, y, z), velocity: new C.Vec3(vx, vy, 0), linearDamping: .025, collisionFilterGroup: 1, collisionFilterMask: 1 });
    this.world.addBody(body); this.drops.push({ body, born: this.time, spill });
  }
  step() {
    const r = this.rotors, w = r.wheel, theta = w.angle;
    this.dropClock += DT;
    while (this.dropClock >= 1/25) { this.dropClock -= 1/25; const n = Math.floor(this.time*25); this.emit(-.796 + Math.sin(n*7.1)*.024, 4.12, .65 + Math.cos(n*3.2)*.024); }
    // Water particles fall under gravity. Absorption is an inelastic collision:
    // transfer their mass to the wheel and their downward impulse to its axle.
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i], p = d.body.position;
      let hit = false;
      if (!d.spill && p.y < 3.1 && p.y > 2.6) {
        for (let j=0;j<12;j++) {
          const a = theta + Math.PI/4 + j*STEP, x=-1.8+1.42*Math.cos(a), y=1.85+1.42*Math.sin(a);
          if (Math.abs(p.x-x)<.22 && Math.abs(p.z-.65)<.23 && Math.abs(p.y-y)<.13) {
            this.buckets[j] += d.body.mass;
            w.body.applyImpulse(new C.Vec3(0,d.body.mass*d.body.velocity.y,0),new C.Vec3(x+1.8,y-1.85,0));
            hit = true; break;
          }
        }
      }
      const inReceivingPool = p.y<.395 && p.x>-3.63 && p.x<-.27 && p.z>.05 && p.z<1.25;
      if (hit || inReceivingPool || this.time-d.born>2.4 || p.y<-.5) { this.world.removeBody(d.body); this.drops.splice(i,1); }
    }
    let supportedMass = 0, torque = 0, waterMass = 0;
    for (let j=0;j<12;j++) {
      const a = theta+Math.PI/4+j*STEP, x=1.42*Math.cos(a), y=1.42*Math.sin(a);
      const wrapped = Math.atan2(Math.sin(a),Math.cos(a));
      if (Math.abs(wrapped-Math.PI/4)<.075) supportedMass += this.buckets[j];
      // Lowering/overturning a scoop drains it. Discharged mass is represented
      // by newly emitted physical droplets carrying the tangential velocity.
      if (wrapped<-.28 && wrapped>-2.6 && this.buckets[j]>0) {
        const dm = Math.min(this.buckets[j],DT*1.8); this.buckets[j]-=dm;
        this.spillClock+=dm;
        if (this.spillClock>.06) { this.spillClock-=.06; this.emit(-1.8+x,1.85+y,.65,-w.body.angularVelocity.z*y,w.body.angularVelocity.z*x,.02,true); }
      }
      torque -= this.buckets[j]*9.81*x;
      waterMass += this.buckets[j];
    }
    // Captured water also adds rotational inertia at the scoop radius.
    const moment = .4*1.05*1.42*1.42 + waterMass*1.42*1.42;
    w.body.inertia.z=moment;w.body.invInertia.z=1/moment;w.body.updateInertiaWorld(true);
    const settled = Math.abs(theta-this.target)<.025 && Math.abs(w.body.angularVelocity.z)<.24;
    this.moving = !settled;
    // While a scoop rests on the weighing support, its weight tips the steelyard.
    // The counterweight and hinge friction return the balance after it moves on.
    this.torque(r.balance, supportedMass*9.81*.7 - 2.0 - 15*r.balance.angle - 1.3*r.balance.body.angularVelocity.z);
    if (r.balance.angle<-.065) this.torque(r.balance,(-.065-r.balance.angle)*350);
    if (r.balance.angle>.23) this.torque(r.balance,(.23-r.balance.angle)*350);
    if (settled && r.balance.angle>.115 && supportedMass>.40) {
      this.target-=STEP; this.steps++; this.onEvent('release',this.time); this.moving=true;
    }
    // A unilateral tooth contact arrests the wheel at the next tooth. This is
    // a mechanical contact constraint, never a prescribed wheel orientation.
    this.stop.enabled = theta-this.target<.009 || theta-this.target+w.body.angularVelocity.z*DT<0;
    this.torque(w, torque - .95*w.body.angularVelocity.z);
    // Cam/follower contact: rotating teeth lift the arm; gravity returns it.
    const cam = r.cam, arm = r.arm, phase = cam.angle*4;
    const lobe = Math.pow(Math.max(0,Math.sin(phase)),3);
    const lift = -.48 + .96*lobe;
    const penetration = lift-arm.angle;
    if (penetration>0) {
      const surfaceVelocity = 11.52*Math.pow(Math.max(0,Math.sin(phase)),2)*Math.cos(phase)*cam.body.angularVelocity.z;
      const force = Math.max(0,55*penetration+1.2*(surfaceVelocity-arm.body.angularVelocity.z));
      this.torque(arm,force);
      const gradient = 11.52*Math.pow(Math.max(0,Math.sin(phase)),2)*Math.cos(phase);
      this.torque(cam,-force*gradient);
    }
    this.torque(arm,-.16*9.81*.38*Math.cos(arm.angle)-.09*arm.body.angularVelocity.z);
    if (arm.angle<-.36) {
      const f = Math.max(0,650*(-.36-arm.angle)-2*arm.body.angularVelocity.z);
      this.torque(arm,f); this.torque(r.bell,-f*.23);
      if (this.hammerArmed && this.time-this.lastStrike>.45 && arm.body.angularVelocity.z<-.16) { this.lastStrike=this.time; this.strikes++; this.hammerArmed=false; this.onEvent('bell',this.time); }
    }
    if(arm.angle>.05)this.hammerArmed=true;
    this.torque(r.bell,-2.7*Math.sin(r.bell.angle)-.08*r.bell.body.angularVelocity.z);
    this.world.step(DT);
    for (const rotor of Object.values(r)) rotor.angle += rotor.body.angularVelocity[rotor.axis]*DT;
    this.time+=DT;
    this.supportedMass=supportedMass;
    this.state = this.time-this.lastStrike<.7?'钟声响起 · 木偶完成一次报时':this.moving?'衡杆放行 · 水轮前进一步':supportedMass>.35?'水斗增重 · 衡杆正在下压':'受水斗蓄水 · 止轮机构锁住水轮';
  }
  snapshot() {
    return { time:this.time,steps:this.steps,strikes:this.strikes,buckets:[...this.buckets],supportedMass:this.supportedMass,state:this.state,angles:Object.fromEntries(Object.entries(this.rotors).map(([k,v])=>[k,v.angle])),angularVelocities:Object.fromEntries(Object.entries(this.rotors).map(([k,v])=>[k,v.body.angularVelocity[v.axis]])) };
  }
}
