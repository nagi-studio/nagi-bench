import React from 'react';
import { CameraMode, SCENES, SceneMeta } from '../scene/DirectorCamera';

interface StoryHUDProps {
  progress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  cameraMode: CameraMode;
  isMuted: boolean;
  activeScene: SceneMeta;
  onProgressChange: (newProgress: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onCameraChange: (mode: CameraMode) => void;
  onToggleMute: () => void;
  onSceneSelect: (sceneId: number) => void;
}

export const StoryHUD: React.FC<StoryHUDProps> = ({
  progress,
  isPlaying,
  playbackSpeed,
  cameraMode,
  isMuted,
  activeScene,
  onProgressChange,
  onTogglePlay,
  onSpeedChange,
  onCameraChange,
  onToggleMute,
  onSceneSelect
}) => {
  const cameraOptions: { mode: CameraMode; labelZh: string; labelEn: string; icon: string }[] = [
    { mode: 'director', labelZh: '导演视角', labelEn: 'Director', icon: '🎬' },
    { mode: 'sniper_ads', labelZh: '狙击瞄准', labelEn: 'ADS Scope', icon: '🎯' },
    { mode: 'bullet_cam', labelZh: '子弹跟随', labelEn: 'Bullet Cam', icon: '☄️' },
    { mode: 'station_cam', labelZh: '空间站视角', labelEn: 'Station View', icon: '🛰️' },
    { mode: 'orbit_overview', labelZh: '轨道全景', labelEn: 'Orbit View', icon: '🌍' }
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 24px',
      color: '#f8fafc',
      fontFamily: `'Chakra Petch', 'Noto Sans SC', sans-serif`,
      zIndex: 10
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pointerEvents: 'auto',
        width: '100%'
      }}>
        {/* Title and Chapter Meta */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          borderLeft: '4px solid #00f0ff',
          padding: '12px 18px',
          borderRadius: '0 8px 8px 0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              letterSpacing: '1px'
            }}>
              《三体 II：黑暗森林》 第 14 章
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>
              CHAPTER 14 · LIU CIXIN
            </span>
          </div>
          <h1 style={{
            margin: '4px 0 2px 0',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#ffffff'
          }}>
            章北海 · 陨石子弹
            <span style={{ fontSize: '14px', color: '#38bdf8', marginLeft: '10px', fontWeight: 400 }}>
              ZHANG BEIHAI: THE METEORITE BULLET
            </span>
          </h1>
          <div style={{ color: '#00f0ff', fontSize: '12px', display: 'flex', gap: '16px' }}>
            <span>执行者: 章北海 (太空军特战政委)</span>
            <span>武器: 隐形舱外气枪 + 石铁陨石弹丸</span>
            <span>目标: 同步轨道终点站 闭门战略会议</span>
          </div>
        </div>

        {/* Top Right: Camera Switcher & Audio Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}>
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={onToggleMute}
            style={{
              background: isMuted ? 'rgba(30, 41, 59, 0.8)' : 'rgba(14, 116, 144, 0.85)',
              border: `1px solid ${isMuted ? '#475569' : '#00f0ff'}`,
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span>{isMuted ? '环境音效: 静音 (MUTED)' : '程序合成音效: 开启 (AUDIO ON)'}</span>
          </button>

          {/* Camera View Switcher Buttons */}
          <div style={{
            display: 'flex',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '6px',
            borderRadius: '8px',
            border: '1px solid #334155',
            backdropFilter: 'blur(8px)'
          }}>
            {cameraOptions.map((opt) => {
              const active = cameraMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  onClick={() => onCameraChange(opt.mode)}
                  style={{
                    background: active ? '#0284c7' : 'transparent',
                    border: active ? '1px solid #38bdf8' : '1px solid transparent',
                    color: active ? '#ffffff' : '#94a3b8',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  title={opt.labelEn}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.labelZh}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Subtitle & Narrative Quote Panel */}
      <div style={{
        alignSelf: 'center',
        maxWidth: '820px',
        width: '90%',
        background: 'rgba(3, 7, 18, 0.82)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '10px',
        padding: '16px 24px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.75)',
        textAlign: 'center',
        pointerEvents: 'auto',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(2, 132, 199, 0.25)',
          border: '1px solid #00f0ff',
          padding: '2px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          color: '#38bdf8',
          marginBottom: '8px',
          fontWeight: 600
        }}>
          <span>SCENE {activeScene.id} / 5</span>
          <span>·</span>
          <span>{activeScene.name}</span>
        </div>
        <p style={{
          fontSize: '17px',
          lineHeight: '1.6',
          color: '#f1f5f9',
          margin: '0 0 6px 0',
          letterSpacing: '0.5px'
        }}>
          "{activeScene.quoteZh}"
        </p>
        <p style={{
          fontSize: '12px',
          lineHeight: '1.4',
          color: '#94a3b8',
          margin: 0,
          fontStyle: 'italic'
        }}>
          "{activeScene.quoteEn}"
        </p>
      </div>

      {/* Bottom Timeline Scrubber & Controller */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '14px 20px',
        backdropFilter: 'blur(12px)',
        pointerEvents: 'auto',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Scene Milestones Nav */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          gap: '8px'
        }}>
          {SCENES.map((sc) => {
            const isActive = activeScene.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSceneSelect(sc.id)}
                style={{
                  flex: 1,
                  background: isActive ? 'rgba(2, 132, 199, 0.35)' : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${isActive ? '#00f0ff' : '#475569'}`,
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontWeight: 600 }}>0{sc.id}. {sc.name.split('·')[0]}</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{sc.enName.split('/')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            style={{
              background: '#0284c7',
              border: 'none',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(2, 132, 199, 0.5)',
              transition: 'transform 0.1s ease'
            }}
            title={isPlaying ? '暂停 (Pause)' : '播放 (Play)'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Scrubber Range */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
              <span>TIMELINE T-00:00</span>
              <span style={{ color: '#00f0ff', fontWeight: 600 }}>
                {(progress * 100).toFixed(1)}% | T+{(progress * 45).toFixed(1)}s
              </span>
              <span>EXTRACT T+00:45</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              onChange={(e) => onProgressChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: '#00f0ff',
                height: '6px'
              }}
            />
          </div>

          {/* Speed Multiplier */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                style={{
                  background: playbackSpeed === s ? '#0284c7' : 'rgba(30, 41, 59, 0.6)',
                  border: `1px solid ${playbackSpeed === s ? '#38bdf8' : '#475569'}`,
                  color: playbackSpeed === s ? '#ffffff' : '#94a3b8',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
