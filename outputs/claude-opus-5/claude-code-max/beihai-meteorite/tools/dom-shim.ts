/**
 * 一套刚好够用的浏览器替身，只为在没有 WebGL 和没有浏览器的环境里
 * 把整条时间轴跑一遍：皮肤要真的画出像素（grain 会读回 ImageData），
 * 其余画布操作可以是空实现。这不是渲染验证，是时间轴与场景图的自检。
 */

class ShimImageData {
  readonly data: Uint8ClampedArray;
  constructor(readonly width: number, readonly height: number, data?: Uint8ClampedArray) {
    this.data = data ?? new Uint8ClampedArray(width * height * 4);
  }
}

function parseColour(input: unknown): [number, number, number, number] {
  if (typeof input !== "string") return [255, 255, 255, 255];
  const value = input;
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
      255,
    ];
  }
  const match = /rgba?\(([^)]+)\)/.exec(value);
  if (match) {
    const parts = match[1]!.split(",").map((p) => Number(p.trim()));
    return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, Math.round((parts[3] ?? 1) * 255)];
  }
  return [255, 255, 255, 255];
}

class ShimCanvas2D {
  fillStyle = "#000000";
  strokeStyle = "#000000";
  lineWidth = 1;
  globalCompositeOperation = "source-over";
  imageSmoothingEnabled = false;
  private pixels: Uint8ClampedArray;

  constructor(readonly canvas: { width: number; height: number }) {
    this.pixels = new Uint8ClampedArray(canvas.width * canvas.height * 4);
  }

  private ensure(): void {
    const needed = this.canvas.width * this.canvas.height * 4;
    if (this.pixels.length !== needed) this.pixels = new Uint8ClampedArray(needed);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    // 渐变在这个替身里画不出来，直接跳过，免得整块画布被刷成白的。
    if (typeof this.fillStyle !== "string") return;
    this.ensure();
    const [r, g, b, a] = parseColour(this.fillStyle);
    const { width, height } = this.canvas;
    for (let j = Math.max(0, Math.floor(y)); j < Math.min(height, Math.ceil(y + h)); j += 1) {
      for (let i = Math.max(0, Math.floor(x)); i < Math.min(width, Math.ceil(x + w)); i += 1) {
        const index = (j * width + i) * 4;
        this.pixels[index] = r;
        this.pixels[index + 1] = g;
        this.pixels[index + 2] = b;
        this.pixels[index + 3] = a;
      }
    }
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this.ensure();
    const { width, height } = this.canvas;
    for (let j = Math.max(0, Math.floor(y)); j < Math.min(height, Math.ceil(y + h)); j += 1) {
      for (let i = Math.max(0, Math.floor(x)); i < Math.min(width, Math.ceil(x + w)); i += 1) {
        const index = (j * width + i) * 4;
        this.pixels[index] = 0;
        this.pixels[index + 1] = 0;
        this.pixels[index + 2] = 0;
        this.pixels[index + 3] = 0;
      }
    }
  }

  getImageData(x: number, y: number, w: number, h: number): ShimImageData {
    this.ensure();
    const out = new ShimImageData(w, h);
    const { width } = this.canvas;
    for (let j = 0; j < h; j += 1) {
      for (let i = 0; i < w; i += 1) {
        const from = ((y + j) * width + (x + i)) * 4;
        const to = (j * w + i) * 4;
        out.data[to] = this.pixels[from] ?? 0;
        out.data[to + 1] = this.pixels[from + 1] ?? 0;
        out.data[to + 2] = this.pixels[from + 2] ?? 0;
        out.data[to + 3] = this.pixels[from + 3] ?? 0;
      }
    }
    return out;
  }

  putImageData(image: ShimImageData, x: number, y: number): void {
    this.ensure();
    const { width } = this.canvas;
    for (let j = 0; j < image.height; j += 1) {
      for (let i = 0; i < image.width; i += 1) {
        const from = (j * image.width + i) * 4;
        const to = ((y + j) * width + (x + i)) * 4;
        this.pixels[to] = image.data[from]!;
        this.pixels[to + 1] = image.data[from + 1]!;
        this.pixels[to + 2] = image.data[from + 2]!;
        this.pixels[to + 3] = image.data[from + 3]!;
      }
    }
  }

  createImageData(w: number, h: number): ShimImageData {
    return new ShimImageData(w, h);
  }

  createRadialGradient(): { addColorStop(): void } {
    return { addColorStop() {} };
  }

  createLinearGradient(): { addColorStop(): void } {
    return { addColorStop() {} };
  }

  // 只实现圆形路径：瞄准镜的黑罩靠 destination-out 挖出中间那个圆，
  // 不实现的话预览里整幅画面都会被一块黑板盖住。
  private circles: Array<[number, number, number]> = [];

  drawImage(): void {}

  beginPath(): void {
    this.circles = [];
  }

  closePath(): void {}
  moveTo(): void {}
  lineTo(): void {}

  arc(x: number, y: number, radius: number): void {
    this.circles.push([x, y, radius]);
  }

  fill(): void {
    if (this.circles.length === 0) return;
    this.ensure();
    const erase = this.globalCompositeOperation === "destination-out";
    const colour = erase ? [0, 0, 0, 0] : parseColour(this.fillStyle);
    if (!erase && typeof this.fillStyle !== "string") return;
    const { width, height } = this.canvas;
    for (const [cx, cy, r] of this.circles) {
      for (let j = Math.max(0, Math.floor(cy - r)); j < Math.min(height, Math.ceil(cy + r)); j += 1) {
        for (let i = Math.max(0, Math.floor(cx - r)); i < Math.min(width, Math.ceil(cx + r)); i += 1) {
          const dx = i + 0.5 - cx;
          const dy = j + 0.5 - cy;
          if (dx * dx + dy * dy > r * r) continue;
          const index = (j * width + i) * 4;
          this.pixels[index] = colour[0]!;
          this.pixels[index + 1] = colour[1]!;
          this.pixels[index + 2] = colour[2]!;
          this.pixels[index + 3] = colour[3]!;
        }
      }
    }
  }

  stroke(): void {}
  save(): void {}
  restore(): void {}
  translate(): void {}
  scale(): void {}
  rotate(): void {}
}

function createElement(tag: string): Record<string, unknown> {
  const children: unknown[] = [];
  let context2d: ShimCanvas2D | undefined;
  const element: Record<string, unknown> = {
    tagName: tag.toUpperCase(),
    width: 300,
    height: 150,
    style: {},
    dataset: {},
    children,
    innerHTML: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains: () => false, toggle() {} },
    appendChild: (child: unknown) => {
      children.push(child);
      return child;
    },
    removeChild: () => undefined,
    remove: () => undefined,
    setAttribute: () => undefined,
    getAttribute: () => null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    querySelector: () => null,
    querySelectorAll: () => [],
    contains: () => false,
    getContext: (kind: string) => {
      if (kind !== "2d") return null;
      // 同一块画布必须永远返回同一个上下文，否则 grain 和贴图采样读到的是空白。
      context2d ??= new ShimCanvas2D(element as unknown as { width: number; height: number });
      return context2d;
    },
    toDataURL: () => "data:image/png;base64,",
    getBoundingClientRect: () => ({ x: 0, y: 0, width: 1920, height: 1080, top: 0, left: 0, right: 1920, bottom: 1080 }),
    clientWidth: 1920,
    clientHeight: 1080,
  };
  return element;
}

export function installDomShim(): void {
  const globals = globalThis as unknown as Record<string, unknown>;
  if (globals.document) return;
  globals.document = {
    createElement,
    createElementNS: (_ns: string, tag: string) => createElement(tag),
    body: createElement("body"),
    documentElement: createElement("html"),
    querySelector: () => null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };
  globals.window = globals as unknown;
  globals.ImageData = ShimImageData;
  globals.devicePixelRatio = 1;
  globals.innerWidth = 1920;
  globals.innerHeight = 1080;
  globals.requestAnimationFrame = (callback: (t: number) => void): number => {
    return Number(setTimeout(() => callback(performance.now()), 16));
  };
  globals.cancelAnimationFrame = (handle: number): void => clearTimeout(handle);
  globals.addEventListener = () => undefined;
  globals.removeEventListener = () => undefined;
  globals.ResizeObserver = class {
    observe(): void {}
    disconnect(): void {}
  };
}
