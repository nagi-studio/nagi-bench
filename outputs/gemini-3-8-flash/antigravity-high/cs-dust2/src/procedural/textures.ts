import * as THREE from 'three';

export class ProceduralTextures {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  // 1. Dust Sandstone Wall Texture
  public static getSandstoneTexture(tint: string = '#d6b88d'): THREE.CanvasTexture {
    const key = `sandstone_${tint}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base color
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, 512, 512);

    // Stone blocks grid
    const blockRows = 8;
    const blockCols = 4;
    const rowH = 512 / blockRows;
    const colW = 512 / blockCols;

    ctx.strokeStyle = 'rgba(80, 60, 40, 0.4)';
    ctx.lineWidth = 4;

    for (let r = 0; r < blockRows; r++) {
      const y = r * rowH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      const offset = (r % 2) * (colW / 2);
      for (let c = 0; c <= blockCols; c++) {
        const x = c * colW + offset;
        ctx.beginPath();
        ctx.moveTo(x % 512, y);
        ctx.lineTo(x % 512, y + rowH);
        ctx.stroke();
      }
    }

    // Organic surface noise & sand grime
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 45;
      data[i] = Math.max(0, Math.min(255, data[i] + n));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n * 0.9));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, texture);
    return texture;
  }

  // 2. CS Wooden Box Crate Texture
  public static getCrateTexture(): THREE.CanvasTexture {
    const key = 'crate_wood';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Wood base
    ctx.fillStyle = '#9b7653';
    ctx.fillRect(0, 0, 512, 512);

    // Wood planks horizontal
    const planks = 6;
    const plankH = 512 / planks;
    for (let i = 0; i < planks; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#a27e5b' : '#906d4a';
      ctx.fillRect(0, i * plankH, 512, plankH);
      ctx.strokeStyle = '#5a3d28';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, i * plankH, 512, plankH);
    }

    // Wood grain lines
    ctx.strokeStyle = 'rgba(70, 45, 25, 0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 512;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(150, y + Math.random() * 8 - 4, 350, y + Math.random() * 8 - 4, 512, y);
      ctx.stroke();
    }

    // Outer border frame
    const frameW = 44;
    ctx.fillStyle = '#6e4f35';
    ctx.fillRect(0, 0, 512, frameW);
    ctx.fillRect(0, 512 - frameW, 512, frameW);
    ctx.fillRect(0, 0, frameW, 512);
    ctx.fillRect(512 - frameW, 0, frameW, 512);

    // Diagonal Cross Brace
    ctx.strokeStyle = '#6e4f35';
    ctx.lineWidth = frameW * 0.9;
    ctx.beginPath();
    ctx.moveTo(frameW, frameW);
    ctx.lineTo(512 - frameW, 512 - frameW);
    ctx.stroke();

    // Metal corner reinforcement brackets
    ctx.fillStyle = '#424242';
    const bSize = 64;
    // Corners
    ctx.fillRect(0, 0, bSize, 16);
    ctx.fillRect(0, 0, 16, bSize);
    ctx.fillRect(512 - bSize, 0, bSize, 16);
    ctx.fillRect(512 - 16, 0, 16, bSize);
    ctx.fillRect(0, 512 - 16, bSize, 16);
    ctx.fillRect(0, 512 - bSize, 16, bSize);
    ctx.fillRect(512 - bSize, 512 - 16, bSize, 16);
    ctx.fillRect(512 - 16, 512 - bSize, 16, bSize);

    // Rivets
    ctx.fillStyle = '#bfbfbf';
    const drawRivet = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    };
    drawRivet(8, 8);
    drawRivet(504, 8);
    drawRivet(8, 504);
    drawRivet(504, 504);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // 3. Military Green Crate Texture
  public static getMilitaryCrateTexture(): THREE.CanvasTexture {
    const key = 'crate_military';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#3a4b37';
    ctx.fillRect(0, 0, 512, 512);

    // Darker borders
    ctx.strokeStyle = '#223020';
    ctx.lineWidth = 36;
    ctx.strokeRect(18, 18, 476, 476);

    // Stencil text
    ctx.fillStyle = '#8fad7e';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CS-GO DUST II', 256, 230);
    ctx.font = 'bold 24px monospace';
    ctx.fillText('EXPLOSIVES 82-B', 256, 280);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // 4. Dusty Ground / Pavement Texture
  public static getFloorTexture(): THREE.CanvasTexture {
    const key = 'dust_floor';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Desert asphalt base
    ctx.fillStyle = '#9e8b74';
    ctx.fillRect(0, 0, 512, 512);

    // Concrete tiles
    ctx.strokeStyle = 'rgba(70, 55, 40, 0.25)';
    ctx.lineWidth = 3;
    const tileSize = 128;
    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    // Dirt noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 35;
      data[i] = Math.max(0, Math.min(255, data[i] + n));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n * 0.9));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, texture);
    return texture;
  }

  // 5. Mid Double Metal Doors Texture
  public static getMidDoorTexture(): THREE.CanvasTexture {
    const key = 'mid_door';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Steel door green-gray
    ctx.fillStyle = '#4f5b52';
    ctx.fillRect(0, 0, 512, 1024);

    // Beveled panels
    const panelW = 420;
    const panelH = 430;
    const px = (512 - panelW) / 2;

    ctx.fillStyle = '#3f4942';
    ctx.fillRect(px, 60, panelW, panelH);
    ctx.fillRect(px, 530, panelW, panelH);

    ctx.strokeStyle = '#28312b';
    ctx.lineWidth = 8;
    ctx.strokeRect(px, 60, panelW, panelH);
    ctx.strokeRect(px, 530, panelW, panelH);

    // Door latch & handle
    ctx.fillStyle = '#8a9a8d';
    ctx.fillRect(40, 500, 30, 80);

    // Bullet holes & scratches
    ctx.fillStyle = '#1c221e';
    for (let i = 0; i < 15; i++) {
      const bx = 80 + Math.random() * 350;
      const by = 100 + Math.random() * 800;
      ctx.beginPath();
      ctx.arc(bx, by, 6 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // 6. Stenciled Bomb Site Signs "A" or "B"
  public static getSiteSignTexture(site: 'A' | 'B'): THREE.CanvasTexture {
    const key = `site_sign_${site}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 256, 256);

    // Stencil Red graffiti text
    ctx.fillStyle = '#dc2626';
    ctx.font = '900 130px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(site, 128, 110);

    // Arrow pointing down/forward
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(80, 190);
    ctx.lineTo(128, 230);
    ctx.lineTo(176, 190);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(128, 170);
    ctx.lineTo(128, 230);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }
}
