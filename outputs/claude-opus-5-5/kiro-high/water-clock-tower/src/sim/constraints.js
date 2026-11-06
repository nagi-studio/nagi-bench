// 自定义约束：齿轮啮合（角度比例）与铰链角度限位
// 二者都直接作为方程交给 cannon-es 的约束求解器，由求解器实时计算受力。
import { Constraint, Equation, Quaternion, Vec3 } from 'cannon-es';

const tmpQ = new Quaternion();
const tmpV = new Vec3();

/** 跟踪刚体绕某一世界轴的累计转角（连续展开，不在 ±π 处跳变）。 */
export class AngleTracker {
  constructor(body, worldAxis) {
    this.body = body;
    this.axis = new Vec3(...worldAxis).unit();
    this.q0inv = body.quaternion.inverse();
    this.prevRaw = 0;
    this.turns = 0;
    this.angle = 0;
    this.stamp = -1;
  }
  update(stamp) {
    if (stamp === this.stamp) return this.angle;
    this.stamp = stamp;
    this.body.quaternion.mult(this.q0inv, tmpQ);
    const d = tmpQ.x * this.axis.x + tmpQ.y * this.axis.y + tmpQ.z * this.axis.z;
    let raw = 2 * Math.atan2(d, tmpQ.w); // (-2π, 2π]
    // 归一到 (-π, π]
    if (raw > Math.PI) raw -= 2 * Math.PI;
    if (raw <= -Math.PI) raw += 2 * Math.PI;
    const diff = raw - this.prevRaw;
    if (diff > Math.PI) this.turns -= 1;
    else if (diff < -Math.PI) this.turns += 1;
    this.prevRaw = raw;
    this.angle = raw + this.turns * 2 * Math.PI;
    return this.angle;
  }
  /** 当前世界角速度在跟踪轴上的分量 */
  omega() {
    const w = this.body.angularVelocity;
    return w.x * this.axis.x + w.y * this.axis.y + w.z * this.axis.z;
  }
}

class AngularEquation extends Equation {
  constructor(bi, bj, minF, maxF) {
    super(bi, bj, minF, maxF);
    this.g = 0;
  }
  computeB(h) {
    const GW = this.computeGW();
    const GiMf = this.computeGiMf();
    return -this.g * this.a - GW * this.b - h * GiMf;
  }
}

let globalStamp = 0;
export function nextStamp() {
  globalStamp += 1;
  return globalStamp;
}
export function currentStamp() {
  return globalStamp;
}

/**
 * 齿轮约束：θB = ratio · θA（θ 为各自绕自身轴的转角）。
 * 方程 C = θB − ratio·θA = 0，雅可比 G = [0, −ratio·nA, 0, nB]。
 */
export class GearConstraint extends Constraint {
  constructor(trackerA, trackerB, ratio, { maxForce = 2e5, dt = 1 / 120 } = {}) {
    super(trackerA.body, trackerB.body, { collideConnected: false });
    this.ta = trackerA;
    this.tb = trackerB;
    this.ratio = ratio;
    this.offset = trackerB.angle - ratio * trackerA.angle;
    const eq = new AngularEquation(trackerA.body, trackerB.body, -maxForce, maxForce);
    eq.setSpookParams(5e7, 3, dt);
    this.eq = eq;
    this.equations.push(eq);
  }
  update() {
    const s = currentStamp();
    const a = this.ta.update(s);
    const b = this.tb.update(s);
    const eq = this.eq;
    eq.jacobianElementA.spatial.set(0, 0, 0);
    eq.jacobianElementB.spatial.set(0, 0, 0);
    // 各轴由铰链固定在世界中，直接使用跟踪轴方向
    this.ta.axis.scale(-this.ratio, eq.jacobianElementA.rotational);
    eq.jacobianElementB.rotational.copy(this.tb.axis);
    eq.g = b - this.ratio * a - this.offset;
  }
}

/**
 * 相对转角限位：low ≤ θB − θA ≤ high（两刚体绕同一世界方向的轴转动，B 铰接在 A 上）。
 * 只在接近限位时启用单向方程，相当于"挡块"。
 */
export class AngleLimitConstraint extends Constraint {
  constructor(trackerA, trackerB, low, high, { maxForce = 1e5, dt = 1 / 120, margin = 0.04 } = {}) {
    super(trackerA.body, trackerB.body, { collideConnected: false });
    this.ta = trackerA;
    this.tb = trackerB;
    this.low = low;
    this.high = high;
    this.margin = margin;
    this.base = trackerB.angle - trackerA.angle;
    this.lowEq = new AngularEquation(trackerA.body, trackerB.body, 0, maxForce);
    this.highEq = new AngularEquation(trackerA.body, trackerB.body, 0, maxForce);
    this.lowEq.setSpookParams(2e7, 3, dt);
    this.highEq.setSpookParams(2e7, 3, dt);
    this.equations.push(this.lowEq, this.highEq);
    this.rel = 0;
    this.atLow = false;
    this.atHigh = false;
  }
  update() {
    const s = currentStamp();
    const rel = this.tb.update(s) - this.ta.update(s) - this.base;
    this.rel = rel;
    const n = this.ta.axis;
    const lo = this.lowEq;
    const hi = this.highEq;
    const cLow = rel - this.low;
    const cHigh = this.high - rel;
    lo.enabled = cLow < this.margin;
    hi.enabled = cHigh < this.margin;
    this.atLow = cLow < 0.004;
    this.atHigh = cHigh < 0.004;
    if (lo.enabled) {
      lo.jacobianElementA.spatial.set(0, 0, 0);
      lo.jacobianElementB.spatial.set(0, 0, 0);
      n.scale(-1, lo.jacobianElementA.rotational);
      lo.jacobianElementB.rotational.copy(n);
      lo.g = cLow;
    }
    if (hi.enabled) {
      hi.jacobianElementA.spatial.set(0, 0, 0);
      hi.jacobianElementB.spatial.set(0, 0, 0);
      hi.jacobianElementA.rotational.copy(n);
      n.scale(-1, hi.jacobianElementB.rotational);
      hi.g = cHigh;
    }
  }
}
