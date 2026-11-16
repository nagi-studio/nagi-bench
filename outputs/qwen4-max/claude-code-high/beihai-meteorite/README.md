# 陨石雨 · Meteorite Shower

A procedural voxel cinematic (Three.js) adapted from the Zhang Beihai / meteorite-assassination
arc of *The Three-Body Problem II: The Dark Forest*. Total runtime **345 s** (≤ 360 s hard limit),
including opening and closing titles.

Everything — figures, sets, props, planet, textures, particles, and **all audio** — is generated
in code at runtime. No external assets, no CDN, no audio files, no synthesized human voice.

## Run

```bash
bun run build      # produces dist/index.html + dist/assets/ (standard Vite output)
bun run preview    # serve the build
bun run dev        # dev server
bun run verify     # headless timeline / cue / framing / determinism harness
bun test/render.ts # software "clay render" of key frames to test/frames/*.png
```

Open `dist/index.html` (via a static server) and press ▶. Space = play/pause, ←/→ = ±5 s seek.

## Editorial structure (26 shots)

The source is treated as narrative material, not a screenplay. It is compressed into three
movements plus a cold open and coda, bookended by the meteorite motif:

- **Cold open (0–8)** — a meteorite crosses the void; title 《陨石雨》.
- **I · Earth (8–120)** — the collector's hutong museum: warmth, tea, two old soldiers,
  Antarctica, "the Earth is a meteorite", and the purchase paid in full
  *"out of respect for the person I'm giving them to."* Warm tungsten, intimate lenses.
- **II · Making (120–188)** — the CNC workshop and the bare-bulb basement: 36 meteorite
  rounds, then the test shot. The basement gunshot is deafening and strongly reflected;
  the result is unrecognizable gravel — nature will take the blame.
- **III · Space (188–334)** — the sublime reveal (wheel station, elevator, shipyard bones),
  the locator left behind, the wait, the void meditation *"just existing"* (the still center),
  sunset, the group photo, the scoped lock, **thirty silent flashes**, ten seconds of flight,
  *"陨石雨!"* — gas, blood freezing to ice, the flight back — and the cold, calm drift home
  under his father's gaze.
- **Coda (334–345)** — Earth turns; the title returns.

Information is withheld and revealed deliberately: the murder is only legible as a murder in
retrospect; until then the meteorite is wonder, then material, then alibi.

## Visual system

Minecraft-like block language via `@agentbench/voxel-kit`: every character is `createFigure`
(fixed skeleton), identity painted into 64×64 body/clothing sheets (faces, spectacles, collar
tabs, visors are texels — never protruding geometry). Props are `voxelModel` character grids on
`figure.anchors`; Earth/station/debris are merged voxel geometry (`voxelSphere`,
`buildVoxelGeometry`). Cinematic grade: ACES tonemapping, per-act color script
(amber → industrial cold → sublime blue/orange → violent white/red → cold blue), vignette + grain,
letterbox-free framing, scope-reticle overlay for POV shots, timeline-driven fades/title cards.

## Sound (all Web Audio, procedural)

`src/film/audio.ts` registers ~39 factories on `WebAudioCueBus.define`. Physics is respected:

- **Basement gunshot** — noise crack + body sweep through a procedurally generated concrete-room
  impulse response (convolver) with discrete early reflections, followed by a tinnitus ring.
- **Vacuum** — external gunfire/impacts/airlock are **silent**. Only suit-conducted recoil thumps,
  breathing, heartbeat, radio (subtitled) and a subjective sub-tone are audible.
- Score beds, hutong/room/workshop/basement/space ambience, CNC spindle, pliers, glue, magazine
  actions, thruster (conducted), locator/radio beeps — all synthesized from oscillators/noise.

## Speech

No voice is synthesized. Every line lives in one exported manifest
(`src/film/manifest.ts`, `voiceCues: VoiceCue[]`) with exactly the seven fields
`id, kind, speaker, text, delivery, start, end`; subtitles render bottom-center as
`【说话者】文本` via the player's controls, ready for per-id dubbing later.

## Verification

The sandbox is fully offline (no browser binary, network egress denied), so a literal in-browser
Play click is not possible here. Instead:

- `test/verify.ts` drives the **real** `CinematicPlayer` + shot lifecycle + scene graph with a
  manual frame pump: play advances, pause freezes, seek reconciles sets/props, voice cues sync,
  re-seek is bit-identical (determinism), a full 345 s playthrough throws nothing, and a scene
  audit confirms no NaN transforms, no black frames, and lit visible subjects at 11 key moments.
- `test/render.ts` software-rasterizes the actual scene graph + camera matrices to PNG
  (`test/frames/`) so composition, scale, pose and framing were visually inspected and corrected
  (it is a clay preview, not the final textured/tonemapped look).

`bun run build` and `tsc --noEmit` both pass clean.