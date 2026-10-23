/**
 * 构图报告：对每个摄影机设置，把关键被摄对象投影到屏幕（NDC），
 * 检查主体是否在画面里、够不够大。无 GPU 也能验证分镜。
 */
import * as THREE from "three";
import "./fakedom";

const { createCast } = await import("../src/core/cast");
const { makeAlley, makeBase, makeRoom, makeShop } = await import("../src/world/ground");
const { makeSpace, SPACE } = await import("../src/world/space");
const { rig } = await import("../src/core/timeline");

const cast = createCast();
const alley = makeAlley(cast);
const room = makeRoom(cast);
const shop = makeShop(cast);
const base = makeBase(cast);
const space = makeSpace(cast);

// 每个时间点先驱动各环境，让人物与特效处于正确状态
function drive(t: number): void {
  alley.update(t);
  room.update(t);
  shop.update(t);
  base.update(t);
  space.update(t);
}

const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 250000);

function project(point: THREE.Vector3, t: number): { x: number; y: number; size: number; dist: number } | null {
  drive(t);
  rig.apply(camera, t);
  camera.updateMatrixWorld(true);
  const v = point.clone().project(camera);
  const dist = point.distanceTo(camera.position);
  // 估算目标在画面中的高度占比：以 1.8 m 身高为参考
  const angSize = 1.8 / Math.max(0.3, dist);
  const vFov = (camera.fov * Math.PI) / 180;
  const size = angSize / (2 * Math.tan(vFov / 2));
  if (v.z > 1 || v.z < -1) return null;
  return { x: v.x, y: v.y, size, dist };
}

interface Subject {
  name: string;
  at: (t: number) => THREE.Vector3;
}

const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

const alleySubjects: Subject[] = [
  { name: "章北海", at: (t) => alley.zb!.root.position.clone().add(V(0, 1.5, 0)) },
  { name: "红门", at: () => V(-2.6, 1.2, 19.2) },
];

const roomSubjects: Subject[] = [
  { name: "章北海头", at: () => room.zb!.root.position.clone().add(V(0, 1.62, 0)) },
  { name: "举杯的手", at: () => room.zb!.root.position.clone().add(V(-0.2, 1.35, -0.1)) },
  { name: "收藏者头", at: () => room.collector!.root.position.clone().add(V(0, 1.56, 0)) },
  { name: "茶几", at: () => V(0.3, 0.5, 0.75) },
  { name: "托盘陨石", at: () => V(1.75, 1.05, -2.0) },
  { name: "左柜", at: () => V(-3.25, 1.2, -1.9) },
];

const shopSubjects: Subject[] = [
  { name: "章北海头", at: (t) => shop.zb!.root.position.clone().add(V(0, 1.62, 0)) },
  { name: "主轴", at: () => V(0.25, 1.6, -1.5) },
  { name: "36圆柱", at: () => V(3.8, 1.0, 2.0) },
  { name: "刀具罐子", at: () => V(4.35, 1.0, 1.65) },
  { name: "屏幕", at: () => V(2.7, 1.45, -1.0) },
];

const baseSubjects: Subject[] = [
  { name: "章北海头", at: (t) => base.zb!.root.position.clone().add(V(0, 1.62, 0)) },
  { name: "掌心", at: (t) => base.zb!.root.position.clone().add(V(0, 1.15, -0.3)) },
  { name: "桌面子弹", at: () => V(0.0, 1.0, -0.5) },
  { name: "布包", at: () => V(1.95, 0.35, -1.55) },
  { name: "吊灯", at: () => V(0, 1.85, 0.15) },
];

const spaceSubjects: Subject[] = [
  { name: "章北海", at: () => cast.zbSpace.root.position.clone().add(V(0, 1.0, 0)) },
  { name: "合影群", at: () => V(-265, -504, 55) },
  { name: "轮站", at: () => V(0, 0, -400) },
  { name: "舱门", at: () => V(-265, -352, -400) },
  { name: "地球顶点", at: () => V(0, -2400, 0) },
  { name: "船坞", at: () => V(-3600, 500, -5600) },
];

function report(title: string, times: number[], subjects: Subject[]): void {
  console.log(`\n=== ${title} ===`);
  for (const t of times) {
    console.log(`-- t=${t}s`);
    drive(t);
    for (const s of subjects) {
      const p = project(s.at(t), t);
      if (!p) {
        console.log(`   ${s.name}: 不可见(背后)`);
        continue;
      }
      const inFrame = Math.abs(p.x) < 1 && Math.abs(p.y) < 1;
      const mark = !inFrame ? "✗" : p.size < 0.04 ? "△" : "✓";
      console.log(
        `   ${mark} ${s.name}: ndc=(${p.x.toFixed(2)},${p.y.toFixed(2)}) dist=${p.dist.toFixed(1)} 高度占比=${(p.size * 100).toFixed(1)}%`,
      );
    }
  }
}

report("胡同", [13.5, 19, 22.5], alleySubjects);
report("老宅", [26, 33, 40, 47, 55, 65, 75, 88, 95], roomSubjects);
report("车间", [98, 105, 113, 120], shopSubjects);
report("地下室", [124, 130, 137, 146, 151, 157], baseSubjects);
spaceSubjects.push(
  { name: "太阳", at: (t) => space.sunDir.clone().multiplyScalar(30000).add(V(0, -800, 0)) },
  { name: "父星", at: () => V(-21700, -1240, -58256) },
);
report("太空", [162, 177, 184, 200, 208, 215, 228, 240, 252, 260, 265.8, 275, 285, 296, 306, 320, 327], spaceSubjects);
void SPACE;
