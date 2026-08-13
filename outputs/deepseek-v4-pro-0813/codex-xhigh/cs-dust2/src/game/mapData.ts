export interface ColliderSpec {
  id: string;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: number;
  penetrable?: boolean;
  crate?: boolean;
  label?: string;
}

export interface SiteZone {
  id: 'A' | 'B';
  x: number;
  z: number;
  radius: number;
  color: number;
  label: string;
}

export interface NavNode {
  id: string;
  x: number;
  z: number;
  region: string;
}

const wall = (
  id: string,
  x: number,
  z: number,
  w: number,
  d: number,
  h = 4,
  color = 0xb9a47a,
  penetrable = false,
  label?: string,
): ColliderSpec => ({ id, x, z, w, d, h, color, penetrable, label });

const crate = (
  id: string,
  x: number,
  z: number,
  w = 1.7,
  d = 1.7,
  h = 1.35,
  color = 0x806b49,
): ColliderSpec => ({ id, x, z, w, d, h, color, crate: true });

export const MAP_EXTENT = 62;
export const GROUND_HEIGHT = 0;
export const AGENT_RADIUS = 0.34;
export const AGENT_HEIGHT = 1.78;
export const EYE_HEIGHT = 1.62;

export const WALL_SPECS: ColliderSpec[] = [
  wall('outer-north', 0, -MAP_EXTENT + 1.5, MAP_EXTENT * 2 + 8, 3, 8),
  wall('outer-south', 0, MAP_EXTENT - 1.5, MAP_EXTENT * 2 + 8, 3, 8),
  wall('outer-west', -MAP_EXTENT + 1.5, 0, 3, MAP_EXTENT * 2 + 8, 8),
  wall('outer-east', MAP_EXTENT - 1.5, 0, 3, MAP_EXTENT * 2 + 8, 8),

  // A long: a broad corridor along the north edge from T spawn to A site.
  wall('a-long-north', -20, 47, 74, 4, 5, 0xb19a69, false, 'A大'),
  wall('a-long-south', -38, 29, 30, 3, 4.5, 0xa68c5b, false, 'A大'),
  wall('a-long-east-jamb', 21, 33, 3, 7, 4.5, 0x9e8252, false, 'A大'),

  // A site perimeter and interior cover. The open west/south edges connect to CT and cat.
  wall('a-site-west', -53, 18, 3, 42, 5.5, 0x9b8053, false, 'A点'),
  wall('a-site-north', -42, 29, 27, 3, 5, 0xa68b5e, false, 'A点'),
  wall('a-site-south-west', -50, 7, 7, 3, 5, 0xa68b5e, false, 'A点'),
    crate('a-crate-1', -43, 22, 1.8, 1.8),
  crate('a-crate-2', -31, 15, 1.4, 1.4),
  crate('a-crate-3', -35, 23, 1.5, 1.5),
  crate('a-crate-4', -45, 15, 1.4, 1.4),

  // CT spawn is a pocket behind A site, linked to middle through the open south side.
  wall('ct-back', -50, -18, 3, 30, 5.5, 0xa2a9af, false, 'CT出生点'),
  wall('ct-south', -41, -12, 24, 3, 5, 0x919aa0, false, 'CT出生点'),
  crate('ct-crate-1', -43, -8, 1.5, 1.5),
  crate('ct-crate-2', -43, 1, 1.3, 1.3),

  // Middle courtyard and the penetrable mid doors. Players cannot walk through,
  // but hitscan rounds can punch through the thin door panel.
      wall('mid-doors', 5, -1, 1.5, 19, 4.8, 0x74603f, true, '中门门体'),
  crate('mid-crate-1', -12, 5, 1.5, 1.5),
  crate('mid-crate-2', -6, 9, 1.3, 1.3),

  // Catwalk is an open approach from middle to A site.
  wall('cat-south', -35, 1, 12, 3, 4.5, 0x8e754d, false, '猫道'),
  crate('cat-crate', -25, 9, 1.4, 1.4),

  // B tunnels: the long east corridor from T spawn down to B site.
  wall('b-tunnel-west-south', 24, -24, 3, 10, 5, 0xa18455, false, 'B洞'),
  wall('b-tunnel-west-north', 24, 10, 3, 16, 5, 0xa18455, false, 'B洞'),
  wall('b-tunnel-east', 55, -8, 4, 56, 5, 0xa18455, false, 'B洞'),
  crate('b-tunnel-crate', 48, 12, 1.5, 1.5),

  // B site is a boxed pit at the bottom of the tunnel, with crates for cover.
  wall('b-site-south', 36, -40, 45, 3, 5, 0x9b7d50, false, 'B点'),
  wall('b-site-west-south', 18, -28, 3, 18, 5, 0x9b7d50, false, 'B点'),
  wall('b-site-west-north', 18, 5, 3, 10, 5, 0x9b7d50, false, 'B点'),
  wall('b-site-east', 55, -27, 4, 30, 5, 0x9b7d50, false, 'B点'),
  crate('b-crate-1', 35, -25, 1.7, 1.7),
  crate('b-crate-2', 40, -21, 1.4, 1.4),
  crate('b-crate-3', 30, -28, 1.5, 1.5),

  // Lower tunnel connects the south side of T spawn to middle/B tunnels.
  ];

export const SITE_ZONES: SiteZone[] = [
  { id: 'A', x: -39, z: 18, radius: 8.5, color: 0xb36a3a, label: 'A点' },
  { id: 'B', x: 35, z: -28, radius: 8.5, color: 0xb36a3a, label: 'B点' },
];

export const NAV_NODES: NavNode[] = [
  { id: 'tSpawn', x: 28, z: 40, region: 'T出生点' },
  { id: 'aLong', x: 7, z: 40, region: 'A大' },
  { id: 'aSite', x: -39, z: 18, region: 'A点' },
  { id: 'ctSpawn', x: -48, z: -5, region: 'CT出生点' },
  { id: 'mid', x: -12, z: 0, region: '中门' },
  { id: 'cat', x: -27, z: 9, region: '猫道' },
  { id: 'midSouth', x: 0, z: -30, region: '中门' },
  { id: 'lowerTunnel', x: 27, z: 0, region: 'B洞' },
  { id: 'bTunnelTop', x: 43, z: 31, region: 'B洞' },
  { id: 'bTunnelMid', x: 43, z: 3, region: 'B洞' },
  { id: 'bTunnelBottom', x: 40, z: -17, region: 'B洞' },
  { id: 'bSite', x: 35, z: -28, region: 'B点' },
];

export const NAV_EDGES: Array<[string, string]> = [
  ['tSpawn', 'aLong'],
  ['tSpawn', 'bTunnelTop'],
  ['tSpawn', 'lowerTunnel'],
  ['aLong', 'aSite'],
  ['aSite', 'ctSpawn'],
  ['aSite', 'cat'],
  ['ctSpawn', 'mid'],
  ['mid', 'cat'],
  ['mid', 'midSouth'],
  ['midSouth', 'lowerTunnel'],
  ['lowerTunnel', 'bTunnelMid'],
  ['bTunnelTop', 'bTunnelMid'],
  ['bTunnelMid', 'bTunnelBottom'],
  ['bTunnelBottom', 'bSite'],
];

export const TEAM_SPAWNS: Record<'CT' | 'T', Array<[number, number]>> = {
  CT: [
    [-50, -6],
    [-48, 2],
    [-43, -9],
    [-53, 4],
    [-46, -14],
  ],
  T: [
    [29, 41],
    [36, 44],
    [22, 44],
    [28, 34],
    [41, 36],
  ],
};

export const MINIMAP_POLYGON: Array<[number, number]> = [
  [-56, -48],
  [-52, -36],
  [-49, -12],
  [-55, 6],
  [-51, 26],
  [-34, 34],
  [-14, 48],
  [12, 48],
  [24, 35],
  [19, 22],
  [4, 12],
  [5, -9],
  [20, -4],
  [32, 13],
  [36, 30],
  [52, 33],
  [56, 18],
  [53, -16],
  [37, -34],
  [19, -39],
  [1, -30],
  [-8, -23],
  [-25, -10],
  [-36, -16],
  [-48, -21],
  [-54, -39],
];

export const SITE_LABELS: Array<{ id: string; x: number; z: number; label: string }> = [
  { id: 'A', x: -39, z: 25, label: 'A点' },
  { id: 'B', x: 35, z: -20, label: 'B点' },
  { id: 'mid', x: -2, z: 0, label: '中门' },
  { id: 'cat', x: -24, z: 10, label: '猫道' },
  { id: 'aLong', x: 7, z: 44, label: 'A大' },
  { id: 'tSpawn', x: 30, z: 39, label: 'T出生点' },
  { id: 'ctSpawn', x: -48, z: -4, label: 'CT出生点' },
  { id: 'bTunnel', x: 46, z: 5, label: 'B洞' },
];
