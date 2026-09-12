# 增援未来 · REINFORCE THE FUTURE

A programmatic 3D voxel film built with **Three.js**, the **@agentbench/cinematic-player**
runtime and the **@agentbench/voxel-kit** block-figure kit — an adaptation of the
章北海 chapter (meteorite → bullet → assassination → hibernation).

**Duration: 348 s (≤ 360 s hard limit).**

## Run / build

```bash
bun run build      # standard Vite build → dist/index.html + dist/assets/
bun run dev        # local dev server
```

Open `dist/index.html` (or the preview of `dist/`). Click ▶ to play. The
transport bar supports pause, seeking, volume and fullscreen; subtitles are
rendered bottom-center in the fixed `【说话者】文本` form, driven directly by
the voice-cue manifest.

## Structure

| Act | Time | Chapter |
| --- | --- | --- |
| 序章 · 虚空 | 0–30 | a lone figure floats; the title |
| 壹 · 陨石 | 30–152 | the hutong courtyard, the collector, the deal, the night call |
| 贰 · 子弹 | 152–233.5 | the CNC workshop, 36 cylinders, the basement, the test shot |
| 叁 · 虚空 | 233.5–337.5 | waiting at Yellow River station, the group photo, thirty rounds, five hits |
| 肆 · 未来 | 337.5–348 | return to Base One, the hibernation pod, the end card |

The film is a **temperature arc**: warm lamplight → cold workshop → black
basement (the loudest sound of the film) → the absolute silence of vacuum
(the longest silence of the film).

## Key files

- `src/film/voice.ts` — the **complete voice-cue manifest** (`VoiceCue[]`, the
  seven fixed fields `id / kind / speaker / text / delivery / start / end`);
  subtitles are driven by this list and nothing else.
- `src/film/sfx.ts` — the sound-cue manifest, the firing/hit timeline shared
  with the visuals, and all procedural Web Audio factories (pads, room tones,
  suit breath, the reverberant basement gunshot, suit-conducted thuds,
  radio static). Sampled layers come from the offline CC0 library, inlined
  via `?inline` (see `vite.config.ts`).
- `src/film/characters.ts` — all figure skins; identity is painted texel by
  texel on the 64×64 sheets (faces, coats, cardigan, spacesuits, visors,
  the cracked-and-bloodied visor of the scream).
- `src/film/environments.ts` + `src/film/props.ts` — every set and prop,
  built procedurally (voxel Earth cap, voxel sun, wheel station, lathe,
  basement, hibernation bay). No external assets.
- `src/film/world.ts` — world assembly: figures, the 17-person photo group,
  bullet aim table.
- `src/film/animate.ts` — the master update: **every world state is a pure
  function of absolute time**, so pause / seek / replay always land on
  identical frames.
- `src/film/shots.ts` — the full shot list: camera rigs, shakes, dynamic
  bullet-tracking look, set visibility.
- `src/film/overlay.ts` — DOM chrome (letterbox, vignette, chapter cards,
  opening/closing titles, fades), also time-driven.

## Sound design notes

- The basement shot is layered samples + a feedback-delay reverb tail — the
  film's loudest moment, immediately followed by its longest silence.
- In vacuum, external gunfire does not exist: the thirty rounds are heard
  only as suit-conducted thuds and mechanism clicks, and the station airlock
  is a filtered subjective whoosh.
- All ambiences (hutong room tone, workshop hum, basement drips, vacuum sub,
  suit breath, hibernation bay) and the whole score (warm / cold / void /
  tension / aftermath / finale pads) are synthesized with Web Audio.
