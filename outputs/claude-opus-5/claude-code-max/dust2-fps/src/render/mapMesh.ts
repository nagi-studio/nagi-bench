/**
 * Builds the visible Dust2 geometry from the very same data the collision world uses, so
 * what you see is exactly what you bump into.
 */

import * as THREE from 'three';
import type { CollisionWorld, SolidBox } from '../game/map/collision.ts';
import { BOMB_SITES, PROPS, SECTORS, sectorFloorAt } from '../game/map/dust2.ts';
import { GeometryBuilder, PALETTE, linearRGB, noiseTexture, textTexture } from './geometry.ts';

/** Deterministic per-id colour jitter so neighbouring surfaces are not identical. */
function hashTint(id: string, base: number, alt: number): [number, number, number] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const t = ((h % 100) / 100) * 0.65;
  const a = linearRGB(base);
  const b = linearRGB(alt);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function propColor(kind: SolidBox['kind']): [number, number, number] {
  switch (kind) {
    case 'crate':
      return linearRGB(PALETTE.crate);
    case 'crateBig':
      return linearRGB(PALETTE.crateDark);
    case 'metal':
      return linearRGB(PALETTE.metal);
    case 'concrete':
      return linearRGB(PALETTE.concrete);
    case 'barrel':
      return linearRGB(PALETTE.barrel);
    case 'door':
      return linearRGB(PALETTE.door);
    case 'car':
      return linearRGB(PALETTE.car);
    case 'ceiling':
      return linearRGB(PALETTE.ceiling);
    default:
      return linearRGB(PALETTE.wall);
  }
}

export interface MapMeshes {
  root: THREE.Group;
  dispose(): void;
}

export function buildMapMeshes(collision: CollisionWorld, castShadows: boolean): MapMeshes {
  const root = new THREE.Group();
  root.name = 'dust2';

  const surfaceTex = noiseTexture(128, 22, 214);
  surfaceTex.repeat.set(1, 1);

  const structure = new GeometryBuilder();

  // ---- floors -------------------------------------------------------------
  for (const s of SECTORS) {
    const top = hashTint(s.id, PALETTE.floor, PALETTE.floorAlt);
    const side = linearRGB(PALETTE.skirt);
    structure.addFloor(
      s.x0, s.z0, s.x1, s.z1,
      sectorFloorAt(s, s.x0, s.z0),
      sectorFloorAt(s, s.x1, s.z0),
      sectorFloorAt(s, s.x1, s.z1),
      sectorFloorAt(s, s.x0, s.z1),
      Math.min(sectorFloorAt(s, s.x0, s.z0), sectorFloorAt(s, s.x1, s.z1)) - 2.5,
      top,
      side,
    );
  }

  // ---- walls and ceilings -------------------------------------------------
  for (const w of collision.walls) {
    const tint = hashTint(w.sector ?? 'w', PALETTE.wall, PALETTE.wallAlt);
    structure.addBox(w.x0, w.y0, w.z0, w.x1, w.y1, w.z1, tint);
    // A darker band along the top edge reads as the classic Dust2 trim.
    const band = linearRGB(PALETTE.wallDark);
    structure.addBox(w.x0 - 0.06, w.y1 - 0.45, w.z0 - 0.06, w.x1 + 0.06, w.y1 - 0.1, w.z1 + 0.06, band);
  }
  for (const cbox of collision.ceilings) {
    structure.addBox(cbox.x0, cbox.y0, cbox.z0, cbox.x1, cbox.y1, cbox.z1, linearRGB(PALETTE.ceiling));
  }

  const structureMesh = new THREE.Mesh(
    structure.build(),
    new THREE.MeshLambertMaterial({ vertexColors: true, map: surfaceTex }),
  );
  structureMesh.receiveShadow = true;
  structureMesh.castShadow = false;
  structureMesh.name = 'structure';
  root.add(structureMesh);

  // ---- props (separate mesh so they can cast shadows) ---------------------
  const propBuilder = new GeometryBuilder();
  for (const p of PROPS) {
    const col = propColor(p.kind);
    const x0 = p.x - p.sx / 2;
    const x1 = p.x + p.sx / 2;
    const z0 = p.z - p.sz / 2;
    const z1 = p.z + p.sz / 2;

    if (p.kind === 'door') {
      // Door leaf plus a frame, so the mid doors read as doors you walk between.
      const frame = linearRGB(PALETTE.doorFrame);
      propBuilder.addBox(x0, p.y, z0, x1, p.y + p.sy, z1, col);
      propBuilder.addBox(x0 - 0.06, p.y, z0 - 0.05, x0 + 0.14, p.y + p.sy + 0.12, z1 + 0.05, frame);
      propBuilder.addBox(x1 - 0.14, p.y, z0 - 0.05, x1 + 0.06, p.y + p.sy + 0.12, z1 + 0.05, frame);
      propBuilder.addBox(x0 - 0.06, p.y + p.sy - 0.16, z0 - 0.05, x1 + 0.06, p.y + p.sy + 0.12, z1 + 0.05, frame);
      continue;
    }

    if (p.kind === 'barrel') {
      // Octagonal prism approximates a barrel without a cylinder primitive.
      const r = p.sx / 2;
      const seg = 8;
      const rings = linearRGB(PALETTE.crateDark);
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2;
        const a1 = ((i + 1) / seg) * Math.PI * 2;
        const px0 = p.x + Math.cos(a0) * r;
        const pz0 = p.z + Math.sin(a0) * r;
        const px1 = p.x + Math.cos(a1) * r;
        const pz1 = p.z + Math.sin(a1) * r;
        propBuilder.addQuad(
          [px0, p.y, pz0],
          [px1, p.y, pz1],
          [px1, p.y + p.sy, pz1],
          [px0, p.y + p.sy, pz0],
          col,
        );
        propBuilder.addTriangle(
          p.x, p.y + p.sy, p.z,
          px0, p.y + p.sy, pz0,
          px1, p.y + p.sy, pz1,
          rings,
        );
      }
      continue;
    }

    if (p.kind === 'car') {
      const body = col;
      const glass = linearRGB(0x2b3a45);
      propBuilder.addBox(x0, p.y, z0, x1, p.y + p.sy * 0.55, z1, body);
      const inset = 0.22;
      propBuilder.addBox(
        x0 + (x1 - x0) * inset, p.y + p.sy * 0.55, z0 + (z1 - z0) * inset,
        x1 - (x1 - x0) * inset, p.y + p.sy, z1 - (z1 - z0) * inset,
        glass,
      );
      continue;
    }

    propBuilder.addBox(x0, p.y, z0, x1, p.y + p.sy, z1, col);
    if (p.kind === 'crate' || p.kind === 'crateBig') {
      // Plank edging.
      const edge = linearRGB(PALETTE.crateDark);
      const t = 0.08;
      propBuilder.addBox(x0 - 0.01, p.y + p.sy - t, z0 - 0.01, x1 + 0.01, p.y + p.sy, z1 + 0.01, edge);
      propBuilder.addBox(x0 - 0.01, p.y, z0 - 0.01, x1 + 0.01, p.y + t, z1 + 0.01, edge);
    }
  }

  const propMesh = new THREE.Mesh(
    propBuilder.build(),
    new THREE.MeshLambertMaterial({ vertexColors: true, map: surfaceTex }),
  );
  propMesh.castShadow = castShadows;
  propMesh.receiveShadow = true;
  propMesh.name = 'props';
  root.add(propMesh);

  // ---- bomb site markings -------------------------------------------------
  const siteTextures: THREE.Texture[] = [];
  for (const site of BOMB_SITES) {
    const colour = site.id === 'A' ? PALETTE.siteA : PALETTE.siteB;
    const y = collision.sectorGroundAt((site.x0 + site.x1) / 2, (site.z0 + site.z1) / 2) + 0.02;

    const marks = new GeometryBuilder();
    const tint = linearRGB(colour);
    const t = 0.35;
    marks.addBox(site.x0, y, site.z0, site.x1, y + 0.02, site.z0 + t, tint, false);
    marks.addBox(site.x0, y, site.z1 - t, site.x1, y + 0.02, site.z1, tint, false);
    marks.addBox(site.x0, y, site.z0, site.x0 + t, y + 0.02, site.z1, tint, false);
    marks.addBox(site.x1 - t, y, site.z0, site.x1, y + 0.02, site.z1, tint, false);
    const markMesh = new THREE.Mesh(marks.build(), new THREE.MeshLambertMaterial({ vertexColors: true }));
    markMesh.name = `site_${site.id}_border`;
    root.add(markMesh);

    const letterTex = textTexture(site.id, site.id === 'A' ? '#d0453a' : '#3f7fc4', 256);
    siteTextures.push(letterTex);
    const letter = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({ map: letterTex, transparent: true, opacity: 0.55, depthWrite: false }),
    );
    letter.rotation.x = -Math.PI / 2;
    letter.position.set((site.x0 + site.x1) / 2, y + 0.03, (site.z0 + site.z1) / 2);
    letter.name = `site_${site.id}_letter`;
    root.add(letter);
  }

  // ---- surrounding desert so the map does not float in the void -----------
  // A separate texture instance: the plane's UVs are 0..1, so it needs its own tiling.
  const groundTex = noiseTexture(128, 18, 200);
  groundTex.repeat.set(120, 120);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshLambertMaterial({ color: 0xb59a68, map: groundTex }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(-6, -3.2, -15);
  ground.receiveShadow = false;
  root.add(ground);

  // A few distant blocks for a skyline.
  const skyline = new GeometryBuilder();
  const skyTint = linearRGB(0xa08a63);
  const blocks: Array<[number, number, number, number, number]> = [
    [-90, -60, 16, 26, 22],
    [-60, 60, 14, 30, 18],
    [70, -20, 18, 24, 26],
    [40, 70, 12, 22, 20],
    [-110, 20, 20, 18, 30],
    [10, -110, 15, 34, 24],
  ];
  for (const [x, z, h, w, d] of blocks) {
    skyline.addBox(x - w / 2, -3.2, z - d / 2, x + w / 2, h, z + d / 2, skyTint);
  }
  const skylineMesh = new THREE.Mesh(
    skyline.build(),
    new THREE.MeshLambertMaterial({ vertexColors: true }),
  );
  root.add(skylineMesh);

  return {
    root,
    dispose() {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      surfaceTex.dispose();
      groundTex.dispose();
      siteTextures.forEach((t) => t.dispose());
    },
  };
}
