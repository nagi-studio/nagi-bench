// Player controller: turns raw input into the same intent fields the AI uses,
// plus first-person-only concerns (mouse look, scope hold, weapon switching,
// C4 plant/defuse/pickup and a buy-swap for trying the AWP).

import { PLAYER } from './constants';
import { forwardFromYaw, clamp } from './mathUtils';
import { BombState, Team, WeaponId, WeaponSlot } from './types';
import { WEAPONS } from './weapons';
import type { Actor, GameWorld } from './world';

const SENS = 0.0022;
const PITCH_LIMIT = 1.45;

function look(a: Actor, world: GameWorld): void {
  const input = world.input;
  if (!input.locked) return;
  a.yaw -= input.mouseDX * SENS;
  a.pitch -= input.mouseDY * SENS;
  a.pitch = clamp(a.pitch, -PITCH_LIMIT, PITCH_LIMIT);
}

function equipSlot(world: GameWorld, a: Actor, slot: WeaponSlot): void {
  const id = a.weapons.find((w) => WEAPONS[w].slot === slot);
  if (id) world.equip(a, id);
}

function cycleWeapon(world: GameWorld, a: Actor, dir: number): void {
  const idx = a.weapons.indexOf(a.current);
  const next = (idx + (dir > 0 ? 1 : -1) + a.weapons.length) % a.weapons.length;
  world.equip(a, a.weapons[next]);
}

function swapPrimary(world: GameWorld, a: Actor): void {
  const rifle: WeaponId = a.team === Team.T ? 'ak47' : 'm4a4';
  const primaryIdx = a.weapons.findIndex((w) => WEAPONS[w].slot === 'primary');
  if (primaryIdx < 0) return;
  const cur = a.weapons[primaryIdx];
  const next: WeaponId = cur === 'awp' ? rifle : 'awp';
  a.weapons[primaryIdx] = next;
  const def = WEAPONS[next];
  a.ammo[next] = { mag: def.magSize, reserve: def.reserve };
  world.equip(a, next);
}

export function updatePlayer(world: GameWorld, a: Actor, dt: number, canMove: boolean): void {
  const input = world.input;

  if (!a.alive) {
    updateSpectate(world);
    return;
  }

  a.action = 'none';
  look(a, world);

  // movement intents
  if (canMove) {
    const fwd = forwardFromYaw(a.yaw);
    const right = { x: -fwd.z, z: fwd.x };
    let mx = 0, mz = 0;
    if (input.down('KeyW')) { mx += fwd.x; mz += fwd.z; }
    if (input.down('KeyS')) { mx -= fwd.x; mz -= fwd.z; }
    if (input.down('KeyD')) { mx += right.x; mz += right.z; }
    if (input.down('KeyA')) { mx -= right.x; mz -= right.z; }
    a.moveX = mx;
    a.moveZ = mz;
    a.wantRun = !input.down('ShiftLeft');
    if (input.down('Space')) a.wantJump = true;
  } else {
    a.moveX = a.moveZ = 0;
  }

  // weapon selection
  if (input.pressed('Digit1')) equipSlot(world, a, 'primary');
  if (input.pressed('Digit2')) equipSlot(world, a, 'secondary');
  if (input.pressed('Digit3')) equipSlot(world, a, 'melee');
  if (input.wheel !== 0) cycleWeapon(world, a, input.wheel);
  if (input.pressed('KeyB')) swapPrimary(world, a);
  if (input.pressed('KeyR')) world.startReload(a);

  const w = WEAPONS[a.current];

  // scope (hold right mouse on AWP)
  if (w.scoped) {
    const want = input.right;
    if (want !== a.scoped) {
      a.scoped = want;
      world.audio.scope(want);
    }
  } else {
    a.scoped = false;
  }

  // fire
  if (w.automatic) {
    if (input.left) world.fireWeapon(a);
  } else if (input.leftJustPressed) {
    world.fireWeapon(a);
  }

  // bomb interactions
  handleBomb(world, a, canMove);
}

// While dead: cycle through living teammates' viewpoints and take control of one.
function updateSpectate(world: GameWorld): void {
  const input = world.input;
  world.ensureSpectate();
  if (input.leftJustPressed || input.pressed('KeyD')) world.spectateCycle(1);
  if (input.pressed('KeyA')) world.spectateCycle(-1);
  if (input.pressed('KeyF') || input.pressed('Space')) world.takeOver();
}

function handleBomb(world: GameWorld, a: Actor, canMove: boolean): void {
  const input = world.input;
  const bomb = world.bombInfo();
  let hint = '';

  if (a.team === Team.T) {
    if (a.hasBomb && world.isInSite(a) && a.grounded) {
      hint = 'Hold [E] to plant the bomb';
      if (input.down('KeyE')) a.action = 'plant';
    } else if (bomb.state === BombState.Dropped) {
      const d2 = (a.x - bomb.x) ** 2 + (a.z - bomb.z) ** 2;
      if (d2 < 2.4 * 2.4) {
        hint = 'Press [E] to pick up the bomb';
        if (input.down('KeyE')) world.pickupBomb(a);
      }
    } else if (a.hasBomb) {
      hint = 'Bring the bomb to site A or B';
    }
  } else {
    if (bomb.state === BombState.Planted) {
      const d2 = (a.x - bomb.x) ** 2 + (a.z - bomb.z) ** 2;
      if (d2 < 2.3 * 2.3 && a.grounded) {
        hint = 'Hold [E] to defuse';
        if (input.down('KeyE')) a.action = 'defuse';
      }
    }
  }
  world.setHint(hint);
}
