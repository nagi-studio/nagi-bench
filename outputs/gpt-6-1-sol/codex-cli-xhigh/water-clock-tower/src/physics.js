import * as C from 'cannon-es';

export const DT = 1 / 120;
export const PITCH = Math.PI * 2 / 36;
export const WHEEL = { x: -.25, y: 2.8, z: .55, r: 1.95, inlet: Math.PI * .75 };
const zAxis = new C.Vec3(0, 0, 1);
const yAxis = new C.Vec3(0, 1, 0);
const cv = a => new C.Vec3(...a);
const wrapped = a => Math.atan2(Math.sin(a), Math.cos(a));
export const angleZ = b => 2 * Math.atan2(b.quaternion.z, b.quaternion.w);

// Bilateral, power-conserving angular gear constraint. All connected shafts
// remain dynamic rigid bodies; the solver distributes the water's torque.
class AngularEquation extends C.Equation {
  constructor(a, b, axisA, axisB, ratio, lock = false) {
    super(a, b, -2e5, 2e5);
    this.jacobianElementA.rotational.copy(axisA);
    this.jacobianElementB.rotational.copy(axisB.scale(ratio));
    this.axisA=axisA.clone();this.axisB=axisB.clone();this.ratio=ratio;
    this.previousA=this.readAngle(a,this.axisA);this.previousB=this.readAngle(b,this.axisB);this.phaseA=0;this.phaseB=0;
    this.lock = lock;
    this.target = 0;
    this.setSpookParams(3e8, 4, DT);
  }
  readAngle(body,axis){const q=body.quaternion;return 2*Math.atan2(q.x*axis.x+q.y*axis.y+q.z*axis.z,q.w);}
  captureRotation(){if(this.lock)return;const a=this.readAngle(this.bi,this.axisA),b=this.readAngle(this.bj,this.axisB);this.phaseA+=wrapped(a-this.previousA);this.phaseB+=wrapped(b-this.previousB);this.previousA=a;this.previousB=b;}
  computeB(h) {
    const g = this.lock ? wrapped(angleZ(this.bi) - this.target) : this.phaseA+this.ratio*this.phaseB;
    return -g * this.a - this.computeGW() * this.b - h * this.computeGiMf();
  }
}
class AngularConstraint extends C.Constraint { update() {for(const e of this.equations)e.captureRotation?.();} }
class SliderEquation extends C.Equation {
  constructor(body,fixed,axis,rotational=false){super(body,fixed,-1e5,1e5);this.axis=axis;this.rest=body.position[axis];this.rotational=rotational;this.jacobianElementA[rotational?'rotational':'spatial'][axis]=1;this.setSpookParams(3e8,4,DT);}
  computeB(h){const g=this.rotational?2*this.bi.quaternion[this.axis]:this.bi.position[this.axis]-this.rest;return -g*this.a-this.computeGW()*this.b-h*this.computeGiMf();}
}
class FollowerEquation extends C.Equation {
  constructor(slider,lever){super(slider,lever,-1e5,1e5);this.jacobianElementA.spatial.y=1;this.setSpookParams(3e7,4,DT);}
  computeB(h){const a=angleZ(this.bj);this.jacobianElementB.rotational.z=.75*Math.cos(a);const g=this.bi.position.y-(3.78-.75*Math.sin(a));return -g*this.a-this.computeGW()*this.b-h*this.computeGiMf();}
}

export class Mechanism {
  constructor(onEvent = () => {}) {
    this.onEvent = onEvent;
    this.world = new C.World({ gravity: new C.Vec3(0, -9.81, 0) });
    this.world.solver.iterations = 64;
    this.world.solver.tolerance = 1e-8;
    this.world.broadphase = new C.SAPBroadphase(this.world);
    this.world.defaultContactMaterial.friction = .12;
    this.world.defaultContactMaterial.restitution = .05;
    this.world.defaultContactMaterial.contactEquationStiffness = 2e7;
    this.fixed = new C.Body({ mass: 0 });
    this.world.addBody(this.fixed);
    this.bodies = {};
    this.water = [];
    this.masses = Array(36).fill(0);
    this.time = 0;
    this.totalAngle = 0;
    this.oldAngle = 0;
    this.tooth = 0;
    this.releases = 0;
    this.locked = true;
    this.nextDrop = 0;
    this.flowEnabled = true;
    this.nextId = 1;
    this.lastStrike = -10;
    this.inletIndex = 0;
    this.load = 0;

    const rotor = this.rotor('wheel', [WHEEL.x,WHEEL.y,WHEEL.z], [0,0,1], .8, .9);
    // The balance has a real hinge, inertia, gravitational counterweight,
    // elastic compliance, and damping. The stop reacts to its deflection.
    const beam = this.rotor('balance', [-2.28,4.02,1.0], [0,0,1], .24, .11);
    this.lockEquation = new AngularEquation(rotor, this.fixed, zAxis, zAxis, -1, true);
    this.lockConstraint = new AngularConstraint(rotor, this.fixed);
    this.lockConstraint.equations.push(this.lockEquation);
    this.world.addConstraint(this.lockConstraint);

    const follower = this.rotor('follower', [1.2,2.8,-.62], [0,0,1], .16, .065);
    const shaft = this.rotor('shaft', [1.2,5.05,0], [0,1,0], .16, .035);
    const idler = this.rotor('idler', [2.5,2.8,-.62], [0,0,1], .1, .022);
    const clock = this.rotor('clock', [3.65,2.8,-.62], [0,0,1], .16, .055);
    const globe = this.rotor('globe', [.2,6.03,0], [0,1,0], .1, .045);
    const polar = [0, Math.cos(.4), Math.sin(.4)];
    const armillary = this.rotor('armillary', [.2,8.65,0], polar, .12, .075);
    const drum = this.rotor('drum', [3.45,4.28,0], [0,1,0], .06, .018);
    const striker = this.rotor('striker', [4.4,3.78,.02], [0,0,1], .10, .045, true);
    striker.quaternion.setFromAxisAngle(zAxis,.2);
    striker.addShape(new C.Box(new C.Vec3(.42,.035,.07)),new C.Vec3(-.30,0,0));
    striker.addShape(new C.Sphere(.12),new C.Vec3(.52,-.03,0));
    // Physical cam pins lift the follower. No timer drives the wooden jack.
    for(let i=0;i<4;i++){
      const a = i * Math.PI/2+Math.PI/4;
      clock.addShape(new C.Sphere(.12),new C.Vec3(Math.cos(a)*.82,Math.sin(a)*.82,.64));
    }
    const camOrientation=new C.Quaternion();camOrientation.setFromEuler(Math.PI/2,0,0);
    clock.addShape(new C.Cylinder(.64,.64,.18,24),new C.Vec3(0,0,.64),camOrientation);
    clock.collisionFilterGroup = 2;
    clock.collisionFilterMask = 2;
    striker.collisionFilterGroup = 2;
    striker.collisionFilterMask = 0;
    const slider=new C.Body({mass:.045,position:new C.Vec3(3.65,3.78-.75*Math.sin(.2),.02),collisionFilterGroup:2,collisionFilterMask:2});
    slider.addShape(new C.Sphere(.18));this.world.addBody(slider);this.bodies.slider=slider;
    const guide=new AngularConstraint(slider,this.fixed,{collideConnected:false});
    for(const axis of ['x','z'])guide.equations.push(new SliderEquation(slider,this.fixed,axis));
    for(const axis of ['x','y','z'])guide.equations.push(new SliderEquation(slider,this.fixed,axis,true));
    this.world.addConstraint(guide);
    const linkage=new AngularConstraint(slider,striker,{collideConnected:false});linkage.equations.push(new FollowerEquation(slider,striker));this.world.addConstraint(linkage);
    const bell = this.rotor('bell', [5.24,3.99,.02], [0,0,1], .2, .04, true);
    bell.addShape(new C.Sphere(.23),new C.Vec3(0,-.30,0));
    bell.collisionFilterGroup = 8;
    bell.collisionFilterMask = 0;
    this.bellTouching=false;
    this.gear(rotor,follower,zAxis,zAxis,.8/.65);
    this.gear(follower,shaft,zAxis,yAxis,1);
    this.gear(follower,idler,zAxis,zAxis,.5/.8);
    this.gear(idler,clock,zAxis,zAxis,.65/.5);
    this.gear(shaft,globe,yAxis,yAxis,.58/.42);
    this.gear(shaft,armillary,yAxis,cv(polar),1.35);
    this.gear(clock,drum,zAxis,yAxis,.75);

    // Basin: droplets continue under gravity after leaving a bucket.
    const basin = new C.Body({ mass:0, position:new C.Vec3(0,.42,.55), collisionFilterGroup:4,collisionFilterMask:4 });
    basin.addShape(new C.Box(new C.Vec3(5,.08,1.5)));
    this.world.addBody(basin);
  }
  rotor(name, position, axis, mass, inertia, collision = false) {
    const body = new C.Body({ mass,position:cv(position),linearDamping:.01,angularDamping:.025,collisionFilterGroup:collision?2:0,collisionFilterMask:collision?2:0 });
    body.addShape(new C.Sphere(.12));
    body.inertia.set(inertia,inertia,inertia);
    body.invInertia.set(1/inertia,1/inertia,1/inertia);
    body.updateInertiaWorld(true);
    this.world.addBody(body);
    const hinge = new C.HingeConstraint(this.fixed,body,{
      pivotA:cv(position), pivotB:new C.Vec3(), axisA:cv(axis),axisB:cv(axis),maxForce:2e5,collideConnected:false,
    });
    this.world.addConstraint(hinge);
    this.bodies[name]=body;
    return body;
  }
  gear(a,b,axisA,axisB,ratio) {
    const constraint = new AngularConstraint(a,b,{collideConnected:false});
    constraint.equations.push(new AngularEquation(a,b,axisA,axisB,ratio));
    this.world.addConstraint(constraint);
  }
  spawnDrop(position, velocity, mass=.009, kind='inlet') {
    const body = new C.Body({mass,position:cv(position),velocity:cv(velocity),linearDamping:.01,collisionFilterGroup:4,collisionFilterMask:4});
    body.addShape(new C.Sphere(kind==='inlet'?.043:.036));
    this.world.addBody(body);
    this.water.push({body,born:this.time,id:this.nextId++,kind});
  }
  step() {
    const rotor=this.bodies.wheel;
    const theta=angleZ(rotor);
    this.totalAngle+=wrapped(theta-this.oldAngle);
    this.oldAngle=theta;
    this.inletIndex=((Math.round(-this.totalAngle/PITCH)%36)+36)%36;
    const beam=this.bodies.balance;
    const beamAngle=angleZ(beam);
    const inletOffset=wrapped(WHEEL.inlet+this.inletIndex*PITCH+this.totalAngle-WHEEL.inlet);
    this.load = Math.abs(inletOffset)<PITCH*.46 ? this.masses[this.inletIndex] : 0;
    // Bucket weight is transmitted to the weighing beam by the idealized
    // support linkage. These are forces, not prescribed positions or speeds.
    beam.torque.z += .60*Math.cos(beamAngle)-this.load*9.81*1.13*Math.cos(beamAngle)-7.5*beamAngle-1.05*beam.angularVelocity.z;
    if(this.locked && beamAngle<-.085 && this.load>.075){
      this.locked=false;
      this.lockEquation.enabled=false;
      this.tooth++;
      this.releases++;
      this.onEvent({type:'release',time:this.time,tooth:this.tooth});
    }
    if(!this.locked && this.totalAngle>=this.tooth*PITCH-.002){
      this.lockEquation.target=this.tooth*PITCH;
      this.lockEquation.enabled=true;
      this.locked=true;
      this.onEvent({type:'tick',time:this.time});
    }
    // Each retained water mass exerts gravity at its actual rotating radius.
    // Water is discharged near the bottom of the wheel, removing that load.
    for(let i=0;i<36;i++){
      const m=this.masses[i]; if(m<=0)continue;
      const a=WHEEL.inlet+i*PITCH+this.totalAngle;
      const x=Math.cos(a)*WHEEL.r,y=Math.sin(a)*WHEEL.r;
      rotor.applyForce(new C.Vec3(0,-m*9.81,0),new C.Vec3(x,y,.02));
      if(Math.sin(a)<-.78){
        if(m>.012){
          this.spawnDrop([WHEEL.x+x,WHEEL.y+y,WHEEL.z],[ -rotor.angularVelocity.z*y,rotor.angularVelocity.z*x-.2,.1],m,'drain');
        }
        this.masses[i]=0;
      }
    }
    rotor.torque.z-=.16*rotor.angularVelocity.z;
    this.bodies.striker.torque.z += .35*(.23-angleZ(this.bodies.striker))-.035*this.bodies.striker.angularVelocity.z;
    this.bodies.bell.torque.z += -.65*Math.sin(angleZ(this.bodies.bell))-.045*this.bodies.bell.angularVelocity.z;
    // A compliant bronze contact avoids an infinitely rigid bell wedging the
    // cam linkage. Equal/opposite spring-damper forces act at the contact;
    // the sound event comes from an approaching physical impact.
    const arm=this.bodies.striker,bell=this.bodies.bell;
    const hr=arm.quaternion.vmult(new C.Vec3(.52,-.03,0));
    const br=bell.quaternion.vmult(new C.Vec3(0,-.30,0));
    const hp=arm.position.vadd(hr),bp=bell.position.vadd(br),normal=hp.vsub(bp);
    const distance=normal.length();normal.scale(1/Math.max(distance,.001),normal);
    const relativeV=arm.angularVelocity.cross(hr).vsub(bell.angularVelocity.cross(br));
    const approach=relativeV.dot(normal),penetration=.35-distance;
    if(penetration>0){
      const magnitude=Math.max(0,32*penetration-.18*approach);
      const force=normal.scale(magnitude);arm.applyForce(force,hr);bell.applyForce(force.negate(),br);
      if(!this.bellTouching&&approach<-.005&&this.time-this.lastStrike>.5){this.lastStrike=this.time;this.onEvent({type:'bell',time:this.time});}
    }
    this.bellTouching=penetration>0;
    if(this.flowEnabled&&this.time>=this.nextDrop){
      this.nextDrop+=.035;
      const n=this.nextId;
      const jitter=Math.sin(n*12.989)*.025;
      this.spawnDrop([-1.629+jitter,5.21,.55+jitter],[0,-.30,0]);
      if(n%4===0)this.spawnDrop([-4.32,5.51,.45],[-.08,-.15,0],.004,'overflow');
      if(n%3===0)this.spawnDrop([-3.45,5.82,.15],[0,-.3,0],.004,'feed');
    }
    this.world.step(DT);
    // Inelastic capture transfers a droplet's mass and momentum to the cup.
    // The only particle position assignments occur at creation.
    for(let i=this.water.length-1;i>=0;i--){
      const p=this.water[i],v=p.body.position;
      if(p.kind==='inlet' && v.y<4.235 && v.y>3.8){
        const j=this.inletIndex;
        this.masses[j]+=p.body.mass;
        const impulse = new C.Vec3(0,p.body.mass*p.body.velocity.y,0);
        rotor.applyImpulse(impulse,new C.Vec3(v.x-WHEEL.x,v.y-WHEEL.y,0));
        this.world.removeBody(p.body);this.water.splice(i,1);
      }else if(this.time-p.born>1.8 || v.y<.49 || (p.kind==='feed'&&v.y<5.7)){
        this.world.removeBody(p.body);this.water.splice(i,1);
      }
    }
    this.time+=DT;
  }
  state(){return {time:this.time,angle:this.totalAngle,load:this.load,locked:this.locked,steps:this.releases,beam:angleZ(this.bodies.balance),vel:this.bodies.wheel.angularVelocity.z};}
}
