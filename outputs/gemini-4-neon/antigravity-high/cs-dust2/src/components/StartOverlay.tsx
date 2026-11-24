import React, { useState } from 'react';
import { CAMERA_CONFIG } from '../game/config';
import { GameMode, HudState, Team } from '../game/types';

interface StartOverlayProps {
  hud: HudState;
  onStart: (team: Team, mode: GameMode) => void;
  onResume: () => void;
  onRestart: () => void;
  onSensitivityChange: (sens: number) => void;
  onMuteToggle: (muted: boolean) => void;
}

export const StartOverlay: React.FC<StartOverlayProps> = ({
  hud,
  onStart,
  onResume,
  onRestart,
  onSensitivityChange,
  onMuteToggle,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team>('CT');
  const [selectedMode, setSelectedMode] = useState<GameMode>('competitive');
  const [sens, setSens] = useState(CAMERA_CONFIG.DEFAULT_SENSITIVITY);
  const [muted, setMuted] = useState(false);

  const isPauseMenu = hud.started && hud.paused;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: isPauseMenu
          ? 'rgba(8, 12, 18, 0.72)'
          : 'radial-gradient(circle at 50% 35%, rgba(28, 36, 48, 0.72), rgba(8, 11, 18, 0.90))',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
      }}
    >
      <div
        style={{
          width: 600,
          maxWidth: '94vw',
          background: 'linear-gradient(160deg, rgba(18, 24, 34, 0.96), rgba(10, 14, 22, 0.98))',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 14,
          padding: 28,
          boxShadow: '0 28px 80px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f5b942', letterSpacing: '0.16em' }}>
              THREE.JS PROCEDURAL TACTICAL FPS
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '0.04em', marginTop: 2 }}>
              DE_DUST2 <span style={{ color: '#f5b942' }}>5v5</span>
            </h1>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              全区域复刻：T/CT 出生点 · A大 · A点 · 中门 · 猫道 · B洞 · B点
            </div>
          </div>

          <button
            onClick={() => {
              const next = !muted;
              setMuted(next);
              onMuteToggle(next);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.16)',
              background: muted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)',
              color: '#e2e8f0',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {muted ? '🔇 已静音' : '🔊 音效开启'}
          </button>
        </div>

        {!isPauseMenu ? (
          <>
            {/* Team Select */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                选择阵营 (1 玩家 + 4 AI 队友 vs 5 AI 敌人)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={() => setSelectedTeam('CT')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: selectedTeam === 'CT' ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedTeam === 'CT' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#60a5fa', fontSize: 15 }}>反恐精英 (CT)</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    默认 USP-S · 守卫 A/B 点并拆除 C4
                  </div>
                </button>
                <button
                  onClick={() => setSelectedTeam('T')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: selectedTeam === 'T' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedTeam === 'T' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: 15 }}>恐怖分子 (T)</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    默认 Glock-18 · 携带 C4 突入 A/B 点安放
                  </div>
                </button>
              </div>
            </div>

            {/* Game Mode Select */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                开局规则
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={() => setSelectedMode('competitive')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: selectedMode === 'competitive' ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedMode === 'competitive' ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255,255,255,0.04)',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13 }}>标准竞技（手枪局开局）</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    R1 全员默认手枪+手枪局护甲，R2 起购买步枪/AWP
                  </div>
                </button>
                <button
                  onClick={() => setSelectedMode('full_buy')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: selectedMode === 'full_buy' ? '2px solid #f5b942' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedMode === 'full_buy' ? 'rgba(245, 185, 66, 0.16)' : 'rgba(255,255,255,0.04)',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13 }}>全枪械实战（即刻满配）</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    开局 $5500，立即按 [B] 体验 AK-47 / M4A4 / AWP / 沙鹰
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ marginBottom: 18, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>游戏已暂停</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              当前比分：CT {hud.ctScore} : {hud.tScore} T · 第 {hud.roundNumber} 回合
            </div>
          </div>
        )}

        {/* Mouse Sensitivity */}
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#cbd5e1', whiteSpace: 'nowrap' }}>鼠标灵敏度</span>
          <input
            type="range"
            min={0.0008}
            max={0.005}
            step={0.0002}
            value={sens}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setSens(v);
              onSensitivityChange(v);
            }}
            style={{ flex: 1, accentColor: '#f5b942' }}
          />
          <span style={{ fontSize: 12, color: '#f5b942', width: 38, textAlign: 'right' }}>
            {(sens * 1000).toFixed(1)}
          </span>
        </div>

        {/* Keybinds Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '5px 14px',
            fontSize: 11,
            color: '#9fb2c8',
            background: 'rgba(0,0,0,0.28)',
            padding: '10px 12px',
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <div><b style={{ color: '#f1f5f9' }}>WASD / Space / Ctrl</b> 移动 / 跳跃 / 蹲下</div>
          <div><b style={{ color: '#f1f5f9' }}>左键 / 右键</b> 开火 / AWP双倍开镜 / 刀重击</div>
          <div><b style={{ color: '#f1f5f9' }}>1 / 2 / 3 / 5 / 滚轮</b> 切枪 (主/副/刀/C4)</div>
          <div><b style={{ color: '#f1f5f9' }}>R / B / G</b> 换弹 / 购买菜单 / 丢弃C4</div>
          <div><b style={{ color: '#f1f5f9' }}>长按 E</b> 安放C4 / 拆除C4 / 阵亡接管Bot</div>
          <div><b style={{ color: '#f1f5f9' }}>Tab / Shift</b> 战绩板 / 静步走</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!isPauseMenu ? (
            <button
              onClick={() => onStart(selectedTeam, selectedMode)}
              style={{
                flex: 1,
                padding: '13px 20px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              进入 DUST2 战场 (锁定鼠标视角)
            </button>
          ) : (
            <>
              <button
                onClick={onResume}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#f5b942',
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                继续对战
              </button>
              <button
                onClick={onRestart}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#f1f5f9',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                重新开局
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
