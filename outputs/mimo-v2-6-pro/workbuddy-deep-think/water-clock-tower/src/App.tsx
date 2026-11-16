import { useEffect, useRef, useState } from 'react';
import { createScene, captionIndexAt, FILM_LENGTH } from './scene';
import { SoundScape } from './audio';

const CAPTIONS = [
  '【旁白】北宋元祐年间，苏颂主持建造了一座完全由水力驱动的天文钟楼——水运仪象台。',
  '【旁白】顶层的漏壶让水以恒定的流量，一滴一滴落入下方的受水壶。',
  '【旁白】壶中的水越积越重；当重力力矩超过平衡重，水壶便猛然倾倒，把水泄空。',
  '【旁白】这一次倾倒牵动天衡与擒纵，只把枢轮推过一个齿——稳定的节拍由此而生。',
  '【旁白】枢轮通过齿轮系把动力传给浑象与浑仪，天球匀速旋转，星辰昼夜推移。',
  '【旁白】与传动同轴的凸轮每转过一周便抬起木人手臂，挥槌击钟，向全城报时。',
  '【旁白】从一滴水的重量，到一次庄严的报时——这就是九百年前的机械之心。',
  '【旁白】水运仪象台 · 北宋 元祐七年 · 苏颂 主持建造'
];

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const soundRef = useRef<SoundScape | null>(null);
  const [caption, setCaption] = useState(0);
  const [started, setStarted] = useState(() => new URLSearchParams(window.location.search).has('autoplay'));
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!started || !mountRef.current) return;
    const sound = new SoundScape();
    soundRef.current = sound;
    void sound.start();
    const handle = createScene(mountRef.current, sound, (i) => setCaption(i));
    const t0 = performance.now();
    const timer = window.setInterval(() => {
      const t = (performance.now() - t0) / 1000;
      setElapsed(t);
      setCaption(captionIndexAt(t));
      if (t > FILM_LENGTH + 2) window.clearInterval(timer);
    }, 250);
    return () => {
      window.clearInterval(timer);
      handle.dispose();
    };
  }, [started]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#10141f', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {/* title card */}
      {!started && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'radial-gradient(ellipse at 50% 32%, #243352 0%, #10141f 72%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 18, color: '#e8eefc', fontFamily: 'Georgia, "Songti SC", serif'
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 8, color: '#93a8d4' }}>北 宋 · 元 祐 · 机 械 天 文 钟</div>
          <div style={{ fontSize: 52, letterSpacing: 14, textShadow: '0 6px 32px rgba(120,170,255,0.35)' }}>水运仪象台</div>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#a8b8dc' }}>30 秒 · 实时物理驱动 · 程序化声效</div>
          <button
            onClick={() => setStarted(true)}
            style={{
              marginTop: 22, padding: '13px 46px', fontSize: 15, letterSpacing: 6,
              borderRadius: 999, border: '1px solid rgba(255,215,138,0.55)', cursor: 'pointer',
              background: 'rgba(255,215,138,0.12)', color: '#ffe1a0'
            }}
          >
            播 放
          </button>
          <div style={{ marginTop: 10, fontSize: 11, color: '#6d7fa8', letterSpacing: 2 }}>
            所有机械运动均由内置物理引擎实时计算 · 音效由 Web Audio 合成
          </div>
        </div>
      )}

      {/* subtitle bar */}
      {started && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 8% 34px', zIndex: 6 }}>
          <div
            style={{
              textAlign: 'center', color: '#f2f5ff', fontSize: 19, lineHeight: 1.75,
              textShadow: '0 2px 12px rgba(0,0,0,0.85)', fontFamily: '"Songti SC", Georgia, serif',
              background: 'linear-gradient(transparent, rgba(8,10,18,0.55))', padding: '10px 0'
            }}
          >
            {CAPTIONS[Math.min(caption, CAPTIONS.length - 1)]}
          </div>
        </div>
      )}

      {/* progress */}
      {started && (
        <div style={{ position: 'absolute', left: 0, bottom: 0, height: 3, zIndex: 7, background: '#d8b268', width: `${Math.min(100, (elapsed / FILM_LENGTH) * 100)}%` }} />
      )}

      {/* corner watermark-free label */}
      {started && (
        <div style={{ position: 'absolute', top: 18, left: 22, zIndex: 6, color: '#c9d6f2', fontSize: 12, letterSpacing: 5, opacity: 0.85 }}>
          水 运 仪 象 台
        </div>
      )}
    </div>
  );
}
