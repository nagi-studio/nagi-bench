// Development-only browser tests. TypeScript private members are intentionally
// accessed here to exercise authoritative subsystems without UI or real-time waits.
import * as THREE from 'three';
import { GameEngine } from '../src/game/engine.ts';
import { COLS, ROUTES, SITES } from '../src/game/map.ts';

const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass: !!pass, detail });
let engine;
const originalRandom = Math.random;
let seed = 7391;
Math.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
try {
  const e = engine = new GameEngine(document.querySelector('#viewport'), () => {});
  cancelAnimationFrame(e.frameId);
  const reset = () => {
    e.mode = 'playing'; e.locked = false; e.settings.team = 'T'; e.settings.pistol = true;
    e.settings.primary = 'ak'; e.settings.secondary = 'glock'; e.playerId = 0; e.round = 1; e.time = 0;
    e.newRound(); e.keys.clear();
  };
  reset();
  check('5v5 队伍人数', e.actors.length === 10 && e.actors.filter(a => a.team === 'T').length === 5);
  check('手枪局全员默认手枪 / 无主武器 / 无护甲', e.actors.every(a => !a.inventory.primary && a.armor === 0 && a.inventory.secondary.id === (a.team === 'T' ? 'glock' : 'usp')));

  const nav = e.map.nav, seen = new Set(), queue = [nav.findIndex(v => v)]; seen.add(queue[0]);
  for (let q = 0; q < queue.length; q++) {
    const cur = queue[q];
    for (const d of [-1, 1, -COLS, COLS]) {
      const n = cur + d;
      if (n < 0 || n >= nav.length || !nav[n] || seen.has(n) || Math.abs(n % COLS - cur % COLS) > 1) continue;
      seen.add(n); queue.push(n);
    }
  }
  check('所有可站立网格连通', seen.size === nav.reduce((a, b) => a + b, 0), `${seen.size} 个网格`);
  for (const [name, route] of Object.entries(ROUTES)) {
    let from = new THREE.Vector3(0, 0, 40), valid = true;
    for (const [x, z] of route) {
      const path = e.navigator.find(from, new THREE.Vector3(x, 0, z));
      if (!path.length) valid = false;
      for (const p of path) { if (!e.map.segmentClear(from, p, .36)) valid = false; from = p; }
    }
    check(`A* 实际碰撞可通行路径：${name}`, valid);
  }
  const mid = new THREE.Vector3(0, 0, -7); e.map.move(mid, 0, -10);
  check('中门中央开口可通过', mid.z < -16);
  const wall = new THREE.Vector3(50, 0, 0); e.map.move(wall, 20, 0);
  check('大步移动不能穿墙', wall.x < 52);
  const box = new THREE.Vector3(33, 0, -29); e.map.move(box, 0, -8);
  check('箱体阻挡实体', box.z > -31.5);
  e.keys.add('Space'); e.movePlayer(e.player, 1 / 60); e.keys.clear();
  let highest = 0;
  for (let i = 0; i < 120; i++) { e.gravity(e.player, 1 / 60); highest = Math.max(highest, e.player.pos.y); }
  check('跳跃、重力与落地支撑', highest > 1.25 && e.player.grounded && e.player.pos.y === 0);

  reset();
  const p = e.player, victim = e.actors[5]; p.pos.set(0, 0, 42); victim.pos.set(0, 0, 35); p.yaw = 0; victim.yaw = Math.PI;
  e.present(0); e.scene.updateMatrixWorld(true);
  const ray = new THREE.Raycaster(), origin = p.pos.clone().add(new THREE.Vector3(0, 1.55, 0));
  for (const [zone, xyz] of [['head', [0, 1.65, 35]], ['chest', [0, 1.24, 35]], ['abdomen', [0, .88, 35]], ['arm', [.38, 1.3, 35]], ['leg', [.15, .4, 35]]]) {
    ray.set(origin, new THREE.Vector3(...xyz).sub(origin).normalize()); ray.far = 10;
    const hit = ray.intersectObjects(victim.model.hitboxes, false)[0];
    check(`实际网格命中分区：${zone}`, hit?.object.userData.zone === zone);
  }
  p.pos.set(0, 0, 0); victim.pos.set(16, 0, 0);
  check('墙体阻断 AI 视线', !e.lineOfSight(p, victim));
  p.pos.set(0, 0, 42); victim.pos.set(0, 0, 35);
  victim.hp = 100; victim.armor = 0; e.damage(victim, p, 20, 'chest', 'glock');
  const body = 100 - victim.hp; victim.hp = 100; e.damage(victim, p, 40, 'head', 'glock');
  check('爆头为身体基础伤害两倍', 100 - victim.hp === body * 2);
  victim.hp = 100; victim.armor = 100; e.damage(victim, p, 100, 'chest', 'awp');
  check('护甲吸收并消耗 32% 伤害', Math.abs(victim.hp - 32) < .001 && victim.armor === 68);
  const gun = p.inventory.secondary; gun.ammo = 3; p.reloadUntil = 0; e.reload(p); e.time = p.reloadUntil + .01; e.tick(1 / 60);
  check('换弹正确转移弹匣与备弹', gun.ammo === 20 && gun.reserve === 83);

  reset(); e.player.pos.copy(SITES.A); e.player.moving = false; e.keys.add('KeyE');
  for (let i = 0; i < 195; i++) { e.time += 1 / 60; e.updateBomb(1 / 60); }
  check('玩家持续交互安放 C4', e.bomb.state === 'planted' && e.bomb.site === 'A');
  const ct = e.actors[5]; ct.pos.copy(e.bomb.pos); ct.moving = false; e.playerId = 5; e.settings.team = 'CT';
  for (let i = 0; i < 305; i++) { e.time += 1 / 60; e.updateBomb(1 / 60); }
  check('玩家持续交互拆除并判 CT 胜', e.bomb.state === 'defused' && e.result?.winner === 'CT');

  reset(); e.damage(e.player, e.actors[5], 500, 'chest', 'm4');
  check('持包者阵亡后掉包', e.bomb.state === 'dropped' && e.bomb.carrier === null);
  e.actors[1].pos.copy(e.bomb.pos); e.updateBomb(1 / 60);
  check('其他 T 自动拾包', e.bomb.state === 'carried' && e.bomb.carrier === 1);
  e.actors[1].pos.copy(SITES.B); e.actors[1].moving = false;
  for (let i = 0; i < 195; i++) { e.time += 1 / 60; e.updateBomb(1 / 60); }
  check('AI 自动安放 C4', e.bomb.state === 'planted' && e.bomb.site === 'B');
  e.time = e.bomb.explodeAt + .1; e.updateBomb(1 / 60);
  check('倒计时爆炸并判 T 胜', e.bomb.state === 'exploded' && e.result?.winner === 'T');
  reset(); e.bomb.state = 'planted'; e.bomb.carrier = null; e.bomb.pos.copy(SITES.B); e.bomb.site = 'B'; e.bomb.explodeAt = 100;
  for (const a of e.actors) if (a.team === 'CT') a.alive = a.id === 6;
  const defuser = e.actors[6]; defuser.pos.set(-24, 0, -30); defuser.target = null;
  for (let i = 0; i < 1200 && !e.result; i++) { e.time += 1 / 60; e.updateAI(defuser, 1 / 60); e.updateBomb(1 / 60); }
  check('CT AI 自主寻路穿 B 门并完成拆除', e.bomb.state === 'defused' && e.result?.winner === 'CT');

  reset(); for (const a of e.actors) if (a.team === 'T') a.alive = false;
  e.bomb.state = 'planted'; e.bomb.pos.copy(SITES.A); e.bomb.explodeAt = 40; e.tick(1 / 60);
  check('下包后 T 全灭不能立即判 CT 胜', !e.result);
  reset(); for (const a of e.actors) if (a.team === 'T') a.alive = false; e.tick(1 / 60);
  check('未下包 T 全灭判 CT 胜', e.result?.winner === 'CT');
  reset(); for (const a of e.actors) if (a.team === 'CT') a.alive = false; e.tick(1 / 60);
  check('CT 全灭判 T 胜', e.result?.winner === 'T');
  reset(); e.time = 116; e.tick(1 / 60);
  check('回合超时判 CT 胜', e.result?.winner === 'CT');
  reset(); e.player.alive = false; e.takeover();
  check('阵亡后接管存活队友', e.playerId !== 0 && e.player.alive && e.player.team === 'T');

  reset(); e.settings.pistol = false; e.settings.primary = 'awp'; e.newRound(); e.locked = true;
  document.dispatchEvent(new MouseEvent('mousedown', { button: 2 }));
  for (let i = 0; i < 30; i++) e.present(1 / 60);
  check('AWP 开镜改变实际透视 FOV', e.scoped && e.camera.fov < 25, `FOV ${e.camera.fov.toFixed(2)}°`);
  document.dispatchEvent(new MouseEvent('mousedown', { button: 2 }));
  e.switchSlot('secondary'); check('副武器切换及对应模型', e.player.slot === 'secondary' && e.viewWeapon === 'glock');
  e.switchSlot('melee'); check('近战刀切换及对应模型', e.viewWeapon === 'knife');
  check('全装局全员有主武器与护甲', e.actors.every(a => a.inventory.primary && a.armor === 100));

  reset(); e.playerId = 5; e.settings.team = 'CT'; e.actors[5].pos.set(12, 0, -39);
  let planted = false, kills = false, ended = false; const blocked = [];
  for (let i = 0; i < 7000; i++) {
    e.tick(1 / 60);
    if (e.bomb.state === 'planted') planted = true;
    if (e.feed.length) kills = true;
    if (e.result) { ended = true; break; }
    if (i % 120 === 0) for (const a of e.actors) if (a.alive && e.map.collides(a.pos.x, a.pos.z, .30, a.pos.y)) blocked.push(a.id);
  }
  check('完整 AI 战场产生交战与击杀', kills);
  check('完整 AI 战场能得出胜负', ended, `${e.time.toFixed(1)}s / ${e.result?.winner} / 曾安放：${planted}`);
  check('AI 战场采样无穿墙', blocked.length === 0);
} catch (error) {
  check('测试运行无异常', false, error.stack ?? String(error));
} finally {
  Math.random = originalRandom;
  engine?.dispose();
}
const failed = results.filter(r => !r.pass).length;
document.querySelector('#summary').textContent = `${results.length - failed} / ${results.length} 通过${failed ? `，${failed} 项失败` : ' · ALL CHECKS PASSED'}`;
for (const r of results) {
  const item = document.createElement('li'); item.className = r.pass ? 'pass' : 'fail';
  item.textContent = `${r.pass ? '✓' : '✕'} ${r.name}`;
  if (r.detail) { const detail = document.createElement('small'); detail.textContent = r.detail; item.append(detail); }
  document.querySelector('#results').append(item);
}
window.verificationResults = results;
console.table(results);
