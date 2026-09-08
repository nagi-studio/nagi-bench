import type { Env } from "../lib/audio";

/**
 * SOUND CUE MANIFEST
 * ==================
 * Non-dialogue sound: ambience, effects and music-like beds. Voice is not
 * generated here; every spoken line lives in cues.ts and is rendered as a
 * subtitle. This table is what the director fires against the film clock.
 *
 * `action` names an AudioEngine capability. `repeat`/`interval` expand a cue
 * into a sequence (footsteps, countdown beeps, sparks).
 */
export interface SfxCue {
  id: string;
  time: number;
  action:
    | "env"
    | "sample"
    | "loop"
    | "stopLoop"
    | "gunshot"
    | "footsteps"
    | "click"
    | "ring"
    | "beep"
    | "riser"
    | "rumble"
    | "breath"
    | "burst"
    | "tone"
    | "static";
  env?: Env;
  sample?: string;
  key?: string;
  gain?: number;
  rate?: number;
  rateJitter?: number;
  pan?: number;
  repeat?: number;
  interval?: number;
  dur?: number;
  freq?: number;
  glide?: number;
  wood?: boolean;
  bright?: boolean;
  reverb?: number;
}

const F: SfxCue[] = [
  /* -------------------------------------------------------- prologue */
  { id: "s01", time: 0, action: "env", env: "vacuum" },
  { id: "s02", time: 0.2, action: "rumble", gain: 0.14, dur: 22 },
  { id: "s03", time: 0.6, action: "riser", dur: 6, gain: 0.1 },
  { id: "s04", time: 12.6, action: "riser", dur: 6.5, gain: 0.16 },
  { id: "s05", time: 14, action: "tone", freq: 48, dur: 6, gain: 0.06 },

  /* ----------------------------------------------------------- act I */
  { id: "s10", time: 20, action: "env", env: "room" },
  { id: "s11", time: 20.1, action: "loop", sample: "computerNoise_000", key: "councilHum", gain: 0.11, rate: 0.55 },
  { id: "s12", time: 21.4, action: "click", gain: 0.18 },
  { id: "s13", time: 29.2, action: "click", gain: 0.14 },
  { id: "s14", time: 36.6, action: "click", gain: 0.14 },
  { id: "s15", time: 46, action: "loop", sample: "computerNoise_001", key: "holoHum", gain: 0.08, rate: 1.35 },
  { id: "s16", time: 57.6, action: "stopLoop", key: "councilHum" },
  { id: "s17", time: 58, action: "stopLoop", key: "holoHum" },
  { id: "s18", time: 58.1, action: "footsteps", repeat: 22, interval: 0.54, gain: 0.2 },
  { id: "s19", time: 58.2, action: "loop", sample: "computerNoise_002", key: "corridorHum", gain: 0.07, rate: 0.5 },
  { id: "s20", time: 69.8, action: "stopLoop", key: "corridorHum" },

  /* ---------------------------------------------------------- act II */
  { id: "s30", time: 70, action: "env", env: "outdoor" },
  { id: "s31", time: 70.1, action: "loop", sample: "computerNoise_000", key: "marketMurmur", gain: 0.06, rate: 0.32 },
  { id: "s32", time: 72.4, action: "sample", sample: "rollover2", gain: 0.14, rate: 0.9 },
  { id: "s33", time: 84.2, action: "click", gain: 0.2 },
  { id: "s34", time: 93.8, action: "stopLoop", key: "marketMurmur" },
  { id: "s35", time: 94, action: "env", env: "room" },
  { id: "s36", time: 94.1, action: "loop", sample: "engineCircular_002", key: "lathe", gain: 0.2, rate: 1.05 },
  { id: "s37", time: 94.2, action: "loop", sample: "computerNoise_001", key: "shopHum", gain: 0.07, rate: 0.7 },
  { id: "s38", time: 96, action: "sample", sample: "impactMetal_light_001", gain: 0.14, rate: 1.2, reverb: 0.35 },
  { id: "s39", time: 99.2, action: "click", gain: 0.22 },
  { id: "s40", time: 104, action: "click", gain: 0.22 },
  { id: "s41", time: 110, action: "sample", sample: "impactTin_medium_000", gain: 0.26, rate: 1.1, reverb: 0.3 },
  { id: "s42", time: 116, action: "sample", sample: "impactMetal_medium_000", gain: 0.2, rate: 1.3, reverb: 0.3 },
  { id: "s43", time: 122, action: "sample", sample: "impactMetal_medium_003", gain: 0.2, rate: 1.1, reverb: 0.3 },
  { id: "s44", time: 135.6, action: "stopLoop", key: "lathe" },
  { id: "s45", time: 135.6, action: "stopLoop", key: "shopHum" },

  /* --------------------------------------------------------- act III */
  { id: "s50", time: 136, action: "env", env: "outdoor" },
  { id: "s51", time: 136.2, action: "loop", sample: "engineCircular_000", key: "car", gain: 0.22, rate: 0.72 },
  { id: "s52", time: 143.2, action: "stopLoop", key: "car" },
  { id: "s53", time: 143.8, action: "sample", sample: "doorOpen_000", gain: 0.45, rate: 0.9, reverb: 0.3 },
  { id: "s54", time: 146.4, action: "sample", sample: "doorClose_001", gain: 0.4, rate: 0.95, reverb: 0.35 },
  { id: "s55", time: 148, action: "env", env: "basement" },
  { id: "s56", time: 148.1, action: "loop", sample: "computerNoise_002", key: "rangeHum", gain: 0.09, rate: 0.38 },
  { id: "s57", time: 148.2, action: "loop", sample: "engineCircular_003", key: "fluor", gain: 0.05, rate: 0.24 },
  { id: "s58", time: 150, action: "footsteps", repeat: 12, interval: 0.6, gain: 0.24 },
  { id: "s59", time: 156.2, action: "click", gain: 0.3, bright: true },
  { id: "s60", time: 160.2, action: "click", gain: 0.26, bright: true },
  { id: "s61", time: 164.2, action: "breath", dur: 8, gain: 0.1 },
  { id: "s62", time: 170, action: "rumble", gain: 0.13, dur: 6 },
  { id: "s63", time: 177.0, action: "gunshot", gain: 1 },
  { id: "s64", time: 178.2, action: "gunshot", gain: 1 },
  { id: "s65", time: 179.4, action: "gunshot", gain: 1 },
  { id: "s66", time: 177.5, action: "click", gain: 0.32, bright: true },
  { id: "s67", time: 178.7, action: "click", gain: 0.32, bright: true },
  { id: "s68", time: 179.9, action: "click", gain: 0.32, bright: true },
  { id: "s69", time: 180.1, action: "ring", freq: 4200, dur: 9, gain: 0.075 },
  { id: "s70", time: 186.2, action: "burst", dur: 2.2, freq: 280, gain: 0.05, reverb: 0.5 },

  /* ---------------------------------------------------------- act IV */
  { id: "s80", time: 197.8, action: "stopLoop", key: "rangeHum" },
  { id: "s81", time: 197.8, action: "stopLoop", key: "fluor" },
  { id: "s82", time: 198, action: "env", env: "room" },
  { id: "s83", time: 198.1, action: "loop", sample: "computerNoise_000", key: "labHum", gain: 0.09, rate: 0.85 },
  { id: "s84", time: 202, action: "sample", sample: "impactTin_medium_001", gain: 0.2, rate: 1.4, reverb: 0.3 },
  { id: "s85", time: 206.4, action: "sample", sample: "impactTin_medium_003", gain: 0.2, rate: 1.5, reverb: 0.3 },
  { id: "s86", time: 210.6, action: "sample", sample: "impactTin_medium_000", gain: 0.18, rate: 1.6, reverb: 0.3 },
  { id: "s87", time: 216.2, action: "sample", sample: "impactSoft_medium_000", gain: 0.32, rate: 1.1, reverb: 0.3 },
  { id: "s88", time: 227.8, action: "stopLoop", key: "labHum" },
  { id: "s89", time: 228, action: "env", env: "room" },
  { id: "s90", time: 228.1, action: "loop", sample: "computerNoise_001", key: "reviewHum", gain: 0.08, rate: 0.95 },
  { id: "s91", time: 230.2, action: "sample", sample: "impactWood_medium_000", gain: 0.4, rate: 0.9, reverb: 0.3 },
  { id: "s92", time: 239.8, action: "stopLoop", key: "reviewHum" },
  { id: "s93", time: 240.1, action: "footsteps", repeat: 8, interval: 0.56, gain: 0.22 },

  /* ----------------------------------------------------------- act V */
  { id: "s100", time: 246, action: "env", env: "room" },
  { id: "s101", time: 246.1, action: "loop", sample: "spaceEngineLow_000", key: "shopWind", gain: 0.045, rate: 0.3 },
  { id: "s102", time: 264.0, action: "sample", sample: "impactPunch_heavy_000", gain: 0.45, rate: 0.9, reverb: 0.3 },
  { id: "s103", time: 266.6, action: "sample", sample: "impactPunch_heavy_002", gain: 0.45, rate: 0.9, reverb: 0.3 },
  { id: "s104", time: 269.2, action: "sample", sample: "impactPunch_heavy_000", gain: 0.45, rate: 0.85, reverb: 0.3 },
  { id: "s105", time: 271.8, action: "sample", sample: "impactPunch_heavy_002", gain: 0.45, rate: 0.85, reverb: 0.3 },
  { id: "s106", time: 273.4, action: "sample", sample: "lowFrequency_explosion_000", gain: 0.5, rate: 0.8, reverb: 0.4 },
  { id: "s107", time: 277.8, action: "riser", dur: 10, gain: 0.14 },
  { id: "s108", time: 289.6, action: "stopLoop", key: "shopWind" },
  { id: "s109", time: 290, action: "env", env: "outdoor" },
  { id: "s110", time: 291.4, action: "static", dur: 0.9, gain: 0.09 },
  { id: "s111", time: 292.2, action: "beep", freq: 760, dur: 0.1, gain: 0.14 },
  { id: "s112", time: 294.2, action: "beep", freq: 760, dur: 0.1, gain: 0.14 },
  { id: "s113", time: 296.2, action: "beep", freq: 760, dur: 0.1, gain: 0.14 },
  { id: "s114", time: 298.2, action: "beep", freq: 760, dur: 0.1, gain: 0.14 },
  { id: "s115", time: 299.4, action: "static", dur: 0.6, gain: 0.07 },
  { id: "s116", time: 300.2, action: "beep", freq: 760, dur: 0.1, gain: 0.14 },
  { id: "s117", time: 302.2, action: "beep", freq: 760, dur: 0.1, gain: 0.14 },
  { id: "s118", time: 304.2, action: "beep", freq: 760, dur: 0.1, gain: 0.14 },
  { id: "s119", time: 305.4, action: "beep", freq: 1320, dur: 0.14, gain: 0.18 },
  { id: "s120", time: 305.9, action: "loop", sample: "thrusterFire_002", key: "thruster", gain: 0.5, rate: 1.0 },
  { id: "s121", time: 305.9, action: "rumble", gain: 0.8, dur: 12 },
  { id: "s122", time: 305.9, action: "sample", sample: "lowFrequency_explosion_001", gain: 0.9, rate: 0.9, reverb: 0.3 },
  { id: "s123", time: 306.0, action: "sample", sample: "explosionCrunch_002", gain: 0.55, rate: 0.85, reverb: 0.3 },
  { id: "s124", time: 314.1, action: "loop", sample: "thrusterFire_004", key: "thruster2", gain: 0.36, rate: 0.9 },
  { id: "s125", time: 320, action: "stopLoop", key: "thruster" },
  { id: "s126", time: 326, action: "env", env: "vacuum" },
  { id: "s127", time: 326, action: "stopLoop", key: "thruster2" },
  { id: "s128", time: 326, action: "rumble", gain: 0.1, dur: 17 },
  { id: "s129", time: 326.2, action: "loop", sample: "spaceEngineLow_001", key: "credits", gain: 0.1, rate: 0.4 },
  { id: "s130", time: 343, action: "stopLoop", key: "credits" }
];

export const SFX: SfxCue[] = F.sort((a, b) => a.time - b.time);

export function validateSfx(): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  for (const c of SFX) {
    if (ids.has(c.id)) errs.push(`duplicate sfx id ${c.id}`);
    ids.add(c.id);
    if (c.time < 0) errs.push(`${c.id}: negative time`);
  }
  return errs;
}
