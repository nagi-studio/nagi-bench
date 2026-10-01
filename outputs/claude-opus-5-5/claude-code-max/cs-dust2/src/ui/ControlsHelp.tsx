const ROWS: [string, string][] = [
  ['W A S D', '移动'],
  ['空格', '跳跃'],
  ['Shift', '静步（无脚步声）'],
  ['C', '下蹲'],
  ['鼠标左键', '开火 / 刀轻击'],
  ['鼠标右键', 'AWP 开镜 / 刀重击'],
  ['R', '换弹'],
  ['1 / 2 / 3 / 5', '主武器 / 副武器 / 刀 / C4'],
  ['Q · 滚轮', '上一把武器 · 切换武器'],
  ['E', '安放 / 拆除炸弹 · 拾取武器 · 观战时接管队友'],
  ['G', '丢弃当前武器 / C4'],
  ['B', '购买菜单（冻结时间 / 回合前 20 秒）'],
  ['Tab', '计分板'],
  ['左/右键 · ←/→', '死亡后切换观察的队友'],
];

export function ControlsHelp({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`controls ${compact ? 'compact' : ''}`}>
      <h3>操作说明</h3>
      <div className="controls-grid">
        {ROWS.map(([k, v]) => (
          <div className="controls-row" key={k}>
            <kbd>{k}</kbd>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
