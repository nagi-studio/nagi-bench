// ============================================================================
// 第一人称手持武器模型 —— 纯几何体，每把枪独立剪影
// ============================================================================
import * as THREE from 'three';
import type { WeaponId } from '../types';

const DARK = new THREE.MeshStandardMaterial({ color: 0x333338, roughness: 0.7, metalness: 0.35 });
const WOOD = new THREE.MeshStandardMaterial({ color: 0x8a6840, roughness: 0.8, metalness: 0.05 });
const METAL = new THREE.MeshStandardMaterial({ color: 0x55555e, roughness: 0.4, metalness: 0.8 });
const SKIN = new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: 0.9 });
const SLEEVE_T = new THREE.MeshStandardMaterial({ color: 0xd9c08a, roughness: 0.9 });
const SLEEVE_CT = new THREE.MeshStandardMaterial({ color: 0x3f5d8f, roughness: 0.9 });
const BLADE = new THREE.MeshStandardMaterial({ color: 0xc8ccd4, roughness: 0.25, metalness: 0.9 });
const C4 = new THREE.MeshStandardMaterial({ color: 0x3a3f34, roughness: 0.7 });

export interface ViewModel {
  group: THREE.Group;
  muzzle: THREE.Object3D;
  kick: (amt: number) => void;
  update: (dt: number, moving: number, reloading: boolean, reloadT: number, switching: boolean, switchT: number, time: number, zoomed: boolean, attacking: number) => void;
}

function b(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}
function cyl(r: number, len: number, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  return m;
}

function buildArms(team: 'T' | 'CT'): THREE.Group {
  const g = new THREE.Group();
  const sleeve = team === 'T' ? SLEEVE_T : SLEEVE_CT;
  // 右前臂 + 手
  const fore = b(0.1, 0.34, 0.11, sleeve, 0, 0, 0);
  fore.position.set(0.02, -0.12, 0.22);
  fore.rotation.x = -0.9;
  const hand = b(0.09, 0.12, 0.16, SKIN, 0, 0, 0);
  hand.position.set(0, -0.2, 0.36);
  hand.rotation.x = -0.2;
  g.add(fore);
  g.add(hand);
  // 左手（托枪）
  const lfore = b(0.09, 0.3, 0.1, sleeve, 0, 0, 0);
  lfore.position.set(-0.02, -0.05, 0.5);
  lfore.rotation.x = -1.15;
  const lhand = b(0.085, 0.1, 0.14, SKIN, 0, 0, 0);
  lhand.position.set(0.06, -0.12, 0.42);
  lhand.rotation.x = -0.3;
  g.add(lfore);
  g.add(lhand);
  return g;
}

export function buildViewModel(id: WeaponId, team: 'T' | 'CT'): ViewModel {
  const group = new THREE.Group();
  const gun = new THREE.Group();
  group.add(gun);
  const arms = buildArms(team);
  group.add(arms);
  const muzzle = new THREE.Object3D();
  gun.add(muzzle);

  switch (id) {
    case 'ak47': {
      gun.add(b(0.055, 0.075, 0.62, DARK, 0, 0, 0.1));
      gun.add(b(0.05, 0.055, 0.26, WOOD, 0, 0.01, 0.42));
      gun.add(b(0.04, 0.05, 0.1, METAL, 0, 0.035, 0.52));
      muzzle.position.set(0, 0.035, 0.62);
      gun.add(b(0.065, 0.16, 0.055, WOOD, 0, -0.085, 0.0));   // 弯弹匣
      gun.add(b(0.05, 0.09, 0.17, WOOD, 0, -0.01, -0.3));      // 枪托
      gun.add(b(0.015, 0.05, 0.03, METAL, 0, 0.075, -0.08));   // 照门
      gun.add(b(0.015, 0.045, 0.02, METAL, 0, 0.07, 0.42));    // 准星
      arms.position.set(0.06, -0.16, 0.05);
      break;
    }
    case 'm4a4': {
      gun.add(b(0.055, 0.07, 0.6, DARK, 0, 0, 0.08));
      gun.add(b(0.05, 0.05, 0.24, DARK, 0, 0.01, 0.4));
      gun.add(b(0.038, 0.038, 0.12, METAL, 0, 0.035, 0.54));
      muzzle.position.set(0, 0.035, 0.64);
      gun.add(b(0.06, 0.08, 0.05, DARK, 0, -0.065, 0.02));     // 弹匣
      gun.add(b(0.05, 0.06, 0.15, DARK, 0, -0.005, -0.28));
      gun.add(b(0.05, 0.03, 0.2, DARK, 0, 0.075, -0.05));      // 提把
      gun.add(b(0.012, 0.04, 0.02, METAL, 0, 0.06, 0.42));
      arms.position.set(0.05, -0.15, 0.06);
      break;
    }
    case 'awp': {
      gun.add(b(0.055, 0.06, 0.66, DARK, 0, 0, 0.05));
      gun.add(b(0.04, 0.04, 0.3, METAL, 0, 0.01, 0.46));
      const muzzleBreak = b(0.05, 0.05, 0.06, METAL, 0, 0.01, 0.62);
      gun.add(muzzleBreak);
      muzzle.position.set(0, 0.01, 0.68);
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.24, 14), METAL);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.075, -0.12);
      gun.add(scope);
      gun.add(b(0.02, 0.02, 0.05, METAL, 0, 0.035, 0.3));      // 镜架
      gun.add(b(0.05, 0.05, 0.06, DARK, 0, -0.04, -0.2));      // 弹匣
      gun.add(b(0.05, 0.075, 0.14, DARK, 0, -0.005, -0.33));
      arms.position.set(0.05, -0.15, 0.04);
      break;
    }
    case 'glock': {
      gun.add(b(0.042, 0.06, 0.2, DARK, 0, 0.02, 0.1));
      gun.add(b(0.04, 0.1, 0.07, DARK, 0, -0.03, 0.0));
      muzzle.position.set(0, 0.03, 0.21);
      arms.position.set(0.04, -0.14, 0.0);
      break;
    }
    case 'usp': {
      gun.add(b(0.042, 0.06, 0.2, DARK, 0, 0.02, 0.1));
      gun.add(cyl(0.02, 0.13, METAL, 0, 0.02, 0.24));
      gun.add(b(0.04, 0.1, 0.07, DARK, 0, -0.03, 0.0));
      muzzle.position.set(0, 0.02, 0.32);
      arms.position.set(0.04, -0.14, 0.0);
      break;
    }
    case 'deagle': {
      gun.add(b(0.048, 0.06, 0.24, METAL, 0, 0.02, 0.08));
      gun.add(b(0.042, 0.11, 0.075, DARK, 0, -0.03, -0.02));
      muzzle.position.set(0, 0.03, 0.22);
      arms.position.set(0.04, -0.14, 0.0);
      break;
    }
    case 'knife': {
      const blade = b(0.03, 0.26, 0.045, BLADE, 0, 0, 0);
      blade.position.set(0, 0.16, 0.15);
      gun.add(blade);
      gun.add(b(0.034, 0.11, 0.05, DARK, 0, 0, 0.03));
      arms.position.set(0.04, -0.14, -0.02);
      muzzle.position.set(0, 0.2, 0.15);
      break;
    }
    case 'c4': {
      gun.add(b(0.24, 0.13, 0.32, C4, 0, 0, 0.1));
      gun.add(b(0.09, 0.06, 0.09, METAL, 0, 0.09, 0.12));
      gun.add(b(0.04, 0.03, 0.04, DARK, 0, 0.13, 0.12));       // 天线
      arms.position.set(0.05, -0.16, 0.0);
      muzzle.position.set(0, 0, 0.28);
      break;
    }
    default:
      gun.add(b(0.05, 0.07, 0.5, DARK, 0, 0, 0.1));
      muzzle.position.set(0, 0.04, 0.4);
  }

  // 整体姿态：右手持枪、准星对齐屏幕中心略偏下
  group.position.set(0.21, -0.2, -0.42);
  group.rotation.y = 0.02;

  let kickAmt = 0;
  let kickX = 0;
  return {
    group,
    muzzle,
    kick: (amt: number) => {
      kickAmt = Math.min(0.08, kickAmt + amt);
      kickX = (Math.random() - 0.5) * 0.02;
    },
    update: (dt, moving, reloading, reloadT, switching, switchT, time, zoomed, attacking) => {
      if (zoomed) { group.visible = false; return; }
      group.visible = true;
      // 换弹：下翻
      let ry = 0, rz = 0, rx = 0, py = group.position.y;
      if (reloading) {
        const t = Math.min(1, reloadT / 0.35);
        rx = -t * 1.1;
        py = -0.2 - t * 0.14;
      }
      // 切枪：从下方滑入
      if (switching) {
        const t = 1 - Math.min(1, switchT / 0.3);
        py += -0.45 * t;
        rx += -0.5 * t;
      }
      // 刀攻击挥砍
      if (attacking > 0) {
        rx += Math.sin(attacking * Math.PI) * 0.9;
        ry += Math.sin(attacking * Math.PI) * 0.4;
      }
      // 后坐
      kickAmt = Math.max(0, kickAmt - dt * 0.35);
      const kz = kickAmt * 4.5;
      const krx = kickAmt * 2.2 + kickX;
      // 移动晃动
      const bob = Math.sin(time * 9.5) * moving * 0.008;
      const sway = Math.cos(time * 7.3) * moving * 0.006;
      group.position.set(0.21 + sway, py + bob - kickAmt * 0.2, -0.42 + kz);
      group.rotation.set(rx + krx + bob * 1.6, 0.02 + ry, rz + sway * 1.2);
    },
  };
}
