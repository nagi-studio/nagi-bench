import { DEG } from './math.ts';
import type { Zone } from './mapData.ts';

export const TICK = 1 / 60;
/** bots have a slightly wider "awareness" cone than the human's screen */
export const BOT_FOV_COS = Math.cos(72 * DEG);
export const HUMAN_FOV_COS = Math.cos(58 * DEG);

export const inZone = (z: Zone, x: number, zz: number) => x >= z.x0 && x <= z.x1 && zz >= z.z0 && zz <= z.z1;
