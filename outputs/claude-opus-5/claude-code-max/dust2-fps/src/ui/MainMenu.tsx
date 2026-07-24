import type { ClientSettings } from '../app/GameClient.ts';

interface MenuProps {
  mode: 'start' | 'paused';
  settings: ClientSettings;
  onChange(next: ClientSettings): void;
  onStart(): void;
  onRestart(): void;
  score?: { ct: number; t: number; round: number } | null;
}

const CONTROLS: Array<[string, string]> = [
  ['W A S D', '移动'],
  ['空格', '跳跃 / 阵亡后切换观察目标'],
  ['Ctrl / C', '蹲下'],
  ['Shift', '静步走'],
  ['鼠标左键', '开火'],
  ['鼠标右键', 'AWP 开镜（两级变焦）'],
  ['R', '换弹'],
  ['E', '安放 / 拆除 / 拾取 C4'],
  ['1 / 2 / 3', '主武器 / 副武器 / 匕首'],
  ['F', '阵亡后接管队友（bot）'],
  ['Tab', '记分板'],
  ['Esc', '暂停菜单'],
];

export function MainMenu({ mode, settings, onChange, onStart, onRestart, score }: MenuProps) {
  const set = <K extends keyof ClientSettings>(key: K, value: ClientSettings[K]) => {
    const next: ClientSettings = { ...settings };
    next[key] = value;
    onChange(next);
  };

  return (
    <div className="menu-backdrop">
      <div className="menu">
        <header className="menu-header">
          <h1>
            DUST<span>2</span>
          </h1>
          <p>5v5 · 程序化生成的第一人称射击原型 · React + TypeScript + three.js</p>
          {score && (
            <p className="menu-score">
              第 {score.round} 回合 · CT {score.ct} : {score.t} T
            </p>
          )}
        </header>

        <div className="menu-body">
          <section className="menu-settings">
            <h2>设置</h2>

            <label className="setting">
              <span>你的阵营</span>
              <div className="seg">
                <button
                  type="button"
                  className={settings.playerTeam === 'CT' ? 'active' : ''}
                  onClick={() => set('playerTeam', 'CT')}
                  disabled={mode === 'paused'}
                >
                  反恐精英 CT
                </button>
                <button
                  type="button"
                  className={settings.playerTeam === 'T' ? 'active' : ''}
                  onClick={() => set('playerTeam', 'T')}
                  disabled={mode === 'paused'}
                >
                  恐怖分子 T
                </button>
              </div>
            </label>

            <label className="setting">
              <span>AI 难度 · {Math.round(settings.botSkill * 100)}</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={settings.botSkill}
                onChange={(e) => set('botSkill', Number(e.target.value))}
                disabled={mode === 'paused'}
              />
            </label>

            <label className="setting setting-row">
              <span>只打手枪局</span>
              <input
                type="checkbox"
                checked={settings.pistolRoundsOnly}
                onChange={(e) => set('pistolRoundsOnly', e.target.checked)}
                disabled={mode === 'paused'}
              />
            </label>

            <label className="setting">
              <span>鼠标灵敏度 · {(settings.sensitivity * 1000).toFixed(1)}</span>
              <input
                type="range"
                min={0.0006}
                max={0.006}
                step={0.0002}
                value={settings.sensitivity}
                onChange={(e) => set('sensitivity', Number(e.target.value))}
              />
            </label>

            <label className="setting">
              <span>音量 · {Math.round(settings.volume * 100)}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.volume}
                onChange={(e) => set('volume', Number(e.target.value))}
              />
            </label>

            <label className="setting setting-row">
              <span>阴影（关闭可提升性能）</span>
              <input
                type="checkbox"
                checked={settings.shadows}
                onChange={(e) => set('shadows', e.target.checked)}
              />
            </label>
          </section>

          <section className="menu-controls">
            <h2>操作</h2>
            <ul>
              {CONTROLS.map(([key, desc]) => (
                <li key={key}>
                  <kbd>{key}</kbd>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
            <div className="menu-brief">
              <h3>回合目标</h3>
              <p>
                T 方需要把 C4 安放在 <b>A 点</b>或 <b>B 点</b>并引爆，或消灭全部 CT；
                CT 方需要拆除 C4，或在下包前消灭全部 T。持包者阵亡后 C4 会掉落，可被其他 T 拾取。
              </p>
            </div>
          </section>
        </div>

        <footer className="menu-footer">
          <button type="button" className="primary" onClick={onStart}>
            {mode === 'start' ? '开始游戏' : '继续游戏'}
          </button>
          {mode === 'paused' && (
            <button type="button" onClick={onRestart}>
              重新开始比赛
            </button>
          )}
          <span className="menu-hint">开始后鼠标会被锁定；按 Esc 返回本菜单</span>
        </footer>
      </div>
    </div>
  );
}
