import { useEffect, useRef, useState } from "react";
import { Game } from "./game/Game";
import type { HudSnapshot, MatchOptions, Team } from "./game/types";
import Hud from "./game/hud/Hud";
import "./App.css";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [phase, setPhase] = useState<"menu" | "play">("menu");
  const [team, setTeam] = useState<Team>("T");
  const [pistol, setPistol] = useState(true);
  const [hud, setHud] = useState<HudSnapshot | null>(null);
  const [board, setBoard] = useState(false);

  useEffect(() => {
    if (phase !== "play" || !canvasRef.current) return;
    const options: MatchOptions = { team, pistolRound: pistol };
    const game = new Game(canvasRef.current, options, setHud);
    gameRef.current = game;
    game.start();
    return () => {
      game.dispose();
      gameRef.current = null;
    };
  }, [phase, team, pistol]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Tab") {
        e.preventDefault();
        setBoard(true);
      }
      if (e.code === "Escape" && phase === "play") {
        document.exitPointerLock();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Tab") setBoard(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [phase]);

  return (
    <div className="app">
      <canvas ref={canvasRef} className="game" />
      {phase === "play" && hud && <Hud hud={hud} showBoard={board} />}
      {phase === "menu" && (
        <div className="menu">
          <div className="panel">
            <h1>DUST II</h1>
            <div className="sub">5v5 第一人称对战原型 · 程序化地图 / 角色 / 枪声</div>
            <div className="row">
              <button className={`team T${team === "T" ? " on" : ""}`} onClick={() => setTeam("T")}>
                恐怖分子 T
              </button>
              <button className={`team CT${team === "CT" ? " on" : ""}`} onClick={() => setTeam("CT")}>
                反恐精英 CT
              </button>
            </div>
            <label className="check">
              <input type="checkbox" checked={pistol} onChange={(e) => setPistol(e.target.checked)} />
              第一回合手枪局（仅默认手枪 + 护甲 50）
            </label>
            <button className="start" onClick={() => setPhase("play")}>
              开始比赛
            </button>
            <div className="help">
              WASD 移动 · 鼠标瞄准 · 左键开火 · 空格跳跃 · R 换弹 · 1/2/3 切枪
              <br />
              右键 AWP 开镜 · E 下包 / 拆包 / 捡包 · G 丢包 · TAB 计分板
              <br />
              阵亡后左键切换队友视角，F 接管该 Bot
            </div>
          </div>
        </div>
      )}
    </div>
  );
}