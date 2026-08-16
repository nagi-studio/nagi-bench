import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Engine, getEngine, setEngine } from './game/engine';
import { getState, subscribe, type KillfeedEntry } from './game/store';
import Minimap from './components/Minimap';
import { BUY_MENU, WEAPONS } from './game/config';

function fmtTime(s: number): string {
  const v = Math.max(0, Math.ceil(s));
  const m = Math.floor(v / 60);
  const ss = v % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useSyncExternalStore(subscribe, getState);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new Engine(canvasRef.current);
    setEngine(engine);
    return () => {
      setEngine(null);
      engine.dispose();
    };
  }, []);

  const engine = getEngine();
  const showHit = performance.now() - state.hitmarker < 350;
  const showDamage = performance.now() - state.damageFlash < 450;

  const killfeed = state.killfeed.filter((k: KillfeedEntry) => performance.now() - k.time < 5000);

  return (
    <>
      <canvas ref={canvasRef} className="game-canvas" />

      {state.started && (
        <div className="hud">
          {/* crosshair */}
          {!state.scoped && state.alive && (
            <div className="crosshair">
              <span className="line v1" />
              <span className="line v2" />
              <span className="line h1" />
              <span className="line h2" />
              <span className="dot" />
            </div>
          )}

          {state.scoped && state.alive && (
            <div className="scope-overlay">
              <span className="cross" />
              <span className="cross h" />
            </div>
          )}

          {showHit && <div className="hitmarker">✕</div>}
          {showDamage && <div className="damage-flash" />}

          {/* vitals */}
          <div className="vitals">
            <div className="vital-row">
              <span className="vital-label">生命</span>
              <div className="health-bar">
                <div className="health-fill" style={{ width: `${state.hp}%` }} />
              </div>
              <span className="vital-num">{state.hp}</span>
            </div>
            <div className="vital-row">
              <span className="vital-label">护甲</span>
              <div className="armor-bar">
                <div className="armor-fill" style={{ width: `${state.armor}%` }} />
              </div>
              <span className="vital-num">{state.armor}</span>
            </div>
          </div>

          {/* ammo */}
          <div className="ammo-panel">
            <div className="ammo-name">{state.weaponName}</div>
            <div className="ammo-count">
              {state.mag}
              <span className="reserve">/ {state.reserve}</span>
            </div>
            {state.reloading && <div className="ammo-reload">换弹中…</div>}
          </div>

          {/* top center */}
          <div className="top-center">
            <div className="round-label">第 {state.round} 回合 · {state.team === 'T' ? 'T 阵营' : 'CT 阵营'}</div>
            <div className={`timer ${state.phase === 'planted' ? 'planted' : ''}`}>{fmtTime(state.roundTime)}</div>
            {state.c4State === 'planted' && <div className="c4-banner">💣 C4 倒计时 {fmtTime(state.c4Timer)}</div>}
            {state.c4State === 'carried' && <div className="c4-banner">C4 由 T 方携带</div>}
            {state.c4State === 'dropped' && <div className="c4-banner">C4 已掉落！</div>}
            <div className="score-line">
              <span className="score-ct">CT {state.score.ct}</span>
              <span className="score-t">T {state.score.t}</span>
            </div>
          </div>

          {/* killfeed */}
          <div className="killfeed">
            {killfeed.map((k) => (
              <div className="killfeed-item" key={k.id}>
                {k.text}
              </div>
            ))}
          </div>

          {/* minimap */}
          <div className="minimap-wrap">
            <Minimap
              walls={state.minimapWalls}
              players={state.minimapPlayers}
              c4Pos={state.c4Pos}
              c4State={state.c4State}
            />
          </div>

          {/* center message */}
          {state.message && <div className="center-message">{state.message}</div>}

          {/* round over */}
          {state.roundOver && state.winner && (
            <div className={`round-over ${state.winner === 'T' ? 'win-t' : 'win-ct'}`}>
              {state.winner === 'T' ? 'T 阵营获胜' : 'CT 阵营获胜'}
            </div>
          )}

          {/* death / spectate */}
          {!state.alive && !state.roundOver && (
            <div className="death-hint">
              你已阵亡 · 正在观战 <b>{state.spectating ?? '队友'}</b>
              <br />
              按 <b>空格</b> 切换视角 · 按 <b>G</b> 接管该队友
            </div>
          )}
        </div>
      )}

      {/* buy menu */}
      {state.started && state.buyOpen && (
        <div className="buy-menu">
          <div className="buy-title">购买装备（B 关闭）</div>
          <div className="buy-money">$ {state.money}</div>
          <div className="buy-grid">
            {BUY_MENU.filter((i) => i.team === 'both' || i.team === state.team).map((item) => {
              const affordable = state.money >= item.price;
              return (
                <button
                  key={item.id}
                  className={`buy-item ${affordable ? '' : 'disabled'}`}
                  disabled={!affordable}
                  onClick={() => engine?.buyItem(item.id)}
                >
                  <div className="name">{WEAPONS[item.id].name}</div>
                  <div className="price">$ {item.price}</div>
                </button>
              );
            })}
            <button
              className={`buy-item ${state.money >= 650 && state.armor < 100 ? '' : 'disabled'}`}
              disabled={state.money < 650 || state.armor >= 100}
              onClick={() => engine?.buyArmor()}
            >
              <div className="name">护甲</div>
              <div className="price">$ 650</div>
            </button>
          </div>
          <button className="buy-close" onClick={() => engine?.closeBuy()}>
            关闭
          </button>
        </div>
      )}

      {/* start menu */}
      {!state.started && (
        <div className="menu-overlay">
          <div className="menu-title">DUST2 · 5v5</div>
          <div className="menu-sub">React + TypeScript + three.js 第一人称射击原型</div>
          <button className="menu-btn" onClick={() => engine?.requestStart()}>
            点击开始
          </button>
          <div className="menu-controls">
            WASD 移动 · 空格 跳跃 · 鼠标 视角 · 左键 射击 · 右键 AWP 开镜
            <br />
            R 换弹 · 1/2/3 切换主武器/手枪/刀 · Q 快速切换 · B 购买 · E 下包/拆包/捡包
            <br />
            阵亡后：空格 切换观战视角 · G 接管队友
          </div>
        </div>
      )}

      {/* pause overlay */}
      {state.started && state.paused && (
        <div className="menu-overlay">
          <div className="menu-title">已暂停</div>
          <button className="menu-btn" onClick={() => engine?.requestStart()}>
            点击继续
          </button>
        </div>
      )}
    </>
  );
}
