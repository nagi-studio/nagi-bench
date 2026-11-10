/**
 * Master timeline in seconds. Shots, sound cues and overlays all read from this
 * table, so picture and sound stay locked when anything is retimed.
 */
export const DURATION = 354;

export const T = {
  // A — cold open
  A1: 0,
  // B — the collector
  B1: 14, B2: 22, B3: 30.5, B4: 45.5, B5: 57.5, B6: 76, B7: 96.2,
  // C — the making
  C1: 122.5, C2: 127.5, C3: 137, C4: 144, C5: 149, C6: 161, C7: 170,
  // D — orbit
  D1: 179, D2: 193, D3: 209, D4: 216, D5: 239, D6: 252, D7: 266.5, D8: 279.5, D9: 291.5, D10: 308.5, D11: 318.5,
  // E — coda and end card
  E1: 335, E2: 347,
  END: DURATION,
} as const;

/** Three stones set down on the felt. */
export const STONE_THUNKS = [99.9, 100.8, 101.7];

/** Core drill plunges in the workshop: [start, end] of each contact. */
export const DRILL_PLUNGES: Array<[number, number]> = [
  [128.6, 129.7], [130.3, 131.4], [132.0, 133.1], [133.7, 134.8], [135.3, 136.4],
];
/** Segments dropping into the tray while the cut-off wheel works. */
export const TRAY_START = 138.0;
export const TRAY_END = 143.2;
export const LIGHTS_OUT = 148.2;

/** Basement test fire. */
export const TEST_SHOTS = [165.5, 166.45, 167.35, 168.2];
export const MAG_CLICKS = [161.5, 161.9, 162.3, 162.7];
export const MAG_INSERT = 163.4;
export const SLIDE_RACK = 164.1;

/** Orbit: thirty rounds in three bursts of ten. */
function burst(start: number, step: number): number[] {
  return Array.from({ length: 10 }, (_, i) => +(start + i * step).toFixed(3));
}
export const BURST1 = burst(267.3, 0.32);
export const BURST2 = burst(272.4, 0.27);
export const BURST3 = burst(276.5, 0.27);
export const ORBIT_SHOTS = [...BURST1, ...BURST2, ...BURST3];
export const MAG_SWAP1 = 270.9;
export const MAG_SWAP2 = 275.3;

export const HATCH_GREEN = 211.6;
export const HATCH_OPEN = 212.6;
export const VISORS_CLEAR = 231.0;
export const IMPACT = 292.4;
export const RETREAT = 300.5;
export const HATCH_CLOSE = 315.5;
export const THRUST = 321.0;
