import { useEffect, useRef, useState } from "react";
import { GameEngine } from "./game/engine";
import { WEAPONS } from "./game/weapons";
import { walkGrid, cellPos, CELL, COLS, ROWS, OBSTACLES } from "./game/map";
import type { Settings, Snapshot, Team, WeaponId } from "./game/types";

function Icon({
  name,
  size = 18,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </>
    ),
    cross: (
      <>
        <path d="M12 2v5m0 10v5M2 12h5m10 0h5" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    swords: (
      <>
        <path d="m4 3 9 8-2 3L3 5V3zm16 0-9 8 2 3 8-9V3M7 15l-4 6m0-7 6 5m8-4 4 6m0-7-6 5" />
      </>
    ),
    sound: (
      <>
        <path d="M4 9h4l5-4v14l-5-4H4zm13-2c3 3 3 7 0 10m3-13c5 5 5 11 0 16" />
      </>
    ),
    mute: (
      <>
        <path d="M4 9h4l5-4v14l-5-4H4m13 0 6-6m-6 0 6 6" />
      </>
    ),
    heart: (
      <>
        <path d="M21 8c0 6-9 12-9 12S3 14 3 8c0-6 9-6 9-1 0-5 9-5 9 1Z" />
      </>
    ),
    bomb: (
      <>
        <circle cx="11" cy="14" r="7" />
        <path d="m14 7 3-3 4 1m-4-4v3m4-3-1 3M7 13l2-2" />
      </>
    ),
    skull: (
      <>
        <path d="M5 13c-5-13 19-13 14 0l-2 3v4H7v-4z" />
        <circle cx="8" cy="11" r="1" />
        <circle cx="16" cy="11" r="1" />
        <path d="m11 15 1-2 1 2m-3 3v2m4-2v2" />
      </>
    ),
    chevron: <path d="m8 5 7 7-7 7" />,
    close: <path d="m5 5 14 14M5 19 19 5" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    expand: <path d="M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6" />,
    play: <path d="m9 4 11 8-11 8Z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6h4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10v1" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name] || paths.cross}
    </svg>
  );
}
function WeaponArt({
  id,
  className = "",
}: {
  id: WeaponId;
  className?: string;
}) {
  const pistol = ["glock", "usp", "deagle"].includes(id);
  return (
    <svg
      className={`weapon-art ${className}`}
      viewBox="0 0 240 88"
      fill="currentColor"
      aria-hidden="true"
    >
      {id === "knife" ? (
        <>
          <path d="M25 41h72v15H25zm75-7 114-9-18 25-96 6z" />
          <path d="M91 28h9v40h-9z" />
        </>
      ) : pistol ? (
        <>
          <path d="M63 24h102v23H95l-5 32H65l8-35H63z" />
          <path d="M98 45h35v15H94v-5h31v-7z" />
          {id === "usp" && <path d="M165 29h40v12h-40z" />}
        </>
      ) : (
        <>
          <path
            d={
              id === "ak47"
                ? "M14 32h38l14-9h75v10h65v9h-63l-5 12h-37l-8 25H76l7-26H59l-7-9H14z"
                : id === "awp"
                  ? "M15 38h52l9-10h71l10 7h65v6h-65l-7 13h-45l-8 21H79l6-21H58L15 60z"
                  : "M14 33h39V23h14v10h80v-8h10v9h55v8h-57l-12 10h-41l-7 26H78l6-26H61l-9-9H14z"
            }
          />
          <path
            d={
              id === "ak47"
                ? "m112 52 3 23 21 8 7-8-14-6-2-17z"
                : "m111 52-2 20h19V52z"
            }
          />
          {id === "awp" && (
            <>
              <path d="M92 17h62v10H92zM104 24h6v11h-6m30-11h6v11h-6" />
              <path d="m175 40 14 31h5l-12-31z" />
            </>
          )}
          {id === "ak47" && <path d="M192 23h5v12h-5z" />}
        </>
      )}
    </svg>
  );
}
const mapCells = walkGrid.flatMap((w, i) => (w ? [cellPos(i)] : []));
let boundary = "";
for (let i = 0; i < walkGrid.length; i++)
  if (walkGrid[i]) {
    const p = cellPos(i),
      x = p.x - 1,
      z = p.z - 1,
      c = i % COLS,
      r = Math.floor(i / COLS);
    if (r === 0 || !walkGrid[i - COLS]) boundary += `M${x},${z}h2`;
    if (r === ROWS - 1 || !walkGrid[i + COLS]) boundary += `M${x},${z + 2}h2`;
    if (c === 0 || !walkGrid[i - 1]) boundary += `M${x},${z}v2`;
    if (c === COLS - 1 || !walkGrid[i + 1]) boundary += `M${x + 2},${z}v2`;
  }
function MiniMap({ s, menu = false }: { s: Snapshot | null; menu?: boolean }) {
  const self = s?.actors.find((a) => a.id === s.playerId);
  return (
    <svg
      className={`minimap ${menu ? "menu-map" : ""}`}
      viewBox="-45 -35 90 77"
      aria-label="Dust II tactical minimap"
    >
      <defs>
        <pattern
          id={menu ? "grid-menu" : "grid-game"}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M8 0H0V8"
            stroke="currentColor"
            strokeWidth=".12"
            fill="none"
            opacity=".12"
          />
        </pattern>
      </defs>
      <rect
        x="-45"
        y="-35"
        width="90"
        height="77"
        fill={`url(#${menu ? "grid-menu" : "grid-game"})`}
      />
      <g fill="#7f8374" opacity=".38">
        {mapCells.map((p, i) => (
          <rect key={i} x={p.x - 1} y={p.z - 1} width={2.05} height={2.05} />
        ))}
      </g>
      <path
        d={boundary}
        fill="none"
        stroke="#b6b9a6"
        strokeWidth=".48"
        opacity=".7"
      />
      {OBSTACLES.map((o, i) => (
        <rect
          key={i}
          x={o.x}
          y={o.z}
          width={o.w}
          height={o.d}
          fill="#222d28"
          stroke="#9a9d86"
          strokeWidth=".25"
        />
      ))}
      {menu && (
        <>
          <path
            d="M4 29 1 15 15 11 15-11 27-20M4 29-27 25-27-18M4 29 35 25 35-16"
            stroke="#cc995d"
            strokeWidth=".45"
            strokeDasharray="1.2 1.2"
            opacity=".7"
            fill="none"
          />
          <text x="2" y="33" className="map-word">
            T SPAWN
          </text>
          <text x="0" y="-25" className="map-word">
            CT SPAWN
          </text>
          <text x="0" y="-3" className="map-word">
            MID
          </text>
          <text x="35" y="5" className="map-word" transform="rotate(-90 35 5)">
            A LONG
          </text>
          <text
            x="-27"
            y="8"
            className="map-word"
            transform="rotate(-90 -27 8)"
          >
            TUNNELS
          </text>
        </>
      )}
      <g className="map-sites">
        <circle cx="27" cy="-21" r="3.5" />
        <text x="27" y="-19.5">
          A
        </text>
        <circle cx="-29" cy="-19" r="3.5" />
        <text x="-29" y="-17.5">
          B
        </text>
      </g>
      {!menu &&
        s?.actors
          .filter(
            (a) =>
              a.alive && a.id !== s.playerId && (a.team === s.team || a.seen),
          )
          .map((a) => (
            <g key={a.id} transform={`translate(${a.x} ${a.z})`}>
              <circle
                r="1.25"
                fill={a.team === s.team ? "#a9d0d1" : "#f27664"}
                stroke="#18211d"
                strokeWidth=".4"
              />
              {a.team === s.team && (
                <text y=".6" fontSize="1.8" fill="#23302b" textAnchor="middle">
                  {(a.id % 5) + 1}
                </text>
              )}
            </g>
          ))}
      {!menu && self && self.alive && (
        <g
          transform={`translate(${self.x} ${self.z}) rotate(${(-self.yaw * 180) / Math.PI})`}
        >
          <path d="M0 0-5-9a10 10 0 0 1 10 0Z" fill="#efa758" opacity=".2" />
          <path
            d="M0-2.3 1.8 1.8 0 .9-1.8 1.8Z"
            fill="#ffc078"
            stroke="#1d251e"
            strokeWidth=".35"
          />
        </g>
      )}
      {!menu &&
        s &&
        ["carried", "dropped", "planted"].includes(s.bomb.state) && (
          <g transform={`translate(${s.bomb.x} ${s.bomb.z})`}>
            <path
              d="m0-1.6 1.6 1.6-1.6 1.6-1.6-1.6Z"
              fill="#ffd278"
              stroke="#1d251e"
              strokeWidth=".3"
            />
            {s.bomb.state === "planted" && (
              <circle
                r="3"
                fill="none"
                stroke="#ffb45a"
                strokeWidth=".4"
                className="bomb-ping"
              />
            )}
          </g>
        )}
      <text x="39" y="-29" className="map-north">
        N
      </text>
      <path d="m39-27-1 3h2Z" fill="#d1d4be" />
    </svg>
  );
}
const time = (n: number) => {
  const whole = Math.ceil(Math.max(n, 0));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};
const key = (value: string) => <kbd>{value}</kbd>;

export default function App() {
  const host = useRef<HTMLDivElement>(null),
    engine = useRef<GameEngine | null>(null);
  const [s, setSnapshot] = useState<Snapshot | null>(null),
    [error, setError] = useState("");
  const [settings, setSettings] = useState<Settings>({
    team: "T",
    pistol: false,
    primary: "ak47",
    secondary: "glock",
  });
  const [manual, setManual] = useState(false),
    [muted, setMuted] = useState(false),
    [scoreboard, setScoreboard] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    try {
      const game = new GameEngine(host.current, setSnapshot);
      engine.current = game;
      if (import.meta.env.DEV)
        (window as unknown as { __DUST__: GameEngine }).__DUST__ = game;
      return () => {
        game.dispose();
        engine.current = null;
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "WebGL could not start");
    }
  }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Tab") setScoreboard(true);
      if (e.code === "KeyH" && !e.repeat) {
        setManual((x) => !x);
        if (document.pointerLockElement) document.exitPointerLock();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Tab") setScoreboard(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  const isMenu = !s || s.phase === "menu";
  function chooseTeam(team: Team) {
    setSettings({
      ...settings,
      team,
      primary: team === "CT" ? "m4a4" : "ak47",
      secondary: team === "CT" ? "usp" : "glock",
    });
  }
  function toggleSound() {
    const value = !muted;
    setMuted(value);
    if (engine.current) engine.current.audio.muted = value;
  }
  const site = s?.bomb.state === "planted";
  const showInteraction =
    s?.alive &&
    s.phase === "playing" &&
    ((s.carrier && ["A SITE", "B SITE"].includes(s.location)) ||
      (s.team === "CT" &&
        site &&
        Math.hypot(
          (s.actors.find((a) => a.id === s.playerId)?.x || 0) - s.bomb.x,
          (s.actors.find((a) => a.id === s.playerId)?.z || 0) - s.bomb.z,
        ) < 2));
  return (
    <div className={`app ${isMenu ? "is-menu" : "in-game"}`}>
      <div ref={host} className="game-canvas" />
      {isMenu ? (
        <>
          <div className="menu-shade" />
          <div className="film-grain" />
          <header className="masthead">
            <a href="/" className="brand" aria-label="Dust II home">
              <span className="brand-mark">
                <i />
                <i />
                <i />
              </span>
              <span>
                DUST<span className="brand-ii">II</span>
                <small>TACTICAL PLAYGROUND</small>
              </span>
            </a>
            <nav>
              <button className="nav-active" onClick={() => setManual(false)}>
                THE EXPERIENCE
              </button>
              <button onClick={() => setManual(true)}>
                FIELD MANUAL <span>↗</span>
              </button>
            </nav>
            <div className="header-actions">
              <span className="local-status">
                <i /> SYSTEM ONLINE
              </span>
              <button
                className="icon-button"
                aria-label={muted ? "Unmute audio" : "Mute audio"}
                onClick={toggleSound}
              >
                <Icon name={muted ? "mute" : "sound"} />
              </button>
              <button
                className="icon-button fullscreen"
                aria-label="Fullscreen"
                onClick={() =>
                  void document.documentElement.requestFullscreen()
                }
              >
                <Icon name="expand" />
              </button>
            </div>
          </header>
          <main className="menu-main">
            <section className="deploy-panel">
              <div className="eyebrow">
                <span className="small-cross">✣</span> A CLASSIC. REBUILT.{" "}
                <span className="edition">VOL. 01 / NORTH AFRICA</span>
              </div>
              <h1>
                DUST<span>II</span>
                <span className="title-period">.</span>
              </h1>
              <div className="hero-copy">
                <p>Familiar ground. Fresh adrenaline.</p>
                <span>Ten operators. Two bomb sites. Every angle matters.</span>
              </div>
              <div className="loadout-config">
                <div className="config-label">
                  <span>
                    <b>01</b> CHOOSE YOUR SIDE
                  </span>
                  <span>5 VS 5</span>
                </div>
                <div className="team-options">
                  <button
                    className={`team-option ct ${settings.team === "CT" ? "selected" : ""}`}
                    onClick={() => chooseTeam("CT")}
                  >
                    <Icon name="shield" size={26} />
                    <span>
                      COUNTER-TERRORISTS<small>DEFEND & DEFUSE</small>
                    </span>
                    <i className="radio-dot" />
                  </button>
                  <button
                    className={`team-option t ${settings.team === "T" ? "selected" : ""}`}
                    onClick={() => chooseTeam("T")}
                  >
                    <Icon name="swords" size={26} />
                    <span>
                      TERRORISTS<small>ATTACK & PLANT</small>
                    </span>
                    <i className="radio-dot" />
                  </button>
                </div>
                <div className="config-label round-label">
                  <span>
                    <b>02</b> SET YOUR LOADOUT
                  </span>
                  <div className="round-toggle">
                    <button
                      className={!settings.pistol ? "active" : ""}
                      onClick={() =>
                        setSettings({ ...settings, pistol: false })
                      }
                    >
                      STANDARD
                    </button>
                    <button
                      className={settings.pistol ? "active" : ""}
                      onClick={() => setSettings({ ...settings, pistol: true })}
                    >
                      PISTOL ROUND
                    </button>
                  </div>
                </div>
                <div
                  className={`weapon-options ${settings.pistol ? "pistol-options" : ""}`}
                >
                  {(settings.pistol
                    ? [settings.team === "CT" ? "usp" : "glock"]
                    : ["ak47", "m4a4", "awp"]
                  ).map((id) => {
                    const w = WEAPONS[id as WeaponId];
                    return (
                      <button
                        key={id}
                        className={`weapon-option ${settings.primary === id || settings.pistol ? "selected" : ""}`}
                        onClick={() =>
                          !settings.pistol &&
                          setSettings({ ...settings, primary: id as WeaponId })
                        }
                      >
                        <span className="weapon-type">{w.short}</span>
                        <WeaponArt id={id as WeaponId} />
                        <span className="weapon-name">{w.name}</span>
                        <span className="weapon-selected">
                          {settings.primary === id || settings.pistol
                            ? "●"
                            : "○"}
                        </span>
                      </button>
                    );
                  })}
                  {settings.pistol && (
                    <div className="pistol-explainer">
                      <Icon name="cross" size={22} />
                      <div>
                        BACK TO BASICS
                        <span>
                          Default sidearm. No armor.
                          <br />
                          Precision over firepower.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="kit-summary">
                  <span>
                    <Icon name="shield" size={13} />
                    {settings.pistol ? "NO ARMOR" : "100 ARMOR"}
                  </span>
                  <span>
                    <Icon name="bomb" size={13} />
                    {settings.team === "T" ? "C4 EQUIPPED" : "8s DEFUSE"}
                  </span>
                  {!settings.pistol && (
                    <label>
                      SIDEARM{" "}
                      <select
                        aria-label="Sidearm"
                        value={settings.secondary}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            secondary: e.target.value as WeaponId,
                          })
                        }
                      >
                        <option value={settings.team === "T" ? "glock" : "usp"}>
                          {settings.team === "T" ? "Glock-18" : "USP-S"}
                        </option>
                        <option value="deagle">Desert Eagle</option>
                      </select>
                    </label>
                  )}
                </div>
              </div>
              <button
                className="deploy-button"
                disabled={!s || !!error}
                onClick={() => engine.current?.start(settings)}
              >
                <span>
                  <Icon name="play" size={19} /> DEPLOY TO DUST II
                </span>
                <Icon name="arrow" size={23} />
              </button>
              <div className="deploy-subline">
                <span>
                  <i /> SOLO PLAYER + 9 AUTONOMOUS BOTS
                </span>
                <button onClick={() => setManual(true)}>
                  CONTROLS <kbd>H</kbd>
                </button>
              </div>
            </section>
            <aside className="environment-panel">
              <div className="environment-label">
                <span className="live-square" />
                <span>LIVE ENVIRONMENT</span>
                <span className="environment-separator" /> A LONG
              </div>
              <div className="scene-reticle">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="map-card">
                <div className="map-card-top">
                  <span>THE BATTLEGROUND</span>
                  <span>
                    01 <span className="dim">/ 01</span>
                  </span>
                </div>
                <div className="map-title">
                  A place you know.
                  <span>
                    DE_DUST2 <Icon name="globe" size={14} />
                  </span>
                </div>
                <MiniMap menu s={s} />
                <div className="map-legend">
                  <span>
                    <i /> BOMB SITE
                  </span>
                  <span>36°47′ N &nbsp; 03°03′ E</span>
                </div>
              </div>
              <div className="scene-caption">
                <span>WARM STONE. COLD NERVES.</span>
                <span>THE DUST COLLECTION — EST. 2001</span>
              </div>
            </aside>
          </main>
          <footer className="menu-footer">
            <div>
              <span className="footer-index">D2 /</span>
              <span>A TACTICAL FPS EXPERIMENT</span>
            </div>
            <div className="footer-stats">
              <span>
                <b>10</b> OPERATORS
              </span>
              <span>
                <b>02</b> BOMB SITES
              </span>
              <span>
                <b>01</b> OBJECTIVE
              </span>
            </div>
            <span className="footer-build">
              PROCEDURAL WORLD <i /> V.1.0
            </span>
          </footer>
        </>
      ) : (
        s && (
          <>
            <div className="hud-vignette" />
            <div className="hud-top">
              <div className="round-heading">
                DUST II <span>/</span> ROUND {String(s.round).padStart(2, "0")}{" "}
                <span>/</span>{" "}
                {engine.current?.settings.pistol ? "PISTOL" : "BOMB DEFUSAL"}
              </div>
              <div className="match-score">
                <div className="score-team ct-color">
                  <Icon name="shield" size={22} />
                  <div className="alive-pips">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className={i < s.ctAlive ? "live" : ""} />
                    ))}
                  </div>
                  <strong>{s.score.CT}</strong>
                </div>
                <div className={`match-clock ${site ? "planted" : ""}`}>
                  <small>{site ? "C4 PLANTED" : "ROUND TIME"}</small>
                  <span>
                    {site && <Icon name="bomb" size={18} />}{" "}
                    {time(site ? s.bomb.time : s.clock)}
                  </span>
                </div>
                <div className="score-team t-color">
                  <strong>{s.score.T}</strong>
                  <div className="alive-pips">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className={i < s.tAlive ? "live" : ""} />
                    ))}
                  </div>
                  <Icon name="swords" size={22} />
                </div>
              </div>
            </div>
            <div className="radar-panel">
              <div className="location">
                <span className="live-square" />
                {s.location}
                <span>{s.team}</span>
              </div>
              <MiniMap s={s} />
              <div className="radar-bottom">
                <span>
                  YOU <i className="self" />
                </span>
                <span>
                  ALLY <i className="ally" />
                </span>
                <span>
                  ENEMY <i className="enemy" />
                </span>
              </div>
            </div>
            <div className="killfeed">
              {s.kills.map((k) => (
                <div
                  className={k.killer === "You" ? "your-kill" : ""}
                  key={k.id}
                >
                  <span className={k.team === "CT" ? "ct-color" : "t-color"}>
                    {k.killer}
                  </span>
                  <WeaponArt id={k.weapon} />
                  {k.head && <Icon name="cross" size={14} />}
                  <span className={k.team === "CT" ? "t-color" : "ct-color"}>
                    {k.victim}
                  </span>
                </div>
              ))}
            </div>
            {s.scoped && (
              <div className="scope-mask">
                <div className="scope-circle">
                  <div className="scope-h" />
                  <div className="scope-v" />
                  <div className="scope-center" />
                  <span className="scope-range">100 m</span>
                </div>
              </div>
            )}
            {s.alive && !s.scoped && (
              <div
                className="crosshair"
                style={
                  { "--gap": `${5 + s.spread * 160}px` } as React.CSSProperties
                }
              >
                <i />
                <i />
                <i />
                <i />
                <b />
              </div>
            )}
            {s.hit > 0 && (
              <div className={`hitmarker ${s.headshot ? "headshot" : ""}`}>
                <i />
                <i />
                <i />
                <i />
              </div>
            )}
            {s.hurt > 0 && (
              <div className="hurt-overlay" style={{ opacity: s.hurt * 1.6 }} />
            )}
            {s.carrier && (
              <div className="carry-badge">
                <Icon name="bomb" size={16} /> YOU HAVE THE C4{" "}
                <span>HOLD E AT A / B TO PLANT</span>
              </div>
            )}
            {(s.action > 0 || showInteraction) && (
              <div className="interaction">
                <kbd>E</kbd>
                <div>
                  <span>
                    {s.actionLabel ||
                      (s.team === "T"
                        ? "HOLD TO PLANT C4"
                        : "HOLD TO DEFUSE C4")}
                  </span>
                  <div className="interaction-track">
                    <i style={{ width: `${s.bomb.progress * 100}%` }} />
                  </div>
                </div>
              </div>
            )}
            {s.notice && s.alive && s.phase !== "ended" && (
              <div className="game-notice">
                <Icon name="info" size={15} />
                {s.notice}
              </div>
            )}
            <div className="hud-bottom">
              <div className="vitals">
                <div className={`health ${s.hp < 30 ? "critical" : ""}`}>
                  <span className="health-plus">+</span>
                  <strong>{s.hp}</strong>
                  <div>
                    <span>HEALTH</span>
                    <div className="vital-bar">
                      <i style={{ width: `${s.hp}%` }} />
                    </div>
                  </div>
                </div>
                <div className="armor">
                  <Icon name="shield" size={23} />
                  <strong>{s.armor}</strong>
                  <span>ARMOR</span>
                </div>
              </div>
              <div className="bottom-mid">
                <span>
                  {key("W")}
                  {key("A")}
                  {key("S")}
                  {key("D")} MOVE <span className="control-sep" /> {key("R")}{" "}
                  RELOAD <span className="control-sep" /> {key("TAB")} ROSTER
                </span>
                <small>
                  <i /> {s.fps} FPS <span>/</span> LOCAL SESSION
                </small>
              </div>
              <div className="ammo-panel">
                <div className="weapon-slots">
                  {[1, 2, 3].map((n) => {
                    const id = s.guns.find((id) => WEAPONS[id].slot === n);
                    return (
                      <div key={n} className={s.slot === n ? "equipped" : ""}>
                        <kbd>{n}</kbd>
                        {id ? <WeaponArt id={id} /> : <span>—</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="ammo-main">
                  <div className="equipped-name">
                    <strong>{WEAPONS[s.weapon].name}</strong>
                    <span>
                      {s.reload ? "RELOADING…" : WEAPONS[s.weapon].short}
                    </span>
                  </div>
                  <div className={`ammo-numbers ${s.ammo < 6 ? "low" : ""}`}>
                    {s.weapon === "knife" ? (
                      <Icon name="swords" size={32} />
                    ) : (
                      <>
                        <strong>{String(s.ammo).padStart(2, "0")}</strong>
                        <span>/ {s.reserve}</span>
                      </>
                    )}
                  </div>
                </div>
                {s.reload > 0 && (
                  <div className="reload-track">
                    <i style={{ width: `${s.reload * 100}%` }} />
                  </div>
                )}
              </div>
            </div>
            {!s.alive && s.phase === "playing" && (
              <div className="death-panel">
                <span>OPERATOR DOWN</span>
                <h2>Stay in the fight.</h2>
                <p>
                  {s.actors.some((a) => a.team === s.team && a.alive)
                    ? "Take control of a surviving teammate."
                    : "Your squad has been eliminated."}
                </p>
                {s.actors.some((a) => a.team === s.team && a.alive) && (
                  <button onClick={() => engine.current?.takeover()}>
                    <kbd>F</kbd> TAKE OVER TEAMMATE <Icon name="arrow" />
                  </button>
                )}
              </div>
            )}
            {s.phase === "ended" && (
              <div
                className={`round-result ${s.winner === s.team ? "victory" : "defeat"}`}
              >
                <Icon
                  name={s.winner === "CT" ? "shield" : "swords"}
                  size={36}
                />
                <span>{s.winner === s.team ? "ROUND WON" : "ROUND LOST"}</span>
                <h2>
                  {s.winner === "CT"
                    ? "Counter-terrorists win."
                    : "Terrorists win."}
                </h2>
                <p>{s.reason}</p>
                <small>NEXT ROUND IN {Math.ceil(s.endTime)}s</small>
              </div>
            )}
            {scoreboard && (
              <div className="scoreboard">
                <div className="scoreboard-title">
                  DUST II <span>ROUND {s.round} · 5v5</span>
                </div>
                {(["CT", "T"] as Team[]).map((team) => (
                  <section key={team}>
                    <h3 className={team === "CT" ? "ct-color" : "t-color"}>
                      {team === "CT" ? "COUNTER-TERRORISTS" : "TERRORISTS"}{" "}
                      <span>{s.score[team]}</span>
                    </h3>
                    <div className="roster-label">
                      <span>OPERATOR</span>
                      <span>HP</span>
                      <span>K</span>
                      <span>D</span>
                    </div>
                    {s.actors
                      .filter((a) => a.team === team)
                      .map((a) => (
                        <div
                          key={a.id}
                          className={`roster-row ${a.id === s.playerId ? "is-you" : ""} ${!a.alive ? "is-dead" : ""}`}
                        >
                          <span>
                            {!a.alive ? (
                              <Icon name="skull" size={15} />
                            ) : (
                              <i className="roster-dot" />
                            )}
                            {a.name}
                            {a.id !== s.playerId && <small>BOT</small>}
                            {s.bomb.carrier === a.id && (
                              <Icon name="bomb" size={14} />
                            )}
                          </span>
                          <span>{a.alive ? a.hp : "—"}</span>
                          <span>{a.kills}</span>
                          <span>{a.deaths}</span>
                        </div>
                      ))}
                  </section>
                ))}
              </div>
            )}
            {!s.locked && !manual && (
              <div className="pause-overlay">
                <div className="pause-card">
                  <span className="eyebrow">DUST II / SESSION PAUSED</span>
                  <h2>Catch your breath.</h2>
                  <p>Your squad will be here when you’re ready.</p>
                  <button
                    className="deploy-button"
                    onClick={() => engine.current?.lock()}
                  >
                    <span>
                      <Icon name="play" /> RESUME OPERATION
                    </span>
                    <Icon name="arrow" />
                  </button>
                  <div className="pause-actions">
                    <button onClick={() => setManual(true)}>
                      FIELD MANUAL
                    </button>
                    <button onClick={() => engine.current?.menu()}>
                      RETURN TO MENU
                    </button>
                  </div>
                  <small>
                    Mouse is captured during play. Press Esc to pause.
                  </small>
                </div>
              </div>
            )}
          </>
        )
      )}
      {manual && (
        <div className="manual-overlay">
          <section className="manual-card">
            <div className="manual-heading">
              <span className="eyebrow">KNOW YOUR WAY AROUND</span>
              <button
                className="icon-button"
                aria-label="Close field manual"
                onClick={() => setManual(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <h2>
              Field manual<span>.</span>
            </h2>
            <p>One life. One objective. Make it count.</p>
            <div className="manual-grid">
              <div>
                <h3>MOVE & LOOK</h3>
                <p>
                  <span>
                    {key("W")}
                    {key("A")}
                    {key("S")}
                    {key("D")}
                  </span>{" "}
                  Move
                </p>
                <p>
                  <span>{key("MOUSE")}</span> Look / aim
                </p>
                <p>
                  <span>{key("SPACE")}</span> Jump
                </p>
                <p>
                  <span>{key("SHIFT")}</span> Walk quietly
                </p>
              </div>
              <div>
                <h3>FIGHT & INTERACT</h3>
                <p>
                  <span>
                    {key("LMB")} / {key("RMB")}
                  </span>{" "}
                  Fire / AWP scope
                </p>
                <p>
                  <span>
                    {key("1")}
                    {key("2")}
                    {key("3")}
                  </span>{" "}
                  Rifle / pistol / knife
                </p>
                <p>
                  <span>
                    {key("R")} / {key("G")}
                  </span>{" "}
                  Reload / drop C4
                </p>
                <p>
                  <span>{key("E")} HOLD</span> Plant / defuse
                </p>
              </div>
            </div>
            <div className="manual-objectives">
              <div>
                <Icon name="swords" />
                <p>
                  <strong>TERRORISTS</strong>Escort the C4 to A or B. Hold E for
                  3.2 seconds to plant. Defend it for 40 seconds, or eliminate
                  the defenders.
                </p>
              </div>
              <div>
                <Icon name="shield" />
                <p>
                  <strong>COUNTER-TERRORISTS</strong>Defend both sites.
                  Eliminate the attackers before they plant, or hold E near the
                  C4 for 8 seconds to defuse.
                </p>
              </div>
            </div>
            <div className="manual-bottom">
              <span>{key("F")} Take over a living ally after death</span>
              <span>{key("TAB")} Team roster</span>
              <span>{key("ESC")} Pause</span>
            </div>
            <button className="manual-done" onClick={() => setManual(false)}>
              GOT IT. LET’S PLAY. <Icon name="arrow" />
            </button>
          </section>
        </div>
      )}
      {error && (
        <div className="error-card">
          <h2>WebGL couldn’t start</h2>
          <p>{error}</p>
          <p>Use a desktop browser with hardware acceleration enabled.</p>
        </div>
      )}
    </div>
  );
}
