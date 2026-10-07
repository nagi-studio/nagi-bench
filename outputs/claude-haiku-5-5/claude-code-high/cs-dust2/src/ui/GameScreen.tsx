import { useEffect, useRef } from 'react'
import { GameController } from '../game/runtime/GameController.ts'
import { gameStore } from '../store/gameStore.ts'
import { useGameStore } from './useGameStore.ts'
import { Hud } from './Hud.tsx'
import type { MenuConfig } from './MainMenu.tsx'

interface Props {
  config: MenuConfig
  onExit: () => void
}

export function GameScreen({ config, onExit }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const ctrlRef = useRef<GameController | null>(null)
  const hud = useGameStore((s) => s.hud)
  const locked = useGameStore((s) => s.locked)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const ctrl = new GameController(
      host,
      config,
      (h) => gameStore.patch({ hud: h }),
      (l) => gameStore.patch({ locked: l }),
    )
    ctrlRef.current = ctrl
    ctrl.start()
    return () => {
      ctrl.stop()
      ctrlRef.current = null
      gameStore.patch({ hud: null, locked: false })
    }
  }, [config])

  return (
    <div className="game-root">
      <div className="viewport" ref={hostRef} />
      {hud && <Hud hud={hud} onExit={onExit} />}
      {hud && !locked && hud.phase !== 'matchOver' && (
        <div className="pause" onClick={() => ctrlRef.current?.requestLock()}>
          <div className="pause-card">
            <h2>已暂停</h2>
            <p>点击画面继续（ESC 暂停）</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onExit()
              }}
            >
              返回菜单
            </button>
          </div>
        </div>
      )}
      {!hud && <div className="loading">正在生成地图…</div>}
    </div>
  )
}
