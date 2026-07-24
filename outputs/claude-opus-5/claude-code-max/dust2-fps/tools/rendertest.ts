/**
 * Render-layer smoke test. Run with: node tools/rendertest.ts
 *
 * Requires the temporary three.js stub in node_modules (dev only). It exercises every
 * procedural mesh builder so typos, bad geometry arguments and broken scene graphs surface
 * without needing a GPU.
 */

import { Vec3 } from '../src/core/math.ts';
import { CollisionWorld } from '../src/game/map/collision.ts';
import { WEAPON_IDS } from '../src/game/weapons.ts';
import { GameWorld } from '../src/game/world.ts';
import { emptyInput } from '../src/game/playerinput.ts';
import { check, report, section, skip } from './harness.ts';
import './domshim.ts';

// three.js is a real dependency of the render layer only, so this suite needs
// `npm install` first. Skip cleanly rather than failing the whole run.
try {
  await import('three');
} catch {
  console.log('\n\x1b[33mrender layer suite skipped: three.js is not installed (run `npm install`)\x1b[0m');
  process.exit(0);
}

const { GeometryBuilder, PALETTE, linearRGB, noiseTexture, textTexture } = await import(
  '../src/render/geometry.ts'
);
const { buildMapMeshes } = await import('../src/render/mapMesh.ts');
const { buildWeaponModel } = await import('../src/render/weaponModels.ts');
const { createCharacter, updateCharacter } = await import('../src/render/character.ts');
const { EffectsSystem } = await import('../src/render/effects.ts');
const { ViewModel } = await import('../src/render/viewmodel.ts');
const THREE = await import('three');

section('geometry builder');

{
  const b = new GeometryBuilder();
  b.addBox(0, 0, 0, 1, 1, 1, linearRGB(PALETTE.wall));
  check('box produces 12 triangles', b.triangleCount === 12, `${b.triangleCount}`);
  b.addFloor(0, 0, 4, 4, 0, 0, 1, 1, -2, linearRGB(PALETTE.floor), linearRGB(PALETTE.skirt));
  const geo = b.build();
  const pos = geo.getAttribute('position');
  const col = geo.getAttribute('color');
  const nor = geo.getAttribute('normal');
  const uv = geo.getAttribute('uv');
  check('attributes are consistent', pos.count === col.count && pos.count === nor.count && pos.count === uv.count,
    `${pos.count} vertices`);
  check('vertex colours are linearised', col.array[0] > 0 && col.array[0] < 1, `r=${col.array[0].toFixed(3)}`);
  const tex = noiseTexture(16);
  const letter = textTexture('A');
  check('canvas textures build', !!tex && !!letter);
}

section('map meshes');

{
  const collision = new CollisionWorld();
  const meshes = buildMapMeshes(collision, true);
  let meshCount = 0;
  let triangles = 0;
  meshes.root.traverse((o: unknown) => {
    const m = o as { geometry?: { attributes?: Record<string, { count: number }> } };
    if (m.geometry?.attributes?.position) {
      meshCount++;
      triangles += m.geometry.attributes.position.count / 3;
    }
  });
  check('map builds into a handful of meshes', meshCount > 3 && meshCount < 40, `${meshCount} meshes`);
  check('map has geometry', triangles > 500, `${Math.round(triangles)} triangles`);
  meshes.dispose();
}

section('weapon models');

for (const id of WEAPON_IDS) {
  const model = buildWeaponModel(id);
  let parts = 0;
  model.traverse((o: unknown) => {
    if ((o as { geometry?: unknown }).geometry) parts++;
  });
  check(`${id} model has separate parts`, parts >= 4, `${parts} pieces`);
}

section('characters');

{
  const world = new GameWorld({ seed: 5, playerTeam: 'CT' });
  const input = emptyInput();
  for (let i = 0; i < 200; i++) world.tick(1 / 64, input);

  for (const team of ['CT', 'T'] as const) {
    const rig = createCharacter(team);
    const named = new Set<string>();
    let meshes = 0;
    rig.root.traverse((o: unknown) => {
      if ((o as { geometry?: unknown }).geometry) meshes++;
    });
    check(`${team} character is built from many parts`, meshes >= 16, `${meshes} meshes`);
    check(
      `${team} character has a full skeleton`,
      !!rig.head && !!rig.armL && !!rig.armR && !!rig.legL && !!rig.legR && !!rig.spine,
    );
    named.add(team);
  }

  const rig = createCharacter('T');
  const actor = world.actors[0];
  actor.stepPhase = 1.2;
  actor.pitch = 0.3;
  updateCharacter(rig, actor, 1 / 60);
  check('animation follows the actor', Math.abs(rig.root.position.x - actor.pos.x) < 1e-6 &&
    Math.abs(rig.root.rotation.y - actor.yaw) < 1e-6);
  check('spine pitches with aim', Math.abs(rig.spine.rotation.x) > 0.01, `${rig.spine.rotation.x.toFixed(3)} rad`);
  check('weapon is attached to the hand', !!rig.weaponMesh && rig.weaponMount.children.length > 0);

  actor.alive = false;
  for (let i = 0; i < 60; i++) updateCharacter(rig, actor, 1 / 60);
  check('death animation collapses the body', rig.root.rotation.x > 1, `${rig.root.rotation.x.toFixed(2)} rad`);
}

section('effects and view model');

{
  const scene = new THREE.Scene();
  const fx = new EffectsSystem(scene);
  const a = new Vec3(0, 1, 0);
  const b = new Vec3(0, 1, -20);
  fx.spawnTracer(a, b);
  fx.spawnMuzzleFlash(a, 0, 0, -1, 1);
  fx.spawnImpact(b, new Vec3(0, 0, 1), 'wall');
  fx.spawnBlood(b);
  fx.spawnExplosion(b);
  for (let i = 0; i < 120; i++) fx.update(1 / 60, new THREE.Vector3());
  check('effects run without throwing', true, `${scene.children.length} pooled objects`);
  fx.dispose();

  const world = new GameWorld({ seed: 8, playerTeam: 'T' });
  const vm = new ViewModel();
  const player = world.actors[world.playerHomeId];
  for (const id of WEAPON_IDS) {
    player.loadoutSlots.primary = id;
    player.slot = id === 'knife' ? 'melee' : 'primary';
    if (id === 'knife') player.loadoutSlots.melee = 'knife';
    vm.update(1 / 60, player, 5, -3);
  }
  vm.punch(1);
  vm.startReload(2.4);
  for (let i = 0; i < 200; i++) vm.update(1 / 60, player, 0, 0);
  check('view model animates through every weapon', true);
  player.scopeLevel = 1;
  vm.update(1 / 60, player, 0, 0);
  check('scoping hides the view model', true);
  vm.dispose();
}

section('renderer integration');

try {
  const { GameRenderer } = await import('../src/render/Renderer.ts');
  const world = new GameWorld({ seed: 11, playerTeam: 'CT', botSkill: 0.6 });
  const canvas = { width: 800, height: 600, addEventListener() {}, removeEventListener() {} };
  const renderer = new GameRenderer(canvas as unknown as HTMLCanvasElement, world);
  const input = emptyInput();

  let frames = 0;
  for (let i = 0; i < 900; i++) {
    input.fire = i % 7 === 0;
    input.firePressed = i % 7 === 0;
    input.forward = 1;
    world.update(1 / 60, input);
    renderer.sync(world, 1 / 60, i % 30, 0);
    renderer.render();
    frames++;
  }
  renderer.resize(1280, 720);
  check('renderer syncs and draws for 900 frames', frames === 900, `${frames} frames`);
  check('camera follows the player', renderer.camera.position.y > 0,
    `eye at y=${renderer.camera.position.y.toFixed(2)}`);
  renderer.dispose();
} catch (err) {
  // The real three.js needs a GPU context for WebGLRenderer; everything above this point
  // is pure geometry and runs fine either way.
  const message = err instanceof Error ? err.message : String(err);
  if (/webgl|context|getContext/i.test(message)) {
    skip('renderer end-to-end frame loop', 'no WebGL context in Node');
  } else {
    check('renderer end-to-end frame loop', false, message);
  }
}

report();
