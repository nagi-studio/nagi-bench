import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Director, fmtTime } from './film/director';
import { cueAt, shotAt, TOTAL } from './film/cues';
import { FilmSound } from './film/sound';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef<Director | null>(null);
  const sndRef = useRef<FilmSound | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeRef = useRef(0);
  const playRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth || 960, canvas.clientHeight || 540);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a18);
    scene.fog = new THREE.Fog(0x060a18, 60, 220);
    const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 500);
    const snd = new FilmSound();
    sndRef.current = snd;
    const dir = new Director(scene, camera, snd);
    dirRef.current = dir;
    dir.setTime(0);
    dir.update(0, 0);
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (playRef.current) {
        timeRef.current = Math.min(TOTAL, timeRef.current + dt);
        if (timeRef.current >= TOTAL) playRef.current = false;
        setTime(timeRef.current);
      }
      dir.update(playRef.current ? dt : 0, timeRef.current);
      const w = canvas.clientWidth || 960;
      const h = canvas.clientHeight || 540;
      if (canvas.width !== Math.floor(w) || canvas.height !== Math.floor(h)) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      setPlaying(playRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
    };
  }, []);

  const toggle = () => {
    sndRef.current?.ensure();
    if (!playRef.current && timeRef.current >= TOTAL) {
      timeRef.current = 0;
      dirRef.current?.setTime(0);
    }
    playRef.current = !playRef.current;
    setPlaying(playRef.current);
  };

  const seek = (t: number) => {
    timeRef.current = Math.max(0, Math.min(TOTAL, t));
    dirRef.current?.setTime(timeRef.current);
    setTime(timeRef.current);
  };

  const cue = cueAt(time);
  const shot = shotAt(time);
  const showTitle = time < 14;
  const showEnd = time >= 294;

  return (
    <div className="film">
      <div className="screen">
        <canvas ref={canvasRef} className="view" />
        <div className="bar top" />
        <div className="shot-tag">{shot.title}</div>
        {showTitle && (
          <div className="cards">
            <h1>北海陨石</h1>
            <p>体素电影 · 片长 5 分 00 秒</p>
          </div>
        )}
        {showEnd && (
          <div className="cards end">
            <h1>剧终</h1>
            <p>掉进海里的星星，会替人指路</p>
          </div>
        )}
        {cue && !showTitle && !showEnd && (
          <div className="subtitle">【{cue.speaker}】{cue.text}</div>
        )}
      </div>
      <div className="controls">
        <button onClick={toggle}>{playing ? '暂停' : '播放'}</button>
        <input
          type="range" min={0} max={TOTAL} step={0.5} value={time}
          onChange={(e) => seek(Number(e.target.value))}
        />
        <span>{fmtTime(time)} / {fmtTime(TOTAL)}</span>
      </div>
      <p className="note">建议佩戴耳机观看 · 字幕由配音清单驱动</p>
    </div>
  );
}
