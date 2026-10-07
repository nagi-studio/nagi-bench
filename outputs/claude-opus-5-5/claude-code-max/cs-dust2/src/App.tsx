import { useCallback, useMemo, useState } from 'react';
import { AudioEngine } from './game/audio/AudioEngine';
import { DEFAULT_SETTINGS, type MatchSettings } from './game/core/types';
import { GameView } from './ui/GameView';
import { MainMenu } from './ui/MainMenu';

const STORAGE_KEY = 'dust2-fps-settings-v1';

function loadSettings(): MatchSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<MatchSettings>) };
  } catch {
    // storage unavailable (private mode): fall back to defaults
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(s: MatchSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export default function App() {
  const [settings, setSettings] = useState<MatchSettings>(loadSettings);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [session, setSession] = useState(0);
  const audio = useMemo(() => new AudioEngine(), []);

  const start = useCallback(
    (s: MatchSettings) => {
      saveSettings(s);
      setSettings(s);
      audio.init(); // user gesture: unlock Web Audio
      audio.setVolume(s.volume);
      audio.uiClick();
      setSession((n) => n + 1);
      setScreen('game');
    },
    [audio],
  );

  const exit = useCallback((s?: MatchSettings) => {
    if (s) {
      saveSettings(s);
      setSettings(s);
    }
    if (document.pointerLockElement) document.exitPointerLock();
    setScreen('menu');
  }, []);

  return screen === 'menu' ? (
    <MainMenu initial={settings} onStart={start} />
  ) : (
    <GameView key={session} settings={settings} audio={audio} onExit={exit} />
  );
}
