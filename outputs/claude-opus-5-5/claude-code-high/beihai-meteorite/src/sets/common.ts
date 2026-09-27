import * as THREE from "three";
import { buildVoxelGeometry } from "@agentbench/voxel-kit";
import { mesh, VM } from "../props";
import { hash } from "../util";

/** A voxel slab whose colour is chosen per cell; anchored at its min corner. */
export function slab(nx: number, ny: number, nz: number, v: number, colour: (x: number, y: number, z: number) => number | null, shadow = true): THREE.Mesh {
  return mesh(buildVoxelGeometry({ size: [nx, ny, nz], at: colour }, { voxel: v, anchor: "min" }), VM, shadow);
}

export function brick(x: number, y: number, a = 0x6f7176, b = 0x5d6066, mortar = 0x8a8c90): number {
  const row = y % 2;
  if (y % 3 === 2) return mortar;
  const bx = Math.floor((x + row * 2) / 4);
  if ((x + row * 2) % 4 === 3) return mortar;
  return hash(bx, Math.floor(y / 3)) > 0.5 ? a : b;
}

export function planks(x: number, z: number, a = 0x6a4a30, b = 0x5a3c26): number {
  const board = Math.floor(z / 2);
  const joint = (x + board * 5) % 11 === 0;
  if (joint) return 0x3a2818;
  return hash(board, Math.floor((x + board * 3) / 6)) > 0.5 ? a : b;
}

export function setShadow(o: THREE.Object3D, cast: boolean, receive: boolean): void {
  o.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = cast;
      c.receiveShadow = receive;
    }
  });
}
