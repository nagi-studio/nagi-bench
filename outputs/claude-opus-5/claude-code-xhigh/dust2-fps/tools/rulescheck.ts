/**
 * 规则验收：把需求里写死的规则逐条断言一遍。
 *   - 手枪局形态（无主武器 / 默认手枪 / 手枪局护甲）
 *   - 爆头 = 身体两倍，各部位倍率不同
 *   - 护甲减伤、头盔保护头部
 *   - 武器手感梯度（伤害 / 射速 / 后坐力 / 移速 / 开镜）
 *   - C4：只能在点内安放、掉落可捡、拆除耗时、爆炸伤害
 *   - 四种回合结算方式
 *   - 阵亡后观战与接管
 *
 *   node tools/rulescheck.ts
 */

import { GameEngine, FIXED_DT } from '../src/game/engine.ts';
import { computeDamage } from '../src/game/actor.ts';
import { HITBOX_MULT, WEAPONS } from '../src/game/weapons.ts';
import type { HitboxName } from '../src/game/weapons.ts';
import { BOMB_TIMER, DEFUSE_TIME, PLANT_TIME, siteAt } from '../src/game/bomb.ts';
import { BOMB_SITES } from '../src/map/dust2.ts';

const problems: string[] = [];
function assert(cond: boolean, msg: string) {
  if (!cond) problems.push(msg);
}
function section(name: string) {
  console.log(`\n▸ ${name}`);
}
/** 只有从上一次 ok() 到现在没有新增失败，才打勾。 */
let reported = 0;
function ok(msg: string) {
  if (problems.length > reported) {
    for (const p of problems.slice(reported)) console.log(`  ✗ ${p}`);
    reported = problems.length;
  } else {
    console.log(`  ✓ ${msg}`);
  }
}
/** 强制进入 live 阶段，并把回合时间拉长，避免测试跑到一半回合结束重开。 */
function forceLive(e: GameEngine, seconds = 400) {
  e.phase = 'live';
  e.phaseTimer = seconds;
}

/* ---------------------------------------------------------------- */
section('手枪局');
{
  const e = new GameEngine({ seed: 5, playerTeam: 'CT' });
  e.startMatch();
  assert(e.roundNumber === 1, '第一回合编号应为 1');
  for (const a of e.actors) {
    assert(!a.inventory.primary, `${a.name} 手枪局不该有主武器`);
    assert(!!a.inventory.secondary, `${a.name} 手枪局应该有手枪`);
    assert(!!a.inventory.melee, `${a.name} 应该有刀`);
    assert(a.armor === 0 && !a.helmet, `${a.name} 手枪局护甲配置错误`);
    const expect = a.team === 'T' ? 'glock' : 'usp';
    assert(
      a.inventory.secondary!.id === expect,
      `${a.team} 默认手枪应为 ${expect}，实际 ${a.inventory.secondary!.id}`,
    );
  }
  ok('第一回合：全员只有默认手枪(T=Glock / CT=USP) + 刀，无护甲');

  const e2 = new GameEngine({ seed: 5, pistolOnly: true });
  e2.startMatch();
  // 跳到第二回合
  let guard = 0;
  while (e2.roundNumber < 2 && guard++ < 60000) e2.step(FIXED_DT);
  assert(
    e2.actors.every((a) => !a.inventory.primary),
    '开启"全程手枪局"后，第二回合仍不该有主武器',
  );
  ok('全程手枪局选项在后续回合依然生效');
}

/* ---------------------------------------------------------------- */
section('命中盒与伤害');
{
  const chest = computeDamage('ak47', 'chest', 0, 0, false).damage;
  const head = computeDamage('ak47', 'head', 0, 0, false).damage;
  assert(head === chest * 2, `爆头伤害应为身体两倍：胸 ${chest} / 头 ${head}`);
  ok(`AK 胸部 ${chest} → 头部 ${head}（正好两倍）`);

  const names: HitboxName[] = ['head', 'chest', 'stomach', 'arm', 'leg'];
  const vals = names.map((n) => HITBOX_MULT[n]);
  assert(new Set(vals).size === vals.length, '五个部位的伤害倍率必须互不相同');
  assert(
    HITBOX_MULT.head > HITBOX_MULT.stomach &&
      HITBOX_MULT.stomach > HITBOX_MULT.chest &&
      HITBOX_MULT.chest > HITBOX_MULT.arm &&
      HITBOX_MULT.arm > HITBOX_MULT.leg,
    '部位伤害梯度应为 头 > 腹 > 胸 > 臂 > 腿',
  );
  ok(`部位倍率：${names.map((n) => `${n}=${HITBOX_MULT[n]}`).join(' ')}`);

  // 护甲
  const noArmor = computeDamage('ak47', 'chest', 0, 0, false).damage;
  const armored = computeDamage('ak47', 'chest', 0, 100, false).damage;
  assert(armored < noArmor, '有护甲时躯干伤害必须更低');
  const headNoHelmet = computeDamage('ak47', 'head', 0, 100, false).damage;
  const headHelmet = computeDamage('ak47', 'head', 0, 100, true).damage;
  assert(headHelmet < headNoHelmet, '头盔必须能减少爆头伤害');
  const legArmored = computeDamage('ak47', 'leg', 0, 100, true).damage;
  const legPlain = computeDamage('ak47', 'leg', 0, 0, false).damage;
  assert(legArmored === legPlain, '腿部不受护甲保护');
  ok(`护甲：胸 ${noArmor}→${armored}，爆头(无盔 ${headNoHelmet} / 有盔 ${headHelmet})`);

  // 距离衰减
  const near = computeDamage('glock', 'chest', 5, 0, false).damage;
  const far = computeDamage('glock', 'chest', 50, 0, false).damage;
  assert(far < near, '远距离应有伤害衰减');
  ok(`距离衰减：Glock 5m ${near} → 50m ${far}`);
}

/* ---------------------------------------------------------------- */
section('武器手感梯度');
{
  const ak = WEAPONS.ak47;
  const m4 = WEAPONS.m4a4;
  const awp = WEAPONS.awp;
  const glock = WEAPONS.glock;
  const usp = WEAPONS.usp;
  const deagle = WEAPONS.deagle;

  assert(ak.damage > m4.damage, 'AK 伤害应高于 M4');
  assert(ak.recoilV > m4.recoilV * 1.4, 'AK 的后坐力应明显强于 M4');
  assert(ak.spreadPerShot > m4.spreadPerShot, 'AK 的连发扩散应大于 M4');
  assert(m4.rpm > ak.rpm, 'M4 射速应高于 AK');
  ok(`AK ${ak.damage}伤害/后坐力${ak.recoilV} vs M4 ${m4.damage}伤害/后坐力${m4.recoilV}/${m4.rpm}RPM`);

  assert(awp.damage >= 100, 'AWP 单发应能致命');
  assert(computeDamage('awp', 'chest', 30, 100, true).damage >= 100, 'AWP 对满甲也应一枪毙命');
  assert(awp.rpm < 60, 'AWP 射速应极低');
  assert(!!awp.scope, 'AWP 必须有瞄准镜');
  assert(awp.scope!.fov < 30, 'AWP 开镜应明显拉近视野');
  assert(awp.scope!.moveSpeed < awp.moveSpeed, 'AWP 开镜后移速应更慢');
  ok(`AWP ${awp.damage}伤害 / ${awp.rpm}RPM / 开镜 FOV ${awp.scope!.fov}`);

  const rifleMin = Math.min(ak.damage, m4.damage);
  const pistolMax = Math.max(glock.damage, usp.damage);
  assert(pistolMax < rifleMin, '手枪伤害必须低于步枪');
  assert(
    deagle.damage > pistolMax && deagle.damage < rifleMin,
    `沙鹰伤害应介于手枪(${pistolMax})与步枪(${rifleMin})之间，实际 ${deagle.damage}`,
  );
  assert(deagle.magSize < glock.magSize && deagle.magSize < usp.magSize, '沙鹰弹匣应更小');
  ok(`伤害梯度 Glock ${glock.damage} < USP ${usp.damage} < 沙鹰 ${deagle.damage} < M4 ${m4.damage} < AK ${ak.damage}；沙鹰弹匣 ${deagle.magSize} 发`);

  assert(WEAPONS.knife.slot === 'melee', '必须有近战刀');
  assert(!!WEAPONS.knife.backstab && WEAPONS.knife.backstab > 1, '刀应有背刺加成');
  assert(
    WEAPONS.knife.moveSpeed > ak.moveSpeed && ak.moveSpeed > awp.moveSpeed,
    '移速应为 刀 > 步枪 > AWP',
  );
  ok(`移速梯度：刀 ${WEAPONS.knife.moveSpeed} > AK ${ak.moveSpeed} > AWP ${awp.moveSpeed} m/s`);

  const slots = new Set(Object.values(WEAPONS).map((w) => w.slot));
  assert(
    ['primary', 'secondary', 'melee', 'bomb'].every((s) => slots.has(s as never)),
    '武器槽位应覆盖 主武器/副武器/近战/炸弹',
  );
  ok('槽位体系完整：主武器 / 副武器 / 近战 / C4');
}

/* ---------------------------------------------------------------- */
section('C4 流程');
{
  const e = new GameEngine({ seed: 11, playerTeam: 'T' });
  e.startMatch();
  const carrier = e.actors.find((a) => a.hasBomb)!;
  assert(!!carrier, '回合开始必须有一名 T 携带 C4');
  assert(carrier.team === 'T', 'C4 必须交给 T');
  assert(!!carrier.inventory.bomb, '携包者背包里应有 C4');
  ok(`回合开始 C4 交给了 ${carrier.name}`);

  // 携包者阵亡 -> 掉包 -> 其他 T 可捡
  // 把所有人都从 AI 手里摘下来（谁都不动、不开枪），这样场景是确定的，
  // 不会因为别人打死我们的测试对象而让断言变得莫名其妙。
  e.actors.forEach((a) => (a.bot = false));
  carrier.pos.x = -25;
  carrier.pos.z = 30;
  carrier.health = 0;
  // 手动触发死亡结算
  const before = e.bomb.phase;
  carrier.health = 1;
  const attacker = e.actors.find((a) => a.team === 'CT')!;
  // 用引擎内部的伤害通道（爆炸伤害）打死他
  (e as unknown as { damageActor: (a: unknown, d: number, at: unknown) => void }).damageActor(
    carrier,
    50,
    attacker,
  );
  assert(before === 'carried' && e.bomb.phase === 'dropped', '携包者阵亡后 C4 应该掉落');
  assert(
    Math.abs(e.bomb.pos.x - (-25)) < 0.001 && Math.abs(e.bomb.pos.z - 30) < 0.001,
    'C4 应掉在阵亡位置',
  );
  ok('携包者阵亡 → C4 掉落在原地');

  // 让另一个 T 走过去捡。注意要把他从 AI 手里接管过来，
  // 否则 updateBot 每帧都会重置 intent（bot 有自己的战术分配）。
  const other = e.actors.find((a) => a.team === 'T' && a.alive)!;
  other.bot = false;
  other.pos.x = e.bomb.pos.x;
  other.pos.z = e.bomb.pos.z;
  other.pos.y = e.bomb.pos.y;
  forceLive(e);
  e.step(FIXED_DT);
  assert(e.bomb.phase === 'carried' && other.hasBomb, '其他 T 走到掉落点应能捡起 C4');
  ok(`${other.name} 捡起了掉落的 C4`);

  // 只能在炸弹点内安放
  const outside = siteAt(other.pos.x, other.pos.z);
  assert(outside === null, '测试前提：当前位置不在炸弹点内');
  other.intent.use = true;
  for (let i = 0; i < 300; i++) {
    other.intent.use = true;
    e.step(FIXED_DT);
  }
  assert(e.bomb.phase === 'carried', '点外按 E 不应该能安放');
  ok('炸弹点之外无法安放');

  // 进点安放
  assert(other.alive && other.hasBomb, '测试前提：携包者仍存活且持包');
  const siteA = BOMB_SITES[0];
  other.pos.x = siteA.plantX;
  other.pos.z = siteA.plantZ;
  other.pos.y = 1.0;
  other.vel.x = 0;
  other.vel.z = 0;
  other.intent.use = true;
  let t = 0;
  for (let i = 0; i < 64 * 6 && e.bomb.phase !== 'planted'; i++) {
    other.intent.use = true;
    e.step(FIXED_DT);
    t += FIXED_DT;
  }
  assert(e.bomb.phase === 'planted', '在 A 点持续按 E 应该能安放成功');
  assert(t >= PLANT_TIME - 0.2, `安放耗时应约为 ${PLANT_TIME}s，实际 ${t.toFixed(2)}s`);
  assert(e.bomb.site === 'A', '应记录安放在 A 点');
  assert(Math.abs(e.bomb.timer - BOMB_TIMER) < 1, '安放后应开始倒计时');
  ok(`在 A 点安放成功，耗时 ${t.toFixed(2)}s，倒计时 ${BOMB_TIMER}s`);

  // 拆包
  const ct = e.actors.find((a) => a.team === 'CT' && a.alive)!;
  ct.pos.x = e.bomb.pos.x;
  ct.pos.z = e.bomb.pos.z;
  ct.pos.y = e.bomb.pos.y;
  ct.bot = false;
  let dt2 = 0;
  for (let i = 0; i < 64 * 12 && e.bomb.phase === 'planted'; i++) {
    ct.intent.use = true;
    ct.vel.x = 0;
    ct.vel.z = 0;
    e.step(FIXED_DT);
    dt2 += FIXED_DT;
  }
  assert(e.bomb.phase === 'defused', 'CT 站在 C4 上持续按 E 应该能拆除');
  assert(dt2 >= DEFUSE_TIME - 0.3, `拆除耗时应约为 ${DEFUSE_TIME}s，实际 ${dt2.toFixed(2)}s`);
  ok(`CT 拆包成功，耗时 ${dt2.toFixed(2)}s`);
}

/* ---------------------------------------------------------------- */
section('回合结算');
{
  // 1. CT 清空 T（未下包）-> CT 胜
  {
    const e = new GameEngine({ seed: 21 });
    e.startMatch();
    e.phase = 'live';
    e.phaseTimer = 100;
    for (const a of e.actors) if (a.team === 'T') a.alive = false;
    e.step(FIXED_DT);
    assert(e.phase === 'over' && e.lastWinner === 'CT', '消灭所有 T 应判 CT 胜');
    ok(`消灭所有 T → CT 胜（${e.lastReason}）`);
  }
  // 2. T 清空 CT -> T 胜
  {
    const e = new GameEngine({ seed: 22 });
    e.startMatch();
    e.phase = 'live';
    e.phaseTimer = 100;
    for (const a of e.actors) if (a.team === 'CT') a.alive = false;
    e.step(FIXED_DT);
    assert(e.phase === 'over' && e.lastWinner === 'T', '消灭所有 CT 应判 T 胜');
    ok(`消灭所有 CT → T 胜（${e.lastReason}）`);
  }
  // 3. 时间到未下包 -> CT 胜
  {
    const e = new GameEngine({ seed: 23 });
    e.startMatch();
    e.phase = 'live';
    e.phaseTimer = 0.01;
    e.step(FIXED_DT);
    assert(e.phase === 'over' && e.lastWinner === 'CT', '时间到未下包应判 CT 胜');
    ok(`时间到未安放 → CT 胜（${e.lastReason}）`);
  }
  // 4. 炸弹爆炸 -> T 胜，且附近的人会被炸死
  {
    const e = new GameEngine({ seed: 24 });
    e.startMatch();
    e.phase = 'live';
    e.phaseTimer = 100;
    e.bomb.phase = 'planted';
    e.bomb.site = 'A';
    e.bomb.pos.x = BOMB_SITES[0].plantX;
    e.bomb.pos.z = BOMB_SITES[0].plantZ;
    e.bomb.pos.y = 1;
    e.bomb.timer = 0.005; // 小于一个物理步，一步之内必然爆
    const victim = e.actors.find((a) => a.team === 'CT')!;
    victim.pos.x = e.bomb.pos.x + 1;
    victim.pos.z = e.bomb.pos.z;
    victim.pos.y = 1;
    const faraway = e.actors.find((a) => a.team === 'CT' && a !== victim)!;
    faraway.pos.x = e.bomb.pos.x + 60;
    e.step(FIXED_DT);
    assert(e.bomb.phase === 'exploded', '倒计时结束应爆炸');
    assert(!victim.alive, '爆心附近的人应被炸死');
    assert(faraway.alive, '远处的人不应被炸死');
    e.step(FIXED_DT);
    assert(e.lastWinner === 'T', '炸弹爆炸应判 T 胜');
    ok(`炸弹爆炸 → T 胜（${e.lastReason}），爆炸有范围伤害`);
  }
  // 5. 拆包 -> CT 胜
  {
    const e = new GameEngine({ seed: 25 });
    e.startMatch();
    e.phase = 'live';
    e.phaseTimer = 100;
    e.bomb.phase = 'defused';
    e.step(FIXED_DT);
    assert(e.lastWinner === 'CT', '拆包成功应判 CT 胜');
    ok(`成功拆包 → CT 胜（${e.lastReason}）`);
  }
  // 6. 已下包时清空 CT 也算 T 胜；已下包时清空 T 不结束回合
  {
    const e = new GameEngine({ seed: 26 });
    e.startMatch();
    e.phase = 'live';
    e.phaseTimer = 100;
    e.bomb.phase = 'planted';
    e.bomb.timer = 30;
    for (const a of e.actors) if (a.team === 'T') a.alive = false;
    e.step(FIXED_DT);
    assert(e.phase === 'live', '已下包的情况下 T 全灭不应立刻结束回合');
    ok('已下包后 T 全灭，回合继续（CT 还得去拆）');
  }
}

/* ---------------------------------------------------------------- */
section('阵亡观战与接管');
{
  const e = new GameEngine({ seed: 31, playerTeam: 'CT' });
  e.startMatch();
  const me = e.localActor!;
  assert(!me.bot, '玩家角色初始应由玩家操控');
  me.alive = false;
  const view1 = e.viewActor!;
  assert(view1.id !== me.id && view1.alive, '阵亡后视角应切到存活队友');
  assert(view1.team === me.team, '只能观战己方队友');
  e.spectateNext(1);
  const view2 = e.viewActor!;
  assert(view2.id !== view1.id, '空格应能切换到下一个队友');
  const took = e.takeControl();
  assert(took, '应该能接管当前观战的队友');
  assert(e.localActorId === view2.id, '接管后本地角色应变成该队友');
  assert(!view2.bot, '被接管的 bot 应交给玩家');
  assert(me.bot, '原来的角色应交还给 AI');
  ok(`阵亡 → 观战 ${view1.name} → 切换到 ${view2.name} → 接管成功`);
}

/* ---------------------------------------------------------------- */
section('5v5 编制');
{
  const e = new GameEngine({ seed: 41, playerTeam: 'CT' });
  e.startMatch();
  assert(e.actors.length === 10, '场上应有 10 人');
  assert(e.teamActors('T').length === 5 && e.teamActors('CT').length === 5, '双方各 5 人');
  const players = e.actors.filter((a) => !a.bot);
  assert(players.length === 1, '应恰好有一个玩家操控的角色');
  assert(e.actors.filter((a) => a.ai).length === 10, '所有角色都应有 AI 状态（便于接管/交还）');
  ok('1 名玩家 + 4 名 AI 队友 vs 5 名 AI 敌人');
}

console.log('');
if (problems.length) {
  console.log(`✗ 规则验收失败 ${problems.length} 条:`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
console.log('✓ 规则验收全部通过');
