/* ============================================================================
   Entry point. Mounts the cinematic into #root: a full-bleed WebGL canvas, a
   bottom-centred subtitle layer driven by the voice-cue manifest, and a minimal
   transport (play/pause, scrub, time). Subtitles follow the fixed
   【Speaker】Text style required by the case; ambient/sound-design cues are
   shown as bracketed scene directions with no speaker tag.
   ========================================================================== */
import { Film } from './film.js'
import { FILM_LENGTH } from './cues.js'

const root = document.getElementById('root')

// ---- layout ----
root.style.cssText = 'position:fixed;inset:0;background:#000;overflow:hidden'

const stage = document.createElement('div')
stage.style.cssText = 'position:absolute;inset:0'
root.appendChild(stage)

// subtitle layer: fixed bottom-centre
const subtitle = document.createElement('div')
subtitle.style.cssText = [
  'position:absolute', 'left:50%', 'bottom:9%', 'transform:translateX(-50%)',
  'max-width:82%', 'text-align:center', 'pointer-events:none',
  'font-size:clamp(16px,2.4vw,30px)', 'line-height:1.5', 'font-weight:500',
  'color:#fff', 'text-shadow:0 2px 8px rgba(0,0,0,.95),0 0 2px rgba(0,0,0,.9)',
  'letter-spacing:.02em', 'padding:0 12px', 'z-index:5',
  'transition:opacity .18s',
].join(';')
root.appendChild(subtitle)

// letterbox bars for a cinematic frame
const bar = (top) => {
  const b = document.createElement('div')
  b.style.cssText = `position:absolute;left:0;right:0;height:6.5vh;background:#000;z-index:4;pointer-events:none;${top ? 'top:0' : 'bottom:0'}`
  root.appendChild(b)
}
bar(true)
bar(false)

// ---- transport ----
const transport = document.createElement('div')
transport.style.cssText = [
  'position:absolute', 'left:50%', 'bottom:2.2vh', 'transform:translateX(-50%)',
  'display:flex', 'align-items:center', 'gap:12px', 'z-index:6',
  'padding:8px 14px', 'border-radius:12px',
  'background:rgba(10,12,16,.55)', 'border:1px solid rgba(255,255,255,.12)',
  'backdrop-filter:blur(10px)', '-webkit-backdrop-filter:blur(10px)',
  'opacity:.35', 'transition:opacity .25s',
].join(';')
root.appendChild(transport)
root.addEventListener('pointermove', () => {
  transport.style.opacity = '1'
  clearTimeout(transport._t)
  transport._t = setTimeout(() => (transport.style.opacity = '.35'), 2200)
})

const playBtn = document.createElement('button')
playBtn.style.cssText = 'width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:14px;cursor:pointer;font-family:inherit'
transport.appendChild(playBtn)

const scrub = document.createElement('input')
scrub.type = 'range'
scrub.min = '0'
scrub.max = String(FILM_LENGTH)
scrub.step = '0.1'
scrub.value = '0'
scrub.style.cssText = 'width:min(46vw,520px);cursor:pointer;accent-color:#e6c069'
transport.appendChild(scrub)

const timeLabel = document.createElement('span')
timeLabel.style.cssText = 'font-size:12px;color:#c8ced6;font-variant-numeric:tabular-nums;min-width:82px;text-align:right'
transport.appendChild(timeLabel)

const hint = document.createElement('div')
hint.style.cssText = 'position:absolute;left:50%;top:12vh;transform:translateX(-50%);z-index:6;color:#9aa3ad;font-size:12px;letter-spacing:.14em;pointer-events:none;text-shadow:0 1px 4px rgba(0,0,0,.9)'
hint.textContent = '章北海 · 陨石子弹 — 点击播放'
root.appendChild(hint)

// ---- film ----
let film
try {
  film = new Film(stage, subtitle)
} catch (e) {
  subtitle.textContent = '无法初始化 WebGL，请在支持硬件加速的浏览器中打开。'
  throw e
}

function fmt(t) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')} / ${Math.floor(FILM_LENGTH / 60)}:${Math.floor(FILM_LENGTH % 60).toString().padStart(2, '0')}`
}

function setPlayIcon() {
  playBtn.textContent = film.playing ? '❚❚' : '▶'
}

function startPlayback() {
  film.play()
  setPlayIcon()
  hint.style.opacity = '0'
  setTimeout(() => hint.remove(), 400)
}

playBtn.addEventListener('click', () => {
  if (!film.playing && film.time >= FILM_LENGTH) film.seek(0)
  film.toggle()
  if (film.playing) hint.style.opacity = '0'
  setPlayIcon()
})
scrub.addEventListener('input', () => {
  film.seek(parseFloat(scrub.value))
})
// click anywhere on the stage to start / toggle (helps unlock audio)
stage.addEventListener('click', () => {
  if (!film.playing) startPlayback()
})
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); if (!film.playing) startPlayback(); else { film.toggle(); setPlayIcon() } }
  if (e.code === 'ArrowRight') film.seek(film.time + 5)
  if (e.code === 'ArrowLeft') film.seek(film.time - 5)
})

setPlayIcon()

// main loop
function loop() {
  requestAnimationFrame(loop)
  film.update()
  scrub.value = String(film.time)
  timeLabel.textContent = fmt(film.time)
}
loop()
