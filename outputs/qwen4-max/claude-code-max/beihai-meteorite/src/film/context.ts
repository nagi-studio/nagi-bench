import * as THREE from "three";
import { buildCast, type Cast } from "../world/cast";
import { buildCollector, type CollectorSet } from "../world/sets/collector";
import { buildBridge, type BridgeSet } from "../world/sets/bridge";
import { buildWorkshop, type WorkshopSet } from "../world/sets/workshop";
import { buildBasement, type BasementSet } from "../world/sets/basement";
import { buildSpace, type SpaceSet } from "../world/sets/space";
import { Cards, Scope } from "./overlay";

export interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cast: Cast;
  sets: {
    collector: CollectorSet;
    bridge: BridgeSet;
    workshop: WorkshopSet;
    basement: BasementSet;
    space: SpaceSet;
  };
  cards: Cards;
  scope: Scope;
  /** Show exactly these act groups; hide the rest. */
  setStage: (names: Array<keyof FilmContext["sets"]>) => void;
}

export function buildWorld(renderer: THREE.WebGLRenderer, container: HTMLElement): FilmContext {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / Math.max(1, container.clientHeight), 0.05, 6000);
  camera.position.set(0, 1.6, 5);

  const cast = buildCast();
  const sets = {
    collector: buildCollector(cast),
    bridge: buildBridge(cast),
    workshop: buildWorkshop(cast),
    basement: buildBasement(cast),
    space: buildSpace(cast),
  };
  for (const s of Object.values(sets)) scene.add(s.group);

  const cards = new Cards(document.getElementById("cards")!);
  const scope = new Scope(document.getElementById("scope")!, document.getElementById("scope-hud")!);

  const setStage = (names: Array<keyof typeof sets>) => {
    (Object.keys(sets) as Array<keyof typeof sets>).forEach((k) => {
      sets[k].group.visible = names.includes(k);
    });
  };

  return { scene, camera, renderer, cast, sets, cards, scope, setStage };
}
