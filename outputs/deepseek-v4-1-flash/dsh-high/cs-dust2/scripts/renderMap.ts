// Renders the walkable map grid (plus sites/spawns) to a PNG so the layout can
// be inspected without a browser. Pure Node, no external image libraries.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { buildMapData } from '../src/world/mapLayout';

const map = buildMapData();
const S = 8; // pixels per cell
const W = map.width * S;
const H = map.height * S;
const rgba = Buffer.alloc(W * H * 4);

function put(px: number, py: number, r: number, g: number, b: number, a = 255) {
  if (px < 0 || py < 0 || px >= W || py >= H) return;
  const i = (py * W + px) * 4;
  rgba[i] = r;
  rgba[i + 1] = g;
  rgba[i + 2] = b;
  rgba[i + 3] = a;
}

function fillCell(gx: number, gz: number, r: number, g: number, b: number) {
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(gx * S + x, gz * S + y, r, g, b);
}

// Background.
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(x, y, 14, 18, 24);

// Walkable cells.
for (let gz = 0; gz < map.height; gz++) {
  for (let gx = 0; gx < map.width; gx++) {
    if (map.walkable[gz * map.width + gx]) fillCell(gx, gz, 168, 184, 202);
  }
}

const toCellX = (x: number) => Math.floor(x / map.cell + map.width / 2);
const toCellZ = (z: number) => Math.floor(z / map.cell + map.height / 2);

// Sites.
for (const [r, col] of [
  [map.sites.A, [230, 80, 80]] as const,
  [map.sites.B, [80, 140, 230]] as const,
] as const) {
  for (let gz = toCellZ(r.minZ); gz <= toCellZ(r.maxZ); gz++) {
    for (let gx = toCellX(r.minX); gx <= toCellX(r.maxX); gx++) {
      if (gx < 0 || gz < 0 || gx >= map.width || gz >= map.height) continue;
      if (!map.walkable[gz * map.width + gx]) continue;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(gx * S + x, gz * S + y, col[0], col[1], col[2]);
    }
  }
}

// Crates (colliders that are not full-height walls).
for (const c of map.colliders) {
  if (c.maxY >= 4) continue;
  for (let gz = toCellZ(c.minZ); gz <= toCellZ(c.maxZ); gz++) {
    for (let gx = toCellX(c.minX); gx <= toCellX(c.maxX); gx++) {
      if (gx < 0 || gz < 0 || gx >= map.width || gz >= map.height) continue;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(gx * S + x, gz * S + y, 150, 105, 55);
    }
  }
}

// Spawns.
const dot = (x: number, z: number, r: number, g: number, b: number) => {
  const px = toCellX(x) * S + S / 2;
  const py = toCellZ(z) * S + S / 2;
  for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
    if (dx * dx + dy * dy > 9) continue;
    put(px + dx, py + dy, r, g, b);
  }
};
for (const s of map.tSpawns) dot(s.x, s.z, 240, 200, 110);
for (const s of map.ctSpawns) dot(s.x, s.z, 110, 160, 255);

// --- PNG encoding -----------------------------------------------------------
const raw = Buffer.alloc(H * (W * 4 + 1));
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0;
  rgba.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4);
}
const zlib = deflateSync(raw, { level: 9 });

const crcTable: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 6;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync('map-layout.png', png);
console.log(`wrote map-layout.png (${W}x${H})`);
