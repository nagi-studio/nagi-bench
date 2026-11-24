import * as THREE from 'three';

export interface CalloutDef {
  id: string;
  label: string;
  worldPos: [number, number, number];
  accent?: 'water' | 'bell' | 'gold';
  startTime: number;
  endTime: number;
}

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
  stageIndex: number;
  stepBadge: string;
  stepTitle: string;
}

interface CameraKeyframe {
  t: number;
  pos: [number, number, number];
  target: [number, number, number];
}

export const FILM_DURATION = 32.0;

/**
 * 32-second 6-beat cinematic choreography synced to the real-time physics cycles.
 * Camera & subtitles guide the viewer's eye through every physical link in the causal chain.
 */
export class FilmDirector {
  private readonly cameraKeys: CameraKeyframe[] = [
    // Beat 1: Grand Hero Establishing Shot (0 - 4.5s)
    { t: 0.0, pos: [6.8, 6.2, 11.4], target: [0.3, 5.1, -0.5] },
    { t: 4.4, pos: [5.4, 5.5, 9.6], target: [0.6, 4.6, -0.2] },

    // Beat 2: Constant-Head Water Supply & Waiting Scoop (4.5 - 10.5s)
    { t: 5.8, pos: [3.2, 4.7, 5.2], target: [2.05, 4.15, 0.45] },
    { t: 10.2, pos: [2.4, 4.5, 4.6], target: [1.35, 4.05, 0.55] },

    // Beat 3: Tianheng Escapement Trip, Wheel Step & Relock (10.5 - 16.5s)
    { t: 11.4, pos: [1.35, 4.45, 4.55], target: [0.68, 4.15, 0.58] },
    { t: 16.2, pos: [0.65, 4.0, 4.75], target: [0.45, 3.85, 0.45] },

    // Beat 4: 90° Crown Gear Mesh -> Central Vertical Shaft 天柱 (16.5 - 21.5s)
    { t: 17.6, pos: [3.35, 2.95, 2.25], target: [0.0, 2.35, -1.05] },
    { t: 21.2, pos: [2.6, 4.55, 2.6], target: [0.0, 3.8, -1.45] },

    // Beat 5: Timekeeping Pavilion — Wooden Puppets, Bell & Drum (21.5 - 26.8s)
    { t: 22.4, pos: [0.35, 6.55, 4.05], target: [0.0, 6.22, -0.65] },
    { t: 26.5, pos: [-0.85, 6.65, 4.15], target: [0.0, 6.22, -0.65] },

    // Beat 6: Top Celestial Globe & Armillary -> Grand Finale Pull-back (26.8 - 32.0s)
    { t: 27.7, pos: [2.5, 10.2, 3.45], target: [0.0, 9.65, -1.25] },
    { t: 29.5, pos: [4.2, 9.2, 6.4], target: [0.1, 7.6, -0.9] },
    { t: 32.0, pos: [6.4, 6.6, 11.8], target: [0.25, 5.2, -0.6] },
  ];

  private readonly subtitles: SubtitleCue[] = [
    {
      start: 0.0,
      end: 4.5,
      text: '公元1088年，北宋苏颂建成「水运仪象台」——全靠水流驱动，却能分秒不差地自动报时。',
      stageIndex: 0,
      stepBadge: '序',
      stepTitle: '千年水钟全貌',
    },
    {
      start: 4.5,
      end: 7.7,
      text: '① 恒压供水：天池的水经「平水壶」溢流稳压，以恒定流速持续注入枢轮的受水壶。',
      stageIndex: 1,
      stepBadge: '①',
      stepTitle: '平水壶恒流供水',
    },
    {
      start: 7.7,
      end: 10.5,
      text: '此时上方「天锁」死死卡住轮辐，水轮纹丝不动，只在原地静静接水积蓄重量。',
      stageIndex: 1,
      stepBadge: '①',
      stepTitle: '天锁蓄势待发',
    },
    {
      start: 10.5,
      end: 13.7,
      text: '② 天衡擒纵：一旦水满压过配重「天权」，受水壶压下「天衡」杠杆，顶起天锁释放水轮！',
      stageIndex: 2,
      stepBadge: '②',
      stepTitle: '天衡擒纵机构',
    },
    {
      start: 13.7,
      end: 16.5,
      text: '水轮借重力精确前进一步并将水倒空；配重立刻拉回天锁卡住下一格——化流水为等距节拍。',
      stageIndex: 2,
      stepBadge: '②',
      stepTitle: '定步落锁复位',
    },
    {
      start: 16.5,
      end: 21.5,
      text: '③ 齿轮传力：枢轮每走一格，主轴齿轮便拨动下方横向冠轮，把动力沿「天柱」垂直传向高阁。',
      stageIndex: 3,
      stepBadge: '③',
      stepTitle: '齿轮咬合 · 天柱传力',
    },
    {
      start: 21.5,
      end: 26.8,
      text: '④ 木阁报时：立轴带动转盘让木人准时现身举牌；凸轮拨动木槌，靠重力自动撞钟、击鼓报辰！',
      stageIndex: 4,
      stepBadge: '④',
      stepTitle: '木人举牌 · 撞钟击鼓',
    },
    {
      start: 26.8,
      end: 29.8,
      text: '⑤ 天象同步：同一根立轴直抵塔顶，经顶部天轮驱动「浑象」星图球与「浑仪」同步运转。',
      stageIndex: 5,
      stepBadge: '⑤',
      stepTitle: '浑象浑仪 · 天象同步',
    },
    {
      start: 29.8,
      end: 9999,
      text: '一滴恒流，五级联动——水力、擒纵、齿轮、钟鼓与星象合为一体，铸就九百年前的精密奇迹。',
      stageIndex: 0,
      stepBadge: '终',
      stepTitle: '五级联动 · 全塔运转',
    },
  ];

  public readonly callouts: CalloutDef[] = [
    { id: 'tianchi', label: '天池', worldPos: [3.35, 5.55, 0.35], accent: 'water', startTime: 4.6, endTime: 10.3 },
    { id: 'pingshui', label: '平水壶（恒压稳流）', worldPos: [2.56, 4.95, 0.45], accent: 'water', startTime: 4.6, endTime: 10.3 },
    { id: 'shoushui', label: '受水壶', worldPos: [1.72, 3.85, 0.55], accent: 'water', startTime: 5.2, endTime: 16.3 },
    { id: 'tiansuo', label: '天锁（卡住轮辐）', worldPos: [0.18, 4.98, 0.72], accent: 'gold', startTime: 7.7, endTime: 16.3 },
    { id: 'tianheng', label: '天衡杠杆', worldPos: [1.15, 3.55, 0.75], accent: 'gold', startTime: 10.5, endTime: 16.3 },
    { id: 'tianquan', label: '天权配重', worldPos: [0.46, 3.22, 0.75], accent: 'gold', startTime: 10.8, endTime: 16.3 },
    { id: 'gear1', label: '主轴齿轮', worldPos: [0.4, 2.35, -0.65], accent: 'gold', startTime: 16.6, endTime: 21.4 },
    { id: 'gear2', label: '拨牙冠轮', worldPos: [0.45, 2.02, -1.35], accent: 'gold', startTime: 16.6, endTime: 21.4 },
    { id: 'tianzhu', label: '天柱立轴', worldPos: [0.0, 4.2, -1.7], accent: 'gold', startTime: 17.5, endTime: 21.4 },
    { id: 'muren', label: '司辰木人举牌', worldPos: [0.0, 6.85, -0.35], accent: 'gold', startTime: 21.6, endTime: 26.7 },
    { id: 'bell', label: '撞钟报时', worldPos: [-1.62, 6.5, -0.55], accent: 'bell', startTime: 21.8, endTime: 26.7 },
    { id: 'drum', label: '击鼓报时', worldPos: [1.56, 6.35, -0.55], accent: 'bell', startTime: 21.8, endTime: 26.7 },
    { id: 'hunxiang', label: '浑象（星图球）', worldPos: [0.0, 10.12, -0.92], accent: 'gold', startTime: 26.8, endTime: 30.2 },
    { id: 'hunyi', label: '浑仪', worldPos: [0.0, 11.22, -1.7], accent: 'gold', startTime: 26.8, endTime: 30.2 },
  ];

  private calloutElements = new Map<string, HTMLElement>();
  private readonly tmpVec = new THREE.Vector3();

  public mountCallouts(container: HTMLElement): void {
    container.innerHTML = '';
    this.calloutElements.clear();
    for (const c of this.callouts) {
      const el = document.createElement('div');
      el.className = 'callout-tag';
      const accentClass =
        c.accent === 'water' ? ' accent-water' : c.accent === 'bell' ? ' accent-bell' : '';
      el.innerHTML = `<div class="callout-pill${accentClass}">${c.label}</div><div class="callout-stem"></div><div class="callout-dot"></div>`;
      container.appendChild(el);
      this.calloutElements.set(c.id, el);
    }
  }

  public getCueAt(t: number): SubtitleCue {
    for (const s of this.subtitles) {
      if (t >= s.start && t < s.end) return s;
    }
    return this.subtitles[this.subtitles.length - 1];
  }

  public evaluateCamera(t: number, outPos: THREE.Vector3, outTarget: THREE.Vector3): void {
    if (t <= FILM_DURATION) {
      const keys = this.cameraKeys;
      let i = 0;
      while (i < keys.length - 2 && t >= keys[i + 1].t) {
        i++;
      }
      const k0 = keys[i];
      const k1 = keys[i + 1];
      const span = Math.max(0.001, k1.t - k0.t);
      const u = Math.max(0, Math.min(1, (t - k0.t) / span));
      // Smooth quintic easing for museum-grade cinematography
      const e = u * u * u * (u * (u * 6 - 15) + 10);

      outPos.set(
        k0.pos[0] + (k1.pos[0] - k0.pos[0]) * e,
        k0.pos[1] + (k1.pos[1] - k0.pos[1]) * e,
        k0.pos[2] + (k1.pos[2] - k0.pos[2]) * e
      );
      outTarget.set(
        k0.target[0] + (k1.target[0] - k0.target[0]) * e,
        k0.target[1] + (k1.target[1] - k0.target[1]) * e,
        k0.target[2] + (k1.target[2] - k0.target[2]) * e
      );
    } else {
      // After 32s: gentle continuous showcase orbit so the running machine stays alive forever
      const extra = t - FILM_DURATION;
      const baseAngle = Math.atan2(6.4, 11.8);
      const a = baseAngle + extra * 0.14;
      const radius = 13.4;
      outPos.set(Math.sin(a) * radius, 6.6 + Math.sin(extra * 0.3) * 0.6, Math.cos(a) * radius);
      outTarget.set(0.25, 5.2, -0.6);
    }
  }

  public updateCallouts(t: number, camera: THREE.PerspectiveCamera, width: number, height: number, guidedMode: boolean): void {
    for (const c of this.callouts) {
      const el = this.calloutElements.get(c.id);
      if (!el) continue;

      const active = guidedMode && t >= c.startTime && t <= c.endTime;
      if (!active) {
        el.classList.remove('visible');
        continue;
      }

      this.tmpVec.set(c.worldPos[0], c.worldPos[1], c.worldPos[2]);
      this.tmpVec.project(camera);

      if (this.tmpVec.z > 1 || this.tmpVec.z < -1) {
        el.classList.remove('visible');
        continue;
      }

      const x = (this.tmpVec.x * 0.5 + 0.5) * width;
      const y = (-this.tmpVec.y * 0.5 + 0.5) * height;
      if (x < 40 || x > width - 40 || y < 70 || y > height - 110) {
        el.classList.remove('visible');
        continue;
      }

      el.style.left = `${x.toFixed(1)}px`;
      el.style.top = `${y.toFixed(1)}px`;
      el.classList.add('visible');
    }
  }
}
