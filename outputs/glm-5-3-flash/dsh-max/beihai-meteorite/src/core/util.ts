import * as THREE from "three";
import { clamp01, lerp, segmentProgress, smoothstep, easeInOutCubic } from "@agentbench/cinematic-player";

export { clamp01, lerp, segmentProgress, smoothstep, easeInOutCubic };

/* ------------------------------------------------------------------ */
/* deterministic noise / random                                        */
/* ------------------------------------------------------------------ */

export function hash1(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function hash3(x: number, y: number, z: number, seed = 0): number {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 43.123) * 43758.5453;
  return s - Math.floor(s);
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Value noise in 3D, deterministic. */
export function vnoise(x: number, y: number, z: number, seed = 0): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const zf = smooth(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz, seed);
  const x00 = c(0, 0, 0) + (c(1, 0, 0) - c(0, 0, 0)) * xf;
  const x10 = c(0, 1, 0) + (c(1, 1, 0) - c(0, 1, 0)) * xf;
  const x01 = c(0, 0, 1) + (c(1, 0, 1) - c(0, 0, 1)) * xf;
  const x11 = c(0, 1, 1) + (c(1, 1, 1) - c(0, 1, 1)) * xf;
  const y0 = x00 + (x10 - x00) * yf;
  const y1 = x01 + (x11 - x01) * yf;
  return y0 + (y1 - y0) * zf;
}

export function fbm(x: number, y: number, z: number, octaves = 3, seed = 0): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(x * freq, y * freq, z * freq, seed + i * 17) * amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum;
}

/* ------------------------------------------------------------------ */
/* math helpers                                                        */
/* ------------------------------------------------------------------ */


export const easeOutCubic = (x: number): number => 1 - Math.pow(1 - clamp01(x), 3);
export const easeInCubic = (x: number): number => Math.pow(clamp01(x), 3);

/** Deterministic pseudo-handheld drift for cameras. */
export function drift(t: number, seed = 0, amp = 1): number {
  return (
    (Math.sin(t * 0.9 + seed * 12.3) * 0.6 +
      Math.sin(t * 0.53 + seed * 71.7) * 0.3 +
      Math.sin(t * 1.7 + seed * 5.1) * 0.1) *
    amp
  );
}

/* ------------------------------------------------------------------ */
/* colors                                                              */
/* ------------------------------------------------------------------ */

export function shade(hex: number, k: number): number {
  const c = new THREE.Color(hex);
  c.multiplyScalar(k);
  c.r = Math.min(1, c.r);
  c.g = Math.min(1, c.g);
  c.b = Math.min(1, c.b);
  return c.getHex();
}

export function mixHex(a: number, b: number, t: number): number {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  ca.lerp(cb, clamp01(t));
  return ca.getHex();
}

/* ------------------------------------------------------------------ */
/* canvas textures                                                     */
/* ------------------------------------------------------------------ */

export function canvasTexture(
  size: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft radial glow sprite texture (sun, lamps, muzzle flashes). */
export function glowTexture(inner: string, mid: string, outer: string): THREE.CanvasTexture {
  return canvasTexture(128, (ctx, size) => {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.3, mid);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  });
}

/* ------------------------------------------------------------------ */
/* overlays driven by absolute time (fades, titles, scope mask)        */
/* ------------------------------------------------------------------ */

export interface FadeSpan {
  t0: number;
  t1: number;
  from: number;
  to: number;
}

/** Piecewise-linear opacity from a list of spans; 0 outside every span. */
export function fadeAt(spans: FadeSpan[], t: number): number {
  for (const s of spans) {
    if (t >= s.t0 && t <= s.t1) return lerp(s.from, s.to, (t - s.t0) / (s.t1 - s.t0));
  }
  return 0;
}

export interface TitleSpan extends FadeSpan {
  lines: string[];
  sub?: string;
  size?: string;
  color?: string;
  letterSpacing?: string;
}

export function titleAt(spans: TitleSpan[], t: number): { span: TitleSpan; opacity: number } | null {
  for (const s of spans) {
    if (t >= s.t0 && t <= s.t1) return { span: s, opacity: fadeAt([s], t) };
  }
  return null;
}
