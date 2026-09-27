import * as THREE from "three";
import { SpaceSet } from "../src/sets/space";
import { HutongSet } from "../src/sets/hutong";
import { RoomSet } from "../src/sets/room";
import { ShopSet } from "../src/sets/shop";
import { BasementSet } from "../src/sets/basement";

const sets = { space: new SpaceSet(), hutong: new HutongSet(), room: new RoomSet(), shop: new ShopSet(), basement: new BasementSet() };
for (const [name, s] of Object.entries(sets)) {
  let tris = 0, meshes = 0, lights = 0, biggest = 0, bigName = "";
  s.group.traverse((o: any) => {
    if (o.isLight) lights++;
    if (!o.isMesh) return;
    meshes++;
    const g = o.geometry as THREE.BufferGeometry;
    const n = (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.isInstancedMesh ? o.instanceMatrix.count : 1);
    tris += n;
    if (n > biggest) { biggest = n; bigName = o.name || o.parent?.name || o.type; }
  });
  console.log(`${name.padEnd(9)} meshes=${meshes} lights=${lights} tris≈${Math.round(tris / 1000)}k biggest=${Math.round(biggest / 1000)}k (${bigName})`);
}
