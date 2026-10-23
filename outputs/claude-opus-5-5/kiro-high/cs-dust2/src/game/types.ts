export type Team = 'T' | 'CT';
export type SiteId = 'A' | 'B';

export const otherTeam = (t: Team): Team => (t === 'T' ? 'CT' : 'T');

export const TEAM_LABEL: Record<Team, string> = {
  T: '恐怖分子',
  CT: '反恐精英',
};

/**
 * Per-tick intent produced by either the human input layer or a bot brain.
 * The simulation consumes intents identically for both, so bots obey the same
 * physics, weapon timing, spread and recoil rules as the player.
 */
export interface Intent {
  forward: number; // -1..1
  right: number; // -1..1
  jump: boolean;
  crouch: boolean;
  walk: boolean;
  fire: boolean; // trigger held
  firePressed: boolean; // trigger edge this tick
  altPressed: boolean; // right mouse edge (scope / heavy stab)
  reload: boolean;
  use: boolean; // held: plant / defuse
  switchSlot: 'primary' | 'secondary' | 'melee' | 'last' | 'next' | 'prev' | null;
  dropBomb: boolean;
}

export function emptyIntent(): Intent {
  return {
    forward: 0,
    right: 0,
    jump: false,
    crouch: false,
    walk: false,
    fire: false,
    firePressed: false,
    altPressed: false,
    reload: false,
    use: false,
    switchSlot: null,
    dropBomb: false,
  };
}

export function clearIntent(i: Intent): Intent {
  i.forward = 0;
  i.right = 0;
  i.jump = false;
  i.crouch = false;
  i.walk = false;
  i.fire = false;
  i.firePressed = false;
  i.altPressed = false;
  i.reload = false;
  i.use = false;
  i.switchSlot = null;
  i.dropBomb = false;
  return i;
}
