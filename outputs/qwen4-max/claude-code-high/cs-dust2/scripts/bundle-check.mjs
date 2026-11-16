// Bundle the whole app with Bun against stub three/react packages in a temp
// dir. Validates that every cross-module import/export resolves (no type
// checking, no runtime). The real project is untouched.
import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(tmpdir(), `dust2-bundle-${Date.now()}`);
mkdirSync(root, { recursive: true });
cpSync(join(import.meta.dirname, '../src'), join(root, 'src'), { recursive: true });

const threeNames = [
  'WebGLRenderer', 'Scene', 'Color', 'FogExp2', 'PerspectiveCamera', 'HemisphereLight',
  'DirectionalLight', 'PlaneGeometry', 'BoxGeometry', 'CylinderGeometry', 'SphereGeometry',
  'BufferGeometry', 'Mesh', 'MeshLambertMaterial', 'MeshBasicMaterial', 'LineBasicMaterial',
  'Line', 'Sprite', 'SpriteMaterial', 'PointLight', 'Object3D', 'Group', 'Vector3',
  'CanvasTexture', 'Clock', 'BufferAttribute',
];
const threeStub = threeNames.map((n) => `export class ${n} { constructor(...a){} }`).join('\n')
  + '\nexport const RepeatWrapping = 1000;\nexport const SRGBColorSpace = "srgb";\nexport const PCFSoftShadowMap = 2;\n';
const reactStub = 'export default {};\nexport const useEffect=()=>{},useRef=()=>({current:null}),useState=(v)=>[v,()=>{}],useCallback=(f)=>f,useMemo=(f)=>f();\n';
const reactDomStub = 'export const createRoot=()=>({render(){}});\nexport default {};\n';

for (const [name, content, main] of [
  ['three', threeStub, 'index.js'],
  ['react', reactStub, 'index.js'],
]) {
  const dir = join(root, 'node_modules', name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    name, version: '0.0.0', type: 'module',
    exports: name === 'react'
      ? { '.': './index.js', './jsx-runtime': './jsx-runtime.js', './jsx-dev-runtime': './jsx-runtime.js' }
      : { '.': './index.js' },
  }));
  writeFileSync(join(dir, main), content);
}
writeFileSync(join(root, 'node_modules/react/jsx-runtime.js'), 'export const jsx=()=>null, jsxs=()=>null, jsxDEV=()=>null, Fragment=()=>null;\n');
mkdirSync(join(root, 'node_modules/react-dom'), { recursive: true });
writeFileSync(join(root, 'node_modules/react-dom/client.js'), reactDomStub);
writeFileSync(join(root, 'node_modules/react-dom/package.json'), JSON.stringify({
  name: 'react-dom', version: '0.0.0', type: 'module', exports: { '.': './index.js', './client': './client.js' },
}));
writeFileSync(join(root, 'entry.ts'), 'import App from "./src/App";\nimport { GameEngine } from "./src/game/engine";\nconsole.log(App, GameEngine);\n');

const result = await Bun.build({
  entrypoints: [join(root, 'entry.ts')],
  outdir: join(root, 'out'),
  target: 'browser',
  logLevel: 'warning',
});
rmSync(root, { recursive: true, force: true });
if (!result.success) {
  console.error('BUNDLE FAILED');
  process.exit(1);
}
console.log('BUNDLE OK — all module imports/exports resolve');
