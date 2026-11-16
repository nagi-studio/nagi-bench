import { useEffect, useRef, useState } from 'react';
import { createFilm } from './film';
import { FilmAudio } from './audio';
import { VOICE_CUES, FILM_LENGTH, activeCue } from './voiceCues';

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(() => new URLSearchParams(window.location.search).has('autoplay'));
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!started || !mountRef.current) return;
    const audio = new FilmAudio();
    void audio.start();
    const handle = createFilm(mountRef.current, audio, (time) => setT(time));
    return () => handle.dispose();
  }, [started]);

  const cue = activeCue(t);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#05070c', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {!started && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'radial-gradient(ellipse at 50% 30%, #141c30 0%, #05070c 72%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 16, color: '#e6ecfa', fontFamily: 'Georgia, "Songti SC", serif'
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 8, color: '#8fa2c8' }}>《三体》片段改编 · 体素 3D 影片</div>
          <div style={{ fontSize: 46, letterSpacing: 12 }}>章北海 · 陨石子弹</div>
          <div style={{ fontSize: 13, letterSpacing: 4, color: '#96a8cf' }}>总时长 5 分 10 秒 · 程序化建模 · 程序化声效</div>
          <button
            onClick={() => setStarted(true)}
            style={{
              marginTop: 20, padding: '12px 44px', fontSize: 15, letterSpacing: 6,
              borderRadius: 999, border: '1px solid rgba(150,180,255,0.4)', cursor: 'pointer',
              background: 'rgba(120,150,220,0.14)', color: '#cfe0ff'
            }}
          >
            放 映
          </button>
          <div style={{ marginTop: 8, fontSize: 11, color: '#64739a', letterSpacing: 2 }}>
            所有配音以底部字幕呈现，语音 cue 清单可按 id 后期接入
          </div>
        </div>
      )}

      {started && (
        <>
          {/* subtitle: bottom-centre 【speaker】text, driven by the cue list */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '22px 8% 30px', zIndex: 6 }}>
            {cue && (
              <div
                style={{
                  textAlign: 'center', color: '#f4f7ff', fontSize: 18.5, lineHeight: 1.8,
                  textShadow: '0 2px 12px rgba(0,0,0,0.9)', fontFamily: '"Songti SC", Georgia, serif',
                  background: 'linear-gradient(transparent, rgba(6,8,14,0.6))', padding: '8px 0'
                }}
              >
                {`【${cue.speaker}】${cue.text}`}
              </div>
            )}
          </div>
          <div style={{ position: 'absolute', left: 0, bottom: 0, height: 3, zIndex: 7, background: '#8fb0e8', width: `${Math.min(100, (t / FILM_LENGTH) * 100)}%` }} />
          <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 6, color: '#b8c8e8', fontSize: 11, letterSpacing: 5, opacity: 0.8 }}>
            章 北 海 · 陨 石 子 弹
          </div>
          <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 6, color: '#8fa0c4', fontSize: 11, letterSpacing: 2, opacity: 0.8 }}>
            {`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')} / 05:10`}
          </div>
          {/* cue id indicator (post-production hook) */}
          {cue && (
            <div style={{ position: 'absolute', bottom: 8, right: 20, zIndex: 7, color: '#5d6c8e', fontSize: 10, letterSpacing: 2 }}>
              cue {cue.id} · {cue.kind}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// re-export for tooling that scans the cue schema
export { VOICE_CUES };
