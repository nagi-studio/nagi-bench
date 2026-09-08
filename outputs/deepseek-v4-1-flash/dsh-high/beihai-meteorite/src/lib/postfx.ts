import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/**
 * A small, fixed post chain: bloom for the flames and flashes, then a film
 * grade (subtle chromatic aberration, grain, vignette). Letterboxing and the
 * frame are CSS so they stay pixel-crisp at any resolution.
 */

const FilmGrade = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uGrain: { value: 0.055 },
    uVignette: { value: 0.9 },
    uAberration: { value: 0.0016 },
    uFade: { value: 0.0 }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uAberration;
    uniform float uFade;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(443.897, 441.423));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      // chromatic aberration grows toward the frame edge
      vec2 off = c * uAberration * (0.35 + r2 * 3.0);
      vec4 col;
      col.r = texture2D(tDiffuse, uv + off).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - off).b;
      col.a = 1.0;

      // gentle contrast / lift
      col.rgb = (col.rgb - 0.5) * 1.035 + 0.5;

      // vignette
      float v = smoothstep(0.95, 0.28, r2 * 2.0);
      col.rgb *= mix(1.0, v, uVignette * 0.55);

      // grain (animated)
      float g = hash(uv * vec2(1920.0, 1080.0) + uTime * 60.0) - 0.5;
      col.rgb += g * uGrain * (1.0 - r2);

      // fade to black
      col.rgb *= (1.0 - uFade);

      gl_FragColor = col;
    }
  `
};

export class Post {
  readonly composer: EffectComposer;
  readonly bloom: UnrealBloomPass;
  readonly grade: ShaderPass;
  private renderer: THREE.WebGLRenderer;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer = renderer;
    const size = renderer.getSize(new THREE.Vector2());
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.55, 0.75, 0.82);
    this.bloom.threshold = 0.72;
    this.bloom.radius = 0.72;
    this.bloom.strength = 0.55;
    this.composer.addPass(this.bloom);

    this.grade = new ShaderPass(FilmGrade);
    this.composer.addPass(this.grade);

    this.composer.addPass(new OutputPass());
  }

  setSize(w: number, h: number): void {
    this.composer.setSize(w, h);
    this.bloom.setSize(w, h);
  }

  render(dt: number, time: number, bloom: number, fade: number): void {
    this.grade.uniforms.uTime.value = time;
    this.grade.uniforms.uFade.value = fade;
    this.bloom.strength = bloom;
    this.composer.render(dt);
  }
}
