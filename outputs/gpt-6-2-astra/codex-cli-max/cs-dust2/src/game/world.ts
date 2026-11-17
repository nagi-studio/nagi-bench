import * as T from 'three'
import { Batch, paint, panelTexture, texture, random, V } from './geometry'
import {
  walls,
  gates,
  crates,
  roofs,
  ground,
  sites,
  gateLeaves,
  towers,
  rooftops,
  palms,
} from './map'

export function buildWorld(scene: T.Scene) {
  const b = new Batch(),
    rng = random(903317)
  const plaster = texture('plaster'),
    stoneMap = texture('stone'),
    woodMap = texture('wood')
  const mat = (c: string, map?: T.Texture) => {
    const m = new T.MeshLambertMaterial({ color: c })
    if (map) m.map = map
    return m
  }
  const stucco = ['#dac19b', '#caab84', '#e4d1ad', '#d4b58e', '#c7a079', '#e1c9a4'].map((c) =>
    mat(c, plaster)
  )
  const cream = mat('#e6d1a9', plaster),
    sandstone = mat('#bea47e', stoneMap),
    tile = mat('#4b827c', plaster)
  const ledge = mat('#cdb792', plaster),
    darkstone = mat('#9b856b', plaster),
    teal = mat('#427571', woodMap),
    blue = mat('#598782', woodMap)
  const timbers = [
    mat('#9f845c', woodMap),
    mat('#b39a70', woodMap),
    mat('#927b59', woodMap),
    mat('#c2aa7d', woodMap),
  ]
  const doorwood = mat('#705d46', woodMap),
    iron = mat('#4e534c'),
    metal = mat('#686b5c'),
    dark = mat('#353f3d'),
    recess = mat('#394441')
  const pale = mat('#c9c2a7', plaster),
    pipe = mat('#8c826e'),
    crateGreen = mat('#87907a', plaster)
  const blackIron = mat('#383e39')
  const archStone = ['#c5aa83', '#dec59c', '#d6b890', '#e2cba7', '#ccb58e'].map((c) =>
    mat(c, plaster)
  )

  const terrain = new T.PlaneGeometry(176, 164, 120, 112)
  terrain.rotateX(-Math.PI / 2)
  const p = terrain.attributes.position,
    uv = terrain.attributes.uv
  for (let i = 0; i < p.count; i++) {
    p.setY(i, ground(p.getX(i), p.getZ(i)) - 0.015)
    uv.setXY(i, p.getX(i) / 8, p.getZ(i) / 8)
  }
  terrain.computeVertexNormals()
  const groundMap = panelTexture(
    512,
    512,
    (ctx) => {
      ctx.fillStyle = '#decaab'
      ctx.fillRect(0, 0, 512, 512)
      const im = ctx.getImageData(0, 0, 512, 512)
      for (let i = 0; i < im.data.length; i += 4) {
        const x = (i / 4) % 512,
          y = Math.floor(i / 4 / 512)
        const n =
          (rng() - 0.52) * 25 +
          4 * Math.sin(x * 0.031 + Math.sin(y * 0.026) * 3) +
          4 * Math.sin(x * 0.0123 - y * 0.0245)
        for (let k = 0; k < 3; k++) im.data[i + k] += n
      }
      ctx.putImageData(im, 0, 0)
      for (let i = 0; i < 4500; i++) {
        const x = rng() * 512,
          y = rng() * 512,
          r = rng() ** 3 * 1.9 + 0.4
        ctx.fillStyle = rng() > 0.45 ? 'rgba(98,82,58,.23)' : 'rgba(255,252,227,.38)'
        ctx.fillRect(x, y, r * 1.7, r * 0.7)
      }
      for (let i = 0; i < 11; i++) {
        const x = rng() * 512,
          y = rng() * 512
        ctx.fillStyle = 'rgba(130,105,72,.12)'
        ctx.beginPath()
        ctx.ellipse(x, y, rng() * 10 + 4, rng() * 4 + 2, rng(), 0, 7)
        ctx.fill()
      }
    },
    true
  )
  const earth = mat('#e7d8c3', groundMap)
  const earthMesh = new T.Mesh(terrain, earth),
    tints = []
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      z = p.getZ(i)
    const k =
      0.94 +
      0.029 * Math.sin(x * 1.42 + Math.cos(z * 0.53)) +
      0.033 * Math.sin(z * 0.76 + x * 0.3) +
      0.021 * Math.sin(x * 0.52 - z * 0.56)
    tints.push(k, k * 0.996, k * 0.983)
  }
  terrain.setAttribute('color', new T.Float32BufferAttribute(tints, 3))
  earth.vertexColors = true
  earthMesh.receiveShadow = true
  scene.add(earthMesh)
  const floorStones = ['#c6b495', '#cdb99b', '#cfc0a6', '#bda98b', '#d9c7aa'].map((c) =>
    mat(c, plaster)
  )
  function pavers(x: number, z: number, w: number, d: number) {
    const rowH = 0.63
    for (let row = 0; row < d / rowH; row++)
      for (let j = 0; j < w / 1.12; j++) {
        if (rng() < 0.1) continue
        const xx = x - w / 2 + j * 1.12 + (row % 2) * 0.48,
          zz = z - d / 2 + row * rowH
        const y = ground(xx, zz)
        b.box(
          xx,
          y + 0.003 + rng() * 0.008,
          zz,
          1.07 + rng() * 0.027,
          0.032,
          rowH - 0.026,
          floorStones[Math.floor(rng() * 5)],
          (rng() - 0.5) * 0.02
        )
      }
  }
  pavers(20.8, 23.7, 8.1, 6.5)
  pavers(1, -14, 8, 5.1)
  pavers(-37.2, -9.8, 5.2, 5.1)
  // Sand drifts break up the paving joints as the old street opens into the court.
  const road = panelTexture(384, 768, (c) => {
    const colors = ['#bdaf98', '#c5b69c', '#b7a990', '#cebea3', '#c6b9a2', '#ccbaa0']
    for (let row = 0; row < 45; row++) {
      let x = (row % 2 ? -16 : 0) - 4
      while (x < 384) {
        const w = 22 + rng() * 20,
          y = row * 17.3,
          col = colors[Math.floor(rng() * 6)],
          skew = (rng() - 0.5) * 3
        c.fillStyle = col
        c.beginPath()
        c.moveTo(x + 2.1, y + 1)
        c.lineTo(x + w - 1.8, y + skew + 0.7)
        c.lineTo(x + w - 0.8, y + 14.6)
        c.lineTo(x + w - 3.5, y + 16)
        c.lineTo(x + 1, y + 15.7)
        c.closePath()
        c.fill()
        c.strokeStyle = 'rgba(85,74,54,.24)'
        c.lineWidth = 1.1
        c.stroke()
        c.strokeStyle = 'rgba(246,235,208,.65)'
        c.beginPath()
        c.moveTo(x + 2, y + 14.9)
        c.lineTo(x + 2, y + 1.5)
        c.lineTo(x + w - 3, y + skew + 1.4)
        c.stroke()
        x += w
      }
    }
    const im = c.getImageData(0, 0, 384, 768)
    for (let y = 0; y < 768; y++)
      for (let x = 0; x < 384; x++) {
        const i = 4 * (y * 384 + x),
          edge = Math.min(x, 384 - x)
        const n =
          Math.sin(x * 0.021 + y * 0.006) +
          0.61 * Math.sin(y * 0.061 - x * 0.02) +
          0.42 * Math.sin(x * 0.11 + y * 0.079)
        const wear =
          Math.max(0, Math.min(0.89, (edge - 14 + 14 * n) / 43)) *
          0.89 *
          Math.max(0, Math.min(1, 0.66 + n * 0.38))
        const f = (rng() - 0.5) * 17
        for (let k = 0; k < 3; k++) im.data[i + k] += f
        im.data[i + 3] *= wear
      }
    c.putImageData(im, 0, 0)
  })
  const avenue = new T.Mesh(
    new T.PlaneGeometry(7.65, 20.4),
    new T.MeshLambertMaterial({
      map: road,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  )
  avenue.rotation.x = -Math.PI / 2
  avenue.rotation.z = 0.09
  avenue.position.set(20.98, 0.008, 35.57)
  avenue.receiveShadow = true
  scene.add(avenue)
  const shadeMap = panelTexture(128, 32, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 32)
    g.addColorStop(0, 'rgba(57,43,30,0)')
    g.addColorStop(1, 'rgba(57,43,30,.28)')
    c.fillStyle = g
    c.fillRect(0, 0, 128, 32)
  })
  const grime = new T.MeshBasicMaterial({
    map: shadeMap,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  })
  const crackMat = mat('#b49973', plaster)
  const facade = (
    x: number,
    z: number,
    nx: number,
    nz: number,
    len: number,
    h: number,
    pick: number,
    idx: number
  ) => {
    const ry = Math.atan2(nx, nz),
      tx = nz,
      tz = -nx,
      base = ground(x, z)
    const part = (
      u: number,
      y: number,
      v: number,
      w: number,
      hh: number,
      d: number,
      m: T.Material,
      rx = 0
    ) => b.box(x + tx * u + nx * v, base + y, z + tz * u + nz * v, w, hh, d, m, ry, rx, 0, 3)
    const markedFront = nz === 1 && Math.abs(z - 27) < 0.1 && x + len / 2 > 5 && x - len / 2 < 12
    const depth = 2.1
    part(0, h / 2 - 0.55, -depth / 2, len + 0.026, h + 1.1, depth, stucco[pick])
    part(0, h - 0.04, -0.8, len + 0.16, 0.16, 1.99, ledge)
    part(0, h + 0.17, -0.51, len + 0.11, 0.3, 1.13, stucco[pick])
    part(0, h + 0.37, -0.5, len + 0.22, 0.095, 1.31, cream)
    part(0, 0.2, 0.024, len, 0.41, 0.095, sandstone)
    b.add(new T.PlaneGeometry(len, 0.8), grime, x + nx * 0.06, base + 0.52, z + nz * 0.06, 0, ry)
    const window = (u: number, y: number, w: number, hh: number, shutters: boolean) => {
      part(u, y, -0.005, w + 0.2, hh + 0.2, 0.11, ledge)
      part(u, y, 0.067, w, hh, 0.046, recess)
      part(u, y - hh / 2 - 0.01, 0.13, w + 0.31, 0.105, 0.3, cream)
      part(u, y + hh / 2 + 0.06, 0.085, w + 0.26, 0.108, 0.21, cream)
      if (shutters) {
        for (const side of [-1, 1]) {
          part(
            u + side * w * 0.26,
            y,
            0.096,
            w * 0.43,
            hh - 0.032,
            0.055,
            idx % 3 ? teal : doorwood
          )
          for (let k = 0; k < 7; k++)
            part(
              u + side * w * 0.26,
              y - hh * 0.39 + k * hh * 0.12,
              0.132,
              w * 0.35,
              0.041,
              0.04,
              idx % 3 ? blue : timbers[2]
            )
        }
      } else {
        for (const f of [-0.34, -0.12, 0.12, 0.34]) part(u + w * f, y, 0.12, 0.035, hh, 0.035, iron)
        part(u, y, 0.13, w, 0.028, 0.034, iron)
      }
    }
    if (len > 3.5) {
      const num = Math.max(1, Math.floor(len / 3.65))
      for (let k = 0; k < num; k++) {
        if (rng() < 0.16) continue
        const u = ((k + 0.5) * len) / num - len / 2
        window(
          u,
          h - 1.3 - rng() * 0.28,
          0.76 + rng() * 0.46,
          1.11 + rng() * 0.26,
          (idx + k) % 4 !== 0
        )
      }
      if (!markedFront && idx % 3 !== 0 && len > 5) {
        const u = (idx % 2 ? 0.26 : -0.27) * len,
          w = 1.33
        part(u, 1.32, 0.02, w + 0.3, 2.61, 0.12, sandstone)
        part(u, 1.26, 0.092, w, 2.45, 0.072, idx % 4 ? teal : doorwood)
        for (let j = 0; j < 7; j++)
          part(u - 0.55 + j * 0.18, 1.25, 0.14, 0.014, 2.36, 0.012, idx % 4 ? blue : timbers[2])
        part(u, 1.74, 0.155, w, 0.08, 0.04, iron)
        part(u, 0.54, 0.155, w, 0.085, 0.04, iron)
        part(u + 0.4, 1.17, 0.184, 0.08, 0.12, 0.06, dark)
        part(u, 0.066, 0.22, w + 0.32, 0.105, 0.47, ledge)
        if (idx % 3 === 1) {
          part(u, 2.81, 0.4, 2.17, 0.13, 1.03, teal, 0.11)
          for (const sign of [-1, 1])
            part(u + sign * 0.84, 2.58, 0.2, 0.075, 0.43, 0.54, timbers[2], -0.35)
        }
      }
      if (!markedFront && idx % 4 === 1) {
        const u = -len * 0.31
        part(u, 3.35, 0.23, 1.02, 0.61, 0.48, pale)
        for (let k = 0; k < 8; k++)
          part(u - 0.36 + 0.103 * k, 3.36, 0.48, 0.052, 0.39, 0.025, metal)
        part(u - 0.38, 2.81, 0.09, 0.043, 0.68, 0.085, pipe)
      }
      if (idx % 3 === 0) {
        const u = len * 0.45
        part(u, h * 0.47, 0.1, 0.059, h * 0.95, 0.068, pipe)
        for (let j = 1; j < h; j += 1.2) part(u, j, 0.105, 0.097, 0.069, 0.12, iron)
      }
      // Small patches of exposed old masonry interrupt the limewash.
      if (len > 5) {
        const u = len * (rng() - 0.5) * 0.65
        for (let j = 0; j < 3; j++)
          for (let k = 0; k < 4; k++) {
            if (rng() > 0.66) continue
            part(
              u + k * 0.32 + (j % 2) * 0.13,
              0.4 + j * 0.145,
              0.017,
              0.305,
              0.124,
              0.026,
              crackMat
            )
          }
      }
    }
  }
  let idx = 0
  for (const e of walls) {
    const count = Math.max(1, Math.round(e.length / (8 + rng() * 3)))
    for (let k = 0; k < count; k++) {
      const len = e.length / count,
        u = (k + 0.5) * len - e.length / 2,
        x = e.x + e.nz * u,
        z = e.z - e.nx * u
      const variation = rng() * 2.6
      const h =
        e.nz === 1 && z === 27 && x + len / 2 > 5 && x - len / 2 < 12
          ? 7.18
          : (e.length < 3 ? 4.7 : 5.15) + variation
      facade(x, z, e.nx, e.nz, len, h, Math.floor(rng() * stucco.length), idx++)
    }
  }
  function decal(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    rot: number,
    draw: (c: CanvasRenderingContext2D) => void
  ) {
    const map = panelTexture(512, 256, draw),
      m = new T.MeshBasicMaterial({
        map,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        toneMapped: false,
      })
    b.add(new T.PlaneGeometry(w, h), m, x, y, z, 0, rot)
  }
  const marking = (letter: string, arrow: number) => (c: CanvasRenderingContext2D) => {
    c.fillStyle = '#a54934'
    c.save()
    c.translate(28, 8)
    c.rotate(-0.055)
    if (letter === 'A') {
      c.strokeStyle = '#aa4831'
      c.lineCap = 'square'
      c.lineWidth = 18
      c.beginPath()
      c.moveTo(17, 209)
      c.lineTo(96, 32)
      c.lineTo(156, 213)
      c.moveTo(47, 148)
      c.lineTo(134, 142)
      c.stroke()
    } else {
      c.font = 'bold 234px sans-serif'
      c.fillText(letter, 12, 214)
    }
    c.restore()
    c.save()
    c.translate(335, 134)
    if (arrow < 0) c.rotate(Math.PI)
    c.strokeStyle = '#a54934'
    c.lineWidth = 19
    c.lineJoin = 'miter'
    c.beginPath()
    c.moveTo(-83, 8)
    c.lineTo(90, -4)
    c.lineTo(44, -46)
    c.moveTo(89, -4)
    c.lineTo(41, 45)
    c.stroke()
    c.restore()
    c.globalCompositeOperation = 'destination-out'
    for (let j = 0; j < 7200; j++) {
      c.fillStyle = 'rgba(0,0,0,' + rng() * 0.65 + ')'
      c.fillRect(rng() * 512, rng() * 256, rng() * 3 + 0.6, rng() * 1.7 + 0.4)
    }
    c.globalCompositeOperation = 'source-over'
  }
  decal(8.2, 3.78, 27.074, 4.51, 2.42, 0, marking('A', 1))
  decal(5.925, 2.4, -19.0, 2.35, 1.75, -Math.PI / 2, marking('A', -1))
  decal(-27.05, 2.55, -18.7, 3.2, 1.88, -Math.PI / 2, marking('B', 1))
  decal(32.04, 3.3, -9.1, 3.9, 2.2, Math.PI / 2, marking('A', 1))
  const washed = panelTexture(
    512,
    160,
    (c) => {
      const im = c.createImageData(512, 160)
      for (let y = 0; y < 160; y++)
        for (let x = 0; x < 512; x++) {
          const i = (y * 512 + x) * 4,
            n = Math.sin(x * 0.047) + 0.53 * Math.sin(x * 0.22) + 0.35 * Math.sin(x * 0.61)
          const edge = 14 + n * 6 + 3 * Math.sin(x * 0.027 + y * 0.045),
            grain = rng() * 15
          im.data[i] = 100 + grain
          im.data[i + 1] = 134 + grain
          im.data[i + 2] = 122 + grain
          const chips =
            Math.sin(x * 0.056 + y * 0.028) * Math.sin(y * 0.119 - x * 0.019) +
            Math.sin(x * 0.19 + y * 0.088) * 0.23
          im.data[i + 3] = y < edge ? 0 : chips > 0.65 && rng() > 0.2 ? 11 : 135 + rng() * 70
        }
      c.putImageData(im, 0, 0)
    },
    true
  )
  const oldPaint = new T.MeshLambertMaterial({ map: washed, transparent: true, depthWrite: false })
  b.add(new T.PlaneGeometry(8.0, 1.72), oldPaint, 28.933, 0.99, 30.8, 0, -Math.PI / 2)
  b.add(new T.PlaneGeometry(6.6, 1.52), oldPaint, -6.7, 0.86, 27.071)
  b.add(new T.PlaneGeometry(4.4, 1.29), oldPaint, 11.7, 0.76, 27.071)
  for (const [key, s] of Object.entries(sites)) {
    const col = key === 'A' ? '#b55738' : '#b96e41'
    const map = panelTexture(512, 512, (c) => {
      c.strokeStyle = col
      c.lineWidth = 13
      c.strokeRect(19, 19, 474, 474)
      c.fillStyle = col
      c.font = 'bold 328px Arial'
      c.textAlign = 'center'
      c.fillText(key, 256, 370)
      c.globalCompositeOperation = 'destination-out'
      for (let i = 0; i < 26000; i++) c.fillRect(rng() * 512, rng() * 512, 2 + rng() * 3, 2)
    })
    const m = new T.MeshBasicMaterial({ map, transparent: true, depthWrite: false, opacity: 0.78 })
    b.add(new T.PlaneGeometry(7.6, 7.6), m, s.x, ground(s.x, s.z) + 0.026, s.z, -Math.PI / 2)
  }
  for (const g of gates) {
    const top = g.top,
      r = g.r,
      h = g.h
    // The opening and its stone voussoirs are cut from the same profile on both faces.
    const shape = new T.Shape()
    shape.moveTo(-g.span / 2, 0)
    shape.lineTo(-r, 0)
    shape.lineTo(-r, h)
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI - (i * Math.PI) / 24
      shape.lineTo(Math.cos(a) * r, h + Math.sin(a) * r * 0.84)
    }
    shape.lineTo(r, 0)
    shape.lineTo(g.span / 2, 0)
    shape.lineTo(g.span / 2, top)
    shape.lineTo(-g.span / 2, top)
    shape.closePath()
    const geo = new T.ExtrudeGeometry(shape, { depth: 1.5, bevelEnabled: false })
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 3, uv.getY(i) / 3)
    b.add(geo, g.style === 'tunnel' ? sandstone : stucco[1], g.x, 0, g.z - 0.75)
    for (const face of [-1, 1]) {
      const z = g.z + face * 0.785,
        thickness = 0.43
      for (let i = 0; i < 15; i++) {
        const a0 = (Math.PI * i) / 15 + 0.005,
          a1 = (Math.PI * (i + 1)) / 15 - 0.005
        const s = new T.Shape()
        s.moveTo(r * Math.cos(a0), h + r * 0.84 * Math.sin(a0))
        s.lineTo((r + thickness) * Math.cos(a0), h + (r * 0.84 + thickness) * Math.sin(a0))
        s.lineTo((r + thickness) * Math.cos(a1), h + (r * 0.84 + thickness) * Math.sin(a1))
        s.lineTo(r * Math.cos(a1), h + r * 0.84 * Math.sin(a1))
        s.closePath()
        b.add(
          new T.ExtrudeGeometry(s, {
            depth: 0.14,
            bevelEnabled: true,
            bevelSize: 0.012,
            bevelThickness: 0.012,
            bevelSegments: 1,
          }),
          archStone[(i + 2) % 5],
          g.x,
          0,
          z - 0.07
        )
      }
      for (const sign of [-1, 1])
        for (let j = 0; j < 6; j++)
          b.box(
            g.x + sign * (r + thickness / 2),
            (h * (j + 0.5)) / 6,
            z,
            thickness,
            h / 6 - 0.017,
            0.18,
            archStone[(j + 2) % 5],
            0,
            0,
            0,
            2
          )
    }
    if (g.wood) {
      for (const leaf of gateLeaves(g)) {
        const { x, z, yaw, length, side } = leaf,
          cs = Math.cos(yaw),
          sn = Math.sin(yaw)
        const pos = (lx: number, lz: number) => ({
          x: x + cs * lx + sn * lz,
          z: z - sn * lx + cs * lz,
        })
        const part = (
          lx: number,
          y: number,
          lz: number,
          w: number,
          h: number,
          d: number,
          m: T.Material
        ) => {
          const p = pos(lx, lz)
          b.box(p.x, y, p.z, w, h, d, m, yaw, 0, 0, 1.85)
        }
        for (let j = 0; j < 11; j++) {
          const t = (j + 0.5) / 11,
            height = g.h + 0.16 + Math.sin((1 - t) * 1.34) * 1.02
          part(
            0,
            height / 2,
            (t - 0.5) * length,
            0.185,
            height,
            length / 11 - 0.012,
            j % 3 ? doorwood : timbers[2]
          )
        }
        for (const level of [0.35, 1.23, 2.31, g.h + 0.09]) {
          part(-side * 0.109, level, 0, 0.047, 0.118, length - 0.035, iron)
          for (const u of [-0.42, -0.22, 0, 0.22, 0.42]) {
            const p = pos(-side * 0.139, u * length)
            b.ball(p.x, level, p.z, 0.039, 0.037, 0.039, blackIron)
          }
        }
        const handle = pos(-side * 0.161, -length * 0.32)
        b.add(
          new T.TorusGeometry(0.133, 0.023, 6, 14),
          iron,
          handle.x,
          1.4,
          handle.z,
          0,
          yaw + Math.PI / 2
        )
      }
      b.box(g.x, top + 0.02, g.z, g.span + 0.26, 0.23, 1.79, cream)
      b.box(g.x, top - 0.24, g.z + 0.016, g.span + 0.12, 0.105, 1.64, tile)
      for (let k = 0; k < g.span / 1.23; k++) {
        const x = g.x - g.span / 2 + 0.45 + k * 1.23
        b.box(x, top + 0.41, g.z, 0.53, 0.64, 1.01, stucco[1])
        b.box(x, top + 0.76, g.z, 0.43, 0.085, 0.88, ledge)
      }
    }
    if (g.style === 'long') {
      for (const side of [-1, 1]) {
        const cx = g.x + side * (r + (g.span / 2 - r) / 2),
          ww = g.span / 2 - r
        b.box(cx, 0.31, g.z + 0.782, ww, 0.62, 0.12, sandstone, 0, 0, 0, 2.4)
        b.box(cx, 0.67, g.z + 0.81, ww, 0.09, 0.157, ledge)
        b.box(cx, top - 0.94, g.z + 0.78, ww - 0.8, 0.08, 0.114, cream)
      }
      const band = panelTexture(
        128,
        32,
        (c) => {
          c.fillStyle = '#416d65'
          c.fillRect(0, 0, 128, 32)
          for (let i = 0; i < 8; i++) {
            c.fillStyle = i % 2 ? '#b9ba9c' : '#83a79c'
            c.beginPath()
            c.moveTo(i * 16, 16)
            c.lineTo(i * 16 + 8, 3)
            c.lineTo(i * 16 + 16, 16)
            c.lineTo(i * 16 + 8, 29)
            c.fill()
          }
        },
        true
      )
      band.repeat.x = 13
      b.add(
        new T.PlaneGeometry(g.span - 0.03, 0.15),
        new T.MeshLambertMaterial({ map: band }),
        g.x,
        top - 0.23,
        g.z + 0.846
      )
      const xwin = g.x + g.span / 2 - 1.81
      b.box(xwin, 3.15, g.z + 0.767, 1.19, 1.49, 0.09, sandstone)
      b.box(xwin, 3.15, g.z + 0.83, 0.99, 1.29, 0.07, teal)
      for (let i = 0; i < 10; i++)
        b.box(xwin, 2.61 + i * 0.12, g.z + 0.88, 0.92, 0.054, 0.054, blue)
      b.box(xwin, 2.45, g.z + 0.86, 1.32, 0.115, 0.24, cream)
      b.box(xwin, 3.93, g.z + 0.89, 1.43, 0.14, 0.29, cream)
      decal(g.x, top - 0.49, g.z + 0.77, 2.38, 0.45, 0, (c) => {
        c.fillStyle = '#4b726c'
        c.fillRect(0, 0, 512, 256)
        c.strokeStyle = '#cabda0'
        c.lineWidth = 7
        c.strokeRect(12, 16, 488, 224)
        c.fillStyle = '#e4d5b7'
        c.textAlign = 'center'
        c.font = 'bold 105px serif'
        c.fillText('الباب الكبير', 256, 167)
      })
      // Paired iron lanterns flank the long doors.
      for (const side of [-1, 1]) {
        const x = g.x + side * (r + 0.94),
          z = g.z + 0.94
        b.box(x, 3.55, z, 0.115, 0.46, 0.3, iron)
        b.box(x, 3.42, z + 0.13, 0.23, 0.34, 0.22, mat('#ceb784'))
        b.add(new T.ConeGeometry(0.22, 0.22, 4), iron, x, 3.7, z + 0.13, 0, Math.PI / 4)
        for (const dx of [-0.11, 0.11]) b.box(x + dx, 3.44, z + 0.24, 0.025, 0.37, 0.028, iron)
      }
    }
  }

  function tower(x: number, z: number, w: number, h: number) {
    b.box(x, h / 2, z, w, h, w, stucco[2], 0, 0, 0, 3)
    for (const y of [h * 0.68, h - 0.74, h + 0.02]) b.box(x, y, z, w + 0.18, 0.16, w + 0.18, cream)
    b.box(x, h - 0.48, z, w + 0.04, 0.32, w + 0.04, tile)
    for (let side = 0; side < 4; side++) {
      const a = (side * Math.PI) / 2,
        nx = Math.sin(a),
        nz = Math.cos(a)
      for (const o of [-0.23, 0.23]) {
        const xx = x + nx * (w / 2 + 0.016) + nz * w * o,
          zz = z + nz * (w / 2 + 0.016) - nx * w * o
        b.box(xx, h - 2.08, zz, 0.63, 1.26, 0.06, recess, a)
        const sh = new T.Shape()
        sh.absarc(0, 0, 0.315, 0, Math.PI, false)
        sh.closePath()
        b.add(new T.ShapeGeometry(sh), recess, xx, h - 1.45, zz, 0, a)
        for (const s of [-1, 1])
          b.box(xx + nz * s * 0.352, h - 2.02, zz - nx * s * 0.352, 0.066, 1.38, 0.11, cream, a)
      }
      for (let j = -1; j <= 1; j++)
        b.box(
          x + nx * (w / 2 - 0.18) + nz * w * j * 0.36,
          h + 0.37,
          z + nz * (w / 2 - 0.18) - nx * w * j * 0.36,
          0.45,
          0.73,
          0.42,
          stucco[2],
          a
        )
    }
    b.box(x, h + 0.47, z, w * 0.52, 0.89, w * 0.52, stucco[1])
    b.add(new T.ConeGeometry(w * 0.45, 0.92, 4), tile, x, h + 1.37, z, 0, Math.PI / 4)
    b.rod(V(x, h + 1.71, z), V(x, h + 2.22, z), 0.045, 0.018, metal)
  }
  for (const [x, z, w, h] of towers) tower(x, z, w, h)
  // Rooftops outside the playable alleys give each street a layered silhouette.
  for (const [x, z, w, h, d] of rooftops) {
    b.box(x, h / 2, z, w, h, d, stucco[2], 0, 0, 0, 3)
    b.box(x, h, z, w + 0.28, 0.24, d + 0.28, ledge)
    b.box(x, h + 0.28, z, w + 0.14, 0.42, d + 0.14, stucco[3])
    for (let j = 0; j < Math.floor(w / 1.4); j++)
      b.box(x - w / 2 + 0.8 + j * 1.4, h - 1.49, z + d / 2 + 0.018, 0.59, 0.95, 0.041, teal)
  }
  for (const r of roofs) {
    b.box((r[0] + r[1]) / 2, 4.67, (r[2] + r[3]) / 2, r[1] - r[0], 0.34, r[3] - r[2], stucco[3])
    const longX = r[1] - r[0] > r[3] - r[2]
    const span = longX ? r[1] - r[0] : r[3] - r[2]
    for (let i = 1; i < span; i += 2.6)
      b.box(
        longX ? r[0] + i : (r[0] + r[1]) / 2,
        4.42,
        longX ? (r[2] + r[3]) / 2 : r[2] + i,
        longX ? 0.2 : r[1] - r[0],
        0.22,
        longX ? r[3] - r[2] : 0.2,
        doorwood
      )
  }
  for (const c of crates) {
    const { x, z, w, d, h, level, metal: m } = c,
      y = ground(x, z) + level
    b.box(x, y + h / 2, z, w - 0.03, h, d - 0.03, m ? crateGreen : timbers[0], 0, 0, 0, 1.7)
    const beam = m ? metal : timbers[1],
      trim = 0.115
    for (const s of [-1, 1]) {
      for (let k = 0; k < Math.round(w / 0.26); k++) {
        const bw = w / Math.round(w / 0.26)
        b.box(
          x - w / 2 + (k + 0.5) * bw,
          y + h / 2,
          z + (s * d) / 2,
          bw - 0.014,
          h - 0.11,
          0.027,
          m ? crateGreen : timbers[(k * 3 + 1) % 4],
          0,
          0,
          0,
          1.35
        )
      }
      for (const f of [-1, 1]) {
        b.box(x + f * (w / 2 - trim / 2), y + h / 2, z + s * (d / 2 + 0.028), trim, h, 0.075, beam)
        b.box(x, y + (f < 0 ? 0.09 : h - 0.09), z + s * (d / 2 + 0.052), w, 0.166, 0.094, beam)
      }
      if (!m)
        b.box(
          x,
          y + h / 2,
          z + s * (d / 2 + 0.033),
          0.144,
          Math.hypot(w - 0.22, h - 0.24),
          0.068,
          timbers[1],
          0,
          0,
          s * Math.atan2(w - 0.22, h - 0.24)
        )
      for (const f of [-1, 1]) {
        b.box(x + s * (w / 2 + 0.017), y + (f < 0 ? 0.09 : h - 0.09), z, 0.063, 0.17, d, beam)
        b.box(x + s * (w / 2 + 0.018), y + h / 2, z + f * (d / 2 - 0.09), 0.075, h, 0.17, beam)
      }
      for (const f of [-1, 1])
        for (const v of [-1, 1])
          b.ball(
            x + f * (w / 2 - 0.075),
            y + h / 2 + v * (h / 2 - 0.089),
            z + s * (d / 2 + 0.1),
            0.023,
            0.023,
            0.014,
            iron
          )
      if (m) {
        for (const f of [-0.28, 0.28])
          b.box(x + f * w, y + h / 2, z + s * (d / 2 + 0.034), 0.085, h, 0.065, iron)
        for (const f of [-0.32, 0, 0.32])
          b.box(x + s * (w / 2 + 0.044), y + h / 2, z + d * f, 0.051, h - 0.28, 0.077, metal)
        b.box(x + s * (w / 2 + 0.055), y + 0.42, z, 0.04, 0.063, d - 0.18, metal)
        b.box(x + s * (w / 2 + 0.055), y + h - 0.43, z, 0.04, 0.063, d - 0.18, metal)
      }
    }
    if (w > 2) {
      decal(x + w * 0.22, y + h * 0.52, z + d / 2 + 0.081, 0.48, 0.3, 0, (ctx) => {
        ctx.fillStyle = '#d8cead'
        ctx.fillRect(0, 0, 512, 256)
        ctx.fillStyle = '#544e3f'
        ctx.font = 'bold 60px monospace'
        ctx.fillText('DL  047', 33, 87)
        for (let j = 0; j < 40; j++) ctx.fillRect(32 + j * 11, 119, 2 + rng() * 6, 82)
      })
    }
  }
  const bark = mat('#8a7656', woodMap),
    barkLight = mat('#aa9672', woodMap)
  const leaves = ['#49683c', '#677e47', '#54763d', '#849857', '#4a643e', '#72874d'].map((c) => {
    const m = mat(c)
    m.side = T.DoubleSide
    return m
  })
  function palm(x: number, z: number, h: number, lean: number) {
    const curve = (t: number) => V(x + lean * t * t, h * t, z + Math.sin(t * 1.7) * lean * 0.24)
    for (let i = 0; i < 18; i++) {
      const t = i / 18,
        r = (0.24 * (1 - 0.47 * t) * h) / 8
      b.rod(curve(t), curve((i + 1) / 18), r * 1.13, r * 0.86, i % 4 === 0 ? barkLight : bark, 9)
    }
    const crown = curve(1)
    for (let k = 0; k < 21; k++) {
      const a = k * 2.399 + rng() * 0.32,
        L = h * (0.29 + rng() * 0.19),
        rise = k % 3 === 0 ? 0.6 : 0.38,
        drop = 0.25 + rng() * 0.45
      const at = (t: number) =>
        V(
          crown.x + Math.cos(a) * L * t,
          crown.y + L * (Math.sin(Math.PI * t) * rise - t * t * drop),
          crown.z + Math.sin(a) * L * t
        )
      for (let i = 0; i < 4; i++)
        b.rod(
          at(i / 4),
          at((i + 1) / 4),
          0.037 * (1 - i / 5),
          0.021 * (1 - i / 5),
          leaves[k % 6],
          4
        )
      const pos: number[] = []
      for (let j = 1; j < 31; j++) {
        const t = j / 32,
          p = at(t),
          q = at(t + 0.036),
          width = L * 0.21 * Math.pow(Math.sin(Math.PI * t), 0.62)
        for (const s of [-1, 1]) {
          const tip = V(
            q.x + Math.cos(a) * width * 0.55 - Math.sin(a) * s * width,
            p.y - width * (0.27 + rng() * 0.4),
            q.z + Math.sin(a) * width * 0.55 + Math.cos(a) * s * width
          )
          const mid = p.clone().lerp(tip, 0.51)
          mid.y += L * 0.018
          const aft = q.clone().lerp(tip, 0.5)
          aft.y += L * 0.008
          pos.push(
            ...p.toArray(),
            ...q.toArray(),
            ...mid.toArray(),
            ...mid.toArray(),
            ...q.toArray(),
            ...aft.toArray(),
            ...mid.toArray(),
            ...aft.toArray(),
            ...tip.toArray()
          )
        }
      }
      const geo = new T.BufferGeometry()
      geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3))
      geo.computeVertexNormals()
      b.add(geo, leaves[k % 6])
    }
  }
  for (const [x, z, h, lean] of palms) palm(x, z, h, lean)
  function cable(a: T.Vector3, c: T.Vector3, sag: number, r = 0.027) {
    let prev = a
    for (let i = 1; i <= 14; i++) {
      const t = i / 14,
        p = a.clone().lerp(c, t)
      p.y -= 4 * t * (1 - t) * sag
      b.rod(prev, p, r, r, dark, 5)
      prev = p
    }
  }
  function pole(x: number, z: number, h: number) {
    b.rod(V(x, 0, z), V(x - 0.12, h, z), 0.122, 0.078, timbers[2], 9)
    for (const y of [h - 0.4, h - 0.93]) {
      b.box(x - 0.12, y, z, 1.85, 0.12, 0.13, timbers[0])
      for (const dx of [-0.72, 0, 0.73]) {
        b.rod(V(x + dx, y, z), V(x + dx, y + 0.28, z), 0.039, 0.038, iron, 6)
        b.ball(x + dx, y + 0.21, z, 0.068, 0.087, 0.067, pale)
      }
    }
  }
  pole(13.6, 25.15, 8.0)
  pole(30.1, 38.3, 9.1)
  pole(30.3, 8.5, 8.1)
  for (const n of [-0.69, 0.0, 0.71]) {
    cable(V(13.6 + n, 7.85, 25.15), V(30.1 + n, 8.95, 38.3), 0.96)
    cable(V(13.6 + n, 7.85, 25.15), V(-7 + n, 8.82, 24.9), 1.08)
    cable(V(13.6 + n, 7.85, 25.15), V(30.3 + n, 7.95, 8.5), 1.34, 0.024)
  }
  for (const [x, z, h] of [
    [5.3, 18, 8.3],
    [31, 27, 7.2],
    [-7, 3, 9.0],
    [30, -33, 8.2],
  ]) {
    b.rod(V(x, h, z), V(x, h + 2.25, z), 0.035, 0.028, metal, 6)
    for (const k of [0, 0.59, 1.12])
      b.rod(V(x - 0.65, h + 1 + k, z), V(x + 0.62, h + 1 + k, z), 0.021, 0.021, metal, 5)
  }
  // Faded enamel street plates and a striped cloth awning on the eastern frontage.
  decal(28.935, 2.87, 37, 1.42, 0.49, -Math.PI / 2, (c) => {
    c.fillStyle = '#395e64'
    c.fillRect(0, 0, 512, 256)
    c.strokeStyle = '#d9d5bd'
    c.lineWidth = 8
    c.strokeRect(12, 14, 488, 228)
    c.fillStyle = '#ece2bf'
    c.textAlign = 'center'
    c.font = 'bold 72px sans-serif'
    c.fillText('الشارع الكبير', 256, 110)
    c.font = 'bold 43px Arial'
    c.fillText('RUE PRINCIPALE', 256, 190)
  })
  const shadeWhite = mat('#dfd1b0', plaster),
    shadeBlue = mat('#478180', plaster)
  for (let i = 0; i < 10; i++) {
    const z = 30.2 + i * 0.42
    b.box(28.27, 3.77, z, 1.48, 0.055, 0.422, i % 2 ? shadeBlue : shadeWhite, 0, 0, 0.17)
    b.box(27.55, 3.53, z, 0.055, 0.24, 0.421, i % 2 ? shadeBlue : shadeWhite)
  }
  for (const z of [30.1, 34.1]) b.rod(V(28.94, 2.87, z), V(27.58, 3.6, z), 0.038, 0.029, iron, 6)
  for (let k = 0; k < 115; k++) {
    const left = k % 2 === 0,
      x = left ? 7 + rng() * 7 : 26 + rng() * 2.5,
      z = left ? 27.25 + rng() * 2.7 : 27 + rng() * 13,
      r = 0.022 + rng() ** 3 * 0.072
    const g = new T.DodecahedronGeometry(r, 0)
    g.scale(1.3, 0.38, 0.94)
    b.add(g, floorStones[k % 5], x, r * 0.27, z, rng(), rng() * 5, 0)
  }
  const sceneStatic = b.group()
  scene.add(sceneStatic)
  const aoMap = panelTexture(64, 64, (c) => {
    const g = c.createRadialGradient(32, 32, 2, 32, 32, 32)
    g.addColorStop(0, 'rgba(63,48,33,.48)')
    g.addColorStop(0.41, 'rgba(70,54,38,.30)')
    g.addColorStop(1, 'rgba(70,54,38,0)')
    c.fillStyle = g
    c.fillRect(0, 0, 64, 64)
  })
  const ao = new Batch(),
    aoMat = new T.MeshBasicMaterial({ map: aoMap, transparent: true, depthWrite: false })
  for (const c of crates)
    if (c.level === 0)
      ao.add(
        new T.PlaneGeometry(c.w * 1.9, c.d * 1.91),
        aoMat,
        c.x,
        ground(c.x, c.z) + 0.018,
        c.z,
        -Math.PI / 2
      )
  scene.add(ao.group(false))
  const horizon = new Batch()
  const hillMats = ['#b7b7a1', '#b8b09a', '#b5aaa0'].map((c) => {
    const m = paint(c)
    m.flatShading = true
    return m
  })
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2,
      dist = 110 + rng() * 25,
      w = 17 + rng() * 21,
      h = 8 + rng() * 15
    const g = new T.IcosahedronGeometry(1, 0)
    g.scale(w, h, w * 0.64)
    horizon.add(g, hillMats[i % 3], Math.cos(a) * dist, -3, Math.sin(a) * dist, 0, rng() * 3)
  }
  scene.add(horizon.group(false))
  scene.fog = new T.FogExp2('#d9cfb5', 0.0087)
  const sky = new T.Mesh(
    new T.SphereGeometry(208, 42, 24),
    new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      uniforms: {},
      vertexShader:
        'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `varying vec3 direction;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
    void main(){vec3 d=normalize(direction);float h=max(d.y,0.);vec3 col=mix(vec3(.87,.867,.797),vec3(.34,.61,.795),pow(h,.48));
    vec2 uv=d.xz/max(.12,d.y+.19)*2.55;float n=noise(uv)*.59+noise(uv*2.06)*.26+noise(uv*4.13)*.15;
    float clouds=smoothstep(.525,.77,n)*smoothstep(.015,.19,h)*.47;col=mix(col,vec3(.921,.909,.849),clouds);gl_FragColor=vec4(col,1.);}`,
    })
  )
  sky.renderOrder = -4
  scene.add(sky)
  return sceneStatic
}
