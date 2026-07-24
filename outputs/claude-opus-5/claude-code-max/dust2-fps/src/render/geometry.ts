/**
 * Procedural geometry helpers.
 *
 * There are no model files in this project, so everything is assembled from boxes and
 * quads at runtime. `GeometryBuilder` accumulates triangles with per-vertex colours, which
 * lets the entire map collapse into a single draw call while still looking varied.
 */

import * as THREE from 'three';

const c = new THREE.Color();

/** Converts an sRGB hex to the renderer's linear working space. */
export function linearRGB(hex: number): [number, number, number] {
  c.setHex(hex, THREE.SRGBColorSpace);
  return [c.r, c.g, c.b];
}

export class GeometryBuilder {
  private positions: number[] = [];
  private normals: number[] = [];
  private colors: number[] = [];
  private uvs: number[] = [];

  get triangleCount(): number {
    return this.positions.length / 9;
  }

  addTriangle(
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
    color: [number, number, number],
    uvScale = 0.25,
  ): void {
    const ux = bx - ax;
    const uy = by - ay;
    const uz = bz - az;
    const vx = cx - ax;
    const vy = cy - ay;
    const vz = cz - az;
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len;
    ny /= len;
    nz /= len;

    this.positions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    for (let i = 0; i < 3; i++) {
      this.normals.push(nx, ny, nz);
      this.colors.push(color[0], color[1], color[2]);
    }
    // Cheap triplanar-ish UVs so surface detail follows world size.
    const absN = [Math.abs(nx), Math.abs(ny), Math.abs(nz)];
    const axis = absN[0] > absN[1] && absN[0] > absN[2] ? 0 : absN[1] > absN[2] ? 1 : 2;
    const pick = (x: number, y: number, z: number): [number, number] =>
      axis === 0 ? [z, y] : axis === 1 ? [x, z] : [x, y];
    for (const [px, py, pz] of [
      [ax, ay, az],
      [bx, by, bz],
      [cx, cy, cz],
    ]) {
      const [u, v] = pick(px, py, pz);
      this.uvs.push(u * uvScale, v * uvScale);
    }
  }

  /** Quad given in counter-clockwise order when viewed from the front face. */
  addQuad(
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    color: [number, number, number],
    uvScale = 0.25,
  ): void {
    this.addTriangle(...p0, ...p1, ...p2, color, uvScale);
    this.addTriangle(...p0, ...p2, ...p3, color, uvScale);
  }

  /** Axis aligned box. `shade` darkens the side faces so flat colours still read as 3D. */
  addBox(
    x0: number, y0: number, z0: number,
    x1: number, y1: number, z1: number,
    color: [number, number, number],
    shade = true,
    uvScale = 0.25,
  ): void {
    const top = color;
    const sideA: [number, number, number] = shade
      ? [color[0] * 0.82, color[1] * 0.82, color[2] * 0.82]
      : color;
    const sideB: [number, number, number] = shade
      ? [color[0] * 0.68, color[1] * 0.68, color[2] * 0.68]
      : color;
    const bottom: [number, number, number] = shade
      ? [color[0] * 0.5, color[1] * 0.5, color[2] * 0.5]
      : color;

    // +Y
    this.addQuad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], top, uvScale);
    // -Y
    this.addQuad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], bottom, uvScale);
    // +Z
    this.addQuad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], sideA, uvScale);
    // -Z
    this.addQuad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], sideA, uvScale);
    // +X
    this.addQuad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], sideB, uvScale);
    // -X
    this.addQuad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], sideB, uvScale);
  }

  /**
   * Floor quad with independent corner heights, used for sloped sectors (ramps and
   * stairs), plus a skirt down to `skirtY` so ledges are solid from every angle.
   */
  addFloor(
    x0: number, z0: number, x1: number, z1: number,
    y00: number, y10: number, y11: number, y01: number,
    skirtY: number,
    top: [number, number, number],
    side: [number, number, number],
  ): void {
    // Corners: 00 = (x0,z0), 10 = (x1,z0), 11 = (x1,z1), 01 = (x0,z1)
    this.addQuad([x0, y01, z1], [x1, y11, z1], [x1, y10, z0], [x0, y00, z0], top, 0.22);
    this.addQuad([x0, skirtY, z1], [x1, skirtY, z1], [x1, y11, z1], [x0, y01, z1], side, 0.22);
    this.addQuad([x1, skirtY, z0], [x0, skirtY, z0], [x0, y00, z0], [x1, y10, z0], side, 0.22);
    this.addQuad([x1, skirtY, z1], [x1, skirtY, z0], [x1, y10, z0], [x1, y11, z1], side, 0.22);
    this.addQuad([x0, skirtY, z0], [x0, skirtY, z1], [x0, y01, z1], [x0, y00, z0], side, 0.22);
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    g.computeBoundingSphere();
    return g;
  }
}

/**
 * Generates a subtle noise texture on a canvas so large flat surfaces are not perfectly
 * uniform. Canvas textures count as procedural — no asset files involved.
 */
export function noiseTexture(size = 128, contrast = 26, base = 210): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = (i / size) | 0;
    // Value noise + a few speckles to imply sand grain.
    const n =
      Math.sin(x * 0.31) * Math.cos(y * 0.27) * 0.5 +
      Math.sin((x + y) * 0.13) * 0.3 +
      (Math.random() - 0.5) * 0.9;
    const v = Math.max(0, Math.min(255, base + n * contrast));
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Renders text (bomb site letters) into a texture. */
export function textTexture(text: string, color = '#c0392b', size = 128): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.font = `bold ${size * 0.8}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size * 0.54);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const PALETTE = {
  floor: 0xc7ab77,
  floorAlt: 0xbb9d69,
  floorDark: 0xa78c5c,
  wall: 0xcab488,
  wallAlt: 0xbaa075,
  wallDark: 0x9b8459,
  concrete: 0xb5b0a2,
  crate: 0xa3743f,
  crateDark: 0x855d31,
  metal: 0x78828d,
  barrel: 0x6d7752,
  door: 0x7d5e3b,
  doorFrame: 0x5d452b,
  car: 0x8a3f3a,
  ceiling: 0x8f7b55,
  siteA: 0xc0392b,
  siteB: 0x2f6fb0,
  skirt: 0x7d6845,
} as const;
