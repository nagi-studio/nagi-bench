import React, { useState } from 'react';
import { GameMode, HudSnapshot, Team } from '../game/types';

interface OverlayMenusProps {
  hud: HudSnapshot;
  onStart: (team: Team, mode: GameMode) => void;
  onResume: () => void;
  onSwitchTeam: (team: Team) => void;
  onSwitchMode: (mode: GameMode) => void;
  onSkipToFullBuy: () => void;
  onSetSensitivity: (v: number) => void;
  onSetVolume: (v: number) => void;
}

export const OverlayMenus: React.FC<OverlayMenusProps> = ({
  hud,
  onStart,
  onResume,
  onSwitchTeam,
  onSwitchMode,
  onSkipToFullBuy,
  onSetSensitivity,
  onSetVolume,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team>(hud.playerTeam);
  const [selectedMode, setSelectedMode] = useState<GameMode>(hud.gameMode);

  // Title / Launch Screen
  if (!hud.started) {
    return (
      <div className="title-backdrop">
        <div className="title-card">
          <div className="title-eyebrow">THREE.JS · PROCEDURAL 3D TACTICAL FPS</div>
          <h1 className="title-heading">DE_DUST2 // 5v5</h1>
          <p className="title-sub">
            完整 Dust2 核心地图（T/CT出生点 · A大 · A点 · 中门 · 猫道 · B洞 · B点）· 分区 Hitbox ·
            5v5 AI 寻路与 C4 攻防 · Web Audio 合成音效
          </p>

          <div className="setup-section">
            <label>选择阵营 (SIDE)</label>
            <div className="choice-grid two">
              <button
                className={`choice-card ct ${selectedTeam === 'CT' ? 'active' : ''}`}
                onClick={() => setSelectedTeam('CT')}
              >
                <strong>反恐精英 (CT)</strong>
                <span>默认 USP-S / M4A4 · 防守包点 &amp; 拆除 C4</span>
              </button>
              <button
                className={`choice-card t ${selectedTeam === 'T' ? 'active' : ''}`}
                onClick={() => setSelectedTeam('T')}
              >
                <strong>恐怖分子 (T)</strong>
                <span>默认 Glock-18 / AK-47 · 携带并安放 C4</span>
              </button>
            </div>
          </div>

          <div className="setup-section">
            <label>开局模式 (MATCH MODE)</label>
            <div className="choice-grid three">
              <button
                className={`choice-card ${selectedMode === 'standard' ? 'active' : ''}`}
                onClick={() => setSelectedMode('standard')}
              >
                <strong>标准竞赛 (推荐)</strong>
                <span>R1 手枪局开局 → R2+ 全枪局</span>
              </button>
              <button
                className={`choice-card ${selectedMode === 'pistol_only' ? 'active' : ''}`}
                onClick={() => setSelectedMode('pistol_only')}
              >
                <strong>纯手枪局模式</strong>
                <span>仅手枪与防弹衣对决</span>
              </button>
              <button
                className={`choice-card ${selectedMode === 'full_buy' ? 'active' : ''}`}
                onClick={() => setSelectedMode('full_buy')}
              >
                <strong>全枪局热身</strong>
                <span>首回合即开放 AK/M4/AWP/沙鹰</span>
              </button>
            </div>
          </div>

          <div className="controls-strip">
            <span><kbd>WASD</kbd> 移动</span>
            <span><kbd>Space</kbd> 跳跃</span>
            <span><kbd>Shift</kbd> 静步</span>
            <span><kbd>Ctrl</kbd> 蹲下</span>
            <span><kbd>左键</kbd> 开火</span>
            <span><kbd>右键</kbd> AWP开镜/重刀</span>
            <span><kbd>1-4</kbd> 切枪</span>
            <span><kbd>R</kbd> 换弹</span>
            <span><kbd>E</kbd> 下包/拆包/接管AI</span>
            <span><kbd>B</kbd> 购买武器</span>
          </div>

          <button className="btn-launch" onClick={() => onStart(selectedTeam, selectedMode)}>
            进入 Dust2 战场 (锁定鼠标)
          </button>
        </div>
      </div>
    );
  }

  // Pause / Settings Menu
  if (hud.paused && !hud.buyMenuOpen) {
    return (
      <div className="modal-backdrop">
        <div className="pause-panel">
          <div className="pause-head">
            <h2>游戏已暂停 · DE_DUST2</h2>
            <span className="pause-score">
              CT {hud.scoreCT} : {hud.scoreT} T (R{hud.roundNumber})
            </span>
          </div>

          <div className="pause-sliders">
            <label>
              <span>鼠标灵敏度: {hud.sensitivity.toFixed(2)}</span>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={hud.sensitivity}
                onChange={(e) => onSetSensitivity(parseFloat(e.target.value))}
              />
            </label>
            <label>
              <span>主音量: {Math.round(hud.volume * 100)}%</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={hud.volume}
                onChange={(e) => onSetVolume(parseFloat(e.target.value))}
              />
            </label>
          </div>

          <div className="pause-quick-actions">
            <button className="btn-primary full" onClick={onResume}>
              继续战斗 (重新锁定视角)
            </button>

            <div className="pause-btn-row">
              <button
                className="btn-secondary"
                onClick={() => onSwitchTeam(hud.playerTeam === 'CT' ? 'T' : 'CT')}
              >
                切换阵营 ({hud.playerTeam === 'CT' ? '改为 T 阵营' : '改为 CT 阵营'})
              </button>
              <button className="btn-secondary" onClick={onSkipToFullBuy}>
                直接进入全枪局 (体验 AK/M4/AWP)
              </button>
            </div>

            <div className="pause-btn-row">
              <button className="btn-secondary" onClick={() => onSwitchMode('standard')}>
                重开标准赛 (R1 手枪局)
              </button>
              <button className="btn-secondary" onClick={() => onSwitchMode('full_buy')}>
                重开全枪局模式
              </button>
            </div>
          </div>

          <div className="pause-help">
            <strong>操作速查：</strong> WASD 移动 · Space 跳跃 · Shift 静步 · Ctrl/C 蹲伏 · R 换弹 ·
            1/2/3/4/Q/滚轮 切枪 · 右键 AWP 开镜 / 匕首重击 · E 安放或拆除 C4（阵亡时按 E 接管存活队友）·
            B 武器商店 · Tab 战绩板
          </div>
        </div>
      </div>
    );
  }

  return null;
};
