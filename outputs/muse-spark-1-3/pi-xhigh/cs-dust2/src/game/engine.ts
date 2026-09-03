import * as THREE from 'three';
import {
  WALLS, T_SPAWN, CT_SPAWN, SITE_A, SITE_B, WAYPOINTS,
  hasLOS, pointBlocked, inRect,
} from './map';
import {
  AK47, M4A4, AWP, GLOCK, USP, DEAGLE, KNIFE,
  cloneWeapon, calcDamage,
} from './weapons';
import { makeMind, acquire, stepAlong, type BotMind } from './bots';
import { SoundBank } from './audio';
import type { FighterState, HitZone, HudState, KillMsg, Team, WeaponDef } from './types';

interface Actor {
  f: FighterState;
  g: THREE.Group;
  parts: Map<THREE.Object3D, HitZone>;
  mind: BotMind | null;
  ammo: number;
  reserve: number;
  cool: number;
  reloading: number;
  burst: number;
  seen: boolean;
  stepT: number;
}

const EYE = 1.62;
const GRAV = 20;

export class Engine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private cb: (h: HudState) => void;
  private snd = new SoundBank();
  private actors: Actor[] = [];
  private me = 0;
  private keys = new Set<string>();
  private firing = false;
  private scoped = false;
  private yaw = 0;
  private pitch = 0;
  private vy = 0;
  private grounded = true;
  private bloom = 0;
  private round = 0;
  private scoreCT = 0;
  private scoreT = 0;
  private phase: 'freeze' | 'live' | 'over' = 'freeze';
  private phaseT = 0;
  private roundT = 0;
  private bombPlanted = false;
  private bombX = 0;
  private bombZ = 0;
  private bombT = 0;
  private planting = 0;
  private defusing = 0;
  private kills: KillMsg[] = [];
  private msg = '';
  private msgT = 0;
  private raf = 0;
  private last = 0;
  private hudT = 0;
  private over = false;
  private bombMesh: THREE.Mesh | null = null;

  constructor(private canvas: HTMLCanvasElement, cb: (h: HudState) => void) {
    this.cb = cb;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(canvas.clientWidth || 800, canvas.clientHeight || 600);
    this.renderer.shadowMap.enabled = true;
    this.camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 300);
    this.scene.background = new THREE.Color(0x9fc3e0);
    this.scene.fog = new THREE.Fog(0x9fc3e0, 40, 140);
    this.buildLights();
    this.buildMap();
    this.nextRound(true);
    this.bind(canvas);
    this.last = performance.now();
    const loop = (t: number) => {
      if (this.over) return;
      this.tick((t - this.last) / 1000);
      this.last = t;
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy(): void {
    this.over = true;
    cancelAnimationFrame(this.raf);
    this.renderer.dispose();
  }

  // ---------- setup ----------
  private buildLights(): void {
    this.scene.add(new THREE.AmbientLight(0xcfd8ff, 0.75));
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.4);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.camera.left = -45; sun.shadow.camera.right = 45;
    sun.shadow.camera.top = 45; sun.shadow.camera.bottom = -45;
    this.scene.add(sun);
  }

  private mat(color: number): THREE.MeshLambertMaterial {
    return new THREE.MeshLambertMaterial({ color });
  }

  private buildMap(): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(64, 64),
      new THREE.MeshLambertMaterial({ color: 0xc2a878 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(32, 0, 32);
    ground.receiveShadow = true;
    this.scene.add(ground);
    const wallM = this.mat(0xb09a72);
    const crateM = this.mat(0x7a5c38);
    for (const w of WALLS) {
      const minx = Math.min(w.x1, w.x2), maxx = Math.max(w.x1, w.x2);
      const minz = Math.min(w.z1, w.z2), maxz = Math.max(w.z1, w.z2);
      const sx = Math.max(maxx - minx, 0.3), sz = Math.max(maxz - minz, 0.3);
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(sx, w.h, sz),
        w.h < 2 ? crateM : wallM,
      );
      m.position.set((minx + maxx) / 2, w.h / 2, (minz + maxz) / 2);
      m.castShadow = true; m.receiveShadow = true;
      this.scene.add(m);
    }
    // site decals
    const decal = (r: typeof SITE_A, c: number, label: string) => {
      const g = new THREE.Mesh(
        new THREE.PlaneGeometry(r.x2 - r.x1, r.z2 - r.z1),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.25 }),
      );
      g.rotation.x = -Math.PI / 2;
      g.position.set((r.x1 + r.x2) / 2, 0.02, (r.z1 + r.z2) / 2);
      this.scene.add(g);
      const cv = document.createElement('canvas');
      cv.width = 128; cv.height = 128;
      const g2 = cv.getContext('2d') as CanvasRenderingContext2D;
      g2.fillStyle = '#ffffff'; g2.font = 'bold 84px sans-serif';
      g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText(label, 64, 68);
      const tex = new THREE.CanvasTexture(cv);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.9 }));
      sp.scale.set(3, 3, 1);
      sp.position.set((r.x1 + r.x2) / 2, 4, (r.z1 + r.z2) / 2);
      this.scene.add(sp);
    };
    decal(SITE_A, 0x3fae5f, 'A');
    decal(SITE_B, 0x3fae5f, 'B');
  }

  private humanoid(team: Team): { g: THREE.Group; parts: Map<THREE.Object3D, HitZone> } {
    const g = new THREE.Group();
    const parts = new Map<THREE.Object3D, HitZone>();
    const skin = team === 'CT' ? 0x2e5fa3 : 0xa3803a;
    const cloth = team === 'CT' ? 0x24467c : 0x7d6230;
    const add = (geo: THREE.BufferGeometry, color: number, x: number, y: number, z: number, zone: HitZone) => {
      const m = new THREE.Mesh(geo, this.mat(color));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.userData.zone = zone;
      g.add(m);
      parts.set(m, zone);
      return m;
    };
    add(new THREE.BoxGeometry(0.34, 0.36, 0.34), 0xd8b08c, 0, 1.62, 0, 'head');
    add(new THREE.BoxGeometry(0.4, 0.1, 0.4), skin, 0, 1.44, 0, 'head');
    add(new THREE.BoxGeometry(0.62, 0.7, 0.36), cloth, 0, 1.05, 0, 'chest');
    add(new THREE.BoxGeometry(0.55, 0.35, 0.32), cloth, 0, 0.55, 0, 'belly');
    add(new THREE.BoxGeometry(0.16, 0.62, 0.16), cloth, -0.42, 1.0, 0.1, 'arm');
    add(new THREE.BoxGeometry(0.16, 0.62, 0.16), cloth, 0.42, 1.0, 0.1, 'arm');
    add(new THREE.BoxGeometry(0.2, 0.5, 0.2), skin, -0.16, 0.12, 0, 'leg');
    add(new THREE.BoxGeometry(0.2, 0.5, 0.2), skin, 0.16, 0.12, 0, 'leg');
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.85), this.mat(0x222226));
    gun.position.set(0.42, 1.15, 0.45);
    gun.userData.zone = 'arm';
    g.add(gun);
    parts.set(gun, 'arm');
    return { g, parts };
  }

  private nextRound(first = false): void {
    // clear old actors
    for (const a of this.actors) this.scene.remove(a.g);
    this.actors = [];
    this.bombPlanted = false;
    this.planting = 0; this.defusing = 0;
    this.phase = 'freeze'; this.phaseT = 3;
    this.roundT = 100;
    if (this.bombMesh) { this.scene.remove(this.bombMesh); this.bombMesh = null; }
    const pistol = this.round === 0;
    const mkFighter = (id: number, team: Team, x: number, z: number, carrier: boolean): Actor => {
      const primary = pistol ? null : cloneWeapon(team === 'CT' ? M4A4 : AK47);
      const f: FighterState = {
        id, name: (team === 'CT' ? 'CT-' : 'T-') + (id % 5 + 1),
        team, hp: 100, armor: pistol ? 0 : 100, alive: true,
        hasBomb: carrier, primary,
        secondary: cloneWeapon(team === 'CT' ? USP : GLOCK),
        melee: cloneWeapon(KNIFE), slot: pistol ? 'secondary' : 'primary',
        x, z, y: 0, yaw: team === 'CT' ? -Math.PI / 2 : Math.PI / 2,
      };
      const { g, parts } = this.humanoid(team);
      g.position.set(x, 0, z);
      this.scene.add(g);
      const roles = ['carrier', 'assault', 'assault', 'guard', 'hunter'] as const;
      return {
        f, g, parts,
        mind: id === 0 && first ? null : makeMind(roles[id % 5], x, z),
        ammo: 0, reserve: 0, cool: 0, reloading: 0, burst: 0, seen: false, stepT: 0,
      };
    };
    T_SPAWN.forEach((s, i) => this.actors.push(mkFighter(i, 'T', s.x, s.z, i === 1)));
    CT_SPAWN.forEach((s, i) => this.actors.push(mkFighter(5 + i, 'CT', s.x, s.z, false)));
    for (const a of this.actors) {
      const cur = this.curWeapon(a);
      a.ammo = cur.mag === Infinity ? Infinity : cur.mag;
      a.reserve = cur.reserve;
    }
    this.me = first ? 5 : this.me;
    if (!this.actors[this.me].f.alive) {
      const mate = this.actors.find((a) => a.f.team === this.actors[this.me].f.team && a.f.alive);
      if (mate) this.me = this.actors.indexOf(mate);
    }
    const p = this.actors[this.me];
    this.yaw = p.f.yaw; this.pitch = 0;
    this.say(pistol ? '手枪局开始' : `第 ${this.round + 1} 回合开始`);
  }

  // ---------- input ----------
  private bind(canvas: HTMLCanvasElement): void {
    addEventListener('keydown', (e) => {
      if (e.code === 'Space') e.preventDefault();
      this.keys.add(e.code);
      const p = this.actors[this.me];
      if (!p || !p.f.alive || this.phase !== 'live') return;
      if (e.code === 'Digit1' && p.f.primary) { p.f.slot = 'primary'; this.syncAmmo(p); }
      if (e.code === 'Digit2') { p.f.slot = 'secondary'; this.syncAmmo(p); }
      if (e.code === 'Digit3') { p.f.slot = 'melee'; this.syncAmmo(p); }
      if (e.code === 'KeyR') this.startReload(p);
      if (e.code === 'KeyE') this.tryInteract();
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    canvas.addEventListener('mousedown', (e) => {
      this.snd.ensure();
      if (document.pointerLockElement !== canvas) { canvas.requestPointerLock(); return; }
      if (this.phase !== 'live') return;
      if (e.button === 0) this.firing = true;
      if (e.button === 2) {
        const p = this.actors[this.me];
        if (p && this.curWeapon(p).scoped && p.f.alive) {
          this.scoped = !this.scoped;
          this.camera.fov = this.scoped ? 22 : 75;
          this.camera.updateProjectionMatrix();
          this.snd.scope();
        }
      }
    });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.firing = false; });
    addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement !== canvas) this.firing = false;
    });
    addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== canvas) return;
      const s = this.scoped ? 0.0006 : 0.0022;
      this.yaw -= e.movementX * s;
      this.pitch -= e.movementY * s;
      this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch));
    });
  }

  private curWeapon(a: Actor): WeaponDef {
    const f = a.f;
    return f.slot === 'primary' && f.primary
      ? f.primary
      : f.slot === 'melee' ? f.melee : f.secondary;
  }

  private syncAmmo(a: Actor): void {
    const w = this.curWeapon(a);
    a.ammo = w.mag === Infinity ? Infinity : w.mag;
    a.reserve = w.reserve;
    this.scoped = false;
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();
  }

  private startReload(a: Actor): void {
    const w = this.curWeapon(a);
    if (w.mag === Infinity || a.reloading > 0 || a.reserve <= 0) return;
    if (a.ammo >= w.mag) return;
    a.reloading = w.id === 'awp' ? 3.2 : 2.2;
    this.snd.reload();
  }

  // ---------- combat ----------
  private ray = new THREE.Raycaster();

  private shoot(shooter: Actor, tx: number, ty: number, tz: number, spread: number): void {
    const w = this.curWeapon(shooter.f ? shooter : shooter);
    void w;
    const wpn = this.curWeapon(shooter);
    if (shooter.cool > 0 || shooter.reloading > 0) return;
    if (shooter.ammo <= 0) { this.startReload(shooter); return; }
    shooter.cool = 60 / wpn.rpm;
    if (shooter.ammo !== Infinity) shooter.ammo -= 1;
    this.snd.shot(wpn.id);
    const dir = new THREE.Vector3(tx, ty, tz).normalize();
    // apply spread
    dir.x += (Math.random() - 0.5) * 2 * (spread + this.bloomOf(shooter));
    dir.y += (Math.random() - 0.5) * 2 * (spread + this.bloomOf(shooter));
    dir.z += (Math.random() - 0.5) * 2 * (spread + this.bloomOf(shooter));
    dir.normalize();
    const ox = shooter.f.x, oy = EYE, oz = shooter.f.z;
    this.ray.set(new THREE.Vector3(ox, oy, oz), dir);
    this.ray.far = wpn.range;
    // wall distance
    let wallD = wpn.range;
    // muzzle flash light effect skipped; tracer:
    let best: { a: Actor; zone: HitZone; d: number } | null = null;
    for (const a of this.actors) {
      if (!a.f.alive || a === shooter || a.f.team === shooter.f.team) continue;
      const hits = this.ray.intersectObjects([...a.parts.keys()], false);
      if (hits.length && hits[0].distance < wallD) {
        const zone = (hits[0].object.userData.zone as HitZone) || 'chest';
        if (!best || hits[0].distance < best.d) best = { a, zone, d: hits[0].distance };
      }
    }
    // crude wall check: step along ray, stop at blocker
    const steps = Math.floor(wpn.range * 2);
    for (let i = 1; i < steps; i++) {
      const px = ox + dir.x * i * 0.5, pz = oz + dir.z * i * 0.5;
      if (pointBlocked(px, pz, 0.1)) { wallD = i * 0.5; break; }
    }
    this.tracer(ox, oy, oz, dir, Math.min(best ? best.d : wallD, wallD));
    if (best && best.d <= wallD) {
      const hs = best.zone === 'head';
      const dmg = calcDamage(wpn, best.zone, best.a.f.armor);
      best.a.f.hp -= dmg;
      best.a.f.armor = Math.max(0, best.a.f.armor - dmg * 0.3);
      this.snd.hit();
      if (best.a.f.hp <= 0) this.kill(shooter, best.a, wpn.name, hs);
    }
    // recoil on player
    if (shooter === this.actors[this.me]) {
      this.pitch += wpn.recoil * (this.scoped ? 0.4 : 1);
      this.bloom = Math.min(0.06, this.bloom + wpn.recoil * 0.5);
    }
  }

  private bloomOf(a: Actor): number {
    return a === this.actors[this.me] ? this.bloom : 0.01;
  }

  private tracer(ox: number, oy: number, oz: number, dir: THREE.Vector3, len: number): void {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(ox, oy, oz),
      new THREE.Vector3(ox + dir.x * len, oy + dir.y * len, oz + dir.z * len),
    ]);
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffe27a, transparent: true, opacity: 0.8 }));
    this.scene.add(l);
    setTimeout(() => { this.scene.remove(l); g.dispose(); }, 60);
  }

  private kill(killer: Actor, victim: Actor, weapon: string, hs: boolean): void {
    victim.f.alive = false;
    victim.g.visible = false;
    if (victim.f.hasBomb) {
      victim.f.hasBomb = false;
      this.bombX = victim.f.x; this.bombZ = victim.f.z;
      this.dropBombMesh();
      this.say('C4 已掉落');
    }
    this.kills.unshift({
      killer: killer.f.name, victim: victim.f.name, weapon,
      headshot: hs, teamKill: false,
    });
    this.kills = this.kills.slice(0, 6);
    this.snd.kill();
    if (victim === this.actors[this.me]) this.takeover();
  }

  private takeover(): void {
    const team = this.actors[this.me].f.team;
    const mate = this.actors.find((a) => a.f.team === team && a.f.alive);
    if (mate) {
      this.me = this.actors.indexOf(mate);
      mate.mind = null; // player now controls this bot
      this.yaw = mate.f.yaw;
      this.say(`你阵亡了，已接管 ${mate.f.name}`);
    } else {
      this.say('你阵亡了，队伍已全灭');
    }
  }

  private dropBombMesh(): void {
    if (!this.bombMesh) {
      this.bombMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.25, 0.3),
        new THREE.MeshLambertMaterial({ color: 0xc9a24f }),
      );
      this.scene.add(this.bombMesh);
    }
    this.bombMesh.position.set(this.bombX, 0.15, this.bombZ);
    this.bombMesh.visible = true;
  }

  // ---------- C4 + rounds ----------
  private tryInteract(): void {
    const p = this.actors[this.me];
    if (!p.f.alive || this.phase !== 'live') return;
    if (p.f.team === 'T' && p.f.hasBomb && !this.bombPlanted) {
      if (inRect(p.f.x, p.f.z, SITE_A) || inRect(p.f.x, p.f.z, SITE_B)) {
        this.planting = 0.01; // starts channel
        this.say('正在安放 C4，保持不动…');
      } else this.say('必须在 A 点或 B 点内下包');
    }
  }

  private say(t: string): void { this.msg = t; this.msgT = 4; }

  private endRound(winner: Team, why: string): void {
    if (this.phase === 'over') return;
    this.phase = 'over';
    this.phaseT = 5;
    if (winner === 'CT') this.scoreCT += 1; else this.scoreT += 1;
    this.round += 1;
    this.say(`${winner} 获胜：${why}`);
    if (this.bombMesh) this.bombMesh.visible = false;
  }

  // ---------- per-frame ----------
  private tick(dt: number): void {
    dt = Math.min(dt, 0.05);
    this.msgT -= dt;
    if (this.msgT <= 0) this.msg = '';
    if (this.phase === 'freeze') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) { this.phase = 'live'; this.say('回合开始'); }
      this.pushHud();
      this.render();
      return;
    }
    if (this.phase === 'over') {
      this.phaseT -= dt;
      for (const a of this.actors) {
        if (!a.f.alive) continue;
        a.g.position.set(a.f.x, 0, a.f.z);
        a.g.rotation.y = a.f.yaw;
      }
      if (this.phaseT <= 0) this.nextRound();
      this.pushHud();
      this.render();
      return;
    }
    // live
    this.roundT -= dt;
    this.updatePlayer(dt);
    this.updateBots(dt);
    this.updateBomb(dt);
    // win checks
    const ctAlive = this.actors.some((a) => a.f.team === 'CT' && a.f.alive);
    const tAlive = this.actors.some((a) => a.f.team === 'T' && a.f.alive);
    if (this.bombPlanted) {
      if (this.bombT <= 0) {
        this.snd.explode();
        this.endRound('T', 'C4 爆炸');
      } else if (!tAlive && !this.bombPlanted) this.endRound('CT', '肃清 T 阵营');
      else if (!ctAlive) this.endRound('T', '肃清 CT 阵营');
    } else if (!tAlive) this.endRound('CT', '肃清 T 阵营');
      else if (!ctAlive) this.endRound('T', '肃清 CT 阵营');
      else if (this.roundT <= 0) this.endRound('CT', '时间耗尽且未下包');
    this.hudT -= dt;
    if (this.hudT <= 0) { this.hudT = 0.1; this.pushHud(); }
    this.render();
  }

  private updatePlayer(dt: number): void {
    const p = this.actors[this.me];
    if (!p || !p.f.alive) return;
    const w = this.curWeapon(p);
    p.cool -= dt;
    if (p.reloading > 0) {
      p.reloading -= dt;
      if (p.reloading <= 0) {
        const need = w.mag - p.ammo;
        const take = Math.min(need, p.reserve);
        p.ammo += take; p.reserve -= take;
      }
    }
    this.bloom = Math.max(0, this.bloom - dt * 0.05);
    const sp = this.keys.has('ShiftLeft') ? 3.2 : 5.0;
    let mx = 0, mz = 0;
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
    if (this.keys.has('KeyW')) { mx += fx; mz += fz; }
    if (this.keys.has('KeyS')) { mx -= fx; mz -= fz; }
    if (this.keys.has('KeyD')) { mx += rx; mz += rz; }
    if (this.keys.has('KeyA')) { mx -= rx; mz -= rz; }
    const l = Math.hypot(mx, mz);
    if (l > 0) {
      const nx = p.f.x + (mx / l) * sp * dt;
      const nz = p.f.z + (mz / l) * sp * dt;
      if (!pointBlocked(nx, p.f.z, 0.4)) p.f.x = nx;
      if (!pointBlocked(p.f.x, nz, 0.4)) p.f.z = nz;
      p.stepT -= dt;
      if (p.stepT <= 0) { p.stepT = 0.35; this.snd.step(); }
    }
    this.vy -= GRAV * dt;
    let y = (p.f.y || 0) + this.vy * dt;
    if (y <= 0) { y = 0; this.vy = 0; this.grounded = true; }
    if (this.keys.has('Space') && this.grounded) { this.vy = 7; this.grounded = false; }
    p.f.y = y;
    p.f.yaw = this.yaw;
    p.g.position.set(p.f.x, y, p.f.z);
    p.g.rotation.y = this.yaw;
    p.g.visible = false; // first person: hide own body
    // plant / defuse channels
    if (this.planting > 0) {
      if (l > 0 || !p.f.hasBomb) { this.planting = 0; this.say('下包被打断'); }
      else {
        this.planting += dt;
        if (this.planting >= 3) {
          this.planting = 0;
          this.plantBomb(p.f.x, p.f.z);
          p.f.hasBomb = false;
        }
      }
    }
    if (this.bombPlanted && p.f.team === 'CT') {
      const d = Math.hypot(p.f.x - this.bombX, p.f.z - this.bombZ);
      if (d < 1.6 && l === 0) {
        this.defusing += dt;
        if (Math.floor(this.defusing * 2) !== Math.floor((this.defusing - dt) * 2)) this.snd.defuse();
        if (this.defusing >= 5) {
          this.defusing = 0;
          this.bombPlanted = false;
          if (this.bombMesh) this.bombMesh.visible = false;
          this.endRound('CT', '成功拆包');
          return;
        }
      } else this.defusing = 0;
    } else this.defusing = 0;
    // firing
    if (this.firing && p.cool <= 0 && p.reloading <= 0) {
      if (w.id === 'knife') {
        p.cool = 60 / w.rpm;
        this.snd.step();
        for (const a of this.actors) {
          if (!a.f.alive || a.f.team === p.f.team) continue;
          const d = Math.hypot(a.f.x - p.f.x, a.f.z - p.f.z);
          if (d < w.range && hasLOS(p.f.x, p.f.z, a.f.x, a.f.z)) {
            a.f.hp -= calcDamage(w, 'chest', a.f.armor);
            this.snd.hit();
            if (a.f.hp <= 0) this.kill(p, a, w.name, false);
            break;
          }
        }
      } else {
        const dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        const origin = new THREE.Vector3();
        this.camera.getWorldPosition(origin);
        // temporarily treat shooter pos as camera
        const sx = p.f.x, sz = p.f.z;
        void sx; void sz; void origin;
        this.shootFrom(p, dir);
      }
      if (!w.auto) this.firing = false;
    }
    // camera follows player
    this.camera.position.set(p.f.x, EYE + y, p.f.z);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }

  private shootFrom(p: Actor, dir: THREE.Vector3): void {
    const wpn = this.curWeapon(p);
    if (p.cool > 0 || p.reloading > 0) return;
    if (p.ammo <= 0) { this.startReload(p); return; }
    p.cool = 60 / wpn.rpm;
    if (p.ammo !== Infinity) p.ammo -= 1;
    this.snd.shot(wpn.id);
    const d = dir.clone();
    const sp = wpn.spread * (this.scoped ? 0.15 : 1) + this.bloom;
    d.x += (Math.random() - 0.5) * 2 * sp;
    d.y += (Math.random() - 0.5) * 2 * sp;
    d.z += (Math.random() - 0.5) * 2 * sp;
    d.normalize();
    const ox = p.f.x, oy = EYE + p.f.y, oz = p.f.z;
    this.ray.set(new THREE.Vector3(ox, oy, oz), d);
    this.ray.far = wpn.range;
    let wallD = wpn.range;
    const steps = Math.floor(wpn.range * 2);
    for (let i = 1; i < steps; i++) {
      const px = ox + d.x * i * 0.5, pz = oz + d.z * i * 0.5;
      if (pointBlocked(px, pz, 0.1)) { wallD = i * 0.5; break; }
    }
    let best: { a: Actor; zone: HitZone; dist: number } | null = null;
    for (const a of this.actors) {
      if (!a.f.alive || a === p || a.f.team === p.f.team) continue;
      const hits = this.ray.intersectObjects([...a.parts.keys()], false);
      if (hits.length && hits[0].distance <= wallD) {
        const zone = (hits[0].object.userData.zone as HitZone) || 'chest';
        if (!best || hits[0].distance < best.dist) best = { a, zone, dist: hits[0].distance };
      }
    }
    this.tracer(ox, oy, oz, d, Math.min(best ? best.dist : wallD, wallD));
    if (best) {
      const hs = best.zone === 'head';
      best.a.f.hp -= calcDamage(wpn, best.zone, best.a.f.armor);
      this.snd.hit();
      if (best.a.f.hp <= 0) this.kill(p, best.a, wpn.name + (this.scoped ? '(scope)' : ''), hs);
    }
    this.pitch += wpn.recoil * (this.scoped ? 0.4 : 1);
    this.bloom = Math.min(0.06, this.bloom + wpn.recoil * 0.5);
  }

  private updateBots(dt: number): void {
    this.actors.forEach((a, idx) => {
      if (!a.f.alive || idx === this.me) return;
      if (!a.mind) return;
      const w = this.curWeapon(a);
      a.cool -= dt;
      if (a.reloading > 0) {
        a.reloading -= dt;
        if (a.reloading <= 0) {
          const need = w.mag - a.ammo;
          const take = Math.min(need, a.reserve);
          a.ammo += take; a.reserve -= take;
        }
      }
      const foes = this.actors
        .filter((b) => b.f.alive && b.f.team !== a.f.team)
        .map((b) => ({ x: b.f.x, z: b.f.z, alive: b.f.alive }));
      const sense = {
        x: a.f.x, z: a.f.z, team: a.f.team, alive: true,
        bombPlanted: this.bombPlanted, bombX: this.bombX, bombZ: this.bombZ,
        siteA: SITE_A, siteB: SITE_B, foes,
      };
      const ti = acquire(sense, 45);
      if (ti >= 0) {
        const foe = this.actors.filter((b) => b.f.alive && b.f.team !== a.f.team)[ti];
        if (foe) {
          a.f.yaw = Math.atan2(-(foe.f.x - a.f.x), -(foe.f.z - a.f.z)) + Math.PI;
          // plant / defuse duties
          if (a.f.hasBomb && !this.bombPlanted && (inRect(a.f.x, a.f.z, SITE_A) || inRect(a.f.x, a.f.z, SITE_B))) {
            this.plantBomb(a.f.x, a.f.z);
            a.f.hasBomb = false;
          }
          if (a.cool <= 0 && a.reloading <= 0) {
            if (a.ammo <= 0) this.startReload(a);
            else {
              const dist = Math.hypot(foe.f.x - a.f.x, foe.f.z - a.f.z);
              if (Math.random() < Math.max(0.15, 0.75 - dist * 0.015)) {
                const dir = new THREE.Vector3(foe.f.x - a.f.x, 0, foe.f.z - a.f.z).normalize();
                dir.y = (1.3 - EYE) / Math.max(dist, 1);
                dir.normalize();
                this.botShoot(a, dir);
              } else {
                a.cool = 0.3; // missed shot pause
                this.snd.shot(w.id);
                if (a.ammo !== Infinity) a.ammo -= 1;
              }
            }
          }
          a.g.position.set(a.f.x, 0, a.f.z);
          a.g.rotation.y = a.f.yaw;
          return;
        }
      }
      // objective movement
      if (this.bombPlanted && a.f.team === 'CT') {
        // go defuse
        this.moveBotToward(a, this.bombX, this.bombZ, dt, 4.2);
        if (Math.hypot(a.f.x - this.bombX, a.f.z - this.bombZ) < 1.4) {
          this.defusing += dt;
          if (this.defusing >= 6) {
            this.defusing = 0;
            this.bombPlanted = false;
            if (this.bombMesh) this.bombMesh.visible = false;
            this.endRound('CT', '成功拆包');
          }
        }
        a.g.position.set(a.f.x, 0, a.f.z);
        a.g.rotation.y = a.f.yaw;
        return;
      }
      if (a.f.hasBomb && !this.bombPlanted) {
        const inA = inRect(a.f.x, a.f.z, SITE_A), inB = inRect(a.f.x, a.f.z, SITE_B);
        if (inA || inB) {
          this.plantBomb(a.f.x, a.f.z);
          a.f.hasBomb = false;
          a.g.position.set(a.f.x, 0, a.f.z);
          return;
        }
      }
      const r = stepAlong(a.mind, sense, 3.6, dt);
      if (pointBlocked(r.x, r.z, 0.4)) a.mind.path = []; else { a.f.x = r.x; a.f.z = r.z; }
      const wp = WAYPOINTS[a.mind.path[0] ?? nearestWP(a.f.x, a.f.z)];
      if (wp) a.f.yaw = Math.atan2(-(wp.x - a.f.x), -(wp.z - a.f.z)) + Math.PI;
      a.g.position.set(a.f.x, 0, a.f.z);
      a.g.rotation.y = a.f.yaw;
    });
  }

  private moveBotToward(a: Actor, x: number, z: number, dt: number, sp: number): void {
    const dx = x - a.f.x, dz = z - a.f.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.3) return;
    const nx = a.f.x + (dx / d) * sp * dt;
    const nz = a.f.z + (dz / d) * sp * dt;
    if (!pointBlocked(nx, a.f.z, 0.4)) a.f.x = nx;
    if (!pointBlocked(a.f.x, nz, 0.4)) a.f.z = nz;
    a.f.yaw = Math.atan2(-dx, -dz) + Math.PI;
  }

  private botShoot(a: Actor, dir: THREE.Vector3): void {
    const wpn = this.curWeapon(a);
    a.cool = 60 / wpn.rpm + 0.25;
    if (a.ammo !== Infinity) a.ammo -= 1;
    this.snd.shot(wpn.id);
    const ox = a.f.x, oy = EYE, oz = a.f.z;
    const d = dir.clone();
    d.x += (Math.random() - 0.5) * 0.05;
    d.y += (Math.random() - 0.5) * 0.04;
    d.z += (Math.random() - 0.5) * 0.05;
    d.normalize();
    let wallD = wpn.range;
    for (let i = 1; i < wpn.range * 2; i++) {
      if (pointBlocked(ox + d.x * i * 0.5, oz + d.z * i * 0.5, 0.1)) { wallD = i * 0.5; break; }
    }
    this.ray.set(new THREE.Vector3(ox, oy, oz), d);
    this.ray.far = wpn.range;
    let best: { t: Actor; dist: number } | null = null;
    for (const t of this.actors) {
      if (!t.f.alive || t === a || t.f.team === a.f.team) continue;
      const hits = this.ray.intersectObjects([...t.parts.keys()], false);
      if (hits.length && hits[0].distance <= wallD) {
        if (!best || hits[0].distance < best.dist) best = { t, dist: hits[0].distance };
      }
    }
    this.tracer(ox, oy, oz, d, Math.min(best ? best.dist : wallD, wallD));
    if (best) {
      const zone: HitZone = Math.random() < 0.2 ? 'head' : 'chest';
      best.t.f.hp -= calcDamage(wpn, zone, best.t.f.armor);
      if (best.t.f.hp <= 0) this.kill(a, best.t, wpn.name, zone === 'head');
    }
  }

  private plantBomb(x: number, z: number): void {
    this.bombPlanted = true;
    this.bombX = x; this.bombZ = z;
    this.bombT = 40;
    this.roundT = 999;
    this.dropBombMesh();
    this.snd.plant();
    this.say('C4 已安放，40 秒后爆炸');
  }

  private updateBomb(dt: number): void {
    if (!this.bombPlanted) return;
    this.bombT -= dt;
    const prev = Math.ceil(this.bombT + dt);
    if (Math.ceil(this.bombT) !== prev && this.bombT < 10) this.snd.beep();
  }

  // ---------- view ----------
  private render(): void {
    const w = this.canvas.clientWidth || 800;
    const h = this.canvas.clientHeight || 600;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.render(this.scene, this.camera);
  }

  private pushHud(): void {
    const p = this.actors[this.me];
    const w = p ? this.curWeapon(p) : DEAGLE;
    const meTeam = p ? p.f.team : 'CT';
    const actors = this.actors.map((a, i) => {
      let seen = a.f.team === meTeam || i === this.me;
      if (!seen && a.f.alive) {
        // visible to any alive teammate?
        for (const t of this.actors) {
          if (!t.f.alive || t.f.team !== meTeam) continue;
          if (hasLOS(t.f.x, t.f.z, a.f.x, a.f.z)) { seen = true; break; }
        }
      }
      a.seen = seen;
      return { x: a.f.x, z: a.f.z, team: a.f.team, me: i === this.me, seen };
    });
    this.cb({
      hp: Math.max(0, Math.round(p ? p.f.hp : 0)),
      armor: Math.round(p ? p.f.armor : 0),
      mag: p ? p.ammo : 0,
      reserve: p ? p.reserve : 0,
      weapon: w.name,
      slot: p ? p.f.slot : '',
      round: this.round + 1,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      phase: this.phase === 'live'
        ? (this.bombPlanted ? `C4 倒计时 ${Math.ceil(this.bombT)}s` : `回合进行 ${Math.ceil(this.roundT)}s`)
        : this.phase === 'freeze' ? '准备中' : '回合结束',
      bomb: this.bombPlanted
        ? 'C4 已安放'
        : this.planting > 0 ? `安放中 ${Math.round((this.planting / 3) * 100)}%`
          : this.defusing > 0 ? `拆除中 ${Math.round((this.defusing / 5) * 100)}%`
            : (p && p.f.hasBomb ? '你持有 C4，到 A/B 点按 E 安放' : ''),
      scoped: this.scoped,
      dead: p ? !p.f.alive : true,
      kills: this.kills,
      c4x: this.bombPlanted || (this.bombMesh && this.bombMesh.visible) ? this.bombX : null,
      c4z: this.bombPlanted || (this.bombMesh && this.bombMesh.visible) ? this.bombZ : null,
      actors,
      msg: this.msg,
    });
  }
}
