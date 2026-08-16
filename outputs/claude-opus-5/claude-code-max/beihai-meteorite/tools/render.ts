import { deflateSync as zlibDeflateSync } from "node:zlib";
import * as THREE from "three";

/**
 * 一个很小的软件光栅器，只为在没有 GPU 的机器上"看片"。
 * 它不追求和 WebGL 一致，只要求构图、遮挡、明暗和贴图是对的 ——
 * 足以判断一个镜头有没有拍到东西、人有没有穿模、脸朝哪边。
 */

interface Light {
  kind: "dir" | "point" | "hemi" | "ambient";
  colour: THREE.Color;
  intensity: number;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  distance: number;
  ground: THREE.Color;
  layers: THREE.Layers;
}

interface Draw {
  mesh: THREE.Mesh;
  transparent: boolean;
  order: number;
  depth: number;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) c = CRC_TABLE[(c ^ bytes[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(data.length + 12);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i += 1) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

export function encodePng(width: number, height: number, rgb: Uint8Array): Uint8Array {
  const raw = new Uint8Array((width * 3 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 3 + 1)] = 0;
    raw.set(rgb.subarray(y * width * 3, (y + 1) * width * 3), y * (width * 3 + 1) + 1);
  }
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const idat = new Uint8Array(zlibDeflateSync(raw));
  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const parts = [signature, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", new Uint8Array(0))];
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const png = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    png.set(part, offset);
    offset += part.length;
  }
  return png;
}

function collectLights(scene: THREE.Object3D): Light[] {
  const lights: Light[] = [];
  scene.traverseVisible((object) => {
    const light = object as THREE.Light & {
      isDirectionalLight?: boolean;
      isPointLight?: boolean;
      isHemisphereLight?: boolean;
      isAmbientLight?: boolean;
      target?: THREE.Object3D;
      distance?: number;
      groundColor?: THREE.Color;
    };
    if (!light.isLight) return;
    const position = new THREE.Vector3().setFromMatrixPosition(light.matrixWorld);
    if (light.isDirectionalLight) {
      const target = new THREE.Vector3().setFromMatrixPosition(light.target!.matrixWorld);
      lights.push({
        kind: "dir",
        colour: light.color,
        intensity: light.intensity,
        position,
        direction: position.clone().sub(target).normalize(),
        distance: 0,
        ground: light.color,
        layers: light.layers,
      });
    } else if (light.isPointLight) {
      lights.push({
        kind: "point",
        colour: light.color,
        intensity: light.intensity,
        position,
        direction: new THREE.Vector3(),
        distance: light.distance ?? 0,
        ground: light.color,
        layers: light.layers,
      });
    } else if (light.isHemisphereLight) {
      lights.push({
        kind: "hemi",
        colour: light.color,
        intensity: light.intensity,
        position,
        direction: new THREE.Vector3(0, 1, 0),
        distance: 0,
        ground: light.groundColor ?? new THREE.Color(0x000000),
        layers: light.layers,
      });
    } else if (light.isAmbientLight) {
      lights.push({
        kind: "ambient",
        colour: light.color,
        intensity: light.intensity,
        position,
        direction: new THREE.Vector3(),
        distance: 0,
        ground: light.color,
        layers: light.layers,
      });
    }
  });
  return lights;
}

function acesToneMap(x: number): number {
  const a = 2.51;
  const b = 0.03;
  const c = 2.43;
  const d = 0.59;
  const e = 0.14;
  return Math.min(1, Math.max(0, (x * (a * x + b)) / (x * (c * x + d) + e)));
}

export interface RenderOptions {
  width: number;
  height: number;
  exposure?: number;
}

export function renderScene(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  options: RenderOptions,
): Uint8Array {
  const { width, height, exposure = 1.05 } = options;
  const colour = new Float32Array(width * height * 3);
  const depth = new Float32Array(width * height).fill(Infinity);

  const background = (scene.background as THREE.Color | null) ?? new THREE.Color(0x000000);
  for (let i = 0; i < width * height; i += 1) {
    colour[i * 3] = background.r;
    colour[i * 3 + 1] = background.g;
    colour[i * 3 + 2] = background.b;
  }

  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const lights = collectLights(scene);

  const viewProjection = new THREE.Matrix4()
    .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  const cameraPosition = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);

  const opaque: Draw[] = [];
  const blended: Draw[] = [];
  const points: THREE.Points[] = [];
  const sprites: THREE.Sprite[] = [];
  const centre = new THREE.Vector3();

  scene.traverseVisible((object) => {
    const asSprite = object as THREE.Sprite;
    if ((asSprite as unknown as { isSprite?: boolean }).isSprite) {
      sprites.push(asSprite);
      return;
    }
    const asPoints = object as THREE.Points;
    if ((asPoints as unknown as { isPoints?: boolean }).isPoints) {
      points.push(asPoints);
      return;
    }
    const mesh = object as THREE.Mesh;
    if (!(mesh as unknown as { isMesh?: boolean }).isMesh) return;
    const material = mesh.material as THREE.Material & { transparent?: boolean; opacity?: number };
    if (material.opacity !== undefined && material.opacity <= 0.004 && material.transparent) return;
    centre.setFromMatrixPosition(mesh.matrixWorld);
    const item: Draw = {
      mesh,
      transparent: Boolean(material.transparent),
      order: mesh.renderOrder,
      depth: centre.distanceTo(cameraPosition),
    };
    if (item.transparent) blended.push(item);
    else opaque.push(item);
  });

  blended.sort((a, b) => a.order - b.order || b.depth - a.depth);

  const drawList = [...opaque, ...blended];
  for (const item of drawList) drawMesh(item, colour, depth, width, height, viewProjection, lights, cameraPosition);
  for (const cloud of points) drawPoints(cloud, colour, depth, width, height, viewProjection);
  for (const sprite of sprites) drawSprite(sprite, colour, depth, width, height, viewProjection, camera);

  const out = new Uint8Array(width * height * 3);
  for (let i = 0; i < width * height * 3; i += 1) {
    const mapped = acesToneMap(colour[i]! * exposure);
    out[i] = Math.round(Math.pow(mapped, 1 / 2.2) * 255);
  }
  return out;
}

const va = new THREE.Vector4();
const vb = new THREE.Vector4();
const vc = new THREE.Vector4();
const na = new THREE.Vector3();
const worldA = new THREE.Vector3();
const worldB = new THREE.Vector3();
const worldC = new THREE.Vector3();
const edge1 = new THREE.Vector3();
const edge2 = new THREE.Vector3();
const faceNormal = new THREE.Vector3();
const lightDir = new THREE.Vector3();

function shade(
  base: THREE.Color,
  normal: THREE.Vector3,
  position: THREE.Vector3,
  meshLayers: THREE.Layers,
  lights: Light[],
  out: THREE.Color,
): void {
  // 与 three.js 0.180 的物理光照口径对齐：所有项最后都乘 1/π（Lambert BRDF），
  // 点光按 1/d² 衰减并带 distance 窗口。这样预览的曝光才和真实渲染大致同一档。
  const RECIPROCAL_PI = 1 / Math.PI;
  out.setRGB(0, 0, 0);
  for (const light of lights) {
    if (!light.layers.test(meshLayers)) continue;
    let gain = 0;
    let r = light.colour.r;
    let g = light.colour.g;
    let b = light.colour.b;
    if (light.kind === "ambient") {
      gain = light.intensity;
    } else if (light.kind === "hemi") {
      const k = normal.y * 0.5 + 0.5;
      r = light.colour.r * k + light.ground.r * (1 - k);
      g = light.colour.g * k + light.ground.g * (1 - k);
      b = light.colour.b * k + light.ground.b * (1 - k);
      gain = light.intensity;
    } else if (light.kind === "dir") {
      gain = light.intensity * Math.max(0, normal.dot(light.direction));
    } else {
      lightDir.copy(light.position).sub(position);
      const d = lightDir.length();
      if (light.distance > 0 && d > light.distance) continue;
      lightDir.divideScalar(d || 1);
      const k = Math.max(0, normal.dot(lightDir));
      if (k <= 0) continue;
      const window = light.distance > 0
        ? Math.pow(Math.min(1, Math.max(0, 1 - Math.pow(d / light.distance, 4))), 2)
        : 1;
      gain = (light.intensity / Math.max(0.01, d * d)) * window * k;
    }
    if (gain <= 0) continue;
    out.r += base.r * r * gain * RECIPROCAL_PI;
    out.g += base.g * g * gain * RECIPROCAL_PI;
    out.b += base.b * b * gain * RECIPROCAL_PI;
  }
}

interface TextureLike {
  image?: { width: number; height: number; getContext(kind: string): unknown };
}

const textureCache = new WeakMap<object, { width: number; height: number; data: Uint8ClampedArray } | null>();

function readTexture(map: TextureLike | null | undefined): { width: number; height: number; data: Uint8ClampedArray } | null {
  if (!map || !map.image) return null;
  const cached = textureCache.get(map as object);
  if (cached !== undefined) return cached;
  let result: { width: number; height: number; data: Uint8ClampedArray } | null = null;
  try {
    const ctx = map.image.getContext("2d") as {
      getImageData(x: number, y: number, w: number, h: number): { data: Uint8ClampedArray };
    };
    const image = ctx.getImageData(0, 0, map.image.width, map.image.height);
    result = { width: map.image.width, height: map.image.height, data: image.data };
  } catch {
    result = null;
  }
  textureCache.set(map as object, result);
  return result;
}

function drawMesh(
  item: Draw,
  colour: Float32Array,
  depth: Float32Array,
  width: number,
  height: number,
  viewProjection: THREE.Matrix4,
  lights: Light[],
  cameraPosition: THREE.Vector3,
): void {
  const mesh = item.mesh;
  const geometry = mesh.geometry as THREE.BufferGeometry;
  const position = geometry.attributes.position as THREE.BufferAttribute | undefined;
  if (!position) return;
  const index = geometry.index;
  const colours = geometry.attributes.color as THREE.BufferAttribute | undefined;
  const uvs = geometry.attributes.uv as THREE.BufferAttribute | undefined;
  const normals = geometry.attributes.normal as THREE.BufferAttribute | undefined;
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  const material = mesh.material as THREE.MeshStandardMaterial & {
    isMeshBasicMaterial?: boolean;
    map?: THREE.Texture | null;
    opacity: number;
    transparent: boolean;
    vertexColors: boolean;
    depthTest: boolean;
  };
  const unlit = Boolean(material.isMeshBasicMaterial);
  const texture = readTexture(material.map as unknown as TextureLike);
  const matrix = mesh.matrixWorld;
  const count = index ? index.count : position.count;
  const base = new THREE.Color();
  const lit = new THREE.Color();
  const materialColour = material.color ?? new THREE.Color(0xffffff);
  const alpha = material.transparent ? material.opacity : 1;
  if (alpha <= 0.004) return;
  const depthTest = material.depthTest !== false;
  const cull = (material.side ?? THREE.FrontSide) === THREE.FrontSide;

  for (let i = 0; i < count; i += 3) {
    const i0 = index ? index.getX(i) : i;
    const i1 = index ? index.getX(i + 1) : i + 1;
    const i2 = index ? index.getX(i + 2) : i + 2;

    worldA.fromBufferAttribute(position, i0).applyMatrix4(matrix);
    worldB.fromBufferAttribute(position, i1).applyMatrix4(matrix);
    worldC.fromBufferAttribute(position, i2).applyMatrix4(matrix);

    va.set(worldA.x, worldA.y, worldA.z, 1).applyMatrix4(viewProjection);
    vb.set(worldB.x, worldB.y, worldB.z, 1).applyMatrix4(viewProjection);
    vc.set(worldC.x, worldC.y, worldC.z, 1).applyMatrix4(viewProjection);
    if (va.w <= 0.0001 || vb.w <= 0.0001 || vc.w <= 0.0001) continue;

    const ax = (va.x / va.w * 0.5 + 0.5) * width;
    const ay = (1 - (va.y / va.w * 0.5 + 0.5)) * height;
    const bx = (vb.x / vb.w * 0.5 + 0.5) * width;
    const by = (1 - (vb.y / vb.w * 0.5 + 0.5)) * height;
    const cx = (vc.x / vc.w * 0.5 + 0.5) * width;
    const cy = (1 - (vc.y / vc.w * 0.5 + 0.5)) * height;

    const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (area === 0) continue;

    const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maxX = Math.min(width - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maxY = Math.min(height - 1, Math.ceil(Math.max(ay, by, cy)));
    if (minX > maxX || minY > maxY) continue;

    na.copy(worldA).add(worldB).add(worldC).multiplyScalar(1 / 3);
    if (normals) {
      faceNormal.set(
        (normals.getX(i0) + normals.getX(i1) + normals.getX(i2)) / 3,
        (normals.getY(i0) + normals.getY(i1) + normals.getY(i2)) / 3,
        (normals.getZ(i0) + normals.getZ(i1) + normals.getZ(i2)) / 3,
      ).applyMatrix3(normalMatrix).normalize();
    } else {
      edge1.copy(worldB).sub(worldA);
      edge2.copy(worldC).sub(worldA);
      faceNormal.copy(edge1).cross(edge2).normalize();
      if (faceNormal.dot(na.clone().sub(cameraPosition)) > 0) faceNormal.negate();
    }
    // 背面剔除：three.js 默认只画正面，预览也必须一样，否则会看到房间内壁。
    if (cull && faceNormal.dot(na.clone().sub(cameraPosition)) > 0.0001) continue;

    if (colours) {
      base.setRGB(
        (colours.getX(i0) + colours.getX(i1) + colours.getX(i2)) / 3,
        (colours.getY(i0) + colours.getY(i1) + colours.getY(i2)) / 3,
        (colours.getZ(i0) + colours.getZ(i1) + colours.getZ(i2)) / 3,
      );
    } else {
      base.copy(materialColour);
    }

    const textured = Boolean(texture && uvs);
    if (!textured) {
      if (unlit) lit.copy(base);
      else shade(base, faceNormal, na, mesh.layers, lights, lit);
    }

    const u0 = textured ? uvs!.getX(i0) : 0;
    const v0 = textured ? uvs!.getY(i0) : 0;
    const u1 = textured ? uvs!.getX(i1) : 0;
    const v1 = textured ? uvs!.getY(i1) : 0;
    const u2 = textured ? uvs!.getX(i2) : 0;
    const v2 = textured ? uvs!.getY(i2) : 0;

    const z = (va.w + vb.w + vc.w) / 3;
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const px = x + 0.5;
        const py = y + 0.5;
        // 重心坐标：l0 属于顶点 a，l1 属于 b，l2 属于 c
        const l1 = ((bx - ax) * (py - ay) - (by - ay) * (px - ax)) / area;
        const l2 = ((cx - bx) * (py - by) - (cy - by) * (px - bx)) / area;
        const l0 = ((ax - cx) * (py - cy) - (ay - cy) * (px - cx)) / area;
        if (l0 < 0 || l1 < 0 || l2 < 0) continue;
        const at = y * width + x;
        if (depthTest && z >= depth[at]!) continue;

        let blend = alpha;
        if (textured) {
          // l2 是 A 的权重，l0 是 B 的，l1 是 C 的；再按 1/w 做透视校正
          const wa = (l2 / va.w) || 0;
          const wb = (l0 / vb.w) || 0;
          const wc = (l1 / vc.w) || 0;
          const sum = wa + wb + wc || 1;
          const u = (u0 * wa + u1 * wb + u2 * wc) / sum;
          const v = (v0 * wa + v1 * wb + v2 * wc) / sum;
          const tx = Math.min(texture!.width - 1, Math.max(0, Math.floor(u * texture!.width)));
          const ty = Math.min(texture!.height - 1, Math.max(0, Math.floor(v * texture!.height)));
          const texel = (ty * texture!.width + tx) * 4;
          const texelAlpha = texture!.data[texel + 3]! / 255;
          if (texelAlpha < 0.5) continue;
          base.setRGB(
            Math.pow(texture!.data[texel]! / 255, 2.2),
            Math.pow(texture!.data[texel + 1]! / 255, 2.2),
            Math.pow(texture!.data[texel + 2]! / 255, 2.2),
          );
          if (!unlit) {
            base.multiply(materialColour);
            shade(base, faceNormal, na, mesh.layers, lights, lit);
          } else {
            lit.copy(base);
          }
          blend = alpha * texelAlpha;
        }

        if (blend >= 0.999 && depthTest) depth[at] = z;
        const target = at * 3;
        colour[target] = colour[target]! * (1 - blend) + lit.r * blend;
        colour[target + 1] = colour[target + 1]! * (1 - blend) + lit.g * blend;
        colour[target + 2] = colour[target + 2]! * (1 - blend) + lit.b * blend;
      }
    }
  }
}

function drawPoints(
  cloud: THREE.Points,
  colour: Float32Array,
  depth: Float32Array,
  width: number,
  height: number,
  viewProjection: THREE.Matrix4,
): void {
  const material = cloud.material as THREE.PointsMaterial;
  if (material.transparent && material.opacity <= 0.01) return;
  const position = cloud.geometry.attributes.position as THREE.BufferAttribute | undefined;
  if (!position) return;
  const colours = cloud.geometry.attributes.color as THREE.BufferAttribute | undefined;
  const matrix = cloud.matrixWorld;
  const alpha = material.transparent ? material.opacity : 1;
  const size = material.size ?? 1;
  const tint = material.color ?? new THREE.Color(0xffffff);
  for (let i = 0; i < position.count; i += 1) {
    worldA.fromBufferAttribute(position, i).applyMatrix4(matrix);
    va.set(worldA.x, worldA.y, worldA.z, 1).applyMatrix4(viewProjection);
    if (va.w <= 0.001) continue;
    const x = Math.round((va.x / va.w * 0.5 + 0.5) * width);
    const y = Math.round((1 - (va.y / va.w * 0.5 + 0.5)) * height);
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const at = y * width + x;
    if (va.w > depth[at]!) continue;
    const radius = material.sizeAttenuation === false
      ? Math.max(0, size * 0.5)
      : Math.max(0, (size / va.w) * height * 0.5);
    const span = Math.min(4, Math.round(radius));
    const r = colours ? colours.getX(i) : tint.r;
    const g = colours ? colours.getY(i) : tint.g;
    const b = colours ? colours.getZ(i) : tint.b;
    for (let dy = -span; dy <= span; dy += 1) {
      for (let dx = -span; dx <= span; dx += 1) {
        const px = x + dx;
        const py = y + dy;
        if (px < 0 || py < 0 || px >= width || py >= height) continue;
        const target = (py * width + px) * 3;
        colour[target] = colour[target]! * (1 - alpha) + r * alpha;
        colour[target + 1] = colour[target + 1]! * (1 - alpha) + g * alpha;
        colour[target + 2] = colour[target + 2]! * (1 - alpha) + b * alpha;
      }
    }
  }
}

/** 精灵：只为那一颗太阳的光晕。加性混合，中心做一次深度测试当作遮挡。 */
function drawSprite(
  sprite: THREE.Sprite,
  colour: Float32Array,
  depth: Float32Array,
  width: number,
  height: number,
  viewProjection: THREE.Matrix4,
  camera: THREE.PerspectiveCamera,
): void {
  const material = sprite.material as THREE.SpriteMaterial;
  const texture = readTexture(material.map as unknown as TextureLike);
  if (!texture) return;
  const alpha = material.opacity ?? 1;
  if (alpha <= 0.01) return;
  worldA.setFromMatrixPosition(sprite.matrixWorld);
  va.set(worldA.x, worldA.y, worldA.z, 1).applyMatrix4(viewProjection);
  if (va.w <= 0.001) return;
  const cx = (va.x / va.w * 0.5 + 0.5) * width;
  const cy = (1 - (va.y / va.w * 0.5 + 0.5)) * height;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const halfHeight = (sprite.scale.y * 0.5) / (2 * va.w * Math.tan(fov / 2)) * height;
  const halfWidth = (sprite.scale.x * 0.5) / (2 * va.w * Math.tan(fov / 2)) * height;
  const tint = material.color ?? new THREE.Color(0xffffff);
  const centreAt = Math.round(cy) * width + Math.round(cx);
  const occluded = centreAt >= 0 && centreAt < depth.length && va.w > depth[centreAt]!;
  const visibility = occluded ? 0.22 : 1;
  for (let y = Math.max(0, Math.floor(cy - halfHeight)); y < Math.min(height, Math.ceil(cy + halfHeight)); y += 1) {
    for (let x = Math.max(0, Math.floor(cx - halfWidth)); x < Math.min(width, Math.ceil(cx + halfWidth)); x += 1) {
      const u = (x + 0.5 - (cx - halfWidth)) / (halfWidth * 2);
      const v = (y + 0.5 - (cy - halfHeight)) / (halfHeight * 2);
      const tx = Math.min(texture.width - 1, Math.max(0, Math.floor(u * texture.width)));
      const ty = Math.min(texture.height - 1, Math.max(0, Math.floor(v * texture.height)));
      const at = (ty * texture.width + tx) * 4;
      const a = (texture.data[at + 3]! / 255) * alpha * visibility;
      if (a <= 0.004) continue;
      const target = (y * width + x) * 3;
      colour[target] += Math.pow(texture.data[at]! / 255, 2.2) * tint.r * a;
      colour[target + 1] += Math.pow(texture.data[at + 1]! / 255, 2.2) * tint.g * a;
      colour[target + 2] += Math.pow(texture.data[at + 2]! / 255, 2.2) * tint.b * a;
    }
  }
}
