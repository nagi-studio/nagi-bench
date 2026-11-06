/* ============================================================================
   Film director — owns the three.js scene, the shot list and the master
   timeline. The film is assembled from hand-designed shots; each shot sets up
   its voxel set, camera framing and lighting, and is driven by a single clock
   that also feeds the subtitle layer and the procedural audio.

   Visual language: blocky / voxel geometry throughout (block characters and
   props), with cinematic framing, lighting, colour and camera moves layered on
   top. No external assets or textures — everything is generated in code.
   ========================================================================== */
import * as THREE from 'three'
import { VoxelBatch, buildHumanoid, buildMeteorite, buildBullet, buildRifle, buildStars } from './voxel.js'
import { CUES_SORTED, activeCueAt, FILM_LENGTH } from './cues.js'
import * as A from './audio.js'

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)
const ease = (a, b, t) => lerp(a, b, smooth(clamp(t, 0, 1)))

export class Film {
  constructor(container, subtitleEl) {
    this.container = container
    this.subtitleEl = subtitleEl

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(46, container.clientWidth / container.clientHeight, 0.1, 2000)

    this.clock = new THREE.Clock()
    this.time = 0
    this.playing = false
    this.currentShot = null
    this.shotObjects = null
    this.lastCueId = null
    this.audioScheduled = new Set()

    this._onResize = this._onResize.bind(this)
    window.addEventListener('resize', this._onResize)

    this.shots = buildShotList()
  }

  _onResize() {
    const w = this.container.clientWidth, h = this.container.clientHeight
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  play() {
    A.initAudio()
    A.resumeAudio()
    A.setMasterGain(0.9, 1.2)
    this.playing = true
    this.time = 0
    this.clock.getDelta()
  }
  pause() { this.playing = false }
  toggle() { this.playing ? this.pause() : this.play() }
  seek(t) { this.time = clamp(t, 0, FILM_LENGTH); this.audioScheduled.clear() }

  // find which shot owns time t
  _shotAt(t) {
    for (const s of this.shots) if (t >= s.start && t < s.end) return s
    return this.shots[this.shots.length - 1]
  }

  _ensureShot(shot) {
    if (this.currentShot === shot) return
    // tear down the previous shot's objects
    if (this.shotObjects) {
      this.scene.remove(this.shotObjects)
      this.shotObjects.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
      })
    }
    this.currentShot = shot
    this.shotObjects = shot.build(this.scene)
    // schedule this shot's audio (once)
    if (!this.audioScheduled.has(shot.id)) {
      this.audioScheduled.add(shot.id)
      if (shot.audio) shot.audio(A, shot.start, shot.end, this._audioBase())
    }
  }

  // The audio graph is scheduled on absolute AudioContext time. We anchor the
  // film clock to a base so one-shots land at the right wall-clock moment.
  _audioBase() {
    return A.audioTime() - this.time
  }

  update() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    if (this.playing) {
      this.time += dt
      if (this.time >= FILM_LENGTH) { this.time = FILM_LENGTH; this.playing = false; A.setMasterGain(0.0, 1.5) }
    }
    const t = this.time
    const shot = this._shotAt(t)
    this._ensureShot(shot)

    // local progress 0..1 within the shot
    const lt = clamp((t - shot.start) / (shot.end - shot.start), 0, 1)
    shot.update(this.scene, this.camera, this.shotObjects, t, lt, this)

    this._updateSubtitle(t)
    this.renderer.render(this.scene, this.camera)
  }

  _updateSubtitle(t) {
    const cue = activeCueAt(t)
    if (!cue) {
      if (this.subtitleEl.textContent !== '') this.subtitleEl.textContent = ''
      this.lastCueId = null
      return
    }
    if (cue.id !== this.lastCueId) {
      this.lastCueId = cue.id
      // Ambient/sound-effect cues are bracketed scene directions, still shown as
      // subtitles so the sound design is legible; they carry no spoken speaker.
      const label = cue.kind === 'ambient' ? '' : `【${cue.speaker}】`
      this.subtitleEl.textContent = label + cue.text
    }
  }

  dispose() {
    window.removeEventListener('resize', this._onResize)
    this.renderer.dispose()
  }
}

/* ============================================================================
   Shot list. Each shot: { id, start, end, build(scene)->Group, update(...),
   audio?(A,start,end,base) }.
   ========================================================================== */
function buildShotList() {
  return [
    shotTitle(),
    shotHospital(),
    shotBriefing(),
    shotPrivateComms(),
    shotWorkshopMeteor(),
    shotWorkshopBullets(),
    shotGuilt(),
    shotEVA(),
    shotAssassination(),
    shotAftermath(),
    shotVerdict(),
    shotHibernation(),
    shotFuture(),
    shotEnding(),
  ]
}

/* ---------- shared helpers ---------- */
function group() { return new THREE.Group() }

function addLights(g, key, fill, bg, ambientColor = 0x40506a, ambientI = 0.5) {
  const amb = new THREE.AmbientLight(ambientColor, ambientI)
  g.add(amb)
  const k = new THREE.DirectionalLight(key.color, key.i)
  k.position.set(...key.pos)
  k.castShadow = true
  k.shadow.mapSize.set(1024, 1024)
  k.shadow.camera.near = 1
  k.shadow.camera.far = 120
  const d = key.range || 40
  k.shadow.camera.left = -d; k.shadow.camera.right = d
  k.shadow.camera.top = d; k.shadow.camera.bottom = -d
  g.add(k)
  if (fill) {
    const f = new THREE.DirectionalLight(fill.color, fill.i)
    f.position.set(...fill.pos)
    g.add(f)
  }
  if (bg) {
    const b = new THREE.PointLight(bg.color, bg.i, bg.dist || 60)
    b.position.set(...bg.pos)
    g.add(b)
  }
  return g
}

function floorPlane(g, size, color, y = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ color, roughness: 0.95 }))
  m.rotation.x = -Math.PI / 2
  m.position.y = y
  m.receiveShadow = true
  g.add(m)
  return m
}

// Move the camera from a to b (position + lookAt) with easing.
function moveCamera(cam, from, to, lookFrom, lookTo, t) {
  cam.position.set(ease(from[0], to[0], t), ease(from[1], to[1], t), ease(from[2], to[2], t))
  const lx = ease(lookFrom[0], lookTo[0], t), ly = ease(lookFrom[1], lookTo[1], t), lz = ease(lookFrom[2], lookTo[2], t)
  cam.lookAt(lx, ly, lz)
}

/* ---------- Shot 1: title card over drifting starfield + a lone meteorite ---------- */
function shotTitle() {
  return {
    id: 'title', start: 0, end: 11,
    build() {
      const g = group()
      g.add(buildStars(1600, 300))
      const rock = buildMeteorite(2.4, 0x7a7f88)
      rock.position.set(0, 0, 0)
      g.add(rock)
      g.userData.rock = rock
      addLights(g, { color: 0xbcd4ff, i: 2.0, pos: [-30, 20, 20] }, { color: 0xffd9a0, i: 0.6, pos: [20, -10, -20] }, null, 0x202838, 0.6)
      return g
    },
    update(scene, cam, g, t, lt) {
      const rock = g.userData.rock
      rock.rotation.y = t * 0.15
      rock.rotation.x = Math.sin(t * 0.1) * 0.2
      moveCamera(cam, [0, 0, 26], [0, 1, 13], [0, 0, 0], [0, 0, 0], lt)
    },
  }
}

/* ---------- Shot 2: hospital — father's deathbed, young Zhang beside it ---------- */
function shotHospital() {
  return {
    id: 'hospital', start: 11, end: 30,
    build() {
      const g = group()
      floorPlane(g, 40, 0x2a2f38)
      // a bed
      const bed = new VoxelBatch()
      bed.region(-3, 0, -1, 3, 1, 1, 0x3d4552, 0.03)
      bed.region(-3, 2, -1, -3, 2, 1, 0x2b323c)
      bed.region(3, 2, -1, 3, 2, 1, 0x2b323c)
      bed.region(-2, 2, 0, 2, 2, 0, 0xdfe6ee, 0.04) // blanket
      const bedM = bed.build()
      bedM.position.set(0, 0, 0)
      g.add(bedM)
      // father (lying): reuse humanoid, laid flat
      const father = buildHumanoid({ suit: 0x6a7180, trim: 0x4a505c, skin: 0xb9a58c, height: 1.7 })
      father.rotation.z = Math.PI / 2
      father.position.set(0, 2.3, 0)
      father.scale.setScalar(0.9)
      g.add(father)
      // young Zhang standing
      const zhang = buildHumanoid({ suit: 0x33415a, trim: 0x222c3d, skin: 0xc79a6b, visor: 0x2b3542, height: 1.75 })
      zhang.position.set(-4.5, 0, 2.5)
      zhang.rotation.y = 0.7
      g.add(zhang)
      g.userData.zhang = zhang
      addLights(g, { color: 0xdfe8ff, i: 1.4, pos: [8, 16, 6], range: 24 }, { color: 0x6a86b0, i: 0.7, pos: [-10, 6, -6] }, { color: 0x88aaff, i: 12, pos: [0, 6, 0], dist: 20 }, 0x2a3346, 0.7)
      return g
    },
    update(scene, cam, g, t, lt) {
      const z = g.userData.zhang
      // a slow push-in, ending close on the father, then a subtle turn to Zhang
      moveCamera(cam, [-8, 5, 9], [-1.5, 3.2, 5.5], [0, 2, 0], [0, 2.2, 0], ease(0, 0.7, lt))
      if (lt > 0.7) {
        const k = (lt - 0.7) / 0.3
        moveCamera(cam, [-1.5, 3.2, 5.5], [-4, 3.4, 6], [0, 2.2, 0], [-4.5, 3, 2.5], ease(0, 1, k))
      }
      z.position.y = Math.sin(t * 1.2) * 0.03
    },
  }
}

/* ---------- Shot 3: space-force briefing, old guard slamming the table ---------- */
function shotBriefing() {
  return {
    id: 'briefing', start: 30, end: 58,
    build() {
      const g = group()
      floorPlane(g, 46, 0x232830)
      // long table
      const table = new VoxelBatch()
      table.region(-7, 0, -2, 7, 1, 2, 0x3a4250, 0.03)
      table.region(-7, 1, -2, 7, 1, 2, 0x4a5464)
      const tableM = table.build()
      tableM.position.y = 0
      g.add(tableM)
      // the old-guard officer at the head, standing, arm raised
      const old = buildHumanoid({ suit: 0x5a4030, trim: 0x3a2a20, skin: 0xc0a07a, accent: 0xc9a44a, height: 1.8 })
      old.position.set(0, 2, -3)
      g.add(old)
      g.userData.old = old
      // seated officers (blocks) around the table
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue
        const off = buildHumanoid({ suit: 0x33415a, trim: 0x222c3d, height: 1.6 })
        off.position.set(i * 3.2, 0, 3)
        off.rotation.y = Math.PI
        off.scale.setScalar(0.95)
        g.add(off)
      }
      // Zhang at the near end, calm
      const zhang = buildHumanoid({ suit: 0x33415a, trim: 0x222c3d, height: 1.75 })
      zhang.position.set(-6, 0, 3)
      zhang.rotation.y = Math.PI - 0.3
      g.add(zhang)
      g.userData.zhang = zhang
      // a big holographic drive schematic (wireframe) above the table
      const holo = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), new THREE.MeshBasicMaterial({ color: 0x59d0ff, wireframe: true, transparent: true, opacity: 0.55 }))
      holo.position.set(0, 6.5, 0)
      g.add(holo)
      g.userData.holo = holo
      addLights(g, { color: 0xdfe8ff, i: 1.5, pos: [10, 18, 8], range: 30 }, { color: 0x59a0ff, i: 0.8, pos: [-8, 8, -6] }, { color: 0x59d0ff, i: 20, pos: [0, 7, 0], dist: 26 }, 0x243044, 0.6)
      return g
    },
    update(scene, cam, g, t, lt) {
      g.userData.holo.rotation.y = t * 0.4
      g.userData.holo.rotation.x = Math.sin(t * 0.3) * 0.2
      const old = g.userData.old
      // the old guard slams the table around v011 (41-49s)
      const slam = t > 41 && t < 49.5
      old.userData.armR.rotation.x = slam ? -1.6 + Math.sin(t * 9) * 0.5 : -0.2
      if (lt < 0.55) moveCamera(cam, [0, 6, 14], [3, 4.5, 7], [0, 4, -2], [0, 4, -2], lt / 0.55)
      else moveCamera(cam, [3, 4.5, 7], [-5, 3.5, 8], [0, 4, -2], [-6, 3, 3], (lt - 0.55) / 0.45)
    },
    audio(A, start, end, base) {
      A.commsBlip(base + 32.2)
    },
  }
}

/* ---------- Shot 4: private comms — Zhang alone in a corridor, revealing intent ---------- */
function shotPrivateComms() {
  return {
    id: 'comms', start: 58, end: 90,
    build() {
      const g = group()
      floorPlane(g, 40, 0x1d222b)
      // corridor walls
      const wall = new VoxelBatch()
      wall.region(-2, 0, -10, -2, 6, 10, 0x2b323d, 0.05)
      wall.region(2, 0, -10, 2, 6, 10, 0x2b323d, 0.05)
      const wallM = wall.build()
      g.add(wallM)
      // strip lights along the corridor
      for (let z = -8; z <= 8; z += 4) {
        const l = new THREE.PointLight(0x88ccff, 8, 14)
        l.position.set(0, 5, z)
        g.add(l)
        const bar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.4), new THREE.MeshStandardMaterial({ color: 0xbfe4ff, emissive: 0x88ccff, emissiveIntensity: 1.4 }))
        bar.position.set(0, 5.6, z)
        g.add(bar)
      }
      const zhang = buildHumanoid({ suit: 0x33415a, trim: 0x222c3d, height: 1.78 })
      zhang.position.set(0, 0, 2)
      zhang.rotation.y = Math.PI
      g.add(zhang)
      g.userData.zhang = zhang
      addLights(g, { color: 0xbfd8ff, i: 0.9, pos: [4, 12, 6], range: 24 }, null, null, 0x1a2230, 0.4)
      return g
    },
    update(scene, cam, g, t, lt) {
      const z = g.userData.zhang
      // slow dolly down the corridor toward Zhang, then a tight profile
      moveCamera(cam, [0, 3.4, 12], [0, 3.0, 5.5], [0, 3, 0], [0, 3.2, 2], ease(0, 0.7, lt))
      if (lt > 0.7) moveCamera(cam, [0, 3.0, 5.5], [3.5, 2.8, 3.5], [0, 3.2, 2], [0, 3.2, 2], (lt - 0.7) / 0.3)
      // subtle head movement as he speaks into comms
      z.userData.head.rotation.y = Math.sin(t * 1.6) * 0.12
    },
    audio(A, start, end, base) {
      A.commsBlip(base + 68.2)
    },
  }
}

/* ---------- Shot 5: the meteorite in the workshop ---------- */
function shotWorkshopMeteor() {
  return {
    id: 'meteor', start: 90, end: 118,
    build() {
      const g = group()
      floorPlane(g, 40, 0x2a2622)
      // workbench
      const bench = new VoxelBatch()
      bench.region(-4, 0, -1, 4, 2, 1, 0x4a3d2c, 0.04)
      const benchM = bench.build()
      g.add(benchM)
      // the meteorite, glowing faintly, on the bench
      const rock = buildMeteorite(2.6, 0x6b6f78)
      rock.position.set(0, 3.4, 0)
      g.add(rock)
      g.userData.rock = rock
      // a warm rim light to sell "material from the sky"
      const rim = new THREE.PointLight(0xffb066, 26, 30)
      rim.position.set(-4, 6, 4)
      g.add(rim)
      // craftsman
      const smith = buildHumanoid({ suit: 0x6b5a3a, trim: 0x4a3d28, skin: 0xc79a6b, height: 1.75 })
      smith.position.set(-4.5, 0, 2.5)
      smith.rotation.y = 0.8
      g.add(smith)
      g.userData.smith = smith
      // Zhang watching
      const zhang = buildHumanoid({ suit: 0x2b3542, trim: 0x1c242e, height: 1.78 })
      zhang.position.set(4.5, 0, 3)
      zhang.rotation.y = -0.7
      g.add(zhang)
      g.userData.zhang = zhang
      addLights(g, { color: 0xffd9a0, i: 1.5, pos: [6, 14, 8], range: 26 }, { color: 0xff9a4a, i: 0.7, pos: [-8, 6, -4] }, null, 0x2a2016, 0.5)
      return g
    },
    update(scene, cam, g, t, lt) {
      const rock = g.userData.rock
      rock.rotation.y = t * 0.2
      // orbit the meteorite, then rack focus (by framing) to the two men
      if (lt < 0.6) moveCamera(cam, [6, 5, 8], [2.5, 4, 4.5], [0, 3.4, 0], [0, 3.4, 0], lt / 0.6)
      else moveCamera(cam, [2.5, 4, 4.5], [-6, 3.4, 6], [0, 3.4, 0], [-4.5, 2.6, 2.5], (lt - 0.6) / 0.4)
    },
    audio(A, start, end, base) {
      A.machiningLoop(base + 92, base + 116, base)
    },
  }
}

/* ---------- Shot 6: forging the bullets, the gunshot test in the basement ---------- */
function shotWorkshopBullets() {
  return {
    id: 'bullets', start: 118, end: 146,
    build() {
      const g = group()
      floorPlane(g, 44, 0x211d1a)
      // basement: low ceiling, dark brick walls
      const room = new VoxelBatch()
      room.region(-9, 0, -9, 9, 0, 9, 0x2b2622, 0.05) // floor blocks
      for (let x = -9; x <= 9; x += 1) { room.box(x, 5, -9, 1, 1, 1, 0x3a332c); room.box(x, 5, 9, 1, 1, 1, 0x3a332c) }
      const roomM = room.build()
      g.add(roomM)
      // a rack of meteorite bullets, glinting
      for (let i = 0; i < 5; i++) {
        const b = buildBullet(0.7)
        b.position.set(-2 + i * 1, 1.3, -3)
        b.rotation.x = Math.PI / 2
        g.add(b)
      }
      // the rifle on a stand
      const rifle = buildRifle(0.9)
      rifle.position.set(2.5, 1.2, 0)
      rifle.rotation.y = -0.4
      g.add(rifle)
      g.userData.rifle = rifle
      // Zhang
      const zhang = buildHumanoid({ suit: 0x2b3542, trim: 0x1c242e, height: 1.78 })
      zhang.position.set(3.2, 0, 1.6)
      zhang.rotation.y = -0.5
      g.add(zhang)
      g.userData.zhang = zhang
      // a hard single source + warm practical for the basement mood
      const prac = new THREE.PointLight(0xffb066, 18, 26)
      prac.position.set(-3, 4.4, -2)
      g.add(prac)
      addLights(g, { color: 0xffd9a0, i: 1.1, pos: [4, 8, 6], range: 20 }, null, null, 0x1a140e, 0.4)
      // muzzle flash sprite (hidden until the shot)
      const flash = new THREE.PointLight(0xffe0a0, 0, 30)
      flash.position.set(2.2, 1.6, -0.4)
      g.add(flash)
      g.userData.flash = flash
      g.userData.fired = false
      return g
    },
    update(scene, cam, g, t, lt) {
      const flash = g.userData.flash
      // a test shot at ~135s
      const shotT = 135
      if (!g.userData.fired && t >= shotT) {
        g.userData.fired = true
        flash.intensity = 60
      }
      flash.intensity = Math.max(0, flash.intensity - 3.2)
      if (lt < 0.5) moveCamera(cam, [-2, 3, 6], [1.5, 2.2, 4], [-1, 1.4, -3], [2.5, 1.2, 0], lt / 0.5)
      else moveCamera(cam, [1.5, 2.2, 4], [5, 2.6, 3.5], [2.5, 1.2, 0], [3.2, 3, 1.6], (lt - 0.5) / 0.5)
    },
    audio(A, start, end, base) {
      A.basementGunshot(base + 135)
    },
  }
}

/* ---------- Shot 7: guilt — Zhang alone under a single light, meteorite shards ---------- */
function shotGuilt() {
  return {
    id: 'guilt', start: 146, end: 166,
    build() {
      const g = group()
      floorPlane(g, 40, 0x14161a)
      const zhang = buildHumanoid({ suit: 0x2b3542, trim: 0x1c242e, height: 1.8 })
      zhang.position.set(0, 0, 0)
      g.add(zhang)
      g.userData.zhang = zhang
      // drifting meteorite shards around him (the weight of what he's made)
      const shards = []
      for (let i = 0; i < 10; i++) {
        const s = buildMeteorite(0.6, 0x8a8f98)
        s.position.set((Math.random() - 0.5) * 14, 1 + Math.random() * 6, (Math.random() - 0.5) * 10)
        g.add(s)
        shards.push(s)
      }
      g.userData.shards = shards
      const spot = new THREE.SpotLight(0xfff0d0, 30, 40, 0.5, 0.6, 1.5)
      spot.position.set(0, 14, 3)
      spot.target = zhang
      spot.castShadow = true
      g.add(spot)
      addLights(g, { color: 0xfff0d0, i: 0.4, pos: [0, 14, 3] }, null, null, 0x0a0c10, 0.25)
      return g
    },
    update(scene, cam, g, t, lt) {
      const z = g.userData.zhang
      z.userData.head.rotation.x = 0.25 + Math.sin(t * 0.8) * 0.05 // head bowed
      g.userData.shards.forEach((s, i) => {
        s.rotation.y = t * (0.2 + i * 0.03)
        s.rotation.x = t * 0.15
        s.position.y += Math.sin(t * 0.6 + i) * 0.004
      })
      // slow orbit, tightening
      const a = lt * Math.PI * 0.8 - 0.4
      const r = lerp(11, 6, lt)
      cam.position.set(Math.sin(a) * r, lerp(4, 3, lt), Math.cos(a) * r)
      cam.lookAt(0, 3, 0)
    },
    audio(A, start, end, base) {
      A.boom(base + 147)
    },
  }
}

/* ---------- Shot 8: EVA — the craft exterior, three old-guard figures, Zhang ---------- */
function shotEVA() {
  return {
    id: 'eva', start: 166, end: 192,
    build() {
      const g = group()
      g.add(buildStars(1800, 400))
      // the spacecraft hull (a big blocky structure)
      const hull = new VoxelBatch()
      hull.region(-8, -2, -3, 8, 2, 3, 0x8a9098, 0.05)
      hull.region(-10, -1, -1, 10, 1, 1, 0x6a7078, 0.04)
      const hullM = hull.build()
      hullM.position.set(0, 0, -6)
      g.add(hullM)
      // three old-guard astronauts outside, slowly moving
      const targets = []
      for (let i = 0; i < 3; i++) {
        const h = buildHumanoid({ suit: 0xdfe6ee, trim: 0x9aa4b0, visor: 0x2a3542, accent: 0xffb347, height: 1.8 })
        h.position.set(-3 + i * 3, 2.6, -1)
        h.rotation.y = Math.PI
        g.add(h)
        targets.push(h)
      }
      g.userData.targets = targets
      // Zhang in the airlock, watching
      const zhang = buildHumanoid({ suit: 0xdfe6ee, trim: 0x8a94a0, visor: 0x2a3542, accent: 0x33415a, height: 1.8 })
      zhang.position.set(6, 2.6, 2)
      zhang.rotation.y = -0.6
      g.add(zhang)
      g.userData.zhang = zhang
      // Earth as a large sphere below-behind
      const earth = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 32), new THREE.MeshStandardMaterial({ color: 0x2a5a9a, roughness: 0.9, emissive: 0x0a1830, emissiveIntensity: 0.4 }))
      earth.position.set(-40, -70, -60)
      g.add(earth)
      addLights(g, { color: 0xffffff, i: 2.4, pos: [40, 30, 20] }, { color: 0x88aaff, i: 0.5, pos: [-20, -10, -10] }, null, 0x0a1020, 0.35)
      return g
    },
    update(scene, cam, g, t, lt) {
      g.userData.targets.forEach((h, i) => {
        h.position.y = 2.6 + Math.sin(t * 0.5 + i) * 0.3
        h.rotation.z = Math.sin(t * 0.3 + i) * 0.1
      })
      moveCamera(cam, [14, 6, 16], [4, 4, 10], [0, 2.6, -2], [-1, 2.6, -1], lt)
    },
    audio(A, start, end, base) {
      A.shipAmbience(base + 167, base + 210)
    },
  }
}

/* ---------- Shot 9: the assassination in vacuum — silent, suit-conducted thump ---------- */
function shotAssassination() {
  return {
    id: 'assassin', start: 192, end: 212,
    build() {
      const g = group()
      g.add(buildStars(2000, 400))
      // Zhang with the rifle, braced
      const zhang = buildHumanoid({ suit: 0xdfe6ee, trim: 0x8a94a0, visor: 0x2a3542, accent: 0x33415a, height: 1.85 })
      zhang.position.set(0, 0, 0)
      g.add(zhang)
      g.userData.zhang = zhang
      const rifle = buildRifle(0.95)
      rifle.position.set(0.6, 5.2, -1.2)
      rifle.rotation.x = Math.PI / 2
      g.add(rifle)
      g.userData.rifle = rifle
      // the distant target
      const target = buildHumanoid({ suit: 0xdfe6ee, trim: 0x9aa4b0, visor: 0x2a3542, accent: 0xffb347, height: 1.8 })
      target.position.set(0, 0, -30)
      target.scale.setScalar(1)
      g.add(target)
      g.userData.target = target
      // muzzle flash
      const flash = new THREE.PointLight(0xfff0c0, 0, 40)
      flash.position.set(0.6, 5.2, -1.4)
      g.add(flash)
      g.userData.flash = flash
      // the meteorite bullet as a tiny fast shard
      const bullet = buildBullet(0.5)
      bullet.visible = false
      g.add(bullet)
      g.userData.bullet = bullet
      // a puff of white mist on the visor (subjective)
      const mist = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }))
      mist.position.set(0, 6.6, -0.6)
      g.add(mist)
      g.userData.mist = mist
      g.userData.fired = false
      addLights(g, { color: 0xffffff, i: 2.6, pos: [30, 20, 16] }, { color: 0x6688cc, i: 0.5, pos: [-20, 0, -10] }, null, 0x080c18, 0.3)
      return g
    },
    update(scene, cam, g, t, lt) {
      const fireT = 195
      const flash = g.userData.flash
      const bullet = g.userData.bullet
      const mist = g.userData.mist
      if (!g.userData.fired && t >= fireT) {
        g.userData.fired = true
        flash.intensity = 40
        bullet.visible = true
        bullet.position.set(0.6, 5.2, -1.4)
        bullet.rotation.x = Math.PI / 2
      }
      flash.intensity = Math.max(0, flash.intensity - 2.4)
      if (bullet.visible) {
        bullet.position.z -= 1.4
        if (bullet.position.z < -30) {
          bullet.visible = false
          // the target's visor fogs and the body drifts
          mist.material.opacity = 0
        }
      }
      // target reacts after impact (~2s after fire)
      const tgt = g.userData.target
      if (t > fireT + 1.4) {
        tgt.rotation.x = Math.min(1.4, (t - fireT - 1.4) * 0.7)
        tgt.position.y = Math.max(-3, tgt.position.y - 0.02)
      }
      // camera: hold on Zhang's braced profile, then whip toward the drifting body
      if (lt < 0.45) moveCamera(cam, [5, 6, 7], [3.2, 5.4, 4], [0, 5, -1], [0, 5, -1], lt / 0.45)
      else moveCamera(cam, [3.2, 5.4, 4], [-2, 3, -14], [0, 5, -1], [0, 1, -30], (lt - 0.45) / 0.55)
    },
    audio(A, start, end, base) {
      // vacuum: NO external gunshot, only the suit-conducted thump + heartbeat
      A.vacuumThump(base + 195.2)
    },
  }
}

/* ---------- Shot 10: aftermath — chaos inside, Zhang motionless ---------- */
function shotAftermath() {
  return {
    id: 'aftermath', start: 212, end: 230,
    build() {
      const g = group()
      floorPlane(g, 44, 0x1a1e26)
      // interior of the craft: corridor with alarm lights
      const room = new VoxelBatch()
      room.region(-8, 0, -6, 8, 0, 6, 0x2a2f38, 0.04)
      const roomM = room.build()
      g.add(roomM)
      const alarmA = new THREE.PointLight(0xff3b30, 0, 30)
      alarmA.position.set(-4, 5, 0)
      g.add(alarmA)
      const alarmB = new THREE.PointLight(0xff3b30, 0, 30)
      alarmB.position.set(4, 5, 0)
      g.add(alarmB)
      g.userData.alarmA = alarmA
      g.userData.alarmB = alarmB
      // crew rushing (blocks)
      const crew = []
      for (let i = 0; i < 4; i++) {
        const c = buildHumanoid({ suit: 0xdfe6ee, trim: 0x8a94a0, visor: 0x2a3542, height: 1.75 })
        c.position.set(-5 + i * 3.2, 0, 2)
        g.add(c)
        crew.push(c)
      }
      g.userData.crew = crew
      // Zhang, unnervingly calm at the edge
      const zhang = buildHumanoid({ suit: 0xdfe6ee, trim: 0x8a94a0, visor: 0x2a3542, accent: 0x33415a, height: 1.8 })
      zhang.position.set(6, 0, -3)
      zhang.rotation.y = -0.5
      g.add(zhang)
      g.userData.zhang = zhang
      addLights(g, { color: 0xbfd8ff, i: 0.8, pos: [6, 12, 8], range: 26 }, null, null, 0x161c28, 0.4)
      return g
    },
    update(scene, cam, g, t, lt) {
      const pulse = (Math.sin(t * 6) + 1) * 0.5
      g.userData.alarmA.intensity = 6 + pulse * 20
      g.userData.alarmB.intensity = 6 + (1 - pulse) * 20
      g.userData.crew.forEach((c, i) => {
        c.position.x += Math.sin(t * 2 + i) * 0.02
        c.userData.head.rotation.y = Math.sin(t * 3 + i) * 0.4
      })
      moveCamera(cam, [-9, 4, 8], [4, 3.4, 5], [-2, 3, 0], [6, 3, -3], lt)
    },
    audio(A, start, end, base) {
      A.alarm(base + 213, base + 224)
      A.commsBlip(base + 202.5)
    },
  }
}

/* ---------- Shot 11: the verdict — investigation, Zhang cleared ---------- */
function shotVerdict() {
  return {
    id: 'verdict', start: 230, end: 258,
    build() {
      const g = group()
      floorPlane(g, 44, 0x22262e)
      // an interrogation / briefing room: table, two seats
      const table = new VoxelBatch()
      table.region(-3, 0, -1, 3, 1, 1, 0x3a4250)
      const tableM = table.build()
      g.add(tableM)
      const officer = buildHumanoid({ suit: 0x4a5568, trim: 0x333d4d, skin: 0xc79a6b, accent: 0x8a94a0, height: 1.78 })
      officer.position.set(0, 0, -3)
      g.add(officer)
      const zhang = buildHumanoid({ suit: 0x33415a, trim: 0x222c3d, height: 1.78 })
      zhang.position.set(0, 0, 3)
      zhang.rotation.y = Math.PI
      g.add(zhang)
      g.userData.zhang = zhang
      // a screen showing the "micrometeoroid" conclusion
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.4), new THREE.MeshStandardMaterial({ color: 0x0a1a2a, emissive: 0x2a6a9a, emissiveIntensity: 0.7 }))
      screen.position.set(-5, 4, -4)
      screen.rotation.y = 0.6
      g.add(screen)
      addLights(g, { color: 0xdfe8ff, i: 1.3, pos: [6, 14, 8], range: 26 }, { color: 0x59a0ff, i: 0.5, pos: [-6, 6, -4] }, null, 0x1c2634, 0.5)
      return g
    },
    update(scene, cam, g, t, lt) {
      const z = g.userData.zhang
      z.userData.head.rotation.y = Math.sin(t * 1.1) * 0.1
      // shot-reverse-shot: officer then Zhang
      const cycle = (t % 8) / 8
      if (cycle < 0.5) moveCamera(cam, [2, 3.4, 6], [2.4, 3.2, 5.4], [0, 3, -3], [0, 3, -3], cycle / 0.5)
      else moveCamera(cam, [-2.4, 3.2, -5.4], [-2, 3.4, -6], [0, 3, 3], [0, 3, 3], (cycle - 0.5) / 0.5)
    },
    audio(A, start, end, base) {
      A.commsBlip(base + 232.4)
    },
  }
}

/* ---------- Shot 12: hibernation — the pod closes, time compresses ---------- */
function shotHibernation() {
  return {
    id: 'hibernate', start: 258, end: 292,
    build() {
      const g = group()
      floorPlane(g, 40, 0x12161c)
      // a hibernation pod (vertical capsule of blocks)
      const pod = new VoxelBatch()
      for (let y = 0; y < 8; y++) {
        const r = y === 0 || y === 7 ? 2 : 2
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2
          pod.box(Math.cos(ang) * r, y * 0.9, Math.sin(ang) * r, 1, 0.9, 1, y % 2 ? 0x3a4658 : 0x2c3644)
        }
      }
      const podM = pod.build()
      podM.position.set(0, 0, 0)
      g.add(podM)
      // Zhang inside, reclined
      const zhang = buildHumanoid({ suit: 0x9aa8bc, trim: 0x6a788c, height: 1.7 })
      zhang.position.set(0, 1, 0)
      zhang.rotation.x = -0.2
      g.add(zhang)
      g.userData.zhang = zhang
      // frost / cryo glow
      const cryo = new THREE.PointLight(0x88ddff, 16, 20)
      cryo.position.set(0, 4, 0)
      g.add(cryo)
      g.userData.cryo = cryo
      // stars drifting past to suggest centuries
      g.add(buildStars(1200, 200))
      addLights(g, { color: 0xbfe4ff, i: 1.1, pos: [6, 12, 6], range: 22 }, null, null, 0x101820, 0.35)
      return g
    },
    update(scene, cam, g, t, lt) {
      g.userData.cryo.intensity = 12 + Math.sin(t * 2) * 4
      g.userData.zhang.userData.head.rotation.x = -0.2
      // slow pull-back while the pod rotates and stars streak
      const a = lt * Math.PI * 1.2
      const r = lerp(6, 14, lt)
      cam.position.set(Math.sin(a) * r, lerp(4, 6, lt), Math.cos(a) * r)
      cam.lookAt(0, 3, 0)
    },
    audio(A, start, end, base) {
      A.hibernation(base + 259, base + 291)
    },
  }
}

/* ---------- Shot 13: the future — waking, the fleet, an officer greeting him ---------- */
function shotFuture() {
  return {
    id: 'future', start: 292, end: 322,
    build() {
      const g = group()
      g.add(buildStars(2200, 500))
      // Zhang, newly thawed
      const zhang = buildHumanoid({ suit: 0xdfe6ee, trim: 0x9aa4b0, visor: 0x2a3542, height: 1.8 })
      zhang.position.set(0, 0, 0)
      g.add(zhang)
      g.userData.zhang = zhang
      // a future officer
      const officer = buildHumanoid({ suit: 0x4a6a8a, trim: 0x2c4a6a, visor: 0x1a2430, accent: 0x66c2ff, height: 1.8 })
      officer.position.set(3.5, 0, 2)
      officer.rotation.y = -0.6
      g.add(officer)
      // distant fleet: rows of glowing ships
      for (let i = 0; i < 14; i++) {
        const ship = new VoxelBatch()
        ship.region(-1, 0, -2, 1, 0, 2, 0x8a94a0)
        ship.box(0, 0.6, 0, 1, 1, 1, 0x66c2ff)
        const m = ship.build({ roughness: 0.5, metalness: 0.4 })
        const ang = (i / 14) * Math.PI * 2
        const r = 40 + (i % 4) * 12
        m.position.set(Math.cos(ang) * r, 6 + Math.sin(i) * 8, Math.sin(ang) * r - 20)
        m.scale.setScalar(1.4)
        g.add(m)
        const eng = new THREE.PointLight(0x66c2ff, 6, 24)
        eng.position.copy(m.position)
        g.add(eng)
      }
      addLights(g, { color: 0xffffff, i: 2.0, pos: [30, 24, 16] }, { color: 0x66aaff, i: 0.7, pos: [-20, 6, -10] }, null, 0x0a1220, 0.4)
      return g
    },
    update(scene, cam, g, t, lt) {
      const z = g.userData.zhang
      z.userData.head.rotation.y = Math.sin(t * 0.6) * 0.25
      z.userData.head.rotation.x = -0.1
      moveCamera(cam, [0, 3, 9], [7, 4, 9], [0, 4, 0], [0, 5, -10], ease(0, 1, lt))
    },
    audio(A, start, end, base) {
      A.shipAmbience(base + 293, base + 321)
      A.commsBlip(base + 313.4)
    },
  }
}

/* ---------- Shot 14: ending — Zhang alone against the stars, meteorite dust ---------- */
function shotEnding() {
  return {
    id: 'ending', start: 322, end: FILM_LENGTH,
    build() {
      const g = group()
      g.add(buildStars(2600, 600))
      const zhang = buildHumanoid({ suit: 0xdfe6ee, trim: 0x9aa4b0, visor: 0x2a3542, height: 1.9 })
      zhang.position.set(0, 0, 0)
      g.add(zhang)
      g.userData.zhang = zhang
      // a slowly dispersing cloud of meteorite dust (the bullets, returned to sky)
      const dust = []
      for (let i = 0; i < 60; i++) {
        const s = buildMeteorite(0.24, 0x9aa0aa)
        const ang = Math.random() * Math.PI * 2
        const r = 3 + Math.random() * 10
        s.position.set(Math.cos(ang) * r, 2 + Math.random() * 8, Math.sin(ang) * r)
        s.userData.vy = 0.002 + Math.random() * 0.004
        g.add(s)
        dust.push(s)
      }
      g.userData.dust = dust
      const key = new THREE.SpotLight(0xfff0d0, 20, 60, 0.6, 0.7, 1.2)
      key.position.set(6, 16, 8)
      key.target = zhang
      g.add(key)
      addLights(g, { color: 0xbfd8ff, i: 0.6, pos: [-8, 10, -6] }, null, null, 0x080c16, 0.3)
      return g
    },
    update(scene, cam, g, t, lt) {
      const z = g.userData.zhang
      z.userData.head.rotation.x = -0.18
      g.userData.dust.forEach((s) => {
        s.position.y += s.userData.vy
        s.rotation.y += 0.01
        s.rotation.x += 0.006
      })
      // a long, slow pull-back to a wide, lonely frame; fade handled by host
      const r = lerp(7, 22, lt)
      const a = lerp(0.3, 0.9, lt)
      cam.position.set(Math.sin(a) * r, lerp(4, 7, lt), Math.cos(a) * r)
      cam.lookAt(0, 4, 0)
    },
    audio(A, start, end, base) {
      A.boom(base + 334)
      A.setMasterGain(0.0, 6) // long fade to silence over the final seconds
    },
  }
}
