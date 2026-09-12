import * as THREE from "three";
import { buildWorld, type World } from "./world";
import { createCast, type Cast } from "./figures";
import { hitTexture } from "./figures";
import { pistolMesh, scopeMesh } from "./props";

export interface Film {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  world: World;
  cast: Cast;
  /** Pistol (with scope + muzzle flash children) parented to zhang's handR. */
  pistol: THREE.Group;
  scope: THREE.Group;
  /** Cracked-visitor texture applied to the three targets at impact. */
  hitTex: THREE.Texture;
  /** Gas-jet effect groups parented to each of the three targets. */
  gasJets: THREE.Group[];
  gasMat: THREE.MeshBasicMaterial;
  /** Track last-applied clothing texture per figure role, for seek-exact swaps. */
  clothState: Record<string, THREE.Texture | null>;
}

export function assembleFilm(): Film {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070c);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2200);
  camera.position.set(0, 0, 8);

  // ambient + hemisphere so every set has a base read
  const ambient = new THREE.AmbientLight(0x22303e, 1.1);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0x7d95b0, 0x14100c, 0.35);
  scene.add(hemi);

  const world = buildWorld();
  scene.add(world.house, world.shop, world.basement, world.space);

  const cast = createCast();
  scene.add(cast.zhang.root, cast.collector.root);
  for (const f of cast.targets) scene.add(f.root);
  for (const f of cast.crew) scene.add(f.root);

  // pistol + scope + muzzle flash, hung off the right hand.
  // pistolMesh's grip is offset to the anchor origin; its muzzle sits at +Z ≈ 2.85.
  const pistol = new THREE.Group();
  pistol.name = "pistol-rig";
  pistol.add(pistolMesh());
  const scope = scopeMesh();
  scope.position.set(0, 0.74, 1.05); // on top of the slide
  scope.visible = false;
  pistol.add(scope);
  world.muzzleFlash.position.set(0, 0.55, 2.85); // barrel tip
  pistol.add(world.muzzleFlash);
  pistol.visible = false;
  cast.zhang.anchors.handR.add(pistol);

  const hitTex = hitTexture();

  // gas-jet effect groups (white puffs that bloom out of each target at impact)
  const gasMat = new THREE.MeshBasicMaterial({
    color: 0xeef4f8,
    transparent: true,
    opacity: 0.9,
    toneMapped: false,
  });
  const gasJets: THREE.Group[] = [];
  for (const target of cast.targets) {
    const jet = new THREE.Group();
    jet.visible = false;
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), gasMat);
      puff.position.set((i - 2) * 0.16, 0.1 + (i % 2) * 0.12, 0.35);
      jet.add(puff);
    }
    target.anchors.head.add(jet);
    gasJets.push(jet);
  }

  return {
    scene,
    camera,
    world,
    cast,
    pistol,
    scope,
    hitTex,
    gasJets,
    gasMat,
    clothState: {},
  };
}

/** Apply a clothes texture only when it differs — keeps seeking deterministic. */
export function setClothesOnce(film: Film, key: string, figure: { setClothes: (t: THREE.Texture | null) => void }, texture: THREE.Texture | null): void {
  if (film.clothState[key] === texture) return;
  film.clothState[key] = texture;
  figure.setClothes(texture);
}
