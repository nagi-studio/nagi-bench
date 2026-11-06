import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'

type Team = 'CT' | 'T'
type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'

interface WeaponDef {
  id: WeaponId; name: string; slot: 'primary' | 'secondary' | 'melee'
  damage: number; rpm: number; mag: number; reserve: number; spread: number
  recoil: number; auto: boolean; scope: boolean; reload: number; range: number
}
const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47:   { id: 'ak47', name: 'AK-47', slot: 'primary', damage: 36, rpm: 600, mag: 30, reserve: 90, spread: 0.035, recoil: 0.055, auto: true, scope: false, reload: 2.4, range: 90 },
  m4a4:   { id: 'm4a4', name: 'M4A4', slot: 'primary', damage: 29, rpm: 750, mag: 30, reserve: 90, spread: 0.018, recoil: 0.022, auto: true, scope: false, reload: 2.2, range: 90 },
  awp:    { id: 'awp', name: 'AWP', slot: 'primary', damage: 115, rpm: 45, mag: 5, reserve: 20, spread: 0.004, recoil: 0.12, auto: false, scope: true, reload: 3.4, range: 140 },
  glock:  { id: 'glock', name: 'Glock', slot: 'secondary', damage: 20, rpm: 500, mag: 20, reserve: 80, spread: 0.03, recoil: 0.02, auto: false, scope: false, reload: 1.8, range: 65 },
  usp:    { id: 'usp', name: 'USP', slot: 'secondary', damage: 24, rpm: 450, mag: 12, reserve: 48, spread: 0.022, recoil: 0.018, auto: false, scope: false, reload: 1.8, range: 65 },
  deagle: { id: 'deagle', name: 'Desert Eagle', slot: 'secondary', damage: 47, rpm: 260, mag: 7, reserve: 28, spread: 0.028, recoil: 0.075, auto: false, scope: false, reload: 2.2, range: 80 },
  knife:  { id: 'knife', name: 'Knife', slot: 'melee', damage: 34, rpm: 120, mag: 1, reserve: 0, spread: 0, recoil: 0.01, auto: false, scope: false, reload: 0, range: 2.4 },
}

const N = 64, CELL = 2, HALF = N * CELL / 2
const grid: number[][] = Array.from({ length: N }, () => new Array(N).fill(0))
function carve(x0: number, y0: number, x1: number, y1: number) {
  for (let y = Math.max(0, y0); y <= Math.min(N - 1, y1); y++)
    for (let x = Math.max(0, x0); x <= Math.min(N - 1, x1); x++) grid[y][x] = 1
}
carve(4, 50, 16, 60)
carve(46, 4, 60, 16)
carve(42, 22, 58, 36)
carve(8, 18, 22, 32)
carve(6, 26, 10, 52)
carve(8, 30, 44, 33)
carve(28, 12, 34, 52)
carve(28, 30, 34, 34)
carve(34, 20, 44, 24)
carve(40, 24, 44, 30)
carve(6, 12, 10, 52)
carve(10, 12, 22, 16)
carve(18, 16, 22, 20)
carve(22, 22, 28, 26)
carve(34, 22, 42, 26)
carve(44, 16, 50, 22)
carve(34, 10, 46, 14)
carve(22, 44, 28, 50)
carve(16, 40, 22, 46)
function blocked(x: number, y: number) { return x < 0 || y < 0 || x >= N || y >= N || grid[y][x] === 0 }
const CRATES: [number, number][] = [[45, 28], [47, 28], [45, 30], [50, 30], [12, 24], [14, 24], [12, 26], [18, 27], [30, 24], [32, 24], [30, 40], [32, 40], [24, 48], [50, 12], [8, 54]]
CRATES.forEach(([x, y]) => { grid[y][x] = 0 })
const SPAWN_T = new THREE.Vector3(-HALF + 10 * CELL, 0, -HALF + 55 * CELL)
const SPAWN_CT = new THREE.Vector3(-HALF + 53 * CELL, 0, -HALF + 10 * CELL)
const SITE_A = new THREE.Vector3(-HALF + 50 * CELL, 0, -HALF + 29 * CELL)
const SITE_B = new THREE.Vector3(-HALF + 15 * CELL, 0, -HALF + 25 * CELL)
const WAYPOINTS: THREE.Vector3[] = [
  SPAWN_T, new THREE.Vector3(-HALF + 8 * CELL, 0, -HALF + 40 * CELL),
  new THREE.Vector3(-HALF + 8 * CELL, 0, -HALF + 31 * CELL),
  new THREE.Vector3(-HALF + 26 * CELL, 0, -HALF + 31 * CELL),
  new THREE.Vector3(-HALF + 31 * CELL, 0, -HALF + 44 * CELL),
  new THREE.Vector3(-HALF + 31 * CELL, 0, -HALF + 32 * CELL),
  new THREE.Vector3(-HALF + 40 * CELL, 0, -HALF + 22 * CELL),
  new THREE.Vector3(-HALF + 50 * CELL, 0, -HALF + 29 * CELL),
  new THREE.Vector3(-HALF + 53 * CELL, 0, -HALF + 10 * CELL),
  new THREE.Vector3(-HALF + 15 * CELL, 0, -HALF + 25 * CELL),
  new THREE.Vector3(-HALF + 8 * CELL, 0, -HALF + 14 * CELL),
  new THREE.Vector3(-HALF + 20 * CELL, 0, -HALF + 14 * CELL),
  new THREE.Vector3(-HALF + 20 * CELL, 0, -HALF + 48 * CELL),
].map(v => v.clone())
function toCell(v: THREE.Vector3): [number, number] { return [Math.floor((v.x + HALF) / CELL), Math.floor((v.z + HALF) / CELL)] }
function toWorld(x: number, y: number) { return new THREE.Vector3(-HALF + (x + .5) * CELL, 0, -HALF + (y + .5) * CELL) }
function walkableWorld(v: THREE.Vector3) {
  const [x, y] = toCell(v)
  if (blocked(x, y)) return false
  for (const [ox, oy] of [[-.22, -.22], [.22, -.22], [-.22, .22], [.22, .22]]) {
    const p = v.clone().add(new THREE.Vector3(ox * CELL, 0, oy * CELL))
    const [cx, cy] = toCell(p); if (blocked(cx, cy)) return false
  }
  return true
}
function lineOfSight(a: THREE.Vector3, b: THREE.Vector3) {
  const d = b.clone().sub(a); const dist = d.length(); const steps = Math.ceil(dist / (CELL * 0.5))
  for (let i = 1; i < steps; i++) {
    const p = a.clone().addScaledVector(d, i / steps)
    const [x, y] = toCell(p); if (blocked(x, y)) return false
  }
  return true
}
function bfs(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] {
  const [sx, sy] = toCell(from), [tx, ty] = toCell(to)
  if (blocked(tx, ty)) return []
  const key = (x: number, y: number) => y * N + x
  const prev = new Map<number, number>(), q: number[] = [key(sx, sy)]
  prev.set(key(sx, sy), -1)
  let head = 0, found = -1
  while (head < q.length) {
    const cur = q[head++]; if (cur === key(tx, ty)) { found = cur; break }
    const x = cur % N, y = Math.floor(cur / N)
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny)
      if (blocked(nx, ny) || prev.has(k)) continue
      prev.set(k, cur); q.push(k)
    }
  }
  if (found < 0) return []
  const path: THREE.Vector3[] = []; let c = found
  while (c >= 0) { path.unshift(toWorld(c % N, Math.floor(c / N))); c = prev.get(c)! }
  return path
}

interface Soldier {
  id: number; team: Team; pos: THREE.Vector3; yaw: number; hp: number; armor: number
  alive: boolean; mesh: THREE.Group; weapon: WeaponDef; ammo: number; reserve: number
  lastShot: number; state: string; path: THREE.Vector3[]; pathIdx: number; target: Soldier | null
  repath: number; hasBomb: boolean; plantT: number; defuseT: number; isPlayer: boolean
  kills: number
}
const ZONES = [
  { name: 'head', y: 1.68, r: 0.24, mult: 2.0 },
  { name: 'chest', y: 1.28, r: 0.36, mult: 1.0 },
  { name: 'stomach', y: 0.96, r: 0.30, mult: 0.82 },
  { name: 'armL', y: 1.28, r: 0.17, mult: 0.68, x: -0.48 },
  { name: 'armR', y: 1.28, r: 0.17, mult: 0.68, x: 0.48 },
  { name: 'legL', y: 0.48, r: 0.19, mult: 0.6, x: -0.18 },
  { name: 'legR', y: 0.48, r: 0.19, mult: 0.6, x: 0.18 },
]
function raySphere(o: THREE.Vector3, d: THREE.Vector3, c: THREE.Vector3, r: number) {
  const oc = o.clone().sub(c), b = oc.dot(d), cc = oc.lengthSq() - r * r
  const disc = b * b - cc
  if (disc < 0) return -1
  const t = -b - Math.sqrt(disc)
  return t > 0 ? t : -1
}

class Sfx {
  ctx: AudioContext | null = null; master: GainNode | null = null
  init() {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AC) return
    this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = 0.22; this.master.connect(this.ctx.destination)
  }
  burst(dur: number, gain: number, hz: number, type: 'noise' | 'tone', sweep = 0.4) {
    if (!this.ctx || !this.master) return
    const c = this.ctx, t = c.currentTime
    let src: AudioBufferSourceNode | OscillatorNode
    if (type === 'noise') {
      const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0)
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3)
      const s = c.createBufferSource(); s.buffer = b; src = s
    } else {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(hz, t)
      o.frequency.exponentialRampToValueAtTime(Math.max(40, hz * sweep), t + dur); src = o
    }
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = type === 'noise' ? hz : 6000
    const g = c.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f); f.connect(g); g.connect(this.master); src.start(t); src.stop(t + dur + 0.01)
  }
  fire(w: WeaponId) {
    if (w === 'ak47') { this.burst(0.22, 0.34, 2600, 'noise'); this.burst(0.14, 0.16, 130, 'tone', 0.3) }
    else if (w === 'm4a4') { this.burst(0.13, 0.24, 3800, 'noise'); this.burst(0.09, 0.11, 190, 'tone', 0.4) }
    else if (w === 'awp') { this.burst(0.45, 0.42, 1800, 'noise'); this.burst(0.3, 0.2, 90, 'tone', 0.25) }
    else if (w === 'deagle') { this.burst(0.26, 0.3, 2400, 'noise') }
    else if (w === 'knife') { this.burst(0.09, 0.1, 5200, 'noise') }
    else { this.burst(0.11, 0.18, 3400, 'noise') }
  }
  hit() { this.burst(0.08, 0.12, 2200, 'tone', 0.5) }
  reload() { this.burst(0.06, 0.08, 1500, 'noise'); setTimeout(() => this.burst(0.07, 0.09, 900, 'noise'), 220) }
  step() { this.burst(0.06, 0.035, 420, 'noise') }
  scope() { this.burst(0.12, 0.06, 3000, 'tone', 2.2) }
  plant() { this.burst(0.1, 0.12, 900, 'tone', 1.8) }
  beep() { this.burst(0.07, 0.09, 1400, 'tone', 1.02) }
  explode() { this.burst(1.2, 0.4, 700, 'noise'); this.burst(0.9, 0.25, 55, 'tone', 0.3) }
  kill() { this.burst(0.1, 0.1, 1200, 'tone', 1.7) }
}

interface Hud {
  hp: number; armor: number; ammo: number; reserve: number; weapon: string
  feed: string[]; bomb: string; round: string; time: number; scope: boolean
  alive: number; enemies: number; pistol: boolean; spectate: string
}

function createGame(canvas: HTMLCanvasElement, onHud: (h: Hud) => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6)); renderer.setSize(innerWidth, innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xa8b6b8); scene.fog = new THREE.Fog(0xb4bfbc, 40, 170)
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.05, 300)
  camera.rotation.order = 'YXZ'
  scene.add(new THREE.HemisphereLight(0xf3e3c2, 0x5c5347, 1.5))
  const sun = new THREE.DirectionalLight(0xffe7bc, 1.5); sun.position.set(40, 70, -30); scene.add(sun)

  const sand = new THREE.MeshStandardMaterial({ color: 0xc8ad7f, roughness: 0.95 })
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xbda57c, roughness: 0.9 })
  const crateMat = new THREE.MeshStandardMaterial({ color: 0x8a6a44, roughness: 0.85 })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(N * CELL, N * CELL), sand)
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.02; scene.add(floor)
  const wallCells: [number, number][] = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (grid[y][x] === 1) continue
    const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !blocked(x + dx, y + dy))
    if (near) wallCells.push([x, y])
  }
  const wallGeo = new THREE.BoxGeometry(CELL, 4.2, CELL)
  const walls = new THREE.InstancedMesh(wallGeo, wallMat, wallCells.length)
  const dummy = new THREE.Object3D()
  wallCells.forEach(([x, y], i) => { dummy.position.copy(toWorld(x, y)); dummy.position.y = 2.1; dummy.updateMatrix(); walls.setMatrixAt(i, dummy.matrix) })
  scene.add(walls)
  const crates = new THREE.InstancedMesh(new THREE.BoxGeometry(CELL * 0.9, 1.35, CELL * 0.9), crateMat, CRATES.length)
  CRATES.forEach(([x, y], i) => { dummy.position.copy(toWorld(x, y)); dummy.position.y = 0.68; dummy.updateMatrix(); crates.setMatrixAt(i, dummy.matrix) })
  scene.add(crates)
  for (const [c, col] of [[SITE_A, 0xc0543f], [SITE_B, 0xc0543f]] as [THREE.Vector3, number][]) {
    const m = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.7, 32), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.55 }))
    m.rotation.x = -Math.PI / 2; m.position.copy(c); m.position.y = 0.04; scene.add(m)
  }

  function humanoid(team: Team) {
    const g = new THREE.Group()
    const cloth = new THREE.MeshStandardMaterial({ color: team === 'CT' ? 0x35567d : 0xa89063, roughness: 0.8 })
    const gear = new THREE.MeshStandardMaterial({ color: team === 'CT' ? 0x22364f : 0x6b5636, roughness: 0.85 })
    const skin = new THREE.MeshStandardMaterial({ color: 0xc9a582, roughness: 0.9 })
    const P = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); g.add(b); return b
    }
    P(0.72, 0.86, 0.4, cloth, 0, 1.30, 0)
    P(0.78, 0.22, 0.44, gear, 0, 0.92, 0)
    P(0.38, 0.42, 0.38, skin, 0, 1.94, 0)
    P(0.42, 0.14, 0.42, gear, 0, 2.16, 0)
    P(0.22, 0.72, 0.24, cloth, -0.48, 1.34, 0)
    P(0.22, 0.72, 0.24, cloth, 0.48, 1.34, 0)
    P(0.27, 0.82, 0.29, gear, -0.19, 0.44, 0)
    P(0.27, 0.82, 0.29, gear, 0.19, 0.44, 0)
    const gun = new THREE.Group()
    P(0.12, 0.14, 0.86, new THREE.MeshStandardMaterial({ color: 0x2b3034, metalness: 0.7, roughness: 0.4 }), 0, 0, 0)
    gun.position.set(0.42, 1.42, -0.34); gun.name = 'gun'; g.add(gun)
    g.userData.gun = gun
    return g
  }

  const sfx = new Sfx()
  const soldiers: Soldier[] = []
  let pistolRound = true
  function equip(s: Soldier, id: WeaponId) {
    s.weapon = WEAPONS[id]; s.ammo = s.weapon.mag; s.reserve = s.weapon.reserve
    const gun = s.mesh.userData.gun as THREE.Group
    gun.scale.set(id === 'awp' ? 1.35 : id === 'knife' ? 0.4 : 1, 1, id === 'awp' ? 1.5 : id === 'knife' ? 0.5 : 1)
  }
  function spawn() {
    soldiers.length = 0
    for (let i = 0; i < 10; i++) {
      const team: Team = i < 5 ? 'CT' : 'T'
      const mesh = humanoid(team)
      const off = i % 5
      const base = team === 'CT' ? SPAWN_CT : SPAWN_T
      const pos = base.clone().add(new THREE.Vector3((off - 2) * 1.6, 0, (off % 2) * 1.6))
      mesh.position.copy(pos); mesh.rotation.y = team === 'CT' ? Math.PI * 0.75 : -Math.PI * 0.25
      scene.add(mesh)
      const isPlayer = i === 0
      const s: Soldier = {
        id: i, team, pos, yaw: mesh.rotation.y, hp: 100, armor: pistolRound ? (team === 'CT' ? 20 : 0) : 100,
        alive: true, mesh, weapon: WEAPONS.glock, ammo: 20, reserve: 80, lastShot: 0, state: 'patrol',
        path: [], pathIdx: 0, target: null, repath: 0, hasBomb: false, plantT: 0, defuseT: 0,
        isPlayer, kills: 0,
      }
      if (isPlayer) { mesh.visible = false; equip(s, 'usp') }
      else if (team === 'CT') equip(s, pistolRound ? 'usp' : (i % 3 === 0 ? 'awp' : 'm4a4'))
      else equip(s, pistolRound ? 'glock' : (i % 3 === 0 ? 'awp' : 'ak47'))
      soldiers.push(s)
    }
    soldiers[6].hasBomb = true
  }

  const bomb = { carrier: 6 as number, planted: false, pos: new THREE.Vector3(), timer: 0, defusing: false, exploded: false }
  let roundOver = false, roundResult = '', roundClock = 115, killfeed: string[] = []
  let playerIdx = 0, scopeOn = false, reloadUntil = 0, recoil = 0, fbYaw = 0, fbPitch = 0
  const keys: Record<string, boolean> = {}
  let locked = false, timeSec = 0

  function addFeed(s: string) { killfeed.unshift(s); if (killfeed.length > 5) killfeed.pop() }
  function damage(victim: Soldier, attacker: Soldier, zone: typeof ZONES[number]) {
    if (!victim.alive || roundOver) return
    let dmg = attacker.weapon.damage * zone.mult
    if (victim.armor > 0) { const absorb = Math.min(victim.armor, dmg * 0.45); victim.armor -= absorb; dmg -= absorb }
    victim.hp -= dmg
    if (attacker.isPlayer) sfx.hit()
    if (victim.hp <= 0) {
      victim.alive = false; victim.mesh.visible = false; attacker.kills++
      addFeed(`${attacker.team} ${attacker.weapon.name} → ${victim.team} ${zone.name === 'head' ? 'HEADSHOT' : 'elim'}`)
      if (attacker.isPlayer) sfx.kill()
      if (victim.hasBomb) { bomb.carrier = -1; bomb.pos.copy(victim.pos); victim.hasBomb = false }
    }
  }
  function shoot(s: Soldier, dir: THREE.Vector3, now: number) {
    if (s.ammo <= 0 || now - s.lastShot < 60 / s.weapon.rpm || reloadUntil > now && s.isPlayer) return
    s.lastShot = now; s.ammo--
    sfx.fire(s.weapon.id)
    if (s.isPlayer) recoil += s.weapon.recoil
    const origin = s.pos.clone().add(new THREE.Vector3(0, 1.62, 0))
    if (s.weapon.id === 'knife') {
      for (const e of soldiers) if (e.alive && e.team !== s.team && e.pos.distanceTo(s.pos) < 2.4 && dir.dot(e.pos.clone().sub(s.pos).normalize()) > 0.6) damage(e, s, ZONES[1])
      return
    }
    const spread = s.isPlayer ? s.weapon.spread * (scopeOn ? 0.1 : 1) : s.weapon.spread * 1.8
    const d = dir.clone().add(new THREE.Vector3((Math.random() - .5) * spread * 2, (Math.random() - .5) * spread * 2, (Math.random() - .5) * spread * 2)).normalize()
    let best: { t: number; v: Soldier; z: typeof ZONES[number] } | null = null
    for (const e of soldiers) {
      if (!e.alive || e.team === s.team) continue
      for (const z of ZONES) {
        const c = e.pos.clone().add(new THREE.Vector3(z.x || 0, z.y + 0.05, 0))
        const t = raySphere(origin, d, c, z.r)
        if (t > 0 && t < s.weapon.range && (!best || t < best.t)) best = { t, v: e, z }
      }
      const wallDist = wallDistance(origin, d)
      if (best && best.t > wallDist) best = null
      if (!lineOfSight(s.pos, e.pos) && best && best.v === e) best = null
    }
    if (best) damage(best.v, s, best.z)
  }
  function wallDistance(o: THREE.Vector3, d: THREE.Vector3) {
    for (let t = 0.5; t < 90; t += 0.6) {
      const p = o.clone().addScaledVector(d, t)
      const [x, y] = toCell(p)
      if (blocked(x, y)) return t
      if (CRATES.some(([cx, cy]) => cx === x && cy === y) && p.y < 1.4) return t
    }
    return 999
  }

  function ai(s: Soldier, now: number, dt: number) {
    if (!s.alive || roundOver) return
    let enemy: Soldier | null = null, bestD = 1e9
    for (const e of soldiers) {
      if (!e.alive || e.team === s.team) continue
      const d0 = e.pos.distanceTo(s.pos)
      if (d0 < bestD && lineOfSight(s.pos, e.pos)) { bestD = d0; enemy = e }
    }
    s.target = enemy
    if (enemy) {
      s.state = 'engage'
      s.yaw = Math.atan2(-(enemy.pos.x - s.pos.x), -(enemy.pos.z - s.pos.z))
      s.mesh.rotation.y = s.yaw
      const dir = new THREE.Vector3(-Math.sin(s.yaw), 0, -Math.cos(s.yaw))
      const aim = enemy.pos.clone().add(new THREE.Vector3(0, 1.3, 0)).sub(s.pos.clone().add(new THREE.Vector3(0, 1.62, 0))).normalize()
      if (bestD < s.weapon.range * 0.7 && now - s.lastShot > 60 / s.weapon.rpm + Math.random() * 260) {
        shoot(s, aim, now)
        if (s.ammo <= 0) { s.ammo = s.weapon.mag }
      }
      if (bestD > 9) moveToward(s, enemy.pos, dt)
    } else {
      const goal = s.hasBomb ? SITE_A : (s.team === 'T' ? (s.id % 2 ? SITE_A : SITE_B) : (bomb.planted ? bomb.pos : (s.id % 2 ? SITE_A : SITE_B)))
      if (now > s.repath || s.path.length === 0) {
        s.repath = now + 2200 + Math.random() * 1400
        const wps = bfs(s.pos, goal)
        s.path = wps.length ? wps.filter((_, i) => i % 3 === 0) : [goal.clone()]
        s.pathIdx = 0
      }
      const wp = s.path[s.pathIdx] || goal
      if (s.pos.distanceTo(wp) < 1.5) s.pathIdx = Math.min(s.pathIdx + 1, s.path.length)
      moveToward(s, wp, dt)
      s.state = 'patrol'
    }
    if (s.hasBomb && !bomb.planted && (s.pos.distanceTo(SITE_A) < 5 || s.pos.distanceTo(SITE_B) < 5)) {
      s.plantT += dt
      if (s.plantT > 3.2) {
        bomb.planted = true; bomb.pos.copy(s.pos); bomb.timer = 35; bomb.carrier = -1
        s.hasBomb = false; sfx.plant(); addFeed('C4 PLANTED')
      }
    } else s.plantT = 0
    if (s.team === 'CT' && bomb.planted && s.pos.distanceTo(bomb.pos) < 2.2) {
      s.defuseT += dt
      if (s.defuseT > 7) { bomb.planted = false; roundOver = true; roundResult = 'CT WIN · DEFUSED'; addFeed('C4 DEFUSED') }
    } else s.defuseT = 0
  }
  function moveToward(s: Soldier, target: THREE.Vector3, dt: number) {
    const dir = target.clone().sub(s.pos); dir.y = 0
    if (dir.length() < 0.01) return
    dir.normalize()
    const speed = 3.1 * dt
    const nx = s.pos.clone().add(new THREE.Vector3(dir.x * speed, 0, 0))
    if (walkableWorld(nx)) s.pos.x = nx.x
    const nz = s.pos.clone().add(new THREE.Vector3(0, 0, dir.z * speed))
    if (walkableWorld(nz)) s.pos.z = nz.z
    s.mesh.position.copy(s.pos)
  }

  const viewmodel = new THREE.Group()
  camera.add(viewmodel); scene.add(camera)
  const vmMat = new THREE.MeshStandardMaterial({ color: 0x30373d, metalness: 0.75, roughness: 0.35 })
  const vmWood = new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 0.7 })
  const vmBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.82), vmMat); vmBody.position.set(0.26, -0.26, -0.62); viewmodel.add(vmBody)
  const vmBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 10), vmMat); vmBarrel.rotation.x = Math.PI / 2; vmBarrel.position.set(0.26, -0.23, -1.15); viewmodel.add(vmBarrel)
  const vmStock = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.2, 0.34), vmWood); vmStock.position.set(0.26, -0.29, -0.28); viewmodel.add(vmStock)
  const vmMag = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.24, 0.14), vmMat); vmMag.position.set(0.26, -0.42, -0.58); viewmodel.add(vmMag)
  const vmScope = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.36, 12), vmMat); vmScope.rotation.x = Math.PI / 2; vmScope.position.set(0.26, -0.13, -0.72); viewmodel.add(vmScope)
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffcf74, transparent: true, opacity: 0 }))
  muzzle.position.set(0.26, -0.23, -1.45); viewmodel.add(muzzle)

  const mapCanvas = document.createElement('canvas'); mapCanvas.width = mapCanvas.height = 220
  const minimap = new THREE.CanvasTexture(mapCanvas)
  const bombMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.32), new THREE.MeshStandardMaterial({ color: 0x2b2b2b, emissive: 0x662211, emissiveIntensity: 0.7 }))
  bombMesh.visible = false; scene.add(bombMesh)

  function drawMinimap() {
    const g = mapCanvas.getContext('2d')!
    g.fillStyle = 'rgba(12,18,24,0.86)'; g.fillRect(0, 0, 220, 220)
    const s = 220 / N
    g.fillStyle = 'rgba(205,180,135,0.72)'
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (grid[y][x] === 1) g.fillRect(x * s, y * s, s + 0.6, s + 0.6)
    g.fillStyle = 'rgba(200,80,60,.5)'
    for (const c of [SITE_A, SITE_B]) { const [x, y] = toCell(c); g.fillRect(x * s - 4, y * s - 4, 9, 9) }
    for (const so of soldiers) {
      if (!so.alive) continue
      const [x, y] = toCell(so.pos)
      g.fillStyle = so.team === 'CT' ? '#5aa9ff' : '#e8b45a'
      if (so.isPlayer) g.fillStyle = '#ffffff'
      g.beginPath(); g.arc(x * s, y * s, so.isPlayer ? 3.6 : 2.6, 0, Math.PI * 2); g.fill()
    }
    if (bomb.planted || bomb.carrier < 0) {
      const [x, y] = toCell(bomb.pos); g.fillStyle = '#ff4b3a'
      g.beginPath(); g.arc(x * s, y * s, 3.2, 0, Math.PI * 2); g.fill()
    }
    minimap.needsUpdate = true
  }

  function startRound() {
    spawn(); bomb.carrier = 6; bomb.planted = false; bomb.exploded = false; bomb.timer = 0
    roundOver = false; roundResult = ''; roundClock = 115; killfeed = []; scopeOn = false; playerIdx = 0
    addFeed(pistolRound ? 'PISTOL ROUND' : 'RIFLE ROUND')
  }
  startRound()

  addEventListener('keydown', e => {
    keys[e.code] = true
    if (e.code === 'Digit1') switchWeapon('primary')
    if (e.code === 'Digit2') switchWeapon('secondary')
    if (e.code === 'Digit3') switchWeapon('melee')
    if (e.code === 'KeyR') doReload()
    if (e.code === 'KeyE' && !soldiers[0].alive) nextSpectate()
    if (e.code === 'KeyF' && pistolRound) { pistolRound = false; startRound() }
    if (e.code === 'Space') sfx.step()
  })
  addEventListener('keyup', e => { keys[e.code] = false })
  addEventListener('mousemove', e => {
    if (!locked) return
    fbYaw -= e.movementX * 0.0022; fbPitch -= e.movementY * 0.0022
    fbPitch = Math.max(-1.45, Math.min(1.45, fbPitch))
  })
  canvas.addEventListener('click', () => { canvas.requestPointerLock(); sfx.init() })
  document.addEventListener('pointerlockchange', () => { locked = document.pointerLockElement === canvas })
  document.addEventListener('mousedown', e => {
    if (!locked) return
    if (e.button === 2) { scopeOn = !!soldiers[0].weapon.scope && !scopeOn; sfx.scope(); return }
    if (e.button === 0) firing = true
  })
  document.addEventListener('mouseup', () => { firing = false })
  document.addEventListener('contextmenu', e => e.preventDefault())
  let firing = false
  function switchWeapon(slot: 'primary' | 'secondary' | 'melee') {
    if (pistolRound && slot === 'primary') { addFeed('Pistol round: no primary'); return }
    const p = soldiers[playerIdx]; if (!p || !p.alive) return
    const id: WeaponId = slot === 'primary' ? (p.team === 'CT' ? 'm4a4' : 'ak47') : slot === 'secondary' ? (p.team === 'CT' ? 'usp' : 'glock') : 'knife'
    equip(p, id); scopeOn = false
    vmScope.visible = id === 'awp'; vmWood.visible = id !== 'knife'
    viewmodel.scale.setScalar(id === 'knife' ? 0.55 : 1)
  }
  function doReload() {
    const p = soldiers[playerIdx]
    if (!p || p.weapon.id === 'knife' || p.reserve <= 0) return
    reloadUntil = timeSec + p.weapon.reload; sfx.reload()
    setTimeout(() => { const need = p.weapon.mag - p.ammo; const give = Math.min(need, p.reserve); p.ammo += give; p.reserve -= give }, p.weapon.reload * 1000)
  }
  function nextSpectate() {
    for (let i = 1; i < 5; i++) { const s = soldiers[i]; if (s.alive) { playerIdx = s.id; s.mesh.visible = false; return } }
  }

  let last = performance.now(), hudT = 0, stepT = 0
  let raf = 0
  function loop(now: number) {
    raf = requestAnimationFrame(loop)
    const dt = Math.min((now - last) / 1000, 0.05); last = now; timeSec += dt
    const p = soldiers[playerIdx] || soldiers[0]
    const me = soldiers[0]

    if (!roundOver) {
      roundClock -= dt
      if (bomb.planted) {
        bomb.timer -= dt
        if (Math.floor(bomb.timer) !== Math.floor(bomb.timer + dt)) sfx.beep()
        if (bomb.timer <= 0) { bomb.exploded = true; roundOver = true; roundResult = 'T WIN · C4 DETONATED'; sfx.explode() }
      }
      const ctAlive = soldiers.filter(s => s.team === 'CT' && s.alive).length
      const tAlive = soldiers.filter(s => s.team === 'T' && s.alive).length
      if (!bomb.planted && tAlive === 0) { roundOver = true; roundResult = 'CT WIN · ELIMINATED' }
      else if (!bomb.planted && ctAlive === 0) { roundOver = true; roundResult = 'T WIN · ELIMINATED' }
      else if (roundClock <= 0) { roundOver = true; roundResult = 'CT WIN · TIME' }
    }

    if (me.alive && locked) {
      const speed = (keys.ShiftLeft ? 4.4 : 6.2) * dt
      const f = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0)
      const s = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0)
      const len = Math.hypot(f, s) || 1
      const dx = (-Math.sin(fbYaw) * f + Math.cos(fbYaw) * s) / len * speed
      const dz = (-Math.cos(fbYaw) * f - Math.sin(fbYaw) * s) / len * speed
      const nx = me.pos.clone().add(new THREE.Vector3(dx, 0, 0)); if (walkableWorld(nx)) me.pos.x = nx.x
      const nz = me.pos.clone().add(new THREE.Vector3(0, 0, dz)); if (walkableWorld(nz)) me.pos.z = nz.z
      if (f || s) { stepT += dt; if (stepT > 0.42) { stepT = 0; sfx.step() } }
      me.yaw = fbYaw
      if (firing && reloadUntil < timeSec) {
        const dir = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(fbPitch - recoil * 0.5, fbYaw, 0, 'YXZ'))
        shoot(me, dir, now)
        muzzle.material = muzzle.material as THREE.MeshBasicMaterial
        ;(muzzle.material as THREE.MeshBasicMaterial).opacity = 0.9
      }
    } else if (!me.alive && !locked) { /* spectate uses bot camera */ }

    recoil *= 0.86
    ;(muzzle.material as THREE.MeshBasicMaterial).opacity *= 0.72
    viewmodel.position.set(0.26 + Math.sin(timeSec * 7) * 0.006, -0.02 - recoil * 1.6, 0)
    viewmodel.rotation.set(recoil * 2.4, 0, 0)
    vmScope.visible = me.weapon.id === 'awp' && !scopeOn

    for (const so of soldiers) {
      if (!so.isPlayer) ai(so, now, dt)
      so.mesh.position.copy(so.pos)
      if (so.hasBomb) bomb.pos.copy(so.pos)
    }
    bombMesh.visible = bomb.planted || bomb.carrier < 0
    bombMesh.position.copy(bomb.pos); bombMesh.position.y = 0.15

    const camPos = me.alive ? me.pos : p.pos
    camera.position.set(camPos.x, 1.62, camPos.z)
    if (me.alive) camera.rotation.set(fbPitch - recoil * 0.5, fbYaw, 0, 'YXZ')
    else camera.rotation.set(-0.05, p.yaw, 0, 'YXZ')
    camera.fov += ((scopeOn ? 28 : 75) - camera.fov) * 0.18
    camera.updateProjectionMatrix()

    if (now - hudT > 90) {
      hudT = now; drawMinimap()
      onHud({
        hp: Math.max(0, Math.round(me.hp)), armor: Math.max(0, Math.round(me.armor)),
        ammo: me.ammo, reserve: me.reserve, weapon: me.weapon.name,
        feed: killfeed.slice(), bomb: bomb.planted ? `C4 ${Math.max(0, bomb.timer).toFixed(1)}s` : (bomb.carrier >= 0 ? 'C4 CARRIED' : 'C4 DROPPED'),
        round: roundOver ? roundResult : (pistolRound ? 'PISTOL ROUND' : 'RIFLE ROUND'),
        time: Math.max(0, roundClock), scope: scopeOn,
        alive: soldiers.filter(s => s.team === 'CT' && s.alive).length,
        enemies: soldiers.filter(s => s.team === 'T' && s.alive).length,
        pistol: pistolRound, spectate: me.alive ? '' : `观战 ${p.team} #${p.id}`,
      })
      ;(window as any).__minimap = minimap
    }
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(loop)
  const onResize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight) }
  addEventListener('resize', onResize)
  return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); renderer.dispose() }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hud, setHud] = useState<Hud>({ hp: 100, armor: 20, ammo: 12, reserve: 48, weapon: 'USP', feed: [], bomb: 'C4 CARRIED', round: 'PISTOL ROUND', time: 115, scope: false, alive: 5, enemies: 5, pistol: true, spectate: '' })
  const [started, setStarted] = useState(false)
  useEffect(() => { if (!started || !canvasRef.current) return; return createGame(canvasRef.current, setHud) }, [started])
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0d12', color: '#eef3f6', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {!started && (
        <div onClick={() => setStarted(true)} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,10,16,.9)', cursor: 'pointer' }}>
          <div style={{ fontSize: 30, letterSpacing: '.4em', color: '#e6c58a' }}>DUST II · 5v5</div>
          <div style={{ marginTop: 18, fontSize: 13, color: '#a9bac6', lineHeight: 2, textAlign: 'center' }}>
            WASD 移动 · 空格跳跃 · 鼠标转视角 · 左键开火 · 右键开镜 · R 换弹<br />
            1/2/3 切换主武器 / 副武器 / 刀 · F 进入步枪局 · E 切换观战队友<br />
            手枪局开局 · C4 下包 / 拆包 · 5v5 AI · 程序化音效与地图
          </div>
          <div style={{ marginTop: 26, padding: '10px 28px', border: '1px solid #e6c58a', borderRadius: 22, color: '#e6c58a', fontSize: 12, letterSpacing: '.2em' }}>进入战场并锁定鼠标</div>
        </div>
      )}
      {hud.scope && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at center, transparent 0 24%, #000 25% 100%)' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,.75)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,.75)' }} />
          <div style={{ position: 'absolute', inset: '24%', border: '1px solid rgba(0,0,0,.5)', borderRadius: '50%' }} />
        </div>
      )}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', opacity: hud.scope ? .5 : .9 }}>
        <div style={{ position: 'absolute', left: -1, top: -10, width: 2, height: 20, background: '#fff' }} />
        <div style={{ position: 'absolute', top: -1, left: -10, height: 2, width: 20, background: '#fff' }} />
      </div>
      <div style={{ position: 'absolute', left: 24, bottom: 24, fontSize: 13, letterSpacing: '.08em' }}>
        <span style={{ color: '#7fd6a2' }}>HP {hud.hp}</span> &nbsp;·&nbsp; <span style={{ color: '#8fbded' }}>ARMOR {hud.armor}</span>
      </div>
      <div style={{ position: 'absolute', right: 24, bottom: 22, textAlign: 'right' }}>
        <div style={{ fontSize: 15, letterSpacing: '.14em', color: '#e8cf9a' }}>{hud.weapon}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 30 }}>{hud.ammo} <span style={{ fontSize: 16, color: '#8fa0ac' }}>/ {hud.reserve}</span></div>
      </div>
      <div style={{ position: 'absolute', left: 24, top: 20, background: 'rgba(8,13,20,.72)', border: '1px solid rgba(210,220,230,.18)', borderRadius: 8, padding: '10px 14px', fontSize: 12, lineHeight: 1.9 }}>
        <div style={{ color: '#e6c58a', letterSpacing: '.16em' }}>{hud.round}</div>
        <div>CT {hud.alive} : {hud.enemies} T &nbsp; · &nbsp; {Math.floor(hud.time / 60)}:{String(Math.floor(hud.time % 60)).padStart(2, '0')}</div>
        <div style={{ color: hud.bomb.startsWith('C4 ') ? '#ff8b6a' : '#9fb0bc' }}>{hud.bomb}</div>
        {hud.pistol && <div style={{ color: '#a8bcc9', fontSize: 11 }}>按 F 切换到步枪局</div>}
        {hud.spectate && <div style={{ color: '#ffd08a' }}>{hud.spectate} · E 切换</div>}
      </div>
      <div style={{ position: 'absolute', right: 24, top: 20, textAlign: 'right', fontSize: 12, lineHeight: 1.9 }}>
        {hud.feed.map((f, i) => <div key={i} style={{ color: i === 0 ? '#ffe0a8' : '#a9bac6', opacity: 1 - i * 0.16 }}>{f}</div>)}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
