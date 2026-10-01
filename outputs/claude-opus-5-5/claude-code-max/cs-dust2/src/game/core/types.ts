export type Team = 'CT' | 'T';
export type SiteId = 'A' | 'B';
export type Difficulty = 'easy' | 'normal' | 'hard';
export type HitGroup = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';
export type SurfaceMaterial = 'stone' | 'sand' | 'wood' | 'metal' | 'plaster' | 'flesh';

export const otherTeam = (t: Team): Team => (t === 'CT' ? 'T' : 'CT');

export const TEAM_NAME: Record<Team, string> = {
  CT: '反恐精英',
  T: '恐怖分子',
};

export const HITGROUP_NAME: Record<HitGroup, string> = {
  head: '头部',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

/**
 * Damage multipliers per hitbox zone. Chest is the reference "body" damage;
 * a headshot always deals exactly twice the body damage.
 */
export const HITGROUP_MULTIPLIER: Record<HitGroup, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.25,
  arm: 0.8,
  leg: 0.65,
};

export interface MatchSettings {
  playerTeam: Team;
  difficulty: Difficulty;
  firstRound: 'pistol' | 'rifle';
  pistolArmor: 'none' | 'kevlar';
  roundsToWin: number;
  sensitivity: number;
  volume: number;
  playerName: string;
  showFps: boolean;
  /** 'high': sun shadows + up to 1.75x pixel ratio; 'low': no shadows, 1x pixel ratio. */
  quality: 'high' | 'low';
}

export const DEFAULT_SETTINGS: MatchSettings = {
  playerTeam: 'CT',
  difficulty: 'normal',
  firstRound: 'pistol',
  pistolArmor: 'none',
  roundsToWin: 8,
  sensitivity: 2.2,
  volume: 0.7,
  playerName: '玩家',
  showFps: true,
  quality: 'high',
};

export type RoundEndReason =
  | 'ct_eliminated'
  | 't_eliminated'
  | 'bomb_exploded'
  | 'bomb_defused'
  | 'time_expired';

export const ROUND_END_TEXT: Record<RoundEndReason, string> = {
  ct_eliminated: '反恐精英已被全部消灭',
  t_eliminated: '恐怖分子已被全部消灭',
  bomb_exploded: '目标已被摧毁 —— C4 爆炸',
  bomb_defused: '炸弹已被拆除',
  time_expired: '时间耗尽，目标未被摧毁',
};
