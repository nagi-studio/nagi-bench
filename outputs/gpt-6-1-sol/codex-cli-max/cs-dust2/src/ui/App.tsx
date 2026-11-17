import { useEffect, useState, useSyncExternalStore } from "react";
import { GameEngine } from "../game/Engine";
import type { GameSnapshot, MatchConfig, Team, WeaponId } from "../game/types";
import { WEAPONS } from "../game/weapons";
import { Icon, WeaponDrawing } from "./Icons";
import { Minimap } from "./Minimap";

const formatTime = (seconds: number) =>
  `${Math.floor(Math.max(0, seconds) / 60)}:${Math.floor(
    Math.max(0, seconds) % 60,
  )
    .toString()
    .padStart(2, "0")}`;
const controls = [
  ["W A S D", "移动"],
  ["鼠标", "转动视角"],
  ["左键", "开火 / 刀击"],
  ["右键", "AWP 开镜"],
  ["空格", "跳跃"],
  ["R", "换弹"],
  ["1 / 2 / 3", "主武器 / 手枪 / 刀"],
  ["Q", "切换上次武器"],
  ["按住 E", "安放 / 拆除 C4"],
  ["G", "丢弃 C4"],
  ["B", "军械库"],
  ["Shift", "慢走"],
  ["Tab", "比分面板"],
  ["Esc", "暂停"],
  ["M", "声音开关"],
  ["阵亡后 E", "接管队友"],
  ["← / →", "切换观战队友"],
];

export function App() {
  const [engine, setEngine] = useState<GameEngine | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let game: GameEngine | undefined;
    try {
      game = new GameEngine(document.getElementById("world")!);
      game.onError(setError);
      setEngine(game);
      if (import.meta.env.DEV)
        (window as unknown as { __DUST__: GameEngine }).__DUST__ = game;
    } catch (e) {
      setError(e instanceof Error ? e.message : "无法启动 WebGL");
    }
    return () => game?.dispose();
  }, []);
  return (
    <main className="game-shell">
      <div id="world" />
      {error ? (
        <div className="fatal-panel">
          <Icon name="info" size={32} />
          <h1>战场暂时无法启动</h1>
          <p>{error}</p>
          <p>请使用支持 WebGL 的桌面浏览器，并开启硬件加速。</p>
          <button className="primary-button" onClick={() => location.reload()}>
            重新加载
          </button>
        </div>
      ) : engine ? (
        <GameUI engine={engine} />
      ) : (
        <div className="loading-screen">
          <div className="loading-reticle" />
          <span>正在构建沙漠战场</span>
        </div>
      )}
    </main>
  );
}

function GameUI({ engine }: { engine: GameEngine }) {
  const s = useSyncExternalStore(engine.subscribe, engine.getSnapshot);
  const [modal, setModal] = useState<"map" | "help" | "weapons" | null>(null);
  return (
    <>
      {s.screen === "menu" ? (
        <Lobby engine={engine} s={s} open={setModal} />
      ) : (
        <HUD engine={engine} s={s} />
      )}
      {modal && (
        <div className="modal-scrim">
          <section
            className={`modal-panel ${modal === "map" ? "map-modal" : ""}`}
          >
            <div className="panel-heading">
              <div>
                <span className="eyebrow">MISSION INTELLIGENCE</span>
                <h2>
                  {modal === "map"
                    ? "熟悉你的战场"
                    : modal === "help"
                      ? "行动指南"
                      : "选择你的武器"}
                </h2>
              </div>
              <button
                className="icon-button"
                aria-label="关闭"
                onClick={() => setModal(null)}
              >
                <Icon name="close" />
              </button>
            </div>
            {modal === "map" ? (
              <>
                <Minimap engine={engine} large preview />
                <div className="map-description">
                  <p>
                    <b>A 线</b> T 出生点 → A 大门 → A 大 → A 点
                  </p>
                  <p>
                    <b>中路</b> T 出生点 → 中门 → CT 出生点 → A / B
                  </p>
                  <p>
                    <b>侧翼</b> 中路 → 猫道 → A 小 → A 点
                  </p>
                  <p>
                    <b>B 线</b> T 出生点 → B 洞 → B 点；B 下层连接中路
                  </p>
                </div>
              </>
            ) : modal === "help" ? (
              <>
                <div className="controls-grid">
                  {controls.map(([key, label]) => (
                    <div key={key}>
                      <kbd>{key}</kbd>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <p className="help-note">
                  T 护送 C4 至 A / B 点，持续安放 3.2 秒；CT 靠近炸弹，持续拆除
                  5 秒。C4 在 40 秒后爆炸。爆头伤害 ×2，护甲可吸收部分伤害。
                </p>
              </>
            ) : (
              <div className="weapon-reference">
                {Object.values(WEAPONS).map((w) => (
                  <article key={w.id}>
                    <WeaponDrawing id={w.id} />
                    <div>
                      <strong>{w.name}</strong>
                      <p>{w.description}</p>
                    </div>
                    <span>
                      {w.magazine || "—"}
                      <small>弹匣</small>
                    </span>
                  </article>
                ))}
              </div>
            )}
            <div className="modal-footer">
              <span className="status-dot" />
              全部场景、角色与声音均由代码实时生成
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Lobby({
  engine,
  s,
  open,
}: {
  engine: GameEngine;
  s: GameSnapshot;
  open: (modal: "map" | "help" | "weapons") => void;
}) {
  const [team, setTeam] = useState<Team>("CT"),
    [primary, setPrimary] = useState<WeaponId>("m4a4"),
    [secondary, setSecondary] = useState<WeaponId>("usp"),
    [pistolStart, setPistolStart] = useState(false);
  const chooseTeam = (t: Team) => {
    setTeam(t);
    setPrimary(t === "T" ? "ak47" : "m4a4");
    setSecondary(t === "T" ? "glock" : "usp");
  };
  const config: MatchConfig = { team, primary, secondary, pistolStart };
  return (
    <div className="lobby">
      <div className="lobby-shade" />
      <div className="film-grain" />
      <header className="lobby-header">
        <a className="brand" href="#" onClick={(e) => e.preventDefault()}>
          <span className="brand-mark">
            <Icon name="crosshair" size={24} />
          </span>
          <span>
            DUST II<span className="brand-sub">PROTOCOL</span>
          </span>
        </a>
        <nav>
          <button className="nav-active">
            战术行动<span>01</span>
          </button>
          <button onClick={() => open("weapons")}>军械库</button>
          <button onClick={() => open("help")}>行动指南</button>
        </nav>
        <div className="header-right">
          <span className="online-label">
            <i />
            系统就绪
          </span>
          <button
            className="icon-button sound-button"
            title="切换声音"
            onClick={engine.toggleAudio}
          >
            <Icon name={s.muted ? "mute" : "volume"} size={18} />
          </button>
        </div>
      </header>
      <div className="lobby-content">
        <section className="hero">
          <div className="mission-tag">
            <span className="status-dot" />
            经典地图 / 战术射击<span className="tag-index">NO. 002</span>
          </div>
          <div className="hero-overline">北非 · 沙漠之城</div>
          <h1>
            DUST<span>II</span>
            <i>®</i>
          </h1>
          <div className="hero-rule" />
          <h2>每条路线，都是战机。</h2>
          <p className="hero-description">
            穿越熟悉的沙漠街巷，参与瞬息万变的 5v5 交锋。
            <br />
            集结你的小队，在下一声枪响前做出决定。
          </p>
          <div className="hero-actions">
            <button
              className="primary-button deploy-button"
              onClick={() => engine.start(config)}
            >
              <Icon name="play" size={17} />
              <span>
                开始行动<small>DEPLOY TO DUST II</small>
              </span>
              <Icon name="arrow" size={23} />
            </button>
            <button className="secondary-button" onClick={() => open("map")}>
              <Icon name="map" size={18} />
              战场概览
              <Icon name="external" size={15} />
            </button>
          </div>
          <div className="hero-footnote">
            <span className="little-key">↵</span> 即刻进入 · 无需下载 ·
            桌面端游玩
          </div>
        </section>
        <aside className="deployment-card">
          <div className="card-topline">
            <span className="eyebrow">MISSION SETUP</span>
            <span className="outlined-tag">5 VS 5</span>
          </div>
          <h3>配置你的行动</h3>
          <p className="card-description">选择阵营与装备，准备部署。</p>
          <div className="field-label">
            <span>01</span>选择阵营
          </div>
          <div className="team-choices">
            <button
              className={`team-choice ct ${team === "CT" ? "selected" : ""}`}
              onClick={() => chooseTeam("CT")}
            >
              <span className="team-symbol">
                <Icon name="shield" size={28} />
              </span>
              <b>反恐精英</b>
              <small>CT · 防守 / 拆弹</small>
              {team === "CT" && (
                <span className="choice-check">
                  <Icon name="check" size={10} />
                </span>
              )}
            </button>
            <button
              className={`team-choice t ${team === "T" ? "selected" : ""}`}
              onClick={() => chooseTeam("T")}
            >
              <span className="team-symbol">
                <Icon name="attack" size={28} />
              </span>
              <b>恐怖分子</b>
              <small>T · 进攻 / 安放</small>
              {team === "T" && (
                <span className="choice-check">
                  <Icon name="check" size={10} />
                </span>
              )}
            </button>
          </div>
          <div className="field-label">
            <span>02</span>初始主武器
            <button onClick={() => open("weapons")}>
              查看全部 <Icon name="external" size={11} />
            </button>
          </div>
          <div
            className={`loadout-choices ${pistolStart ? "disabled-loadout" : ""}`}
          >
            {(["ak47", "m4a4", "awp"] as WeaponId[]).map((id) => (
              <button
                key={id}
                className={primary === id ? "selected" : ""}
                onClick={() => setPrimary(id)}
                disabled={pistolStart}
              >
                <WeaponDrawing id={id} />
                <span>{WEAPONS[id].name}</span>
              </button>
            ))}
          </div>
          <div className="selected-loadout-note">
            {pistolStart
              ? "首回合仅默认手枪，下一回合恢复主武器"
              : WEAPONS[primary].description}
          </div>
          <div className="pistol-toggle">
            <div>
              <b>手枪局开局</b>
              <small>经典第一回合 · 默认手枪 / 25 护甲</small>
            </div>
            <button
              role="switch"
              aria-checked={pistolStart}
              aria-label="手枪局开局"
              className={`switch ${pistolStart ? "on" : ""}`}
              onClick={() => setPistolStart(!pistolStart)}
            >
              <span />
            </button>
          </div>
          <div className="card-bottom">
            <span>
              <i className="status-dot" />1 名玩家 + 9 名 AI
            </span>
            <span>
              本地对局
              <Icon name="shield" size={13} />
            </span>
          </div>
        </aside>
      </div>
      <footer className="lobby-footer">
        <div className="feature-stats">
          <div>
            <strong>
              5<span>v</span>5
            </strong>
            <small>小队战术对抗</small>
          </div>
          <div>
            <strong>08</strong>
            <small>经典核心区域</small>
          </div>
          <div>
            <strong>
              100<span>%</span>
            </strong>
            <small>程序化生成</small>
          </div>
        </div>
        <div className="footer-caption">
          <span>BUILT FOR THE NEXT ROUND.</span>
          <small>
            REACT + THREE.JS <i /> WEBGL 2.0 <i /> V 1.0
          </small>
        </div>
      </footer>
      <div className="scene-coordinate">
        32° 47′ 15″ N &nbsp; 13° 11′ 32″ E<span>DE_DUST2 / 14:32 LOCAL</span>
      </div>
    </div>
  );
}

function HUD({ engine, s }: { engine: GameEngine; s: GameSnapshot }) {
  const hit = s.time - s.hitAt < 0.16,
    kill = s.time - s.killAt < 0.65,
    damaged = s.time - s.damageAt < 0.5;
  const paused = !s.locked;
  const activeBomb = s.bombState === "planted" && s.phase !== "ended";
  return (
    <div className={`hud ${s.scoped ? "is-scoped" : ""}`}>
      <div className="hud-vignette" />
      {damaged && <div className="damage-vignette" />}
      {s.scoped && (
        <div className="scope-mask">
          <div className="scope-circle">
            <i />
            <b />
            <span />
            <em />
          </div>
          <div className="scope-meta">
            AWP · 3×<small>100 m</small>
          </div>
        </div>
      )}
      <section className="radar-panel">
        <div className="radar-heading">
          <span className="status-dot" />
          {s.location}
          <span className="radar-coord">D2</span>
        </div>
        <Minimap engine={engine} />
        <div className="radar-footer">
          <span>
            <i className="friendly-dot" />
            友方
          </span>
          <span>
            <i className="enemy-dot" />
            已发现敌方
          </span>
          <span className="radar-round">
            R{String(s.round).padStart(2, "0")}
          </span>
        </div>
      </section>
      <div className="match-status">
        <div className="score-row">
          <div
            className={`team-score t-score ${s.team === "T" ? "your-team" : ""}`}
          >
            <Icon name="attack" size={22} />
            <div>
              <span>进攻方</span>
              <small>{s.aliveT} 人存活</small>
            </div>
            <b>{String(s.scoreT).padStart(2, "0")}</b>
          </div>
          <div className={`round-clock ${activeBomb ? "bomb-clock" : ""}`}>
            <small>
              {s.phase === "freeze"
                ? "部署阶段"
                : s.phase === "ended"
                  ? "下回合即将开始"
                  : activeBomb
                    ? "C4 已安放"
                    : s.pistolRound
                      ? "手枪局"
                      : "回合进行中"}
            </small>
            <strong>
              {activeBomb ? formatTime(s.bombTimer) : formatTime(s.timer)}
            </strong>
            <span>ROUND {String(s.round).padStart(2, "0")}</span>
          </div>
          <div
            className={`team-score ct-score ${s.team === "CT" ? "your-team" : ""}`}
          >
            <b>{String(s.scoreCT).padStart(2, "0")}</b>
            <div>
              <span>反恐精英</span>
              <small>{s.aliveCT} 人存活</small>
            </div>
            <Icon name="shield" size={22} />
          </div>
        </div>
        <div className="alive-row">
          <div>
            {Array.from({ length: 5 }, (_, i) => (
              <i key={i} className={i < s.aliveT ? "alive t" : ""} />
            ))}
          </div>
          <span>DE_DUST2</span>
          <div>
            {Array.from({ length: 5 }, (_, i) => (
              <i key={i} className={i < s.aliveCT ? "alive ct" : ""} />
            ))}
          </div>
        </div>
      </div>
      <div className="top-right-hud">
        <div className="performance">
          <span className="status-dot" />
          LOCAL SERVER <i />
          {s.fps} FPS<span className="pause-key">ESC</span>
        </div>
        <div className="killfeed">
          {s.killfeed.map((k) => (
            <div
              key={k.id}
              className={`kill-event ${k.player ? "player-kill" : ""}`}
            >
              <b className={k.team === s.team ? "friend" : "enemy"}>
                {k.killer}
              </b>
              <WeaponDrawing id={k.weapon} />
              {k.headshot && <Icon name="crosshair" size={12} />}
              <span className={k.team === s.team ? "enemy" : "friend"}>
                {k.victim}
              </span>
            </div>
          ))}
        </div>
      </div>
      {s.alive && !s.scoped && (
        <div
          className={`crosshair ${hit ? "hit" : ""}`}
          style={{ "--spread": `${5 + s.heat * 10}px` } as React.CSSProperties}
        >
          <i />
          <i />
          <i />
          <i />
          <span />
          {hit && <b>×</b>}
        </div>
      )}
      {s.alive && s.scoped && hit && <div className="scope-hit">×</div>}
      {kill && (
        <div className="kill-confirm">
          <Icon name="skull" size={24} />
          <span>目标已消灭</span>
        </div>
      )}
      <div className="center-messages">
        {s.phase === "freeze" ? (
          <div className="freeze-message">
            <span className="eyebrow">PREPARE FOR DEPLOYMENT</span>
            <h2>{s.pistolRound ? "手枪局" : "准备行动"}</h2>
            <p>
              {s.team === "CT"
                ? "守住 A / B 点，阻止 C4 引爆"
                : "护送 C4，突破防线并安放炸弹"}
            </p>
            <small>
              <kbd>B</kbd> 调整装备 <span>·</span> {Math.ceil(s.timer)} 秒后开始
            </small>
          </div>
        ) : s.phase === "ended" ? (
          <div
            className={`round-result ${s.winner === s.team ? "victory" : ""}`}
          >
            <Icon name={s.winner === "CT" ? "shield" : "attack"} size={38} />
            <span className="eyebrow">
              ROUND {s.winner === s.team ? "WON" : "LOST"}
            </span>
            <h2>{s.winner === "CT" ? "反恐精英" : "恐怖分子"}获胜</h2>
            <p>{s.winReason}</p>
            <small>{Math.ceil(s.timer)} 秒后开始下一回合</small>
          </div>
        ) : null}
        {s.phase === "live" && s.action && s.alive && (
          <div
            className={`interaction ${s.actionProgress > 0 ? "in-progress" : ""}`}
          >
            <Icon name="bomb" size={21} />
            <span>{s.action}</span>
            {s.actionProgress > 0 && (
              <>
                <b>
                  {Math.ceil(
                    (1 - s.actionProgress) * (s.team === "T" ? 3.2 : 5),
                  )}
                  s
                </b>
                <div className="action-track">
                  <i style={{ width: `${s.actionProgress * 100}%` }} />
                </div>
              </>
            )}
          </div>
        )}
        {s.noticeUntil > s.time && s.phase === "live" && (
          <div className="game-notice">{s.notice}</div>
        )}
      </div>
      {!s.alive && s.phase === "live" && (
        <div className="spectator-panel">
          <span className="eyebrow">SPECTATING · 观战中</span>
          <h3>{s.spectating}</h3>
          <div>
            <button
              onClick={() => engine.cycleSpectator(-1)}
              aria-label="上一位队友"
            >
              ←
            </button>
            <span>
              <kbd>E</kbd> 接管队友
            </span>
            <button
              onClick={() => engine.cycleSpectator(1)}
              aria-label="下一位队友"
            >
              →
            </button>
          </div>
        </div>
      )}
      <footer className="combat-footer">
        <section className="vitals-panel">
          <div className="operator-label">
            <Icon name={s.team === "CT" ? "shield" : "attack"} size={13} />
            <span>{s.alive ? "OPERATOR" : `观战 ${s.spectating}`}</span>
            <small>{s.team}</small>
          </div>
          <div className="vital-numbers">
            <div className={s.health < 30 ? "critical" : ""}>
              <Icon name="health" size={21} />
              <strong>{s.health.toString().padStart(3, "0")}</strong>
              <span>生命值</span>
            </div>
            <div>
              <Icon name="shield" size={20} />
              <strong>{s.armor.toString().padStart(3, "0")}</strong>
              <span>护甲</span>
            </div>
          </div>
          <div className="health-track">
            <i style={{ width: `${s.health}%` }} />
          </div>
          {s.hasBomb && (
            <div className="carrying-bomb">
              <Icon name="bomb" size={15} />
              携带 C4
            </div>
          )}
        </section>
        <div className="bottom-controls">
          <span>
            <kbd>WASD</kbd>移动
          </span>
          <span>
            <kbd>R</kbd>换弹
          </span>
          <span>
            <kbd>B</kbd>装备
          </span>
          <span>
            <kbd>TAB</kbd>比分
          </span>
          <span>
            <kbd>ESC</kbd>暂停
          </span>
        </div>
        <section className="ammo-panel">
          <div className="inventory">
            {(["primary", "secondary", "melee"] as const).map((slot, index) => (
              <div
                key={slot}
                className={`inventory-item ${s.slot === slot ? "active" : ""} ${!s.loadout[slot] ? "empty" : ""}`}
              >
                <kbd>{index + 1}</kbd>
                {s.loadout[slot] ? (
                  <>
                    <WeaponDrawing id={s.loadout[slot]!} />
                    <span>{WEAPONS[s.loadout[slot]!].name}</span>
                  </>
                ) : (
                  <span>未装备主武器</span>
                )}
              </div>
            ))}
          </div>
          <div className="active-weapon">
            <div className="weapon-name">
              <span>{WEAPONS[s.weapon].label}</span>
              <b>{WEAPONS[s.weapon].name}</b>
            </div>
            {s.weapon === "knife" ? (
              <strong className="knife-ammo">∞</strong>
            ) : (
              <div className={`ammo-count ${s.ammo < 6 ? "low-ammo" : ""}`}>
                <strong>{s.ammo.toString().padStart(2, "0")}</strong>
                <span>/</span>
                <b>{s.reserve}</b>
              </div>
            )}
          </div>
          {s.reloading > 0 ? (
            <div className="reload-track">
              <span>正在换弹</span>
              <i style={{ width: `${(1 - s.reloading) * 100}%` }} />
            </div>
          ) : (
            <div className="ammo-caption">
              {s.weapon === "awp"
                ? "右键 · 切换瞄准镜"
                : s.weapon === "knife"
                  ? "近战攻击 · 提升移动速度"
                  : "R · 更换弹匣"}
              <span>
                {s.weapon === "knife"
                  ? "MELEE"
                  : s.weapon === "awp"
                    ? "BOLT ACTION"
                    : WEAPONS[s.weapon].automatic
                      ? "FULL AUTO"
                      : "SEMI AUTO"}
              </span>
            </div>
          )}
        </section>
      </footer>
      {s.scoreboard && <Scoreboard s={s} />}
      {paused && (
        <div className="pause-scrim">
          {s.armory ? (
            <Armory engine={engine} s={s} />
          ) : (
            <section className="pause-panel">
              <span className="eyebrow">TACTICAL PAUSE</span>
              <h2>行动已暂停</h2>
              <p>调整呼吸，准备下一次交锋。</p>
              <button className="primary-button" onClick={engine.requestLock}>
                <Icon name="play" size={17} />
                继续行动
                <Icon name="arrow" size={19} />
              </button>
              <button className="secondary-button" onClick={engine.openArmory}>
                <Icon name="target" size={18} />
                军械库
              </button>
              <div className="pause-inline">
                <button onClick={engine.toggleAudio}>
                  <Icon name={s.muted ? "mute" : "volume"} size={17} />
                  {s.muted ? "开启声音" : "关闭声音"}
                </button>
                <button onClick={engine.returnToMenu}>
                  返回主菜单
                  <Icon name="external" size={15} />
                </button>
              </div>
              <div className="pause-controls">
                <span>
                  <kbd>WASD</kbd>移动
                </span>
                <span>
                  <kbd>鼠标</kbd>瞄准
                </span>
                <span>
                  <kbd>E</kbd>安放 / 拆弹
                </span>
                <span>
                  <kbd>1 2 3</kbd>切换武器
                </span>
              </div>
              <p className="mouse-hint">
                继续行动后，鼠标将锁定至游戏窗口。Esc 可随时暂停。
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function Scoreboard({ s }: { s: GameSnapshot }) {
  return (
    <div className="scoreboard-scrim">
      <div className="scoreboard">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">DE_DUST2 · ROUND {s.round}</span>
            <h2>战场情报</h2>
          </div>
          <span className="outlined-tag">5v5</span>
        </div>
        {(["CT", "T"] as Team[]).map((team) => (
          <section
            key={team}
            className={`roster-section ${team === "CT" ? "ct" : "t"}`}
          >
            <div className="roster-title">
              <Icon name={team === "CT" ? "shield" : "attack"} size={19} />
              <b>{team === "CT" ? "反恐精英" : "恐怖分子"}</b>
              <strong>{team === "CT" ? s.scoreCT : s.scoreT}</strong>
            </div>
            <div className="roster-labels">
              <span>玩家</span>
              <span>装备</span>
              <span>生命</span>
              <span>击杀</span>
              <span>阵亡</span>
            </div>
            {s.roster
              .filter((a) => a.team === team)
              .map((a) => (
                <div
                  key={a.id}
                  className={`roster-row ${!a.alive ? "dead" : ""} ${a.controlled ? "is-you" : ""}`}
                >
                  <span>
                    {!a.alive ? (
                      <Icon name="skull" size={13} />
                    ) : (
                      <i className="status-dot" />
                    )}
                    {a.name}
                    {a.controlled && <small>你</small>}
                    {a.bomb && <Icon name="bomb" size={13} />}
                  </span>
                  <WeaponDrawing id={a.weapon} />
                  <span>{a.health}</span>
                  <b>{a.kills}</b>
                  <span>{a.deaths}</span>
                </div>
              ))}
          </section>
        ))}
        <div className="modal-footer">按住 Tab 查看 · 阵亡后 E 接管队友</div>
      </div>
    </div>
  );
}

function Armory({ engine, s }: { engine: GameEngine; s: GameSnapshot }) {
  return (
    <section className="armory-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">FIELD ARMORY</span>
          <h2>为下一次交锋准备</h2>
        </div>
        <span className="outlined-tag">
          {s.pistolRound ? "手枪局" : "自由配装"}
        </span>
      </div>
      <p>
        {engine.canBuy
          ? "每回合前 20 秒可调整装备。选择后立即生效。"
          : s.pistolRound
            ? "本回合仅限默认手枪；下一回合可使用完整装备。"
            : "装备调整时间已结束，下一回合可重新选择。"}
      </p>
      <div className="armory-grid">
        {(["ak47", "m4a4", "awp", "glock", "usp", "deagle"] as WeaponId[]).map(
          (id) => (
            <button
              key={id}
              className={`armory-weapon ${Object.values(s.loadout).includes(id) ? "selected" : ""}`}
              disabled={!engine.canBuy}
              onClick={() => engine.equip(id)}
            >
              <span className="weapon-type">{WEAPONS[id].label}</span>
              <WeaponDrawing id={id} />
              <b>{WEAPONS[id].name}</b>
              <span>{WEAPONS[id].description}</span>
              <div className="weapon-stats">
                <span>伤害 {WEAPONS[id].damage}</span>
                <span>{WEAPONS[id].magazine} 发</span>
              </div>
            </button>
          ),
        )}
      </div>
      {s.noticeUntil > s.time && <p className="armory-notice">{s.notice}</p>}
      <button className="primary-button" onClick={engine.requestLock}>
        返回战场
        <Icon name="arrow" size={19} />
      </button>
    </section>
  );
}
