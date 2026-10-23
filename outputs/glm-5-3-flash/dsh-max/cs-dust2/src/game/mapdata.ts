/**
 * mapdata.ts — De_Dust2 (core areas) described purely as data.
 *
 * World convention:
 *   +x  = east,  -x = west
 *   +z  = south, -z = north
 *   y   = up (meters)
 *
 * Everything (geometry, collision, path-finding, minimap) is generated from this file:
 *   rects  : walkable regions (corridors / rooms / plateaus / ramps)
 *   walls  : interior walls with gaps (mid doors, B doors, long doors)
 *   crates : physical cover boxes (jumpable, block vision at chest height)
 *   zones  : bombsites & spawns
 *   points : named tactical positions used by the AI
 */

export interface MapRect {
  name: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  /** flat ground height (top surface) of this region */
  h?: number;
  /** ramp: height varies linearly along `axis`: `h` at axis=from, `h2` at axis=to */
  h2?: number;
  ramp?: { axis: 'x' | 'z'; from: number; to: number };
  zone?: 'A' | 'B' | 'T' | 'CT';
  ceiling?: number; // optional visual ceiling height (tunnels)
}

export interface MapWall {
  name: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  h?: number;
}

export interface MapCrate {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  kind?: 'crate' | 'barrel' | 'xbox';
  yaw?: number;
}

export interface MapPoint {
  name: string;
  x: number;
  z: number;
}

/* ------------------------------------------------------------------ */
/* Walkable regions                                                    */
/* ------------------------------------------------------------------ */

export const RECTS: MapRect[] = [
  // ---- T side (south) ----
  { name: 'T Spawner', x1: -8, z1: 44, x2: 32, z2: 76, zone: 'T' },
  { name: 'Long Doors', x1: 26, z1: 32, x2: 46, z2: 52 },
  { name: 'Outside Mid', x1: -26, z1: 18, x2: 8, z2: 46 },
  { name: 'Top Mid', x1: -6, z1: -2, x2: 10, z2: 22 },
  { name: 'Upper Tunnels', x1: -52, z1: 6, x2: -20, z2: 24, ceiling: 4.2 },
  { name: 'Tunnel Link', x1: -26, z1: 20, x2: -12, z2: 42, ceiling: 4.2 },

  // ---- Mid ----
  { name: 'CT Mid', x1: -6, z1: -36, x2: 10, z2: -2, ceiling: 6 },
  { name: 'CT Mid Link', x1: -6, z1: -44, x2: 10, z2: -30 },

  // ---- Catwalk / A short ----
  { name: 'Catwalk Ramp', x1: 10, z1: 4, x2: 20, z2: 16, h: 0, h2: 1.6, ramp: { axis: 'x', from: 10, to: 20 } },
  { name: 'Catwalk', x1: 20, z1: 2, x2: 28, z2: 16, h: 1.6 },
  { name: 'A Short', x1: 28, z1: -18, x2: 42, z2: 12, h: 2.0 },

  // ---- Long A ----
  { name: 'Long A', x1: 40, z1: -6, x2: 58, z2: 44 },
  { name: 'Long Corner', x1: 32, z1: 6, x2: 42, z2: 20 },
  { name: 'A Long Ramp', x1: 48, z1: -16, x2: 58, z2: -6, h: 2.0, h2: 0, ramp: { axis: 'z', from: -16, to: -6 } },

  // ---- A site / CT ----
  { name: 'A Site', x1: 30, z1: -54, x2: 62, z2: -16, h: 2.0, zone: 'A' },
  { name: 'CT Ramp', x1: 16, z1: -50, x2: 30, z2: -40, h: 0, h2: 2.0, ramp: { axis: 'x', from: 16, to: 30 } },
  { name: 'CT Spawner', x1: -16, z1: -78, x2: 16, z2: -40, zone: 'CT' },

  // ---- B side ----
  { name: 'B Tunnels', x1: -52, z1: -8, x2: -34, z2: 10, ceiling: 4.2 },
  { name: 'B Tunnel Ramp', x1: -60, z1: -24, x2: -42, z2: -8, h: 0, h2: 1.5, ramp: { axis: 'z', from: -8, to: -24 }, ceiling: 4.2 },
  { name: 'B Site', x1: -66, z1: -60, x2: -34, z2: -24, h: 1.5, zone: 'B' },
  { name: 'B Doors', x1: -34, z1: -64, x2: -16, z2: -50, h: 1.5, h2: 0, ramp: { axis: 'x', from: -34, to: -16 }, ceiling: 4.4 },
];

/* ------------------------------------------------------------------ */
/* Interior walls (with gaps = doors)                                  */
/* ------------------------------------------------------------------ */

export const WALLS: MapWall[] = [
  // Mid double doors (iconic): wall across mid, two 3 m passable openings
  { name: 'mid_doors_l', x1: -6, z1: -4.4, x2: -4.0, z2: -2.0, h: 4.6 },
  { name: 'mid_doors_c', x1: -1.0, z1: -4.4, x2: 0.5, z2: -2.0, h: 4.6 },
  { name: 'mid_doors_r', x1: 3.5, z1: -4.4, x2: 10, z2: -2.0, h: 4.6 },

  // B doors (double doors between CT spawn and B site)
  { name: 'b_doors_l', x1: -28.0, z1: -64, x2: -25.0, z2: -59.5, h: 4.4 },
  { name: 'b_doors_c', x1: -28.0, z1: -56.5, x2: -25.0, z2: -55.0, h: 4.4 },
  { name: 'b_doors_r', x1: -28.0, z1: -52.0, x2: -25.0, z2: -50, h: 4.4 },

  // Long doors (archway between T spawn and Long A)
  { name: 'long_doors_l', x1: 26, z1: 40.0, x2: 33.4, z2: 42.6, h: 4.6 },
  { name: 'long_doors_r', x1: 36.6, z1: 40.0, x2: 46, z2: 42.6, h: 4.6 },
];

/* ------------------------------------------------------------------ */
/* Crates / cover                                                      */
/* ------------------------------------------------------------------ */

export const CRATES: MapCrate[] = [
  // Mid — the famous "xbox"
  { x: 1.5, z: 12.5, w: 4, d: 4, h: 2.0, kind: 'xbox' },
  { x: -4.5, z: 18.5, w: 2.6, d: 2.6, h: 1.0 },

  // T spawn
  { x: 20, z: 60, w: 3, d: 3, h: 1.0 },
  { x: 6, z: 70, w: 3.4, d: 3.4, h: 2.0 },

  // Long doors & long
  { x: 44, z: 47, w: 3, d: 3, h: 1.0 },
  { x: 43, z: 32, w: 3, d: 3, h: 1.0 },
  { x: 36, z: 14, w: 3, d: 3, h: 1.0 },
  { x: 55, z: 38, w: 2.8, d: 2.8, h: 1.0 },
  { x: 52, z: 34, w: 2.8, d: 2.8, h: 1.0 },
  // barrels at long corner
  { x: 55.5, z: -2, w: 2.2, d: 2.2, h: 1.3, kind: 'barrel' },
  { x: 55.6, z: 0.6, w: 2.2, d: 2.2, h: 1.3, kind: 'barrel' },

  // A site — default plant boxes, goose crates, site cover
  { x: 42, z: -36, w: 5, d: 5, h: 2.0 },
  { x: 42, z: -30.6, w: 5, d: 3.6, h: 1.0 },
  { x: 34, z: -50, w: 3, d: 3, h: 1.0 },
  { x: 34, z: -46.6, w: 3, d: 2.6, h: 2.0 },
  { x: 57, z: -24, w: 3.4, d: 3.4, h: 1.0 },
  { x: 47, z: -20, w: 3, d: 3, h: 1.0 },

  // A short / catwalk
  { x: 38, z: 4, w: 3, d: 3, h: 1.0 },
  { x: 25, z: 13.5, w: 2.4, d: 2.4, h: 1.0 },

  // CT spawn
  { x: -6, z: -70, w: 3, d: 3, h: 1.0 },
  { x: 12, z: -50, w: 3.2, d: 3.2, h: 1.0 },
  { x: 12, z: -46.4, w: 3.2, d: 3.2, h: 2.0 },

  // CT mid
  { x: 8, z: -20, w: 2.8, d: 2.8, h: 1.0 },

  // B site — big double stack + site cover
  { x: -52, z: -42, w: 6, d: 6, h: 2.0 },
  { x: -52, z: -35.5, w: 6, d: 4, h: 1.0 },
  { x: -62, z: -54, w: 3, d: 3, h: 1.0 },
  { x: -38, z: -28, w: 3.2, d: 3.2, h: 1.0 },
  { x: -58, z: -28, w: 3, d: 3, h: 1.0 },

  // B tunnels
  { x: -48, z: 6, w: 3, d: 3, h: 1.0 },
  { x: -38, z: -14, w: 2.8, d: 2.8, h: 1.0 },
];

/* ------------------------------------------------------------------ */
/* Bombsites (plant areas) — rects are also used for HUD/minimap       */
/* ------------------------------------------------------------------ */

export const SITE_A = { x1: 30, z1: -54, x2: 62, z2: -16, cx: 45, cz: -34, name: 'A' };
export const SITE_B = { x1: -66, z1: -60, x2: -34, z2: -24, cx: -50, cz: -42, name: 'B' };

export function inSite(x: number, z: number): 'A' | 'B' | null {
  if (x >= SITE_A.x1 && x <= SITE_A.x2 && z >= SITE_A.z1 && z <= SITE_A.z2) return 'A';
  if (x >= SITE_B.x1 && x <= SITE_B.x2 && z >= SITE_B.z1 && z <= SITE_B.z2) return 'B';
  return null;
}

/* ------------------------------------------------------------------ */
/* Named tactical points (AI objectives, spawns, callouts)             */
/* ------------------------------------------------------------------ */

export const POINTS: Record<string, MapPoint> = {
  // spawns
  t_spawn_1: { name: 'T Spawn', x: 0, z: 66 },
  t_spawn_2: { name: 'T Spawn', x: 14, z: 60 },
  t_spawn_3: { name: 'T Spawn', x: 22, z: 70 },
  t_spawn_4: { name: 'T Spawn', x: -4, z: 58 },
  ct_spawn_1: { name: 'CT Spawn', x: 0, z: -70 },
  ct_spawn_2: { name: 'CT Spawn', x: -10, z: -62 },
  ct_spawn_3: { name: 'CT Spawn', x: 8, z: -60 },
  ct_spawn_4: { name: 'CT Spawn', x: -2, z: -52 },

  // A site
  a_plant: { name: 'A Site', x: 44, z: -43 },
  a_plant_2: { name: 'A Site', x: 50, z: -26 },
  a_hold_1: { name: 'A Site', x: 56, z: -46 },
  a_hold_2: { name: 'A Site', x: 33, z: -24 },
  a_hold_3: { name: 'A Site', x: 44, z: -22 },
  a_cross: { name: 'A Cross', x: 53, z: -10 },
  long_hall: { name: 'Long A', x: 50, z: 30 },
  long_doors: { name: 'Long Doors', x: 34, z: 44 },
  long_corner: { name: 'Long Corner', x: 44, z: 12 },
  pit: { name: 'Pit', x: 34, z: 18 },

  // Mid
  top_mid: { name: 'Top Mid', x: 2, z: 18 },
  mid_doors: { name: 'Mid Doors', x: 1, z: -6 },
  ct_mid: { name: 'CT Mid', x: 2, z: -18 },
  mid_ct_hold: { name: 'CT Mid', x: 4, z: -30 },
  xbox: { name: 'Xbox', x: 0, z: 16 },
  catwalk: { name: 'Catwalk', x: 24, z: 9 },
  short: { name: 'A Short', x: 34, z: -4 },
  short_hold: { name: 'A Short', x: 32, z: -12 },

  // B side
  b_plant: { name: 'B Site', x: -46, z: -42 },
  b_plant_2: { name: 'B Site', x: -44, z: -30 },
  b_hold_1: { name: 'B Site', x: -62, z: -30 },
  b_hold_2: { name: 'B Site', x: -60, z: -48 },
  b_hold_3: { name: 'B Site', x: -38, z: -40 },
  b_doors: { name: 'B Doors', x: -22, z: -56 },
  b_tunnels: { name: 'B Tunnels', x: -43, z: 0 },
  b_tunnel_mouth: { name: 'B Site', x: -50, z: -20 },
  upper_tunnels: { name: 'Upper Tunnels', x: -36, z: 15 },
};

/** Attack / defend route labels for bot chatter + minimap callouts */
export const CALLOUTS: { text: string; x: number; z: number; size: number }[] = [
  { text: 'T SPAWN', x: 12, z: 62, size: 5 },
  { text: 'CT SPAWN', x: 0, z: -62, size: 5 },
  { text: 'A', x: 45, z: -35, size: 9 },
  { text: 'B', x: -50, z: -42, size: 9 },
  { text: 'LONG A', x: 50, z: 20, size: 3.4 },
  { text: 'MID', x: 1, z: 10, size: 3.4 },
  { text: 'CAT', x: 24, z: 9, size: 2.8 },
  { text: 'TUNNELS', x: -44, z: 12, size: 3.4 },
];
