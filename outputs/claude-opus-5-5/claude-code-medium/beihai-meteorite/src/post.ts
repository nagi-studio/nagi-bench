import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export interface FX {
  fade: number;      // 0 = picture, 1 = black
  vignette: number;
  grain: number;
  scope: number;     // 0..1 reticle overlay
  flash: number;     // white-hot flash
  tint: THREE.Vector3;
  lift: THREE.Vector3;
  sat: number;
  bloom: number;
  blur: number;      // scope edge chroma
  reticle: number;   // 1 = gun-sight crosshair, 0 = plain circular eyepiece
  time: number;
}

export function defaultFX(): FX {
  return {
    fade: 0,
    vignette: 0.35,
    grain: 0.05,
    scope: 0,
    flash: 0,
    tint: new THREE.Vector3(1, 1, 1),
    lift: new THREE.Vector3(0, 0, 0),
    sat: 1,
    bloom: 0.6,
    blur: 0,
    reticle: 1,
    time: 0,
  };
}

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uFade: { value: 0 },
    uVignette: { value: 0.35 },
    uGrain: { value: 0.05 },
    uScope: { value: 0 },
    uFlash: { value: 0 },
    uTint: { value: new THREE.Vector3(1, 1, 1) },
    uLift: { value: new THREE.Vector3(0, 0, 0) },
    uSat: { value: 1 },
    uTime: { value: 0 },
    uAspect: { value: 16 / 9 },
    uReticle: { value: 1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uFade, uVignette, uGrain, uScope, uFlash, uSat, uTime, uAspect, uReticle;
    uniform vec3 uTint, uLift;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec2 uv = vUv;
      vec3 c = texture2D(tDiffuse, uv).rgb;
      float l = dot(c, vec3(0.299,0.587,0.114));
      c = mix(vec3(l), c, uSat);
      c = c * uTint + uLift * (1.0 - c);
      vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
      float v = smoothstep(1.25, 0.25, length(p * vec2(0.85, 1.15)));
      c *= mix(1.0, v, uVignette);
      // scope reticle
      if (uScope > 0.0) {
        float r = length(p);
        float R = 0.44;
        float inside = smoothstep(R, R - 0.006, r);
        float edge = smoothstep(R - 0.09, R, r);
        vec3 sc = c * (1.0 - 0.55 * edge);
        // chromatic fringe at the eyepiece edge
        sc.r *= 1.0 + 0.25 * edge;
        sc.b *= 1.0 - 0.15 * edge;
        float lw = 0.0011;
        float cross = 0.0;
        cross += step(abs(p.x), lw) * step(0.012, abs(p.y));
        cross += step(abs(p.y), lw) * step(0.012, abs(p.x));
        cross += step(abs(p.x), 0.0045) * step(0.17, abs(p.y));
        cross += step(abs(p.y), 0.0045) * step(0.17, abs(p.x));
        for (int i = 1; i <= 4; i++) {
          float o = float(i) * 0.034;
          cross += step(length(vec2(p.x - o, p.y)), 0.003) + step(length(vec2(p.x + o, p.y)), 0.003);
          cross += step(length(vec2(p.x, p.y - o)), 0.003) + step(length(vec2(p.x, p.y + o)), 0.003);
        }
        cross = clamp(cross, 0.0, 1.0) * step(r, R - 0.004) * uReticle;
        sc = mix(sc, vec3(0.02), cross * 0.92);
        sc *= inside;
        c = mix(c, sc, uScope);
      }
      c += vec3(1.0, 0.92, 0.8) * uFlash;
      float g = hash(uv * vec2(1931.0, 1137.0) + fract(uTime * 7.13)) - 0.5;
      c += g * uGrain;
      // 2.39:1 letterbox
      float visible = min(1.0, uAspect / 2.39);
      float bar = step(visible * 0.5, abs(uv.y - 0.5));
      c *= (1.0 - bar);
      c *= (1.0 - uFade);
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

export function createPost(renderer: THREE.WebGLRenderer, scene: THREE.Scene, getCamera: () => THREE.Camera) {
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, getCamera());
  composer.addPass(renderPass);
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.6, 0.55, 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);

  let w = 1, h = 1;
  return {
    composer,
    setSize(width: number, height: number) {
      w = width;
      h = height;
      composer.setSize(width, height);
      grade.uniforms.uAspect!.value = width / height;
    },
    setPixelRatio(r: number) {
      composer.setPixelRatio(r);
    },
    render(fx: FX) {
      renderPass.camera = getCamera();
      bloom.strength = fx.bloom;
      const u = grade.uniforms;
      u.uFade!.value = fx.fade;
      u.uVignette!.value = fx.vignette;
      u.uGrain!.value = fx.grain;
      u.uScope!.value = fx.scope;
      u.uFlash!.value = fx.flash;
      (u.uTint!.value as THREE.Vector3).copy(fx.tint);
      (u.uLift!.value as THREE.Vector3).copy(fx.lift);
      u.uSat!.value = fx.sat;
      u.uReticle!.value = fx.reticle;
      u.uTime!.value = fx.time;
      u.uAspect!.value = w / h;
      composer.render();
    },
  };
}
