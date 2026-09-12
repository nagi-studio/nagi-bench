import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Engine } from './game/engine';
import { UIStore } from './ui/store';
import { HUD } from './ui/HUD';
import { Minimap } from './ui/Minimap';
import { audio } from './game/audio';
import type { Team } from './game/types';

function Menu({ onStart }: { onStart: (side: Team) => void }) {
  return (
    <div className="menu">
      <div className="menu-panel">
        <h1>DUST2 · FPS PROTOTYPE</h1>
        <p className="menu-sub">5v5 · 手枪局开局 · C4 攻防</p>
        <div className="menu-buttons">
          <button className="btn btn-t" onClick={() => onStart('T')}>
            加入 T（进攻方）
          </button>
          <button className="btn btn-ct" onClick={() => onStart('CT')}>
            加入 CT（防守方）
          </button>
        </div>
        <div className="menu-help">
          <p>WASD 移动 · 空格跳跃 · 鼠标射击 · 右键开镜（AWP）</p>
          <p>1/2/3 切换武器 · R 换弹 · E 安放/拆除 C4 · Shift 静步</p>
          <p>冻结时间 B 换主武器 · V 换手枪 · 阵亡后左键切换观战 / F 接管队友</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [store] = useState(() => new UIStore());
  const [engine, setEngine] = useState<Engine | null>(null);
  const screen = useSyncExternalStore(store.subscribe, () => store.get().screen);

  useEffect(() => {
    if (!containerRef.current) return;
    const eng = new Engine(containerRef.current, store);
    setEngine(eng);
  }, [store]);

  const start = (side: Team) => {
    audio.unlock();
    if (!engine) return;
    engine.startMatch(side);
    store.set({ screen: 'game', myTeam: side });
    const canvas = containerRef.current?.querySelector('canvas');
    canvas?.requestPointerLock();
  };

  return (
    <div className="app">
      <div ref={containerRef} className="viewport" />
      {screen === 'menu' && <Menu onStart={start} />}
      {screen === 'game' && engine && (
        <>
          <HUD store={store} />
          <Minimap store={store} engine={engine} />
        </>
      )}
    </div>
  );
}
