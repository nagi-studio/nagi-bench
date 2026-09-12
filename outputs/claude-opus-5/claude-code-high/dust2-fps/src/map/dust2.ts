import { dirToYaw } from '../core/math.ts';
import type { BlockRect, FloorRect } from './grid.ts';
import { World } from './world.ts';
import type { NavAnchor, Prop, WorldDef } from './world.ts';

/**
 * de_dust2, rebuilt from memory as axis-aligned 1 m brushes.
 *
 * Orientation matches the classic radar: -Z is north (CT side), +Z is south
 * (T side), +X is east (A side), -X is west (B side). Every region below is
 * carved out of solid rock, so the walls between them are implicit and
 * watertight — there is no way to leak out of the playable space.
 *
 *                       ┌──────── CT SPAWN ────────┐
 *        B SITE         │                          │      A SITE
 *          │            └── CT MID ── A CROSS ─────┘        │
 *      B TUNNEL        B DOORS   │                      A SHORT / CAT
 *          │              └──────┤ MID (mid doors)          │
 *      UPPER TUNNELS             │                       LONG A
 *          └───────────── T SPAWN ─────── LONG DOORS ───────┘
 */

const COLORS = {
  crate: 0x9c7a4a,
  crateDark: 0x7a5c34,
  barrel: 0x6f7f5c,
  car: 0x8c9aa5,
  plate: 0xb0a186,
  door: 0x6b5436,
  sandbag: 0xa89a72,
};

const floors: FloorRect[] = [
  // ---------------------------------------------------------------- CT side
  { name: 'ct_spawn', x1: -20, z1: -48, x2: 6, z2: -38, h: 0 },
  { name: 'ct_spawn_south', x1: -8, z1: -38, x2: 6, z2: -32, h: 0 },
  { name: 'ct_to_b', x1: -20, z1: -38, x2: -12, z2: -30, h: 0 },

  // ------------------------------------------------------------------- A
  { name: 'a_cross', x1: 6, z1: -46, x2: 24, z2: -38, h: 0 },
  { name: 'a_ramp', x1: 24, z1: -46, x2: 30, z2: -38, ramp: { axis: 'x', from: 0, to: 1.2 } },
  { name: 'a_site', x1: 30, z1: -46, x2: 48, z2: -22, h: 1.2 },
  { name: 'a_short', x1: 30, z1: -22, x2: 36, z2: -16, h: 1.2 },
  { name: 'catwalk', x1: 16, z1: -20, x2: 30, z2: -10, h: 1.2 },
  { name: 'cat_ramp', x1: 8, z1: -16, x2: 16, z2: -10, ramp: { axis: 'x', from: 0, to: 1.2 } },

  // ------------------------------------------------------------------ Mid
  { name: 'ct_mid', x1: -8, z1: -32, x2: 8, z2: -22, h: 0 },
  { name: 'mid', x1: 0, z1: -32, x2: 8, z2: 30, h: 0 },
  { name: 't_mid', x1: 0, z1: 30, x2: 8, z2: 37, h: 0 },

  // -------------------------------------------------------------- B / west
  { name: 'b_doors', x1: -24, z1: -30, x2: -8, z2: -24, h: 0 },
  { name: 'b_site', x1: -48, z1: -40, x2: -24, z2: -20, h: 0.5 },
  { name: 'b_tunnel_exit', x1: -32, z1: -20, x2: -26, z2: -14, ramp: { axis: 'z', from: 0.5, to: 0 } },
  { name: 'tunnel_bend', x1: -32, z1: -14, x2: -12, z2: -8, h: 0 },
  { name: 'tunnel', x1: -20, z1: -8, x2: -12, z2: 39, h: 0 },
  { name: 'upper_tunnel', x1: -20, z1: 39, x2: 8, z2: 45, h: 0 },

  // -------------------------------------------------------------- T / east
  { name: 't_spawn', x1: 8, z1: 32, x2: 30, z2: 45, h: 0 },
  { name: 'outside_long', x1: 30, z1: 30, x2: 48, z2: 42, h: 0 },
  { name: 'long_doors', x1: 40, z1: 26, x2: 48, z2: 30, h: 0 },
  { name: 'long', x1: 40, z1: -16, x2: 48, z2: 26, h: 0 },
  { name: 'long_ramp', x1: 40, z1: -22, x2: 48, z2: -16, ramp: { axis: 'z', from: 1.2, to: 0 } },
  { name: 'pit', x1: 36, z1: -16, x2: 40, z2: -8, h: 0 },
];

const blocks: BlockRect[] = [
  // Mid doors: a wall across mid with a 2 m gap in the middle.
  { name: 'mid_door_w', x1: 0, z1: 8, x2: 3, z2: 9 },
  { name: 'mid_door_e', x1: 5, z1: 8, x2: 8, z2: 9 },
  // Long doors: thick frame, 3 m opening.
  { name: 'long_door_w', x1: 40, z1: 27, x2: 43, z2: 29 },
  { name: 'long_door_e', x1: 46, z1: 27, x2: 48, z2: 29 },
  // B doors choke.
  { name: 'b_door_n', x1: -15, z1: -30, x2: -14, z2: -27 },
  // Cover pillars.
  { name: 'a_pillar', x1: 33, z1: -32, x2: 35, z2: -30 },
  { name: 'b_pillar', x1: -35, z1: -28, x2: -33, z2: -26 },
  { name: 'ctmid_pillar', x1: -4, z1: -28, x2: -2, z2: -26 },
];

const props: Prop[] = [
  // ------------------------------------------------------------ A site (h 1.2)
  crate('a_default_1', 38, 1.2, -36, 2.4, 1.8, 2.4),
  crate('a_default_2', 40.6, 1.2, -36.2, 2.2, 1.4, 2.2, COLORS.crateDark),
  crate('a_default_3', 39.2, 3.0, -36.1, 2.0, 1.2, 2.0),
  crate('a_goose', 33, 1.2, -41, 2.6, 1.6, 2.6, COLORS.crateDark),
  crate('a_ninja', 44.5, 1.2, -28.5, 2.0, 1.6, 2.0),
  barrel('a_barrel_1', 31.6, 1.2, -25.5),
  barrel('a_barrel_2', 33.0, 1.2, -25.0),
  crate('a_short_cover', 32.5, 1.2, -19, 2.0, 1.4, 2.0, COLORS.crateDark),

  // ------------------------------------------------------------ B site (h 0.5)
  crate('b_plat_1', -38, 0.5, -30, 3.0, 1.8, 3.0),
  crate('b_plat_2', -38, 2.3, -30, 2.4, 1.2, 2.4, COLORS.crateDark),
  crate('b_plat_3', -41.5, 0.5, -30.5, 2.4, 1.6, 2.4),
  car('b_car', -30.5, 0.5, -34.5),
  crate('b_back', -45, 0.5, -24, 2.2, 1.6, 2.2, COLORS.crateDark),
  crate('b_door_cover', -27.5, 0.5, -27, 2.0, 1.4, 2.0),
  barrel('b_barrel_1', -34.5, 0.5, -37),
  barrel('b_barrel_2', -33.4, 0.5, -38),

  // ------------------------------------------------------------------- Mid
  crate('xbox', 5.4, 0, -14, 1.8, 1.3, 1.8, COLORS.crateDark),
  crate('mid_crate', 1.6, 0, -2, 1.8, 1.5, 1.8),
  barrel('mid_barrel', 6.5, 0, 12),
  crate('ct_mid_crate', -6, 0, -24.5, 2.0, 1.5, 2.0),

  // ------------------------------------------------------------------ Long
  crate('long_crate_1', 44.5, 0, 12, 2.2, 1.7, 2.2),
  crate('long_crate_2', 42.2, 0, 0, 2.0, 1.5, 2.0, COLORS.crateDark),
  crate('long_corner', 45.5, 0, -12, 2.2, 1.6, 2.2),
  crate('pit_crate', 38, 0, -12, 2.0, 1.5, 2.0, COLORS.crateDark),
  barrel('long_barrel', 41.4, 0, 22),

  // -------------------------------------------------------------- Tunnels / B
  crate('tunnel_crate', -16.5, 0, 20, 1.8, 1.4, 1.8),
  crate('tunnel_bend_crate', -29, 0, -11, 1.8, 1.4, 1.8, COLORS.crateDark),
  crate('upper_tunnel_crate', -4, 0, 43, 1.8, 1.4, 1.8),

  // ---------------------------------------------------------------- Spawns
  crate('t_spawn_crate_1', 12, 0, 43, 2.0, 1.6, 2.0),
  crate('t_spawn_crate_2', 26, 0, 43.5, 2.0, 1.4, 2.0, COLORS.crateDark),
  crate('ct_spawn_crate_1', -17, 0, -45, 2.2, 1.6, 2.2),
  car('ct_car', 2, 0, -45),
  crate('outside_long_crate', 34, 0, 34, 2.2, 1.7, 2.2, COLORS.crateDark),

  // ------------------------------------------------- Door leaves (decorative)
  door('mid_door_leaf_w', 2.6, 0, 8.5, 1.2, 2.6, 0.16, -0.5),
  door('mid_door_leaf_e', 5.4, 0, 8.5, 1.2, 2.6, 0.16, 0.5),
  door('long_door_leaf_w', 43.4, 0, 28, 1.4, 2.8, 0.18, -0.6),
  door('long_door_leaf_e', 45.6, 0, 28, 1.4, 2.8, 0.18, 0.6),
  door('b_door_leaf', -14.4, 0, -26.6, 1.3, 2.6, 0.16, 0.7),
];

function crate(name: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, color = COLORS.crate): Prop {
  return { name, kind: 'crate', x, y, z, sx, sy, sz, color, solid: true };
}

function barrel(name: string, x: number, y: number, z: number): Prop {
  return { name, kind: 'barrel', x, y, z, sx: 0.9, sy: 1.2, sz: 0.9, color: COLORS.barrel, solid: true };
}

function car(name: string, x: number, y: number, z: number): Prop {
  return { name, kind: 'car', x, y, z, sx: 4.4, sy: 1.5, sz: 2.0, color: COLORS.car, solid: true };
}

function door(name: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, rot: number): Prop {
  return { name, kind: 'door', x, y, z, sx, sy, sz, color: COLORS.door, solid: false, rot };
}

/** Tactical anchors: the vocabulary the AI uses to talk about the map. */
const anchors: NavAnchor[] = [
  a('a_site_default', 'a_site', 38, -33),
  a('a_site_pit', 'a_site', 44, -33),
  a('a_site_goose', 'a_site', 33, -38),
  a('a_site_back', 'a_site', 46, -42),
  a('a_short_top', 'a_short', 33, -19),
  a('catwalk_mid', 'catwalk', 22, -15),
  a('cat_ramp_bottom', 'mid', 9, -13),
  a('long_corner', 'long', 44, -13),
  a('long_mid', 'long', 44, 4),
  a('long_doors', 'long', 44.5, 28),
  a('outside_long', 'long', 38, 35),
  a('pit', 'pit', 38, -12),
  a('mid_doors', 'mid', 4, 7),
  a('mid_lower', 'mid', 4, 20),
  a('mid_upper', 'mid', 4, -6),
  a('ct_mid', 'ct_mid', -2, -27),
  a('b_doors', 'b_doors', -12, -27),
  a('b_doors_west', 'b_doors', -22, -27),
  a('b_site_plat', 'b_site', -38, -27),
  a('b_site_car', 'b_site', -31, -32),
  a('b_site_back', 'b_site', -45, -35),
  a('b_site_default', 'b_site', -36, -34),
  a('b_tunnel_exit', 'tunnel', -29, -17),
  a('tunnel_bend', 'tunnel', -16, -11),
  a('tunnel_mid', 'tunnel', -16, 14),
  a('upper_tunnel', 'tunnel', -8, 42),
  a('t_spawn_c', 't_spawn', 19, 39),
  a('ct_spawn_c', 'ct_spawn', -7, -43),
  a('a_cross', 'a_cross', 15, -42),
  a('ct_to_b', 'ct_to_b', -16, -34),
];

function a(name: string, area: string, x: number, z: number): NavAnchor {
  return { name, area, x, z };
}

function spawnRow(pts: [number, number][], lookX: number, lookZ: number) {
  return pts.map(([x, z]) => ({ x, z, yaw: dirToYaw(lookX - x, lookZ - z) }));
}

export const DUST2: WorldDef = {
  bounds: { minX: -56, minZ: -56, maxX: 56, maxZ: 52 },
  floors,
  blocks,
  props,
  bombsites: {
    A: { name: 'A', x1: 30, z1: -46, x2: 47, z2: -26 },
    B: { name: 'B', x1: -47, z1: -40, x2: -26, z2: -21 },
  },
  spawns: {
    T: spawnRow(
      [
        [12, 41],
        [16, 43],
        [20, 39],
        [24, 42],
        [28, 38],
      ],
      10,
      20,
    ),
    CT: spawnRow(
      [
        [-16, -44],
        [-12, -42],
        [-8, -45],
        [-3, -42],
        [1, -44],
      ],
      0,
      -20,
    ),
  },
  anchors,
};

export function createDust2World(): World {
  return new World(DUST2);
}
