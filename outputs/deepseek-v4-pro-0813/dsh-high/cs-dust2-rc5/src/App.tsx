import { useEffect, useRef, useState } from 'react'
import { Game } from './game/engine'
import { useHud } from './hooks'
import { HUD } from './components/HUD'
import { Minimap } from './components/Minimap'
import type { Team } from './game/types'

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game | null>(null)
  const [started, setStarted] = useState(false)
  const [team, setTeam] = useState<Team | null>(null)
  const hud = useHud()

  useEffect(() => {
    if (!containerRef.current) return
    const game = new Game(containerRef.current)
    gameRef.current = game
    return () => {
      game.dispose()
      gameRef.current = null
    }
  }, [])

  const start = (t: Team) => {
    setTeam(t)
    setStarted(true)
    gameRef.current?.start(t)
  }

  return (
    <div className="app">
      <div ref={containerRef} className="game-canvas" />

      {started && team && (
        <>
          <HUD />
          <Minimap />
        </>
      )}

      {!started && (
        <div className="start-overlay">
          <div className="start-panel">
            <h1>Dust2 · 5v5 对战原型</h1>
            <p className="subtitle">
              React + TypeScript + three.js · 程序化地图 / 角色 / 武器 / 声音
            </p>
            <div className="start-rows">
              <button className="btn btn-ct" onClick={() => start('CT')}>
                加入 CT（防守方）
              </button>
              <button className="btn btn-t" onClick={() => start('T')}>
                加入 T（进攻方，带 C4）
              </button>
            </div>
            <div className="controls-help">
              <div><b>WASD</b> 移动 · <b>空格</b> 跳跃 · <b>鼠标</b> 视角</div>
              <div><b>左键</b> 开火 · <b>右键</b> AWP 开镜 · <b>R</b> 换弹</div>
              <div><b>1/2/3</b> 主武器/副武器/刀 · <b>4</b> 切换步枪/AWP</div>
              <div><b>E</b> 安放/拆除 C4（死亡时切换队友）· <b>F</b> 接管队友</div>
              <div><b>M</b> 静音 · <b>ESC</b> 释放鼠标</div>
            </div>
            <p className="note">第 1 回合为手枪局；点击后进入游戏。</p>
          </div>
        </div>
      )}

      {/* pointer-lock hint */}
      {started && hud.spectating && (
        <div className="spectate-tag">正在观察：{hud.spectatedName}</div>
      )}
    </div>
  )
}
