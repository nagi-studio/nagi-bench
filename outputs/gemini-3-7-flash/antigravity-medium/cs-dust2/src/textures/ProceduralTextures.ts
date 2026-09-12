import * as THREE from 'three';

// Procedural Canvas Texture Generator for CS Dust2
export class ProceduralTextures {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  // Helper to create canvas
  private static createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    return { canvas, ctx };
  }

  // Dust2 Sandstone Wall Texture
  public static getSandstoneWall(): THREE.CanvasTexture {
    const key = 'sandstone_wall';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Base warm desert stone color
    ctx.fillStyle = '#d6b887';
    ctx.fillRect(0, 0, 512, 512);

    // Noise/grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 35;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n * 0.9));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    // Stone blocks mortar grid
    ctx.strokeStyle = '#8f7756';
    ctx.lineWidth = 4;
    const rows = 8;
    const rowHeight = 512 / rows;

    for (let r = 0; r <= rows; r++) {
      const y = r * rowHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      if (r < rows) {
        const cols = 4;
        const colWidth = 512 / cols;
        const offset = (r % 2) * (colWidth / 2);
        for (let c = 0; c <= cols + 1; c++) {
          const x = c * colWidth - offset;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + rowHeight);
          ctx.stroke();

          // Add subtle bevel highlight
          ctx.strokeStyle = 'rgba(255, 240, 210, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + 2, y + 2);
          ctx.lineTo(x + colWidth - offset - 2, y + 2);
          ctx.stroke();
          ctx.strokeStyle = '#8f7756';
          ctx.lineWidth = 4;
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, texture);
    return texture;
  }

  // Dust2 Sand Ground / Pavement Texture
  public static getSandGround(): THREE.CanvasTexture {
    const key = 'sand_ground';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Base sandy dirt color
    ctx.fillStyle = '#cfb07e';
    ctx.fillRect(0, 0, 512, 512);

    // Random grit / pebbles
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 45;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n * 0.9));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    // Random faint paving cracks & tyre marks
    ctx.strokeStyle = 'rgba(100, 80, 55, 0.15)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.bezierCurveTo(150, 200, 350, 300, 480, 512);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, texture);
    return texture;
  }

  // Classic CS Wooden Crate Texture
  public static getWoodCrate(): THREE.CanvasTexture {
    const key = 'wood_crate';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Wood base
    ctx.fillStyle = '#a67843';
    ctx.fillRect(0, 0, 512, 512);

    // Wood grain lines
    ctx.fillStyle = '#8e6231';
    for (let y = 0; y < 512; y += 64) {
      ctx.fillRect(0, y, 512, 4);
    }

    // Noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 30;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n * 0.8));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.6));
    }
    ctx.putImageData(imgData, 0, 0);

    // Metal Frame Border
    ctx.fillStyle = '#4a4238';
    ctx.fillRect(0, 0, 512, 32);
    ctx.fillRect(0, 480, 512, 32);
    ctx.fillRect(0, 0, 32, 512);
    ctx.fillRect(480, 0, 32, 512);

    // Diagonal Cross Brace
    ctx.strokeStyle = '#4a4238';
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.moveTo(32, 32);
    ctx.lineTo(480, 480);
    ctx.stroke();

    // Rivets / Bolts
    ctx.fillStyle = '#222';
    const boltCoords = [
      [16, 16], [496, 16], [16, 496], [496, 496],
      [256, 16], [256, 496], [16, 256], [496, 256]
    ];
    boltCoords.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // Classic Dust2 Mid Doors Metal Texture
  public static getMetalDoor(): THREE.CanvasTexture {
    const key = 'metal_door';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Weathered olive-drab / teal metal
    ctx.fillStyle = '#44564c';
    ctx.fillRect(0, 0, 512, 512);

    // Scratches and rust noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 50;
      d[i] = Math.min(255, Math.max(0, d[i] + n + 15)); // slight rust
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.8));
    }
    ctx.putImageData(imgData, 0, 0);

    // Metal panel bevels
    ctx.strokeStyle = '#28362e';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 472, 472);
    ctx.strokeRect(40, 40, 432, 200);
    ctx.strokeRect(40, 270, 432, 200);

    // Rivets
    ctx.fillStyle = '#1b241f';
    for (let y = 30; y < 500; y += 80) {
      ctx.beginPath();
      ctx.arc(30, y, 5, 0, Math.PI * 2);
      ctx.arc(482, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // Bomb Site Target Graffiti Decal ('A' or 'B')
  public static getSiteDecal(site: 'A' | 'B'): THREE.CanvasTexture {
    const key = `site_decal_${site}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const { canvas, ctx } = this.createCanvas(256, 256);
    ctx.clearRect(0, 0, 256, 256);

    // Red spray paint
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 160px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Spray paint outline / splatter
    ctx.shadowColor = '#b91c1c';
    ctx.shadowBlur = 15;
    ctx.fillText(site, 128, 128);

    // Crosshairs around target
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(128, 128, 105, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // Muzzle flash particle texture
  public static getMuzzleFlash(): THREE.CanvasTexture {
    const key = 'muzzle_flash';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const { canvas, ctx } = this.createCanvas(128, 128);
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 220, 1.0)');
    grad.addColorStop(0.3, 'rgba(255, 180, 50, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 80, 10, 0.4)');
    grad.addColorStop(1, 'rgba(255, 40, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // Bullet hole decal
  public static getBulletHole(): THREE.CanvasTexture {
    const key = 'bullet_hole';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const { canvas, ctx } = this.createCanvas(64, 64);
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, '#111');
    grad.addColorStop(0.3, '#262626');
    grad.addColorStop(0.6, '#404040');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }
}
