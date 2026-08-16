// ---- 武器数据系统：单一数据源，战斗/渲染/AI 全部读这里 ----
import type { WeaponDef, WeaponId, Team } from './types';

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  knife: {
    id: 'knife', name: '匕首', killName: '匕首', slot: 3, auto: true,
    rpm: 90, mag: 1, reserve: 0, damage: 40, range: 1.9,
    recoilPitch: 0, recoilYaw: 0, bloomPerShot: 0, bloomMax: 0, bloomRecovery: 0,
    baseSpread: 0, moveSpread: 0, crouchSpreadMul: 1,
    reloadTime: 0, deployTime: 0.25, moveSpeedMul: 1.15,
    zoomFovs: [], zoomOnly: false, zoomSpread: 0, price: 0, team: 'both',
  },
  glock: {
    id: 'glock', name: 'Glock-18', killName: 'Glock', slot: 2, auto: false,
    rpm: 400, mag: 20, reserve: 120, damage: 30, range: 0,
    recoilPitch: 0.9, recoilYaw: 0.5, bloomPerShot: 0.0035, bloomMax: 0.05, bloomRecovery: 0.14,
    baseSpread: 0.006, moveSpread: 0.011, crouchSpreadMul: 0.8,
    reloadTime: 2.2, deployTime: 0.6, moveSpeedMul: 1.0,
    zoomFovs: [], zoomOnly: false, zoomSpread: 0, price: 200, team: 'both',
  },
  usp: {
    id: 'usp', name: 'USP-S', killName: 'USP', slot: 2, auto: false,
    rpm: 352, mag: 12, reserve: 24, damage: 34, range: 0,
    recoilPitch: 0.8, recoilYaw: 0.4, bloomPerShot: 0.003, bloomMax: 0.045, bloomRecovery: 0.15,
    baseSpread: 0.005, moveSpread: 0.010, crouchSpreadMul: 0.8,
    reloadTime: 2.2, deployTime: 0.6, moveSpeedMul: 1.0,
    zoomFovs: [], zoomOnly: false, zoomSpread: 0, price: 200, team: 'both',
  },
  deagle: {
    id: 'deagle', name: '沙漠之鹰', killName: '沙鹰', slot: 2, auto: false,
    rpm: 267, mag: 7, reserve: 35, damage: 52, range: 0,
    recoilPitch: 2.2, recoilYaw: 0.7, bloomPerShot: 0.012, bloomMax: 0.07, bloomRecovery: 0.10,
    baseSpread: 0.009, moveSpread: 0.018, crouchSpreadMul: 0.85,
    reloadTime: 2.3, deployTime: 0.7, moveSpeedMul: 0.97,
    zoomFovs: [], zoomOnly: false, zoomSpread: 0, price: 700, team: 'both',
  },
  ak47: {
    id: 'ak47', name: 'AK-47', killName: 'AK-47', slot: 1, auto: true,
    rpm: 600, mag: 30, reserve: 90, damage: 36, range: 0,
    recoilPitch: 1.15, recoilYaw: 0.55, bloomPerShot: 0.0042, bloomMax: 0.075, bloomRecovery: 0.09,
    baseSpread: 0.004, moveSpread: 0.010, crouchSpreadMul: 0.75,
    reloadTime: 2.5, deployTime: 0.9, moveSpeedMul: 0.94,
    zoomFovs: [], zoomOnly: false, zoomSpread: 0, price: 2700, team: 'T',
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', killName: 'M4A4', slot: 1, auto: true,
    rpm: 666, mag: 30, reserve: 90, damage: 33, range: 0,
    recoilPitch: 0.7, recoilYaw: 0.35, bloomPerShot: 0.0035, bloomMax: 0.06, bloomRecovery: 0.10,
    baseSpread: 0.0035, moveSpread: 0.009, crouchSpreadMul: 0.75,
    reloadTime: 3.0, deployTime: 0.9, moveSpeedMul: 0.96,
    zoomFovs: [], zoomOnly: false, zoomSpread: 0, price: 3100, team: 'CT',
  },
  awp: {
    id: 'awp', name: 'AWP', killName: 'AWP', slot: 1, auto: false,
    rpm: 41, mag: 5, reserve: 30, damage: 115, range: 0,
    recoilPitch: 5.0, recoilYaw: 0.8, bloomPerShot: 0.06, bloomMax: 0.3, bloomRecovery: 0.05,
    baseSpread: 0.09, moveSpread: 0.12, crouchSpreadMul: 0.9,
    reloadTime: 3.6, deployTime: 1.1, moveSpeedMul: 0.9,
    zoomFovs: [45, 14], zoomOnly: true, zoomSpread: 0.0012,
    price: 4750, team: 'both',
  },
  c4: {
    id: 'c4', name: 'C4 炸弹', killName: 'C4', slot: 4, auto: false,
    rpm: 0, mag: 1, reserve: 0, damage: 0, range: 0,
    recoilPitch: 0, recoilYaw: 0, bloomPerShot: 0, bloomMax: 0, bloomRecovery: 0,
    baseSpread: 0, moveSpread: 0, crouchSpreadMul: 1,
    reloadTime: 0, deployTime: 0.5, moveSpeedMul: 1.0,
    zoomFovs: [], zoomOnly: false, zoomSpread: 0, price: 0, team: 'both',
  },
};

export const DEFAULT_PISTOL: Record<Team, WeaponId> = { T: 'glock', CT: 'usp' };
export const TEAM_RIFLE: Record<Team, WeaponId> = { T: 'ak47', CT: 'm4a4' };

export interface BuyItem {
  id: string;
  label: string;
  price: number;
  kind: 'weapon' | 'armor';
  weapon?: WeaponId;
}

export const BUY_ITEMS: BuyItem[] = [
  { id: 'ak47', label: 'AK-47', price: 2700, kind: 'weapon', weapon: 'ak47' },
  { id: 'm4a4', label: 'M4A4', price: 3100, kind: 'weapon', weapon: 'm4a4' },
  { id: 'awp', label: 'AWP', price: 4750, kind: 'weapon', weapon: 'awp' },
  { id: 'deagle', label: '沙漠之鹰', price: 700, kind: 'weapon', weapon: 'deagle' },
  { id: 'usp', label: 'USP-S', price: 200, kind: 'weapon', weapon: 'usp' },
  { id: 'glock', label: 'Glock-18', price: 200, kind: 'weapon', weapon: 'glock' },
  { id: 'armor', label: '护甲 + 头盔', price: 1000, kind: 'armor' },
];

export const BOT_T_NAMES = ['Viper', 'Mamba', 'Fang', 'Rook', 'Cobra'];
export const BOT_CT_NAMES = ['Eagle', 'Wolf', 'Talon', 'Hawk', 'Blitz'];
