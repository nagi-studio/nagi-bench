/**
 * 分镜表：348 秒，四幕。
 * 每镜给出镜头运动、场景可见对象、光照与音效触发点。
 */
export interface Shot {
  id: string
  /** 起止时间（秒） */
  start: number
  end: number
  /** 场景标识 */
  scene: SceneId
  /** 运镜 */
  camera: CamMove
  /** 环境光类型（影响音色） */
  space: 'indoor' | 'vacuum'
  /** 关键帧：相对本镜时长的进度 -> 相机状态 */
  keys: CamKey[]
  /** 音效触发（相对本镜起点秒） */
  sfx?: { at: number; name: string; arg?: string | number }[]
  /** 转场 */
  transition: 'cut' | 'fade' | 'dissolve'
}

export type SceneId =
  | 'starfield'
  | 'ocean'
  | 'deck'
  | 'bridge'
  | 'meting'
  | 'engineRoom'
  | 'corridor'
  | 'hangar'
  | 'escape'
  | 'meteor'
  | 'black'

export interface CamKey {
  /** 0..1，本镜内进度 */
  t: number
  /** 相机位置 */
  p: [number, number, number]
  /** 注视点 */
  l: [number, number, number]
  fov?: number
}

export type CamMove = 'static' | 'push' | 'pull' | 'pan' | 'orbit' | 'crane' | 'handheld'

const S = (
  id: string,
  start: number,
  end: number,
  scene: SceneId,
  camera: CamMove,
  space: 'indoor' | 'vacuum',
  keys: CamKey[],
  transition: Shot['transition'] = 'cut',
  sfx?: Shot['sfx']
): Shot => ({ id, start, end, scene, camera, space, keys, transition, sfx })

export const SHOTS: Shot[] = [
  /* ---------------- 第一幕：水面之上 ---------------- */
  S('s01', 0, 6, 'starfield', 'pull', 'vacuum',
    [{ t: 0, p: [0, 2, 46], l: [0, 0, 0], fov: 40 },
     { t: 1, p: [0, 1, 22], l: [0, 0, 0], fov: 46 }], 'fade',
    [{ at: 0.2, name: 'rumble', arg: 5 }]),

  S('s02', 6, 14, 'starfield', 'orbit', 'vacuum',
    [{ t: 0, p: [14, 4, 26], l: [0, 1, 0], fov: 44 },
     { t: 1, p: [-14, 3, 26], l: [0, 1, 0], fov: 44 }]),

  S('s03', 14, 27, 'ocean', 'crane', 'vacuum',
    [{ t: 0, p: [-30, 18, 34], l: [0, 0, -4], fov: 42 },
     { t: 1, p: [-14, 5, 20], l: [0, 0.6, -2], fov: 48 }]),

  S('s04', 27, 40, 'deck', 'push', 'vacuum',
    [{ t: 0, p: [5.2, 2.0, 9.5], l: [0.4, 1.7, 6.2], fov: 38 },
     { t: 1, p: [3.4, 1.9, 7.4], l: [0.1, 1.72, 5.4], fov: 34 }],
    'dissolve',
    [{ at: 0.4, name: 'suitBreath' }]),

  S('s05', 40, 50, 'deck', 'pan', 'vacuum',
    [{ t: 0, p: [-6.5, 2.2, 8.0], l: [1.5, 1.7, 2.0], fov: 50 },
     { t: 1, p: [5.0, 2.2, 8.4], l: [-1.0, 1.7, 2.0], fov: 50 }],
    'cut',
    [{ at: 0.5, name: 'radioBeep' }]),

  S('s06', 50, 62, 'ocean', 'pull', 'vacuum',
    [{ t: 0, p: [0, 2.4, 12], l: [0, 1.2, -2], fov: 40 },
     { t: 1, p: [0, 9, 30], l: [0, 0.4, -2], fov: 46 }]),

  S('s07', 62, 72, 'bridge', 'push', 'vacuum',
    [{ t: 0, p: [4.2, 2.4, 6.5], l: [0, 1.8, 0], fov: 40 },
     { t: 1, p: [1.6, 2.0, 4.2], l: [0, 1.75, -1], fov: 36 }],
    'cut',
    [{ at: 0.3, name: 'commOpen' }]),

  /* ---------------- 第二幕：面壁者 ---------------- */
  S('s08', 72, 88, 'meting', 'orbit', 'indoor',
    [{ t: 0, p: [8, 2.4, 8], l: [0, 1.5, 0], fov: 42 },
     { t: 1, p: [-7, 2.2, 9], l: [0, 1.5, 0], fov: 42 }],
    'fade',
    [{ at: 0.1, name: 'hatchClose' }, { at: 1.2, name: 'rumble', arg: 3 }]),

  S('s09', 88, 100, 'meting', 'handheld', 'indoor',
    [{ t: 0, p: [-2.6, 1.9, 4.4], l: [0.4, 1.7, 0], fov: 38 },
     { t: 0.5, p: [1.4, 1.85, 4.0], l: [-0.3, 1.7, 0], fov: 38 },
     { t: 1, p: [-1.8, 1.95, 4.6], l: [0.2, 1.7, 0], fov: 38 }]),

  S('s10', 100, 112, 'meting', 'push', 'indoor',
    [{ t: 0, p: [2.8, 1.9, 4.2], l: [0, 1.72, 0], fov: 36 },
     { t: 1, p: [1.0, 1.8, 2.6], l: [0, 1.72, -0.4], fov: 30 }]),

  S('s11', 112, 124, 'meting', 'pan', 'indoor',
    [{ t: 0, p: [-3.4, 2.0, 3.2], l: [2.0, 1.7, -1], fov: 44 },
     { t: 1, p: [3.4, 2.0, 3.2], l: [-2.0, 1.7, -1], fov: 44 }],
    'cut',
    [{ at: 0.6, name: 'impact', arg: 0.3 }]),

  S('s12', 124, 136, 'corridor', 'push', 'indoor',
    [{ t: 0, p: [0, 1.9, 10], l: [0, 1.7, 0], fov: 40 },
     { t: 1, p: [0, 1.9, 4.5], l: [0, 1.7, -2], fov: 38 }],
    'dissolve',
    [{ at: 0.2, name: 'rumble', arg: 4 }]),

  S('s13', 136, 150, 'meting', 'orbit', 'indoor',
    [{ t: 0, p: [6, 2.3, 7], l: [0, 1.5, 0], fov: 44 },
     { t: 1, p: [-6, 2.0, 8], l: [0, 1.5, 0], fov: 44 }]),

  S('s14', 150, 164, 'corridor', 'crane', 'indoor',
    [{ t: 0, p: [3.0, 1.8, 12], l: [-1.5, 1.6, 2], fov: 42 },
     { t: 1, p: [-2.0, 4.4, 15], l: [0, 1.5, 4], fov: 46 }],
    'dissolve',
    [{ at: 0.1, name: 'hatchClose' }]),

  /* ---------------- 第三幕：面壁者号 ---------------- */
  S('s15', 164, 180, 'engineRoom', 'push', 'vacuum',
    [{ t: 0, p: [0, 2.6, 16], l: [0, 2.2, 0], fov: 46 },
     { t: 1, p: [0, 2.2, 6], l: [0, 2.0, -3], fov: 42 }],
    'fade',
    [{ at: 0.4, name: 'engineStart' }, { at: 2.2, name: 'thruster' }]),

  S('s16', 180, 192, 'hangar', 'crane', 'vacuum',
    [{ t: 0, p: [-14, 3.0, 16], l: [0, 2.4, 0], fov: 50 },
     { t: 1, p: [0, 8.5, 22], l: [0, 2.0, 0], fov: 52 }],
    'cut',
    [{ at: 0.3, name: 'depressurize' }]),

  S('s17', 192, 206, 'hangar', 'orbit', 'vacuum',
    [{ t: 0, p: [10, 3.0, 12], l: [0, 2.2, -2], fov: 44 },
     { t: 1, p: [-10, 2.6, 13], l: [0, 2.2, -2], fov: 44 }]),

  S('s18', 206, 220, 'hangar', 'push', 'vacuum',
    [{ t: 0, p: [-3.2, 2.4, 8], l: [0.2, 2.2, 0], fov: 38 },
     { t: 1, p: [-1.0, 2.2, 4.4], l: [0, 2.1, -1], fov: 32 }],
    'dissolve',
    [{ at: 0.5, name: 'suitBreath' }]),

  S('s19', 220, 234, 'bridge', 'static', 'vacuum',
    [{ t: 0, p: [3.6, 2.2, 5.2], l: [0, 1.75, -1.4], fov: 36 },
     { t: 1, p: [3.6, 2.2, 5.2], l: [0, 1.75, -1.4], fov: 36 }],
    'cut',
    [{ at: 0.4, name: 'alarm' }]),

  S('s20', 234, 248, 'corridor', 'push', 'vacuum',
    [{ t: 0, p: [0, 1.9, 12], l: [0, 1.7, -2], fov: 42 },
     { t: 1, p: [0, 1.9, 5], l: [0, 1.7, -3], fov: 38 }]),

  /* ---------------- 第四幕：陨石 ---------------- */
  S('s21', 248, 264, 'escape', 'crane', 'vacuum',
    [{ t: 0, p: [0, 2.0, 20], l: [0, 2.0, 0], fov: 48 },
     { t: 1, p: [0, 10, 30], l: [0, 2.0, 0], fov: 50 }],
    'fade',
    [{ at: 0.3, name: 'engineStart' }, { at: 2.0, name: 'radioBeep' }]),

  S('s22', 264, 280, 'escape', 'orbit', 'vacuum',
    [{ t: 0, p: [12, 3.0, 16], l: [0, 2.0, 0], fov: 44 },
     { t: 1, p: [-12, 3.4, 16], l: [0, 2.0, 0], fov: 44 }],
    'cut',
    [{ at: 0.6, name: 'rumble', arg: 4 }]),

  S('s23', 280, 296, 'starfield', 'push', 'vacuum',
    [{ t: 0, p: [0, 0, 70], l: [0, 0, 0], fov: 40 },
     { t: 1, p: [0, 0, 34], l: [0, 0, 0], fov: 46 }],
    'dissolve',
    [{ at: 0.5, name: 'thruster' }]),

  S('s24', 296, 312, 'starfield', 'orbit', 'vacuum',
    [{ t: 0, p: [26, 6, 30], l: [0, 0, 0], fov: 42 },
     { t: 1, p: [-24, -6, 30], l: [0, 0, 0], fov: 42 }]),

  S('s25', 312, 330, 'meteor', 'pull', 'vacuum',
    [{ t: 0, p: [0, 1.6, 14], l: [0, 1.0, 0], fov: 38 },
     { t: 1, p: [0, 2.6, 40], l: [0, 0.6, 0], fov: 48 }]),

  S('s26', 330, 342, 'black', 'static', 'vacuum',
    [{ t: 0, p: [0, 0, 6], l: [0, 0, 0], fov: 40 },
     { t: 1, p: [0, 0, 6], l: [0, 0, 0], fov: 40 }],
    'dissolve',
    [{ at: 0.4, name: 'rumble', arg: 6 }]),

  S('s27', 342, 348, 'black', 'static', 'vacuum',
    [{ t: 0, p: [0, 0, 6], l: [0, 0, 0], fov: 40 },
     { t: 1, p: [0, 0, 6], l: [0, 0, 0], fov: 40 }],
    'fade')
]

/** 插值取当前镜头 */
export function shotAt(t: number): Shot {
  for (let i = SHOTS.length - 1; i >= 0; i--) {
    if (t >= SHOTS[i].start) return SHOTS[i]
  }
  return SHOTS[0]
}

/** 在镜头内插值相机状态 */
export function cameraAt(shot: Shot, t: number): CamKey {
  const local = Math.max(0, Math.min(1, (t - shot.start) / (shot.end - shot.start)))
  const ks = shot.keys
  if (ks.length === 1) return ks[0]
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i]
    const b = ks[i + 1]
    if (local >= a.t && local <= b.t) {
      const u = (local - a.t) / (b.t - a.t || 1)
      const e = easeInOut(u)
      return {
        t: local,
        p: [
          a.p[0] + (b.p[0] - a.p[0]) * e,
          a.p[1] + (b.p[1] - a.p[1]) * e,
          a.p[2] + (b.p[2] - a.p[2]) * e
        ],
        l: [
          a.l[0] + (b.l[0] - a.l[0]) * e,
          a.l[1] + (b.l[1] - a.l[1]) * e,
          a.l[2] + (b.l[2] - a.l[2]) * e
        ],
        fov: (a.fov ?? 40) + ((b.fov ?? 40) - (a.fov ?? 40)) * e
      }
    }
  }
  return ks[ks.length - 1]
}

function easeInOut(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}
