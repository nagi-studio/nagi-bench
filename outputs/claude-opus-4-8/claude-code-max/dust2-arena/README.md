# Dust II Arena

A from-scratch **5v5 first-person shooter prototype** recreating the core areas of
Dust2, built with **React 18 + TypeScript + three.js**. No external assets: the map,
characters and weapons are procedural geometry, and every sound is synthesized with
the Web Audio API. The only third-party libraries are `three`, `react` and
`react-dom` — pathfinding, physics, the AI state machine, the render loop and the
round/economy logic are all hand-written.

## Run

```bash
bun install
bun run dev      # http://localhost:5173  — click the arena to lock the mouse
```

Build a static bundle with `bun run build` (output in `dist/`). A prebuilt,
fully self-contained single file is also included as `dust2-arena.html`.

## Controls

| Action | Key |
| --- | --- |
| Move / Jump / Walk | `WASD` / `Space` / `Shift` |
| Fire / Scope (AWP) / Reload | `Mouse1` / `Mouse2` / `R` |
| Primary / Secondary / Knife | `1` / `2` / `3` (or wheel) |
| Swap primary ⇄ AWP | `B` |
| Plant / Defuse / Pick up C4 | hold `E` |
| (dead) Switch spectated teammate | `Mouse1` / `A` / `D` |
| (dead) Take control of teammate | `F` / `Space` |

## What it includes

- **Map** — T / CT spawns, A Long, A site, Mid (with passable doors), Catwalk,
  B tunnels and B site, laid out on a connected tile grid with full wall + crate
  collision.
- **Characters** — box-built humanoids (separate head, torso, arms, legs), CT blue
  vs T tan, in a weapon-holding pose.
- **Weapons** — AK-47, M4A4, AWP (right-click scope), Glock / USP / Desert Eagle,
  and a knife, each with distinct damage, recoil, spread, magazine and reload.
  Hitscan with per-zone hitboxes (head = 2× body) and armor mitigation.
- **Rounds** — pistol-round opening, then rifle buys; C4 carry / drop / plant /
  defuse and full round resolution (elimination, detonation, defuse, time).
- **AI** — 9 bots navigate with grid A*, spot enemies through line-of-sight, fight,
  and push the plant / rotate to defuse.
- **Death spectating** — when you die you watch a living teammate in first person,
  cycle between teammates, and can take control of one (it stops being AI-driven).
- **HUD** — dynamic crosshair, health / armor, ammo, killfeed, round + bomb timers,
  and a live Dust2 minimap. Procedural audio for guns, reloads, footsteps, scope,
  hits, C4 and kills.

## Layout

```
src/
  main.tsx, App.tsx, styles.css
  components/   GameCanvas, Hud, Minimap, Menu
  engine/
    grid.ts dust2.ts navmesh.ts collision.ts   # map + spatial systems
    weapons.ts combat.ts                        # weapon data + hitboxes
    world.ts ai.ts player.ts input.ts           # simulation + control
    scene.ts effects.ts entities/               # three.js geometry
    audio.ts store.ts constants.ts types.ts     # sound, HUD bridge, config
```
