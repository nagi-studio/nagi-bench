import type { SoundCue } from "@agentbench/cinematic-player";
import { FIRE, RELOADS, IMPACT_T, THRUST_IGNITE } from "./constants";

let n = 0;
const sid = () => `s${String(++n).padStart(3, "0")}`;

function cue(sound: string, start: number, end: number, opts: Partial<SoundCue> = {}): SoundCue {
  return { id: sid(), kind: "sound", sound, group: "sfx", gain: 1, sustain: false, start, end, ...opts };
}
const amb = (sound: string, start: number, end: number, gain = 1) =>
  cue(sound, start, end, { group: "ambience", gain, sustain: true });
const mus = (sound: string, start: number, end: number, gain = 1) =>
  cue(sound, start, end, { group: "music", gain, sustain: true });
const suit = (sound: string, start: number, end: number, gain = 1) =>
  cue(sound, start, end, { group: "suit", gain, sustain: false });

export const soundCues: SoundCue[] = [
  // ---- Title ----
  cue("title_drone", 0, 8, { group: "music", gain: 0.9 }),

  // ---- Collector ----
  amb("room_warm", 6, 120, 0.9),
  mus("score_warm", 8, 118, 0.8),
  cue("door_creak", 8.0, 9.4, { gain: 0.8 }),
  cue("footstep", 9.6, 9.85, { gain: 0.7 }),
  cue("footstep", 10.2, 10.45, { gain: 0.7 }),
  cue("footstep", 10.8, 11.05, { gain: 0.7 }),
  cue("footstep", 11.4, 11.65, { gain: 0.6 }),
  cue("tea_pour", 17.4, 19.0, { gain: 0.8 }),
  cue("cup_set", 19.1, 19.4, { gain: 0.8 }),
  cue("stone_place", 93.0, 93.3, { gain: 0.8 }),
  cue("stone_place", 93.7, 94.0, { gain: 0.8 }),
  cue("stone_place", 94.4, 94.7, { gain: 0.8 }),
  cue("stone_place", 86.2, 86.5, { gain: 0.6 }),
  cue("phone_beep", 106.0, 106.4, { gain: 0.8 }),
  cue("footstep", 118.6, 118.85, { gain: 0.5 }),
  cue("footstep", 119.2, 119.45, { gain: 0.45 }),

  // ---- Bridge ----
  amb("city_dusk", 120, 135, 0.9),
  mus("score_space", 120, 146, 0.5),
  amb("office_room", 135, 146, 0.9),
  cue("radio_beep", 134.8, 135.1, { group: "radio", gain: 0.5 }),

  // ---- Workshop ----
  amb("workshop_hum", 146, 166, 0.9),
  mus("score_tension", 146, 166, 0.7),
  cue("cnc_spindle", 150.0, 153.5, { gain: 0.8 }),
  cue("cnc_cut", 153.2, 155.6, { gain: 0.75 }),
  cue("metal_ping", 155.7, 156.2, { gain: 0.6 }),
  cue("cnc_cut", 157.0, 159.6, { gain: 0.75 }),
  cue("slug_drop", 160.2, 160.9, { gain: 0.7 }),
  cue("slug_drop", 161.6, 162.3, { gain: 0.7 }),
  cue("tool_remove", 163.4, 163.8, { gain: 0.8 }),

  // ---- Basement ----
  amb("basement_room", 166, 204, 0.95),
  mus("score_tension", 166, 189, 0.8),
  cue("pliers_click", 174.2, 174.5, { gain: 0.8 }),
  cue("pliers_click", 175.1, 175.4, { gain: 0.8 }),
  cue("pliers_click", 176.0, 176.3, { gain: 0.8 }),
  cue("pliers_click", 176.9, 177.2, { gain: 0.7 }),
  cue("glue_squeeze", 181.2, 181.7, { gain: 0.7 }),
  cue("glue_squeeze", 182.6, 183.1, { gain: 0.7 }),
  cue("glue_squeeze", 184.0, 184.5, { gain: 0.7 }),
  cue("mag_load", 186.4, 186.8, { gain: 0.9 }),
  cue("slide_rack", 187.4, 187.9, { gain: 0.9 }),
  cue("gunshot", 189.0, 192.5, { gain: 1.0 }),
  cue("cloth_rustle", 193.4, 194.0, { gain: 0.7 }),
  cue("gravel_pour", 196.4, 197.2, { gain: 0.8 }),

  // ---- Space · void ----
  amb("space_void", 204, 352, 0.8),
  cue("suit_interior", 204, 352, { group: "suit", gain: 0.9, sustain: true }),
  mus("score_space", 204, 278, 0.7),

  // ---- sunset / photograph ----
  cue("airlock_pump", 244.0, 246.6, { gain: 0.7 }),
  cue("airlock_open", 246.6, 248.0, { gain: 0.8 }),
  cue("radio_beep", 248.4, 248.7, { group: "radio", gain: 0.6 }),
  cue("radio_static", 249.0, 249.4, { group: "radio", gain: 0.7 }),
  cue("radio_static", 256.0, 256.4, { group: "radio", gain: 0.7 }),

  // ---- preparation ----
  suit("glove_twist", 270.0, 270.7, 0.9),
  suit("mag_swap", 276.4, 276.9, 0.8),
  suit("scope_mount", 275.4, 275.8, 0.9),

  // ---- the thirty shots (suit-conducted only; vacuum is silent) ----
  ...FIRE.map((t) => suit("shot_conducted", t, t + 0.18, 0.85)),
  ...RELOADS.map((t) => suit("mag_swap", t, t + 0.4, 0.85)),

  // ---- flight / impact ----
  suit("impact_thump", IMPACT_T, IMPACT_T + 0.5, 0.7),
  suit("impact_thump", IMPACT_T + 0.5, IMPACT_T + 1.0, 0.6),
  suit("impact_thump", IMPACT_T + 1.0, IMPACT_T + 1.5, 0.5),
  cue("ice_shimmer", IMPACT_T + 1.0, IMPACT_T + 2.6, { gain: 0.7 }),
  cue("alarm", 308, 322, { group: "radio", gain: 0.5, sustain: true }),
  cue("radio_static", 316.0, 316.4, { group: "radio", gain: 0.7 }),
  cue("radio_static", 319.2, 319.6, { group: "radio", gain: 0.8 }),
  cue("radio_beep", 319.0, 319.3, { group: "radio", gain: 0.6 }),
  cue("radio_static", 323.2, 323.6, { group: "radio", gain: 0.8 }),

  // ---- coda ----
  suit("thruster_ignite", THRUST_IGNITE, THRUST_IGNITE + 1.5, 0.9),
  cue("thruster_burn", THRUST_IGNITE + 1.4, 342, { group: "suit", gain: 0.8, sustain: true }),
  mus("score_resolve", 328, 352, 0.8),
];
