import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CinematicViewer } from './components/CinematicViewer';
import { StoryHUD } from './components/StoryHUD';
import { CameraMode, SCENES, SceneMeta } from './scene/DirectorCamera';
import { soundEngine } from './audio/SoundEffects';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [cameraMode, setCameraMode] = useState<CameraMode>('director');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Compute active scene from progress
  const getScene = (p: number): SceneMeta => {
    for (const sc of SCENES) {
      if (p >= sc.timeRange[0] && p <= sc.timeRange[1]) {
        return sc;
      }
    }
    return SCENES[SCENES.length - 1];
  };

  const activeScene = getScene(progress);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(playbackSpeed);
  isPlayingRef.current = isPlaying;
  speedRef.current = playbackSpeed;

  // Cinematic timeline loop: entire film is ~45 seconds at 1x speed
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingRef.current) {
        setProgress((prev) => {
          // Duration ~45 seconds
          const deltaProgress = (dt / 45.0) * speedRef.current;
          let next = prev + deltaProgress;
          if (next >= 1.0) {
            next = 0.0; // Loop presentation
          }
          return next;
        });
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleTogglePlay = useCallback(() => {
    soundEngine.init();
    setIsPlaying((prev) => !prev);
  }, []);

  const handleToggleMute = useCallback(() => {
    soundEngine.init();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleSceneSelect = useCallback((sceneId: number) => {
    soundEngine.init();
    const target = SCENES.find((s) => s.id === sceneId);
    if (target) {
      setProgress(target.timeRange[0] + 0.005);
    }
  }, []);

  const handleCameraChange = useCallback((mode: CameraMode) => {
    soundEngine.init();
    setCameraMode(mode);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        const modes: CameraMode[] = ['director', 'sniper_ads', 'bullet_cam', 'station_cam', 'orbit_overview'];
        setCameraMode((prev) => {
          const idx = modes.indexOf(prev);
          return modes[(idx + 1) % modes.length];
        });
      } else if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        handleSceneSelect(parseInt(e.key, 10));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setProgress((p) => Math.min(1.0, p + 0.05));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setProgress((p) => Math.max(0.0, p - 0.05));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleToggleMute, handleSceneSelect]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#020617'
    }}>
      <CinematicViewer
        progress={progress}
        cameraMode={cameraMode}
        onCameraChange={setCameraMode}
      />
      <StoryHUD
        progress={progress}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        cameraMode={cameraMode}
        isMuted={isMuted}
        activeScene={activeScene}
        onProgressChange={setProgress}
        onTogglePlay={handleTogglePlay}
        onSpeedChange={setPlaybackSpeed}
        onCameraChange={handleCameraChange}
        onToggleMute={handleToggleMute}
        onSceneSelect={handleSceneSelect}
      />
    </div>
  );
};
