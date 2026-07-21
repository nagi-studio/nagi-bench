import * as THREE from 'three';

class TextureGenerator {
  private cache: Map<string, THREE.CanvasTexture> = new Map();

  public getSandWallTexture(): THREE.CanvasTexture {
    if (this.cache.has('sandWall')) return this.cache.get('sandWall')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Desert sand background
    ctx.fillStyle = '#d6bc96';
    ctx.fillRect(0, 0, 512, 512);

    // Stucco texture & grain
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const val = Math.floor(Math.random() * 30 - 15);
      const color = val > 0 ? `rgba(255,255,255,${val / 100})` : `rgba(0,0,0,${-val / 100})`;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 2, 2);
    }

    // Brick lines outline subtly
    ctx.strokeStyle = 'rgba(120, 95, 70, 0.25)';
    ctx.lineWidth = 2;
    const rowH = 32;
    for (let y = 0; y < 512; y += rowH) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      const offset = (y / rowH) % 2 === 0 ? 0 : 64;
      for (let x = offset; x < 512; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rowH);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set('sandWall', texture);
    return texture;
  }

  public getFloorTexture(): THREE.CanvasTexture {
    if (this.cache.has('floor')) return this.cache.get('floor')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#c7b08b';
    ctx.fillRect(0, 0, 512, 512);

    // Dust patches
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 20 + Math.random() * 60;
      const grad = ctx.createRadialGradient(x, y, 5, x, y, r);
      grad.addColorStop(0, 'rgba(140, 115, 85, 0.4)');
      grad.addColorStop(1, 'rgba(140, 115, 85, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set('floor', texture);
    return texture;
  }

  public getWoodBoxTexture(): THREE.CanvasTexture {
    if (this.cache.has('woodBox')) return this.cache.get('woodBox')!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Wood base
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 0, 256, 256);

    // Wood grain lines
    ctx.strokeStyle = '#6b401b';
    ctx.lineWidth = 1;
    for (let y = 0; y < 256; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y + (Math.random() * 4 - 2));
      ctx.lineTo(256, y + (Math.random() * 4 - 2));
      ctx.stroke();
    }

    // Outer frame border
    ctx.fillStyle = '#5c3715';
    ctx.fillRect(0, 0, 256, 24);
    ctx.fillRect(0, 232, 256, 24);
    ctx.fillRect(0, 0, 24, 256);
    ctx.fillRect(232, 0, 24, 256);

    // Diagonal CS crate X frame
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#5c3715';
    ctx.beginPath();
    ctx.moveTo(12, 12);
    ctx.lineTo(244, 244);
    ctx.moveTo(244, 12);
    ctx.lineTo(12, 244);
    ctx.stroke();

    // Metallic corner brackets / rivets
    ctx.fillStyle = '#3a3a3a';
    const corners = [[12, 12], [244, 12], [12, 244], [244, 244]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('woodBox', texture);
    return texture;
  }

  public getMetalDoorTexture(): THREE.CanvasTexture {
    if (this.cache.has('metalDoor')) return this.cache.get('metalDoor')!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#555e68';
    ctx.fillRect(0, 0, 256, 512);

    // Panel indentations
    ctx.strokeStyle = '#333a42';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 216, 220);
    ctx.strokeRect(20, 260, 216, 220);

    // Rust & scratches
    ctx.fillStyle = '#8b4513';
    for (let i = 0; i < 15; i++) {
      const rx = Math.random() * 256;
      const ry = Math.random() * 512;
      ctx.fillRect(rx, ry, Math.random() * 30 + 10, Math.random() * 6 + 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('metalDoor', texture);
    return texture;
  }
}

export const proceduralTextures = new TextureGenerator();
