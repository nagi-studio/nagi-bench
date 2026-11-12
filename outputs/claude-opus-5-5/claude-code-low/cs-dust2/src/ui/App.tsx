import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Game, type HudSnapshot } from '../game/game';
import { Hud } from './Hud';

const noop = () => () => {};

export default function App() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Game | null>(null);

  // Engine lifecycle is bound to the component: created on mount, disposed on unmount
  useEffect(() => {
    const g = new Game(hostRef.current!);
    setGame(g);
    return () => {
      g.dispose();
      setGame(null);
    };
  }, []);

  const snap = useSyncExternalStore<HudSnapshot | null>(
    game ? game.subscribe : noop,
    game ? game.getSnapshot : () => null
  );

  return (
    <div className="app">
      <div ref={hostRef} className="viewport" />
      {game && snap && (snap.started ? <Hud game={game} s={snap} /> : <Menu onStart={(t) => game.startMatch(t)} />)}
      {game && snap && snap.started && !snap.locked && !snap.matchOver && (
        <div className="overlay pause" onClick={() => game.requestLock()}>
          <div className="panel">
            <h2>已暂停鼠标锁定</h2>
            <p>点击画面继续游戏</p>
            <Controls />
          </div>
        </div>
      )}
    </div>
  );
}

function Menu({ onStart }: { onStart: (t: 'T' | 'CT') => void }) {
  return (
    <div className="overlay menu">
      <div className="panel">
        <h1>
          DESERT STRIKE <span>沙漠行动 · 5v5</span>
        </h1>
        <p className="sub">炸弹拆除模式 · 首回合为手枪局 · 先赢 8 回合获胜</p>
        <div className="teams">
          <button className="team ct" onClick={() => onStart('CT')}>
            <b>反恐精英 CT</b>
            <small>守住 A / B 包点，拆除 C4</small>
          </button>
          <button className="team t" onClick={() => onStart('T')}>
            <b>恐怖分子 T</b>
            <small>推进包点，安放 C4</small>
          </button>
        </div>
        <Controls />
      </div>
    </div>
  );
}

function Controls() {
  return (
    <div className="controls">
      <div><kbd>WASD</kbd> 移动 <kbd>Shift</kbd> 静步 <kbd>Space</kbd> 跳跃</div>
      <div><kbd>鼠标左键</kbd> 开火 <kbd>右键</kbd> AWP 开镜 <kbd>R</kbd> 换弹</div>
      <div><kbd>1</kbd> 主武器 <kbd>2</kbd> 手枪 <kbd>3</kbd> 匕首 <kbd>Q</kbd> 上一把</div>
      <div><kbd>E</kbd>（按住）在包点安放 / 在炸弹旁拆除 <kbd>Tab</kbd> 计分板</div>
      <div>冻结时间购买：<kbd>7</kbd> AK-47 <kbd>8</kbd> M4A4 <kbd>9</kbd> AWP <kbd>0</kbd> 沙鹰</div>
      <div>阵亡后：<kbd>左/右键</kbd> 切换观战队友 <kbd>F</kbd> 接管该队友</div>
    </div>
  );
}
