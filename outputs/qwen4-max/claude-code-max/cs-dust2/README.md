# DUST2 — 5v5 Tactical FPS Prototype

A from-scratch browser first-person shooter recreating the core areas of **Dust2** as a
**5v5** match (1 human + 4 bot teammates vs 5 bot enemies). Built with **React 18 +
TypeScript + three.js**. **Zero external assets** — the map, characters, weapons and
sounds are all generated procedurally in code.

## Run it

```bash
npm install
npm run dev      # open the printed URL, pick a side, click DEPLOY, click the screen to lock the mouse
```

```bash
npm run build    # type-check (tsc --noEmit) + production bundle (vite build)
npm test         # headless verification suite (no browser / no npm deps required)
```

> Runtime dependencies are only `three`, `react`, `react-dom`. Pathfinding, physics,
> the AI state machine, the render loop and the round/C4 logic are all hand-written —
> no game engine.

## Controls

| Action | Input |
| --- | --- |
| Move / Jump / Walk | `WASD` / `Space` / `Shift` |
| Look | Mouse (pointer lock) |
| Fire / Scope (AWP) | Left click / Right click |
| Reload / Switch weapons / Quick swap | `R` / `1` `2` `3` / `Q` or wheel |
| Plant / Defuse / Pick up C4 | hold `E` |
| Buy menu (freeze time) | `B` |
| Scoreboard | hold `Tab` |
| Spectate: switch teammate / take control | `[` `]` / `Enter` or click |

## What's implemented

- **Map** — T spawn, CT spawn, Long A, A site, Mid Doors (walkable gap + bullet-penetrable
  wood), Catwalk/Short, B tunnels (upper + lower), B site, all connected in the real
  Dust2 topology. Walls/crates are solid AABBs; players and bots cannot pass through.
- **Characters** — procedural humanoids with independent head, torso, two arms and two
  legs (no capsule "pillars"), distinct CT (blue/helmet) vs T (tan/headwrap) silhouettes,
  gun-holding pose, walk/death animation.
- **Weapons** — data-driven table: AK-47 (high damage, heavy recoil), M4A4 (faster, softer),
  AWP (one-shot body, right-click 3D zoom + 2D scope mask), Glock/USP/Deagle, knife.
  First-person viewmodels with bob/sway/recoil/reload. Slot switching.
- **Hitboxes** — head / chest / stomach / arm / leg with per-region multipliers;
  **headshot = 2× body**; armor absorption with per-weapon penetration.
- **Pistol round** — round 1 gives everyone their default pistol only, no primary.
- **C4 & rounds** — bomb assigned to a T, drops on death and can be recovered, plant in
  A/B, countdown, defuse (kit faster), win by elimination / explosion / defuse / time.
  First to 5 rounds. Economy + buy menu.
- **AI** — A* over a collision-verified waypoint graph, wall-aware vision, burst fire with
  reaction/accuracy modelling, route-based attacking, planting, rotating and defusing,
  bomb retrieval, stuck recovery.
- **HUD** — dynamic crosshair, health/armor, live ammo panel, killfeed, round/score/timer,
  minimap radar (self/team/spotted enemies/C4), buy menu, scoreboard, spectate bar,
  scope overlay, round/match banners.
- **Audio** — fully synthesized via Web Audio (distinct gunshots, reload, footsteps, scope,
  hit/headshot/kill, plant/defuse/explosion, bomb beeps, round cues) with positional panning.

## Architecture

```
src/
  game/
    core/        # pure TypeScript simulation — ZERO external imports, runs in Node
      types.ts        shared data contracts
      config.ts       tuning constants
      vecmath.ts      vector math + ray/AABB
      map.ts          Dust2 layout, wall generation, spatial hash, nav graph + A*, raycast
      physics.ts      AABB movement, step-up, gravity, ground support, separation
      weapons.ts      weapon table + damage/armor math
      combat.ts       humanoid hitboxes + hitscan + spread
      entities.ts     entity factory, loadouts, respawn
      ai.ts           bot finite state machine
      round.ts        economy + bot auto-buy
      core.ts         GameCore: fixed-step update, input, shooting, C4, rounds, snapshot
    render/      # three.js presentation
      textures.ts     procedural canvas textures
      character.ts    humanoid rig builder + animation
      viewmodel.ts    first-person weapon models
      effects.ts      tracers/impacts/muzzle/explosion/bomb visuals
      renderer.ts     scene, lights, map meshes, camera, fixed-step render loop
      input.ts        pointer lock + keyboard/mouse
    audio.ts     # Web Audio synthesis (event-driven)
  components/    # React HUD (hyperscript .ts, see note)
  store.ts       # engine→React bridge (useSyncExternalStore)
  App.ts main.ts styles.css
```

**Three-clock synchronization.** The simulation advances on a **fixed 60 Hz timestep**
(`GameCore.update`), the **render loop** (`requestAnimationFrame`) accumulates real time and
steps the core, then drains an **event queue** to drive three.js effects and Web Audio.
React is decoupled: the loop publishes an immutable **HUD snapshot at 20 Hz** through a
`useSyncExternalStore` store, so UI re-renders never block the sim or the GPU.

> **UI note:** React components are written with a typed `createElement` hyperscript helper
> (`components/h.ts`) in `.ts` files rather than JSX. This is ordinary React 18 + TypeScript
> and runs identically under Vite; it also lets the *entire* codebase be type-stripped and
> executed by Node directly, which is how the headless test suite verifies the UI.

## Testing (headless, no browser needed)

The core has no external imports, so Node's native TypeScript type-stripping runs it directly:

```bash
npm run test:map     # map connectivity, flood-fill, A* routes, door-gap passability
npm run test:core    # damage math, physics, C4 lifecycle, pistol round, full bot matches
npm run test:ui      # every HUD component executed against live snapshots (React stub)
npm run test:render  # character/viewmodel/effects/renderer sync path (three.js stub)
```

These assert, among other things: all required areas reachable, no wall leaks, headshot = 2×,
AWP one-shot, plant/defuse/explosion/drop/pickup, and multi-round autonomous bot matches with
**no NaN positions, no out-of-bounds entities, and no permanently stuck bots**.
