// Procedural Dust2 layout (meters). Top-down: +X = east, +Z = south.
// T spawn is in the south, CT spawn in the north, A site north-east, B site north-west.
//
//   B site ─ B doors ─ CT spawn ─ CT→A ─ A site
//     │                  │                 │  │
//   B tunnel           CT mid ─ short ─┘  A ramp
//     │                  │ (mid doors)       │
//   upper tunnels ─ lower tunnels ─ mid ─ catwalk   Long A
//     │                  │                  │
//   T→tunnels ─────── T spawn ───── outside long ─ long doors

import { MapBuilder, FLOOR, type MapData } from './MapData';

export function buildDust2(): MapData {
  const b = new MapBuilder(120, 132);
  const { SAND, STONE, CONCRETE, TILE } = FLOOR;

  // ---------------- T side ----------------
  b.floor(44, 112, 80, 130, 0, SAND); // T spawn
  b.floor(52, 100, 64, 112, 0, SAND); // T spawn -> top mid
  b.floor(48, 92, 66, 104, 0, SAND); // top mid (suicide)

  // ---------------- Mid ----------------
  b.floor(52, 48, 62, 100, 0, SAND); // mid
  b.floor(52, 42, 62, 48, 0, CONCRETE); // mid doors zone
  b.carve(52, 45, 54, 46).carve(60, 45, 62, 46); // door frame pillars
  b.ramp(52, 34, 62, 42, 'z', 1.5, 0, SAND); // CT mid ramp (up toward CT)
  b.floor(52, 26, 62, 34, 1.5, SAND); // CT mid top

  // ---------------- CT ----------------
  b.floor(44, 8, 74, 26, 1.5, TILE); // CT spawn
  b.floor(74, 10, 82, 22, 1.5, SAND); // CT -> A

  // ---------------- A ----------------
  b.floor(82, 6, 114, 32, 1.5, STONE); // A site
  b.ramp(100, 32, 110, 40, 'z', 1.5, 0, SAND); // A ramp (long -> site)
  b.floor(96, 40, 112, 96, 0, SAND); // Long A
  b.floor(99, 96, 104, 108, 0, CONCRETE); // long doors passage
  b.floor(80, 108, 108, 120, 0, SAND); // outside long

  // ---------------- Catwalk / short ----------------
  b.ramp(62, 64, 68, 70, 'x', 0, 1.5, CONCRETE); // cat stairs from mid
  b.floor(68, 34, 75, 70, 1.5, CONCRETE); // catwalk
  b.floor(68, 28, 82, 34, 1.5, STONE); // A short

  // ---------------- B ----------------
  b.floor(24, 114, 44, 120, 0, CONCRETE); // T -> tunnels
  b.floor(18, 80, 26, 120, 0, CONCRETE); // upper tunnels
  b.floor(26, 80, 52, 86, 0, CONCRETE); // lower tunnels (to mid)
  b.floor(15, 50, 23, 80, 0, CONCRETE); // B tunnel exit
  b.floor(6, 8, 34, 50, 0, STONE); // B site
  b.floor(34, 16, 38, 22, 0, CONCRETE); // B doors
  b.ramp(38, 14, 44, 24, 'x', 0, 1.5, SAND); // CT -> B ramp

  // ---------------- Doors (passable gaps) + lintels ----------------
  // Mid doors: left leaf closed, right leaf swung open -> 2.6m walkable gap.
  b.box(54, 0, 45.4, 57.1, 3.3, 45.6, 'door');
  b.box(59.75, 0, 45.5, 59.95, 3.3, 48.0, 'door');
  b.box(54, 3.4, 44.9, 60, 6.6, 46.1, 'lintel');
  // Long doors
  b.box(99.0, 0, 100.5, 99.2, 3.3, 103.0, 'door');
  b.box(101.8, 0, 101.0, 104, 3.3, 101.2, 'door');
  b.box(99, 3.4, 100.6, 104, 6.6, 101.6, 'lintel');
  // B doors
  b.box(35.4, 0, 16, 35.6, 3.3, 18.4, 'door');
  b.box(35.6, 0, 21.8, 38, 3.3, 22, 'door');
  b.box(35, 3.4, 16, 36, 6.6, 22, 'lintel');
  // A short arch + CT->A arch (visual landmarks)
  b.box(80.5, 3.6, 28, 82, 6.6, 34, 'lintel');
  b.box(74, 3.8, 10, 75.5, 6.6, 22, 'lintel');

  // ---------------- Tunnel roofs ----------------
  b.box(18, 3.9, 84, 26, 7.0, 114, 'ceiling');
  b.box(26, 3.9, 114, 40, 7.0, 120, 'ceiling');
  b.box(28, 3.9, 80, 50, 7.0, 86, 'ceiling');
  b.box(15, 3.9, 60, 23, 7.0, 80, 'ceiling');

  // ---------------- Cover ----------------
  // A site
  b.crate(95, 12, 98, 15, 2.2, 'crate');
  b.crate(98, 12, 100, 14, 1.1, 'crateDark');
  b.crate(89, 20, 91.5, 22.5, 1.1);
  b.crate(85, 8, 87.5, 10.5, 1.2);
  b.crate(105, 26, 108, 28.5, 1.0, 'crateDark');
  b.crate(110, 8, 113, 11, 2.2);
  // Long A
  b.crate(107, 54, 111, 62, 2.8, 'metal');
  b.crate(97, 72, 99.5, 74.5, 1.1);
  b.crate(97, 42, 99.5, 44.5, 1.2);
  b.crate(109, 84, 111.5, 86.5, 1.2);
  b.crate(86, 116, 88.5, 118.5, 1.2);
  // Mid
  b.crate(58.5, 60, 61, 62.5, 1.3, 'crateDark'); // xbox
  b.crate(49, 94, 51.5, 96.5, 1.2);
  b.crate(63, 96, 65.5, 98.5, 1.1);
  b.crate(52.5, 27, 54.5, 29, 1.1);
  // CT spawn
  b.crate(45, 9, 47.5, 11.5, 1.2);
  b.crate(70, 22, 72.5, 24.5, 1.2);
  // T spawn
  b.crate(45, 126, 47.5, 128.5, 1.2);
  b.crate(76, 125, 78.5, 127.5, 1.2);
  b.crate(53, 113, 55.5, 115.5, 1.1);
  // B site
  b.crate(11, 14, 14, 17, 2.2);
  b.crate(14, 14, 16, 16, 1.1, 'crateDark');
  b.crate(24, 26, 26.5, 28.5, 1.1);
  b.crate(26.5, 26, 29, 28.5, 2.2);
  b.crate(7, 38, 9.5, 40.5, 1.1);
  b.crate(28, 42, 32.5, 44.5, 1.4, 'metal');
  b.crate(7, 9, 9.5, 11.5, 1.2);
  b.crate(30, 10, 32.5, 12.5, 1.2);
  // Tunnels
  b.crate(19, 104, 21, 106, 1.1, 'crateDark');
  b.crate(16.5, 56, 18.5, 58, 1.0, 'crateDark');
  b.crate(36, 84, 38.5, 86, 1.0, 'crateDark');

  return b.finish({
    sites: {
      A: { x0: 84, z0: 7, x1: 113, z1: 31 },
      B: { x0: 7, z0: 9, x1: 33, z1: 47 },
    },
    spawns: {
      T: [
        { x: 58, z: 121 },
        { x: 61, z: 123.5 },
        { x: 64, z: 121 },
        { x: 67, z: 123.5 },
        { x: 62, z: 126.5 },
      ],
      CT: [
        { x: 52, z: 14 },
        { x: 55, z: 17 },
        { x: 58, z: 14 },
        { x: 61, z: 17 },
        { x: 56, z: 20.5 },
      ],
    },
    waypoints: {
      tSpawn: { x: 62, z: 121 },
      outsideLong: { x: 92, z: 113 },
      longDoorsOut: { x: 100.6, z: 106 },
      longDoorsIn: { x: 100.6, z: 93 },
      longMid: { x: 103, z: 70 },
      longCorner: { x: 104, z: 48 },
      aRamp: { x: 105, z: 36 },
      aSite: { x: 96, z: 20 },
      topMid: { x: 57, z: 100 },
      midMid: { x: 56, z: 78 },
      catStairs: { x: 64, z: 67 },
      catMid: { x: 71.5, z: 52 },
      catTop: { x: 71.5, z: 31 },
      aShort: { x: 84, z: 29 },
      tunnelEntry: { x: 32, z: 117 },
      upperTunnel: { x: 22, z: 100 },
      tunnelJunction: { x: 21.5, z: 82.5 },
      bTunnel: { x: 19, z: 66 },
      bEntrance: { x: 19, z: 48 },
      bSite: { x: 20, z: 30 },
      lowerTunnel: { x: 40, z: 82.5 },
      midDoors: { x: 58.4, z: 46 },
      ctMid: { x: 57, z: 30 },
      ctSpawn: { x: 58, z: 17 },
      ctToA: { x: 78, z: 16 },
      bDoors: { x: 36, z: 20 },
      bRamp: { x: 41, z: 19 },
    },
    routes: {
      A_long: { site: 'A', points: ['outsideLong', 'longDoorsOut', 'longDoorsIn', 'longMid', 'longCorner', 'aRamp'] },
      A_short: { site: 'A', points: ['topMid', 'midMid', 'catStairs', 'catMid', 'catTop', 'aShort'] },
      B_tunnels: { site: 'B', points: ['tunnelEntry', 'upperTunnel', 'tunnelJunction', 'bTunnel', 'bEntrance'] },
      B_mid: { site: 'B', points: ['topMid', 'midMid', 'lowerTunnel', 'tunnelJunction', 'bTunnel', 'bEntrance'] },
    },
    plantSpots: {
      A: [
        { x: 92, z: 17 },
        { x: 101.5, z: 18 },
        { x: 88, z: 14 },
      ],
      B: [
        { x: 19, z: 22 },
        { x: 14, z: 26 },
        { x: 22, z: 35 },
      ],
    },
    holdSpots: [
      { name: 'A Long', pos: { x: 103, z: 27 }, look: { x: 104, z: 60 }, site: 'A' },
      { name: 'A Short', pos: { x: 88, z: 24 }, look: { x: 76, z: 31 }, site: 'A' },
      { name: 'A Site', pos: { x: 93, z: 9.5 }, look: { x: 104, z: 34 }, site: 'A' },
      { name: 'Mid', pos: { x: 57, z: 29.5 }, look: { x: 57, z: 60 }, site: 'MID' },
      { name: 'B Site', pos: { x: 10, z: 24 }, look: { x: 19, z: 52 }, site: 'B' },
      { name: 'B Plat', pos: { x: 28, z: 38 }, look: { x: 19, z: 52 }, site: 'B' },
      { name: 'B Doors', pos: { x: 30, z: 19 }, look: { x: 19, z: 48 }, site: 'B' },
    ],
    callouts: [
      { name: 'T出生点', rect: { x0: 44, z0: 112, x1: 80, z1: 130 } },
      { name: 'A大外', rect: { x0: 80, z0: 108, x1: 108, z1: 120 } },
      { name: 'A大门', rect: { x0: 99, z0: 96, x1: 104, z1: 108 } },
      { name: 'A大', rect: { x0: 96, z0: 40, x1: 112, z1: 96 } },
      { name: 'A坡', rect: { x0: 100, z0: 32, x1: 110, z1: 40 } },
      { name: 'A点', rect: { x0: 82, z0: 6, x1: 114, z1: 32 } },
      { name: 'A小', rect: { x0: 68, z0: 28, x1: 82, z1: 34 } },
      { name: '猫道', rect: { x0: 62, z0: 34, x1: 75, z1: 70 } },
      { name: 'CT出生点', rect: { x0: 44, z0: 8, x1: 82, z1: 26 } },
      { name: '中门', rect: { x0: 52, z0: 42, x1: 62, z1: 48 } },
      { name: 'CT中', rect: { x0: 52, z0: 26, x1: 62, z1: 42 } },
      { name: '中路', rect: { x0: 48, z0: 48, x1: 66, z1: 112 } },
      { name: '下洞', rect: { x0: 26, z0: 80, x1: 52, z1: 86 } },
      { name: 'B洞', rect: { x0: 14, z0: 50, x1: 26, z1: 120 } },
      { name: 'B洞口', rect: { x0: 24, z0: 114, x1: 44, z1: 120 } },
      { name: 'B门', rect: { x0: 34, z0: 14, x1: 44, z1: 24 } },
      { name: 'B点', rect: { x0: 6, z0: 8, x1: 34, z1: 50 } },
    ],
    labels: [
      { text: 'A', pos: { x: 98, z: 20 } },
      { text: 'B', pos: { x: 20, z: 28 } },
      { text: 'T', pos: { x: 62, z: 121 } },
      { text: 'CT', pos: { x: 58, z: 16 } },
      { text: '中门', pos: { x: 57, z: 50 } },
      { text: '中路', pos: { x: 57, z: 78 } },
      { text: '猫道', pos: { x: 71.5, z: 58 } },
      { text: 'A大', pos: { x: 104, z: 70 } },
      { text: 'B洞', pos: { x: 22, z: 100 } },
    ],
  });
}
