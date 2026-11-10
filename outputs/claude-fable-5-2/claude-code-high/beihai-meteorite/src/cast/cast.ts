import * as THREE from "three";
import { Actor } from "./actors";
import {
  CREW_IDS, ID_COLLECTOR, ID_ZHANG, ID_ZHANG_SUIT, collectorCardigan, suitSkin, zhangCoat, type SuitOptions,
} from "./skins";
import {
  makeBackpack, makeCamera, makeCup, makeGlove, makeKnife, makeMagazine, makePhone, makePistol, makePliers, makePouch, makeScope,
} from "./props";

/** Everyone who appears on screen, plus the props that travel with them. */

const suitCache = new Map<string, THREE.Texture>();
export function suit(o: SuitOptions): THREE.Texture {
  const k = `${o.visor}|${o.stripe ?? ""}|${o.gloveR !== false}`;
  let t = suitCache.get(k);
  if (!t) {
    t = suitSkin(o);
    suitCache.set(k, t);
  }
  return t;
}

export const STRIPE = { leader: "#2f55a8", photo: "#c9762a", zhang: "#4a5f80", none: null } as const;

/** Front-row centre: the three targets. Indices into the crew array. */
export const TARGETS = [4, 5, 6];
/** Two more who are hit by the rounds he let stray. */
export const STRAYS = [15, 2];
export const PHOTOGRAPHER = 30;

export interface Cast {
  group: THREE.Group;
  zhang: Actor;
  collector: Actor;
  zhangSuit: Actor;
  crew: Actor[];
  crewStripe: Array<string | null>;
  cup: THREE.Mesh;
  phone: THREE.Group;
  pistolCivil: THREE.Group;
  pliers: THREE.Mesh;
  knife: THREE.Mesh;
  pistol: THREE.Group;
  scope: THREE.Mesh;
  glove: THREE.Mesh;
  mags: THREE.Mesh[];
  hideAll(): void;
}

export function buildCast(): Cast {
  const group = new THREE.Group();
  group.name = "cast";

  const zhang = new Actor({ id: ID_ZHANG, key: "zhang", clothes: zhangCoat(), height: 1.82, speaker: "章北海", seed: 1 });
  zhang.warm([["open", "shut"], ["blink", "shut"], ["open", "open"], ["narrow", "shut"], ["narrow", "open"], ["blink", "open"]]);
  const collector = new Actor({ id: ID_COLLECTOR, key: "collector", clothes: collectorCardigan(), height: 1.7, speaker: "收藏者", seed: 2 });
  collector.warm([["open", "shut"], ["blink", "shut"], ["open", "open"], ["open", "smile"], ["blink", "smile"], ["wide", "shut"], ["wide", "open"], ["blink", "open"]]);

  const zhangSuit = new Actor({
    id: ID_ZHANG_SUIT, key: "zhangsuit", clothes: suit({ visor: "clear", stripe: STRIPE.zhang }), height: 1.82, centred: true, seed: 3,
  });
  zhangSuit.warm([["open", "shut"], ["blink", "shut"], ["narrow", "shut"]]);
  zhangSuit.figure.anchors.back.add(makeBackpack(0x4a5f80));
  const pouch = makePouch();
  pouch.position.set(-1.2, 0.5, 0);
  zhangSuit.figure.anchors.hipR.add(pouch);
  suit({ visor: "clear", stripe: STRIPE.zhang, gloveR: false });

  const crew: Actor[] = [];
  const crewStripe: Array<string | null> = [];
  for (let i = 0; i <= PHOTOGRAPHER; i++) {
    const stripe = i === PHOTOGRAPHER ? STRIPE.photo : TARGETS.includes(i) ? STRIPE.leader : STRIPE.none;
    const idIndex = TARGETS.includes(i) ? [0, 2, 0][TARGETS.indexOf(i)]! : (i * 7 + 1) % CREW_IDS.length;
    const a = new Actor({
      id: CREW_IDS[idIndex]!, key: `crew${idIndex}`, clothes: suit({ visor: "dark", stripe }),
      height: 1.68 + ((i * 37) % 9) * 0.02, centred: true, seed: 10 + i,
      speaker: i === TARGETS[1] ? "前排领导" : i === PHOTOGRAPHER ? "摄影师" : i === 11 ? "合影者乙" : "",
    });
    a.figure.anchors.back.add(makeBackpack(stripe ? parseInt(stripe.slice(1), 16) : 0x8d929b));
    crew.push(a);
    crewStripe.push(stripe);
    group.add(a.root);
  }
  // Pre-build every suit state the group photo uses.
  for (const stripe of [STRIPE.leader, STRIPE.photo, STRIPE.none]) {
    for (const visor of ["dark", "clear", "cracked", "bloody"] as const) suit({ visor, stripe });
  }
  for (const a of crew) a.warm([["open", "shut"], ["open", "smile"], ["blink", "smile"], ["wide", "gape"], ["shut", "shut"], ["blink", "shut"], ["wide", "open"]]);
  const cam = makeCamera();
  cam.position.set(0, 0.6, 1.6);
  crew[PHOTOGRAPHER]!.figure.anchors.handR.add(cam);

  group.add(zhang.root, collector.root, zhangSuit.root);

  // Civil props.
  const cup = makeCup();
  const phone = makePhone();
  const pistolCivil = makePistol();
  const pliers = makePliers();
  const knife = makeKnife();
  group.add(cup);
  zhang.figure.anchors.handL.add(phone);
  phone.position.set(0, 1.2, 1.2);
  phone.rotation.set(-0.9, 0, 0);
  zhang.figure.anchors.handR.add(pistolCivil);
  zhang.figure.anchors.handR.add(pliers, knife);
  pliers.position.set(0, 0.4, 1.6);
  knife.position.set(0, 0.4, 1.8);

  // Orbit props.
  const pistol = makePistol();
  zhangSuit.figure.anchors.handR.add(pistol);
  const scope = makeScope();
  const glove = makeGlove();
  const mags = [makeMagazine(), makeMagazine()];
  group.add(scope, glove, ...mags);

  const hideAll = (): void => {
    zhang.show(false);
    collector.show(false);
    zhangSuit.show(false);
    for (const a of crew) a.show(false);
    cup.visible = false;
    phone.visible = false;
    pistolCivil.visible = false;
    pliers.visible = false;
    knife.visible = false;
    pistol.visible = false;
    scope.visible = false;
    glove.visible = false;
    for (const m of mags) m.visible = false;
  };
  hideAll();

  return { group, zhang, collector, zhangSuit, crew, crewStripe, cup, phone, pistolCivil, pliers, knife, pistol, scope, glove, mags, hideAll };
}
