# Desert Strike — 5v5 bomb defusal FPS prototype

React 18 + TypeScript + three.js. No external assets: geometry, textures (canvas), and audio (Web Audio) are all procedural.

```bash
npm install
npm run dev
```

## Architecture

| File | Responsibility |
| --- | --- |
| `src/game/map.ts` | Grid-based map: layout, zones, collision (`moveBody`/`groundHeight`), 3D DDA raycast (bullets + line of sight), A* navigation with string pulling |
| `src/game/weapons.ts` | Data-driven weapon definitions, `WeaponState` (ammo/reload/spread), `Inventory`, hit-zone and armour damage, pistol-round / gun-round loadouts |
| `src/game/agent.ts` | Combatant shared by the player and bots: physics, hitboxes, rig animation |
| `src/game/ai.ts` | Bot FSM (MOVE / HOLD / ENGAGE / CHASE / PLANT / DEFUSE / GET_BOMB / GUARD), perception, aiming, stuck recovery |
| `src/game/game.ts` | Engine: render loop, round state machine, combat, C4, input, spectating/takeover, minimap, HUD snapshot store |
| `src/game/models.ts` | Procedural humanoids, weapon models, first-person view model, canvas textures |
| `src/game/world.ts` | Static scene built from the grid + transient effects |
| `src/game/audio.ts` | Synthesised sound effects |
| `src/ui/*` | React HUD (reads `useSyncExternalStore(game.subscribe, game.getSnapshot)`) |

The simulation runs in `requestAnimationFrame` and never goes through React state. The engine publishes an immutable HUD snapshot about 30 times per second. React sends commands back only through explicit methods (`startMatch`, `requestLock`, `setMinimapCanvas`).
