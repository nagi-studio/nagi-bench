# Sandstone Strike — 5v5 bomb-defusal FPS prototype

React 18 + TypeScript + three.js, no external assets: every model, texture and
sound is generated in code (geometry, canvas textures, Web Audio synthesis).

```bash
npm install
npm run dev        # open the printed URL, click to lock the mouse
npm run typecheck  # tsc --noEmit
npm run sim        # headless bot-vs-bot match in Node (no browser needed)
node --experimental-strip-types scripts/scenarios.ts   # bomb flow scenarios
```

## Map: "Sandstone"

An original desert map with the classic bomb-defusal lane layout:
T spawn → **Long A** (through long doors) → **A site**; T spawn → **mid** →
**mid doors** (two open door leaves + lintel) → CT mid / CT spawn; mid →
**catwalk** → A site; T spawn → **B tunnels** (roofed) → **B site**; mid →
lower tunnels → B tunnels; CT spawn ↔ A (CT ramp) and ↔ B (B doors).

The map is authored as a 2 m cell grid carved by named regions
(`src/game/core/map.ts`). Wall cells are greedily merged into AABBs that are
used for rendering, physics and the navigation grid, so visuals, collision and
AI pathing always agree.

## Controls

| Key | Action |
| --- | --- |
| WASD / Shift / Space | move / walk silently / jump |
| Mouse L / R | fire / AWP scope (2 zoom levels) or knife stab |
| R | reload |
| 1 / 2 / 3, wheel, Q | primary / secondary / knife, last weapon |
| E (hold) | plant C4 (T, in a site) / defuse (CT, at the bomb) |
| B | weapon selection (freeze time + first 15 s) |
| Tab | scoreboard |
| when dead | L/R click cycle teammates, **E take over** that bot |

## Architecture

```
src/game/core/      three.js-free simulation (runs in Node too)
  map.ts            grid map, regions, crates, bombsites, AABB generation
  physics.ts        cylinder-vs-AABB character physics, slab raycasts, LOS
  nav.ts            A* (8-connected, no corner cutting) + string pulling
  weapons.ts        data-driven weapon table + round loadout configs
  hitbox.ts         per-zone hitboxes (head 2x, chest, stomach, arms, legs)
  sim.ts            fixed-tick authoritative game state: entities, firing,
                    recoil/spread, armor, bomb, rounds, visibility, events
  bot.ts            AI state machine (perception → combat → alert/hunt →
                    objective → navigation) incl. plant / guard / retake / defuse
src/game/render/    three.js views: map, humanoid characters, gun models,
                    first-person viewmodel (separate scene), effects
src/game/audio/     Web Audio synthesizer (per-weapon gunshots, reload, steps,
                    scope, hit/kill cues, C4 beeps/plant/defuse/explosion)
src/game/client/    Game: rAF loop, fixed 60 Hz sim stepping with
                    interpolation, input → entity intent, event routing,
                    throttled HUD snapshots (Store → useSyncExternalStore)
src/ui/             React HUD, minimap, buy menu, scoreboard, menus
```

Player and bots drive their entities through the same `InputState` intent,
which is what makes "take over a teammate" trivial and keeps bots on the same
weapon / recoil / physics rules as the player.
