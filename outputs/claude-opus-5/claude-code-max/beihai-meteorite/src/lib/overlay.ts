import * as THREE from "three";

/**
 * 附着在摄影机上的两块玻璃：瞄准镜和头盔面罩。
 *
 * 它们是场景里的物体（挂在 camera 下），不是 DOM —— 这样它们跟着焦距
 * 一起变化，也一起被色调映射，看上去是"透过什么在看"，而不是贴上去的图。
 */

export interface CameraOverlay {
  mesh: THREE.Mesh;
  set(opacity: number): void;
  update(camera: THREE.PerspectiveCamera, aspect: number): void;
  dispose(): void;
}

function overlayMesh(texture: THREE.CanvasTexture, distance: number): CameraOverlay {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.position.set(0, 0, -distance);
  mesh.renderOrder = 900;
  mesh.frustumCulled = false;
  mesh.visible = false;
  return {
    mesh,
    set(opacity: number) {
      material.opacity = opacity;
      mesh.visible = opacity > 0.002;
    },
    update(camera, aspect) {
      const height = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const cover = Math.max(height, height * aspect) * 1.02;
      mesh.scale.set(cover, cover, 1);
    },
    dispose() {
      mesh.geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/** 步枪瞄准镜，夹具换成了磁铁之后架在手枪上。十字线、密位点、一圈暗角。 */
export function createScopeOverlay(): CameraOverlay {
  const texture = canvasTexture(1024, (ctx, size) => {
    const c = size / 2;
    // 这块贴图会被等比放大到覆盖画面宽度（2.39:1），所以圆的半径要按宽度算，
    // 目镜才不会被上下画幅切掉。
    const r = size * 0.192;
    ctx.fillStyle = "#020304";
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // 镜筒内壁的一圈渐晕
    const vignette = ctx.createRadialGradient(c, c, r * 0.62, c, c, r);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.82)");
    ctx.fillStyle = vignette;
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(190,205,215,0.42)";
    ctx.lineWidth = size * 0.0035;
    ctx.beginPath();
    ctx.arc(c, c, r * 0.995, 0, Math.PI * 2);
    ctx.stroke();

    // 十字线：中心留空
    ctx.strokeStyle = "rgba(214,224,232,0.72)";
    ctx.lineWidth = size * 0.0026;
    const gap = r * 0.052;
    for (const [x0, y0, x1, y1] of [
      [c - r, c, c - gap, c],
      [c + gap, c, c + r, c],
      [c, c - r, c, c - gap],
      [c, c + gap, c, c + r],
    ] as const) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    // 密位点
    ctx.fillStyle = "rgba(214,224,232,0.78)";
    for (let i = 1; i <= 4; i += 1) {
      const d = (r * 0.19) * i;
      for (const [dx, dy] of [[d, 0], [-d, 0], [0, d], [0, -d]] as const) {
        ctx.beginPath();
        ctx.arc(c + dx, c + dy, size * 0.0034, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // 刻度
    ctx.strokeStyle = "rgba(180,196,208,0.5)";
    ctx.lineWidth = size * 0.0022;
    for (let i = 0; i < 72; i += 1) {
      const angle = (i / 72) * Math.PI * 2;
      const long = i % 6 === 0;
      const inner = r * (long ? 0.9 : 0.94);
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(angle) * inner, c + Math.sin(angle) * inner);
      ctx.lineTo(c + Math.cos(angle) * r * 0.985, c + Math.sin(angle) * r * 0.985);
      ctx.stroke();
    }
  });
  return overlayMesh(texture, 0.25);
}

/** 头盔面罩内侧：视野边缘的暗角、一道涂层反光、下沿一排很暗的读数。 */
export function createVisorOverlay(): CameraOverlay {
  const texture = canvasTexture(1024, (ctx, size) => {
    ctx.clearRect(0, 0, size, size);
    const c = size / 2;
    const vignette = ctx.createRadialGradient(c, c, size * 0.28, c, c, size * 0.62);
    vignette.addColorStop(0, "rgba(4,7,11,0)");
    vignette.addColorStop(0.72, "rgba(4,7,11,0.55)");
    vignette.addColorStop(1, "rgba(3,5,8,0.96)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, size, size);

    // 面罩涂层的一道斜反光
    const sheen = ctx.createLinearGradient(size * 0.1, size * 0.08, size * 0.62, size * 0.52);
    sheen.addColorStop(0, "rgba(150,190,220,0.13)");
    sheen.addColorStop(0.5, "rgba(150,190,220,0.03)");
    sheen.addColorStop(1, "rgba(150,190,220,0)");
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.moveTo(size * 0.08, size * 0.1);
    ctx.lineTo(size * 0.56, size * 0.06);
    ctx.lineTo(size * 0.3, size * 0.6);
    ctx.lineTo(size * 0.06, size * 0.5);
    ctx.closePath();
    ctx.fill();

    // 面罩下沿的读数
    ctx.strokeStyle = "rgba(120,220,190,0.34)";
    ctx.lineWidth = size * 0.0022;
    ctx.beginPath();
    ctx.moveTo(size * 0.34, size * 0.845);
    ctx.lineTo(size * 0.66, size * 0.845);
    ctx.stroke();
    ctx.fillStyle = "rgba(120,220,190,0.30)";
    for (let i = 0; i < 12; i += 1) {
      ctx.fillRect(size * (0.35 + i * 0.0255), size * 0.852, size * 0.012, size * 0.008);
    }
    ctx.fillStyle = "rgba(230,170,90,0.26)";
    ctx.fillRect(size * 0.35, size * 0.868, size * 0.09, size * 0.006);
  });
  return overlayMesh(texture, 0.22);
}
