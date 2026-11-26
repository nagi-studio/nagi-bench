import * as THREE from 'three';
import type { HighlightTarget } from '../scene/buildTowerVisuals';

export const FILM_DURATION = 32.0;

export interface CameraKeyframe {
  t: number;
  pos: [number, number, number];
  lookAt: [number, number, number];
}

export interface SubtitleCue {
  start: number;
  end: number;
  act: number; // 0 = intro, 1..5 = causal chain steps
  tag: string;
  text: string;
  highlight: HighlightTarget;
}

export interface CalloutSpec {
  id: string;
  anchorKey: string;
  title: string;
  sub?: string;
  accent?: 'default' | 'water' | 'action';
  start: number;
  end: number;
  offsetY?: number;
}

// Smooth Steadicam keyframes carefully verified to never clip any tower column or roof eave
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // Act 0 (0.0 - 4.2s): Heroic 3/4 establishing portrait of the full Song cutaway tower
  { t: 0.0, pos: [6.4, 5.7, 9.9], lookAt: [0.85, 4.85, -0.45] },
  { t: 3.6, pos: [5.4, 5.2, 8.6], lookAt: [0.95, 4.70, -0.30] },

  // Act 1 (4.2 - 8.8s): Constant-head water supply (天池 -> 平水壶 -> 龙头注口 -> 受水壶)
  { t: 5.2, pos: [4.65, 4.45, 4.15], lookAt: [2.35, 3.88, 0.72] },
  { t: 8.2, pos: [4.25, 4.10, 3.55], lookAt: [2.25, 3.72, 0.72] },

  // Act 2 (8.8 - 16.5s): Hero close-up on 天衡擒纵机构 (Scoop, 枢衡/枢权, 天条, 天衡/左天锁, top spoke)
  { t: 9.8, pos: [2.50, 3.92, 4.95], lookAt: [1.18, 3.65, 0.68] },
  { t: 13.0, pos: [2.15, 3.86, 4.55], lookAt: [1.14, 3.62, 0.68] },
  { t: 16.2, pos: [1.95, 3.88, 4.65], lookAt: [1.10, 3.66, 0.65] },

  // Act 3 (16.5 - 21.8s): Smooth perimeter sweep around front-left into the open cutaway gear meshing zone!
  { t: 17.5, pos: [-2.25, 3.25, 2.85], lookAt: [0.45, 2.55, -0.75] },
  { t: 18.8, pos: [-2.68, 2.68, -0.72], lookAt: [0.50, 2.25, -1.08] },
  { t: 21.3, pos: [-2.48, 3.10, -1.02], lookAt: [0.55, 2.75, -1.35] },

  // Act 4 (21.8 - 27.6s): Crane up & around to the glowing front 报时木阁 (Puppets + Bell + Drum!)
  { t: 22.8, pos: [-1.15, 5.85, 2.85], lookAt: [0.55, 5.88, -0.58] },
  { t: 24.4, pos: [0.48, 6.08, 2.82], lookAt: [0.55, 5.86, -0.55] },
  { t: 27.2, pos: [0.85, 6.06, 2.75], lookAt: [0.55, 5.86, -0.55] },

  // Act 5 (27.6 - 32.0s): Celestial Globe (浑象) & Armillary Sphere (浑仪), pulling out to grand finale!
  { t: 28.6, pos: [-0.25, 8.28, 3.05], lookAt: [0.22, 8.32, -1.38] },
  { t: 30.2, pos: [2.65, 7.65, 6.15], lookAt: [0.65, 6.50, -0.95] },
  { t: 32.0, pos: [6.0, 5.85, 9.75], lookAt: [0.80, 4.90, -0.45] },
];

export const ACT_START_TIMES: Record<number, number> = {
  1: 4.5,
  2: 9.2,
  3: 17.8,
  4: 22.8,
  5: 28.0,
};

export const SUBTITLE_CUES: SubtitleCue[] = [
  {
    start: 2.0,
    end: 4.5,
    act: 0,
    tag: '序 · 北宋机械奇迹',
    text: '九百多年前的北宋，苏颂造出一座全木高塔，仅靠水流就能自动报时。',
    highlight: 'none',
  },
  {
    start: 4.5,
    end: 9.0,
    act: 1,
    tag: '第一步 · 恒压注水',
    text: '平水壶借侧口溢水保持水位恒定，水流以恒定速度注入枢轮的受水壶。',
    highlight: 'water',
  },
  {
    start: 9.0,
    end: 13.0,
    act: 2,
    tag: '第二步 · 天衡擒纵（解锁）',
    text: '水满压过青铜配重，下杠杆下拉「天条」，抬起顶部铜锁——大轮瞬间解锁！',
    highlight: 'escapement',
  },
  {
    start: 13.0,
    end: 16.8,
    act: 2,
    tag: '第二步 · 天衡擒纵（锁止）',
    text: '水重推动大轮迈出精准一步，配重随即回弹落锁，稳稳卡住下一根辐条。',
    highlight: 'escapement',
  },
  {
    start: 16.8,
    end: 22.0,
    act: 3,
    tag: '第三步 · 齿轮传动',
    text: '大轮每迈一步，水平轮轴上的木齿轮啮合拨动竖直「天柱」，将动力传向高层。',
    highlight: 'gears',
  },
  {
    start: 22.0,
    end: 27.6,
    act: 4,
    tag: '第四步 · 木阁报时',
    text: '天柱带动昼夜机轮转出司辰木人，轮缘拨牙弹起木槌，准时敲响钟鼓！',
    highlight: 'pagoda',
  },
  {
    start: 27.6,
    end: 30.2,
    act: 5,
    tag: '第五步 · 浑象观天',
    text: '天柱同时经上层齿轮驱动浑象与顶层浑仪，让时间与星空同频运转。',
    highlight: 'celestial',
  },
  {
    start: 30.2,
    end: 33.5,
    act: 5,
    tag: '水运仪象台 · 传动全景',
    text: '恒压水流 → 天衡擒纵 → 齿轮天柱 → 钟鼓报时：每一环精准驱动下一环。',
    highlight: 'none',
  },
];

export const CALLOUT_SPECS: CalloutSpec[] = [
  // Act 1: Water supply
  {
    id: 'co-pingshuihu',
    anchorKey: 'pingshuihu',
    title: '平水壶',
    sub: '溢水保持水压恒定',
    accent: 'water',
    start: 4.8,
    end: 8.8,
  },
  {
    id: 'co-scoop',
    anchorKey: 'filling_scoop',
    title: '受水壶',
    sub: '匀速接水增重',
    accent: 'water',
    start: 5.2,
    end: 8.9,
  },

  // Act 2: Escapement
  {
    id: 'co-weighbridge',
    anchorKey: 'weighbridge',
    title: '① 枢衡与枢权',
    sub: '水满压过配重下沉',
    accent: 'action',
    start: 9.4,
    end: 16.2,
  },
  {
    id: 'co-pullrod',
    anchorKey: 'pull_rod',
    title: '② 天条',
    sub: '向下拉动上杠杆',
    accent: 'default',
    start: 10.0,
    end: 16.2,
  },
  {
    id: 'co-upperlock',
    anchorKey: 'upper_lock',
    title: '③ 天衡与左天锁',
    sub: '抬起放行 · 回弹卡位',
    accent: 'action',
    start: 10.4,
    end: 16.4,
  },

  // Act 3: Gears & TianZhu
  {
    id: 'co-drivegear',
    anchorKey: 'drive_gear',
    title: '拨牙机轮啮合',
    sub: '水平轴 → 竖直轴 90°传动',
    accent: 'action',
    start: 18.2,
    end: 21.8,
  },
  {
    id: 'co-tianzhu',
    anchorKey: 'tianzhu',
    title: '天柱竖轴',
    sub: '贯通全塔的动力主干',
    accent: 'default',
    start: 18.6,
    end: 21.8,
  },

  // Act 4: Pagoda Timekeeping
  {
    id: 'co-puppet',
    anchorKey: 'puppet_window',
    title: '司辰木人',
    sub: '随昼夜机轮轮转显时',
    accent: 'default',
    start: 22.8,
    end: 27.4,
  },
  {
    id: 'co-bell',
    anchorKey: 'bell',
    title: '青铜报时钟',
    sub: '拨牙弹槌 · 撞击鸣响',
    accent: 'action',
    start: 23.1,
    end: 27.4,
  },
  {
    id: 'co-drum',
    anchorKey: 'drum',
    title: '报时大鼓',
    sub: '拨牙压放 · 应时击鼓',
    accent: 'action',
    start: 23.4,
    end: 27.4,
  },

  // Act 5: Celestial
  {
    id: 'co-globe',
    anchorKey: 'globe',
    title: '浑象（天球仪）',
    sub: '齿轮联动演示星转',
    accent: 'default',
    start: 27.8,
    end: 30.6,
  },
  {
    id: 'co-armillary',
    anchorKey: 'armillary',
    title: '浑仪',
    sub: '随天柱同步观象',
    accent: 'default',
    start: 27.8,
    end: 31.2,
  },
];

function smoothstep5(u: number): number {
  const x = Math.max(0, Math.min(1, u));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

/**
 * Evaluates smooth camera pose at narrative time `t`.
 * After FILM_DURATION (32s), transitions smoothly into a gentle continuous showcase orbit
 * while the live Rapier3D clock continues running!
 */
export function evaluateCameraPose(
  t: number,
  outPos: THREE.Vector3,
  outLookAt: THREE.Vector3
): void {
  if (t <= 0) {
    outPos.set(...CAMERA_KEYFRAMES[0].pos);
    outLookAt.set(...CAMERA_KEYFRAMES[0].lookAt);
    return;
  }

  if (t >= FILM_DURATION) {
    const extra = t - FILM_DURATION;
    const baseAngle = Math.atan2(6.0 - 0.8, 9.75 - -0.45);
    const radius = Math.hypot(6.0 - 0.8, 9.75 - -0.45);
    const angle = baseAngle + extra * 0.14;
    outPos.set(
      0.8 + Math.sin(angle) * radius,
      5.85 + Math.sin(extra * 0.25) * 0.35,
      -0.45 + Math.cos(angle) * radius
    );
    outLookAt.set(0.80, 4.90, -0.45);
    return;
  }

  // Find active keyframe segment
  let idx = 0;
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (t >= CAMERA_KEYFRAMES[i].t && t <= CAMERA_KEYFRAMES[i + 1].t) {
      idx = i;
      break;
    }
  }

  const k0 = CAMERA_KEYFRAMES[Math.max(0, idx - 1)];
  const k1 = CAMERA_KEYFRAMES[idx];
  const k2 = CAMERA_KEYFRAMES[Math.min(CAMERA_KEYFRAMES.length - 1, idx + 1)];
  const k3 = CAMERA_KEYFRAMES[Math.min(CAMERA_KEYFRAMES.length - 1, idx + 2)];

  const segDur = Math.max(0.001, k2.t - k1.t);
  const uRaw = (t - k1.t) / segDur;
  const u = smoothstep5(uRaw);

  // Centripetal-style damped Catmull-Rom blend (smooth curves without overshoot!)
  const catmull = (p0: number, p1: number, p2: number, p3: number, s: number): number => {
    const s2 = s * s;
    const s3 = s2 * s;
    // Reduced tension (0.35) avoids swinging near columns while keeping silky camera arcs
    const m1 = (p2 - p0) * 0.32;
    const m2 = (p3 - p1) * 0.32;
    return (
      (2 * s3 - 3 * s2 + 1) * p1 +
      (s3 - 2 * s2 + s) * m1 +
      (-2 * s3 + 3 * s2) * p2 +
      (s3 - s2) * m2
    );
  };

  tmpPos.set(
    catmull(k0.pos[0], k1.pos[0], k2.pos[0], k3.pos[0], u),
    catmull(k0.pos[1], k1.pos[1], k2.pos[1], k3.pos[1], u),
    catmull(k0.pos[2], k1.pos[2], k2.pos[2], k3.pos[2], u)
  );
  tmpLook.set(
    catmull(k0.lookAt[0], k1.lookAt[0], k2.lookAt[0], k3.lookAt[0], u),
    catmull(k0.lookAt[1], k1.lookAt[1], k2.lookAt[1], k3.lookAt[1], u),
    catmull(k0.lookAt[2], k1.lookAt[2], k2.lookAt[2], k3.lookAt[2], u)
  );

  outPos.copy(tmpPos);
  outLookAt.copy(tmpLook);
}

export function getActiveSubtitle(t: number): SubtitleCue | null {
  for (const cue of SUBTITLE_CUES) {
    if (t >= cue.start && t < cue.end) return cue;
  }
  return null;
}
