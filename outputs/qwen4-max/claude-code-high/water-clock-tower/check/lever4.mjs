import * as CANNON from 'cannon-es';
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
const frame = new CANNON.Body({ mass: 0 });
world.addBody(frame);
const lever = new CANNON.Body({ mass: 2.5, position: new CANNON.Vec3(0.92, 4.62, 0.34) });
lever.addShape(new CANNON.Box(new CANNON.Vec3(0.32, 0.035, 0.03)), new CANNON.Vec3(-0.235, -0.23, 0));
world.addBody(lever);
const h = new CANNON.HingeConstraint(frame, lever, {
  pivotA: new CANNON.Vec3(0.92, 4.62, 0.34), pivotB: new CANNON.Vec3(),
  axisA: new CANNON.Vec3(0, 0, 1), axisB: new CANNON.Vec3(0, 0, 1), maxForce: 1e6,
});
world.addConstraint(h);
h.enableMotor(); h.setMotorSpeed(0); h.setMotorMaxForce(1.5);
for (let i = 0; i < 60; i++) {
  lever.torque.z += 6;
  world.step(1 / 60);
  if (i % 10 === 0) console.log(i, 'phi', (2 * Math.atan2(lever.quaternion.z, lever.quaternion.w) * 180 / Math.PI).toFixed(2), 'w', lever.angularVelocity.z.toFixed(3));
}
