import { Team } from '../types';

export type MaterialKind =
  | 'sand'
  | 'stone_floor'
  | 'wall_sandstone'
  | 'wall_plaster'
  | 'wall_dark'
  | 'crate_wood'
  | 'crate_green'
  | 'door_wood'
  | 'door_metal'
  | 'roof'
  | 'site_a'
  | 'site_b'
  | 'car_metal';

export interface MapBox {
  id: string;
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
  material: MaterialKind;
  solid: boolean;
  radarType?: 'floor' | 'wall' | 'crate' | 'door' | 'none';
}

export interface MapRamp {
  id: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  yStart: number; // at x1 (if axis='x') or z1 (if axis='z')
  yEnd: number;   // at x2 (if axis='x') or z2 (if axis='z')
  axis: 'x' | 'z';
  thickness: number;
  material: MaterialKind;
}

export interface ZoneRect {
  name: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  floorY: number;
  site?: 'A' | 'B';
}

export interface SpawnPoint {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

export interface Dust2MapData {
  boxes: MapBox[];
  ramps: MapRamp[];
  plantZones: ZoneRect[];
  buyZones: Record<Team, ZoneRect>;
  callouts: ZoneRect[];
  spawns: Record<Team, SpawnPoint[]>;
}

let boxSeq = 0;
function makeBox(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
  material: MaterialKind,
  radarType: MapBox['radarType'] = 'wall',
  solid = true
): MapBox {
  return {
    id: `b_${boxSeq++}`,
    x1: Math.min(x1, x2),
    y1: Math.min(y1, y2),
    z1: Math.min(z1, z2),
    x2: Math.max(x1, x2),
    y2: Math.max(y1, y2),
    z2: Math.max(z1, z2),
    material,
    solid,
    radarType,
  };
}

let rampSeq = 0;
function makeRamp(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  yStart: number,
  yEnd: number,
  axis: 'x' | 'z',
  material: MaterialKind = 'sand',
  thickness = 0.6
): MapRamp {
  return {
    id: `r_${rampSeq++}`,
    x1: Math.min(x1, x2),
    z1: Math.min(z1, z2),
    x2: Math.max(x1, x2),
    z2: Math.max(z1, z2),
    yStart,
    yEnd,
    axis,
    thickness,
    material,
  };
}

export function createDust2MapData(): Dust2MapData {
  boxSeq = 0;
  rampSeq = 0;
  const boxes: MapBox[] = [];
  const ramps: MapRamp[] = [];

  // =========================================================================
  // 1. WALKABLE FLOORS (exact Y heights verified for seamless transitions)
  // =========================================================================

  // Global desert bedrock base beneath entire map (prevents ever falling through)
  boxes.push(makeBox(-54, -2.0, -54, 54, -0.5, 54, 'sand', 'none', true));

  // T SPAWN (Y = 3.0)
  boxes.push(makeBox(-24, -0.5, 34, 24, 3.0, 48, 'sand', 'floor'));

  // OUTSIDE LONG (Y = 3.0)
  boxes.push(makeBox(24, -0.5, 24, 44, 3.0, 42, 'sand', 'floor'));

  // A LONG CORRIDOR (Y = 1.5)
  boxes.push(makeBox(30, -0.5, -16, 48, 1.5, 12, 'sand', 'floor'));

  // A SITE PLATFORM (Y = 3.4)
  boxes.push(makeBox(30, -0.5, -46, 48, 3.4, -28, 'stone_floor', 'floor'));

  // TOP MID FLAT (Y = 1.6)
  boxes.push(makeBox(-8, -0.5, 10, 12, 1.6, 22, 'sand', 'floor'));

  // LOWER MID ALLEY (Y = 0.0)
  boxes.push(makeBox(-10, -0.5, -20, 6, 0.0, 0, 'sand', 'floor'));

  // CT MID (Y = 0.0)
  boxes.push(makeBox(-22, -0.5, -44, 4, 0.0, -20, 'stone_floor', 'floor'));

  // CT SPAWN (Y = 0.0)
  boxes.push(makeBox(4, -0.5, -44, 18, 0.0, -32, 'stone_floor', 'floor'));

  // CATWALK / A SHORT (Y = 3.0)
  // North-South spine along east of Mid
  boxes.push(makeBox(6, -0.5, -26, 12, 3.0, -6, 'stone_floor', 'floor'));
  // East-West Catwalk overlooking CT Spawn
  boxes.push(makeBox(6, -0.5, -32, 24, 3.0, -24, 'stone_floor', 'floor'));

  // OUTSIDE B TUNNELS LANDING (Y = 1.8)
  boxes.push(makeBox(-44, -0.5, 28, -36, 1.8, 42, 'sand', 'floor'));

  // UPPER B TUNNELS (Y = 1.8)
  boxes.push(makeBox(-44, -0.5, -8, -26, 1.8, 28, 'stone_floor', 'floor'));

  // B SITE (Y = 0.5)
  boxes.push(makeBox(-46, -0.5, -44, -22, 0.5, -16, 'sand', 'floor'));

  // B SITE BACK PLAT (slightly elevated cover platform Y = 1.2)
  boxes.push(makeBox(-46, 0.5, -44, -40, 1.2, -37, 'stone_floor', 'floor'));
  ramps.push(makeRamp(-40, -44, -37.5, -37, 1.2, 0.5, 'x', 'stone_floor', 0.4));

  // =========================================================================
  // 2. SMOOTH RAMPS & STAIRS CONNECTING EVERY ELEVATION
  // =========================================================================

  // Suicide Ramp: T Spawn (z=34, y=3.0) -> Top Mid (z=22, y=1.6)
  ramps.push(makeRamp(-6, 22, 8, 34, 1.6, 3.0, 'z', 'sand', 1.2));

  // Top Mid <-> Outside Long Connector: Top Mid (x=10, y=1.6) -> Outside Long (x=24, y=3.0)
  ramps.push(makeRamp(10, 18, 24, 26, 1.6, 3.0, 'x', 'sand', 1.2));

  // Long Doors Room Ramp: A Long (z=12, y=1.5) -> Outside Long (z=24, y=3.0)
  ramps.push(makeRamp(28, 12, 44, 24, 1.5, 3.0, 'z', 'stone_floor', 1.2));

  // A Ramp: A Site (z=-28, y=3.4) -> A Long (z=-16, y=1.5)
  ramps.push(makeRamp(30, -28, 48, -16, 3.4, 1.5, 'z', 'sand', 1.4));

  // Mid Ramp: Lower Mid (z=0, y=0.0) -> Top Mid (z=10, y=1.6)
  ramps.push(makeRamp(-10, 0, 6, 10, 0.0, 1.6, 'z', 'sand', 1.0));

  // Mid-to-Short Stairs: Catwalk (z=-6, y=3.0) -> Top Mid (z=10, y=1.6)
  ramps.push(makeRamp(6, -6, 12, 10, 3.0, 1.6, 'z', 'stone_floor', 1.4));

  // Short Stairs: Catwalk (x=24, y=3.0) -> A Site (x=30, y=3.4)
  ramps.push(makeRamp(24, -32, 30, -26, 3.0, 3.4, 'x', 'stone_floor', 1.2));

  // CT Ramp: CT Spawn (x=18, y=0.0) -> A Site (x=30, y=3.4)
  ramps.push(makeRamp(18, -44, 30, -34, 0.0, 3.4, 'x', 'sand', 1.2));

  // Outside B Tunnels Ramp: Landing (x=-36, y=1.8) -> T Spawn (x=-24, y=3.0)
  ramps.push(makeRamp(-36, 28, -24, 42, 1.8, 3.0, 'x', 'sand', 1.2));

  // Lower B Tunnels Ramp: Upper B Tunnels (x=-26, y=1.8) -> Lower Mid (x=-10, y=0.0)
  ramps.push(makeRamp(-26, -8, -10, 0, 1.8, 0.0, 'x', 'stone_floor', 1.2));

  // Upper B Tunnels Exit Ramp: B Site (z=-16, y=0.5) -> Upper B Tunnels (z=-8, y=1.8)
  ramps.push(makeRamp(-42, -16, -30, -8, 0.5, 1.8, 'z', 'stone_floor', 1.2));

  // B Doors Threshold Ramp: B Site (x=-22, y=0.5) -> CT Mid (x=-20, y=0.0)
  ramps.push(makeRamp(-22.5, -31, -20, -25, 0.5, 0.0, 'x', 'stone_floor', 0.4));

  // B Window Threshold Ramp: B Site (x=-22, y=0.5) -> CT Mid (x=-20, y=0.0)
  ramps.push(makeRamp(-22.5, -40, -20, -35, 0.5, 0.0, 'x', 'stone_floor', 0.4));

  // =========================================================================
  // 3. OUTER PERIMETER WALLS (Zero escape, iconic desert skyline heights)
  // =========================================================================

  // South outer wall (T Spawn + Outside B + Outside Long)
  boxes.push(makeBox(-46, -0.5, 48, 26, 11.0, 50, 'wall_sandstone'));
  boxes.push(makeBox(-46, -0.5, 42, -24, 10.5, 48, 'wall_sandstone'));
  boxes.push(makeBox(24, -0.5, 42, 46, 10.5, 48, 'wall_sandstone'));

  // East outer wall (Outside Long -> Long Doors -> A Long -> A Site)
  boxes.push(makeBox(44, -0.5, 12, 50, 11.5, 44, 'wall_sandstone'));
  boxes.push(makeBox(48, -0.5, -48, 50, 12.0, 14, 'wall_sandstone'));

  // North outer wall (B Site -> CT Mid -> CT Spawn -> A Site)
  boxes.push(makeBox(-48, -0.5, -46, -22, 11.0, -44, 'wall_sandstone'));
  boxes.push(makeBox(-22, -0.5, -46, 30, 10.5, -44, 'wall_plaster'));
  boxes.push(makeBox(30, -0.5, -48, 50, 11.5, -46, 'wall_sandstone'));

  // West outer wall (B Site -> Upper B Tunnels -> Outside B)
  boxes.push(makeBox(-48, -0.5, -46, -46, 11.0, -14, 'wall_sandstone'));
  boxes.push(makeBox(-46, -0.5, -16, -44, 10.5, 44, 'wall_sandstone'));

  // =========================================================================
  // 4. INTERIOR BUILDING MASSES & DIVIDER WALLS (Zero passage blockage!)
  // =========================================================================

  // --- T Spawn North Facade (framing Suicide) ---
  // West block between T Spawn (z=34) and Top Mid / Upper B Tunnels
  boxes.push(makeBox(-26, -0.5, 22, -8, 10.0, 34, 'wall_plaster'));
  // Left Suicide framing wall
  boxes.push(makeBox(-8, -0.5, 28, -6, 9.5, 34, 'wall_sandstone'));
  // East block between T Spawn (z=34), Outside Long (x=24), and Top Mid Connector (z=26)
  boxes.push(makeBox(8, -0.5, 26, 24, 10.2, 34, 'wall_plaster'));

  // --- Central-East Architecture Block (Between Catwalk/Mid and A Long) ---
  // South half: between Top Mid/Connector (z=18) and Long Doors (x=28)
  boxes.push(makeBox(12, -0.5, 10, 28, 10.5, 18, 'wall_sandstone'));
  // Main massive desert house between Catwalk (x=12) and A Long (x=30)
  boxes.push(makeBox(12, -0.5, -24, 30, 11.0, 12, 'wall_plaster'));
  // Short south cap between Mid-to-Short stairs (x=12) and A Long
  boxes.push(makeBox(24, -0.5, -26, 30, 9.0, -24, 'wall_sandstone'));

  // --- Long Doors Room (Bedroom) Walls, Roof & Double Doors ---
  // South wall of Long Doors Room at z=24 (entryway open at x: 31..39)
  boxes.push(makeBox(24, -0.5, 23.0, 31, 9.5, 24.5, 'wall_sandstone'));
  boxes.push(makeBox(39, -0.5, 23.0, 44, 9.5, 24.5, 'wall_sandstone'));
  boxes.push(makeBox(31, 6.2, 23.0, 39, 9.5, 24.5, 'wall_sandstone', 'none'));
  // North wall of Long Doors Room at z=12 (classic Double Doors open at x: 35.5..41.5)
  boxes.push(makeBox(28, -0.5, 11.2, 35.2, 9.5, 12.6, 'wall_sandstone'));
  boxes.push(makeBox(41.8, -0.5, 11.2, 44, 9.5, 12.6, 'wall_sandstone'));
  boxes.push(makeBox(35.2, 5.4, 11.2, 41.8, 9.5, 12.6, 'wall_sandstone', 'none'));
  // Long Doors leaves (passable center gap x: 36.4..40.6 = 4.2m wide!)
  boxes.push(makeBox(35.2, 1.5, 11.4, 36.4, 5.4, 12.1, 'door_metal', 'door'));
  boxes.push(makeBox(40.6, 1.5, 11.7, 41.8, 5.4, 12.4, 'door_metal', 'door'));
  // Long Doors Room ceiling
  boxes.push(makeBox(28, 7.6, 12, 44, 8.6, 24, 'roof', 'none'));

  // --- Central-West Architecture Block (Between Upper/Lower B Tunnels and Mid) ---
  // South of Lower B Tunnels (z=0..22, x=-26..-10)
  boxes.push(makeBox(-26, -0.5, 0, -10, 10.5, 22, 'wall_sandstone'));
  // Extra corner block between Top Mid (x=-8) and Upper B Tunnels (x=-26) at z=10..22
  boxes.push(makeBox(-10, -0.5, 10, -8, 10.5, 22, 'wall_sandstone'));
  // North of Lower B Tunnels (z=-20..-8, x=-26..-10)
  boxes.push(makeBox(-26, -0.5, -20, -10, 10.5, -8, 'wall_plaster'));
  // Cap south of B Site east of B Tunnels Exit
  boxes.push(makeBox(-30, -0.5, -16, -22, 9.5, -8, 'wall_sandstone'));
  // Cap south of B Site west of B Tunnels Exit
  boxes.push(makeBox(-46, -0.5, -16, -42, 9.5, -8, 'wall_sandstone'));

  // --- B Tunnels Roof (Indoor iconic tunnel lighting & cover) ---
  // Upper B Tunnels ceiling (with two skylight gaps so sunlight shafts enter!)
  boxes.push(makeBox(-44, 6.2, 14, -26, 7.2, 26, 'roof', 'none'));
  boxes.push(makeBox(-44, 6.2, -8, -26, 7.2, 10, 'roof', 'none'));
  // Lower B Tunnels ceiling
  boxes.push(makeBox(-26, 5.5, -8, -10, 6.5, 0, 'roof', 'none'));
  // Interior Tunnel support pillar (classic Upper B pillar cover)
  boxes.push(makeBox(-36.2, 1.8, 8.0, -33.6, 6.2, 10.6, 'wall_dark', 'wall'));

  // --- MID DOORS (中门) at z = -20 (x: -10..6) ---
  // Left stone arch pillar
  boxes.push(makeBox(-10, -0.5, -21.2, -6.2, 9.5, -18.8, 'wall_sandstone'));
  // Right stone arch pillar
  boxes.push(makeBox(0.6, -0.5, -21.2, 6.0, 9.5, -18.8, 'wall_sandstone'));
  // Arch lintel above Mid Doors
  boxes.push(makeBox(-6.2, 4.2, -21.2, 0.6, 9.5, -18.8, 'wall_sandstone', 'none'));
  // Iconic Double Mid Doors (angled/staggered leaves leaving a 2.8m walkable gap x: -4.2..-1.4!)
  boxes.push(makeBox(-6.2, 0.0, -20.6, -4.2, 4.2, -19.8, 'door_wood', 'door'));
  boxes.push(makeBox(-1.4, 0.0, -20.0, 0.6, 4.2, -19.2, 'door_wood', 'door'));

  // --- CATWALK / A SHORT PARAPETS & RETAINING WALLS ---
  // Low parapet along west edge of Catwalk overlooking Mid (y=3.0..3.85 — crouchable/peekable)
  boxes.push(makeBox(5.5, 3.0, -26, 6.2, 3.85, -8, 'wall_sandstone', 'wall'));
  // Low parapet along north edge of Catwalk overlooking CT Spawn (z=-32.5..-32, x=6..24)
  // Leave a 2.5m jump-drop gap at x=12..14.5 or low 0.7m rail you can shoot over and jump over!
  boxes.push(makeBox(6.0, 3.0, -32.6, 24.0, 3.75, -31.9, 'wall_sandstone', 'wall'));
  // Retaining wall separating Short Stairs (z=-32..-26) from CT Ramp (z=-44..-34)
  boxes.push(makeBox(18, -0.5, -34.0, 30, 3.4, -32.0, 'wall_sandstone', 'wall'));

  // --- B DOORS & B WINDOW WALL (x = -22, z: -44..-16) ---
  // South of B Doors (z: -25..-16)
  boxes.push(makeBox(-22.8, -0.5, -25.0, -21.4, 9.5, -16.0, 'wall_sandstone'));
  // B Doors Lintel (z: -31..-25)
  boxes.push(makeBox(-22.8, 4.2, -31.0, -21.4, 9.5, -25.0, 'wall_sandstone', 'none'));
  // B Doors Leaves (walkable gap z: -29.8..-26.2 = 3.6m wide!)
  boxes.push(makeBox(-22.6, 0.5, -31.0, -21.8, 4.2, -29.8, 'door_wood', 'door'));
  boxes.push(makeBox(-22.2, 0.5, -26.2, -21.4, 4.2, -25.0, 'door_wood', 'door'));
  // Pillar between B Doors and B Window (z: -35..-31)
  boxes.push(makeBox(-22.8, -0.5, -35.0, -21.4, 9.5, -31.0, 'wall_sandstone'));
  // B Window Lintel (z: -40..-35, open height 0.5..3.9m so players & bots pass/shoot cleanly)
  boxes.push(makeBox(-22.8, 3.9, -40.0, -21.4, 9.5, -35.0, 'wall_sandstone', 'none'));
  // North of B Window (z: -44..-40)
  boxes.push(makeBox(-22.8, -0.5, -44.0, -21.4, 9.5, -40.0, 'wall_sandstone'));

  // =========================================================================
  // 5. ICONIC TACTICAL COVER, CRATES & LANDMARKS
  // =========================================================================

  // --- MID X-BOX (Classic Dust2 landmark!) ---
  boxes.push(makeBox(2.8, 0.0, -6.2, 5.4, 1.9, -3.6, 'crate_wood', 'crate'));
  // Top Mid west cover crate (offset west so Suicide -> Mid Doors AWP sightline stays 100% clear!)
  boxes.push(makeBox(-7.6, 1.6, 13.5, -5.4, 3.3, 15.8, 'crate_wood', 'crate'));

  // --- A SITE COVER (Default / Triple / Site Boxes / Goose) ---
  // A Default / Triple Box stack
  boxes.push(makeBox(36.0, 3.4, -39.5, 39.2, 5.4, -36.5, 'crate_wood', 'crate'));
  boxes.push(makeBox(37.2, 5.4, -39.0, 39.0, 6.8, -37.0, 'crate_green', 'crate'));
  // A Site Front Box (near Short / Ramp)
  boxes.push(makeBox(32.5, 3.4, -33.5, 34.8, 5.0, -31.2, 'crate_green', 'crate'));
  // Goose corner cover crate
  boxes.push(makeBox(44.2, 3.4, -44.5, 46.8, 5.0, -42.2, 'crate_wood', 'crate'));

  // --- A LONG COVER (Blue / Pit Cover / Long Car / Corner Box) ---
  // Long Corner blue dumpster/crate
  boxes.push(makeBox(30.4, 1.5, -11.5, 32.8, 3.3, -8.5, 'crate_green', 'crate'));
  // A Long Car (classic procedural vehicle cover on east side of Long)
  boxes.push(makeBox(44.0, 1.5, -13.0, 47.4, 2.7, -7.8, 'car_metal', 'crate'));
  boxes.push(makeBox(44.3, 2.7, -11.8, 47.1, 3.55, -9.0, 'car_metal', 'crate'));
  // A Pit lip / cover box (southeast A Long)
  boxes.push(makeBox(42.5, 1.5, 4.0, 46.5, 2.7, 6.2, 'crate_wood', 'crate'));
  // Outside Long crates
  boxes.push(makeBox(26.5, 3.0, 30.0, 29.0, 4.8, 32.5, 'crate_wood', 'crate'));

  // --- B SITE COVER (Double Stack / Big Box / Car / Fence) ---
  // B Double Stack (center of B Site)
  boxes.push(makeBox(-35.5, 0.5, -31.0, -32.2, 2.5, -28.0, 'crate_wood', 'crate'));
  boxes.push(makeBox(-34.8, 2.5, -30.5, -32.7, 4.0, -28.5, 'crate_green', 'crate'));
  // B Big Box (west side near Back Plat)
  boxes.push(makeBox(-40.5, 0.5, -35.8, -37.5, 2.6, -32.8, 'crate_wood', 'crate'));
  // B Car (near B Tunnels exit)
  boxes.push(makeBox(-44.8, 0.5, -23.5, -41.8, 1.7, -18.5, 'car_metal', 'crate'));
  boxes.push(makeBox(-44.4, 1.7, -22.4, -42.1, 2.5, -19.6, 'car_metal', 'crate'));
  // B Doors inside cover crate
  boxes.push(makeBox(-27.2, 0.5, -24.5, -24.8, 2.1, -22.2, 'crate_green', 'crate'));

  // --- CT MID & CT SPAWN COVER ---
  // CT Mid double crate (gives cover when crossing Mid Doors)
  boxes.push(makeBox(-12.5, 0.0, -34.5, -9.8, 1.8, -32.0, 'crate_green', 'crate'));
  // CT Spawn crate
  boxes.push(makeBox(8.0, 0.0, -42.0, 10.8, 1.7, -39.5, 'crate_wood', 'crate'));

  // --- T SPAWN DECORATIVE COVER ---
  boxes.push(makeBox(-14.0, 3.0, 39.5, -11.5, 4.7, 42.0, 'crate_wood', 'crate'));
  boxes.push(makeBox(11.5, 3.0, 39.5, 14.0, 4.7, 42.0, 'crate_wood', 'crate'));

  // --- BOMB SITE VISUAL FLOOR MARKERS (non-solid thin decals) ---
  boxes.push(makeBox(32.0, 3.41, -43.5, 44.5, 3.44, -30.5, 'site_a', 'none', false));
  boxes.push(makeBox(-41.5, 0.51, -39.0, -27.0, 0.54, -24.5, 'site_b', 'none', false));

  // =========================================================================
  // 6. PLANT ZONES, BUY ZONES, CALLOUTS & SPAWN POINTS
  // =========================================================================

  const plantZones: ZoneRect[] = [
    { name: 'A Site', site: 'A', x1: 31.5, z1: -44.0, x2: 45.0, z2: -30.0, floorY: 3.4 },
    { name: 'B Site', site: 'B', x1: -42.0, z1: -39.5, x2: -26.5, z2: -24.0, floorY: 0.5 },
  ];

  const buyZones: Record<Team, ZoneRect> = {
    CT: { name: 'CT Spawn', x1: 1.0, z1: -44.0, x2: 20.0, z2: -31.0, floorY: 0.0 },
    T: { name: 'T Spawn', x1: -24.0, z1: 34.0, x2: 24.0, z2: 48.0, floorY: 3.0 },
  };

  const callouts: ZoneRect[] = [
    { name: 'T 出生点 (T Spawn)', x1: -24, z1: 34, x2: 24, z2: 48, floorY: 3.0 },
    { name: 'CT 出生点 (CT Spawn)', x1: 4, z1: -44, x2: 20, z2: -32, floorY: 0.0 },
    { name: 'A点 (A Site)', x1: 30, z1: -46, x2: 48, z2: -28, floorY: 3.4 },
    { name: 'A大斜坡 (A Ramp)', x1: 30, z1: -28, x2: 48, z2: -16, floorY: 2.4 },
    { name: 'A大 (A Long)', x1: 30, z1: -16, x2: 48, z2: 12, floorY: 1.5 },
    { name: 'A大房 (Long Doors)', x1: 28, z1: 12, x2: 44, z2: 24, floorY: 2.2 },
    { name: 'A大外 (Outside Long)', x1: 24, z1: 24, x2: 44, z2: 42, floorY: 3.0 },
    { name: '猫道 (Catwalk / A Short)', x1: 6, z1: -32, x2: 30, z2: -6, floorY: 3.0 },
    { name: '猫道楼梯 (Short Stairs)', x1: 6, z1: -6, x2: 12, z2: 10, floorY: 2.3 },
    { name: '中门 (Mid Doors)', x1: -10, z1: -24, x2: 6, z2: -16, floorY: 0.0 },
    { name: '中路 (Mid)', x1: -10, z1: -16, x2: 6, z2: 10, floorY: 0.5 },
    { name: '中路高台 (Top Mid)', x1: -8, z1: 10, x2: 12, z2: 34, floorY: 2.0 },
    { name: 'CT中路 (CT Mid)', x1: -22, z1: -44, x2: 4, z2: -20, floorY: 0.0 },
    { name: 'B洞下层 (Lower Tunnels)', x1: -26, z1: -8, x2: -10, z2: 0, floorY: 0.9 },
    { name: 'B洞上层 (Upper Tunnels)', x1: -44, z1: -16, x2: -26, z2: 28, floorY: 1.8 },
    { name: 'B洞外 (Outside Tunnels)', x1: -44, z1: 28, x2: -24, z2: 42, floorY: 2.4 },
    { name: 'B点 (B Site)', x1: -46, z1: -44, x2: -22, z2: -16, floorY: 0.5 },
  ];

  const spawns: Record<Team, SpawnPoint[]> = {
    CT: [
      { x: 13.5, y: 0.0, z: -38.5, yaw: Math.PI * 0.5 },
      { x: 11.0, y: 0.0, z: -35.5, yaw: Math.PI * 0.5 },
      { x: 6.5, y: 0.0, z: -37.5, yaw: Math.PI * 0.5 },
      { x: 15.5, y: 0.0, z: -41.5, yaw: -Math.PI * 0.4 },
      { x: 5.5, y: 0.0, z: -41.5, yaw: Math.PI * 0.55 },
    ],
    T: [
      { x: 0.5, y: 3.0, z: 42.5, yaw: 0 },
      { x: -5.5, y: 3.0, z: 43.0, yaw: 0 },
      { x: 6.5, y: 3.0, z: 43.0, yaw: 0 },
      { x: -16.5, y: 3.0, z: 43.5, yaw: 0.4 },
      { x: 17.5, y: 3.0, z: 43.5, yaw: -0.4 },
    ],
  };

  return { boxes, ramps, plantZones, buyZones, callouts, spawns };
}

export function getCalloutAt(map: Dust2MapData, x: number, z: number): string {
  for (const c of map.callouts) {
    if (x >= c.x1 && x <= c.x2 && z >= c.z1 && z <= c.z2) {
      return c.name;
    }
  }
  return 'Dust2';
}

export function getPlantZoneAt(map: Dust2MapData, x: number, y: number, z: number): 'A' | 'B' | null {
  for (const pz of map.plantZones) {
    if (
      x >= pz.x1 &&
      x <= pz.x2 &&
      z >= pz.z1 &&
      z <= pz.z2 &&
      Math.abs(y - pz.floorY) < 1.6
    ) {
      return pz.site ?? null;
    }
  }
  return null;
}

export function isInBuyZone(map: Dust2MapData, team: Team, x: number, z: number): boolean {
  const bz = map.buyZones[team];
  return x >= bz.x1 && x <= bz.x2 && z >= bz.z1 && z <= bz.z2;
}
