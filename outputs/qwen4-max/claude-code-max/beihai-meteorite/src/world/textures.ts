import * as THREE from "three";
import { mulberry32 } from "../util";

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return [c, c.getContext("2d")!];
}

/** Soft radial glow used for sun, muzzle flash, lamps and ice sparkle. */
export function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)"): THREE.Texture {
  const [c, ctx] = canvas(128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.25, inner.replace(/[\d.]+\)$/, "0.55)"));
  g.addColorStop(0.55, inner.replace(/[\d.]+\)$/, "0.16)"));
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Round soft particle sprite for gas / smoke / dust points. */
export function puffTexture(): THREE.Texture {
  const [c, ctx] = canvas(64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Four-point star flare for bright highlights. */
export function starTexture(): THREE.Texture {
  const [c, ctx] = canvas(128);
  ctx.translate(64, 64);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(-64, -64, 128, 128);
  ctx.globalCompositeOperation = "lighter";
  for (const ang of [0, Math.PI / 2]) {
    ctx.save();
    ctx.rotate(ang);
    const lg = ctx.createLinearGradient(-62, 0, 62, 0);
    lg.addColorStop(0, "rgba(255,255,255,0)");
    lg.addColorStop(0.5, "rgba(255,255,255,0.7)");
    lg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(-62, -1.4, 124, 2.8);
    ctx.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Animated film grain painted into the #grain overlay canvas. */
export function paintGrain(el: HTMLCanvasElement): () => void {
  const ctx = el.getContext("2d")!;
  const rng = mulberry32(99);
  const draw = () => {
    const img = ctx.createImageData(el.width, el.height);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 110 + rng() * 90;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };
  draw();
  el.style.backgroundImage = `url(${el.toDataURL()})`;
  el.style.backgroundRepeat = "repeat";
  // The canvas itself stays hidden; we use it as a tiled background source.
  el.style.display = "none";
  const host = document.createElement("div");
  host.id = "grain-layer";
  host.style.cssText = "position:absolute;inset:-50%;z-index:13;pointer-events:none;opacity:0.045;background-repeat:repeat;";
  host.style.backgroundImage = el.style.backgroundImage;
  el.parentElement!.appendChild(host);
  let raf = 0;
  let last = 0;
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop);
    if (t - last < 90) return;
    last = t;
    draw();
    host.style.backgroundImage = `url(${el.toDataURL()})`;
    host.style.transform = `translate(${(rng() * 40) | 0}px, ${(rng() * 40) | 0}px)`;
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}
