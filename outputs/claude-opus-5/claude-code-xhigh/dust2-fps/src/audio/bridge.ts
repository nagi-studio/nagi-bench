/**
 * 事件 -> 声音。把引擎事件翻译成程序化音效，并维护 3D 听者位置。
 */

import { anglesToDir, v3 } from '../core/math.ts';
import type { GameEngine } from '../game/engine.ts';
import type { GameEvent } from '../game/events.ts';
import { audio } from './audio.ts';

const dir = v3();

export function updateAudioListener(engine: GameEngine): void {
  const view = engine.viewActor;
  if (!view) return;
  anglesToDir(dir, view.yaw + view.punchYaw, view.pitch + view.punchPitch);
  audio.updateListener(
    view.pos.x,
    view.pos.y + view.eyeHeight,
    view.pos.z,
    dir.x,
    dir.y,
    dir.z,
  );
}

export function consumeAudio(events: GameEvent[], engine: GameEngine): void {
  const viewId = engine.viewActor?.id ?? -1;
  const myTeam = engine.viewActor?.team;

  for (const e of events) {
    switch (e.type) {
      case 'shot':
        audio.shot(e.weapon, [e.x, e.y, e.z], e.actorId === viewId);
        break;
      case 'impact':
        audio.impact(e.surface, [e.x, e.y, e.z]);
        break;
      case 'hit': {
        // 自己打中别人 -> 命中反馈音；自己被打中 -> 闷哼
        if (e.attackerId === viewId) audio.hitMarker(e.headshot);
        if (e.victimId === viewId) audio.hurt();
        break;
      }
      case 'kill': {
        if (e.attackerId === viewId) audio.kill(e.headshot);
        break;
      }
      case 'reload':
        audio.reload(e.weapon, [e.x, e.y, e.z], e.actorId === viewId);
        break;
      case 'empty':
        if (e.actorId === viewId) audio.emptyClick();
        break;
      case 'switch':
        if (e.actorId === viewId) audio.switchWeapon();
        break;
      case 'scope':
        if (e.actorId === viewId) audio.scope(e.on);
        break;
      case 'footstep':
        // 自己的脚步小声一点，别人的正常
        audio.footstep(e.surface, [e.x, e.y, e.z], e.actorId === viewId);
        break;
      case 'land':
        audio.land([e.x, e.y, e.z], e.actorId === viewId, e.hard);
        break;
      case 'bomb':
        switch (e.kind) {
          case 'planted':
            audio.bombPlant([e.x, e.y, e.z]);
            break;
          case 'beep':
            audio.bombBeep([e.x, e.y, e.z], engine.bomb.timer < 10);
            break;
          case 'defuseStart':
            audio.bombDefuse([e.x, e.y, e.z], false);
            break;
          case 'defused':
            audio.bombDefuse([e.x, e.y, e.z], true);
            break;
          case 'exploded':
            audio.explosion([e.x, e.y, e.z]);
            break;
          default:
            break;
        }
        break;
      case 'round':
        if (e.kind === 'live') audio.roundStart();
        else if (e.kind === 'end') audio.roundEnd(e.winner === myTeam);
        break;
      default:
        break;
    }
  }
}
