const CONTROLS: Array<[string, string]> = [
  ['WASD', '移动'],
  ['鼠标', '瞄准 / 转视角'],
  ['左键', '开火'],
  ['右键', 'AWP 开镜'],
  ['空格', '跳跃'],
  ['Ctrl / C', '下蹲'],
  ['R', '换弹'],
  ['E', '安放 / 拆除 / 拾取 C4'],
  ['1 / 2 / 3', '主武器 / 副武器 / 刀'],
  ['Esc', '暂停'],
];

export function StartMenu({ onStart }: { onStart: () => void }) {
  return (
    <div className="overlay">
      <div className="menu">
        <h1>DUST2 · 5v5</h1>
        <h2>PROCEDURAL TACTICAL FPS PROTOTYPE</h2>
        <p style={{ color: '#b9c6d8', fontSize: 14, lineHeight: 1.7, margin: '0 0 6px' }}>
          你是一名 <b style={{ color: 'var(--t)' }}>T</b> 阵营的进攻方，与 4 名 AI 队友一起对抗 5 名
          <b style={{ color: 'var(--ct)' }}> CT</b>。地图为程序化生成的 Dust2 核心区域：T/CT 出生点、A 大、A 点、中门、猫道、B 洞、B 点全部连通。
          安放 C4 或消灭全部敌人即可获胜。
        </p>
        <div className="grid">
          {CONTROLS.map(([k, v]) => (
            <div key={k}>
              <b>{k}</b>
              {v}
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="btn" onClick={onStart}>
            开始对局
          </button>
          <span style={{ fontSize: 13, opacity: 0.6 }}>点击后请允许鼠标锁定</span>
        </div>
        <div className="tip">
          第一回合为手枪局：全员只有默认手枪且无护甲。之后的回合会自动购买主武器与护甲。
          阵亡后会自动接管一名存活队友继续战斗。
        </div>
      </div>
    </div>
  );
}

export function PauseMenu({ onResume }: { onResume: () => void }) {
  return (
    <div className="overlay">
      <div className="menu" style={{ width: 'min(460px, 92vw)' }}>
        <h1 style={{ fontSize: 30 }}>已暂停</h1>
        <h2>POINTER UNLOCKED</h2>
        <div className="actions">
          <button className="btn" onClick={onResume}>
            继续游戏
          </button>
        </div>
        <div className="tip">移动鼠标重新锁定视角。若浏览器未自动锁定，请再次点击“继续游戏”。</div>
      </div>
    </div>
  );
}
