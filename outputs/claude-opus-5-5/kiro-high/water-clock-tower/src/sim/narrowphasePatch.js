// cannon-es 窄相碰撞的性能补丁：
// 原实现对每一对刚体都会重算复合刚体（枢轮有 64 个形状）全部形状的世界变换。
// 这里改为每个仿真步对每个形状只算一次、且只在包围球相交时才算朝向，逻辑与原实现一致。
import { Body, Quaternion, Vec3 } from 'cannon-es';

const tmpXi = new Vec3();
const tmpXj = new Vec3();
const tmpQi = new Quaternion();
const tmpQj = new Quaternion();

function cacheFor(body) {
  let c = body._xfCache;
  if (!c || c.n !== body.shapes.length) {
    const n = body.shapes.length;
    c = body._xfCache = {
      n,
      ps: Array.from({ length: n }, () => new Vec3()),
      qs: Array.from({ length: n }, () => new Quaternion()),
      pst: new Int32Array(n).fill(-1),
      qst: new Int32Array(n).fill(-1),
    };
  }
  return c;
}

export function patchNarrowphase(world) {
  const np = world.narrowphase;
  let stamp = 0;
  np.getContacts = function getContactsFast(p1, p2, w, result, oldcontacts, frictionResult, frictionPool) {
    this.contactPointPool = oldcontacts;
    this.frictionEquationPool = frictionPool;
    this.result = result;
    this.frictionResult = frictionResult;
    stamp = (stamp + 1) | 0;
    const pos = (b, c, i) => {
      if (c.pst[i] !== stamp) {
        c.pst[i] = stamp;
        const p = c.ps[i];
        b.quaternion.vmult(b.shapeOffsets[i], p);
        p.vadd(b.position, p);
      }
      return c.ps[i];
    };
    const quat = (b, c, i) => {
      if (c.qst[i] !== stamp) {
        c.qst[i] = stamp;
        b.quaternion.mult(b.shapeOrientations[i], c.qs[i]);
      }
      return c.qs[i];
    };
    for (let k = 0, N = p1.length; k !== N; k++) {
      const bi = p1[k];
      const bj = p2[k];
      let bodyContactMaterial = null;
      if (bi.material && bj.material) bodyContactMaterial = w.getContactMaterial(bi.material, bj.material) || null;
      const justTest =
        (bi.type & Body.KINEMATIC && bj.type & Body.STATIC) ||
        (bi.type & Body.STATIC && bj.type & Body.KINEMATIC) ||
        (bi.type & Body.KINEMATIC && bj.type & Body.KINEMATIC);
      const ci = cacheFor(bi);
      const cj = cacheFor(bj);
      for (let i = 0; i < bi.shapes.length; i++) {
        const si = bi.shapes[i];
        const xi0 = pos(bi, ci, i);
        for (let j = 0; j < bj.shapes.length; j++) {
          const sj = bj.shapes[j];
          if (!(si.collisionFilterMask & sj.collisionFilterGroup && sj.collisionFilterMask & si.collisionFilterGroup)) continue;
          const xj0 = pos(bj, cj, j);
          const rr = si.boundingSphereRadius + sj.boundingSphereRadius;
          const dx = xi0.x - xj0.x;
          const dy = xi0.y - xj0.y;
          const dz = xi0.z - xj0.z;
          if (dx * dx + dy * dy + dz * dz > rr * rr) continue;
          let shapeContactMaterial = null;
          if (si.material && sj.material) shapeContactMaterial = w.getContactMaterial(si.material, sj.material) || null;
          this.currentContactMaterial = shapeContactMaterial || bodyContactMaterial || w.defaultContactMaterial;
          const resolver = this[si.type | sj.type];
          if (!resolver) continue;
          const xi = tmpXi.copy(xi0);
          const xj = tmpXj.copy(xj0);
          const qi = tmpQi.copy(quat(bi, ci, i));
          const qj = tmpQj.copy(quat(bj, cj, j));
          let retval = false;
          if (si.type < sj.type) retval = resolver.call(this, si, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest);
          else retval = resolver.call(this, sj, si, xj, xi, qj, qi, bj, bi, si, sj, justTest);
          if (retval && justTest) {
            w.shapeOverlapKeeper.set(si.id, sj.id);
            w.bodyOverlapKeeper.set(bi.id, bj.id);
          }
        }
      }
    }
  };
}
