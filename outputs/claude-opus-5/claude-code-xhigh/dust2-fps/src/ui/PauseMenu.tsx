import { useState } from 'react';

interface Props {
  onResume: () => void;
  onExit: () => void;
  onSettings: (s: {
    render: { fov: number; shadows: boolean };
    sensitivity: number;
    volume: number;
  }) => void;
  fps: number;
  /** 初值来自开局时选的设置，否则一动滑块就会把设置弹回默认值 */
  initial: { fov: number; shadows: boolean; sensitivity: number; volume: number };
}

export function PauseMenu({ onResume, onExit, onSettings, fps, initial }: Props) {
  const [fov, setFov] = useState(initial.fov);
  const [shadows, setShadows] = useState(initial.shadows);
  const [sens, setSens] = useState(initial.sensitivity);
  const [volume, setVolume] = useState(initial.volume);

  const push = (next: Partial<{ fov: number; shadows: boolean; sens: number; volume: number }>) => {
    const v = {
      fov: next.fov ?? fov,
      shadows: next.shadows ?? shadows,
      sens: next.sens ?? sens,
      volume: next.volume ?? volume,
    };
    onSettings({ render: { fov: v.fov, shadows: v.shadows }, sensitivity: v.sens, volume: v.volume });
  };

  return (
    <div className="pause">
      <div className="pause-panel">
        <h2>暂停</h2>
        <div className="pause-fps">{fps} FPS</div>

        <label className="row">
          <span>视野 FOV</span>
          <input
            type="range"
            min={70}
            max={110}
            value={fov}
            onChange={(e) => {
              const v = Number(e.target.value);
              setFov(v);
              push({ fov: v });
            }}
          />
          <b>{fov}</b>
        </label>

        <label className="row">
          <span>鼠标灵敏度</span>
          <input
            type="range"
            min={0.4}
            max={6}
            step={0.1}
            value={sens}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSens(v);
              push({ sens: v });
            }}
          />
          <b>{sens.toFixed(1)}</b>
        </label>

        <label className="row">
          <span>音量</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              push({ volume: v });
            }}
          />
          <b>{Math.round(volume * 100)}</b>
        </label>

        <label className="row check">
          <span>动态阴影</span>
          <input
            type="checkbox"
            checked={shadows}
            onChange={(e) => {
              setShadows(e.target.checked);
              push({ shadows: e.target.checked });
            }}
          />
        </label>

        <div className="pause-buttons">
          <button className="primary" onClick={onResume}>
            继续游戏
          </button>
          <button onClick={onExit}>返回主菜单</button>
        </div>
      </div>
    </div>
  );
}
