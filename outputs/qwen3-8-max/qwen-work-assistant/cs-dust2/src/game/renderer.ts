/* ============================================================================
   Renderer — builds the three.js scene: the Dust2 level geometry, humanoid
   characters (distinct head / torso / arms / legs, CT vs T colours), first-person
   held-weapon viewmodels, tracers, impacts and the C4. Reads a GameState
   snapshot each frame; writes nothing back to the simulation.
   ========================================================================== */
import * as THREE from 'three'
import {
  buildMap, surfaceWalls, CRATES, WALL_H, HALF, GRID, tileToWorld, cellAt, Cell,
  SITE_A, SITE_B, DOOR, regionCenter,
} from './map'
import { WEAPONS } from './weapons'
import type { GameState, Entity, WeaponId } from './types'
import { drainFx } from './engine'

export class Renderer {
  renderer: THREE.WebGLRenderer
  scene = new THREE.Scene()
  camera: THREE.PerspectiveCamera
  viewmodel = new THREE.PerspectiveCamera(55, 1, 0.01, 10)
  vmScene = new THREE.Scene()

  private charGroup = new Map<number, THREE.Group>()
  private parts = new Map<number, CharParts>()
  private viewmodelGroup = new THREE.Group()
  private vmWeapon: THREE.Group | null = null
  private vmWeaponId: WeaponId | null = null
  private tracers: { line: THREE.Line; life: number }[] = []
  private impacts: { mesh: THREE.Mesh; life: number }[] = []
  private bombMesh: THREE.Group | null = null
  private siteMarkers = new THREE.Group()
  private clock = new THREE.Clock()

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.autoClear = false
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.05, 400)

    this.scene.background = new THREE.Color(0x9fc4e8)
    this.scene.fog = new THREE.Fog(0x9fc4e8, 60, 170)

    this.buildLights()
    this.buildLevel()
    this.buildSites()
    this.scene.add(this.siteMarkers)

    // viewmodel scene lighting
    const vmLight = new THREE.DirectionalLight(0xffffff, 2.2)
    vmLight.position.set(0.5, 1, 1)
    this.vmScene.add(vmLight)
    this.vmScene.add(new THREE.AmbientLight(0xffffff, 1.1))
    this.vmScene.add(this.viewmodelGroup)
  }

  private buildLights() {
    const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x9a8a6a, 0.9)
    this.scene.add(hemi)
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.5)
    sun.position.set(60, 90, 40)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    const d = 70
    sun.shadow.camera.left = -d
    sun.shadow.camera.right = d
    sun.shadow.camera.top = d
    sun.shadow.camera.bottom = -d
    sun.shadow.camera.far = 260
    sun.shadow.bias = -0.0005
    this.scene.add(sun)
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.28))
  }

  private mat(color: number, rough = 0.9, metal = 0): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })
  }

  private buildLevel() {
    buildMap()
    // floor: one big plane, sand coloured, plus per-region tint via vertex colour
    const floorGeo = new THREE.PlaneGeometry(GRID, GRID, 1, 1)
    const floor = new THREE.Mesh(floorGeo, this.mat(0xc2a878, 0.98))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.scene.add(floor)

    // walls: merge every surface wall tile into one InstancedMesh
    const walls = surfaceWalls()
    const wallGeo = new THREE.BoxGeometry(1, WALL_H, 1)
    const wallMat = this.mat(0xbfae8c, 0.95)
    const inst = new THREE.InstancedMesh(wallGeo, wallMat, walls.length)
    inst.castShadow = true
    inst.receiveShadow = true
    const m = new THREE.Matrix4()
    const tint = new THREE.Color()
    walls.forEach((w, i) => {
      m.makeTranslation(w.x, WALL_H / 2, w.z)
      inst.setMatrixAt(i, m)
      // slight colour variation for a hand-built look
      const v = 0.86 + ((w.x * 7 + w.z * 13) % 5) * 0.035
      tint.setRGB(v, v * 0.96, v * 0.86)
      inst.setColorAt(i, tint)
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
    this.scene.add(inst)

    // wall top trim (a thin darker cap) for definition
    const capGeo = new THREE.BoxGeometry(1.02, 0.18, 1.02)
    const capMat = this.mat(0x8f7f5f, 0.9)
    const capInst = new THREE.InstancedMesh(capGeo, capMat, walls.length)
    walls.forEach((w, i) => {
      m.makeTranslation(w.x, WALL_H - 0.09, w.z)
      capInst.setMatrixAt(i, m)
    })
    capInst.instanceMatrix.needsUpdate = true
    this.scene.add(capInst)

    // crates
    const crateMat = this.mat(0x8a6b41, 0.85)
    const crateMat2 = this.mat(0x6f5734, 0.85)
    CRATES.forEach((c) => {
      const g = new THREE.BoxGeometry(c.w, c.h, c.d)
      const mesh = new THREE.Mesh(g, Math.random() < 0.5 ? crateMat : crateMat2)
      mesh.position.set(c.x, c.h / 2, c.z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add(mesh)
      // edge frame
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(g),
        new THREE.LineBasicMaterial({ color: 0x4a3a22 })
      )
      edges.position.copy(mesh.position)
      this.scene.add(edges)
    })

    // mid doors: two open leaves flanking the passable gap
    const doorMat = this.mat(0x6b6f74, 0.6, 0.3)
    ;[-1, 1].forEach((side) => {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(DOOR.leafHalf, DOOR.height, 0.16), doorMat)
      leaf.position.set(DOOR.xCenter + side * (DOOR.leafHalf / 2 + DOOR_GAP_WORLD), DOOR.height / 2, DOOR.z)
      leaf.rotation.y = side * 0.5 // swung open
      leaf.castShadow = true
      this.scene.add(leaf)
    })

    // outer boundary walls (tall) so you cannot see off the map edge
    const boundMat = this.mat(0x6d6250, 0.95)
    const bGeoX = new THREE.BoxGeometry(GRID, WALL_H + 6, 1)
    const bGeoZ = new THREE.BoxGeometry(1, WALL_H + 6, GRID)
    ;[[-HALF, 0], [HALF, 0]].forEach(([z]) => {
      const b = new THREE.Mesh(bGeoX, boundMat)
      b.position.set(0, (WALL_H + 6) / 2, z)
      this.scene.add(b)
    })
    ;[[-HALF], [HALF]].forEach(([x]) => {
      const b = new THREE.Mesh(bGeoZ, boundMat)
      b.position.set(x, (WALL_H + 6) / 2, 0)
      this.scene.add(b)
    })

    // C4 mesh (hidden until planted/dropped)
    this.bombMesh = this.buildBomb()
    this.bombMesh.visible = false
    this.scene.add(this.bombMesh)
  }

  private buildBomb(): THREE.Group {
    const g = new THREE.Group()
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.3), this.mat(0x2f3a2a, 0.7))
    body.position.y = 0.14
    g.add(body)
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff0000, emissiveIntensity: 2 }))
    light.position.set(0, 0.28, 0)
    g.add(light)
    g.userData.light = light
    return g
  }

  private buildSites() {
    // translucent site markers + big letter sprites
    const make = (site: typeof SITE_A, color: number, label: string) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(site.r - 0.4, site.r, 48),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.set(site.x, 0.06, site.z)
      this.siteMarkers.add(ring)
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(site.r, 48),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 })
      )
      disc.rotation.x = -Math.PI / 2
      disc.position.set(site.x, 0.04, site.z)
      this.siteMarkers.add(disc)
      // floating letter
      const cv = document.createElement('canvas')
      cv.width = cv.height = 128
      const c = cv.getContext('2d')!
      c.fillStyle = '#' + color.toString(16).padStart(6, '0')
      c.font = 'bold 96px system-ui'
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(label, 64, 68)
      const tex = new THREE.CanvasTexture(cv)
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false }))
      sp.scale.set(4, 4, 1)
      sp.position.set(site.x, 3.4, site.z)
      this.siteMarkers.add(sp)
    }
    make(SITE_A, 0xffb347, 'A')
    make(SITE_B, 0x66c2ff, 'B')
  }

  /* ------------------------------ characters ------------------------------ */
  private buildCharacter(team: 'CT' | 'T'): { group: THREE.Group; parts: CharParts } {
    const group = new THREE.Group()
    const skin = team === 'CT' ? 0x3f6db5 : 0xb5563f
    const skinDark = team === 'CT' ? 0x2c4f87 : 0x8a3f2e
    const gear = team === 'CT' ? 0x2b3542 : 0x3a3129
    const matBody = this.mat(skin, 0.8)
    const matDark = this.mat(skinDark, 0.8)
    const matGear = this.mat(gear, 0.75)
    const matSkin = this.mat(0xc79a6b, 0.85)

    // legs (two, distinct)
    const legGeo = new THREE.BoxGeometry(0.24, 0.82, 0.26)
    const legL = new THREE.Mesh(legGeo, matGear)
    legL.position.set(-0.15, 0.41, 0)
    const legR = new THREE.Mesh(legGeo, matGear)
    legR.position.set(0.15, 0.41, 0)
    legL.castShadow = legR.castShadow = true
    group.add(legL, legR)

    // torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.34), matBody)
    torso.position.set(0, 1.18, 0)
    torso.castShadow = true
    group.add(torso)
    // chest rig
    const rig = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.4), matDark)
    rig.position.set(0, 1.28, 0)
    group.add(rig)

    // arms (two, held forward as if gripping a weapon)
    const armGeo = new THREE.BoxGeometry(0.18, 0.6, 0.2)
    const armL = new THREE.Mesh(armGeo, matBody)
    armL.position.set(-0.4, 1.2, 0.1)
    const armR = new THREE.Mesh(armGeo, matBody)
    armR.position.set(0.4, 1.2, 0.1)
    armL.castShadow = armR.castShadow = true
    group.add(armL, armR)

    // head (distinct, with a helmet for CT / balaclava look for T)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), matSkin)
    head.position.set(0, 1.78, 0)
    head.castShadow = true
    group.add(head)
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.38), team === 'CT' ? matDark : this.mat(0x2a2320, 0.7))
    helmet.position.set(0, 1.9, 0)
    group.add(helmet)
    // face direction marker (visor) so facing is readable
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.06), this.mat(0x111418, 0.4, 0.2))
    visor.position.set(0, 1.8, -0.18)
    group.add(visor)

    // a simple held rifle so the pose reads as armed
    const rifle = new THREE.Group()
    const rBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.7), this.mat(0x2a2a2c, 0.6, 0.2))
    rifle.add(rBody)
    const rBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.4, 8), this.mat(0x1c1c1e, 0.5, 0.3))
    rBarrel.rotation.x = Math.PI / 2
    rBarrel.position.z = -0.5
    rifle.add(rBarrel)
    rifle.position.set(0.22, 1.24, -0.3)
    group.add(rifle)

    return { group, parts: { legL, legR, armL, armR, torso, head, rifle } }
  }

  private ensureCharacter(e: Entity): CharParts {
    let p = this.parts.get(e.id)
    if (!p) {
      const { group, parts } = this.buildCharacter(e.team)
      this.scene.add(group)
      this.charGroup.set(e.id, group)
      this.parts.set(e.id, parts)
      p = parts
    }
    return p
  }

  /* ------------------------------ viewmodel ------------------------------ */
  private buildViewmodel(id: WeaponId): THREE.Group {
    const g = new THREE.Group()
    const dark = this.mat(0x23252a, 0.6, 0.25)
    const metal = this.mat(0x3a3d44, 0.45, 0.5)
    const wood = this.mat(0x6b4a2a, 0.8)
    if (id === 'knife') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.03), metal)
      blade.position.set(0, 0.1, 0)
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.05), wood)
      handle.position.set(0, -0.06, 0)
      g.add(blade, handle)
    } else {
      const isPistol = WEAPONS[id].slot === 'secondary'
      const len = id === 'awp' ? 0.9 : isPistol ? 0.34 : 0.62
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, len), id === 'ak47' ? wood : dark)
      body.position.set(0, 0, -len / 2)
      g.add(body)
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, len * 0.7, 8), metal)
      barrel.rotation.x = Math.PI / 2
      barrel.position.set(0, 0.02, -len - 0.05)
      g.add(barrel)
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.07, isPistol ? 0.14 : 0.22, 0.1), dark)
      mag.position.set(0, -0.14, -len * 0.42)
      g.add(mag)
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.09), dark)
      grip.position.set(0, -0.13, -0.02)
      grip.rotation.x = 0.2
      g.add(grip)
      if (id === 'awp') {
        const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12), metal)
        scope.rotation.x = Math.PI / 2
        scope.position.set(0, 0.12, -len * 0.55)
        g.add(scope)
      }
      if (!isPistol) {
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.24), id === 'ak47' ? wood : dark)
        stock.position.set(0, -0.02, 0.16)
        g.add(stock)
      }
    }
    return g
  }

  private updateViewmodel(e: Entity, bob: number, kick: number, scoped: boolean) {
    if (this.vmWeaponId !== e.current) {
      if (this.vmWeapon) this.viewmodelGroup.remove(this.vmWeapon)
      this.vmWeapon = this.buildViewmodel(e.current)
      this.viewmodelGroup.add(this.vmWeapon)
      this.vmWeaponId = e.current
    }
    // hide the viewmodel when scoped so the 2D overlay reads clean
    this.viewmodelGroup.visible = !scoped
    this.viewmodelGroup.position.set(0.22, -0.2 + Math.sin(bob) * 0.012, -0.35 + kick * 0.06)
    this.viewmodelGroup.rotation.set(kick * 0.5, 0, 0)
  }

  /* ------------------------------ per-frame ------------------------------ */
  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.viewmodel.aspect = w / h
    this.viewmodel.updateProjectionMatrix()
  }

  render(s: GameState, player: Entity, bob: number, recoilKick: number) {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const cam = this.activeCamera(s, player)

    // update characters
    for (const e of s.entities) {
      const g = this.charGroup.get(e.id)
      if (!g) { this.ensureCharacter(e); continue }
      const p = this.parts.get(e.id)!
      if (!e.alive) {
        // ragdoll-ish: lay the body flat
        g.visible = true
        g.position.set(e.x, 0.1, e.z)
        g.rotation.set(Math.PI / 2, 0, e.yaw)
        continue
      }
      g.rotation.set(0, 0, 0)
      g.position.set(e.x, e.y, e.z)
      g.rotation.y = e.yaw
      // walk cycle: swing legs and arms when moving
      const spd = Math.hypot(e.vx, e.vz)
      const swing = Math.sin(s.time * 12 + e.id) * Math.min(0.6, spd * 0.12)
      p.legL.rotation.x = swing
      p.legR.rotation.x = -swing
      p.armL.rotation.x = -swing * 0.5
      p.armR.rotation.x = swing * 0.5
      // hide the player's own body (first person) unless spectating
      g.visible = !(e.isPlayer && s.spectateId === -1 && player.alive)
    }

    // camera placement
    this.placeCamera(s, player, cam)

    // C4 mesh
    if (this.bombMesh) {
      const show = s.bomb.planted || (!s.bomb.carried && s.bomb.x !== 0)
      this.bombMesh.visible = show
      if (show) {
        this.bombMesh.position.set(s.bomb.x, s.bomb.y, s.bomb.z)
        const light = this.bombMesh.userData.light as THREE.Mesh
        const mat = light.material as THREE.MeshStandardMaterial
        const rate = s.bomb.planted ? Math.max(2, 10 - (s.time - s.bomb.plantedAt) * 0.2) : 2
        mat.emissiveIntensity = (Math.sin(s.time * rate) > 0 ? 2.4 : 0.3)
      }
    }

    // fx: tracers + impacts
    this.updateFx(dt)

    // draw the world then the viewmodel on top
    this.renderer.clear()
    this.renderer.render(this.scene, cam)
    if (player.alive && s.spectateId === -1) {
      this.updateViewmodel(player, bob, recoilKick, player.scoped)
      this.renderer.clearDepth()
      this.renderer.render(this.vmScene, this.viewmodel)
    }
  }

  private activeCamera(s: GameState, player: Entity): THREE.PerspectiveCamera {
    const fov = player.scoped ? 75 * WEAPONS[player.current].zoom! : 75
    this.camera.fov = fov
    this.camera.updateProjectionMatrix()
    return this.camera
  }

  private placeCamera(s: GameState, player: Entity, cam: THREE.PerspectiveCamera) {
    // spectate a teammate when the player is dead
    const e = s.spectateId !== -1 && !player.alive ? (s.entities.find((o) => o.id === s.spectateId) ?? player) : player
    const eyeY = e.y + 1.62
    cam.position.set(e.x, eyeY, e.z)
    // look along yaw/pitch (player's own aim; bots use their yaw)
    const yaw = e.isPlayer || s.spectateId !== -1 ? playerYawRef.yaw : e.yaw
    const pitch = e.isPlayer || s.spectateId !== -1 ? playerYawRef.pitch : 0
    const cp = Math.cos(pitch), sp = Math.sin(pitch)
    const cy = Math.cos(yaw), sy = Math.sin(yaw)
    cam.lookAt(e.x - sy * cp, eyeY + sp, e.z - cy * cp)
  }

  private updateFx(dt: number) {
    const fx = drainFx()
    for (const f of fx) {
      if (f.type === 'tracer') {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(f.x0, f.y0, f.z0),
          new THREE.Vector3(f.x1, f.y1, f.z1),
        ])
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.9 }))
        this.scene.add(line)
        this.tracers.push({ line, life: 0.06 })
      } else {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(f.blood ? 0.1 : 0.07, 6, 6),
          new THREE.MeshBasicMaterial({ color: f.blood ? 0x8a1414 : 0xffd08a, transparent: true, opacity: 0.95 })
        )
        mesh.position.set(f.x, f.y, f.z)
        this.scene.add(mesh)
        this.impacts.push({ mesh, life: f.blood ? 0.25 : 0.16 })
      }
    }
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i]
      t.life -= dt
      ;(t.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, t.life / 0.06) * 0.9
      if (t.life <= 0) { this.scene.remove(t.line); t.line.geometry.dispose(); this.tracers.splice(i, 1) }
    }
    for (let i = this.impacts.length - 1; i >= 0; i--) {
      const im = this.impacts[i]
      im.life -= dt
      ;(im.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, im.life * 4)
      im.mesh.scale.multiplyScalar(1 + dt * 3)
      if (im.life <= 0) { this.scene.remove(im.mesh); im.mesh.geometry.dispose(); this.impacts.splice(i, 1) }
    }
  }

  dispose() {
    this.renderer.dispose()
  }
}

const DOOR_GAP_WORLD = 1.5

interface CharParts {
  legL: THREE.Mesh
  legR: THREE.Mesh
  armL: THREE.Mesh
  armR: THREE.Mesh
  torso: THREE.Mesh
  head: THREE.Mesh
  rifle: THREE.Group
}

// A tiny shared ref so the renderer can read the player's live aim even though
// the snapshot entity is updated elsewhere.
export const playerYawRef = { yaw: 0, pitch: 0 }
