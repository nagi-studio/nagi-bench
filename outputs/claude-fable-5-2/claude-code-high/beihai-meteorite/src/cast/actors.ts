import * as THREE from "three";
import { createFigure, applyPose, lerpPose, type Figure, type Pose } from "@agentbench/voxel-kit";
import { bodySkin, type Eyes, type Identity, type Mouth } from "./skins";
import { hash1, type V3 } from "../lib/util";
import { voiceCues } from "../cues/voice";

/**
 * An Actor wraps one voxel-kit figure with a placement group, a cache of painted
 * face states, and automatic blinking / lip movement driven by the voice manifest.
 */

const faceCache = new Map<string, THREE.Texture>();

function faceTexture(id: Identity, key: string, eyes: Eyes, mouth: Mouth): THREE.Texture {
  const k = `${key}|${eyes}|${mouth}`;
  let tex = faceCache.get(k);
  if (!tex) {
    tex = bodySkin(id, eyes, mouth);
    faceCache.set(k, tex);
  }
  return tex;
}

export interface ActorOptions {
  id: Identity;
  /** Cache key for the identity's face sheets. */
  key: string;
  clothes: THREE.Texture | null;
  height?: number;
  speaker?: string;
  /** Put the placement origin at the body's centre (for weightless tumbling). */
  centred?: boolean;
  seed?: number;
}

export class Actor {
  readonly figure: Figure;
  readonly root = new THREE.Group();
  readonly speaker: string;
  readonly seed: number;
  private readonly id: Identity;
  private readonly key: string;
  private faceKey = "";
  private clothesTex: THREE.Texture | null;

  constructor(options: ActorOptions) {
    this.id = options.id;
    this.key = options.key;
    this.speaker = options.speaker ?? "";
    this.seed = options.seed ?? 0;
    this.clothesTex = options.clothes;
    this.figure = createFigure({
      body: faceTexture(this.id, this.key, "open", "shut"),
      clothes: options.clothes,
      heightM: options.height ?? 1.8,
    });
    this.faceKey = "open|shut";
    if (options.centred) this.figure.root.position.y = -(options.height ?? 1.8) * 0.5;
    this.root.add(this.figure.root);
  }

  /** Pre-paint the face states this actor will need so no texture is built mid-shot. */
  warm(states: Array<[Eyes, Mouth]>): this {
    for (const [e, m] of states) faceTexture(this.id, this.key, e, m);
    return this;
  }

  face(eyes: Eyes, mouth: Mouth): this {
    const k = `${eyes}|${mouth}`;
    if (k !== this.faceKey) {
      this.faceKey = k;
      this.figure.setBody(faceTexture(this.id, this.key, eyes, mouth));
    }
    return this;
  }

  clothes(texture: THREE.Texture | null): this {
    if (texture !== this.clothesTex) {
      this.clothesTex = texture;
      this.figure.setClothes(texture);
    }
    return this;
  }

  pose(p: Pose): this {
    applyPose(this.figure, p);
    return this;
  }

  /** Place feet (or centre) at a point with a heading in radians; yaw 0 faces +Z. */
  at(pos: V3, yaw = 0, pitch = 0, roll = 0): this {
    this.root.position.set(pos[0], pos[1], pos[2]);
    this.root.rotation.set(pitch, yaw, roll, "YXZ");
    return this;
  }

  show(v = true): this {
    this.root.visible = v;
    return this;
  }

  isSpeaking(T: number): boolean {
    if (!this.speaker) return false;
    for (const cue of voiceCues) {
      if (cue.speaker === this.speaker && T >= cue.start && T < cue.end) return true;
    }
    return false;
  }

  /**
   * Automatic face: blinks on an irregular deterministic schedule and flaps the
   * mouth in syllable-sized chunks while this actor owns the active voice cue.
   */
  live(T: number, base: { eyes?: Eyes; mouth?: Mouth } = {}): this {
    let eyes: Eyes = base.eyes ?? "open";
    let mouth: Mouth = base.mouth ?? "shut";
    const period = 3.1 + hash1(this.seed + 5) * 2.2;
    const phase = (T + hash1(this.seed) * 7) % period;
    if (phase < 0.13 && eyes !== "wide" && eyes !== "shut") eyes = "blink";
    if (this.isSpeaking(T)) {
      const syll = Math.floor(T * 7.5);
      mouth = hash1(syll * 1.37 + this.seed) > 0.42 ? "open" : base.mouth === "smile" ? "smile" : "shut";
    }
    return this.face(eyes, mouth);
  }
}

/* ---------- pose vocabulary ---------- */

export const mix = (a: Pose, b: Pose, t: number): Pose => lerpPose(a, b, Math.min(1, Math.max(0, t)));

/** Override selected joints of a base pose. */
export function over(base: Pose, patch: Pose): Pose {
  return { ...base, ...patch };
}

/** Upright and almost motionless: the way a soldier stands when he is not on parade. */
export function soldier(T: number): Pose {
  const b = Math.sin(T * 1.3);
  return {
    hips: [0, 0, 0],
    neck: [0.02 + b * 0.008, 0, 0],
    armR: [0.03 + b * 0.012, 0, 0.03],
    armL: [0.03 - b * 0.012, 0, -0.03],
    legR: [0, 0, 0],
    legL: [0, 0, 0],
    lift: b * 0.04,
  };
}

/** Relaxed and a little stooped, weight shifting: a man at home among his things. */
export function homely(T: number, seed = 0): Pose {
  const b = Math.sin(T * 1.5 + seed), s = Math.sin(T * 0.45 + seed * 2);
  return {
    hips: [0.06, s * 0.05, s * 0.015],
    neck: [0.07 + b * 0.015, s * 0.08, 0],
    armR: [-0.12 + b * 0.03, 0, 0.08],
    armL: [-0.1 - b * 0.03, 0, -0.08],
    legR: [-0.05, 0, 0.02],
    legL: [-0.05, 0, -0.02],
    lift: b * 0.06 - 0.1,
  };
}

/** Talking with the hands; `energy` 0..1 scales the gesture. */
export function gesturing(T: number, energy = 1, seed = 0): Pose {
  const base = homely(T, seed);
  const g = Math.sin(T * 3.1 + seed) * 0.5 + Math.sin(T * 5.3 + seed * 3) * 0.25;
  const h = Math.sin(T * 2.3 + 1 + seed);
  return {
    ...base,
    neck: [0.04 + Math.sin(T * 4.1) * 0.05 * energy, (base.neck?.[1] ?? 0) + h * 0.06 * energy, 0],
    armR: [-0.75 * energy - g * 0.28 * energy, 0, 0.28 * energy],
    armL: [-0.45 * energy + g * 0.22 * energy, 0, -0.2 * energy],
  };
}

export { applyPose, lerpPose };
export type { Pose };
