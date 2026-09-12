// 开始菜单 / 比赛结算
import { useState } from 'react';
import { Team } from '../game/config';

export function Menu({
  onStart, matchEnd,
}: {
  onStart: (team: Team, primary: 'rifle' | 'awp') => void;
  matchEnd: { scoreT: number; scoreCT: number; winner: Team } | null;
}) {
  const [team, setTeam] = useState<Team>('T');
  const [primary, setPrimary] = useState<'rifle' | 'awp'>('rifle');
  const card = (sel: boolean, title: string, color: string, desc: string, onClick: () => void) => (
    <div onClick={onClick} style={{
      flex: 1, border: sel ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.18)',
      background: sel ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
      borderRadius: 10, padding: '18px 22px', cursor: 'pointer', textAlign: 'center',
      transition: 'all 0.15s',
    }}>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{title}</div>
      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>{desc}</div>
    </div>
  );
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(ellipse at center, #2c3a4a 0%, #12161c 75%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8e8e8',
    }}>
      <div style={{ width: 560, maxWidth: '92vw', textAlign: 'center' }}>
        <h1 style={{ fontSize: 44, margin: '0 0 4px', letterSpacing: 4 }}>DUST2</h1>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 26 }}>程序化 5v5 第一人称射击原型 · 无外部素材</div>
        {matchEnd && (
          <div style={{ marginBottom: 20, background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '14px' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              比赛结束 {matchEnd.scoreT} : {matchEnd.scoreCT}
              <span style={{ color: matchEnd.winner === 'T' ? '#ffcf6e' : '#7ea8ff', marginLeft: 8 }}>
                {matchEnd.winner} 获胜
              </span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          {card(team === 'T', 'T · 恐怖分子', '#ffcf6e', 'AK-47 / 格洛克 · 下包', () => setTeam('T'))}
          {card(team === 'CT', 'CT · 反恐精英', '#7ea8ff', 'M4A4 / USP · 拆包', () => setTeam('CT'))}
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
          {card(primary === 'rifle', '步枪', '#ffffff', team === 'T' ? 'AK-47' : 'M4A4', () => setPrimary('rifle'))}
          {card(primary === 'awp', '狙击手', '#ff9a6e', 'AWP · 右键三段开镜', () => setPrimary('awp'))}
        </div>
        <button onClick={() => onStart(team, primary)} style={{
          width: '100%', padding: '14px', fontSize: 18, fontWeight: 700, letterSpacing: 2,
          borderRadius: 8, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(180deg, #e8a33d, #c07e20)', color: '#14100a',
        }}>
          进入对战（点击后锁定鼠标）
        </button>
        <div style={{ marginTop: 22, fontSize: 12, opacity: 0.65, lineHeight: 1.9 }}>
          WASD 移动 · Shift 静步 · 空格 跳 · 鼠标左键 射击 · R 换弹 · 1/2/3/4 或滚轮 切枪<br />
          AWP 右键开镜 · E 拆包（CT）· 4 装备 C4 后按住左键下包（T）· 死亡后 F 接管队友
        </div>
      </div>
    </div>
  );
}
