import * as THREE from 'three';

export type CameraMode = 'director' | 'sniper_ads' | 'bullet_cam' | 'station_cam' | 'orbit_overview';

export interface SceneMeta {
  id: number;
  name: string;
  enName: string;
  timeRange: [number, number];
  quoteZh: string;
  quoteEn: string;
}

export const SCENES: SceneMeta[] = [
  {
    id: 1,
    name: '密谋 · 老航天派会议',
    enName: 'The Meeting / Aerospace Conservatives',
    timeRange: [0.0, 0.22],
    quoteZh: '老航天派的保守路线将把人类锁死在低地轨道。要让人类舰队真正驶向星海，必须彻底清除工质推进的拥趸。',
    quoteEn: 'The aerospace conservatives will trap humanity in low Earth orbit. To sail the sea of stars, chemical propulsion advocates must be removed.'
  },
  {
    id: 2,
    name: '潜伏 · 绝对静默',
    enName: 'Cold Space Stealth / Infiltration',
    timeRange: [0.22, 0.44],
    quoteZh: '章北海静静地悬浮在离空间站三千米的漆黑虚空中，隐形舱外航天服吸收了所有电磁信号，宛如一粒无生命的太空尘埃。',
    quoteEn: 'Zhang Beihai floated silently in the void three kilometers out. His stealth EVA suit absorbed all radar, rendering him lifeless space dust.'
  },
  {
    id: 3,
    name: '击发 · 陨石弹刺向真空',
    enName: 'The Silent Shot / Hypervelocity Release',
    timeRange: [0.44, 0.65],
    quoteZh: '枪管无声地吐出一束细小的冷气。三枚用石铁陨石精工打磨的子弹，在绝对静默的真空中，以每秒几十公里的速度刺向空间站。',
    quoteEn: 'The barrel silently hissed cold gas. Three machined stony-iron meteorite bullets darted through vacuum at hypervelocity toward the station.'
  },
  {
    id: 4,
    name: '贯穿 · 灾难性减压',
    enName: 'Catastrophic Impact & Decompression',
    timeRange: [0.65, 0.85],
    quoteZh: '没有火焰，没有爆炸声。超高速陨石弹瞬间贯穿了会议室的双层耐压外壳，剧烈的减压风暴和绝对零度的严寒瞬间吞噬了一切。',
    quoteEn: 'No flame, no sound. Hypervelocity meteorites pierced the double hull. Violent decompression and abyssal vacuum cold devoured all within.'
  },
  {
    id: 5,
    name: '撤离 · 星海新纪元',
    enName: 'Cold Extraction / The Broken Lock',
    timeRange: [0.85, 1.0],
    quoteZh: '他收起武器，微调姿态喷气，缓缓滑向预定的返回路线。人类通往辐射驱动与恒星级飞船的死结，已被无声解开。',
    quoteEn: 'He stowed the rifle, pulsed a thruster, and glided back. The knot blocking radiation propulsion and starships was silently severed.'
  }
];

export class DirectorCamera {
  public camera: THREE.PerspectiveCamera;
  public cameraMode: CameraMode = 'director';
  
  private currentCamPos = new THREE.Vector3();
  private currentLookAt = new THREE.Vector3();
  private targetCamPos = new THREE.Vector3();
  private targetLookAt = new THREE.Vector3();
  private shakeIntensity: number = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 3000);
    this.camera.position.set(0, 70, 180);
    this.camera.lookAt(0, 50, 0);
    this.currentCamPos.copy(this.camera.position);
    this.currentLookAt.set(0, 50, 0);
  }

  public updateAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public getActiveScene(progress: number): SceneMeta {
    const clamped = Math.max(0, Math.min(1, progress));
    for (const sc of SCENES) {
      if (clamped >= sc.timeRange[0] && clamped <= sc.timeRange[1]) {
        return sc;
      }
    }
    return SCENES[SCENES.length - 1];
  }

  public triggerImpactShake(amount: number = 1.0): void {
    this.shakeIntensity = amount;
  }

  public update(
    progress: number,
    deltaTime: number,
    stationTarget: THREE.Vector3,
    sniperPos: THREE.Vector3,
    muzzlePos: THREE.Vector3,
    bulletPos?: THREE.Vector3
  ): void {
    const clampedProgress = Math.max(0, Math.min(1, progress));

    if (this.cameraMode === 'sniper_ads') {
      // Zhang Beihai ADS reticle view through the sniper holographic scope
      this.targetCamPos.set(sniperPos.x + 0.6, sniperPos.y + 3.45, sniperPos.z - 0.4);
      this.targetLookAt.copy(stationTarget);
      this.camera.fov = 22; // High-zoom sniper optics
      this.camera.updateProjectionMatrix();

    } else if (this.cameraMode === 'bullet_cam' && bulletPos) {
      // Third-person chase cam tightly tracking the hypervelocity meteorite projectile
      const forwardDir = new THREE.Vector3().subVectors(stationTarget, sniperPos).normalize();
      this.targetCamPos.copy(bulletPos).add(new THREE.Vector3(1.2, 0.8, 4.0));
      this.targetLookAt.copy(bulletPos).add(forwardDir.clone().multiplyScalar(15));
      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();

    } else if (this.cameraMode === 'station_cam') {
      // Close inspection of the conference room module and impact site
      this.targetCamPos.set(stationTarget.x + 24, stationTarget.y + 12, stationTarget.z + 28);
      this.targetLookAt.copy(stationTarget);
      this.camera.fov = 48;
      this.camera.updateProjectionMatrix();

    } else if (this.cameraMode === 'orbit_overview') {
      // Wide orbital panorama capturing Earth, space elevator, station, and deep void
      this.targetCamPos.set(380, 260, 620);
      this.targetLookAt.set(0, 0, 0);
      this.camera.fov = 55;
      this.camera.updateProjectionMatrix();

    } else {
      // Director's Cut: Cinematic scripted timeline choreography
      this.camera.fov = 48;
      this.camera.updateProjectionMatrix();

      if (clampedProgress < 0.22) {
        // Scene 1: Orbiting around Space Elevator Terminal & Conference Dome
        const t = clampedProgress / 0.22;
        const orbitAngle = t * Math.PI * 0.8 + 0.3;
        const radius = 65 - t * 15;
        this.targetCamPos.set(
          Math.cos(orbitAngle) * radius,
          stationTarget.y + 10 + Math.sin(t * Math.PI) * 6,
          Math.sin(orbitAngle) * radius
        );
        this.targetLookAt.copy(stationTarget);

      } else if (clampedProgress < 0.44) {
        // Scene 2: Pull out to 3km void to reveal Zhang Beihai in stealth EVA suit
        const t = (clampedProgress - 0.22) / 0.22;
        // Slow cinematic pan around Zhang Beihai
        const angle = -Math.PI / 4 + t * 0.6;
        this.targetCamPos.set(
          sniperPos.x + Math.sin(angle) * 9,
          sniperPos.y + 2.5 + Math.cos(t * Math.PI) * 1.5,
          sniperPos.z + Math.cos(angle) * 12
        );
        this.targetLookAt.set(sniperPos.x, sniperPos.y + 2.5, sniperPos.z);

      } else if (clampedProgress < 0.65) {
        // Scene 3: Over-the-shoulder sniper shot, muzzle discharge, tracking bullets
        const t = (clampedProgress - 0.44) / 0.21;
        if (t < 0.4) {
          // Intense over-the-shoulder sniper lock
          this.targetCamPos.set(sniperPos.x + 1.2, sniperPos.y + 3.8, sniperPos.z + 3.2);
          this.targetLookAt.copy(stationTarget);
        } else {
          // Bullet launch tracking shot
          if (bulletPos) {
            this.targetCamPos.copy(bulletPos).add(new THREE.Vector3(2.5, 1.5, 6.0));
            this.targetLookAt.copy(bulletPos);
          } else {
            this.targetCamPos.set(sniperPos.x + 2, sniperPos.y + 3, sniperPos.z - 10);
            this.targetLookAt.copy(stationTarget);
          }
        }

      } else if (clampedProgress < 0.85) {
        // Scene 4: Catastrophic impact on the conference dome
        const t = (clampedProgress - 0.65) / 0.20;
        // Dramatic frontal camera framed on the conference dome window
        const radius = 38 - t * 8;
        this.targetCamPos.set(
          stationTarget.x + Math.sin(t * 0.8) * 15,
          stationTarget.y + 6,
          stationTarget.z + radius
        );
        this.targetLookAt.copy(stationTarget);

      } else {
        // Scene 5: Zhang Beihai drifting away into shadow; sunrise rising over Earth
        const t = (clampedProgress - 0.85) / 0.15;
        this.targetCamPos.set(
          sniperPos.x - 12 - t * 15,
          sniperPos.y + 8,
          sniperPos.z + 18 + t * 10
        );
        this.targetLookAt.set(sniperPos.x, sniperPos.y, sniperPos.z);
      }
    }

    // Smooth camera damping / interpolation
    const dampFactor = Math.min(1.0, deltaTime * 5.0);
    this.currentCamPos.lerp(this.targetCamPos, dampFactor);
    this.currentLookAt.lerp(this.targetLookAt, dampFactor);

    this.camera.position.copy(this.currentCamPos);

    // Apply procedural camera shake if active (e.g. decompression explosion shockwave)
    if (this.shakeIntensity > 0.001) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity * 1.5;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity * 1.5;
      this.camera.position.z += (Math.random() - 0.5) * this.shakeIntensity * 1.5;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - deltaTime * 1.8);
    }

    this.camera.lookAt(this.currentLookAt);
  }
}
