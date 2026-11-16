/** Master timeline. Total runtime 352 s — under the 360 s hard limit. */
export const DURATION = 352;

export const ACT = {
  title: [0, 6],
  collector: [6, 120],
  bridge: [120, 146],
  workshop: [146, 166],
  basement: [166, 204],
  space: [204, 352],
} as const;

/** The thirty trigger pulls: three volleys of ten, two reloads between. */
export const FIRE: number[] = [];
for (let v = 0; v < 3; v++) {
  const base = 280.0 + v * 3.8;
  for (let i = 0; i < 10; i++) FIRE.push(+(base + i * 0.3).toFixed(3));
}
export const RELOADS = [283.2, 287.0];
export const IMPACT_T = 304.4;
export const FLIGHT_START = 292;
export const THRUST_IGNITE = 324;
