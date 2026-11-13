// 主程序：影片播放控制与时间轴驱动
import * as THREE from 'three'
import { SHOTS, shotAt, cameraAt } from './shots'
import { TOTAL_DURATION, activeCue, CUES } from './cues'
import { ScenePool } from './stage'
import * as A from './audio'

const app = document.getElementById('app')!

const root = document.createElement('div')
root.style.cssText = 'position:fixed;inset:0;overflow:hidden;background:#000'
app.appendChild(root)

const canvas = document.createElement('canvas')
canvas.style.cssText = 'display:block;width:100%;height:100%'
root.appendChild(canvas)

/* ---------------- 字幕层 ---------------- */
const sub = document.createElement('div')
sub.style.cssText = [
  'position:fixed',
  'left:0',
  'right:0',
  'bottom:8vh',
  'text-align:center',
  'pointer-events:none',
  'z-index:20',
  'padding:0 8vw'
].join(';')
root.appendChild(sub)

const subText = document.createElement('div')
subText.style.cssText = [
  'display:inline-block',
  'font-family:"PingFang SC","Microsoft YaHei","Hiragino Sans GB",sans-serif',
  'font-size:clamp(17px,2.3vw,29px)',
  'line-height:1.6',
  'color:#fff',
  'text-shadow:0 2px 10px rgba(0,0,0,.95),0 0 26px rgba(0,0,0,.75)',
  'letter-spacing:.04em',
  'opacity:0',
  'transition:opacity .32s ease'
].join(';')
sub.appendChild(subText)

/* ---------------- 进度条 / 控制 ---------------- */
const bar = document.createElement('div')
bar.style.cssText = [
  'position:fixed',
  'left:0',
  'right:0',
  'bottom:0',
  'height:3px',
  'background:rgba(255,255,255,.12)',
  'z-index:30',
  'cursor:pointer'
].join(';')
root.appendChild(bar)

const fill = document.createElement('div')
fill.style.cssText = 'height:100%;width:0%;background:#e8c88a;box-shadow:0 0 10px rgba(232,200,138,.7)'
bar.appendChild(fill)

const hud = document.createElement('div')
hud.style.cssText = [
  'position:fixed',
  'left:22px',
  'top:18px',
  'z-index:30',
  'font-family:ui-monospace,Consolas,monospace',
  'font-size:11.5px',
  'line-height:1.8',
  'color:rgba(255,255,255,.55)',
  'letter-spacing:.08em',
  'text-shadow:0 1px 4px rgba(0,0,0,.9)',
  'pointer-events:none'
].join(';')
root.appendChild(hud)

/* ---------------- 起始卡 ---------------- */
const start = document.createElement('div')
start.style.cssText = [
  'position:fixed',
  'inset:0',
  'z-index:40',
  'display:flex',
  'flex-direction:column',
  'align-items:center',
  'justify-content:center',
  'gap:22px',
  'background:radial-gradient(ellipse at 50% 45%,#14161c 0%,#000 72%)',
  'font-family:"PingFang SC","Microsoft YaHei",sans-serif',
  'color:#e8e4dc',
  'transition:opacity .8s'
].join(';')
start.innerHTML = `
  <div style="font-size:11px;letter-spacing:.5em;color:rgba(232,228,220,.42);text-transform:uppercase">
    A Procedural Voxel Film
  </div>
  <div style="font-size:clamp(30px,5.2vw,60px);font-weight:300;letter-spacing:.28em;
              background:linear-gradient(180deg,#fff,#e0a850);-webkit-background-clip:text;
              background-clip:text;color:transparent">
    章北海 · 陨石子弹
  </div>
  <div style="font-size:13px;color:rgba(232,228,220,.56);letter-spacing:.14em;max-width:640px;text-align:center;line-height:2">
    总时长 ${TOTAL_DURATION} 秒 &nbsp;·&nbsp; 四幕 &nbsp;·&nbsp; ${SHOTS.length} 个镜头<br />
    体素美术全部由代码程序化生成 &nbsp;·&nbsp; 音效由 Web Audio 实时合成
  </div>
  <button id="playBtn" style="padding:14px 56px;border:1px solid #e0a850;background:transparent;
          color:#e0a850;font-size:14px;letter-spacing:.32em;cursor:pointer;font-family:inherit">
    开 始 播 放
  </button>
  <div style="font-size:11px;color:rgba(232,228,220,.3);letter-spacing:.08em">
    空格 暂停 / 继续 &nbsp;·&nbsp; ← → 快退快进 5 秒 &nbsp;·&nbsp; 点击进度条跳转
  </div>
`
root.appendChild(start)

/* ---------------- Three.js ---------------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x02030a)

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  900
)

const pool = new ScenePool()
scene.add(pool.root)

// 宇宙背景盒（防止纯黑空洞）
const skyGeo = new THREE.SphereGeometry(600, 24, 16)
const sky = new THREE.Mesh(
  skyGeo,
  new THREE.MeshBasicMaterial({ color: 0x05070f, side: THREE.BackSide, fog: false })
)
scene.add(sky)

/* ---------------- 播放状态 ---------------- */
let time = 0
let playing = false
let started = false
const clock = new THREE.Clock()

/** 已触发的音效，避免同镜重复播放 */
const fired = new Set<string>()

function fireSfx(shotId: string, at: number, local: number, name: string, arg?: string | number): void {
  const key = `${shotId}:${at}`
  if (fired.has(key)) return
  if (local < at) return
  fired.add(key)
  const shot = SHOTS.find((s) => s.id === shotId)
  const space = shot ? shot.space : 'vacuum'
  switch (name) {
    case 'gunshot':
      A.gunshot(space)
      break
    case 'gunAction':
      A.gunAction(space)
      break
    case 'suitBreath':
      A.suitBreath()
      break
    case 'radioBeep':
      A.radioBeep()
      break
    case 'engineStart':
      A.engineStart()
      break
    case 'thruster':
      A.thruster()
      break
    case 'depressurize':
      A.depressurize()
      break
    case 'alarm':
      A.alarm()
      break
    case 'impact':
      A.impact()
      break
    case 'hatchClose':
      A.hatchClose()
      break
    case 'commOpen':
      A.commOpen()
      break
    case 'rumble': {
      // arg 可为时长（秒），缺省用 4 秒
      const dur = typeof arg === 'number' ? arg : 4
      A.rumble(dur, 0.14)
      break
    }
    default:
      break
  }
}

/** 淡入淡出遮罩 */
const fade = document.createElement('div')
fade.style.cssText =
  'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:25;transition:opacity .45s'
root.appendChild(fade)

function render(): void {
  requestAnimationFrame(render)
  const dt = Math.min(clock.getDelta(), 0.05)

  if (playing) {
    time += dt
    if (time >= TOTAL_DURATION) {
      time = TOTAL_DURATION
      playing = false
      start.style.display = 'none'
    }
  }

  const shot = shotAt(time)
  const key = cameraAt(shot, time)

  // 相机
  camera.position.set(key.p[0], key.p[1], key.p[2])
  camera.lookAt(key.l[0], key.l[1], key.l[2])
  const fov = key.fov ?? 42
  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }

  // 场景切换
  pool.show(shot.scene)
  pool.tick(shot.scene, time, dt)

  // 音效
  const local = time - shot.start
  if (shot.sfx) {
    for (const s of shot.sfx) fireSfx(shot.id, s.at, local, s.name, s.arg)
  }

  // 字幕
  const cue = activeCue(time)
  if (cue) {
    subText.textContent = `【${cue.speaker}】${cue.text}`
    subText.style.opacity = '1'
  } else {
    subText.style.opacity = '0'
  }

  // 转场遮罩：镜头开头淡入
  const intoShot = local / 0.5
  const leaving = (shot.end - time) / 0.5
  const dim = Math.max(0, 1 - Math.min(1, Math.min(intoShot, leaving)))
  fade.style.opacity = String(dim * 0.9)

  // 进度条与信息
  fill.style.width = `${(time / TOTAL_DURATION) * 100}%`
  const shotIdx = SHOTS.indexOf(shot) + 1
  const cueId = cue ? cue.id : '--'
  hud.innerHTML = [
    `章北海 · 陨石子弹`,
    `${format(time)} / ${format(TOTAL_DURATION)}`,
    `镜头 ${shotIdx} / ${SHOTS.length} &nbsp; ${shot.id}`,
    `CUE ${cueId} &nbsp; ${playing ? 'PLAYING' : 'PAUSED'}`
  ].join('<br />')

  renderer.render(scene, camera)
}

function format(t: number): string {
  const s = Math.max(0, Math.floor(t))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/* ---------------- 交互 ---------------- */
const playBtn = start.querySelector('#playBtn') as HTMLButtonElement
playBtn.addEventListener('click', () => {
  A.initAudio()
  A.resumeAudio()
  start.style.opacity = '0'
  window.setTimeout(() => {
    start.style.display = 'none'
  }, 820)
  playing = true
  started = true
  clock.getDelta()
})

document.addEventListener('keydown', (e) => {
  if (!started) return
  if (e.code === 'Space') {
    e.preventDefault()
    playing = !playing
    clock.getDelta()
  }
  if (e.code === 'ArrowRight') time = Math.min(TOTAL_DURATION, time + 5)
  if (e.code === 'ArrowLeft') time = Math.max(0, time - 5)
  if (e.code === 'KeyR') {
    time = 0
    fired.clear()
  }
})

bar.addEventListener('click', (e) => {
  const r = bar.getBoundingClientRect()
  const u = (e.clientX - r.left) / r.width
  time = Math.max(0, Math.min(TOTAL_DURATION, u * TOTAL_DURATION))
  fired.clear()
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// 暴露给自动化检查
;(window as unknown as { __film: unknown }).__film = {
  shots: SHOTS,
  cues: CUES,
  duration: TOTAL_DURATION,
  seek: (t: number) => {
    time = t
  },
  play: () => {
    playing = true
  },
  state: () => ({ time, playing })
}

render()
