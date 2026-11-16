import * as CANNON from 'cannon-es';
function run(useMotor, maxForce) {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
  const frame = new CANNON.Body({ mass: 0 });
  world.addBody(frame);
  const lever = new CANNON.Body({ mass: 2.5, position: new CANNON.Vec3(0, 0, 0) });
  lever.addShape(new CANNON.Box(new CANNON.Vec3(0.32, 0.035, 0.03)), new CANNON.Vec3(-0.235, -0.23, 0));
  world.addBody(lever);
  const h = new CANNON.HingeConstraint(frame, lever, {
    pivotA: new CANNON.Vec3(), pivotB: new CANNON.Vec3(),
    axisA: new CANNON.Vec3(0, 0, 1), axisB: new CANNON.Vec3(0, 0, 1), maxForce: 1e6,
  });
  world.addConstraint(h);
  if (useMotor) { h.enableMotor(); h.setMotorSpeed(0); h.setMotorMaxForce(maxForce); }
  for (let i = 0; i < 30; i++) { lever.torque.z += 6; world.step(1 / 60); }
  return (2 * Math.atan2(lever.quaternion.z, lever.quaternion.w) * 180 / Math.PI).toFixed(2);
}
console.log('no motor:', run(false, 0));
console.log('motor 1.5:', run(true, 1.5));
console.log('motor 0.01:', run(true, 0.01));
console.log('motor 1e6:', run(true, 1e6));
