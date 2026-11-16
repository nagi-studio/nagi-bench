# 陨石雨 · Meteorite Shower

A procedural voxel cinematic adapted from the Zhang Beihai meteorite-assassination
passage of *The Three-Body Problem II: The Dark Forest*. Built with **Three.js**,
the AgentBench **cinematic-player** runtime and **voxel-kit**, and **Bun / Vite**.
Every model, texture, particle and sound is generated in code at runtime — no
external assets, no audio files, no CDN.

**Runtime: 352 s (5 min 52 s)** — under the 360 s hard limit, titles and credits included.

## Run

```bash
bun run build      # produces dist/ (standard Vite output)
bun run preview    # serve dist/ locally
# or: bun run dev
```

Open the served page and click **播放影片** (or press Space). Audio unlocks on that
gesture. Space = play/pause, ←/→ = seek ±5 s. The transport bar offers play/pause,
seek, volume and fullscreen; subtitles render bottom-center as `【说话者】文本`.

## Adaptation & direction

The source is treated as narrative material, not a script. The film is a linear
escalation in five movements, compressing and re-ordering deliberately:

1. **The collector (warm).** A hutong cabinet-room of stones. The thematic seed is
   planted here: *"Earth is itself a meteorite; the tea in this cup is meteorite."*
   The sale ends on the line that recontextualises everything — *"就这个价，就算表示
   我对要送的人的尊重吧。"* Warm tungsten, dust motes, a man happy in his small world.
2. **The bridge (era).** Dusk city + the space-elevator ribbon; the 增援未来 program
   and the "不能出海的舰队政委" request, in a brief office insert.
3. **The workshop (procedure).** CNC machining of three iron meteorites into 36
   slugs. Cool fluorescent light, sparks, ritual precision.
4. **The basement (test).** Caseless rounds re-tipped with meteorite; the single
   deafening test shot with concrete-room convolution reverb and tinnitus; the
   shattered slugs in the palm read as *natural* meteorite.
5. **Space (the kill).** The void monologue and the father beat; sunset at Earth's
   limb; the group photograph; visors clear; the three targets front-centre. Glove
   off, magnetic scope mount, thirty silent trigger pulls. **In vacuum the gunfire
   is silent** — only suit-conducted thumps, breathing and heartbeat; the muzzle
   flashes read as a firefly. A ten-second bullet flight carries the moral calculus.
   Impacts are white gas jets and blood-ice crystals; the lip-read title drop
   **「陨石雨！」**; thrusters drag the struck back. Coda: he accelerates toward
   Base One, cold and calm, at peace under his father's gaze.

Recurring motif: stone → slug → bullet → ice → stone. Warm interior vs. cold void;
the loudest sound (basement shot) against the silent thirty (space).

## Speech manifest

All voiced content lives in one exported manifest, `src/film/voice.ts`
(`voiceCues: VoiceCue[]`), each entry carrying exactly
`id, kind, speaker, text, delivery, start, end`. Subtitles are driven solely from
it (no voice is synthesised), so lines can be dubbed later by `id`.
Kinds used: `dialogue`, `narration`, `monologue`, `radio`.

## Sound

`src/film/sound.ts` (`soundCues: SoundCue[]`) + `src/audio/design.ts` register 44
Web Audio factories (`src/audio/synth.ts` helpers): computed noise buffers,
procedural convolution impulse responses, oscillators and filters. Ambience,
score, SFX, suit-interior (breath/heartbeat) and radio are separate gain groups.
Vacuum physics is respected: no air-conducted gunfire in space; the basement shot
uses a generated reverb IR for strong early reflections.

## Structure

```
src/
  main.ts               bootstrap: renderer, player, audio, controls, curtain
  film/
    constants.ts        master timeline (352 s), fire schedule, impact time
    context.ts          shared scene / cast / sets / overlays
    shots.ts            33 shots: camera tracks, blocking, performance
    voice.ts            the single speech manifest (subtitles)
    sound.ts            sound cue manifest
    acting.ts           pose composition + hand-prop management
    overlay.ts          title/place cards + scope viewfinder
  world/
    skins.ts            64×64 body/clothing sheets (identity painted, not built)
    cast.ts             createFigure assembly (Zhang, collector, Chang, 30 delegates)
    props.ts            voxelModel props + voxel geometry helpers
    particles.ts        deterministic bursts / trails / dust / sparks
    textures.ts         procedural glow / grain sprites
    sets/               collector, bridge, workshop, basement, space
  audio/                synth helpers + sound design
scripts/
  verify.ts             headless timeline/cue/audio/determinism/framing checks
  verify-ui.ts          headless Play/pause/seek/subtitle wiring checks
  render-frames.ts      SVGRenderer contact-sheet renders for visual inspection
  relink-modules.mjs    makes node_modules writable for Vite's config temp file
frames/                 PNG contact sheet of key frames (inspection evidence)
```

All characters are assembled with `createFigure` (fixed skeleton/proportions);
identity, faces, insignia and visors are texels on the body/clothing sheets.
World geometry uses `buildVoxelGeometry` / `voxelSphere` / `voxelModel` so planets,
stations and props stay in the same block language. Every update is a pure
function of absolute/shot-local time, so seeking reproduces frames exactly.

## Verification performed

- `bun run build` succeeds → standard `dist/index.html` + local `dist/assets/`.
- `scripts/verify.ts`: full 0–352 s sweep (no exceptions, finite cameras), seek
  determinism, cue-range/overlap/7-field validation, key-beat subtitle timing,
  30 suit-conducted shots with no vacuum gunfire, scope/Earth/framing projection,
  all 44 audio factories build+stop, play/pause/seek state machine. **All pass.**
- `scripts/verify-ui.ts`: Play click → audio unlock → continuous timeline, seek-bar
  sync, pause, `【说话者】文本` subtitles, title-drop, mid-cue resume, volume. **All pass.**
- `scripts/render-frames.ts`: real Three.js `SVGRenderer` renders of 17 key frames
  (faithful projection + lighting of the actual scene graph) inspected and used to
  fix camera blocking, a black-material bug, particle scale and fill lighting.

**Environment limitation:** this confined workspace has no browser binary and
blocks network egress, so a live GPU browser session (literal Play-click in Chrome)
could not be run. Verification above exercises the real player, shots, cues, audio
factories and presentation wiring headlessly, plus real-scene-graph frame renders;
only the WebGL raster itself is unexercised.
