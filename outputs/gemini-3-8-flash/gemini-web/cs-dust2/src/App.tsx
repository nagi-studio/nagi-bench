import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';

export const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090d16', position: 'relative', overflow: 'hidden' }}>
      <GameCanvas />

      {/* Start screen / Pointer Lock overlay */}
      {!hasStarted && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(9, 13, 22, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            color: '#f8fafc'
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 20,
              padding: '36px 48px',
              maxWidth: 580,
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ fontSize: 13, letterSpacing: '0.2em', color: '#fbbf24', fontWeight: 'bold', marginBottom: 8 }}>
              COUNTER-STRIKE TACTICAL SIMULATION
            </div>
            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: '#f8fafc', textShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}>
              DE_DUST2 · 5v5
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 12, marginBottom: 28, lineHeight: 1.6 }}>
              复刻 Dust2 经典核心区域：A大、中门、A小猫道与A包点。支持完整的 5v5 CT vs T 战术人机对抗、C4 下包与拆除、AK-47 / M4A4 / AWP 开镜射击后坐力弹道与 Web Audio 合成音效。
            </p>

            <button
              onClick={() => setHasStarted(true)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#0f172a',
                border: 'none',
                borderRadius: 12,
                padding: '14px 38px',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.1s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
            >
              点击进入战场 · START MISSION
            </button>

            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, fontSize: 11, color: '#cbd5e1', textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 10 }}>
              <div>
                <b style={{ color: '#fbbf24' }}>WASD / 空格</b><br />移动 / 跳跃
              </div>
              <div>
                <b style={{ color: '#fbbf24' }}>鼠标左键 / 右键</b><br />开火 / AWP开镜
              </div>
              <div>
                <b style={{ color: '#fbbf24' }}>1 - 7 / R 键</b><br />切枪 / 换弹
              </div>
              <div>
                <b style={{ color: '#fbbf24' }}>E 键</b><br />下包 / 拆除 C4
              </div>
              <div>
                <b style={{ color: '#fbbf24' }}>Tab 键</b><br />接管存活队友
              </div>
              <div>
                <b style={{ color: '#fbbf24' }}>N 键</b><br />重开回合
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating help toggle button */}
      {hasStarted && (
        <button
          onClick={() => setShowHelp(!showHelp)}
          style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            padding: '4px 14px',
            color: '#94a3b8',
            fontSize: 11,
            cursor: 'pointer',
            zIndex: 40
          }}
        >
          {showHelp ? '关闭帮助' : '操作指南 (Help)'}
        </button>
      )}

      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 45
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid #f59e0b',
              borderRadius: 16,
              padding: 24,
              maxWidth: 460,
              fontSize: 13,
              color: '#f8fafc',
              lineHeight: 1.6
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', color: '#fbbf24' }}>战术操作说明</h3>
            <ul style={{ paddingLeft: 20, margin: '0 0 16px 0' }}>
              <li><b>移动与瞄准：</b>使用键盘 WASD 移动，空格键跳跃。在画布内拖动或点击激活指针锁定以旋转视角。</li>
              <li><b>射击机制：</b>鼠标左键开火，武器拥有真实的后坐力跳动与弹道散布；右键点击 AWP 可进入高倍光学瞄准镜。</li>
              <li><b>C4 爆破攻防：</b>T 携带者到达 A 或 B 包点后长按 E 键 3.2 秒安放 C4；CT 靠近已安放的 C4 长按 E 键 5 秒即可拆除。</li>
              <li><b>AI 接管：</b>阵亡后或战局中随时按下 Tab 键，可无缝接管并操控存活的队友！</li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                background: '#f59e0b',
                color: '#0f172a',
                border: 'none',
                borderRadius: 8,
                padding: '6px 18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
