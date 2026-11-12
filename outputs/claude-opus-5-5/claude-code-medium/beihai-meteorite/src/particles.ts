import * as THREE from "three";
import { hash3, puffTexture } from "./util";

export interface Emitter {
  start: number;
  end: number;
  rate: number; // particles per second
  life: number;
  pos: (born: number, i: number) => THREE.Vector3;
  vel: (born: number, i: number) => THREE.Vector3;
  size: [number, number];
  color: THREE.Color;
  alpha: number;
  spread?: number;
  drag?: number; // 0 = vacuum (no slowing)
  gravity?: number;
  seed?: number;
}

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;
  uniform float uScale;
  #include <common>
  #include <logdepthbuf_pars_vertex>
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * uScale / max(0.001, -mv.z), 0.0, 900.0);
    gl_Position = projectionMatrix * mv;
    #include <logdepthbuf_vertex>
  }
`;
const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  varying float vAlpha;
  varying vec3 vColor;
  #include <logdepthbuf_pars_fragment>
  void main() {
    #include <logdepthbuf_fragment>
    vec4 t = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vColor, t.a * vAlpha);
    if (gl_FragColor.a < 0.003) discard;
  }
`;

export class PuffSystem {
  readonly points: THREE.Points;
  private readonly pos: Float32Array;
  private readonly size: Float32Array;
  private readonly alpha: Float32Array;
  private readonly col: Float32Array;
  readonly material: THREE.ShaderMaterial;
  emitters: Emitter[] = [];

  constructor(readonly max: number, additive = false, map: THREE.Texture = puffTexture()) {
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.alpha = new Float32Array(max);
    this.col = new Float32Array(max * 3);
    g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(this.size, 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(this.alpha, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(this.col, 3));
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uMap: { value: map }, uScale: { value: 600 } },
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
  }

  setViewportHeight(h: number, fovDeg: number) {
    this.material.uniforms.uScale!.value = h / (2 * Math.tan((fovDeg * Math.PI) / 360));
  }

  update(t: number) {
    let n = 0;
    const tmp = new THREE.Vector3();
    for (const e of this.emitters) {
      if (t < e.start) continue;
      const until = Math.min(t, e.end);
      const count = Math.floor((until - e.start) * e.rate);
      const firstAlive = Math.max(0, Math.floor((t - e.life - e.start) * e.rate));
      for (let k = firstAlive; k <= count && n < this.max; k++) {
        const born = e.start + k / e.rate;
        if (born > t) break;
        const age = t - born;
        if (age > e.life || age < 0) continue;
        const life = age / e.life;
        const p = e.pos(born, k);
        const v = e.vel(born, k);
        const s = e.seed ?? 1;
        const sp = e.spread ?? 0.3;
        const speed = v.length();
        tmp.set(
          v.x + (hash3(k, s, 1) - 0.5) * sp * speed,
          v.y + (hash3(k, s, 2) - 0.5) * sp * speed,
          v.z + (hash3(k, s, 3) - 0.5) * sp * speed,
        );
        const drag = e.drag ?? 0;
        const dist = drag > 0 ? (1 - Math.exp(-drag * age)) / drag : age;
        this.pos[n * 3] = p.x + tmp.x * dist;
        this.pos[n * 3 + 1] = p.y + tmp.y * dist - 0.5 * (e.gravity ?? 0) * age * age;
        this.pos[n * 3 + 2] = p.z + tmp.z * dist;
        this.size[n] = e.size[0] + (e.size[1] - e.size[0]) * life;
        this.alpha[n] = e.alpha * (1 - life) * Math.min(1, age * 30);
        this.col[n * 3] = e.color.r;
        this.col[n * 3 + 1] = e.color.g;
        this.col[n * 3 + 2] = e.color.b;
        n++;
      }
    }
    for (let i = n; i < this.max; i++) this.alpha[i] = 0;
    const g = this.points.geometry;
    g.setDrawRange(0, Math.max(n, 1));
    (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
  }
}
