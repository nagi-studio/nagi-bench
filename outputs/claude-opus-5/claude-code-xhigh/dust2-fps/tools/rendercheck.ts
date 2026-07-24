/**
 * 渲染层冒烟测试：用 three 的替身 + DOM 替身，把渲染代码在 Node 里真的跑一遍。
 * 能抓到：拼错的 API、传错的参数、NaN 位置/旋转、贴图生成崩溃、
 * 角色骨架层级搭错、武器数据里非法的尺寸等等。
 *
 *   node --import ./tools/mock/hook.mjs tools/rendercheck.ts
 */

import { installDom } from './mock/dom.mjs';

installDom();

const { GameEngine, FIXED_DT } = await import('../src/game/engine.ts');
const { GameRenderer } = await import('../src/render/renderer.ts');
const { buildMapMeshes, buildEnvironment } = await import('../src/render/mapMesh.ts');
const { createCharacter, poseCharacter, setCharacterWeapon } = await import(
  '../src/render/character.ts'
);
const { buildWeaponModel, buildViewHands, buildPlantedBomb } = await import(
  '../src/render/weaponModel.ts'
);
const { EffectSystem } = await import('../src/render/effects.ts');
const { surfaceTextures, skyTexture, sparkTexture, softDotTexture } = await import(
  '../src/render/textures.ts'
);
const { WEAPONS, WEAPON_IDS } = await import('../src/game/weapons.ts');
const THREE = await import('three');

const problems: string[] = [];
function check(label: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${label}`);
  } catch (err) {
    problems.push(`${label}: ${(err as Error).message}`);
    console.log(`  ✗ ${label}: ${(err as Error).message}`);
  }
}

console.log('渲染层冒烟测试');

// ---- 贴图 ----
check('程序化贴图生成', () => {
  const tex = surfaceTextures();
  const kinds = Object.keys(tex);
  if (kinds.length !== 8) throw new Error(`材质数量应为 8，实际 ${kinds.length}`);
  for (const k of kinds) {
    const t = tex[k as keyof typeof tex];
    if (t.wrapS !== THREE.RepeatWrapping) throw new Error(`${k} 没设置平铺`);
    if (t.colorSpace !== THREE.SRGBColorSpace) throw new Error(`${k} 色彩空间不对`);
  }
  skyTexture();
  sparkTexture();
  softDotTexture();
});

// ---- 引擎 + 地图网格 ----
const engine = new GameEngine({ seed: 99, botSkill: 0.5 });
engine.startMatch();

check('地图网格合批', () => {
  const meshes = buildMapMeshes(engine.map.world);
  const count = meshes.group.children.length;
  if (count < 5 || count > 12) throw new Error(`合批后的 mesh 数量异常: ${count}`);
  let verts = 0;
  for (const child of meshes.group.children) {
    const geo = (child as unknown as { geometry: { attributes: Record<string, { count: number; itemSize: number }> } }).geometry;
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const nor = geo.attributes.normal;
    if (!pos || !uv || !nor) throw new Error('缺少 position/uv/normal 属性');
    if (pos.count !== uv.count || pos.count !== nor.count) {
      throw new Error('position/uv/normal 顶点数不一致');
    }
    if (pos.count % 3 !== 0) throw new Error('顶点数不是 3 的倍数');
    verts += pos.count;
  }
  console.log(`      合批 ${count} 个 mesh / ${verts} 顶点`);
  meshes.dispose();
});

check('远景环境', () => {
  const env = buildEnvironment(skyTexture());
  if (env.children.length < 3) throw new Error('环境缺少地面/天空/远景');
});

// ---- 角色 ----
check('人形角色骨架', () => {
  for (const team of ['T', 'CT'] as const) {
    const c = createCharacter(team);
    // 必须真的有独立的头/躯干/双臂/双腿
    const required = ['hips', 'spine', 'headPivot', 'shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'legL', 'legR', 'kneeL', 'kneeR'] as const;
    for (const key of required) {
      if (!c[key]) throw new Error(`${team} 缺少骨骼节点 ${key}`);
    }
    let meshCount = 0;
    c.root.traverse((o) => {
      if ((o as { type: string }).type === 'Mesh') meshCount++;
    });
    if (meshCount < 18) throw new Error(`${team} 身体部件太少(${meshCount})，不像人形`);
    // 层级关系
    if (c.headPivot.parent !== c.spine) throw new Error('头没有挂在躯干上');
    if (c.elbowL.parent !== c.shoulderL) throw new Error('小臂没有挂在大臂上');
    if (c.kneeR.parent !== c.legR) throw new Error('小腿没有挂在大腿上');
    if (c.weaponMount.parent !== c.spine) throw new Error('武器挂点没跟随躯干');

    setCharacterWeapon(c, WEAPONS.ak47);
    if (!c.weaponObj) throw new Error('武器模型没有挂上');
    setCharacterWeapon(c, WEAPONS.awp);
    if (c.weaponMount.children.length !== 1) throw new Error('换武器后旧模型没清掉');

    // 姿态：走路 / 蹲 / 瞄准 / 死亡都不能产生 NaN
    for (const t of [0, 0.3, 1.1, 2.7]) {
      poseCharacter(c, {
        speed: t * 2,
        maxSpeed: 5,
        animPhase: t * 6,
        pitch: Math.sin(t) * 0.8,
        crouch: t > 1 ? 1 : 0,
        alive: t < 2,
        deathTime: Math.max(0, t - 2),
        time: t,
      });
      const bad: string[] = [];
      c.root.traverse((o) => {
        const r = (o as { rotation: { x: number; y: number; z: number } }).rotation;
        const p = (o as { position: { x: number; y: number; z: number } }).position;
        if (![r.x, r.y, r.z, p.x, p.y, p.z].every(Number.isFinite)) bad.push((o as { type: string }).type);
      });
      if (bad.length) throw new Error(`姿态出现 NaN: ${bad.join(',')}`);
    }
  }
});

// ---- 武器模型 ----
check('全部武器模型', () => {
  for (const id of WEAPON_IDS) {
    const def = WEAPONS[id];
    const model = buildWeaponModel(def, true);
    if (model.children.length !== def.parts.length) {
      throw new Error(`${id} 零件数量对不上`);
    }
    for (const part of def.parts) {
      if (!part.s.every((v) => v > 0)) throw new Error(`${id} 有非法尺寸`);
    }
  }
  buildViewHands(0x222222, 0x888888);
  const bomb = buildPlantedBomb();
  if (!bomb.light) throw new Error('C4 缺少指示灯');
});

// ---- 特效 ----
check('特效池', () => {
  const fx = new EffectSystem();
  for (let i = 0; i < 50; i++) {
    fx.impact(i, 1, 0, 0, 1, 0, 'sand');
    fx.blood(i, 1, 0, 0, 1, 0);
    fx.muzzle(i, 1, 0, 0, 0, -1);
    fx.tracers.spawn(0, 0, 0, i, 2, 3);
  }
  fx.explosion(0, 1, 0);
  for (let i = 0; i < 200; i++) fx.update(1 / 60);
  fx.dispose();
});

// ---- 完整渲染器：跑若干帧 ----
check('GameRenderer 跑 300 帧', () => {
  const canvas = document.createElement('canvas') as unknown as HTMLCanvasElement;
  const renderer = new GameRenderer(canvas, engine, { fov: 90, shadows: true, viewmodel: true });
  renderer.resize(1600, 900);

  // 让所有人都由 AI 驱动，模拟真实对局
  for (const a of engine.actors) a.bot = true;

  for (let frame = 0; frame < 300; frame++) {
    engine.step(FIXED_DT);
    const events = engine.drainEvents();
    renderer.sync(engine, FIXED_DT, events);
    renderer.render();
  }
  const calls = (renderer.renderer as unknown as { renderCalls: number }).renderCalls;
  if (calls < 300) throw new Error(`渲染调用次数异常: ${calls}`);
  console.log(`      渲染调用 ${calls} 次`);
  renderer.applySettings({ shadows: false, fov: 75 });
  renderer.render();
  renderer.dispose();
});

// ---- 玩家死亡 -> 观战 -> 接管，渲染不能崩 ----
check('阵亡观战与接管时的渲染', () => {
  const canvas = document.createElement('canvas') as unknown as HTMLCanvasElement;
  const e2 = new GameEngine({ seed: 7, botSkill: 0.5 });
  e2.startMatch();
  const renderer = new GameRenderer(canvas, e2, { fov: 90, shadows: false, viewmodel: true });
  renderer.resize(1280, 720);
  const me = e2.localActor!;
  me.health = 0;
  me.alive = false;
  for (let f = 0; f < 60; f++) {
    e2.step(FIXED_DT);
    renderer.sync(e2, FIXED_DT, e2.drainEvents());
    renderer.render();
  }
  e2.spectateNext(1);
  if (!e2.takeControl()) throw new Error('接管队友失败');
  if (!e2.localActor?.alive) throw new Error('接管后玩家应该是活的');
  for (let f = 0; f < 60; f++) {
    e2.step(FIXED_DT);
    renderer.sync(e2, FIXED_DT, e2.drainEvents());
    renderer.render();
  }
  renderer.dispose();
});

if (problems.length) {
  console.log(`\n✗ 渲染层问题 ${problems.length} 条`);
  process.exit(1);
}
console.log('\n✓ 渲染层冒烟测试通过');
